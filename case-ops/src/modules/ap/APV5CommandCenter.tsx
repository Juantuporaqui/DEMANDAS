import { useMemo, useState } from 'react';
import { CopyButton } from '../../features/analytics/prescripcion/CopyButton';
import { AP_GUI0N_V5_RAW, AP_SENTENCIAS_RAW } from './apV5SourceData';

type CitationRecord = { title: string; extract: string; source: string };

const REFERENCE_REGEX = /(art(?:ículo)?\.?\s*\d+[\d\wªº./-]*\s*(?:LEC|CC)?|(?:STS|SAP|AAP)[^\n.;]*)/gi;

function buildSentenciasMap(raw: string) {
  const chunks = raw
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  const entries: CitationRecord[] = chunks.map((chunk) => {
    const [firstLine, ...rest] = chunk.split('\n');
    return {
      title: firstLine.trim(),
      source: 'docs/ap/sentencias.md',
      extract: rest.join('\n').trim() || 'NO CONSTA — docs/ap/sentencias.md sin extracto adicional para esta cita.',
    };
  });

  return entries;
}

function splitGuionByFlow(raw: string) {
  const markers = [
    'FASE 1 — CUESTIONES PROCESALES PREVIAS',
    'FASE 2 — DELIMITACIÓN DEL OBJETO',
    'FASE 3 — FIJACIÓN DE HECHOS CONTROVERTIDOS',
    'FASE 4 — HECHOS CONTROVERTIDOS',
    'FASE 5 — PROPOSICIÓN DE PRUEBA',
    'FASE 6 — CIERRE, RESERVAS Y PROTESTA FINAL',
  ];

  return markers.map((marker, index) => {
    const start = raw.indexOf(marker);
    const end = index === markers.length - 1 ? raw.length : raw.indexOf(markers[index + 1]);
    const text = start === -1
      ? `NO CONSTA — Falta bloque ${marker} en docs/ap/guion_v5.md.`
      : raw.slice(start, end === -1 ? raw.length : end).trim();
    return { id: marker, title: marker, text };
  });
}

export function APV5CommandCenter() {
  const [selectedCitation, setSelectedCitation] = useState<CitationRecord | null>(null);
  const sections = useMemo(() => splitGuionByFlow(AP_GUI0N_V5_RAW), []);
  const sentencias = useMemo(() => buildSentenciasMap(AP_SENTENCIAS_RAW), []);

  return (
    <section className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4" id="ap-v5-v2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-emerald-100">Comando AP (V5 v2) — texto literal</h2>
        <CopyButton text={AP_GUI0N_V5_RAW} label="Copiar compositor V5 v2" />
      </div>

      {sections.map((section) => {
        const refs = Array.from(new Set(section.text.match(REFERENCE_REGEX) ?? []));
        return (
          <article key={section.id} className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-100">{section.title}</h3>
            <p className="mt-2 whitespace-pre-wrap text-xs text-slate-200">{section.text}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {refs.map((ref) => {
                const hit = sentencias.find((entry) => entry.title.toLowerCase().includes(ref.toLowerCase()));
                const citation = hit ?? {
                  title: ref,
                  source: 'NO CONSTA',
                  extract: 'NO CONSTA — Falta dataset estatutario en el repositorio para este artículo/referencia (ver docs/ap/sentencias.md).',
                };
                return (
                  <button
                    type="button"
                    key={`${section.id}-${ref}`}
                    className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-100"
                    onClick={() => setSelectedCitation(citation)}
                  >
                    {ref}
                  </button>
                );
              })}
            </div>
          </article>
        );
      })}

      {selectedCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" role="dialog" aria-modal="true">
          <div className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-4">
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold text-white">{selectedCitation.title}</h4>
              <button className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200" onClick={() => setSelectedCitation(null)}>
                Cerrar
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-400">Fuente: {selectedCitation.source}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{selectedCitation.extract}</p>
            <div className="mt-3">
              <CopyButton text={`${selectedCitation.title}\n${selectedCitation.extract}`} label="Copiar cita" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
