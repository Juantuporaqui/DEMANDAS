// ============================================
// CASE OPS - Cases List (Dark Mode Fusion)
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import Stat from '../../ui/components/Stat';
import {
  casesRepo,
  documentsRepo,
  factsRepo,
  strategiesRepo,
  claimsRepo,
  tasksRepo,
  docRequestsRepo,
} from '../../db/repositories';
import type { Case, Document, Fact, Strategy, Claim, Task, DocRequest } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

const STATUS_LABELS: Record<string, string> = {
  activo: 'Activo',
  suspendido: 'Suspendido',
  archivado: 'Archivado',
  cerrado: 'Cerrado',
};

const STATUS_BADGES: Record<string, string> = {
  activo: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  suspendido: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  archivado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
  cerrado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
};

const CARD_STYLES = [
  {
    accent: 'from-blue-900/70 via-slate-900/70 to-slate-950/90',
    border: 'border-blue-500/30 hover:border-blue-400/50',
    icon: '⚖️',
  },
  {
    accent: 'from-amber-900/40 via-slate-900/70 to-slate-950/90',
    border: 'border-amber-400/30 hover:border-amber-300/50',
    icon: '📌',
  },
  {
    accent: 'from-purple-900/50 via-slate-900/70 to-slate-950/90',
    border: 'border-purple-400/30 hover:border-purple-300/50',
    icon: '🛡️',
  },
  {
    accent: 'from-slate-800/60 via-slate-900/70 to-slate-950/90',
    border: 'border-slate-600/40 hover:border-slate-500/60',
    icon: '🧭',
  },
];

function getNextCase(cases: Case[]) {
  const now = Date.now();
  const upcoming = cases
    .map((caseItem) => ({
      caseItem,
      time: new Date(caseItem.nextDate).getTime(),
    }))
    .filter(({ time }) => !Number.isNaN(time))
    .filter(({ time }) => time >= now)
    .sort((a, b) => a.time - b.time)[0];

  return upcoming?.caseItem ?? null;
}

