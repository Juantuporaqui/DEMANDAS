import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { CopyButton } from '../../../features/analytics/prescripcion/CopyButton';
import { AP_GUI0N_V5_RAW, AP_SENTENCIAS_RAW } from '../apV5SourceData';

type Phase = { id: string; label: string; title: string; content: string; blocks: Block[]; pending: string[] };
type Block = { id: string; number: string; title: string; body: string; replicas: string[]; refs: string[] };
type Citation = { title: string; body: string; source: string };

const FORBIDDEN = ['Art. 1901 CC (prohibición del enriquecimiento injusto)', 'STS 17/03/2016'];
const NO_CONSTA_CITA = 'NO CONSTA: cita verificada (según reglas V5)';
const PHASE_TITLES = [
  'FASE 1 — CUESTIONES PROCESALES PREVIAS',
  'FASE 2 — DELIMITACIÓN DEL OBJETO',
  'FASE 3 — FIJACIÓN DE HECHOS CONTROVERTIDOS',
  'FASE 4 — HECHOS CONTROVERTIDOS',
  'FASE 5 — PROPOSICIÓN DE PRUEBA',
  'FASE 6 — CIERRE, RESERVAS Y PROTESTA FINAL',
];
const refRegex = /(LEC\s*\d+[\wªº./-]*|CC\s*\d+[\wªº./-]*|STS\s*\d+\/\d+|STS\s*\d{1,2}\/\d{1,2}\/\d{4}|SAP[^\n,.;]*|AAP[^\n,.;]*)/gi;

function cleanText(input: string) {
  const replacements: Array<[string, string]> = [
    ['pedimos decreto inmediato', 'pedimos AUTO inmediato'],
    ['decreto de división', 'AUTO / resolución judicial'],
    ['STS de 5 de febrero de 2013', 'STS 79/2015 (ECLI: ES:TS:2015:79)'],
  ];
  let output = FORBIDDEN.reduce((acc, token) => acc.replaceAll(token, NO_CONSTA_CITA), input);
  for (const [search, replace] of replacements) output = output.replaceAll(search, replace);
  return output;
}

function buildCitationIndex() {
  return AP_SENTENCIAS_RAW.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean).map((chunk) => {
    const [title, ...rest] = chunk.split('\n');
    return { title, body: rest.join('\n').trim() || 'NO CONSTA: texto de cita no incorporado', source: 'docs/ap/sentencias.md' };
  });
}

function parseBlocks(content: string): Block[] {
  return content.split(/\n\s*---\s*\n/g).map((x) => x.trim()).filter(Boolean).map((part, idx) => {
    const lines = part.split('\n').map((l) => l.trimEnd());
    const heading = lines.find((line) => /^\d+\.\d+\s+—/.test(line.trim())) ?? `Bloque ${idx + 1}`;
    const [, number = `${idx + 1}`, title = heading] = heading.match(/^(\d+\.\d+)\s+—\s+(.+)$/) ?? [];
    const replicas = lines.filter((line) => line.trim().startsWith('➜ Si el juez'));
    const body = cleanText(lines.filter((line) => line.trim() !== heading).join('\n').trim());
    const refs = Array.from(new Set(body.match(refRegex) ?? []));
    return { id: `${number}-${idx}`, number, title, body, replicas, refs };
  });
}

function parsePhases(): Phase[] {
  const text = cleanText(AP_GUI0N_V5_RAW);
  return PHASE_TITLES.map((title, i) => {
    const start = text.indexOf(title);
    const end = i === PHASE_TITLES.length - 1 ? text.length : text.indexOf(PHASE_TITLES[i + 1]);
    const raw = start >= 0 ? text.slice(start + title.length, end > start ? end : undefined).trim() : 'NO CONSTA — fase no encontrada en docs/ap/guion_v5.md';
    const lines = raw.split('\n').map((l) => l.trimEnd());
    const pending = lines.filter((line) => line.trim().startsWith('NO CONSTA —'));
    const narrative = lines.filter((line, idx) => !(idx > 0 && line.trim() === lines[idx - 1].trim()) && !line.trim().startsWith('NO CONSTA —')).join('\n');
    return { id: `fase-${i + 1}`, label: `FASE ${i + 1}`, title, content: narrative, blocks: parseBlocks(narrative), pending };
  });
}

function extractResumen(label: string) {
  const idx = AP_GUI0N_V5_RAW.indexOf(label);
  if (idx < 0) return `NO CONSTA — Falta ${label} en docs/ap/guion_v5.md`;
  const next = AP_GUI0N_V5_RAW.indexOf('RESUMEN', idx + label.length);
  const table = AP_GUI0N_V5_RAW.indexOf('TABLA DE RESPUESTAS RÁPIDAS', idx + label.length);
  const end = [next, table].filter((x) => x > idx).sort((a, b) => a - b)[0] ?? AP_GUI0N_V5_RAW.length;
  return cleanText(AP_GUI0N_V5_RAW.slice(idx, end).trim());
}

