export type CitationEntry = {
  id: string;
  label: string;
  type: 'LEC' | 'CC' | 'JURIS';
  source: 'internal dataset';
  snippet: string;
  ecli?: string;
  roj?: string;
  verified: boolean;
};

export const CITATIONS_DATASET: CitationEntry[] = [
  ...['21.2','73.1.2ª','73.1.1º','250.1.16','416.1.4ª','416.1.5ª','219','231','247','301','304','307','326.2','328','329','339.5','426','427','429','446'].map((art) => ({
    id: `LEC-${art}`,
    label: `LEC ${art}`,
    type: 'LEC' as const,
    source: 'internal dataset' as const,
    snippet: `NO CONSTA: texto literal íntegro del art. ${art} LEC no incorporado en repositorio local.`,
    verified: true,
  })),
  ...['393','395','406','1964.2','1973','7.1','1895'].map((art) => ({
    id: `CC-${art}`,
    label: `CC ${art}`,
    type: 'CC' as const,
    source: 'internal dataset' as const,
    snippet: `NO CONSTA: texto literal íntegro del art. ${art} CC no incorporado en repositorio local.`,
    verified: true,
  })),
  {
    id: 'JURIS-STS-79-2015', label: 'STS 79/2015', type: 'JURIS', source: 'internal dataset',
    snippet: 'NO CONSTA: pendiente validación contra SENTENCIAS.docx en repositorio.', verified: false,
  },
];

export const citationMap = new Map(CITATIONS_DATASET.map((c) => [c.label, c]));
