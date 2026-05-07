import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getDemoBrief } from '../data/demoBriefs.js';

const API_BASE = import.meta.env.VITE_API_URL || '';
const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const shellStyle = {
  backgroundColor: '#111111',
  color: '#F4F4F2',
  fontFamily,
  WebkitFontSmoothing: 'antialiased',
  minHeight: '100vh',
  width: '100vw',
};

const containerStyle = {
  maxWidth: '880px',
  margin: '0 auto',
  padding: '32px 28px 80px',
};

const panelStyle = {
  backgroundColor: '#1A1A1A',
  border: '1px solid rgba(244, 244, 242, 0.06)',
  borderRadius: '14px',
  padding: '28px 30px',
  marginBottom: '20px',
};

const sectionEyebrow = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px',
  color: 'rgba(244, 244, 242, 0.4)', fontWeight: 600, marginBottom: '12px',
  fontFamily: "'JetBrains Mono', monospace",
};

const sectionTitle = {
  fontFamily: "'Oswald', sans-serif", fontSize: '24px', fontWeight: 500,
  letterSpacing: '1px', textTransform: 'uppercase', color: '#F4F4F2', marginBottom: '18px',
  lineHeight: 1.25,
};

const paragraph = {
  fontSize: '15px', color: 'rgba(244, 244, 242, 0.78)',
  lineHeight: 1.75, marginBottom: '14px',
};

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
};

const VERDICT_STYLES = {
  steelman: { label: 'Steelman', bg: 'rgba(0, 255, 65, 0.12)', border: 'rgba(0, 255, 65, 0.5)', color: '#00FF41' },
  strawman: { label: 'Strawman', bg: 'rgba(230, 57, 53, 0.12)', border: 'rgba(230, 57, 53, 0.5)', color: '#E63935' },
  borderline: { label: 'Borderline', bg: 'rgba(255, 159, 10, 0.12)', border: 'rgba(255, 159, 10, 0.5)', color: '#FFB340' },
};

const CATEGORY_LABEL = {
  procedural: 'Procedural',
  substantive: 'Substantive',
  evidentiary: 'Evidentiary',
  strategic: 'Strategic',
};

const CATEGORY_ACCENT = {
  procedural: '#E63935',
  substantive: '#BF5AF2',
  evidentiary: '#FF9F0A',
  strategic: '#00FF41',
};

const SEVERITY_COLOR = {
  high: '#E63935',
  medium: '#FFB340',
  low: 'rgba(244, 244, 242, 0.55)',
};

