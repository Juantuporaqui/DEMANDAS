import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
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
  targetFactId?: string;
  targetPartidaId?: string;
  targetDocumentId?: string;
  targetSpanId?: string;
  targetPage?: number;
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

const hashString = (value: string) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const mulberry32 = (seed: number) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let result = t;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const randn = (rng: () => number) => {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
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
  applicableRulesCount: number,
  weights: ScenarioWeights,
  scenarioNode?: ScenarioNode
) => {
  const base = fact.strength / 5;
  const evidenceBoost = evidenceCount * (weights.evidenceBoost ?? 0.05);
  const contradictionPenalty = contradictions * (weights.contradictionsPenalty ?? 0.08);
  const rulePenalty = applicableRulesCount * (weights.rulePenalty ?? 0.06);
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
  totalSamples: number[];
  perPartidaExpected: Array<{ partidaId: string; expectedCents: number }>;
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
  const [selectedPartidaId, setSelectedPartidaId] = useState<string | null>(null);
  const scenarioNodeTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const scenarioModelTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

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
  const documentsById = useMemo(() => new Map(documents.map((doc) => [doc.id, doc])), [documents]);
  const spansById = useMemo(() => new Map(spans.map((span) => [span.id, span])), [spans]);

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

  const updateScenarioModel = (id: string, updates: Partial<ScenarioModel>) => {
    setScenarioModels((prev) =>
      prev.map((model) => (model.id === id ? { ...model, ...updates, updatedAt: Date.now() } : model))
    );
    const existingTimeout = scenarioModelTimeouts.current.get(id);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    const timeout = setTimeout(() => {
      scenarioModelsRepo.update(id, updates);
      scenarioModelTimeouts.current.delete(id);
    }, 300);
    scenarioModelTimeouts.current.set(id, timeout);
  };

  const scheduleScenarioNodeUpsert = (
    scenarioId: string,
    nodeType: ScenarioNode['nodeType'],
    nodeId: string,
    updates: Pick<ScenarioNode, 'value' | 'confidence'>
  ) => {
    const key = `${scenarioId}:${nodeType}:${nodeId}`;
    setScenarioNodes((prev) => {
      const existing = prev.find((node) => node.scenarioId === scenarioId && node.nodeType === nodeType && node.nodeId === nodeId);
      if (existing) {
        return prev.map((node) => (node.id === existing.id ? { ...node, ...updates } : node));
      }
      const now = Date.now();
      const tempNode: ScenarioNode = {
        id: `temp-${key}`,
        scenarioId,
        nodeType,
        nodeId,
        value: updates.value,
        confidence: updates.confidence,
        createdAt: now,
        updatedAt: now,
      };
      return [...prev, tempNode];
    });

    const existingTimeout = scenarioNodeTimeouts.current.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    const timeout = setTimeout(async () => {
      const saved = await scenarioNodesRepo.upsertByKey(scenarioId, nodeType, nodeId, updates);
      setScenarioNodes((prev) => {
        const withoutTemp = prev.filter((node) => !(node.id.startsWith('temp-') && node.nodeId === nodeId && node.nodeType === nodeType));
        const exists = withoutTemp.find((node) => node.id === saved.id);
        if (exists) {
          return withoutTemp.map((node) => (node.id === saved.id ? saved : node));
        }
        return [...withoutTemp, saved];
      });
      scenarioNodeTimeouts.current.delete(key);
    }, 300);
    scenarioNodeTimeouts.current.set(key, timeout);
  };

  const computeScenario = useCallback(
    ({
      samples = DEFAULT_SAMPLES,
      overrides,
    }: {
      samples?: number;
      overrides?: {
        extraEvidence?: Record<string, number>;
        reduceContradictions?: Record<string, number>;
        forcedPartidaProb?: Record<string, number>;
      };
    } = {}): ScenarioComputation => {
      const results: ScenarioResult[] = [];
      const totalSamples = Array.from({ length: samples }, () => 0);

      partidas.forEach((partida) => {
        const factIds = unique(getLinkedIds(linksForCase, 'partida', partida.id, 'fact'));
        const relevantFacts = facts.filter((fact) => factIds.includes(fact.id));
        const aggregation =
          scenarioWeights.issueAggregationByPartida?.[partida.id] ?? scenarioWeights.issueAggregation ?? 'and';

        const sampleValues: number[] = [];
        const drivers: Array<{ fact: Fact; base: number; evidenceCount: number }> = [];
        const scenarioKeyBase = `${selectedScenarioId ?? 'default'}:${partida.id}`;

        const precalcFacts = relevantFacts.map((fact) => {
          const evidence = evidenceByFact.get(fact.id);
          const evidenceCount = Math.max(
            0,
            (evidence?.evidenceCount ?? 0) + (overrides?.extraEvidence?.[fact.id] ?? 0)
          );
          const contradictions = Math.max(
            0,
            (evidence?.contradictions ?? 0) - (overrides?.reduceContradictions?.[fact.id] ?? 0)
          );
          const applicableRules = rules.filter((rule) =>
            rule.appliesToTags?.some((tag) => fact.tags.includes(tag) || partida.tags.includes(tag))
          );
          const applicableRulesCount = applicableRules.length;
          const scenarioNode = scenarioMap.get(`fact:${fact.id}`);
          const base = computeFactBase(
            fact,
            evidenceCount,
            contradictions,
            applicableRulesCount,
            scenarioWeights,
            scenarioNode
          );
          const confidence = clamp(scenarioNode?.confidence ?? 0.7);
          const sigma = 0.12 * (1 - confidence);
          const rng = mulberry32(hashString(`${scenarioKeyBase}:${fact.id}`));
          drivers.push({ fact, base, evidenceCount });
          return {
            fact,
            evidenceCount,
            contradictions,
            applicableRulesCount,
            scenarioNode,
            base,
            sigma,
            rng,
          };
        });

        for (let i = 0; i < samples; i += 1) {
          const pFacts = precalcFacts.map((factData) => {
            const noise = randn(factData.rng) * factData.sigma;
            return clamp(factData.base + noise, 0.02, 0.99);
          });

          const aggregated = computeAggregated(pFacts, aggregation);
          sampleValues.push(aggregated);
          totalSamples[i] += aggregated * partida.amountCents;
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
      });

      const totalExpectedCents = Math.round(
        totalSamples.reduce((accSum, value) => accSum + value, 0) / Math.max(totalSamples.length, 1)
      );
      const perPartidaExpected = results.map((result) => ({
        partidaId: result.partidaId,
        expectedCents: result.expectedCents,
      }));

      return { results, totalExpectedCents, totalSamples, perPartidaExpected };
    },
    [evidenceByFact, facts, linksForCase, partidas, rules, scenarioMap, scenarioWeights, selectedScenarioId]
  );

  const scenarioResult = useMemo(() => computeScenario(), [computeScenario]);

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

  const dataQuality = useMemo(() => {
    const partidasWithoutFacts = partidas.filter(
      (partida) => getLinkedIds(linksForCase, 'partida', partida.id, 'fact').length === 0
    );
    const factsWithoutEvidence = facts.filter(
      (fact) => (evidenceByFact.get(fact.id)?.evidenceCount ?? 0) === 0
    );
    const spansWithoutLinks = spans.filter(
      (span) => !linksForCase.some((link) => linkInvolves(link, 'span', span.id))
    );
    return {
      partidasWithoutFacts,
      factsWithoutEvidence,
      spansWithoutLinks,
    };
  }, [evidenceByFact, facts, linksForCase, partidas, spans]);

  const actionCandidates = useMemo(() => {
    const actions: ActionCandidate[] = [];
    const baseTotal = scenarioResult.totalExpectedCents;
    const docsWithoutSpans = documents
      .filter((doc) => !spans.some((span) => span.documentId === doc.id))
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5);
    const spansWithoutLinks = spans.filter(
      (span) => !linksForCase.some((link) => linkInvolves(link, 'span', span.id))
    );
    const factsWithoutEvidence = facts.filter(
      (fact) => (evidenceByFact.get(fact.id)?.evidenceCount ?? 0) === 0
    );
    const topPartidas = [...scenarioResult.results]
      .sort((a, b) => b.expectedCents - a.expectedCents)
      .slice(0, 3);
    const topPartidaIds = new Set(topPartidas.map((item) => item.partidaId));

    const bottlenecks = topPartidas
      .map((result) => {
        const partida = partidas.find((item) => item.id === result.partidaId);
        if (!partida) return null;
        const factIds = unique(getLinkedIds(linksForCase, 'partida', partida.id, 'fact'));
        const relevantFacts = facts.filter((fact) => factIds.includes(fact.id));
        const ranked = relevantFacts
          .map((fact) => {
            const evidence = evidenceByFact.get(fact.id);
            const evidenceCount = evidence?.evidenceCount ?? 0;
            const contradictions = evidence?.contradictions ?? 0;
            const coverage = computeCoverage(fact, evidenceCount, contradictions);
            return { fact, coverage, contradictions };
          })
          .sort((a, b) => a.coverage - b.coverage || b.contradictions - a.contradictions);
        const selected = ranked[0];
        if (!selected) return null;
        return { partidaId: partida.id, ...selected };
      })
      .filter(Boolean) as Array<{ partidaId: string; fact: Fact; coverage: number; contradictions: number }>;

    const globalBottleneck = bottlenecks.sort(
      (a, b) => a.coverage - b.coverage || b.contradictions - a.contradictions
    )[0];
    const targetForNewSpan = globalBottleneck?.fact ?? factsWithoutEvidence[0];
    const targetForLink = [...coverageData.items].sort((a, b) => a.score - b.score)[0]?.fact;
    docsWithoutSpans.forEach((doc) => {
      if (!targetForNewSpan) return;
      const result = computeScenario({
        samples: 250,
        overrides: { extraEvidence: { [targetForNewSpan.id]: 1 } },
      });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `span-${doc.id}`,
        label: `Crear span en ${doc.title}`,
        etaHours: 0.4,
        deltaExpected: delta,
        roi: delta / 0.4,
        rationale: 'Genera evidencia básica para conectar con hechos clave.',
        targetFactId: targetForNewSpan.id,
        targetPartidaId: globalBottleneck?.partidaId,
        targetDocumentId: doc.id,
      });
    });

    spansWithoutLinks.slice(0, 8).forEach((span) => {
      if (!targetForLink) return;
      const result = computeScenario({
        samples: 250,
        overrides: { extraEvidence: { [targetForLink.id]: 1 } },
      });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `link-span-${span.id}`,
        label: `Vincular span “${span.label}” a ${targetForLink.title}`,
        etaHours: 0.25,
        deltaExpected: delta,
        roi: delta / 0.25,
        rationale: 'Aumenta cobertura probatoria del hecho más débil.',
        targetFactId: targetForLink.id,
        targetSpanId: span.id,
        targetDocumentId: span.documentId,
        targetPage: span.pageStart,
      });
    });

    const partidasSinHechos = partidas.filter(
      (partida) => getLinkedIds(linksForCase, 'partida', partida.id, 'fact').length === 0
    );
    partidasSinHechos.forEach((partida) => {
      const result = computeScenario({ samples: 250, overrides: { forcedPartidaProb: { [partida.id]: 0.3 } } });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `fact-${partida.id}`,
        label: `Crear hecho para ${partida.concept}`,
        etaHours: 1,
        deltaExpected: delta,
        roi: delta,
        rationale: 'Introduce base fáctica mínima donde no existe soporte.',
        targetPartidaId: partida.id,
      });
    });

    const contradictionFacts = coverageData.items.filter(
      (item) => (evidenceByFact.get(item.fact.id)?.contradictions ?? 0) > 0
    );
    const contradictionCandidates = contradictionFacts.filter((item) => {
      const linkedPartidas = getLinkedIds(linksForCase, 'fact', item.fact.id, 'partida');
      return linkedPartidas.some((id) => topPartidaIds.has(id));
    });
    const contradictionsToUse = contradictionCandidates.length > 0 ? contradictionCandidates : contradictionFacts;

    contradictionsToUse.forEach((item) => {
      const result = computeScenario({ samples: 250, overrides: { reduceContradictions: { [item.fact.id]: 1 } } });
      const delta = result.totalExpectedCents - baseTotal;
      actions.push({
        id: `contradiction-${item.fact.id}`,
        label: `Marcar contradicción en ${item.fact.title}`,
        etaHours: 0.5,
        deltaExpected: delta,
        roi: delta / 0.5,
        rationale: 'Reduce penalización por evidencia contradictoria.',
        targetFactId: item.fact.id,
      });
    });

    return actions
      .filter((action) => Number.isFinite(action.roi))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 10);
  }, [
    coverageData,
    computeScenario,
    documents,
    evidenceByFact,
    facts,
    linksForCase,
    partidas,
    scenarioResult.results,
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

  useEffect(() => {
    if (scenarioResult.results.length === 0) {
      setSelectedPartidaId(null);
      return;
    }
    const exists = scenarioResult.results.some((result) => result.partidaId === selectedPartidaId);
    if (!exists) {
      setSelectedPartidaId(scenarioResult.results[0]?.partidaId ?? null);
    }
  }, [scenarioResult.results, selectedPartidaId]);

  const selectedPartida = useMemo(
    () => partidas.find((partida) => partida.id === selectedPartidaId) ?? null,
    [partidas, selectedPartidaId]
  );

  const selectedPartidaFacts = useMemo(() => {
    if (!selectedPartida) return [];
    const factIds = unique(getLinkedIds(linksForCase, 'partida', selectedPartida.id, 'fact'));
    return facts.filter((fact) => factIds.includes(fact.id));
  }, [facts, linksForCase, selectedPartida]);

  const topPartidasChart = useMemo(() => {
    const sorted = [...scenarioResult.results].sort((a, b) => b.expectedCents - a.expectedCents);
    const top = sorted.slice(0, 12);
    const restTotal = sorted.slice(12).reduce((acc, item) => acc + item.expectedCents, 0);
    const data = top.map((item) => {
      const partida = partidas.find((p) => p.id === item.partidaId);
      return {
        label: partida?.concept ?? item.partidaId,
        expectedCents: item.expectedCents,
      };
    });
    if (restTotal > 0) {
      data.push({ label: 'Resto', expectedCents: restTotal });
    }
    return data;
  }, [partidas, scenarioResult.results]);

  const histogramData = useMemo(() => {
    if (scenarioResult.totalSamples.length === 0) return [];
    const min = Math.min(...scenarioResult.totalSamples);
    const max = Math.max(...scenarioResult.totalSamples);
    if (min === max) {
      return [{ label: formatCurrency(min), count: scenarioResult.totalSamples.length }];
    }
    const bins = 20;
    const step = (max - min) / bins;
    const counts = Array.from({ length: bins }, () => 0);
    scenarioResult.totalSamples.forEach((value) => {
      const index = Math.min(bins - 1, Math.floor((value - min) / step));
      counts[index] += 1;
    });
    return counts.map((count, index) => {
      const start = min + index * step;
      const end = start + step;
      return {
        label: `${formatCurrency(start)} - ${formatCurrency(end)}`,
        count,
      };
    });
  }, [scenarioResult.totalSamples]);

  const tornadoData = useMemo(() => {
    if (!selectedPartida) return [];
    const baseExpected =
      scenarioResult.perPartidaExpected.find((item) => item.partidaId === selectedPartida.id)?.expectedCents ?? 0;
    const factBases = selectedPartidaFacts
      .map((fact) => {
        const evidence = evidenceByFact.get(fact.id);
        const evidenceCount = evidence?.evidenceCount ?? 0;
        const contradictions = evidence?.contradictions ?? 0;
        const applicableRules = rules.filter((rule) =>
          rule.appliesToTags?.some((tag) => fact.tags.includes(tag) || selectedPartida.tags.includes(tag))
        );
        const applicableRulesCount = applicableRules.length;
        const scenarioNode = scenarioMap.get(`fact:${fact.id}`);
        const base = computeFactBase(
          fact,
          evidenceCount,
          contradictions,
          applicableRulesCount,
          scenarioWeights,
          scenarioNode
        );
        return { fact, base };
      })
      .sort((a, b) => b.base - a.base)
      .slice(0, 6);

    return factBases.map(({ fact }) => {
      const plus = computeScenario({ samples: 300, overrides: { extraEvidence: { [fact.id]: 1 } } });
      const minus = computeScenario({ samples: 300, overrides: { extraEvidence: { [fact.id]: -1 } } });
      const plusExpected =
        plus.perPartidaExpected.find((item) => item.partidaId === selectedPartida.id)?.expectedCents ?? baseExpected;
      const minusExpected =
        minus.perPartidaExpected.find((item) => item.partidaId === selectedPartida.id)?.expectedCents ?? baseExpected;
      return {
        label: fact.title,
        plus: plusExpected - baseExpected,
        minus: minusExpected - baseExpected,
      };
    });
  }, [
    evidenceByFact,
    computeScenario,
    rules,
    scenarioMap,
    scenarioResult.perPartidaExpected,
    scenarioWeights,
    selectedPartida,
    selectedPartidaFacts,
  ]);

  const selectedScenario = scenarioModels.find((model) => model.id === selectedScenarioId);
  const selectedAssumptions = selectedScenario
    ? parseJson<{ narrative?: string }>(selectedScenario.assumptionsJson, {})
    : {};
  const selectedWeights = selectedScenario ? parseJson<ScenarioWeights>(selectedScenario.weightsJson, {}) : {};

  const handleCreateScenario = async () => {
    const created = await scenarioModelsRepo.create({
      caseId,
      name: 'Nuevo escenario',
      assumptionsJson: JSON.stringify({ narrative: '' }),
      weightsJson: JSON.stringify({
        issueAggregation: 'and',
        evidenceBoost: 0.05,
        rulePenalty: 0.06,
        contradictionsPenalty: 0.08,
      }),
    });
    setScenarioModels((prev) => [created, ...prev]);
    setSelectedScenarioId(created.id);
  };

  const handleCloneScenario = async () => {
    if (!selectedScenario) return;
    const created = await scenarioModelsRepo.create({
      caseId,
      name: `Copia de ${selectedScenario.name}`,
      assumptionsJson: selectedScenario.assumptionsJson,
      weightsJson: selectedScenario.weightsJson,
    });
    setScenarioModels((prev) => [created, ...prev]);
    setSelectedScenarioId(created.id);
  };

  const handleDeleteScenario = async () => {
    if (!selectedScenario || scenarioModels.length <= 1) return;
    await scenarioModelsRepo.delete(selectedScenario.id);
    setScenarioModels((prev) => prev.filter((model) => model.id !== selectedScenario.id));
    setSelectedScenarioId((prev) => {
      if (prev !== selectedScenario.id) return prev;
      const remaining = scenarioModels.filter((model) => model.id !== selectedScenario.id);
      return remaining[0]?.id ?? null;
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">🧠 Escenarios (Grafo)</h3>
            <p className="text-xs text-slate-400">
              Estimación orientativa (no predicción judicial). Depende de enlaces y supuestos.
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

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
        <div className="text-sm font-semibold text-white">Calidad de datos</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
            <div className="text-[11px] uppercase text-slate-500">Partidas sin hechos</div>
            <div className="mt-1 text-lg font-semibold text-rose-200">
              {dataQuality.partidasWithoutFacts.length}
            </div>
          </div>
          <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
            <div className="text-[11px] uppercase text-slate-500">Facts sin evidencia</div>
            <div className="mt-1 text-lg font-semibold text-rose-200">
              {dataQuality.factsWithoutEvidence.length}
            </div>
          </div>
          <div className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-3">
            <div className="text-[11px] uppercase text-slate-500">Spans sin links</div>
            <div className="mt-1 text-lg font-semibold text-rose-200">
              {dataQuality.spansWithoutLinks.length}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">1) Selector de escenario</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">{issues.length} issues registradas</span>
            <button
              type="button"
              onClick={handleCreateScenario}
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500"
            >
              + Nuevo
            </button>
            <button
              type="button"
              onClick={handleCloneScenario}
              disabled={!selectedScenario}
              className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clonar
            </button>
            <button
              type="button"
              onClick={handleDeleteScenario}
              disabled={!selectedScenario || scenarioModels.length <= 1}
              className="rounded-full border border-rose-500/40 px-3 py-1 text-[11px] text-rose-200 hover:border-rose-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Borrar
            </button>
          </div>
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
              <div className="mt-2 text-[11px] text-slate-400 line-clamp-2">
                {parseJson<{ narrative?: string }>(scenario.assumptionsJson, {}).narrative ?? 'Sin narrativa'}
              </div>
            </button>
          ))}
        </div>
        {selectedScenario && (
          <div className="mt-4 grid gap-3 rounded-xl border border-slate-800/70 bg-slate-950/40 p-3 text-xs text-slate-200 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-slate-500">Nombre</span>
              <input
                value={selectedScenario.name}
                onChange={(event) => updateScenarioModel(selectedScenario.id, { name: event.target.value })}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-slate-500">Narrativa</span>
              <textarea
                value={selectedAssumptions.narrative ?? ''}
                onChange={(event) =>
                  updateScenarioModel(
                    selectedScenario.id,
                    { assumptionsJson: JSON.stringify({ ...selectedAssumptions, narrative: event.target.value }) }
                  )
                }
                rows={2}
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-slate-500">Agregación</span>
              <select
                value={selectedWeights.issueAggregation ?? 'and'}
                onChange={(event) =>
                  updateScenarioModel(
                    selectedScenario.id,
                    {
                      weightsJson: JSON.stringify({
                        ...selectedWeights,
                        issueAggregation: event.target.value as 'and' | 'or',
                      }),
                    }
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              >
                <option value="and">AND (más estricto)</option>
                <option value="or">OR (más flexible)</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-slate-500">Evidence boost</span>
              <input
                type="number"
                step="0.01"
                value={selectedWeights.evidenceBoost ?? 0}
                onChange={(event) =>
                  updateScenarioModel(
                    selectedScenario.id,
                    {
                      weightsJson: JSON.stringify({
                        ...selectedWeights,
                        evidenceBoost: Number(event.target.value),
                      }),
                    }
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-slate-500">Rule penalty</span>
              <input
                type="number"
                step="0.01"
                value={selectedWeights.rulePenalty ?? 0}
                onChange={(event) =>
                  updateScenarioModel(
                    selectedScenario.id,
                    {
                      weightsJson: JSON.stringify({
                        ...selectedWeights,
                        rulePenalty: Number(event.target.value),
                      }),
                    }
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-[11px] uppercase text-slate-500">Contradictions penalty</span>
              <input
                type="number"
                step="0.01"
                value={selectedWeights.contradictionsPenalty ?? 0}
                onChange={(event) =>
                  updateScenarioModel(
                    selectedScenario.id,
                    {
                      weightsJson: JSON.stringify({
                        ...selectedWeights,
                        contradictionsPenalty: Number(event.target.value),
                      }),
                    }
                  )
                }
                className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm text-slate-100"
              />
            </label>
          </div>
        )}
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
                const isSelected = selectedPartidaId === partida.id;
                const hasNoFacts = getLinkedIds(linksForCase, 'partida', partida.id, 'fact').length === 0;
                return (
                  <tr
                    key={result.partidaId}
                    className={`cursor-pointer border-t border-slate-800 transition ${
                      isSelected ? 'bg-blue-500/10' : 'hover:bg-slate-800/40'
                    }`}
                    onClick={() => setSelectedPartidaId(partida.id)}
                  >
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
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {partida.state}
                        </span>
                        {hasNoFacts && (
                          <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                            SIN HECHOS
                          </span>
                        )}
                      </div>
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

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-white">2.1) Drawer por partida</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>{selectedPartida ? selectedPartida.concept : 'Selecciona una partida'}</span>
            {selectedPartida && (
              <a
                href={`/partidas/${selectedPartida.id}`}
                className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-slate-500"
              >
                Abrir Partida
              </a>
            )}
          </div>
        </div>
        {!selectedPartida ? (
          <p className="mt-3 text-xs text-slate-500">Haz click en una fila para ajustar el escenario.</p>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
            <div className="space-y-3 text-xs text-slate-300">
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
                <div className="text-[11px] uppercase text-slate-500">Drivers principales</div>
                <div className="mt-2 text-sm text-white">
                  {scenarioResult.results
                    .find((result) => result.partidaId === selectedPartida.id)
                    ?.drivers.map((driver) => driver.fact.title)
                    .join(' · ') || 'Sin drivers'}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
                <div className="text-[11px] uppercase text-slate-500">Facts vinculados</div>
                {selectedPartidaFacts.length === 0 ? (
                  <p className="mt-2 text-[11px] text-slate-500">Sin hechos vinculados.</p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {selectedPartidaFacts.map((fact) => {
                      const evidence = evidenceByFact.get(fact.id);
                      const evidenceCount = evidence?.evidenceCount ?? 0;
                      const contradictions = evidence?.contradictions ?? 0;
                      const coverage = computeCoverage(
                        fact,
                        evidenceCount,
                        contradictions
                      );
                      const evidenceLinks = linksForCase.filter(
                        (link) =>
                          linkInvolves(link, 'fact', fact.id) &&
                          ['span', 'document'].includes(link.fromType === 'fact' ? link.toType : link.fromType) &&
                          getLinkRole(link) === 'evidence'
                      );
                      const contradictionLinks = linksForCase.filter(
                        (link) =>
                          linkInvolves(link, 'fact', fact.id) &&
                          ['span', 'document'].includes(link.fromType === 'fact' ? link.toType : link.fromType) &&
                          getLinkRole(link) === 'contradicts'
                      );
                      const evidenceSpans = evidenceLinks
                        .filter((link) => (link.fromType === 'fact' ? link.toType : link.fromType) === 'span')
                        .map((link) => spansById.get(link.fromType === 'span' ? link.fromId : link.toId))
                        .filter(Boolean) as Span[];
                      const evidenceDocs = evidenceLinks
                        .filter((link) => (link.fromType === 'fact' ? link.toType : link.fromType) === 'document')
                        .map((link) => documentsById.get(link.fromType === 'document' ? link.fromId : link.toId))
                        .filter(Boolean) as Document[];
                      const contradictionSpans = contradictionLinks
                        .filter((link) => (link.fromType === 'fact' ? link.toType : link.fromType) === 'span')
                        .map((link) => spansById.get(link.fromType === 'span' ? link.fromId : link.toId))
                        .filter(Boolean) as Span[];
                      const contradictionDocs = contradictionLinks
                        .filter((link) => (link.fromType === 'fact' ? link.toType : link.fromType) === 'document')
                        .map((link) => documentsById.get(link.fromType === 'document' ? link.fromId : link.toId))
                        .filter(Boolean) as Document[];
                      return (
                        <li key={fact.id} className="rounded-lg border border-slate-800/70 p-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm font-semibold text-white">{fact.title}</div>
                            <div className="flex flex-wrap items-center gap-2">
                              <a
                                href={`/facts/${fact.id}`}
                                className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-200 hover:border-slate-500"
                              >
                                Abrir Fact
                              </a>
                              {evidenceCount === 0 && (
                                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                                  SIN PRUEBA
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 text-[11px] text-slate-400">
                            Evidencias: {evidenceCount} · Contradicciones: {contradictions} · Cobertura:{' '}
                            {Math.round(coverage * 100)}%
                          </div>
                          <div className="mt-2 space-y-1 text-[11px] text-slate-400">
                            <div className="uppercase text-slate-500">Evidencias reales</div>
                            {evidenceSpans.length === 0 && evidenceDocs.length === 0 ? (
                              <p className="text-[11px] text-slate-500">Sin evidencias vinculadas.</p>
                            ) : (
                              <ul className="space-y-1">
                                {evidenceSpans.map((span) => (
                                  <li key={span.id}>
                                    <a
                                      href={`/documents/${span.documentId}/view?page=${span.pageStart}`}
                                      className="text-sky-200 hover:text-sky-100"
                                    >
                                      Span: {span.label} (p. {span.pageStart})
                                    </a>
                                  </li>
                                ))}
                                {evidenceDocs.map((doc) => (
                                  <li key={doc.id}>
                                    <a
                                      href={`/documents/${doc.id}/view`}
                                      className="text-sky-200 hover:text-sky-100"
                                    >
                                      Documento: {doc.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          {(contradictionSpans.length > 0 || contradictionDocs.length > 0) && (
                            <div className="mt-2 space-y-1 text-[11px] text-rose-200/80">
                              <div className="uppercase text-rose-300">Contradicciones</div>
                              <ul className="space-y-1">
                                {contradictionSpans.map((span) => (
                                  <li key={span.id}>
                                    <a
                                      href={`/documents/${span.documentId}/view?page=${span.pageStart}`}
                                      className="text-rose-200 hover:text-rose-100"
                                    >
                                      Span: {span.label} (p. {span.pageStart})
                                    </a>
                                  </li>
                                ))}
                                {contradictionDocs.map((doc) => (
                                  <li key={doc.id}>
                                    <a
                                      href={`/documents/${doc.id}/view`}
                                      className="text-rose-200 hover:text-rose-100"
                                    >
                                      Documento: {doc.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="text-[11px] uppercase text-slate-500">Ajustes ScenarioNode</div>
              {selectedPartidaFacts.length === 0 ? (
                <p className="text-[11px] text-slate-500">Vincula hechos para ajustar el escenario.</p>
              ) : (
                <div className="space-y-3">
                  {selectedPartidaFacts.map((fact) => {
                    const scenarioNode = scenarioMap.get(`fact:${fact.id}`);
                    const value = scenarioNode?.value ?? 0;
                    const confidence = scenarioNode?.confidence ?? 0.7;
                    return (
                      <div key={fact.id} className="rounded-lg border border-slate-800/70 p-3">
                        <div className="text-sm font-semibold text-white">{fact.title}</div>
                        <div className="mt-2 space-y-2">
                          <label className="flex flex-col gap-1">
                            <span className="text-[11px] text-slate-400">
                              Ajuste valor: {value.toFixed(2)}
                            </span>
                            <input
                              type="range"
                              min={-0.25}
                              max={0.25}
                              step={0.01}
                              value={value}
                              onChange={(event) => {
                                if (!selectedScenarioId) return;
                                scheduleScenarioNodeUpsert(selectedScenarioId, 'fact', fact.id, {
                                  value: Number(event.target.value),
                                  confidence,
                                });
                              }}
                              className="w-full"
                            />
                          </label>
                          <label className="flex flex-col gap-1">
                            <span className="text-[11px] text-slate-400">
                              Confianza: {confidence.toFixed(2)}
                            </span>
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={confidence}
                              onChange={(event) => {
                                if (!selectedScenarioId) return;
                                scheduleScenarioNodeUpsert(selectedScenarioId, 'fact', fact.id, {
                                  value,
                                  confidence: Number(event.target.value),
                                });
                              }}
                              className="w-full"
                            />
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-semibold text-white">3) Gráficos de exposición</h3>
        <div className="mt-4 grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
            <div className="text-[11px] uppercase text-slate-500">Top partidas (expected)</div>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topPartidasChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="expectedCents" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
            <div className="text-[11px] uppercase text-slate-500">Histograma (total samples)</div>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} hide />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
                    formatter={(value: number) => value}
                  />
                  <Area type="monotone" dataKey="count" stroke="#a855f7" fill="#a855f7" fillOpacity={0.35} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
            <div className="text-[11px] uppercase text-slate-500">Tornado (±1 evidencia)</div>
            <div className="mt-3 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tornadoData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis dataKey="label" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={90} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="minus" fill="#f87171" />
                  <Bar dataKey="plus" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="text-sm font-semibold text-white">4) Panel grafo (vista simple)</h3>
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
          <h3 className="text-sm font-semibold text-white">5) Heatmap cobertura hechos</h3>
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
        <h3 className="text-sm font-semibold text-white">6) Next Best Actions</h3>
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
                {(action.targetDocumentId || action.targetFactId || action.targetPartidaId) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {action.targetDocumentId && (
                      <a
                        href={
                          action.targetPage
                            ? `/documents/${action.targetDocumentId}/view?page=${action.targetPage}`
                            : `/documents/${action.targetDocumentId}/view`
                        }
                        className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-slate-500"
                      >
                        Abrir PDF
                      </a>
                    )}
                    {action.targetFactId && (
                      <a
                        href={`/facts/${action.targetFactId}`}
                        className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-slate-500"
                      >
                        Abrir Fact
                      </a>
                    )}
                    {action.targetPartidaId && (
                      <a
                        href={`/partidas/${action.targetPartidaId}`}
                        className="rounded-full border border-slate-700 px-2 py-1 text-[10px] text-slate-200 hover:border-slate-500"
                      >
                        Abrir Partida
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
