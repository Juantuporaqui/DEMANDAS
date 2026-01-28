import type { ReactNode } from 'react';
import type { AnalyticsCourtMeta } from '../../../types';
import { formatMoney } from '../utils/money';

type CourtCardProps = {
  court: AnalyticsCourtMeta;
  onClick?: () => void;
  className?: string;
  badgeClassName?: string;
  icon?: ReactNode;
};

export function CourtCard({
  court,
  onClick,
  className = '',
  badgeClassName = '',
  icon,
}: CourtCardProps) {
  const amount =
    court.cuantia === null || court.cuantia === undefined
      ? '—'
      : formatMoney(court.cuantia);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/80 p-5 text-left shadow-lg transition hover:border-emerald-400/40 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg">
              {icon}
            </span>
          ) : null}
          <div>
            <div className="text-lg font-semibold text-white">{court.title}</div>
            <div className="text-xs uppercase tracking-[0.25em] text-slate-400">
              {court.procedimiento || 'Procedimiento por definir'}
            </div>
          </div>
        </div>
        <span
          className={`rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 ${badgeClassName}`}
        >
          {amount}
        </span>
      </div>
      <div className="space-y-1 text-sm text-slate-300">
        {court.juzgado ? <div>Juzgado: {court.juzgado}</div> : null}
        {court.fase ? <div>Fase: {court.fase}</div> : null}
        {court.proximoHito ? <div>Próximo hito: {court.proximoHito}</div> : null}
      </div>
    </button>
  );
}
