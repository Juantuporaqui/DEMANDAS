import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { textMuted } from '../../../ui/tokens';

const navItems = [
  { label: 'Resumen', to: '/analytics' },
  { label: 'Picassent', to: '/analytics/picassent' },
  { label: 'Quart', to: '/analytics/quart' },
  { label: 'Mislata', to: '/analytics/mislata' },
  { label: 'Prescripción', to: '/analytics/prescripcion' },
  { label: 'Hechos', to: '/analytics/hechos' },
];

type AnalyticsLayoutProps = {
  children: ReactNode;
};

export function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Analytics</h1>
          <p className={`text-sm ${textMuted}`}>
            Panel ejecutivo inspirado en Chaladita.
          </p>
        </div>
      </div>

      <nav className="flex flex-wrap items-center gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                isActive
                  ? 'bg-zinc-900 text-white'
                  : 'border border-zinc-200/70 bg-white text-zinc-600'
              }`
            }
            end={item.to === '/analytics'}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {children}
    </div>
  );
}