function parseQuickReplies() {
  const idx = AP_GUI0N_V5_RAW.indexOf('TABLA DE RESPUESTAS RÁPIDAS');
  if (idx < 0) return [] as Array<{ q: string; a: string }>;
  const lines = cleanText(AP_GUI0N_V5_RAW.slice(idx)).split('\n').filter((l) => l.includes('│')).map((l) => l.split('│').map((x) => x.trim())).filter((x) => x.length >= 3);
  const rows: Array<{ q: string; a: string }> = [];
  for (const cols of lines) {
    const q = cols[1];
    const a = cols[2];
    if (!q || !a || q.includes('Si la actora') || q.includes('dice...')) continue;
    rows.push({ q, a });
  }
  return rows;
}

function QuoteBox({ text }: { text: string }) {
  return <blockquote className="border-l-4 border-slate-500/40 bg-slate-800/50 px-3 py-2 text-[15px] leading-relaxed text-slate-100">{text}</blockquote>;
}

function Panel({ title, children }: { title: string; children: any }) {
  return <div className="rounded-lg border border-slate-700/70 bg-slate-900/50 p-3"><div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</div>{children}</div>;
}

function CitationPopover({ citation, onClose }: { citation: Citation | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  if (!citation) return null;
  return <div className="fixed inset-0 z-50 bg-slate-950/40" onClick={onClose}><div className="absolute bottom-0 left-0 right-0 max-h-[55vh] rounded-t-2xl border border-slate-700 bg-slate-900 p-4 md:bottom-6 md:left-auto md:right-6 md:w-[460px] md:max-h-[70vh] md:rounded-xl" onClick={(e) => e.stopPropagation()}><h4 className="text-sm font-semibold text-white">{citation.title}</h4><p className="mt-1 text-xs text-slate-400">{citation.source}</p><p className="mt-3 whitespace-pre-wrap text-sm text-slate-100">{citation.body}</p></div></div>;
}

function BlockCard({ block, onCitation }: { block: Block; onCitation: (token: string) => void }) {
  const paragraphs = block.body.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  return <article className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-4"><header className="mb-3 flex flex-wrap items-start justify-between gap-2"><div className="flex items-center gap-2"><span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-slate-200">{block.number}</span><h4 className="text-base font-semibold text-white">{block.title}</h4></div><div className="flex flex-wrap gap-1">{block.refs.map((ref) => <button key={ref} onClick={() => onCitation(ref)} className="rounded-full border border-indigo-400/40 bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-100">{ref}</button>)}</div></header><div className="space-y-3 text-[15px] leading-relaxed text-slate-100">{paragraphs.map((p, i) => (p.startsWith('"') || p.startsWith('“')) ? <QuoteBox key={i} text={p} /> : <p key={i}>{p}</p>)}</div>{block.replicas.length > 0 && <details className="mt-3 rounded-lg border border-slate-700/70 bg-slate-900/60 p-3"><summary className="cursor-pointer text-sm font-medium text-slate-200">Réplicas</summary><ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-200">{block.replicas.map((r) => <li key={r}>{r}</li>)}</ul></details>}</article>;
}

function ResponsiveQuickRepliesTable({ rows }: { rows: Array<{ q: string; a: string }> }) {
  return <div className="overflow-auto rounded-xl border border-slate-700/70"><table className="min-w-full text-sm"><thead className="bg-slate-800/80 text-slate-100"><tr><th className="sticky left-0 z-10 bg-slate-800/95 px-3 py-2 text-left">Si dicen...</th><th className="px-3 py-2 text-left">Respuesta inmediata</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i} className={i % 2 ? 'bg-slate-900/60' : 'bg-slate-900/40'}><td className="sticky left-0 bg-inherit px-3 py-2 align-top text-slate-200">{r.q}</td><td className="px-3 py-2 align-top text-slate-100"><div className="flex items-start justify-between gap-2"><span className="whitespace-pre-wrap">{r.a}</span><CopyButton text={r.a} label="Copiar" /></div></td></tr>)}</tbody></table></div>;
}

