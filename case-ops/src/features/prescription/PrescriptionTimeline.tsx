import { useMemo, useState } from 'react';
import { prescriptionEvents, type PrescriptionEvent } from '../../data/prescriptionEvents';

const START_DATE = new Date('2000-01-01T00:00:00');
const END_DATE = new Date('2025-12-31T23:59:59');
const THRESHOLD_DATE = new Date('2020-10-07T00:00:00');
const REFORM_DATE = new Date('2015-10-07T00:00:00');

const YEAR_TICKS = [2000, 2005, 2010, 2015, 2020, 2025];

const getPosition = (date: Date) => {
  const total = END_DATE.getTime() - START_DATE.getTime();
  const offset = date.getTime() - START_DATE.getTime();
  return Math.min(Math.max((offset / total) * 100, 0), 100);
};

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

const getEventColor = (event: PrescriptionEvent) => {
  if (event.tipo === 'demanda') return 'bg-sky-400 text-sky-100';
  if (event.tipo === 'umbral') return 'bg-red-500 text-red-50';
  if (event.tipo === 'norma') return 'bg-purple-400 text-purple-100';
  return 'bg-slate-400 text-slate-900';
};

const getEventRing = (event: PrescriptionEvent) => {
  if (event.tipo === 'demanda') return 'ring-sky-300';
  if (event.tipo === 'umbral') return 'ring-red-400';
  if (event.tipo === 'norma') return 'ring-purple-300';
  return 'ring-slate-300';
};

