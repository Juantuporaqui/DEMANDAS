interface TocItem {
  id: string;
  label: string;
}

interface StickyTOCProps {
  title?: string;
  items: TocItem[];
}

export function StickyTOC({ title = 'Índice', items }: StickyTOCProps) {
  return (
    <nav aria-label="Tabla de contenidos" className="space-y-4">
      <div className="hidden md:block">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200 shadow-sm print-card">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</div>
          <ul className="mt-3 max-h-[calc(100vh-200px)] space-y-2 overflow-y-auto pr-2 text-sm text-slate-300">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <details className="block rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200 shadow-sm md:hidden print-hidden">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">
          {title}
        </summary>
        <ul className="mt-3 max-h-[calc(100vh-240px)] space-y-2 overflow-y-auto pr-2 text-sm text-slate-300">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
