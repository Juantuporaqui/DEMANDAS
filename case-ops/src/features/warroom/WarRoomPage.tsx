// ============================================
// CASE OPS - War Room Page
// Tarjetas de sala personalizadas (sin duplicar Matriz Estratégica)
// ============================================

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { casesRepo, strategiesRepo } from '../../db/repositories';
import type { Strategy } from '../../types';
import {
  Shield, Copy, Target, Plus, ArrowLeft, Search, ExternalLink,
} from 'lucide-react';

// ============================================
// CONSTANTES
// ============================================

type CaseKey = 'picassent' | 'mislata' | 'quart';

const STORAGE_KEY = 'caseops.warroom.activeCase';

const CASE_OPTIONS: Array<{ id: CaseKey; label: string; tone: string; badge: string }> = [
  {
    id: 'picassent',
    label: 'Picassent',
    tone: 'border-orange-500/40 text-orange-200',
    badge: 'bg-orange-500/20 text-orange-200 border border-orange-500/40',
  },
  {
    id: 'mislata',
    label: 'Mislata',
    tone: 'border-cyan-500/40 text-cyan-200',
    badge: 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40',
  },
  {
    id: 'quart',
    label: 'Quart',
    tone: 'border-indigo-500/40 text-indigo-200',
    badge: 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/40',
  },
];

const DEFAULT_CASE: CaseKey = 'picassent';

