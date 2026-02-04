// ============================================
// CASE OPS - War Room Page (Legal Pro)
// Estrategia integrada para Picassent y Mislata
// Con badges visuales Defensa vs Ataque
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { casesRepo, strategiesRepo } from '../../db/repositories';
import type { Strategy } from '../../types';
import Button from '../../ui/components/Button';
import {
  getAllEstrategias,
  getEstrategiaPorProcedimiento,
  getEstrategiaPorTipo,
  type LineaEstrategica,
  type Procedimiento,
  type TipoEstrategia,
} from '../../data/estrategia/informeEstrategico';
import {
  Shield, Sword, MessageSquare, HelpCircle, AlertTriangle,
  Copy, ChevronDown, ChevronRight, Target, Scale, FileText,
  Zap, Plus, ArrowLeft
} from 'lucide-react';

// ============================================
// COMPONENTES DE BADGES VISUALES
// ============================================

interface TypeBadgeProps {
  tipo: TipoEstrategia;
  size?: 'sm' | 'md' | 'lg';
}

function TypeBadge({ tipo, size = 'md' }: TypeBadgeProps) {
  const config = {
    defensa: {
      icon: Shield,
      label: 'DEFENSA',
      bg: 'bg-emerald-500/20',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/20',
    },
    ataque: {
      icon: Sword,
      label: 'ATAQUE',
      bg: 'bg-rose-500/20',
      border: 'border-rose-500/50',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/20',
    },
    replica: {
      icon: MessageSquare,
      label: 'RÉPLICA',
      bg: 'bg-violet-500/20',
      border: 'border-violet-500/50',
      text: 'text-violet-400',
      glow: 'shadow-violet-500/20',
    },
    pregunta: {
      icon: HelpCircle,
      label: 'PREGUNTA',
      bg: 'bg-amber-500/20',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/20',
    },
  };

  const c = config[tipo];
  const Icon = c.icon;

  const sizeClasses = {
    sm: 'badge gap-1',
    md: 'badge gap-1.5',
    lg: 'badge gap-2',
  };

  const iconSizes = { sm: 12, md: 14, lg: 18 };

  return (
    <span className={`${sizeClasses[size]} ${c.bg} ${c.border} ${c.text} shadow-lg ${c.glow}`}>
      <Icon size={iconSizes[size]} />
      {c.label}
    </span>
  );
}

interface PriorityBadgeProps {
  prioridad: string;
}

