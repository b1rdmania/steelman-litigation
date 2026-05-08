"""Cases router — full pipeline: intake → 4 stages → brief."""

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path

logger = logging.getLogger(__name__)

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

from ..agents.optimistic import OptimisticAnalyst
from ..agents.evidence_inspector import EvidenceInspector
from ..agents.premortem import PremortemAdversary
from ..agents.synthesizer import Synthesizer
from ..config import UPLOAD_DIR
from ..database import get_db
from ..services.parser import extract_text


router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
ALLOWED_MIME = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
}
MAX_FILE_SIZE = 10 * 1024 * 1024   # 10 MB
MAX_FILES = 15


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _safe_get(row, key, default=None):
    """Read a column from an aiosqlite Row without throwing if it's missing
    (e.g. on an older DB before a migration has applied)."""
    try:
        if key in row.keys():
            return row[key]
    except Exception:
        pass
    return default


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


async def _run_pipeline(case_id: str, base_input: dict) -> None:
    """Run all four pipeline stages as a background task."""
    try:
        # Stage 1 — Optimistic Analyst
        await _set_status(case_id, "analysing_optimistic")
        optimistic_agent = OptimisticAnalyst()
        optimistic_result = await optimistic_agent.execute(base_input, case_id)
        await _store_analysis(case_id, "optimistic", "optimistic_analyst", None,
                              optimistic_agent.model, optimistic_result.data)

        # Stage 2 — Evidence Inspector (3 sub-agents in parallel)
        await _set_status(case_id, "analysing_evidence")
        inspector = EvidenceInspector()
        evidence_findings = await inspector.run(base_input, case_id)
        await _store_analysis(case_id, "evidence", "evidence_inspector", None,
                              "multi-subagent", evidence_findings)

        # Stage 3 — Premortem Adversary (4 Opus sub-agents in parallel)
        await _set_status(case_id, "analysing_premortem")
        premortem_input = {
            **base_input,
            "optimistic_case": optimistic_result.data,
            "evidence_flags": evidence_findings.get("evidence_flags", []),
        }
        adversary = PremortemAdversary()
        premortem_findings = await adversary.run(premortem_input, case_id)
        await _store_analysis(case_id, "premortem", "premortem_adversary", None,
                              "multi-subagent-opus", premortem_findings)

        # Stage 4 — Synthesizer
        await _set_status(case_id, "synthesising")
        synth_input = {
            **base_input,
            "optimistic_case": optimistic_result.data,
            "evidence_findings": evidence_findings,
            "premortem_findings": premortem_findings,
        }
        synthesizer = Synthesizer()
        brief_result = await synthesizer.execute(synth_input, case_id)
        await _store_analysis(case_id, "synthesis", "synthesizer", None,
                              synthesizer.model, brief_result.data)

        # Store brief + mark ready
        brief_id = str(uuid.uuid4())
        failed_subagents = list(evidence_findings.get("failed_subagents") or []) \
                         + list(premortem_findings.get("failed_subagents") or [])
        partial = bool(failed_subagents)
        partial_detail = ", ".join(failed_subagents) if failed_subagents else None
        db = await get_db()
        try:
            await db.execute(
                """INSERT INTO briefs (id, case_id, content_json, verdict, generated_at)
                   VALUES (?, ?, ?, ?, ?)""",
                (brief_id, case_id, json.dumps(brief_result.data),
                 brief_result.data.get("verdict"), _now()),
            )
            await db.execute(
                """UPDATE cases
                   SET status = ?, partial_analysis = ?, partial_detail = ?, updated_at = ?
                   WHERE id = ?""",
                ("brief_ready", 1 if partial else 0, partial_detail, _now(), case_id),
            )
            await db.commit()
        finally:
            await db.close()

    except Exception as e:
        # Log the full error for debugging, but never leak it to the client.
        logger.exception("Pipeline failed for case %s", case_id)
        await _set_status(case_id, "failed")
        db = await get_db()
        try:
            await db.execute(
                "UPDATE cases SET error_detail = ?, updated_at = ? WHERE id = ?",
                ("Analysis failed during processing. Please try again.", _now(), case_id),
            )
            await db.commit()
        finally:
            await db.close()


@router.post("/api/cases")
async def create_case(
    background_tasks: BackgroundTasks,
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

        # Validate and save evidence files
        uploads = [f for f in (files or []) if f is not None and f.filename]
        if len(uploads) > MAX_FILES:
            raise HTTPException(status_code=400, detail=f"Maximum {MAX_FILES} files allowed.")
        case_upload_dir = UPLOAD_DIR / case_id
        case_upload_dir.mkdir(parents=True, exist_ok=True)
        evidence_records: list[dict] = []
        for idx, upload in enumerate(uploads):
            ext = Path(upload.filename).suffix.lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise HTTPException(status_code=400, detail=f"File type '{ext}' is not accepted. Upload PDF, DOCX, or TXT.")
            content = await upload.read()
            if len(content) > MAX_FILE_SIZE:
                raise HTTPException(status_code=400, detail=f"'{upload.filename}' exceeds the 10 MB limit.")
            safe_name = Path(upload.filename).name
            dest = case_upload_dir / safe_name
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

    background_tasks.add_task(_run_pipeline, case_id, base_input)
    return {"case_id": case_id, "status": "submitted"}


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
            "partial_analysis": bool(_safe_get(case_row, "partial_analysis")),
            "partial_detail": _safe_get(case_row, "partial_detail"),
            "error_detail": _safe_get(case_row, "error_detail"),
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
