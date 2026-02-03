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
    <footer className="w-full border-t border-slate-800/50 bg-slate-950/60 px-4 py-3 text-[11px] text-slate-500 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <span className="opacity-70">
          Aviso: Información confidencial. Uso interno exclusivo.
        </span>
        <span className="font-medium text-slate-400">
          Última actualización: {lastUpdated}
        </span>
      </div>
    </footer>
  );
}
