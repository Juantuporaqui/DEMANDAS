import Card from '../../../ui/components/Card';
import SectionTitle from '../../../ui/components/SectionTitle';
import { textMuted } from '../../../ui/tokens';

const placeholderRows = [
  { id: 'h1', label: 'Hechos controvertidos', value: '--' },
  { id: 'h2', label: 'Hechos a probar', value: '--' },
  { id: 'h3', label: 'Hechos admitidos', value: '--' },
];

export function HechosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          Desglose de hechos
        </h2>
        <p className={`text-sm ${textMuted}`}>
          Contador de verdad (placeholder).
        </p>
      </div>

      <Card className="p-5">
        <SectionTitle title="Resumen" subtitle="Sin cálculos aún" />
        <div className="mt-4 space-y-3">
          {placeholderRows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between rounded-xl border border-dashed border-zinc-200/70 bg-zinc-50 px-4 py-3 text-sm"
            >
              <span className="font-medium text-zinc-700">{row.label}</span>
              <span className="font-semibold text-zinc-500">{row.value}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
