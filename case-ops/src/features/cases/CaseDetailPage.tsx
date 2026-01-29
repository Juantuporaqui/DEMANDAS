// ============================================
// CASE OPS - Case Detail Page (Master Container)
// Vista unificada con Dashboard Ejecutivo + Tabs
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Scale, FileText, Clock, AlertTriangle, Calendar, Gavel,
  Calculator, ChevronRight, Plus, Upload, ListChecks
} from 'lucide-react';
import { Chips } from '../../components';
import {
  casesRepo,
  documentsRepo,
  eventsRepo,
  factsRepo,
  partidasRepo,
  strategiesRepo,
  tasksRepo,
} from '../../db/repositories';
import type { Case, Document, Event, Fact, Partida, Strategy, Task } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';
import { hechosReclamados, resumenContador, calcularTotales } from '../../data/hechosReclamados';
import { resumenAudiencia } from '../../data/audienciaPrevia';
import { HechoBadge } from '../analytics/components/HechoCard';

// ============================================
// Constants
// ============================================

const STATUS_BADGES: Record<string, string> = {
  activo: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  suspendido: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  archivado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
  cerrado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
};

const TABS = [
  { id: 'resumen', label: 'Resumen', icon: '📋' },
  { id: 'estrategia', label: 'Estrategia', icon: '⚔️' },
  { id: 'economico', label: 'Económico', icon: '💰' },
  { id: 'docs', label: 'Docs', icon: '📄' },
  { id: 'actuaciones', label: 'Actuaciones', icon: '📅' },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ============================================
// Helpers
// ============================================

function getNextEvent(events: Event[]) {
  const now = Date.now();
  const upcoming = events
    .map((event) => ({ event, time: new Date(event.date).getTime() }))
    .filter(({ time }) => !Number.isNaN(time))
    .filter(({ time }) => time >= now)
    .sort((a, b) => a.time - b.time)[0];

  return upcoming?.event ?? null;
}

function isPicassent(caseData: Case): boolean {
  return caseData.title.toLowerCase().includes('picassent') ||
         caseData.autosNumber?.includes('715/2024') || false;
}

// ============================================
// Tab Content Components
// ============================================

function TabResumen({
  caseData,
  documents,
  facts,
  strategies,
  partidas,
  tasks,
  events,
  navigate,
}: {
  caseData: Case;
  documents: Document[];
  facts: Fact[];
  strategies: Strategy[];
  partidas: Partida[];
  tasks: Task[];
  events: Event[];
  navigate: (path: string) => void;
}) {
  const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);
  const controversialFacts = facts.filter(
    (f) => f.status === 'controvertido' || f.status === 'a_probar'
  );
  const nextEvent = getNextEvent(events);
  const isPicassentCase = isPicassent(caseData);
  const totales = calcularTotales();

  const countByEstado = {
    prescrito: hechosReclamados.filter(h => h.estado === 'prescrito').length,
    compensable: hechosReclamados.filter(h => h.estado === 'compensable').length,
    disputa: hechosReclamados.filter(h => h.estado === 'disputa').length,
  };

  if (isPicassentCase) {
    // Vista especial para Picassent: Dashboard Ejecutivo
    return (
      <div className="space-y-6">
        {/* Barra de Guerra - KPIs principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Total Reclamado</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">
              {resumenContador.totalReclamado.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Prescrito (~)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {totales.prescrito.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
            <div className="text-[10px] text-slate-600 mt-1">Art. 1964.2 CC</div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Riesgo Real</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {resumenContador.cifraRiesgoReal.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
            </div>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Estrategias</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {strategies.length} activas
            </div>
          </div>
        </div>

        {/* Objetivo procesal */}
        <div className="p-4 rounded-xl border border-slate-700/50 bg-slate-900/50">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Objetivo procesal actual</div>
          <p className="text-sm text-slate-200">
            Reducción del <span className="text-emerald-400 font-bold">{resumenContador.reduccionObjetivo}%</span> de la cuantía mediante prescripción (Art. 1964.2 CC) e impugnación documental
          </p>
        </div>

        {/* Tiles de Impacto */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Card Desglose de Hechos */}
          <button
            type="button"
            onClick={() => navigate('/analytics/hechos')}
            className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 mb-3">
              <ListChecks className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Desglose de Hechos</h3>
            <p className="text-sm text-slate-400 mb-3">
              {hechosReclamados.length} partidas reclamadas con análisis detallado
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <HechoBadge count={countByEstado.prescrito} estado="prescrito" />
              <HechoBadge count={countByEstado.compensable} estado="compensable" />
              <HechoBadge count={countByEstado.disputa} estado="disputa" />
            </div>
            <div className="flex items-center text-sm text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
              Ver desglose completo <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>

          {/* Card Audiencia Previa */}
          <button
            type="button"
            onClick={() => navigate('/analytics/audiencia')}
            className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5"
          >
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" /> Urgente
              </span>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 mb-3">
              <Gavel className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Audiencia Previa</h3>
            <p className="text-sm text-slate-400 mb-3">
              Alegaciones complementarias y fijación de hechos controvertidos
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300">
                {resumenAudiencia.totalAlegaciones} Alegaciones
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300">
                {resumenAudiencia.totalHechosControvertidos} Hechos
              </span>
            </div>
            <div className="flex items-center text-sm text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
              Preparar audiencia <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        </div>

        {/* Próximo Señalamiento */}
        {nextEvent && (
          <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-lg">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Próximo Hito
                  </div>
                  <div className="text-sm font-medium text-slate-200">{nextEvent.title}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-emerald-400">{formatDate(nextEvent.date)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Qué falta para ir fuerte */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">Qué falta para ir fuerte</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <FileText className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Certificado Bankia completo</div>
                <div className="text-xs text-slate-500">Para contraponer a Doc. 25</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <Calculator className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Tabla gastos reforma</div>
                <div className="text-xs text-slate-500">Leroy Merlin, Bricomart</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <Scale className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-white">Nóminas 2016-2022</div>
                <div className="text-xs text-slate-500">Para acreditar aportaciones</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista genérica para otros casos
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Cuantía</div>
          <div className="mt-2 text-2xl font-bold text-emerald-400">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Documentos</div>
          <div className="mt-2 text-2xl font-bold text-white">{documents.length}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Hechos clave</div>
          <div className="mt-2 text-2xl font-bold text-amber-400">{controversialFacts.length}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Estrategias</div>
          <div className="mt-2 text-2xl font-bold text-white">{strategies.length}</div>
        </div>
      </div>

      {nextEvent && (
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-lg">
                📅
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Próximo Hito
                </div>
                <div className="text-sm font-medium text-slate-200">{nextEvent.title}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400">{formatDate(nextEvent.date)}</div>
            </div>
          </div>
        </div>
      )}

      {caseData.notes && (
        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Notas del Expediente</h3>
          <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {caseData.notes}
          </div>
        </div>
      )}
    </div>
  );
}

function TabEstrategia({ strategies, caseId }: { strategies: Strategy[]; caseId: string }) {
  if (strategies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-12 text-center">
        <div className="text-4xl mb-4">⚔️</div>
        <h3 className="text-lg font-semibold text-slate-200">Sin estrategias definidas</h3>
        <p className="text-sm text-slate-500 mt-2">
          Añade líneas de ataque y defensa en el War Room.
        </p>
        <Link
          to={`/warroom/new?caseId=${caseId}`}
          className="inline-flex mt-4 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-500 transition-colors"
        >
          Nueva Estrategia
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Estrategias del Caso ({strategies.length})
        </h3>
        <Link
          to={`/warroom/new?caseId=${caseId}`}
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300 hover:bg-amber-500/20 transition-colors"
        >
          + Nueva
        </Link>
      </div>

      <div className="grid gap-4">
        {strategies.map((strategy, index) => (
          <div
            key={strategy.id}
            className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950/80 p-6"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-sm font-bold text-amber-300">
                  {index + 1}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {strategy.id}
                </span>
              </div>
              <Chips items={strategy.tags} />
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
                  Ataque Esperado
                </div>
                <p className="text-sm text-slate-300">{strategy.attack}</p>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                  Riesgo
                </div>
                <p className="text-sm text-slate-300">{strategy.risk}</p>
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
                  Refutación
                </div>
                <p className="text-sm text-slate-300">{strategy.rebuttal}</p>
              </div>

              {strategy.evidencePlan && (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                    Plan de Evidencia
                  </div>
                  <p className="text-sm text-slate-400">{strategy.evidencePlan}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabEconomico({ caseData, partidas }: { caseData: Case; partidas: Partida[] }) {
  const isPicassentCase = isPicassent(caseData);
  const totales = calcularTotales();

  if (isPicassentCase) {
    // Vista especial con hechosReclamados
    return (
      <div className="space-y-6">
        {/* Resumen financiero */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4">
            <div className="text-xs uppercase tracking-wider text-rose-300/70">Total Reclamado</div>
            <div className="text-xl font-bold text-rose-400 mt-1">
              {resumenContador.totalReclamado.toLocaleString('es-ES')} €
            </div>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="text-xs uppercase tracking-wider text-emerald-300/70">Prescrito</div>
            <div className="text-xl font-bold text-emerald-400 mt-1">
              {totales.prescrito.toLocaleString('es-ES')} €
            </div>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="text-xs uppercase tracking-wider text-amber-300/70">Compensable</div>
            <div className="text-xl font-bold text-amber-400 mt-1">
              {totales.compensable.toLocaleString('es-ES')} €
            </div>
          </div>
          <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 p-4">
            <div className="text-xs uppercase tracking-wider text-slate-300/70">En Disputa</div>
            <div className="text-xl font-bold text-slate-400 mt-1">
              {totales.disputa.toLocaleString('es-ES')} €
            </div>
          </div>
        </div>

        {/* Lista de hechos reclamados */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Desglose de Hechos Reclamados</h3>
          {hechosReclamados.map((hecho) => (
            <div
              key={hecho.id}
              className={`rounded-xl border p-4 ${
                hecho.estado === 'prescrito'
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : hecho.estado === 'compensable'
                  ? 'border-amber-500/30 bg-amber-500/5'
                  : 'border-slate-500/30 bg-slate-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-500">#{hecho.id}</span>
                    <h4 className="font-semibold text-white">{hecho.titulo}</h4>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        hecho.estado === 'prescrito'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : hecho.estado === 'compensable'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-500/20 text-slate-300'
                      }`}
                    >
                      {hecho.estado}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{hecho.estrategia}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {hecho.cuantia.toLocaleString('es-ES')} €
                  </div>
                  <div className="text-xs text-slate-500">{hecho.año}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Vista genérica
  const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Partidas Económicas</h3>
        <div className="text-xl font-bold text-emerald-400">{formatCurrency(totalAmount)}</div>
      </div>

      {partidas.length > 0 ? (
        <div className="space-y-2">
          {partidas.map((partida) => (
            <div
              key={partida.id}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950/50 px-4 py-3"
            >
              <div>
                <div className="font-medium text-slate-200">{partida.concept}</div>
                <div className="text-xs text-slate-500">{formatDate(partida.date)}</div>
              </div>
              <span className="font-semibold text-emerald-400">{formatCurrency(partida.amountCents)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-8 text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-sm text-slate-500">Sin partidas registradas.</p>
        </div>
      )}
    </div>
  );
}

function TabDocs({ documents, caseId, caseData }: { documents: Document[]; caseId: string; caseData: Case }) {
  const isPicassentCase = isPicassent(caseData);

  return (
    <div className="space-y-6">
      {/* Header con botón */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Documentos del Caso ({documents.length})
        </h3>
        <Link
          to={`/documents/new?caseId=${caseId}`}
          className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 hover:bg-blue-500/20 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Subir
        </Link>
      </div>

      {/* Visor de demanda para Picassent */}
      {isPicassentCase && (
        <div className="rounded-xl border border-amber-500/30 bg-slate-900/50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-amber-400" />
            <h4 className="font-semibold text-amber-200">Demanda Picassent 715/2024</h4>
          </div>
          <div className="prose prose-sm prose-invert max-w-none">
            <div className="rounded-lg bg-slate-950/50 p-4 text-sm text-slate-300 leading-relaxed max-h-[400px] overflow-y-auto">
              <p className="font-bold text-white mb-2">PROCEDIMIENTO ORDINARIO 715/2024</p>
              <p className="mb-2">Juzgado de Primera Instancia nº 4 de Picassent</p>
              <p className="mb-4 text-slate-400">Demandante: Dª. Vicenta | Demandado: D. Juan</p>

              <p className="font-semibold text-amber-300 mb-2">OBJETO DE LA DEMANDA:</p>
              <p className="mb-4">
                Reclamación de cantidad por importe de 212.677,08 € derivada de las aportaciones
                realizadas durante la convivencia more uxorio, incluyendo pagos de hipoteca,
                vehículos, y otros gastos comunes.
              </p>

              <p className="font-semibold text-amber-300 mb-2">HECHOS PRINCIPALES:</p>
              <ul className="list-disc pl-5 space-y-1 mb-4">
                <li>Préstamos personales BBVA: 20.085,00 €</li>
                <li>Vehículo Seat León: 13.000,00 €</li>
                <li>Venta vivienda Artur Piera: 32.000,00 €</li>
                <li>Hipoteca Lope de Vega: 122.282,28 €</li>
                <li>IBI y gastos diversos: 4.328,55 €</li>
                <li>Amortización hipoteca previa: 16.979,59 €</li>
                <li>Maquinaria agrícola: 5.801,25 €</li>
              </ul>

              <p className="font-semibold text-emerald-300 mb-2">LÍNEA DE DEFENSA:</p>
              <p className="text-emerald-200">
                Prescripción de acciones (Art. 1964.2 CC) para todo lo anterior a 2019.
                Compensación de créditos. Impugnación de prueba documental manipulada.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lista de documentos */}
      {documents.length > 0 ? (
        <div className="grid gap-3">
          {documents.map((doc) => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/50 px-4 py-4 hover:border-blue-500/40 hover:bg-slate-900/70 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-lg">
                  📄
                </div>
                <div>
                  <div className="font-medium text-slate-200">{doc.title}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="uppercase">{doc.docType}</span>
                    <span>·</span>
                    <span>{formatDate(doc.docDate)}</span>
                    {doc.annexCode && (
                      <>
                        <span>·</span>
                        <span className="text-blue-400">{doc.annexCode}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500">{doc.id}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-12 text-center">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-slate-200">Sin documentos</h3>
          <p className="text-sm text-slate-500 mt-2">
            Sube escritos, pruebas y comunicaciones del expediente.
          </p>
          <Link
            to={`/documents/new?caseId=${caseId}`}
            className="inline-flex mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Subir Documento
          </Link>
        </div>
      )}
    </div>
  );
}

function TabActuaciones({ events, facts, caseId }: { events: Event[]; facts: Fact[]; caseId: string }) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Cronología</h3>
          <Link
            to={`/events/new?caseId=${caseId}`}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            + Evento
          </Link>
        </div>

        {sortedEvents.length > 0 ? (
          <div className="relative space-y-4 pl-6 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-slate-800">
            {sortedEvents.map((event) => (
              <div key={event.id} className="relative">
                <div
                  className={`absolute -left-6 top-1 h-4 w-4 rounded-full border-2 ${
                    event.type === 'procesal'
                      ? 'border-emerald-500 bg-emerald-500/20'
                      : 'border-blue-500 bg-blue-500/20'
                  }`}
                />
                <div className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-slate-200">{event.title}</div>
                      <div className="text-sm text-slate-400 mt-1">{event.description}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium text-slate-300">{formatDate(event.date)}</div>
                      <div
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          event.type === 'procesal' ? 'text-emerald-400' : 'text-blue-400'
                        }`}
                      >
                        {event.type}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-8 text-center">
            <div className="text-2xl mb-2">📅</div>
            <p className="text-sm text-slate-500">Sin eventos registrados.</p>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Hechos Relevantes</h3>
          <Link
            to={`/facts/new?caseId=${caseId}`}
            className="rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            + Hecho
          </Link>
        </div>

        {facts.length > 0 ? (
          <div className="grid gap-3">
            {facts.map((fact) => (
              <Link
                key={fact.id}
                to={`/facts/${fact.id}`}
                className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:border-purple-500/40 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-slate-200">{fact.title}</div>
                    <div className="text-sm text-slate-400 mt-1 line-clamp-2">{fact.narrative}</div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                      fact.status === 'controvertido'
                        ? 'bg-rose-500/20 text-rose-300'
                        : fact.status === 'a_probar'
                        ? 'bg-amber-500/20 text-amber-300'
                        : fact.status === 'admitido'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-500/20 text-slate-300'
                    }`}
                  >
                    {fact.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-8 text-center">
            <div className="text-2xl mb-2">📝</div>
            <p className="text-sm text-slate-500">Sin hechos registrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [childCases, setChildCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCase(id);
    }
  }, [id]);

  async function loadCase(caseId: string) {
    try {
      const [
        caseInfo,
        caseDocs,
        caseFacts,
        casePartidas,
        caseEvents,
        caseStrategies,
        caseTasks,
        allCases,
      ] = await Promise.all([
        casesRepo.getById(caseId),
        documentsRepo.getByCaseId(caseId),
        factsRepo.getByCaseId(caseId),
        partidasRepo.getByCaseId(caseId),
        eventsRepo.getByCaseId(caseId),
        strategiesRepo.getByCaseId(caseId),
        tasksRepo.getByCaseId(caseId),
        casesRepo.getAll(),
      ]);

      if (!caseInfo) {
        navigate('/cases');
        return;
      }

      setCaseData(caseInfo);
      setDocuments(caseDocs);
      setFacts(caseFacts);
      setPartidas(casePartidas);
      setEvents(caseEvents);
      setStrategies(caseStrategies);
      setTasks(caseTasks);
      setChildCases(allCases.filter((c) => c.parentCaseId === caseId));
    } catch (error) {
      console.error('Error loading case:', error);
    } finally {
      setLoading(false);
    }
  }

  const nextEvent = useMemo(() => getNextEvent(events), [events]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-semibold text-slate-200">Caso no encontrado</h2>
        <p className="text-sm text-slate-500 mt-2">El expediente solicitado no existe.</p>
        <Link
          to="/cases"
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
        >
          Volver a casos
        </Link>
      </div>
    );
  }

  const isPicassentCase = isPicassent(caseData);

  return (
    <div className="space-y-6">
      {/* Header Unificado */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate('/cases')}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors"
          >
            ←
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              {isPicassentCase ? 'Caso Maestro' : 'Procedimiento'} · {caseData.id}
            </p>
            <h1 className="text-2xl font-bold text-white mt-1">{caseData.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
              <span>{caseData.court || 'Sin juzgado'}</span>
              <span>·</span>
              <span>Autos {caseData.autosNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción + Estado */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/documents/new?caseId=${caseData.id}`}
            className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-blue-300 hover:bg-blue-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Documento
          </Link>
          <Link
            to={`/events/new?caseId=${caseData.id}`}
            className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300 hover:bg-emerald-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Evento
          </Link>
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
              STATUS_BADGES[caseData.status] || 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {caseData.status}
          </span>
        </div>
      </div>

      {/* Tags */}
      {caseData.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {caseData.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Próximo Evento Banner (solo si no es Picassent, ya que se muestra en Resumen) */}
      {!isPicassentCase && nextEvent && (
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-lg">
                📅
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Próximo Hito
                </div>
                <div className="text-sm font-medium text-slate-200">{nextEvent.title}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-emerald-400">{formatDate(nextEvent.date)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Child Cases */}
      {childCases.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Vinculados:
          </span>
          {childCases.map((child) => (
            <Link
              key={child.id}
              to={`/cases/${child.id}`}
              className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1 text-xs font-medium text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="pb-8">
        {activeTab === 'resumen' && (
          <TabResumen
            caseData={caseData}
            documents={documents}
            facts={facts}
            strategies={strategies}
            partidas={partidas}
            tasks={tasks}
            events={events}
            navigate={navigate}
          />
        )}
        {activeTab === 'estrategia' && <TabEstrategia strategies={strategies} caseId={caseData.id} />}
        {activeTab === 'economico' && <TabEconomico caseData={caseData} partidas={partidas} />}
        {activeTab === 'docs' && <TabDocs documents={documents} caseId={caseData.id} caseData={caseData} />}
        {activeTab === 'actuaciones' && <TabActuaciones events={events} facts={facts} caseId={caseData.id} />}
      </div>
    </div>
  );
}
