import { Link } from 'react-router-dom';
import Card from '../../../ui/components/Card';
import { textMuted } from '../../../ui/tokens';
import { AmountBadge } from './AmountBadge';

type CourtCardProps = {
  title: string;
  subtitle: string;
  amountLabel: string;
  to: string;
};

export function CourtCard({ title, subtitle, amountLabel, to }: CourtCardProps) {
  return (
    <Link to={to} className="block">
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{title}</h3>
            <p className={`text-sm ${textMuted}`}>{subtitle}</p>
          </div>
          <AmountBadge>{amountLabel}</AmountBadge>
        </div>
        <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.2em] text-zinc-500">
          <span>Ver detalle</span>
          <span>→</span>
        </div>
      </Card>
    </Link>
  );
}
