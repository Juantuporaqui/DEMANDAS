import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Document, Fact, Partida } from '../../../types';
import type { EscenarioVista, RefutacionItem } from '../../../data/escenarios/types';
import { AnalisisTecnico, type MonteCarloSummary } from './AnalisisTecnico';

type TabEscenariosProps = {
  caseId: string;
  facts: Fact[];
  partidas: Partida[];
  documents: Document[];
};

type EscenariosModule = { escenarios?: EscenarioVista[]; default?: EscenarioVista[] };
const escenariosModules = import.meta.glob('../../../data/*/escenarios.ts', { eager: true }) as Record<
  string,
  EscenariosModule
>;
const escenariosByCase = Object.entries(escenariosModules).reduce((acc, [path, mod]) => {
  const caseKey = path.split('/').slice(-2, -1)[0];
  acc[caseKey] = mod.escenarios ?? mod.default ?? [];
  return acc;
}, {} as Record<string, EscenarioVista[]>);

type RefutacionModule = { matrizRefutacion?: RefutacionItem[] };
const refutacionModules = import.meta.glob('../../../data/*/index.ts', { eager: true }) as Record<
  string,
  RefutacionModule
>;
const refutacionByCase = Object.entries(refutacionModules).reduce((acc, [path, mod]) => {
  const caseKey = path.split('/').slice(-2, -1)[0];
  acc[caseKey] = mod.matrizRefutacion ?? [];
  return acc;
}, {} as Record<string, RefutacionItem[]>);

const getCaseKey = (caseId: string) => {
  const lower = caseId.toLowerCase();
  if (lower.includes('picassent')) return 'picassent';
  if (lower.includes('mislata')) return 'mislata';
  if (lower.includes('quart')) return 'quart';
  return lower;
};

const tipoBadgeStyles: Record<EscenarioVista['tipo'], string> = {
  favorable: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  neutral: 'border-amber-400/40 bg-amber-400/10 text-amber-100',
  hostil: 'border-rose-500/40 bg-rose-500/10 text-rose-200',
};

