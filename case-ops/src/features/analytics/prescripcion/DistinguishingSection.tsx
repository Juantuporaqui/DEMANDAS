import { antiSts458 } from '../../../content/prescripcion/antiSts458';
import { CopyButton } from './CopyButton';
import { LegalReferenceText } from './LegalReferenceText';

type HypothesisValue = 'H1' | 'H2';

interface DistinguishingSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  activeHypothesis: HypothesisValue;
  returnTo: string;
  onCopied: (text: string) => void;
}

const argumentoToneMap: Record<string, string> = {
  'arg-1': 'border-red-500/40 bg-red-500/5',
  'arg-2': 'border-orange-500/40 bg-orange-500/5',
  'arg-3': 'border-yellow-500/40 bg-yellow-500/5',
  'arg-4': 'border-emerald-500/40 bg-emerald-500/5',
};

export function DistinguishingSection({
  id,
  title,
  subtitle,
  intro,
  activeHypothesis,
  returnTo,
  onCopied,
}: DistinguishingSectionProps) {
  const link = `/analytics/anti-sts-458-2025?returnTo=${encodeURIComponent(returnTo)}`;

  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 break-words text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <a
          href={link}
          className="max-w-full rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200"
        >
          Abrir versión extendida
        </a>
      </div>
      {intro ? <p className="mt-3 break-words text-sm text-slate-300"><LegalReferenceText text={intro} /></p> : null}
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {antiSts458.argumentos.map((argumento) => (
          <div
            key={argumento.id}
            className={`rounded-2xl border p-4 ${argumentoToneMap[argumento.id] ?? 'border-slate-700/60'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {argumento.score ? `Prioridad ${argumento.score}` : 'Prioridad'}
                </p>
                <h3 className="mt-2 break-words text-sm font-semibold text-white">{argumento.title}</h3>
              </div>
              <span className="shrink-0 rounded-full border border-slate-600/60 bg-slate-800/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                {activeHypothesis === 'H2' ? 'Plan B activo' : 'Plan A activo'}
              </span>
            </div>
            {argumento.summary ? <p className="mt-3 text-sm text-slate-300"><LegalReferenceText text={argumento.summary} /></p> : null}
            <div className="mt-3 space-y-2 text-xs text-slate-300">
              {argumento.paragraphs.slice(0, 2).map((paragraph) => (
                <p key={paragraph}><LegalReferenceText text={paragraph} /></p>
              ))}
            </div>
            {argumento.fraseSala ? (
              <div className="mt-4 rounded-xl border border-emerald-700/40 bg-emerald-900/30 p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    {argumento.fraseSalaLabel ?? 'Frase para sala'}
                  </p>
                  <CopyButton text={argumento.fraseSala} label="Copiar" onCopied={onCopied} />
                </div>
                <p className="mt-2 text-xs italic text-emerald-200"><LegalReferenceText text={argumento.fraseSala} /></p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
          Tabla comparativa (STS 458 vs nuestro caso)
        </h3>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-slate-700/60 bg-slate-900/60">
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
                      <LegalReferenceText text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
