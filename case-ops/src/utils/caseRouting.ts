import { casesRepo } from '../db/repositories';

type Params = Record<string, string | undefined>;

export async function resolveCaseIdFromUrl(
  params: Params,
  searchParams: URLSearchParams
): Promise<string | null> {
  const caseKey = params.caseKey ?? searchParams.get('caseKey');
  if (caseKey) {
    const byKey = await casesRepo.getByCaseKey(caseKey);
    if (byKey?.id) return byKey.id;
  }

  const caseId = params.caseId ?? params.id ?? searchParams.get('caseId');
  if (!caseId) return null;
  const byId = await casesRepo.getById(caseId);
  return byId?.id ?? null;
}
