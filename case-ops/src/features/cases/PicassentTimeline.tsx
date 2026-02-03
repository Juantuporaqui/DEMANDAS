// ============================================
// TIMELINE CASO PICASSENT - P.O. 715/2024
// Visualización cronológica de hipoteca y pagos
// ============================================

import {
  timelinePicassent,
  procedimientoPicassent,
  resumenHipoteca,
  type EventoPicassent
} from '../../data/picassent/timeline';
import { hechosReclamados, getResumenContador } from '../../data/hechosReclamados';
import { Link } from 'react-router-dom';
import {
  Calendar, Home, CreditCard, Scale, AlertTriangle, CheckCircle,
  TrendingDown, FileText, Clock, ChevronRight
} from 'lucide-react';

// Función para formatear céntimos a euros
const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

// Colores por tipo de evento
const getEventColor = (tipo: EventoPicassent['tipo']) => {
  switch (tipo) {
    case 'hipoteca': return { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', icon: CreditCard };
    case 'pago': return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CheckCircle };
    case 'adquisicion': return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Home };
    case 'judicial': return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: Scale };
    case 'personal': return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', icon: Calendar };
    case 'impago': return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: AlertTriangle };
    default: return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', icon: Calendar };
  }
};

export function PicassentHipotecaResumen() {
  return (
    <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-slate-900/60 p-5">
      <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <CreditCard size={16} />
        Hipoteca Solidaria - El Centro del Conflicto
      </h3>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        {/* Préstamo Original */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Préstamo Original (2006)</div>
          <div className="text-2xl font-bold text-violet-300">{formatCents(resumenHipoteca.importeOriginal)}</div>
          <div className="text-xs text-slate-500 mt-1">Kutxa → Barclays → Caixabank</div>
        </div>

        {/* Saldo Actual */}
        <div className="bg-slate-900/50 rounded-lg p-4 border border-rose-500/30">
          <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-1">Saldo Pendiente Actual</div>
          <div className="text-2xl font-bold text-rose-300">{formatCents(resumenHipoteca.saldoActual)}</div>
          <div className="text-xs text-rose-400/70 mt-1">Grava solo vivienda de Juan</div>
        </div>

        {/* Impago Vicenta */}
        <div className="bg-rose-500/10 rounded-lg p-4 border border-rose-500/30">
          <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1">
            <AlertTriangle size={12} /> Impagado por Vicenta
          </div>
          <div className="text-2xl font-bold text-rose-300">{formatCents(resumenHipoteca.totalImpagadoVicenta)}</div>
          <div className="text-xs text-rose-400/70 mt-1">{resumenHipoteca.mesesImpagadosVicenta} meses desde Oct 2023</div>
        </div>
      </div>

      {/* Garantía y bienes */}
      <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="text-amber-400" size={16} />
          <span className="text-sm font-bold text-amber-300">Punto Clave: Garantía vs. Bienes Adquiridos</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400 mb-2">Garantía Hipotecaria (de Juan):</div>
            <div className="text-sm text-white font-medium">
              Vivienda privativa C/ Lope de Vega 7
            </div>
            <div className="text-xs text-rose-400 mt-1">
              ⚠️ Carga actual: {formatCents(resumenHipoteca.saldoActual)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-2">Bienes Adquiridos (comunes, LIBRES de cargas):</div>
            {resumenHipoteca.inmuebles.map((inm, i) => (
              <div key={i} className="flex justify-between items-center text-sm mb-1">
                <span className="text-emerald-300">{inm.nombre}</span>
                <span className="text-emerald-400 font-mono">{formatCents(inm.valor)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3 p-2 bg-amber-500/10 rounded text-xs text-amber-300 border border-amber-500/20">
          <strong>Estrategia:</strong> Vicenta quiere el 50% de los inmuebles pero pretende que Juan pague solo la hipoteca que los financió.
        </div>
      </div>
    </div>
  );
}

export function PicassentHechosReclamados() {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <FileText size={16} className="text-amber-400" />
        10 Hechos Reclamados por Vicenta
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {hechosReclamados.map((hecho) => (
          <Link
            key={hecho.id}
            to={`/facts/${hecho.id}`}
            target="_blank"
            rel="noreferrer"
            className={`group relative flex flex-col justify-between gap-4 p-4 rounded-2xl border transition-all hover:-translate-y-0.5 hover:shadow-xl overflow-hidden ${
              hecho.estado === 'prescrito' ? 'bg-gradient-to-br from-slate-500/15 via-slate-900/40 to-slate-900/70 border-slate-500/30 hover:border-slate-400/60 hover:shadow-slate-500/10' :
              hecho.estado === 'compensable' ? 'bg-gradient-to-br from-emerald-500/15 via-slate-900/40 to-slate-900/70 border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-emerald-500/10' :
              'bg-gradient-to-br from-rose-500/15 via-slate-900/40 to-slate-900/70 border-rose-500/30 hover:border-rose-400/60 hover:shadow-rose-500/10'
            }`}
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex justify-between items-start gap-2">
              <span className="text-xs font-bold text-slate-400">#{hecho.id}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${
                hecho.estado === 'prescrito' ? 'bg-slate-500/30 text-slate-300' :
                hecho.estado === 'compensable' ? 'bg-emerald-500/30 text-emerald-300' :
                'bg-rose-500/30 text-rose-300'
              }`}>
                {hecho.estado}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2">{hecho.titulo}</h4>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{hecho.año}</span>
                <span className="font-mono text-sm text-slate-200">{formatCents(hecho.cuantia * 100)}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="text-[10px] uppercase tracking-wider">Ver resumen</span>
              <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PicassentTimeline() {
  const resumenFinanciero = getResumenContador();

  // Agrupar eventos por año
  const eventosPorAño = timelinePicassent.reduce((acc, evt) => {
    const año = evt.fecha.split('-')[0];
    if (!acc[año]) acc[año] = [];
    acc[año].push(evt);
    return acc;
  }, {} as Record<string, EventoPicassent[]>);

  const años = Object.keys(eventosPorAño).sort();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="text-amber-400" size={24} />
            Línea Temporal - Picassent
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {procedimientoPicassent.titulo} · {procedimientoPicassent.estado}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Cuantía Demanda</div>
          <span className="text-xl font-bold text-rose-400">
            {formatCents(procedimientoPicassent.cuantiaDemanda)}
          </span>
        </div>
      </div>

      {/* KPIs PRINCIPALES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reclamado */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-1">Total Reclamado</div>
          <div className="text-2xl font-bold text-rose-300">{formatCents(resumenFinanciero.totalReclamado * 100)}</div>
          <div className="text-xs text-rose-400/70 mt-1">10 hechos en demanda</div>
        </div>

        {/* Prescrito */}
        <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
            <TrendingDown size={12} /> Prescrito
          </div>
          <div className="text-2xl font-bold text-slate-300">{formatCents(resumenFinanciero.prescrito * 100)}</div>
          <div className="text-xs text-slate-400/70 mt-1">Art. 1964.2 CC</div>
        </div>

        {/* Riesgo Real */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Riesgo Real</div>
          <div className="text-2xl font-bold text-amber-300">{formatCents(resumenFinanciero.cifraRiesgoReal * 100)}</div>
          <div className="text-xs text-amber-400/70 mt-1">En disputa activa</div>
        </div>

        {/* Reducción */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">Reducción Objetivo</div>
          <div className="text-2xl font-bold text-emerald-300">-{resumenFinanciero.reduccionObjetivo}%</div>
          <div className="text-xs text-emerald-400/70 mt-1">Por prescripción</div>
        </div>
      </div>

      {/* TIMELINE CRONOLÓGICO */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Clock size={16} className="text-amber-400" />
          Cronología Completa ({timelinePicassent.length} eventos)
        </h3>

        <div className="space-y-6">
          {años.map(año => (
            <div key={año}>
              {/* Año header */}
              <div className="flex items-center gap-3 mb-3">
                <div className="text-lg font-bold text-amber-400">{año}</div>
                <div className="flex-1 h-px bg-slate-700/50" />
                <div className="text-xs text-slate-500">{eventosPorAño[año].length} eventos</div>
              </div>

              {/* Eventos del año */}
              <div className="space-y-2 ml-4 border-l-2 border-slate-700/50 pl-4">
                {eventosPorAño[año].map(evento => {
                  const colorInfo = getEventColor(evento.tipo);
                  const IconComponent = colorInfo.icon;

                  return (
                    <div
                      key={evento.id}
                      className={`p-3 rounded-lg border ${colorInfo.bg} ${colorInfo.border} relative`}
                    >
                      {/* Dot en el timeline */}
                      <div className={`absolute -left-[22px] top-4 w-3 h-3 rounded-full ${colorInfo.text.replace('text-', 'bg-')} border-2 border-slate-900`} />

                      <div className="flex items-start gap-3">
                        <IconComponent className={`${colorInfo.text} shrink-0 mt-0.5`} size={16} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500 font-mono">
                              {new Date(evento.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                            </span>
                            {evento.relevancia === 'critica' && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 font-bold uppercase">
                                Crítico
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-white mt-1">{evento.titulo}</h4>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{evento.descripcion}</p>
                          {evento.importeCents && (
                            <div className="mt-2 text-sm font-bold text-white">
                              {formatCents(evento.importeCents)}
                            </div>
                          )}
                          {evento.documentoRef && (
                            <div className="mt-1 text-[10px] text-blue-400">
                              📎 {evento.documentoRef}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PRÓXIMOS PASOS */}
      <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-slate-900/60 p-6">
        <h3 className="text-lg font-bold text-amber-300 uppercase tracking-wider mb-4 text-center">
          Próximos Pasos Críticos
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="text-amber-400" size={18} />
              <span className="font-bold text-white">Audiencia Previa</span>
            </div>
            <p className="text-sm text-slate-400">
              Preparar alegaciones sobre hechos controvertidos y prescripción.
            </p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-emerald-400" size={18} />
              <span className="font-bold text-white">Documental Clave</span>
            </div>
            <p className="text-sm text-slate-400">
              Doc. 4 (AEAT), Doc. 2 (ingresos cuenta), Doc. 3 (reparto ahorros).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PicassentTimeline;
