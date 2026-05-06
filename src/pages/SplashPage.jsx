import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const bodyStyle = {
  backgroundColor: '#0F0F10',
  color: '#EBEBF5',
  fontFamily,
  fontSize: '15px',
  lineHeight: 1.6,
  width: '100vw',
  minHeight: '100vh',
  overflowX: 'hidden',
  WebkitFontSmoothing: 'antialiased',
};

const topBar = {
  position: 'sticky', top: 0, zIndex: 20,
  backgroundColor: 'rgba(15, 15, 16, 0.85)',
  backdropFilter: 'blur(12px)',
  borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
  padding: 'clamp(14px, 2vw, 18px) clamp(20px, 4vw, 40px)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
};

const section = (bg = 'transparent', pad = 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px)') => ({
  padding: pad,
  backgroundColor: bg,
  borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
});

const inner = { maxWidth: '1100px', margin: '0 auto' };

const eyebrow = {
  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px',
  color: 'rgba(235, 235, 245, 0.4)', fontWeight: 600, marginBottom: '16px',
};

const h1 = {
  fontFamily: serif,
  fontSize: 'clamp(36px, 6vw, 64px)',
  fontWeight: 500,
  lineHeight: 1.1,
  letterSpacing: '-1.2px',
  color: '#EBEBF5',
  marginBottom: '24px',
};

const h2 = {
  fontFamily: serif,
  fontSize: 'clamp(26px, 4vw, 40px)',
  fontWeight: 500,
  lineHeight: 1.2,
  letterSpacing: '-0.8px',
  color: '#EBEBF5',
  marginBottom: '16px',
};

const sub = {
  fontSize: 'clamp(15px, 1.4vw, 17px)',
  color: 'rgba(235, 235, 245, 0.7)',
  lineHeight: 1.6,
  maxWidth: '720px',
};

const paragraph = {
  fontSize: '15px',
  color: 'rgba(235, 235, 245, 0.68)',
  lineHeight: 1.75,
};

const Wordmark = ({ size = 15 }) => (
  <div style={{
    fontWeight: 700, letterSpacing: '-0.3px', color: '#EBEBF5', fontSize: `${size}px`,
    display: 'inline-flex', alignItems: 'baseline', gap: '10px',
  }}>
    STEELMAN LITIGATION
    <span style={{ color: 'rgba(235, 235, 245, 0.5)', fontWeight: 400, fontSize: `${size - 2}px`, letterSpacing: '0.2px' }}>
      Adversarial premortem for UK litigation
    </span>
  </div>
);

