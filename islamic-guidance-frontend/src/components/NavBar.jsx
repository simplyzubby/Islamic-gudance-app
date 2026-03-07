import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const NAV_LINKS = [
  { path: '/dashboard', label: 'Home', icon: '✦' },
  { path: '/reflections', label: 'Journal', icon: '🌙' },
];

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: rgba(13, 17, 23, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(201, 168, 76, 0.15);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: system-ui, sans-serif;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .nav-brand-moon {
          width: 32px; height: 32px;
          border: 1.5px solid #C9A84C;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
        }
        .nav-brand-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #E8C97A, #C9A84C);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
          list-style: none;
          margin: 0; padding: 0;
        }
        .nav-link {
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 10px;
          color: #8a9ab5;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
        }
        .nav-link:hover {
          color: #E8DFD0;
          background: rgba(255,255,255,0.04);
        }
        .nav-link.active {
          color: #C9A84C;
          background: rgba(201, 168, 76, 0.1);
          border-color: rgba(201, 168, 76, 0.25);
        }
        .nav-logout {
          background: none;
          border: 1px solid rgba(138, 154, 181, 0.3);
          border-radius: 10px;
          padding: 8px 16px;
          color: #8a9ab5;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: system-ui;
          margin-left: 8px;
        }
        .nav-logout:hover {
          border-color: rgba(232, 140, 140, 0.5);
          color: #E88C8C;
        }
        @media (max-width: 480px) {
          .nav-links { display: none; }
          .nav-logout { display: none; }
        }
      `}</style>

      <nav className="navbar">
        <Link to="/dashboard" className="nav-brand">
          <div className="nav-brand-moon">🌙</div>
          <span className="nav-brand-name">Sakina</span>
        </Link>

        <ul className="nav-links">
          {NAV_LINKS.map(({ path, label, icon }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link ${pathname === path ? 'active' : ''}`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            </li>
          ))}
          <li>
            <button className="nav-logout" onClick={handleLogout}>
              Sign out
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}