export function PrescriptionTimeline() {
  const [selectedEvent, setSelectedEvent] = useState<PrescriptionEvent | null>(
    prescriptionEvents[0] ?? null,
  );
  const [zoneOpen, setZoneOpen] = useState(false);
  const [showFullLaw, setShowFullLaw] = useState(false);

  const sortedEvents = useMemo(
    () => [...prescriptionEvents].sort((a, b) => a.fecha.localeCompare(b.fecha)),
    [],
  );

  const thresholdPosition = getPosition(THRESHOLD_DATE);
  const reformPosition = getPosition(REFORM_DATE);
  const claimStart = sortedEvents[0];
  const claimEnd = sortedEvents.find((event) => event.tipo === 'demanda') ?? sortedEvents.at(-1);
  const claimStartPosition = claimStart ? getPosition(new Date(`${claimStart.fecha}T00:00:00`)) : 0;
  const claimEndPosition = claimEnd ? getPosition(new Date(`${claimEnd.fecha}T00:00:00`)) : 0;

  const activeEventPosition = selectedEvent
    ? getPosition(new Date(`${selectedEvent.fecha}T00:00:00`))
    : 0;

  return (
    <section className="card-base card-elevated flex flex-col gap-6 p-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          Línea de tiempo de prescripción
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">
              Prescripción 2000 → 2025 (visión orientativa)
            </h2>
            <p className="text-sm text-slate-400">
              Visualización didáctica del umbral temporal, sin sustituir el análisis jurídico.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Umbral clave: 07/10/2020 (art. 1964 CC)
          </div>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-6">
        <div className="relative min-w-[960px] pb-20 pt-12">
          <div className="absolute inset-y-6 left-0 right-0">
            <div
              className="absolute inset-y-0"
              style={{
                left: `${thresholdPosition}%`,
                background: 'rgba(254, 242, 242, 0.12)',
              }}
            />
            <div
              className="absolute top-0 flex max-w-xs flex-col gap-1 text-xs text-red-200"
              style={{ left: `calc(${thresholdPosition}% + 12px)` }}
            >
              <span className="rounded-full border border-red-300/40 bg-red-500/10 px-3 py-1">
                Tramo crítico (posible prescripción si no hubo interrupción)
              </span>
            </div>
            <button
              type="button"
              className="absolute inset-y-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-red-300"
              style={{ left: `${thresholdPosition}%`, right: 0 }}
              onMouseEnter={() => setZoneOpen(true)}
              onMouseLeave={() => setZoneOpen(false)}
              onFocus={() => setZoneOpen(true)}
              onBlur={() => setZoneOpen(false)}
              onClick={() => setZoneOpen((prev) => !prev)}
              aria-label="Información sobre el umbral legal"
            />
            {zoneOpen && (
              <div
                className="absolute top-12 z-20 w-[280px] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 text-xs text-slate-200 shadow-xl"
                style={{ left: `calc(${thresholdPosition}% + 16px)` }}
                role="dialog"
                aria-live="polite"
              >
                <p className="font-semibold text-slate-100">Art. 1964.2 CC</p>
                <p className="mt-2 text-slate-300">
                  Las acciones personales sin plazo especial prescriben a los 5 años desde que la
                  obligación puede exigirse.
                </p>
                {showFullLaw && (
                  <p className="mt-2 text-slate-400">
                    En obligaciones continuadas o periódicas, el plazo se computa desde el último
                    incumplimiento exigible.
                  </p>
                )}
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-600 px-3 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                  onClick={() => setShowFullLaw((prev) => !prev)}
                >
                  {showFullLaw ? 'Ver menos' : 'Ver más'}
                </button>
              </div>
            )}
          </div>

          <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-slate-700" />

          <div
            className="absolute h-0.5 -translate-y-1/2 bg-sky-400/70"
            style={{
              top: '46%',
              left: `${claimStartPosition}%`,
              width: `${Math.max(thresholdPosition - claimStartPosition, 0)}%`,
            }}
          />
          <div
            className="absolute h-0.5 -translate-y-1/2 border-t border-dashed border-sky-300/70"
            style={{
              top: '46%',
              left: `${thresholdPosition}%`,
              width: `${Math.max(claimEndPosition - thresholdPosition, 0)}%`,
              opacity: 0.5,
            }}
          />

          <div
            className="absolute top-6 h-[72%] w-1 -translate-x-1/2 rounded-full bg-red-500"
            style={{ left: `${thresholdPosition}%` }}
          />

          <div
            className="absolute top-6 h-[72%] w-0.5 -translate-x-1/2 bg-purple-400/60"
            style={{ left: `${reformPosition}%` }}
          />

          {YEAR_TICKS.map((year) => {
            const position = getPosition(new Date(`${year}-01-01T00:00:00`));
            return (
              <div key={year} className="absolute top-1/2" style={{ left: `${position}%` }}>
                <div className="h-2 w-0.5 bg-slate-600" />
                <span className="mt-2 block -translate-x-1/2 text-xs text-slate-500">
                  {year}
                </span>
              </div>
            );
          })}

          {sortedEvents.map((event) => {
            const date = new Date(`${event.fecha}T00:00:00`);
            const position = getPosition(date);
            const isBeforeReform = date < REFORM_DATE;
            const markerColor = getEventColor(event);
            const markerRing = getEventRing(event);

            return (
              <div
                key={event.id}
                className="absolute top-1/2 z-10"
                style={{ left: `${position}%` }}
              >
                {isBeforeReform && (
                  <div
                    className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 border-t border-dashed border-slate-500/70"
                    style={{ width: `${thresholdPosition - position}%` }}
                  />
                )}
                <button
                  type="button"
                  className={`relative flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full ${markerColor} ring-2 ${markerRing} ring-offset-2 ring-offset-slate-950 transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300`}
                  onClick={() => setSelectedEvent(event)}
                  aria-pressed={selectedEvent?.id === event.id}
                >
                  <span className="sr-only">{event.desc}</span>
                </button>
                <div className="mt-4 w-32 -translate-x-1/2 text-center text-[11px] text-slate-400">
                  <p className="font-semibold text-slate-200">{event.id}</p>
                  <p>{formatDate(event.fecha)}</p>
                </div>
              </div>
            );
          })}

          {selectedEvent && (
            <div
              className="absolute top-[68%] z-10 hidden w-64 -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-900/95 p-4 text-xs text-slate-200 shadow-xl md:block"
              style={{ left: `${activeEventPosition}%` }}
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                {selectedEvent.tipo}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {selectedEvent.desc}
              </p>
              <p className="mt-2 text-[11px] text-slate-400">
                Fecha: {formatDate(selectedEvent.fecha)}
              </p>
              {selectedEvent.estado && (
                <p className="mt-2 text-[11px] text-emerald-300">Estado: {selectedEvent.estado}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedEvent && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-200 md:hidden">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {selectedEvent.tipo}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{selectedEvent.desc}</p>
          <p className="mt-2 text-[11px] text-slate-400">Fecha: {formatDate(selectedEvent.fecha)}</p>
          {selectedEvent.estado && (
            <p className="mt-2 text-[11px] text-emerald-300">Estado: {selectedEvent.estado}</p>
          )}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Puede existir interrupción del plazo; este gráfico es orientativo.
      </p>
    </section>
  );
}
