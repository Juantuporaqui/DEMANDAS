// ============================================
// CASE OPS - Cases List (Dark Mode Fusion)
// ============================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { EmptyState } from '../../components';
import {
  casesRepo,
  documentsRepo,
  eventsRepo,
  factsRepo,
  partidasRepo,
  strategiesRepo,
} from '../../db/repositories';
import { chaladitaDb } from '../../db/chaladitaDb';
import type { Case, Document, Event, Fact, Partida, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { resumenAudiencia } from '../../data/audienciaPrevia';
import { hechosReclamados, getResumenContador } from '../../data/hechosReclamados';
import { CaseCard } from './components/CaseCard';

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

function getNextEvent(events: Event[]) {
  const now = Date.now();
  const upcoming = events
    .map((event) => ({ event, time: new Date(event.date).getTime() }))
    .filter(({ time }) => !Number.isNaN(time))
    .filter(({ time }) => time >= now)
    .sort((a, b) => a.time - b.time)[0];

  return upcoming?.event ?? null;
}

function getCaseLabel(caseItem: Case) {
  const title = caseItem.title?.toLowerCase() || '';
  const autos = caseItem.autosNumber || '';
  if (title.includes('picassent') || autos.includes('715')) return 'PICASSENT';
  if (title.includes('mislata') || autos.includes('1185')) return 'MISLATA';
  if (title.includes('quart') || autos.includes('1428')) return 'QUART';
  return 'CASO';
}

function getRoleLabel(role?: Case['clientRole']) {
  if (!role) return 'Parte';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function getDaysDelta(targetDate: string) {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (Number.isNaN(diff)) return 'D-0';
  return diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`;
}

function getNextAudienciaEvent(events: Event[]) {
  const audienciaEvents = events.filter((event) => {
    const title = event.title.toLowerCase();
    return title.includes('audiencia') || event.tags.some((tag) => tag.toLowerCase().includes('audiencia'));
  });
  return getNextEvent(audienciaEvents) ?? getNextEvent(events);
}

const DEFAULT_SUMMARIES: Record<string, string> = {
  PICASSENT: 'Reclamación de cuotas hipotecarias y préstamos tras ruptura.',
  MISLATA: 'Reclamación de cantidad vinculada a deuda hipotecaria pendiente.',
  QUART: 'Ejecución familiar para asegurar pagos y ayudas escolares.',
};

export function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const chaladitaData = useLiveQuery(async () => {
    const [procedimientos, hechos, documentos, partidas] = await Promise.all([
      chaladitaDb.procedimientos.toArray(),
      chaladitaDb.hechos.toArray(),
      chaladitaDb.documentos.toArray(),
      chaladitaDb.partidas.toArray(),
    ]);

    return { procedimientos, hechos, documentos, partidas };
  }, []);

  useEffect(() => {
    async function loadCases() {
      const [casesData, documentsData, factsData, partidasData, eventsData, strategiesData] =
        await Promise.all([
          casesRepo.getAll(),
          documentsRepo.getAll(),
          factsRepo.getAll(),
          partidasRepo.getAll(),
          eventsRepo.getAll(),
          strategiesRepo.getAll(),
        ]);

      setCases(casesData);
      setDocuments(documentsData);
      setFacts(factsData);
      setPartidas(partidasData);
      setEvents(eventsData);
      setStrategies(strategiesData);
      setLoading(false);
    }

    loadCases().catch((error) => {
      console.error('Error loading cases:', error);
      setLoading(false);
    });
  }, []);

  // Ordenar para que Picassent aparezca primero
  const mainCases = useMemo(() => {
    const filtered = cases.filter((caseItem) => !caseItem.parentCaseId);
    return filtered.sort((a, b) => {
      // Picassent siempre primero
      const aIsPicassent = a.title.toLowerCase().includes('picassent') || a.autosNumber?.includes('715/2024');
      const bIsPicassent = b.title.toLowerCase().includes('picassent') || b.autosNumber?.includes('715/2024');
      if (aIsPicassent && !bIsPicassent) return -1;
      if (!aIsPicassent && bIsPicassent) return 1;
      return 0;
    });
  }, [cases]);
  if (loading) return <div className="p-8 text-center text-slate-500">Cargando casos...</div>;

  const picassentCase = mainCases.find((caseItem) => {
    const title = caseItem.title?.toLowerCase() || '';
    const autos = caseItem.autosNumber || '';
    return title.includes('picassent') || autos.includes('715/2024');
  });
  const picassentEvents = picassentCase
    ? events.filter((event) => event.caseId === picassentCase.id)
    : [];
  const audienciaEvent = getNextAudienciaEvent(picassentEvents);
  const proximoHitoLabel = audienciaEvent
    ? `${audienciaEvent.title} - Picassent`
    : 'Audiencia Previa - Picassent';
  const proximoHitoDate = audienciaEvent?.date ?? resumenAudiencia.fecha;
  const proximoHitoDays = getDaysDelta(proximoHitoDate);
  const resumenContador = getResumenContador();

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-slate-900/80 to-slate-950/80 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-200">
              Próximo hito
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {proximoHitoLabel}
            </h2>
            <p className="mt-1 text-sm text-slate-300">
              {formatDate(proximoHitoDate)} · {resumenAudiencia.sala}
            </p>
          </div>
          <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-5 py-3 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">Cuenta atrás</div>
            <div className="mt-1 text-2xl font-semibold text-amber-100">{proximoHitoDays}</div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
            Procedimientos principales
          </p>
          <h1 className="text-3xl font-semibold text-white">Mapa de frentes judiciales</h1>
          <p className="mt-1 text-sm text-slate-400">
            {mainCases.length} procedimientos activos con su documentación, hechos y estrategia.
          </p>
        </div>
        <Link
          to="/analytics"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 transition hover:border-emerald-400/40"
        >
          Ver tablero ejecutivo
        </Link>
      </div>

      {cases.length === 0 ? (
        <EmptyState title="Sin casos" description="Crea tu primer procedimiento judicial." />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {mainCases.map((caseItem, index) => {
            const accent = CARD_STYLES[index % CARD_STYLES.length];
            const docs = documents.filter((doc) => doc.caseId === caseItem.id);
            const caseFacts = facts.filter((fact) => fact.caseId === caseItem.id);
            const caseStrategies = strategies.filter((strategy) => strategy.caseId === caseItem.id);
            const casePartidas = partidas.filter((partida) => partida.caseId === caseItem.id);
            const caseEvents = events.filter((event) => event.caseId === caseItem.id);
            const totalAmount = casePartidas.reduce((sum, partida) => sum + partida.amountCents, 0);
            const nextEvent = getNextEvent(caseEvents);
            const caseLabel = getCaseLabel(caseItem);
            const procedimientoMatch = chaladitaData?.procedimientos.find(
              (proc) =>
                proc.autos === caseItem.autosNumber ||
                proc.nombre.toLowerCase().includes(caseLabel.toLowerCase())
            );
            const chaladitaHechos = chaladitaData?.hechos.filter(
              (hecho) => hecho.procedimientoId === procedimientoMatch?.id
            ) ?? [];
            const chaladitaDocs = chaladitaData?.documentos.filter(
              (doc) => doc.procedimientoId === procedimientoMatch?.id
            ) ?? [];
            const chaladitaPartidas = chaladitaData?.partidas.filter(
              (partida) => partida.procedimientoId === procedimientoMatch?.id
            ) ?? [];
            const chaladitaTotal = chaladitaPartidas.reduce((sum, partida) => sum + partida.importe, 0);
            const baseAmount = caseItem.amountTotalCents
              ?? (chaladitaTotal > 0 ? chaladitaTotal : totalAmount);
            const impactAmountCents = baseAmount > 0
              ? baseAmount
              : caseLabel === 'PICASSENT'
                ? Math.round(resumenContador.totalReclamado * 100)
                : 0;
            const microSummary =
              procedimientoMatch?.objetivoInmediato?.trim() ||
              caseItem.notes?.trim() ||
              DEFAULT_SUMMARIES[caseLabel] ||
              'Revisión integral de la estrategia procesal y probatoria.';
            const gapCount = caseLabel === 'PICASSENT'
              ? hechosReclamados.filter(
                  (hecho) => hecho.estado === 'disputa' && hecho.documentosRef.length === 0
                ).length
              : 0;
            const nextEventLabel = nextEvent
              ? `${nextEvent.title} · ${formatDate(nextEvent.date)}`
              : undefined;

            return (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                accent={accent}
                statusLabel={STATUS_LABELS[caseItem.status] || caseItem.status}
                statusBadge={STATUS_BADGES[caseItem.status] || 'border-white/10 bg-white/5 text-slate-300'}
                roleLabel={getRoleLabel(caseItem.clientRole)}
                opposingParty={caseItem.opposingPartyName || 'Sin datos'}
                opposingLawyer={caseItem.opposingLawyerName || caseItem.opposingCounsel || 'Sin datos'}
                impactAmountCents={impactAmountCents}
                hechosCount={chaladitaHechos.length > 0 ? chaladitaHechos.length : caseFacts.length}
                documentosCount={chaladitaDocs.length > 0 ? chaladitaDocs.length : docs.length}
                estrategiasCount={caseStrategies.length}
                microSummary={microSummary}
                gapCount={gapCount}
                nextEventLabel={nextEventLabel}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
