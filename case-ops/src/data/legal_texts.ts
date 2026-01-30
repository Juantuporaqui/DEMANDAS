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
import {
  procedimientoQuart,
  partesQuart,
  reclamacionVicenta,
  argumentosOposicion,
  argumentosImpugnacion,
  desgloseUsoIndebido,
  pagosDirectosJuan,
  puntosDebiles,
  disputasQuart,
} from './quart';

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

  // --------------------------------------------------------------------------
  // CASO QUART (ETJ 1428/2025) - Ejecución Cuenta Hijos
  // --------------------------------------------------------------------------
  'sentencia-divorcio-quart': `
═══════════════════════════════════════════════════════════════════════════════
                    SENTENCIA DE DIVORCIO 362/2023
               JUZGADO DE PRIMERA INSTANCIA Nº 1 DE QUART DE POBLET
═══════════════════════════════════════════════════════════════════════════════

PROCEDIMIENTO: Divorcio contencioso 000892/2023
FECHA SENTENCIA: 17 de octubre de 2023
JUEZ: ${procedimientoQuart.procedimientoOrigen.juez}
NIG: ${procedimientoQuart.nig}

═══════════════════════════════════════════════════════════════════════════════
                         PARTES PROCESALES
═══════════════════════════════════════════════════════════════════════════════

DEMANDANTE (entonces): ${partesQuart.ejecutante.nombre}
• Procuradora: ${partesQuart.ejecutante.procurador}
• Letrada: ${partesQuart.ejecutante.letrado}

DEMANDADO (entonces): ${partesQuart.ejecutado.nombre}
• NIF: ${partesQuart.ejecutado.nif}
• Procuradora: ${partesQuart.ejecutado.procurador}
• Letrado: ${partesQuart.ejecutado.letrado}

═══════════════════════════════════════════════════════════════════════════════
                   CONVENIO REGULADOR APROBADO
═══════════════════════════════════════════════════════════════════════════════

CLÁUSULA RELEVANTE - ALIMENTOS Y GASTOS HIJOS:

"${reclamacionVicenta.fundamentoConvenio}"

→ Ambos progenitores deben ingresar 200€/mes del 1 al 5 de cada mes
→ Cuenta común en Openbank
→ IBAN: ES68 0073 0100 5908 1169 1110

Esta sentencia constituye el TÍTULO EJECUTIVO base de la ejecución 1428/2025.
  `,

  'demanda-ejecucion-quart': `
═══════════════════════════════════════════════════════════════════════════════
                    DEMANDA DE EJECUCIÓN DE TÍTULOS JUDICIALES
                         ETJ 1428/2025 - QUART DE POBLET
═══════════════════════════════════════════════════════════════════════════════

AL JUZGADO DE PRIMERA INSTANCIA Nº 1 DE QUART DE POBLET

${partesQuart.ejecutante.nombre}, representada por la Procuradora
${partesQuart.ejecutante.procurador}, bajo la dirección de la Letrada
${partesQuart.ejecutante.letrado}, ante el Juzgado comparezco y DIGO:

Que por medio del presente escrito formulo DEMANDA DE EJECUCIÓN DE TÍTULOS
JUDICIALES contra D. ${partesQuart.ejecutado.nombre}.

═══════════════════════════════════════════════════════════════════════════════
                          TÍTULO EJECUTIVO
═══════════════════════════════════════════════════════════════════════════════

Sentencia nº ${procedimientoQuart.procedimientoOrigen.sentencia} de fecha
${procedimientoQuart.procedimientoOrigen.fechaSentencia}, dictada en el
procedimiento de divorcio ${procedimientoQuart.procedimientoOrigen.numero}.

═══════════════════════════════════════════════════════════════════════════════
                         CANTIDAD RECLAMADA
═══════════════════════════════════════════════════════════════════════════════

PRINCIPAL: ${(reclamacionVicenta.importePrincipalCents / 100).toLocaleString('es-ES')} €

CONCEPTO: ${reclamacionVicenta.conceptoPrincipal}

MESES IMPAGADOS ALEGADOS:
${reclamacionVicenta.mesesReclamados.map(m => `• ${m}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                           SOLICITUDES
═══════════════════════════════════════════════════════════════════════════════

