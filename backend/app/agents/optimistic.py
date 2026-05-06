"""OptimisticAnalyst — Stage 1. The strongest version of the case the evidence supports."""

from .base import BaseAgent
from ..config import OPTIMISTIC_MODEL, SONNET_TIMEOUT


def _evidence_block(evidence: list[dict]) -> str:
    if not evidence:
        return "None uploaded."
    lines = []
    for e in evidence:
        preview = (e.get("extracted_text") or "")[:1200]
        lines.append(
            f"- [{e.get('upload_type', 'document')}] {e.get('filename', '')} "
            f"({e.get('label') or 'no label'}):\n  {preview}"
        )
    return "\n".join(lines)


class OptimisticAnalyst(BaseAgent):
    agent_id = "optimistic_analyst"
    stage = "optimistic"
    model = OPTIMISTIC_MODEL
    timeout = SONNET_TIMEOUT
    max_tokens = 4096

    def build_system_prompt(self) -> str:
        return """You are arguing this matter on behalf of the client. The intake describes their position and current strategy. Read everything carefully and produce the strongest legal case the evidence supports — the version that actually wins. Don't hedge. This is the steelman version of the client's position.

You are not adversarial here. You are the most generous reading of the file. Where the evidence supports the client, say so plainly. Where there is room for a creative legal argument the client has not yet pleaded, identify it. Cite UK case law where relevant.

Return ONLY valid JSON with this shape:
{
  "key_arguments": [
    {"argument": "Stated as a barrister would put it", "supporting_evidence": "The exhibits / facts that support it", "case_law": "Any authority that helps"}
  ],
  "supporting_evidence": [
    {"item": "Document or fact", "weight": "high|medium|low", "what_it_proves": "..."}
  ],
  "expected_counterarguments": [
    "What the other side will most likely run, briefly"
  ],
  "optimistic_outcome": "A 2-3 sentence statement of the realistic best result for the client if this case is run on its strongest reading."
}"""

    def build_user_prompt(self, input_data: dict) -> str:
        return f"""CASE: {input_data.get('title', 'untitled')}
JURISDICTION: {input_data.get('jurisdiction', 'England & Wales')}
CASE TYPE: {input_data.get('case_type', 'other')}
PARTY ROLE: {input_data.get('party_position_role') or 'not specified'}

THE PARTY'S POSITION (their words):
{input_data.get('party_position', '')}

CURRENT STRATEGY:
{input_data.get('current_strategy', '')}

EVIDENCE ({len(input_data.get('evidence', []))} items):
{_evidence_block(input_data.get('evidence', []))}

Produce the optimistic-case JSON now."""
