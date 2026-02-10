import { argumentosImpugnacion } from './index';

export type DefensaPilar = {
  id: string;
  carril: 'tasado' | 'contexto';
  titulo: string;
  claim15s: string;
  parrafoEscrito: string;
  encaje: string[];
  probabilidad: 'alta' | 'media' | 'baja';
  pruebas: { label: string; docId?: string; note?: string }[];
  contra: { vicenta: string[]; respuesta: string[] };
  tags: string[];
};

const impugnacionById = Object.fromEntries(argumentosImpugnacion.map((item) => [item.id, item]));

export const DEFENSA_360_QUART: DefensaPilar[] = [
  {
    id: 'pilar-1-pago-documental',
    carril: 'tasado',
    titulo: 'Pago / Cumplimiento documental (núcleo 556 LEC)',
    claim15s:
      'Reclaman 2.400€ pero hay pagos acreditados; el déficit real es inferior. Que la cuantía se fije por extracto certificado.',
    parrafoEscrito:
      'Al amparo del art. 556 LEC, esta parte opone pago y cumplimiento parcial documentalmente acreditado. La cifra de 2.400€ no refleja la secuencia real de ingresos efectuados por el ejecutado, tanto antes como después del despacho, ni su proyección sobre los meses reclamados. Procede, por ello, depurar la liquidación con base en el extracto certificado aportado y en los justificantes de transferencia obrantes en autos, a fin de fijar una cuantía ejecutiva ajustada a lo efectivamente pendiente. No se pretende alterar el título, sino evitar una ejecución por importe superior al debido. En consecuencia, se interesa que la ejecución quede limitada al saldo real que resulte del contraste contable.',
    encaje: ['Art. 556 LEC (pago/cumplimiento)'],
    probabilidad: 'alta',
    pruebas: [
      { label: 'Escrito de oposición', docId: 'oposicion-quart' },
      { label: 'Demanda de ejecución', docId: 'demanda-ejecucion-quart' },
      { label: 'Providencia y señalamiento', docId: 'providencia-quart', note: 'Encuadra trámite y vista' },
    ],
    contra: {
      vicenta: [
        impugnacionById['qrt-imp-2']?.descripcion ?? '',
        impugnacionById['qrt-imp-4']?.descripcion ?? '',
      ].filter(Boolean),
      respuesta: [
        'El correo citado se contextualiza como propuesta de regularización y no impide discutir la cuantía exacta hoy exigible.',
        'Precisamente dentro del art. 556 LEC se articula este motivo: pago parcial acreditado y necesidad de depuración contable.',
      ],
    },
    tags: ['tasado', 'extracto', 'cuantía'],
  },
  {
    id: 'pilar-2-liquidacion-exceso',
    carril: 'tasado',
    titulo: 'Liquidación errónea / exceso (encuadrado como pago parcial)',
    claim15s:
      'La ejecutante omite ingresos recientes y computa como impago meses ya cubiertos: la liquidación está inflada.',
    parrafoEscrito:
      'Con carácter principal y en conexión con el pago parcial opuesto ex art. 556 LEC, se denuncia error de liquidación por cómputo inflado de mensualidades y omisión de ingresos relevantes. La pretensión ejecutiva incorpora como impagados periodos que, total o parcialmente, aparecen cubiertos por transferencias documentadas, generando un exceso en la cifra reclamada. Esta parte no solicita una suspensión automática por esta sola alegación, sino la fijación judicial de la cuantía correcta tras contraste objetivo de movimientos. Subsidiariamente, el art. 558 LEC refuerza la necesidad de corregir la pluspetición cuando el principal reclamado excede lo verdaderamente debido.',
    encaje: ['Art. 556 LEC', 'Art. 558 LEC (exceso/pluspetición, como apoyo)'],
    probabilidad: 'media',
    pruebas: [
      { label: 'Escrito de oposición (cuadro de pagos)', docId: 'oposicion-quart' },
      { label: 'Demanda de ejecución (cálculo inicial)', docId: 'demanda-ejecucion-quart' },
    ],
    contra: {
      vicenta: [
        impugnacionById['qrt-imp-1']?.descripcion ?? '',
        impugnacionById['qrt-imp-6']?.descripcion ?? '',
      ].filter(Boolean),
      respuesta: [
        'Que existan movimientos trazables no elimina la necesidad de imputarlos correctamente al periodo reclamado.',
        'La carga aquí es estrictamente aritmética: determinar qué meses permanecen descubiertos y en qué importe exacto.',
      ],
    },
    tags: ['tasado', 'pluspetición', 'recalcular'],
  },
  {
    id: 'pilar-3-pagos-directos-finalistas',
    carril: 'tasado',
    titulo: 'Pagos directos finalistas a los menores (cumplimiento material)',
    claim15s:
      'Además del ingreso, hay gastos necesarios pagados directamente (salud/educación) con factura: se aportan para minorar el saldo.',
    parrafoEscrito:
      'Subsidiariamente, y siempre dentro del marco de cumplimiento material, se interesan como minoración los pagos directos finalistas acreditados en beneficio de los menores, singularmente en ámbitos necesarios de salud, educación y suministros vinculados. Esta alegación se formula con prudencia y sin invocar una compensación civil automática, sino como dato de cumplimiento parcial efectivo que debe ponderarse en la determinación del saldo exigible. Se aportan facturas y justificantes para que el órgano judicial valore su conexión con necesidades ordinarias de los hijos y su incidencia económica real sobre la deuda reclamada.',
    encaje: ['Art. 556 LEC (cumplimiento)'],
    probabilidad: 'media',
    pruebas: [
      { label: 'Relación de pagos directos en oposición', docId: 'oposicion-quart' },
      { label: 'Impugnación (objeciones sobre regalos)', docId: 'providencia-quart', note: 'Contrastar con prueba documental en vista' },
    ],
    contra: {
      vicenta: [
        impugnacionById['qrt-imp-6']?.descripcion ?? '',
        impugnacionById['qrt-imp-5']?.descripcion ?? '',
      ].filter(Boolean),
      respuesta: [
        'Se seleccionan únicamente pagos necesarios, acreditados y vinculados a necesidades de los menores; no meros obsequios.',
        'La finalidad menor y la trazabilidad documental permiten su valoración como cumplimiento material subsidiario.',
      ],
    },
    tags: ['tasado', 'subsidiario', 'finalista'],
  },
  {
    id: 'pilar-4-quiebra-cuenta-comun',
    carril: 'contexto',
    titulo: 'Quiebra del mecanismo de cuenta común (buena fe y causalidad del conflicto)',
    claim15s:
      'La cuenta perdió su finalidad por disposiciones no correlacionadas; esto explica la conducta y refuerza la solicitud de costas/credibilidad.',
    parrafoEscrito:
      'Como contexto no tasado para la decisión sobre credibilidad, carga de conducta y eventual imposición de costas, se expone la quiebra funcional del mecanismo de cuenta común por disposiciones discutidas no claramente correlacionadas con gastos pactados. Esta línea no se formula como motivo autónomo de oposición a la ejecución, sino como elemento de buena fe (art. 7.1 CC) y lealtad procesal (art. 247 LEC) que ayuda a explicar la secuencia de conflicto y las decisiones de pago adoptadas por el ejecutado. Por ello, se interesa su valoración únicamente en el plano contextual y de costas, sin desplazar el carril tasado del art. 556 LEC.',
    encaje: ['Art. 7.1 CC (buena fe)', 'Art. 247 LEC (lealtad procesal)'],
    probabilidad: 'baja',
    pruebas: [
      { label: 'Oposición (desglose de movimientos)', docId: 'oposicion-quart' },
      { label: 'Demanda de ejecución (posición de parte actora)', docId: 'demanda-ejecucion-quart' },
    ],
    contra: {
      vicenta: [
        impugnacionById['qrt-imp-1']?.descripcion ?? '',
        impugnacionById['qrt-imp-5']?.descripcion ?? '',
      ].filter(Boolean),
      respuesta: [
        'Se acepta su carácter contextual: no se pide archivo por esta vía, sino ponderación de buena fe y conducta procesal.',
        'La valoración de costas puede atender a si la controversia pudo evitarse con una rendición de cuentas más transparente.',
      ],
    },
    tags: ['contexto', 'buena-fe', 'costas'],
  },
  {
    id: 'pilar-5-mala-fe-cronologia',
    carril: 'contexto',
    titulo: 'Mala fe / presión / cronología',
    claim15s:
      'La secuencia oferta de normalización → demanda refuerza la buena fe de esta parte y la proporcionalidad en costas.',
    parrafoEscrito:
      'También en plano de contexto/costas, esta parte interesa que se valore la cronología objetiva de los hechos, incluyendo el intento de regularización extraprocesal y la posterior activación de la ejecución. Esta línea se formula con sobriedad y sin convertirla en motivo tasado autónomo, pues el carril principal sigue siendo pago/cumplimiento y depuración de cuantía ex art. 556 LEC. El email aportado se invoca únicamente como indicio de buena fe (art. 7 CC) y lealtad procesal (art. 247 LEC), útil para enmarcar la proporcionalidad de la respuesta procesal y la eventual decisión sobre costas.',
    encaje: ['Art. 7 CC (buena fe)', 'Art. 247 LEC (lealtad procesal)'],
    probabilidad: 'media',
    pruebas: [
      {
        label: 'Email de regularización (buena fe y cronología)',
        note: 'Evidencia interna: email-regularizacion-cuenta-ninos',
      },
      { label: 'Demanda de ejecución (secuencia temporal)', docId: 'demanda-ejecucion-quart' },
      { label: 'Providencia de señalamiento', docId: 'providencia-quart' },
      { label: 'Escrito de oposición (marco tasado de defensa)', docId: 'oposicion-quart' },
    ],
    contra: {
      vicenta: [
        'Reconoce que no paga.',
        impugnacionById['qrt-imp-2']?.descripcion ?? '',
      ].filter(Boolean),
      respuesta: [
        'Ofrecimiento de regularización sin reconocimiento; el núcleo de oposición es pago/liquidación (556). El email refuerza buena fe (CC 7, LEC 247).',
        'Este bloque se mantiene en contexto/costas/credibilidad, sin desplazar el examen tasado del saldo efectivamente debido.',
      ],
    },
    tags: ['contexto', 'cronologia', 'buena-fe'],
  },
];