${reclamacionVicenta.solicitudes.map((s, i) => `${i + 1}. ${s}`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                    DOMICILIO SEÑALADO (ERRÓNEO)
═══════════════════════════════════════════════════════════════════════════════

⚠️ ATENCIÓN: En la demanda figura como domicilio del ejecutado:
   C/ Isabel de Villena 2-5, Mislata

   Este es el domicilio de la EJECUTANTE, no del ejecutado.
   Juan nunca ha residido en esa dirección.
  `,

  'oposicion-quart': `
═══════════════════════════════════════════════════════════════════════════════
                    ESCRITO DE OPOSICIÓN A LA EJECUCIÓN
                    ETJ 1428.1/2025 - QUART DE POBLET
═══════════════════════════════════════════════════════════════════════════════

AL JUZGADO DE PRIMERA INSTANCIA Nº 1 DE QUART DE POBLET

${partesQuart.ejecutado.nombre}, representado por la Procuradora
${partesQuart.ejecutado.procurador}, bajo la dirección del Letrado
${partesQuart.ejecutado.letrado}, ante el Juzgado comparezco y como mejor
proceda en Derecho, DIGO:

Que dentro del plazo legal, formulo OPOSICIÓN A LA EJECUCIÓN despachada,
con base en los siguientes:

═══════════════════════════════════════════════════════════════════════════════
                      MOTIVOS DE OPOSICIÓN
═══════════════════════════════════════════════════════════════════════════════

${argumentosOposicion.map((arg, i) => `
───────────────────────────────────────────────────────────────────────────────
${i + 1}. ${arg.titulo.toUpperCase()} [RIESGO: ${arg.riesgo.toUpperCase()}]
───────────────────────────────────────────────────────────────────────────────
Código: ${arg.codigo}
Fundamento: ${arg.fundamentoLegal.join(', ')}

${arg.descripcion}
${arg.cifras ? `
CIFRAS:
${Object.entries(arg.cifras).map(([k, v]) => `  • ${k}: ${(v / 100).toLocaleString('es-ES')} €`).join('\n')}
` : ''}
`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                    DESGLOSE USO INDEBIDO ALEGADO
═══════════════════════════════════════════════════════════════════════════════

TOTAL: ${(desgloseUsoIndebido.totalCents / 100).toLocaleString('es-ES')} €

${desgloseUsoIndebido.categorias.map(c => `• ${c.concepto}: ${(c.importeCents / 100).toLocaleString('es-ES')} €`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                    PAGOS DIRECTOS REALIZADOS POR JUAN
═══════════════════════════════════════════════════════════════════════════════

TOTAL: ${(pagosDirectosJuan.totalCents / 100).toLocaleString('es-ES')} €

${pagosDirectosJuan.items.map(p => `• ${p.concepto}: ${(p.importeCents / 100).toLocaleString('es-ES')} €`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                           SUPLICO
═══════════════════════════════════════════════════════════════════════════════

Que teniendo por presentado este escrito con sus documentos, se sirva admitirlo
y, en su virtud, tenga por formulada OPOSICIÓN a la ejecución despachada,
declarando que NO PROCEDE el despacho por las cantidades reclamadas, o
subsidiariamente, reduciendo la cantidad ejecutable al déficit real de
1.828,73 € menos el crédito compensable de 881,88 €.
  `,

  'impugnacion-quart': `
═══════════════════════════════════════════════════════════════════════════════
                  IMPUGNACIÓN DE LA OPOSICIÓN (VICENTA)
                    ETJ 1428.1/2025 - QUART DE POBLET
═══════════════════════════════════════════════════════════════════════════════

ESCRITO DE LA EJECUTANTE IMPUGNANDO LA OPOSICIÓN

═══════════════════════════════════════════════════════════════════════════════
                    ARGUMENTOS DE IMPUGNACIÓN
═══════════════════════════════════════════════════════════════════════════════

${argumentosImpugnacion.map((arg, i) => `
───────────────────────────────────────────────────────────────────────────────
${i + 1}. ${arg.titulo.toUpperCase()}
───────────────────────────────────────────────────────────────────────────────
${arg.descripcion}

Fuente: ${arg.fuente}
`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                  JUSTIFICACIÓN DE RETIRADAS (SEGÚN VICENTA)
═══════════════════════════════════════════════════════════════════════════════

Vicenta alega que TODAS las retiradas están justificadas:

• Recargas móvil → Tarjetas prepago de los hijos
• Druni (perfumería) → Solo 14,99€ para regalo amigo invisible
• Ropa → Para los hijos en dos casas, consensuada
• Transferencias → Reintegros de gastos (teclado conservatorio 298€,
  vacuna papiloma 172,55€, etc.)

═══════════════════════════════════════════════════════════════════════════════
                    JURISPRUDENCIA CITADA (VICENTA)
═══════════════════════════════════════════════════════════════════════════════

Vicenta cita las siguientes sentencias para defender que los 200€/mes
tienen NATURALEZA ALIMENTICIA:

• STS 55/2016 - Naturaleza alimenticia de aportaciones a hijos
• STS 656/2021 - Finalidad alimenticia de contribuciones mensuales
• STS 866/2022 - Alimentos y custodia compartida

⚠️ RIESGO: Esta jurisprudencia podría perjudicar nuestra posición si el
juzgado califica los 200€/mes como "alimentos" en sentido estricto.
  `,

  'argumentos-quart': `
═══════════════════════════════════════════════════════════════════════════════
                    ARGUMENTOS Y ANÁLISIS DE RIESGOS
                    ETJ 1428/2025 - CASO QUART
═══════════════════════════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════════════════════════
                         DISPUTAS CLAVE
═══════════════════════════════════════════════════════════════════════════════

${disputasQuart.map((d, i) => `
───────────────────────────────────────────────────────────────────────────────
DISPUTA ${i + 1}: ${d.tema.toUpperCase()}
───────────────────────────────────────────────────────────────────────────────

🛡️ POSICIÓN JUAN (Ejecutado):
${d.posicionEjecutado}

⚔️ POSICIÓN VICENTA (Ejecutante):
${d.posicionEjecutante}

Fuentes: ${d.fuentes.join(', ')}
`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                    🚨 PUNTOS DÉBILES / RIESGOS
═══════════════════════════════════════════════════════════════════════════════

${puntosDebiles.map((p, i) => `
───────────────────────────────────────────────────────────────────────────────
RIESGO ${i + 1}: ${p.titulo} [${p.riesgo.toUpperCase()}]
───────────────────────────────────────────────────────────────────────────────
${p.descripcion}

✅ MITIGACIÓN: ${p.pruebaMitigadora}
`).join('\n')}

═══════════════════════════════════════════════════════════════════════════════
                         PRÓXIMA FECHA
═══════════════════════════════════════════════════════════════════════════════

📅 VISTA ORAL: ${procedimientoQuart.piezaOposicion.fechaVista}
⏰ HORA: ${procedimientoQuart.piezaOposicion.horaVista}
📍 ${procedimientoQuart.juzgado}

═══════════════════════════════════════════════════════════════════════════════
                    RESUMEN CIFRAS
═══════════════════════════════════════════════════════════════════════════════

❌ Reclamado por Vicenta: 2.400,00 €
✅ Déficit real calculado: 1.828,73 €
✅ Uso indebido Vicenta: 2.710,61 €
💰 Saldo neto a favor Juan: 881,88 €
💵 Pagos directos Juan: 1.895,65 €
  `,
};
