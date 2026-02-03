import { formatEuro } from './formatters';

export type WaterfallStep = {
  label: string;
  value: number;
  variant: 'base' | 'deduction' | 'result';
};

type WaterfallChartProps = {
  steps: WaterfallStep[];
  total: number;
};

const variantStyles: Record<WaterfallStep['variant'], string> = {
  base: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  deduction: 'bg-rose-500/15 text-rose-200 border-rose-500/30',
  result: 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40',
};

export function WaterfallChart({ steps, total }: WaterfallChartProps) {
  const maxValue = Math.max(total, ...steps.map(step => Math.abs(step.value))) || 1;

  return (
    <div className="space-y-4">
      {steps.map(step => {
        const widthPct = Math.max((Math.abs(step.value) / maxValue) * 100, 6);
        const sign = step.value < 0 ? '-' : '+';
        return (
          <div key={step.label} className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-slate-200">{step.label}</span>
              <span className="font-mono">
                {sign}
                {formatEuro(Math.abs(step.value))}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800/60">
              <div
                className={`h-3 rounded-full border ${variantStyles[step.variant]}`}
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
