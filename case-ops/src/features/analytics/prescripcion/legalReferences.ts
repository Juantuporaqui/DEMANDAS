export interface LegalReference {
  id: string;
  label: string;
  summary: string;
  pdfUrl?: string;
  internalPath: string;
}

export const LEGAL_REFERENCES: LegalReference[] = [
  {
    id: 'sts-458-2025',
    label: 'STS 458/2025',
    summary:
      'Sentencia usada como referencia subsidiaria para el dies a quo en supuestos de cargas familiares con presupuesto fáctico específico. Su traslación requiere identidad de supuesto y prueba suficiente.',
    pdfUrl: '/docs/STS_458_2025.pdf',
    internalPath: '/analytics/anti-sts-458-2025',
  },
];

const referenceMatchers = [
  {
    refId: 'sts-458-2025',
    regex: /STS\s*458\/2025/gi,
  },
];

export function findLegalReference(token: string): LegalReference | undefined {
  return LEGAL_REFERENCES.find((item) => item.label.toLowerCase() === token.toLowerCase());
}

export function getReferenceMatchers() {
  return referenceMatchers.map((item) => ({
    ...item,
    ref: LEGAL_REFERENCES.find((ref) => ref.id === item.refId),
  }));
}
