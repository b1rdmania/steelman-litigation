"""Hard-coded demo cases — sales material. In-memory fixtures, not DB rows.

Mirrors the content baked into src/data/demoBriefs.js. The frontend reads its
own copy for instant load; the backend exposes these via /api/demo for parity.
"""

WELLINGTON_DEMO = {
    "id": "wellington-sterling",
    "title": "Wellington Holdings v Sterling Bank",
    "jurisdiction": "England & Wales",
    "case_type": "commercial",
    "case_type_label": "Commercial · loan facility",
    "status": "brief_ready",
    "is_demo": True,
    "created_at": "2026-04-22T09:30:00+00:00",
    "updated_at": "2026-04-22T09:33:11+00:00",
    "generated_at": "2026-04-22T09:33:11+00:00",
    "teaser": (
        "£12M facility. Alleged covenant waiver via informal correspondence. "
        "Strong narrative; thin documentary discipline. Recoverable with one strategic re-frame."
    ),
    "brief": {
        "verdict": "borderline",
        "verdict_reasoning": (
            "This case has the narrative but not the documentary discipline. "
            "Recoverable with one solicitor sign-off and a strategic re-framing of the "
            "implied-variation argument."
        ),
        "summary": (
            "Wellington Holdings entered a £12M revolving credit facility with Sterling Bank in "
            "March 2024. By Q4 2024, Wellington had breached the leverage covenant. Wellington "
            "alleges that Sterling waived the breach via a sequence of informal correspondence "
            "between Wellington's CFO and the bank's senior relationship manager. Sterling called "
            "the loan in October 2025 citing the original covenant breach.\n\n"
            "The optimistic case is real. Wellington has a credible relationship narrative, named "
            "individuals demonstrably authorised to act for the bank, and a paper trail that — "
            "read generously — supports an implied variation. Yam Seng good-faith reasoning is "
            "helpful.\n\n"
            "The premortem found something else. The case turns on construction, not implication. "
            "The 17 May email is ambiguous on a fair reading and does not satisfy the requirements "
            "for a contractual variation under the facility's formal-amendment clause. There is no "
            "executed deed of variation. If Wellington runs this on implied variation alone, the "
            "procedural and substantive sub-agents independently flagged it as the case losing on "
            "construction in the first hearing."
        ),
        "failure_scenarios": [
            {
                "category": "procedural",
                "scenario": (
                    "Pleading the case as a contractual variation rather than estoppel forces "
                    "Wellington into a construction argument the facility's formal-amendment "
                    "clause was specifically drafted to defeat."
                ),
                "probability": "High",
                "impact": "High",
                "mitigation": (
                    "Re-plead in the alternative: primary case in promissory estoppel, secondary "
                    "case in implied variation. The estoppel framing survives a strict reading of "
                    "the amendment clause; the variation framing does not."
                ),
            },
            {
                "category": "substantive",
                "scenario": (
                    "Yam Seng good-faith reasoning is helpful but does not displace the facility's "
                    "express terms. BNP Paribas v Trattamento Rifiuti Metropolitani is the line of "
                    "authority a commercial bench will reach for first, and it cuts the other way."
                ),
                "probability": "Medium",
                "impact": "High",
                "mitigation": (
                    "Engage BNP Paribas head-on in skeleton argument. Distinguish on facts and "
                    "pivot the legal argument to estoppel."
                ),
            },
            {
                "category": "evidentiary",
                "scenario": (
                    "The CFO's contemporaneous notes are not contemporaneous in the strict sense — "
                    "they appear to have been written within 48 hours of each meeting but typed up "
                    "later. A hostile cross-examination will frame them as reconstructions."
                ),
                "probability": "Medium",
                "impact": "Medium",
                "mitigation": (
                    "Forensic metadata on the notes file now. If timestamps support contemporaneity, "
                    "cite them in disclosure. If not, plead the notes as reflective."
                ),
            },
            {
                "category": "strategic",
                "scenario": (
                    "Sterling has a strategic interest in not setting a precedent that informal "
                    "correspondence varies syndicated facilities. They will run this hard if "
                    "Wellington pleads variation."
                ),
                "probability": "High",
                "impact": "Medium",
                "mitigation": (
                    "Test settlement appetite now via without-prejudice. The threat of an estoppel "
                    "finding (which has wider implications for the bank than a one-off variation) "
                    "is the lever."
                ),
            },
        ],
        "evidence_inconsistencies": [
            {
                "claim": "The 17 May email constituted a binding waiver of the leverage covenant.",
                "issue": (
                    "The email itself does not reference the leverage covenant by name. It refers "
                    "to 'the recent technical breach'. Sterling will argue this is too imprecise "
                    "to vary a defined covenant in the facility."
                ),
                "severity": "high",
            },
            {
                "claim": "The RM had authority to bind the bank to the variation.",
                "issue": (
                    "The bank's credit policy requires credit-committee sign-off for any variation "
                    "of facility terms. The RM's authority extends to relationship management, not "
                    "commitment."
                ),
                "severity": "high",
            },
            {
                "claim": "The pattern of conduct between May and October constitutes acceptance.",
                "issue": (
                    "The bank continued to charge interest at the original rate. There is no "
                    "documented operational change in the bank's treatment of the loan."
                ),
                "severity": "medium",
            },
        ],
        "blind_spots": [
            (
                "The case has been worked up assuming Sterling will defend on the merits. Sterling's "
                "actual likely defence is a construction defence, which closes off Wellington's "
                "argument before merits are reached."
            ),
            (
                "Nobody in the matter file has yet asked: what did Sterling's credit committee "
                "minutes record between May and October 2025? That documentary record is the centre "
                "of gravity of the case."
            ),
            (
                "The retired RM is being treated as a non-issue. He is the single most consequential "
                "witness in the case, on either side."
            ),
        ],
        "if_we_lose_this_will_be_why": (
            "We pleaded a contractual variation our own amendment clause was drafted to defeat, "
            "when the case should have been pleaded as an estoppel from the start."
        ),
    },
}

