import React from 'react';
import { useNavigate } from 'react-router-dom';

const MobileNotice = () => {
  const navigate = useNavigate();

  return (
    <div>
      <style>{`
        :root {
          --bg-paper: #f2f2f0;
          --bg-ink: #050505;
          --text-main: #050505;
          --text-inverse: #f2f2f0;
          --border-dark: rgba(5, 5, 5, 0.2);
          --border-light: rgba(242, 242, 240, 0.3);
          --accent-red: #d32f2f;

          --font-display: 'Inter', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          --font-detail: 'Inter', -apple-system, sans-serif;
        }

        .mobile-spread {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          width: 100vw;
          position: relative;
          background-color: var(--bg-paper);
          color: var(--text-main);
          font-family: var(--font-detail);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        @media (max-width: 1024px) {
          .mobile-spread {
            grid-template-columns: 1fr;
            grid-template-rows: 100vh auto;
          }
        }

        .sys-nav {
          position: absolute;
          top: 2rem;
          left: 2rem;
          z-index: 100;
          display: flex;
          justify-content: space-between;
          width: calc(100% - 4rem);
          pointer-events: none;
        }

        .sys-logo {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 14px;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          color: var(--text-inverse);
          mix-blend-mode: difference;
        }

        .sys-meta {
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          color: var(--text-main);
          pointer-events: auto;
          display: flex;
          gap: 2rem;
        }

        .sys-link {
          text-decoration: none;
          color: inherit;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 10px;
          text-transform: uppercase;
          padding: 0;
        }

        .sys-link:hover { border-bottom-color: var(--text-main); }

        .page-left {
          position: relative;
          background-color: var(--bg-ink);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .blur-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('https://images.unsplash.com/photo-1541888043697-72ce2f033100?q=80&w=2000&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          filter: blur(24px) brightness(0.4) contrast(1.2) grayscale(0.5);
          transform: scale(1.1);
        }

        .blur-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, transparent 0%, rgba(5,5,5,0.8) 100%);
        }

        .annotation-cluster {
          position: relative;
          z-index: 10;
          width: 80%;
          height: 70%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
        }

        .annotation-item {
          display: inline-flex;
          align-items: center;
          align-self: flex-start;
          gap: 8px;
          padding: 5px 8px 4px 8px;
          border: 1px solid var(--border-light);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(4px);
          color: var(--text-inverse);
          font-family: var(--font-detail);
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.02em;
          text-transform: lowercase;
          transition: all 0.3s ease;
          cursor: crosshair;
        }

        .annotation-item:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.8);
          transform: translateX(4px);
        }

        .annotation-item .sys-code {
          font-family: var(--font-mono);
          font-size: 9px;
          text-transform: uppercase;
          opacity: 0.5;
        }

        .annotation-item .val {
          font-family: var(--font-mono);
          font-size: 9px;
          opacity: 0.7;
          margin-left: 4px;
        }

        .annotation-item.critical .val {
          color: #ff5252;
          opacity: 1;
        }

        .annotation-item:nth-child(1) { margin-left: 10%; }
        .annotation-item:nth-child(2) { margin-left: 15%; }
        .annotation-item:nth-child(3) { margin-left: 8%; }
        .annotation-item:nth-child(4) { margin-left: 20%; }
        .annotation-item:nth-child(5) { margin-left: 12%; }
        .annotation-item:nth-child(6) { margin-left: 5%; }
        .annotation-item:nth-child(7) { margin-left: 18%; }
        .annotation-item:nth-child(8) { margin-left: 25%; }

        .page-right {
          background-color: var(--bg-paper);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem;
          position: relative;
        }

        .portrait-frame {
          width: 55%;
          aspect-ratio: 3/4;
          margin-bottom: 3rem;
          overflow: hidden;
          background: #e0e0e0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .portrait-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%) contrast(1.3) brightness(0.9);
        }

        .manifesto-title {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: clamp(3rem, 5.5vw, 6rem);
          line-height: 0.85;
          letter-spacing: -0.05em;
          text-align: center;
          text-transform: uppercase;
          color: var(--text-main);
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .manifesto-title span { display: block; }

        .system-details {
          grid-column: 1 / -1;
          background-color: var(--bg-paper);
          border-top: 1px solid var(--text-main);
          padding: 6rem 4rem;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 4rem;
        }

        @media (max-width: 768px) {
          .system-details {
            grid-template-columns: 1fr;
            padding: 4rem 2rem;
          }
        }

        .section-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-dark);
          padding-bottom: 0.5rem;
          margin-bottom: 2rem;
        }

        .proposition-text {
          font-family: var(--font-detail);
          font-size: 1.25rem;
          line-height: 1.4;
          max-width: 600px;
          margin-bottom: 4rem;
          letter-spacing: -0.01em;
        }

        .engine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1px;
          background-color: var(--border-dark);
          border: 1px solid var(--border-dark);
        }

        .engine-card {
          background-color: var(--bg-paper);
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .engine-id {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-main);
          opacity: 0.5;
          margin-bottom: 1rem;
        }

        .engine-name {
          font-family: var(--font-display);
          font-weight: 900;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }

        .engine-desc {
          font-size: 13px;
          line-height: 1.5;
          color: #444;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 2rem;
          background-color: var(--text-main);
          color: var(--text-inverse);
          font-family: var(--font-mono);
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.2s;
          margin-top: 2rem;
        }

        .btn-primary:hover { background-color: #333; }
      `}</style>

      <nav className="sys-nav">
        <div className="sys-logo">Premotion</div>
        <div className="sys-meta">
          <span>ENG &amp; WALES</span>
          <span>V.2.4</span>
          <button className="sys-link" onClick={() => navigate('/start')}>INITIATE ANALYSIS</button>
        </div>
      </nav>

      <main className="mobile-spread">
        <section className="page-left">
          <div className="blur-canvas"></div>
          <div className="blur-overlay"></div>

          <div className="annotation-cluster">
            <div className="annotation-item">
              <span className="sys-code">EVD-01</span> evidentiary gap in exhibit 4b <span className="val">0.92</span>
            </div>
            <div className="annotation-item">
              <span className="sys-code">PRC-88</span> precedent vulnerability <span className="val">0.84</span>
            </div>
            <div className="annotation-item">
              <span className="sys-code">WIT-12</span> witness credibility degradation identified <span className="val">0.76</span>
            </div>
            <div className="annotation-item critical">
              <span className="sys-code">STA-04</span> statutory limitation risk <span className="val">0.99</span>
            </div>
            <div className="annotation-item">
              <span className="sys-code">CLM-22</span> counter-claim probability high <span className="val">0.88</span>
            </div>
            <div className="annotation-item">
              <span className="sys-code">JUR-09</span> jurisdictional ambiguity <span className="val">0.61</span>
            </div>
            <div className="annotation-item">
              <span className="sys-code">DOC-44</span> incomplete disclosure patterns <span className="val">0.72</span>
            </div>
            <div className="annotation-item critical">
              <span className="sys-code">STR-99</span> core thesis structurally flawed <span className="val">0.95</span>
            </div>
          </div>
        </section>

        <section className="page-right">
          <div className="portrait-frame">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop"
              alt="Stark architectural structure"
              className="portrait-img"
            />
          </div>

          <h1 className="manifesto-title">
            <span>BEST VIEWED</span>
            <span>ON DESKTOP</span>
            <span>OR TABLET</span>
          </h1>
        </section>

        <section className="system-details">
          <div>
            <h2 className="section-label">System Directive</h2>
          </div>
          <div>
            <p className="proposition-text">
              Premotion is built for a bigger screen. The intake flow and brief render are designed for desktop or tablet — they don't compress well to phone. Send yourself this link, or open it again on a laptop.
            </p>

            <h2 className="section-label" style={{marginTop: '4rem'}}>Analytical Engines</h2>
            <div className="engine-grid">
              <div className="engine-card">
                <span className="engine-id">ENG // 01</span>
                <h3 className="engine-name">Precedent Mapper</h3>
                <p className="engine-desc">Ingests proposed pleadings and automatically cross-references against EWCA and UKSC jurisprudence to identify deviations or vulnerabilities in legal arguments.</p>
              </div>
              <div className="engine-card">
                <span className="engine-id">ENG // 02</span>
                <h3 className="engine-name">Evidentiary Stress</h3>
                <p className="engine-desc">Maps the chain of evidence against required statutory burdens of proof, highlighting gaps, hearsay risks, and disclosure deficiencies.</p>
              </div>
              <div className="engine-card">
                <span className="engine-id">ENG // 03</span>
                <h3 className="engine-name">Adversarial Sim</h3>
                <p className="engine-desc">Generates the highest-probability counter-claims and defense strategies based on historic behavior of specified opposing firms and standing judges.</p>
              </div>
            </div>

            <button className="btn-primary" onClick={() => navigate('/start')}>Initiate Analysis</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MobileNotice;
