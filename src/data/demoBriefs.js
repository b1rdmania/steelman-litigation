// Hand-crafted demo briefs. Same schema as /api/cases/:id.
// These are sales material — every field is intentional.

const WELLINGTON_DEMO = {
  id: 'wellington-sterling',
  title: 'Wellington Holdings v Sterling Bank',
  jurisdiction: 'England & Wales',
  case_type: 'commercial',
  case_type_label: 'Commercial · loan facility',
  status: 'brief_ready',
  is_demo: true,
  created_at: '2026-04-22T09:30:00+00:00',
  updated_at: '2026-04-22T09:33:11+00:00',
  generated_at: '2026-04-22T09:33:11+00:00',
  teaser: '£12M facility. Alleged covenant waiver via informal correspondence. Strong narrative; thin documentary discipline. Recoverable with one strategic re-frame.',
  brief: {
    verdict: 'borderline',
    verdict_reasoning: 'This case has the narrative but not the documentary discipline. Recoverable with one solicitor sign-off and a strategic re-framing of the implied-variation argument.',
    summary: (
      'Wellington Holdings entered a £12M revolving credit facility with Sterling Bank in March 2024. By Q4 2024, Wellington had breached the leverage covenant. Wellington alleges that Sterling waived the breach via a sequence of informal correspondence between Wellington\'s CFO and the bank\'s senior relationship manager — chiefly an email of 17 May 2025 and three subsequent meetings the parties agree took place but disagree about the substance of. Sterling called the loan in October 2025 citing the original covenant breach. Wellington seeks a declaration that the covenant was varied, alternatively waived; alternatively, damages.\n\n' +
      'The optimistic case is real. Wellington has a credible relationship narrative, named individuals who were demonstrably authorised to act for the bank, and a paper trail that — read generously — supports an implied variation. Yam Seng good-faith reasoning is helpful. The CFO\'s contemporaneous notes are reasonably contemporaneous and support Wellington\'s account.\n\n' +
      'The premortem found something else. The case turns on construction, not implication. The 17 May email is ambiguous on a fair reading and does not satisfy the requirements for a contractual variation under the facility\'s formal-amendment clause. There is no executed deed of variation. The bank\'s relationship manager was authorised to discuss but not to commit. Where Yam Seng is invoked, BNP Paribas v Trattamento sits awkwardly on the same shelf and is the case the bench will reach for first. If Wellington runs this on implied variation alone, the procedural and substantive sub-agents independently flagged it as the case losing on construction in the first hearing.'
    ),
    failure_scenarios: [
      {
        category: 'procedural',
        scenario: 'Pleading the case as a contractual variation rather than estoppel forces Wellington into a construction argument the facility\'s formal-amendment clause was specifically drafted to defeat.',
        probability: 'High',
        impact: 'High',
        mitigation: 'Re-plead in the alternative: primary case in promissory estoppel, secondary case in implied variation. The estoppel framing survives a strict reading of the amendment clause; the variation framing does not.',
      },
      {
        category: 'procedural',
        scenario: 'CPR 31 disclosure obligations have not yet been mapped against the bank\'s internal governance documents — credit-committee minutes, RM authority levels, deal-sheet sign-offs.',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: 'Specific disclosure request now, framed narrowly enough to survive a proportionality challenge. The bank\'s authority architecture is the heart of the dispute; you need the org chart in evidence before trial.',
      },
      {
        category: 'substantive',
        scenario: 'The 17 May email reads as relationship management, not contractual commitment. On the construction line, it does not satisfy the formal-amendment clause and does not, on its own, support a finding of waiver.',
        probability: 'High',
        impact: 'High',
        mitigation: 'Stop relying on the email as the central exhibit. Build the argument from the pattern of conduct between May and October — five documented interactions in which the bank treated the breach as resolved. The email becomes corroborative, not load-bearing.',
      },
      {
        category: 'substantive',
        scenario: 'Yam Seng good-faith reasoning is helpful but does not displace the facility\'s express terms. BNP Paribas v Trattamento Rifiuti Metropolitani is the line of authority a commercial bench will reach for first, and it cuts the other way.',
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Engage BNP Paribas head-on in skeleton argument. Distinguish on facts — the facility is not analogous in structure — and pivot the legal argument to estoppel, where the relational-contract reasoning has more purchase.',
      },
      {
        category: 'evidentiary',
        scenario: 'The CFO\'s contemporaneous notes are not contemporaneous in the strict sense — they appear to have been written within 48 hours of each meeting but typed up later. A hostile cross-examination will frame them as reconstructions.',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: 'Forensic metadata on the notes file now. If the timestamps support contemporaneity, cite them in disclosure. If not, plead them as reflective rather than contemporaneous and weight the case more on the email-and-conduct trail.',
      },
      {
        category: 'evidentiary',
        scenario: 'The bank\'s RM is now retired. Wellington has not approached him for a witness statement and the bank has likely already done so. If his recollection contradicts the CFO\'s notes, the evidentiary balance shifts hard.',
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Approach the RM through correspondence within 14 days. If he is willing to give a statement, you have a critical witness. If not, you know the risk early enough to adjust the evidentiary strategy.',
      },
      {
        category: 'strategic',
        scenario: 'Sterling is a defendant with deeper pockets and a strategic interest in not setting a precedent that informal correspondence varies syndicated facilities. They will run this hard if Wellington pleads variation.',
        probability: 'High',
        impact: 'Medium',
        mitigation: 'Test settlement appetite now via without-prejudice. Sterling may settle quietly to avoid a reported judgment; the threat of an estoppel finding (which has wider implications for the bank than a one-off variation) is the lever.',
      },
      {
        category: 'strategic',
        scenario: 'Wellington\'s board will lose appetite for the costs of a fully-contested commercial trial if the case slides past 18 months. There is no current costs-budgeting discipline in the matter file.',
        probability: 'Medium',
        impact: 'Medium',
        mitigation: 'Costs schedule with phase-by-phase budget tabled at the board now. Build settlement decision points at each phase so the case is reviewed against costs, not run on momentum.',
      },
    ],
    evidence_inconsistencies: [
      {
        claim: 'The 17 May email constituted a binding waiver of the leverage covenant.',
        issue: 'The email itself does not reference the leverage covenant by name. It refers to "the recent technical breach". Sterling will argue this is too imprecise to vary a defined covenant in the facility.',
        severity: 'high',
      },
      {
        claim: 'The CFO\'s contemporaneous notes record the bank\'s position as "comfortable" with the breach.',
        issue: 'The word "comfortable" is the CFO\'s characterisation. The RM\'s actual phrasing in the email of 17 May is "we can live with this for now while you address it" — materially different.',
        severity: 'high',
      },
      {
        claim: 'The RM had authority to bind the bank to the variation.',
        issue: 'The bank\'s credit policy (publicly available in part) requires credit-committee sign-off for any variation of facility terms. The RM\'s authority extends to relationship management, not commitment. Wellington has not pleaded the authority argument.',
        severity: 'high',
      },
      {
        claim: 'The pattern of conduct between May and October constitutes acceptance of the variation.',
        issue: 'The bank continued to charge interest at the original rate, not at any varied rate. There is no documented operational change in the bank\'s treatment of the loan that would corroborate Wellington\'s case.',
        severity: 'medium',
      },
    ],
    blind_spots: [
      'The case has been worked up assuming Sterling will defend on the merits. Sterling\'s actual likely defence is that no contractual relationship was modified — a construction defence — which closes off Wellington\'s argument before merits are reached.',
      'No party in the matter file has yet asked: what did Sterling\'s credit committee minutes record between May and October 2025? That documentary record is the centre of gravity of the case and currently sits entirely on the bank\'s side.',
      'Wellington\'s strategy assumes the relationship narrative resonates with a commercial judge. In commercial chambers post-2024, the trend has been a tighter return to express-terms reasoning. The relational-contract jurisprudence is being read narrowly.',
      'The retired RM is being treated as a non-issue. He is the single most consequential witness in the case, on either side, and Wellington has not yet engaged with him.',
    ],
    if_we_lose_this_will_be_why: 'We pleaded a contractual variation our own amendment clause was drafted to defeat, when the case should have been pleaded as an estoppel from the start.',
  },
};

