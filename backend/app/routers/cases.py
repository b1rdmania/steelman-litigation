"""Cases router — full pipeline: intake → 4 stages → brief."""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..agents.optimistic import OptimisticAnalyst
from ..agents.evidence_inspector import EvidenceInspector
from ..agents.premortem import PremortemAdversary
from ..agents.synthesizer import Synthesizer
from ..config import UPLOAD_DIR
from ..database import get_db
from ..services.parser import extract_text


router = APIRouter()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


async def _set_status(case_id: str, status: str) -> None:
    db = await get_db()
    try:
        await db.execute(
            "UPDATE cases SET status = ?, updated_at = ? WHERE id = ?",
            (status, _now(), case_id),
        )
        await db.commit()
    finally:
        await db.close()


async def _store_analysis(
    case_id: str,
    stage: str,
    agent_id: str,
    sub_agent_id: str | None,
    model: str,
    content: dict,
) -> None:
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO analyses
               (id, case_id, stage, agent_id, sub_agent_id, model, content_json,
                tokens_in, tokens_out, duration_ms, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                str(uuid.uuid4()),
                case_id,
                stage,
                agent_id,
                sub_agent_id,
                model,
                json.dumps(content),
                0,
                0,
                0,
                _now(),
            ),
        )
        await db.commit()
    finally:
        await db.close()


