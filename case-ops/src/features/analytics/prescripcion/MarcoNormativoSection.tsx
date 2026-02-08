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
}

export function MarcoNormativoSection({ id, title, subtitle, items }: MarcoNormativoSectionProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 text-sm text-slate-200 print-card">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
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
