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
import {
  SCORECARD_TEMPLATES,
  scorecardTemplateByTag,
  type ChecklistItem,
  type DefenseTemplate,
  type ScorecardContext,
} from '../../scenarios/scorecardTemplates';

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

type IssueNodeMeta = {
  active?: boolean;
  type?: 'knockout' | 'partial';
  impact?: number;
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

const DEFAULT_ISSUES: Array<Pick<Issue, 'title' | 'description' | 'tags'>> = [
  {
    title: 'Prescripción',
    description: 'Defensa de prescripción extintiva para excluir la pretensión principal.',
    tags: ['defensa', 'knockout'],
  },
  {
    title: 'Prueba actora insuficiente/impugnable',
    description: 'La actora no acredita el hecho base o su prueba es impugnable.',
    tags: ['defensa', 'knockout'],
  },
  {
    title: 'Pago acreditado por demandado',
    description: 'Pago previo acreditado que neutraliza la reclamación.',
    tags: ['defensa', 'knockout'],
  },
  {
    title: 'Pluspetición / cuantía inflada',
    description: 'Revisión parcial de la cuantía solicitada por la actora.',
    tags: ['defensa', 'parcial', 'impact-0.5'],
  },
  {
    title: 'Falta de nexo/causalidad',
    description: 'Ausencia de relación causal entre hechos y pretensión.',
    tags: ['defensa', 'knockout'],
  },
  {
    title: 'Compensación/crédito a favor',
    description: 'Compensación parcial con crédito a favor del demandado.',
    tags: ['defensa', 'parcial'],
  },
];

const DEFENSE_ISSUES: Array<Pick<Issue, 'title' | 'description' | 'tags'>> = [
  {
    title: 'Prescripción',
    description: 'Defensa de prescripción extintiva aplicable a la partida.',
    tags: ['defense:prescripcion', 'kind:ko'],
  },
  {
    title: 'Prueba actora inválida/insuficiente',
    description: 'Cuestiona la calidad y suficiencia de la prueba de la actora.',
    tags: ['defense:prueba', 'kind:ko'],
  },
  {
    title: 'Pago acreditado por Juan',
    description: 'Se acredita un pago previo que neutraliza la reclamación.',
    tags: ['defense:pago', 'kind:ko'],
  },
  {
    title: 'Cuantía inflada / pluspetición',
    description: 'Rebaja parcial de la cuantía reclamada.',
    tags: ['defense:pluspeticion', 'kind:partial', 'impact:0.50'],
  },
  {
    title: 'Compensación / créditos a favor',
    description: 'Compensación parcial con créditos a favor.',
    tags: ['defense:compensacion', 'kind:partial', 'impact:0.35'],
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

const getIssueDefaultType = (issue: Issue): IssueNodeMeta['type'] => {
  if (issue.tags.some((tag) => tag.toLowerCase() === 'parcial' || tag.toLowerCase() === 'partial')) {
    return 'partial';
  }
  if (issue.tags.some((tag) => tag.toLowerCase() === 'knockout')) {
    return 'knockout';
  }
  return 'knockout';
};

const getIssueDefaultImpact = (issue: Issue, type: IssueNodeMeta['type']) => {
  if (type === 'knockout') return 1;
  const impactTag = issue.tags.find((tag) => tag.startsWith('impact-'));
  const parsed = impactTag ? Number(impactTag.replace('impact-', '')) : NaN;
  return Number.isFinite(parsed) ? clamp(parsed, 0, 1) : 0.5;
};

const parseIssueMeta = (issue: Issue, node?: ScenarioNode): IssueNodeMeta => {
  const stored = node?.metaJson ? parseJson<IssueNodeMeta>(node.metaJson, {}) : {};
  const type = stored.type ?? getIssueDefaultType(issue);
  return {
    active: stored.active ?? (node ? true : false),
    type,
    impact: stored.impact ?? getIssueDefaultImpact(issue, type),
  };
};

const issueNodeKey = (issueId: string, partidaId: string) => `${issueId}@@${partidaId}`;
const scorecardItemNodeKey = (issueId: string, partidaId: string, itemKey: string) =>
  `${issueId}@@${partidaId}@@${itemKey}`;

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

const getFactIdsForPartida = (linksForCase: Link[], partidaId: string) => {
  const direct = getLinkedIds(linksForCase, 'partida', partidaId, 'fact');
  const documentIds = getLinkedIds(linksForCase, 'partida', partidaId, 'document');
  const spanIds = unique([
    ...getLinkedIds(linksForCase, 'partida', partidaId, 'span'),
    ...documentIds.flatMap((docId) => getLinkedIds(linksForCase, 'document', docId, 'span')),
  ]);
  const factFromSpans = spanIds.flatMap((spanId) => getLinkedIds(linksForCase, 'span', spanId, 'fact'));
  return unique([...direct, ...factFromSpans]);
};

const hasEvidenceForPartida = (linksForCase: Link[], partidaId: string) =>
  linksForCase.some(
    (link) =>
      linkInvolves(link, 'partida', partidaId) &&
      (link.fromType === 'span' ||
        link.toType === 'span' ||
        link.fromType === 'document' ||
        link.toType === 'document') &&
      getLinkRole(link) === 'evidence'
  );

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

const sigmoid = (value: number) => 1 / (1 + Math.exp(-value));

const average = (values: number[], fallback = 0) =>
  values.length === 0 ? fallback : values.reduce((acc, value) => acc + value, 0) / values.length;

const gammaSample = (shape: number, rng: () => number): number => {
  if (shape < 1) {
    const u = rng();
    return gammaSample(shape + 1, rng) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    const x = randn(rng);
    const v = Math.pow(1 + c * x, 3);
    if (v <= 0) continue;
    const u = rng();
    if (u < 1 - 0.331 * Math.pow(x, 4)) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
};

const betaSample = (pMean: number, confidence: number, rng: () => number) => {
  const mean = clamp(pMean, 0.01, 0.99);
  const conf = clamp(confidence, 0.2, 0.95);
  const strength = 2 + conf * 18;
  const alpha = mean * strength;
  const beta = (1 - mean) * strength;
  const x = gammaSample(alpha, rng);
  const y = gammaSample(beta, rng);
  return x / (x + y);
};

const getDefenseTag = (issue: Issue) =>
  issue.tags.find((tag) => tag.toLowerCase().startsWith('defense:'));

const getIssueKind = (issue: Issue, template?: DefenseTemplate): 'ko' | 'partial' => {
  const kindTag = issue.tags.find((tag) => tag.toLowerCase().startsWith('kind:'));
  if (kindTag) {
    const parsed = kindTag.split(':')[1];
    return parsed === 'partial' ? 'partial' : 'ko';
  }
  return template?.kind ?? 'ko';
};

const getIssueImpact = (issue: Issue, template?: DefenseTemplate) => {
  const impactTag = issue.tags.find((tag) => tag.toLowerCase().startsWith('impact:'));
  if (impactTag) {
    const parsed = Number(impactTag.split(':')[1]);
    return Number.isFinite(parsed) ? clamp(parsed, 0, 1) : template?.defaultImpact ?? 0.5;
  }
  return template?.defaultImpact ?? 0.5;
};

type ScorecardItemState = {
  item: ChecklistItem;
  value: number;
  confidence: number;
  evidence?: Array<{ docId: string; page?: number }>;
  kind: 'auto' | 'manual';
};

type ScorecardDefenseState = {
  issue: Issue;
  template?: DefenseTemplate;
  kind: 'ko' | 'partial';
  impact: number;
  pDef: number;
  confidence: number;
  items: ScorecardItemState[];
  drivers: ScorecardItemState[];
};

type ScorecardPartidaState = {
  partida: Partida;
  defenses: ScorecardDefenseState[];
  pActora: number;
  expectedLoss: number;
  range: { p10: number; p50: number; p90: number };
  hasEvidence: boolean;
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
  const [scenarioMode, setScenarioMode] = useState<'simple' | 'technical'>('simple');
  const [viewMode, setViewMode] = useState<'grafo' | 'scorecard'>('scorecard');
  const [scorecardSort, setScorecardSort] = useState<'desc' | 'asc'>('desc');
  const scenarioNodeTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const scenarioModelTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    let isActive = true;
    (async () => {
      const [spansData, linksData, issuesDataRaw, rulesData, modelsData] = await Promise.all([
        spansRepo.getByCaseId(caseId),
        linksRepo.getAll(),
        issuesRepo.getByCaseId(caseId),
        rulesRepo.getByCaseId(caseId),
        scenarioModelsRepo.getByCaseId(caseId),
      ]);
      let issuesData = issuesDataRaw;
      if (issuesData.length === 0) {
        const created = await Promise.all(
          DEFAULT_ISSUES.map((issue) =>
            issuesRepo.create({
              caseId,
              title: issue.title,
              description: issue.description,
              tags: issue.tags,
            })
          )
        );
        issuesData = created;
      }
      const hasDefenseTags = issuesData.some((issue) =>
        issue.tags.some((tag) => tag.toLowerCase().startsWith('defense:'))
      );
      if (!hasDefenseTags) {
        const created = await Promise.all(
          DEFENSE_ISSUES.map((issue) =>
            issuesRepo.create({
              caseId,
              title: issue.title,
              description: issue.description,
              tags: issue.tags,
            })
          )
        );
        issuesData = [...issuesData, ...created];
      }

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
  const issueNodeMap = useMemo(
    () => new Map(scenarioNodes.filter((node) => node.nodeType === 'issue').map((node) => [node.nodeId, node])),
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
    updates: Pick<ScenarioNode, 'value' | 'confidence' | 'metaJson'>
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
        metaJson: updates.metaJson,
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
        const factIds = getFactIdsForPartida(linksForCase, partida.id);
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

  const simpleScenario = useMemo(() => {
    const results = partidas.map((partida) => {
      const issueStates = issues.map((issue) => {
        const nodeId = issueNodeKey(issue.id, partida.id);
        const node = issueNodeMap.get(nodeId);
        const meta = parseIssueMeta(issue, node);
        const pDefensa = clamp(node?.value ?? 0.3);
        const confidence = clamp(node?.confidence ?? 0.7);
        const impact = clamp(meta.impact ?? (meta.type === 'knockout' ? 1 : 0.5));
        return {
          issue,
          nodeId,
          active: meta.active ?? false,
          type: meta.type ?? 'knockout',
          impact,
          pDefensa,
          confidence,
        };
      });
      const pActora = clamp(
        issueStates
          .filter((item) => item.active)
          .reduce((acc, item) => acc * (1 - item.pDefensa * item.impact), 1)
      );
      const expectedCents = Math.round(partida.amountCents * pActora);
      return {
        partida,
        pActora,
        expectedCents,
        issueStates,
        activeIssues: issueStates.filter((item) => item.active),
      };
    });
    const totalExpectedCents = results.reduce((acc, item) => acc + item.expectedCents, 0);
    return { results, totalExpectedCents };
  }, [issueNodeMap, issues, partidas]);

  const simpleTopPartidas = useMemo(
    () => [...simpleScenario.results].sort((a, b) => b.expectedCents - a.expectedCents).slice(0, 10),
    [simpleScenario.results]
  );

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
      (partida) => getFactIdsForPartida(linksForCase, partida.id).length === 0
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
        const factIds = getFactIdsForPartida(linksForCase, partida.id);
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
      (partida) => getFactIdsForPartida(linksForCase, partida.id).length === 0
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

  const scorecardContext = useMemo<ScorecardContext>(
    () => ({
      links: linksForCase,
      documents,
      spans,
    }),
    [documents, linksForCase, spans]
  );

  const defenseIssues = useMemo(
    () => issues.filter((issue) => Boolean(getDefenseTag(issue))),
    [issues]
  );

  const scorecardData = useMemo(() => {
    if (partidas.length === 0 || defenseIssues.length === 0) {
      return {
        partidas: [] as ScorecardPartidaState[],
        totalRange: { p10: 0, p50: 0, p90: 0 },
        totalSamples: [] as number[],
      };
    }

    const baseStates: ScorecardPartidaState[] = partidas.map((partida) => {
      const defenses: ScorecardDefenseState[] = defenseIssues.map((issue) => {
        const defenseTag = getDefenseTag(issue);
        const template = defenseTag ? scorecardTemplateByTag.get(defenseTag) : undefined;
        const autoResults = template?.autoEval(scorecardContext, partida) ?? {};
        const items = (template?.items ?? []).map((item) => {
          if (item.kind === 'auto') {
            const auto = autoResults[item.key];
            return {
              item,
              value: auto?.value ?? 0,
              confidence: clamp(auto?.confidence ?? 0.6),
              evidence: auto?.evidence,
              kind: 'auto' as const,
            };
          }
          const nodeId = scorecardItemNodeKey(issue.id, partida.id, item.key);
          const node = scenarioMap.get(`issue:${nodeId}`);
          return {
            item,
            value: clamp(node?.value ?? 0),
            confidence: clamp(node?.confidence ?? 0.7),
            kind: 'manual' as const,
          };
        });

        const alpha = template?.alpha ?? -0.6;
        const score = items.reduce((acc, entry) => acc + entry.item.weight * (entry.value * entry.confidence), 0);
        const pDef = clamp(sigmoid(alpha + score), 0.01, 0.99);
        const defenseConfidence = clamp(average(items.map((entry) => entry.confidence), 0.7), 0.2, 0.95);
        const drivers = items
          .filter((entry) => entry.value * entry.confidence < 0.5)
          .sort((a, b) => a.value * a.confidence - b.value * b.confidence)
          .slice(0, 3);
        return {
          issue,
          template,
          kind: getIssueKind(issue, template),
          impact: getIssueImpact(issue, template),
          pDef,
          confidence: defenseConfidence,
          items,
          drivers,
        };
      });

      let pActora = 1;
      let effectiveAmount = partida.amountCents;
      defenses.forEach((defense) => {
        if (defense.kind === 'ko') {
          pActora *= 1 - defense.pDef;
        } else {
          effectiveAmount *= 1 - defense.pDef * defense.impact;
        }
      });
      const expectedLoss = Math.round(pActora * effectiveAmount);

      return {
        partida,
        defenses,
        pActora: clamp(pActora),
        expectedLoss,
        range: { p10: expectedLoss, p50: expectedLoss, p90: expectedLoss },
        hasEvidence: hasEvidenceForPartida(linksForCase, partida.id),
      };
    });

    const samples = DEFAULT_SAMPLES;
    const totalSamples = Array.from({ length: samples }, () => 0);
    const perPartidaSamples = new Map(
      baseStates.map((state) => [state.partida.id, Array.from({ length: samples }, () => 0)])
    );
    const rng = mulberry32(hashString(`${caseId}:${selectedScenarioId ?? 'scorecard'}:scorecard`));

    for (let i = 0; i < samples; i += 1) {
      let total = 0;
      baseStates.forEach((state) => {
        let pActora = 1;
        let effectiveAmount = state.partida.amountCents;
        state.defenses.forEach((defense) => {
          const sampled = betaSample(defense.pDef, defense.confidence, rng);
          if (defense.kind === 'ko') {
            pActora *= 1 - sampled;
          } else {
            effectiveAmount *= 1 - sampled * defense.impact;
          }
        });
        const loss = pActora * effectiveAmount;
        const bucket = perPartidaSamples.get(state.partida.id);
        if (bucket) {
          bucket[i] = loss;
        }
        total += loss;
      });
      totalSamples[i] = total;
    }

    const partidasWithRanges = baseStates.map((state) => {
      const samplesForPartida = perPartidaSamples.get(state.partida.id) ?? [];
      return {
        ...state,
        range: {
          p10: quantile(samplesForPartida, 0.1),
          p50: quantile(samplesForPartida, 0.5),
          p90: quantile(samplesForPartida, 0.9),
        },
      };
    });

    return {
      partidas: partidasWithRanges,
      totalRange: {
        p10: quantile(totalSamples, 0.1),
        p50: quantile(totalSamples, 0.5),
        p90: quantile(totalSamples, 0.9),
      },
      totalSamples,
    };
  }, [
    caseId,
    defenseIssues,
    linksForCase,
    partidas,
    scenarioMap,
    scorecardContext,
    selectedScenarioId,
  ]);

  const paths = useMemo(() => {
    return partidas.map((partida) => {
      const factIds = getFactIdsForPartida(linksForCase, partida.id);
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
    if (viewMode !== 'grafo') return;
    if (scenarioResult.results.length === 0) {
      setSelectedPartidaId(null);
      return;
    }
    const exists = scenarioResult.results.some((result) => result.partidaId === selectedPartidaId);
    if (!exists) {
      setSelectedPartidaId(scenarioResult.results[0]?.partidaId ?? null);
    }
  }, [scenarioResult.results, selectedPartidaId, viewMode]);

  useEffect(() => {
    if (viewMode !== 'scorecard') return;
    if (scorecardData.partidas.length === 0) {
      setSelectedPartidaId(null);
      return;
    }
    const exists = scorecardData.partidas.some((item) => item.partida.id === selectedPartidaId);
    if (!exists) {
      setSelectedPartidaId(scorecardData.partidas[0]?.partida.id ?? null);
    }
  }, [scorecardData.partidas, selectedPartidaId, viewMode]);

  const selectedPartida = useMemo(
    () => partidas.find((partida) => partida.id === selectedPartidaId) ?? null,
    [partidas, selectedPartidaId]
  );
  const selectedScorecard = useMemo(
    () => scorecardData.partidas.find((item) => item.partida.id === selectedPartidaId) ?? null,
    [scorecardData.partidas, selectedPartidaId]
  );
  const sortedScorecardPartidas = useMemo(() => {
    const sorted = [...scorecardData.partidas];
    sorted.sort((a, b) =>
      scorecardSort === 'desc' ? b.range.p50 - a.range.p50 : a.range.p50 - b.range.p50
    );
    return sorted;
  }, [scorecardData.partidas, scorecardSort]);
  const scorecardSummary = useMemo(() => {
    const totalPartidas = scorecardData.partidas.length;
    const withoutEvidence = scorecardData.partidas.filter((item) => !item.hasEvidence).length;
    return { totalPartidas, withoutEvidence };
  }, [scorecardData.partidas]);
  const selectedSimple = useMemo(
    () => simpleScenario.results.find((result) => result.partida.id === selectedPartidaId) ?? null,
    [selectedPartidaId, simpleScenario.results]
  );

  const selectedPartidaFacts = useMemo(() => {
    if (!selectedPartida) return [];
    const factIds = getFactIdsForPartida(linksForCase, selectedPartida.id);
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

  const updateIssueNode = useCallback(
    (
      partidaId: string,
      issue: Issue,
      changes: Partial<{ active: boolean; type: IssueNodeMeta['type']; impact: number; pDefensa: number; confidence: number }>
    ) => {
      if (!selectedScenarioId) return;
      const nodeId = issueNodeKey(issue.id, partidaId);
      const existing = issueNodeMap.get(nodeId);
      const meta = parseIssueMeta(issue, existing);
      const nextType = changes.type ?? meta.type ?? 'knockout';
      const nextMeta: IssueNodeMeta = {
        active: changes.active ?? meta.active ?? false,
        type: nextType,
        impact: clamp(
          changes.impact ?? meta.impact ?? (nextType === 'knockout' ? 1 : getIssueDefaultImpact(issue, nextType))
        ),
      };
      const value = clamp(changes.pDefensa ?? existing?.value ?? 0.3);
      const confidence = clamp(changes.confidence ?? existing?.confidence ?? 0.7);
      scheduleScenarioNodeUpsert(selectedScenarioId, 'issue', nodeId, {
        value,
        confidence,
        metaJson: JSON.stringify(nextMeta),
      });
    },
    [issueNodeMap, scheduleScenarioNodeUpsert, selectedScenarioId]
  );

  const updateScorecardItem = useCallback(
    (issueId: string, partidaId: string, itemKey: string, value: number, confidence: number) => {
      if (!selectedScenarioId) return;
      const nodeId = scorecardItemNodeKey(issueId, partidaId, itemKey);
      scheduleScenarioNodeUpsert(selectedScenarioId, 'issue', nodeId, {
        value,
        confidence,
      });
    },
    [scheduleScenarioNodeUpsert, selectedScenarioId]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">🧠 Escenarios</h3>
              <p className="text-xs text-slate-400">
                Estimación orientativa (no predicción judicial). Depende de enlaces y supuestos.
              </p>
            </div>
            <div className="flex items-center rounded-full border border-slate-700 bg-slate-950/60 p-1 text-[11px] text-slate-300">
              <button
                type="button"
                onClick={() => setViewMode('scorecard')}
                className={`rounded-full px-3 py-1 transition ${
                  viewMode === 'scorecard'
                    ? 'bg-emerald-500/20 text-emerald-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧾 Scorecard
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grafo')}
                className={`rounded-full px-3 py-1 transition ${
                  viewMode === 'grafo'
                    ? 'bg-sky-500/20 text-sky-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧠 Grafo
              </button>
            </div>
          </div>
          {viewMode === 'grafo' && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center rounded-full border border-slate-700 bg-slate-950/60 p-1 text-[11px] text-slate-300">
                <button
                  type="button"
                  onClick={() => setScenarioMode('simple')}
                  className={`rounded-full px-3 py-1 transition ${
                    scenarioMode === 'simple'
                      ? 'bg-sky-500/20 text-sky-200'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Modo simple (Matriz por partida)
                </button>
                <button
                  type="button"
                  onClick={() => setScenarioMode('technical')}
                  className={`rounded-full px-3 py-1 transition ${
                    scenarioMode === 'technical'
                      ? 'bg-sky-500/20 text-sky-200'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Modo técnico (Grafo)
                </button>
              </div>
              <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Monte Carlo {DEFAULT_SAMPLES} muestras
              </span>
            </div>
          )}
        </div>
        {selectedAssumptions.narrative && viewMode === 'grafo' && (
          <p className="mt-3 text-xs text-slate-400">{selectedAssumptions.narrative}</p>
        )}
      </div>

      {viewMode === 'scorecard' && (
        <>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">🧾 Scorecard por partida</h3>
                <p className="text-[11px] text-slate-400">
                  Probabilidad de defensa y rango de pérdidas por partida.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                <span className="rounded-full border border-slate-700 px-2 py-1">
                  Total partidas: {scorecardSummary.totalPartidas}
                </span>
                <span
                  className={`rounded-full border px-2 py-1 ${
                    scorecardSummary.withoutEvidence > 0
                      ? 'border-rose-500/50 text-rose-200'
                      : 'border-emerald-500/40 text-emerald-200'
                  }`}
                >
                  Sin evidencias: {scorecardSummary.withoutEvidence}
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                <div className="text-[11px] uppercase text-slate-500">Cuantía en juego (p50)</div>
                <div className="mt-1 text-lg font-semibold text-emerald-200">
                  {formatCurrency(Math.round(scorecardData.totalRange.p50))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                <div className="text-[11px] uppercase text-slate-500">Mejor caso p10</div>
                <div className="mt-1 text-lg font-semibold text-emerald-200">
                  {formatCurrency(Math.round(scorecardData.totalRange.p10))}
                </div>
              </div>
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                <div className="text-[11px] uppercase text-slate-500">Peor caso razonable p90</div>
                <div className="mt-1 text-lg font-semibold text-emerald-200">
                  {formatCurrency(Math.round(scorecardData.totalRange.p90))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-semibold text-white">1) Tabla partidas</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Concepto</th>
                    <th className="py-2 pr-4">Importe</th>
                    <th className="py-2 pr-4">P. actora (media)</th>
                    <th className="py-2 pr-4">Rango [p10–p90]</th>
                    <th className="py-2 pr-4">
                      <button
                        type="button"
                        onClick={() => setScorecardSort((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                        className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-500 hover:text-slate-300"
                      >
                        € en juego (p50)
                        <span>{scorecardSort === 'desc' ? '↓' : '↑'}</span>
                      </button>
                    </th>
                    <th className="py-2">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedScorecardPartidas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-[11px] text-slate-500">
                        Sin partidas con defensas configuradas.
                      </td>
                    </tr>
                  ) : (
                    sortedScorecardPartidas.map((item) => {
                      const isSelected = selectedPartidaId === item.partida.id;
                      return (
                        <tr
                          key={item.partida.id}
                          className={`cursor-pointer border-t border-slate-800 transition ${
                            isSelected ? 'bg-emerald-500/10' : 'hover:bg-slate-800/40'
                          }`}
                          onClick={() => setSelectedPartidaId(item.partida.id)}
                        >
                          <td className="py-2 pr-4">
                            <div className="font-semibold text-white">{item.partida.concept}</div>
                            <div className="text-[11px] text-slate-500">{item.partida.id}</div>
                          </td>
                          <td className="py-2 pr-4">{formatCurrency(item.partida.amountCents)}</td>
                          <td className="py-2 pr-4">{(item.pActora * 100).toFixed(1)}%</td>
                          <td className="py-2 pr-4">
                            {formatCurrency(Math.round(item.range.p10))} – {formatCurrency(Math.round(item.range.p90))}
                          </td>
                          <td className="py-2 pr-4 font-semibold text-emerald-200">
                            {formatCurrency(Math.round(item.range.p50))}
                          </td>
                          <td className="py-2">
                            <div className="flex flex-wrap gap-2">
                              {!item.hasEvidence && (
                                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                                  SIN EVIDENCIA
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">2) Drawer por partida</h3>
              <div className="text-xs text-slate-500">
                {selectedScorecard ? selectedScorecard.partida.concept : 'Selecciona una partida'}
              </div>
            </div>
            {!selectedScorecard ? (
              <p className="mt-3 text-xs text-slate-500">Haz click en una fila para abrir el detalle.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {selectedScorecard.defenses.map((defense) => (
                  <div
                    key={`${defense.issue.id}-${selectedScorecard.partida.id}`}
                    className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3 text-xs text-slate-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold text-white">{defense.issue.title}</div>
                        <div className="text-[11px] text-slate-500">{defense.issue.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-200">
                          {(defense.pDef * 100).toFixed(1)}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {defense.kind === 'ko'
                            ? 'KO'
                            : `Parcial · Impacto ${(defense.impact * 100).toFixed(0)}%`}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {defense.items.map((entry) => (
                        <div
                          key={`${defense.issue.id}-${entry.item.key}`}
                          className="rounded-lg border border-slate-800/70 bg-slate-950/40 p-2"
                        >
                          {entry.kind === 'auto' ? (
                            <>
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="text-[11px] text-slate-200">{entry.item.label}</div>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                                    entry.value > 0.5
                                      ? 'bg-emerald-500/20 text-emerald-200'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {entry.value > 0.5 ? 'Detectado' : 'No detectado'}
                                </span>
                              </div>
                              {entry.evidence && entry.evidence.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {entry.evidence.map((evidence, index) => (
                                    <a
                                      key={`${evidence.docId}-${index}`}
                                      href={`/documents/${evidence.docId}/view?page=${evidence.page ?? 1}`}
                                      className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-200 hover:border-slate-500"
                                    >
                                      Abrir PDF
                                    </a>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[11px] text-slate-200">
                                <input
                                  type="checkbox"
                                  checked={entry.value > 0.5}
                                  onChange={(event) =>
                                    updateScorecardItem(
                                      defense.issue.id,
                                      selectedScorecard.partida.id,
                                      entry.item.key,
                                      event.target.checked ? 1 : 0,
                                      entry.confidence
                                    )
                                  }
                                  className="h-4 w-4 rounded border-slate-600 bg-slate-950"
                                />
                                {entry.item.label}
                              </label>
                              <label className="flex flex-col gap-1 text-[10px] text-slate-400">
                                Confianza: {entry.confidence.toFixed(2)}
                                <input
                                  type="range"
                                  min={0}
                                  max={1}
                                  step={0.05}
                                  value={entry.confidence}
                                  onChange={(event) =>
                                    updateScorecardItem(
                                      defense.issue.id,
                                      selectedScorecard.partida.id,
                                      entry.item.key,
                                      entry.value,
                                      Number(event.target.value)
                                    )
                                  }
                                  className="w-full"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 rounded-lg border border-slate-800/70 bg-slate-950/30 p-2">
                      <div className="text-[11px] uppercase text-slate-500">Drivers pendientes</div>
                      {defense.drivers.length === 0 ? (
                        <div className="mt-1 text-[11px] text-slate-400">Sin drivers pendientes.</div>
                      ) : (
                        <ul className="mt-1 space-y-1 text-[11px] text-slate-300">
                          {defense.drivers.map((driver) => (
                            <li key={driver.item.key}>• {driver.item.label}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {viewMode === 'grafo' && (
        <>
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

      {scenarioMode === 'simple' && (
        <>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Resumen global (modo simple)</h3>
                <p className="text-[11px] text-slate-400">Total en juego y principales partidas por exposición.</p>
              </div>
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                Total € en juego: {formatCurrency(simpleScenario.totalExpectedCents)}
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                <div className="text-[11px] uppercase text-slate-500">Top 10 partidas por € en juego</div>
                <ul className="mt-2 space-y-1">
                  {simpleTopPartidas.map((item, index) => (
                    <li key={item.partida.id} className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="truncate">
                        {index + 1}. {item.partida.concept}
                      </span>
                      <span className="font-semibold text-emerald-200">
                        {formatCurrency(item.expectedCents)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                  <div className="text-[11px] uppercase text-slate-500">Partidas sin hechos (técnico)</div>
                  <div className="mt-1 text-lg font-semibold text-rose-200">
                    {dataQuality.partidasWithoutFacts.length}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-800/70 bg-slate-950/40 p-3">
                  <div className="text-[11px] uppercase text-slate-500">Facts sin prueba</div>
                  <div className="mt-1 text-lg font-semibold text-rose-200">
                    {dataQuality.factsWithoutEvidence.length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-semibold text-white">2) Matriz por partida</h3>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-4">Concepto</th>
                    <th className="py-2 pr-4">Importe</th>
                    <th className="py-2 pr-4">P. actora</th>
                    <th className="py-2 pr-4">€ en juego</th>
                    <th className="py-2">Defensas activas</th>
                  </tr>
                </thead>
                <tbody>
                  {simpleScenario.results.map((result) => {
                    const isSelected = selectedPartidaId === result.partida.id;
                    return (
                      <tr
                        key={result.partida.id}
                        className={`cursor-pointer border-t border-slate-800 transition ${
                          isSelected ? 'bg-sky-500/10' : 'hover:bg-slate-800/40'
                        }`}
                        onClick={() => setSelectedPartidaId(result.partida.id)}
                      >
                        <td className="py-2 pr-4">
                          <div className="font-semibold text-white">{result.partida.concept}</div>
                          <div className="text-[11px] text-slate-500">{result.partida.id}</div>
                        </td>
                        <td className="py-2 pr-4">{formatCurrency(result.partida.amountCents)}</td>
                        <td className="py-2 pr-4">{(result.pActora * 100).toFixed(1)}%</td>
                        <td className="py-2 pr-4 font-semibold text-emerald-200">
                          {formatCurrency(result.expectedCents)}
                        </td>
                        <td className="py-2">
                          <div className="flex flex-wrap gap-2">
                            {result.activeIssues.length === 0 ? (
                              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                                Sin defensas
                              </span>
                            ) : (
                              result.activeIssues.slice(0, 3).map((item) => (
                                <span
                                  key={item.issue.id}
                                  className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200"
                                >
                                  {item.issue.title}
                                </span>
                              ))
                            )}
                            {result.activeIssues.length > 3 && (
                              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                                +{result.activeIssues.length - 3}
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
                      {formatCurrency(simpleScenario.totalExpectedCents)}
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
            {!selectedSimple ? (
              <p className="mt-3 text-xs text-slate-500">Haz click en una fila para ajustar defensas.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {selectedSimple.issueStates.map((item) => (
                  <div key={item.issue.id} className="rounded-xl border border-slate-800/70 bg-slate-950/30 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-white">
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={(event) =>
                            updateIssueNode(selectedSimple.partida.id, item.issue, { active: event.target.checked })
                          }
                          className="h-4 w-4 rounded border-slate-600 bg-slate-950"
                        />
                        {item.issue.title}
                      </label>
                      <span className="text-[11px] text-slate-500">{item.issue.description}</span>
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="flex flex-col gap-1 text-[11px] text-slate-400">
                        P. defensa: {item.pDefensa.toFixed(2)}
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={item.pDefensa}
                          onChange={(event) =>
                            updateIssueNode(selectedSimple.partida.id, item.issue, {
                              pDefensa: Number(event.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[11px] text-slate-400">
                        Confianza: {item.confidence.toFixed(2)}
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={item.confidence}
                          onChange={(event) =>
                            updateIssueNode(selectedSimple.partida.id, item.issue, {
                              confidence: Number(event.target.value),
                            })
                          }
                          className="w-full"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-[11px] text-slate-400">
                        Tipo de defensa
                        <select
                          value={item.type}
                          onChange={(event) => {
                            const type = event.target.value as IssueNodeMeta['type'];
                            updateIssueNode(selectedSimple.partida.id, item.issue, {
                              type,
                              impact: type === 'knockout' ? 1 : item.impact,
                            });
                          }}
                          className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-100"
                        >
                          <option value="knockout">Knockout</option>
                          <option value="partial">Parcial</option>
                        </select>
                      </label>
                      {item.type === 'partial' ? (
                        <label className="flex flex-col gap-1 text-[11px] text-slate-400">
                          Impacto: {item.impact.toFixed(2)}
                          <input
                            type="range"
                            min={0}
                            max={1}
                            step={0.01}
                            value={item.impact}
                            onChange={(event) =>
                              updateIssueNode(selectedSimple.partida.id, item.issue, {
                                impact: Number(event.target.value),
                              })
                            }
                            className="w-full"
                          />
                        </label>
                      ) : (
                        <div className="flex items-center text-[11px] text-slate-500">
                          Impacto fijo 1.0 (knockout)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {scenarioMode === 'technical' && (
        <>
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
                const hasNoFacts = getFactIdsForPartida(linksForCase, partida.id).length === 0;
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
        </>
      )}
        </>
      )}
    </div>
  );
}
