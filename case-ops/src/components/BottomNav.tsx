// ============================================
// CASE OPS — Mobile Bottom Navigation (Premium v3)
// ============================================

import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Menu
} from 'lucide-react';

export function BottomNav() {
  const NAV_ITEMS = [
    { to: '/cases', label: 'Panel', icon: <LayoutDashboard size={20} /> },
    { to: '/tasks', label: 'Tareas', icon: <CheckSquare size={20} /> },
    { to: '/more', label: 'Menu', icon: <Menu size={20} /> },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06]"
      style={{
        background: 'rgba(7, 11, 20, 0.94)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.06) 50%, transparent 100%)',
        }}
      />
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              relative flex flex-col items-center justify-center w-full h-full gap-1
              transition-all duration-250
              ${isActive
                ? 'text-amber-400'
                : 'text-[var(--dim)] hover:text-slate-300'
              }
            `}
          >
            {item.icon}
            <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
