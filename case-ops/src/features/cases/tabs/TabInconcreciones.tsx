import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Document, Fact, Partida } from '../../../types';
import {
  PGASEN_ISSUES,
  PGASEN_LAW_REFS,
  PGASEN_PARTIDAS,
  PGASEN_TIMELINE_LOGICAL,
} from '../../../data/picassent/inconcreciones';
import { printElementAsDocument } from '../../../utils/printDocument';

type TabInconcrecionesProps = {
  caseId: string;
  facts: Fact[];
  partidas: Partida[];
  documents: Document[];
  onGoToView?: (view: 'estrategia' | 'laboratorio') => void;
};

type InternalTab = 'vista-rapida' | 'partidas' | 'cronologia' | 'guion' | 'normativa';
type ScriptMode = '60s' | '3-4' | 'full' | 'asks' | 'protests';

type Filters = {
  search: string;
  category: string;
  severity: string;
  side: string;
  topic: string;
};

const STORAGE_KEY = 'pgasen.inconcreciones.filters.v2';
const DEFAULT_FILTERS_BY_VIEW: Record<InternalTab, Filters> = {
  'vista-rapida': { search: '', category: 'all', severity: 'all', side: 'all', topic: 'all' },
  partidas: { search: '', category: 'all', severity: 'all', side: 'all', topic: 'all' },
  cronologia: { search: '', category: 'all', severity: 'all', side: 'all', topic: 'all' },
  guion: { search: '', category: 'all', severity: 'all', side: 'all', topic: 'all' },
  normativa: { search: '', category: 'all', severity: 'all', side: 'all', topic: 'all' },
};

const severityRank = { P1: 3, P2: 2, P3: 1 } as const;
const READABLE_SIDE: Record<string, string> = { DEMANDA: 'ACTORA', CONTESTACION: 'DEMANDADO', DOC_RELACION: 'AMBOS' };

const shortQuote = (text?: string) => (text ? text.slice(0, 120) : 'NO_CONSTA');

