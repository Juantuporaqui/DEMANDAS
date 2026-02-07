import type { ReactNode } from 'react';

type StatPillTone = 'ok' | 'warn' | 'danger' | 'info' | 'muted';

type StatPillProps = {
  label: string;
  value: string | number;
  tone?: StatPillTone;
  icon?: ReactNode;
};

const toneStyles: Record<StatPillTone, string> = {
  ok: 'text-[var(--ok)]',
  warn: 'text-[var(--warn)]',
  danger: 'text-[var(--danger)]',
  info: 'text-[var(--info)]',
  muted: 'text-[var(--muted)]',
};

export default function StatPill({ label, value, tone = 'muted', icon }: StatPillProps) {
  return (
    <div className="card-base card-subtle px-3 sm:px-4 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3">
      <div className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] uppercase tracking-[0.1em] font-medium text-[var(--muted)]">
        {icon ? <span className={toneStyles[tone]}>{icon}</span> : null}
        {label}
      </div>
      <div className={`text-base sm:text-lg font-bold tracking-tight ${toneStyles[tone]}`}>{value}</div>
    </div>
  );
}
