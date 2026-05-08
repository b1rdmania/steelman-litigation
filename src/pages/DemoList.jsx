import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_LIST } from '../data/demoBriefs.js';

const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const VERDICT_STYLES = {
  steelman: { label: 'Steelman', bg: 'rgba(0, 255, 65, 0.12)', border: 'rgba(0, 255, 65, 0.5)', color: '#00FF41' },
  strawman: { label: 'Strawman', bg: 'rgba(230, 57, 53, 0.12)', border: 'rgba(230, 57, 53, 0.5)', color: '#E63935' },
  borderline: { label: 'Borderline', bg: 'rgba(255, 159, 10, 0.12)', border: 'rgba(255, 159, 10, 0.5)', color: '#FFB340' },
};

const DemoList = () => {
  const navigate = useNavigate();
  const demos = DEMO_LIST;

  return (
    <div>
      <style>{`
        :root {
          --bg-color: #F4F4F2;
          --text-black: #111111;
          --text-red: #E63935;
          --text-muted: #777777;
          --border-light: #DCDCDC;
          --border-dark: #111111;

          --font-display: 'Oswald', sans-serif;
          --font-body: 'Inter', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;

          --space-xs: 0.5rem;
          --space-sm: 1rem;
          --space-md: 2rem;
          --space-lg: 4rem;
          --space-xl: 8rem;
        }

        .portfolio-shell {
          background-color: var(--bg-color);
          color: var(--text-black);
          font-family: var(--font-body);
          line-height: 1.5;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          -webkit-font-smoothing: antialiased;
        }

        .portfolio-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          border-bottom: 1px solid var(--border-light);
          background-color: var(--bg-color);
          z-index: 100;
        }

        .logo {
          font-family: var(--font-display);
          font-size: 1.5rem;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0;
          text-decoration: none;
          color: var(--text-black);
          background: none;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }

        .logo .dot { color: var(--text-red); }

        .nav-links {
          display: flex;
          gap: var(--space-md);
          align-items: center;
        }

        .nav-link {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          text-decoration: none;
          color: var(--text-black);
          background: none;
          border: none;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .nav-link.active { color: var(--text-red); }

        .dashboard-header {
          padding: var(--space-lg) var(--space-lg) var(--space-md);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .page-title {
          font-family: var(--font-display);
          font-size: 5rem;
          line-height: 0.9;
          text-transform: uppercase;
          margin: 0;
        }

        .stats-bar {
          display: flex;
          gap: var(--space-md);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        .stats-bar span b { color: var(--text-black); }

        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-top: 1px solid var(--text-black);
          border-left: 1px solid var(--text-black);
          margin: 0 var(--space-lg) var(--space-lg);
        }

        .case-card {
          border-right: 1px solid var(--text-black);
          border-bottom: 1px solid var(--text-black);
          padding: var(--space-md);
          height: 320px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: background-color 0.2s ease;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          background: none;
          text-align: left;
          font-family: var(--font-body);
        }

        .case-card:hover { background-color: #EDEDEB; }
        .case-card.completed { background-color: #fff; }

        .case-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .case-id {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          letter-spacing: 0.05em;
          opacity: 0.6;
        }

        .case-status {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 2px 6px;
          border: 1px solid currentColor;
        }

        .case-name {
          font-family: var(--font-display);
          font-size: 2.5rem;
          line-height: 1;
          text-transform: uppercase;
          margin-top: var(--space-xs);
          word-break: break-all;
        }

        .case-metrics { margin-top: auto; }

        .risk-score-wrap {
          display: flex;
          align-items: baseline;
          gap: var(--space-xs);
        }

        .risk-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
        }

        .risk-value {
          font-family: var(--font-display);
          font-size: 4rem;
          line-height: 1;
          color: var(--text-red);
        }

        .case-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: var(--space-sm);
          padding-top: var(--space-sm);
          border-top: 1px solid rgba(0,0,0,0.1);
        }

        .meta-group { display: flex; flex-direction: column; }

        .meta-label {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .meta-value {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .btn-new-case {
          background: var(--text-black);
          color: var(--bg-color);
          padding: var(--space-sm) var(--space-md);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-new-case:hover { background: var(--text-red); }

        .footer-minimal {
          margin-top: auto;
          padding: var(--space-md) var(--space-lg);
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .label-meta {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }

        @media (max-width: 768px) {
          .portfolio-nav {
            padding: var(--space-sm) var(--space-md);
            flex-wrap: wrap;
            gap: var(--space-sm);
          }
          .nav-links { flex-wrap: wrap; gap: var(--space-sm); }
          .nav-link { font-size: 0.7rem; }
          .btn-new-case { padding: 8px 14px; font-size: 0.7rem; }
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-md);
            padding: var(--space-md);
          }
          .page-title { font-size: 3rem; }
          .stats-bar { flex-wrap: wrap; gap: var(--space-sm); font-size: 0.7rem; }
          .portfolio-grid {
            grid-template-columns: 1fr;
            margin: 0 var(--space-sm) var(--space-md);
          }
          .case-card {
            height: auto;
            min-height: 240px;
            padding: var(--space-md);
          }
          .case-name { font-size: 1.75rem; word-break: normal; }
          .risk-value { font-size: 2.5rem; }
          .footer-minimal {
            flex-direction: column;
            gap: 6px;
            align-items: flex-start;
            padding: var(--space-sm) var(--space-md);
          }
        }
        @media (max-width: 480px) {
          .logo { font-size: 1.25rem; }
          .page-title { font-size: 2.25rem; }
          .case-name { font-size: 1.5rem; }
        }
      `}</style>

      <div className="portfolio-shell">
        <nav className="portfolio-nav">
          <button className="logo" onClick={() => navigate('/')}>PREMOTION<span className="dot">.</span></button>
          <div className="nav-links">
            <button className="nav-link active" onClick={() => navigate('/demo')}>Portfolio</button>
            <button className="nav-link" onClick={() => navigate('/')}>Intelligence</button>
            <button className="nav-link" onClick={() => navigate('/')}>Archive</button>
            <button className="btn-new-case" onClick={() => navigate('/start')}>+ Initiate Analysis</button>
          </div>
        </nav>

        <header className="dashboard-header">
          <div>
            <span className="label-meta" style={{color: 'var(--text-red)', display: 'block', marginBottom: '8px'}}>CENTRAL COMMAND</span>
            <h1 className="page-title">CASE<br />PORTFOLIO</h1>
          </div>
          <div className="stats-bar">
            <span>Example Briefs: <b>{demos.length}</b></span>
            <span>Failure Modes: <b>{demos.reduce((acc, d) => acc + ((d.brief?.failure_scenarios || []).length), 0) || '—'}</b></span>
            <span>System Integrity: <b>OPTIMAL</b></span>
          </div>
        </header>

        <main className="portfolio-grid">
          {demos.map((d, i) => {
            const verdictKey = (d.brief?.verdict || d.verdict || '').toLowerCase();
            const verdict = VERDICT_STYLES[verdictKey] || VERDICT_STYLES.borderline;
            const isFirst = i === 0;
            return (
              <button
                key={d.id}
                className={`case-card${isFirst ? '' : ' completed'}`}
                onClick={() => navigate(`/demo/${d.id}`)}
              >
                <div className="case-header">
                  <span className="case-id">ID: {d.id ? d.id.slice(0, 12).toUpperCase() : `2024-EX-${String(i + 1).padStart(3, '0')}`}</span>
                  <span className="case-status" style={{color: verdict.color, borderColor: verdict.color}}>{verdict.label}</span>
                </div>
                <div className="case-name">{d.title}</div>
                <div className="case-metrics">
                  <div className="risk-score-wrap">
                    <span className="risk-label">Verdict</span>
                    <span className="risk-value" style={isFirst ? {animation: 'pulse 2s infinite'} : {}}>{verdict.label.toUpperCase()}</span>
                  </div>
                </div>
                <div className="case-footer">
                  <div className="meta-group">
                    <span className="meta-label">Documents</span>
                    <span className="meta-value">{d.brief?.evidence_inconsistencies?.length || 0} Flags</span>
                  </div>
                  <div className="meta-group" style={{textAlign: 'right'}}>
                    <span className="meta-label">Type</span>
                    <span className="meta-value">{d.case_type_label || d.case_type || 'Case'}</span>
                  </div>
                </div>
              </button>
            );
          })}

          <button
            className="case-card"
            style={{borderStyle: 'dashed', opacity: 0.4, justifyContent: 'center', alignItems: 'center'}}
            onClick={() => navigate('/start')}
          >
            <span className="label-meta">+ INITIATE NEW ANALYSIS</span>
          </button>
        </main>

        <footer className="footer-minimal">
          <div>PREMOTION LABS // 51.5074° N, 0.1278° W</div>
          <div>© {new Date().getFullYear()} ALL RIGHTS RESERVED // SECURE TERMINAL</div>
        </footer>
      </div>
    </div>
  );
};

export default DemoList;
