// Audiencia Previa - Alegaciones y Hechos Controvertidos
// Procedimiento Ordinario 715/2024 - Picassent

export interface Alegacion {
  id: number;
  titulo: string;
  contenido: string;
  fundamentoLegal?: string;
  notas?: string;
}

export interface HechoControvertido {
  id: number;
  titulo: string;
  descripcion: string;
  tipoPrueba: 'documental' | 'pericial' | 'testifical' | 'interrogatorio';
  estado: 'pendiente' | 'propuesto' | 'admitido';
  notas?: string;
}

export const alegacionesComplementarias: Alegacion[] = [
  {
    id: 1,
    titulo: 'Objeto del litigio y posición procesal',
    contenido: 'Esta parte se muestra conforme con la división de cosa común de los inmuebles litigiosos, y se opone a la pretensión de reembolso/reintegro formulada por la actora en cuanto no se acredite con liquidación íntegra, trazabilidad bancaria y depuración contable completa.',
    fundamentoLegal: 'Art. 400 CC - División de cosa común',
  },
  {
    id: 2,
    titulo: 'Préstamo y garantía hipotecaria',
    contenido: 'Se distingue entre la obligación personal derivada del préstamo (deudores frente a la entidad) y la garantía real (hipoteca). La pretensión no puede construirse como pago de deuda ajena sin fijar previamente la condición obligacional de cada parte en el contrato y en su subrogación posterior.',
    fundamentoLegal: 'Art. 1822 CC - Fianza / Art. 104 LH - Hipoteca',
  },
  {
    id: 3,
    titulo: 'Condición de la actora en el contrato',
    contenido: 'Resulta controvertida y debe precisarse la condición de la actora en el préstamo y en la subrogación (prestataria/deudora solidaria, fiadora u otra), pues de ello depende el alcance de cualquier repetición: en su caso, solo por pagos en exceso y no por el total de cuotas.',
    fundamentoLegal: 'Art. 1145 CC - Solidaridad / Art. 1838 CC - Acción de reembolso',
  },
  {
    id: 4,
    titulo: 'Destino del préstamo de 310.000 EUR',
    contenido: 'Debe determinarse el destino real del capital: adquisición de parcelas y construcción del chalet, frente a la tesis de financiación de un bien privativo. La calificación del destino condiciona la causalidad del supuesto crédito de reembolso.',
    fundamentoLegal: 'Art. 1347 CC - Bienes gananciales',
  },
  {
    id: 5,
    titulo: 'Cuentas comunes y fondos mixtos',
    contenido: 'La tesis de que las cuentas se nutrían exclusivamente de nómina/pensión de la actora se discute. Se interesa depurar si existieron ingresos relevantes ajenos a nómina/pensión (ingresos extraordinarios, transferencias, operaciones patrimoniales y/o ingresos agrarios), lo que impide atribuir pagos como si fueran realizados con capital privativo sin una depuración completa.',
    fundamentoLegal: 'Art. 1361 CC - Presunción de ganancialidad',
  },
  {
    id: 6,
    titulo: 'Depuración contable integral',
    contenido: 'Se interesa depuración completa de ingresos, gastos, disposiciones y transferencias entre cuentas, con identificación de ordenante y cuenta de cargo en cada apunte relevante. La selección parcial de movimientos no permite fijar un saldo a favor con rigor.',
    fundamentoLegal: 'Art. 217 LEC - Carga de la prueba',
  },
  {
    id: 7,
    titulo: 'Movimientos de septiembre 2022 (32.000€ y 38.500€)',
    contenido: 'Se controvierte el tratamiento aislado de disposiciones puntuales sin encuadre en el saldo global de las cuentas comunes. Se sostiene que dichos movimientos pueden responder a un ajuste provisional de liquidez y saldos entre las partes en un contexto de ruptura, lo que exige analizar su finalidad y su impacto en cualquier pretendido crédito de reembolso.',
  },
  {
    id: 8,
    titulo: 'Origen del ingreso de 32.000€ (venta Arturo Piera)',
    contenido: 'La actora atribuye el origen del ingreso de 32.000€ a la venta del inmueble de Arturo Piera. Para fijar la naturaleza del importe (y su eventual carácter privativo) resulta necesario depurar la titularidad y amortización del préstamo de adquisición del inmueble, así como la existencia de reformas o inversiones y quién las financió.',
  },
  {
    id: 9,
    titulo: 'Liquidación del pasivo antes del reparto del activo',
    contenido: 'Se expone que la división del activo sin considerar el pasivo vivo asociado al proyecto patrimonial común genera un reparto parcial. Se plantea que, en caso de venta/realización, se contemple la cancelación o cobertura preferente del pasivo y, en su caso, la consignación del precio para atenderlo antes del reparto.',
    fundamentoLegal: 'Art. 1404 CC - Liquidación de gananciales',
  },
  {
    id: 10,
    titulo: 'Posible exceso reclamatorio por doble cómputo',
    contenido: 'Se controvierte la acumulación de partidas que pueden producir doble imputación: reclamación de conceptos vinculados a principal/cancelaciones y, simultáneamente, reclamación de cuotas como si fueran íntegramente repetibles, sin cuantificar solapamientos ni depurar la amortización de principal ya computada.',
  },
  {
    id: 11,
    titulo: 'Maquinaria agrícola: naturaleza e ingresos',
    contenido: 'En cuanto a la maquinaria agrícola, se interesa fijar si su adquisición responde a un gasto necesario para la explotación agrícola y si fue financiada con ingresos de dicha explotación. Asimismo, se controvierte la reclamación aislada del gasto sin depurar los beneficios obtenidos y percibidos por cada parte.',
    fundamentoLegal: 'Art. 1347.5 CC - Frutos y ganancias',
  },
  {
    id: 12,
    titulo: 'Delimitación temporal y pagos post-separación',
    contenido: 'Se fija como relevante la cronología (matrimonio en 09/08/2013; separación de hecho en agosto 2022) y la razón de los pagos posteriores: si fueron realizados por obligación propia frente a la entidad y si existió reclamación fehaciente o reserva del derecho de repetición en esas fechas.',
    fundamentoLegal: 'Art. 1964.2 CC - Prescripción',
  },
];

