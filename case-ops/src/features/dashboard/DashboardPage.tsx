// ============================================
// CASE OPS - Dashboard "MAPA DE FRENTES JUDICIALES"
// Plan Maestro Fase 2 - Centro de Comando Legal
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import { casesRepo, eventsRepo } from '../../db/repositories';
import Badge from '../../ui/components/Badge';
import Button from '../../ui/components/Button';
import SectionHeader from '../../ui/components/SectionHeader';
import StatPill from '../../ui/components/StatPill';
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
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-500 mb-2 flex items-center gap-2">
            <Building2 size={12} />
            Centro de Comando Legal
          </p>
          <h1 className="text-xl sm:text-[28px] font-semibold text-white tracking-tight">
            Mapa de Frentes Judiciales
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            {frentes.length} procedimientos activos · Cuantía total: {formatCurrency(frentes.reduce((sum, f) => sum + (f.cuantia || 0), 0) * 100)}
          </p>
        </div>
        <Button
          onClick={handleClearCache}
          title="Limpiar caché"
          variant="ghost"
          iconButton
        >
          <RefreshCw size={18} />
        </Button>
      </header>

      {/* ===== TARJETAS DE FRENTES JUDICIALES ===== */}
      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {frentes.map((frente) => {
          const dias = frente.proximoHito ? getDiasHasta(frente.proximoHito) : null;
          const isUrgente = frente.urgencia === 'urgente';
          const isRiesgo = frente.urgencia === 'riesgo';
          const caseLabel = getCaseLabel(frente);
          const statusClass = isUrgente ? 'status-urgente' : isRiesgo ? 'status-disputa' : 'status-activo';

          return (
            <button
              key={frente.id}
              onClick={() => navigate(`/cases/${frente.id}`)}
              className={`case-card card-base card-elevated text-left group relative border-l-2 ${statusClass} ${
                isUrgente ? 'urgente' : isRiesgo ? 'en-riesgo' : ''
              }`}
              style={{
                background: isUrgente
                  ? 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(15,23,42,0.9) 100%)'
                  : isRiesgo
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(15,23,42,0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(15,23,42,0.9) 100%)',
              }}
            >
              {/* Badge Urgente */}
              {isUrgente && (
                <div className="absolute top-3 right-3">
                  <Badge tone="warn" className="gap-1">
                    <AlertTriangle size={10} /> URGENTE
                  </Badge>
                </div>
              )}
              {isRiesgo && (
                <div className="absolute top-3 right-3">
                  <Badge tone="danger" className="gap-1">
                    <AlertTriangle size={10} /> RIESGO
                  </Badge>
                </div>
              )}

              {/* Icono y Título */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center ${
                  isUrgente ? 'bg-amber-500/20 text-amber-400' :
                  isRiesgo ? 'bg-rose-500/20 text-rose-400' :
                  'bg-emerald-500/20 text-emerald-400'
                }`}>
                  <Scale size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-white truncate">{frente.titulo}</h3>
                    <Badge tone="muted" className="px-3">
                      {caseLabel}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{frente.juzgado}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <div className="text-[10px] uppercase text-slate-500 tracking-wider">Tipo</div>
                  <div className="text-[13px] text-slate-300 font-medium">{frente.tipo}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 tracking-wider">Rol</div>
                  <div className={`text-[13px] font-medium ${
                    frente.rol === 'Demandado' || frente.rol === 'Ejecutado' ? 'text-rose-400' : 'text-emerald-400'
                  }`}>{frente.rol}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 tracking-wider">Fase</div>
                  <div className="text-[13px] text-slate-300 font-medium">{frente.fase}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase text-slate-500 tracking-wider">Cuantía</div>
                  <div className="text-[13px] font-semibold text-white">{formatCurrency(frente.cuantia * 100)}</div>
                </div>
              </div>

              {/* Próximo Hito */}
              {frente.proximoHito && (
                <div className={`card-subtle rounded-[var(--radius-md)] p-2 ${
                  isUrgente ? 'bg-amber-500/10' : isRiesgo ? 'bg-rose-500/10' : 'bg-slate-700/30'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className={
                        isUrgente ? 'text-amber-400' : isRiesgo ? 'text-rose-400' : 'text-slate-400'
                      } />
                      <span className="text-[11px] text-slate-400">{frente.proximoHitoNombre}</span>
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
      <section className="card-base card-default p-5">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={14} className="text-amber-400" />
          <span className="text-[10px] uppercase tracking-wider text-slate-400">Resumen Económico · Picassent (Caso Principal)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatPill label="Reclamado" value={`${safeNumber(resumen.totalReclamado).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€`} tone="danger" />
          <StatPill label="Prescrito" value={`${safeNumber(resumen.prescrito).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€`} tone="info" />
          <StatPill label="Deuda Real" value={`${safeNumber(resumen.cifraRiesgoReal).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€`} tone="warn" />
          <StatPill label="Reducción" value={`${safeNumber(resumen.reduccionObjetivo)}%`} tone="ok" />
        </div>
      </section>

      {/* ===== PRÓXIMOS HITOS GLOBALES ===== */}
      <section>
        <SectionHeader
          title="Próximos Hitos"
          subtitle="Fechas críticas en la agenda general."
          action={<Link to="/events/agenda" className="text-xs text-amber-400 hover:underline">Ver agenda</Link>}
        />

        <div className="space-y-3 mt-3">
          {/* Audiencia Previa Picassent (hardcoded como urgente) */}
          <div className="card-base card-elevated status-urgente border-l-2 flex items-center gap-4 p-4">
            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-amber-500/20 flex flex-col items-center justify-center">
              <span className="text-lg font-semibold text-amber-400">
                {getDiasHasta(resumenAudiencia.fecha)}
              </span>
              <span className="text-[8px] text-amber-500 uppercase">días</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">Audiencia Previa</div>
              <div className="text-xs text-slate-400">Picassent · {new Date(resumenAudiencia.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <Badge tone="warn">Urgente</Badge>
          </div>

          {/* Otros eventos */}
          {proximosEventos.slice(0, 2).map(evento => (
            <div key={evento.id} className="card-base card-subtle flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-slate-700/50 flex flex-col items-center justify-center">
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
      <section className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
        <button
          onClick={() => navigate('/analytics/hechos')}
          className="card-base card-subtle flex flex-col items-center gap-2 p-3 hover:border-emerald-500/30 hover:bg-emerald-500/10 transition-all min-h-[60px]"
        >
          <Scale size={22} className="text-emerald-400" />
          <span className="text-[10px] text-slate-300">Hechos</span>
        </button>
        <button
          onClick={() => navigate('/analytics/audiencia')}
          className="card-base card-subtle flex flex-col items-center gap-2 p-3 hover:bg-amber-500/10 hover:border-amber-500/30 transition-all"
        >
          <Gavel size={22} className="text-amber-400" />
          <span className="text-[10px] text-slate-300">Audiencia</span>
        </button>
        <button
          onClick={() => navigate('/documents')}
          className="card-base card-subtle flex flex-col items-center gap-2 p-3 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all"
        >
          <FileText size={22} className="text-blue-400" />
          <span className="text-[10px] text-slate-300">Documentos</span>
        </button>
        <button
          onClick={() => navigate('/warroom')}
          className="card-base card-subtle flex flex-col items-center gap-2 p-3 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
        >
          <AlertTriangle size={22} className="text-rose-400" />
          <span className="text-[10px] text-slate-300">War Room</span>
        </button>
      </section>

      {/* ===== ALERTAS ===== */}
      <AlertasPanel />

      {/* ===== FUNDAMENTOS JURÍDICOS ===== */}
      <section className="card-base card-default p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Gavel size={14} className="text-amber-400" />
          Fundamentos Jurídicos Clave
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs">
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
