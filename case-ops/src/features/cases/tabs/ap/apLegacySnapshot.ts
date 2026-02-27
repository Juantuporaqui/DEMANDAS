import { PICASSENT_AP } from '../../../../data/PO-715-2024-picassent/audienciaPrevia.picassent.ts';

// Snapshot canónico de texto legacy AP (byte-for-byte desde el dataset actual del repositorio).
export const AP_LEGACY_SNAPSHOT = Object.freeze({
  guiones: PICASSENT_AP.guiones,
  guionActa: PICASSENT_AP.excepcionesProcesales.guionActa,
  checklist: PICASSENT_AP.checklist,
  excepcionesProcesales: PICASSENT_AP.excepcionesProcesales,
  bloques: PICASSENT_AP.bloques,
  hechosControvertidos: PICASSENT_AP.hechosControvertidos,
  alegacionesComplementarias: PICASSENT_AP.alegacionesComplementarias,
});
