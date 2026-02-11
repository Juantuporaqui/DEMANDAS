import { useEffect, useMemo, useState } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

const ROUTE_LABELS: Array<{ match: RegExp; label: string }> = [
  { match: /^\/(|dashboard|cases)$/i, label: 'Panel' },
  { match: /^\/events/i, label: 'Cronologia' },
  { match: /^\/documents/i, label: 'Documentos' },
  { match: /^\/facts/i, label: 'Evidencias' },
  { match: /^\/partidas/i, label: 'Economica' },
  { match: /^\/tasks/i, label: 'Tareas' },
  { match: /^\/analytics/i, label: 'Analitica' },
  { match: /^\/search/i, label: 'Buscador' },
  { match: /^\/warroom/i, label: 'War Room' },
  { match: /^\/tools/i, label: 'Herramientas' },
  { match: /^\/jurisprudencia/i, label: 'Jurisprudencia' },
  { match: /^\/settings/i, label: 'Ajustes' },
  { match: /^\/backup/i, label: 'Respaldo' },
  { match: /^\/audiencia/i, label: 'Audiencia' },
];

function formatLabel(value?: string | null) {
  if (!value) return '—';
  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getCaseReference(caseData?: Case, fallbackId?: string) {
  const raw = caseData?.autosNumber || caseData?.nig || fallbackId || '';
  if (!raw) return '—';
  return raw.length > 20 ? `${raw.slice(0, 17)}...` : raw;
}

function getRouteLabel(pathname: string) {
  const match = ROUTE_LABELS.find((entry) => entry.match.test(pathname));
  return match?.label ?? 'Case Ops';
}

export function AppHeader() {
  const location = useLocation();
  const matches = useMatches();
  const [caseData, setCaseData] = useState<Case | null>(null);

  const caseIdFromRoute = useMemo(() => {
    if (!location.pathname.startsWith('/cases/') || location.pathname === '/cases') {
      return null;
    }
    const params = matches.reduce<Record<string, string>>((acc, match) => {
      Object.entries(match.params).forEach(([key, value]) => {
        if (value) acc[key] = value;
      });
      return acc;
    }, {});
    return params.caseId || params.id || null;
  }, [location.pathname, matches]);

  useEffect(() => {
    let isActive = true;
    if (!caseIdFromRoute) {
      setCaseData(null);
      return undefined;
    }
    casesRepo
      .getById(caseIdFromRoute)
      .then((data) => {
        if (isActive) setCaseData(data ?? null);
      })
      .catch(() => {
        if (isActive) setCaseData(null);
      });
    return () => {
      isActive = false;
    };
  }, [caseIdFromRoute]);

  const isCaseContext = Boolean(caseIdFromRoute);
  const caseType = formatLabel(caseData?.type);
  const caseRole = formatLabel(caseData?.clientRole);
  const caseRef = getCaseReference(caseData ?? undefined, caseIdFromRoute ?? undefined);
  const caseTitle = isCaseContext
    ? caseData
      ? `${caseType} ${caseRef} · ${caseRole}`
      : `Caso ${caseRef}`
    : `Case Ops · ${getRouteLabel(location.pathname)}`;

  const phaseLabel = caseData?.status ? formatLabel(caseData.status) : '—';

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/[0.06]"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(24px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
      }}
    >
      {/* Top edge highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(251, 191, 36, 0.08) 20%, rgba(96, 165, 250, 0.06) 50%, rgba(167, 139, 250, 0.08) 80%, transparent 100%)',
        }}
      />

      <div className="mx-auto flex w-full items-center justify-between gap-3 px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
        <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0 flex-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--dim)]">
            Contexto
          </span>
          <span className="text-[13px] sm:text-[15px] font-semibold tracking-tight text-[var(--text)] truncate">
            {caseTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-secondary)] whitespace-nowrap backdrop-blur-sm">
            Fase: {phaseLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
