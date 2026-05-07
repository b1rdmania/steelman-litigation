import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';
const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];
const ACCEPTED_MIME = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 15;

const EVIDENCE_TYPES = [
  { value: 'contract', label: 'Contract' },
  { value: 'email', label: 'Email' },
  { value: 'pleading', label: 'Pleading' },
  { value: 'witness_statement', label: 'Witness statement' },
  { value: 'correspondence', label: 'Correspondence' },
  { value: 'document', label: 'Document' },
  { value: 'other', label: 'Other' },
];

const CASE_TYPES = [
  { value: 'contract', label: 'Contract dispute' },
  { value: 'employment', label: 'Employment' },
  { value: 'ip', label: 'IP' },
  { value: 'property', label: 'Property' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
];

const TOTAL_STEPS = 5;

const initialForm = {
  title: '',
  jurisdiction: 'England & Wales',
  case_type: 'contract',
  party_position_role: '',
  party_position: '',
  current_strategy: '',
  email: '',
  consent: false,
};

const STAGE_MESSAGES = [
  'Stage 1 · Optimistic Analyst — building the strongest version of your case…',
  'Stage 2 · Evidence Inspector — three sub-agents reading the file in parallel…',
  'Stage 3 · Premortem Adversary — four Opus sub-agents working back from a hypothetical loss…',
  'Stage 4 · Synthesizer — diffing the optimistic and adversarial takes, drafting the brief…',
];

const IntakeFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [evidence, setEvidence] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [stageIdx, setStageIdx] = useState(0);

  // Rotate stage message every 30s during submit
  useEffect(() => {
    if (!submitting) return;
    const t = setInterval(() => {
      setStageIdx(s => Math.min(STAGE_MESSAGES.length - 1, s + 1));
    }, 30_000);
    return () => clearInterval(t);
  }, [submitting]);

  const update = (patch) => setForm(f => ({ ...f, ...patch }));

  const canProceed = () => {
    if (step === 1) return form.title.trim().length > 2 && form.case_type;
    if (step === 2) return form.party_position.trim().length >= 80;
    if (step === 3) return form.current_strategy.trim().length >= 80;
    if (step === 4) return true;
    if (step === 5) return form.consent && form.email.trim().length > 3 && form.email.includes('@');
    return true;
  };

  const next = () => {
    if (!canProceed()) return;
    setStep(s => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const back = () => {
    setStep(s => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setSubmitting(true);
    setStageIdx(0);
    setError(null);
    try {
      const body = new FormData();
      body.append('title', form.title);
      body.append('jurisdiction', form.jurisdiction);
      body.append('case_type', form.case_type);
      body.append('party_position_role', form.party_position_role || '');
      body.append('party_position', form.party_position);
      body.append('current_strategy', form.current_strategy);
      body.append('email', form.email);
      evidence.forEach(ev => {
        body.append('files', ev.file);
        body.append('file_types', ev.upload_type);
        body.append('file_labels', ev.label || '');
      });
      const res = await fetch(`${API_BASE}/api/cases`, { method: 'POST', body });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Submission failed (${res.status}): ${txt || 'unknown error'}`);
      }
      const data = await res.json();
      navigate(`/brief/${data.case_id}`);
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
          --text-muted: #444444;
          --border-muted: #222222;

          --font-display: 'Oswald', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          --space-xs: 0.5rem;
          --space-sm: 1rem;
          --space-md: 2rem;
          --space-lg: 4rem;
          --space-xl: 8rem;
        }

        .intake-shell {
          background-color: var(--bg-color);
          color: var(--text-white);
          font-family: var(--font-body);
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          -webkit-font-smoothing: antialiased;
        }

        .intake-shell.submitting {
          height: auto;
          overflow: auto;
        }

        .watermark-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          pointer-events: none;
          opacity: 0.03;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .display-huge {
          font-family: var(--font-display);
          font-size: clamp(6rem, 15vw, 18rem);
          line-height: 0.85;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin: 0;
          white-space: nowrap;
        }

        .intake-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          position: relative;
          z-index: 100;
          border-bottom: 1px solid var(--border-muted);
        }

        .logo {
          font-family: var(--font-display);
          font-size: 2.5rem;
          line-height: 1;
          text-transform: lowercase;
          letter-spacing: -0.05em;
          color: var(--text-white);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
        }

        .logo .dot {
          color: var(--text-red);
          font-size: 1.5rem;
        }

        .status-badge {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-white);
        }

        .pulse {
          width: 6px;
          height: 6px;
          background-color: var(--text-red);
          border-radius: 50%;
          animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        .intake-main {
          flex: 1;
          display: grid;
          grid-template-columns: 350px 1fr;
          z-index: 10;
          overflow: hidden;
        }

        .intake-sidebar {
          border-right: 1px solid var(--border-muted);
          padding: var(--space-md) var(--space-lg);
          display: flex;
          flex-direction: column;
          gap: var(--space-lg);
          overflow-y: auto;
        }

        .terminal-container {
          padding: var(--space-xl) var(--space-lg);
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          overflow-y: auto;
        }

        .terminal-cursor {
          width: 4rem;
          height: 6rem;
          background-color: var(--text-red);
          display: inline-block;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }

        .log-container {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          line-height: 1.6;
          color: #888;
          max-width: 600px;
        }

        .log-entry {
          margin-bottom: 4px;
          display: flex;
          gap: var(--space-sm);
        }

        .log-timestamp {
          color: var(--text-muted);
          min-width: 85px;
        }

        .log-content.active { color: var(--text-white); }
        .log-content.highlight { color: var(--text-red); }

        .label-meta {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #666;
          margin-bottom: var(--space-sm);
          display: block;
        }

        .file-stack {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .file-pill {
          background: #1a1a1a;
          padding: 8px 12px;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          border-left: 2px solid var(--text-red);
          display: flex;
          justify-content: space-between;
        }

        .intake-footer {
          padding: var(--space-sm) var(--space-lg);
          border-top: 1px solid var(--border-muted);
          display: flex;
          justify-content: space-between;
          background: #0a0a0a;
          z-index: 100;
        }

        .footer-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .step-form-area {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .question-title {
          font-family: var(--font-display);
          font-size: clamp(24px, 3.2vw, 32px);
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--text-white);
          line-height: 1.2;
          margin-bottom: 12px;
        }

        .question-helper {
          font-size: 14px;
          color: rgba(244, 244, 242, 0.6);
          line-height: 1.6;
          margin-bottom: 28px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          color: rgba(244, 244, 242, 0.55);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-family: var(--font-mono);
        }

        .field-input {
          width: 100%;
          padding: 12px 14px;
          background-color: #1A1A1A;
          color: var(--text-white);
          border: 1px solid #2A2A2A;
          font-size: 15px;
          font-family: var(--font-body);
          line-height: 1.5;
        }

        .field-textarea {
          width: 100%;
          padding: 12px 14px;
          background-color: #1A1A1A;
          color: var(--text-white);
          border: 1px solid #2A2A2A;
          font-size: 15px;
          font-family: var(--font-body);
          line-height: 1.6;
          min-height: 200px;
          resize: vertical;
        }

        .progress-bar-wrap {
          height: 3px;
          background-color: rgba(244, 244, 242, 0.08);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background-color: var(--text-red);
          transition: width 0.3s ease;
        }

        .nav-btn-back {
          padding: 10px 18px;
          background-color: transparent;
          border: 1px solid rgba(244, 244, 242, 0.12);
          font-size: 13px;
          font-weight: 500;
          font-family: var(--font-body);
          cursor: pointer;
        }

        .nav-btn-next {
          padding: 12px 24px;
          color: white;
          border: none;
          font-size: 14px;
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
        }

        .error-box {
          margin-top: 24px;
          padding: 14px 18px;
          background-color: rgba(230, 57, 53, 0.06);
          border: 1px solid rgba(230, 57, 53, 0.25);
          color: var(--text-red);
          font-size: 13px;
          line-height: 1.5;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className={`intake-shell${submitting ? ' submitting' : ''}`} style={{position: 'relative'}}>
        <div className="watermark-container">
          <h1 className="display-huge">BREAK YOUR</h1>
          <h1 className="display-huge">OWN CASE</h1>
        </div>

        <nav className="intake-nav">
          <button className="logo" onClick={() => navigate('/')}>p<span className="dot">.</span></button>
          <div className="status-badge">
            <div className="pulse"></div>
            {submitting ? 'ANALYSIS IN PROGRESS' : 'INITIALIZING ADVERSARIAL AGENTS'}
          </div>
        </nav>

        {submitting ? (
          <div style={{padding: 'var(--space-xl) var(--space-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh'}}>
            <div className="terminal-cursor"></div>
            <div className="log-container" style={{marginTop: 'var(--space-lg)'}}>
              <div className="log-entry">
                <span className="log-timestamp">[SYS]</span>
                <span className="log-content active">{STAGE_MESSAGES[stageIdx]}</span>
              </div>
              <div className="log-entry">
                <span className="log-timestamp">[SYS]</span>
                <span className="log-content">About 2–3 minutes total. Do not close the tab.</span>
              </div>
              <div className="log-entry">
                <span className="log-timestamp">[SYS]</span>
                <span className="log-content highlight">DO NOT REFRESH. ANALYSIS IN PROGRESS. <span style={{color: 'var(--text-red)'}}>_</span></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="intake-main">
            <aside className="intake-sidebar">
              <div>
                <span className="label-meta">UPLOADED CORPUS</span>
                <div className="file-stack">
                  {evidence.length === 0 ? (
                    <div className="file-pill">
                      <span style={{color: '#444'}}>No files uploaded yet</span>
                      <span style={{color: '#444'}}>PENDING</span>
                    </div>
                  ) : (
                    evidence.map(ev => (
                      <div className="file-pill" key={ev.id}>
                        <span>{ev.file.name}</span>
                        <span style={{color: '#444'}}>READY</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <span className="label-meta">SYSTEM METRICS</span>
                <div style={{fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span>STEP</span>
                    <span style={{color: 'var(--text-red)'}}>{step} / {TOTAL_STEPS}</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span>NEURAL_NET</span>
                    <span>STABLE</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <span>THREAT_ENGINE</span>
                    <span>WARMING...</span>
                  </div>
                </div>
                <div className="progress-bar-wrap" style={{marginTop: '12px'}}>
                  <div className="progress-bar-fill" style={{width: `${(step / TOTAL_STEPS) * 100}%`}} />
                </div>
              </div>
            </aside>

            <section className="terminal-container">
              <div style={{marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(244, 244, 242, 0.5)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace"}}>
                <span>Step {step} of {TOTAL_STEPS}</span>
                <span>Case intake</span>
              </div>

              <div className="step-form-area">
                {step === 1 && <StepBasics form={form} update={update} />}
                {step === 2 && <StepPosition form={form} update={update} />}
                {step === 3 && <StepStrategy form={form} update={update} />}
                {step === 4 && <StepEvidence evidence={evidence} setEvidence={setEvidence} />}
                {step === 5 && <StepConsent form={form} update={update} evidence={evidence} />}

                {error && <div className="error-box">{error}</div>}

                <div style={{marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <button
                    onClick={back}
                    disabled={step === 1}
                    className="nav-btn-back"
                    style={{color: step === 1 ? 'rgba(244, 244, 242, 0.25)' : 'rgba(244, 244, 242, 0.75)', cursor: step === 1 ? 'default' : 'pointer'}}
                  >
                    ← Back
                  </button>
                  {step === TOTAL_STEPS ? (
                    <button
                      onClick={submit}
                      disabled={!canProceed()}
                      className="nav-btn-next"
                      style={{backgroundColor: canProceed() ? '#E63935' : 'rgba(230, 57, 53, 0.3)', cursor: canProceed() ? 'pointer' : 'not-allowed'}}
                    >
                      Run the stress test →
                    </button>
                  ) : (
                    <button
                      onClick={next}
                      disabled={!canProceed()}
                      className="nav-btn-next"
                      style={{backgroundColor: canProceed() ? '#E63935' : 'rgba(230, 57, 53, 0.3)', cursor: canProceed() ? 'pointer' : 'not-allowed'}}
                    >
                      Continue →
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        <footer className="intake-footer">
          <span className="footer-label">PREMOTION // SESSION_ID: {Math.random().toString(36).slice(2, 10).toUpperCase()}</span>
          <span className="footer-label">DO NOT REFRESH. ANALYSIS IN PROGRESS.</span>
          <span className="footer-label" style={{color: 'var(--text-red)'}}>ADVERSARIAL AGENTS READY</span>
        </footer>
      </div>
    </div>
  );
};

// ---------- steps ----------
const StepBasics = ({ form, update }) => (
  <div>
    <h2 className="question-title">Case basics.</h2>
    <p className="question-helper">A short header for the matter. You can stay generic about names — it's your file.</p>
    <div style={{marginBottom: '20px'}}>
      <label className="field-label">Case title</label>
      <input type="text" value={form.title} onChange={e => update({ title: e.target.value })} placeholder='e.g. "Wellington Holdings v Sterling Bank"' className="field-input" />
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
      <div>
        <label className="field-label">Jurisdiction</label>
        <input type="text" value={form.jurisdiction} onChange={e => update({ jurisdiction: e.target.value })} className="field-input" />
      </div>
      <div>
        <label className="field-label">Case type</label>
        <select value={form.case_type} onChange={e => update({ case_type: e.target.value })} className="field-input">
          {CASE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
    </div>
    <div>
      <label className="field-label">Are you the claimant or the defendant? (optional)</label>
      <input type="text" value={form.party_position_role} onChange={e => update({ party_position_role: e.target.value })} placeholder='e.g. "Claimant — instructed by Wellington Holdings"' className="field-input" />
    </div>
  </div>
);

const StepPosition = ({ form, update }) => (
  <div>
    <h2 className="question-title">Your party's position.</h2>
    <p className="question-helper">What is your client's position? What did they do, what was done to them, what are they seeking? Be specific — dates, named individuals, sums. The more concrete, the sharper the stress test.</p>
    <textarea value={form.party_position} onChange={e => update({ party_position: e.target.value })} placeholder="On 14 March 2024, our client entered a £12M facility with… The covenant alleged to have been waived was…" className="field-textarea" style={{minHeight: '240px'}} />
    <div style={{fontSize: '12px', color: 'rgba(244, 244, 242, 0.45)', marginTop: '8px', textAlign: 'right'}}>
      {form.party_position.trim().length} characters {form.party_position.trim().length < 80 && `· ${80 - form.party_position.trim().length} more to unlock`}
    </div>
  </div>
);

const StepStrategy = ({ form, update }) => (
  <div>
    <h2 className="question-title">Your current strategy.</h2>
    <p className="question-helper">How are you approaching this now? What would you file or argue if you ran it as-is today? This is what gets stress-tested. Don't sanitise — write the strategy, not the diplomatic version of it.</p>
    <textarea value={form.current_strategy} onChange={e => update({ current_strategy: e.target.value })} placeholder="We intend to plead breach of contract on the basis that the RM email of 17 May constituted a binding waiver. We'll rely on Yam Seng…" className="field-textarea" style={{minHeight: '240px'}} />
    <div style={{fontSize: '12px', color: 'rgba(244, 244, 242, 0.45)', marginTop: '8px', textAlign: 'right'}}>
      {form.current_strategy.trim().length} characters {form.current_strategy.trim().length < 80 && `· ${80 - form.current_strategy.trim().length} more to unlock`}
    </div>
  </div>
);

const StepEvidence = ({ evidence, setEvidence }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const toAdd = [];
    for (const f of files) {
      if (evidence.length + toAdd.length >= MAX_FILES) break;
      if (f.size > MAX_FILE_SIZE) continue;
      const ext = '.' + (f.name.split('.').pop() || '').toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) continue;
      toAdd.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, file: f, upload_type: 'document', label: '' });
    }
    if (toAdd.length) setEvidence([...evidence, ...toAdd]);
  };

  const removeAt = (id) => setEvidence(evidence.filter(e => e.id !== id));
  const updateAt = (id, patch) => setEvidence(evidence.map(e => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div>
      <h2 className="question-title">Evidence.</h2>
      <p className="question-helper">Drop in pleadings, contracts, emails, witness statements, correspondence — whatever the file contains. PDF, DOCX, TXT for V1. Up to {MAX_FILES} files, 10 MB each.</p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current && inputRef.current.click()}
        style={{
          border: `1.5px dashed ${dragOver ? '#E63935' : '#2A2A2A'}`,
          padding: '44px 24px', textAlign: 'center',
          backgroundColor: dragOver ? 'rgba(230, 57, 53, 0.05)' : '#141414',
          cursor: 'pointer', transition: 'all 0.15s ease',
        }}
      >
        <div style={{fontSize: '15px', color: '#F4F4F2', fontWeight: 500, marginBottom: '8px'}}>Drop files here, or click to choose</div>
        <div style={{fontSize: '12px', color: 'rgba(244, 244, 242, 0.5)'}}>PDF · DOCX · TXT · max 10 MB each · max {MAX_FILES} files</div>
        <input ref={inputRef} type="file" multiple accept={ACCEPTED_MIME} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} style={{display: 'none'}} />
      </div>

      {evidence.length > 0 && (
        <div style={{marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          {evidence.map(ev => (
            <div key={ev.id} style={{padding: '14px 16px', backgroundColor: '#1A1A1A', border: '1px solid rgba(244, 244, 242, 0.06)', display: 'grid', gridTemplateColumns: '1fr 180px auto', gap: '12px', alignItems: 'center'}}>
              <div>
                <div style={{fontSize: '13px', fontWeight: 500, marginBottom: '8px', wordBreak: 'break-word'}}>
                  {ev.file.name}
                  <span style={{color: 'rgba(244, 244, 242, 0.4)', fontWeight: 400, marginLeft: '8px', fontSize: '11px'}}>{(ev.file.size / 1024).toFixed(0)} KB</span>
                </div>
                <input type="text" value={ev.label} onChange={(e) => updateAt(ev.id, { label: e.target.value })} placeholder="Label (optional)" className="field-input" style={{padding: '8px 10px', fontSize: '12px', backgroundColor: '#141414'}} />
              </div>
              <select value={ev.upload_type} onChange={(e) => updateAt(ev.id, { upload_type: e.target.value })} className="field-input" style={{padding: '8px 10px', fontSize: '12px', backgroundColor: '#141414'}}>
                {EVIDENCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <button onClick={() => removeAt(ev.id)} style={{fontSize: '12px', color: 'rgba(230, 57, 53, 0.9)', background: 'none', border: '1px solid rgba(230, 57, 53, 0.3)', padding: '6px 10px', cursor: 'pointer', fontFamily}}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <div style={{marginTop: '20px', fontSize: '12px', color: 'rgba(244, 244, 242, 0.5)'}}>Evidence is optional but it makes the stress test substantially sharper. Without it the premortem reasons abstractly.</div>
    </div>
  );
};

const StepConsent = ({ form, update, evidence }) => (
  <div>
    <h2 className="question-title">Consent &amp; submit.</h2>
    <p className="question-helper">Last step. We'll email you when the brief is ready in case you want to come back to it.</p>

    <div style={{backgroundColor: '#1A1A1A', border: '1px solid rgba(244, 244, 242, 0.06)', padding: '24px', marginBottom: '24px'}}>
      <SummaryRow label="Case" value={form.title || '—'} />
      <SummaryRow label="Jurisdiction" value={form.jurisdiction || '—'} />
      <SummaryRow label="Type" value={(CASE_TYPES.find(c => c.value === form.case_type) || {}).label || form.case_type} />
      <SummaryRow label="Position" value={`${form.party_position.trim().length} characters`} />
      <SummaryRow label="Strategy" value={`${form.current_strategy.trim().length} characters`} />
      <SummaryRow label="Evidence" value={evidence.length === 0 ? 'None uploaded' : `${evidence.length} file${evidence.length === 1 ? '' : 's'}`} last />
    </div>

    <div style={{marginBottom: '20px'}}>
      <label className="field-label">Email</label>
      <input type="email" value={form.email} onChange={e => update({ email: e.target.value })} placeholder="you@firm.com" className="field-input" />
    </div>

    <label style={{display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '16px 18px', backgroundColor: '#141414', border: '1px solid rgba(244, 244, 242, 0.08)'}}>
      <input type="checkbox" checked={form.consent} onChange={(e) => update({ consent: e.target.checked })} style={{marginTop: '3px', accentColor: '#E63935', width: '16px', height: '16px'}} />
      <span style={{fontSize: '13px', color: 'rgba(244, 244, 242, 0.75)', lineHeight: 1.6}}>
        I understand this is an informational stress test, not legal advice. I remain responsible for any decisions about this matter.
      </span>
    </label>
  </div>
);

const SummaryRow = ({ label, value, last }) => (
  <div style={{display: 'grid', gridTemplateColumns: '160px 1fr', padding: '10px 0', borderBottom: last ? 'none' : '1px solid rgba(244, 244, 242, 0.05)', fontSize: '13px', gap: '12px'}}>
    <div style={{color: 'rgba(244, 244, 242, 0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', fontSize: '11px', fontWeight: 600, paddingTop: '2px', fontFamily: "'JetBrains Mono', monospace"}}>{label}</div>
    <div style={{color: '#F4F4F2', wordBreak: 'break-word'}}>{value}</div>
  </div>
);

export default IntakeFlow;
