# Steelman Litigation

> **Steelman your case. Or find out it's a strawman.**
>
> Adversarial premortem for UK litigation. A multi-model, multi-agent pipeline that stress-tests your case before you file. For solicitors and in-house counsel.

You think you've built the strongest version of your case. Steelman runs it through a structured adversarial pipeline of orchestrated sub-agents to find out if you're right — or if what you thought was a steelman is actually a strawman.

Output: a stress-test brief with ranked failure modes by category, evidence inconsistencies, blind spots, mitigations, and one brutal sentence — *"if we lose this, this will be why."*

## Architecture

```
Orchestrator (FastAPI)
│
├── Stage 1 · OptimisticAnalyst  (Sonnet)
│     The strongest version of the client's case the evidence supports.
│
├── Stage 2 · EvidenceInspector  (parent — runs three sub-agents in parallel)
│     ├── DocumentSubAgent          (Sonnet)
│     ├── CrossReferenceSubAgent    (Sonnet)
│     └── ChronologySubAgent        (Sonnet)
│     Output: merged evidence flags with severity
│
├── Stage 3 · PremortemAdversary (parent — runs four Opus sub-agents in parallel)
│     ├── ProceduralSubAgent        (Opus)
│     ├── SubstantiveSubAgent       (Opus)
│     ├── EvidentiarySubAgent       (Opus)
│     └── StrategicSubAgent         (Opus)
│     Each is told: "It is January 2027. The case has been LOST. Walk back."
│     Output: ranked failure scenarios by category
│
└── Stage 4 · Synthesizer (Sonnet)
      Diffs the optimistic case against the adversarial findings.
      Produces the brief: verdict (steelman / strawman / borderline),
      ranked failure scenarios, evidence inconsistencies, blind spots,
      mitigations, and the one brutal sentence.
```

Seven LLM calls under the hood. Two parallel `asyncio.gather` blocks. End-to-end ~2–3 minutes per real case.

Per-class model selection — every agent class declares its own model via env var. Swapping Opus for a local Gemma is one line of config, not a routing layer.

Every sub-agent call is audit-logged independently — model, tokens in, tokens out, duration, status. You can answer "which sub-agent flagged this?".

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | FastAPI + async Anthropic SDK |
| Orchestration | Python `asyncio.gather` for parallel sub-agents |
| Model routing | `BaseAgent` env-config per agent class |
| Database | SQLite (Postgres for V2) |
| Document extraction | PyMuPDF + python-docx |
| Frontend hosting | Vercel |
| Backend hosting | Render |

## Local development

```bash
# Frontend
npm install
npm run dev   # http://localhost:5173

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
ANTHROPIC_API_KEY=sk-... uvicorn app.main:app --reload --port 8000
```

Frontend proxies `/api` → `http://localhost:8000` in dev.

## Environment

Backend env vars:

| Var | Default | Purpose |
|---|---|---|
| `ANTHROPIC_API_KEY` | — | required |
| `STEELMAN_OPTIMISTIC_MODEL` | `claude-sonnet-4-20250514` | Stage 1 model |
| `STEELMAN_EVIDENCE_MODEL` | `claude-sonnet-4-20250514` | Stage 2 sub-agents |
| `STEELMAN_PREMORTEM_MODEL` | `claude-opus-4-20250514` | Stage 3 sub-agents (Opus) |
| `STEELMAN_SYNTHESIS_MODEL` | `claude-sonnet-4-20250514` | Stage 4 model |
| `STEELMAN_SONNET_TIMEOUT` | `60` | seconds |
| `STEELMAN_OPUS_TIMEOUT` | `120` | seconds |

## Phased delivery

- **V1 — MVP (live).** Splash, intake, full pipeline, brief render, two baked demos, audit log. Solicitor / in-house / mediator / litigation funder positioning.
- **V2 — Polish + persistence.** Magic-link auth, save/revisit cases, export brief as PDF, public launch.
- **V3 — Bird Legal integration.** Steelman as a tab inside the Bird Legal Litigation Advisor. Cross-product evidence sharing. Run a stress-test from a matter workspace with one click.
- **Future — multi-modal.** Image evidence (Claude vision). Audio (Whisper transcription). Video frame sampling. Local model deployment (Gemma 3 / Llama) for on-prem firms.
- **Future — domain depth.** Custom failure-mode taxonomies per practice area. Cross-case learning / institutional memory layer.

## Roadmap themes

- Streaming UI showing sub-agent progress in real time (currently a rotating status message).
- Per-firm fine-tuning of the synthesizer for house style.
- Linked-citation rendering against The National Archives' Find Case Law API.
- API for Bird Legal and other matter-management systems to invoke Steelman from a matter.

## Sister products

- [Courtless](https://github.com/b1rdmania/courtless) — disputes without courts. Consumer-side mediation protocol for under-£100K disputes.
- [Counsel](https://github.com/b1rdmania/counsel-mvp) — pre-mediation triage for solicitors.

Steelman, Courtless and Counsel form a portfolio of legal AI products by [b1rdmania](https://github.com/b1rdmania), each at a different point on the matter lifecycle. Steelman sits between intake and pleading. It's the red team you don't have on retainer.

## Not legal advice

Steelman is an informational stress test. The decision on what to file or argue remains with the instructed solicitor.
