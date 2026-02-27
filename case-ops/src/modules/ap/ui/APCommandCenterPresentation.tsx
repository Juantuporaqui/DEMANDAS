import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Menu } from 'lucide-react';
import { CopyButton } from '../../../features/analytics/prescripcion/CopyButton';
import { AP_GUI0N_V5_RAW, AP_SENTENCIAS_RAW } from '../apV5SourceData';
import { PICASSENT_AP } from '../../../data/PO-715-2024-picassent/audienciaPrevia.picassent';

type Phase = { id: string; label: string; title: string; raw: string; blocks: Block[]; pending: string[] };
type Block = { id: string; number: string; title: string; text: string; refs: string[] };
type Citation = { title: string; body: string; source: string };

const PHASE_TITLES = [
  'FASE 1 — CUESTIONES PROCESALES PREVIAS',
  'FASE 2 — DELIMITACIÓN DEL OBJETO',
  'FASE 3 — FIJACIÓN DE HECHOS CONTROVERTIDOS',
  'FASE 4 — HECHOS CONTROVERTIDOS',
  'FASE 5 — PROPOSICIÓN DE PRUEBA',
  'FASE 6 — CIERRE, RESERVAS Y PROTESTA FINAL',
] as const;

const BIS_TEXT = `"Señoría, esta parte denuncia un exceso reclamatorio por doble imputación (pluspetición material) en el bloque relativo a la hipoteca de la vivienda privativa de Lope de Vega.

La actora reclama, por un lado, el reembolso del total de cuotas abonadas de dicha hipoteca; y, adicionalmente, pretende el reembolso del 50% del capital de un préstamo previo que se canceló con ese mismo préstamo hipotecario. Esta duplicidad conduce a reclamar dos veces el mismo perjuicio económico, o, en su caso, a reclamar como partida autónoma una amortización de capital que ya se encuentra incorporada en las cuotas que también se reclaman.

Antes de entrar al fondo, es imprescindible depurar el objeto por partidas, identificando para cada cuota: qué parte corresponde a principal/amortización, qué parte a intereses y qué parte a comisiones y gastos, y separando de forma expresa cualquier amortización de capital que se pretenda reclamar como partida independiente, evitando cualquier solapamiento.

PETICIÓN (para acta):
1) Que se requiera a la actora a presentar tabla verificable del bloque ‘hipoteca Lope de Vega’ desglosando cuota a cuota (principal/intereses/gastos) y diferenciando expresamente cualquier amortización de capital reclamada como partida independiente.
2) Que se excluya o, subsidiariamente, se tenga por no acreditado cualquier importe que suponga doble cómputo o solapamiento entre cuotas y capital amortizado.
3) Que se haga constar en acta que la carga de individualizar, cuantificar y evitar solapamientos recae en la actora (art. 217 LEC), y que sin desglose no puede dictarse condena líquida y congruente (art. 219 LEC) ni puede ejercerse contradicción efectiva (art. 24 CE)."`;

const refRegex = /(LEC\s*\d+[\wªº./-]*|CC\s*\d+[\wªº./-]*|CE\s*\d+[\wªº./-]*|STS\s*\d+\/\d+|STS\s*\d{1,2}\/\d{1,2}\/\d{4}|SAP[^\n,.;]*|AAP[^\n,.;]*)/gi;

function cleanText(raw: string) {
  let text = raw
    .replaceAll('pedimos decreto inmediato', 'pedimos AUTO inmediato')
    .replaceAll('decreto de división', 'AUTO / resolución judicial')
    .replaceAll('STS de 5 de febrero de 2013', 'STS 79/2015 (ECLI: ES:TS:2015:79)')
    .replaceAll('STS 19/12/2006', 'NO CONSTA: cita verificada')
    .replaceAll('STS de 19/12/2006', 'NO CONSTA: cita verificada');

  text = text.replace(
    '2.3 — IMPUGNACIÓN DOCUMENTAL SELECTIVA',
    `2.2 BIS — PLUSPETICIÓN / DOBLE IMPUTACIÓN: HIPOTECA LOPE DE VEGA\n\n${BIS_TEXT}\n\n2.3 — IMPUGNACIÓN DOCUMENTAL SELECTIVA`,
  );

  text = text.replace(
    'HC-15 — Doble imputación de conceptos',
    'HC-15 — Pluspetición/doble imputación: cuotas vs amortización capital (Lope de Vega)\n  Nota: Determinar solapamiento entre cuotas reclamadas y capital cancelado reclamado como partida independiente.\n  Doble imputación de conceptos',
  );

  return text;
}

