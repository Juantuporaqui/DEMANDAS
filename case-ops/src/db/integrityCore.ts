function normalizeAutosNumber(value?: string | null): string {
  if (!value) return '';
  return value
    .normalize('NFKC')
    .replace(/[\u00A0\u2000-\u200B]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*\/\s*/g, '/');
}

export type BasicCase = { id: string; autosNumber: string; updatedAt: number };
export type BasicStrategy = { id: string; caseId: string };

export function detectOrphanStrategies(cases: BasicCase[], strategies: BasicStrategy[]): BasicStrategy[] {
  const caseIds = new Set(cases.map((c) => c.id));
  return strategies.filter((s) => !caseIds.has(s.caseId));
}

export function repairCasesAndStrategies(cases: BasicCase[], strategies: BasicStrategy[]) {
  const grouped = new Map<string, BasicCase[]>();
  cases.forEach((caseItem) => {
    const key = normalizeAutosNumber(caseItem.autosNumber);
    if (!key) return;
    grouped.set(key, [...(grouped.get(key) ?? []), caseItem]);
  });

  const strategyCountByCase = new Map<string, number>();
  strategies.forEach((strategy) => {
    strategyCountByCase.set(strategy.caseId, (strategyCountByCase.get(strategy.caseId) ?? 0) + 1);
  });

  const removedCaseIds = new Set<string>();
  const movedStrategies: Record<string, string> = {};

  grouped.forEach((group) => {
    if (group.length < 2) return;
    const sorted = [...group].sort((a, b) => {
      const countDiff = (strategyCountByCase.get(b.id) ?? 0) - (strategyCountByCase.get(a.id) ?? 0);
      if (countDiff !== 0) return countDiff;
      return b.updatedAt - a.updatedAt;
    });

    const canonicalId = sorted[0].id;
    sorted.slice(1).forEach((duplicate) => {
      removedCaseIds.add(duplicate.id);
      strategies.forEach((strategy) => {
        if (strategy.caseId === duplicate.id) {
          strategy.caseId = canonicalId;
          movedStrategies[strategy.id] = canonicalId;
        }
      });
    });
  });

  return {
    cases: cases.filter((caseItem) => !removedCaseIds.has(caseItem.id)),
    strategies,
    removedCaseIds: Array.from(removedCaseIds),
    movedStrategies,
  };
}
