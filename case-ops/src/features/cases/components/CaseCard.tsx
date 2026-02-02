// ============================================
// CASE OPS - Case Card (Operative Overview)
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
        className={`flex h-full w-full flex-col gap-5 rounded-2xl border bg-gradient-to-br ${accent.accent} ${accent.border} p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-2xl">
              {accent.icon}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-white">{caseItem.title}</h2>
                <span
                  className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${
                    statusBadge || 'border-white/10 bg-white/5 text-slate-300'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                {caseItem.court} · {caseItem.autosNumber || 'Sin autos'} · {roleLabel}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Parte contraria: {opposingParty} · Letrada: {opposingLawyer}
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-right">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-100">
              Cuantía procesal
            </div>
            <div className="mt-1 text-lg font-semibold text-emerald-200">
              {formatCurrency(impactAmountCents)}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Hechos {hechosCount}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Documentos {documentosCount}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Estrategias {estrategiasCount}
          </span>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Qué está en juego
          </span>
          <p className="mt-1 text-sm text-slate-200">{microSummary}</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Próximo hito</div>
            <div className="text-sm text-slate-200">
              {nextEventLabel || 'Sin eventos próximos'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {gapCount > 0 && (
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-amber-200">
                Huecos {gapCount}
              </span>
            )}
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
              Ver dossier →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
