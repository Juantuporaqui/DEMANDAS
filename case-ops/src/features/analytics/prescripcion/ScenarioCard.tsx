import { CopyButton } from './CopyButton';
import { LegalReferenceText } from './LegalReferenceText';

interface ScenarioCardProps {
  title: string;
  sostener: string;
  pedir: string[];
  riesgo: string;
  contramedida: string;
  onCopied: (text: string) => void;
  onScrollToGuion: () => void;
}

export function ScenarioCard({
  title,
  sostener,
  pedir,
  riesgo,
  contramedida,
  onCopied,
  onScrollToGuion,
}: ScenarioCardProps) {
  const copyText = [
    title,
    '',
    'P0 (inicio obligatorio): depuración del objeto + tabla verificable + carga de la prueba (art. 217 LEC).',
    '',
    'Qué sostener:',
    sostener,
    '',
    'Qué pedir (2 peticiones exactas):',
    ...pedir.map((item, index) => `${index + 1}) ${item}`),
    '',
    'Riesgo:',
    riesgo,
    '',
    'Contramedida:',
    contramedida,
  ].join('\n');

  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200 shadow-sm print-card">
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold text-indigo-300">Inicio obligatorio (P0)</div>
            <p className="text-xs break-words text-slate-300">
              <LegalReferenceText text="Depuración del objeto, tabla verificable por bloques A/B/C y carga de la prueba conforme al art. 217 LEC." />
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-emerald-300">Qué sostener</div>
            <p className="text-xs break-words text-slate-300"><LegalReferenceText text={sostener} /></p>
          </div>
          <div>
            <div className="text-xs font-semibold text-amber-300">Qué pedir (2 peticiones exactas)</div>
            <ul className="list-decimal space-y-1 pl-4 text-xs text-slate-300">
              {pedir.map((item) => (
                <li key={item}><LegalReferenceText text={item} /></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-rose-300">Riesgo</div>
            <p className="text-xs break-words text-slate-300"><LegalReferenceText text={riesgo} /></p>
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-300">Contramedida</div>
            <p className="text-xs break-words text-slate-300"><LegalReferenceText text={contramedida} /></p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyButton text={copyText} label="Copiar guion del escenario" onCopied={onCopied} />
        <button
          type="button"
          onClick={onScrollToGuion}
          className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:text-xs"
        >
          Abrir guion →
        </button>
      </div>
    </article>
  );
}
