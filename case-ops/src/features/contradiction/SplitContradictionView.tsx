import { useState } from 'react';

export function SplitContradictionView() {
  const [activeTab, setActiveTab] = useState<'demanda' | 'aeat'>('demanda');

  return (
    <div className="space-y-6">
      <div className="flex w-full gap-2 rounded-full border border-slate-800/80 bg-slate-950/70 p-1 md:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('demanda')}
          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            activeTab === 'demanda'
              ? 'bg-rose-500/20 text-rose-100'
              : 'text-slate-400'
          }`}
        >
          Demanda
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('aeat')}
          className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
            activeTab === 'aeat'
              ? 'bg-emerald-500/20 text-emerald-100'
              : 'text-slate-400'
          }`}
        >
          AEAT
        </button>
      </div>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 text-center text-xs uppercase tracking-[0.2em] text-slate-400 md:hidden">
        Línea argumental: actos propios
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
        <section
          className={`space-y-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-slate-100 shadow-lg shadow-black/30 ${
            activeTab !== 'demanda' ? 'hidden md:block' : ''
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
            Demanda (placeholder)
          </div>
          <h3 className="text-lg font-semibold text-white">Texto citado</h3>
          <p className="text-sm text-rose-100/90">
            “destino a vivienda privativa”
          </p>
          <p className="text-xs text-rose-200/70">
            Bloque pendiente de sustituir por el fragmento real de la demanda.
          </p>
        </section>

        <div className="hidden md:flex flex-col items-center justify-center gap-2 text-center">
          <div className="h-16 w-px bg-slate-700/70" />
          <span className="rounded-full border border-slate-700/60 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Línea argumental: actos propios
          </span>
          <div className="h-16 w-px bg-slate-700/70" />
        </div>

        <section
          className={`space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-slate-100 shadow-lg shadow-black/30 ${
            activeTab !== 'aeat' ? 'hidden md:block' : ''
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            AEAT (placeholder)
          </div>
          <h3 className="text-lg font-semibold text-white">Texto citado</h3>
          <p className="text-sm text-emerald-100/90">
            “(pendiente) La AEAT confirma el destino a vivienda privativa...”
          </p>
          <p className="text-xs text-emerald-200/70">
            Bloque pendiente de sustituir por el párrafo de la AEAT.
          </p>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-xs text-slate-500">
        <span>Fuente: Doc X / pág Y (pendiente)</span>
        <span>Fuente: Doc X / pág Y (pendiente)</span>
      </div>
    </div>
  );
}
