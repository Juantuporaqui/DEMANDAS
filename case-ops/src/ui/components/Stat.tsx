import { textMuted, textPrimary } from '../tokens';

type StatProps = {
  label: string;
  value: string | number;
  delta?: string;
};

export default function Stat({ label, value, delta }: StatProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${textMuted}`}>
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-3">
        <span className={`text-2xl font-semibold tracking-tight ${textPrimary}`}>
          {value}
        </span>
        {delta ? (
          <span className="badge bg-slate-800 text-blue-400 border border-slate-700/50">
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  );
}