export function APCommandCenterPresentation() {
  const phases = useMemo(parsePhases, []);
  const citations = useMemo(buildCitationIndex, []);
  const quickReplies = useMemo(parseQuickReplies, []);
  const resumen30 = useMemo(() => extractResumen('RESUMEN 30 SEGUNDOS'), []);
  const resumen60 = useMemo(() => extractResumen('RESUMEN 60 SEGUNDOS'), []);
  const [open, setOpen] = useState<Record<string, boolean>>({ 'fase-1': true });
  const [citation, setCitation] = useState<Citation | null>(null);
  const [showIndex, setShowIndex] = useState(false);
  const [salaMode, setSalaMode] = useState(false);
  const [teleprompter, setTeleprompter] = useState(false);

  const resolveCitation = (token: string) => {
    const hit = citations.find((c) => c.title.toLowerCase().includes(token.toLowerCase()));
    setCitation(hit ?? { title: token, body: 'NO CONSTA: texto de cita no incorporado', source: 'docs/ap/sentencias.md' });
  };

  return <section className="mx-auto max-w-[1240px] px-2 pb-10 text-slate-100 print:max-w-none print:px-0" id="ap-presentacion-v5"><header className="sticky top-0 z-20 mb-4 rounded-xl border border-slate-700/70 bg-slate-900/95 p-3 backdrop-blur"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">Audiencia Previa — Centro de mando</h2><p className="text-sm text-slate-300">Picassent · 10/03/2026 09:45 · Objetivo: saneamiento, hechos, prueba</p></div><div className="flex flex-wrap gap-2 text-xs"><button className="rounded border border-slate-600 px-2 py-1" onClick={() => setTeleprompter(true)}>Teleprónter</button><button className="rounded border border-slate-600 px-2 py-1" onClick={() => window.print()}>Imprimir AP</button><CopyButton text={resumen30} label="Copiar 30s" /><CopyButton text={resumen60} label="Copiar 60s" /><button className="rounded border border-slate-600 px-2 py-1" onClick={() => setSalaMode((s) => !s)}>Modo Sala {salaMode ? 'ON' : 'OFF'}</button></div></div></header><div className="mb-3 md:hidden"><button className="rounded border border-slate-600 px-3 py-1 text-sm" onClick={() => setShowIndex((v) => !v)}>Índice</button></div><div className="grid gap-4 md:grid-cols-[280px_minmax(0,920px)] md:items-start md:justify-center"><aside className={`${showIndex ? 'block' : 'hidden'} md:sticky md:top-24 md:block print:hidden`}><nav className="rounded-xl border border-slate-700/70 bg-slate-900/60 p-3"><h3 className="mb-2 text-sm font-semibold text-slate-100">Índice AP</h3><ul className="space-y-1 text-sm">{[...phases.map((p) => ({ id: p.id, label: p.label })), { id: 'resumenes', label: 'Resúmenes' }, { id: 'tabla-respuestas', label: 'Tabla respuestas' }].map((a) => <li key={a.id}><a className="text-slate-300 hover:text-white" href={`#${a.id}`}>{a.label}</a></li>)}</ul></nav></aside><div className="space-y-4">{phases.map((phase) => {const isOpen = open[phase.id] ?? phase.id === 'fase-1'; return <section key={phase.id} id={phase.id} className={`rounded-2xl border border-slate-700/70 bg-slate-900/30 p-4 print:break-before-page ${phase.blocks.length === 0 ? 'print:hidden' : ''}`}><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold">{phase.label}</span><h3 className="text-lg font-bold">{phase.title.replace(`${phase.label} — `, '')}</h3>{phase.pending.length > 0 && <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-200">NO CONSTA</span>}</div><button onClick={() => setOpen((s) => ({ ...s, [phase.id]: !isOpen }))} className="rounded border border-slate-600 px-2 py-1 text-xs">{isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</button></div>{isOpen && <div className="mt-3 space-y-3">{phase.blocks.map((block) => <BlockCard key={block.id} block={block} onCitation={resolveCitation} />)}{!salaMode && phase.pending.length > 0 && <details className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3"><summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-amber-200">Pendientes / Faltantes</summary><ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-amber-100">{phase.pending.map((p) => <li key={p}>{p}</li>)}</ul></details>}</div>}</section>;})}<section id="resumenes" className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/30 p-4"><h3 className="text-lg font-bold">Resúmenes</h3><Panel title="Resumen 30 segundos"><QuoteBox text={resumen30} /></Panel><Panel title="Resumen 60 segundos"><QuoteBox text={resumen60} /></Panel></section><section id="tabla-respuestas" className="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/30 p-4"><h3 className="text-lg font-bold">Tabla de respuestas rápidas</h3><ResponsiveQuickRepliesTable rows={quickReplies} /></section></div></div>{teleprompter && <div className="fixed inset-0 z-50 overflow-auto bg-slate-950 p-6 text-white"><div className="mx-auto max-w-5xl space-y-6 text-2xl leading-relaxed"><div className="flex justify-end"><button className="rounded border border-slate-500 px-3 py-1 text-sm" onClick={() => setTeleprompter(false)}>Cerrar</button></div>{phases.map((p) => <div key={p.id}><h4 className="mb-3 text-3xl font-bold">{p.label}</h4><p className="whitespace-pre-wrap">{p.content}</p></div>)}</div></div>}<CitationPopover citation={citation} onClose={() => setCitation(null)} /></section>;
}
