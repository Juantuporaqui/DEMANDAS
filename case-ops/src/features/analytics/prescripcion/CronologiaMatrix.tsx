type HypothesisValue = 'H1' | 'H2';

type CronologiaTramo = {
  id: string;
  rango: string;
  descripcion: string;
  estadoH1: string;
  estadoH2: string;
  nota?: string;
};

interface CronologiaMatrixProps {
  id?: string;
  title: string;
  subtitle?: string;
  tramos: CronologiaTramo[];
  activeHypothesis: HypothesisValue;
}

const estadoBadgeMap: Record<string, string> = {
  PRESCRITO: 'bg-red-500/20 text-red-200 border-red-500/40',
  'NO PRESCRITO': 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  'CAMPO DE BATALLA': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
};

function EstadoBadge({ label, isActive }: { label: string; isActive?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
        estadoBadgeMap[label] ?? 'border-slate-600/60 bg-slate-800/60 text-slate-200'
      } ${isActive ? 'shadow-[0_0_12px_rgba(16,185,129,0.25)]' : ''}`}
    >
      {label}
    </span>
  );
}

export function CronologiaMatrix({ id, title, subtitle, tramos, activeHypothesis }: CronologiaMatrixProps) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
          Carril activo: {activeHypothesis}
        </span>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs text-slate-300">
          <thead className="text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Tramo</th>
              <th className="px-3 py-2">Descripción</th>
              <th className={`px-3 py-2 ${activeHypothesis === 'H1' ? 'text-emerald-300' : ''}`}>H1</th>
              <th className={`px-3 py-2 ${activeHypothesis === 'H2' ? 'text-emerald-300' : ''}`}>H2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {tramos.map((tramo) => (
              <tr key={tramo.id} className="align-top">
                <td className="px-3 py-3 font-semibold text-slate-100">{tramo.rango}</td>
                <td className="px-3 py-3">
                  <p className="text-slate-300">{tramo.descripcion}</p>
                  {tramo.nota ? <p className="mt-2 text-[11px] text-slate-400">{tramo.nota}</p> : null}
                </td>
                <td className="px-3 py-3">
                  <EstadoBadge label={tramo.estadoH1} isActive={activeHypothesis === 'H1'} />
                </td>
                <td className="px-3 py-3">
                  <EstadoBadge label={tramo.estadoH2} isActive={activeHypothesis === 'H2'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
