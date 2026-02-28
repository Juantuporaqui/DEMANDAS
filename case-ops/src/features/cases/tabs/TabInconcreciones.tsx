import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Document, Fact, Partida } from '../../../types';
import {
  PGASEN_AP_SCRIPTS,
  PGASEN_ISSUES,
  PGASEN_LAW_REFS,
  PGASEN_PARTIDAS,
  PGASEN_TIMELINE_LOGICAL,
} from '../../../data/picassent/inconcreciones';

type TabInconcrecionesProps = {
  caseId: string;
  facts: Fact[];
  partidas: Partida[];
  documents: Document[];
  onGoToView?: (view: 'estrategia' | 'laboratorio') => void;
};

type InternalTab = 'vista-rapida' | 'partidas' | 'cronologia' | 'guion' | 'normativa';

type Filters = {
  search: string;
  category: string;
  severity: string;
  side: string;
  topic: string;
};

const STORAGE_KEY = 'pgasen.inconcreciones.filters.v1';
const DEFAULT_FILTERS: Filters = { search: '', category: 'all', severity: 'all', side: 'all', topic: 'all' };

const severityRank = { P1: 3, P2: 2, P3: 1 } as const;

const joinOrNoConsta = (items?: string[]) => (items?.length ? items.join(' · ') : 'NO_CONSTA');

