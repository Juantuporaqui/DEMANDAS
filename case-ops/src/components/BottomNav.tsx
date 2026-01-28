// ============================================
// CASE OPS - Bottom Navigation Component
// Mobile-first, one-hand operation
// ============================================

import { NavLink } from 'react-router-dom';
import './BottomNav.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/search', label: 'Buscar', icon: '🔍' },
  { path: '/cases', label: 'Casos', icon: '📂' },
  { path: '/analytics', label: 'Analítica', icon: '📈' },
  { path: '/more', label: 'Más', icon: '☰' },
];

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