const SplashPage = () => {
  const navigate = useNavigate();
  const [ctaHover, setCtaHover] = useState(false);
  const [topCtaHover, setTopCtaHover] = useState(false);
  const [finalCtaHover, setFinalCtaHover] = useState(false);

  const startCase = () => navigate('/start');
  const seeDemo = () => navigate('/demo');

  const primaryCtaStyle = (hovered) => ({
    display: 'inline-flex', alignItems: 'center', gap: '10px',
    backgroundColor: hovered ? '#0077e6' : '#0A84FF',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '8px',
    fontSize: '14px', fontWeight: 600,
    cursor: 'pointer',
    fontFamily,
    transition: 'all 0.15s ease',
    transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: hovered ? '0 8px 24px rgba(10, 132, 255, 0.3)' : '0 2px 8px rgba(10, 132, 255, 0.15)',
  });

  const ghostCtaStyle = (hovered) => ({
    display: 'inline-flex', alignItems: 'center', gap: '8px',
    backgroundColor: hovered ? 'rgba(235, 235, 245, 0.08)' : 'transparent',
    color: '#EBEBF5',
    border: '1px solid rgba(235, 235, 245, 0.15)',
    padding: '9px 18px',
    borderRadius: '6px',
    fontSize: '12px', fontWeight: 500,
    cursor: 'pointer', fontFamily,
    transition: 'all 0.15s ease',
  });

  return (
    <div style={bodyStyle}>
      {/* Top bar */}
      <div style={topBar}>
        <Wordmark />
        <button
          onClick={startCase}
          onMouseEnter={() => setTopCtaHover(true)}
          onMouseLeave={() => setTopCtaHover(false)}
          style={ghostCtaStyle(topCtaHover)}
        >
          Stress-test a case →
        </button>
      </div>

      {/* HERO */}
      <section style={section('transparent', 'clamp(64px, 10vh, 120px) clamp(20px, 4vw, 40px)')}>
        <div style={inner}>
          <div style={eyebrow}>Adversarial premortem for UK litigation</div>
          <h1 style={h1}>
            Steelman your case.<br />
            Or find out it's a strawman.
          </h1>
          <p style={{ ...sub, marginBottom: '20px' }}>
            Steelman runs your active matter through a multi-model, multi-agent pipeline. Optimistic analyst first — the strongest version of your case the evidence supports. Then specialist sub-agents inspect the evidence in parallel. Then a four-way adversarial premortem on Opus, splitting failure modes across procedural, substantive, evidentiary and strategic. A synthesizer produces the brief: ranked failure scenarios, evidence inconsistencies, blind spots, mitigations, and a single brutal sentence.
          </p>
          <p style={{
            fontSize: '14px', color: 'rgba(235, 235, 245, 0.55)',
            lineHeight: 1.55, maxWidth: '680px', marginBottom: '40px',
            fontStyle: 'italic',
          }}>
            Built on the principle that you don't know how strong your case is until someone has tried to break it.
          </p>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={startCase}
              onMouseEnter={() => setCtaHover(true)}
              onMouseLeave={() => setCtaHover(false)}
              style={primaryCtaStyle(ctaHover)}
            >
              Stress-test a case
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={seeDemo}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'none', border: 'none', color: 'rgba(235, 235, 245, 0.85)',
                padding: '10px 8px', fontSize: '13px', fontWeight: 500,
                cursor: 'pointer', fontFamily, textDecoration: 'underline',
                textDecorationColor: 'rgba(235, 235, 245, 0.25)', textUnderlineOffset: '4px',
              }}
            >
              See a demo brief →
            </button>
            <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.4)', marginLeft: '8px' }}>
              About 2–3 minutes per case · Not legal advice · England &amp; Wales
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div style={{ ...inner, marginTop: '72px', borderTop: '1px solid rgba(235, 235, 245, 0.06)', paddingTop: '28px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px 40px', fontSize: '12px', color: 'rgba(235, 235, 245, 0.55)',
          }}>
            {[
              'Multi-model · Opus where it earns its keep',
              'Sub-agent orchestration in parallel',
              'UK case-law context built in',
              'Real adversarial reasoning — not hedging',
            ].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#32D74B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>How it works</div>
          <h2 style={h2}>Four orchestrated stages. Sub-agents in parallel.</h2>
          <p style={{ ...sub, marginBottom: '48px' }}>
            Steelman is not a single LLM with a clever prompt. It's a parent orchestrator coordinating specialised sub-agents, each running on the model best suited to its role. The architecture is the product.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
          }}>
            <StepCard
              number="Stage 1 · Optimistic Analyst"
              title="The strongest version of your case."
              body={
                <>
                  Reads your intake, your strategy, and every piece of uploaded evidence. Argues your matter back at you the way the most generous reading of the file would put it.
                  <br /><br />
                  This is the steelman. Sonnet — fast, cheap, generous.
                </>
              }
            />
            <StepCard
              number="Stage 2 · Evidence Inspector"
              title="Three sub-agents read the file in parallel."
              body={
                <>
                  A document sub-agent extracts and indexes claims. A cross-reference sub-agent searches for inconsistencies between exhibits. A chronology sub-agent verifies timeline coherence.
                  <br /><br />
                  Independent passes. Their findings are merged into one set of evidence flags with severity.
                </>
              }
            />
            <StepCard
              number="Stage 3 · Premortem Adversary"
              title="It's January 2027. The case has been lost. Why?"
              body={
                <>
                  Four parallel Opus sub-agents work back from a hypothetical loss — procedural, substantive, evidentiary, strategic. Each one is forbidden from being balanced. Each produces ranked failure scenarios with probability and impact.
                  <br /><br />
                  Opus, because adversarial reasoning is where model quality earns its keep.
                </>
              }
              accent="#0A84FF"
            />
            <StepCard
              number="Stage 4 · Synthesizer"
              title="Compares the optimistic and the adversarial."
              body={
                <>
                  Diffs the two takes. Where they meaningfully disagree are your blind spots.
                  <br /><br />
                  Produces the final brief: verdict (steelman / strawman / borderline), summary, ranked failure scenarios by category, evidence inconsistencies, mitigations, and one brutal sentence — <em>"if we lose this, this will be why."</em>
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>Why this exists</div>
          <h2 style={h2}>Most legal AI is one LLM and a prompt. That's not enough.</h2>

          <div style={{ ...paragraph, maxWidth: '780px', marginTop: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              Gary Klein's premortem methodology is one of the more rigorously evidenced techniques in decision science: assume the project has failed, then walk back to find every reason why. It outperforms standard risk reviews because it gives people permission to be adversarial without political cost.
            </p>
            <p style={{ marginBottom: '16px' }}>
              We took that methodology and built it into a multi-agent pipeline tuned for litigation. Not a single model asked to "find weaknesses." A parent orchestrator coordinating four parallel Opus sub-agents — procedural, substantive, evidentiary, strategic — each pointed only at its own failure-mode category. Sub-agent specialisation produces sharper output than one giant prompt asking for everything.
            </p>
            <p style={{ marginBottom: '16px' }}>
              The current generation of legal AI plugins reviews documents and runs skills. None orchestrates a multi-agent adversarial pipeline with role-specific model selection. This is domain-specific reasoning architecture, not a horizontal tool.
            </p>
            <p>
              The output is a brief that reads like the memo an experienced senior partner would scribble after one hard read of the file. Brutal. Specific. Useful before you file, not after.
            </p>
          </div>
        </div>
      </section>

      {/* THE ARCHITECTURE — pillars */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>The architecture</div>
          <h2 style={h2}>Four design choices that make this credible.</h2>

          <div style={{ display: 'grid', gap: '0px', marginTop: '40px' }}>
            <Pillar
              number="01"
              title="Multi-model by design."
              body={
                <>
                  Opus runs the adversarial pass — the place where reasoning quality matters most and hedging hurts most. Sonnet runs the optimistic analyst, the evidence inspector sub-agents, and the synthesizer. Each agent class declares its own model. Swapping models is one line of config, not a routing layer.
                </>
              }
            />
            <Pillar
              number="02"
              title="Sub-agent specialisation."
              body={
                <>
                  The premortem stage is four independent Opus sub-agents — procedural, substantive, evidentiary, strategic. Each one only sees its own remit. None of them are asked to be balanced. The synthesizer reconciles them at the end.
                  <br /><br />
                  A focused prompt produces a sharper failure mode than a generalist one ever will.
                </>
              }
            />
            <Pillar
              number="03"
              title="Parallel where independent."
              body={
                <>
                  The three evidence sub-agents run concurrently. The four premortem sub-agents run concurrently. <code style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: 'rgba(235, 235, 245, 0.85)' }}>asyncio.gather</code> is the architectural showpiece.
                  <br /><br />
                  Two-to-three minutes end to end on real cases, with seven LLM calls under the hood.
                </>
              }
            />
            <Pillar
              number="04"
              title="Audit-logged."
              body={
                <>
                  Every sub-agent call writes to an audit table — model, tokens in, tokens out, duration, status, error if any. You can answer "which sub-agent flagged this?" — important when a partner asks where a finding came from.
                  <br /><br />
                  Privilege-preserving by design: the same orchestrator can swap Sonnet for a local Gemma or Llama for matters that can't leave firm infrastructure.
                </>
              }
            />
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>Who it's for</div>
          <h2 style={h2}>Built for litigators who want to know before they file.</h2>
          <p style={{ ...sub, marginBottom: '40px' }}>
            Most useful between intake and the moment you commit a strategy to paper. A red team that doesn't bill by the hour and doesn't have a relationship to protect.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px',
          }}>
            {[
              { name: 'Solicitors', blurb: 'Boutique and mid-size UK firms running active litigation. Stress-test before serving.' },
              { name: 'In-house counsel', blurb: 'Weighing whether to escalate, settle, or push back. A read on whether the case actually holds.' },
              { name: 'Mediators', blurb: 'A third-voice red team on the positions both sides are bringing into the room.' },
              { name: 'Litigation funders', blurb: 'Pre-investment evaluation. Where would this case go wrong if it went wrong.' },
            ].map(u => (
              <UseCaseCard key={u.name} name={u.name} blurb={u.blurb} />
            ))}
          </div>

          <div style={{
            marginTop: '40px', padding: '20px 24px',
            backgroundColor: 'rgba(255, 69, 58, 0.04)',
            border: '1px solid rgba(255, 69, 58, 0.15)',
            borderRadius: '10px',
          }}>
            <div style={{
              fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px',
              color: '#FF6B5C', fontWeight: 600, marginBottom: '10px',
            }}>
              Not designed for
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.75)', lineHeight: 1.7 }}>
              Consumer disputes (try <a href="https://courtless.app" style={{ color: '#0A84FF', textDecoration: 'none' }}>Courtless</a>) · Transactional / non-contentious work · Family law · Criminal defence.
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ ...section('#131314', 'clamp(64px, 9vw, 100px) clamp(20px, 4vw, 40px) clamp(80px, 12vw, 140px)') }}>
        <div style={{ ...inner, textAlign: 'center' }}>
          <div style={eyebrow}>Ready?</div>
          <h2 style={{ ...h2, marginBottom: '20px' }}>
            You don't know how strong your case is<br />
            until someone has tried to break it.
          </h2>
          <p style={{ ...sub, margin: '0 auto 36px', textAlign: 'center' }}>
            Drop your intake, your evidence and your current strategy. Two-to-three minutes later you'll have a brief — failure modes ranked, blind spots flagged, and a verdict.
          </p>
          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={startCase}
              onMouseEnter={() => setFinalCtaHover(true)}
              onMouseLeave={() => setFinalCtaHover(false)}
              style={primaryCtaStyle(finalCtaHover)}
            >
              Stress-test a case
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              onClick={seeDemo}
              style={{
                background: 'none', border: 'none', color: 'rgba(235, 235, 245, 0.7)',
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily,
                textDecoration: 'underline', textDecorationColor: 'rgba(235, 235, 245, 0.25)',
                textUnderlineOffset: '4px',
              }}
            >
              See a demo brief →
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px clamp(20px, 4vw, 40px)', borderTop: '1px solid rgba(235, 235, 245, 0.06)' }}>
        <div style={{
          ...inner,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.4)' }}>
            STEELMAN LITIGATION · Adversarial premortem for UK litigation · Not legal advice · England &amp; Wales
          </div>
          <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'rgba(235, 235, 245, 0.5)' }}>
            <a href="#terms" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
            <a href="#privacy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
            <a href="#about" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ number, title, body, accent }) => (
  <div style={{
    backgroundColor: '#1A1A1C',
    border: `1px solid ${accent ? `${accent}40` : 'rgba(235, 235, 245, 0.06)'}`,
    borderRadius: '12px',
    padding: '28px 24px',
  }}>
    <div style={{
      fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.4px',
      color: accent || 'rgba(235, 235, 245, 0.4)',
      fontWeight: 700, marginBottom: '14px',
    }}>
      {number}
    </div>
    <div style={{
      fontFamily: serif, fontSize: '22px', fontWeight: 500,
      color: '#EBEBF5', marginBottom: '14px', letterSpacing: '-0.3px', lineHeight: 1.25,
    }}>
      {title}
    </div>
    <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.72)', lineHeight: 1.65 }}>
      {body}
    </div>
  </div>
);

