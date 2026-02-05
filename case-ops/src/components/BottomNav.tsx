// ============================================
// CASE OPS — Mobile Bottom Navigation (Premium)
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
        background: 'rgba(10, 15, 26, 0.92)',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-full h-full gap-1
              transition-colors duration-200
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
