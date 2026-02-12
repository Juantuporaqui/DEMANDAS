import { useMemo, useState } from 'react';
import { Modal } from '../../../components/Modal';
import { CopyButton } from './CopyButton';
import { LegalReferenceText } from './LegalReferenceText';
import { AP_STACK_ITEMS, type APStackItem } from './apStack';

interface APStackSectionProps {
  onCopied: (text: string) => void;
}

function buildCopyText(item: APStackItem) {
  return [
    `${item.id} — ${item.title}`,
    '',
    `Tesis: ${item.tesis}`,
    '',
    'Qué pedir en AP:',
    `1) ${item.pedir[0]}`,
    `2) ${item.pedir[1]}`,
    '',
    'Cómo se prueba:',
    ...item.prueba.map((entry) => `- ${entry}`),
    '',
    'Frase para sala:',
    item.fraseSala,
  ].join('\n');
}

export function APStackSection({ onCopied }: APStackSectionProps) {
  const [active, setActive] = useState<APStackItem | null>(null);
  const rankingText = useMemo(
    () => AP_STACK_ITEMS.map((item) => `${item.id}: ${item.title}`).join('\n'),
    []
  );

  return (
    <section id="stack-ap" className="scroll-mt-24 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 print-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">STACK AP (orden de uso)</h2>
          <p className="text-sm text-indigo-100/90">Orden rector para vista, guiones y versión de impresión.</p>
        </div>
        <CopyButton text={rankingText} label="Copiar ranking" onCopied={onCopied} />
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {AP_STACK_ITEMS.map((item) => (
          <article key={item.id} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-3 text-sm text-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">{item.id}</p>
            <h3 className="mt-1 font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-xs text-slate-300">
              <LegalReferenceText text={item.tesis} />
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActive(item)}
                className="rounded-full border border-indigo-400/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-100"
              >
                Abrir ficha
              </button>
              <CopyButton text={buildCopyText(item)} label="Copiar" onCopied={onCopied} />
            </div>
          </article>
        ))}
      </div>

      <Modal
        isOpen={Boolean(active)}
        onClose={() => setActive(null)}
        title={active ? `${active.id} — ${active.title}` : 'Ficha argumental'}
        footer={
          active ? <CopyButton text={buildCopyText(active)} label="Copiar ficha" onCopied={onCopied} /> : null
        }
      >
        {active ? (
          <div className="space-y-4 text-sm text-slate-200">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Tesis</p>
              <p className="mt-1"><LegalReferenceText text={active.tesis} /></p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Qué pedir en AP</p>
              <ol className="mt-1 list-decimal space-y-1 pl-5">
                {active.pedir.map((entry) => (
                  <li key={entry}><LegalReferenceText text={entry} /></li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Cómo se prueba</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {active.prueba.map((entry) => (
                  <li key={entry}><LegalReferenceText text={entry} /></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Frase para sala</p>
              <p className="mt-1"><LegalReferenceText text={active.fraseSala} /></p>
            </div>
          </div>
        ) : null}
      </Modal>
    </section>
  );
}
