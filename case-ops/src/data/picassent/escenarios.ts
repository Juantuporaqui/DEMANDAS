import type { EscenarioVista } from '../escenarios/types';

export const escenarios: EscenarioVista[] = [
  {
    tipo: 'favorable',
    titulo: 'Juez sensible a prescripción y desequilibrio patrimonial',
    mensaje60s:
      'Señoría, el núcleo de la reclamación está prescrito conforme al art. 1964 CC en el tramo 2008-2015. Lo reclamable, si acaso, se limita al bloque 2016-2018. Además, la actora disfrutó del uso exclusivo de la vivienda sin contraprestación, generando un enriquecimiento injusto. Pedimos que se delimite el período y se valore la posesión exclusiva al fijar cualquier compensación.',
    puntosAClavar: [
      'Separar de forma tajante deuda prescrita (2008-2015) vs reclamable (2016-2018).',
      'Uso exclusivo de la vivienda por la actora = enriquecimiento injusto.',
      'Contabilidad real de aportaciones y pagos en el tramo no prescrito.',
    ],
    queConceder: ['Aceptar el debate solo en el tramo 2016-2018 para concentrar la defensa.'],
    planB: ['Si el juez evita la prescripción: pedir, como mínimo, compensación por uso exclusivo.'],
    documentosDeMano: [
      'Cronología 2008-2018 con hitos de pagos y obligaciones.',
      'Extractos que acreditan pagos del demandado en 2016-2018.',
      'Pruebas de uso exclusivo de la vivienda por la actora.',
    ],
  },
  {
    tipo: 'neutral',
    titulo: 'Juez técnico — pide concreción probatoria',
    mensaje60s:
      'Señoría, estamos preparados para concretar por periodos. Proponemos una línea de tiempo clara: 2008-2015 está prescrito y 2016-2018 es el único tramo susceptible de análisis. Además, la posesión exclusiva de la actora debe computarse como enriquecimiento injusto. Solicitamos acotar el objeto probatorio para que quede claro qué se discute y con qué documentos.',
    puntosAClavar: [
      'Concreción temporal: delimitar el objeto a 2016-2018.',
      'Ofrecer prueba documental directa por tramos.',
      'Posesión exclusiva como variable económica relevante.',
    ],
    queConceder: ['Aceptar un calendario de prueba rígido si se acota el tramo.'],
    planB: ['Solicitar diligencias finales sobre uso de la vivienda si se discute prescripción.'],
    documentosDeMano: [
      'Cuadro resumen por año con cifras de aportaciones.',
      'Escrituras/contratos vinculados a la vivienda.',
      'Documentos de ocupación exclusiva y gastos asociados.',
    ],
  },
  {
    tipo: 'hostil',
    titulo: 'Juez se alinea con el relato de la actora',
    mensaje60s:
      'Señoría, aunque la actora insiste en una reclamación íntegra, lo cierto es que parte sustancial está prescrita y el tramo no prescrito exige liquidación real. Si el tribunal no admite la prescripción, pedimos al menos compensación por el uso exclusivo de la vivienda y por los pagos acreditados del demandado, evitando un resultado de enriquecimiento injusto.',
    puntosAClavar: [
      'Mantener la prescripción como defensa estructural.',
      'Exigir liquidación real de aportaciones y beneficios.',
      'Uso exclusivo = compensación obligatoria.',
    ],
    queConceder: ['No discutir la existencia de la relación patrimonial, solo su cuantificación.'],
    planB: ['Solicitar pericial contable si la sala insiste en cuantía global.'],
    documentosDeMano: [
      'Tabla comparativa de aportaciones de ambas partes.',
      'Justificantes de pagos hipotecarios del demandado.',
      'Pruebas de uso exclusivo de la vivienda por la actora.',
    ],
  },
];
