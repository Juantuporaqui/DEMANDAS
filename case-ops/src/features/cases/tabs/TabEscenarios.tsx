import { useEffect, useMemo, useState } from 'react';
import type {
  Document,
  Fact,
  Issue,
  Link,
  Partida,
  Rule,
  ScenarioModel,
  ScenarioNode,
  Span,
} from '../../../types';
import {
  issuesRepo,
  linksRepo,
  rulesRepo,
  scenarioModelsRepo,
  scenarioNodesRepo,
  spansRepo,
} from '../../../db/repositories';

type ScenarioWeights = {
  issueAggregation?: 'and' | 'or';
  issueAggregationByPartida?: Record<string, 'and' | 'or'>;
  evidenceBoost?: number;
  rulePenalty?: number;
  contradictionsPenalty?: number;
};

type ActionCandidate = {
  id: string;
  label: string;
  etaHours: number;
  deltaExpected: number;
  roi: number;
  rationale: string;
};

const DEFAULT_SCENARIOS: Array<Pick<ScenarioModel, 'name' | 'assumptionsJson' | 'weightsJson'>> = [
  {
    name: 'Defensa fuerte',
    assumptionsJson: JSON.stringify({
      narrative: 'Mayor credibilidad en hechos defensivos y buen encaje probatorio.',
    }),
    weightsJson: JSON.stringify({ issueAggregation: 'and', evidenceBoost: 0.06, rulePenalty: 0.04 }),
  },
  {
    name: 'Intermedio',
    assumptionsJson: JSON.stringify({
      narrative: 'Equilibrio entre prueba existente y riesgos procesales.',
    }),
    weightsJson: JSON.stringify({ issueAggregation: 'and', evidenceBoost: 0.05, rulePenalty: 0.06 }),
  },
  {
    name: 'Peor caso',
    assumptionsJson: JSON.stringify({
      narrative: 'Escenario adverso con prueba débil y condicionantes legales fuertes.',
    }),
    weightsJson: JSON.stringify({ issueAggregation: 'or', evidenceBoost: 0.04, rulePenalty: 0.1 }),
  },
];

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const formatCurrency = (amountCents: number) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amountCents / 100);

const parseJson = <T,>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const randn = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
};

const getLinkRole = (link?: Link) => link?.meta?.role;

const linkInvolves = (link: Link, type: string, id: string) =>
  (link.fromType === type && link.fromId === id) || (link.toType === type && link.toId === id);

const getLinkedIds = (links: Link[], type: string, id: string, targetType: string) =>
  links
    .filter(
      (link) =>
        (link.fromType === type && link.fromId === id && link.toType === targetType) ||
        (link.toType === type && link.toId === id && link.fromType === targetType)
    )
    .map((link) => (link.fromType === targetType ? link.fromId : link.toId));

const unique = <T,>(items: T[]) => Array.from(new Set(items));

const burdenTargets: Record<Fact['burden'], number> = {
  actora: 3,
  demandado: 2,
  mixta: 4,
};

const computeCoverage = (fact: Fact, evidenceCount: number, contradictions: number) => {
  const target = burdenTargets[fact.burden] ?? 3;
  const base = (evidenceCount / target) * 0.7 + (fact.strength / 5) * 0.3;
  return clamp(base - contradictions * 0.1);
};

const computeFactBase = (
  fact: Fact,
  evidenceCount: number,
  contradictions: number,
  applicableRules: Rule[],
  weights: ScenarioWeights,
  scenarioNode?: ScenarioNode
) => {
  const base = fact.strength / 5;
  const evidenceBoost = evidenceCount * (weights.evidenceBoost ?? 0.05);
  const contradictionPenalty = contradictions * (weights.contradictionsPenalty ?? 0.08);
  const rulePenalty = applicableRules.length * (weights.rulePenalty ?? 0.06);
  const nodeAdjust = scenarioNode?.value ?? 0;
  return clamp(base + evidenceBoost + nodeAdjust - contradictionPenalty - rulePenalty, 0.05, 0.98);
};

const computeAggregated = (probs: number[], mode: 'and' | 'or') => {
  if (probs.length === 0) return 0.12;
  if (mode === 'or') {
    return clamp(1 - probs.reduce((acc, p) => acc * (1 - p), 1));
  }
  return clamp(probs.reduce((acc, p) => acc * p, 1));
};

const quantile = (values: number[], q: number) => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base] + (sorted[base + 1] - sorted[base]) * (rest || 0);
};

