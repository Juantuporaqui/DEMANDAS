// ============================================
// CHALADITA CASE-OPS - HECHOS PAGE (VERSIÓN MAESTRA INTEGRADA)
// ============================================

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Scale, Clock, AlertTriangle, RefreshCw, List, Grid3X3 
} from 'lucide-react';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';
import { HechoCard, HechoBadge } from '../components/HechoCard';
import { HechoExpandible } from '../components/HechoExpandible';
import { 
  hechosReclamados, 
  resumenContador, 
  calcularTotales, 
  type EstadoHecho 
} from '../../../data/hechosReclamados';

type FilterKey = 'todos' | 'prescrito' | 'compensable' | 'disputa';

const filters: { key: FilterKey; label: string; icon: any }[] = [
  { key: 'todos', label: 'Todos', icon: FileText },
  { key: 'prescrito', label: 'Prescritos', icon: Clock },
  { key: 'compensable', label: 'Compensables', icon: Scale },
  { key: 'disputa', label: 'En disputa', icon: AlertTriangle },
];

export function HechosPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const [viewMode, setViewMode] = useState<'expandible' | 'compact'>('expandible');
  const totales = calcularTotales();

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
    }
    window.location.reload();
  };

  const filteredHechos = useMemo(() => {
    if (activeFilter === 'todos') return hechosReclamados;
    return hechosReclamados.filter((h) => h.estado === activeFilter);
  }, [activeFilter]);

  const countByEstado = {
    prescrito: hechosReclamados.filter(h => h.estado === 'prescrito').length,
    compensable: hechosReclamados.filter(h => h.estado === 'compensable').length,
    disputa: hechosReclamados.filter(h => h.estado === 'disputa').length,
  };

  return (
    <AnalyticsLayout
      title="Desglose de Hechos"
      subtitle="Análisis estratégico y refutación de partidas"
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle de Vista: Detalle vs Grid */}
          <div className="flex rounded-lg border border-slate-700 overflow-hidden bg-slate-900/50">
            <button
              type="button"
              onClick={() => setViewMode('expandible')}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'expandible'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <List size={14} />
              <span className="hidden sm:inline">Modo Lista</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                viewMode === 'compact'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid3X3 size={14} />
              <span className="hidden sm:inline">Modo War Room</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClearCache}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-white/5 transition"
          >
            ← Dashboard
          </button>
        </div>
      }
    >
      {/* 1. Panel de Control de Riesgos (KPIs) */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
          <div className="text-[10px] text-rose-300/70 uppercase font-bold tracking-widest mb-1">Total Demandado</div>
          <div className="text-2xl font-black text-rose-400">
            {resumenContador.totalReclamado.toLocaleString('es-ES')} €
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="text-[10px] text-emerald-300/70 uppercase font-bold tracking-widest mb-1">Potencial Prescrito</div>
          <div className="text-2xl font-black text-emerald-400">
            {totales.prescrito.toLocaleString('es-ES')} €
          </div>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="text-[10px] text-amber-300/70 uppercase font-bold tracking-widest mb-1">Exposición Real</div>
          <div className="text-2xl font-black text-amber-400">
            {resumenContador.cifraRiesgoReal.toLocaleString('es-ES')} €
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="text-[10px] text-cyan-300/70 uppercase font-bold tracking-widest mb-1">% Éxito Objetivo</div>
          <div className="text-2xl font-black text-cyan-400">
            {resumenContador.reduccionObjetivo}%
          </div>
        </div>
      </section>

      {/* 2. Filtros de Estado */}
      <div className="flex gap-2 overflow-x-auto pb-2 mt-4 no-scrollbar">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${isActive 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-800/40 text-slate-500 border border-slate-700 hover:text-slate-300'}
              `}
            >
              <Icon size={14} />
              {filter.label}
              {filter.key !== 'todos' && (
                <span className="opacity-50">({countByEstado[filter.key as EstadoHecho]})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Listado Dinámico de Hechos */}
      <SectionCard
        title={`${filteredHechos.length} Hechos en Análisis`}
        subtitle="Visualización de contranarrativa y defensa legal"
      >
        <div className={viewMode === 'compact' ? "grid gap-4 sm:grid-cols-1" : "space-y-3"}>
          {filteredHechos.map((hecho) => (
            <div key={hecho.id} id={`hecho-${hecho.id}`} className="scroll-mt-24">
              {viewMode === 'expandible' ? (
                <HechoExpandible hecho={hecho} />
              ) : (
                <HechoCard hecho={hecho} />
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 4. Accesos Rápidos Estratégicos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
        {[
          { label: 'Prescripción', icon: Clock, path: '/analytics/prescripcion', color: 'text-emerald-400' },
          { label: 'Audiencia', icon: Scale, path: '/analytics/audiencia', color: 'text-amber-400' },
          { label: 'Partidas', icon: FileText, path: '/partidas', color: 'text-cyan-400' },
          { label: 'War Room', icon: AlertTriangle, path: '/warroom', color: 'text-rose-400' }
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.path)}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/50 hover:border-slate-500 transition-all group"
          >
            <btn.icon className={`w-6 h-6 ${btn.color} group-hover:scale-110 transition-transform`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{btn.label}</span>
          </button>
        ))}
      </div>
    </AnalyticsLayout>
  );
}
