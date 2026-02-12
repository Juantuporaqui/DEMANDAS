export interface LegalReference {
  id: string;
  label: string;
  summary: string;
  pdfUrl?: string;
  externalUrl?: string;
  internalPath: string;
}

export const LEGAL_REFERENCES: LegalReference[] = [
  {
    id: 'sts-458-2025',
    label: 'STS 458/2025',
    summary:
      'Doctrina sobre dies a quo en supuestos concretos de relaciones patrimoniales entre cónyuges; requiere identidad de presupuesto fáctico y análisis por bloques.',
    pdfUrl: '/docs/STS_458_2025.pdf',
    internalPath: '/analytics/anti-sts-458-2025',
  },
  {
    id: 'lec-217',
    label: 'Art. 217 LEC',
    summary: 'Carga de la prueba: corresponde a cada parte acreditar los hechos constitutivos, impeditivos, extintivos y excluyentes que alegue.',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a217',
    internalPath: '/jurisprudencia',
  },
  {
    id: 'cc-1969',
    label: 'Art. 1969 CC',
    summary: 'El tiempo para la prescripción comienza desde el día en que la acción pudo ejercitarse (actio nata).',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763#a1969',
    internalPath: '/jurisprudencia',
  },
  {
    id: 'cc-1964-2',
    label: 'Art. 1964.2 CC',
    summary: 'Las acciones personales que no tengan plazo especial prescriben a los cinco años desde que pueda exigirse el cumplimiento.',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763#a1964',
    internalPath: '/jurisprudencia',
  },
  {
    id: 'cc-1973',
    label: 'Art. 1973 CC',
    summary: 'La prescripción se interrumpe por su ejercicio judicial, reclamación extrajudicial del acreedor o reconocimiento de deuda del deudor.',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-1889-4763#a1973',
    internalPath: '/jurisprudencia',
  },
  {
    id: 'lec-426',
    label: 'Art. 426 LEC',
    summary: 'Régimen de audiencia previa y fijación del objeto litigioso; permite precisar hechos y proposición de prueba.',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a426',
    internalPath: '/jurisprudencia',
  },
  {
    id: 'lec-270',
    label: 'Art. 270 LEC',
    summary: 'Aportación documental fuera del momento inicial en supuestos legalmente tasados.',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a270',
    internalPath: '/jurisprudencia',
  },
  {
    id: 'lec-286',
    label: 'Art. 286 LEC',
    summary: 'Hechos nuevos o de nueva noticia y consecuencias procesales sobre alegaciones y prueba.',
    externalUrl: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a286',
    internalPath: '/jurisprudencia',
  },
];

const referenceMatchers = [
  { refId: 'sts-458-2025', regex: /STS\s*458\/2025/gi },
  { refId: 'lec-217', regex: /art\.?\s*217\s*LEC/gi },
  { refId: 'cc-1969', regex: /art\.?\s*1969\s*CC/gi },
  { refId: 'cc-1964-2', regex: /art\.?\s*1964\.2\s*CC/gi },
  { refId: 'cc-1973', regex: /art\.?\s*1973\s*CC/gi },
  { refId: 'lec-426', regex: /art\.?\s*426\s*LEC/gi },
  { refId: 'lec-270', regex: /art\.?\s*270\s*LEC/gi },
  { refId: 'lec-286', regex: /art\.?\s*286\s*LEC/gi },
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
