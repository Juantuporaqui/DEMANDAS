import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { KpiCard } from '../components/KpiCard';
import { SectionCard } from '../components/SectionCard';
import { useAnalyticsMeta } from '../hooks/useAnalyticsMeta';
import { useAnalyticsComputed, getPartidaLabel } from '../hooks/useAnalyticsComputed';
import { formatMoney, formatNumber } from '../utils/money';

const filters = [
  { key: 'prescrita_interna', label: 'Prescrito' },
  { key: 'reclamable', label: 'Compensable' },
  { key: 'discutida', label: 'En disputa' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'sin_clasificar', label: 'Sin clasificar' },
];

export function HechosPage() {
  const navigate = useNavigate();
  const { meta } = useAnalyticsMeta();
  const { partidas, partidasByState } = useAnalyticsComputed();
  const [activeFilter, setActiveFilter] = useState<string>('');
  const totalPartidas = partidas.length;

  const filteredPartidas = useMemo(() => {
    if (!activeFilter) {
      return partidas;
    }
    return partidas.filter((partida) => (partida.state || 'sin_clasificar') === activeFilter);
  }, [activeFilter, partidas]);

  const totalReclamado = meta?.totalReclamado ?? null;

  return (
    <AnalyticsLayout
      title="Contador de la verdad"
      subtitle="Desglose económico y verificación de hechos"
      actions={
        <button
          type="button"
          onClick={() => navigate('/analytics')}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Volver al dashboard
        </button>
      }
    >
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total reclamado"
          value={formatMoney(totalReclamado)}
          helper="Meta configurable"
        />
        <KpiCard
          label="Riesgo real"
          value={formatMoney(meta?.riesgoReal)}
          helper="Meta configurable"
        />
        <KpiCard
          label="Objetivo estratégico"
          value={meta?.objetivoReduccionPct ? `${meta.objetivoReduccionPct}%` : '—'}
          helper="Reducción objetivo"
        />
      </section>

      <SectionCard title="Segmentación de partidas" subtitle="Clasificación por estado">
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() =>
                setActiveFilter((prev) => (prev === filter.key ? '' : filter.key))
              }
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                activeFilter === filter.key
                  ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                  : 'border-white/10 text-slate-300'
              }`}
            >
              {filter.label} ({formatNumber(partidasByState[filter.key] ?? 0)})
            </button>
          ))}
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full border border-white/10 bg-white/5">
          <div className="flex h-full w-full">
            {filters.map((filter) => {
              const count = partidasByState[filter.key] ?? 0;
              const width = totalPartidas ? (count / totalPartidas) * 100 : 0;
              return (
                <div
                  key={`bar-${filter.key}`}
                  style={{ width: `${width}%` }}
                  className="h-full bg-emerald-400/50"
                />
              );
            })}
          </div>
        </div>

        {partidas.length ? (
          <div className="mt-6 grid gap-4">
            {filteredPartidas.map((partida) => (
              <button
                key={partida.id}
                type="button"
                onClick={() => navigate(`/partidas/${partida.id}`)}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-emerald-400/40"
              >
                <div>
                  <div className="text-sm font-semibold text-white">
                    {partida.concept || 'Partida económica'}
                  </div>
                  <div className="text-xs text-slate-400">
                    Estado: {getPartidaLabel(partida.state)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-emerald-200">
                  {formatMoney(
                    partida.amountCents === null || partida.amountCents === undefined
                      ? null
                      : partida.amountCents / 100,
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-white/10 p-4 text-sm text-slate-400">
            No hay partidas cargadas todavía.
            <button
              type="button"
              onClick={() => navigate('/partidas/new')}
              className="ml-2 text-emerald-200 underline"
            >
              Añade una partida nueva
            </button>
          </div>
        )}
      </SectionCard>
    </AnalyticsLayout>
  );
}
