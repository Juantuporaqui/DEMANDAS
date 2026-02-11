import { useEffect, useState } from 'react';
import { casesRepo } from '../../db/repositories';
import { formatDate } from '../../utils/dates';

export function AppFooter() {
  const [lastUpdated, setLastUpdated] = useState<string>('—');

  useEffect(() => {
    let isActive = true;
    casesRepo
      .getAll()
      .then((cases) => {
        if (!isActive) return;
        if (!cases.length) {
          setLastUpdated('—');
          return;
        }
        const latest = cases.reduce((max, current) =>
          current.updatedAt > max ? current.updatedAt : max
        , cases[0].updatedAt);
        setLastUpdated(formatDate(latest));
      })
      .catch(() => {
        if (isActive) setLastUpdated('—');
      });
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <footer
      className="relative w-full border-t border-white/[0.04] px-5 py-4 sm:px-6 lg:px-8"
      style={{ background: 'rgba(7, 11, 20, 0.6)' }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.06) 50%, transparent 100%)',
        }}
      />
      <div className="mx-auto flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="glow-dot glow-dot-green" style={{ width: '6px', height: '6px' }} />
          <span className="text-xs text-[var(--dim)]">
            Informacion confidencial · Uso interno exclusivo
          </span>
        </div>
        <span className="text-xs font-medium text-[var(--muted)] font-mono">
          Actualizado: {lastUpdated}
        </span>
      </div>
    </footer>
  );
}
