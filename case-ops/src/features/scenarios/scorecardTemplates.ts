import type { Document, Link, Partida, Span } from '../../types';

type EvidenceRef = { docId: string; page?: number };

type AutoEvalResult = {
  value: 0 | 1 | number;
  confidence: number;
  evidence?: EvidenceRef[];
};

export type ChecklistItem = {
  key: string;
  label: string;
  weight: number;
  kind: 'auto' | 'manual';
  hint?: string;
};

export type DefenseTemplate = {
  defenseTag: string;
  kind: 'ko' | 'partial';
  defaultImpact: number;
  alpha: number;
  items: ChecklistItem[];
  autoEval: (ctx: ScorecardContext, partida: Partida) => Record<string, AutoEvalResult>;
};

export type ScorecardContext = {
  links: Link[];
  documents: Document[];
  spans: Span[];
};

const getLinkRole = (link: Link) => link.meta?.role;

const linkInvolves = (link: Link, type: string, id: string) =>
  (link.fromType === type && link.fromId === id) || (link.toType === type && link.toId === id);

const getRelatedEntities = (links: Link[], partidaId: string, entityType: 'document' | 'span') =>
  links
    .filter(
      (link) =>
        linkInvolves(link, 'partida', partidaId) &&
        (link.fromType === entityType || link.toType === entityType)
    )
    .map((link) => (link.fromType === entityType ? link.fromId : link.toId));

const collectEvidenceRefs = (
  entities: Array<{ docId: string; page?: number }>,
  limit = 4
): EvidenceRef[] => entities.slice(0, limit);

const getEvidenceLinks = (links: Link[], partidaId: string, entityType: 'document' | 'span') =>
  links.filter(
    (link) =>
      linkInvolves(link, 'partida', partidaId) &&
      (link.fromType === entityType || link.toType === entityType) &&
      getLinkRole(link) === 'evidence'
  );

const hasEvidenceBetween = (links: Link[], partidaId: string, entityType: 'document' | 'span') =>
  getEvidenceLinks(links, partidaId, entityType).length > 0;