export function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [docRequests, setDocRequests] = useState<DocRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      const [
        casesData,
        documentsData,
        factsData,
        strategiesData,
        claimsData,
        tasksData,
        docRequestsData,
      ] = await Promise.all([
        casesRepo.getAll(),
        documentsRepo.getAll(),
        factsRepo.getAll(),
        strategiesRepo.getAll(),
        claimsRepo.getAll(),
        tasksRepo.getAll(),
        docRequestsRepo.getAll(),
      ]);

      setCases(casesData);
      setDocuments(documentsData);
      setFacts(factsData);
      setStrategies(strategiesData);
      setClaims(claimsData);
      setTasks(tasksData);
      setDocRequests(docRequestsData);
      setLoading(false);
    }

    loadCases().catch((error) => {
      console.error('Error loading cases:', error);
      setLoading(false);
    });
  }, []);

  const activeCases = useMemo(() => cases.filter((caseItem) => caseItem.status === 'activo'), [
    cases,
  ]);
  const displayCases = useMemo(
    () =>
      [...activeCases].sort((a, b) => {
        if (a.parentCaseId && !b.parentCaseId) return 1;
        if (!a.parentCaseId && b.parentCaseId) return -1;
        return a.title.localeCompare(b.title);
      }),
    [activeCases]
  );

  const totalClaimed = useMemo(
    () => activeCases.reduce((sum, caseItem) => sum + caseItem.amountTotal, 0),
    [activeCases]
  );

  const totalStrategies = useMemo(
    () => strategies.filter((strategy) => activeCases.some((c) => c.id === strategy.caseId)).length,
    [strategies, activeCases]
  );

  const nextCase = useMemo(() => getNextCase(activeCases), [activeCases]);
  const daysUntilNext = useMemo(() => {
    if (!nextCase) return null;
    const diff = new Date(nextCase.nextDate).getTime() - Date.now();
    if (Number.isNaN(diff)) return null;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [nextCase]);

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando casos...</div>;

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Procedimientos principales
          </p>
          <h1 className="text-3xl font-semibold text-white">Mapa de frentes judiciales</h1>
          <p className="mt-1 text-sm text-slate-400">
            {activeCases.length} procedimientos activos con visión jerárquica y métricas clave.
          </p>
        </div>
        {nextCase ? (
          <div className="rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.3em] text-amber-200">
              Próxima vista
            </div>
            <div className="text-sm font-semibold text-amber-100">
              {nextCase.title}
            </div>
            <div className="text-xs text-amber-200/80">
              {nextCase.nextMilestone} · {formatDate(nextCase.nextDate)}
            </div>
          </div>
        ) : null}
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <Stat label="Procedimientos activos" value={activeCases.length} />
          <div className="mt-2 text-xs text-slate-500">Mapa de frentes judiciales</div>
        </Card>
        <Card className="p-5">
          <Stat label="Total reclamado" value={formatCurrency(totalClaimed)} />
          <div className="mt-2 text-xs text-slate-500">Suma de cuantías activas</div>
        </Card>
        <Card className="p-5">
          <Stat label="Estrategias activas" value={totalStrategies} />
          <div className="mt-2 text-xs text-slate-500">War room operativo</div>
        </Card>
        <Card className="p-5">
          <Stat
            label="Días hasta vista"
            value={daysUntilNext ?? '—'}
            delta={nextCase ? nextCase.nextMilestone : undefined}
          />
          <div className="mt-2 text-xs text-slate-500">
            {nextCase ? formatDate(nextCase.nextDate) : 'Sin vista programada'}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <SectionTitle title="Procedimientos" subtitle="Mapa de frentes y dossier" />
          {displayCases.length === 0 ? (
            <EmptyState title="Sin casos" description="Crea tu primer procedimiento judicial." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              {displayCases.map((caseItem, index) => {
                const accent = CARD_STYLES[index % CARD_STYLES.length];
                const docs = documents.filter((doc) => doc.caseId === caseItem.id);
                const caseFacts = facts.filter((fact) => fact.caseId === caseItem.id);
                const caseStrategies = strategies.filter(
                  (strategy) => strategy.caseId === caseItem.id
                );
                const caseClaims = claims.filter((claim) => claim.caseId === caseItem.id);
                const parentCase = caseItem.parentCaseId
                  ? cases.find((parent) => parent.id === caseItem.parentCaseId)
                  : undefined;

                return (
                  <Link
                    key={caseItem.id}
                    to={`/cases/${caseItem.id}`}
                    className="group flex h-full"
                  >
                    <div
                      className={`flex h-full w-full flex-col gap-6 rounded-2xl border bg-gradient-to-br ${accent.accent} ${accent.border} p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-2xl"
                            style={{ backgroundColor: `${caseItem.themeColor}22` }}
                          >
                            {accent.icon}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-lg font-semibold text-white">
                                {caseItem.title}
                              </h2>
                              <span
                                className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${
                                  STATUS_BADGES[caseItem.status] ||
                                  'border-white/10 bg-white/5 text-slate-300'
                                }`}
                              >
                                {STATUS_LABELS[caseItem.status] || caseItem.status}
                              </span>
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">
                              {caseItem.type} · {caseItem.autosNumber || 'Sin autos'}
                            </p>
                            <p className="mt-2 text-sm text-slate-300">{caseItem.court}</p>
                            {parentCase ? (
                              <p className="mt-1 text-xs text-slate-500">
                                Vinculado a {parentCase.title}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                          {formatCurrency(caseItem.amountTotal)}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Documentos
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">
                            {docs.length}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Hechos
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">
                            {caseFacts.length}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Reclamaciones
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">
                            {caseClaims.length}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Estrategias
                          </div>
                          <div className="mt-2 text-lg font-semibold text-white">
                            {caseStrategies.length}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                            Próximo hito
                          </div>
                          <div className="text-sm text-slate-200">
                            {caseItem.nextMilestone} · {formatDate(caseItem.nextDate)}
                          </div>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                          Abrir dossier →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle
              title="Deberes activos"
              subtitle="Tareas prioritarias por procedimiento"
            />
            <div className="mt-4 space-y-3">
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-200">{task.title}</div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        task.priority === 'alta'
                          ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                          : task.priority === 'media'
                          ? 'border-amber-400/40 bg-amber-500/10 text-amber-200'
                          : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Vence: {task.dueDate ? formatDate(task.dueDate) : 'Sin fecha'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Documentación pendiente" subtitle="Solicitudes abiertas" />
            <div className="mt-4 space-y-3">
              {docRequests.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-200">{doc.title}</div>
                    <span className="rounded-full border border-slate-700/80 px-2 py-0.5 text-xs text-slate-400">
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{doc.purpose}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
