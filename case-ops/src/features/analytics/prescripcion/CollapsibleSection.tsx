import { type ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'warning' | 'danger';
  forceOpen?: boolean;
}

const variantStyles = {
  default: 'border-slate-700/60 bg-slate-900/40',
  highlight: 'border-emerald-500/30 bg-emerald-500/5',
  warning: 'border-amber-500/30 bg-amber-500/5',
  danger: 'border-rose-500/30 bg-rose-500/5',
};

export function CollapsibleSection({
  id,
  title,
  subtitle,
  icon,
  badge,
  defaultOpen = false,
  children,
  variant = 'default',
  forceOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const isOpen = forceOpen || open;

  return (
    <section
      id={id}
      className={`scroll-mt-24 rounded-2xl border ${variantStyles[variant]} text-sm text-slate-200 print-card`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-4 sm:p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
        aria-expanded={isOpen}
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white">{title}</h2>
              {badge && (
                <span className="shrink-0 rounded-full border border-slate-600/60 bg-slate-800/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && <div className="border-t border-slate-700/40 p-4 sm:p-5">{children}</div>}
    </section>
  );
}
