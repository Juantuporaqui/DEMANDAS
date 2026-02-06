// ============================================
// CASE OPS - Case Detail Page (MASTER FINAL MERGED & REPAIRED)
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Scale,
  FileText,
  Calendar,
  Gavel,
  ChevronRight,
  Upload,
  ListChecks,
  RefreshCw,
  Eye,
  AlertTriangle,
  Landmark,
  Copy,
  Filter,
  Search,
  Fingerprint,
  Coins,
  ShieldX,
} from 'lucide-react';
import {
  casesRepo, documentsRepo, eventsRepo, factsRepo, partidasRepo, strategiesRepo
} from '../../db/repositories';
import { repairCaseLinks } from '../../db/repair'; // <--- NUEVO IMPORT (FIX: Reparación enlaces)
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
import { Modal } from '../../components';
// Timeline específico para Picassent
import { PicassentHechosReclamados, PicassentHipotecaResumen, PicassentTimeline } from './PicassentTimeline';
import CaseTimelineBase from './CaseTimelineBase';
import { MislataTimeline } from './MislataTimeline';
import { QuartTimeline } from './QuartTimeline';
import { TabAudienciaPreviaPicassent } from './tabs/TabAudienciaPreviaPicassent';
import { TabEscenarios } from './tabs/TabEscenarios';
import Badge from '../../ui/components/Badge';
import {
  estrategiaPicassent,
  type LineaEstrategica,
  type TipoEstrategia,
  type Prioridad,
  type Estado,
} from '../../data/estrategia/informeEstrategico';

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
  const isPicassent = caseData.id === 'CAS001' ||
                      caseData.id?.includes('picassent') ||
                      caseData.title?.toLowerCase().includes('picassent') ||
                      caseData.autosNumber?.includes('715') ||
                      caseData.court?.toLowerCase().includes('picassent');
  const isMislata = caseData.id?.includes('mislata') ||
                    caseData.title?.toLowerCase().includes('mislata') ||
                    caseData.autosNumber?.includes('1185');
  const isQuart = caseData.id?.includes('quart') ||
                  caseData.title?.toLowerCase().includes('quart') ||
                  caseData.autosNumber?.includes('1428');
  const caseSlug = isPicassent ? 'picassent' : isMislata ? 'mislata' : isQuart ? 'quart' : null;
  const docsBasePath = caseSlug ? `${import.meta.env.BASE_URL}docs/${caseSlug}/escritos` : null;

  const caseLabel = isPicassent ? 'PICASSENT' : isMislata ? 'MISLATA' : isQuart ? 'QUART' : 'CASO';
  const showAnalytic = !isPicassent && !isMislata && !isQuart;
  const opposingParty = caseData.opposingPartyName || caseData.opposingCounsel?.split('(')[1]?.replace(')', '');
  const opposingLawyer = caseData.opposingLawyerName || caseData.opposingCounsel?.split('(')[0]?.trim();
  const picassentSummary = {
    objeto: 'Pretensión: reclamación económica global (212.677,00 €) construida con partidas históricas.',
    defensa:
      'Defensa: prescripción por bloques temporales, falta de prueba de crédito exigible y, subsidiariamente, limitación estricta si se invoca la STS 458/2025 (sin extensión a gastos/inversiones y con motivación del dies a quo).',
  };

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
      <div className="card-base card-elevated border-l-2 status-activo p-5">
        <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Eye size={16} /> Resumen ejecutivo
          <Badge tone="muted">{caseLabel}</Badge>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 auto-rows-fr">
          {/* Parte contraria */}
          <div className="card-base card-subtle p-3 h-full">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Parte contraria</div>
            <div className="space-y-1.5">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-600">Demandante</div>
                <div className="text-xs font-medium text-rose-300">{opposingParty || '—'}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-600">Abogada</div>
                <div className="text-xs font-medium text-rose-200">{opposingLawyer || '—'}</div>
              </div>
            </div>
          </div>
          {/* Juzgado */}
          <div className="card-base card-subtle p-3 h-full">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Juzgado</div>
            <div className="text-sm font-medium text-slate-200">{caseData.court}</div>
          </div>
          {/* Autos */}
          <div className="card-base card-subtle p-3 h-full">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Autos</div>
            <div className="text-sm font-medium text-slate-200 font-mono">{caseData.autosNumber}</div>
          </div>
          {/* Rol */}
          <div className="card-base card-subtle p-3 h-full">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Rol procesal</div>
            <div className={`text-sm font-bold uppercase ${
              caseData.clientRole === 'demandante' || caseData.clientRole === 'ejecutante'
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}>{caseData.clientRole || 'No especificado'}</div>
          </div>
          {/* NIG */}
          {caseData.nig && (
            <div className="card-base card-subtle p-3 h-full">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">NIG</div>
              <div className="text-xs font-medium text-slate-300 font-mono">{caseData.nig}</div>
            </div>
          )}
          {/* Próximo hito */}
          {vistaEvent && (
            <div className="card-base card-subtle border border-amber-500/30 p-3 h-full">
              <div className="text-[10px] uppercase tracking-wider text-amber-500 mb-1">Próximo hito</div>
              <div className="text-sm font-medium text-amber-300">{formatDate(vistaEvent.date)}</div>
              <div className="text-[10px] text-slate-500">{vistaEvent.title}</div>
            </div>
          )}
          {/* Cuantía Procesal */}
          <div className="card-base card-subtle border border-rose-500/30 p-3 h-full">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Cuantía procesal (demanda)</div>
            <div className="text-lg font-bold text-rose-400">{formatCurrency(amounts.totalDemand)}</div>
          </div>
          {/* Nº Hechos */}
          <div className="card-base card-subtle p-3 h-full">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Nº hechos</div>
            <div className="text-lg font-bold text-slate-200">{hechosCount}</div>
            <div className="text-[10px] text-slate-500">{factsControvertidos} controvertidos</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 auto-rows-fr">
          {/* Sumatorio Analítico */}
          {showAnalytic && (
            <div className="card-base card-subtle p-3 h-full">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Sumatorio analítico (partidas)</div>
              <div className="text-lg font-bold text-emerald-400">{formatCurrency(amounts.analytic)}</div>
            </div>
          )}
          {/* Delta */}
          {showAnalytic && amounts.delta !== 0 && (
            <div className="card-base card-subtle border border-amber-500/50 p-3 h-full">
              <div className="text-[10px] uppercase tracking-wider text-amber-500 mb-1">Delta pendiente de justificar</div>
              <div className="text-lg font-bold text-amber-400">{formatCurrency(Math.abs(amounts.delta))}</div>
            </div>
          )}
          {/* Judge si existe */}
          {caseData.judge && caseData.judge !== '[Pendiente]' && (
            <div className="card-base card-subtle p-3 h-full">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Juez</div>
              <div className="text-sm font-medium text-slate-200">{caseData.judge}</div>
            </div>
          )}
        </div>
        {caseSlug && (
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`${docsBasePath}/demanda.html`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-emerald-400/40"
            >
              📄 Ver demanda
            </a>
            <a
              href={`${docsBasePath}/contestacion.html`}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-emerald-400/40"
            >
              🛡️ Ver contestación
            </a>
            {isQuart && (
              <a
                href={`${docsBasePath}/impugnacion.html`}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-emerald-400/40"
              >
                ⚔️ Ver impugnación
              </a>
            )}
          </div>
        )}
        {(caseData.notes || isPicassent) && !isReadMode && (
          <div className="mt-4 text-sm text-slate-400 leading-relaxed border-t border-slate-700/50 pt-3 space-y-2">
            {isPicassent ? (
              <>
                <p>{picassentSummary.objeto}</p>
                <p>{picassentSummary.defensa}</p>
              </>
            ) : (
              <p>{caseData.notes}</p>
            )}
          </div>
        )}
      </div>

      {/* TARJETAS PRINCIPALES ESTILO ANDROID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card Desglose de Hechos - TODOS LOS CASOS */}
        <button
          type="button"
          onClick={() => isPicassent ? navigate('/analytics/hechos') : setActiveTab('economico')}
          className="group card-base card-elevated p-5 text-left hover:border-emerald-500/30 hover:shadow-emerald-500/5 active:scale-[0.98]"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-emerald-500/20 border border-emerald-500/30 mb-3">
            <ListChecks className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Desglose de Hechos</h3>
          <p className="text-sm text-slate-400 mb-3">
            {facts.length} partidas con análisis detallado
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge tone="danger">{factsControvertidos} controvertidos</Badge>
            <Badge tone="warn">{factsAProbar} a probar</Badge>
          </div>
          <div className="flex items-center text-sm text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
            Ver desglose completo <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </button>

        {/* Card Audiencia Previa - SOLO PICASSENT */}
        {isPicassent && (
          <button
            type="button"
            onClick={() => (isPicassent ? setActiveTab('audiencia') : navigate('/analytics/audiencia'))}
            className="group relative card-base card-elevated p-5 text-left hover:border-amber-500/30 hover:shadow-amber-500/5 active:scale-[0.98]"
          >
            <div className="absolute top-4 right-4">
              <Badge tone="warn" className="gap-1">
                <AlertTriangle className="w-3 h-3" /> Urgente
              </Badge>
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-amber-500/20 border border-amber-500/30 mb-3">
              <Gavel className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Audiencia Previa</h3>
            <p className="text-sm text-slate-400 mb-3">
              Alegaciones y hechos controvertidos
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge tone="muted">12 Alegaciones</Badge>
              <Badge tone="muted">18 Hechos</Badge>
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
            className="group relative card-base card-elevated p-5 text-left hover:border-violet-500/30 hover:shadow-violet-500/5 active:scale-[0.98]"
          >
            <div className="absolute top-4 right-4">
              {diasHastaVista !== null && diasHastaVista <= 30 && diasHastaVista > 0 && (
                <Badge tone="info">{diasHastaVista}d</Badge>
              )}
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-[var(--radius-md)] bg-violet-500/20 border border-violet-500/30 mb-3">
              <Scale className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Vista / Juicio</h3>
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
            className="group card-base card-subtle border-dashed border-slate-600 p-5 text-left hover:border-violet-500/50 hover:bg-violet-500/5 active:scale-[0.98]"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="card-base card-subtle p-3 sm:p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Cuantía procesal (demanda)</div>
          <div className="text-2xl font-semibold text-rose-400 mt-1">
            {formatCurrency(amounts.totalDemand)}
          </div>
          <div className="text-[10px] text-slate-600">{partidas.length} partidas</div>
          {showAnalytic && amounts.delta !== 0 && (
            <div className="text-[10px] text-amber-400 mt-1">Delta pendiente de justificar</div>
          )}
        </div>
        <div className="card-base card-subtle p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Hechos</div>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">{facts.length}</div>
          <div className="text-[10px] text-slate-600">{factsControvertidos} controvertidos</div>
        </div>
        <div className="card-base card-subtle p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Eventos</div>
          <div className="text-2xl font-semibold text-amber-400 mt-1">{events.length}</div>
          <div className="text-[10px] text-slate-600">{events.filter((e: Event) => new Date(e.date) > new Date()).length} próximos</div>
        </div>
        <div className="card-base card-subtle p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Estrategias</div>
          <div className="text-2xl font-semibold text-blue-400 mt-1">{strategies.length}</div>
          <div className="text-[10px] text-slate-600">líneas de defensa</div>
        </div>
      </div>

      {isPicassent && <PicassentHechosReclamados />}

      {/* ESTRATEGIAS DEL CASO */}
      {strategies.length > 0 && (
        <div className="card-base card-elevated p-4 sm:p-5">
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
                  <Badge tone={s.risk === 'Alto' ? 'danger' : s.risk === 'Medio' ? 'warn' : 'ok'}>
                    {s.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          {strategies.length > 3 && (
            <button
              onClick={() => setActiveTab('estrategia')}
              className="w-full mt-3 text-xs text-amber-300 font-medium py-2.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
            >
              Ver todas las estrategias →
            </button>
          )}
        </div>
      )}

      {/* ACCESO RÁPIDO A DOCUMENTOS */}
      <div className="card-base card-subtle p-4">
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
        <div className="card-base card-elevated status-activo border-l-2 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
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
function TabDocs({ documents, caseId, caseData }: any) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedDocKey = searchParams.get('doc');

  // Detección robusta: ID del caso, Título o Número de Autos
  const isPicassent = caseId?.includes('picassent') ||
                      caseData.title?.toLowerCase().includes('picassent') ||
                      caseData.autosNumber?.includes('715');

  const isMislata = caseData.title?.toLowerCase().includes('mislata') ||
                    caseData.autosNumber?.includes('1185');

  const isQuart = caseData.title?.toLowerCase().includes('quart') ||
                  caseData.autosNumber?.includes('1428');

  const caseLabel = isPicassent ? 'PICASSENT' : isMislata ? 'MISLATA' : isQuart ? 'QUART' : 'CASO';

  // Obtener PDFs del caso actual
  const casoKeyPDF = isPicassent ? 'picassent' : isMislata ? 'mislata' : isQuart ? 'quart' : null;
  const pdfDocuments = casoKeyPDF ? getPDFsByCaso(casoKeyPDF) : [];
  const autoDocs = casoKeyPDF ? AUTO_DOCS[casoKeyPDF] : [];

  const manualDocItems = [
    ...(isPicassent
      ? [
          { id: 'demanda-picassent', label: 'Demanda Contraria', icon: '📜', color: 'amber' },
          { id: 'contestacion-picassent', label: 'Contestación', icon: '🛡️', color: 'emerald' },
        ]
      : []),
    ...(isMislata
      ? [
          { id: 'demanda-mislata', label: 'Nuestra Demanda', icon: '📄', color: 'emerald' },
          { id: 'contestacion-mislata', label: 'Contestación Vicenta', icon: '🚨', color: 'rose' },
          { id: 'argumentos-mislata', label: 'Argumentos Clave', icon: '⚔️', color: 'blue' },
          { id: 'frases-vista-mislata', label: 'Frases Vista', icon: '🎯', color: 'violet' },
        ]
      : []),
    ...(isQuart
      ? [
          { id: 'sentencia-divorcio-quart', label: 'Sentencia Divorcio 362/2023', icon: '⚖️', color: 'blue' },
          { id: 'demanda-ejecucion-quart', label: 'Demanda Ejecución (Vicenta)', icon: '📜', color: 'amber' },
          { id: 'oposicion-quart', label: 'Nuestra Oposición', icon: '🛡️', color: 'emerald' },
          { id: 'impugnacion-quart', label: 'Impugnación (Vicenta)', icon: '🚨', color: 'rose' },
          { id: 'argumentos-quart', label: 'Argumentos y Riesgos', icon: '⚔️', color: 'violet' },
        ]
      : []),
  ];

  const docTitleMap = new Map<string, string>([
    ...manualDocItems.map((doc) => [doc.id, doc.label]),
    ...autoDocs.map((doc) => [doc.id, doc.title]),
    ...pdfDocuments.map((doc) => [doc.id, doc.titulo]),
  ]);

  const selectedPDF = selectedDocKey ? pdfDocuments.find((pdf) => pdf.id === selectedDocKey) : null;
  const selectedContent = selectedDocKey ? LEGAL_DOCS_MAP[selectedDocKey] : null;
  const selectedTitle = selectedDocKey ? docTitleMap.get(selectedDocKey) : null;

  const handleSelectDoc = (docKey: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', 'documentos');
    nextParams.set('doc', docKey);
    setSearchParams(nextParams);
  };

  const handleBackToGrid = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', 'documentos');
    nextParams.delete('doc');
    setSearchParams(nextParams);
  };

  const DocGridButton = ({
    docKey,
    icon,
    label,
    color,
    meta,
  }: {
    docKey: string;
    icon: string;
    label: string;
    color: 'amber' | 'emerald' | 'rose' | 'blue' | 'violet' | 'cyan' | 'slate';
    meta?: string;
  }) => {
    const colorClasses: Record<string, string> = {
      amber: 'border-amber-500/30 hover:border-amber-500/60 text-amber-100',
      emerald: 'border-emerald-500/30 hover:border-emerald-500/60 text-emerald-100',
      rose: 'border-rose-500/30 hover:border-rose-500/60 text-rose-100',
      blue: 'border-blue-500/30 hover:border-blue-500/60 text-blue-100',
      violet: 'border-violet-500/30 hover:border-violet-500/60 text-violet-100',
      cyan: 'border-cyan-500/30 hover:border-cyan-500/60 text-cyan-100',
      slate: 'border-slate-600/40 hover:border-slate-500/60 text-slate-100',
    };

    return (
      <button
        onClick={() => handleSelectDoc(docKey)}
        className={`group w-full aspect-square rounded-2xl border bg-slate-900/40 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-slate-900/70 ${colorClasses[color]}`}
      >
        <div className="flex flex-col justify-between h-full">
          <div className="text-2xl">{icon}</div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-white leading-snug line-clamp-2">{label}</div>
            {meta && <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{meta}</div>}
          </div>
        </div>
      </button>
    );
  };

  if (selectedDocKey) {
    return (
      <div className="space-y-4">
        <button
          onClick={handleBackToGrid}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        >
          <ChevronRight className="rotate-180" size={18} />
          Volver a documentos
        </button>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden min-h-[60vh]">
          {selectedPDF && casoKeyPDF ? (
            <div className="flex flex-col h-[70vh]">
              <div className="flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{tipoDocIcons[selectedPDF.tipo] || '📄'}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white truncate">{selectedPDF.titulo}</h3>
                    {selectedPDF.descripcion && (
                      <p className="text-[10px] text-slate-500 line-clamp-1">{selectedPDF.descripcion}</p>
                    )}
                  </div>
                </div>
                {selectedPDF.fecha && (
                  <span className="text-[10px] text-slate-500">{selectedPDF.fecha}</span>
                )}
              </div>
              <EmbeddedPDFViewer
                url={getPDFUrl(casoKeyPDF, selectedPDF.archivo)}
                title={selectedPDF.titulo}
                className="flex-1"
              />
            </div>
          ) : selectedContent ? (
            <TextReader content={selectedContent} />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
              <FileText size={48} className="mb-4 opacity-20" />
              <p className="text-sm">No se encontró contenido para este documento.</p>
              {selectedTitle && <p className="text-xs text-slate-600 mt-2">{selectedTitle}</p>}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white">Documentos</h3>
            <span className="text-[10px] font-bold tracking-widest bg-slate-800/60 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
              {caseLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500">Selecciona un documento para abrir el visor</p>
        </div>
        <Link
          to={`/documents/new?caseId=${caseId}`}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-lg shadow-blue-900/20 hover:bg-blue-500"
        >
          <Upload size={14} /> Subir nuevo
        </Link>
      </div>

      {manualDocItems.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
            <Scale size={12} /> Autos y escritos
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {manualDocItems.map((doc) => (
              <DocGridButton key={doc.id} docKey={doc.id} icon={doc.icon} label={doc.label} color={doc.color} />
            ))}
          </div>
        </div>
      )}

      {autoDocs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
            <FileText size={12} /> Documentos subidos ({autoDocs.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {autoDocs.map((doc: AutoDocument) => (
              <DocGridButton
                key={doc.id}
                docKey={doc.id}
                icon={doc.extension === 'html' ? '🌐' : '📄'}
                label={doc.title}
                meta={doc.extension.toUpperCase()}
                color="cyan"
              />
            ))}
          </div>
        </div>
      )}

      {pdfDocuments.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
            <FileText size={12} /> PDFs del expediente ({pdfDocuments.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {pdfDocuments.map((pdf) => (
              <DocGridButton
                key={pdf.id}
                docKey={pdf.id}
                icon={tipoDocIcons[pdf.tipo] || '📄'}
                label={pdf.titulo}
                meta={pdf.fecha || pdf.tipo.toUpperCase()}
                color={(tipoDocColors[pdf.tipo] || 'slate') as 'amber' | 'emerald' | 'rose' | 'blue' | 'violet' | 'cyan' | 'slate'}
              />
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2">
            <Upload size={12} /> Archivo digital ({documents.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {documents.map((doc: Document) => (
              <div
                key={doc.id}
                className="w-full aspect-square rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 text-left text-slate-300"
              >
                <div className="flex flex-col justify-between h-full">
                  <div className="text-xl">📎</div>
                  <div>
                    <div className="text-xs font-semibold text-white line-clamp-2">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 mt-1">Adjunto</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {manualDocItems.length === 0 && autoDocs.length === 0 && pdfDocuments.length === 0 && documents.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-8 text-center text-slate-500">
          No hay documentos disponibles para este caso.
        </div>
      )}
    </div>
  );
}

// ============================================
// 3. TAB ECONÓMICO (CON ACCESO A WAR ROOM)
// ============================================
function TabEconomico({ caseId, facts, caseData }: { caseId: string, facts: Fact[], caseData?: Case }) {
  const navigate = useNavigate();
  const [caseFacts, setCaseFacts] = useState<Record<'picassent' | 'mislata' | 'quart', Fact[]>>({
    picassent: [],
    mislata: [],
    quart: [],
  });

  useEffect(() => {
    let isActive = true;
    const loadFacts = async () => {
      const [allCases, allFacts] = await Promise.all([casesRepo.getAll(), factsRepo.getAll()]);
      const findCaseId = (matcher: (c: Case) => boolean) => allCases.find(matcher)?.id;
      const picassentId = findCaseId(
        (c) => c.id?.includes('picassent') || c.title?.toLowerCase().includes('picassent') || c.autosNumber?.includes('715'),
      );
      const mislataId = findCaseId(
        (c) => c.id?.includes('mislata') || c.title?.toLowerCase().includes('mislata') || c.autosNumber?.includes('1185'),
      );
      const quartId = findCaseId(
        (c) => c.id?.includes('quart') || c.title?.toLowerCase().includes('quart') || c.autosNumber?.includes('1428'),
      );

      if (isActive) {
        setCaseFacts({
          picassent: picassentId ? allFacts.filter((fact) => fact.caseId === picassentId) : [],
          mislata: mislataId ? allFacts.filter((fact) => fact.caseId === mislataId) : [],
          quart: quartId ? allFacts.filter((fact) => fact.caseId === quartId) : [],
        });
      }
    };

    loadFacts().catch(() => {
      if (isActive) {
        setCaseFacts({
          picassent: [],
          mislata: [],
          quart: [],
        });
      }
    });

    return () => {
      isActive = false;
    };
  }, [caseId]);

  const isQuart = caseId?.includes('quart') ||
                  caseData?.title?.toLowerCase().includes('quart') ||
                  caseData?.autosNumber?.includes('1428');

  if (isQuart) {
    return <QuartFinancialAnalysis />;
  }

  const extractAmount = (text: string) => {
    const match = text.match(/(\d{1,3}(?:\.\d{3})*(?:,\d+)?)\s?€/);
    return match ? match[0] : null;
  };

  const columns: Array<{ key: 'picassent' | 'mislata' | 'quart'; title: string; items: Fact[] }> = [
    { key: 'picassent', title: 'Picassent', items: caseFacts.picassent },
    { key: 'mislata', title: 'Mislata', items: caseFacts.mislata },
    { key: 'quart', title: 'Quart', items: caseFacts.quart },
  ];

  const fallbackEmpty =
    caseFacts.picassent.length === 0 &&
    caseFacts.mislata.length === 0 &&
    caseFacts.quart.length === 0 &&
    facts.length === 0;

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Reclamaciones económicas por caso</h3>
          <span className="text-[10px] font-bold tracking-widest bg-slate-800/60 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
            CENTRO
          </span>
        </div>
        <Link to={`/facts/new?caseId=${caseId}`} className="text-xs bg-emerald-600/80 text-emerald-100 px-3 py-1.5 rounded hover:bg-emerald-500 transition-colors flex items-center gap-2">
          <span>+</span> Nueva reclamación
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.key}
            className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-b from-slate-900/90 to-slate-950/80 p-4 shadow-lg shadow-slate-950/40"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400/70 via-cyan-400/70 to-blue-400/70" />
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-200">{column.title}</h4>
              <span className="rounded-full border border-slate-600/70 bg-slate-800/70 px-2 py-0.5 text-[10px] text-slate-300">{column.items.length} partidas</span>
            </div>
            <div className="space-y-2">
              {column.items.map((fact) => {
                const amountDisplay = extractAmount(fact.title || '') || extractAmount(fact.narrative || '');
                return (
                  <button
                    key={fact.id}
                    onClick={() => navigate(`/facts/${fact.id}`)}
                    aria-label={amountDisplay ? `${fact.title} (${amountDisplay})` : fact.title}
                    className="group w-full rounded-xl border border-slate-700/70 bg-slate-800/45 px-3 py-2.5 text-left text-xs font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-slate-800/80"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="line-clamp-2 text-slate-100 group-hover:text-white">{fact.title}</span>
                      {amountDisplay && <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-300">{amountDisplay}</span>}
                    </div>
                  </button>
                );
              })}
              {column.items.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-600/70 bg-slate-800/30 p-3 text-[11px] text-slate-400">
                  Sin reclamaciones económicas aún.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {fallbackEmpty && (
        <div className="text-center py-8 border border-dashed border-slate-800 rounded text-slate-500">
          No hay reclamaciones económicas registradas.
        </div>
      )}
    </div>
  );
}

function TabEstrategia({ strategies, caseId }: any) {
  const isPicassent = caseId?.includes('picassent') || caseId === 'CAS001';
  const caseLabel = isPicassent
    ? 'PICASSENT'
    : caseId?.includes('mislata')
    ? 'MISLATA'
    : caseId?.includes('quart')
    ? 'QUART'
    : 'CASO';
  const returnTo = `/cases/${caseId}?tab=estrategia`;
  const [tipoFilter, setTipoFilter] = useState<'todas' | TipoEstrategia>('todas');
  const [prioridadFilter, setPrioridadFilter] = useState<'todas' | Prioridad>('todas');
  const [estadoFilter, setEstadoFilter] = useState<'todas' | Estado>('todas');
  const [lineaSearch, setLineaSearch] = useState('');
  const [selectedLinea, setSelectedLinea] = useState<LineaEstrategica | null>(null);

  const normalizedStrategies = Array.isArray(strategies) ? strategies : [];

  const filteredLineas = estrategiaPicassent.filter((linea) => {
    const query = lineaSearch.trim().toLowerCase();
    const searchBlob = [
      linea.titulo,
      linea.descripcion,
      linea.fundamento,
      ...(linea.frasesClave || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const tipoOk = tipoFilter === 'todas' || linea.tipo === tipoFilter;
    const prioridadOk = prioridadFilter === 'todas' || linea.prioridad === prioridadFilter;
    const estadoOk = estadoFilter === 'todas' || linea.estado === estadoFilter;
    const searchOk = !query || searchBlob.includes(query);
    return tipoOk && prioridadOk && estadoOk && searchOk;
  });

  const handleCopyPhrase = async (phrase: string) => {
    try {
      await navigator.clipboard.writeText(phrase);
    } catch {
      // no-op
    }
  };

  const handleCopyLinea = async (linea: LineaEstrategica) => {
    const payload = [
      `Título: ${linea.titulo}`,
      `Tipo: ${linea.tipo}`,
      `Prioridad: ${linea.prioridad}`,
      `Estado: ${linea.estado}`,
      `Descripción: ${linea.descripcion}`,
      `Fundamento: ${linea.fundamento}`,
      linea.articulosRelacionados.length > 0
        ? `Artículos relacionados: ${linea.articulosRelacionados.join(', ')}`
        : null,
      linea.documentosSoporte.length > 0
        ? `Documentos soporte: ${linea.documentosSoporte.join(', ')}`
        : null,
      linea.frasesClave.length > 0 ? `Frases clave:\n${linea.frasesClave.join('\n')}` : null,
      linea.riesgos ? `Riesgos: ${linea.riesgos}` : null,
      linea.notasInternas ? `Notas internas: ${linea.notasInternas}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await navigator.clipboard.writeText(payload);
    } catch {
      // no-op
    }
  };

  const prioridadStyles: Record<Prioridad, string> = {
    critica: 'bg-rose-500/20 text-rose-200 border-rose-500/30',
    alta: 'bg-amber-500/20 text-amber-200 border-amber-500/30',
    media: 'bg-sky-500/20 text-sky-200 border-sky-500/30',
    baja: 'bg-slate-500/20 text-slate-200 border-slate-500/30',
  };

  return (
    <div className="space-y-6">
      {/* Microcopy: Qué va dónde */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Qué va dónde</h4>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
            <div className="text-xs font-bold text-emerald-300 mb-1">Estrategia (Matriz)</div>
            <p className="text-xs text-slate-300">Líneas maestras, riesgos, escenarios y analíticas clave. Estás aquí.</p>
          </div>
          {isPicassent ? (
            <Link
              to={`/cases/${caseId}?tab=audiencia`}
              className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 transition hover:border-amber-400/60"
            >
              <div className="text-xs font-bold text-amber-300 mb-1">Sala (AP)</div>
              <p className="text-xs text-slate-300">Guiones, checklist, hechos controvertidos y prueba.</p>
            </Link>
          ) : (
            <div className="rounded-xl border border-slate-700/30 bg-slate-800/20 p-3 opacity-50 cursor-not-allowed">
              <div className="text-xs font-bold text-slate-500 mb-1">Sala (AP)</div>
              <p className="text-xs text-slate-500">Disponible solo en Picassent.</p>
            </div>
          )}
          <Link
            to={`/warroom?caseId=${isPicassent ? 'picassent' : caseId?.includes('mislata') ? 'mislata' : 'quart'}`}
            className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 transition hover:border-rose-400/60"
          >
            <div className="text-xs font-bold text-rose-300 mb-1">War Room</div>
            <p className="text-xs text-slate-300">Tarjetas rápidas editables (ataque/respuesta).</p>
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white">Matriz estratégica</h3>
          <span className="text-[10px] font-bold tracking-widest bg-slate-800/60 text-slate-200 px-2 py-0.5 rounded border border-slate-700">
            {caseLabel}
          </span>
        </div>
      </div>

      {isPicassent && (
        <>
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4 print-surface">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Analíticas (trabajo previo)</h4>
                <p className="text-xs text-slate-400">Líneas de defensa estructurales y herramientas de análisis.</p>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Link
                to={`/analytics/prescripcion?caseId=picassent&returnTo=${encodeURIComponent(returnTo)}`}
                className="group block w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/20 to-slate-900/60 p-5 text-left transition-all hover:border-emerald-500/60 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 mb-3">
                  <Scale className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">Prescripción</h4>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/60">
                    4 escenarios
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Mapa de escenarios + checklist probatorio.
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    STS 458/2025
                  </span>
                </div>
                <div className="flex items-center text-sm text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">
                  Abrir prescripción <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              <Link
                to={`/cases/${caseId}/estrategias/excepcion-acumulacion?returnTo=${encodeURIComponent(returnTo)}`}
                className="group block w-full rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-900/20 to-slate-900/60 p-5 text-left transition-all hover:border-sky-500/60 hover:shadow-lg hover:shadow-sky-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/30 mb-3">
                  <AlertTriangle className="w-6 h-6 text-sky-300" />
                </div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">Excepción procesal</h4>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/60">
                    Saneamiento
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Acumulación indebida y saneamiento del objeto.
                </p>
                <div className="flex items-center text-sm text-sky-300 font-medium group-hover:translate-x-1 transition-transform">
                  Abrir excepción <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              <Link
                to={`/analytics/pasivo-preferente?caseId=${caseId}&returnTo=${encodeURIComponent(returnTo)}`}
                className="group block w-full rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-900/20 to-slate-900/60 p-5 text-left transition-all hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/30 mb-3">
                  <Landmark className="w-6 h-6 text-indigo-300" />
                </div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">Pasivo preferente (Hipoteca)</h4>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/60">
                    Bases de liquidación
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Forzar que parte del precio de venta se destine a cancelar la hipoteca, evitando reparto "limpio" del activo.
                </p>
                <div className="flex items-center text-sm text-indigo-300 font-medium group-hover:translate-x-1 transition-transform">
                  Abrir pasivo preferente <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              <Link
                to={`/analytics/prueba-digital?caseId=${caseId}&returnTo=${encodeURIComponent(returnTo)}`}
                className="group block w-full rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-900/20 to-slate-900/60 p-5 text-left transition-all hover:border-teal-500/60 hover:shadow-lg hover:shadow-teal-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-500/20 border border-teal-500/30 mb-3">
                  <Fingerprint className="w-6 h-6 text-teal-300" />
                </div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">Prueba digital</h4>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/60">
                    Checklist
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Impugnación de integridad y checklist mínimo.
                </p>
                <div className="flex items-center text-sm text-teal-300 font-medium group-hover:translate-x-1 transition-transform">
                  Abrir prueba digital <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              <Link
                to={`/analytics/inversion-mercantil?caseId=${caseId}&returnTo=${encodeURIComponent(returnTo)}`}
                className="group block w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-900/20 to-slate-900/60 p-5 text-left transition-all hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 mb-3">
                  <Coins className="w-6 h-6 text-amber-300" />
                </div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">Inversión mercantil + compensación</h4>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/60">
                    Neteo
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Separar inversión de cargas familiares y activar compensación de frutos.
                </p>
                <div className="flex items-center text-sm text-amber-300 font-medium group-hover:translate-x-1 transition-transform">
                  Abrir inversión mercantil <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
              <Link
                to={`/analytics/anti-sts-458-2025?caseId=${caseId}&returnTo=${encodeURIComponent(returnTo)}`}
                className="group block w-full rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-900/20 to-slate-900/60 p-5 text-left transition-all hover:border-rose-500/60 hover:shadow-lg hover:shadow-rose-500/10 active:scale-[0.99]"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/30 mb-3">
                  <ShieldX className="w-6 h-6 text-rose-300" />
                </div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white">Anti-STS 458/2025</h4>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-slate-700/60 text-slate-200 border border-slate-600/60">
                    Distinguishing
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  Limitar alcance por diferencias fácticas y exigibilidad por partidas.
                </p>
                <div className="flex items-center text-sm text-rose-300 font-medium group-hover:translate-x-1 transition-transform">
                  Abrir anti-STS <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Matriz estratégica (Picassent)</h4>
                <p className="text-xs text-slate-400">Líneas de defensa, ataques, réplicas y preguntas.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <Filter className="h-3.5 w-3.5" />
                <span>Filtros</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  value={lineaSearch}
                  onChange={(event) => setLineaSearch(event.target.value)}
                  placeholder="Buscar título, descripción, fundamento, frases..."
                  className="w-72 max-w-full rounded-xl border border-slate-700/60 bg-slate-900/80 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500"
                />
              </div>
              <select
                value={tipoFilter}
                onChange={(event) => setTipoFilter(event.target.value as 'todas' | TipoEstrategia)}
                className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-xs text-slate-200"
              >
                <option value="todas">Tipo: todas</option>
                <option value="defensa">Defensa</option>
                <option value="ataque">Ataque</option>
                <option value="replica">Réplica</option>
                <option value="pregunta">Pregunta</option>
              </select>
              <select
                value={prioridadFilter}
                onChange={(event) => setPrioridadFilter(event.target.value as 'todas' | Prioridad)}
                className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-xs text-slate-200"
              >
                <option value="todas">Prioridad: todas</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
              <select
                value={estadoFilter}
                onChange={(event) => setEstadoFilter(event.target.value as 'todas' | Estado)}
                className="rounded-xl border border-slate-700/60 bg-slate-900/80 px-3 py-2 text-xs text-slate-200"
              >
                <option value="todas">Estado: todas</option>
                <option value="pendiente">Pendiente</option>
                <option value="preparado">Preparado</option>
                <option value="usado">Usado</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>
            <div className="space-y-3">
              {filteredLineas.map((linea) => (
                <button
                  key={linea.id}
                  type="button"
                  onClick={() => setSelectedLinea(linea)}
                  className="w-full rounded-2xl border border-slate-800/60 bg-slate-950/30 p-4 text-left transition hover:border-emerald-500/40 hover:bg-slate-900/60 print-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h5 className="text-sm font-semibold text-white">{linea.titulo}</h5>
                    <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-wide">
                      <span className="rounded-full border border-slate-600/60 bg-slate-800/60 px-2 py-0.5 text-slate-200">
                        {linea.tipo}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 ${prioridadStyles[linea.prioridad]}`}>
                        {linea.prioridad}
                      </span>
                      <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-indigo-200">
                        {linea.estado}
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 line-clamp-2">{linea.descripcion}</p>
                  {linea.articulosRelacionados.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {linea.articulosRelacionados.map((art) => (
                        <span
                          key={art}
                          className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200"
                        >
                          {art}
                        </span>
                      ))}
                    </div>
                  )}
                  {linea.documentosSoporte.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {linea.documentosSoporte.map((doc) => (
                        <span
                          key={doc}
                          className="rounded-full border border-slate-600/40 bg-slate-800/40 px-2 py-0.5 text-[10px] font-semibold text-slate-200"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  )}
                </button>
              ))}
              {filteredLineas.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-6 text-center text-xs text-slate-500">
                  Sin estrategias con los filtros seleccionados.
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Tarjetas de sala (War Room) — bloque minimal */}
      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-semibold text-white">Tarjetas de sala (War Room)</h4>
            <p className="text-xs text-slate-400">Tarjetas tácticas de sala. Se editan en War Room. ({normalizedStrategies.length} vinculadas)</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/warroom?caseId=${isPicassent ? 'picassent' : caseId?.includes('mislata') ? 'mislata' : 'quart'}`}
              className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:border-rose-400/60 hover:bg-rose-500/20"
            >
              Abrir War Room
            </Link>
            <Link
              to={`/warroom/new?caseId=${caseId}&returnTo=${encodeURIComponent(`/cases/${caseId}?tab=estrategia`)}&caseKey=${isPicassent ? 'picassent' : caseId?.includes('mislata') ? 'mislata' : 'quart'}`}
              className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-200 transition hover:border-amber-400/60 hover:bg-amber-500/20"
            >
              + Nueva tarjeta
            </Link>
          </div>
        </div>
        {normalizedStrategies.length > 0 ? (
          <div className="space-y-2">
            {normalizedStrategies.slice(0, 3).map((s: Strategy) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-800/60 bg-slate-950/30 px-4 py-3 text-sm text-slate-300"
              >
                {s.attack}
              </div>
            ))}
            {normalizedStrategies.length > 3 && (
              <p className="text-xs text-slate-500 pl-1">
                + {normalizedStrategies.length - 3} tarjetas más en War Room
              </p>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-500 py-6 border border-dashed border-slate-800 rounded-xl text-xs">
            Sin tarjetas de sala para este caso.
          </div>
        )}
      </div>

      {/* Modal detalle línea estratégica */}
      <Modal
        isOpen={Boolean(selectedLinea)}
        onClose={() => setSelectedLinea(null)}
        title={selectedLinea ? `Detalle estrategia · ${selectedLinea.titulo}` : 'Detalle estrategia'}
        footer={
          selectedLinea ? (
            <button
              type="button"
              onClick={() => handleCopyLinea(selectedLinea)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-200 hover:border-emerald-400/80"
            >
              <Copy className="h-3.5 w-3.5" /> Copiar todo
            </button>
          ) : null
        }
      >
        {selectedLinea && (
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Descripción</div>
              <p className="mt-2">{selectedLinea.descripcion}</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-indigo-300">Fundamento</div>
              <p className="mt-2">{selectedLinea.fundamento}</p>
            </div>
            {selectedLinea.articulosRelacionados.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-cyan-300">Artículos relacionados</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedLinea.articulosRelacionados.map((art) => (
                    <span
                      key={art}
                      className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-200"
                    >
                      {art}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedLinea.documentosSoporte.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-200">Documentos soporte</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedLinea.documentosSoporte.map((doc) => (
                    <span
                      key={doc}
                      className="rounded-full border border-slate-600/40 bg-slate-800/40 px-2 py-0.5 text-[10px] font-semibold text-slate-200"
                    >
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedLinea.frasesClave.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">Frases clave</div>
                <div className="mt-3 space-y-2">
                  {selectedLinea.frasesClave.map((frase) => (
                    <div
                      key={frase}
                      className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 flex items-start justify-between gap-3"
                    >
                      <span className="text-amber-100 text-sm italic">"{frase}"</span>
                      <button
                        type="button"
                        onClick={() => handleCopyPhrase(frase)}
                        className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 px-2 py-1 text-[10px] font-semibold text-amber-200 hover:border-amber-400/70"
                      >
                        <Copy className="h-3 w-3" /> Copiar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedLinea.riesgos && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-rose-300">Riesgos</div>
                <p className="mt-2">{selectedLinea.riesgos}</p>
              </div>
            )}
            {selectedLinea.notasInternas && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Notas internas</div>
                <p className="mt-2">{selectedLinea.notasInternas}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL (FIXED WITH AUTO-REPAIR)
// ============================================
export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  // Modo lector: oculta botones de edición y acciones destructivas
  const isReadMode = searchParams.get('read') === '1';
  const resolvedTabParam = tabParam === 'documentos' ? 'docs' : tabParam === 'actuaciones' ? 'cronologia' : tabParam;
  const [activeTab, setActiveTab] = useState(resolvedTabParam || 'resumen');
  const [cronologiaView, setCronologiaView] = useState<'cronologia' | 'actuaciones'>(
    tabParam === 'actuaciones' ? 'actuaciones' : 'cronologia'
  );
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]); 

  // FIX: UseEffect con auto-reparación integrada
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        // 1. Intentar reparar enlaces rotos por duplicados (Integridad de datos)
        try {
          const result = await repairCaseLinks(id);
          if (result.repaired) {
            console.log('Case links repaired:', result.movedCounts);
          }
        } catch (repairError) {
          console.warn('Auto-repair skipped due to error:', repairError);
        }

        // 2. Carga normal de datos
        const c = await casesRepo.getById(id);
        if (c) {
          setCurrentCase(c);
          
          // Cargar entidades relacionadas en paralelo para mayor velocidad
          const [allDocs, allEvents, allStrategies, allPartidas, allFacts] = await Promise.all([
            documentsRepo.getAll(),
            eventsRepo.getAll(),
            strategiesRepo.getAll(),
            partidasRepo.getAll(),
            factsRepo.getAll()
          ]);

          setDocs(allDocs.filter(d => d.caseId === id));
          setEvents(allEvents.filter(e => e.caseId === id));
          setStrategies(allStrategies.filter(s => s.caseId === id));
          setPartidas(allPartidas.filter(p => p.caseId === id));
          setFacts(allFacts.filter(f => f.caseId === id));
          
        } else {
            navigate('/cases');
        }
      } catch (error) {
        console.error('Error loading case details:', error);
      }
    })();
  }, [id, navigate]);

  // Si cambia la URL (por ejemplo al volver de ver un documento), actualizar el tab
  useEffect(() => {
    if (!tabParam) return;
    if (tabParam === 'actuaciones') {
      setActiveTab('cronologia');
      setCronologiaView('actuaciones');
      return;
    }
    if (resolvedTabParam) {
      setActiveTab(resolvedTabParam);
      if (resolvedTabParam === 'cronologia') {
        setCronologiaView('cronologia');
      }
    }
  }, [tabParam, resolvedTabParam]);

  const handleTabChange = (tabId: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (tabId === 'docs') {
      nextParams.set('tab', 'documentos');
    } else {
      nextParams.set('tab', tabId);
    }
    nextParams.delete('doc');
    setSearchParams(nextParams);
    setActiveTab(tabId);
  };

  const handleCronologiaViewChange = (view: 'cronologia' | 'actuaciones') => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', view === 'actuaciones' ? 'actuaciones' : 'cronologia');
    nextParams.delete('doc');
    setSearchParams(nextParams);
    setActiveTab('cronologia');
    setCronologiaView(view);
  };

  if (!currentCase) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Cargando War Room...</div>;
  const isPicassent = currentCase.id === 'CAS001' ||
                      currentCase.id?.includes('picassent') ||
                      currentCase.title?.toLowerCase().includes('picassent') ||
                      currentCase.autosNumber?.includes('715') ||
                      currentCase.court?.toLowerCase().includes('picassent');
  const isMislata = currentCase.id?.includes('mislata') ||
                    currentCase.title?.toLowerCase().includes('mislata') ||
                    currentCase.autosNumber?.includes('1185');
  const isQuart = currentCase.id?.includes('quart') ||
                  currentCase.title?.toLowerCase().includes('quart') ||
                  currentCase.autosNumber?.includes('1428');

  const fallbackTimelineItems = events.map((event) => ({
    id: event.id,
    fecha: event.date,
    tipo: event.type === 'procesal' ? 'judicial' : 'party_action',
    titulo: event.title,
    descripcion: event.description,
    actores: [],
    tags: event.tags,
  }));

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
              { id: 'cronologia', label: '🕒 Cronología', shortLabel: '🕒' },
              { id: 'estrategia', label: '♟️ Estrategia (Matriz)', shortLabel: '♟️' },
              ...(isPicassent ? [{ id: 'audiencia', label: '⚖️ Sala (AP)', shortLabel: '⚖️' }] : []),
              { id: 'escenarios', label: '🧠 Escenarios (Grafo)', shortLabel: '🧠' },
              { id: 'economico', label: '💰 Económico', shortLabel: '💰' },
              { id: 'docs', label: '📂 Documentos', shortLabel: '📂' },
            ].map(tab => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`pb-2 sm:pb-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.shortLabel}{' '}
                  {tab.id === 'resumen'
                    ? 'Resumen'
                    : tab.id === 'cronologia'
                      ? 'Crono.'
                      : tab.id === 'economico'
                        ? 'Eco.'
                        : tab.id === 'estrategia'
                          ? 'Estr.'
                          : tab.id === 'audiencia'
                            ? 'Aud.'
                            : tab.id === 'escenarios'
                              ? 'Esc.'
                              : 'Docs'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'resumen' && <TabResumen caseData={currentCase} strategies={strategies} events={events} facts={facts} partidas={partidas} documents={docs} navigate={navigate} setActiveTab={setActiveTab} isReadMode={isReadMode} />}
        {activeTab === 'cronologia' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => handleCronologiaViewChange('cronologia')}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                  cronologiaView === 'cronologia'
                    ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                    : 'border-white/10 text-slate-200 hover:bg-white/5'
                }`}
              >
                Cronología
              </button>
              <button
                type="button"
                onClick={() => handleCronologiaViewChange('actuaciones')}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                  cronologiaView === 'actuaciones'
                    ? 'border-amber-400/60 bg-amber-500/10 text-amber-200'
                    : 'border-white/10 text-slate-200 hover:bg-white/5'
                }`}
              >
                Hitos
              </button>
            </div>
            {cronologiaView === 'cronologia' ? (
              isPicassent ? (
                <div className="animate-in fade-in duration-500">
                  <PicassentTimeline />
                </div>
              ) : isQuart ? (
                <QuartTimeline />
              ) : isMislata ? (
                <MislataTimeline />
              ) : (
                <CaseTimelineBase
                  title={`Línea Temporal - ${currentCase.title}`}
                  subtitle={`${currentCase.autosNumber} · ${currentCase.court}`}
                  items={fallbackTimelineItems}
                />
              )
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold text-white">Hitos (Actuaciones)</h2>
                </div>
                {/* Botón añadir nuevo evento */}
                <div className="flex flex-wrap justify-end gap-2">
                  <Link
                    to={`/events/new?caseId=${id}`}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Calendar size={16} />
                    + Nuevo hito procesal
                  </Link>
                  <Link
                    to={`/events/new?caseId=${id}`}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Calendar size={16} />
                    + Nuevo hito fáctico
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
          </div>
        )}
        {activeTab === 'audiencia' && isPicassent && <TabAudienciaPreviaPicassent caseId={id!} isReadMode={isReadMode} />}
        {activeTab === 'escenarios' && (
          <TabEscenarios caseId={currentCase.id} facts={facts} partidas={partidas} documents={docs} />
        )}
        {activeTab === 'economico' && <TabEconomico caseId={id!} facts={facts} caseData={currentCase} />}
        {activeTab === 'docs' && <TabDocs documents={docs} caseId={id} caseData={currentCase} />}
        {activeTab === 'estrategia' && <TabEstrategia strategies={strategies} caseId={id} />}
      </main>
    </div>
  );
}