function parsePhases(): Phase[] {
  const text = cleanText(AP_GUI0N_V5_RAW);
  return PHASE_TITLES.map((title, i) => {
    const start = text.indexOf(title);
    const end = i === PHASE_TITLES.length - 1 ? text.length : text.indexOf(PHASE_TITLES[i + 1]);
    const body = start >= 0 ? text.slice(start + title.length, end === -1 ? text.length : end).trim() : 'NO CONSTA — fase no encontrada en docs/ap/guion_v5.md';
    const lines = body.split('\n').map((l) => l.trimEnd());
    const pending = lines.filter((l) => l.trim().startsWith('NO CONSTA —'));
    const cleaned = lines.filter((l, idx) => !(idx > 0 && lines[idx - 1].trim() === l.trim()) && !l.trim().startsWith('NO CONSTA —')).join('\n');
    return {
      id: `fase-${i + 1}`,
      label: `FASE ${i + 1}`,
      title,
      raw: cleaned,
      pending,
      blocks: parseBlocks(cleaned),
    };
  });
}

function parseBlocks(text: string): Block[] {
  const headingRegex = /^(\d+\.\d+(?:\s*BIS)?)\s+—\s+(.+)$/m;
  const lines = text.split('\n');
  const blocks: Block[] = [];
  let current: { number: string; title: string; content: string[] } | null = null;

  for (const line of lines) {
    const m = line.match(/^\s*(\d+\.\d+(?:\s*BIS)?)\s+—\s+(.+)$/);
    if (m) {
      if (current) {
        const blockText = current.content.join('\n').trim();
        blocks.push({
          id: `${current.number}-${blocks.length}`,
          number: current.number,
          title: current.title,
          text: blockText,
          refs: extractRefs(blockText, current.number),
        });
      }
      current = { number: m[1], title: m[2], content: [] };
      continue;
    }
    if (current) current.content.push(line);
  }

  if (current) {
    const blockText = current.content.join('\n').trim();
    blocks.push({
      id: `${current.number}-${blocks.length}`,
      number: current.number,
      title: current.title,
      text: blockText,
      refs: extractRefs(blockText, current.number),
    });
  }

  if (blocks.length === 0 && headingRegex.test(text)) return blocks;
  return blocks;
}

function extractRefs(text: string, number: string) {
  const refs = Array.from(new Set(text.match(refRegex) ?? []));
  if (number.includes('2.2 BIS')) {
    return Array.from(new Set([...refs, 'LEC 217', 'LEC 219', 'CE 24']));
  }
  return refs.map((r) => (r.includes('STS 19 de diciembre de 2006') ? 'NO CONSTA: cita verificada' : r));
}

function extractSection(label: string) {
  const full = cleanText(AP_GUI0N_V5_RAW);
  const idx = full.indexOf(label);
  if (idx < 0) return `NO CONSTA — Falta ${label} en docs/ap/guion_v5.md`;
  const next = full.indexOf('RESUMEN', idx + label.length);
  const table = full.indexOf('TABLA DE RESPUESTAS RÁPIDAS', idx + label.length);
  const end = [next, table].filter((n) => n > idx).sort((a, b) => a - b)[0] ?? full.length;
  return full.slice(idx, end).trim();
}

function parseQuickReplies() {
  const full = cleanText(AP_GUI0N_V5_RAW);
  const idx = full.indexOf('TABLA DE RESPUESTAS RÁPIDAS');
  if (idx < 0) return [] as Array<{ q: string; a: string }>;
  return full
    .slice(idx)
    .split('\n')
    .filter((l) => l.includes('│'))
    .map((l) => l.split('│').map((s) => s.trim()))
    .filter((cols) => cols.length >= 3 && cols[1] && cols[2] && !cols[1].includes('Si la actora') && !cols[1].includes('dice...'))
    .map((cols) => ({ q: cols[1], a: cols[2] }));
}

