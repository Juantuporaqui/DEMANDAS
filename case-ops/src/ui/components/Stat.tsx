import { textMuted, textPrimary } from '../tokens';

type StatProps = {
  label: string;
  value: string | number;
  delta?: string;
};

export default function Stat({ label, value, delta }: StatProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${textMuted}`}>
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`text-2xl font-bold tracking-tight count-enter ${textPrimary}`}>
          {value}
        </span>
        {delta ? (
          <span className="badge bg-white/[0.04] text-[var(--info)] border border-white/[0.06] text-xs">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