function PriorityBadge({ prioridad }: PriorityBadgeProps) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    critica: { bg: 'bg-rose-500', text: 'text-white', label: 'CRÍTICA' },
    alta: { bg: 'bg-orange-500', text: 'text-white', label: 'ALTA' },
    media: { bg: 'bg-amber-500', text: 'text-slate-900', label: 'MEDIA' },
    baja: { bg: 'bg-slate-600', text: 'text-slate-200', label: 'BAJA' },
  };

  const c = config[prioridad] || config.media;

  return (
    <span className={`badge ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

interface ProcBadgeProps {
  procedimiento: Procedimiento;
}

function ProcBadge({ procedimiento }: ProcBadgeProps) {
  const isPicassent = procedimiento === 'picassent';

  return (
    <span
      className={`badge ${
        isPicassent
          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
      }`}
    >
      {isPicassent ? 'PICASSENT' : 'MISLATA'}
    </span>
  );
}

// ============================================
// COMPONENTE DE TARJETA DE ESTRATEGIA
// ============================================

function EstrategiaCard({
  estrategia,
  onCopy,
}: {
  estrategia: LineaEstrategica;
  onCopy: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const isDefense = estrategia.tipo === 'defensa';
  const isAttack = estrategia.tipo === 'ataque';

  // Border color based on type
  const borderColor = isDefense
    ? 'border-l-emerald-500'
    : isAttack
    ? 'border-l-rose-500'
    : estrategia.tipo === 'replica'
    ? 'border-l-violet-500'
    : 'border-l-amber-500';

  return (
    <div
      className={`
        card-base card-elevated overflow-hidden
        transition-all duration-300 border-l-4 ${borderColor}
        ${estrategia.prioridad === 'critica' ? 'ring-2 ring-rose-500/30 shadow-lg shadow-rose-500/10' : ''}
        hover:border-slate-700 hover:shadow-xl
      `}
    >
      {/* Header con badges */}
      <div className="p-4 border-b border-slate-800/50">
        {/* Primera fila: badges de tipo y procedimiento */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <TypeBadge tipo={estrategia.tipo} size="md" />
            <PriorityBadge prioridad={estrategia.prioridad} />
          </div>
          <ProcBadge procedimiento={estrategia.procedimiento} />
        </div>

        {/* Título */}
        <h3 className="font-semibold text-white text-lg leading-tight">{estrategia.titulo}</h3>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">{estrategia.descripcion}</p>
      </div>

      {/* Fundamento */}
      <div className="px-4 py-3 bg-slate-800/30 border-y border-slate-800/50">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="text-blue-400" size={14} />
          <p className="text-xs text-blue-400 uppercase font-bold tracking-wider">Fundamento Legal</p>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{estrategia.fundamento}</p>
      </div>

      {/* Frases clave */}
      {estrategia.frasesClave.length > 0 && (
        <div className="p-4 border-b border-slate-800/50">
          <div className="flex items-center gap-2 mb-3">
            <Target className="text-amber-400" size={14} />
            <p className="text-xs text-amber-400 uppercase font-bold tracking-wider">Frases Clave para Vista</p>
          </div>
          <div className="space-y-2">
            {estrategia.frasesClave.map((frase, i) => (
              <div
                key={i}
                className="card-base card-subtle border border-amber-500/20 rounded-xl p-3 flex items-start gap-3"
              >
                <div className="flex-1">
                  <p className="text-amber-200 text-sm italic leading-relaxed">"{frase}"</p>
                </div>
                <Button
                  onClick={() => onCopy(frase)}
                  variant="ghost"
                  className="text-amber-300 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1.5 text-xs"
                >
                  <Copy size={12} />
                  Copiar
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Botón expandir */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 text-sm text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        {expanded ? (
          <>
            <ChevronDown size={16} />
            Ocultar detalles
          </>
        ) : (
          <>
            <ChevronRight size={16} />
            Ver más detalles
          </>
        )}
      </button>

      {/* Contenido expandido */}
      {expanded && (
        <div className="p-4 border-t border-slate-800/50 space-y-4 bg-slate-950/30">
          {/* Artículos relacionados */}
          {estrategia.articulosRelacionados.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-cyan-400" size={14} />
                <p className="text-xs text-cyan-400 uppercase font-bold tracking-wider">Artículos</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {estrategia.articulosRelacionados.map((art) => (
                  <span
                    key={art}
                    className="badge bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                  >
                    {art}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documentos soporte */}
          {estrategia.documentosSoporte.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="text-blue-400" size={14} />
                <p className="text-xs text-blue-400 uppercase font-bold tracking-wider">Documentos Soporte</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {estrategia.documentosSoporte.map((doc) => (
                  <span
                    key={doc}
                    className="badge bg-blue-500/10 text-blue-300 border border-blue-500/30 font-mono"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Riesgos */}
          {estrategia.riesgos && (
            <div className="card-base card-subtle border border-rose-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-rose-400" size={14} />
                <p className="text-xs text-rose-400 uppercase font-bold tracking-wider">Riesgos</p>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{estrategia.riesgos}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// PÁGINA PRINCIPAL WAR ROOM
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

export function WarRoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProc, setFilterProc] = useState<Procedimiento | 'todos'>('todos');
  const [filterTipo, setFilterTipo] = useState<TipoEstrategia | 'todos'>('todos');
  const [showOnlyCriticas, setShowOnlyCriticas] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'estrategia' | 'custom'>('estrategia');
  const [activeCase, setActiveCase] = useState<CaseKey>(getInitialCase);
  const [caseIds, setCaseIds] = useState<Record<CaseKey, string>>(FALLBACK_CASE_IDS);

  useEffect(() => {
    strategiesRepo.getAll().then((data) => {
      setStrategies(data);
      setLoading(false);
    });
  }, []);

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

  useEffect(() => {
    if (activeTab !== 'estrategia') return;
    if (activeCase === 'picassent' || activeCase === 'mislata') {
      setFilterProc(activeCase);
    } else {
      setFilterProc('todos');
    }
  }, [activeCase, activeTab]);

  const allEstrategias = useMemo(() => getAllEstrategias(), []);
  const baseEstrategias = useMemo(() => {
    return allEstrategias.filter((e) => {
      if (filterProc !== 'todos' && e.procedimiento !== filterProc) return false;
      if (filterTipo !== 'todos' && e.tipo !== filterTipo) return false;
      if (showOnlyCriticas && e.prioridad !== 'critica') return false;
      return true;
    });
  }, [allEstrategias, filterProc, filterTipo, showOnlyCriticas]);

  const estrategiasFiltradas = useMemo(() => {
    return baseEstrategias.filter((e) => {
      if (activeCase === 'picassent') return e.procedimiento === 'picassent';
      if (activeCase === 'mislata') return e.procedimiento === 'mislata';
      return false;
    });
  }, [activeCase, baseEstrategias]);

  const customStrategies = useMemo(() => {
    return strategies.filter((strategy) => strategy.caseId === caseIds[activeCase]);
  }, [activeCase, caseIds, strategies]);

  const estrategiaCounts = useMemo(() => {
    return {
      picassent: baseEstrategias.filter((e) => e.procedimiento === 'picassent').length,
      mislata: baseEstrategias.filter((e) => e.procedimiento === 'mislata').length,
      quart: 0,
    };
  }, [baseEstrategias]);

  const customCounts = useMemo(() => {
    return {
      picassent: strategies.filter((strategy) => strategy.caseId === caseIds.picassent).length,
      mislata: strategies.filter((strategy) => strategy.caseId === caseIds.mislata).length,
      quart: strategies.filter((strategy) => strategy.caseId === caseIds.quart).length,
    };
  }, [caseIds, strategies]);

  const caseCounts = activeTab === 'estrategia' ? estrategiaCounts : customCounts;

  // Estadísticas mejoradas
  const stats = {
    total: allEstrategias.length,
    picassent: getEstrategiaPorProcedimiento('picassent').length,
    mislata: getEstrategiaPorProcedimiento('mislata').length,
    criticas: allEstrategias.filter((e) => e.prioridad === 'critica').length,
    defensas: allEstrategias.filter((e) => e.tipo === 'defensa').length,
    ataques: allEstrategias.filter((e) => e.tipo === 'ataque').length,
  };

  const getRiskColor = (riskText: string) => {
    const text = (riskText || '').toLowerCase();
    if (text.includes('alto')) return 'border-l-rose-500 bg-rose-500/5';
    if (text.includes('medio')) return 'border-l-amber-500 bg-amber-500/5';
    return 'border-l-emerald-500 bg-emerald-500/5';
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
                Centro de Estrategia
              </p>
              <h1 className="text-[28px] font-semibold text-slate-100 tracking-tight">War Room</h1>
            </div>
          </div>
        </div>

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
                {caseCounts[option.id]}
              </span>
            </button>
          ))}
        </div>

        {/* Stats con badges de Defensa vs Ataque */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="card-base card-subtle p-4 text-center">
            <p className="text-3xl font-semibold text-white">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total</p>
          </div>
          <div className="card-base card-subtle border border-emerald-500/30 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="text-emerald-400" size={18} />
              <p className="text-3xl font-semibold text-emerald-300">{stats.defensas}</p>
            </div>
            <p className="text-xs text-emerald-400">Defensas</p>
          </div>
          <div className="card-base card-subtle border border-rose-500/30 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Sword className="text-rose-400" size={18} />
              <p className="text-3xl font-semibold text-rose-300">{stats.ataques}</p>
            </div>
            <p className="text-xs text-rose-400">Ataques</p>
          </div>
          <div className="card-base card-subtle border border-orange-500/30 p-4 text-center">
            <p className="text-3xl font-semibold text-orange-300">{stats.picassent}</p>
            <p className="text-xs text-orange-400">Picassent</p>
          </div>
          <div className="card-base card-subtle border border-cyan-500/30 p-4 text-center">
            <p className="text-3xl font-semibold text-cyan-300">{stats.mislata}</p>
            <p className="text-xs text-cyan-400">Mislata</p>
          </div>
          <div className="card-base card-subtle border border-amber-500/30 p-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="text-amber-400" size={18} />
              <p className="text-3xl font-semibold text-amber-300">{stats.criticas}</p>
            </div>
            <p className="text-xs text-amber-400">Críticas</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('estrategia')}
          className={`px-5 py-3 text-sm font-medium rounded-t-[var(--radius-md)] transition-colors ${
            activeTab === 'estrategia'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <span className="flex items-center gap-2">
            <Target size={16} />
            Estrategia Predefinida
          </span>
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-5 py-3 text-sm font-medium rounded-t-[var(--radius-md)] transition-colors ${
            activeTab === 'custom'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText size={16} />
            Personalizada ({strategies.length})
          </span>
        </button>
      </div>

      {/* Tab: Estrategia Predefinida */}
      {activeTab === 'estrategia' && (
        <>
          {/* Filtros mejorados */}
          <div className="card-base card-subtle flex flex-wrap gap-3 p-4">
            {/* Filtro rápido Defensa/Ataque */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterTipo(filterTipo === 'defensa' ? 'todos' : 'defensa')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterTipo === 'defensa'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 border'
                    : 'bg-slate-800 border-slate-700 text-slate-400 border hover:text-emerald-300'
                }`}
              >
                <Shield size={16} />
                Defensas
              </button>
              <button
                onClick={() => setFilterTipo(filterTipo === 'ataque' ? 'todos' : 'ataque')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterTipo === 'ataque'
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 border'
                    : 'bg-slate-800 border-slate-700 text-slate-400 border hover:text-rose-300'
                }`}
              >
                <Sword size={16} />
                Ataques
              </button>
            </div>

            <div className="w-px bg-slate-700 self-stretch" />

            <select
              value={filterProc}
              onChange={(e) => setFilterProc(e.target.value as Procedimiento | 'todos')}
              className="bg-slate-800 text-white text-sm rounded-lg px-4 py-2 border border-slate-700 focus:border-amber-500 focus:outline-none"
            >
              <option value="todos">Todos los procedimientos</option>
              <option value="mislata">Mislata (demandante)</option>
              <option value="picassent">Picassent (demandado)</option>
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as TipoEstrategia | 'todos')}
              className="bg-slate-800 text-white text-sm rounded-lg px-4 py-2 border border-slate-700 focus:border-amber-500 focus:outline-none"
            >
              <option value="todos">Todos los tipos</option>
              <option value="defensa">🛡️ Defensas</option>
              <option value="ataque">⚔️ Ataques</option>
              <option value="replica">💬 Réplicas</option>
              <option value="pregunta">❓ Preguntas</option>
            </select>

            <button
              onClick={() => setShowOnlyCriticas(!showOnlyCriticas)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showOnlyCriticas
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 border'
                  : 'bg-slate-800 border-slate-700 text-slate-400 border hover:text-amber-300'
              }`}
            >
              <Zap size={16} />
              Solo críticas
            </button>

            <div className="flex items-center ml-auto text-sm text-slate-500">
              <span className="font-mono">{estrategiasFiltradas.length}</span>
              <span className="ml-1">líneas</span>
            </div>
          </div>

          {/* Lista de estrategias */}
          <div className="grid gap-4 lg:grid-cols-2">
            {estrategiasFiltradas.map((e) => (
              <EstrategiaCard key={e.id} estrategia={e} onCopy={handleCopy} />
            ))}
          </div>

          {estrategiasFiltradas.length === 0 && (
            <div className="card-base card-subtle border-dashed border-slate-700 p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="text-slate-500" size={32} />
              </div>
              <p className="text-slate-400 text-lg">No hay tarjetas para este caso</p>
              <p className="text-slate-600 text-sm mt-2">
                Ajusta los filtros o crea una estrategia personalizada para continuar.
              </p>
              <Link
                to={`/warroom/new?caseId=${caseIds[activeCase]}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
              >
                <Plus size={16} />
                Crear tarjeta
              </Link>
            </div>
          )}
        </>
      )}

      {/* Tab: Personalizada */}
      {activeTab === 'custom' && (
        <>
          <Link
            to={`/warroom/new?caseId=${caseIds[activeCase]}`}
            className="inline-flex items-center gap-2 justify-center rounded-[var(--radius-md)] bg-gradient-to-r from-rose-600 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/30 hover:shadow-rose-900/50 transition-shadow"
          >
            <Plus size={18} />
            Nueva Estrategia
          </Link>

          {loading ? (
            <div className="p-12 text-center text-slate-500">Cargando...</div>
          ) : customStrategies.length === 0 ? (
            <div className="card-base card-subtle border-dashed border-slate-700 p-12 text-center">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-slate-500" size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-200 mb-2">No hay tarjetas para este caso</h3>
              <p className="text-slate-500 mb-6">Crea una estrategia personalizada para empezar a trabajar.</p>
              <Link
                to={`/warroom/new?caseId=${caseIds[activeCase]}`}
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
              >
                <Plus size={16} />
                Crear tarjeta
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {customStrategies.map((strategy) => (
                <Link
                  key={strategy.id}
                  to={`/warroom/${strategy.id}/edit`}
                  className={`
                    card-base card-elevated relative flex flex-col justify-between overflow-hidden p-5
                    transition-all hover:border-slate-700 hover:shadow-xl active:scale-[0.98]
                    border-l-4 ${getRiskColor(strategy.risk)}
                  `}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-mono text-slate-500">
                        #{strategy.id.slice(0, 4)}
                      </span>
                      <div className="rounded-lg bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {strategy.caseId ? 'Vinculada' : 'General'}
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
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