const BriefPage = ({ isDemo: isDemoProp = false }) => {
  const { caseId, demoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isDemo = isDemoProp || location.pathname.startsWith('/demo/');
  const id = isDemo ? demoId : caseId;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isDemo) {
      const demo = getDemoBrief(id);
      if (demo) {
        setData(demo);
        setLoading(false);
      } else {
        setError('Demo not found');
        setLoading(false);
      }
      return;
    }

    let mounted = true;
    const load = async () => {
      try {
        const endpoint = `${API_BASE}/api/cases/${id}`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const j = await res.json();
        if (mounted) {
          setData(j);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || String(e));
          setLoading(false);
        }
      }
    };
    load();
    return () => { mounted = false; };
  }, [id, isDemo]);

  if (loading) {
    return (
      <div style={shellStyle}>
        <TopBar onExit={() => navigate('/')} />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(244, 244, 242, 0.6)' }}>
            Loading the brief…
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={shellStyle}>
        <TopBar onExit={() => navigate('/')} />
        <div style={containerStyle}>
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#E63935' }}>
            Couldn't load this brief — {error || 'not found'}.
          </div>
        </div>
      </div>
    );
  }

  const brief = data.brief || {};
  const title = data.title || 'Stress-test brief';
  const status = data.status;

  if (status !== 'brief_ready' || !brief) {
    return (
      <div style={shellStyle}>
        <TopBar onExit={() => navigate('/')} />
        <div style={containerStyle}>
          <div style={{ ...panelStyle, textAlign: 'center', padding: '64px 32px' }}>
            <div style={{ fontFamily: serif, fontSize: '24px', marginBottom: '10px' }}>
              Still running…
            </div>
            <div style={{ color: 'rgba(244, 244, 242, 0.6)', fontSize: '14px' }}>
              Status: {status}. Refresh in a moment.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const verdictKey = (brief.verdict || '').toLowerCase();
  const verdictStyle = VERDICT_STYLES[verdictKey] || VERDICT_STYLES.borderline;

  // Group failure scenarios by category
  const scenariosByCategory = {};
  (brief.failure_scenarios || []).forEach(s => {
    const cat = (s.category || 'strategic').toLowerCase();
    if (!scenariosByCategory[cat]) scenariosByCategory[cat] = [];
    scenariosByCategory[cat].push(s);
  });
  const orderedCategories = ['procedural', 'substantive', 'evidentiary', 'strategic']
    .filter(c => scenariosByCategory[c] && scenariosByCategory[c].length);

  return (
    <div style={shellStyle}>
      <TopBar onExit={() => navigate('/')} onPrint={() => window.print()} />

      <div style={containerStyle}>
        {isDemo && <DemoBanner onStart={() => navigate('/start')} />}

        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '11px', letterSpacing: '1.8px', textTransform: 'uppercase',
            fontWeight: 700, color: '#E63935', marginBottom: '14px',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {isDemo ? 'Example stress-test brief' : 'Stress-test brief'}
          </div>
          <h1 style={{
            fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: '#F4F4F2',
            lineHeight: 1.15, marginBottom: '14px',
          }}>
            {title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 14px', borderRadius: '999px',
              backgroundColor: verdictStyle.bg,
              border: `1px solid ${verdictStyle.border}`,
              color: verdictStyle.color,
              fontSize: '13px', fontWeight: 700, letterSpacing: '0.4px',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Verdict · {verdictStyle.label}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(244, 244, 242, 0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
              {data.jurisdiction || 'England & Wales'} · Generated {formatDate(data.generated_at || data.updated_at)}
            </div>
          </div>
          {brief.verdict_reasoning && (
            <div style={{ marginTop: '14px', fontSize: '15px', color: 'rgba(244, 244, 242, 0.78)', lineHeight: 1.6, maxWidth: '720px' }}>
              {brief.verdict_reasoning}
            </div>
          )}
        </div>

        {/* Summary */}
        {brief.summary && (
          <Section eyebrow="Summary" title="What we found on this matter">
            <Paragraphs text={brief.summary} />
          </Section>
        )}

        {/* Failure scenarios — grouped */}
        {orderedCategories.length > 0 && (
          <Section eyebrow="Failure scenarios" title="Where this case could go wrong">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {orderedCategories.map(cat => (
                <CategoryGroup
                  key={cat}
                  title={CATEGORY_LABEL[cat] || cat}
                  accent={CATEGORY_ACCENT[cat] || '#E63935'}
                  scenarios={scenariosByCategory[cat]}
                />
              ))}
            </div>
          </Section>
        )}

        {/* Evidence inconsistencies */}
        {Array.isArray(brief.evidence_inconsistencies) && brief.evidence_inconsistencies.length > 0 && (
          <Section eyebrow="Evidence inconsistencies" title="Where the documentary record doesn't line up">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {brief.evidence_inconsistencies.map((it, i) => (
                <div key={i} style={{
                  padding: '14px 16px',
                  backgroundColor: '#141414',
                  border: '1px solid rgba(244, 244, 242, 0.05)',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ fontSize: '14px', color: '#F4F4F2', fontWeight: 600, lineHeight: 1.4 }}>
                      {it.claim}
                    </div>
                    <SeverityPill level={it.severity} />
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(244, 244, 242, 0.68)', lineHeight: 1.6 }}>
                    {it.issue}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Blind spots */}
        {Array.isArray(brief.blind_spots) && brief.blind_spots.length > 0 && (
          <Section eyebrow="Blind spots" title="What the optimistic case is missing">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {brief.blind_spots.map((bs, i) => (
                <li key={i} style={{
                  paddingLeft: '20px', position: 'relative',
                  fontSize: '15px', color: 'rgba(244, 244, 242, 0.78)', lineHeight: 1.65,
                }}>
                  <span style={{
                    position: 'absolute', left: '0', top: '8px',
                    width: '8px', height: '8px', backgroundColor: '#BF5AF2',
                    borderRadius: '50%',
                  }} />
                  {bs}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* If we lose this — standout */}
        {brief.if_we_lose_this_will_be_why && (
          <div style={{
            ...panelStyle,
            backgroundColor: 'rgba(230, 57, 53, 0.06)',
            borderColor: 'rgba(230, 57, 53, 0.2)',
          }}>
            <div style={{ ...sectionEyebrow, color: '#E63935' }}>If we lose this, this will be why</div>
            <div style={{
              fontFamily: serif, fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 500,
              fontStyle: 'italic',
              letterSpacing: '-0.3px', color: '#F4F4F2', lineHeight: 1.4,
            }}>
              "{brief.if_we_lose_this_will_be_why}"
            </div>
          </div>
        )}

        <div style={{
          marginTop: '40px', padding: '20px 0',
          borderTop: '1px solid rgba(244, 244, 242, 0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(244, 244, 242, 0.45)', maxWidth: '560px', lineHeight: 1.6 }}>
            Premotion is an informational stress test, not legal advice. The decision on what to file or argue remains with the instructed solicitor.
          </div>
          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 18px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(244, 244, 242, 0.15)',
              color: '#F4F4F2',
              borderRadius: '2px', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', fontFamily,
            }}
          >
            Save brief as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const DemoBanner = ({ onStart }) => (
  <div style={{
    backgroundColor: 'rgba(255, 159, 10, 0.08)',
    border: '1px solid rgba(255, 159, 10, 0.35)',
    borderLeft: '3px solid #FF9F0A',
    borderRadius: '10px',
    padding: '16px 20px',
    marginBottom: '28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '20px', flexWrap: 'wrap',
  }}>
    <div style={{ fontSize: '13px', color: '#F4F4F2', lineHeight: 1.55, maxWidth: '600px' }}>
      <strong style={{ color: '#FFB340' }}>This is an example brief.</strong> Real cases use your own evidence and your own current strategy.
    </div>
    <button
      onClick={onStart}
      style={{
        padding: '9px 16px', borderRadius: '2px',
        backgroundColor: '#E63935', color: 'white', border: 'none',
        fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily,
        whiteSpace: 'nowrap',
      }}
    >
      Stress-test your case →
    </button>
  </div>
);

const Section = ({ eyebrow, title, children }) => (
  <div style={panelStyle}>
    <div style={sectionEyebrow}>{eyebrow}</div>
    <div style={sectionTitle}>{title}</div>
    {children}
  </div>
);

const Paragraphs = ({ text }) => {
  const blocks = (text || '').split(/\n\s*\n/).filter(Boolean);
  if (blocks.length === 0) return null;
  return (
    <>
      {blocks.map((b, i) => (
        <div key={i} style={paragraph}>
          {b.split('\n').map((line, j) => (
            <React.Fragment key={j}>
              {line}
              {j < b.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      ))}
    </>
  );
};

const CategoryGroup = ({ title, accent, scenarios }) => (
  <div>
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.4px',
      color: accent, fontWeight: 700, marginBottom: '12px',
    }}>
      <span style={{ width: '6px', height: '6px', backgroundColor: accent, borderRadius: '50%' }} />
      {title}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {scenarios.map((s, i) => (
        <div key={i} style={{
          padding: '16px 18px',
          backgroundColor: '#141414',
          border: '1px solid rgba(244, 244, 242, 0.05)',
          borderRadius: '10px',
          paddingLeft: '22px', position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: '8px', top: '18px', bottom: '18px',
            width: '3px', backgroundColor: accent, borderRadius: '2px',
          }} />
          <div style={{ fontSize: '14px', color: '#F4F4F2', fontWeight: 600, lineHeight: 1.45, marginBottom: '8px' }}>
            {s.scenario}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {s.probability && <Pill label="Probability" value={s.probability} />}
            {s.impact && <Pill label="Impact" value={s.impact} />}
          </div>
          {s.mitigation && (
            <div style={{ fontSize: '13px', color: 'rgba(244, 244, 242, 0.7)', lineHeight: 1.6 }}>
              <strong style={{ color: 'rgba(244, 244, 242, 0.9)', fontWeight: 600 }}>Mitigation: </strong>
              {s.mitigation}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const Pill = ({ label, value }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '3px 8px', borderRadius: '999px',
    backgroundColor: 'rgba(244, 244, 242, 0.05)',
    border: '1px solid rgba(244, 244, 242, 0.08)',
    fontSize: '11px', color: 'rgba(244, 244, 242, 0.7)',
    textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
  }}>
    {label}: <span style={{ color: '#F4F4F2', fontWeight: 700 }}>{value}</span>
  </span>
);

const SeverityPill = ({ level }) => {
  const key = (level || 'low').toLowerCase();
  const color = SEVERITY_COLOR[key] || SEVERITY_COLOR.low;
  return (
    <span style={{
      display: 'inline-flex', padding: '3px 10px', borderRadius: '999px',
      backgroundColor: 'rgba(244, 244, 242, 0.04)',
      border: `1px solid ${color}55`,
      fontFamily: "'JetBrains Mono', monospace",
      color, fontSize: '11px', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.6px',
      whiteSpace: 'nowrap',
    }}>
      {key}
    </span>
  );
};

const TopBar = ({ onExit, onPrint }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    backgroundColor: 'rgba(17, 17, 17, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(244, 244, 242, 0.06)',
    padding: '14px 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px' }}>
      PREMOTION{' '}
      <span style={{ color: 'rgba(244, 244, 242, 0.5)', fontWeight: 400 }}>
        Adversarial premortem for UK litigation
      </span>
    </div>
    <div style={{ display: 'flex', gap: '12px' }}>
      {onPrint && (
        <button
          onClick={onPrint}
          style={{
            fontSize: '12px', color: 'rgba(244, 244, 242, 0.75)',
            background: 'none', border: '1px solid rgba(244, 244, 242, 0.15)',
            padding: '6px 14px', borderRadius: '2px', cursor: 'pointer', fontFamily,
          }}
        >
          Save as PDF
        </button>
      )}
      <button
        onClick={onExit}
        style={{
          fontSize: '12px', color: 'rgba(244, 244, 242, 0.55)',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily,
        }}
      >
        Home
      </button>
    </div>
  </div>
);

export default BriefPage;
