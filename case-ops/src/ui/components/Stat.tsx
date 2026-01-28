import { textMuted, textPrimary } from '../tokens';

type StatProps = {
  label: string;
  value: string | number;
  delta?: string;
};

export default function Stat({ label, value, delta }: StatProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${textMuted}`}>
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`text-2xl font-semibold ${textPrimary}`}>{value}</span>
        {delta ? (
          <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