const Pillar = ({ number, title, body }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '80px 1fr',
    gap: '24px',
    padding: '28px 0',
    borderTop: '1px solid rgba(235, 235, 245, 0.06)',
  }}>
    <div style={{
      fontFamily: serif, fontSize: '28px', fontWeight: 400,
      color: 'rgba(235, 235, 245, 0.3)', letterSpacing: '-0.3px',
    }}>
      {number}
    </div>
    <div>
      <div style={{
        fontFamily: serif, fontSize: '22px', fontWeight: 500, color: '#EBEBF5',
        marginBottom: '12px', letterSpacing: '-0.3px',
      }}>
        {title}
      </div>
      <div style={{ ...paragraph, maxWidth: '720px' }}>{body}</div>
    </div>
  </div>
);

const UseCaseCard = ({ name, blurb }) => (
  <div style={{
    backgroundColor: '#1A1A1C',
    border: '1px solid rgba(235, 235, 245, 0.06)',
    borderRadius: '10px',
    padding: '20px 22px',
  }}>
    <div style={{
      fontSize: '14px', fontWeight: 600, color: '#EBEBF5',
      marginBottom: '8px', letterSpacing: '-0.1px',
    }}>
      {name}
    </div>
    <div style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.6)', lineHeight: 1.55 }}>
      {blurb}
    </div>
  </div>
);

export default SplashPage;
