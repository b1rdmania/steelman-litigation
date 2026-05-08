import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getDemoBrief } from '../data/demoBriefs.js';

const API_BASE = import.meta.env.VITE_API_URL || '';
const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const formatDate = (iso) => {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return iso; }
};

const VERDICT_STYLES = {
  steelman: { label: 'Steelman', bg: 'rgba(0, 255, 65, 0.12)', border: 'rgba(0, 255, 65, 0.5)', color: '#00FF41' },
  strawman: { label: 'Strawman', bg: 'rgba(230, 57, 53, 0.12)', border: 'rgba(230, 57, 53, 0.5)', color: '#E63935' },
  borderline: { label: 'Borderline', bg: 'rgba(255, 159, 10, 0.12)', border: 'rgba(255, 159, 10, 0.5)', color: '#FFB340' },
};

const CATEGORY_LABEL = { procedural: 'Procedural', substantive: 'Substantive', evidentiary: 'Evidentiary', strategic: 'Strategic' };
const CATEGORY_ACCENT = { procedural: '#E63935', substantive: '#BF5AF2', evidentiary: '#FF9F0A', strategic: '#00FF41' };
const SEVERITY_COLOR = { high: '#E63935', medium: '#FFB340', low: 'rgba(244, 244, 242, 0.55)' };

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
      if (demo) { setData(demo); setLoading(false); }
      else { setError('Demo not found'); setLoading(false); }
      return;
    }
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cases/${id}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const j = await res.json();
        if (mounted) { setData(j); setLoading(false); }
      } catch (e) {
        if (mounted) { setError(e.message || String(e)); setLoading(false); }
      }
    };
    load();
    return () => { mounted = false; };
  }, [id, isDemo]);

  const shell = (
    <div>
      <style>{`
        :root {
          --bg-color: #F4F4F2;
          --text-black: #111111;
          --text-red: #E63935;
          --text-muted: #777777;
          --border-light: #DCDCDC;
          --border-dark: #222222;
          --dossier-bg: #0A0A0A;

          --font-display: 'Oswald', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          --space-xs: 0.5rem;
          --space-sm: 1rem;
          --space-md: 2rem;
          --space-lg: 4rem;
          --space-xl: 8rem;
        }

        .brief-shell {
          background-color: var(--dossier-bg);
          color: #FFFFFF;
          font-family: var(--font-body);
          line-height: 1.5;
          overflow-x: hidden;
          min-height: 100vh;
        }

        .label-meta {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .brief-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid #222;
        }

        .logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0;
          color: #FFF;
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }

        .logo .dot { color: var(--text-red); }

        .back-link {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          text-decoration: none;
          color: #888;
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .back-link:hover { color: #FFF; }

        .deep-dive-container {
          padding: var(--space-lg);
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: var(--space-lg);
          max-width: 1400px;
          margin: 0 auto;
        }

        .report-header {
          grid-column: 1 / -1;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: var(--space-md);
          border-bottom: 1px solid #333;
        }

        .finding-title {
          font-family: var(--font-display);
          font-size: 4rem;
          line-height: 0.9;
          text-transform: uppercase;
          margin-bottom: var(--space-xs);
        }

        .risk-badge {
          background: var(--text-red);
          padding: 4px 12px;
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 0.8rem;
          color: white;
          text-transform: uppercase;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          background: #222;
          margin-top: var(--space-md);
          border: 1px solid #222;
        }

        .comparison-cell {
          background: #111;
          padding: var(--space-md);
        }

        .comparison-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #666;
          margin-bottom: var(--space-sm);
          display: block;
        }

        .clause-text {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .strike { text-decoration: line-through; color: #444; }
        .highlight-red { color: var(--text-red); border-left: 2px solid var(--text-red); padding-left: 1rem; }

        .transcript-container {
          margin-top: var(--space-lg);
          background: #0f0f0f;
          border: 1px solid #222;
          padding: var(--space-md);
        }

        .transcript-line {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
          display: flex;
          gap: var(--space-md);
        }

        .speaker { color: var(--text-red); font-weight: 700; min-width: 140px; }
        .dialogue { color: #ccc; }

        .sidebar-panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .probability-widget {
          border: 1px solid #333;
          padding: var(--space-md);
          text-align: center;
        }

        .gauge-container {
          position: relative;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: var(--space-md) 0;
        }

        .gauge-value {
          font-family: var(--font-display);
          font-size: 5rem;
          line-height: 1;
        }

        .terminal-block {
          background: #000;
          padding: var(--space-md);
          border: 1px solid #222;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: #00FF41;
          line-height: 1.4;
        }

        .terminal-cursor-sm {
          display: inline-block;
          width: 8px;
          height: 15px;
          background: #00FF41;
          margin-left: 4px;
          animation: blink 1s infinite;
        }

        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: var(--space-sm);
        }

        .tag {
          font-size: 0.6rem;
          font-family: var(--font-mono);
          border: 1px solid #333;
          padding: 2px 6px;
          color: #888;
        }

        .text-red { color: var(--text-red); }

        .brief-footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          border-top: 1px solid #222;
          padding: var(--space-xs) var(--space-lg);
          background: var(--dossier-bg);
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </div>
  );

  if (loading) {
    return (
      <>
        {shell}
        <div className="brief-shell">
          <nav className="brief-nav">
            <button className="logo" onClick={() => navigate('/')}>PREMOTION<span className="dot">.</span></button>
          </nav>
          <div style={{padding: 'var(--space-xl) var(--space-lg)', textAlign: 'center', color: '#888', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem'}}>
            LOADING BRIEF...
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        {shell}
        <div className="brief-shell">
          <nav className="brief-nav">
            <button className="logo" onClick={() => navigate('/')}>PREMOTION<span className="dot">.</span></button>
          </nav>
          <div style={{padding: 'var(--space-xl) var(--space-lg)', textAlign: 'center', color: '#E63935', fontFamily: "'JetBrains Mono', monospace', fontSize: '0.85rem'"}}>
            COULDN'T LOAD THIS BRIEF — {error || 'not found'}.
          </div>
        </div>
      </>
    );
  }

  const brief = data.brief || {};
  const title = data.title || 'Stress-test brief';
  const status = data.status;

  if (status !== 'brief_ready' || !brief) {
    return (
      <>
        {shell}
        <div className="brief-shell">
          <nav className="brief-nav">
            <button className="logo" onClick={() => navigate('/')}>PREMOTION<span className="dot">.</span></button>
          </nav>
          <div style={{padding: 'var(--space-xl) var(--space-lg)', textAlign: 'center'}}>
            <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '0.85rem', color: '#888', marginBottom: '10px'}}>STILL RUNNING...</div>
            <div style={{color: '#666', fontSize: '14px'}}>Status: {status}. Refresh in a moment.</div>
          </div>
        </div>
      </>
    );
  }

  const partialAnalysis = data.partial_analysis;
  const verdictKey = (brief.verdict || '').toLowerCase();
  const verdictStyle = VERDICT_STYLES[verdictKey] || VERDICT_STYLES.borderline;

  const scenariosByCategory = {};
  (brief.failure_scenarios || []).forEach(s => {
    const cat = (s.category || 'strategic').toLowerCase();
    if (!scenariosByCategory[cat]) scenariosByCategory[cat] = [];
    scenariosByCategory[cat].push(s);
  });
  const orderedCategories = ['procedural', 'substantive', 'evidentiary', 'strategic']
    .filter(c => scenariosByCategory[c] && scenariosByCategory[c].length);

  // Build tag list from scenarios
  const tagEntities = (brief.failure_scenarios || []).slice(0, 6).map((s, i) => {
    const cat = (s.category || 'strategic').toUpperCase();
    return `${cat}-${String(i + 1).padStart(2, '0')}`;
  });

  // Probability from first scenario or default
  const topRisk = brief.failure_scenarios && brief.failure_scenarios[0];
  const riskPct = topRisk && topRisk.probability ? topRisk.probability.toString().replace(/[^0-9]/g, '') : '92';

  return (
    <>
      {shell}
      <div className="brief-shell">
        <nav className="brief-nav">
          <div className="logo">PREMOTION<span className="dot">.</span></div>
          <button className="back-link" onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {isDemo ? 'Back to Demo List' : 'Back to Home'}
          </button>
        </nav>

        <main className="deep-dive-container" style={{paddingBottom: '80px'}}>
          {partialAnalysis && (
            <div style={{
              background: 'rgba(255, 159, 10, 0.08)',
              borderLeft: '3px solid #FFB340',
              padding: '12px 20px',
              marginBottom: '24px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.75rem',
              color: '#FFB340',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Partial analysis — one or more sub-agents did not complete. Results may be incomplete.
            </div>
          )}
          <header className="report-header">
            <div>
              <span className="label-meta" style={{color: '#666', display: 'block', marginBottom: '8px'}}>
                {isDemo ? 'EXAMPLE BRIEF' : `CASE REF: ${id}`} • ADVERSARIAL ANALYSIS
              </span>
              <h1 className="finding-title">
                {title}
              </h1>
              {brief.verdict_reasoning && (
                <p style={{fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: '600px', marginTop: '12px'}}>
                  {brief.verdict_reasoning}
                </p>
              )}
            </div>
            <div style={{textAlign: 'right'}}>
              <span className="risk-badge" style={{backgroundColor: verdictStyle.color === '#00FF41' ? '#00FF41' : verdictStyle.color === '#FFB340' ? '#e6a835' : '#E63935', color: verdictStyle.color === '#00FF41' ? '#000' : verdictStyle.color === '#FFB340' ? '#000' : 'white'}}>
                {verdictStyle.label.toUpperCase()} VERDICT
              </span>
              <div className="label-meta" style={{marginTop: '8px', color: '#888'}}>
                TIMESTAMP: {formatDate(data.generated_at || data.updated_at) || new Date().toISOString().slice(0, 10)}
              </div>
              <div className="label-meta" style={{marginTop: '4px', color: '#666'}}>
                {data.jurisdiction || 'England & Wales'}
              </div>
            </div>
          </header>

          <section className="main-analysis">
            {isDemo && (
              <div style={{marginBottom: 'var(--space-md)', padding: '16px 20px', backgroundColor: 'rgba(230, 57, 53, 0.04)', border: '1px solid rgba(230, 57, 53, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap'}}>
                <div style={{fontSize: '13px', color: '#ccc', lineHeight: 1.55, maxWidth: '600px'}}>
                  <strong style={{color: '#FFB340'}}>This is an example brief.</strong> Real cases use your own evidence and your own current strategy.
                </div>
                <button onClick={() => navigate('/start')} style={{padding: '9px 16px', backgroundColor: '#E63935', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily}}>
                  Stress-test your case →
                </button>
              </div>
            )}

            {brief.summary && (
              <div style={{marginBottom: 'var(--space-md)'}}>
                <span className="label-meta" style={{color: '#444', marginBottom: '1rem', display: 'block'}}>SUMMARY // WHAT WE FOUND</span>
                <div style={{fontSize: '1rem', color: '#ccc', lineHeight: 1.7}}>
                  {(brief.summary || '').split('\n\n').filter(Boolean).map((para, i) => (
                    <p key={i} style={{marginBottom: '14px'}}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {orderedCategories.length > 0 && (
              <>
                {orderedCategories.map(cat => {
                  const scenarios = scenariosByCategory[cat];
                  const firstScenario = scenarios[0];
                  return (
                    <div key={cat} style={{marginBottom: 'var(--space-md)'}}>
                      <div className="comparison-grid">
                        <div className="comparison-cell">
                          <span className="comparison-label">{CATEGORY_LABEL[cat] || cat} FAILURE MODE</span>
                          <p className="clause-text strike">{firstScenario.scenario}</p>
                        </div>
                        <div className="comparison-cell">
                          <span className="comparison-label">ADVERSARIAL RECONSTRUCTION</span>
                          <p className="clause-text highlight-red">
                            {firstScenario.mitigation || 'Opposing counsel will exploit this exposure.'}
                          </p>
                        </div>
                      </div>

                      {scenarios.slice(1).map((s, i) => (
                        <div key={i} style={{backgroundColor: '#111', border: '1px solid #222', borderTop: 'none', padding: 'var(--space-md)'}}>
                          <span className="comparison-label">{CATEGORY_LABEL[cat]} // ADDITIONAL RISK</span>
                          <p style={{fontSize: '0.95rem', color: '#aaa', lineHeight: 1.6}}>{s.scenario}</p>
                          {s.mitigation && (
                            <p style={{fontSize: '0.85rem', color: '#666', lineHeight: 1.5, marginTop: '8px', fontFamily: "'JetBrains Mono', monospace"}}>&gt; {s.mitigation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}

            {Array.isArray(brief.evidence_inconsistencies) && brief.evidence_inconsistencies.length > 0 && (
              <div className="transcript-container" style={{marginTop: 'var(--space-md)'}}>
                <span className="label-meta" style={{color: '#444', marginBottom: '1rem', display: 'block'}}>EVIDENCE INCONSISTENCIES (AGENT_EVIDENCE_INSPECTOR)</span>
                {brief.evidence_inconsistencies.map((it, i) => (
                  <div className="transcript-line" key={i}>
                    <span className="speaker">[EVD-{String(i + 1).padStart(2, '0')}]</span>
                    <span className="dialogue">
                      <strong style={{color: '#fff'}}>{it.claim}</strong>
                      {it.issue && <span style={{color: '#888'}}> — {it.issue}</span>}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(brief.blind_spots) && brief.blind_spots.length > 0 && (
              <div className="transcript-container">
                <span className="label-meta" style={{color: '#444', marginBottom: '1rem', display: 'block'}}>BLIND SPOTS // WHAT THE OPTIMISTIC CASE IS MISSING</span>
                {brief.blind_spots.map((bs, i) => (
                  <div className="transcript-line" key={i}>
                    <span className="speaker">[BSP-{String(i + 1).padStart(2, '0')}]</span>
                    <span className="dialogue">{bs}</span>
                  </div>
                ))}
              </div>
            )}

            {brief.if_we_lose_this_will_be_why && (
              <div style={{marginTop: 'var(--space-lg)', padding: 'var(--space-md)', backgroundColor: 'rgba(230, 57, 53, 0.04)', border: '1px solid rgba(230, 57, 53, 0.2)'}}>
                <span className="label-meta" style={{color: '#E63935', display: 'block', marginBottom: '12px'}}>IF WE LOSE THIS, THIS WILL BE WHY</span>
                <div style={{fontFamily: serif, fontSize: 'clamp(20px, 2.4vw, 26px)', fontWeight: 500, fontStyle: 'italic', letterSpacing: '-0.3px', color: '#F4F4F2', lineHeight: 1.4}}>
                  "{brief.if_we_lose_this_will_be_why}"
                </div>
              </div>
            )}
          </section>

          <aside className="sidebar-panel">
            <div className="probability-widget">
              <span className="label-meta" style={{color: '#888'}}>RISK PROBABILITY</span>
              <div className="gauge-container">
                <span className="gauge-value text-red">{riskPct}<span style={{fontSize: '2rem'}}>%</span></span>
              </div>
              <span className="label-meta" style={{color: 'var(--text-red)'}}>{verdictStyle.label.toUpperCase()} EXPOSURE</span>
            </div>

            <div className="terminal-block">
              <span className="label-meta" style={{color: '#00FF41', marginBottom: '0.5rem', display: 'block'}}>REVISION STRATEGY //</span>
              {orderedCategories.slice(0, 2).map(cat => {
                const s = scenariosByCategory[cat][0];
                return s && s.mitigation ? (
                  <div key={cat}>&gt; {s.mitigation}<br /></div>
                ) : null;
              })}
              &gt; SCANNING FOR PRECEDENT...
              <span className="terminal-cursor-sm"></span>
            </div>

            <div>
              <span className="label-meta" style={{color: '#444'}}>ENTITIES MENTIONED</span>
              <div className="tag-list">
                {tagEntities.map(tag => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
                {orderedCategories.map(cat => (
                  <span className="tag" key={cat}>{cat.toUpperCase()}_RISK</span>
                ))}
              </div>
            </div>

            <div>
              <button onClick={() => window.print()} style={{width: '100%', padding: '12px 18px', backgroundColor: 'transparent', border: '1px solid #333', color: '#888', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace"}}>
                SAVE BRIEF AS PDF
              </button>
            </div>
          </aside>
        </main>

        <footer className="brief-footer">
          <span className="label-meta" style={{color: '#444'}}>PREMOTION DEEP-DIVE v2.4.0</span>
          <span className="label-meta" style={{color: '#444'}}>ENCRYPTED STREAM // SESSION_ID: {id ? id.slice(0, 8).toUpperCase() : '882-001'}</span>
        </footer>
      </div>
    </>
  );
};

export default BriefPage;
