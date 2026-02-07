// ============================================
// CASE OPS — Case Card (Premium Redesign)
// ============================================

import { Link } from 'react-router-dom';
import type { Case } from '../../../types';
import { formatCurrency } from '../../../utils/validators';

type AccentStyle = {
  accent: string;
  border: string;
  icon: string;
};

type CaseCardProps = {
  caseItem: Case;
  accent: AccentStyle;
  statusLabel: string;
  statusBadge: string;
  roleLabel: string;
  opposingParty: string;
  opposingLawyer: string;
  impactAmountCents: number;
  hechosCount: number;
  documentosCount: number;
  estrategiasCount: number;
  microSummary: string;
  gapCount: number;
  nextEventLabel?: string;
};

export function CaseCard({
  caseItem,
  accent,
  statusLabel,
  statusBadge,
  roleLabel,
  opposingParty,
  opposingLawyer,
  impactAmountCents,
  hechosCount,
  documentosCount,
  estrategiasCount,
  microSummary,
  gapCount,
  nextEventLabel,
}: CaseCardProps) {
  return (
    <Link key={caseItem.id} to={`/cases/${caseItem.id}`} className="group flex h-full">
      <div
        className={`flex h-full w-full flex-col gap-4 sm:gap-5 rounded-[var(--radius-xl)] border bg-gradient-to-br ${accent.accent} ${accent.border} p-4 sm:p-6 shadow-[var(--shadow-1)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[var(--shadow-3)]`}
        style={{ backdropFilter: 'blur(12px)' }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-lg sm:text-xl flex-shrink-0">
              {accent.icon}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">{caseItem.title}</h2>
                <span
                  className={`rounded-full border px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] ${
                    statusBadge || 'border-white/[0.08] bg-white/[0.04] text-slate-300'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1.5 text-[13px] uppercase tracking-[0.15em] text-slate-400">
                {caseItem.court} · {caseItem.autosNumber || 'Sin autos'} · {roleLabel}
              </p>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                Parte contraria: {opposingParty} · Letrada: {opposingLawyer}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-3 sm:px-4 py-2 sm:py-2.5 text-right flex-shrink-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300/80">
              Cuantia procesal
            </div>
            <div className="mt-1 text-base sm:text-lg font-bold text-emerald-300 tracking-tight">
              {formatCurrency(impactAmountCents)}
            </div>
          </div>
        </div>

        {/* Counters */}
        <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-300">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5">
            Hechos {hechosCount}
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5">
            Documentos {documentosCount}
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5">
            Estrategias {estrategiasCount}
          </span>
        </div>

        {/* Summary */}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3.5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
            Que esta en juego
          </span>
          <p className="mt-1.5 text-sm text-slate-200 leading-relaxed">{microSummary}</p>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.1em] text-[var(--dim)] font-medium">Proximo hito</div>
            <div className="text-sm text-slate-200 mt-0.5">
              {nextEventLabel || 'Sin eventos proximos'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {gapCount > 0 && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/8 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-amber-300">
                Huecos {gapCount}
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-300 group-hover:text-emerald-200 transition-colors">
              Ver dossier &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
