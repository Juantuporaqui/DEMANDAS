import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Scale, Clock, AlertTriangle } from 'lucide-react';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { HechoBadge, type HechoEstado } from '../components/HechoCard';
import { ReclamacionesTiles } from '../../../components/ReclamacionesTiles'; // Importamos el nuevo componente
import { hechosReclamados, resumenContador, calcularTotales } from '../../../data/hechosReclamados';

type FilterKey = 'todos' | 'prescrito' | 'compensable' | 'disputa';

const filters: { key: FilterKey; label: string; icon: typeof Clock }[] = [
  { key: 'todos', label: 'Todos', icon: FileText },
  { key: 'prescrito', label: 'Prescritos', icon: Clock },
  { key: 'compensable', label: 'Compensables', icon: Scale },
  { key: 'disputa', label: 'En disputa', icon: AlertTriangle },
];

export function HechosPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('todos');
  const totales = calcularTotales();

  // Mantenemos esto por los contadores de las Badges, aunque la visualización principal cambie
  const countByEstado = {
    prescrito: hechosReclamados.filter(h => h.estado === 'prescrito').length,
    compensable: hechosReclamados.filter(h => h.estado === 'compensable').length,
    disputa: hechosReclamados.filter(h => h.estado === 'disputa').length,
  };

  return (
    <AnalyticsLayout
      title="Desglose de Hechos"
      subtitle="10 partidas reclamadas con análisis detallado"
      actions={
        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:bg-white/5 transition"
        >
          ← Dashboard
        </button>
      }
    >
      {/* KPIs principales */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 to-transparent p-4">
          <div className="text-xs text-rose-300/70 uppercase tracking-wider mb-1">Total Reclamado</div>
          <div className="text-2xl font-bold text-rose-400">
            {resumenContador.totalReclamado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-4">
          <div className="text-xs text-emerald-300/70 uppercase tracking-wider mb-1">Prescrito (~)</div>
          <div className="text-2xl font-bold text-emerald-400">
            {totales.prescrito.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Art. 1964.2 CC</div>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-4">
          <div className="text-xs text-amber-300/70 uppercase tracking-wider mb-1">Riesgo Real</div>
          <div className="text-2xl font-bold text-amber-400">
            {resumenContador.cifraRiesgoReal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </div>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-4">
          <div className="text-xs text-cyan-300/70 uppercase tracking-wider mb-1">Reducción Objetivo</div>
          <div className="text-2xl font-bold text-cyan-400">
            {resumenContador.reduccionObjetivo}%
          </div>
        </div>
      </section>

      {/* Resumen con badges (informativo) */}
      <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl border border-slate-800/50 bg-slate-900/30">
        <span className="text-sm text-slate-400 mr-2">Clasificación:</span>
        <HechoBadge count={countByEstado.prescrito} estado="prescrito" />
        <HechoBadge count={countByEstado.compensable} estado="compensable" />
        <HechoBadge count={countByEstado.disputa} estado="disputa" />
      </div>

      {/* NUEVO COMPONENTE: ReclamacionesTiles */}
      {/* Pasamos ID 1 asumiendo que es el procedimiento principal cargado en el seed */}
      <ReclamacionesTiles procedimientoId={1} />

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <button
          type="button"
          onClick={() => navigate('/analytics/prescripcion')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-emerald-500/30 transition-all"
        >
          <Clock className="w-6 h-6 text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Prescripción</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/analytics/audiencia')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-amber-500/30 transition-all"
        >
          <Scale className="w-6 h-6 text-amber-400" />
          <span className="text-xs font-medium text-slate-300">Audiencia</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/partidas')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-cyan-500/30 transition-all"
        >
          <FileText className="w-6 h-6 text-cyan-400" />
          <span className="text-xs font-medium text-slate-300">Partidas</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/warroom')}
          className="flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-rose-500/30 transition-all"
        >
          <AlertTriangle className="w-6 h-6 text-rose-400" />
          <span className="text-xs font-medium text-slate-300">War Room</span>
        </button>
      </div>
    </AnalyticsLayout>
  );
}
