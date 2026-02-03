import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

export function InversionMercantilPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases';

  return (
    <AnalyticsLayout
      title="Inversión mercantil vs vivienda familiar: naturaleza del activo y compensación de frutos"
      subtitle="Separar ‘cargas familiares’ de inversión/rentabilidad y activar compensación por beneficios retenidos."
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
        <SectionCard title="Idea fuerza">
          <p className="text-sm text-slate-300">
            Línea defensiva: si el activo tiene perfil de inversión (rentabilidad, plusvalía o explotación), no encaja como vivienda familiar ni como “carga matrimonial” y deben aplicarse reglas de comunidad y compensación de frutos.
          </p>
        </SectionCard>

        <SectionCard title="Por qué NO es vivienda familiar (marcadores fácticos)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Enfoque de inversión: rentas, plusvalía o explotación como finalidad principal.</li>
            <li>Gestión orientada a rendimiento, no a uso habitual.</li>
            <li>Operativa de ingresos compatible con actividad mercantil o proindiviso.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Compensación operativa">
          <p className="text-sm text-slate-300">
            Si reclaman gastos pero retienen frutos o beneficios, pedir compensación: contabilidad completa de ingresos (turístico/agrícola u otros), liquidación cruzada y neteo en vez de reembolso lineal.
          </p>
        </SectionCard>

        <SectionCard title="Base legal (anclaje mínimo)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Comunidad ordinaria (arts. 392 y ss. CC) como mención general.</li>
            <li>Art. 408 LEC (compensación en contestación / excepción).</li>
            <li>Art. 217 LEC (carga de la prueba).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Qué pedir en AP">
          <p className="text-sm text-slate-300">
            Fijar hechos controvertidos: naturaleza del inmueble, existencia de rentas y gestión de ingresos. Solicitar diligencias o aportación de contabilidad si procede.
          </p>
        </SectionCard>

        <SectionCard title="Interrogatorio">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Referencia a declaración fiscal aportada por la defensa.</li>
            <li>Ingresos/beneficios no repartidos y su gestión.</li>
            <li>Por qué no aparecen en la demanda los frutos o rentas.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Resultado buscado">
          <p className="text-sm text-slate-300">
            Convertir reembolsos en neteo/compensación y reducir cuantías con una liquidación completa de ingresos y gastos.
          </p>
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
