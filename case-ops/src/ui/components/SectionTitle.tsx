import type { ReactNode } from 'react';
import { textMuted } from '../tokens';

type SectionTitleProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function SectionTitle({ title, subtitle, action }: SectionTitleProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        {subtitle ? (
          <p className={`mt-1 text-sm leading-relaxed ${textMuted}`}>{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
