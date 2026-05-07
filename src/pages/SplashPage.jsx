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
            Upload your case file. Eight specialists read it from different angles. First they argue your side. Then they deliberately try to break it. You get back a stress-test brief with the failure modes you haven't seen, ranked by impact. Roughly three minutes.
          </p>
          <p style={{
            fontSize: '14px', color: 'rgba(235, 235, 245, 0.55)',
            lineHeight: 1.55, maxWidth: '680px', marginBottom: '40px',
            fontStyle: 'italic',
          }}>
            You don't know how strong your case is until someone tries to break it.
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
              'Eight specialists, eight separate reads',
              'Claude Opus 4 on the adversarial pass',
              'UK law context, English & Welsh courts',
              'Local-model option for matters that can\'t leave the firm',
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

      {/* HOW IT WORKS — plain English walkthrough */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>How it works</div>
          <h2 style={h2}>What a senior partner with four hours would do.<br />In about three minutes.</h2>
          <p style={{ ...sub, marginBottom: '48px' }}>
            You think your case is strong because you've been thinking about it for weeks. That's the problem. You've optimism-biased the file. Steelman runs the adversarial review you'd run if you had a senior partner sitting opposite, in a quiet room, deliberately trying to find what you've missed.
          </p>

          <div style={{ display: 'grid', gap: '20px' }}>
            <PlainStep
              tag="Step 1 — first read"
              title={<>"Make this case as strong as possible."</>}
              body={
                <>
                  Steelman reads your intake, your strategy, and every uploaded document. It argues your side back at you. The strongest version of your case the evidence supports. Not the version you wish you had. The version that's there.
                  <br /><br />
                  This is the steelman.
                </>
              }
            />
            <PlainStep
              tag="Step 2 — second read"
              title={<>"Look for what doesn't add up."</>}
              body={
                <>
                  Three specialists read the documents independently. They don't talk to each other.
                  <ul style={{ margin: '14px 0 0 18px', padding: 0 }}>
                    <li style={{ marginBottom: '6px' }}>One reads each document for what it says, not what you claim it says</li>
                    <li style={{ marginBottom: '6px' }}>One looks for inconsistencies between documents: dates that don't match, wording that contradicts, gaps in correspondence</li>
                    <li>One verifies the chronology. Does your timeline match the documents in front of you?</li>
                  </ul>
                  <br />
                  If one of them sees a problem and the others don't, that itself is signal.
                </>
              }
            />
            <PlainStep
              tag="Step 3 — third read"
              title={<>"It's twelve months from now. You lost. Why?"</>}
              body={
                <>
                  This is the unkind part. Four adversaries each look at one type of failure. Separately, in parallel, forbidden from being balanced.
                  <ul style={{ margin: '14px 0 0 18px', padding: 0 }}>
                    <li style={{ marginBottom: '6px' }}><strong style={{ color: '#EBEBF5' }}>Procedural:</strong> did you mess up filing, deadlines, jurisdiction, service?</li>
                    <li style={{ marginBottom: '6px' }}><strong style={{ color: '#EBEBF5' }}>Substantive:</strong> is the law on your side, or have you misread the statute, missed a recent decision, picked the wrong cause of action?</li>
                    <li style={{ marginBottom: '6px' }}><strong style={{ color: '#EBEBF5' }}>Evidentiary:</strong> can you prove what you're claiming? Is the evidence admissible, contemporaneous, credible?</li>
                    <li><strong style={{ color: '#EBEBF5' }}>Strategic:</strong> is your timing helping you? Your posture? Should you have made a Part 36 offer last month? Are you escalating when you should be settling?</li>
                  </ul>
                  <br />
                  Each one writes its own post-mortem. They run on Claude Opus 4. Finding holes in arguments is the kind of thing a better engine improves more than anything else does.
                </>
              }
              accent="#0A84FF"
            />
            <PlainStep
              tag="Step 4 — final read"
              title={<>"Compare the two stories."</>}
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

      {/* WORKED EXAMPLE */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>What it looks like in practice</div>
          <h2 style={h2}>An unpaid £42K invoice. A case you think you'll win.</h2>

          <div style={{ ...paragraph, maxWidth: '780px', marginTop: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              Imagine you've got an unpaid invoice for £42,000 from a client who's gone quiet for six months. You think you're going to win because:
            </p>
            <ul style={{ margin: '0 0 24px 22px', padding: 0, color: 'rgba(235, 235, 245, 0.7)' }}>
              <li style={{ marginBottom: '6px' }}>You've got the signed Statement of Work</li>
              <li style={{ marginBottom: '6px' }}>You delivered everything on the milestone schedule</li>
              <li style={{ marginBottom: '6px' }}>You have the email where they signed off the final deliverable</li>
              <li>They've ignored four chase emails</li>
            </ul>
            <p style={{ marginBottom: '16px' }}>
              You upload the file to Steelman. Three minutes later, the brief comes back.
            </p>
          </div>

          <div style={{
            maxWidth: '780px',
            backgroundColor: '#1A1A1C',
            border: '1px solid rgba(235, 235, 245, 0.08)',
            borderRadius: '12px',
            padding: '28px 32px',
            marginTop: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{
                fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.4px',
                color: 'rgba(235, 235, 245, 0.4)', fontWeight: 600,
              }}>Verdict</span>
              <span style={{
                fontSize: '12px', fontWeight: 700, padding: '4px 10px',
                borderRadius: '6px', backgroundColor: 'rgba(255, 159, 10, 0.15)',
                color: '#FF9F0A', letterSpacing: '0.4px', textTransform: 'uppercase',
              }}>Borderline</span>
            </div>

            <p style={{ marginBottom: '14px', color: 'rgba(235, 235, 245, 0.75)', fontSize: '14px', lineHeight: 1.7 }}>
              <strong style={{ color: '#EBEBF5' }}>What you got right.</strong> Your contract is solid. Your delivery evidence is contemporaneous. Their non-response would be a problem for them in court.
            </p>
            <p style={{ marginBottom: '6px', color: 'rgba(235, 235, 245, 0.85)', fontSize: '14px', fontWeight: 600 }}>
              What you missed.
            </p>
            <ul style={{ margin: '0 0 16px 18px', padding: 0, color: 'rgba(235, 235, 245, 0.72)', fontSize: '14px', lineHeight: 1.7 }}>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#EBEBF5' }}>Procedural:</strong> you didn't follow the Pre-Action Protocol for Debt Claims. A £42K claim sent without a compliant letter before action sees costs reduced. The court can refuse judgment on procedural grounds alone.
              </li>
              <li style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#EBEBF5' }}>Substantive:</strong> the "final sign-off" email you're relying on says <em>"thanks for sending this through"</em>. Not <em>"I accept this as final delivery"</em>. A sharp defence will argue that wasn't acceptance. You need acceptance by conduct or a clearer email.
              </li>
              <li>
                <strong style={{ color: '#EBEBF5' }}>Strategic:</strong> they've been quiet for six months. People who go quiet are usually broke. You haven't done a Companies House check — their accounts are overdue and they've changed director twice this year. Even if you win, will you recover?
              </li>
            </ul>

            <div style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(235, 235, 245, 0.08)',
              fontFamily: serif, fontSize: '17px', fontStyle: 'italic',
              color: '#EBEBF5', lineHeight: 1.5,
            }}>
              "If you lose this, it'll be because you confused 'we've finished the work' with 'the client agreed we'd finished.'"
            </div>
          </div>

          <p style={{ ...paragraph, maxWidth: '780px', marginTop: '28px' }}>
            That's the read you'd get from a senior partner before you file. Steelman gives every solicitor that read in three minutes, before counsel's opinion costs £600.
          </p>
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <section style={section('#131314')}>
        <div style={inner}>
          <div style={eyebrow}>Why this exists</div>
          <h2 style={h2}>Most legal AI is one LLM and a prompt. That's not enough.</h2>

          <div style={{ ...paragraph, maxWidth: '780px', marginTop: '24px' }}>
            <p style={{ marginBottom: '16px' }}>
              Gary Klein's premortem method is well evidenced in decision science. Assume the project has failed, then walk back to find every reason why. It works because it gives people permission to be adversarial without political cost.
            </p>
            <p style={{ marginBottom: '16px' }}>
              We applied that method to litigation. Eight specialists, each pointed at one type of failure, each forbidden from being balanced. Then a synthesis pass that compares your optimistic case to what the adversaries found. The disagreements are your blind spots.
            </p>
            <p>
              The output reads like the memo an experienced senior partner would scribble after one hard read of the file. Brutal. Specific. Useful before you file, not after.
            </p>
          </div>
        </div>
      </section>

      {/* THE ARCHITECTURE — pillars (for builders / technical readers) */}
      <section style={section('transparent')}>
        <div style={inner}>
          <div style={eyebrow}>For the technically minded</div>
          <h2 style={h2}>The architecture, briefly.</h2>
          <p style={{ ...sub, marginBottom: '32px' }}>
            If you build agent systems for a living, this is the bit you'll want to read. If you don't, skip it.
          </p>

          <div style={{ display: 'grid', gap: '0px', marginTop: '40px' }}>
            <Pillar
              number="01"
              title="Multi-model by design."
              body={
                <>
                  Opus 4 runs the adversarial pass. Reasoning quality matters most there, and hedging hurts most. Sonnet runs the optimistic analyst, the evidence inspector sub-agents, and the synthesizer. Each agent class declares its own model. Swapping models is one line of config, not a routing layer.
                </>
              }
            />
            <Pillar
              number="02"
              title="Sub-agent specialisation."
              body={
                <>
                  The premortem stage uses four independent Opus sub-agents. One each for procedural, substantive, evidentiary, and strategic failure modes. Each one only sees its own remit. None of them is asked to be balanced. The synthesizer reconciles them at the end.
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
                  The three evidence sub-agents run concurrently. The four premortem sub-agents run concurrently. Two-to-three minutes end to end, seven LLM calls under the hood.
                </>
              }
            />
            <Pillar
              number="04"
              title="Audit-logged. Local-deploy ready."
              body={
                <>
                  Every sub-agent call writes to an audit table: model, tokens in, tokens out, duration, status, error if any. You can answer "which sub-agent flagged this?" when a partner asks where a finding came from.
                  <br /><br />
                  The same orchestrator can swap Sonnet for a local Gemma or Llama. For matters that can't leave firm infrastructure, no part of the case ever touches a third-party cloud.
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
            Most useful before you commit a strategy to paper. A red team that doesn't bill by the hour and doesn't have a relationship to protect.
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

const PlainStep = ({ tag, title, body, accent }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'minmax(140px, 180px) 1fr',
    gap: '32px',
    padding: '32px 0',
    borderTop: '1px solid rgba(235, 235, 245, 0.06)',
    alignItems: 'start',
  }}>
    <div style={{
      fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.4px',
      color: accent || 'rgba(235, 235, 245, 0.4)',
      fontWeight: 700, paddingTop: '6px',
    }}>
      {tag}
    </div>
    <div>
      <div style={{
        fontFamily: serif, fontSize: '22px', fontWeight: 500,
        color: '#EBEBF5', marginBottom: '12px', letterSpacing: '-0.3px', lineHeight: 1.3,
      }}>
        {title}
      </div>
      <div style={{ fontSize: '15px', color: 'rgba(235, 235, 245, 0.72)', lineHeight: 1.7 }}>
        {body}
      </div>
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
