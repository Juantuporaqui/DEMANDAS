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
    <footer className="w-full border-t border-white/[0.04] px-5 py-4 sm:px-6 lg:px-8"
      style={{ background: 'rgba(10, 15, 26, 0.5)' }}
    >
      <div className="mx-auto flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <span className="text-xs text-[var(--dim)]">
          Aviso: Informacion confidencial. Uso interno exclusivo.
        </span>
        <span className="text-xs font-medium text-[var(--muted)]">
          Ultima actualizacion: {lastUpdated}
        </span>
      </div>
    </footer>
  );
}
