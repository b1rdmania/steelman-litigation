# Steelman Litigation — Implementation Plan

> **Steelman your case. Or find out it's a strawman.**
>
> Adversarial premortem for litigation. A multi-model, multi-agent pipeline that stress-tests your case before you file. Built for solicitors and in-house litigators in the UK.

Domain: TBD (steelmanlitigation.com / steelman.legal)
Status: Pre-scaffold — building MVP

---

## 1. The product

You think you've built the strongest version of your case. Steelman runs it through a structured adversarial pipeline of orchestrated sub-agents to find out if you're right — or if what you thought was a steelman is actually a strawman.

Output: a stress-test brief with ranked failure modes, evidence inconsistencies, blind spots, mitigations, and a single brutal sentence — *"If you lose this, this will be why."*

Not a strategy tool. A stress test on the strategy you already have.

### Why this wins

- **Real agentic infrastructure** — most legal AI is single-LLM with one prompt. Steelman is an orchestrator with specialised sub-agents, each running on the model best suited to its role.
- **Multi-model by design** — adversarial reasoning runs on Opus where it earns its keep; cheaper synthesis on Sonnet; local-model option for firms that can't put case data in someone else's cloud (Heppner-aware).
- **Domain-specific premortem** — Gary Klein's methodology, applied to UK litigation. Failure-mode taxonomy specific to procedural / substantive / evidentiary / strategic categories.
- **Composable** — slots into Bird Legal as a module if/when ready, or stands alone.

**Why Anthropic doesn't eat this easily:** Claude for Word reviews documents. The legal plugin runs skills. Neither orchestrates a multi-agent adversarial pipeline with role-specific model selection. This is domain-specific reasoning architecture, not a horizontal tool.

### Who it's for (V1)

- Solicitors at boutique / mid-size UK firms running active litigation
- In-house counsel weighing whether to escalate
- Mediators wanting a third-voice red team on positions
- Litigation funders evaluating cases pre-investment

### Who it's NOT for (V1)

- Consumers (Courtless covers that)
- Transactional / non-contentious work
- Family law (sensitive, regulatory exposure)
- Criminal defence (different evidentiary standards)

---

## 2. The architecture — multi-model, multi-agent, sub-agent orchestration

This is the part that earns the product its credibility. Not 4 agents in series — a parent orchestrator coordinating specialised sub-agents, each with the right model for its role.

```
Orchestrator (Sonnet) — coordinates pipeline, manages state
│
├── Stage 1: OptimisticAnalyst (Sonnet)
│     "Make the strongest case the evidence supports."
│
├── Stage 2: EvidenceInspector (parent agent)
│     │
│     ├── DocumentSubAgent (Sonnet) — reads PDFs/DOCX, extracts claims
│     ├── CrossReferenceSubAgent (Sonnet) — finds inconsistencies across docs
│     └── ChronologySubAgent (Sonnet) — verifies timeline coherence
│     Output: combined evidence flags with severity
│
├── Stage 3: PremortemAdversary (Opus — better at adversarial reasoning)
│     │
│     ├── ProceduralSubAgent — failure modes: filing defects, deadlines, jurisdiction
│     ├── SubstantiveSubAgent — failure modes: legal grounds, statute, case law
│     ├── EvidentiarySubAgent — failure modes: proof, admissibility, witness credibility
│     └── StrategicSubAgent — failure modes: tactical errors, posture, settlement timing
│     Output: failure scenarios ranked by probability × impact
│
└── Stage 4: Synthesizer (Sonnet)
      Diffs optimistic case against premortem
      Produces final brief: blind spots, mitigations, verdict
```

**Why this architecture matters:**

1. **Specialisation beats generalism.** A sub-agent prompted only for "procedural failure modes" produces sharper output than one giant prompt asking for everything.
2. **Model selection per role.** Opus for the adversary stage where reasoning quality matters most. Sonnet for orchestration and synthesis where speed and cost matter. Each agent picks its model via env config.
3. **Local-model swap-in.** The orchestrator runs against `BaseAgent`. Swap `model="claude-sonnet-4"` for `model="gemma-3-27b-local"` and the same pipeline runs on firm infrastructure for sensitive matters. Privilege-preserving by design.
4. **Composable failures.** The premortem sub-agents run in parallel (asyncio.gather) and produce independently-rankable failure modes. The Synthesizer can weight them differently per case type.
5. **Audit-friendly.** Every sub-agent call traced through Langfuse independently. You can answer "which sub-agent flagged this?" — important for solicitor trust.

---

## 3. User flow