function buildCitationIndex() {
  return AP_SENTENCIAS_RAW.split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [title, ...rest] = chunk.split('\n');
      return { title, body: rest.join('\n').trim() || 'NO CONSTA: texto de cita no incorporado', source: 'docs/ap/sentencias.md' };
    });
}

function CitationPopover({ citation, onClose }: { citation: Citation | null; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);
  if (!citation) return null;
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40" onClick={onClose}>
      <div className="absolute bottom-0 left-0 right-0 max-h-[55vh] overflow-auto rounded-t-2xl border border-slate-700 bg-slate-900 p-4 md:bottom-6 md:left-auto md:right-6 md:w-[460px] md:max-h-[70vh] md:rounded-xl" onClick={(e) => e.stopPropagation()}>
        <h4 className="text-sm font-semibold text-white">{citation.title}</h4>
        <p className="mt-1 text-xs text-slate-400">{citation.source}</p>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-100">{citation.body}</p>
      </div>
    </div>
  );
}

function Paragraphs({ text }: { text: string }) {
  const parts = text.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  const peticionIdx = parts.findIndex((p) => p.startsWith('PETICIÓN (para acta):'));
  const normal = peticionIdx === -1 ? parts : parts.slice(0, peticionIdx);
  const peticion = peticionIdx === -1 ? '' : parts.slice(peticionIdx).join('\n\n');

  const bullets = peticion
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => /^\d+\)/.test(l));

  return (
    <div className="space-y-3">
      {normal.map((p, i) => <p key={i} className="text-[15px] leading-relaxed text-slate-100 sm:text-[16px] sm:leading-[1.6]">{p}</p>)}
      {peticion && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-emerald-200">Pedir</div>
          {peticion.split('\n').filter((l) => l.trim() === 'PETICIÓN (para acta):').map((l) => <p key={l} className="text-[15px] leading-relaxed text-emerald-100">{l}</p>)}
          <ul className="list-disc space-y-1 pl-5 text-[15px] leading-relaxed text-emerald-100 sm:text-[16px] sm:leading-[1.6]">
            {bullets.map((b) => <li key={b}>{b.replace(/^\d+\)\s*/, '')}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function BlockCard({ block, onCitation }: { block: Block; onCitation: (ref: string) => void }) {
  return (
    <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-200">{block.number}</span>
          <h4 className="text-base font-semibold text-white">{block.title}</h4>
        </div>
        <div className="flex flex-wrap gap-1">
          {block.refs.map((ref) => (
            <button key={ref} type="button" onClick={() => onCitation(ref)} className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-100">
              {ref}
            </button>
          ))}
        </div>
      </header>
      <Paragraphs text={block.text} />
    </article>
  );
}

function QuickReplies({ rows }: { rows: Array<{ q: string; a: string }> }) {
  return (
    <>
      <div className="hidden overflow-auto rounded-xl border border-slate-700/70 sm:block">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/80 text-slate-100">
            <tr><th className="sticky left-0 z-10 bg-slate-800/95 px-3 py-2 text-left">Si dicen...</th><th className="px-3 py-2 text-left">Respuesta inmediata</th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={i % 2 ? 'bg-slate-900/60' : 'bg-slate-900/40'}>
                <td className="sticky left-0 bg-inherit px-3 py-2 align-top text-slate-200">{r.q}</td>
                <td className="px-3 py-2 align-top text-slate-100"><div className="flex items-start justify-between gap-2"><span>{r.a}</span><CopyButton text={r.a} label="Copiar" /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-2 sm:hidden">
        {rows.map((r, i) => (
          <article key={i} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
            <p className="text-sm font-semibold text-slate-200">{r.q}</p>
            <p className="mt-2 text-[15px] leading-[1.6] text-slate-100">{r.a}</p>
            <div className="mt-2"><CopyButton text={r.a} label="Copiar" /></div>
          </article>
        ))}
      </div>
    </>
  );
}

export function APCommandCenterPresentation() {
  const phases = useMemo(parsePhases, []);
  const citations = useMemo(buildCitationIndex, []);
  const resumen30 = useMemo(() => extractSection('RESUMEN 30 SEGUNDOS'), []);
  const resumen60 = useMemo(() => extractSection('RESUMEN 60 SEGUNDOS'), []);
  const quick = useMemo(parseQuickReplies, []);
  const [citation, setCitation] = useState<Citation | null>(null);
  const [mobileIndexOpen, setMobileIndexOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [salaMode, setSalaMode] = useState(false);
  const [teleprompter, setTeleprompter] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({ 'fase-1': true });

  const actaPrincipal = PICASSENT_AP.excepcionesProcesales.guionActa.sala.principal;
  const actaSubsidiario = PICASSENT_AP.excepcionesProcesales.guionActa.sala.subsidiario;

  const resolveCitation = (token: string) => {
    const found = citations.find((c) => c.title.toLowerCase().includes(token.toLowerCase()));
    setCitation(found ?? { title: token, body: 'NO CONSTA: texto de cita no incorporado', source: 'docs/ap/sentencias.md' });
  };

  return (
    <section lang="es" className="ap-content ap-justify mx-auto max-w-[1240px] px-4 pb-10 text-slate-100 print:max-w-none print:px-0" id="ap-presentacion-v5">
      <style>{`
        .ap-content { max-width: 70ch; }
        .ap-justify p, .ap-justify li { text-align: justify; text-justify: inter-word; hyphens: auto; overflow-wrap: anywhere; }
        @media print { .ap-justify p, .ap-justify li { text-align: justify; hyphens: auto; } }
        @media (max-width: 640px){ .ap-justify p, .ap-justify li { text-align: left; hyphens: manual; } }
      `}</style>

      <header className="sticky top-0 z-20 mb-3 rounded-xl border border-slate-700/70 bg-slate-900/95 p-3 backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Audiencia Previa — Centro de mando</h2>
            <p className="text-sm text-slate-300">Picassent · 10/03/2026 09:45 · Objetivo: saneamiento, hechos, prueba</p>
          </div>
          <div className="hidden flex-wrap gap-2 text-xs sm:flex">
            <button className="rounded border border-slate-600 px-2 py-1" onClick={() => setTeleprompter(true)}>Teleprónter</button>
            <button className="rounded border border-slate-600 px-2 py-1" onClick={() => window.print()}>Imprimir AP</button>
            <CopyButton text={PICASSENT_AP.guiones.s90} label="Copiar 90s" />
            <CopyButton text={resumen30} label="Copiar 30s" />
            <CopyButton text={resumen60} label="Copiar 60s" />
            <button className="rounded border border-slate-600 px-2 py-1" onClick={() => setSalaMode((v) => !v)}>Modo Sala {salaMode ? 'ON' : 'OFF'}</button>
          </div>
        </div>
      </header>

      <div className="sticky top-[74px] z-20 mb-3 flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/95 p-2 sm:hidden">
        <button className="rounded border border-slate-600 px-2 py-1 text-xs" onClick={() => setTeleprompter(true)}>Teleprónter</button>
        <CopyButton text={PICASSENT_AP.guiones.s90} label="Copiar 90s" />
        <button className="rounded border border-slate-600 px-2 py-1 text-xs" onClick={() => window.print()}>Imprimir</button>
        <button className="ml-auto rounded border border-slate-600 p-1" onClick={() => setMobileMoreOpen((v) => !v)}><Menu size={14} /></button>
      </div>
      {mobileMoreOpen && (
        <div className="mb-3 rounded-xl border border-slate-700/70 bg-slate-900/80 p-2 text-xs sm:hidden">
          <div className="flex flex-wrap gap-2">
            <CopyButton text={resumen30} label="Copiar 30s" />
            <CopyButton text={resumen60} label="Copiar 60s" />
            <button className="rounded border border-slate-600 px-2 py-1" onClick={() => setSalaMode((v) => !v)}>Modo Sala {salaMode ? 'ON' : 'OFF'}</button>
          </div>
        </div>
      )}

      <div className="mb-3 sm:hidden">
        <button className="rounded border border-slate-600 px-3 py-1 text-sm" onClick={() => setMobileIndexOpen((v) => !v)}>Índice</button>
        {mobileIndexOpen && (
          <nav className="mt-2 rounded-xl border border-slate-700/70 bg-slate-900/70 p-3 text-sm">
            <ul className="space-y-1">
              {phases.map((p) => <li key={p.id}><a href={`#${p.id}`} className="text-slate-300">{p.label}</a></li>)}
              <li><a href="#resumenes" className="text-slate-300">Resúmenes</a></li>
              <li><a href="#tabla-respuestas" className="text-slate-300">Tabla respuestas</a></li>
            </ul>
          </nav>
        )}
      </div>

      {salaMode ? (
        <section className="space-y-3">
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"><h3 className="text-lg font-bold">Guion 90s</h3><Paragraphs text={PICASSENT_AP.guiones.s90} /></article>
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"><h3 className="text-lg font-bold">Acta principal</h3><Paragraphs text={actaPrincipal} /></article>
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"><h3 className="text-lg font-bold">Acta subsidiario</h3><Paragraphs text={actaSubsidiario} /></article>
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"><h3 className="text-lg font-bold">Resumen 30 segundos</h3><Paragraphs text={resumen30} /></article>
          <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"><h3 className="text-lg font-bold">Resumen 60 segundos</h3><Paragraphs text={resumen60} /></article>
        </section>
      ) : (
        <section className="space-y-4">
          {phases.map((phase) => {
            const isOpen = open[phase.id] ?? phase.id === 'fase-1';
            return (
              <section key={phase.id} id={phase.id} className={`rounded-2xl border border-slate-700/70 bg-slate-900/30 p-4 print:break-before-page ${phase.blocks.length === 0 ? 'print:hidden' : ''}`}>
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold">{phase.label}</span>
                    <h3 className="text-lg font-bold">{phase.title.replace(`${phase.label} — `, '')}</h3>
                    {phase.pending.length > 0 && <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200">NO CONSTA</span>}
                  </div>
                  <button className="rounded border border-slate-600 px-2 py-1" onClick={() => setOpen((s) => ({ ...s, [phase.id]: !isOpen }))}>{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button>
                </header>
                {isOpen && (
                  <div className="mt-3 space-y-3">
                    {phase.blocks.map((block) => <BlockCard key={block.id} block={block} onCitation={resolveCitation} />)}
                    {phase.pending.length > 0 && (
                      <details className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 print:hidden">
                        <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-amber-200">Pendientes / Faltantes</summary>
                        <ul className="mt-2 list-disc pl-4 text-sm text-amber-100">{phase.pending.map((p) => <li key={p}>{p}</li>)}</ul>
                      </details>
                    )}
                  </div>
                )}
              </section>
            );
          })}

          <section id="resumenes" className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/30 p-4">
            <h3 className="text-lg font-bold">Resúmenes</h3>
            <article className="rounded-lg border border-slate-700/60 bg-slate-900/40 p-3"><h4 className="text-sm font-semibold">Resumen 30 segundos</h4><Paragraphs text={resumen30} /></article>
            <article className="rounded-lg border border-slate-700/60 bg-slate-900/40 p-3"><h4 className="text-sm font-semibold">Resumen 60 segundos</h4><Paragraphs text={resumen60} /></article>
          </section>

          <section id="tabla-respuestas" className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/30 p-4">
            <h3 className="text-lg font-bold">Tabla de respuestas rápidas</h3>
            <QuickReplies rows={quick} />
          </section>
        </section>
      )}

      {teleprompter && (
        <div className="ap-content ap-justify fixed inset-0 z-50 overflow-auto bg-slate-950 p-6 text-white">
          <div className="mx-auto max-w-5xl space-y-6 text-2xl leading-relaxed">
            <div className="flex justify-end"><button className="rounded border border-slate-500 px-3 py-1 text-sm" onClick={() => setTeleprompter(false)}>Cerrar</button></div>
            {phases.map((p) => <div key={p.id}><h4 className="mb-3 text-3xl font-bold">{p.label}</h4><Paragraphs text={p.raw} /></div>)}
          </div>
        </div>
      )}

      <CitationPopover citation={citation} onClose={() => setCitation(null)} />
    </section>
  );
}
