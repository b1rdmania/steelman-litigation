"""Stage 3 — Premortem Adversary. Four parallel Opus sub-agents."""

import asyncio

from .base import BaseAgent
from ..config import PREMORTEM_MODEL, OPUS_TIMEOUT


def _evidence_block(evidence: list[dict], max_chars: int = 1200) -> str:
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


class _PremortemSubAgent(BaseAgent):
    """Shared shape — Opus, premortem framing, category-specific remit."""
    stage = "premortem"
    model = PREMORTEM_MODEL
    timeout = OPUS_TIMEOUT
    max_tokens = 4096
    category: str = "general"

    def build_user_prompt(self, input_data: dict) -> str:
        evidence_flags = input_data.get("evidence_flags", []) or []
        flags_block = "\n".join(
            f"- [{f.get('severity', 'medium')}/{f.get('category', '')}] {f.get('flag', '')}"
            for f in evidence_flags
        ) or "None flagged."

        optimistic = input_data.get("optimistic_case", {}) or {}
        optimistic_args = optimistic.get("key_arguments", []) or []
        optimistic_block = "\n".join(
            f"- {a.get('argument', '')}" for a in optimistic_args
        ) or "(no optimistic case provided)"

        return f"""CASE: {input_data.get('title', 'untitled')}
JURISDICTION: {input_data.get('jurisdiction', 'England & Wales')}
CASE TYPE: {input_data.get('case_type', 'other')}

PARTY POSITION:
{input_data.get('party_position', '')}

CURRENT STRATEGY:
{input_data.get('current_strategy', '')}

OPTIMISTIC CASE (the steelman, what the client thinks they have):
{optimistic_block}

EVIDENCE FLAGS FROM THE EVIDENCE INSPECTOR:
{flags_block}

EVIDENCE ({len(input_data.get('evidence', []))} items):
{_evidence_block(input_data.get('evidence', []))}

It is January 2027. This case has been LOST. Walk back from that loss and identify specifically why — focus only on {self.category} failure modes. Produce your ranked failure scenarios JSON now."""


class ProceduralSubAgent(_PremortemSubAgent):
    agent_id = "premortem_adversary"
    sub_agent_id = "procedural_subagent"
    category = "procedural"

    def build_system_prompt(self) -> str:
        return """It is January 2027. This case has been LOST. You are walking back from that loss to identify specifically why — focus ONLY on procedural failure modes.

You are a senior adversarial litigator with 30 years' experience under the CPR. Your job here is the opposite of balanced. Do not hedge, do not offer the optimistic side, do not soften the language. The case has been lost; you are explaining why.

Procedural failure modes include: filing defects, missed deadlines, jurisdictional defects, pleading defects, disclosure failures, witness statement issues, costs-budgeting failures, applications that should have been made, applications that should not have been made, scope objections that were too late or unparticularised.

Stay strictly within the procedural lane. Substantive law, evidence and strategy are other sub-agents' jobs.

Return ONLY valid JSON:
{
  "failure_scenarios": [
    {
      "category": "procedural",
      "scenario": "Specific procedural failure mode, stated as if it has already happened",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "What the team would need to do now to avoid this specific failure mode"
    }
  ]
}"""


class SubstantiveSubAgent(_PremortemSubAgent):
    agent_id = "premortem_adversary"
    sub_agent_id = "substantive_subagent"
    category = "substantive"

    def build_system_prompt(self) -> str:
        return """It is January 2027. This case has been LOST. You are walking back from that loss to identify specifically why — focus ONLY on substantive legal failure modes.

You are a KC with 30 years at the commercial / employment / public-law bar. Adversarial framing only. The case has been lost; you are explaining why on the law.

Substantive failure modes include: legal grounds that don't sustain the relief sought, statutes that defeat the pleaded case, binding authority running the other way, recent appellate decisions the team missed, doctrinal lines that have moved since the strategy was set, claims pleaded under the wrong legal framework when an alternative framework would have survived.

Stay strictly within substantive law. Procedure, evidence and strategy are other sub-agents' remits.

Return ONLY valid JSON:
{
  "failure_scenarios": [
    {
      "category": "substantive",
      "scenario": "Specific substantive legal failure mode",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "What re-framing or re-pleading would address this"
    }
  ]
}"""


