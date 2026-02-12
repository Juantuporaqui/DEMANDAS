// ============================================
// CASE OPS - Dexie Database Schema
// ============================================

import Dexie, { type EntityTable } from 'dexie';
import type {
  Settings,
  Counter,
  Case,
  Document,
  DocFile,
  Span,
  Fact,
  Issue,
  Partida,
  Event,
  Strategy,
  Task,
  Link,
  AuditLog,
  AnalyticsMeta,
  Rule,
  ScenarioModel,
  ScenarioNode,
  MetaRecord,
} from '../types';
import { normalizeAutosNumber } from '../utils/caseKey';

// Database Schema Version
export const SCHEMA_VERSION = 5;

const storesV4 = {
  settings: 'id',
  counters: 'id',
  cases: 'id, title, court, type, status, parentCaseId, updatedAt, *tags',
  documents: 'id, caseId, title, docType, hashSha256, fileId, annexCode, updatedAt, *tags',
  docFiles: 'id, hashSha256',
  spans: 'id, documentId, caseId, label, updatedAt, *tags',
  facts: 'id, caseId, title, status, burden, risk, strength, updatedAt, *tags',
  issues: 'id, caseId, title, updatedAt, *tags',
  partidas: 'id, caseId, date, amountCents, state, updatedAt, *tags',
  events: 'id, caseId, date, type, updatedAt, *tags',
  strategies: 'id, caseId, updatedAt, *tags',
  tasks: 'id, caseId, dueDate, priority, status, updatedAt',
  links: 'id, fromType, fromId, toType, toId, [fromType+fromId], [toType+toId], updatedAt',
  rules: 'id, caseId, title, updatedAt, *appliesToTags',
  scenario_models: 'id, caseId, name, updatedAt',
  scenario_nodes: 'id, scenarioId, nodeType, nodeId, updatedAt, [scenarioId+nodeType+nodeId]',
  auditLogs: 'id, at, action, entityType, entityId',
  analytics_meta: 'id, updatedAt',
};

const storesV5 = {
  ...storesV4,
  cases: 'id, autosNumber, title, court, type, status, parentCaseId, updatedAt, *tags',
  meta: 'id, updatedAt',
};

type MigratableRow = { id: string; caseId: string; updatedAt?: number | string };

function migratedUpdatedAt(value: number | string | undefined): number | string | undefined {
  if (typeof value === 'number') return Date.now();
  if (typeof value === 'string') return new Date().toISOString();
  return undefined;
}

async function repairDuplicatesInUpgrade(tx: Dexie.Transaction): Promise<void> {
  const casesTable = tx.table('cases');
  const allCases = await casesTable.toArray();
  const grouped = new Map<string, typeof allCases>();

  allCases.forEach((caseItem) => {
    const key = normalizeAutosNumber((caseItem as { autosNumber?: string }).autosNumber);
    if (!key) return;
    grouped.set(key, [...(grouped.get(key) ?? []), caseItem]);
  });

  const linkTables = [
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
  ];

  const movedCounts: Record<string, number> = Object.fromEntries(linkTables.map((tableName) => [tableName, 0]));
  const mergedGroups: Array<{ autosNumber: string; canonicalCaseId: string; duplicateCaseIds: string[] }> = [];

  for (const [autosNumber, group] of grouped.entries()) {
    if (group.length < 2) continue;

    const scoreEntries = await Promise.all(
      group.map(async (caseItem) => {
        let related = 0;
        for (const tableName of linkTables) {
          related += await tx.table(tableName).where('caseId').equals((caseItem as { id: string }).id).count();
        }
        const tCase = caseItem as { id: string; updatedAt?: number; createdAt?: number };
        return { caseId: tCase.id, related, updatedAt: tCase.updatedAt ?? tCase.createdAt ?? 0 };
      }),
    );

    scoreEntries.sort((a, b) => {
      if (b.related !== a.related) return b.related - a.related;
      return b.updatedAt - a.updatedAt;
    });

    const canonicalCaseId = scoreEntries[0].caseId;
    const duplicateCaseIds = scoreEntries.slice(1).map((entry) => entry.caseId);
    if (duplicateCaseIds.length === 0) continue;

    for (const tableName of linkTables) {
      const table = tx.table(tableName);
      const rows = (await table.where('caseId').anyOf(duplicateCaseIds).toArray()) as MigratableRow[];
      for (const row of rows) {
        await table.update(row.id, {
          caseId: canonicalCaseId,
          updatedAt: migratedUpdatedAt(row.updatedAt),
        });
      }
      movedCounts[tableName] += rows.length;
    }

    await casesTable.bulkDelete(duplicateCaseIds);
    mergedGroups.push({ autosNumber, canonicalCaseId, duplicateCaseIds });
  }

  await tx.table('meta').put({
    id: 'integrity:lastRepairReport',
    value: {
      executedAt: Date.now(),
      mergedGroups,
      movedCounts,
      deletedDuplicateCases: mergedGroups.reduce((sum, item) => sum + item.duplicateCaseIds.length, 0),
      source: 'schema-upgrade',
    },
    updatedAt: Date.now(),
  });
}

class CaseOpsDB extends Dexie {
  settings!: EntityTable<Settings, 'id'>;
  counters!: EntityTable<Counter, 'id'>;
  cases!: EntityTable<Case, 'id'>;
  documents!: EntityTable<Document, 'id'>;
  docFiles!: EntityTable<DocFile, 'id'>;
  spans!: EntityTable<Span, 'id'>;
  facts!: EntityTable<Fact, 'id'>;
  issues!: EntityTable<Issue, 'id'>;
  partidas!: EntityTable<Partida, 'id'>;
  events!: EntityTable<Event, 'id'>;
  strategies!: EntityTable<Strategy, 'id'>;
  tasks!: EntityTable<Task, 'id'>;
  links!: EntityTable<Link, 'id'>;
  rules!: EntityTable<Rule, 'id'>;
  scenario_models!: EntityTable<ScenarioModel, 'id'>;
  scenario_nodes!: EntityTable<ScenarioNode, 'id'>;
  auditLogs!: EntityTable<AuditLog, 'id'>;
  analytics_meta!: EntityTable<AnalyticsMeta, 'id'>;
  meta!: EntityTable<MetaRecord, 'id'>;

  constructor() {
    super('CaseOpsDB');

    this.version(4).stores(storesV4);
    this.version(5).stores(storesV5).upgrade(repairDuplicatesInUpgrade);
  }
}

export const db = new CaseOpsDB();
export type { CaseOpsDB };
