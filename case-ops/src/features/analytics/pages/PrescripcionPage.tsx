import Card from '../../../ui/components/Card';
import SectionTitle from '../../../ui/components/SectionTitle';
import { textMuted } from '../../../ui/tokens';

export function PrescripcionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Prescripción</h2>
        <p className={`text-sm ${textMuted}`}>
          Placeholder para cálculo y alertas de prescripción.
        </p>
      </div>

      <Card className="p-5">
        <SectionTitle title="Plazos clave" subtitle="Por definir" />
        <div className="mt-4 space-y-3 text-sm text-zinc-600">
          <div className="rounded-xl border border-dashed border-zinc-200/70 bg-zinc-50 px-4 py-3">
            Última interrupción: --
          </div>
          <div className="rounded-xl border border-dashed border-zinc-200/70 bg-zinc-50 px-4 py-3">
            Próximo vencimiento: --
          </div>
        </div>
      </Card>
    </div>
  );
}
