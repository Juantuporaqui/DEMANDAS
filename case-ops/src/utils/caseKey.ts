import type { Case } from '../types';

export type CaseKey = 'picassent' | 'mislata' | 'quart' | 'other';

const AUTOS_TO_CASE_KEY: Record<string, Exclude<CaseKey, 'other'>> = {
  '715/2024': 'picassent',
  '1185/2025': 'mislata',
  '1428/2025': 'quart',
};

export function normalizeAutosNumber(value?: string | null): string {
  if (!value) return '';
  return value
    .normalize('NFKC')
    .replace(/[\u00A0\u2000-\u200B]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*\/\s*/g, '/');
}

export function getCaseKey(caseData?: Partial<Case> | null): CaseKey {
  if (!caseData) return 'other';

  const normalizedAutos = normalizeAutosNumber(caseData.autosNumber);
  const exact = AUTOS_TO_CASE_KEY[normalizedAutos];
  if (exact) return exact;

  const haystack = `${caseData.title ?? ''} ${caseData.court ?? ''}`.toLowerCase();
  if (haystack.includes('picassent')) return 'picassent';
  if (haystack.includes('mislata')) return 'mislata';
  if (haystack.includes('quart')) return 'quart';

  return 'other';
}