const FOXBRIDGE_DEMO = {
  id: 'foxbridge-et3',
  title: 'Foxbridge Partners — ET3 response (former equity partner)',
  jurisdiction: 'England & Wales',
  case_type: 'employment',
  case_type_label: 'Employment · partnership',
  status: 'brief_ready',
  is_demo: true,
  created_at: '2026-04-21T14:18:00+00:00',
  updated_at: '2026-04-21T14:21:08+00:00',
  generated_at: '2026-04-21T14:21:08+00:00',
  teaser: 'Equality Act claim by a former equity partner. Firm\'s defence rests on a worker classification argument the Supreme Court closed in 2014. The firm thinks it has a case; on the evidence it has a settlement window.',
  brief: {
    verdict: 'strawman',
    verdict_reasoning: 'The defence relies on a worker classification argument the Supreme Court closed in Clyde & Co v Bates van Winkelhof in 2014. The firm thinks it has a case; on the evidence it has a settlement window.',
    summary: (
      'The claimant is a former equity partner of Foxbridge Partners LLP, brought into equity in 2019 and removed in late 2025 following what the firm characterises as a performance-management process. She has filed an Equality Act 2010 claim alleging direct discrimination and victimisation in respect of decisions taken by the firm\'s remuneration and management committees. The firm has filed an ET3 response that turns substantially on the proposition that, as an equity partner, she is not a "worker" within s.230(3)(b) of the Employment Rights Act 1996 and accordingly falls outside the protections of the Equality Act 2010 in the relevant respects.\n\n' +
      'The firm believes its defence is procedural compliance and policy. It is wrong. The substantive sub-agent flagged this immediately: Clyde & Co LLP v Bates van Winkelhof [2014] UKSC 32 settled the question of LLP-equity-partner worker status in the Supreme Court. A partner in an LLP is a worker for s.230(3)(b) purposes. The firm\'s lead defence is dead on arrival.\n\n' +
      'Beyond that, the four sub-agents independently flagged failures: an ET3 timing risk (the response narrowly raises a scope objection that is procedurally late and substantively thin); a documentary record of the remuneration committee that decisions affecting the claimant were taken in WhatsApp groups without minutes; and a strategic position in which running the case to a finding risks a public award and reputational damage in a Magic Circle adjacent space, when settling now via ACAS would close the matter without ET findings.'
    ),
    failure_scenarios: [
      {
        category: 'procedural',
        scenario: 'The firm\'s ET3 response raises a scope objection (that certain heads of claim fall outside the tribunal\'s jurisdiction) at paragraph 14, but does not particularise it. A late objection without particulars will be treated as a holding plea.',
        probability: 'High',
        impact: 'Medium',
        mitigation: 'Withdraw the scope objection or amend the ET3 to particularise it within the firm\'s permission-to-amend window. An unparticularised plea is worse than no plea — it signals a search for procedural escape that the bench will read.',
      },
      {
        category: 'procedural',
        scenario: 'The firm has not yet completed disclosure of the remuneration committee\'s decision-making record. ET disclosure obligations on equality cases are wide; a partial disclosure will draw an adverse inference.',
        probability: 'High',
        impact: 'High',
        mitigation: 'Full disclosure of the committee\'s records — including WhatsApp threads, given the substantive concerns — within the standard timetable. Partial disclosure is the worst outcome; full disclosure is survivable.',
      },
      {
        category: 'substantive',
        scenario: 'The firm\'s lead defence is that the claimant is not a "worker" for s.230(3)(b) purposes by reason of her partnership status. This defence is foreclosed by Clyde & Co LLP v Bates van Winkelhof [2014] UKSC 32.',
        probability: 'High',
        impact: 'High',
        mitigation: 'Withdraw the worker-status defence. Any ET will dismiss it on the law in the first hearing. Reframe the case on the merits — whether the decisions taken were materially influenced by a protected characteristic — which is winnable on different evidence.',
      },
      {
        category: 'substantive',
        scenario: 'The firm relies on its formal performance-management policy as evidence of fair process. The policy was not actually applied to the claimant; the decisions were taken before the policy was triggered.',
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Concede the procedural-fairness point and run the case on substantive justification. Continuing to plead policy compliance against the documentary record invites adverse credibility findings on the firm\'s witnesses.',
      },
      {
        category: 'evidentiary',
        scenario: 'The remuneration committee\'s key decisions about the claimant were taken in a WhatsApp group with three members. The group was deleted after the decision was taken. Forensic recovery is possible but the firm has not preserved the device images.',
        probability: 'High',
        impact: 'High',
        mitigation: 'Preservation order on the relevant devices now. The deletion will be raised at trial; the only thing that helps is being able to show the firm took every preservation step from the moment the claim was notified. Any further deletion is fatal.',
      },
      {
        category: 'evidentiary',
        scenario: 'The firm\'s witness statements rely on three managing partners who all sat on the remuneration committee. Two of them have given materially different accounts of the same meeting in their first-draft statements. The drafts were exchanged via the firm\'s shared drive.',
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Collapse the witness evidence to one lead witness with the most direct factual knowledge, supported where necessary by documentary references. Three inconsistent witnesses are worse than one consistent witness.',
      },
      {
        category: 'strategic',
        scenario: 'A reasoned ET judgment in the claimant\'s favour will be reportable. In a Magic Circle adjacent recruitment market, a published finding of discrimination at partner level affects lateral hire pipelines for at least 18 months.',
        probability: 'Medium',
        impact: 'High',
        mitigation: 'Open ACAS conciliation route now with a settlement envelope authorised at managing-partner level. The reputational cost of a contested loss substantially exceeds any plausible settlement figure.',
      },
      {
        category: 'strategic',
        scenario: 'Running the worker-status defence publicly invites the regulator and the SRA\'s thematic review on partnership-level conduct. The firm has flagged exposure on this front in its own internal risk register.',
        probability: 'Low',
        impact: 'High',
        mitigation: 'Do not run the worker-status defence publicly. Even if not raised at trial, it will appear in disclosure. The strategic case for settlement strengthens as soon as that document set is produced.',
      },
    ],
    evidence_inconsistencies: [
      {
        claim: 'The remuneration committee\'s decisions were taken in accordance with the firm\'s LLP agreement and partnership deed.',
        issue: 'The committee\'s deliberations on the claimant were taken in a WhatsApp group, not at a minuted meeting. The LLP agreement requires material remuneration decisions to be minuted. The procedural footing of the decisions is therefore inconsistent with the firm\'s own constitutional documents.',
        severity: 'high',
      },
      {
        claim: 'The performance-management policy was applied to the claimant in the months before her removal.',
        issue: 'The policy was not formally triggered until October 2025. The claimant\'s removal was decided in principle in September 2025 — before the policy was triggered. The policy is therefore being invoked retrospectively to validate a decision already taken.',
        severity: 'high',
      },
      {
        claim: 'The claimant is not a "worker" for s.230(3)(b) purposes.',
        issue: 'This is contradicted by the Supreme Court in Clyde & Co LLP v Bates van Winkelhof [2014] UKSC 32. Continuing to plead this is inconsistent with the law as currently settled.',
        severity: 'high',
      },
      {
        claim: 'Three managing partners participated equally in the relevant decision-making.',
        issue: 'Their first-draft witness statements give materially different accounts of who advanced which proposal at the relevant meeting. Without reconciliation, the witness evidence is internally inconsistent before it reaches the bench.',
        severity: 'medium',
      },
    ],
    blind_spots: [
      'The firm\'s leadership team is treating this as a routine ET defence. It is not. A reasoned judgment in the claimant\'s favour at partner level will be reported and will affect the firm\'s lateral hire market for 18 months.',
      'Nobody on the leadership team has read Clyde & Co v Bates van Winkelhof [2014] UKSC 32 in full. The defence has been worked up from a half-recalled summary that predates 2014.',
      'The WhatsApp deletion has been treated as a housekeeping issue. It is the most consequential single fact in the case for the purposes of disclosure and credibility.',
      'The settlement envelope authorised by the management committee is currently set against the legal-fees budget for a contested defence. It should be set against the reputational and regulatory cost of an adverse finding, which is materially higher.',
    ],
    if_we_lose_this_will_be_why: 'If you lose this, it\'ll be because nobody on the leadership team read the actual judgments.',
  },
};

export const DEMOS = [WELLINGTON_DEMO, FOXBRIDGE_DEMO];

export const DEMO_LIST = DEMOS.map(d => ({
  id: d.id,
  title: d.title,
  jurisdiction: d.jurisdiction,
  case_type: d.case_type,
  case_type_label: d.case_type_label,
  teaser: d.teaser,
  verdict: d.brief.verdict,
}));

export function getDemoBrief(id) {
  return DEMOS.find(d => d.id === id) || null;
}