export function TabEscenarios({ caseId, facts, partidas, documents }: TabEscenariosProps) {
  const [viewMode, setViewMode] = useState<'estrategia' | 'laboratorio'>('estrategia');
  const [selectedEscenarioIndex, setSelectedEscenarioIndex] = useState(0);
  const [checkedPoints, setCheckedPoints] = useState<Record<string, boolean>>({});
  const [monteCarloSummary, setMonteCarloSummary] = useState<MonteCarloSummary | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const teleprompterRef = useRef<HTMLDivElement>(null);

  const caseKey = useMemo(() => getCaseKey(caseId), [caseId]);
  const escenarios = escenariosByCase[caseKey] ?? [];
  const refutacion = refutacionByCase[caseKey] ?? [];
  const selectedEscenario = escenarios[selectedEscenarioIndex] ?? escenarios[0];
  const isPicassent = caseKey === 'picassent';

  useEffect(() => {
    setSelectedEscenarioIndex(0);
  }, [caseKey]);

  useEffect(() => {
    const handler = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const togglePoint = useCallback((key: string) => {
    setCheckedPoints((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!teleprompterRef.current) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    void teleprompterRef.current.requestFullscreen();
  }, []);

  const resolveDocument = useCallback(
    (item: { documentId?: string; documentTitle?: string }) => {
      if (item.documentId) {
        return documents.find((doc) => doc.id === item.documentId) ?? null;
      }
      if (item.documentTitle) {
        const hint = item.documentTitle.toLowerCase();
        return documents.find((doc) => doc.title.toLowerCase().includes(hint)) ?? null;
      }
      return null;
    },
    [documents]
  );

  const formatSuccessRate = monteCarloSummary
    ? `Probabilidad de éxito estimada: ${Math.round(monteCarloSummary.successRate * 100)}%`
    : 'Probabilidad de éxito estimada: —';

  return (
    <div className="space-y-6 font-sans">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">🧠 Centro de Mando de Audiencia</h3>
            <p className="text-xs text-slate-400">
              Narrativa táctica prioritaria con simulación Monte Carlo en segundo plano.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-full border border-slate-700 bg-slate-950/60 p-1 text-[11px] text-slate-300">
              <button
                type="button"
                onClick={() => setViewMode('estrategia')}
                className={`rounded-full px-3 py-1 transition ${
                  viewMode === 'estrategia'
                    ? 'bg-emerald-500/20 text-emerald-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🎯 Estrategia
              </button>
              <button
                type="button"
                onClick={() => setViewMode('laboratorio')}
                className={`rounded-full px-3 py-1 transition ${
                  viewMode === 'laboratorio'
                    ? 'bg-sky-500/20 text-sky-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧪 Laboratorio
              </button>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('laboratorio')}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200 hover:border-emerald-400"
            >
              {formatSuccessRate}
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'estrategia' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-[#1a202c] p-6 text-slate-100 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Escenarios tácticos
                </div>
                <h4 className="mt-2 text-lg font-semibold text-white">
                  Selecciona el perfil del juez y ajusta tu narrativa
                </h4>
              </div>
              {selectedEscenario && (
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    tipoBadgeStyles[selectedEscenario.tipo]
                  }`}
                >
                  {selectedEscenario.tipo.toUpperCase()}
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {escenarios.length === 0 ? (
                <span className="text-xs text-slate-400">Sin escenarios configurados para este caso.</span>
              ) : (
                escenarios.map((escenario, index) => (
                  <button
                    key={`${escenario.titulo}-${index}`}
                    type="button"
                    onClick={() => setSelectedEscenarioIndex(index)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      index === selectedEscenarioIndex
                        ? 'border-[#f9ca24] bg-[#f9ca24]/20 text-[#f9ca24]'
                        : 'border-slate-700 text-slate-300 hover:border-[#f9ca24]/60'
                    }`}
                  >
                    {escenario.titulo}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-[#1a202c] p-6 text-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Teleprompter</div>
                  <h4 className="mt-2 text-lg font-semibold text-white">Alegato 60s</h4>
                </div>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="rounded-full border border-[#f9ca24] px-3 py-1 text-xs font-semibold text-[#f9ca24] hover:bg-[#f9ca24]/10"
                >
                  {isFullscreen ? 'SALIR LECTURA' : 'MODO LECTURA'}
                </button>
              </div>
              <div
                ref={teleprompterRef}
                className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/40 p-4 text-2xl leading-relaxed text-white"
              >
                {selectedEscenario?.mensaje60s ??
                  'Carga un escenario para visualizar el alegato de 60 segundos.'}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#1a202c] p-6 text-slate-100">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Matriz de refutación</div>
              <h4 className="mt-2 text-lg font-semibold text-white">Mentira vs Prueba</h4>
              <div className="mt-4 overflow-hidden rounded-2xl border border-slate-700">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-slate-950/60 text-[11px] uppercase tracking-wide text-slate-400">
                    <tr>
                      <th className="px-3 py-2">Alegación de la contraria</th>
                      <th className="px-3 py-2">Prueba letal</th>
                      <th className="px-3 py-2 text-right">Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refutacion.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-[11px] text-slate-500">
                          Sin matriz de refutación para este caso.
                        </td>
                      </tr>
                    ) : (
                      refutacion.map((item, index) => {
                        const doc = resolveDocument(item);
                        const docUrl = doc
                          ? `/documents/${doc.id}/view${item.page ? `?page=${item.page}` : ''}`
                          : null;
                        return (
                          <tr key={`${item.alegacion}-${index}`} className="border-t border-slate-800">
                            <td className="px-3 py-3 text-slate-200">{item.alegacion}</td>
                            <td className="px-3 py-3 text-slate-300">{item.prueba}</td>
                            <td className="px-3 py-3 text-right">
                              {docUrl ? (
                                <Link
                                  to={docUrl}
                                  className="rounded-full border border-emerald-500/60 px-3 py-1 text-[11px] font-semibold text-emerald-200 hover:border-emerald-400"
                                >
                                  Abrir PDF
                                </Link>
                              ) : (
                                <span className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-500">
                                  Sin PDF
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#1a202c] p-6 text-slate-100">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Checklist</div>
              <h4 className="mt-2 text-lg font-semibold text-white">Puntos críticos a clavar</h4>
              <div className="mt-4 space-y-2">
                {selectedEscenario?.puntosAClavar?.length ? (
                  selectedEscenario.puntosAClavar.map((punto, index) => {
                    const key = `${caseKey}-${selectedEscenarioIndex}-${index}`;
                    return (
                      <label
                        key={key}
                        className="flex items-start gap-2 rounded-xl border border-slate-700 bg-slate-950/30 p-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={Boolean(checkedPoints[key])}
                          onChange={() => togglePoint(key)}
                          className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-950"
                        />
                        <span className="text-slate-200">{punto}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-500">Sin puntos definidos para este escenario.</p>
                )}
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Qué conceder</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {selectedEscenario?.queConceder?.length ? (
                      selectedEscenario.queConceder.map((item, index) => (
                        <li key={`conceder-${index}`}>• {item}</li>
                      ))
                    ) : (
                      <li className="text-xs text-slate-500">Sin concesiones propuestas.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Plan B</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {selectedEscenario?.planB?.length ? (
                      selectedEscenario.planB.map((item, index) => <li key={`planb-${index}`}>• {item}</li>)
                    ) : (
                      <li className="text-xs text-slate-500">Sin plan B definido.</li>
                    )}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-400">Documentos de mano</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    {selectedEscenario?.documentosDeMano?.length ? (
                      selectedEscenario.documentosDeMano.map((doc, index) => {
                        const match = resolveDocument({ documentTitle: doc });
                        const docUrl = match ? `/documents/${match.id}/view` : null;
                        return (
                          <li key={`doc-${index}`}>
                            {docUrl ? (
                              <Link to={docUrl} className="text-emerald-200 hover:text-emerald-100">
                                • {doc}
                              </Link>
                            ) : (
                              <span className="text-slate-300">• {doc}</span>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-xs text-slate-500">Sin documentos listados.</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {isPicassent && (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-[#1a202c] p-6 text-slate-100">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  Módulo de prescripción (Art. 1964 CC)
                </div>
                <h4 className="mt-2 text-lg font-semibold text-white">Línea de tiempo de deuda</h4>
                <div className="mt-4 overflow-hidden rounded-full border border-slate-700">
                  <div className="flex h-10 text-xs font-semibold uppercase">
                    <div className="flex w-1/2 items-center justify-center bg-rose-500/70 text-rose-100">
                      2008-2015 · Prescrita
                    </div>
                    <div className="flex w-1/2 items-center justify-center bg-emerald-500/70 text-emerald-50">
                      2016-2018 · Reclamable
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">
                  Prioriza la defensa con corte temporal claro para evitar contaminación del tramo prescrito.
                </p>
              </div>
              <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-6 text-rose-100">
                <div className="text-xs uppercase tracking-[0.2em] text-rose-200">Argumento de posesión</div>
                <h4 className="mt-2 text-lg font-semibold">Uso exclusivo = enriquecimiento injusto</h4>
                <p className="mt-3 text-sm text-rose-100/90">
                  Si la actora tuvo el uso exclusivo de la vivienda, insiste en que la liquidación debe ajustar ese
                  beneficio para evitar un enriquecimiento injusto. Conecta con compensación económica y reducción de la
                  reclamación.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <div className={viewMode === 'laboratorio' ? '' : 'hidden'} aria-hidden={viewMode !== 'laboratorio'}>
        <AnalisisTecnico
          caseId={caseId}
          facts={facts}
          partidas={partidas}
          documents={documents}
          onMonteCarloSummary={setMonteCarloSummary}
        />
      </div>
    </div>
  );
}
