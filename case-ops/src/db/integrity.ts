import Dexie from 'dexie';
import { db } from './schema';
import { normalizeAutosNumber } from '../utils/caseKey';
import type { Strategy } from '../types';

const REPAIR_META_KEY = 'integrity:lastRepairReport';

const CASE_LINK_TABLES = [
  'documents',
  'spans',
  'facts',
  'issues',
  'partidas',
  'events',
  'strategies',
  'tasks',
  'rules',
  'scenario_models',
] as const;

type CaseLinkTable = (typeof CASE_LINK_TABLES)[number];

type CaseLinkedRow = { id: string; caseId: string; updatedAt?: number | string };

type CaseTableName = keyof Pick<typeof db,
  | 'documents'
  | 'spans'
  | 'facts'
  | 'issues'
  | 'partidas'
  | 'events'
  | 'strategies'
  | 'tasks'
  | 'rules'
  | 'scenario_models'>;

export type DuplicateGroup = {
  autosNumber: string;
  canonicalCaseId: string;
  duplicateCaseIds: string[];
  relatedCounts: Record<string, number>;
};

export type StrategyByCase = {
  caseId: string;
  caseTitle: string;
  autosNumber: string;
  count: number;
  sample: Strategy[];
};

export type MislinkedCandidate = {
  strategyId: string;
  caseId: string;
  caseTitle: string;
  autosNumber: string;
  reason: string;
  attack: string;
};

export type RepairReport = {
  executedAt: number;
  mergedGroups: DuplicateGroup[];
  movedCounts: Record<CaseLinkTable, number>;
  deletedDuplicateCases: number;
};

export type IntegritySnapshot = {
  duplicateGroups: DuplicateGroup[];
  orphanStrategies: Array<{ id: string; caseId: string; attack: string }>;
  strategiesByCase: StrategyByCase[];
  mislinkedCandidates: MislinkedCandidate[];
};

function touchUpdatedAt(row: CaseLinkedRow): number | string | undefined {
  if (typeof row.updatedAt === 'number') return Date.now();
  if (typeof row.updatedAt === 'string') return new Date().toISOString();
  return undefined;
}

function getTable(tableName: CaseLinkTable) {
  return (db as unknown as Record<CaseTableName, Dexie.Table<CaseLinkedRow, string>>)[
    tableName as CaseTableName
  ];
}

async function countRelated(caseId: string): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  await Promise.all(
    CASE_LINK_TABLES.map(async (tableName) => {
      const table = getTable(tableName);
      counts[tableName] = await table.where('caseId').equals(caseId).count();
    }),
  );
  return counts;
}

function scoreCase(caseItem: { updatedAt?: number; createdAt?: number }, counts: Record<string, number>): [number, number] {
  const related = Object.values(counts).reduce((sum, value) => sum + value, 0);
  return [related, caseItem.updatedAt ?? caseItem.createdAt ?? 0];
}

function detectMislinkedCandidates(
  strategies: Strategy[],
  casesById: Map<string, { title: string; autosNumber: string }>,
): MislinkedCandidate[] {
  const signals = [
    { key: 'picassent', autos: '715/2024', matchers: ['picassent', '715/2024', '715'] },
    { key: 'mislata', autos: '1185/2025', matchers: ['mislata', '1185/2025', '1185'] },
    { key: 'quart', autos: '1428/2025', matchers: ['quart', '1428/2025', '1428'] },
  ];

  return strategies.flatMap((strategy) => {
    const caseInfo = casesById.get(strategy.caseId);
    if (!caseInfo) return [];

    const blob = `${strategy.attack} ${strategy.rebuttal} ${(strategy.tags || []).join(' ')}`.toLowerCase();
    const caseAutos = normalizeAutosNumber(caseInfo.autosNumber);

    for (const signal of signals) {
      const hasSignal = signal.matchers.some((matcher) => blob.includes(matcher));
      if (hasSignal && caseAutos !== signal.autos) {
        return [
          {
            strategyId: strategy.id,
            caseId: strategy.caseId,
            caseTitle: caseInfo.title,
            autosNumber: caseInfo.autosNumber,
            reason: `Contiene señal de ${signal.key} pero está en autos ${caseInfo.autosNumber || 'sin autos'}`,
            attack: strategy.attack,
          },
        ];
      }
    }

    return [];
  });
}

