import { useEffect, useMemo, useState } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

const ROUTE_LABELS: Array<{ match: RegExp; label: string }> = [
  { match: /^\/(|dashboard|cases)$/i, label: 'Panel' },
  { match: /^\/events/i, label: 'Cronología' },
  { match: /^\/documents/i, label: 'Documentos' },
  { match: /^\/facts/i, label: 'Evidencias' },
  { match: /^\/partidas/i, label: 'Económica' },
  { match: /^\/tasks/i, label: 'Tareas' },
  { match: /^\/analytics/i, label: 'Analítica' },
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
  return raw.length > 20 ? `${raw.slice(0, 17)}…` : raw;
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
      className="sticky top-0 z-40 border-b border-slate-800/60 bg-slate-950/70 backdrop-blur-sm"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Contexto</span>
          <span className="text-sm font-semibold text-slate-100 sm:text-base">{caseTitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-slate-700/70 bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">
            Fase: {phaseLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