type ScenarioResult = {
  partidaId: string;
  pMean: number;
  p10: number;
  p90: number;
  expectedCents: number;
  drivers: Array<{ fact: Fact; base: number; evidenceCount: number }>;
};

type ScenarioComputation = {
  results: ScenarioResult[];
  totalExpectedCents: number;
};

const DEFAULT_SAMPLES = 2000;

type TabEscenariosProps = {
  caseId: string;
  facts: Fact[];
  partidas: Partida[];
  documents: Document[];
};

export function TabEscenarios({ caseId, facts, partidas, documents }: TabEscenariosProps) {
  const [spans, setSpans] = useState<Span[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [scenarioModels, setScenarioModels] = useState<ScenarioModel[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [scenarioNodes, setScenarioNodes] = useState<ScenarioNode[]>([]);

  useEffect(() => {
    let isActive = true;
    (async () => {
      const [spansData, linksData, issuesData, rulesData, modelsData] = await Promise.all([
        spansRepo.getByCaseId(caseId),
        linksRepo.getAll(),
        issuesRepo.getByCaseId(caseId),
        rulesRepo.getByCaseId(caseId),
        scenarioModelsRepo.getByCaseId(caseId),
      ]);

      if (!isActive) return;
      setSpans(spansData);
      setLinks(linksData);
      setIssues(issuesData);
      setRules(rulesData);

      if (modelsData.length === 0) {
        const created = await Promise.all(
          DEFAULT_SCENARIOS.map((scenario) =>
            scenarioModelsRepo.create({
              caseId,
              name: scenario.name,
              assumptionsJson: scenario.assumptionsJson,
              weightsJson: scenario.weightsJson,
            })
          )
        );
        if (!isActive) return;
        setScenarioModels(created);
        setSelectedScenarioId(created[0]?.id ?? null);
      } else {
        setScenarioModels(modelsData);
        setSelectedScenarioId((prev) => prev ?? modelsData[0]?.id ?? null);
      }
    })();

    return () => {
      isActive = false;
    };
  }, [caseId]);

  useEffect(() => {
    let isActive = true;
    if (!selectedScenarioId) return undefined;
    (async () => {
      const nodes = await scenarioNodesRepo.getByScenarioId(selectedScenarioId);
      if (isActive) {
        setScenarioNodes(nodes);
      }
    })();
    return () => {
      isActive = false;
    };
  }, [selectedScenarioId]);

  const scenarioMap = useMemo(
    () => new Map(scenarioNodes.map((node) => [`${node.nodeType}:${node.nodeId}`, node])),
    [scenarioNodes]
  );

  const linksForCase = useMemo(
    () =>
      links.filter(
        (link) =>
          facts.some((fact) => linkInvolves(link, 'fact', fact.id)) ||
          partidas.some((partida) => linkInvolves(link, 'partida', partida.id)) ||
          spans.some((span) => linkInvolves(link, 'span', span.id)) ||
          documents.some((doc) => linkInvolves(link, 'document', doc.id))
      ),
    [documents, facts, links, partidas, spans]
  );

  const evidenceByFact = useMemo(() => {
    const map = new Map<string, { evidenceCount: number; contradictions: number; evidenceIds: string[] }>();
    facts.forEach((fact) => {
      const evidenceLinks = linksForCase.filter(
        (link) =>
          linkInvolves(link, 'fact', fact.id) &&
          ['span', 'document'].includes(link.fromType === 'fact' ? link.toType : link.fromType) &&
          getLinkRole(link) === 'evidence'
      );
      const contradictLinks = linksForCase.filter(
        (link) => linkInvolves(link, 'fact', fact.id) && getLinkRole(link) === 'contradicts'
      );
      map.set(fact.id, {
        evidenceCount: evidenceLinks.length,
        contradictions: contradictLinks.length,
        evidenceIds: unique(
          evidenceLinks.map((link) => (link.fromType === 'fact' ? link.toId : link.fromId))
        ),
      });
    });
    return map;
  }, [facts, linksForCase]);

  const scenarioWeights = useMemo(() => {
    const scenario = scenarioModels.find((model) => model.id === selectedScenarioId);
    if (!scenario) return {};
    return parseJson<ScenarioWeights>(scenario.weightsJson, {});
  }, [scenarioModels, selectedScenarioId]);

  const computeScenario = (overrides?: {
    extraEvidence?: Record<string, number>;
    reduceContradictions?: Record<string, number>;
    forcedPartidaProb?: Record<string, number>;
  }): ScenarioComputation => {
    const results: ScenarioResult[] = [];
    const totalExpectedCents = partidas.reduce((acc, partida) => {
      const factIds = unique(getLinkedIds(linksForCase, 'partida', partida.id, 'fact'));
      const relevantFacts = facts.filter((fact) => factIds.includes(fact.id));
      const aggregation =
        scenarioWeights.issueAggregationByPartida?.[partida.id] ?? scenarioWeights.issueAggregation ?? 'and';

      const sampleValues: number[] = [];
      const drivers: Array<{ fact: Fact; base: number; evidenceCount: number }> = [];

      relevantFacts.forEach((fact) => {
        const evidence = evidenceByFact.get(fact.id);
        const evidenceCount = (evidence?.evidenceCount ?? 0) + (overrides?.extraEvidence?.[fact.id] ?? 0);
        const contradictions = Math.max(
          0,
          (evidence?.contradictions ?? 0) - (overrides?.reduceContradictions?.[fact.id] ?? 0)
        );
        const applicableRules = rules.filter((rule) =>
          rule.appliesToTags?.some((tag) => fact.tags.includes(tag) || partida.tags.includes(tag))
        );
        const scenarioNode = scenarioMap.get(`fact:${fact.id}`);
        const base = computeFactBase(
          fact,
          evidenceCount,
          contradictions,
          applicableRules,
          scenarioWeights,
          scenarioNode
        );
        drivers.push({ fact, base, evidenceCount });
      });

      for (let i = 0; i < DEFAULT_SAMPLES; i += 1) {
        const pFacts = relevantFacts.map((fact) => {
          const evidence = evidenceByFact.get(fact.id);
          const evidenceCount = (evidence?.evidenceCount ?? 0) + (overrides?.extraEvidence?.[fact.id] ?? 0);
          const contradictions = Math.max(
            0,
            (evidence?.contradictions ?? 0) - (overrides?.reduceContradictions?.[fact.id] ?? 0)
          );
          const applicableRules = rules.filter((rule) =>
            rule.appliesToTags?.some((tag) => fact.tags.includes(tag) || partida.tags.includes(tag))
          );
          const scenarioNode = scenarioMap.get(`fact:${fact.id}`);
          const base = computeFactBase(
            fact,
            evidenceCount,
            contradictions,
            applicableRules,
            scenarioWeights,
            scenarioNode
          );
          const confidence = clamp(scenarioNode?.confidence ?? 0.7);
          const noise = randn() * 0.12 * (1 - confidence);
          return clamp(base + noise, 0.02, 0.99);
        });

        const aggregated = computeAggregated(pFacts, aggregation);
        sampleValues.push(aggregated);
      }

      const forcedProb = overrides?.forcedPartidaProb?.[partida.id];
      const pMean = forcedProb ?? sampleValues.reduce((accSum, value) => accSum + value, 0) / sampleValues.length;
      const p10 = forcedProb ?? quantile(sampleValues, 0.1);
      const p90 = forcedProb ?? quantile(sampleValues, 0.9);
      const expectedCents = Math.round(pMean * partida.amountCents);
      results.push({
        partidaId: partida.id,
        pMean,
        p10,
        p90,
        expectedCents,
        drivers: drivers.sort((a, b) => b.base - a.base).slice(0, 3),
      });

      return acc + expectedCents;
    }, 0);

    return { results, totalExpectedCents };
  };

  const scenarioResult = useMemo(() => computeScenario(), [
    caseId,
    facts,
    partidas,
    linksForCase,
    scenarioWeights,
    rules,
    evidenceByFact,
    scenarioMap,
  ]);

  const coverageData = useMemo(() => {
    const items = facts.map((fact) => {
      const evidence = evidenceByFact.get(fact.id);
      const score = computeCoverage(fact, evidence?.evidenceCount ?? 0, evidence?.contradictions ?? 0);
      return { fact, score, evidenceCount: evidence?.evidenceCount ?? 0 };
    });
    return {
      items,
      missing: items.filter((item) => item.score < 0.35),
    };
  }, [facts, evidenceByFact]);

  const actionCandidates = useMemo(() => {
    const actions: ActionCandidate[] = [];
    const baseTotal = scenarioResult.totalExpectedCents;
    const factsByStrength = [...facts].sort((a, b) => b.strength - a.strength);
    const strongestFact = factsByStrength[0];

    const docsWithoutSpans = documents.filter((doc) => !spans.some((span) => span.documentId === doc.id));
    docsWithoutSpans.forEach((doc) => {
      if (!strongestFact) return;
      const result = computeScenario({ extraEvidence: { [strongestFact.id]: 1 } });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `span-${doc.id}`,
        label: `Crear span en ${doc.title}`,
        etaHours: 0.4,
        deltaExpected: delta,
        roi: delta / 0.4,
        rationale: 'Genera evidencia básica para conectar con hechos clave.',
      });
    });

    const spansWithoutLinks = spans.filter(
      (span) => !linksForCase.some((link) => linkInvolves(link, 'span', span.id))
    );
    spansWithoutLinks.slice(0, 5).forEach((span) => {
      const targetFact = coverageData.items.find((item) => item.score < 0.5)?.fact ?? strongestFact;
      if (!targetFact) return;
      const result = computeScenario({ extraEvidence: { [targetFact.id]: 1 } });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `link-span-${span.id}`,
        label: `Vincular span “${span.label}” a ${targetFact.title}`,
        etaHours: 0.25,
        deltaExpected: delta,
        roi: delta / 0.25,
        rationale: 'Aumenta cobertura probatoria del hecho más débil.',
      });
    });

    const partidasSinHechos = partidas.filter(
      (partida) => getLinkedIds(linksForCase, 'partida', partida.id, 'fact').length === 0
    );
    partidasSinHechos.forEach((partida) => {
      const result = computeScenario({ forcedPartidaProb: { [partida.id]: 0.3 } });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `fact-${partida.id}`,
        label: `Crear hecho para ${partida.concept}`,
        etaHours: 1,
        deltaExpected: delta,
        roi: delta,
        rationale: 'Introduce base fáctica mínima donde no existe soporte.',
      });
    });

    coverageData.items
      .filter((item) => (evidenceByFact.get(item.fact.id)?.contradictions ?? 0) > 0)
      .forEach((item) => {
        const result = computeScenario({ reduceContradictions: { [item.fact.id]: 1 } });
        const delta = result.totalExpectedCents - baseTotal;
        actions.push({
          id: `contradiction-${item.fact.id}`,
          label: `Marcar contradicción en ${item.fact.title}`,
          etaHours: 0.5,
          deltaExpected: delta,
          roi: delta / 0.5,
          rationale: 'Reduce penalización por evidencia contradictoria.',
        });
      });

    return actions
      .filter((action) => Number.isFinite(action.roi))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 10);
  }, [
    coverageData,
    documents,
    evidenceByFact,
    facts,
    linksForCase,
    partidas,
    scenarioResult.totalExpectedCents,
    spans,
  ]);

  const paths = useMemo(() => {
    return partidas.map((partida) => {
      const factIds = unique(getLinkedIds(linksForCase, 'partida', partida.id, 'fact'));
      const factItems = factIds
        .map((id) => facts.find((fact) => fact.id === id))
        .filter(Boolean) as Fact[];
      const pathsForPartida = factItems.map((fact) => {
        const evidence = evidenceByFact.get(fact.id);
        return {
          fact,
          evidenceIds: evidence?.evidenceIds ?? [],
        };
      });
      return {
        partida,
        paths: pathsForPartida,
      };
    });
  }, [partidas, linksForCase, facts, evidenceByFact]);

  const selectedScenario = scenarioModels.find((model) => model.id === selectedScenarioId);
  const selectedAssumptions = selectedScenario
    ? parseJson<{ narrative?: string }>(selectedScenario.assumptionsJson, {})
    : {};

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">🧠 Escenarios (Grafo)</h3>
            <p className="text-xs text-slate-400">
              Estimación orientativa y auditable con propagación por hechos, prueba y reglas.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Monte Carlo {DEFAULT_SAMPLES} muestras
          </span>
        </div>
        {selectedAssumptions.narrative && (
          <p className="mt-3 text-xs text-slate-400">{selectedAssumptions.narrative}</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">1) Selector de escenario</h3>
          <span className="text-xs text-slate-500">{issues.length} issues registradas</span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {scenarioModels.map((scenario) => (
            <button
              key={scenario.id}
              type="button"
              onClick={() => setSelectedScenarioId(scenario.id)}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                selectedScenarioId === scenario.id
                  ? 'border-blue-500 bg-blue-500/10 text-blue-100'
                  : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="text-xs uppercase tracking-wide text-slate-400">Escenario</div>
              <div className="mt-1 text-sm font-semibold text-white">{scenario.name}</div>
              <div className="mt-2 text-[11px] text-slate-400 line-clamp-2">{scenario.assumptionsJson}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-white">2) Tabla de partidas</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-left text-xs text-slate-300">
            <thead className="text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="py-2 pr-4">Partida</th>
                <th className="py-2 pr-4">Prob.</th>
                <th className="py-2 pr-4">Intervalo</th>
                <th className="py-2 pr-4">€ Esperado</th>
                <th className="py-2">Badges</th>
              </tr>
            </thead>
            <tbody>
              {scenarioResult.results.map((result) => {
                const partida = partidas.find((item) => item.id === result.partidaId);
                if (!partida) return null;
                return (
                  <tr key={result.partidaId} className="border-t border-slate-800">
                    <td className="py-2 pr-4">
                      <div className="font-semibold text-white">{partida.concept}</div>
                      <div className="text-[11px] text-slate-500">{partida.id}</div>
                    </td>
                    <td className="py-2 pr-4">{(result.pMean * 100).toFixed(1)}%</td>
                    <td className="py-2 pr-4">
                      {(result.p10 * 100).toFixed(1)}% · {(result.p90 * 100).toFixed(1)}%
                    </td>
                    <td className="py-2 pr-4 font-semibold text-emerald-200">
                      {formatCurrency(result.expectedCents)}
                    </td>
                    <td className="py-2">
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                        {partida.state}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-700 text-sm font-semibold text-white">
                <td className="py-2 pr-4">Total</td>
                <td />
                <td />
                <td className="py-2 pr-4 text-emerald-200">
                  {formatCurrency(scenarioResult.totalExpectedCents)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-white">3) Panel grafo (vista simple)</h3>
          <div className="mt-3 space-y-4 text-xs text-slate-300">
            {paths.map((entry) => (
              <div key={entry.partida.id} className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
                <div className="text-sm font-semibold text-white">{entry.partida.concept}</div>
                {entry.paths.length === 0 ? (
                  <p className="mt-2 text-[11px] text-slate-500">Sin hechos vinculados.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {entry.paths.map((path) => (
                      <li key={path.fact.id} className="flex flex-col gap-1">
                        <span className="text-slate-200">Partida → {path.fact.title}</span>
                        <span className="text-[11px] text-slate-500">
                          Evidencias: {path.evidenceIds.length}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 text-[11px] text-slate-400">
                  Drivers:{' '}
                  {scenarioResult.results
                    .find((result) => result.partidaId === entry.partida.id)
                    ?.drivers.map((driver) => driver.fact.title)
                    .join(' · ') || 'sin drivers'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-white">4) Heatmap cobertura hechos</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {coverageData.items.map((item) => (
              <div
                key={item.fact.id}
                className="rounded-lg border border-slate-800/70 p-2"
                style={{
                  backgroundColor: `rgba(34,197,94,${item.score * 0.35 + 0.05})`,
                }}
              >
                <div className="text-white">{item.fact.title}</div>
                <div className="text-[11px] text-slate-900/80">
                  {Math.round(item.score * 100)}% · {item.evidenceCount} evidencias
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-[11px] text-rose-200">
            <div className="font-semibold">Hechos sin soporte</div>
            {coverageData.missing.length === 0 ? (
              <p className="mt-2 text-rose-100/80">Sin hechos críticos sin soporte.</p>
            ) : (
              <ul className="mt-2 list-disc pl-4">
                {coverageData.missing.map((item) => (
                  <li key={item.fact.id}>{item.fact.title}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-white">5) Next Best Actions</h3>
        <div className="mt-3 space-y-3">
          {actionCandidates.length === 0 ? (
            <p className="text-xs text-slate-500">No hay acciones sugeridas.</p>
          ) : (
            actionCandidates.map((action, index) => (
              <div
                key={action.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/70 bg-slate-950/30 px-3 py-2 text-xs text-slate-300"
              >
                <div>
                  <div className="font-semibold text-white">
                    #{index + 1} · {action.label}
                  </div>
                  <div className="text-[11px] text-slate-500">{action.rationale}</div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] uppercase text-slate-500">Δ€</div>
                    <div className="font-semibold text-emerald-200">
                      {formatCurrency(action.deltaExpected)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-slate-500">ROI</div>
                    <div className="font-semibold text-emerald-200">
                      {formatCurrency(Math.round(action.roi))}
                      <span className="text-[10px] text-slate-400">/h</span>
                    </div>
                  </div>
                  <span className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-400">
                    {action.etaHours}h
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
