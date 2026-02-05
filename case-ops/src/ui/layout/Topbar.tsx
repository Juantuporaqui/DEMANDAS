import type { ReactNode } from 'react';
import { accent, appMaxWidth, textMuted } from '../tokens';

type TopbarProps = {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
};

export default function Topbar({ title = 'Case Ops', subtitle = 'Legal-tech workspace', actions }: TopbarProps) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-white/[0.06]"
      style={{
        background: 'rgba(10, 15, 26, 0.82)',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
      }}
    >
      <div
        className="mx-auto flex w-full items-center justify-between gap-4 px-5 py-4 md:px-8"
        style={{ maxWidth: appMaxWidth }}
      >
        <div>
          <div className={`text-lg font-semibold tracking-tight ${accent}`}>{title}</div>
          <div className={`text-[11px] uppercase tracking-[0.15em] ${textMuted}`}>
            {subtitle}
          </div>
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
