
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      try {
        setUser(JSON.parse(localStorage.getItem('user') || 'null'));
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', syncUser);
    syncUser();

    return () => window.removeEventListener('storage', syncUser);
  }, [location.pathname]);

  const dashboardLink = user?.role === 'recruiter'
    ? { label: 'Recruiter Dashboard', to: '/recruiter-dashboard' }
    : user?.role === 'student'
      ? { label: 'Student Dashboard', to: '/student-dashboard' }
      : null;

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Find Jobs', to: '/jobs' },
    { label: 'Internships', to: '/internships' },
    ...(dashboardLink ? [dashboardLink] : []),
    ...(user?.role === 'recruiter'
      ? [{ label: 'Post a Job', to: '/post-job' }]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMenuOpen(false);
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    display: 'block',
    textDecoration: 'none',
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.85)',
    background: isActive ? 'rgba(139,92,246,0.15)' : 'transparent',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(11,26,46,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(124,58,237,0.2)',
    }}>
      <nav className="smarthire-navbar">
        <Link to="/" className="smarthire-brand"
          onClick={() => setMenuOpen(false)}>
          <span className="smarthire-logo">SH</span>
          <span>Smart<span style={{ color: '#a78bfa' }}>Hire</span></span>
        </Link>

        <div className="smarthire-desktop-links">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}
              end={link.to === '/'} style={linkStyle}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="smarthire-desktop-auth">
          {user ? (
            <>
              <span className="smarthire-welcome">
                Hi, {user.name || user.email || 'User'}
              </span>
              <button onClick={handleLogout} className="smarthire-auth-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="smarthire-auth-link">Login</Link>
              <Link to="/signup" className="smarthire-signup">Sign Up</Link>
            </>
          )}
        </div>

        <button className="smarthire-menu-button"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div className="smarthire-mobile-menu">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              style={linkStyle}>
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <button onClick={handleLogout} className="smarthire-mobile-action">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}
                className="smarthire-mobile-action">Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}
                className="smarthire-mobile-action">Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
                .smarthire-navbar {
                    max-width: 1200px;
                    min-height: 68px;
                    margin: auto;
                    padding: 0 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .smarthire-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    color: white;
                    text-decoration: none;
                    font-size: 1.3rem;
                    font-weight: 800;
                    white-space: nowrap;
                }
                .smarthire-logo {
                    display: grid;
                    place-items: center;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    background: linear-gradient(135deg,#7c3aed,#1e3a5f);
                    font-size: 0.85rem;
                }
                .smarthire-desktop-links,
                .smarthire-desktop-auth {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }
                .smarthire-welcome {
                    color: #ddd6fe;
                    font-size: 0.85rem;
                }
                .smarthire-auth-link {
                    color: white;
                    text-decoration: none;
                    padding: 0.6rem 0.8rem;
                }
                .smarthire-signup,
                .smarthire-auth-button {
                    background: #7c3aed;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    padding: 0.65rem 1rem;
                    text-decoration: none;
                    font-size: 0.9rem;
                    cursor: pointer;
                }
                .smarthire-menu-button {
                    display: none;
                    background: transparent;
                    border: 0;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                .smarthire-mobile-menu {
                    padding: 1rem 1.5rem;
                    background: #0b1a2e;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                }
                .smarthire-mobile-action {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                    padding: 0.75rem 1rem;
                    border: 1px solid #475569;
                    border-radius: 8px;
                    background: transparent;
                    color: white;
                    text-align: center;
                    text-decoration: none;
                    font: inherit;
                    cursor: pointer;
                }
                @media (max-width: 900px) {
                    .smarthire-desktop-links,
                    .smarthire-desktop-auth {
                        display: none;
                    }
                    .smarthire-menu-button {
                        display: block;
                    }
                }
            `}</style>
    </header>
  );
}
