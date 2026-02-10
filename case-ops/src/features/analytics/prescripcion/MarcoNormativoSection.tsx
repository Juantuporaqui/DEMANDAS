import type { ReactNode } from 'react';

interface MarcoNormativoItem {
  id: string;
  norma: string;
  texto: string;
  uso: string;
}

interface MarcoNormativoSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  items: MarcoNormativoItem[];
  actions?: ReactNode;
}

export function MarcoNormativoSection({ id, title, subtitle, items, actions }: MarcoNormativoSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm text-slate-200 print-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="break-words text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 break-words text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.norma}</p>
            <p className="mt-2 text-sm text-slate-200">{item.texto}</p>
            <p className="mt-3 text-xs text-emerald-200">Uso: {item.uso}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
