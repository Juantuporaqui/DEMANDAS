// ============================================
// BASE DE DATOS DE TEXTOS LEGALES (MAPA)
// ============================================
// Este archivo conecta los IDs de la aplicación con los textos completos
// que residen en la carpeta /docs para mantener el código limpio.

import { CONTESTACION_PICASSENT_TEXT } from './docs/contestacionPicassent';
import { DEMANDA_PICASSENT_TEXT } from './docs/demandaPicassent';

export const LEGAL_DOCS_MAP: Record<string, string> = {
  // --------------------------------------------------------------------------
  // CASO PICASSENT (715/2024) - Documentos Reales
  // --------------------------------------------------------------------------
  'demanda-picassent': DEMANDA_PICASSENT_TEXT,
  'contestacion-picassent': CONTESTACION_PICASSENT_TEXT,

  // --------------------------------------------------------------------------
  // CASO MISLATA (Placeholders para futuro)
  // --------------------------------------------------------------------------
  'recurso-reposicion-mislata': `
AL JUZGADO DE PRIMERA INSTANCIA Nº 3 DE MISLATA
Procedimiento Ejecución Hipotecaria 112/2023

DIGO: Que interpongo RECURSO DE REPOSICIÓN contra el Decreto de fecha 12 de enero...
[Documento pendiente de transcripción completa]
  `,
  
  'oposicion-mislata': `
AL JUZGADO DE PRIMERA INSTANCIA Nº 3 DE MISLATA
Oposición a la Ejecución Hipotecaria

MOTIVOS:
1. Existencia de Cláusulas Abusivas en el título ejecutivo.
2. Error en el cálculo de los intereses moratorios aplicados...
[Documento pendiente de transcripción completa]
  `
};