```
Solicitor lands on steelmanlitigation.com
  ↓
Reads splash → clicks "Stress test a case"
  ↓
Uploads matter file: intake (text) + evidence (PDFs / DOCX)
  ↓
Briefly states current strategy / position (textarea)
  ↓
Pipeline runs (sub-agents in parallel where possible, ~2-3 min)
  ↓
Brief delivered:
  - Steelman / Strawman / Borderline verdict
  - Top 5 failure scenarios (ranked, by sub-agent category)
  - Evidence inconsistencies with severity
  - Blind spots
  - Mitigations per scenario
  - One-sentence brutal honest take
  ↓
Solicitor decides: file as-is, refine, or settle
```

---

## 4. Tech stack

Same as Bird Legal / Courtless for portability:

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | FastAPI + async Anthropic SDK |
| Orchestration | Python asyncio.gather for parallel sub-agents |
| Model routing | BaseAgent env-config per agent class |
| Database | SQLite dev, Postgres prod |
| Document extraction | PyMuPDF + python-docx |
| LLM tracing | Langfuse (via the shared agent-kit pattern) |
| Frontend hosting | Vercel |
| Backend hosting | Render Starter |

---

## 5. Data model

```
cases
  id · title · jurisdiction · case_type · status · created_at

intakes
  id · case_id · party_position · current_strategy · desired_outcome

evidence
  id · case_id · filename · file_path · upload_type · extracted_text

analyses
  id · case_id · stage · agent_id · sub_agent_id · model
  content_json · created_at · tokens_in · tokens_out · duration_ms

briefs
  id · case_id · content_md · verdict (steelman|strawman|borderline)
  generated_at

audit_log
  (every agent and sub-agent call)
```

---

## 6. Phased delivery

### Phase 1 — MVP (target: 3-4 days)
- Splash page (positioning the steelman/strawman differentiation + multi-agent architecture)
- Case intake form + evidence upload (PDF/DOCX/TXT)
- Full 4-stage pipeline with sub-agent orchestration
- Brief output rendered as document
- Demo mode with 1-2 pre-baked example cases
- Deploy to Vercel + Render

### Phase 2 — Polish + persistence
- Magic-link auth for case persistence
- Save / revisit cases
- Export brief as PDF
- Public launch

### Phase 3 — Bird Legal integration
- Steelman as a tab inside Bird Legal's Litigation Advisor
- Cross-product evidence sharing
- Run stress test from a matter workspace with one click

### Future (roadmap)
- Image evidence inspection (Claude vision)
- Audio evidence (Whisper transcription)
- Video frame sampling
- Local model deployment for on-prem firms (Gemma 3 / Llama)
- Custom failure-mode taxonomies per practice area
- Cross-case learning — institutional memory layer

---

## 7. Risks

1. **Sub-agent coordination complexity** — orchestration adds failure modes. Need solid retry / fallback / partial-output handling. Don't let one sub-agent failure kill the whole pipeline.
2. **Adversary hedging** — Claude is trained to be balanced. The PremortemAdversary stage may resist genuinely adversarial framing. Opus + explicit role-play prompting + possibly few-shot examples in the prompt.
3. **Cost** — multi-agent + Opus is more expensive per case than single-shot. Need to model cost-per-case before committing to free tier scale.
4. **Solicitor acceptance** — they may dislike being told their case is weak. Tone matters. Brutal but kind.
5. **Latency** — even with parallel sub-agents, 4 stages × Claude calls = 90-180 seconds. UX needs streaming / progressive reveal, not a 3-min spinner.

---

## 8. Open questions

- [ ] Domain — steelmanlitigation.com / steelman.legal / steelman.law?
- [ ] Verdict wording — "steelman / strawman / borderline" or softer?
- [ ] Phase 3 integration — fold into Bird Legal, or maintain as standalone with shared agent-kit?
- [ ] Streaming UI — server-sent events showing sub-agent progress, or just a structured loading state?

---

## 9. What ports from where

**From Bird Legal / Courtless:**
- `BaseAgent` wrapper pattern (with multi-model support)
- FastAPI app skeleton + lifespan
- SQLite schema patterns
- Splash page structure (rewritten for B2B legal audience)
- Vercel + Render deploy pipeline
- Demo mode pattern

**From the existing `claude-premortem-skill` repo:**
- Premortem prompt structure (Klein methodology)
- Failure mode taxonomy

**New build:**
- Multi-model multi-agent orchestrator
- Sub-agent specialisation + parallel execution
- Diff view between optimistic and adversarial analyses
- Steelman/strawman verdict synthesis
- Solicitor-grade UI

---

## 10. Status

Pre-scaffold. Plan locked. Ready to build.

Next step: scaffold repo + frontend + backend, port BaseAgent from courtless with multi-model support, wire orchestrator + sub-agents, deploy.
