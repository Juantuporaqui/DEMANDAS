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
        Doctrina de los actos propios — No puede contradecir sus propias declaraciones fiscales
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
        <section
          className={`space-y-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6 text-slate-100 shadow-lg shadow-black/30 ${
            activeTab !== 'demanda' ? 'hidden md:block' : ''
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
            Demanda P.O. 715/2024 — Hecho 1
          </div>
          <h3 className="text-lg font-semibold text-white">Texto citado</h3>
          <p className="text-sm text-rose-100/90">
            &ldquo;La actora afirma que los préstamos personales BBVA se cancelaron con dinero
            privativo procedente de la venta de su casa en Mislata, por lo que existiría un
            crédito de 20.085&thinsp;€ a su favor.&rdquo;
          </p>
          <p className="text-xs text-rose-200/70">
            Demanda, Hecho Primero, pág. 3-4
          </p>
        </section>

        <div className="hidden md:flex flex-col items-center justify-center gap-2 text-center">
          <div className="h-16 w-px bg-slate-700/70" />
          <span className="rounded-full border border-slate-700/60 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            Doctrina de los actos propios — No puede contradecir sus propias declaraciones fiscales
          </span>
          <div className="h-16 w-px bg-slate-700/70" />
        </div>

        <section
          className={`space-y-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-slate-100 shadow-lg shadow-black/30 ${
            activeTab !== 'aeat' ? 'hidden md:block' : ''
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            Declaración ante la AEAT — Doc. 4
          </div>
          <h3 className="text-lg font-semibold text-white">Texto citado</h3>
          <p className="text-sm text-emerald-100/90">
            &ldquo;Ante Hacienda, la propia actora reconoció que los préstamos estaban vinculados
            a la construcción del chalet común en Montroy, no a una &lsquo;venta
            privativa&rsquo;. El destino real de los fondos era el proyecto inmobiliario
            conjunto.&rdquo;
          </p>
          <p className="text-xs text-emerald-200/70">
            Doc. 4 — Respuesta requerimiento Hacienda
          </p>
        </section>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-xs text-slate-500">
        <span>Fuente: Demanda P.O. 715/2024, Hecho 1º</span>
        <span>Fuente: Doc. 4 — Declaración AEAT</span>
      </div>
    </div>
  );
}
