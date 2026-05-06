import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || '';
const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

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
    if (step === 1) {
      return form.title.trim().length > 2 && form.case_type;
    }
    if (step === 2) return form.party_position.trim().length >= 80;
    if (step === 3) return form.current_strategy.trim().length >= 80;
    if (step === 4) return true; // evidence is optional but encouraged
    if (step === 5) {
      return form.consent
        && form.email.trim().length > 3
        && form.email.includes('@');
    }
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
    <div style={shellStyle}>
      <TopBar onExit={() => navigate('/')} />
      <div style={containerStyle}>
        <ProgressHeader step={step} total={TOTAL_STEPS} />

        {submitting ? (
          <LoadingCard
            title="Running the pipeline…"
            body={STAGE_MESSAGES[stageIdx]}
            sub="About 2–3 minutes total. Don't close the tab."
          />
        ) : (
          <>
            {step === 1 && <StepBasics form={form} update={update} />}
            {step === 2 && <StepPosition form={form} update={update} />}
            {step === 3 && <StepStrategy form={form} update={update} />}
            {step === 4 && <StepEvidence evidence={evidence} setEvidence={setEvidence} />}
            {step === 5 && <StepConsent form={form} update={update} evidence={evidence} />}

            {error && <div style={errorBoxStyle}>{error}</div>}

            <NavButtons
              step={step}
              total={TOTAL_STEPS}
              canProceed={canProceed()}
              onBack={back}
              onNext={next}
              onSubmit={submit}
            />
          </>
        )}
      </div>
    </div>
  );
};

// ---------- styles ----------
const shellStyle = {
  backgroundColor: '#0F0F10',
  color: '#EBEBF5',
  fontFamily,
  WebkitFontSmoothing: 'antialiased',
  minHeight: '100vh',
  width: '100vw',
};
const containerStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '32px 28px 80px',
};
const errorBoxStyle = {
  marginTop: '24px',
  padding: '14px 18px',
  backgroundColor: 'rgba(255, 69, 58, 0.06)',
  border: '1px solid rgba(255, 69, 58, 0.25)',
  color: '#FF6B5C',
  borderRadius: '8px',
  fontSize: '13px',
  lineHeight: 1.5,
};
const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'rgba(235, 235, 245, 0.55)',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '8px',
};
const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: '#1A1A1C',
  color: '#EBEBF5',
  border: '1px solid #38383A',
  borderRadius: '8px',
  fontSize: '15px',
  fontFamily,
  lineHeight: 1.5,
};
const textareaStyle = {
  ...inputStyle,
  minHeight: '200px',
  resize: 'vertical',
  lineHeight: 1.6,
};
const questionTitle = {
  fontFamily: serif,
  fontSize: 'clamp(24px, 3.2vw, 32px)',
  fontWeight: 500,
  letterSpacing: '-0.5px',
  color: '#EBEBF5',
  lineHeight: 1.2,
  marginBottom: '12px',
};
const questionHelper = {
  fontSize: '14px',
  color: 'rgba(235, 235, 245, 0.6)',
  lineHeight: 1.6,
  marginBottom: '28px',
};

// ---------- top components ----------
const TopBar = ({ onExit }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    backgroundColor: 'rgba(15, 15, 16, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
    padding: '14px 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px' }}>
      STEELMAN LITIGATION{' '}
      <span style={{ color: 'rgba(235, 235, 245, 0.5)', fontWeight: 400 }}>
        Adversarial premortem for UK litigation
      </span>
    </div>
    <button
      onClick={onExit}
      style={{
        fontSize: '12px', color: 'rgba(235, 235, 245, 0.55)',
        background: 'none', border: 'none', cursor: 'pointer', fontFamily,
      }}
    >
      Exit
    </button>
  </div>
);

