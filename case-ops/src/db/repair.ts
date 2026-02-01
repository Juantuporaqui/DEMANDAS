import { db } from './schema';

function normalizeAutos(autos?: string | null): string {
  return (autos ?? '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^0-9a-z/.-]/g, '');
}

type RepairResult = {
  repaired: boolean;
  movedCounts: Record<string, number>;
  duplicateCaseIds: string[];
};

async function relinkByCaseId(table: any, duplicateIds: string[], canonicalId: string): Promise<number> {
  const rows = await table.where('caseId').anyOf(duplicateIds).toArray();
  for (const r of rows) {
    const patch: any = { caseId: canonicalId };
    if ('updatedAt' in r) {
      patch.updatedAt = typeof r.updatedAt === 'number' ? Date.now() : new Date().toISOString();
    }
    await table.update(r.id, patch);
  }
  return rows.length;
}

export async function repairCaseLinks(canonicalCaseId: string): Promise<RepairResult> {
  const canonical = await db.cases.get(canonicalCaseId);
  if (!canonical) {
    return { repaired: false, movedCounts: {}, duplicateCaseIds: [] };
  }

  const key = normalizeAutos((canonical as any).autosNumber);
  if (!key) {
    return { repaired: false, movedCounts: {}, duplicateCaseIds: [] };
  }

  const allCases = await db.cases.toArray();
  const duplicates = allCases.filter(
    (c: any) => c.id !== canonicalCaseId && normalizeAutos(c.autosNumber) === key
  );

  if (duplicates.length === 0) {
    return { repaired: false, movedCounts: {}, duplicateCaseIds: [] };
  }

  const duplicateIds = duplicates.map((c: any) => c.id);
  const movedCounts: Record<string, number> = {
    facts: 0,
    documents: 0,
    events: 0,
    partidas: 0,
    strategies: 0,
    spans: 0,
    tasks: 0,
  };

  await db.transaction(
    'rw',
    db.facts,
    db.documents,
    db.events,
    db.partidas,
    db.strategies,
    db.spans,
    db.tasks,
    async () => {
      movedCounts.facts = await relinkByCaseId(db.facts, duplicateIds, canonicalCaseId);
      movedCounts.documents = await relinkByCaseId(db.documents, duplicateIds, canonicalCaseId);
      movedCounts.events = await relinkByCaseId(db.events, duplicateIds, canonicalCaseId);
      movedCounts.partidas = await relinkByCaseId(db.partidas, duplicateIds, canonicalCaseId);
      movedCounts.strategies = await relinkByCaseId(db.strategies, duplicateIds, canonicalCaseId);
      movedCounts.spans = await relinkByCaseId(db.spans, duplicateIds, canonicalCaseId);
      movedCounts.tasks = await relinkByCaseId(db.tasks, duplicateIds, canonicalCaseId);
    }
  );

  return { repaired: true, movedCounts, duplicateCaseIds: duplicateIds };
}
