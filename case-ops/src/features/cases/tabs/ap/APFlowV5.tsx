import { useMemo, useState } from 'react';
import { CopyButton } from '../../../analytics/prescripcion/CopyButton';
import { AP_V5_FLOW } from './apV5Blocks';
import { citationMap, type CitationEntry } from './citationsDataset';
import { CitationsModal } from './CitationsModal';

const order: Array<'A'|'B'|'C'|'D'|'E'|'F'> = ['A','B','C','D','E','F'];
const names: Record<(typeof order)[number], string> = {
  A: 'A — SANEAMIENTO',
  B: 'B — DEPURACIÓN DEL OBJETO / PASIVO / MALA FE',
  C: 'C — PRESCRIPCIÓN',
  D: 'D — HECHOS CONTROVERTIDOS (426 LEC)',
  E: 'E — PRUEBA (429 LEC)',
  F: 'F — CIERRE',
};

export function APFlowV5() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => Object.fromEntries(AP_V5_FLOW.map((c) => [c.id, c.enabledByDefault !== false])));
  const [citation, setCitation] = useState<CitationEntry | null>(null);

  const composer = useMemo(() => AP_V5_FLOW.filter((c) => enabled[c.id]).map((c) => `${c.title}\n${c.text}`).join('\n\n'), [enabled]);

  return (
    <section id="ap-v5-flow" className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-emerald-100">Comando AP (V5 v2) — flujo real A→F</h2>
        <div className="flex gap-2">
          <CopyButton text={composer} label="Copiar compositor" />
          <button className="rounded border border-emerald-400/60 px-3 py-1 text-xs text-emerald-100" onClick={() => window.print()}>Print AP</button>
        </div>
      </div>

      {order.map((s) => (
        <div key={s} className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-200">{names[s]}</h3>
          <div className="mt-3 space-y-2">
            {AP_V5_FLOW.filter((c) => c.section === s).map((card) => (
              <div key={card.id} className="rounded-lg border border-slate-700/60 bg-slate-900/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-white">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={enabled[card.id] ?? false}
                      onChange={(e) => setEnabled((prev) => ({ ...prev, [card.id]: e.target.checked }))}
                    />
                    {card.title}
                  </label>
                  <CopyButton text={`${card.title}\n${card.text}`} label="Copiar" />
                </div>
                <p className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{card.text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {card.citations.map((token) => (
                    <button
                      key={token}
                      type="button"
                      onClick={() => setCitation(citationMap.get(token) ?? null)}
                      className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-100"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <CitationsModal citation={citation} onClose={() => setCitation(null)} />
    </section>
  );
}
