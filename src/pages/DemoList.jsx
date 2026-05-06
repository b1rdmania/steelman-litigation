import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_LIST } from '../data/demoBriefs.js';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const VERDICT_STYLES = {
  steelman: { label: 'Steelman', bg: 'rgba(50, 215, 75, 0.12)', border: 'rgba(50, 215, 75, 0.5)', color: '#32D74B' },
  strawman: { label: 'Strawman', bg: 'rgba(255, 69, 58, 0.12)', border: 'rgba(255, 69, 58, 0.5)', color: '#FF6B5C' },
  borderline: { label: 'Borderline', bg: 'rgba(255, 159, 10, 0.12)', border: 'rgba(255, 159, 10, 0.5)', color: '#FFB340' },
};

const shellStyle = {
  backgroundColor: '#0F0F10',
  color: '#EBEBF5',
  fontFamily,
  WebkitFontSmoothing: 'antialiased',
  minHeight: '100vh',
  width: '100vw',
};

const containerStyle = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: '32px 28px 80px',
};

const DemoList = () => {
  const navigate = useNavigate();
  const demos = DEMO_LIST;

  return (
    <div style={shellStyle}>
      <TopBar onExit={() => navigate('/')} onStart={() => navigate('/start')} />
      <div style={containerStyle}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{
            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.8px',
            fontWeight: 700, color: '#0A84FF', marginBottom: '14px',
          }}>
            Example briefs
          </div>
          <h1 style={{
            fontFamily: serif, fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 500, letterSpacing: '-0.8px', color: '#EBEBF5',
            lineHeight: 1.15, marginBottom: '14px',
          }}>
            See what a Steelman brief looks like.
          </h1>
          <div style={{
            fontSize: '15px', color: 'rgba(235, 235, 245, 0.68)',
            lineHeight: 1.65, maxWidth: '720px',
          }}>
            Two example matters stress-tested by the full pipeline. Real cases run on your own evidence and your own current strategy — these are baked in for the demo.
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {demos.map(d => (
            <DemoCard key={d.id} demo={d} onOpen={() => navigate(`/demo/${d.id}`)} />
          ))}
        </div>

        <div style={{
          marginTop: '48px', padding: '24px 26px',
          backgroundColor: '#131314',
          border: '1px solid rgba(235, 235, 245, 0.06)',
          borderRadius: '12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '16px',
        }}>
          <div style={{ fontSize: '14px', color: 'rgba(235, 235, 245, 0.72)', maxWidth: '540px', lineHeight: 1.55 }}>
            Ready to stress-test your own matter? Drop your file in and we'll run the full pipeline.
          </div>
          <button
            onClick={() => navigate('/start')}
            style={{
              padding: '12px 22px', borderRadius: '8px',
              backgroundColor: '#0A84FF', color: 'white', border: 'none',
              fontSize: '14px', fontWeight: 600, fontFamily, cursor: 'pointer',
            }}
          >
            Stress-test a case →
          </button>
        </div>
      </div>
    </div>
  );
};

const DemoCard = ({ demo, onOpen }) => {
  const [hover, setHover] = useState(false);
  const verdictKey = (demo.brief?.verdict || demo.verdict || '').toLowerCase();
  const verdict = VERDICT_STYLES[verdictKey] || VERDICT_STYLES.borderline;
  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textAlign: 'left',
        backgroundColor: hover ? '#1E1E20' : '#1A1A1C',
        border: `1px solid ${hover ? 'rgba(10, 132, 255, 0.35)' : 'rgba(235, 235, 245, 0.06)'}`,
        borderRadius: '12px',
        padding: '24px 24px 22px',
        cursor: 'pointer',
        fontFamily,
        color: '#EBEBF5',
        transition: 'all 0.15s ease',
        display: 'flex', flexDirection: 'column', minHeight: '230px',
      }}
    >
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{
          fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px',
          color: 'rgba(235, 235, 245, 0.5)', fontWeight: 700,
          padding: '4px 8px', backgroundColor: 'rgba(235, 235, 245, 0.04)',
          border: '1px solid rgba(235, 235, 245, 0.08)', borderRadius: '999px',
        }}>
          {demo.jurisdiction || 'England & Wales'}
        </span>
        <span style={{
          fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.2px',
          color: verdict.color, fontWeight: 700,
          padding: '4px 10px', backgroundColor: verdict.bg,
          border: `1px solid ${verdict.border}`, borderRadius: '999px',
        }}>
          {verdict.label}
        </span>
      </div>
      <div style={{
        fontFamily: serif, fontSize: '20px', fontWeight: 500,
        letterSpacing: '-0.3px', color: '#EBEBF5', marginBottom: '10px',
        lineHeight: 1.25,
      }}>
        {demo.title}
      </div>
      <div style={{
        fontSize: '13px', color: 'rgba(235, 235, 245, 0.65)',
        lineHeight: 1.6, marginBottom: '16px', flex: 1,
      }}>
        {demo.teaser}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 'auto', paddingTop: '12px',
        borderTop: '1px solid rgba(235, 235, 245, 0.05)',
      }}>
        <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.45)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          {demo.case_type_label || demo.case_type || 'Case'}
        </div>
        <div style={{
          fontSize: '13px', fontWeight: 600,
          color: hover ? '#0A84FF' : 'rgba(10, 132, 255, 0.75)',
        }}>
          See the brief →
        </div>
      </div>
    </button>
  );
};

const TopBar = ({ onExit, onStart }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    backgroundColor: 'rgba(15, 15, 16, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
    padding: '14px 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <button
      onClick={onExit}
      style={{
        fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px',
        background: 'none', border: 'none', color: '#EBEBF5', cursor: 'pointer',
        fontFamily, padding: 0,
      }}
    >
      STEELMAN LITIGATION{' '}
      <span style={{ color: 'rgba(235, 235, 245, 0.5)', fontWeight: 400 }}>
        Adversarial premortem for UK litigation
      </span>
    </button>
    <button
      onClick={onStart}
      style={{
        padding: '8px 16px', borderRadius: '6px',
        backgroundColor: 'transparent', color: '#EBEBF5',
        border: '1px solid rgba(235, 235, 245, 0.15)',
        fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily,
      }}
    >
      Stress-test a case →
    </button>
  </div>
);

export default DemoList;
