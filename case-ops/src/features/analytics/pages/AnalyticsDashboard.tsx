import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { CourtCard } from '../components/CourtCard';
import { KpiCard } from '../components/KpiCard';
import { QuickActions } from '../components/QuickActions';
import { SectionCard } from '../components/SectionCard';
import { Timeline } from '../components/Timeline';
import { useAnalyticsMeta } from '../hooks/useAnalyticsMeta';
import { useAnalyticsComputed, getStatusLabel } from '../hooks/useAnalyticsComputed';
import { formatMoney, formatNumber } from '../utils/money';

export function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const { meta } = useAnalyticsMeta();
  const { totalCases, casesByStatus } = useAnalyticsComputed();
  const [modoJuicio, setModoJuicio] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    setModoJuicio(document.documentElement.classList.contains('modo-juicio'));
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('modo-juicio', modoJuicio);
    localStorage.setItem('case-ops:modo-juicio', String(modoJuicio));
  }, [modoJuicio]);

  const casesData = Object.entries(casesByStatus).map(([status, count]) => ({
    status,
    label: getStatusLabel(status),
    count,
  }));

  const activeCases = casesByStatus.activo ?? 0;
  const primaryCourt = meta?.courts?.[0]?.title ?? 'Picassent';
  const audienciaLabel = meta?.audienciaFecha
    ? `Audiencia previa · ${meta.audienciaFecha}`
    : 'Audiencia previa pendiente';
  const audienciaDetail =
    meta?.diasHastaVista !== null && meta?.diasHastaVista !== undefined
      ? `En ${meta.diasHastaVista} días`
      : 'Configura la fecha de audiencia';

  return (
    <AnalyticsLayout
      title="Chaladita.net"
      subtitle="Sistema de Soporte a Litigios"
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setModoJuicio((prev) => !prev)}
            className="rounded-full border border-slate-800/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
          >
            Modo Juicio {modoJuicio ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/analytics/admin')}
            className="rounded-full border border-emerald-400/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
          >
            Configurar analítica
          </button>
        </div>
      }
    >
      <section className="rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent px-5 py-3 text-sm text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-200">
            ⚠️
          </span>
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              {audienciaLabel} · {primaryCourt}
            </div>
            <div className="text-xs text-amber-100/80">{audienciaDetail}</div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Procedimientos activos"
          value={formatNumber(activeCases || totalCases)}
          helper={`${totalCases} casos en Dexie`}
          valueClassName="text-sky-300"
          labelClassName="text-slate-400"
          onClick={() => navigate(activeCases ? '/cases?status=activo' : '/cases')}
        />
        <KpiCard
          label="Total reclamado"
          value={formatMoney(meta?.totalReclamado)}
          helper="Meta configurable"
          valueClassName="text-rose-300"
          onClick={() => navigate('/analytics/admin')}
        />
        <KpiCard
          label="Estrategias activas"
          value={formatNumber(meta?.estrategiasActivas)}
          helper="Meta configurable"
          valueClassName="text-emerald-300"
          onClick={() => navigate('/analytics/admin')}
        />
        <KpiCard
          label="Días hasta vista"
          value={formatNumber(meta?.diasHastaVista)}
          helper={meta?.audienciaFecha ? `Audiencia: ${meta.audienciaFecha}` : 'Configurable'}
          valueClassName="text-amber-300"
          onClick={() => navigate('/analytics/admin')}
        />
      </section>

      <SectionCard
        title="Frentes judiciales"
        subtitle="Juzgados prioritarios y su estado"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {(meta?.courts ?? []).map((court) => (
            <CourtCard
              key={court.slug}
              court={court}
              icon={
                court.slug === 'picassent'
                  ? '⚖️'
                  : court.slug === 'quart'
                  ? '💼'
                  : court.slug === 'mislata'
                  ? '🛡️'
                  : '📁'
              }
              className={
                court.slug === 'picassent'
                  ? 'border-sky-400/40 bg-gradient-to-br from-sky-950/70 via-sky-900/60 to-slate-950/80'
                  : court.slug === 'quart'
                  ? 'border-amber-400/40 bg-gradient-to-br from-amber-950/40 via-amber-900/30 to-slate-950/80'
                  : court.slug === 'mislata'
                  ? 'border-violet-400/40 bg-gradient-to-br from-violet-950/60 via-violet-900/50 to-slate-950/80'
                  : 'border-slate-700/40 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-950/80'
              }
              badgeClassName={
                court.slug === 'picassent'
                  ? 'border-sky-400/30 bg-sky-400/10 text-sky-200'
                  : court.slug === 'quart'
                  ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                  : court.slug === 'mislata'
                  ? 'border-violet-400/30 bg-violet-400/10 text-violet-200'
                  : 'border-slate-400/30 bg-slate-400/10 text-slate-200'
              }
              onClick={() => navigate(`/analytics/${court.slug}`)}
            />
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Timeline
          items={meta?.lineaTemporal ?? []}
          onConfigure={() => navigate('/analytics/admin')}
        />
        <SectionCard
          title="Acceso rápido"
          subtitle="Atajos críticos de la operación"
        >
          <QuickActions />
          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={() => navigate('/analytics/hechos')}
              className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Desglose de hechos
            </button>
            <button
              type="button"
              onClick={() => navigate('/analytics/prescripcion')}
              className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Prescripción estratégica
            </button>
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Ir a casos
            </button>
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Documentos clave
            </button>
            <button
              type="button"
              onClick={() => navigate('/partidas')}
              className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-left text-sm font-semibold text-slate-200 transition hover:border-emerald-400/40"
            >
              Partidas económicas
            </button>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Casos por estado"
        subtitle="Distribución en tiempo real"
      >
        {casesData.length ? (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesData} margin={{ top: 16, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fill: '#cbd5f5', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(15,23,42,0.6)' }}
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(148,163,184,0.18)',
                    borderRadius: 12,
                    color: '#e2e8f0',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#34d399"
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => {
                    const status = data?.status as string | undefined;
                    if (!status || status === 'sin_estado') {
                      navigate('/cases');
                      return;
                    }
                    navigate(`/cases?status=${status}`);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-800/70 p-4 text-sm text-slate-400">
            No hay casos registrados todavía.
          </div>
        )}
      </SectionCard>
    </AnalyticsLayout>
  );
}
