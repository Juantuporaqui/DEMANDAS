import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

export function AntiSTS458Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases';

  return (
    <AnalyticsLayout
      title="Plan B: Anti-STS 458/2025 (distinguishing y límites)"
      subtitle="Si la contraria la invoca, limitar alcance por diferencias fácticas y exigibilidad por partidas."
      actions={
        <button
          type="button"
          onClick={() => navigate(returnTo)}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Volver
        </button>
      }
    >
      <div className="space-y-6">
        <SectionCard title="Cómo te la intentan colar">
          <p className="text-sm text-slate-300">
            Desplazar el dies a quo a la ruptura para reactivar partidas antiguas que, por fecha y exigibilidad, deberían estar prescritas.
          </p>
        </SectionCard>

        <SectionCard title="Diferencias-filtro">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Separación de bienes.</li>
            <li>Hechos patrimoniales/inversión.</li>
            <li>Exigibilidad individual por partidas.</li>
            <li>Falta de actos interruptivos específicos.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Regla práctica">
          <p className="text-sm text-slate-300">
            Sin fecha, exigibilidad, soporte e interrupción acreditada, no entra.
          </p>
        </SectionCard>

        <SectionCard title="Qué NO decir">
          <p className="text-sm text-slate-300">
            No apelar a “injusticia”; sí a identidad de razón, exigibilidad, carga probatoria y seguridad jurídica.
          </p>
        </SectionCard>

        <SectionCard title="Guion 60s">
          <p className="text-sm text-slate-300">
            “La STS 458/2025 se refiere a contextos distintos. Aquí hay separación de bienes y partidas con exigibilidad individual. Cada pretensión necesita fecha, concepto, soporte e interrupción específica. Si no existe, no procede desplazar el dies a quo a la ruptura. La carga probatoria es de quien reclama y la seguridad jurídica exige un límite claro.”
          </p>
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
