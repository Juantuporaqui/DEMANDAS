import { PICASSENT_AP } from '../../../../data/PO-715-2024-picassent/audienciaPrevia.picassent';
import type { APExceptionCard } from './types.ts';

const legacyCopy = {
  actaPrincipal: PICASSENT_AP.excepcionesProcesales.guionActa.sala.principal,
  actaSubsidiario: PICASSENT_AP.excepcionesProcesales.guionActa.sala.subsidiario,
  s90: PICASSENT_AP.guiones.s90,
  m3: PICASSENT_AP.guiones.m3,
  m5: PICASSENT_AP.guiones.m5,
};

const baseCard = (item: (typeof PICASSENT_AP.excepcionesProcesales.excepciones)[number], id = item.id, title = item.titulo): APExceptionCard => ({
  id,
  title,
  phase: 'SANEAMIENTO',
  status: 'UNKNOWN',
  why: [],
  ask: item.sala.pedir,
  legalBasis: item.sala.base,
  checklist: item.interno.checklist,
  counterAttacks: item.interno.contraataques,
  evidence: {
    supports: item.interno.checklist,
    missing: ['NO CONSTA: se requiere identificar documento concreto que pruebe este extremo.'],
  },
  overrides: {
    forcedEnabled: false,
    reason: '',
  },
  userInputs: {
    raisedInContestacion: false,
    declinatoriaFiled: false,
    fueroImperativoApplies: false,
  },
  copyBlocks: { legacy: legacyCopy },
});

export const AP_EXCEPTIONS_CATALOG: APExceptionCard[] = PICASSENT_AP.excepcionesProcesales.excepciones.flatMap((item) => {
  if (item.id !== 'competencia') return [baseCard(item)];
  return [
    baseCard(item, 'competencia_objetiva_funcional', 'Competencia objetiva/funcional (DIAGNÓSTICO)'),
    baseCard(item, 'competencia_territorial', 'Competencia territorial (DIAGNÓSTICO)'),
  ];
});

export const LEGACY_AUDIENCIA_BLOCKS = {
  guiones: PICASSENT_AP.guiones,
  guionActa: PICASSENT_AP.excepcionesProcesales.guionActa,
  checklist: PICASSENT_AP.checklist,
  contraataques: PICASSENT_AP.excepcionesProcesales.excepciones.map((item) => item.interno.contraataques),
  bloques: PICASSENT_AP.bloques,
  hechos: PICASSENT_AP.hechosControvertidos.map((item) => ({
    id: item.id,
    titulo: item.titulo,
    estado: item.estado,
  })),
};
