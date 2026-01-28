import Card from '../../../ui/components/Card';
import Stat from '../../../ui/components/Stat';
import { textMuted } from '../../../ui/tokens';

type KpiCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

export function KpiCard({ label, value, helper }: KpiCardProps) {
  return (
    <Card className="p-5">
      <Stat label={label} value={value} />
      {helper ? <p className={`mt-3 text-xs ${textMuted}`}>{helper}</p> : null}
    </Card>
  );
}
