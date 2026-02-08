import { useNavigate, useSearchParams } from 'react-router-dom';
import { antiSts458 } from '../../../content/prescripcion/antiSts458';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

export function AntiSTS458Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases';

  const ordenColorMap: Record<string, string> = {
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    yellow: 'bg-yellow-600',
    green: 'bg-green-600',
  };

  const argumentoBorderMap: Record<string, string> = {
    'arg-1': 'border-red-500/40',
    'arg-2': 'border-orange-500/40',
    'arg-3': 'border-yellow-500/40',
    'arg-4': 'border-emerald-500/40',
  };

  return (
    <AnalyticsLayout
      title={antiSts458.title}
      subtitle={antiSts458.subtitle}
      actions={
        <button
          type="button"
          onClick={() => navigate(returnTo)}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Volver
        </button>
      }
    >
      <div className="space-y-6">
        {/* QUÉ DICE LA STS 458/2025 */}
        <SectionCard title={antiSts458.introSentencia}>
          <div className="space-y-3 text-sm text-slate-300">
            {antiSts458.quotes.map((quote) => (
              <p key={quote} className="border-l-2 border-red-500/50 pl-3 italic text-red-300">
                {quote}
              </p>
            ))}
            <p className="mt-2 text-amber-300 font-medium">{antiSts458.casoSTS}</p>
          </div>
        </SectionCard>

        {antiSts458.argumentos.map((argumento) => (
          <SectionCard
            key={argumento.id}
            title={`${argumento.title} (${argumento.score})`}
            className={argumentoBorderMap[argumento.id] ?? 'border-slate-700/60'}
          >
            <div className="space-y-3 text-sm text-slate-300">
              {argumento.summary && <p className="font-semibold text-emerald-400">{argumento.summary}</p>}
              {argumento.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {argumento.fraseSala && (
                <div className="mt-3 rounded-lg border border-emerald-700/40 bg-emerald-900/30 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {argumento.fraseSalaLabel ?? 'Frase para sala'}
                  </p>
                  <p className="italic text-emerald-200">{argumento.fraseSala}</p>
                </div>
              )}
              {argumento.notice && (
                <div className="mt-3 rounded-lg border border-amber-700/40 bg-amber-900/30 p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                    {argumento.noticeLabel ?? 'Uso correcto'}
                  </p>
                  <p className="text-amber-200">{argumento.notice}</p>
                </div>
              )}
            </div>
          </SectionCard>
        ))}

        <SectionCard title="Tabla comparativa">
          <div className="overflow-x-auto rounded-lg border border-slate-700/60 bg-slate-900/60">
            <table className="w-full min-w-[640px] text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-[11px] uppercase text-slate-400">
                <tr>
                  {antiSts458.tablaDistinguishing.headers.map((header) => (
                    <th key={header} className="border-b border-slate-700/60 px-3 py-2">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {antiSts458.tablaDistinguishing.rows.map((row, rowIndex) => (
                  <tr key={`${row[0]}-${rowIndex}`} className="align-top">
                    {row.map((cell, cellIndex) => (
                      <td key={`${cell}-${cellIndex}`} className="px-3 py-3 text-slate-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        {/* ORDEN DE INTERVENCIÓN */}
        <SectionCard title={antiSts458.ordenIntervencion.title}>
          <div className="space-y-2 text-sm text-slate-300">
            {antiSts458.ordenIntervencion.items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
                <span
                  className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold text-white ${
                    ordenColorMap[item.tone] ?? 'bg-slate-600'
                  }`}
                >
                  {item.orden}
                </span>
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* GUION COMPLETO 2 MINUTOS */}
        <SectionCard title={antiSts458.guion.title}>
          <div className="space-y-3 rounded-lg border border-slate-600/30 bg-slate-800/70 p-4 text-sm text-slate-200 leading-relaxed">
            {antiSts458.guion.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </SectionCard>

        {/* QUÉ NO DECIR */}
        <SectionCard title={antiSts458.noDecir.title}>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            {antiSts458.noDecir.items.map((item) => (
              <li key={item.id}>
                <span className="font-medium text-red-400">{item.label}</span> — {item.detail}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
