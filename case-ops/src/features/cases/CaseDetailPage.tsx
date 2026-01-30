// ============================================
// CASE OPS - Case Detail Page (FIXED)
// ============================================

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Scale, FileText, Calendar, Gavel, ChevronRight, Upload, ListChecks
} from 'lucide-react';
import {
  casesRepo, documentsRepo, eventsRepo, factsRepo, partidasRepo, strategiesRepo
} from '../../db/repositories';
import type { Case, Document, Event, Fact, Partida, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { resumenContador } from '../../data/hechosReclamados';
import { TextReader } from '../../ui/components/TextReader';
// Asegúrate de que esta ruta es correcta y el archivo existe
import { LEGAL_DOCS_MAP } from '../../data/legal_texts';

// ============================================
// 1. DASHBOARD EJECUTIVO
// ============================================
function TabResumen({ caseData, strategies, events, facts, navigate }: any) {
  const isPicassent = caseData.id.includes('picassent') || caseData.title.toLowerCase().includes('picassent');
  const totalReclamado = facts.length > 0 ? facts.length * 15000 : resumenContador.totalReclamado; 
  
  const nextEvent = events
    .filter((e: Event) => new Date(e.date).getTime() >= Date.now())
    .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Total en Disputa</div>
          <div className="text-2xl font-bold text-rose-400 mt-1">
             {(isPicassent ? resumenContador.totalReclamado : totalReclamado).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Hechos Clave</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{facts.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Documentos</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{caseData.tags?.length || 0}</div>
        </div>
        <div className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-4">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">Estrategias</div>
          <div className="text-2xl font-bold text-blue-400 mt-1">{strategies.length} activas</div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <button onClick={() => navigate('/analytics/hechos')} className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400"><ListChecks size={20} /></div>
            <h3 className="font-bold text-white">Desglose de Hechos (War Room)</h3>
          </div>
          <p className="text-sm text-slate-400 mb-3">{facts.length} puntos de conflicto analizados.</p>
          <div className="text-xs text-emerald-400 font-medium group-hover:translate-x-1 transition-transform">Ver matriz de ataque →</div>
        </button>

        <button onClick={() => navigate('/analytics/audiencia')} className="group rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5 text-left hover:border-amber-500/30 transition-all relative">
          <div className="absolute top-4 right-4"><span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-1 rounded-full border border-amber-500/30">URGENTE</span></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><Gavel size={20} /></div>
            <h3 className="font-bold text-white">Audiencia Previa</h3>
          </div>
          <p className="text-sm text-slate-400 mb-3">Preparación de prueba y alegaciones.</p>
          <div className="text-xs text-amber-400 font-medium group-hover:translate-x-1 transition-transform">Ir al modo juicio →</div>
        </button>
      </div>
    </div>
  );
}

// ============================================
// 2. TAB DOCUMENTOS (FIXED)
// ============================================
function TabDocs({ documents, caseId, caseData }: any) {
  const [selectedDocKey, setSelectedDocKey] = useState<string | null>(null);
  
  // LÓGICA DE DETECCIÓN ROBUSTA
  // Si el ID contiene 'picassent' o el número '715', activamos los documentos
  const isPicassent = caseId.includes('picassent') || 
                      caseData.title.toLowerCase().includes('picassent') || 
                      caseData.autosNumber?.includes('715');

  // Debug rápido para ver si el mapa carga
  const hasLegalTexts = Object.keys(LEGAL_DOCS_MAP).length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-240px)] min-h-[600px]">
      {/* SIDEBAR */}
      <div className="space-y-6 lg:col-span-1 overflow-y-auto pr-2 custom-scrollbar">
        
        <Link to={`/documents/new?caseId=${caseId}`} className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-900/20">
          <Upload size={16} /> Subir Nuevo
        </Link>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
            <Scale size={14} /> Autos y Escritos
          </h3>
          
          <div className="space-y-1">
            {/* MENSAJE DE DEBUG SI FALLA LA CARGA */}
            {!hasLegalTexts && (
              <div className="text-xs text-rose-500 bg-rose-900/20 p-2 rounded mb-2 border border-rose-800">
                ⚠️ Error: LEGAL_DOCS_MAP vacío. Revisa src/data/legal_texts.ts
              </div>
            )}

            {isPicassent ? (
              <>
                <button onClick={() => setSelectedDocKey('demanda-picassent')} className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'demanda-picassent' ? 'bg-amber-900/40 border-amber-500/50 text-amber-100' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  📜 Demanda Contraria
                </button>
                <button onClick={() => setSelectedDocKey('contestacion-picassent')} className={`w-full text-left p-3 rounded-lg text-sm border transition-all ${selectedDocKey === 'contestacion-picassent' ? 'bg-emerald-900/40 border-emerald-500/50 text-emerald-100' : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                  🛡️ Contestación
                </button>
              </>
            ) : (
              <div className="text-xs text-slate-600 italic px-2">No hay escritos predefinidos para el caso "{caseData.title}".</div>
            )}
          </div>
        </div>

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
      
      {/* VISOR */}
      <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden h-full shadow-2xl relative flex flex-col">
        {selectedDocKey && LEGAL_DOCS_MAP[selectedDocKey] ? (
          <TextReader content={LEGAL_DOCS_MAP[selectedDocKey]} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-600 bg-slate-900/20">
            <FileText size={48} className="mb-4 opacity-20" />
            <p className="mt-4">Selecciona un documento para lectura</p>
            {selectedDocKey && !LEGAL_DOCS_MAP[selectedDocKey] && (
               <p className="text-xs text-rose-500 mt-2">Error: No se encontró el texto para la clave "{selectedDocKey}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// 3. TAB ECONÓMICO
// ============================================
function TabEconomico({ caseId, facts }: { caseId: string, facts: Fact[] }) {
  const navigate = useNavigate();
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
              No hay hechos registrados.
          </div>
      )}

      {facts.map((fact) => {
        const amountDisplay = extractAmount(fact.titulo) || extractAmount(fact.resumenCorto || '') || '--- €';
        const hasConflict = fact.tesis || fact.antitesisEsperada;

        return (
            <div 
            key={fact.id} 
            onClick={() => navigate(`/facts/${fact.id}`)}
            className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden group hover:border-blue-500/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all cursor-pointer relative"
            >
            <div className="absolute top-4 right-4 text-slate-600 group-hover:text-blue-400 transition-colors">
                <ChevronRight size={20} />
            </div>

            <div className="p-4 pr-12">
                <div className="flex justify-between items-start">
                <div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        fact.riesgo === 'alto' ? 'bg-rose-900/30 text-rose-400' : 
                        fact.riesgo === 'bajo' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
                    }`}>
                    RIESGO {fact.riesgo}
                    </span>
                    <h4 className="text-white font-medium mt-2 text-lg group-hover:text-blue-200 transition-colors">
                    {fact.titulo}
                    </h4>
                </div>
                <div className="text-right mt-1 mr-6">
                    <div className="text-xl font-bold text-slate-200 tabular-nums">{amountDisplay}</div>
                    <div className="text-xs text-slate-500 font-mono">ESTIMADO</div>
                </div>
                </div>
            </div>
            
            {hasConflict && (
                <div className="px-4 pb-4 pt-0 text-sm grid md:grid-cols-2 gap-4 text-slate-400 border-t border-slate-800/50 mt-2 pt-3 bg-slate-950/30">
                    <div className="flex gap-2">
                    <span className="text-rose-400 text-xs uppercase font-bold shrink-0 mt-0.5">Antítesis:</span>
                    <span className="line-clamp-2 text-xs">{fact.antitesisEsperada || "Sin definir"}</span>
                    </div>
                    <div className="flex gap-2">
                    <span className="text-emerald-400 text-xs uppercase font-bold shrink-0 mt-0.5">Tesis:</span>
                    <span className="line-clamp-2 text-xs">{fact.tesis || "Sin definir"}</span>
                    </div>
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
  const [activeTab, setActiveTab] = useState('resumen');
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]); 

  useEffect(() => {
    if (!id) return;
    casesRepo.getById(id).then(c => c ? setCurrentCase(c) : navigate('/cases'));
    documentsRepo.getAll().then(all => setDocs(all.filter(d => d.caseId === id)));
    eventsRepo.getAll().then(all => setEvents(all.filter(e => e.caseId === id)));
    strategiesRepo.getAll().then(all => setStrategies(all.filter(s => s.caseId === id)));
    factsRepo.getAll().then(all => setFacts(all.filter(f => f.caseId === id)));
  }, [id, navigate]);

  if (!currentCase) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">Cargando War Room...</div>;

  return (
    <div className="min-h-screen bg-slate-950 pb-20 font-sans">
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-0">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Link to="/cases" className="text-xs text-slate-500 hover:text-white mb-1 block transition-colors">← Volver</Link>
              <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">{currentCase.title}</h1>
              <div className="flex gap-2 mt-2 items-center">
                <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">{currentCase.autosNumber}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/events/new?caseId=${id}`} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700"><Calendar size={18} /></Link>
              <Link to={`/documents/new?caseId=${id}`} className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-900/20"><Upload size={18} /></Link>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'resumen', label: '📊 Resumen' },
              { id: 'economico', label: '💰 Hechos / Partidas' },
              { id: 'estrategia', label: '♟️ Estrategia' },
              { id: 'docs', label: '📂 Documentos' },
              { id: 'actuaciones', label: '📅 Actuaciones' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'resumen' && <TabResumen caseData={currentCase} strategies={strategies} events={events} facts={facts} navigate={navigate} />}
        {activeTab === 'economico' && <TabEconomico caseId={id!} facts={facts} />}
        {activeTab === 'docs' && <TabDocs documents={docs} caseId={id} caseData={currentCase} />}
        {activeTab === 'estrategia' && <TabEstrategia strategies={strategies} caseId={id} />}
        {activeTab === 'actuaciones' && (
          <div className="space-y-4">
            {events.map(e => (
              <div key={e.id} className="flex gap-4 p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-colors">
                <div className="text-center min-w-[60px] pt-1">
                  <div className="text-xl font-bold text-slate-200">{new Date(e.date).getDate()}</div>
                  <div className="text-xs text-slate-500 uppercase">{new Date(e.date).toLocaleString('default', { month: 'short' })}</div>
                </div>
                <div>
                  <h4 className="font-medium text-white">{e.title}</h4>
                  <p className="text-sm text-slate-400">{e.description}</p>
                </div>
              </div>
            ))}
            {events.length === 0 && <div className="text-center text-slate-500 py-10">No hay actuaciones registradas.</div>}
          </div>
        )}
      </main>
    </div>
  );
}
