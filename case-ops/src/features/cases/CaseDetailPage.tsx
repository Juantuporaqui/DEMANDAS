// ============================================
// CASE OPS - Case Detail Page
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
} from '../../db/repositories';
import type { Case, Document, Event, Fact, Partida, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

const STATUS_BADGES: Record<string, string> = {
  activo: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200',
  suspendido: 'border-amber-400/40 bg-amber-400/10 text-amber-200',
  archivado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
  cerrado: 'border-slate-500/40 bg-slate-500/10 text-slate-200',
};

function getNextEvent(events: Event[]) {
  const now = Date.now();
  const upcoming = events
    .map((event) => ({ event, time: new Date(event.date).getTime() }))
    .filter(({ time }) => !Number.isNaN(time))
    .filter(({ time }) => time >= now)
    .sort((a, b) => a.time - b.time)[0];

  return upcoming?.event ?? null;
}

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
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
        allCases,
      ] = await Promise.all([
        casesRepo.getById(caseId),
        documentsRepo.getByCaseId(caseId),
        factsRepo.getByCaseId(caseId),
        partidasRepo.getByCaseId(caseId),
        eventsRepo.getByCaseId(caseId),
        strategiesRepo.getByCaseId(caseId),
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
      setChildCases(allCases.filter((caseItem) => caseItem.parentCaseId === caseId));
    } catch (error) {
      console.error('Error loading case:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalAmount = useMemo(
    () => partidas.reduce((sum, partida) => sum + partida.amountCents, 0),
    [partidas]
  );
  const controversialFacts = useMemo(
    () => facts.filter((fact) => fact.status === 'controvertido' || fact.status === 'a_probar'),
    [facts]
  );
  const nextEvent = useMemo(() => getNextEvent(events), [events]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  if (!caseData) {
    return <div className="text-slate-400">Caso no encontrado</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200"
          >
            ←
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Procedimiento</p>
            <h1 className="text-2xl font-semibold text-white">{caseData.title}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${
              STATUS_BADGES[caseData.status] || 'border-white/10 bg-white/5 text-slate-300'
            }`}
          >
            {caseData.status}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200">
            {caseData.type}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-slate-950/90 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-300">{caseData.court}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">
                  Autos {caseData.autosNumber || 'Sin número'}
                </p>
              </div>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            {caseData.notes && (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
                {caseData.notes}
              </div>
            )}
            {caseData.tags.length > 0 && (
              <div className="mt-4">
                <Chips items={caseData.tags} />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Documentos</div>
              <div className="mt-2 text-2xl font-semibold text-white">{documents.length}</div>
              <Link
                to="/documents"
                className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200"
              >
                Ver dossier
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Hechos clave</div>
              <div className="mt-2 text-2xl font-semibold text-white">{controversialFacts.length}</div>
              <Link
                to="/facts"
                className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200"
              >
                Revisar hechos
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Estrategias</div>
              <div className="mt-2 text-2xl font-semibold text-white">{strategies.length}</div>
              <Link
                to="/warroom"
                className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200"
              >
                Ver War Room
              </Link>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Cronología</div>
              <div className="mt-2 text-2xl font-semibold text-white">{events.length}</div>
              <Link
                to="/events"
                className="mt-2 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200"
              >
                Ver eventos
              </Link>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Documentación clave</h2>
                  <p className="text-sm text-slate-400">
                    Resumen de escritos y pruebas esenciales.
                  </p>
                </div>
                <Link
                  to="/documents"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200"
                >
                  Ver todo
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {documents.slice(0, 3).map((doc) => (
                  <Link
                    key={doc.id}
                    to={`/documents/${doc.id}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40"
                  >
                    <div>
                      <div className="font-semibold">{doc.title}</div>
                      <div className="text-xs text-slate-500">{doc.docType}</div>
                    </div>
                    <span className="text-xs text-slate-500">{doc.id}</span>
                  </Link>
                ))}
                {documents.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                    No hay documentación registrada.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Hechos y controversias</h2>
                  <p className="text-sm text-slate-400">
                    Hechos a probar y puntos críticos del relato.
                  </p>
                </div>
                <Link
                  to="/facts"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200"
                >
                  Ver todo
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {facts.slice(0, 3).map((fact) => (
                  <Link
                    key={fact.id}
                    to={`/facts/${fact.id}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40"
                  >
                    <div>
                      <div className="font-semibold">{fact.title}</div>
                      <div className="text-xs text-slate-500">{fact.status}</div>
                    </div>
                    <span className="text-xs text-slate-500">{fact.id}</span>
                  </Link>
                ))}
                {facts.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                    No hay hechos registrados.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Estrategias activas</h2>
                  <p className="text-sm text-slate-400">Líneas de ataque y defensa en curso.</p>
                </div>
                <Link
                  to="/warroom"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200"
                >
                  Ver todo
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {strategies.slice(0, 2).map((strategy) => (
                  <div
                    key={strategy.id}
                    className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                  >
                    <div className="font-semibold">{strategy.attack}</div>
                    <div className="text-xs text-slate-500">{strategy.id}</div>
                  </div>
                ))}
                {strategies.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                    Añade estrategias en War Room.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">Agenda procesal</h2>
                  <p className="text-sm text-slate-400">Próximos hitos y fechas clave.</p>
                </div>
                <Link
                  to="/events"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200"
                >
                  Ver todo
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {nextEvent ? (
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                    Próximo hito: {nextEvent.title} · {formatDate(nextEvent.date)}
                  </div>
                ) : null}
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                  >
                    <div>
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs text-slate-500">{formatDate(event.date)}</div>
                    </div>
                    <span className="text-xs text-slate-500">{event.type}</span>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                    No hay eventos programados.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Resumen financiero</h2>
            <p className="text-sm text-slate-400">Impacto económico y partidas.</p>
            <div className="mt-4 space-y-3">
              {partidas.slice(0, 4).map((partida) => (
                <div
                  key={partida.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                >
                  <div>
                    <div className="font-semibold">{partida.concept}</div>
                    <div className="text-xs text-slate-500">{partida.state}</div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-200">
                    {formatCurrency(partida.amountCents)}
                  </span>
                </div>
              ))}
              {partidas.length === 0 && (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
                  No hay partidas registradas.
                </div>
              )}
            </div>
            <Link
              to="/partidas"
              className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200"
            >
              Ver partidas
            </Link>
          </div>

          {childCases.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold text-white">Procedimientos vinculados</h2>
              <p className="text-sm text-slate-400">
                Derivadas, ejecuciones o incidentes asociados.
              </p>
              <div className="mt-4 space-y-3">
                {childCases.map((child) => (
                  <Link
                    key={child.id}
                    to={`/cases/${child.id}`}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200 transition hover:border-emerald-400/40"
                  >
                    <div>
                      <div className="font-semibold">{child.title}</div>
                      <div className="text-xs text-slate-500">{child.type}</div>
                    </div>
                    <span className="text-xs text-slate-500">{child.id}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">Acciones rápidas</h2>
            <p className="text-sm text-slate-400">Atajos para gestionar el expediente.</p>
            <div className="mt-4 grid gap-3">
              <Link
                to="/documents/new"
                className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
              >
                Añadir documento
              </Link>
              <Link
                to="/facts/new"
                className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
              >
                Registrar hecho
              </Link>
              <Link
                to="/warroom/new"
                className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
              >
                Nueva estrategia
              </Link>
              <Link
                to="/events/new"
                className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
              >
                Programar evento
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
