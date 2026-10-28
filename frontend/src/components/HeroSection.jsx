// ──────────────────────────────────────────────────────────────
//  HeroSection Component
//  Full-screen dark hero with headline + search bar.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';

// Props:
//  onSearch(title, location) — called when user submits the search form
export default function HeroSection({ onSearch }) {
  const [title,    setTitle]    = useState('');
  const [location, setLocation] = useState('');

  // When the user clicks Search
  function handleSubmit(e) {
    e.preventDefault();
    onSearch(title.trim(), location.trim());
    // Smoothly scroll down to the job listings
    document.getElementById('featured-jobs')?.scrollIntoView({ behavior: 'smooth' });
  }

  // Popular search tag shortcuts
  const quickSearches = ['React Developer', 'Data Analyst', 'UI/UX Design', 'MBA Internship'];

  return (
    <section
      className="hero-gradient"
      style={{ padding: '6rem 1.5rem 5rem', textAlign: 'center' }}
    >
      {/* Decorative blurred circles */}
      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          position: 'absolute', top: '-60px', left: '-80px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', right: '-80px',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(30,58,95,0.35) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* ── Badge pill ── */}
        <div className="fade-in-up" style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-violet" style={{ fontSize: '0.8rem', padding: '0.4rem 1.1rem' }}>
            🎓 &nbsp;India's #1 Campus Hiring Platform
          </span>
        </div>

        {/* ── Main Heading ── */}
        <h1
          className="fade-in-up fade-delay-1"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.12,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
          }}
        >
          Find Your Dream&nbsp;
          <span className="gradient-text">Job &amp; Internship</span>
        </h1>

        {/* ── Subheading ── */}
        <p
          className="fade-in-up fade-delay-2"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.72)',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
          }}
        >
          Connect with top companies · 8,000+ listings · Updated daily
        </p>

        {/* ── Search Bar ── */}
        <form
          onSubmit={handleSubmit}
          className="fade-in-up fade-delay-3"
          id="search-form"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '0.75rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Job title input */}
          <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: '#ffffff', borderRadius: '10px', padding: '0 1rem' }}>
            <svg width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="search-title"
              type="text"
              placeholder="Job title, skill, or company"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                border: 'none', outline: 'none', width: '100%',
                padding: '0.85rem 0', fontSize: '0.95rem',
                color: '#0f2137', background: 'transparent',
              }}
            />
          </div>

          {/* Location input */}
          <div style={{ flex: '1 1 180px', display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: '#ffffff', borderRadius: '10px', padding: '0 1rem' }}>
            <svg width="18" height="18" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            <input
              id="search-location"
              type="text"
              placeholder="City or Remote"
              value={location}
              onChange={e => setLocation(e.target.value)}
              style={{
                border: 'none', outline: 'none', width: '100%',
                padding: '0.85rem 0', fontSize: '0.95rem',
                color: '#0f2137', background: 'transparent',
              }}
            />
          </div>

          {/* Search button */}
          <button
            id="search-btn"
            type="submit"
            className="btn-primary"
            style={{ borderRadius: '10px', padding: '0.85rem 2rem', fontSize: '1rem' }}
          >
            Search Jobs
          </button>
        </form>

        {/* ── Quick Search Tags ── */}
        <div className="fade-in-up fade-delay-4" style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: '2' }}>Popular:</span>
          {quickSearches.map(tag => (
            <button
              key={tag}
              onClick={() => { setTitle(tag); onSearch(tag, location); document.getElementById('featured-jobs')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)',
                borderRadius: '999px',
                padding: '0.3rem 0.9rem',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.target.style.background = 'rgba(139,92,246,0.2)'; e.target.style.borderColor = '#8b5cf6'; }}
              onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── Stats Row ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '2rem',
          justifyContent: 'center', marginTop: '3.5rem',
        }}>
          {[
            { value: '8,000+', label: 'Active Jobs' },
            { value: '1,200+', label: 'Companies' },
            { value: '50,000+', label: 'Students Hired' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#ffffff' }}>{stat.value}</div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