FOXBRIDGE_DEMO = {
    "id": "foxbridge-et3",
    "title": "Foxbridge Partners — ET3 response (former equity partner)",
    "jurisdiction": "England & Wales",
    "case_type": "employment",
    "case_type_label": "Employment · partnership",
    "status": "brief_ready",
    "is_demo": True,
    "created_at": "2026-04-21T14:18:00+00:00",
    "updated_at": "2026-04-21T14:21:08+00:00",
    "generated_at": "2026-04-21T14:21:08+00:00",
    "teaser": (
        "Equality Act claim by a former equity partner. Firm's defence rests on a worker "
        "classification argument the Supreme Court closed in 2014."
    ),
    "brief": {
        "verdict": "strawman",
        "verdict_reasoning": (
            "The defence relies on a worker classification argument the Supreme Court closed in "
            "Clyde & Co v Bates van Winkelhof in 2014. The firm thinks it has a case; on the "
            "evidence it has a settlement window."
        ),
        "summary": (
            "The claimant is a former equity partner of Foxbridge Partners LLP, brought into "
            "equity in 2019 and removed in late 2025. She has filed an Equality Act 2010 claim "
            "alleging direct discrimination and victimisation in respect of decisions taken by "
            "the firm's remuneration and management committees.\n\n"
            "The firm believes its defence is procedural compliance and policy. It is wrong. "
            "Clyde & Co LLP v Bates van Winkelhof [2014] UKSC 32 settled the question of "
            "LLP-equity-partner worker status in the Supreme Court. The firm's lead defence is "
            "dead on arrival.\n\n"
            "The four sub-agents independently flagged further failures: an ET3 timing risk; a "
            "documentary record of the remuneration committee that decisions affecting the "
            "claimant were taken in WhatsApp groups without minutes; and a strategic position in "
            "which running the case to a finding risks a public award and reputational damage in "
            "a Magic Circle adjacent space."
        ),
        "failure_scenarios": [
            {
                "category": "procedural",
                "scenario": (
                    "The firm's ET3 response raises a scope objection at paragraph 14, but does "
                    "not particularise it. A late objection without particulars will be treated "
                    "as a holding plea."
                ),
                "probability": "High",
                "impact": "Medium",
                "mitigation": (
                    "Withdraw the scope objection or amend the ET3 to particularise it within the "
                    "firm's permission-to-amend window."
                ),
            },
            {
                "category": "substantive",
                "scenario": (
                    "The firm's lead defence is that the claimant is not a 'worker' for s.230(3)(b) "
                    "purposes by reason of her partnership status. This defence is foreclosed by "
                    "Clyde & Co LLP v Bates van Winkelhof [2014] UKSC 32."
                ),
                "probability": "High",
                "impact": "High",
                "mitigation": (
                    "Withdraw the worker-status defence. Reframe the case on the merits — whether "
                    "the decisions taken were materially influenced by a protected characteristic."
                ),
            },
            {
                "category": "evidentiary",
                "scenario": (
                    "The remuneration committee's key decisions about the claimant were taken in "
                    "a WhatsApp group with three members. The group was deleted after the decision "
                    "was taken."
                ),
                "probability": "High",
                "impact": "High",
                "mitigation": (
                    "Preservation order on the relevant devices now. The deletion will be raised "
                    "at trial; the only thing that helps is being able to show every preservation "
                    "step was taken from the moment the claim was notified."
                ),
            },
            {
                "category": "strategic",
                "scenario": (
                    "A reasoned ET judgment in the claimant's favour will be reportable. In a "
                    "Magic Circle adjacent recruitment market, a published finding of "
                    "discrimination at partner level affects lateral hire pipelines for at least "
                    "18 months."
                ),
                "probability": "Medium",
                "impact": "High",
                "mitigation": (
                    "Open ACAS conciliation route now with a settlement envelope authorised at "
                    "managing-partner level."
                ),
            },
        ],
        "evidence_inconsistencies": [
            {
                "claim": (
                    "The remuneration committee's decisions were taken in accordance with the "
                    "firm's LLP agreement and partnership deed."
                ),
                "issue": (
                    "The committee's deliberations on the claimant were taken in a WhatsApp "
                    "group, not at a minuted meeting. The LLP agreement requires material "
                    "remuneration decisions to be minuted."
                ),
                "severity": "high",
            },
            {
                "claim": "The claimant is not a 'worker' for s.230(3)(b) purposes.",
                "issue": (
                    "This is contradicted by the Supreme Court in Clyde & Co LLP v Bates van "
                    "Winkelhof [2014] UKSC 32. Continuing to plead this is inconsistent with the "
                    "law as currently settled."
                ),
                "severity": "high",
            },
            {
                "claim": (
                    "The performance-management policy was applied to the claimant in the months "
                    "before her removal."
                ),
                "issue": (
                    "The policy was not formally triggered until October 2025. The claimant's "
                    "removal was decided in principle in September 2025 — before the policy was "
                    "triggered."
                ),
                "severity": "high",
            },
        ],
        "blind_spots": [
            (
                "The firm's leadership team is treating this as a routine ET defence. A reasoned "
                "judgment in the claimant's favour at partner level will be reported and will "
                "affect the firm's lateral hire market for 18 months."
            ),
            (
                "Nobody on the leadership team has read Clyde & Co v Bates van Winkelhof [2014] "
                "UKSC 32 in full. The defence has been worked up from a half-recalled summary "
                "that predates 2014."
            ),
            (
                "The WhatsApp deletion has been treated as a housekeeping issue. It is the most "
                "consequential single fact in the case for the purposes of disclosure and "
                "credibility."
            ),
            (
                "The settlement envelope authorised by the management committee is currently set "
                "against the legal-fees budget for a contested defence. It should be set against "
                "the reputational and regulatory cost of an adverse finding."
            ),
        ],
        "if_we_lose_this_will_be_why": (
            "If you lose this, it'll be because nobody on the leadership team read the actual "
            "judgments."
        ),
    },
}


DEMOS = [WELLINGTON_DEMO, FOXBRIDGE_DEMO]


def list_demos() -> list[dict]:
    return [
        {
            "id": d["id"],
            "title": d["title"],
            "jurisdiction": d["jurisdiction"],
            "case_type": d["case_type"],
            "case_type_label": d.get("case_type_label"),
            "verdict": d["brief"]["verdict"],
            "teaser": d.get("teaser"),
        }
        for d in DEMOS
    ]


def get_demo(demo_id: str) -> dict | None:
    for d in DEMOS:
        if d["id"] == demo_id:
            return d
    return None
