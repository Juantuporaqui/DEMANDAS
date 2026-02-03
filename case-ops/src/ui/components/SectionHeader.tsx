import type { ReactNode } from 'react';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  kicker?: string;
};

export default function SectionHeader({ title, subtitle, action, kicker }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        {kicker ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
            {kicker}
          </p>
        ) : null}
        <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--muted)] leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