const ProgressHeader = ({ step, total }) => {
  const pct = (step / total) * 100;
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'rgba(235, 235, 245, 0.5)', fontWeight: 600, marginBottom: '10px',
      }}>
        <span>Step {step} of {total}</span>
        <span>Case intake</span>
      </div>
      <div style={{
        height: '3px', backgroundColor: 'rgba(235, 235, 245, 0.08)', borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', backgroundColor: '#0A84FF',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
};

const NavButtons = ({ step, total, canProceed, onBack, onNext, onSubmit }) => {
  const isLast = step === total;
  return (
    <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button
        onClick={onBack}
        disabled={step === 1}
        style={{
          padding: '10px 18px', borderRadius: '8px',
          backgroundColor: 'transparent',
          border: '1px solid rgba(235, 235, 245, 0.12)',
          color: step === 1 ? 'rgba(235, 235, 245, 0.25)' : 'rgba(235, 235, 245, 0.75)',
          fontSize: '13px', fontWeight: 500, fontFamily,
          cursor: step === 1 ? 'default' : 'pointer',
        }}
      >
        ← Back
      </button>
      {isLast ? (
        <button
          onClick={onSubmit}
          disabled={!canProceed}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            backgroundColor: canProceed ? '#0A84FF' : 'rgba(10, 132, 255, 0.3)',
            color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 600, fontFamily,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
        >
          Run the stress test →
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            backgroundColor: canProceed ? '#0A84FF' : 'rgba(10, 132, 255, 0.3)',
            color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 600, fontFamily,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
        >
          Continue →
        </button>
      )}
    </div>
  );
};

// ---------- steps ----------
const StepBasics = ({ form, update }) => (
  <div>
    <h2 style={questionTitle}>Case basics.</h2>
    <p style={questionHelper}>
      A short header for the matter. You can stay generic about names — it's your file.
    </p>

    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>Case title</label>
      <input
        type="text"
        value={form.title}
        onChange={e => update({ title: e.target.value })}
        placeholder='e.g. "Wellington Holdings v Sterling Bank"'
        style={inputStyle}
      />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
      <div>
        <label style={labelStyle}>Jurisdiction</label>
        <input
          type="text"
          value={form.jurisdiction}
          onChange={e => update({ jurisdiction: e.target.value })}
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Case type</label>
        <select
          value={form.case_type}
          onChange={e => update({ case_type: e.target.value })}
          style={inputStyle}
        >
          {CASE_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </div>

    <div>
      <label style={labelStyle}>Are you the claimant or the defendant? (optional)</label>
      <input
        type="text"
        value={form.party_position_role}
        onChange={e => update({ party_position_role: e.target.value })}
        placeholder='e.g. "Claimant — instructed by Wellington Holdings"'
        style={inputStyle}
      />
    </div>
  </div>
);

const StepPosition = ({ form, update }) => (
  <div>
    <h2 style={questionTitle}>Your party's position.</h2>
    <p style={questionHelper}>
      What is your client's position? What did they do, what was done to them, what are they seeking? Be specific — dates, named individuals, sums. The more concrete, the sharper the stress test.
    </p>
    <textarea
      value={form.party_position}
      onChange={e => update({ party_position: e.target.value })}
      placeholder="On 14 March 2024, our client entered a £12M facility with… The covenant alleged to have been waived was…"
      style={{ ...textareaStyle, minHeight: '240px' }}
    />
    <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.45)', marginTop: '8px', textAlign: 'right' }}>
      {form.party_position.trim().length} characters {form.party_position.trim().length < 80 && `· ${80 - form.party_position.trim().length} more to unlock`}
    </div>
  </div>
);

const StepStrategy = ({ form, update }) => (
  <div>
    <h2 style={questionTitle}>Your current strategy.</h2>
    <p style={questionHelper}>
      How are you approaching this now? What would you file or argue if you ran it as-is today? This is what gets stress-tested. Don't sanitise — write the strategy, not the diplomatic version of it.
    </p>
    <textarea
      value={form.current_strategy}
      onChange={e => update({ current_strategy: e.target.value })}
      placeholder="We intend to plead breach of contract on the basis that the RM email of 17 May constituted a binding waiver. We'll rely on Yam Seng…"
      style={{ ...textareaStyle, minHeight: '240px' }}
    />
    <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.45)', marginTop: '8px', textAlign: 'right' }}>
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
      toAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        upload_type: 'document',
        label: '',
      });
    }
    if (toAdd.length) setEvidence([...evidence, ...toAdd]);
  };

  const removeAt = (id) => setEvidence(evidence.filter(e => e.id !== id));
  const updateAt = (id, patch) =>
    setEvidence(evidence.map(e => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div>
      <h2 style={questionTitle}>Evidence.</h2>
      <p style={questionHelper}>
        Drop in pleadings, contracts, emails, witness statements, correspondence — whatever the file contains. PDF, DOCX, TXT for V1. Up to {MAX_FILES} files, 10 MB each.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current && inputRef.current.click()}
        style={{
          border: `1.5px dashed ${dragOver ? '#0A84FF' : '#38383A'}`,
          borderRadius: '10px',
          padding: '44px 24px',
          textAlign: 'center',
          backgroundColor: dragOver ? 'rgba(10, 132, 255, 0.05)' : '#141416',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ fontSize: '15px', color: '#EBEBF5', fontWeight: 500, marginBottom: '8px' }}>
          Drop files here, or click to choose
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.5)' }}>
          PDF · DOCX · TXT · max 10 MB each · max {MAX_FILES} files
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
          style={{ display: 'none' }}
        />
      </div>

      {evidence.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {evidence.map(ev => (
            <div
              key={ev.id}
              style={{
                padding: '14px 16px', backgroundColor: '#1A1A1C',
                border: '1px solid rgba(235, 235, 245, 0.06)',
                borderRadius: '10px',
                display: 'grid', gridTemplateColumns: '1fr 180px auto',
                gap: '12px', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px', wordBreak: 'break-word' }}>
                  {ev.file.name}
                  <span style={{ color: 'rgba(235, 235, 245, 0.4)', fontWeight: 400, marginLeft: '8px', fontSize: '11px' }}>
                    {(ev.file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <input
                  type="text"
                  value={ev.label}
                  onChange={(e) => updateAt(ev.id, { label: e.target.value })}
                  placeholder="Label (optional) — e.g. 'RM email of 17 May'"
                  style={{
                    ...inputStyle, padding: '8px 10px', fontSize: '12px',
                    backgroundColor: '#141416',
                  }}
                />
              </div>
              <select
                value={ev.upload_type}
                onChange={(e) => updateAt(ev.id, { upload_type: e.target.value })}
                style={{
                  ...inputStyle, padding: '8px 10px', fontSize: '12px',
                  backgroundColor: '#141416',
                }}
              >
                {EVIDENCE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <button
                onClick={() => removeAt(ev.id)}
                style={{
                  fontSize: '12px', color: 'rgba(255, 107, 92, 0.9)',
                  background: 'none', border: '1px solid rgba(255, 107, 92, 0.3)',
                  padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(235, 235, 245, 0.5)' }}>
        Evidence is optional but it makes the stress test substantially sharper. Without it the premortem reasons abstractly.
      </div>
    </div>
  );
};

const StepConsent = ({ form, update, evidence }) => (
  <div>
    <h2 style={questionTitle}>Consent &amp; submit.</h2>
    <p style={questionHelper}>
      Last step. We'll email you when the brief is ready in case you want to come back to it.
    </p>

    <div style={{
      backgroundColor: '#1A1A1C',
      border: '1px solid rgba(235, 235, 245, 0.06)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    }}>
      <SummaryRow label="Case" value={form.title || '—'} />
      <SummaryRow label="Jurisdiction" value={form.jurisdiction || '—'} />
      <SummaryRow label="Type" value={(CASE_TYPES.find(c => c.value === form.case_type) || {}).label || form.case_type} />
      <SummaryRow label="Position" value={`${form.party_position.trim().length} characters`} />
      <SummaryRow label="Strategy" value={`${form.current_strategy.trim().length} characters`} />
      <SummaryRow
        label="Evidence"
        value={evidence.length === 0 ? 'None uploaded' : `${evidence.length} file${evidence.length === 1 ? '' : 's'}`}
        last
      />
    </div>

    <div style={{ marginBottom: '20px' }}>
      <label style={labelStyle}>Email</label>
      <input
        type="email"
        value={form.email}
        onChange={e => update({ email: e.target.value })}
        placeholder="you@firm.com"
        style={inputStyle}
      />
    </div>

    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
      padding: '16px 18px', backgroundColor: '#141416',
      border: '1px solid rgba(235, 235, 245, 0.08)', borderRadius: '10px',
    }}>
      <input
        type="checkbox"
        checked={form.consent}
        onChange={(e) => update({ consent: e.target.checked })}
        style={{ marginTop: '3px', accentColor: '#0A84FF', width: '16px', height: '16px' }}
      />
      <span style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.75)', lineHeight: 1.6 }}>
        I understand this is an informational stress test, not legal advice. I remain responsible for any decisions about this matter.
      </span>
    </label>
  </div>
);

const SummaryRow = ({ label, value, last }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '160px 1fr',
    padding: '10px 0',
    borderBottom: last ? 'none' : '1px solid rgba(235, 235, 245, 0.05)',
    fontSize: '13px',
    gap: '12px',
  }}>
    <div style={{
      color: 'rgba(235, 235, 245, 0.5)',
      textTransform: 'uppercase', letterSpacing: '0.8px',
      fontSize: '11px', fontWeight: 600, paddingTop: '2px',
    }}>
      {label}
    </div>
    <div style={{ color: '#EBEBF5', wordBreak: 'break-word' }}>{value}</div>
  </div>
);

const LoadingCard = ({ title, body, sub }) => (
  <div style={{
    padding: '64px 32px', textAlign: 'center',
    backgroundColor: '#1A1A1C',
    border: '1px solid rgba(235, 235, 245, 0.06)',
    borderRadius: '14px', marginTop: '20px',
  }}>
    <div style={{
      width: '32px', height: '32px', margin: '0 auto 24px',
      border: '2px solid rgba(235, 235, 245, 0.1)',
      borderTopColor: '#0A84FF',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <div style={{
      fontFamily: serif, fontSize: '22px', fontWeight: 500,
      color: '#EBEBF5', marginBottom: '14px', letterSpacing: '-0.3px',
    }}>
      {title}
    </div>
    <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.78)', lineHeight: 1.6, maxWidth: '460px', margin: '0 auto' }}>
      {body}
    </div>
    {sub && (
      <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.4)', marginTop: '16px' }}>
        {sub}
      </div>
    )}
  </div>
);

export default IntakeFlow;
