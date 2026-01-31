// ============================================
// CASE OPS - Case Detail Page (MASTER FINAL MERGED)
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Scale, FileText, Calendar, Gavel, ChevronRight, Upload, ListChecks, RefreshCw, Eye, AlertTriangle
} from 'lucide-react';
import {
  casesRepo, documentsRepo, eventsRepo, factsRepo, partidasRepo, strategiesRepo
} from '../../db/repositories';
import type { Case, Document, Event, Fact, Partida, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { TextReader } from '../../ui/components/TextReader';
// Importamos el mapa de textos reales y documentos auto-detectados
import { LEGAL_DOCS_MAP, AUTO_DOCS } from '../../data/legal_texts';
import type { AutoDocument } from '../../data/legal_texts';
import { formatCurrency } from '../../utils/validators';
import { getCaseAmounts } from '../../utils/moneyCase';
// Análisis financiero específico para Quart
import { QuartFinancialAnalysis } from './QuartFinancialAnalysis';
// Registro de PDFs
import { getPDFsByCaso, getPDFUrl, tipoDocIcons, tipoDocColors, type PDFDocument } from '../../data/pdfRegistry';
// Visor PDF embebido (evita que React Router intercepte las URLs)
import { EmbeddedPDFViewer } from '../../components/EmbeddedPDFViewer';
// Timeline específico para Picassent
import { PicassentTimeline } from './PicassentTimeline';

// ============================================
// 1. DASHBOARD EJECUTIVO (Tab Resumen) - DINÁMICO
// ============================================
function TabResumen({ caseData, strategies, events, facts, partidas, documents, navigate, setActiveTab, isReadMode }: any) {
  // Motor de cuantías (Anti-Fantasmas)
  const amounts = getCaseAmounts(caseData, partidas);
  const totalPartidas = amounts.analytic;

  // Hechos ordenados por riesgo
  const factsByRisk = [...facts].sort((a: Fact, b: Fact) => {
    const riskOrder: Record<string, number> = { alto: 0, medio: 1, bajo: 2 };
    return (riskOrder[a.risk || 'bajo'] || 2) - (riskOrder[b.risk || 'bajo'] || 2);
  });
  const topFacts = factsByRisk.slice(0, 4);

  const nextEvent = events
    .filter((e: Event) => new Date(e.date).getTime() >= Date.now())
    .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Contadores por estado de hechos
  const factsControvertidos = facts.filter((f: Fact) => f.status === 'controvertido').length;
  const factsAProbar = facts.filter((f: Fact) => f.status === 'a_probar').length;

  // Detectar tipo de caso
  const isPicassent = caseData.id?.includes('picassent') ||
                      caseData.title?.toLowerCase().includes('picassent') ||
                      caseData.autosNumber?.includes('715');
  const isMislata = caseData.id?.includes('mislata') ||
                    caseData.title?.toLowerCase().includes('mislata') ||
                    caseData.autosNumber?.includes('1185');
  const isQuart = caseData.id?.includes('quart') ||
                  caseData.title?.toLowerCase().includes('quart') ||
                  caseData.autosNumber?.includes('1428');

  // Calcular días hasta vista/audiencia
  const vistaEvent = events.find((e: Event) =>
    e.title?.toLowerCase().includes('vista') ||
    e.title?.toLowerCase().includes('audiencia') ||
    e.title?.toLowerCase().includes('juicio')
  );
  const diasHastaVista = vistaEvent ? Math.ceil((new Date(vistaEvent.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  // TODO: Indicadores probatorios - pendiente implementar enlaces
  // Por ahora contamos hechos sin evidencia como aquellos sin enlaces (simplificado)
  const hechosCount = facts.length;
  const hechosSinEvidencia = facts.length; // TODO: filtrar por enlaces reales
  const partidasSinSoporte = partidas.length; // TODO: filtrar por enlaces reales

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* RESUMEN EJECUTIVO */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-slate-900/60 p-4 sm:p-5">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Eye size={16} /> Resumen ejecutivo
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Parte contraria */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Parte contraria</div>
            <div className="text-sm font-medium text-rose-300">{caseData.opposingPartyName || caseData.opposingCounsel?.split('(')[1]?.replace(')', '') || 'No especificada'}</div>
          </div>
          {/* Letrada contraria */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Letrada contraria</div>
            <div className="text-sm font-medium text-rose-300">{caseData.opposingLawyerName || caseData.opposingCounsel?.split('(')[0]?.trim() || 'No especificada'}</div>
          </div>
          {/* Juzgado */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Juzgado</div>
            <div className="text-sm font-medium text-slate-200">{caseData.court}</div>
          </div>
          {/* Autos */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Autos</div>
            <div className="text-sm font-medium text-slate-200 font-mono">{caseData.autosNumber}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* NIG */}
          {caseData.nig && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">NIG</div>
              <div className="text-xs font-medium text-slate-300 font-mono">{caseData.nig}</div>
            </div>
          )}
          {/* Rol */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Rol procesal</div>
            <div className={`text-sm font-bold uppercase ${
              caseData.clientRole === 'demandante' || caseData.clientRole === 'ejecutante'
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}>{caseData.clientRole || 'No especificado'}</div>
          </div>
          {/* Próximo hito */}
          {vistaEvent && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-amber-500/30">
              <div className="text-[10px] uppercase tracking-wider text-amber-500 mb-1">Próximo hito</div>
              <div className="text-sm font-medium text-amber-300">{formatDate(vistaEvent.date)}</div>
              <div className="text-[10px] text-slate-500">{vistaEvent.title}</div>
            </div>
          )}
          {/* Cuantía Procesal */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-rose-500/30">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Cuantía procesal (demanda)</div>
            <div className="text-lg font-bold text-rose-400">{formatCurrency(amounts.totalDemand)}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Sumatorio Analítico */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Sumatorio analítico (partidas)</div>
            <div className="text-lg font-bold text-emerald-400">{formatCurrency(amounts.analytic)}</div>
          </div>
          {/* Delta */}
          {amounts.delta !== 0 && (
            <div className="bg-amber-900/30 rounded-lg p-3 border border-amber-500/50">
              <div className="text-[10px] uppercase tracking-wider text-amber-500 mb-1">Delta pendiente de justificar</div>
              <div className="text-lg font-bold text-amber-400">{formatCurrency(Math.abs(amounts.delta))}</div>
            </div>
          )}
          {/* Nº Hechos */}
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Nº hechos</div>
            <div className="text-lg font-bold text-slate-200">{hechosCount}</div>
            <div className="text-[10px] text-slate-500">{factsControvertidos} controvertidos</div>
          </div>
          {/* Judge si existe */}
          {caseData.judge && caseData.judge !== '[Pendiente]' && (
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Juez</div>
              <div className="text-sm font-medium text-slate-200">{caseData.judge}</div>
            </div>
          )}
        </div>
        {caseData.notes && !isReadMode && (
          <p className="mt-4 text-sm text-slate-400 leading-relaxed border-t border-slate-700/50 pt-3">{caseData.notes}</p>
        )}
      </div>

      {/* TARJETAS PRINCIPALES ESTILO ANDROID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card Desglose de Hechos - TODOS LOS CASOS */}
        <button
          type="button"
          onClick={() => isPicassent ? navigate('/analytics/hechos') : setActiveTab('economico')}
          className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 mb-3">
            <ListChecks className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Desglose de Hechos</h3>
          <p className="text-sm text-slate-400 mb-3">
            {facts.length} partidas con análisis detallado
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              {factsControvertidos} controvertidos
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {factsAProbar} a probar
            </span>
          </div>
          <div className="flex items-center text-sm text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
            Ver desglose completo <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Card Audiencia Previa - SOLO PICASSENT */}
        {isPicassent && (
          <button
            type="button"
            onClick={() => navigate('/analytics/audiencia')}
            className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 active:scale-[0.98]"
          >
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3 h-3" /> Urgente
              </span>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 mb-3">
              <Gavel className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Audiencia Previa</h3>
            <p className="text-sm text-slate-400 mb-3">
              Alegaciones y hechos controvertidos
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300">
                12 Alegaciones
              </span>
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-slate-700/50 text-slate-300">
                18 Hechos
              </span>
            </div>
            <div className="flex items-center text-sm text-amber-400 font-medium group-hover:translate-x-1 transition-transform">
              Preparar audiencia <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        )}

        {/* Card Vista - TODOS LOS CASOS */}
        {vistaEvent && (
          <button
            type="button"
            onClick={() => isMislata || isQuart ? navigate('/audiencia/checklist') : navigate('/audiencia-previa')}
            className="group relative rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 active:scale-[0.98]"
          >
            <div className="absolute top-4 right-4">
              {diasHastaVista !== null && diasHastaVista <= 30 && diasHastaVista > 0 && (
                <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {diasHastaVista}d
                </span>
              )}
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/30 mb-3">
              <Scale className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Vista / Juicio</h3>
            <p className="text-sm text-slate-400 mb-3">
              {vistaEvent.title}
            </p>
            <div className="text-xs text-slate-500 mb-3">
              📅 {formatDate(vistaEvent.date)}
            </div>
            <div className="flex items-center text-sm text-violet-400 font-medium group-hover:translate-x-1 transition-transform">
              Preparar vista <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        )}

        {/* Si no hay vista programada, mostrar card para añadirla */}
        {!vistaEvent && (
          <button
            type="button"
            onClick={() => navigate(`/events/new?caseId=${caseData.id}`)}
            className="group rounded-2xl border border-dashed border-slate-600 bg-slate-900/30 p-5 text-left transition-all hover:border-violet-500/50 hover:bg-violet-500/5 active:scale-[0.98]"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700 mb-3">
              <Calendar className="w-6 h-6 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-1">Vista / Juicio</h3>
            <p className="text-sm text-slate-500 mb-3">
              No hay fecha de vista programada
            </p>
            <div className="flex items-center text-sm text-violet-400 font-medium group-hover:translate-x-1 transition-transform">
              + Añadir fecha <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* KPIs DINÁMICOS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Cuantía procesal (demanda)</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {formatCurrency(amounts.totalDemand)}
          </div>
          <div className="text-[10px] text-slate-600">{partidas.length} partidas</div>
          {amounts.delta !== 0 && (
            <div className="text-[10px] text-amber-400 mt-1">Delta pendiente de justificar</div>
          )}
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Hechos</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{facts.length}</div>
          <div className="text-[10px] text-slate-600">{factsControvertidos} controvertidos</div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Eventos</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{events.length}</div>
          <div className="text-[10px] text-slate-600">{events.filter((e: Event) => new Date(e.date) > new Date()).length} próximos</div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Estrategias</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{strategies.length}</div>
          <div className="text-[10px] text-slate-600">líneas de defensa</div>
        </div>
      </div>

      {/* HECHOS DEL CASO */}
      {facts.length > 0 && (
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><ListChecks size={20} /></div>
              <div>
                <h3 className="font-bold text-white text-sm">Hechos del Caso</h3>
                <p className="text-[10px] text-slate-500">{facts.length} puntos registrados</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {topFacts.map((fact: Fact, i: number) => (
              <button
                key={fact.id}
                onClick={() => navigate(`/facts/${fact.id}`)}
                className={`w-full text-left p-3 rounded-xl border transition-all hover:scale-[1.01] ${
                  fact.risk === 'alto' || fact.status === 'controvertido'
                    ? 'bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60'
                    : fact.status === 'a_probar'
                    ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                    : 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs font-bold ${
                      fact.risk === 'alto' ? 'text-rose-400' :
                      fact.risk === 'medio' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      #{i + 1}
                    </span>
                    <span className="text-white text-sm ml-2 line-clamp-1">{fact.title || fact.titulo}</span>
                  </div>
                  <div className="flex gap-1 items-center shrink-0">
                    {/* FASE 6: Indicador probatorio - Sin evidencia */}
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/50">
                      Sin evidencia
                    </span>
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                      fact.status === 'controvertido' ? 'bg-rose-500/20 text-rose-300' :
                      fact.status === 'a_probar' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {fact.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {facts.length > 4 && (
            <button
              onClick={() => setActiveTab('economico')}
              className="w-full text-xs text-emerald-400 font-medium py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
            >
              Ver todos los {facts.length} hechos →
            </button>
          )}
        </div>
      )}

      {/* ESTRATEGIAS DEL CASO */}
      {strategies.length > 0 && (
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Gavel size={20} /></div>
            <div>
              <h3 className="font-bold text-white text-sm">Líneas de Defensa/Ataque</h3>
              <p className="text-[10px] text-slate-500">{strategies.length} estrategias definidas</p>
            </div>
          </div>

          <div className="space-y-2">
            {strategies.slice(0, 3).map((s: Strategy, i: number) => (
              <div key={s.id} className={`p-3 rounded-xl border ${
                s.risk === 'Alto' ? 'bg-rose-500/10 border-rose-500/30' :
                s.risk === 'Medio' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-emerald-500/10 border-emerald-500/30'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-white line-clamp-2">{s.attack}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded shrink-0 ${
                    s.risk === 'Alto' ? 'bg-rose-500/30 text-rose-300' :
                    s.risk === 'Medio' ? 'bg-amber-500/30 text-amber-300' :
                    'bg-emerald-500/30 text-emerald-300'
                  }`}>{s.risk}</span>
                </div>
              </div>
            ))}
          </div>

          {strategies.length > 3 && (
            <button
              onClick={() => setActiveTab('estrategia')}
              className="w-full mt-3 text-xs text-amber-400 font-medium py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
            >
              Ver todas las estrategias →
            </button>
          )}
        </div>
      )}

      {/* ACCESO RÁPIDO A DOCUMENTOS */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><Eye size={18} /></div>
          <h3 className="font-bold text-white text-sm">Documentos ({documents.length})</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setActiveTab('docs')}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-xl sm:text-2xl">📂</span>
            <span className="text-[9px] sm:text-[10px] text-cyan-400 font-medium">Ver todos</span>
          </button>
          <button
            onClick={() => navigate(`/documents/new?caseId=${caseData.id}`)}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all hover:scale-105 active:scale-95"
          >
            <Upload size={20} className="text-slate-400 sm:w-6 sm:h-6" />
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Subir</span>
          </button>
          <button
            onClick={() => navigate('/warroom')}
            className="flex flex-col items-center gap-1 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/50 hover:bg-rose-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <AlertTriangle size={20} className="text-rose-400" />
            <span className="text-[9px] sm:text-[10px] text-rose-400 font-medium">War Room</span>
          </button>
        </div>
      </div>

      {/* PRÓXIMO EVENTO */}
      {nextEvent && (
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-transparent p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400"><Calendar size={20} /></div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase">Próximo Hito</div>
              <div className="text-slate-200">{nextEvent.title}</div>
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400">{formatDate(nextEvent.date)}</div>
        </div>
      )}

      {/* MENSAJE SI NO HAY DATOS */}
      {facts.length === 0 && strategies.length === 0 && events.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-slate-300 mb-2">Caso sin datos</h3>
          <p className="text-sm text-slate-500 mb-4">
            Este caso no tiene hechos, eventos ni estrategias registradas.
          </p>
          <p className="text-xs text-amber-400">
            Ve a <strong>Ajustes → Migraciones</strong> para cargar los datos reales.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// 2. TAB DOCUMENTOS (El Lector Inteligente - MÓVIL FULLSCREEN)
// ============================================
function TabDocs({ documents, caseId, caseData, initialDocKey }: any) {
  // Estado para el documento seleccionado
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>(initialDocKey || null);
  const [showMobileViewer, setShowMobileViewer] = useState(false);
  // Estado para PDF seleccionado (separado de docs de texto)
  const [selectedPDF, setSelectedPDF] = useState<PDFDocument | null>(null);

  // Detección robusta: ID del caso, Título o Número de Autos
  const isPicassent = caseId?.includes('picassent') ||
                      caseData.title?.toLowerCase().includes('picassent') ||
                      caseData.autosNumber?.includes('715');

  const isMislata = caseData.title?.toLowerCase().includes('mislata') ||
                    caseData.autosNumber?.includes('1185');

  const isQuart = caseData.title?.toLowerCase().includes('quart') ||
                  caseData.autosNumber?.includes('1428');

  // Obtener PDFs del caso actual
  const casoKeyPDF = isPicassent ? 'picassent' : isMislata ? 'mislata' : isQuart ? 'quart' : null;
  const pdfDocuments = casoKeyPDF ? getPDFsByCaso(casoKeyPDF) : [];

  // Debug: Ver si tenemos textos cargados
  const hasLegalTexts = LEGAL_DOCS_MAP && Object.keys(LEGAL_DOCS_MAP).length > 0;

  // Handler para seleccionar documento de texto (móvil abre fullscreen)
  const handleSelectDoc = (key: string) => {
    setSelectedDocKey(key);
    setSelectedPDF(null); // Deseleccionar PDF
    setShowMobileViewer(true);
  };

  // Handler para seleccionar PDF
  const handleSelectPDF = (pdf: PDFDocument) => {
    setSelectedPDF(pdf);
    setSelectedDocKey(null); // Deseleccionar texto
    setShowMobileViewer(true);
  };

  // Botón de documento reutilizable
  const DocButton = ({ docKey, icon, label, color }: { docKey: string; icon: string; label: string; color: 'amber' | 'emerald' | 'rose' | 'blue' | 'violet' }) => {
    const colors = {
      amber: { active: 'bg-amber-900/40 border-amber-500/50 text-amber-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-amber-500/30' },
      emerald: { active: 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-emerald-500/30' },
      rose: { active: 'bg-rose-900/40 border-rose-500/50 text-rose-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-rose-500/30' },
      blue: { active: 'bg-blue-900/40 border-blue-500/50 text-blue-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500/30' },
      violet: { active: 'bg-violet-900/40 border-violet-500/50 text-violet-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-violet-500/30' },
    };
    const isActive = selectedDocKey === docKey;
    return (
      <button
        onClick={() => handleSelectDoc(docKey)}
        className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${isActive ? colors[color].active : colors[color].inactive}`}
      >
        {icon} {label}
      </button>
    );
  };

  return (
    <>
      {/* VISOR MÓVIL FULLSCREEN - PDF */}
      {showMobileViewer && selectedPDF && casoKeyPDF && (
        <div className="fixed inset-0 z-50 bg-slate-950 lg:hidden flex flex-col">
          {/* Header móvil */}
          <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
            <button
              onClick={() => setShowMobileViewer(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <ChevronRight className="rotate-180" size={20} />
              <span className="text-sm">Volver</span>
            </button>
            <span className="text-xs text-slate-500 truncate max-w-[150px]">{selectedPDF.titulo}</span>
          </div>
          {/* Visor PDF embebido */}
          <EmbeddedPDFViewer
            url={getPDFUrl(casoKeyPDF, selectedPDF.archivo)}
            title={selectedPDF.titulo}
            className="flex-1"
          />
        </div>
      )}

      {/* VISOR MÓVIL FULLSCREEN - Texto */}
      {showMobileViewer && selectedDocKey && LEGAL_DOCS_MAP[selectedDocKey] && !selectedPDF && (
        <div className="fixed inset-0 z-50 bg-slate-950 lg:hidden flex flex-col">
          {/* Header móvil */}
          <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
            <button
              onClick={() => setShowMobileViewer(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-white"
            >
              <ChevronRight className="rotate-180" size={20} />
              <span className="text-sm">Volver</span>
            </button>
            <span className="text-xs text-slate-500 truncate max-w-[200px]">{selectedDocKey}</span>
          </div>
          {/* Contenido fullscreen */}
          <div className="flex-1 overflow-auto">
            <TextReader content={LEGAL_DOCS_MAP[selectedDocKey]} />
          </div>
        </div>
      )}

      {/* LAYOUT PRINCIPAL */}
      <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4 lg:gap-6 lg:h-[calc(100vh-240px)] lg:min-h-[600px]">
        {/* SIDEBAR DOCUMENTOS */}
        <div className="space-y-4 lg:space-y-6 lg:col-span-1 lg:overflow-y-auto lg:pr-2 custom-scrollbar">

          {/* Botón Subir */}
          <Link to={`/documents/new?caseId=${caseId}`} className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
            <Upload size={16} /> Subir Nuevo
          </Link>

          {/* Escritos Procesales */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Scale size={14} /> Autos y Escritos
            </h3>

            <div className="space-y-2">
              {!hasLegalTexts && (
                 <div className="text-xs text-rose-500 bg-rose-900/20 p-2 rounded mb-2 border border-rose-800">
                   ⚠️ Error: No se han cargado los textos legales.
                 </div>
              )}

              {/* PICASSENT */}
              {isPicassent && (
                <>
                  <DocButton docKey="demanda-picassent" icon="📜" label="Demanda Contraria" color="amber" />
                  <DocButton docKey="contestacion-picassent" icon="🛡️" label="Contestación" color="emerald" />
                </>
              )}

              {/* MISLATA */}
              {isMislata && (
                <>
                  <DocButton docKey="demanda-mislata" icon="📄" label="Nuestra Demanda" color="emerald" />
                  <DocButton docKey="contestacion-mislata" icon="🚨" label="Contestación Vicenta" color="rose" />
                  <DocButton docKey="argumentos-mislata" icon="⚔️" label="Argumentos Clave" color="blue" />
                  <DocButton docKey="frases-vista-mislata" icon="🎯" label="Frases Vista" color="violet" />
                </>
              )}

              {/* QUART */}
              {isQuart && (
                <>
                  <DocButton docKey="sentencia-divorcio-quart" icon="⚖️" label="Sentencia Divorcio 362/2023" color="blue" />
                  <DocButton docKey="demanda-ejecucion-quart" icon="📜" label="Demanda Ejecución (Vicenta)" color="amber" />
                  <DocButton docKey="oposicion-quart" icon="🛡️" label="Nuestra Oposición" color="emerald" />
                  <DocButton docKey="impugnacion-quart" icon="🚨" label="Impugnación (Vicenta)" color="rose" />
                  <DocButton docKey="argumentos-quart" icon="⚔️" label="Argumentos y Riesgos" color="violet" />
                </>
              )}

              {!isPicassent && !isMislata && !isQuart && (
                   <div className="text-xs text-slate-600 p-2 italic">No hay escritos predefinidos para este caso.</div>
              )}
            </div>
          </div>

          {/* DOCUMENTOS AUTO-DETECTADOS */}
          {(() => {
            const casoKey = isPicassent ? 'picassent' : isMislata ? 'mislata' : isQuart ? 'quart' : null;
            const autoDocs = casoKey ? AUTO_DOCS[casoKey] : [];
            if (autoDocs.length === 0) return null;
            return (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> Documentos Subidos ({autoDocs.length})
                </h3>
                <div className="space-y-2">
                  {autoDocs.map((doc: AutoDocument) => (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc.id)}
                      className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${
                        selectedDocKey === doc.id
                          ? 'bg-cyan-900/40 border-cyan-500/50 text-cyan-100'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-500/30'
                      }`}
                    >
                      {doc.extension === 'html' ? '🌐' : '📄'} {doc.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* PDFs DEL EXPEDIENTE (desde public/docs/{caso}/) */}
          {pdfDocuments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-rose-400 uppercase mb-3 flex items-center gap-2">
                <FileText size={14} /> PDFs del Expediente ({pdfDocuments.length})
              </h3>
              <div className="space-y-2">
                {pdfDocuments.map((pdf) => {
                  const colorKey = tipoDocColors[pdf.tipo] || 'slate';
                  const colorClasses: Record<string, { active: string; inactive: string }> = {
                    amber: { active: 'bg-amber-900/40 border-amber-500/50 text-amber-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-amber-500/30' },
                    emerald: { active: 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-emerald-500/30' },
                    blue: { active: 'bg-blue-900/40 border-blue-500/50 text-blue-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-blue-500/30' },
                    violet: { active: 'bg-violet-900/40 border-violet-500/50 text-violet-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-violet-500/30' },
                    cyan: { active: 'bg-cyan-900/40 border-cyan-500/50 text-cyan-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-cyan-500/30' },
                    slate: { active: 'bg-slate-700/40 border-slate-500/50 text-slate-100', inactive: 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500/30' },
                  };
                  const colors = colorClasses[colorKey] || colorClasses.slate;
                  const isActive = selectedPDF?.id === pdf.id;
                  return (
                    <button
                      key={pdf.id}
                      onClick={() => handleSelectPDF(pdf)}
                      className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${isActive ? colors.active : colors.inactive}`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{tipoDocIcons[pdf.tipo] || '📄'}</span>
                        <span className="truncate">{pdf.titulo}</span>
                      </div>
                      {pdf.fecha && (
                        <div className="text-[10px] text-slate-500 mt-1 ml-6">{pdf.fecha}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Instrucciones para añadir PDFs (si no hay ninguno) */}
          {pdfDocuments.length === 0 && casoKeyPDF && (
            <div className="p-3 rounded-lg border border-dashed border-slate-700 bg-slate-900/30">
              <h3 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                <FileText size={14} /> PDFs del Expediente
              </h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                Para ver PDFs aquí:
                <br />1. Sube el archivo a <code className="text-cyan-400">public/docs/{casoKeyPDF}/</code>
                <br />2. Edita <code className="text-cyan-400">src/data/pdfRegistry.ts</code>
                <br />3. Recarga la web
              </p>
            </div>
          )}

          {/* Archivos Adjuntos de IndexedDB */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <Upload size={14} /> Archivo Digital
            </h3>
            {documents.length === 0 && <p className="text-xs text-slate-600 italic">No hay archivos adjuntos.</p>}
            {documents.map((doc: Document) => (
              <div key={doc.id} className="p-3 mb-2 bg-slate-900 rounded border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-slate-600 cursor-pointer transition-colors truncate">
                {doc.title}
              </div>
            ))}
          </div>
        </div>

        {/* VISOR CENTRAL (Desktop) */}
        <div className="hidden lg:flex lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full shadow-2xl relative flex-col">
          {/* Visor de PDF */}
          {selectedPDF && casoKeyPDF ? (
            <div className="flex flex-col h-full">
              {/* Header del PDF */}
              <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{tipoDocIcons[selectedPDF.tipo] || '📄'}</span>
                  <div>
                    <h3 className="text-sm font-medium text-white">{selectedPDF.titulo}</h3>
                    {selectedPDF.descripcion && (
                      <p className="text-[10px] text-slate-500">{selectedPDF.descripcion}</p>
                    )}
                  </div>
                </div>
                {selectedPDF.fecha && (
                  <span className="text-[10px] text-slate-500">{selectedPDF.fecha}</span>
                )}
              </div>
              {/* Visor PDF embebido con pdfjs */}
              <EmbeddedPDFViewer
                url={getPDFUrl(casoKeyPDF, selectedPDF.archivo)}
                title={selectedPDF.titulo}
                className="flex-1"
              />
            </div>
          ) : selectedDocKey && LEGAL_DOCS_MAP[selectedDocKey] ? (
            <TextReader content={LEGAL_DOCS_MAP[selectedDocKey]} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 bg-slate-900/20">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="mt-4">Selecciona un documento para lectura inmersiva</p>
              <p className="text-xs opacity-50 mt-2">Soporta PDFs y textos legales</p>
              {selectedDocKey && !LEGAL_DOCS_MAP[selectedDocKey] && (
                 <p className="text-xs text-rose-500 mt-2 bg-rose-900/20 px-2 py-1 rounded">
                   ⚠️ Error: No se encontró contenido para "{selectedDocKey}"
                 </p>
              )}
            </div>
          )}
        </div>

        {/* Mensaje móvil cuando no hay documento seleccionado */}
        <div className="lg:hidden text-center py-8 text-slate-500 text-sm">
          Pulsa en un documento para abrirlo a pantalla completa
        </div>
      </div>
    </>
  );
}

// ============================================
// 3. TAB ECONÓMICO (CON ACCESO A WAR ROOM)
// ============================================
function TabEconomico({ caseId, facts, caseData }: { caseId: string, facts: Fact[], caseData?: Case }) {
  const navigate = useNavigate();

  // Detectar tipo de caso para mostrar análisis específico
  const isQuart = caseId?.includes('quart') ||
                  caseData?.title?.toLowerCase().includes('quart') ||
                  caseData?.autosNumber?.includes('1428');

  const isPicassent = caseId?.includes('picassent') ||
                      caseData?.title?.toLowerCase().includes('picassent') ||
                      caseData?.autosNumber?.includes('715');

  // Para Quart, mostrar análisis financiero dedicado
  if (isQuart) {
    return <QuartFinancialAnalysis />;
  }

  // Para Picassent, mostrar timeline con hipoteca y pagos
  if (isPicassent) {
    return <PicassentTimeline />;
  }

  // Helper para sacar un importe estimado del texto si existe
  const extractAmount = (text: string) => {
    const match = text.match(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s?€/);
    return match ? match[0] : null;
  };

  return (
    <div className="space-y-3 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end mb-2">
         <Link to={`/facts/new?caseId=${caseId}`} className="text-xs bg-emerald-600/80 text-emerald-100 px-3 py-1.5 rounded hover:bg-emerald-500 transition-colors flex items-center gap-2">
            <span>+</span> Nuevo Hecho / Partida
         </Link>
      </div>

      {facts.length === 0 && (
          <div className="text-center py-8 border border-dashed border-slate-800 rounded text-slate-500">
              No hay hechos registrados para este caso.
          </div>
      )}

      {facts.map((fact) => {
        // Intentamos obtener el importe del título o narrative
        const amountDisplay = extractAmount(fact.title || '') || extractAmount(fact.narrative || '') || '--- €';

        return (
            <div
            key={fact.id}
            onClick={() => navigate(`/facts/${fact.id}`)}
            className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden group hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all cursor-pointer relative"
            >
            {/* Indicador de Click */}
            <div className="absolute top-4 right-4 text-slate-600 group-hover:text-blue-400 transition-colors">
                <ChevronRight size={20} />
            </div>

            <div className="p-4 pr-12">
                <div className="flex justify-between items-start">
                <div>
                    <div className="flex gap-2 items-center mb-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          fact.risk === 'alto' ? 'bg-rose-900/30 text-rose-400' :
                          fact.risk === 'bajo' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
                      }`}>
                      RIESGO {fact.risk?.toUpperCase() || 'N/A'}
                      </span>
                      {/* FASE 6: Indicador probatorio - Sin soporte */}
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/50">
                        Sin soporte
                      </span>
                    </div>
                    <h4 className="text-white font-medium text-lg group-hover:text-blue-200 transition-colors">
                    {fact.title}
                    </h4>
                </div>
                <div className="text-right mt-1 mr-6">
                    <div className="text-xl font-bold text-slate-200 tabular-nums">{amountDisplay}</div>
                    <div className="text-xs text-slate-500 font-mono">ESTIMADO</div>
                </div>
                </div>
            </div>

            {/* Preview Narrativa */}
            {fact.narrative && (
                <div className="px-4 pb-4 pt-0 text-sm text-slate-400 border-t border-slate-800/50 mt-2 pt-3 bg-slate-950/30">
                    <p className="line-clamp-2 text-xs">{fact.narrative}</p>
                </div>
            )}
            </div>
        );
      })}
    </div>
  );
}

function TabEstrategia({ strategies, caseId }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-white">Estrategias Activas</h3>
        <Link to={`/warroom/new?caseId=${caseId}`} className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded hover:bg-amber-500">+ Nueva</Link>
      </div>
      {strategies.map((s: Strategy, i: number) => (
        <div key={s.id} className="p-5 rounded-xl border border-slate-700 bg-slate-900">
          <div className="flex justify-between mb-3">
            <h4 className="font-bold text-white flex items-center gap-2"><span className="bg-slate-700 text-xs px-2 py-0.5 rounded">#{i+1}</span> Estrategia</h4>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 uppercase">{s.risk} Risk</span>
          </div>
          <p className="text-rose-400 text-sm mb-2">⚠️ <strong>Ataque:</strong> {s.attack}</p>
          <p className="text-emerald-400 text-sm">🛡️ <strong>Defensa:</strong> {s.rebuttal}</p>
        </div>
      ))}
      {strategies.length === 0 && <div className="text-center text-slate-500 py-10 border border-dashed border-slate-800 rounded">Sin estrategias definidas.</div>}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const docParam = searchParams.get('doc');
  // Modo lector: oculta botones de edición y acciones destructivas
  const isReadMode = searchParams.get('read') === '1';
  const [activeTab, setActiveTab] = useState(tabParam || 'resumen');
  const [initialDoc, setInitialDoc] = useState<string | null>(docParam);
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]); 

  useEffect(() => {
    if (!id) return;
    casesRepo.getById(id).then(c => c ? setCurrentCase(c) : navigate('/cases'));
    documentsRepo.getAll().then(all => setDocs(all.filter(d => d.caseId === id)));
    eventsRepo.getAll().then(all => setEvents(all.filter(e => e.caseId === id)));
    strategiesRepo.getAll().then(all => setStrategies(all.filter(s => s.caseId === id)));
    partidasRepo.getAll().then(all => setPartidas(all.filter(p => p.caseId === id)));
    // Cargar hechos reales
    factsRepo.getAll().then(all => setFacts(all.filter(f => f.caseId === id)));
  }, [id, navigate]);

  // Si cambia la URL (por ejemplo al volver de ver un documento), actualizar el tab
  useEffect(() => {
    if (tabParam) setActiveTab(tabParam);
    if (docParam) setInitialDoc(docParam);
  }, [tabParam, docParam]);

  if (!currentCase) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Cargando War Room...</div>;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 font-sans">
      {/* HEADER - Optimizado para móvil */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-0">
          <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Link to="/dashboard" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Dashboard</Link>
                <span className="text-slate-600">/</span>
                <Link to="/cases" className="text-xs text-slate-500 hover:text-white transition-colors">Casos</Link>
              </div>
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight truncate">{currentCase.title}</h1>
              <div className="flex gap-2 mt-2 items-center flex-wrap">
                <span className="text-[10px] sm:text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{currentCase.autosNumber}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${currentCase.status === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{currentCase.status}</span>
              </div>
            </div>
            {/* Acciones Globales - Ocultas en modo lector */}
            {!isReadMode && (
              <div className="flex gap-1 sm:gap-2 shrink-0">
                <button
                  onClick={() => {
                    if ('caches' in window) {
                      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))));
                    }
                    window.location.reload();
                  }}
                  title="Limpiar caché y recargar"
                  className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 rounded-lg border border-slate-700 transition-colors"
                >
                  <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <Link to={`/events/new?caseId=${id}`} className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 hidden sm:flex"><Calendar size={18} /></Link>
                <Link to={`/documents/new?caseId=${id}`} className="p-1.5 sm:p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-900/20"><Upload size={16} className="sm:w-[18px] sm:h-[18px]" /></Link>
              </div>
            )}
            {/* Badge modo lector */}
            {isReadMode && (
              <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/50 rounded-full text-xs font-medium text-violet-300">
                Modo lector
              </span>
            )}
          </div>

          {/* TABS - Scroll horizontal en móvil */}
          <div className="flex gap-3 sm:gap-6 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
            {[
              { id: 'resumen', label: '📊 Resumen', shortLabel: '📊' },
              { id: 'economico', label: '💰 Económico', shortLabel: '💰' },
              { id: 'estrategia', label: '♟️ Estrategia', shortLabel: '♟️' },
              { id: 'docs', label: '📂 Documentos', shortLabel: '📂' },
              { id: 'actuaciones', label: '📅 Actuaciones', shortLabel: '📅' },
            ].map(tab => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-2 sm:pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel} {tab.id === 'resumen' ? 'Resumen' : tab.id === 'economico' ? 'Eco.' : tab.id === 'estrategia' ? 'Estr.' : tab.id === 'docs' ? 'Docs' : 'Actu.'}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'resumen' && <TabResumen caseData={currentCase} strategies={strategies} events={events} facts={facts} partidas={partidas} documents={docs} navigate={navigate} setActiveTab={setActiveTab} isReadMode={isReadMode} />}
        {activeTab === 'economico' && <TabEconomico caseId={id!} facts={facts} caseData={currentCase} />}
        {activeTab === 'docs' && <TabDocs documents={docs} caseId={id} caseData={currentCase} initialDocKey={initialDoc} />}
        {activeTab === 'estrategia' && <TabEstrategia strategies={strategies} caseId={id} />}
        {activeTab === 'actuaciones' && (
          <div className="space-y-4">
            {/* Botón añadir nuevo evento */}
            <div className="flex justify-end">
              <Link
                to={`/events/new?caseId=${id}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Calendar size={16} />
                + Nuevo Evento
              </Link>
            </div>

            {/* Lista de eventos ordenados por fecha */}
            {[...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(e => {
              const eventDate = new Date(e.date);
              const isPast = eventDate < new Date();
              const isSoon = !isPast && (eventDate.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;

              return (
                <Link
                  key={e.id}
                  to={`/events/${e.id}/edit`}
                  className={`flex gap-4 p-4 rounded-lg border transition-all hover:scale-[1.01] cursor-pointer ${
                    isPast
                      ? 'bg-slate-900/30 border-slate-800 hover:border-slate-600'
                      : isSoon
                      ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60'
                      : 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60'
                  }`}
                >
                  <div className={`text-center min-w-[70px] pt-1 ${isPast ? 'opacity-60' : ''}`}>
                    <div className="text-xl font-bold text-slate-200">{eventDate.getDate()}</div>
                    <div className="text-xs text-slate-400 uppercase">
                      {eventDate.toLocaleString('es-ES', { month: 'short' })}
                    </div>
                    <div className="text-xs font-bold text-slate-500 mt-0.5">
                      {eventDate.getFullYear()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${isPast ? 'text-slate-400' : 'text-white'}`}>{e.title}</h4>
                      {!isPast && isSoon && (
                        <span className="text-[10px] bg-amber-500/30 text-amber-300 px-2 py-0.5 rounded uppercase">Próximo</span>
                      )}
                      {!isPast && !isSoon && (
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded uppercase">Programado</span>
                      )}
                      {isPast && (
                        <span className="text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded uppercase">Pasado</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">{e.description}</p>
                    <p className="text-xs text-slate-600 mt-2">Pulsa para editar</p>
                  </div>
                </Link>
              );
            })}

            {events.length === 0 && (
              <div className="text-center py-12 border border-dashed border-slate-700 rounded-lg">
                <Calendar size={40} className="mx-auto text-slate-600 mb-4" />
                <p className="text-slate-500 mb-4">No hay actuaciones registradas.</p>
                <Link
                  to={`/events/new?caseId=${id}`}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  <Calendar size={16} />
                  Crear primer evento
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
