interface TocItem {
  id: string;
  label: string;
  group?: boolean;
}

interface StickyTOCProps {
  title?: string;
  items: TocItem[];
}

function TocList({ items }: { items: TocItem[] }) {
  return (
    <ul className="space-y-1.5 text-sm text-slate-300">
      {items.map((item) =>
        item.group ? (
          <li key={item.id} className="mt-3 first:mt-0">
            <a
              href={`#${item.id}`}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              {item.label}
            </a>
          </li>
        ) : (
          <li key={item.id} className="pl-3 border-l border-slate-700/60">
            <a
              href={`#${item.id}`}
              className="text-xs text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              {item.label}
            </a>
          </li>
        )
      )}
    </ul>
  );
}

export function StickyTOC({ title = 'Índice', items }: StickyTOCProps) {
  return (
    <nav aria-label="Tabla de contenidos" className="space-y-4">
      <div className="hidden md:block">
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200 shadow-sm print-card">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</div>
          <div className="mt-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
            <TocList items={items} />
          </div>
        </div>
      </div>
      <details className="block rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200 shadow-sm md:hidden print-hidden">
        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">
          {title}
        </summary>
        <div className="mt-3 max-h-[calc(100vh-240px)] overflow-y-auto pr-2">
          <TocList items={items} />
        </div>
      </details>
    </nav>
  );
}
