import { Fragment, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from '../../../components/Modal';
import { getReferenceMatchers, type LegalReference } from './legalReferences';

interface LegalReferenceTextProps {
  text: string;
  className?: string;
}

function tokenize(text: string): Array<{ type: 'text' | 'ref'; value: string; ref?: LegalReference }> {
  const matchers = getReferenceMatchers().filter((item) => item.ref);
  let remaining = text;
  const tokens: Array<{ type: 'text' | 'ref'; value: string; ref?: LegalReference }> = [];

  while (remaining.length > 0) {
    let earliest: { index: number; match: string; ref: LegalReference } | null = null;

    matchers.forEach((matcher) => {
      if (!matcher.ref) return;
      matcher.regex.lastIndex = 0;
      const result = matcher.regex.exec(remaining);
      if (!result) return;
      if (!earliest || result.index < earliest.index) {
        earliest = { index: result.index, match: result[0], ref: matcher.ref };
      }
    });

    if (!earliest) {
      tokens.push({ type: 'text', value: remaining });
      break;
    }

    if (earliest.index > 0) {
      tokens.push({ type: 'text', value: remaining.slice(0, earliest.index) });
    }

    tokens.push({ type: 'ref', value: earliest.match, ref: earliest.ref });
    remaining = remaining.slice(earliest.index + earliest.match.length);
  }

  return tokens;
}

export function LegalReferenceText({ text, className }: LegalReferenceTextProps) {
  const tokens = useMemo(() => tokenize(text), [text]);
  const [activeRef, setActiveRef] = useState<LegalReference | null>(null);
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId') || 'picassent';
  const returnTo = searchParams.get('returnTo') || '/cases/CAS001?tab=estrategia';

  return (
    <>
      <span className={className}>
        {tokens.map((token, index) => {
          if (token.type === 'text' || !token.ref) {
            return <Fragment key={`${token.value}-${index}`}>{token.value}</Fragment>;
          }

          return (
            <button
              key={`${token.value}-${index}`}
              type="button"
              onClick={() => setActiveRef(token.ref ?? null)}
              className="font-semibold text-emerald-300 underline decoration-dotted underline-offset-2 hover:text-emerald-200"
              aria-label={`Abrir referencia jurídica: ${token.value}`}
            >
              {token.value}
            </button>
          );
        })}
      </span>

      <Modal
        isOpen={Boolean(activeRef)}
        onClose={() => setActiveRef(null)}
        title={activeRef?.label ?? 'Referencia jurídica'}
        footer={
          activeRef ? (
            <div className="flex flex-wrap gap-2">
              <Link
                to={`${activeRef.internalPath}?caseId=${encodeURIComponent(caseId)}&returnTo=${encodeURIComponent(returnTo)}`}
                className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200"
              >
                Ver ficha-resumen
              </Link>
              {activeRef.pdfUrl ? (
                <a
                  href={activeRef.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200"
                >
                  Ver sentencia en PDF
                </a>
              ) : null}
            </div>
          ) : null
        }
      >
        {activeRef ? (
          <div className="space-y-3 text-sm text-slate-300">
            <p>{activeRef.summary}</p>
            {activeRef.pdfUrl ? (
              <iframe
                src={activeRef.pdfUrl}
                title={`Visor ${activeRef.label}`}
                className="h-[62dvh] w-full rounded-xl border border-slate-700/60"
              />
            ) : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
}
