// ============================================
// ANÁLISIS FINANCIERO CASO QUART - ETJ 1428/2025
// Visualización de cifras reales vs reclamadas
// ============================================

import {
  desgloseCifrasQuart,
  desgloseUsoIndebido,
  pagosDirectosJuan,
  argumentosOposicion,
  puntosDebiles,
  procedimientoQuart
} from '../../data/quart';
import { AlertTriangle, CheckCircle, TrendingDown, Scale, Shield, Sword } from 'lucide-react';

// Función para formatear céntimos a euros
const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

export function QuartFinancialAnalysis() {
  const cifras = desgloseCifrasQuart;

  // Cálculos principales
  const reclamado = cifras.reclamadoPorEjecutante;
  const deficitReal = cifras.deficitAlegadoCents;
  const usoIndebido = cifras.usoIndebidoAlegadoCents;
  const saldoFavorJuan = cifras.saldoNetoAFavorJuanCents;
  const pagosDirectos = cifras.pagosDirectosAlegadosCents;

  // Diferencia entre lo reclamado y el déficit real
  const diferencia = reclamado - deficitReal;
  const porcentajeReduccion = Math.round((diferencia / reclamado) * 100);

  // Contar argumentos por riesgo
  const argsBajoRiesgo = argumentosOposicion.filter(a => a.riesgo === 'bajo').length;
  const argsMedioRiesgo = argumentosOposicion.filter(a => a.riesgo === 'medio').length;
  const argsAltoRiesgo = argumentosOposicion.filter(a => a.riesgo === 'alto').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="text-amber-400" size={24} />
            Análisis Financiero - Quart
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {procedimientoQuart.titulo} · Vista: {procedimientoQuart.piezaOposicion.fechaVista}
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Estado</div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-sm font-bold rounded-full border border-amber-500/30">
            {procedimientoQuart.estado}
          </span>
        </div>
      </div>

      {/* KPIs PRINCIPALES */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reclamado */}
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-rose-400 mb-1">Reclamado por Vicenta</div>
          <div className="text-2xl font-bold text-rose-300">{formatCents(reclamado)}</div>
          <div className="text-xs text-rose-400/70 mt-1">12 mensualidades × 200€</div>
        </div>

        {/* Déficit Real */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Déficit Real Calculado</div>
          <div className="text-2xl font-bold text-amber-300">{formatCents(deficitReal)}</div>
          <div className="text-xs text-amber-400/70 mt-1">Tras pagos acreditados</div>
        </div>

        {/* Reducción */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
            <TrendingDown size={12} /> Reducción Objetivo
          </div>
          <div className="text-2xl font-bold text-emerald-300">-{porcentajeReduccion}%</div>
          <div className="text-xs text-emerald-400/70 mt-1">{formatCents(diferencia)} menos</div>
        </div>

        {/* Saldo a Favor */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4">
          <div className="text-[10px] uppercase tracking-wider text-blue-400 mb-1">Saldo a Favor Juan</div>
          <div className="text-2xl font-bold text-blue-300">{formatCents(saldoFavorJuan)}</div>
          <div className="text-xs text-blue-400/70 mt-1">Por compensación</div>
        </div>
      </div>

      {/* BALANCE VISUAL */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Scale size={16} className="text-amber-400" />
          Balance de Posiciones
        </h3>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Columna Vicenta (Ejecutante) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <Sword size={16} />
              Posición Ejecutante (Vicenta)
            </div>
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Reclamación total</span>
                <span className="font-bold text-rose-300">{formatCents(reclamado)}</span>
              </div>
              <div className="text-xs text-rose-400/70">
                "12 meses impagados de 200€/mes"
              </div>
            </div>
          </div>

          {/* Columna Juan (Ejecutado) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <Shield size={16} />
              Posición Ejecutado (Juan)
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Déficit real</span>
                <span className="font-bold text-amber-300">{formatCents(deficitReal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Uso indebido Vicenta</span>
                <span className="font-bold text-rose-300">-{formatCents(usoIndebido)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-700 pt-2">
                <span className="text-slate-300 font-medium">Saldo neto</span>
                <span className="font-bold text-emerald-300">+{formatCents(saldoFavorJuan)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESGLOSE USO INDEBIDO */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle size={16} />
          Uso Indebido Alegado por Juan
        </h3>
        <div className="text-2xl font-bold text-rose-300 mb-4">{formatCents(desgloseUsoIndebido.totalCents)}</div>

        <div className="grid gap-2">
          {desgloseUsoIndebido.categorias.map((cat, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-900/50 rounded-lg px-4 py-2">
              <span className="text-slate-300 text-sm">{cat.concepto}</span>
              <span className="font-mono text-rose-300">{formatCents(cat.importeCents)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PAGOS DIRECTOS JUAN */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <CheckCircle size={16} />
          Pagos Directos Realizados por Juan
        </h3>
        <div className="text-2xl font-bold text-emerald-300 mb-4">{formatCents(pagosDirectosJuan.totalCents)}</div>

        <div className="grid sm:grid-cols-2 gap-2">
          {pagosDirectosJuan.items.slice(0, 8).map((item, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-900/50 rounded-lg px-3 py-2">
              <span className="text-slate-300 text-xs truncate">{item.concepto}</span>
              <span className="font-mono text-emerald-300 text-sm ml-2">{formatCents(item.importeCents)}</span>
            </div>
          ))}
        </div>
        {pagosDirectosJuan.items.length > 8 && (
          <div className="text-center mt-3 text-xs text-slate-500">
            + {pagosDirectosJuan.items.length - 8} items más
          </div>
        )}
      </div>

      {/* ARGUMENTOS DE OPOSICIÓN */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Argumentos de Oposición ({argumentosOposicion.length})
        </h3>

        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {argsBajoRiesgo} Bajo Riesgo
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {argsMedioRiesgo} Medio Riesgo
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {argsAltoRiesgo} Alto Riesgo
          </span>
        </div>

        <div className="space-y-3">
          {argumentosOposicion.map((arg) => (
            <div
              key={arg.id}
              className={`p-4 rounded-xl border ${
                arg.riesgo === 'alto' ? 'bg-rose-500/10 border-rose-500/30' :
                arg.riesgo === 'medio' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-bold text-white text-sm">{arg.titulo}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  arg.riesgo === 'alto' ? 'bg-rose-500/30 text-rose-300' :
                  arg.riesgo === 'medio' ? 'bg-amber-500/30 text-amber-300' :
                  'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {arg.riesgo}
                </span>
              </div>
              <p className="text-sm text-slate-300 mb-2">{arg.descripcion}</p>
              <div className="flex flex-wrap gap-2">
                {arg.fundamentoLegal.map((f, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-700/50 text-slate-400 rounded">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PUNTOS DÉBILES / RIESGOS */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-5">
        <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle size={16} />
          Puntos Débiles y Riesgos
        </h3>

        <div className="space-y-3">
          {puntosDebiles.map((punto) => (
            <div key={punto.id} className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-bold text-rose-300 text-sm">{punto.titulo}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                  punto.riesgo === 'alto' ? 'bg-rose-500/30 text-rose-300' :
                  punto.riesgo === 'medio' ? 'bg-amber-500/30 text-amber-300' :
                  'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {punto.riesgo}
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-3">{punto.descripcion}</p>
              <div className="flex items-start gap-2 bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/20">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-300">{punto.pruebaMitigadora}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESUMEN FINAL */}
      <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-slate-900/60 p-6">
        <h3 className="text-lg font-bold text-amber-300 uppercase tracking-wider mb-4 text-center">
          Resumen Ejecutivo
        </h3>

        <div className="grid sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-rose-400">{formatCents(reclamado)}</div>
            <div className="text-xs text-slate-400 mt-1">Reclamado</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-300">{formatCents(deficitReal)}</div>
            <div className="text-xs text-slate-400 mt-1">Déficit Real</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">+{formatCents(saldoFavorJuan)}</div>
            <div className="text-xs text-slate-400 mt-1">A Favor Juan</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-300">
            <strong className="text-white">Conclusión:</strong> Con la compensación de créditos,
            Juan no solo no debe {formatCents(reclamado)}, sino que Vicenta le debe {formatCents(saldoFavorJuan)}.
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuartFinancialAnalysis;