export const SCORECARD_TEMPLATES: DefenseTemplate[] = [
  {
    defenseTag: 'defense:prescripcion',
    kind: 'ko',
    defaultImpact: 1,
    alpha: -0.6,
    items: [
      {
        key: 'fecha_partida_acreditada',
        label: 'Fecha de la partida acreditada en evidencia',
        weight: 1.2,
        kind: 'auto',
      },
      {
        key: 'partida_etiquetada_prescripcion',
        label: 'Partida etiquetada como prescripción aplicable',
        weight: 1,
        kind: 'manual',
      },
      {
        key: 'sin_interrupcion_visible',
        label: 'No hay interrupciones visibles',
        weight: 0.9,
        kind: 'manual',
      },
      {
        key: 'sts458_distinguible',
        label: 'STS 458/2023 distinguible',
        weight: 0.8,
        kind: 'manual',
      },
    ],
    autoEval: ({ links, documents, spans }, partida) => {
      const spanLinks = getEvidenceLinks(links, partida.id, 'span');
      const docLinks = getEvidenceLinks(links, partida.id, 'document');
      const spanEvidence = spanLinks
        .map((link) => (link.fromType === 'span' ? link.fromId : link.toId))
        .map((spanId) => spans.find((span) => span.id === spanId))
        .filter(Boolean) as Span[];
      const docEvidence = docLinks
        .map((link) => (link.fromType === 'document' ? link.fromId : link.toId))
        .map((docId) => documents.find((doc) => doc.id === docId))
        .filter(Boolean) as Document[];
      const evidenceRefs = collectEvidenceRefs([
        ...spanEvidence.map((span) => ({ docId: span.documentId, page: span.pageStart })),
        ...docEvidence.map((doc) => ({ docId: doc.id })),
      ]);
      const hasEvidence = spanEvidence.length > 0 || docEvidence.length > 0;
      return {
        fecha_partida_acreditada: {
          value: hasEvidence ? 1 : 0,
          confidence: hasEvidence ? 0.75 : 0.4,
          evidence: evidenceRefs,
        },
      };
    },
  },
  {
    defenseTag: 'defense:prueba',
    kind: 'ko',
    defaultImpact: 1,
    alpha: -0.5,
    items: [
      {
        key: 'actora_sin_soporte_bancario',
        label: 'Actora sin soporte bancario suficiente',
        weight: 1.1,
        kind: 'manual',
      },
      {
        key: 'contradicciones_detectadas',
        label: 'Contradicciones detectadas en evidencias',
        weight: 1.2,
        kind: 'auto',
      },
      {
        key: 'trazabilidad_incompleta',
        label: 'Trazabilidad incompleta',
        weight: 0.9,
        kind: 'manual',
      },
    ],
    autoEval: ({ links, documents, spans }, partida) => {
      const relatedSpans = getRelatedEntities(links, partida.id, 'span');
      const relatedDocs = getRelatedEntities(links, partida.id, 'document');
      const relatedSpanSet = new Set(relatedSpans);
      const relatedDocSet = new Set(relatedDocs);
      const contradictionLinks = links.filter(
        (link) =>
          getLinkRole(link) === 'contradicts' &&
          ((link.fromType === 'span' && relatedSpanSet.has(link.fromId)) ||
            (link.toType === 'span' && relatedSpanSet.has(link.toId)) ||
            (link.fromType === 'document' && relatedDocSet.has(link.fromId)) ||
            (link.toType === 'document' && relatedDocSet.has(link.toId)))
      );
      const evidenceRefs = collectEvidenceRefs(
        contradictionLinks
          .map((link) => {
            if (link.fromType === 'span' || link.toType === 'span') {
              const spanId = link.fromType === 'span' ? link.fromId : link.toId;
              const span = spans.find((item) => item.id === spanId);
              if (span) {
                return { docId: span.documentId, page: span.pageStart };
              }
            }
            if (link.fromType === 'document' || link.toType === 'document') {
              const docId = link.fromType === 'document' ? link.fromId : link.toId;
              return { docId };
            }
            return null;
          })
          .filter(Boolean) as EvidenceRef[]
      );
      const hasContradiction = contradictionLinks.length > 0;
      return {
        contradicciones_detectadas: {
          value: hasContradiction ? 1 : 0,
          confidence: hasContradiction ? 0.7 : 0.4,
          evidence: evidenceRefs,
        },
      };
    },
  },
  {
    defenseTag: 'defense:pago',
    kind: 'ko',
    defaultImpact: 1,
    alpha: -0.55,
    items: [
      {
        key: 'hay_extracto_enlazado',
        label: 'Existe extracto vinculado a la partida',
        weight: 1.2,
        kind: 'auto',
      },
      {
        key: 'coincidencia_fecha_importe',
        label: 'Coincidencia de fecha e importe',
        weight: 1.1,
        kind: 'manual',
      },
      {
        key: 'titularidad_origen_fondos',
        label: 'Titularidad/origen de fondos acreditado',
        weight: 0.9,
        kind: 'manual',
      },
    ],
    autoEval: ({ links, documents, spans }, partida) => {
      const spanLinks = getEvidenceLinks(links, partida.id, 'span');
      const docLinks = getEvidenceLinks(links, partida.id, 'document');
      const spanEvidence = spanLinks
        .map((link) => (link.fromType === 'span' ? link.fromId : link.toId))
        .map((spanId) => spans.find((span) => span.id === spanId))
        .filter(Boolean) as Span[];
      const docEvidence = docLinks
        .map((link) => (link.fromType === 'document' ? link.fromId : link.toId))
        .map((docId) => documents.find((doc) => doc.id === docId))
        .filter(Boolean) as Document[];
      const extractoSpans = spanEvidence.filter(
        (span) => documents.find((doc) => doc.id === span.documentId)?.docType === 'extracto'
      );
      const extractoDocs = docEvidence.filter((doc) => doc.docType === 'extracto');
      const hasExtracto = extractoSpans.length > 0 || extractoDocs.length > 0;
      const evidenceRefs = collectEvidenceRefs([
        ...extractoSpans.map((span) => ({ docId: span.documentId, page: span.pageStart })),
        ...extractoDocs.map((doc) => ({ docId: doc.id })),
      ]);
      return {
        hay_extracto_enlazado: {
          value: hasExtracto ? 1 : 0,
          confidence: hasExtracto ? 0.8 : 0.4,
          evidence: evidenceRefs,
        },
      };
    },
  },
  {
    defenseTag: 'defense:pluspeticion',
    kind: 'partial',
    defaultImpact: 0.5,
    alpha: -0.3,
    items: [
      {
        key: 'duplicidad_o_suma_mal',
        label: 'Duplicidad o suma incorrecta',
        weight: 1,
        kind: 'manual',
      },
      {
        key: 'intereses_erroneos',
        label: 'Intereses erróneos',
        weight: 0.9,
        kind: 'manual',
      },
      {
        key: 'desglose_inconsistente',
        label: 'Desglose inconsistente',
        weight: 0.8,
        kind: 'manual',
      },
    ],
    autoEval: () => ({}),
  },
  {
    defenseTag: 'defense:compensacion',
    kind: 'partial',
    defaultImpact: 0.35,
    alpha: -0.35,
    items: [
      {
        key: 'existe_credito_compensable',
        label: 'Existe crédito compensable',
        weight: 1.1,
        kind: 'manual',
      },
      {
        key: 'cuantificado',
        label: 'Cuantificado y documentado',
        weight: 0.9,
        kind: 'manual',
      },
    ],
    autoEval: () => ({}),
  },
];

export const scorecardTemplateByTag = new Map(
  SCORECARD_TEMPLATES.map((template) => [template.defenseTag, template])
);

export const scorecardDefaults = {
  hasEvidenceBetween,
};
