// ──────────────────────────────────────────────────────────────
//  FeaturedJobs Component
//  Shows a filtered grid of job cards with a "Show More" toggle.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import JobCard from './JobCard';

// Props:
//  jobs    — full filtered array of job objects
//  loading — (optional) boolean to show a loading skeleton state
export default function FeaturedJobs({ jobs }) {
  // Initially show only 6 cards; "Show More" reveals the rest
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? jobs : jobs.slice(0, 6);

  return (
    <section id="featured-jobs" className="section-padding" style={{ background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
              ✦ Handpicked For You
            </p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f2137', letterSpacing: '-0.02em' }}>
              Featured Jobs &amp; Internships
            </h2>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            {jobs.length} listing{jobs.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* ── No results state ── */}
        {jobs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f2137', marginBottom: '0.5rem' }}>No results found</h3>
            <p style={{ color: '#6b7280' }}>Try a different keyword or location.</p>
          </div>
        ) : (
          <>
            {/* ── Jobs Grid ── */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {displayed.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* ── Show More / Show Less button ── */}
            {jobs.length > 6 && (
              <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                <button
                  id="show-more-btn"
                  onClick={() => setShowAll(!showAll)}
                  className="btn-outline"
                >
                  {showAll ? 'Show Less ↑' : `Show ${jobs.length - 6} More Jobs ↓`}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