export function TabInconcreciones({ documents, onGoToView }: TabInconcrecionesProps) {
  const [activeTab, setActiveTab] = useState<InternalTab>('vista-rapida');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [sourceIssueId, setSourceIssueId] = useState<string | null>(null);
  const [apMode, setApMode] = useState(false);
  const [scriptMode, setScriptMode] = useState<ScriptMode>('60s');
  const [copyFeedback, setCopyFeedback] = useState<string>('');
  const [filters, setFilters] = useState<Filters>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_FILTERS_BY_VIEW['vista-rapida'];
      return { ...DEFAULT_FILTERS_BY_VIEW['vista-rapida'], ...(JSON.parse(raw) as Partial<Filters>) };
    } catch {
      return DEFAULT_FILTERS_BY_VIEW['vista-rapida'];
    }
  });

  const detailRef = useRef<HTMLDivElement | null>(null);
  const scriptRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const categories = useMemo(() => Array.from(new Set(PGASEN_ISSUES.map((x) => x.category))), []);
  const sides = useMemo(() => Array.from(new Set(PGASEN_ISSUES.map((x) => x.source.side))), []);
  const topics = useMemo(() => Array.from(new Set(PGASEN_ISSUES.map((x) => x.topic))), []);

  const scopedIssues = useMemo(() => {
    if (activeTab === 'partidas') {
      return PGASEN_ISSUES.filter((item) => item.tags.includes('HECHO_4') || item.tags.includes('PARTIDAS_H4'));
    }
    return PGASEN_ISSUES;
  }, [activeTab]);

  const filteredIssues = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return scopedIssues
      .filter((item) => (apMode ? item.severity === 'P1' : true))
      .filter((item) => (filters.category === 'all' ? true : item.category === filters.category))
      .filter((item) => (filters.severity === 'all' ? true : item.severity === filters.severity))
      .filter((item) => (filters.side === 'all' ? true : item.source.side === filters.side))
      .filter((item) => (filters.topic === 'all' ? true : item.topic === filters.topic))
      .filter((item) => {
        if (!search) return true;
        return [item.id, item.title, item.summary, item.rebuttalOneLiner, item.apAsk, item.source.docName, item.topic, item.category, ...(item.tags ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(search);
      })
      .sort((a, b) => {
        const sev = severityRank[b.severity] - severityRank[a.severity];
        if (sev !== 0) return sev;
        return (a.dateHint ?? '9999').localeCompare(b.dateHint ?? '9999');
      });
  }, [apMode, filters, scopedIssues]);

  const selectedIssue = filteredIssues.find((item) => item.id === selectedIssueId) ?? filteredIssues[0] ?? null;
  const sourceIssue = sourceIssueId ? filteredIssues.find((item) => item.id === sourceIssueId) ?? null : null;

  useEffect(() => {
    if (!sourceIssueId) return;
    const stillExists = filteredIssues.some((item) => item.id === sourceIssueId);
    if (!stillExists) setSourceIssueId(null);
  }, [filteredIssues, sourceIssueId]);

  const resolveDoc = (docName: string) => {
    const lower = docName.toLowerCase();
    return documents.find((doc) => doc.title.toLowerCase().includes(lower));
  };

  const setFilter = (key: keyof Filters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const copyText = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopyFeedback(`Copiado: ${label}`);
    window.setTimeout(() => setCopyFeedback(''), 1400);
  };

  const resetFilters = () => {
    setApMode(false);
    setFilters(DEFAULT_FILTERS_BY_VIEW[activeTab]);
  };

  const guionBlocks = useMemo(() => {
    const defecto = filteredIssues.filter((x) => x.category === 'DEFECTO_LEGAL_416_1_5');
    const prueba = filteredIssues.filter((x) => x.category === 'PRUEBA_INCOMPLETA');
    const fondo = filteredIssues.filter((x) => !['DEFECTO_LEGAL_416_1_5', 'PRUEBA_INCOMPLETA'].includes(x.category));

    const cite = (item?: (typeof filteredIssues)[number]) =>
      item ? `(${item.source.docName} · ${item.source.anchorLabel ?? item.source.docNumbers?.join(', ') ?? 'NO_CONSTA'})` : '(NO_CONSTA)';

    const blocks = {
      '60s': [
        'Con la venia, Señoría.',
        `1) Defecto legal: la demanda afirma cuantía/petitum sin desglose autosuficiente por partidas y sin bases individualizadas de intereses. ${cite(defecto[0])}`,
        `2) Impugnación documental: la contestación niega integridad de capturas y pide trazabilidad certificada. ${cite(prueba[0])}`,
        `3) Fondo: la demanda afirma pagos privativos; la contestación niega premisas y denuncia duplicidades/omisiones. ${cite(fondo[0])}`,
        '4) Petición: requerimiento de concreción por partidas (bases, dies a quo, soporte) y fijación de hechos controvertidos en AP.',
      ],
      '3-4': [
        'I. Defecto legal / falta de claridad (procedimental).',
        ...defecto.slice(0, 2).map((d) => `- ${d.summary} ${cite(d)}`),
        'II. Impugnación documental (integridad/trazabilidad).',
        ...prueba.slice(0, 2).map((d) => `- ${d.summary} ${cite(d)}`),
        'III. Fondo (premisas rotas, duplicidades, omisiones).',
        ...fondo.slice(0, 3).map((d) => `- ${d.summary} ${cite(d)}`),
        'IV. Peticiones concretas.',
        '- Requerimiento de cuadro único por partidas de Hecho Cuarto.',
        '- Subsanación de intereses por subpartida y dies a quo.',
        '- Fijación expresa de hechos controvertidos y depuración del objeto.',
      ],
      full: [
        'Bloque 1 — Defecto legal (LEC 416.1.5ª):',
        ...defecto.map((d) => `${d.title}. ${shortQuote(d.quoteShort)} ${cite(d)}`),
        'Bloque 2 — Impugnación documental:',
        ...prueba.map((d) => `${d.title}. ${shortQuote(d.quoteShort)} ${cite(d)}`),
        'Bloque 3 — Fondo:',
        ...fondo.map((d) => `${d.title}. ${shortQuote(d.quoteShort)} ${cite(d)}`),
        'Bloque 4 — Peticiones:',
        '- Que se requiera concreción aritmética por partidas y depuración del objeto litigioso.',
        '- Que se acuerde la fijación de hechos controvertidos sin dar por probado lo discutido.',
      ],
      asks: [
        'Que se requiera a la actora cuadro por partidas (fecha, concepto, base, dies a quo, justificante íntegro).',
        'Que se subsane la indeterminación del petitum en lo relativo a intereses.',
        'Que se impugne la documental incompleta y se exija trazabilidad bancaria certificada.',
      ],
      protests: [
        'Protesta: esta parte no discute el fondo todavía; pide saneamiento y claridad del objeto.',
        'Protesta: se deja constancia de impugnación documental por falta de integridad y trazabilidad.',
      ],
    };

    return blocks;
  }, [filteredIssues]);

  const printableNode = activeTab === 'guion' ? scriptRef.current : detailRef.current;

  const handlePrintPanel = async () => {
    if (!printableNode) return;
    await printElementAsDocument({ element: printableNode, title: `Centro AP — ${activeTab}` });
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 backdrop-blur print-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">⚖️ Inconcreciones — Centro AP</h3>
            <p className="text-xs text-slate-400">Contenido estrictamente desde dataset PGASEN. Campos ausentes: NO_CONSTA.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button aria-label="Activar modo AP" type="button" onClick={() => setApMode((v) => !v)} className="rounded-full border border-amber-500/50 px-3 py-1 text-amber-200">⏱ Modo AP</button>
            <button aria-label="Copiar guión de 60 segundos" type="button" onClick={() => void copyText(guionBlocks['60s'].join('\n'), 'guión 60s')} className="rounded-full border border-emerald-500/50 px-3 py-1 text-emerald-200">Copiar Guión 60s</button>
            <button aria-label="Imprimir panel activo" type="button" onClick={() => void handlePrintPanel()} className="rounded-full border border-sky-500/50 px-3 py-1 text-sky-200">Imprimir</button>
            <button aria-label="Restablecer filtros" type="button" onClick={resetFilters} className="rounded-full border border-slate-600 px-3 py-1 text-slate-200">Reset filtros</button>
          </div>
        </div>
        {copyFeedback ? <div className="mt-2 text-[11px] text-emerald-300">{copyFeedback}</div> : null}

        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Subvistas inconcreciones">
          {[
            ['vista-rapida', 'Inconcreciones'],
            ['partidas', 'Partidas (Hecho Cuarto)'],
            ['cronologia', 'Cronología'],
            ['guion', 'Guión AP'],
            ['normativa', 'Normativa/Jurisprudencia'],
          ].map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key as InternalTab)} className={`rounded-full border px-3 py-1 text-xs ${activeTab === key ? 'border-emerald-500/70 bg-emerald-500/20 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input value={filters.search} onChange={(e) => setFilter('search', e.target.value)} placeholder="Buscar…" className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100" />
          <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"><option value="all">Categoría</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <select value={filters.severity} onChange={(e) => setFilter('severity', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"><option value="all">Severidad</option><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option></select>
          <select value={filters.side} onChange={(e) => setFilter('side', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"><option value="all">Lado</option>{sides.map((s) => <option key={s} value={s}>{READABLE_SIDE[s] ?? s}</option>)}</select>
          <select value={filters.topic} onChange={(e) => setFilter('topic', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"><option value="all">Tema</option>{topics.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </div>
      </div>

      {activeTab === 'vista-rapida' && (
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="min-w-full text-xs text-slate-200">
              <thead className="bg-slate-950 text-[11px] uppercase text-slate-400"><tr><th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Sev.</th><th className="px-2 py-2 text-left">Categoría</th><th className="px-2 py-2 text-left">Tema</th><th className="px-2 py-2 text-left">Qué está mal</th><th className="px-2 py-2 text-left">Dónde</th><th className="px-2 py-2 text-left">Impacto</th><th className="px-2 py-2 text-right">Acción</th></tr></thead>
              <tbody>{filteredIssues.map((item) => <tr key={item.id} className="border-t border-slate-800"><td className="px-2 py-2 font-mono">{item.id}</td><td className="px-2 py-2">{item.severity}</td><td className="px-2 py-2">{item.category}</td><td className="px-2 py-2">{item.topic}</td><td className="px-2 py-2">{item.summary}</td><td className="px-2 py-2">{item.source.docName} · {item.source.anchorLabel ?? item.source.docNumbers?.join(', ') ?? 'NO_CONSTA'}</td><td className="px-2 py-2">{item.rebuttalOneLiner}</td><td className="px-2 py-2 text-right"><button type="button" onClick={() => setSelectedIssueId(item.id)} className="rounded-full border border-emerald-500/50 px-2 py-1 text-[11px] text-emerald-200">Ver</button></td></tr>)}</tbody>
            </table>
          </div>

          <div ref={detailRef} className="ap-readable rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
            <div className="mb-2 text-sm font-semibold text-white">Detalle</div>
            {!selectedIssue ? <p className="text-slate-400">NO_CONSTA</p> : (
              <div className="space-y-2">
                {selectedIssue.category === 'DEFECTO_LEGAL_416_1_5' ? <div className="rounded border border-amber-600/60 bg-amber-950/30 p-2 text-amber-100">Defecto legal (LEC 416.1.5ª): prioridad de saneamiento.</div> : null}
                <div><span className="text-slate-400">Descripción:</span> {selectedIssue.summary || 'NO_CONSTA'}</div>
                <div><span className="text-slate-400">Cita corta:</span> {selectedIssue.quoteShort || 'NO_CONSTA'}</div>
                <div>
                  <span className="text-slate-400">Fuente:</span> {selectedIssue.source.docName || 'NO_CONSTA'} · {selectedIssue.source.anchorLabel ?? selectedIssue.source.docNumbers?.join(' · ') ?? selectedIssue.source.refId ?? 'NO_CONSTA'}
                  {(() => {
                    const doc = resolveDoc(selectedIssue.source.docName);
                    if (!doc) return <span className="text-slate-500"> · NO_CONSTA (falta documento en índice de visor)</span>;
                    const hash = selectedIssue.source.refId ? `?ref=${encodeURIComponent(selectedIssue.source.refId)}` : '';
                    return <Link className="ml-2 text-emerald-300 hover:text-emerald-200" to={`/documents/${doc.id}/view${hash}`}>Abrir en fuente</Link>;
                  })()}
                </div>
                <div><span className="text-slate-400">Qué pedir en AP:</span> {selectedIssue.apAsk || 'NO_CONSTA'}</div>
                <button type="button" onClick={() => setSourceIssueId(selectedIssue.id)} className="rounded-full border border-slate-600 px-3 py-1 text-[11px]">Ver extracto fuente</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'partidas' && (
        <div className="space-y-3">
          <div className="rounded-xl border border-amber-500/40 bg-amber-900/20 p-3 text-xs text-amber-100">Vista filtrada únicamente a ítems con etiquetas HECHO_4 / PARTIDAS_H4.</div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="min-w-full text-xs text-slate-200">
              <thead className="bg-slate-950 text-[11px] uppercase text-slate-400"><tr><th className="px-2 py-2 text-left">#</th><th className="px-2 py-2 text-left">Concepto</th><th className="px-2 py-2 text-left">Periodo</th><th className="px-2 py-2 text-left">Importe</th><th className="px-2 py-2 text-left">Problema</th><th className="px-2 py-2 text-left">Fuente</th><th className="px-2 py-2 text-left">Réplica</th></tr></thead>
              <tbody>{PGASEN_PARTIDAS.map((item) => <tr key={item.idx} className="border-t border-slate-800"><td className="px-2 py-2">{item.idx}</td><td className="px-2 py-2">{item.concept}</td><td className="px-2 py-2">{item.period || 'NO_CONSTA'}</td><td className="px-2 py-2">{item.amountEUR ?? 'NO_CONSTA'}</td><td className="px-2 py-2">{item.mainProblem || 'NO_CONSTA'}</td><td className="px-2 py-2">{item.sources?.demand ?? item.sources?.response ?? 'NO_CONSTA'}</td><td className="px-2 py-2">{item.rebuttalOneLiner || 'NO_CONSTA'}</td></tr>)}</tbody>
            </table>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
            <div className="mb-2 font-semibold text-white">Inconcreciones Hecho Cuarto</div>
            <ul className="space-y-1">{filteredIssues.map((item) => <li key={item.id}>[{item.id}] {item.title}</li>)}</ul>
          </div>
        </div>
      )}

      {activeTab === 'cronologia' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="mb-3 text-sm font-semibold text-white">Cronología de eventos</div>
          <ul className="space-y-2 text-xs text-slate-200">{PGASEN_TIMELINE_LOGICAL.map((item) => <li key={item.id} className="rounded border border-slate-800/70 bg-slate-950/40 p-2"><span className="font-mono text-slate-300">{item.date || 'NO_CONSTA'}</span> · {item.label}<div className="text-slate-400">{item.detail}</div></li>)}</ul>
        </div>
      )}

      {activeTab === 'guion' && (
        <div ref={scriptRef} className="ap-readable space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
          <div className="flex flex-wrap gap-2 print-hidden">
            {([
              ['60s', '60 segundos'],
              ['3-4', '3–4 min'],
              ['full', 'Completo'],
              ['asks', 'Peticiones'],
              ['protests', 'Protestas'],
            ] as const).map(([id, label]) => <button key={id} type="button" onClick={() => setScriptMode(id)} className={`rounded-full border px-3 py-1 ${scriptMode === id ? 'border-emerald-500 text-emerald-200' : 'border-slate-700 text-slate-300'}`}>{label}</button>)}
            <button type="button" onClick={() => void copyText(guionBlocks[scriptMode].join('\n'), `guión ${scriptMode}`)} className="rounded-full border border-slate-600 px-3 py-1">Copiar</button>
          </div>
          <ol className="space-y-2 list-decimal pl-4">{guionBlocks[scriptMode].map((line, idx) => <li key={`${scriptMode}-${idx}`}>{line}</li>)}</ol>
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <ul className="space-y-2 text-xs text-slate-200">
            {PGASEN_LAW_REFS.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-2">
                <span className="font-semibold text-emerald-200">{item.kind}</span> · {item.ref} · {item.where}
                <div className="mt-1 text-slate-300">Literal: {item.literal ?? 'NO_CONSTA'}</div>
                <div className="text-slate-400">Fuente: {item.sourceDoc ?? 'NO_CONSTA'} {item.sourceAnchor ? `· ${item.sourceAnchor}` : ''}</div>
                {item.note ? <span className="text-slate-400">Nota: {item.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sourceIssue ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/70 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900 p-4 text-xs text-slate-200">
            <div className="mb-2 flex items-center justify-between"><h4 className="text-sm font-semibold text-white">Fuente · {sourceIssue.id}</h4><button aria-label="Cerrar modal de fuente" type="button" onClick={() => setSourceIssueId(null)} className="rounded-full border border-slate-600 px-2 py-1">Cerrar</button></div>
            <div className="ap-readable rounded border border-slate-700 bg-slate-950/50 p-3">{sourceIssue.summary}</div>
            <div className="mt-2">Cita: {sourceIssue.quoteShort ?? 'NO_CONSTA'}</div>
            <div className="mt-2">Documento: {sourceIssue.source.docName} · {sourceIssue.source.anchorLabel ?? sourceIssue.source.refId ?? 'NO_CONSTA'}</div>
            <div className="mt-3">
              {(() => {
                const doc = resolveDoc(sourceIssue.source.docName);
                if (!doc) return <span className="text-slate-400">NO_CONSTA (falta documento para visor interno)</span>;
                const hash = sourceIssue.source.refId ? `?ref=${encodeURIComponent(sourceIssue.source.refId)}` : '';
                return <Link className="text-emerald-300" to={`/documents/${doc.id}/view${hash}`}>Abrir en fuente</Link>;
              })()}
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-[11px] text-slate-400">Narrativa táctica prioritaria con simulación Monte Carlo en segundo plano (no activa en esta vista).</div>

      <div className="flex flex-wrap gap-2 print-hidden">
        <button type="button" onClick={() => onGoToView?.('estrategia')} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">Ir a Estrategia</button>
        <button type="button" onClick={() => onGoToView?.('laboratorio')} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200">Ir a Laboratorio</button>
      </div>
    </div>
  );
}