@router.post("/api/cases")
async def create_case(
    title: str = Form(...),
    jurisdiction: str = Form("England & Wales"),
    case_type: str = Form("other"),
    party_position_role: str = Form(""),
    party_position: str = Form(...),
    current_strategy: str = Form(...),
    email: str = Form(""),
    files: list[UploadFile] = File(default=[]),
    file_types: list[str] = Form(default=[]),
    file_labels: list[str] = Form(default=[]),
):
    case_id = str(uuid.uuid4())
    intake_id = str(uuid.uuid4())
    now = _now()

    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO cases (id, title, jurisdiction, case_type, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (case_id, title, jurisdiction, case_type, "submitted", now, now),
        )
        await db.execute(
            """INSERT INTO intakes
               (id, case_id, party_position, current_strategy, desired_outcome, email, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (intake_id, case_id, party_position, current_strategy, "", email or "", now),
        )

        # Save evidence files + extract text
        case_upload_dir = UPLOAD_DIR / case_id
        case_upload_dir.mkdir(parents=True, exist_ok=True)
        evidence_records: list[dict] = []
        for idx, upload in enumerate(files or []):
            if upload is None or not upload.filename:
                continue
            safe_name = Path(upload.filename).name
            dest = case_upload_dir / safe_name
            content = await upload.read()
            dest.write_bytes(content)
            upload_type = (file_types[idx] if idx < len(file_types) else "document") or "document"
            label = (file_labels[idx] if idx < len(file_labels) else "") or ""
            try:
                extracted = extract_text(dest)
            except Exception:
                extracted = ""
            ev_id = str(uuid.uuid4())
            await db.execute(
                """INSERT INTO evidence
                   (id, case_id, filename, file_path, upload_type, label, extracted_text, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (ev_id, case_id, safe_name, str(dest), upload_type, label, extracted, now),
            )
            evidence_records.append({
                "id": ev_id,
                "filename": safe_name,
                "upload_type": upload_type,
                "label": label,
                "extracted_text": extracted,
            })

        await db.commit()
    finally:
        await db.close()

    base_input = {
        "title": title,
        "jurisdiction": jurisdiction,
        "case_type": case_type,
        "party_position_role": party_position_role,
        "party_position": party_position,
        "current_strategy": current_strategy,
        "evidence": evidence_records,
    }

    # ---- Stage 1: Optimistic Analyst ----
    await _set_status(case_id, "analysing_optimistic")
    try:
        optimistic_agent = OptimisticAnalyst()
        optimistic_result = await optimistic_agent.execute(base_input, case_id)
        await _store_analysis(
            case_id, "optimistic", "optimistic_analyst", None,
            optimistic_agent.model, optimistic_result.data,
        )
    except Exception as e:
        await _set_status(case_id, "failed")
        raise HTTPException(status_code=500, detail=f"Optimistic stage failed: {e}")

    # ---- Stage 2: Evidence Inspector (3 sub-agents in parallel) ----
    await _set_status(case_id, "analysing_evidence")
    try:
        inspector = EvidenceInspector()
        evidence_findings = await inspector.run(base_input, case_id)
        await _store_analysis(
            case_id, "evidence", "evidence_inspector", None,
            "multi-subagent", evidence_findings,
        )
    except Exception as e:
        await _set_status(case_id, "failed")
        raise HTTPException(status_code=500, detail=f"Evidence stage failed: {e}")

    # ---- Stage 3: Premortem Adversary (4 Opus sub-agents in parallel) ----
    await _set_status(case_id, "analysing_premortem")
    try:
        premortem_input = {
            **base_input,
            "optimistic_case": optimistic_result.data,
            "evidence_flags": evidence_findings.get("evidence_flags", []),
        }
        adversary = PremortemAdversary()
        premortem_findings = await adversary.run(premortem_input, case_id)
        await _store_analysis(
            case_id, "premortem", "premortem_adversary", None,
            "multi-subagent-opus", premortem_findings,
        )
    except Exception as e:
        await _set_status(case_id, "failed")
        raise HTTPException(status_code=500, detail=f"Premortem stage failed: {e}")

    # ---- Stage 4: Synthesizer ----
    await _set_status(case_id, "synthesising")
    try:
        synth_input = {
            **base_input,
            "optimistic_case": optimistic_result.data,
            "evidence_findings": evidence_findings,
            "premortem_findings": premortem_findings,
        }
        synthesizer = Synthesizer()
        brief_result = await synthesizer.execute(synth_input, case_id)
        await _store_analysis(
            case_id, "synthesis", "synthesizer", None,
            synthesizer.model, brief_result.data,
        )
    except Exception as e:
        await _set_status(case_id, "failed")
        raise HTTPException(status_code=500, detail=f"Synthesis stage failed: {e}")

    # ---- Store final brief, flip status ----
    brief_id = str(uuid.uuid4())
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO briefs (id, case_id, content_json, verdict, generated_at)
               VALUES (?, ?, ?, ?, ?)""",
            (
                brief_id,
                case_id,
                json.dumps(brief_result.data),
                brief_result.data.get("verdict"),
                _now(),
            ),
        )
        await db.execute(
            "UPDATE cases SET status = ?, updated_at = ? WHERE id = ?",
            ("brief_ready", _now(), case_id),
        )
        await db.commit()
    finally:
        await db.close()

    return {"case_id": case_id, "status": "brief_ready"}


@router.get("/api/cases/{case_id}")
async def get_case(case_id: str):
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM cases WHERE id = ?", (case_id,))
        case_row = await cursor.fetchone()
        if not case_row:
            raise HTTPException(status_code=404, detail="Case not found")

        cursor = await db.execute(
            "SELECT * FROM intakes WHERE case_id = ? LIMIT 1", (case_id,),
        )
        intake_row = await cursor.fetchone()

        cursor = await db.execute(
            """SELECT * FROM briefs WHERE case_id = ?
               ORDER BY generated_at DESC LIMIT 1""",
            (case_id,),
        )
        brief_row = await cursor.fetchone()

        brief_content = None
        if brief_row:
            try:
                brief_content = json.loads(brief_row["content_json"])
            except Exception:
                brief_content = None

        return {
            "id": case_row["id"],
            "title": case_row["title"],
            "jurisdiction": case_row["jurisdiction"],
            "case_type": case_row["case_type"],
            "status": case_row["status"],
            "created_at": case_row["created_at"],
            "updated_at": case_row["updated_at"],
            "intake": {
                "party_position": intake_row["party_position"] if intake_row else "",
                "current_strategy": intake_row["current_strategy"] if intake_row else "",
                "email": intake_row["email"] if intake_row else "",
            } if intake_row else None,
            "brief": brief_content,
            "generated_at": brief_row["generated_at"] if brief_row else None,
        }
    finally:
        await db.close()
