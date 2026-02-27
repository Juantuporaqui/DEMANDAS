import type { CitationEntry } from './citationsDataset';

type Props = {
  citation: CitationEntry | null;
  onClose: () => void;
};

export function CitationsModal({ citation, onClose }: Props) {
  if (!citation) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{citation.label}</h3>
          <button onClick={onClose} className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200">Cerrar</button>
        </div>
        <div className="mt-3 text-xs text-slate-200">Tipo: {citation.type}</div>
        <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-950 p-3 text-xs text-slate-100">{citation.snippet}</pre>
        <p className="mt-2 text-[11px] text-slate-400">Source: internal dataset</p>
      </div>
    </div>
  );
}
