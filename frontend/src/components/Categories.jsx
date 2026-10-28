// ──────────────────────────────────────────────────────────────
//  Categories Component
//  Horizontally scrollable category filter pills.
// ──────────────────────────────────────────────────────────────

// Props:
//  categories      — array of category objects from jobsData.js
//  activeCategory  — currently selected category id
//  onSelect(id)    — called when user clicks a category
export default function Categories({ categories, activeCategory, onSelect }) {
  return (
    <section className="section-padding" style={{ background: '#ffffff', paddingTop: '3.5rem', paddingBottom: '0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── Section Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            ✦ Browse By Category
          </p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0f2137', letterSpacing: '-0.02em' }}>
            Popular Job Categories
          </h2>
        </div>

        {/* ── Category Pills ── */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '1rem',
        }}>
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`category-${cat.id}`}
                onClick={() => onSelect(cat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '999px',
                  border: isActive ? '2px solid #7c3aed' : '2px solid #e5e7eb',
                  background: isActive
                    ? 'linear-gradient(135deg, #7c3aed, #1e3a5f)'
                    : '#ffffff',
                  color: isActive ? '#ffffff' : '#374151',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 14px rgba(124,58,237,0.3)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#7c3aed';
                    e.currentTarget.style.color = '#7c3aed';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                <span>{cat.label}</span>
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                  color: isActive ? '#ffffff' : '#6b7280',
                  borderRadius: '999px',
                  padding: '0.1rem 0.55rem',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Visual Divider ── */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)', marginTop: '1rem' }} />
      </div>
    </section>
  );
}
