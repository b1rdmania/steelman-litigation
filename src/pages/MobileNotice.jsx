import React from 'react';
import { useNavigate } from 'react-router-dom';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const MobileNotice = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh', width: '100vw',
      backgroundColor: '#0F0F10', color: '#EBEBF5',
      fontFamily, WebkitFontSmoothing: 'antialiased',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 28px', textAlign: 'center',
    }}>
      <div style={{
        fontWeight: 700, letterSpacing: '-0.5px', color: '#EBEBF5', fontSize: '15px',
        marginBottom: '40px',
      }}>
        PREMOTION{' '}
        <span style={{ color: 'rgba(235, 235, 245, 0.55)', fontWeight: 400 }}>
          Adversarial premortem for UK litigation
        </span>
      </div>

      <div style={{
        fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.5px',
        color: 'rgba(235, 235, 245, 0.4)', fontWeight: 600, marginBottom: '16px',
      }}>
        Best viewed on desktop or tablet
      </div>
      <h1 style={{
        fontFamily: serif, fontSize: '28px', fontWeight: 500, lineHeight: 1.2,
        letterSpacing: '-0.5px', color: '#EBEBF5', marginBottom: '20px',
        maxWidth: '420px',
      }}>
        Premotion is built for a bigger screen.
      </h1>
      <p style={{
        fontSize: '14px', color: 'rgba(235, 235, 245, 0.65)', lineHeight: 1.6,
        maxWidth: '380px', marginBottom: '32px',
      }}>
        The intake flow and the brief render are designed for desktop or tablet — they don't compress well to phone.
        <br /><br />
        Send yourself this link, or open it again on a laptop.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          backgroundColor: '#0A84FF', color: 'white', border: 'none',
          padding: '12px 24px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
          cursor: 'pointer', fontFamily,
        }}
      >
        Back to overview
      </button>
    </div>
  );
};

export default MobileNotice;
