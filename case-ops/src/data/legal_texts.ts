// ============================================
// BASE DE DATOS DE TEXTOS LEGALES (MAPA)
// ============================================
// Este archivo conecta los IDs de la aplicación con los textos completos
// que residen en la carpeta /docs para mantener el código limpio.

import { CONTESTACION_PICASSENT_TEXT } from './docs/contestacionPicassent';
import { DEMANDA_PICASSENT_TEXT } from './docs/demandaPicassent';
import {
  procedimientoMislata,
  argumentosContestacion,
  nuestrosArgumentos,
  frasesClaveVista,
} from './mislata';

export const LEGAL_DOCS_MAP: Record<string, string> = {
  // --------------------------------------------------------------------------
  // CASO PICASSENT (715/2024) - Documentos Reales
  // --------------------------------------------------------------------------
  'demanda-picassent': DEMANDA_PICASSENT_TEXT,
  'contestacion-picassent': CONTESTACION_PICASSENT_TEXT,

  // --------------------------------------------------------------------------
  // CASO MISLATA (J.V. 1185/2025) - Reclamación cuotas hipotecarias
  // --------------------------------------------------------------------------
  'demanda-mislata': `
AL JUZGADO DE PRIMERA INSTANCIA DE MISLATA
Juicio Verbal ${procedimientoMislata.autos}

D. ${procedimientoMislata.demandante}, representado por la Procuradora ${procedimientoMislata.procuradorPropio},
bajo la dirección del Letrado ${procedimientoMislata.letradoPropio}, ante el Juzgado comparezco y DIGO:

Que por medio del presente escrito formulo DEMANDA DE JUICIO VERBAL en ejercicio de acción
de RECLAMACIÓN DE CANTIDAD contra Dª ${procedimientoMislata.demandada}.

CUANTÍA: ${(procedimientoMislata.cuantiaReclamada / 100).toLocaleString('es-ES')} €

HECHOS:

PRIMERO.- Ambas partes suscribieron préstamo hipotecario como deudores SOLIDARIOS.

SEGUNDO.- Desde agosto de 2023, la demandada dejó de contribuir al pago de las cuotas.

TERCERO.- El demandante ha abonado el 100% de las cuotas desde octubre 2023 hasta junio 2025.

CUARTO.- El exceso pagado por el demandante asciende a 7.119,98 €.

FUNDAMENTOS DE DERECHO:

I. Art. 1145 CC: Acción de regreso del deudor solidario.
II. Art. 1158 CC: Derecho de repetición del que paga por otro.
III. Art. 1091 CC: Las obligaciones contractuales tienen fuerza de ley.

SUPLICO AL JUZGADO que dicte sentencia condenando a la demandada al pago de 7.119,98 €
más intereses legales.
  `,

  'contestacion-mislata': `
AL JUZGADO DE PRIMERA INSTANCIA DE MISLATA
Juicio Verbal ${procedimientoMislata.autos}

CONTESTACIÓN A LA DEMANDA presentada por Dª ${procedimientoMislata.demandada}

EXCEPCIONES PROCESALES ALEGADAS:

${argumentosContestacion.map((arg, i) => `${i + 1}. ${arg.titulo}
   Argumento: ${arg.argumentoVicenta.substring(0, 150)}...
   Artículos: ${arg.articulosInvocados.join(', ')}`).join('\n\n')}

NUESTRA RÉPLICA A CADA EXCEPCIÓN:

${argumentosContestacion.map((arg, i) => `${i + 1}. CONTRA ${arg.titulo}:
   ${arg.nuestraReplica.substring(0, 200)}...`).join('\n\n')}
  `,

  'argumentos-mislata': `
ARGUMENTOS PRINCIPALES - MISLATA J.V. 1185/2025

${nuestrosArgumentos.map(arg => `
═══════════════════════════════════════════════════════════════
${arg.titulo}
═══════════════════════════════════════════════════════════════
Fundamento: ${arg.fundamento}

${arg.texto}

Cita: ${arg.cita}
`).join('\n')}
  `,

  'frases-vista-mislata': `
FRASES CLAVE PARA LA VISTA - MISLATA

${frasesClaveVista.map((f, i) => `
${i + 1}. ${f.contexto.toUpperCase()}
   ${f.frase}
`).join('\n')}
  `,
};
