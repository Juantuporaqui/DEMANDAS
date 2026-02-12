import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';
import { prescripcionPicassent } from '../../../content/prescripcion/picassent';
import { PrescripcionPlaybookPage } from '../prescripcion/PrescripcionPlaybookPage';

export function PrescripcionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedCaseId = (searchParams.get('caseId') || 'picassent').toLowerCase();
  const caseIdAliases: Record<string, string> = {
    picassent: 'picassent',
    cas001: 'picassent',
  };
  const caseId = caseIdAliases[requestedCaseId] ?? requestedCaseId;
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases/CAS001?tab=estrategia';
  const isPicassent = caseId === prescripcionPicassent.meta.caseId;

  return (
    <AnalyticsLayout
      title={prescripcionPicassent.meta.title}
      subtitle={prescripcionPicassent.hero.subtitle}
    >
      {!isPicassent ? (
        <SectionCard title="Prescripción" subtitle="Estado del caso">
          <div className="space-y-4 text-sm text-slate-300">
            <p>Prescripción todavía no preparada para este caso.</p>
            <button
              type="button"
              onClick={() => navigate(returnTo)}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
            >
              Volver al Caso
            </button>
          </div>
        </SectionCard>
      ) : (
        <PrescripcionPlaybookPage returnTo={returnTo} />
      )}
    </AnalyticsLayout>
  );
}
