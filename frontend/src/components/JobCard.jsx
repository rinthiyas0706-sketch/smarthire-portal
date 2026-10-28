// ──────────────────────────────────────────────────────────────
//  JobCard Component
//  Displays one job/internship listing as a styled card.
// ──────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Props:
//  job — a single job object from jobsData.js
export default function JobCard({ job }) {
  // Track broken logo image so we fall back to initials
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();

  // Decide badge color based on job type
  const isInternship =
    job.isInternship ?? job.type === 'Internship';

  const typeBadgeClass = isInternship
    ? 'badge badge-violet'
    : 'badge badge-navy';

  return (
    <article
      className="card-hover"
      style={{
        background: '#ffffff',
        border: '1px solid #e8ecf0',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: 'pointer',
      }}
    >
      {/* ── Top row: Logo + Title + Badge ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
        {/* Company Logo */}
        <div style={{
          width: '52px', height: '52px', flexShrink: 0,
          borderRadius: '12px', overflow: 'hidden',
          border: '1px solid #e8ecf0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#f1f5f9',
        }}>
          {!logoError && job.logo ? (
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              onError={() => setLogoError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }}
            />
          ) : (
            // Fallback: first two letters of company name
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#7c3aed' }}>
              {job.company.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {/* Title & Company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: '1rem', fontWeight: 700, color: '#0f2137',
            marginBottom: '0.2rem', whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {job.title}
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', fontWeight: 500 }}>
            {job.company}
          </p>
        </div>

        {/* Type badge */}
        <span className={typeBadgeClass} style={{ flexShrink: 0 }}>
          {job.type}
        </span>
      </div>

      {/* ── Meta: Location + Salary ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#6b7280' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {job.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#6b7280' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          {job.salary}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: '#6b7280' }}>
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {job.posted || 'Recently posted'}
        </span>
      </div>

      {/* ── Description snippet ── */}
      <p style={{
        fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {job.description}
      </p>

      {/* ── Skill Tags ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {job.skills.map(skill => (
          <span key={skill} style={{
            background: '#f5f3ff', color: '#7c3aed',
            borderRadius: '6px', padding: '0.2rem 0.6rem',
            fontSize: '0.75rem', fontWeight: 500,
          }}>
            {skill}
          </span>
        ))}
      </div>

      {/* ── Apply button ── */}

      {/* View Details and Apply buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: 'auto',
      }}>
        <button
          type="button"
          className="btn-primary"
          style={{
            flex: 1,
            borderRadius: '10px',
            padding: '0.7rem',
          }}
          onClick={() => navigate(`/jobs/${job.id ?? job._id}`)}
        >
          View Details
        </button>

        <button
          type="button"
          style={{
            flex: 1,
            border: '1px solid #4338ca',
            background: '#ffffff',
            color: '#4338ca',
            borderRadius: '10px',
            padding: '0.7rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
          onClick={() => {
            const jobId = job.id ?? job._id;
            sessionStorage.setItem('smarthireReturnTo', `/jobs/${jobId}`);
            navigate('/login', {
              state: { from: `/jobs/${jobId}` },
            });
          }}
        >
          Apply Now
        </button>
      </div>

    </article>
  );
}
