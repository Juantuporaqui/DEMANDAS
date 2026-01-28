// ============================================
// CASE OPS - Case Detail Page (War Room Edition)
// Vista de expediente con sistema de Tabs
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
}: {
  caseData: Case;
  documents: Document[];
  facts: Fact[];
  strategies: Strategy[];
  partidas: Partida[];
  tasks: Task[];
}) {
  const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);
  const controversialFacts = facts.filter(
    (f) => f.status === 'controvertido' || f.status === 'a_probar'
  );
  const pendingTasks = tasks.filter((t) => t.status === 'pendiente' || t.status === 'en_progreso');

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
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

      {/* Notes Section */}
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Notas del Expediente</h3>
        {caseData.notes ? (
          <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
            {caseData.notes}
          </div>
        ) : (
          <p className="text-sm text-slate-500 italic">Sin notas registradas.</p>
        )}
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
          <h3 className="text-lg font-semibold text-amber-200 mb-4">
            Tareas Pendientes ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            {pendingTasks.slice(0, 5).map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-amber-500/20 bg-slate-950/50 px-4 py-3"
              >
                <div>
                  <div className="font-medium text-slate-200">{task.title}</div>
                  {task.dueDate && (
                    <div className="text-xs text-slate-500">Vence: {formatDate(task.dueDate)}</div>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${
                    task.priority === 'alta'
                      ? 'bg-rose-500/20 text-rose-300'
                      : task.priority === 'media'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Summary */}
      <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Resumen Financiero</h3>
          <Link
            to="/partidas"
            className="text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300"
          >
            Ver todo →
          </Link>
        </div>
        <div className="space-y-2">
          {partidas.slice(0, 4).map((partida) => (
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
          {partidas.length === 0 && (
            <p className="text-sm text-slate-500 italic">Sin partidas registradas.</p>
          )}
        </div>
      </div>
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
          to="/warroom/new"
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
          to="/warroom/new"
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

function TabDocs({ documents, caseId }: { documents: Document[]; caseId: string }) {
  if (documents.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/20 bg-slate-900/30 p-12 text-center">
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-lg font-semibold text-slate-200">Sin documentos</h3>
        <p className="text-sm text-slate-500 mt-2">
          Sube escritos, pruebas y comunicaciones del expediente.
        </p>
        <Link
          to="/documents/new"
          className="inline-flex mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Subir Documento
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Documentos del Caso ({documents.length})
        </h3>
        <Link
          to="/documents/new"
          className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-300 hover:bg-blue-500/20 transition-colors"
        >
          + Nuevo
        </Link>
      </div>

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
    </div>
  );
}

function TabActuaciones({ events, facts }: { events: Event[]; facts: Fact[] }) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Cronología</h3>
          <Link
            to="/events/new"
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

      {/* Facts Summary */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Hechos Relevantes</h3>
          <Link
            to="/facts/new"
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 transition-colors"
          >
            ←
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
              Procedimiento · {caseData.id}
            </p>
            <h1 className="text-2xl font-bold text-white mt-1">{caseData.title}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-slate-400">
              <span>{caseData.court || 'Sin juzgado'}</span>
              <span>·</span>
              <span>Autos {caseData.autosNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${
              STATUS_BADGES[caseData.status] || 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {caseData.status}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase text-slate-300">
            {caseData.type}
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

      {/* Next Event Banner */}
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
        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
          />
        )}
        {activeTab === 'estrategia' && <TabEstrategia strategies={strategies} caseId={caseData.id} />}
        {activeTab === 'docs' && <TabDocs documents={documents} caseId={caseData.id} />}
        {activeTab === 'actuaciones' && <TabActuaciones events={events} facts={facts} />}
      </div>
    </div>
  );
}
