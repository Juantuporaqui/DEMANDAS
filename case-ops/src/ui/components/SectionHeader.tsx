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
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--dim)] mb-1.5 flex items-center gap-2">
            <span className="accent-line" />
            {kicker}
          </p>
        ) : null}
        <h2 className="text-[22px] font-semibold tracking-tight text-gradient-premium">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 text-sm text-[var(--muted)] leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
