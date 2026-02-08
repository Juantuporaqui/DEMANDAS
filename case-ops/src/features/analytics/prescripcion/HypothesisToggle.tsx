import type { ReactNode } from 'react';

const options = [
  {
    id: 'H1',
    label: 'H1',
    title: 'Regla general',
    subtitle: 'Actio nata por pago (regla general).',
  },
  {
    id: 'H2',
    label: 'H2',
    title: 'STS 458/2025',
    subtitle: 'Dies a quo desplazado, si procede.',
  },
] as const;

type HypothesisValue = (typeof options)[number]['id'];

interface HypothesisToggleProps {
  value: HypothesisValue;
  onChange: (value: HypothesisValue) => void;
  hint?: ReactNode;
}

export function HypothesisToggle({ value, onChange, hint }: HypothesisToggleProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => {
          const isActive = value === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                isActive
                  ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-100'
                  : 'border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-slate-500/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Hipótesis {option.label}</span>
                {isActive && (
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                    Activa
                  </span>
                )}
              </div>
              <p className="mt-2 text-base font-semibold text-white">{option.title}</p>
              <p className="mt-1 text-xs text-slate-400">{option.subtitle}</p>
            </button>
          );
        })}
      </div>
      {hint ? (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-3 text-xs text-slate-300">
          {hint}
        </div>
      ) : null}
    </div>
  );
}