export function TabInconcreciones({ documents, onGoToView }: TabInconcrecionesProps) {
  const [activeTab, setActiveTab] = useState<InternalTab>('vista-rapida');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [apMode, setApMode] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_FILTERS;
      const parsed = JSON.parse(raw) as Partial<Filters>;
      return { ...DEFAULT_FILTERS, ...parsed };
    } catch {
      return DEFAULT_FILTERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const categories = useMemo(() => Array.from(new Set(PGASEN_ISSUES.map((x) => x.category))), []);
  const sides = useMemo(() => Array.from(new Set(PGASEN_ISSUES.map((x) => x.source.side))), []);
  const topics = useMemo(() => Array.from(new Set(PGASEN_ISSUES.map((x) => x.topic))), []);

  const filteredIssues = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return PGASEN_ISSUES
      .filter((item) => (apMode ? item.severity === 'P1' : true))
      .filter((item) => (filters.category === 'all' ? true : item.category === filters.category))
      .filter((item) => (filters.severity === 'all' ? true : item.severity === filters.severity))
      .filter((item) => (filters.side === 'all' ? true : item.source.side === filters.side))
      .filter((item) => (filters.topic === 'all' ? true : item.topic === filters.topic))
      .filter((item) => {
        if (!search) return true;
        const haystack = [
          item.id,
          item.title,
          item.summary,
          item.rebuttalOneLiner,
          item.apAsk,
          item.source.docName,
          item.topic,
          item.category,
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(search);
      })
      .sort((a, b) => {
        const sev = severityRank[b.severity] - severityRank[a.severity];
        if (sev !== 0) return sev;
        return (a.dateHint ?? '9999').localeCompare(b.dateHint ?? '9999');
      });
  }, [apMode, filters]);

  const selectedIssue = filteredIssues.find((item) => item.id === selectedIssueId) ?? filteredIssues[0] ?? null;

  const resolveDoc = (docName: string) => {
    const lower = docName.toLowerCase();
    return documents.find((doc) => doc.title.toLowerCase().includes(lower));
  };

  const setFilter = (key: keyof Filters, value: string) => setFilters((prev) => ({ ...prev, [key]: value }));

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  const resetFilters = () => {
    setApMode(false);
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-20 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">⚖️ Inconcreciones — Centro AP</h3>
            <p className="text-xs text-slate-400">Contenido estrictamente desde dataset PGASEN. Campos ausentes: NO_CONSTA.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button type="button" onClick={() => setApMode((v) => !v)} className="rounded-full border border-amber-500/50 px-3 py-1 text-amber-200">
              ⏱ Modo AP
            </button>
            <button type="button" onClick={() => void copyText(PGASEN_AP_SCRIPTS.seconds60.join('\n'))} className="rounded-full border border-emerald-500/50 px-3 py-1 text-emerald-200">
              Copiar Guión 60s
            </button>
            <button type="button" onClick={() => window.print()} className="rounded-full border border-sky-500/50 px-3 py-1 text-sky-200">
              Imprimir
            </button>
            <button type="button" onClick={resetFilters} className="rounded-full border border-slate-600 px-3 py-1 text-slate-200">
              Reset filtros
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Subvistas inconcreciones">
          {[
            ['vista-rapida', 'Vista Rápida'],
            ['partidas', 'Partidas (Hecho Cuarto)'],
            ['cronologia', 'Cronología'],
            ['guion', 'Guión AP'],
            ['normativa', 'Normativa/Jurisprudencia'],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={activeTab === key}
              onClick={() => setActiveTab(key as InternalTab)}
              className={`rounded-full border px-3 py-1 text-xs ${
                activeTab === key ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200' : 'border-slate-700 text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
          <button type="button" onClick={() => onGoToView?.('estrategia')} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Estrategia</button>
          <button type="button" onClick={() => onGoToView?.('laboratorio')} className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">Laboratorio</button>
        </div>
      </div>

      {activeTab === 'vista-rapida' && (
        <div className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-5">
            <input value={filters.search} onChange={(e) => setFilter('search', e.target.value)} placeholder="Buscar" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200" />
            <select value={filters.category} onChange={(e) => setFilter('category', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-200"><option value="all">Categoría: Todas</option>{categories.map((x)=><option key={x} value={x}>{x}</option>)}</select>
            <select value={filters.severity} onChange={(e) => setFilter('severity', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-200"><option value="all">Severidad: Todas</option>{(['P1','P2','P3'] as const).map((x)=><option key={x} value={x}>{x}</option>)}</select>
            <select value={filters.side} onChange={(e) => setFilter('side', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-200"><option value="all">Lado: Todos</option>{sides.map((x)=><option key={x} value={x}>{x}</option>)}</select>
            <select value={filters.topic} onChange={(e) => setFilter('topic', e.target.value)} className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-200"><option value="all">Tema: Todos</option>{topics.map((x)=><option key={x} value={x}>{x}</option>)}</select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table className="min-w-full text-xs text-slate-200">
              <thead className="sticky top-0 bg-slate-950 text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="px-2 py-2 text-left">ID</th><th className="px-2 py-2 text-left">Sev.</th><th className="px-2 py-2 text-left">Categoría</th><th className="px-2 py-2 text-left">Tema</th><th className="px-2 py-2 text-left">Qué está mal</th><th className="px-2 py-2 text-left">Dónde</th><th className="px-2 py-2 text-left">Impacto en sala</th><th className="px-2 py-2 text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((item) => (
                  <tr key={item.id} className="border-t border-slate-800 align-top">
                    <td className="px-2 py-2 font-mono">{item.id}</td>
                    <td className="px-2 py-2">{item.severity}</td>
                    <td className="px-2 py-2">{item.category}</td>
                    <td className="px-2 py-2">{item.topic}</td>
                    <td className="px-2 py-2">{item.summary}</td>
                    <td className="px-2 py-2">{item.source.side} · {item.source.docName || 'NO_CONSTA'}</td>
                    <td className="px-2 py-2">{item.rebuttalOneLiner || 'NO_CONSTA'}</td>
                    <td className="px-2 py-2 text-right"><button type="button" onClick={() => setSelectedIssueId(item.id)} className="rounded-full border border-emerald-500/50 px-2 py-1 text-[11px] text-emerald-200">Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-200">
            <div className="mb-2 text-sm font-semibold text-white">Detalle</div>
            {!selectedIssue ? (
              <p className="text-slate-400">NO_CONSTA</p>
            ) : (
              <div className="space-y-2">
                <div><span className="text-slate-400">Descripción:</span> {selectedIssue.summary || 'NO_CONSTA'}</div>
                <div><span className="text-slate-400">Cita corta:</span> {selectedIssue.quoteShort || 'NO_CONSTA'}</div>
                <div>
                  <span className="text-slate-400">Fuente:</span> {selectedIssue.source.docName || 'NO_CONSTA'} · {joinOrNoConsta(selectedIssue.source.docNumbers)}
                  {(() => {
                    const doc = resolveDoc(selectedIssue.source.docName);
                    if (!doc) return <span className="text-slate-500"> · NO_CONSTA (no enlazable)</span>;
                    return <Link className="ml-2 text-emerald-300 hover:text-emerald-200" to={`/documents/${doc.id}/view`}>Abrir PDF</Link>;
                  })()}
                </div>
                <div><span className="text-slate-400">Qué pedir en AP:</span> {selectedIssue.apAsk || 'NO_CONSTA'}</div>
                <button
                  type="button"
                  onClick={() => void copyText([selectedIssue.summary, selectedIssue.rebuttalOneLiner, selectedIssue.apAsk, selectedIssue.quoteShort ?? 'NO_CONSTA'].join('\n'))}
                  className="rounded-full border border-sky-500/50 px-3 py-1 text-[11px] text-sky-200"
                >
                  Copiar detalle
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'partidas' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="min-w-full text-xs text-slate-200">
            <thead className="bg-slate-950 text-[11px] uppercase text-slate-400"><tr><th className="px-2 py-2 text-left">#</th><th className="px-2 py-2 text-left">Concepto</th><th className="px-2 py-2 text-left">Periodo</th><th className="px-2 py-2 text-left">Importe</th><th className="px-2 py-2 text-left">Problema</th><th className="px-2 py-2 text-left">Fuente</th><th className="px-2 py-2 text-left">Réplica</th></tr></thead>
            <tbody>{PGASEN_PARTIDAS.map((item)=><tr key={item.idx} className="border-t border-slate-800"><td className="px-2 py-2">{item.idx}</td><td className="px-2 py-2">{item.concept}</td><td className="px-2 py-2">{item.period || 'NO_CONSTA'}</td><td className="px-2 py-2">{item.amountClaimedEUR ?? 'NO_CONSTA'}</td><td className="px-2 py-2">{item.mainIssue || 'NO_CONSTA'}</td><td className="px-2 py-2">{item.source?.docName || 'NO_CONSTA'}</td><td className="px-2 py-2">{item.replyOneLiner || 'NO_CONSTA'}</td></tr>)}</tbody>
          </table>
        </div>
      )}

      {activeTab === 'cronologia' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 text-sm font-semibold text-white">Orden lógico</div>
            <ul className="space-y-2 text-xs text-slate-200">{PGASEN_TIMELINE_LOGICAL.map((item)=><li key={item.id}><span className="font-mono text-slate-400">{item.date}</span> · {item.label}</li>)}</ul>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-400">
            <div className="mb-3 text-sm font-semibold text-white">Orden narrativo</div>
            NO_CONSTA
          </div>
        </div>
      )}

      {activeTab === 'guion' && (
        <div className="grid gap-4 lg:grid-cols-2 text-xs text-slate-200">
          {[
            ['60s', PGASEN_AP_SCRIPTS.seconds60],
            ['3–4 min', PGASEN_AP_SCRIPTS.minutes3to4],
            ['Completo', PGASEN_AP_SCRIPTS.full],
            ['Peticiones', PGASEN_AP_SCRIPTS.apAsks],
            ['Protestas', PGASEN_AP_SCRIPTS.protests],
          ].map(([label, lines]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-2 flex items-center justify-between"><div className="text-sm font-semibold text-white">{label}</div><button type="button" onClick={() => void copyText((lines as string[]).join('\n'))} className="rounded-full border border-slate-700 px-2 py-1 text-[11px]">Copiar</button></div>
              <ul className="space-y-1">{(lines as string[]).map((line, index) => <li key={`${label}-${index}`}>{line}</li>)}</ul>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <ul className="space-y-2 text-xs text-slate-200">
            {PGASEN_LAW_REFS.map((item) => (
              <li key={item.id} className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-2">
                <span className="font-semibold text-emerald-200">{item.kind}</span> · {item.ref} · {item.where}
                {item.note ? <span className="text-slate-400"> · {item.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