class EvidentiarySubAgent(_PremortemSubAgent):
    agent_id = "premortem_adversary"
    sub_agent_id = "evidentiary_subagent"
    category = "evidentiary"

    def build_system_prompt(self) -> str:
        return """It is January 2027. This case has been LOST. You are walking back from that loss to identify specifically why — focus ONLY on evidentiary failure modes.

You are a senior litigator who has seen many strong-on-paper cases lose at trial because the evidence did not survive cross-examination. Adversarial framing only.

Evidentiary failure modes include: proof problems on key facts, admissibility issues, witness credibility risks, hearsay problems, document authenticity, contemporaneity questions, missing exhibits, unhelpful disclosure, expert evidence that failed Daubert / Civil Evidence Act standards, electronic evidence preservation failures.

Stay strictly within evidence. Procedure, substantive law and strategy are other sub-agents' remits.

Return ONLY valid JSON:
{
  "failure_scenarios": [
    {
      "category": "evidentiary",
      "scenario": "Specific evidentiary failure mode",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "What the evidentiary strategy needs to change"
    }
  ]
}"""


class StrategicSubAgent(_PremortemSubAgent):
    agent_id = "premortem_adversary"
    sub_agent_id = "strategic_subagent"
    category = "strategic"

    def build_system_prompt(self) -> str:
        return """It is January 2027. This case has been LOST. You are walking back from that loss to identify specifically why — focus ONLY on strategic failure modes.

You are a partner who has run litigation strategy for major clients for 25 years. Adversarial framing only.

Strategic failure modes include: tactical errors, posture, escalation timing, settlement timing, the wrong forum, the wrong relief sought, costs exposure mismanaged, board / client appetite mismanaged, the wrong forum for the publicity, settlement windows missed, settlement openings made too early, regulatory exposure not factored in, reputational cost of pursuing not factored in.

Stay strictly within strategy. Procedure, substantive law and evidence are other sub-agents' remits.

Return ONLY valid JSON:
{
  "failure_scenarios": [
    {
      "category": "strategic",
      "scenario": "Specific strategic failure mode",
      "probability": "High|Medium|Low",
      "impact": "High|Medium|Low",
      "mitigation": "What strategic move would address this"
    }
  ]
}"""


class PremortemAdversary:
    """Coordinator. Runs four Opus sub-agents in parallel; merges failure scenarios."""

    agent_id = "premortem_adversary"
    stage = "premortem"

    async def run(self, input_data: dict, case_id: str) -> dict:
        sub_agents = [
            ProceduralSubAgent(),
            SubstantiveSubAgent(),
            EvidentiarySubAgent(),
            StrategicSubAgent(),
        ]
        results = await asyncio.gather(
            *[a.execute(input_data, case_id) for a in sub_agents],
            return_exceptions=True,
        )

        merged: list[dict] = []
        sub_results: dict = {}
        failed: list[str] = []
        for agent, res in zip(sub_agents, results):
            if isinstance(res, Exception):
                sub_results[agent.sub_agent_id] = {"error": str(res), "failure_scenarios": []}
                failed.append(agent.category)
                continue
            data = res.data or {}
            scenarios = data.get("failure_scenarios", []) or []
            sub_results[agent.sub_agent_id] = data
            for s in scenarios:
                s.setdefault("category", agent.category)
                merged.append(s)

        return {
            "failure_scenarios": merged,
            "sub_agent_outputs": sub_results,
            "partial_analysis": bool(failed),
            "failed_subagents": failed,
        }
