import { useState } from 'react';
import {
  Scale,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Link2,
  ClipboardList,
  Target,
  Shield,
  Gavel
} from 'lucide-react';
import {
  hechosReclamados,
  resumenContador,
  calcularTotales,
  type HechoReclamado
} from '../data/hechosReclamados';

type EstadoFiltro = 'todos' | 'prescrito' | 'compensable' | 'disputa';

const estadoConfig = {
  prescrito: {
    label: 'Prescrito',
    color: 'emerald',
    icon: CheckCircle2,
    bgClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    badgeClass: 'bg-emerald-500/20 text-emerald-400',
  },
  compensable: {
    label: 'Compensable',
    color: 'amber',
    icon: Scale,
    bgClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    badgeClass: 'bg-amber-500/20 text-amber-400',
  },
  disputa: {
    label: 'En Disputa',
    color: 'red',
    icon: AlertTriangle,
    bgClass: 'bg-red-500/10 border-red-500/30 text-red-400',
    badgeClass: 'bg-red-500/20 text-red-400',
  },
};

export function DesgloseHechos() {
  const [filtro, setFiltro] = useState<EstadoFiltro>('todos');
  const [expandido, setExpandido] = useState<number | null>(null);
  const totales = calcularTotales();

  const hechosFiltrados = filtro === 'todos'
    ? hechosReclamados
    : hechosReclamados.filter(h => h.estado === filtro);

  const totalFiltrado = hechosFiltrados.reduce((sum, h) => sum + h.cuantia, 0);

  return (
    <div className="space-y-6">
      {/* Panel de Control - Contador de la Verdad */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
            <Gavel className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Contador de la Verdad</h2>
            <p className="text-sm text-slate-400">Panel de Control Estratégico</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Reclamado */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Total Reclamado</span>
            </div>
            <p className="text-3xl font-bold text-red-400">
              {resumenContador.totalReclamado.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>

          {/* Cifra en Riesgo Real */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">Riesgo Real (Post-Prescripción)</span>
            </div>
            <p className="text-3xl font-bold text-amber-400">
              ~{resumenContador.cifraRiesgoReal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>

          {/* Objetivo Estratégico */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Objetivo Estratégico</span>
            </div>
            <p className="text-3xl font-bold text-emerald-400">
              -{resumenContador.reduccionObjetivo}%
            </p>
            <p className="text-xs text-slate-500 mt-1">{resumenContador.fundamentoLegal}</p>
          </div>
        </div>

        {/* Barra de progreso visual */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Desglose por estado</span>
            <span className="text-slate-500">{hechosReclamados.length} partidas</span>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 transition-all duration-500"
              style={{ width: `${(totales.prescrito / resumenContador.totalReclamado) * 100}%` }}
              title={`Prescrito: ${totales.prescrito.toLocaleString('es-ES')}€`}
            />
            <div
              className="bg-amber-500 transition-all duration-500"
              style={{ width: `${(totales.compensable / resumenContador.totalReclamado) * 100}%` }}
              title={`Compensable: ${totales.compensable.toLocaleString('es-ES')}€`}
            />
            <div
              className="bg-red-500 transition-all duration-500"
              style={{ width: `${(totales.disputa / resumenContador.totalReclamado) * 100}%` }}
              title={`En disputa: ${totales.disputa.toLocaleString('es-ES')}€`}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-emerald-400">
              Prescrito: {totales.prescrito.toLocaleString('es-ES')}€
            </span>
            <span className="text-amber-400">
              Compensable: {totales.compensable.toLocaleString('es-ES')}€
            </span>
            <span className="text-red-400">
              Disputa: {totales.disputa.toLocaleString('es-ES')}€
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltro('todos')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            filtro === 'todos'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Todos ({hechosReclamados.length})
        </button>
        {Object.entries(estadoConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = hechosReclamados.filter(h => h.estado === key).length;
          return (
            <button
              key={key}
              onClick={() => setFiltro(key as EstadoFiltro)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filtro === key
                  ? `${config.badgeClass} border border-current`
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Resumen del filtro */}
      {filtro !== 'todos' && (
        <div className={`p-4 rounded-xl border ${estadoConfig[filtro].bgClass}`}>
          <p className="text-sm">
            Mostrando <strong>{hechosFiltrados.length}</strong> partidas con estado{' '}
            <strong>{estadoConfig[filtro].label}</strong> por un total de{' '}
            <strong>{totalFiltrado.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</strong>
          </p>
        </div>
      )}

      {/* Lista de Hechos */}
      <div className="space-y-4">
        {hechosFiltrados.map((hecho) => (
          <HechoCard
            key={hecho.id}
            hecho={hecho}
            expandido={expandido === hecho.id}
            onToggle={() => setExpandido(expandido === hecho.id ? null : hecho.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface HechoCardProps {
  hecho: HechoReclamado;
  expandido: boolean;
  onToggle: () => void;
}

function HechoCard({ hecho, expandido, onToggle }: HechoCardProps) {
  const config = estadoConfig[hecho.estado];
  const Icon = config.icon;
  const vinculado = hecho.vinculadoA
    ? hechosReclamados.find(h => h.id === hecho.vinculadoA)
    : null;

  return (
    <div className={`border rounded-2xl overflow-hidden transition-all ${
      expandido ? 'border-blue-500/50 bg-slate-800/50' : 'border-slate-700 bg-slate-800/30'
    }`}>
      {/* Header - siempre visible */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-600">#{hecho.id}</span>
            <div className={`p-2 rounded-xl ${config.badgeClass}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold truncate">{hecho.titulo}</h3>
              <span className="text-xs text-slate-500">({hecho.año})</span>
              {vinculado && (
                <span className="flex items-center gap-1 text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                  <Link2 className="w-3 h-3" />
                  Vinculado a #{hecho.vinculadoA}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 truncate">{hecho.hechoActora}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 ml-4">
          <div className="text-right">
            <p className="text-lg font-bold text-slate-200">
              {hecho.cuantia.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full ${config.badgeClass}`}>
              {config.label}
            </span>
          </div>
          {expandido ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* Contenido expandido */}
      {expandido && (
        <div className="px-4 pb-4 space-y-4 border-t border-slate-700 pt-4 animate-fadeIn">
          {/* Grid de información */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Lo que dice la actora */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-400" />
                <h4 className="font-semibold text-red-400 text-sm">Hecho de la Demanda (Vicenta)</h4>
              </div>
              <p className="text-sm text-slate-300">{hecho.hechoActora}</p>
            </div>

            {/* Realidad de los hechos */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="font-semibold text-emerald-400 text-sm">Realidad de los Hechos (Juan)</h4>
              </div>
              <p className="text-sm text-slate-300">{hecho.realidadHechos}</p>
            </div>
          </div>

          {/* Oposición */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-blue-400 text-sm">Argumentos de Oposición</h4>
            </div>
            <ul className="space-y-2">
              {hecho.oposicion.map((arg, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-blue-400 mt-1">•</span>
                  {arg}
                </li>
              ))}
            </ul>
          </div>

          {/* Estrategia */}
          <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <h4 className="font-semibold text-purple-400 text-sm">Estrategia</h4>
            </div>
            <p className="text-sm text-slate-300">{hecho.estrategia}</p>
          </div>

          {/* Footer con documentos y tareas */}
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Documentos de referencia */}
            {hecho.documentosRef.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs text-slate-500">Docs:</span>
                {hecho.documentosRef.map((doc, idx) => (
                  <span key={idx} className="text-xs bg-slate-700 px-2 py-1 rounded-lg text-slate-300">
                    {doc}
                  </span>
                ))}
              </div>
            )}

            {/* Tareas pendientes */}
            {hecho.tareas.length > 0 && (
              <div className="flex items-start gap-2 flex-1">
                <ClipboardList className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-400">
                  <span className="font-medium">To-Do:</span>
                  {hecho.tareas.map((tarea, idx) => (
                    <p key={idx} className="text-slate-400 mt-1">• {tarea}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Vinculación */}
          {vinculado && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 flex items-center gap-3">
              <Link2 className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-purple-400 font-medium">
                  Vinculado con: #{vinculado.id} - {vinculado.titulo}
                </p>
                <p className="text-xs text-slate-400">
                  Ambas partidas están relacionadas con el mismo préstamo de 310.000€
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
