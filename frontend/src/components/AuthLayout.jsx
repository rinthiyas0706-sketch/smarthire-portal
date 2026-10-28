// ──────────────────────────────────────────────────────────────
//  AuthLayout — Shared wrapper for Login & Sign Up pages.
//  Left side: decorative branding panel (hidden on mobile).
//  Right side: the actual form (passed as children).
// ──────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom';

// Bullet points shown on the decorative left panel
const PERKS = [
  { icon: '🎯', text: 'Access 8,000+ job & internship listings' },
  { icon: '🏢', text: 'Connect with 1,200+ top companies' },
  { icon: '⚡', text: 'One-click apply with your SmartHire profile' },
  { icon: '🔔', text: 'Get alerts for roles that match your skills' },
];

// Props:
//  children — the form content (LoginForm or SignUpForm)
export default function AuthLayout({ children }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: "'Inter', sans-serif",
    }}>

      {/* ── LEFT PANEL — decorative branding (hidden on small screens) ── */}
      <div
        className="auth-left-panel"
        style={{
          flex: '0 0 45%',
          background: 'linear-gradient(155deg, #0b1a2e 0%, #0f2137 45%, #1a1060 100%)',
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glow blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', left: '-60px',
          width: '280px', height: '280px',
          background: 'radial-gradient(circle, rgba(30,58,95,0.5) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.6rem', marginBottom: '3rem' }}>
          <span style={{
            width: '40px', height: '40px',
            background: 'linear-gradient(135deg, #7c3aed, #1e3a5f)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <line x1="12" y1="12" x2="12" y2="17"/>
              <line x1="9"  y1="14.5" x2="15" y2="14.5"/>
            </svg>
          </span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Smart<span style={{ color: '#8b5cf6' }}>Hire</span>
          </span>
        </Link>

        {/* Headline */}
        <h2 style={{
          fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          marginBottom: '1rem',
        }}>
          Your next big opportunity<br />
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>starts here.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          India's smartest campus hiring platform — built for students and fresh graduates.
        </p>

        {/* Perk list */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {PERKS.map(perk => (
            <li key={perk.text} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <span style={{
                width: '36px', height: '36px', flexShrink: 0,
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.25)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem',
              }}>
                {perk.icon}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.88rem', lineHeight: 1.55, paddingTop: '0.4rem' }}>
                {perk.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Testimonial card */}
        <div style={{
          marginTop: '3rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
        }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.75rem', fontStyle: 'italic' }}>
            "Got my dream internship at Microsoft within 2 weeks of signing up!"
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #1e3a5f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700, color: '#fff',
            }}>A</div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#fff' }}>Arjun Sharma</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>CS Student, IIT Delhi</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: '#f8fafc',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          {children}
        </div>
      </div>

      {/* Responsive: hide left panel on small screens */}
      <style>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
