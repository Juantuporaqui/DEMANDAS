import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/schema';
import SectionTitle from '../../../ui/components/SectionTitle';
import { ActionButton } from '../components/ActionButton';
import { CourtCard } from '../components/CourtCard';
import { KpiCard } from '../components/KpiCard';
import { Timeline } from '../components/Timeline';

export function AnalyticsDashboardPage() {
  const kpis = useLiveQuery(async () => {
    const [partidasCount, factsCount, strategiesCount, eventsCount] =
      await Promise.all([
        db.partidas.count(),
        db.facts.count(),
        db.strategies.count(),
        db.events.count(),
      ]);

    return {
      partidasCount,
      factsCount,
      strategiesCount,
      eventsCount,
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total reclamado"
          value={kpis?.partidasCount ?? 0}
          helper="Registros Dexie (placeholder)"
        />
        <KpiCard
          label="Riesgo"
          value={kpis?.factsCount ?? 0}
          helper="Hechos en tabla"
        />
        <KpiCard
          label="Estrategias activas"
          value={kpis?.strategiesCount ?? 0}
          helper="Estrategias en curso"
        />
        <KpiCard
          label="Días a vista"
          value={kpis?.eventsCount ?? 0}
          helper="Eventos registrados"
        />
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Juzgados"
          subtitle="Acceso rápido a paneles por órgano"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          <CourtCard
            title="Picassent"
            subtitle="Juzgado mixto · Vista ordinaria"
            amountLabel="€ --"
            to="/analytics/picassent"
          />
          <CourtCard
            title="Quart"
            subtitle="Ejecución hipotecaria"
            amountLabel="€ --"
            to="/analytics/quart"
          />
          <CourtCard
            title="Mislata"
            subtitle="Social · Laboral"
            amountLabel="€ --"
            to="/analytics/mislata"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Timeline />
        <div className="space-y-4">
          <SectionTitle
            title="Accesos rápidos"
            subtitle="Atajos para secciones clave"
          />
          <div className="flex flex-col gap-3">
            <ActionButton label="Ver prescripción" to="/analytics/prescripcion" />
            <ActionButton label="Desglose de hechos" to="/analytics/hechos" />
            <ActionButton label="Abrir casos" to="/cases" tone="ghost" />
          </div>
        </div>
      </section>
    </div>
  );
}
