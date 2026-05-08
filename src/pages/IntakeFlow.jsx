import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt'];
const ACCEPTED_MIME = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 15;

const STAGE_MESSAGES = [
  'Stage 1 · Optimistic Analyst — building the strongest version of your case…',
  'Stage 2 · Evidence Inspector — three sub-agents reading the file in parallel…',
  'Stage 3 · Premortem Adversary — four Opus sub-agents working back from a hypothetical loss…',
  'Stage 4 · Synthesizer — diffing the optimistic and adversarial takes, drafting the brief…',
];

const initialForm = {
  title: '',
  case_text: '',
  email: '',
  consent: false,
};

const IntakeFlow = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [evidence, setEvidence] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stageIdx, setStageIdx] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Rotate stage message every 30s during submit
  useEffect(() => {
    if (!submitting) return;
    const t = setInterval(() => {
      setStageIdx((s) => Math.min(STAGE_MESSAGES.length - 1, s + 1));
    }, 30_000);
    return () => clearInterval(t);
  }, [submitting]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const addFiles = (files) => {
    const arr = Array.from(files || []);
    const valid = arr.filter((f) => {
      const ext = '.' + (f.name.split('.').pop() || '').toLowerCase();
      return ACCEPTED_EXTENSIONS.includes(ext) && f.size <= MAX_FILE_SIZE;
    });
    setEvidence((prev) => [...prev, ...valid].slice(0, MAX_FILES));
    // Auto-suggest title from first uploaded file if empty
    if (!form.title && valid.length > 0) {
      const stem = valid[0].name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      update({ title: stem.charAt(0).toUpperCase() + stem.slice(1) });
    }
  };

  const removeFile = (idx) => {
    setEvidence((prev) => prev.filter((_, i) => i !== idx));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
  };

  const canSubmit =
    form.consent &&
    form.email.trim().includes('@') &&
    (form.case_text.trim().length >= 50 || evidence.length > 0) &&
    form.title.trim().length > 1;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setStageIdx(0);
    setError(null);
    try {
      const body = new FormData();
      body.append('title', form.title.trim());
      body.append('jurisdiction', 'England & Wales');
      body.append('case_type', 'general');
      body.append('party_position_role', '');
      const text = form.case_text.trim() || `(See uploaded files: ${evidence.map(f => f.name).join(', ')})`;
      body.append('party_position', text);
      body.append('current_strategy', text);
      body.append('email', form.email.trim());
      evidence.forEach((file) => {
        body.append('files', file);
        body.append('file_types', 'document');
        body.append('file_labels', file.name);
      });

      // POST returns immediately with case_id — pipeline runs in the background
      const res = await fetch(`${API_BASE}/api/cases`, { method: 'POST', body });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Submission failed (${res.status}): ${txt || 'unknown error'}`);
      }
      const { case_id } = await res.json();

      // Poll until the pipeline finishes
      const POLL_INTERVAL = 6000;
      const POLL_TIMEOUT = 300_000; // 5 min hard stop
      const deadline = Date.now() + POLL_TIMEOUT;

      const poll = async () => {
        if (Date.now() > deadline) {
          throw new Error('Analysis timed out — the pipeline is taking longer than expected. Check back in a moment.');
        }
        const r = await fetch(`${API_BASE}/api/cases/${case_id}`);
        if (!r.ok) throw new Error(`Status check failed (${r.status})`);
        const d = await r.json();
        if (d.status === 'brief_ready') {
          navigate(`/brief/${case_id}`);
        } else if (d.status === 'failed') {
          throw new Error(d.error_detail || 'The pipeline failed. Please try again.');
        } else {
          // Still running — advance stage message and poll again
          const stageMap = {
            analysing_optimistic: 0,
            analysing_evidence: 1,
            analysing_premortem: 2,
            synthesising: 3,
          };
          setStageIdx(stageMap[d.status] ?? 0);
          setTimeout(poll, POLL_INTERVAL);
        }
      };

      setTimeout(poll, POLL_INTERVAL);
    } catch (e) {
      setError(e.message || String(e));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <style>{`
        :root {
          --bg-color: #111111;
          --text-white: #F4F4F2;
          --text-red: #E63935;
          --text-muted: #777777;
          --border-muted: #222222;
          --border-soft: #2a2a2a;

          --font-display: 'Oswald', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }

        .intake-shell {
          background-color: var(--bg-color);
          color: var(--text-white);
          font-family: var(--font-body);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .intake-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 4rem;
          border-bottom: 1px solid var(--border-muted);
        }

        .logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0;
          background: none;
          border: none;
          color: var(--text-white);
          cursor: pointer;
          font-weight: 700;
        }
        .logo .dot { color: var(--text-red); }

        .intake-meta {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--text-red);
          animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        .intake-main {
          flex: 1;
          padding: 4rem 4rem 6rem;
          max-width: 920px;
          margin: 0 auto;
          width: 100%;
        }

        .page-eyebrow {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .page-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 0.95;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .page-title .red { color: var(--text-red); }

        .page-sub {
          font-size: 1.05rem;
          line-height: 1.5;
          color: rgba(244, 244, 242, 0.7);
          max-width: 640px;
          margin-bottom: 3rem;
        }

        .field-group { margin-bottom: 2rem; }

        .field-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-muted);
          margin-bottom: 0.6rem;
        }

        .field-hint {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
          letter-spacing: 0.05em;
        }

        .input, .textarea {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border-soft);
          color: var(--text-white);
          font-family: var(--font-body);
          font-size: 1rem;
          padding: 0.75rem 0;
          outline: none;
          transition: border-color 0.15s ease;
        }

        .input:focus, .textarea:focus { border-bottom-color: var(--text-red); }

        .textarea {
          min-height: 180px;
          line-height: 1.55;
          resize: vertical;
          font-size: 1rem;
        }

        .input::placeholder, .textarea::placeholder {
          color: rgba(244, 244, 242, 0.25);
        }

        .drop-zone {
          border: 1px dashed var(--border-soft);
          padding: 2.5rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.15s ease;
          background: rgba(255,255,255,0.01);
        }
        .drop-zone:hover, .drop-zone.drag-over {
          border-color: var(--text-red);
          background: rgba(230, 57, 53, 0.04);
        }

        .drop-zone-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }
        .drop-zone-meta {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .file-list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .file-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.75rem;
          background: rgba(255,255,255,0.02);
          border-left: 2px solid var(--text-red);
          font-family: var(--font-mono);
          font-size: 0.8rem;
        }
        .file-row .name { color: var(--text-white); }
        .file-row .size { color: var(--text-muted); margin: 0 1rem; flex: 0; }
        .file-remove {
          background: none; border: none; cursor: pointer;
          color: var(--text-muted);
          font-family: var(--font-mono); font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .file-remove:hover { color: var(--text-red); }

        .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        @media (max-width: 720px) { .row-2 { grid-template-columns: 1fr; } }

        .consent {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          font-size: 0.85rem;
          color: rgba(244, 244, 242, 0.7);
          line-height: 1.5;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .consent input { margin-top: 0.2rem; accent-color: var(--text-red); }

        .submit-bar {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-muted);
        }

        .btn-submit {
          background: var(--text-red);
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-submit:hover { background: #cc2e2a; }
        .btn-submit:disabled { background: #333; color: #777; cursor: not-allowed; }

        .submit-meta {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .submitting-state {
          padding: 6rem 4rem;
          max-width: 920px;
          margin: 0 auto;
          text-align: center;
        }

        .submitting-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 3rem);
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .submitting-stage {
          font-family: var(--font-mono);
          font-size: 0.9rem;
          color: var(--text-red);
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .submitting-help {
          font-size: 0.95rem;
          color: rgba(244, 244, 242, 0.6);
          line-height: 1.6;
          max-width: 560px;
          margin: 0 auto;
        }

        .error-banner {
          background: rgba(230, 57, 53, 0.08);
          border-left: 2px solid var(--text-red);
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          font-family: var(--font-mono);
          font-size: 0.85rem;
          color: var(--text-red);
          line-height: 1.5;
        }

        @media (max-width: 720px) {
          .intake-nav { padding: 1.5rem 1.5rem; }
          .intake-main { padding: 2.5rem 1.5rem 4rem; }
          .submitting-state { padding: 4rem 1.5rem; }
        }
      `}</style>

      <div className="intake-shell">
        <nav className="intake-nav">
          <button className="logo" onClick={() => navigate('/')}>PREMOTION<span className="dot">.</span></button>
          <div className="intake-meta">
            <span className="pulse-dot"></span>
            {submitting ? 'Pipeline running' : 'Stress-test a case'}
          </div>
        </nav>

        {!submitting ? (
          <main className="intake-main">
            <div className="page-eyebrow">PHASE 01 // INTAKE</div>
            <h1 className="page-title">Drop your case.<br /><span className="red">Get the brief.</span></h1>
            <p className="page-sub">
              Upload contracts, witness statements, pleadings, correspondence — whatever you've got. Paste your position and strategy in your own words. Hit submit. Three minutes later you have a brief.
            </p>

            {error && <div className="error-banner">{error}</div>}

            <div className="field-group">
              <label className="field-label">Case title</label>
              <input
                className="input"
                placeholder="e.g. Smith v Acme Corp — Breach of NDA"
                value={form.title}
                onChange={(e) => update({ title: e.target.value })}
              />
            </div>

            <div className="field-group">
              <label className="field-label">Case files <span style={{textTransform: 'none', letterSpacing: 'normal', color: 'rgba(244,244,242,0.4)'}}>(PDF · DOCX · TXT — up to 15 files, 10 MB each)</span></label>
              <div
                className={`drop-zone${dragOver ? ' drag-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="drop-zone-title">Drop files here</div>
                <div className="drop-zone-meta">or click to browse</div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_MIME}
                  style={{ display: 'none' }}
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>
              {evidence.length > 0 && (
                <div className="file-list">
                  {evidence.map((f, i) => (
                    <div key={i} className="file-row">
                      <span className="name">{f.name}</span>
                      <span className="size">{(f.size / 1024).toFixed(0)}KB</span>
                      <button className="file-remove" onClick={() => removeFile(i)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="field-group">
              <label className="field-label">Your case</label>
              <textarea
                className="textarea"
                placeholder="What happened, who's involved, what you plan to argue or file. Paste your position, your strategy, the dispute — whatever you've got. The agents will work out the rest."
                value={form.case_text}
                onChange={(e) => update({ case_text: e.target.value })}
              />
              <div className="field-hint">
                Optional if you've uploaded files. Recommended if not — gives the agents your framing as well as the evidence.
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="you@firm.co.uk"
                value={form.email}
                onChange={(e) => update({ email: e.target.value })}
              />
              <div className="field-hint">
                We don't store this beyond delivering the brief. No mailing list.
              </div>
            </div>

            <label className="consent">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update({ consent: e.target.checked })}
              />
              <span>
                I understand Premotion is an informational stress test, not legal advice. The decision on what to file or argue remains with the instructed solicitor.
              </span>
            </label>

            <div className="submit-bar">
              <button className="btn-submit" disabled={!canSubmit} onClick={submit}>
                Run the pipeline →
              </button>
              <div className="submit-meta">
                Roughly 2-3 minutes · 7 LLM calls · Claude Sonnet + Opus
              </div>
            </div>
          </main>
        ) : (
          <main className="submitting-state">
            <div className="page-eyebrow">PIPELINE RUNNING</div>
            <h2 className="submitting-title">Stress-testing your case.</h2>
            <div className="submitting-stage">{STAGE_MESSAGES[stageIdx]}</div>
            <p className="submitting-help">
              Eight specialists are reading your file and working backwards from a hypothetical loss. The brief lands in roughly 2-3 minutes. Don't close this tab.
            </p>
          </main>
        )}
      </div>
    </div>
  );
};

export default IntakeFlow;
