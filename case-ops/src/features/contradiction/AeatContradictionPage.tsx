import { AnalyticsLayout } from '../analytics/layout/AnalyticsLayout';
import { SplitContradictionView } from './SplitContradictionView';

export function AeatContradictionPage() {
  return (
    <AnalyticsLayout
      title="Contradicción Nuclear (AEAT)"
      subtitle="Demanda vs. declaración fiscal — Doctrina de los actos propios"
    >
      <SplitContradictionView />
    </AnalyticsLayout>
  );
}
