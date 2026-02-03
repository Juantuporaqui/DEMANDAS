import { useMemo, useState } from 'react';
import { AnalyticsLayout } from '../analytics/layout/AnalyticsLayout';
import { WaterfallChart } from './WaterfallChart';
import {
  COMPENSACION,
  COMPENSACION_BREAKDOWN,
  PASIVO_HIPOTECA,
  PRESCRITO,
  RECLAMACION_TOTAL,
} from './liquidacionDefaults';
import { formatEuro, formatPercent, roundTo } from './formatters';

const defaultValues = {
  reclamacionTotal: RECLAMACION_TOTAL,
  pasivoHipoteca: PASIVO_HIPOTECA,
  prescrito: PRESCRITO,
  compensacion: COMPENSACION,
};

export function FairLiquidationPage() {
  const [reclamacionTotal, setReclamacionTotal] = useState(defaultValues.reclamacionTotal);
  const [pasivoHipoteca, setPasivoHipoteca] = useState(defaultValues.pasivoHipoteca);
  const [prescrito, setPrescrito] = useState(defaultValues.prescrito);
  const [compensacion, setCompensacion] = useState(defaultValues.compensacion);

  const pasivo50 = useMemo(() => roundTo(pasivoHipoteca * 0.5, 2), [pasivoHipoteca]);
  const saldo = useMemo(
    () => roundTo(reclamacionTotal - prescrito - compensacion - pasivo50, 2),
    [reclamacionTotal, prescrito, compensacion, pasivo50]
  );

  const reductionPct = useMemo(() => {
    if (reclamacionTotal === 0) {
      return 0;
    }
    if (saldo <= 0) {
      return 100;
    }
    return roundTo((1 - saldo / reclamacionTotal) * 100, 1);
  }, [reclamacionTotal, saldo]);

  const steps = useMemo(
    () => [
      { label: 'Petición actora', value: reclamacionTotal, variant: 'base' as const },
      { label: 'Prescripción', value: -prescrito, variant: 'deduction' as const },
      { label: 'Compensación créditos', value: -compensacion, variant: 'deduction' as const },
      { label: '50% pasivo hipotecario no liquidado', value: -pasivo50, variant: 'deduction' as const },
      { label: 'Saldo resultante', value: saldo, variant: 'result' as const },
    ],
    [reclamacionTotal, prescrito, compensacion, pasivo50, saldo]
  );

  const handleRestore = () => {
    setReclamacionTotal(defaultValues.reclamacionTotal);
    setPasivoHipoteca(defaultValues.pasivoHipoteca);
    setPrescrito(defaultValues.prescrito);
    setCompensacion(defaultValues.compensacion);
  };

  const reductionCopy = saldo <= 0
    ? `Aplicando estos ajustes, la pretensión se reduce en ${formatPercent(100)}% y el saldo resultante es ${formatEuro(Math.abs(saldo))} a favor del demandado (según supuestos).`
    : `Aplicando estos ajustes, la pretensión se reduce en ${formatPercent(reductionPct)}% y el saldo resultante es ${formatEuro(saldo)} (orientativo).`;

  return (
    <AnalyticsLayout
      title="Calculadora de Liquidación Justa"
      subtitle="Resultado orientativo según estos parámetros (puede variar por interrupción/dies a quo)."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section className="space-y-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-lg shadow-black/30">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Parámetros de cálculo</h2>
              <p className="text-xs text-slate-400">Edita los supuestos y revisa el impacto en el saldo.</p>
            </div>
            <button
              type="button"
              onClick={handleRestore}
              className="rounded-full border border-amber-500/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 transition hover:border-amber-400 hover:text-amber-100"
            >
              Restaurar valores
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Reclamación total
              <input
                type="number"
                step="0.01"
                value={reclamacionTotal}
                onChange={event => setReclamacionTotal(Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-2 text-base font-semibold text-white"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Pasivo hipoteca
              <input
                type="number"
                step="0.01"
                value={pasivoHipoteca}
                onChange={event => setPasivoHipoteca(Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-2 text-base font-semibold text-white"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Prescrito
              <input
                type="number"
                step="0.01"
                value={prescrito}
                onChange={event => setPrescrito(Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-2 text-base font-semibold text-white"
              />
            </label>
            <label className="space-y-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Compensación
              <input
                type="number"
                step="0.01"
                value={compensacion}
                onChange={event => setCompensacion(Number(event.target.value) || 0)}
                className="w-full rounded-xl border border-slate-800/80 bg-slate-950/70 px-4 py-2 text-base font-semibold text-white"
              />
              <span className="block text-[11px] font-medium normal-case tracking-normal text-slate-500">
                Breakdown: {COMPENSACION_BREAKDOWN.map(item => formatEuro(item)).join(' + ')}
              </span>
            </label>
          </div>

          <div className="rounded-xl border border-slate-800/70 bg-slate-950/70 p-4 text-sm text-slate-200">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">50% pasivo</div>
                <div className="text-lg font-semibold text-amber-200">{formatEuro(pasivo50)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Saldo resultante</div>
                <div className="text-lg font-semibold text-emerald-200">{formatEuro(saldo)}</div>
              </div>
            </div>
          </div>

          <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            {reductionCopy}
          </p>
        </section>

        <section className="space-y-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 shadow-lg shadow-black/30">
          <div>
            <h2 className="text-lg font-semibold text-white">Waterfall de liquidación</h2>
            <p className="text-xs text-slate-400">Desglose visual del ajuste sobre la petición actora.</p>
          </div>

          <WaterfallChart steps={steps} total={reclamacionTotal} />

          <div className="overflow-hidden rounded-xl border border-slate-800/80">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Importe</th>
                  <th className="px-4 py-3">Signo</th>
                  <th className="px-4 py-3">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                <tr className="bg-slate-950/40">
                  <td className="px-4 py-3 font-semibold text-slate-200">Petición actora</td>
                  <td className="px-4 py-3 font-mono text-emerald-200">{formatEuro(reclamacionTotal)}</td>
                  <td className="px-4 py-3 text-slate-300">+</td>
                  <td className="px-4 py-3 text-slate-500">Base inicial declarada.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">Prescripción</td>
                  <td className="px-4 py-3 font-mono text-rose-200">{formatEuro(prescrito)}</td>
                  <td className="px-4 py-3 text-slate-300">-</td>
                  <td className="px-4 py-3 text-slate-500">Ajuste por periodos prescritos.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">Compensación créditos</td>
                  <td className="px-4 py-3 font-mono text-rose-200">{formatEuro(compensacion)}</td>
                  <td className="px-4 py-3 text-slate-300">-</td>
                  <td className="px-4 py-3 text-slate-500">Cruce de créditos recíprocos.</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-200">50% pasivo hipotecario no liquidado</td>
                  <td className="px-4 py-3 font-mono text-rose-200">{formatEuro(pasivo50)}</td>
                  <td className="px-4 py-3 text-slate-300">-</td>
                  <td className="px-4 py-3 text-amber-200">
                    Crucial para argumento de liquidación integral.
                  </td>
                </tr>
                <tr className="bg-slate-950/50">
                  <td className="px-4 py-3 font-semibold text-slate-200">Saldo resultante</td>
                  <td className="px-4 py-3 font-mono text-indigo-200">{formatEuro(saldo)}</td>
                  <td className="px-4 py-3 text-slate-300">{saldo >= 0 ? '+' : '-'}</td>
                  <td className="px-4 py-3 text-slate-500">Resultado orientativo.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AnalyticsLayout>
  );
}
