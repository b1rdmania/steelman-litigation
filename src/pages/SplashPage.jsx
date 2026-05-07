import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const SplashPage = () => {
  const navigate = useNavigate();
  const [ctaHover, setCtaHover] = useState(false);
  const [topCtaHover, setTopCtaHover] = useState(false);
  const [finalCtaHover, setFinalCtaHover] = useState(false);

  const startCase = () => navigate('/start');
  const seeDemo = () => navigate('/demo');

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

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        body {
          background-color: var(--bg-color);
          color: var(--text-black);
          font-family: var(--font-body);
          line-height: 1.5;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
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

        .text-red { color: var(--text-red); }
        .text-black { color: var(--text-black); }

        .body-editorial {
          font-size: 1.125rem;
          line-height: 1.4;
          max-width: 280px;
          letter-spacing: -0.01em;
        }

        .body-editorial strong {
          color: var(--text-red);
          font-weight: 700;
        }

        .label-meta {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-black);
        }

        .code-accent {
          font-family: var(--font-display);
          font-size: clamp(2rem, 4vw, 4rem);
          color: var(--text-red);
          letter-spacing: -0.01em;
          line-height: 1;
        }

        .splash-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md) var(--space-lg);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .nav-link {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-black);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          transition: color 0.2s ease;
        }

        .nav-link:hover { color: var(--text-red); }

        .logo {
          font-family: var(--font-display);
          font-size: 2.5rem;
          line-height: 1;
          text-transform: lowercase;
          letter-spacing: -0.05em;
        }

        .logo .dot {
          color: var(--text-red);
          font-size: 1.5rem;
        }

        .nav-cta {
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          color: var(--text-black);
          border-bottom: 2px solid var(--text-black);
          padding-bottom: 2px;
          transition: all 0.2s ease;
          background: none;
          border-left: none;
          border-top: none;
          border-right: none;
          cursor: pointer;
          font-family: var(--font-body);
        }

        .nav-cta:hover {
          color: var(--text-red);
          border-color: var(--text-red);
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          padding: calc(var(--space-xl) + 1rem) var(--space-lg) var(--space-lg);
          overflow: hidden;
        }

        .hero-text-block {
          position: relative;
          z-index: 30;
          max-width: 720px;
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          margin-bottom: var(--space-md);
        }

        .hero-text-block .body-editorial {
          font-size: 1.25rem;
          line-height: 1.45;
          max-width: 640px;
          color: var(--text-black);
        }

        .hero-text-block .body-editorial strong {
          color: var(--text-red);
          font-weight: 700;
          display: block;
          font-size: 1.5rem;
          margin-bottom: var(--space-xs);
        }

        .hero-lockup {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          mix-blend-mode: multiply;
          margin-top: auto;
        }

        .hero-image-container {
          position: absolute;
          bottom: 8vh;
          left: 50%;
          transform: translateX(-50%);
          width: 60vw;
          max-width: 800px;
          height: 50vh;
          z-index: 1;
          opacity: 0.7;
          filter: grayscale(100%) contrast(1.1);
          pointer-events: none;
        }

        .hero-image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          -webkit-mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
          mask-image: linear-gradient(to bottom, black 30%, transparent 100%);
        }

        .hero-floating-right {
          position: absolute;
          right: var(--space-lg);
          top: calc(var(--space-xl) + 2rem);
          z-index: 20;
          text-align: right;
        }

        .hero-footer {
          position: absolute;
          bottom: var(--space-md);
          left: var(--space-lg);
          right: var(--space-lg);
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid var(--border-light);
          padding-bottom: var(--space-xs);
          z-index: 20;
        }

        @media (max-width: 768px) {
          .hero { padding: calc(var(--space-lg) + 4rem) var(--space-md) var(--space-md); }
          .hero-text-block .body-editorial { font-size: 1.05rem; }
          .hero-text-block .body-editorial strong { font-size: 1.25rem; }
          .hero-floating-right { display: none; }
          .nav-links { gap: var(--space-sm); }
        }

        .dossier-section {
          background-color: var(--text-black);
          color: var(--bg-color);
          padding: var(--space-xl) var(--space-lg);
          position: relative;
        }

        .dossier-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid #333;
          padding-bottom: var(--space-md);
          margin-bottom: var(--space-lg);
        }

        .dossier-title {
          font-family: var(--font-display);
          font-size: 3rem;
          line-height: 1;
          text-transform: uppercase;
          color: var(--bg-color);
        }

        .dossier-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--space-lg);
        }

        .document-list {
          border-right: 1px solid #333;
          padding-right: var(--space-lg);
        }

        .doc-item {
          padding: var(--space-sm) 0;
          border-bottom: 1px solid #333;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: color 0.2s;
        }

        .doc-item:hover { color: var(--text-red); }
        .doc-item.active { color: var(--text-red); font-weight: 600; }

        .doc-meta {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          color: #888;
        }

        .analysis-panel {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
        }

        .finding-card {
          border: 1px solid #333;
          background: #151515;
          padding: var(--space-md);
        }

        .finding-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-md);
          padding-bottom: var(--space-xs);
          border-bottom: 1px dashed #444;
        }

        .badge-critical {
          background-color: var(--text-red);
          color: white;
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          text-transform: uppercase;
        }

        .finding-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-md);
        }

        .data-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .data-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .data-value {
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .data-value.strike {
          text-decoration: line-through;
          color: #666;
        }

        .data-value.highlight {
          color: var(--text-red);
        }

        @media (max-width: 1024px) {
          .hero-floating-left, .hero-floating-right {
            position: relative;
            top: auto; right: auto; left: auto; bottom: auto;
            transform: none;
            margin-top: var(--space-md);
            text-align: center;
          }
          .body-editorial {
            max-width: 100%;
          }
          .hero-image-container {
            width: 90vw;
            height: 50vh;
          }
          .dossier-grid {
            grid-template-columns: 1fr;
          }
          .document-list {
            border-right: none;
            border-bottom: 1px solid #333;
            padding-right: 0;
            padding-bottom: var(--space-lg);
          }
          .finding-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <nav className="splash-nav">
        <div className="logo">p<span className="dot">.</span></div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>About</button>
          <button className="nav-link" onClick={seeDemo}>See a demo</button>
          <button className="nav-cta" onClick={startCase}>Stress-Test a Case</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-text-block">
            <span className="label-meta">PHASE 01 // PREMORTEM</span>
            <p className="body-editorial">
              <strong>We try to lose your case for you. So you don't.</strong>
              Premotion writes the version where you lose, then works out why. Eight specialists. Four failure categories. One brief — the procedural, evidentiary, substantive and strategic holes opposing counsel will pull on first. Roughly three minutes.
            </p>
          </div>

          <div className="hero-floating-right">
            <div className="code-accent">// FATAL_ERROR</div>
          </div>

          <div className="hero-image-container">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" alt="Stark brutalist concrete structure" />
          </div>

          <div className="hero-lockup">
            <h1 className="display-huge text-red">BREAK YOUR</h1>
            <h1 className="display-huge text-black">OWN CASE</h1>
          </div>

          <div className="hero-footer">
            <span className="label-meta" style={{color: 'var(--text-muted)'}}>PREMOTION LABS • LONDON, UK</span>
            <span className="label-meta" style={{color: 'var(--text-muted)'}}>ADVERSARIAL LITIGATION INTELLIGENCE</span>
          </div>
        </section>

        <section className="dossier-section">
          <div className="dossier-header">
            <h2 className="dossier-title">Vulnerability Report</h2>
            <span className="label-meta" style={{color: '#888'}}>SYSTEM: MULTI-MODEL AGENT [V.2.4]</span>
          </div>

          <div className="dossier-grid">
            <div className="document-list">
              <div className="data-label" style={{marginBottom: 'var(--space-sm)'}}>Analyzed Corpus</div>
              <div className="doc-item active">
                <span>Draft_Particulars_of_Claim_v3.docx</span>
                <span className="doc-meta">24KB</span>
              </div>
              <div className="doc-item">
                <span>Witness_Statement_Smith_Final.pdf</span>
                <span className="doc-meta">1.2MB</span>
              </div>
              <div className="doc-item">
                <span>Expert_Report_Quantum_Draft.pdf</span>
                <span className="doc-meta">4.5MB</span>
              </div>
              <div className="doc-item">
                <span>Defendant_PreAction_Response.pdf</span>
                <span className="doc-meta">890KB</span>
              </div>
            </div>

            <div className="analysis-panel">
              <div className="finding-card">
                <div className="finding-header">
                  <span className="label-meta" style={{color: '#888'}}>REF: PARA 14(C) • BREACH OF DUTY</span>
                  <span className="badge-critical">CRITICAL RISK • 92% PROBABILITY</span>
                </div>
                <div className="finding-content">
                  <div className="data-group">
                    <span className="data-label">Claim Assertion</span>
                    <span className="data-value strike">"The Defendant failed to implement adequate safety protocols prior to the incident on October 12th."</span>
                  </div>
                  <div className="data-group">
                    <span className="data-label">Adversarial Counter-Argument (Simulated)</span>
                    <span className="data-value highlight">The Defendant will cite Exhibit D (Maintenance Log) showing a comprehensive protocol update on October 10th. Your witness statement (Smith, Para 8) contradicts your own timeline regarding when protocols were visible.</span>
                  </div>
                  <div className="data-group" style={{gridColumn: '1 / -1', marginTop: 'var(--space-sm)'}}>
                    <span className="data-label">Recommended Action</span>
                    <span className="data-value" style={{fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#ccc'}}>&gt; REVISE TIMELINE IN PARTICULARS OR SEEK CLARIFICATION FROM WITNESS SMITH BEFORE FILING. DO NOT RELY ON DATES IN PARA 14(C).</span>
                  </div>
                </div>
              </div>

              <div className="finding-card" style={{borderColor: '#222', opacity: 0.8}}>
                <div className="finding-header" style={{borderBottomColor: '#333'}}>
                  <span className="label-meta" style={{color: '#666'}}>REF: CAUSATION • ECONOMIC LOSS</span>
                  <span className="badge-critical" style={{background: '#e6a835', color: 'black'}}>MODERATE RISK • 64% PROBABILITY</span>
                </div>
                <div className="finding-content">
                  <div className="data-group">
                    <span className="data-label">Vulnerability</span>
                    <span className="data-value" style={{color: '#aaa'}}>Expert report relies on linear market projections. Precedent (Smith v Jones 2022) suggests courts require multi-variate modeling for this sector. Anticipate strike-out application on quantum.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About — built at Interstella, personal API caveat */}
        <section id="about" style={{backgroundColor: '#F4F4F2', padding: 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid rgba(17, 17, 17, 0.08)', scrollMarginTop: '20px'}}>
          <div style={{maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'clamp(24px, 4vw, 64px)'}}>
            <div>
              <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px', color: '#777', fontWeight: 600, marginBottom: '16px'}}>About this demo</div>
              <h2 style={{fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#111111', marginBottom: '20px'}}>
                Built in two days at Interstella.
              </h2>
              <p style={{fontSize: '15px', lineHeight: 1.7, color: '#222', marginBottom: '14px'}}>
                Premotion was built at the Interstella Conference, Lisbon, 6–7 May 2026. Fully working end-to-end: real Claude pipeline, real adversarial reasoning, real briefs back in roughly three minutes.
              </p>
              <p style={{fontSize: '15px', lineHeight: 1.7, color: '#222', marginBottom: '14px'}}>
                It's open-source. <a href="https://github.com/b1rdmania/steelman-litigation" target="_blank" rel="noreferrer" style={{color: '#E63935', textDecoration: 'underline', textUnderlineOffset: '3px'}}>github.com/b1rdmania/steelman-litigation</a>
              </p>
              <p style={{fontSize: '13px', lineHeight: 1.6, color: '#555', fontStyle: 'italic', borderLeft: '2px solid #E63935', paddingLeft: '14px', marginTop: '20px'}}>
                Heads up: this is a working prototype running on a personal Anthropic API key. Please don't share too widely (lol). If you're at the conference and want to talk about it, find Andy.
              </p>
            </div>

            <div style={{borderLeft: '1px solid rgba(17, 17, 17, 0.1)', paddingLeft: 'clamp(24px, 4vw, 48px)'}}>
              <div style={{fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px', color: '#777', fontWeight: 600, marginBottom: '16px'}}>Multi-model architecture</div>
              <h3 style={{fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(20px, 2.6vw, 26px)', fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#111111', marginBottom: '16px'}}>
                Today: Claude. Tomorrow: any agent, any model.
              </h3>
              <p style={{fontSize: '14px', lineHeight: 1.65, color: '#333', marginBottom: '12px'}}>
                The MVP runs Sonnet for the optimistic and synthesis passes, Opus for the four adversarial sub-agents. Per-class model attributes mean swapping any agent to a different model — Gemini, Llama, a self-hosted local — is a one-line change.
              </p>
              <p style={{fontSize: '14px', lineHeight: 1.65, color: '#333', marginBottom: '12px'}}>
                The same orchestrator can cross-reference 10+ specialised agents, each on the model best suited to its role. Different model families voting on the same evidence — fewer single-vendor failure modes, harder to hallucinate past three independent passes.
              </p>
              <p style={{fontSize: '13px', lineHeight: 1.6, color: '#555'}}>
                See: <a href="https://github.com/aaronjmars/MiroShark" target="_blank" rel="noreferrer" style={{color: '#E63935', textDecoration: 'underline', textUnderlineOffset: '3px'}}>aaronjmars/MiroShark</a> for the cross-agent verification reference architecture.
              </p>
            </div>
          </div>
        </section>

        {/* How it works — plain English walkthrough */}
        <section id="how-it-works" style={{backgroundColor: '#141414', padding: 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid rgba(244, 244, 242, 0.06)', scrollMarginTop: '20px'}}>
          <div style={{maxWidth: '1100px', margin: '0 auto'}}>
            <div style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(244, 244, 242, 0.4)', fontWeight: 600, marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace"}}>How it works</div>
            <h2 style={{fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 500, lineHeight: 1.2, letterSpacing: '1px', textTransform: 'uppercase', color: '#F4F4F2', marginBottom: '16px'}}>What a senior partner with four hours would do.<br />In about three minutes.</h2>
            <p style={{fontSize: 'clamp(15px, 1.4vw, 17px)', color: 'rgba(244, 244, 242, 0.7)', lineHeight: 1.6, maxWidth: '720px', marginBottom: '48px'}}>
              You think your case is strong because you've been thinking about it for weeks. That's the problem. You've optimism-biased the file. Premotion runs the adversarial review you'd run if you had a senior partner sitting opposite, in a quiet room, deliberately trying to find what you've missed.
            </p>
            <div style={{display: 'grid', gap: '20px'}}>
              <PlainStep
                tag="Step 1 — first read"
                title={'"Make this case as strong as possible."'}
                body={
                  <>
                    Premotion reads your intake, your strategy, and every uploaded document. It argues your side back at you. The strongest version of your case the evidence supports. Not the version you wish you had. The version that's there.
                    <br /><br />
                    This is the steelman of your case.
                  </>
                }
              />
              <PlainStep
                tag="Step 2 — second read"
                title={'"Look for what doesn\'t add up."'}
                body={
                  <>
                    Three specialists read the documents independently. They don't talk to each other.
                    <ul style={{margin: '14px 0 0 18px', padding: 0}}>
                      <li style={{marginBottom: '6px'}}>One reads each document for what it says, not what you claim it says</li>
                      <li style={{marginBottom: '6px'}}>One looks for inconsistencies between documents: dates that don't match, wording that contradicts, gaps in correspondence</li>
                      <li>One verifies the chronology. Does your timeline match the documents in front of you?</li>
                    </ul>
                    <br />
                    If one of them sees a problem and the others don't, that itself is signal.
                  </>
                }
              />
              <PlainStep
                tag="Step 3 — third read"
                title={'"It\'s twelve months from now. You lost. Why?"'}
                accent="#E63935"
                body={
                  <>
                    This is the unkind part. Four adversaries each look at one type of failure. Separately, in parallel, forbidden from being balanced.
                    <ul style={{margin: '14px 0 0 18px', padding: 0}}>
                      <li style={{marginBottom: '6px'}}><strong style={{color: '#F4F4F2'}}>Procedural:</strong> did you mess up filing, deadlines, jurisdiction, service?</li>
                      <li style={{marginBottom: '6px'}}><strong style={{color: '#F4F4F2'}}>Substantive:</strong> is the law on your side, or have you misread the statute, missed a recent decision, picked the wrong cause of action?</li>
                      <li style={{marginBottom: '6px'}}><strong style={{color: '#F4F4F2'}}>Evidentiary:</strong> can you prove what you're claiming? Is the evidence admissible, contemporaneous, credible?</li>
                      <li><strong style={{color: '#F4F4F2'}}>Strategic:</strong> is your timing helping you? Your posture? Should you have made a Part 36 offer last month? Are you escalating when you should be settling?</li>
                    </ul>
                    <br />
                    Each one writes its own post-mortem. They run on Claude Opus 4. Finding holes in arguments is the kind of thing a better engine improves more than anything else does.
                  </>
                }
              />
              <PlainStep
                tag="Step 4 — final read"
                title={'"Compare the two stories."'}
                body={
                  <>
                    A synthesis specialist reads everything: the optimistic case, the evidence flags, the four post-mortems. It compares them. Where the optimistic case and the failure modes disagree, those are your blind spots.
                    <br /><br />
                    You get back: a verdict (Steelman, Borderline, or Strawman), the top failure scenarios ranked by category, evidence inconsistencies, mitigations for each, and one sentence at the end. <em>"If you lose this, this will be why."</em>
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* Who it's for — use cases + not designed for */}
        <section style={{backgroundColor: '#0F0F10', padding: 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px)', borderBottom: '1px solid rgba(244, 244, 242, 0.06)'}}>
          <div style={{maxWidth: '1100px', margin: '0 auto'}}>
            <div style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(244, 244, 242, 0.4)', fontWeight: 600, marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace"}}>Who it's for</div>
            <h2 style={{fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 500, lineHeight: 1.2, letterSpacing: '1px', textTransform: 'uppercase', color: '#F4F4F2', marginBottom: '16px'}}>
              Built for litigators who want to know before they file.
            </h2>
            <p style={{fontSize: 'clamp(15px, 1.4vw, 17px)', color: 'rgba(244, 244, 242, 0.7)', lineHeight: 1.6, maxWidth: '720px', marginBottom: '40px'}}>
              Most useful before you commit a strategy to paper. A red team that doesn't bill by the hour and doesn't have a relationship to protect.
            </p>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px'}}>
              {[
                { name: 'Solicitors', blurb: 'Boutique and mid-size UK firms running active litigation. Stress-test before serving.' },
                { name: 'In-house counsel', blurb: 'Weighing whether to escalate, settle, or push back. A read on whether the case actually holds.' },
                { name: 'Mediators', blurb: 'A third-voice red team on the positions both sides are bringing into the room.' },
                { name: 'Litigation funders', blurb: 'Pre-investment evaluation. Where would this case go wrong if it went wrong.' },
              ].map(u => (
                <div key={u.name} style={{
                  backgroundColor: '#1A1A1C', border: '1px solid rgba(244, 244, 242, 0.06)',
                  padding: '20px 22px',
                }}>
                  <div style={{fontFamily: "'Oswald', sans-serif", fontSize: '18px', fontWeight: 500, color: '#F4F4F2', marginBottom: '8px', letterSpacing: '0.5px', textTransform: 'uppercase'}}>{u.name}</div>
                  <div style={{fontSize: '13px', color: 'rgba(244, 244, 242, 0.65)', lineHeight: 1.6}}>{u.blurb}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '40px', padding: '20px 24px',
              backgroundColor: 'rgba(230, 57, 53, 0.06)',
              border: '1px solid rgba(230, 57, 53, 0.2)',
            }}>
              <div style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#E63935', fontWeight: 700, marginBottom: '10px', fontFamily: "'JetBrains Mono', monospace"}}>
                Not designed for
              </div>
              <div style={{fontSize: '14px', color: 'rgba(244, 244, 242, 0.75)', lineHeight: 1.7}}>
                Consumer disputes (try <a href="https://courtless.xyz" style={{color: '#E63935', textDecoration: 'none'}}>Courtless</a>) · Transactional / non-contentious work · Family law · Criminal defence.
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{backgroundColor: '#141414', padding: 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px) clamp(80px, 12vw, 140px)', borderBottom: '1px solid rgba(244, 244, 242, 0.06)'}}>
          <div style={{maxWidth: '1100px', margin: '0 auto', textAlign: 'center'}}>
            <div style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(244, 244, 242, 0.4)', fontWeight: 600, marginBottom: '16px', fontFamily: "'JetBrains Mono', monospace"}}>Ready?</div>
            <h2 style={{fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 500, lineHeight: 1.2, letterSpacing: '1px', textTransform: 'uppercase', color: '#F4F4F2', marginBottom: '20px'}}>
              You don't know how strong your case is<br />until someone tries to break it.
            </h2>
            <p style={{fontSize: 'clamp(15px, 1.4vw, 17px)', color: 'rgba(244, 244, 242, 0.7)', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto 36px', textAlign: 'center'}}>
              Drop your intake, your evidence and your current strategy. Two-to-three minutes later you'll have a brief: failure modes ranked, blind spots flagged, and a verdict.
            </p>
            <div style={{display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '14px'}}>
              <button
                onClick={startCase}
                onMouseEnter={() => setFinalCtaHover(true)}
                onMouseLeave={() => setFinalCtaHover(false)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '10px',
                  backgroundColor: finalCtaHover ? '#cc2e2a' : '#E63935',
                  color: 'white', border: 'none', padding: '14px 28px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily,
                  transition: 'all 0.15s ease',
                  transform: finalCtaHover ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                Stress-test a case →
              </button>
              <button
                onClick={seeDemo}
                style={{background: 'none', border: 'none', color: 'rgba(244, 244, 242, 0.7)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily, textDecoration: 'underline', textDecorationColor: 'rgba(244, 244, 242, 0.25)', textUnderlineOffset: '4px'}}
              >
                See a demo brief →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{padding: '28px clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(244, 244, 242, 0.06)', backgroundColor: '#111111'}}>
          <div style={{maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'}}>
            <div style={{fontSize: '12px', color: 'rgba(244, 244, 242, 0.4)', fontFamily: "'JetBrains Mono', monospace"}}>
              PREMOTION · Adversarial premortem for UK litigation · Not legal advice · England &amp; Wales
            </div>
            <div style={{display: 'flex', gap: '24px', fontSize: '12px', color: 'rgba(244, 244, 242, 0.5)'}}>
              <a href="#terms" style={{color: 'inherit', textDecoration: 'none'}}>Terms</a>
              <a href="#privacy" style={{color: 'inherit', textDecoration: 'none'}}>Privacy</a>
              <a href="#about" style={{color: 'inherit', textDecoration: 'none'}}>About</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

const PlainStep = ({ tag, title, body, accent }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'minmax(140px, 180px) 1fr', gap: '32px',
    padding: '32px 0', borderTop: '1px solid rgba(244, 244, 242, 0.06)', alignItems: 'start',
  }}>
    <div style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.4px', color: accent || 'rgba(244, 244, 242, 0.4)', fontWeight: 700, paddingTop: '6px', fontFamily: "'JetBrains Mono', monospace"}}>
      {tag}
    </div>
    <div>
      <div style={{fontFamily: "'Oswald', sans-serif", fontSize: '22px', fontWeight: 500, color: '#F4F4F2', marginBottom: '12px', letterSpacing: '1px', lineHeight: 1.3, textTransform: 'uppercase'}}>
        {title}
      </div>
      <div style={{fontSize: '15px', color: 'rgba(244, 244, 242, 0.72)', lineHeight: 1.7}}>
        {body}
      </div>
    </div>
  </div>
);

export default SplashPage;