export async function getIntegritySnapshot(): Promise<IntegritySnapshot> {
  const [allCases, allStrategies] = await Promise.all([db.cases.toArray(), db.strategies.toArray()]);

  const casesById = new Map(
    allCases.map((c) => [c.id, { title: c.title ?? '(sin título)', autosNumber: c.autosNumber ?? '' }]),
  );

  const byAutos = new Map<string, typeof allCases>();
  allCases.forEach((c) => {
    const key = normalizeAutosNumber(c.autosNumber);
    if (!key) return;
    const current = byAutos.get(key) ?? [];
    current.push(c);
    byAutos.set(key, current);
  });

  const duplicateGroups: DuplicateGroup[] = [];
  for (const [autosNumber, group] of byAutos.entries()) {
    if (group.length < 2) continue;

    const scored = await Promise.all(
      group.map(async (caseItem) => {
        const counts = await countRelated(caseItem.id);
        return { caseItem, counts, score: scoreCase(caseItem, counts) };
      }),
    );

    scored.sort((a, b) => {
      if (b.score[0] !== a.score[0]) return b.score[0] - a.score[0];
      return b.score[1] - a.score[1];
    });

    const canonical = scored[0];
    const relatedCounts: Record<string, number> = {};
    scored.forEach((entry) => {
      relatedCounts[entry.caseItem.id] = Object.values(entry.counts).reduce((sum, value) => sum + value, 0);
    });

    duplicateGroups.push({
      autosNumber,
      canonicalCaseId: canonical.caseItem.id,
      duplicateCaseIds: scored.slice(1).map((entry) => entry.caseItem.id),
      relatedCounts,
    });
  }

  const existingCaseIds = new Set(allCases.map((c) => c.id));
  const orphanStrategies = allStrategies
    .filter((strategy) => !existingCaseIds.has(strategy.caseId))
    .map((strategy) => ({ id: strategy.id, caseId: strategy.caseId, attack: strategy.attack }));

  const groupedStrategies = new Map<string, Strategy[]>();
  allStrategies.forEach((strategy) => {
    groupedStrategies.set(strategy.caseId, [...(groupedStrategies.get(strategy.caseId) ?? []), strategy]);
  });

  const strategiesByCase: StrategyByCase[] = Array.from(groupedStrategies.entries())
    .map(([caseId, strategies]) => ({
      caseId,
      caseTitle: casesById.get(caseId)?.title ?? '(caso no encontrado)',
      autosNumber: casesById.get(caseId)?.autosNumber ?? '(sin autos)',
      count: strategies.length,
      sample: strategies.slice(0, 5),
    }))
    .sort((a, b) => b.count - a.count);

  const mislinkedCandidates = detectMislinkedCandidates(allStrategies, casesById);

  return { duplicateGroups, orphanStrategies, strategiesByCase, mislinkedCandidates };
}

export async function runDuplicateMergeRepair(): Promise<RepairReport> {
  const snapshot = await getIntegritySnapshot();

  const movedCounts = Object.fromEntries(CASE_LINK_TABLES.map((tableName) => [tableName, 0])) as Record<
    CaseLinkTable,
    number
  >;

  let deletedDuplicateCases = 0;

  await db.transaction('rw', db.tables, async () => {
    for (const group of snapshot.duplicateGroups) {
      const duplicateIds = group.duplicateCaseIds;
      if (duplicateIds.length === 0) continue;

      for (const tableName of CASE_LINK_TABLES) {
        const table = getTable(tableName);
        const rows = await table.where('caseId').anyOf(duplicateIds).toArray();
        for (const row of rows) {
          await table.update(row.id, {
            caseId: group.canonicalCaseId,
            updatedAt: touchUpdatedAt(row),
          });
        }
        movedCounts[tableName] += rows.length;
      }

      await db.cases.bulkDelete(duplicateIds);
      deletedDuplicateCases += duplicateIds.length;
    }

    const report: RepairReport = {
      executedAt: Date.now(),
      mergedGroups: snapshot.duplicateGroups,
      movedCounts,
      deletedDuplicateCases,
    };

    await db.meta.put({ id: REPAIR_META_KEY, value: report, updatedAt: Date.now() });
  });

  return {
    executedAt: Date.now(),
    mergedGroups: snapshot.duplicateGroups,
    movedCounts,
    deletedDuplicateCases,
  };
}

export async function getLastRepairReport(): Promise<RepairReport | null> {
  const row = await db.meta.get(REPAIR_META_KEY);
  return (row?.value as RepairReport | undefined) ?? null;
}

export async function moveStrategyToCase(strategyId: string, caseId: string): Promise<void> {
  await db.strategies.update(strategyId, { caseId, updatedAt: Date.now() });
}

export async function bulkMoveStrategiesByText(textFilter: string, targetCaseId: string): Promise<number> {
  const query = textFilter.trim().toLowerCase();
  if (!query) return 0;

  const allStrategies = await db.strategies.toArray();
  const toMove = allStrategies.filter((strategy) => {
    const blob = `${strategy.attack} ${strategy.rebuttal} ${(strategy.tags || []).join(' ')}`.toLowerCase();
    return blob.includes(query);
  });

  await db.transaction('rw', db.strategies, async () => {
    for (const strategy of toMove) {
      await db.strategies.update(strategy.id, { caseId: targetCaseId, updatedAt: Date.now() });
    }
  });

  return toMove.length;
}

export async function deleteOrphanStrategies(): Promise<number> {
  const snapshot = await getIntegritySnapshot();
  const ids = snapshot.orphanStrategies.map((item) => item.id);
  if (ids.length === 0) return 0;
  await db.strategies.bulkDelete(ids);
  return ids.length;
}
