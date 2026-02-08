import type { ReactNode } from 'react';

interface ErrorFatalItem {
  id: string;
  title?: string;
  mal: string;
  bien: string;
}

interface ErroresFatalesSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  items: ErrorFatalItem[];
  actions?: ReactNode;
}

export function ErroresFatalesSection({ id, title, subtitle, items, actions }: ErroresFatalesSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-sm text-slate-200 print-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
            {item.title ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.title}</p>
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-300">Mal</p>
            <p className="mt-2 text-sm text-slate-200">{item.mal}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Bien</p>
            <p className="mt-2 text-sm text-slate-200">{item.bien}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
