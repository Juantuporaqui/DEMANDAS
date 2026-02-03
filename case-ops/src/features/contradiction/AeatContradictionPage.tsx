import { AnalyticsLayout } from '../analytics/layout/AnalyticsLayout';
import { SplitContradictionView } from './SplitContradictionView';

export function AeatContradictionPage() {
  return (
    <AnalyticsLayout
      title="Contradicción Nuclear (AEAT)"
      subtitle="Vista comparativa en preparación. Contenido real pendiente de integrar."
    >
      <SplitContradictionView />
    </AnalyticsLayout>
  );
}
