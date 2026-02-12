import test from 'node:test';
import assert from 'node:assert/strict';
import { detectOrphanStrategies, repairCasesAndStrategies } from './integrityCore.ts';

test('dedupes cases by autos and reassigns strategies to canonical case', () => {
  const result = repairCasesAndStrategies(
    [
      { id: 'CAS001', autosNumber: '715/2024', updatedAt: 10 },
      { id: 'CAS009', autosNumber: ' 715 / 2024 ', updatedAt: 20 },
      { id: 'CAS002', autosNumber: '1185/2025', updatedAt: 30 },
    ],
    [
      { id: 'W1', caseId: 'CAS001' },
      { id: 'W2', caseId: 'CAS009' },
      { id: 'W3', caseId: 'CAS009' },
    ],
  );

  assert.equal(result.cases.length, 2);
  assert.deepEqual(result.removedCaseIds, ['CAS001']);
  assert.equal(result.strategies.every((s) => s.caseId !== 'CAS001'), true);
  assert.equal(result.strategies.filter((s) => s.caseId === 'CAS009').length, 3);
});

test('detects orphan strategies', () => {
  const orphans = detectOrphanStrategies(
    [{ id: 'CAS001', autosNumber: '715/2024', updatedAt: 1 }],
    [
      { id: 'W1', caseId: 'CAS001' },
      { id: 'W2', caseId: 'CAS404' },
    ],
  );

  assert.equal(orphans.length, 1);
  assert.equal(orphans[0].id, 'W2');
});
