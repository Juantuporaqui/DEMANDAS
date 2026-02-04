// ============================================
// CASE OPS - Global Case Timeline Page
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { casesRepo } from '../../db/repositories';
import { PicassentTimeline } from '../cases/PicassentTimeline';
import { MislataTimeline } from '../cases/MislataTimeline';
import { QuartTimeline } from '../cases/QuartTimeline';

const STORAGE_KEY = 'caseops.timeline.activeCase';

type CaseKey = 'picassent' | 'mislata' | 'quart';

type CaseOption = {
  id: CaseKey;
  label: string;
  timeline: JSX.Element;
};

const CASE_OPTIONS: CaseOption[] = [
  { id: 'picassent', label: 'Picassent', timeline: <PicassentTimeline /> },
  { id: 'mislata', label: 'Mislata', timeline: <MislataTimeline /> },
  { id: 'quart', label: 'Quart', timeline: <QuartTimeline /> },
];

const DEFAULT_CASE: CaseKey = 'picassent';

const FALLBACK_CASE_IDS: Record<CaseKey, string> = {
  picassent: 'picassent-715-2024',
  mislata: 'mislata-hipoteca',
  quart: 'quart-362-2023',
};

function isValidCaseKey(value: string | null): value is CaseKey {
  return value === 'picassent' || value === 'mislata' || value === 'quart';
}

function getInitialCase(): CaseKey {
  const params = new URLSearchParams(window.location.search);
  const queryCase = params.get('caseId');
  if (isValidCaseKey(queryCase)) {
    return queryCase;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (isValidCaseKey(stored)) {
    return stored;
  }
  return DEFAULT_CASE;
}

export function CaseTimelinePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCase, setActiveCase] = useState<CaseKey>(getInitialCase);
  const [caseIds, setCaseIds] = useState<Record<CaseKey, string>>(FALLBACK_CASE_IDS);

  useEffect(() => {
    const requested = searchParams.get('caseId');
    if (isValidCaseKey(requested) && requested !== activeCase) {
      setActiveCase(requested);
    }
  }, [activeCase, searchParams]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, activeCase);
    const current = searchParams.get('caseId');
    if (current !== activeCase) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.set('caseId', activeCase);
      setSearchParams(nextParams, { replace: true });
    }
  }, [activeCase, searchParams, setSearchParams]);

  useEffect(() => {
    let mounted = true;
    casesRepo.getAll()
      .then((cases) => {
        if (!mounted) return;
        const next = { ...FALLBACK_CASE_IDS };
        cases.forEach((caseItem) => {
          const haystack = `${caseItem.id} ${caseItem.title ?? ''} ${caseItem.autosNumber ?? ''}`.toLowerCase();
          if (haystack.includes('picassent')) next.picassent = caseItem.id;
          if (haystack.includes('mislata')) next.mislata = caseItem.id;
          if (haystack.includes('quart')) next.quart = caseItem.id;
        });
        setCaseIds(next);
      })
      .catch((error) => {
        console.error('Error loading cases for timeline:', error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const activeTimeline = useMemo(() => {
    return CASE_OPTIONS.find((option) => option.id === activeCase)?.timeline ?? null;
  }, [activeCase]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cronología global</h1>
          <p className="page-subtitle">Consulta la línea temporal por procedimiento.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/events/agenda" className="btn btn-secondary btn-sm">
            Ver agenda
          </Link>
          <Link
            to={`/events/new?caseId=${caseIds[activeCase]}`}
            className="btn btn-primary btn-sm"
          >
            + Añadir
          </Link>
        </div>
      </div>

      <div
        data-testid="timeline-case-selector"
        className="card-base card-subtle mb-4 p-3 relative z-10"
      >
        <div className="block sm:hidden">
          <label htmlFor="timeline-case-select" className="text-xs uppercase tracking-wider text-slate-400">
            Caso
          </label>
          <select
            id="timeline-case-select"
            className="form-select mt-2"
            value={activeCase}
            onChange={(event) => setActiveCase(event.target.value as CaseKey)}
          >
            {CASE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="hidden sm:flex flex-wrap gap-2">
          {CASE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`btn btn-sm ${activeCase === option.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveCase(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {activeTimeline}
      </div>
    </div>
  );
}
