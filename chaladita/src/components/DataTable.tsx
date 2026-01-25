import type { GastoPersonal } from '../types';

interface DataTableProps {
  data: GastoPersonal[];
  title?: string;
  showTotal?: boolean;
}

export function DataTable({ data, title, showTotal = true }: DataTableProps) {
  const total = data.reduce((sum, item) => sum + item.importe, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700">
      {title && (
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
          <h3 className="font-semibold">{title}</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-800/50">
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Concepto</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Categoría</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Importe</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{item.concepto}</p>
                  {item.documentoRef && (
                    <p className="text-xs text-slate-500 mt-0.5">{item.documentoRef}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{item.categoria}</td>
                <td className="px-4 py-3 text-right font-mono">
                  {item.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            ))}
          </tbody>
          {showTotal && (
            <tfoot>
              <tr className="bg-slate-800 font-semibold">
                <td colSpan={2} className="px-4 py-3 text-right">Total:</td>
                <td className="px-4 py-3 text-right font-mono text-emerald-400">
                  {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

interface ComparisonTableProps {
  title: string;
  rows: { label: string; value1: string | number; value2: string | number; highlight?: boolean }[];
  header1: string;
  header2: string;
}

export function ComparisonTable({ title, rows, header1, header2 }: ComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700">
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-slate-800/50">
            <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Concepto</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-emerald-400">{header1}</th>
            <th className="text-right px-4 py-3 text-sm font-medium text-red-400">{header2}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={`${row.highlight ? 'bg-amber-500/10' : 'hover:bg-slate-800/30'} transition-colors`}
            >
              <td className="px-4 py-3 font-medium">{row.label}</td>
              <td className="px-4 py-3 text-right font-mono text-emerald-400">
                {typeof row.value1 === 'number'
                  ? row.value1.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                  : row.value1}
              </td>
              <td className="px-4 py-3 text-right font-mono text-red-400">
                {typeof row.value2 === 'number'
                  ? row.value2.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
                  : row.value2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
