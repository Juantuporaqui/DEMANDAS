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
// Importamos el mapa de textos reales
import { LEGAL_DOCS_MAP } from '../../data/legal_texts';
import { formatCurrency } from '../../utils/validators';

// ============================================
// 1. DASHBOARD EJECUTIVO (Tab Resumen) - DINÁMICO
// ============================================
function TabResumen({ caseData, strategies, events, facts, partidas, documents, navigate, setActiveTab }: any) {
  // Calcular totales desde partidas reales
  const totalPartidas = partidas.reduce((sum: number, p: Partida) => sum + (p.amountCents || 0), 0);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* INFO DEL CASO */}
      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/40 to-slate-900/60 p-4">
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">
            <strong>Juzgado:</strong> {caseData.court}
          </span>
          <span className="bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">
            <strong>Rol:</strong> {caseData.clientRole}
          </span>
          {caseData.judge && caseData.judge !== '[Pendiente]' && (
            <span className="bg-slate-700/50 px-3 py-1 rounded-full text-slate-300">
              <strong>Juez:</strong> {caseData.judge}
            </span>
          )}
          {caseData.opposingCounsel && (
            <span className="bg-rose-500/20 px-3 py-1 rounded-full text-rose-300">
              <strong>Contrario:</strong> {caseData.opposingCounsel}
            </span>
          )}
        </div>
        {caseData.notes && (
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">{caseData.notes}</p>
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
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Cuantía Total</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {formatCurrency(totalPartidas)}
          </div>
          <div className="text-[10px] text-slate-600">{partidas.length} partidas</div>
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
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                    fact.status === 'controvertido' ? 'bg-rose-500/20 text-rose-300' :
                    fact.status === 'a_probar' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {fact.status}
                  </span>
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
// 2. TAB DOCUMENTOS (El Lector Inteligente - FIXED)
// ============================================
function TabDocs({ documents, caseId, caseData, initialDocKey }: any) {
  // Estado para el documento seleccionado
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>(initialDocKey || null);
  
  // Detección robusta: ID del caso, Título o Número de Autos
  const isPicassent = caseId?.includes('picassent') || 
                      caseData.title?.toLowerCase().includes('picassent') || 
                      caseData.autosNumber?.includes('715');
                      
  const isMislata = caseData.title?.toLowerCase().includes('mislata');

  // Debug: Ver si tenemos textos cargados
  const hasLegalTexts = LEGAL_DOCS_MAP && Object.keys(LEGAL_DOCS_MAP).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-240px)] min-h-[600px]">
      {/* SIDEBAR DOCUMENTOS */}
      <div className="space-y-6 lg:col-span-1 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Botón Subir */}
        <Link to={`/documents/new?caseId=${caseId}`} className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Upload size={16} /> Subir Nuevo
        </Link>

        {/* Escritos Procesales (Textos Limpios) */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Scale size={14} /> Autos y Escritos
          </h3>
          
          <div className="space-y-1">
            {/* Mensaje de error si no hay textos cargados */}
            {!hasLegalTexts && (
               <div className="text-xs text-rose-500 bg-rose-900/20 p-2 rounded mb-2 border border-rose-800">
                 ⚠️ Error: No se han cargado los textos legales. Verifica src/data/legal_texts.ts
               </div>
            )}

            {isPicassent && (
              <>
                <button 
                  onClick={() => setSelectedDocKey('demanda-picassent')} 
                  className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'demanda-picassent' ? 'bg-amber-900/40 border-amber-500/50 text-amber-100' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  📜 Demanda Contraria
                </button>
                <button 
                  onClick={() => setSelectedDocKey('contestacion-picassent')} 
                  className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'contestacion-picassent' ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}
                >
                  🛡️ Contestación
                </button>
              </>
            )}
            
            {isMislata && (
              <>
                <button onClick={() => setSelectedDocKey('recurso-reposicion-mislata')} className={`w-full text-left p-3 rounded-lg text-sm border mb-1 transition-all ${selectedDocKey === 'recurso-reposicion-mislata' ? 'bg-rose-900/40 border-rose-500 text-rose-100' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>🚨 Recurso Contrario</button>
                <button onClick={() => setSelectedDocKey('oposicion-mislata')} className={`w-full text-left p-3 rounded-lg text-sm border mb-1 transition-all ${selectedDocKey === 'oposicion-mislata' ? 'bg-emerald-900/40 border-emerald-500 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-400'}`}>✅ Nuestra Oposición</button>
              </>
            )}
            
            {!isPicassent && !isMislata && (
                 <div className="text-xs text-slate-600 p-2 italic">No hay escritos predefinidos para este caso.</div>
            )}
          </div>
        </div>

        {/* Archivos PDF Subidos */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2 mt-6">
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
      
      {/* VISOR CENTRAL */}
      <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full shadow-2xl relative flex flex-col">
        {selectedDocKey && LEGAL_DOCS_MAP[selectedDocKey] ? (
          <TextReader content={LEGAL_DOCS_MAP[selectedDocKey]} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 bg-slate-900/20">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="mt-4">Selecciona un documento para lectura inmersiva</p>
            <p className="text-xs opacity-50 mt-2">Formatos optimizados para War Room</p>
            {selectedDocKey && !LEGAL_DOCS_MAP[selectedDocKey] && (
               <p className="text-xs text-rose-500 mt-2 bg-rose-900/20 px-2 py-1 rounded">
                 ⚠️ Error: No se encontró contenido para "{selectedDocKey}"
               </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 3. TAB ECONÓMICO (CON ACCESO A WAR ROOM)
// ============================================
function TabEconomico({ caseId, facts }: { caseId: string, facts: Fact[] }) {
  const navigate = useNavigate();

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
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        fact.risk === 'alto' ? 'bg-rose-900/30 text-rose-400' :
                        fact.risk === 'bajo' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
                    }`}>
                    RIESGO {fact.risk?.toUpperCase() || 'N/A'}
                    </span>
                    <h4 className="text-white font-medium mt-2 text-lg group-hover:text-blue-200 transition-colors">
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
              <Link to="/cases" className="text-xs text-slate-500 hover:text-white mb-1 block transition-colors">← Volver</Link>
              <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-tight truncate">{currentCase.title}</h1>
              <div className="flex gap-2 mt-2 items-center flex-wrap">
                <span className="text-[10px] sm:text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{currentCase.autosNumber}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${currentCase.status === 'activo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{currentCase.status}</span>
              </div>
            </div>
            {/* Acciones Globales */}
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
        {activeTab === 'resumen' && <TabResumen caseData={currentCase} strategies={strategies} events={events} facts={facts} partidas={partidas} documents={docs} navigate={navigate} setActiveTab={setActiveTab} />}
        {activeTab === 'economico' && <TabEconomico caseId={id!} facts={facts} />}
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