export const hechosControvertidos: HechoControvertido[] = [
  {
    id: 1,
    titulo: 'Cuantía exacta reclamada',
    descripcion: 'Determinar la cuantía exacta objeto de pretensión, ante posibles discordancias entre importe global, desglose por partidas y formulación del suplico.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 2,
    titulo: 'Condición obligacional en el préstamo',
    descripcion: 'Determinar si ambos litigantes figuran como prestatarios/deudores solidarios (o en qué condición) en el préstamo de 22/08/2006 y en la subrogación de 18/09/2009, así como la entidad acreedora actual y el saldo vivo en el período relevante.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 3,
    titulo: 'Destino del capital del préstamo',
    descripcion: 'Determinar si el capital se destinó principalmente a compra de parcelas y construcción del chalet (y deudas vinculadas) o a otras finalidades, y su cuantificación por tramos/partidas en la medida de lo posible.',
    tipoPrueba: 'pericial',
    estado: 'pendiente',
  },
  {
    id: 4,
    titulo: 'Naturaleza de las cuentas e ingresos extraordinarios',
    descripcion: 'Determinar si las cuentas utilizadas para pagos se nutrieron exclusivamente de nómina/pensión de la actora o si existieron ingresos relevantes ajenos a tales conceptos (ingresos extraordinarios, operaciones patrimoniales, ingresos agrarios u otros).',
    tipoPrueba: 'pericial',
    estado: 'propuesto',
  },
  {
    id: 5,
    titulo: 'Ordenante real de transferencias 2019-2022',
    descripcion: 'Determinar quién fue el ordenante material de transferencias y movimientos entre cuentas vinculados a cuotas y pagos 2019-2022, y si la atribución de tales pagos a una sola parte es correcta.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 6,
    titulo: 'Integridad de documentos bancarios 2019-2022',
    descripcion: 'Determinar si las capturas aportadas por la actora son completas e íntegras (sin recortes/ediciones) y si permiten identificar ordenante, cuenta de cargo, concepto y trazabilidad, o si resultan parciales/sesgadas.',
    tipoPrueba: 'pericial',
    estado: 'propuesto',
  },
  {
    id: 7,
    titulo: 'Disposiciones sept. 2022: origen y destino',
    descripcion: 'Determinar la efectividad de las disposiciones de 32.000€ y 38.500€, su origen (cuenta de procedencia), destino (cuenta receptora) y concepto, y su encaje en el saldo global de cuentas comunes.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 8,
    titulo: 'Disposiciones sept. 2022: finalidad económica',
    descripcion: 'Determinar si los movimientos de 32.000€ y 38.500€ responden a un ajuste provisional de liquidez/saldos entre las partes en el contexto de ruptura, y si fueron considerados o aceptados por ambas partes como distribución parcial de fondos comunes.',
    tipoPrueba: 'interrogatorio',
    estado: 'pendiente',
  },
  {
    id: 9,
    titulo: 'Piso Arturo Piera: préstamo de adquisición',
    descripcion: 'Determinar si el préstamo con el que se adquirió el inmueble era de titularidad exclusiva de la actora o de titularidad conjunta, y cómo se amortizó (cuotas/cancelación) y con qué fondos.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 10,
    titulo: 'Piso Arturo Piera: reformas e inversiones',
    descripcion: 'Determinar si el inmueble, en el momento de su adquisición, se encontraba habitable sin necesidad de obras o si requirió reforma/rehabilitación y, en su caso, quién la acometió y financió.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 11,
    titulo: 'IBI 2013-2019: pago efectivo y ordenante',
    descripcion: 'Determinar si, para los ejercicios 2013-2019, existe justificante de pago (cargo identificable) y quién figura como ordenante/medio de pago, pues la mera aportación del recibo no acredita el abono.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 12,
    titulo: 'Pagos post-separación: causa y reserva',
    descripcion: 'Determinar si tras la separación de hecho (agosto 2022) la actora continuó abonando cuotas hasta octubre 2023 por obligación propia frente a la entidad, y si efectuó reclamación fehaciente o reserva del derecho de repetición.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 13,
    titulo: 'Cumplimiento del 50% desde octubre 2023',
    descripcion: 'Determinar si la actora cesó el pago de su 50% a partir de octubre 2023 y cuantificar el importe asumido unilateralmente por el demandado desde entonces.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 14,
    titulo: 'Doble imputación de conceptos',
    descripcion: 'Determinar si las partidas reclamadas incluyen solapamientos (p.ej. cómputo de principal/cancelación y, simultáneamente, cuotas que incorporan amortización del mismo principal) y cuantificar el eventual exceso.',
    tipoPrueba: 'pericial',
    estado: 'pendiente',
  },
  {
    id: 15,
    titulo: 'Maquinaria agrícola: adquisición y financiación',
    descripcion: 'Determinar la existencia y adquisición de la maquinaria agrícola reclamada, su necesidad/utilidad para la explotación, y su financiación (si se realizó con ingresos de la explotación o con fondos comunes/privativos).',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 16,
    titulo: 'Explotación agrícola: ingresos percibidos',
    descripcion: 'Determinar si la actora percibió ingresos o beneficios de la explotación agrícola (rendimientos, ventas de cosecha, reparto de beneficios u otros) en el período relevante, y su cuantificación.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
  {
    id: 17,
    titulo: 'Muebles y enseres de Lope de Vega',
    descripcion: 'Determinar la existencia y contenido del pacto previo (convenio/sentencia) sobre devolución/entrega de muebles y enseres de la vivienda de Lope de Vega, el inventario mínimo afectado y el estado de cumplimiento.',
    tipoPrueba: 'documental',
    estado: 'pendiente',
  },
  {
    id: 18,
    titulo: 'Prescripción: actos interruptivos',
    descripcion: 'Determinar si existieron actos interruptivos de la prescripción (reclamaciones fehacientes, reconocimiento de deuda u otros) respecto de las partidas anteriores al plazo legal aplicable.',
    tipoPrueba: 'documental',
    estado: 'propuesto',
  },
];

// Resumen para el panel de control
export const resumenAudiencia = {
  fecha: '2026-01-20',
  hora: '10:00',
  sala: 'Sala de Vistas 2',
  juzgado: 'Juzgado de Primera Instancia nº 4 de Picassent',
  totalAlegaciones: alegacionesComplementarias.length,
  totalHechosControvertidos: hechosControvertidos.length,
  hechosPendientes: hechosControvertidos.filter(h => h.estado === 'pendiente').length,
  hechosPropuestos: hechosControvertidos.filter(h => h.estado === 'propuesto').length,
};