const FALLBACK_CASE_IDS: Record<CaseKey, string> = {
  picassent: 'picassent-715-2024',
  mislata: 'mislata-1185-2025',
  quart: 'quart-etj-1428-2025',
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

function formatRelativeDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

// ============================================
// PÁGINA PRINCIPAL WAR ROOM
// ============================================

export function WarRoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeCase, setActiveCase] = useState<CaseKey>(getInitialCase);
  const [caseIds, setCaseIds] = useState<Record<CaseKey, string>>(FALLBACK_CASE_IDS);
  const [searchQuery, setSearchQuery] = useState('');
  const latestSearchParamsRef = useRef(searchParams);

  useEffect(() => {
    strategiesRepo.getAll().then((data) => {
      setStrategies(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const requested = searchParams.get('caseId');
    if (!isValidCaseKey(requested)) return;
    setActiveCase((prev) => (prev !== requested ? requested : prev));
  }, [searchParams]);

  useEffect(() => {
    latestSearchParamsRef.current = searchParams;
  }, [searchParams]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, activeCase);
    const params = latestSearchParamsRef.current;
    const current = params.get('caseId');
    if (current === activeCase) return;
    const nextParams = new URLSearchParams(params);
    const hasExtraParams = Array.from(nextParams.keys()).some((key) => key !== 'caseId');
    if (hasExtraParams) {
      nextParams.set('caseId', activeCase);
      setSearchParams(nextParams, { replace: true });
    } else {
      setSearchParams({ caseId: activeCase }, { replace: true });
    }
  }, [activeCase, setSearchParams]);

  useEffect(() => {
    let mounted = true;
    casesRepo
      .getAll()
      .then((cases) => {
        if (!mounted) return;
        const next = { ...FALLBACK_CASE_IDS };
        cases.forEach((caseItem) => {
          const haystack = `${caseItem.id} ${caseItem.title ?? ''} ${caseItem.autosNumber ?? ''} ${caseItem.court ?? ''}`.toLowerCase();
          if (haystack.includes('picassent')) next.picassent = caseItem.id;
          if (haystack.includes('mislata')) next.mislata = caseItem.id;
          if (haystack.includes('quart')) next.quart = caseItem.id;
        });
        setCaseIds(next);
      })
      .catch((error) => {
        console.error('Error loading cases for war room:', error);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const customStrategies = useMemo(() => {
    return strategies.filter((strategy) => strategy.caseId === caseIds[activeCase]);
  }, [activeCase, caseIds, strategies]);

  const filteredStrategies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return customStrategies;
    return customStrategies.filter((s) => {
      const blob = [s.attack, s.rebuttal, ...(s.tags || [])].filter(Boolean).join(' ').toLowerCase();
      return blob.includes(q);
    });
  }, [customStrategies, searchQuery]);

  const customCounts = useMemo(() => {
    return {
      picassent: strategies.filter((strategy) => strategy.caseId === caseIds.picassent).length,
      mislata: strategies.filter((strategy) => strategy.caseId === caseIds.mislata).length,
      quart: strategies.filter((strategy) => strategy.caseId === caseIds.quart).length,
    };
  }, [caseIds, strategies]);

  const getRiskColor = (riskText: string) => {
    const text = (riskText || '').toLowerCase();
    if (text.includes('alto')) return 'border-l-rose-500 bg-rose-500/5';
    if (text.includes('medio')) return 'border-l-amber-500 bg-amber-500/5';
    return 'border-l-emerald-500 bg-emerald-500/5';
  };

  const getRiskBadge = (riskText: string) => {
    const text = (riskText || '').toLowerCase();
    if (text.includes('alto')) return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    if (text.includes('medio')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast de copiado */}
      {copiedText && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <Copy size={16} />
          Copiado al portapapeles
        </div>
      )}

      {/* Header */}
      <header className="space-y-6">
        <div>
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 lg:hidden"
          >
            <ArrowLeft size={14} />
            Volver al Panel
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[var(--radius-md)] flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Target className="text-white" size={20} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                Tarjetas de sala
              </p>
              <h1 className="text-[28px] font-semibold text-slate-100 tracking-tight">War Room</h1>
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Tácticas rápidas (ataque / respuesta / plan de prueba). La matriz vive en el caso &gt; Estrategia.
          </p>
        </div>

        {/* Case selector */}
        <div className="card-base card-subtle flex flex-wrap items-center gap-2 p-3">
          {CASE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setActiveCase(option.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${option.tone} ${
                activeCase === option.id
                  ? 'bg-slate-900 shadow-[0_0_0_2px_rgba(148,163,184,0.25)]'
                  : 'bg-slate-900/40 hover:bg-slate-900'
              }`}
            >
              <span>{option.label}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${option.badge}`}>
                {customCounts[option.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/cases/${caseIds[activeCase]}?tab=estrategia`}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/20"
          >
            <ExternalLink size={14} />
            Ver Matriz
          </Link>
          {activeCase === 'picassent' && (
            <Link
              to={`/cases/${caseIds.picassent}?tab=audiencia`}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-200 transition hover:border-amber-400/60 hover:bg-amber-500/20"
            >
              <ExternalLink size={14} />
              Ir a Audiencia Previa
            </Link>
          )}
          <Link
            to={`/warroom/new?caseId=${caseIds[activeCase]}`}
            className="inline-flex items-center gap-2 justify-center rounded-full bg-gradient-to-r from-rose-600 to-rose-500 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-900/30 hover:shadow-rose-900/50 transition-shadow"
          >
            <Plus size={16} />
            Nueva Tarjeta
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por ataque, réplica o tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none"
          />
        </div>
      </header>

      {/* Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Cargando...</div>
      ) : filteredStrategies.length === 0 ? (
        <div className="card-base card-subtle border-dashed border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-slate-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">
            {searchQuery ? 'Sin resultados para esta búsqueda' : 'No hay tarjetas para este caso'}
          </h3>
          <p className="text-slate-500 mb-6">
            {searchQuery ? 'Prueba con otros términos.' : 'Crea una estrategia personalizada para empezar a trabajar.'}
          </p>
          {!searchQuery && (
            <Link
              to={`/warroom/new?caseId=${caseIds[activeCase]}`}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
            >
              <Plus size={16} />
              Crear tarjeta
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredStrategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`
                card-base card-elevated relative flex flex-col justify-between overflow-hidden p-5
                transition-all hover:border-slate-700 hover:shadow-xl
                border-l-4 ${getRiskColor(strategy.risk)}
              `}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono text-slate-500">
                    #{strategy.id.slice(0, 4)}
                  </span>
                  <div className="flex items-center gap-2">
                    {strategy.risk && (
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getRiskBadge(strategy.risk)}`}>
                        {strategy.risk}
                      </span>
                    )}
                    {(strategy as Record<string, unknown>).updatedAt && (
                      <span className="text-[10px] text-slate-500">
                        {formatRelativeDate((strategy as Record<string, unknown>).updatedAt as string)}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-slate-100 leading-snug text-lg">{strategy.attack}</h3>

                <div className="rounded-xl bg-slate-950/50 p-4 border border-slate-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="text-emerald-400" size={14} />
                    <p className="text-[10px] uppercase text-emerald-400 font-bold tracking-wider">
                      Respuesta
                    </p>
                  </div>
                  <p className="text-sm text-slate-300 line-clamp-3">{strategy.rebuttal}</p>
                </div>

                {strategy.tags && strategy.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {strategy.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] rounded-full border border-slate-600/40 bg-slate-800/40 px-2 py-0.5 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800/50">
                <button
                  type="button"
                  onClick={() => handleCopy(strategy.attack || '')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-semibold text-rose-200 transition hover:border-rose-400/60"
                >
                  <Copy size={12} />
                  Copiar ataque
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(strategy.rebuttal || '')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-200 transition hover:border-emerald-400/60"
                >
                  <Copy size={12} />
                  Copiar réplica
                </button>
                <Link
                  to={`/warroom/${strategy.id}/edit`}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-slate-600/40 bg-slate-800/40 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition hover:border-slate-500/60"
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
