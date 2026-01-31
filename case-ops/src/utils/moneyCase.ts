// ============================================
// CASE OPS - Motor de Cuantías (Anti-Fantasmas)
// ============================================

import type { Case, Partida } from '../types';

export interface CaseAmounts {
  principal: number;
  interest: number;
  costs: number;
  totalDemand: number;
  analytic: number;
  delta: number;
}

export function getCaseAmounts(caseData: Case, partidas: Partida[]): CaseAmounts {
  const principal = caseData.amountClaimedCents ?? 0;
  const interest = caseData.amountInterestCents ?? 0;
  const costs = caseData.amountCostsCents ?? 0;
  const totalDemand = caseData.amountTotalCents ?? (principal + interest + costs);

  const analytic = partidas
    .filter(p => !p.tags?.includes('prescrita_interna'))
    .reduce((s, p) => s + (p.amountCents || 0), 0);

  const delta = totalDemand - analytic;

  return { principal, interest, costs, totalDemand, analytic, delta };
}
