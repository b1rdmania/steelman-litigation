"""Stage 2 — Evidence Inspector with three parallel sub-agents."""

import asyncio

from .base import BaseAgent
from ..config import EVIDENCE_MODEL, SONNET_TIMEOUT


def _evidence_block(evidence: list[dict], max_chars: int = 1500) -> str:
    if not evidence:
        return "None uploaded."
    lines = []
    for e in evidence:
        preview = (e.get("extracted_text") or "")[:max_chars]
        lines.append(
            f"- [{e.get('upload_type', 'document')}] {e.get('filename', '')} "
            f"({e.get('label') or 'no label'}):\n  {preview}"
        )
    return "\n".join(lines)


class _EvidenceSubAgent(BaseAgent):
    """Shared shape — sub-agents differ only in id and prompt."""
    stage = "evidence"
    model = EVIDENCE_MODEL
    timeout = SONNET_TIMEOUT
    max_tokens = 3072

    def build_user_prompt(self, input_data: dict) -> str:
        return f"""CASE: {input_data.get('title', 'untitled')}

PARTY POSITION:
{input_data.get('party_position', '')}

CURRENT STRATEGY:
{input_data.get('current_strategy', '')}

EVIDENCE ({len(input_data.get('evidence', []))} items):
{_evidence_block(input_data.get('evidence', []))}

Produce your evidence-flag JSON now."""


class DocumentSubAgent(_EvidenceSubAgent):
    agent_id = "evidence_inspector"
    sub_agent_id = "document_subagent"

    def build_system_prompt(self) -> str:
        return """You are a document sub-agent inside the Premotion evidence inspector pipeline.
Your remit is narrow: extract the factual claims each individual document is making, and flag claims that are weak, ambiguous, or unsupported by the document itself.

You do NOT cross-reference between documents — that is another sub-agent's job. You read each document on its own terms and flag what it actually says versus what the party is claiming it says.

Return ONLY valid JSON:
{
  "evidence_flags": [
    {
      "source_document": "filename or label",
      "flag": "What's wrong, ambiguous, or weaker than the party thinks",
      "severity": "high|medium|low",
      "category": "document"
    }
  ]
}"""


class CrossReferenceSubAgent(_EvidenceSubAgent):
    agent_id = "evidence_inspector"
    sub_agent_id = "cross_reference_subagent"

    def build_system_prompt(self) -> str:
        return """You are a cross-reference sub-agent inside the Premotion evidence inspector pipeline.
Your remit: find inconsistencies BETWEEN documents. Two exhibits that contradict each other. A witness statement that says one thing and an email that says another. A pleading that asserts a fact one document supports and another undermines.

You do NOT critique single documents in isolation — that is the document sub-agent's job. You only look at the relationship between exhibits.

Return ONLY valid JSON:
{
  "evidence_flags": [
    {
      "source_documents": ["doc A filename", "doc B filename"],
      "flag": "The inconsistency, stated specifically",
      "severity": "high|medium|low",
      "category": "cross_reference"
    }
  ]
}"""


class ChronologySubAgent(_EvidenceSubAgent):
    agent_id = "evidence_inspector"
    sub_agent_id = "chronology_subagent"

    def build_system_prompt(self) -> str:
        return """You are a chronology sub-agent inside the Premotion evidence inspector pipeline.
Your remit: verify timeline coherence. Construct the chronology of events from the evidence and flag any sequence problem — events out of order, dates that don't reconcile with the party's narrative, gaps where documents would be expected, or post-hoc reconstructions presented as contemporaneous.

You do NOT critique the substance of any single document — only its place in the timeline.

Return ONLY valid JSON:
{
  "evidence_flags": [
    {
      "event": "What is alleged to have happened",
      "date": "Date as stated by party or document",
      "flag": "The chronology problem",
      "severity": "high|medium|low",
      "category": "chronology"
    }
  ]
}"""


class EvidenceInspector:
    """Coordinator. Runs three sub-agents in parallel, merges their flags."""

    agent_id = "evidence_inspector"
    stage = "evidence"

    async def run(self, input_data: dict, case_id: str) -> dict:
        sub_agents = [
            DocumentSubAgent(),
            CrossReferenceSubAgent(),
            ChronologySubAgent(),
        ]
        results = await asyncio.gather(
            *[a.execute(input_data, case_id) for a in sub_agents],
            return_exceptions=True,
        )

        merged_flags: list[dict] = []
        sub_results: dict = {}
        for agent, res in zip(sub_agents, results):
            if isinstance(res, Exception):
                sub_results[agent.sub_agent_id] = {"error": str(res), "evidence_flags": []}
                continue
            data = res.data or {}
            flags = data.get("evidence_flags", []) or []
            sub_results[agent.sub_agent_id] = data
            for f in flags:
                f.setdefault("category", agent.sub_agent_id.replace("_subagent", ""))
                merged_flags.append(f)

        partial = any(isinstance(r, Exception) for r in results)
        return {
            "evidence_flags": merged_flags,
            "sub_agent_outputs": sub_results,
            "partial_analysis": partial,
        }
