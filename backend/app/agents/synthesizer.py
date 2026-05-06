"""Stage 4 — Synthesizer. Diffs the optimistic case against the adversarial findings."""

import json

from .base import BaseAgent
from ..config import SYNTHESIS_MODEL, SONNET_TIMEOUT


class Synthesizer(BaseAgent):
    agent_id = "synthesizer"
    stage = "synthesis"
    model = SYNTHESIS_MODEL
    timeout = SONNET_TIMEOUT
    max_tokens = 6144

    def build_system_prompt(self) -> str:
        return """You are producing the final stress-test brief for Steelman Litigation. Compare the optimistic case against the adversarial findings. Identify where they meaningfully disagree — those are the blind spots. Produce a verdict (steelman / strawman / borderline) with reasoning. Be brutal but kind. Solicitors need to act on this.

Verdict guidance:
- "steelman" — the optimistic case substantially survives the premortem. The case is what the client thinks it is. There may be mitigations to action, but the strategy is sound.
- "borderline" — the optimistic case has the narrative but parts of it do not survive contact with the premortem. Recoverable with specific changes (re-pleading, re-framing, additional disclosure, settlement appetite).
- "strawman" — the optimistic case relies on positions the premortem closes off. The case is not what the client thinks it is. The strategy needs material change or the matter needs to settle.

Your output is the brief that lands on a partner's desk. Document-style, document-grade, plain English where possible, technical where required. No emojis, no hedging language ("it could be argued"), no false reassurance.

Return ONLY valid JSON with this exact shape:
{
  "verdict": "steelman|strawman|borderline",
  "verdict_reasoning": "1-2 sentences explaining the verdict",
  "summary": "2-3 paragraphs of plain-English summary of the matter and the stress-test outcome",
  "failure_scenarios": [
    {
      "category": "procedural|substantive|evidentiary|strategic",
      "scenario": "...",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "..."
    }
  ],
  "evidence_inconsistencies": [
    {"claim": "...", "issue": "...", "severity": "high|medium|low"}
  ],
  "blind_spots": [
    "The thing the team is missing, stated specifically"
  ],
  "if_we_lose_this_will_be_why": "One brutal honest sentence — the single most likely reason this case loses if it loses."
}

Re-rank, dedupe, tighten the failure scenarios from the four premortem sub-agents. The synthesizer's job is to produce the brief that reads like one mind — not four sub-agent outputs concatenated."""

    def build_user_prompt(self, input_data: dict) -> str:
        title = input_data.get("title", "untitled")
        jurisdiction = input_data.get("jurisdiction", "England & Wales")
        position = input_data.get("party_position", "")
        strategy = input_data.get("current_strategy", "")
        optimistic = input_data.get("optimistic_case", {})
        evidence = input_data.get("evidence_findings", {})
        premortem = input_data.get("premortem_findings", {})

        return f"""CASE: {title}
JURISDICTION: {jurisdiction}

PARTY POSITION:
{position}

CURRENT STRATEGY:
{strategy}

STAGE 1 — OPTIMISTIC ANALYST OUTPUT:
{json.dumps(optimistic, indent=2)}

STAGE 2 — EVIDENCE INSPECTOR (merged flags from three sub-agents):
{json.dumps(evidence.get('evidence_flags', []), indent=2)}

STAGE 3 — PREMORTEM ADVERSARY (merged failure scenarios from four Opus sub-agents):
{json.dumps(premortem.get('failure_scenarios', []), indent=2)}

Now produce the final stress-test brief JSON. Re-rank failure scenarios across categories, identify blind spots from where the optimistic case and premortem disagree, give a verdict, and write the one brutal sentence."""
