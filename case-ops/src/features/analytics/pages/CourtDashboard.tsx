import SectionTitle from '../../../ui/components/SectionTitle';
import Card from '../../../ui/components/Card';
import { textMuted } from '../../../ui/tokens';
import { ActionButton } from '../components/ActionButton';
import { Timeline } from '../components/Timeline';

const courtContent = {
  picassent: {
    title: 'Picassent',
    subtitle: 'Resumen operativo del juzgado',
  },
  quart: {
    title: 'Quart',
    subtitle: 'Panel para ejecución y demandas civiles',
  },
  mislata: {
    title: 'Mislata',
    subtitle: 'Seguimiento laboral y social',
  },
};

type CourtDashboardProps = {
  courtId: keyof typeof courtContent;
};

export function CourtDashboard({ courtId }: CourtDashboardProps) {
  const court = courtContent[courtId];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">{court.title}</h2>
        <p className={`text-sm ${textMuted}`}>{court.subtitle}</p>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <SectionTitle title="Estado del órgano" subtitle="Placeholder" />
          <p className="mt-4 text-sm text-zinc-600">
            Información destacada del juzgado. Aquí irán métricas de volumen,
            resoluciones y estado de procedimientos.
          </p>
        </Card>
        <Card className="p-5">
          <SectionTitle title="Riesgos" subtitle="Placeholder" />
          <p className="mt-4 text-sm text-zinc-600">
            Bloque para riesgos detectados, alertas y próximos vencimientos.
          </p>
        </Card>
      </section>

      <Timeline />

      <div className="flex flex-wrap gap-3">
        <ActionButton label="Volver a analytics" to="/analytics" tone="ghost" />
        <ActionButton label="Ver prescripción" to="/analytics/prescripcion" />
      </div>
    </div>
  );
}
