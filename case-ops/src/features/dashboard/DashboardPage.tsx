// ============================================
// CASE OPS - Dashboard "MAPA DE FRENTES JUDICIALES"
// Plan Maestro Fase 2 - Centro de Comando Legal
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import { casesRepo, eventsRepo } from '../../db/repositories';
import Card from '../../ui/components/Card';
import { formatCurrency } from '../../utils/validators';
import { AlertasPanel } from '../../components/AlertasPanel';
import { getResumenContador, calcularTotales } from '../../data/hechosReclamados';
import { resumenAudiencia } from '../../data/audienciaPrevia';
import type { Case, Event } from '../../types';
import {
  RefreshCw, Scale, FileText, Gavel, AlertTriangle, Clock,
  TrendingDown, Calendar, ChevronRight, Building2, MapPin
} from 'lucide-react';

// Datos de frentes judiciales (hardcoded para fallback)
const FRENTES_DEFAULT = [
  {
    id: 'picassent',
    titulo: 'P.O. 715/2024 Picassent',
    juzgado: 'Juzgado 1ª Instancia nº4 Picassent',
    tipo: 'División Cosa Común',
    cuantia: 212677,
    fase: 'Audiencia Previa',
    proximoHito: resumenAudiencia.fecha,
    proximoHitoNombre: 'Audiencia Previa',
    urgencia: 'urgente',
    rol: 'Demandado',
  },
  {
    id: 'mislata',
    titulo: 'P.O. 1185/2023 Mislata',
    juzgado: 'Juzgado 1ª Instancia nº7 Mislata',
    tipo: 'Reclamación de Cantidad',
    cuantia: 45000,
    fase: 'Vista Oral',
    proximoHito: '2026-02-15',
    proximoHitoNombre: 'Vista Oral',
    urgencia: 'activo',
    rol: 'Demandante',
  },
  {
    id: 'quart',
    titulo: 'Ejecución 1428/2024 Quart',
    juzgado: 'Juzgado 1ª Instancia nº2 Quart',
    tipo: 'Ejecución Hipotecaria',
    cuantia: 28500,
    fase: 'Oposición',
    proximoHito: '2026-03-01',
    proximoHitoNombre: 'Resolución Oposición',
    urgencia: 'riesgo',
    rol: 'Ejecutado',
  },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<Case[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Cargar datos reales
  useEffect(() => {
    casesRepo.getAll().then(setCases).catch(console.error);
    eventsRepo.getAll().then(setEvents).catch(console.error);
  }, []);

  const urgentTasks = useLiveQuery(() =>
    db.tasks
      .where('status').equals('pendiente')
      .limit(5)
      .toArray()
  , []);

  const totales = calcularTotales();
  const resumen = getResumenContador();

  const safeNumber = (n: number) => (isNaN(n) || n < 0) ? 0 : n;

  const getCaseLabel = (frente: { id: string; titulo: string; juzgado: string }) => {
    const combined = `${frente.id} ${frente.titulo} ${frente.juzgado}`.toLowerCase();
    if (combined.includes('picassent')) return 'PICASSENT';
    if (combined.includes('mislata')) return 'MISLATA';
    if (combined.includes('quart')) return 'QUART';
    return 'CASO';
  };

  const handleClearCache = () => {
    if ('caches' in window) {
      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
    }
    window.location.reload();
  };

  // Calcular días hasta próximo hito
  const getDiasHasta = (fecha: string) => {
    const hoy = new Date();
    const target = new Date(fecha);
    const diff = Math.ceil((target.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Próximos eventos globales
  const proximosEventos = events
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  // Combinar casos reales con frentes default
  const frentes = cases.length > 0
    ? cases.filter(c => !c.parentCaseId).map(c => {
        const titulo = c.title?.toLowerCase() || '';
        const urgencia = titulo.includes('picassent') ? 'urgente'
          : titulo.includes('mislata') ? 'activo'
          : 'riesgo';
        return {
          id: c.id,
          titulo: c.title,
          juzgado: c.court,
          tipo: c.type,
          cuantia: 0, // TODO: calcular desde partidas
          fase: c.status,
          proximoHito: '',
          proximoHitoNombre: 'Sin fecha',
          urgencia,
          rol: c.clientRole || 'Parte',
        };
      })
    : FRENTES_DEFAULT;

  return (
    <div className="space-y-6 pb-20">
      {/* ===== HEADER: MAPA DE FRENTES ===== */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-500 mb-1 flex items-center gap-2">
            <Building2 size={12} />
            Centro de Comando Legal
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Mapa de Frentes Judiciales
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {frentes.length} procedimientos activos · Cuantía total: {formatCurrency(frentes.reduce((sum, f) => sum + (f.cuantia || 0), 0) * 100)}
          </p>
        </div>
        <button
          onClick={handleClearCache}
          title="Limpiar caché"
          className="p-2 rounded-lg border border-slate-600 text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {/* ===== TARJETAS DE FRENTES JUDICIALES ===== */}
      <section className="grid gap-4 lg:grid-cols-3">
        {frentes.map((frente, idx) => {
          const dias = frente.proximoHito ? getDiasHasta(frente.proximoHito) : null;
          const isUrgente = frente.urgencia === 'urgente';
          const isRiesgo = frente.urgencia === 'riesgo';
          const caseLabel = getCaseLabel(frente);

          return (
            <button
              key={frente.id}
              onClick={() => navigate(`/cases/${frente.id}`)}
              className={`case-card text-left group relative ${
                isUrgente ? 'urgente' : isRiesgo ? 'en-riesgo' : ''
              }`}
              style={{
                background: isUrgente
                  ? 'linear-gradient(135deg, rgba(249,202,36,0.1) 0%, rgba(45,55,72,1) 100%)'
                  : isRiesgo
                  ? 'linear-gradient(135deg, rgba(229,62,62,0.1) 0%, rgba(45,55,72,1) 100%)'
                  : 'linear-gradient(135deg, rgba(56,161,105,0.1) 0%, rgba(45,55,72,1) 100%)',
              }}
            >
              {/* Badge Urgente */}
              {isUrgente && (
                <div className="absolute top-3 right-3">
                  <span className="badge-estado urgente flex items-center gap-1">
                    <AlertTriangle size={10} /> URGENTE
                  </span>
                </div>
              )}
              {isRiesgo && (
                <div className="absolute top-3 right-3">
                  <span className="badge-estado riesgo flex items-center gap-1">
                    <AlertTriangle size={10} /> RIESGO
                  </span>
                </div>
              )}

              {/* Icono y Título */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isUrgente ? 'bg-amber-500/20 text-amber-400' :
                  isRiesgo ? 'bg-rose-500/20 text-rose-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <Scale size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{frente.titulo}</h3>
                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-100">
                      {caseLabel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{frente.juzgado}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[9px] uppercase text-slate-500 tracking-wider">Tipo</div>
                  <div className="text-xs text-slate-300 font-medium">{frente.tipo}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-slate-500 tracking-wider">Rol</div>
                  <div className={`text-xs font-medium ${
                    frente.rol === 'Demandado' || frente.rol === 'Ejecutado' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>{frente.rol}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-slate-500 tracking-wider">Fase</div>
                  <div className="text-xs text-slate-300 font-medium">{frente.fase}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase text-slate-500 tracking-wider">Cuantía</div>
                  <div className="text-xs font-bold text-white">{formatCurrency(frente.cuantia * 100)}</div>
                </div>
              </div>

              {/* Próximo Hito */}
              {frente.proximoHito && (
                <div className={`rounded-lg p-2 ${
                  isUrgente ? 'bg-amber-500/10' : isRiesgo ? 'bg-rose-500/10' : 'bg-slate-700/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className={
                        isUrgente ? 'text-amber-400' : isRiesgo ? 'text-rose-400' : 'text-slate-400'
                      } />
                      <span className="text-[10px] text-slate-400">{frente.proximoHitoNombre}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-300">
                        {new Date(frente.proximoHito).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                      </span>
                      {dias !== null && dias <= 30 && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          dias <= 7 ? 'bg-rose-500/30 text-rose-300' :
                          dias <= 14 ? 'bg-amber-500/30 text-amber-300' :
                          'bg-slate-600/50 text-slate-300'
                        }`}>
                          {dias}d
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-end mt-3 text-xs text-slate-500 group-hover:text-amber-400 transition-colors">
                Ver expediente <ChevronRight size={14} className="ml-1" />
              </div>
            </button>
          );
        })}
      </section>

      {/* ===== KPIs GLOBALES (Picassent como referencia) ===== */}
      <section className="rounded-xl border border-slate-700/50 p-4" style={{ background: '#2d3748' }}>
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-amber-400" />
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Resumen Económico · Picassent (Caso Principal)</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="kpi-card">
            <div className="label">Reclamado</div>
            <div className="value danger">{safeNumber(resumen.totalReclamado).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€</div>
          </div>
          <div className="kpi-card">
            <div className="label">Prescrito</div>
            <div className="value success">{safeNumber(resumen.prescrito).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€</div>
          </div>
          <div className="kpi-card">
            <div className="label">Deuda Real</div>
            <div className="value gold">{safeNumber(resumen.cifraRiesgoReal).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€</div>
          </div>
          <div className="kpi-card">
            <div className="label">Reducción</div>
            <div className="value info">{safeNumber(resumen.reduccionObjetivo)}%</div>
          </div>
        </div>
      </section>

      {/* ===== PRÓXIMOS HITOS GLOBALES ===== */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-amber-400" />
            <h2 className="text-sm font-bold text-white">Próximos Hitos</h2>
          </div>
          <Link to="/events" className="text-xs text-amber-400 hover:underline">Ver agenda</Link>
        </div>

        <div className="space-y-2">
          {/* Audiencia Previa Picassent (hardcoded como urgente) */}
          <div className="flex items-center gap-4 p-3 rounded-lg border border-amber-500/30 bg-amber-500/5">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-amber-400">
                {getDiasHasta(resumenAudiencia.fecha)}
              </span>
              <span className="text-[8px] text-amber-500 uppercase">días</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Audiencia Previa</div>
              <div className="text-xs text-slate-400">Picassent · {new Date(resumenAudiencia.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <span className="badge-estado urgente">URGENTE</span>
          </div>

          {/* Otros eventos */}
          {proximosEventos.slice(0, 2).map(evento => (
            <div key={evento.id} className="flex items-center gap-4 p-3 rounded-lg border border-slate-700/50 bg-slate-800/30">
              <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-300">
                  {new Date(evento.date).getDate()}
                </span>
                <span className="text-[8px] text-slate-500 uppercase">
                  {new Date(evento.date).toLocaleDateString('es-ES', { month: 'short' })}
                </span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">{evento.title}</div>
                <div className="text-xs text-slate-500">{evento.type === 'procesal' ? 'Procesal' : 'Fáctico'}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ACCESOS RÁPIDOS ===== */}
      <section className="grid grid-cols-4 gap-2">
        <button
          onClick={() => navigate('/analytics/hechos')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
        >
          <Scale size={22} className="text-emerald-400" />
          <span className="text-[10px] text-slate-300">Hechos</span>
        </button>
        <button
          onClick={() => navigate('/analytics/audiencia')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
        >
          <Gavel size={22} className="text-amber-400" />
          <span className="text-[10px] text-slate-300">Audiencia</span>
        </button>
        <button
          onClick={() => navigate('/documents')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
        >
          <FileText size={22} className="text-blue-400" />
          <span className="text-[10px] text-slate-300">Documentos</span>
        </button>
        <button
          onClick={() => navigate('/warroom')}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
        >
          <AlertTriangle size={22} className="text-rose-400" />
          <span className="text-[10px] text-slate-300">War Room</span>
        </button>
      </section>

      {/* ===== ALERTAS ===== */}
      <AlertasPanel />

      {/* ===== FUNDAMENTOS JURÍDICOS ===== */}
      <section className="rounded-xl border border-slate-700/50 p-4" style={{ background: '#2d3748' }}>
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Gavel size={14} className="text-amber-400" />
          Fundamentos Jurídicos Clave
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex gap-2 items-start">
            <span className="text-emerald-400 font-bold shrink-0">Art. 1964.2 CC:</span>
            <span className="text-slate-400">Prescripción 5 años</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-amber-400 font-bold shrink-0">Art. 1196 CC:</span>
            <span className="text-slate-400">Compensación créditos</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-blue-400 font-bold shrink-0">Art. 1145 CC:</span>
            <span className="text-slate-400">Solidaridad préstamo</span>
          </div>
          <div className="flex gap-2 items-start">
            <span className="text-rose-400 font-bold shrink-0">Art. 400 CC:</span>
            <span className="text-slate-400">División cosa común</span>
          </div>
        </div>
      </section>
    </div>
  );
}
