import { getIntegritySnapshot, runDuplicateMergeRepair } from './integrity';

export type RepairResult = {
  repaired: boolean;
  movedCounts: Record<string, number>;
  duplicateCaseIds: string[];
};

export async function repairCaseLinks(_canonicalCaseId: string): Promise<RepairResult> {
  const snapshot = await getIntegritySnapshot();
  const report = await runDuplicateMergeRepair();
  const duplicateCaseIds = snapshot.duplicateGroups.flatMap((group) => group.duplicateCaseIds);

  return {
    repaired: report.deletedDuplicateCases > 0,
    movedCounts: report.movedCounts,
    duplicateCaseIds,
  };
}
