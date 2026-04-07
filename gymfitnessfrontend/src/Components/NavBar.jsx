import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/api';

/* ─────────────────────────────────── CSS ─────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&display=swap');

.NavBar {
  position: sticky; top: 0; z-index: 999;
  background: rgba(10,22,40,0.95);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(26,111,212,0.2);
}

.NavInner {
  max-width: 1300px; margin: 0 auto; padding: 0 24px;
  height: 62px; display: flex; align-items: center;
  justify-content: space-between; gap: 16px;
}

/* Logo */
.NavLogo {
  font-family: 'Bebas Neue', sans-serif; font-size: 24px;
  letter-spacing: 3px; color: #fff; cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  flex-shrink: 0; transition: color 0.2s; user-select: none;
}
.NavLogo:hover { color: #00d4ff; }
.NavLogo .amp  { color: #00d4ff; }

.NavProBadge {
  font-family: 'Rajdhani', sans-serif; font-size: 10px;
  font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  background: linear-gradient(135deg, rgba(255,214,0,0.2), rgba(255,152,0,0.1));
  border: 1px solid rgba(255,214,0,0.4); color: #ffd600;
  padding: 3px 10px; border-radius: 20px;
}

/* Desktop links */
.NavLinks {
  display: flex; align-items: center; gap: 2px;
  flex: 1; justify-content: center;
}

.NavLink {
  background: none; border: none; cursor: pointer;
  font-family: 'Rajdhani', sans-serif; font-size: 13px;
  font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.45); padding: 8px 13px; border-radius: 8px;
  transition: color 0.2s, background 0.2s;
  display: flex; align-items: center; gap: 6px; white-space: nowrap;
}
.NavLink:hover          { color: #fff; background: rgba(255,255,255,0.05); }
.NavLink.nl-active      { color: #00d4ff; background: rgba(0,212,255,0.08); }
.NavLink.nl-admin       { color: rgba(255,152,0,0.7); }
.NavLink.nl-admin:hover { color: #ff9800; background: rgba(255,152,0,0.06); }
.NavLink.nl-admin.nl-active { color: #ff9800; background: rgba(255,152,0,0.1); }

.LockIco { font-size: 10px; opacity: 0.7; }

/* Right side */
.NavRight {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
}

.NavUpgradeBtn {
  padding: 8px 16px; border-radius: 8px;
  border: 1px solid rgba(33,150,243,0.4);
  background: linear-gradient(135deg, rgba(26,111,212,0.18), rgba(33,150,243,0.1));
  color: #4db6ff; font-family: 'Rajdhani', sans-serif;
  font-size: 12px; font-weight: 700; letter-spacing: 1.5px;
  text-transform: uppercase; cursor: pointer; transition: all 0.22s;
  white-space: nowrap;
}
.NavUpgradeBtn:hover {
  background: linear-gradient(135deg, #1a6fd4, #2196f3);
  color: #fff; border-color: #2196f3;
  box-shadow: 0 4px 16px rgba(33,150,243,0.4);
}

.NavLogoutBtn {
  padding: 8px 16px; border-radius: 8px;
  border: 1px solid rgba(255,68,68,0.25);
  background: rgba(255,68,68,0.08); color: rgba(255,68,68,0.7);
  font-family: 'Rajdhani', sans-serif; font-size: 12px;
  font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; transition: all 0.22s;
}
.NavLogoutBtn:hover {
  background: rgba(255,68,68,0.18); color: #ff4444;
  border-color: rgba(255,68,68,0.5);
}

/* Hamburger */
.NavHamburger {
  display: none; background: none; border: none; cursor: pointer;
  color: rgba(255,255,255,0.7); font-size: 22px; padding: 4px;
  line-height: 1;
}

/* Mobile menu */
.MobileMenu {
  display: flex; flex-direction: column;
  padding: 10px 20px 18px; gap: 4px;
  border-top: 1px solid rgba(26,111,212,0.15);
  background: rgba(10,22,40,0.97);
}

.MobLink {
  background: none; border: none; cursor: pointer;
  font-family: 'Rajdhani', sans-serif; font-size: 15px;
  font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
  color: rgba(255,255,255,0.5); text-align: left; padding: 11px 14px;
  border-radius: 10px; transition: all 0.18s; display: flex;
  align-items: center; justify-content: space-between;
}
.MobLink:hover      { background: rgba(255,255,255,0.05); color: #fff; }
.MobLink.nl-active  { color: #00d4ff; background: rgba(0,212,255,0.08); }
.MobLink.nl-admin   { color: rgba(255,152,0,0.7); }

.MobUpgrade {
  background: linear-gradient(135deg, #1a6fd4, #2196f3) !important;
  color: #fff !important; text-align: center !important;
  justify-content: center !important; margin-top: 8px;
  box-shadow: 0 4px 16px rgba(33,150,243,0.3); border-radius: 12px !important;
}
.MobLogout {
  background: rgba(255,68,68,0.08) !important;
  color: rgba(255,68,68,0.7) !important;
  border: 1px solid rgba(255,68,68,0.2) !important;
  border-radius: 12px !important;
}

@media (max-width: 820px) {
  .NavLinks     { display: none; }
  .NavLogoutBtn { display: none; }
  .NavUpgradeBtn { display: none; }
  .NavHamburger { display: block; }
}
`;

export default function NavBar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const email     = localStorage.getItem('userEmail');

  const [isPro,    setIsPro]    = useState(false);
  const [isAdmin,  setIsAdmin]  = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!email) return;
    // Check Pro status
    axios.get(apiUrl(`/api/payment/status?email=${email}`))
      .then(r => setIsPro(r.data.isPro))
      .catch(() => {});
    // Check admin token
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) setIsAdmin(true);
  }, [email]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    // Hard redirect → forces React to re-read localStorage from scratch
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path ? 'nl-active' : '';
  const go       = (path) => { navigate(path); setMenuOpen(false); };

  const links = [
    { label: 'Dashboard',  path: '/dashboard'  },
    { label: 'Attendance', path: '/attendence' },
    { label: 'Records',    path: '/records'    },
    { label: 'Goals',      path: '/goals',     lock: !isPro },
    { label: 'Pricing',    path: '/pricing'    },
    { label: 'About',      path: '/about'      },
    ...(isAdmin ? [{ label: '⚙ Admin', path: '/admin', admin: true }] : []),
  ];

  return (
    <>
      <style>{css}</style>
      <nav className="NavBar">
        <div className="NavInner">

          {/* Logo */}
          <div className="NavLogo" onClick={() => go('/dashboard')}>
            Sweat<span className="amp">&</span>Gain
            {isPro && <span className="NavProBadge">⭐ PRO</span>}
          </div>

          {/* Desktop links */}
          <div className="NavLinks">
            {links.map(l => (
              <button
                key={l.path}
                className={`NavLink ${isActive(l.path)} ${l.admin ? 'nl-admin' : ''}`}
                onClick={() => go(l.path)}
              >
                {l.label}
                {l.lock && <span className="LockIco">🔒</span>}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="NavRight">
            {!isPro && (
              <button className="NavUpgradeBtn" onClick={() => go('/pricing')}>
                ⚡ Go Pro
              </button>
            )}
            <button className="NavLogoutBtn" onClick={handleLogout}>Logout</button>
            <button className="NavHamburger" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>

        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="MobileMenu">
            {links.map(l => (
              <button
                key={l.path}
                className={`MobLink ${isActive(l.path)} ${l.admin ? 'nl-admin' : ''}`}
                onClick={() => go(l.path)}
              >
                {l.label}
                {l.lock && <span>🔒</span>}
              </button>
            ))}
            {!isPro && (
              <button className="MobLink MobUpgrade" onClick={() => go('/pricing')}>
                ⚡ Go Pro — Rs 1,500/mo
              </button>
            )}
            <button className="MobLink MobLogout" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </nav>
    </>
  );
}
