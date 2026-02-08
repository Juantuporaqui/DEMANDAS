// ============================================
// DATOS CASO QUART - ETJ 1428/2025 + OPOSICIÓN 1428.1/2025
// Ejecución de títulos judiciales - Cuenta hijos
// ============================================

import type { RefutacionItem } from '../escenarios/types';

export interface ProcedimientoQuart {
  caseId: string;
  titulo: string;
  juzgado: string;
  nig: string;
  materia: string;
  procedimientoOrigen: {
    tipo: string;
    numero: string;
    sentencia: string;
    fechaSentencia: string;
    juez: string;
  };
  ejecucion: {
    numero: string;
    autoDespacho: string;
    notificacionEjecutado: string;
  };
  piezaOposicion: {
    numero: string;
    providenciaVista: string;
    fechaVista: string;
    horaVista: string;
  };
  estado: string;
  tags: string[];
}

export interface ParteProcesal {
  nombre: string;
  nif?: string;
  rol: string;
  procurador: string;
  letrado: string;
  domicilioProcesal?: string;
}

export interface ReclamacionEjecutante {
  conceptoPrincipal: string;
  importePrincipalCents: number;
  fundamentoConvenio: string;
  mesesReclamados: string[];
  solicitudes: string[];
  fuente: string;
}

export interface ArgumentoOposicion {
  id: string;
  codigo: string;
  titulo: string;
  descripcion: string;
  fundamentoLegal: string[];
  cifras?: Record<string, number>;
  fuente: string;
  riesgo: 'bajo' | 'medio' | 'alto';
}

export interface DisputaEntrepartes {
  tema: string;
  posicionEjecutado: string;
  posicionEjecutante: string;
  fuentes: string[];
}

export interface DesgloseCifras {
  reclamadoPorEjecutante: number;
  usoIndebidoAlegadoCents: number;
  deficitAlegadoCents: number;
  saldoNetoAFavorJuanCents: number;
  pagosDirectosAlegadosCents: number;
  saldoCuentaAlInterponer: number;
}

// ============================================
// PROCEDIMIENTO
// ============================================

export const procedimientoQuart: ProcedimientoQuart = {
  caseId: 'quart-etj-1428-2025',
  titulo: 'ETJ 1428/2025 · Ejecución Cuenta Hijos',
  juzgado: 'Juzgado de Primera Instancia nº 1 de Quart de Poblet',
  nig: '4610241120230002538',
  materia: 'Derecho de familia: otras cuestiones',
  procedimientoOrigen: {
    tipo: 'divorcio_contencioso',
    numero: '000892/2023',
    sentencia: '362/2023',
    fechaSentencia: '2023-10-17',
    juez: 'Sandra Lozano López',
  },
  ejecucion: {
    numero: '1428/2025',
    autoDespacho: '2025-10-30',
    notificacionEjecutado: '2025-11-06',
  },
  piezaOposicion: {
    numero: '1428.1/2025',
    providenciaVista: '2026-01-14',
    fechaVista: '2026-04-23',
    horaVista: '09:30',
  },
  estado: 'Vista señalada 23/04/2026',
  tags: ['ejecucion', 'familia', 'cuenta-hijos', 'oposicion', 'vista'],
};

// ============================================
// PARTES PROCESALES
// ============================================

export const partesQuart: { ejecutante: ParteProcesal; ejecutado: ParteProcesal } = {
  ejecutante: {
    nombre: 'Vicenta Jiménez Vera',
    rol: 'ejecutante',
    procurador: 'Isabel Luzzy Aguilar',
    letrado: 'María Auxiliadora Gómez Martín',
  },
  ejecutado: {
    nombre: 'Juan Rodríguez Crespo',
    nif: '48.380.305-N',
    rol: 'ejecutado / demandante oposición',
    procurador: 'María Rosa Calvo Barber',
    letrado: 'Óscar Javier Benita Godoy',
  },
};

// Profesionales en procedimiento de divorcio original (diferentes)
export const profesionalesDivorcio = {
  juan: {
    abogada: 'Victoria González Gumiel',
    procuradora: 'Begoña Molla Sanchis',
  },
  vicenta: {
    abogada: 'María Auxiliadora Gómez Martín',
    procuradora: 'Isabel Luzzy Aguilar',
  },
};

// ============================================
// RECLAMACIÓN DE LA EJECUTANTE
// ============================================

export const reclamacionVicenta: ReclamacionEjecutante = {
  conceptoPrincipal: '12 mensualidades x 200€ cuenta común hijos',
  importePrincipalCents: 240000, // 2.400€
  fundamentoConvenio:
    'Cláusula "Alimentos y gastos hijos": ambos deben ingresar 200€/mes en cuenta común del 1 al 5 de cada mes',
  mesesReclamados: [
    '2024-04',
    '2024-05',
    '2024-06',
    '2024-07',
    '2024-09',
    '2024-10',
    '2025-04',
    '2025-05',
    '2025-06',
    '2025-07',
    '2025-08',
    '2025-09',
  ],
  solicitudes: [
    'Despacho ejecución por 2.400€ + intereses + costas',
    'Requerimiento para pagar 200€/mes del 1 al 5 de cada mes',
    'Embargo CNP salario',
    'PNJ info patrimonial',
    'Embargo cuentas y devoluciones tributarias',
    'Multas coercitivas art. 776.1 LEC',
  ],
  fuente: 'demanda_ejecucion.pdf',
};

// ============================================
// ARGUMENTOS DE OPOSICIÓN (JUAN)
// ============================================

export const argumentosOposicion: ArgumentoOposicion[] = [
  {
    id: 'qrt-op-1',
    codigo: '556.1_LEC_cumplimiento_pago',
    titulo: 'Cumplimiento / Pago parcial',
    descripcion:
      'Juan aportó 1.971,27€ hasta sept 2025. Tras el despacho, transfirió 200€ el 01/10, 06/10, 15/10 y 14/11/2025. Déficit real es 1.828,73€, no 2.400€.',
    fundamentoLegal: ['art. 556.1 LEC'],
    cifras: {
      obligacionHastaSept2025Cents: 420000,
      aportadoHastaSept2025Cents: 197127,
      deficitSept2025Cents: 222873,
      transferenciaOct2025Cents: 60000,
      obligacion22MesesCents: 440000,
      aportadoTotalCents: 257127,
      deficitFinalCents: 182873,
    },
    fuente: 'OPOSICION ETJ JRC.pdf',
    riesgo: 'bajo',
  },
  {
    id: 'qrt-op-2',
    codigo: 'compensacion_1195_1196_CC',
    titulo: 'Compensación de créditos',
    descripcion:
      'Vicenta retiró 2.710,61€ de la cuenta común para gastos no autorizados. Juan tiene crédito a su favor: 2.710,61€ - 1.828,73€ = 881,88€.',
    fundamentoLegal: ['art. 1195 CC', 'art. 1196 CC'],
    cifras: {
      usoIndebidoVicenta: 271061,
      deficitJuan: 182873,
      saldoFavorJuan: 88188,
    },
    fuente: 'OPOSICION ETJ JRC.pdf',
    riesgo: 'medio',
  },
  {
    id: 'qrt-op-3',
    codigo: 'pluspeticion',
    titulo: 'Pluspetición',
    descripcion:
      'Se reclaman 2.400€ cuando el déficit real es 1.828,73€. Además, Juan realizó pagos directos a los hijos por 1.895,65€.',
    fundamentoLegal: ['art. 558 LEC'],
    cifras: {
      reclamadoCents: 240000,
      deficitRealCents: 182873,
      pagosDirectosCents: 189565,
    },
    fuente: 'OPOSICION ETJ JRC.pdf',
    riesgo: 'bajo',
  },
  {
    id: 'qrt-op-4',
    codigo: 'domicilio_erroneo_155_156_LEC',
    titulo: 'Domicilio erróneo en demanda',
    descripcion:
      'En demanda figura C/ Isabel de Villena 2-5 Mislata como domicilio de Juan. Ese es el domicilio de Vicenta; Juan nunca residió allí.',
    fundamentoLegal: ['art. 155 LEC', 'art. 156 LEC'],
    fuente: 'OPOSICION ETJ JRC.pdf',
    riesgo: 'medio',
  },
  {
    id: 'qrt-op-5',
    codigo: 'abuso_derecho_7_2_CC_247_LEC',
    titulo: 'Abuso de derecho y mala fe',
    descripcion:
      'La cuenta tenía saldo de 1.005,42€ al interponer la demanda. Vicenta dejó de pagar hipoteca desde finales 2023 y retira fondos para gastos personales.',
    fundamentoLegal: ['art. 7.2 CC', 'art. 247 LEC'],
    cifras: {
      saldoCuentaAlDemandaCents: 100542,
    },
    fuente: 'OPOSICION ETJ JRC.pdf',
    riesgo: 'medio',
  },
  {
    id: 'qrt-op-6',
    codigo: 'naturaleza_no_alimenticia',
    titulo: 'No es pensión alimenticia clásica',
    descripcion:
      'El convenio establece que cada progenitor paga gastos ordinarios en su custodia. La cuenta común es un fondo finalista con reglas de consenso, no alimentos incondicionales.',
    fundamentoLegal: ['Interpretación convenio regulador'],
    fuente: 'OPOSICION ETJ JRC.pdf',
    riesgo: 'alto',
  },
];

// ============================================
// DESGLOSE USO INDEBIDO ALEGADO (POR JUAN)
// ============================================

export const desgloseUsoIndebido = {
  totalCents: 271061,
  categorias: [
    { concepto: 'Retiradas efectivo cajero', importeCents: 85000 },
    { concepto: 'Transferencias a cuenta Vicenta', importeCents: 64400 },
    { concepto: 'Perfumerías (Druni, etc.)', importeCents: 41580 },
    { concepto: 'Ropa (Zara, Mango, etc.)', importeCents: 32050 },
    { concepto: 'Recargas móvil', importeCents: 25000 },
    { concepto: 'Clínicas/tratamientos estéticos', importeCents: 18031 },
    { concepto: 'Otros gastos no justificados', importeCents: 5000 },
  ],
  fuente: 'OPOSICION ETJ JRC.pdf',
};

// ============================================
// PAGOS DIRECTOS ALEGADOS POR JUAN
// ============================================

export const pagosDirectosJuan = {
  totalCents: 189565,
  items: [
    { concepto: 'Ordenador hijo', importeCents: 37900 },
    { concepto: 'iPad', importeCents: 37500 },
    { concepto: 'Gimnasio hijos', importeCents: 21900 },
    { concepto: 'Móviles hijos (14€/mes x 22 meses)', importeCents: 30800 },
    { concepto: 'Farmacia/óptica', importeCents: 14200 },
    { concepto: 'Impresora + cartuchos', importeCents: 8594 },
    { concepto: 'Calzado y ropa', importeCents: 18299 },
    { concepto: 'Peluquería', importeCents: 1400 },
    { concepto: 'Dentista', importeCents: 2000 },
    { concepto: 'Pala pádel', importeCents: 5495 },
    { concepto: 'Billetes', importeCents: 2610 },
    { concepto: 'Funda dispositivo', importeCents: 810 },
    { concepto: 'Bata', importeCents: 2057 },
    { concepto: 'JD Sports', importeCents: 10000 },
  ],
  fuente: 'OPOSICION ETJ JRC.pdf',
};

// ============================================
// IMPUGNACIÓN DE VICENTA A LA OPOSICIÓN
// ============================================

export const argumentosImpugnacion = [
  {
    id: 'qrt-imp-1',
    titulo: 'Niega apropiación indebida',
    descripcion: 'Todos los movimientos son gastos de hijos y trazables.',
    fuente: 'Quart_impugnac oposic dda ejecución.pdf',
  },
  {
    id: 'qrt-imp-2',
    titulo: 'Reconocimiento de deuda por Juan',
    descripcion: 'En correo 01/10/2025, Juan reconoce la deuda y propone pagar 100€.',
    fuente: 'Quart_impugnac oposic dda ejecución.pdf',
  },
  {
    id: 'qrt-imp-3',
    titulo: 'Sí es alimentos (art. 142 CC)',
    descripcion:
      'La aportación de 200€/mes tiene finalidad alimenticia. Cita STS 55/2016, STS 656/2021, STS 866/2022.',
    jurisprudencia: ['STS 55/2016', 'STS 656/2021', 'STS 866/2022'],
    fuente: 'Quart_impugnac oposic dda ejecución.pdf',
  },
  {
    id: 'qrt-imp-4',
    titulo: 'Motivos tasados art. 556 LEC',
    descripcion: 'La oposición mezcla argumentos ajenos a los motivos tasados de oposición a ejecución.',
    fuente: 'Quart_impugnac oposic dda ejecución.pdf',
  },
  {
    id: 'qrt-imp-5',
    titulo: 'Justificación retiradas',
    descripcion:
      'Recargas = tarjetas prepago hijos. Druni = solo 14,99€ regalo amigo invisible. Ropa = para hijos en dos casas, consensuada. Transferencias = reintegros (teclado conservatorio 298€, vacuna papiloma 172,55€, etc.).',
    fuente: 'Quart_impugnac oposic dda ejecución.pdf',
  },
  {
    id: 'qrt-imp-6',
    titulo: 'Acusación contra Juan',
    descripcion:
      'Juan también hizo transferencias inmediatas a su favor desde la cuenta (20/01/2025 y otras). Lista de pagos directos serían regalos no acreditados.',
    fuente: 'Quart_impugnac oposic dda ejecución.pdf',
  },
];

// ============================================
// DISPUTAS ENTRE PARTES
// ============================================

export const disputasQuart: DisputaEntrepartes[] = [
  {
    tema: 'Naturaleza alimenticia de los 200€/mes',
    posicionEjecutado:
      'No es pensión alimenticia incondicional; es un fondo finalista y consensuado para gastos concretos de los hijos.',
    posicionEjecutante:
      'Sí es alimentos conforme al art. 142 CC; tiene finalidad alimenticia; STS 55/2016, 656/2021, 866/2022.',
    fuentes: ['OPOSICION ETJ JRC.pdf', 'Quart_impugnac oposic dda ejecución.pdf'],
  },
  {
    tema: 'Uso indebido de la cuenta común',
    posicionEjecutado:
      '2.710,61€ retirados para gastos no autorizados: efectivo, transferencias personales, perfumería, ropa, tratamientos estéticos.',
    posicionEjecutante:
      'Todo justificado y para hijos: recargas son tarjetas prepago hijos, transferencias son reintegros de gastos, ropa era para hijos.',
    fuentes: ['OPOSICION ETJ JRC.pdf', 'Quart_impugnac oposic dda ejecución.pdf'],
  },
  {
    tema: 'Pagos directos de Juan',
    posicionEjecutado:
      'Juan pagó directamente 1.895,65€ en beneficio de los hijos (ordenador, iPad, gimnasio, móviles, etc.).',
    posicionEjecutante: 'Muchos serían regalos voluntarios o no están acreditados ni consensuados.',
    fuentes: ['OPOSICION ETJ JRC.pdf', 'Quart_impugnac oposic dda ejecución.pdf'],
  },
];

// ============================================
// DESGLOSE DE CIFRAS
// ============================================

export const desgloseCifrasQuart: DesgloseCifras = {
  reclamadoPorEjecutante: 240000, // 2.400€
  usoIndebidoAlegadoCents: 271061, // 2.710,61€
  deficitAlegadoCents: 182873, // 1.828,73€
  saldoNetoAFavorJuanCents: 88188, // 881,88€
  pagosDirectosAlegadosCents: 189565, // 1.895,65€
  saldoCuentaAlInterponer: 100542, // 1.005,42€
};

// ============================================
// CUENTA COMÚN
// ============================================

export const cuentaComun = {
  iban: 'ES68 0073 0100 5908 1169 1110',
  banco: 'Openbank',
  certificadoExtracto: '2025-11-14',
  fuente: 'OPOSICION ETJ JRC.pdf',
};

// ============================================
// PUNTOS DÉBILES / RIESGOS (HONESTIDAD BRUTAL)
// ============================================

export const puntosDebiles = [
  {
    id: 'risk-1',
    titulo: 'Compensación en ejecución',
    descripcion:
      'Riesgo de que el juzgado considere la compensación improcedente en fase de ejecución si exige liquidez previa o pronunciamiento judicial previo.',
    riesgo: 'alto',
    pruebaMitigadora: 'Extractos bancarios certificados mostrando los cargos indebidos',
  },
  {
    id: 'risk-2',
    titulo: 'Discusión "alimentos" vs "fondo común"',
    descripcion:
      'La doctrina del TS (STS 55/2016, 656/2021, 866/2022) tiende a calificar como alimentos cualquier aportación con finalidad de sustento de hijos.',
    riesgo: 'alto',
    pruebaMitigadora: 'Literal del convenio que establece reglas de consenso y finalidad específica',
  },
  {
    id: 'risk-3',
    titulo: 'Pagos directos como regalos',
    descripcion:
      'El juzgado puede calificar los pagos directos (iPad, ordenador) como regalos voluntarios, no como cumplimiento de la obligación.',
    riesgo: 'medio',
    pruebaMitigadora: 'Tickets, facturas y comunicaciones previas mostrando que eran gastos necesarios acordados',
  },
  {
    id: 'risk-4',
    titulo: 'Domicilio erróneo sin indefensión real',
    descripcion:
      'Aunque el domicilio era incorrecto, Juan fue finalmente notificado y pudo oponerse. El juzgado puede entender que no hubo indefensión material.',
    riesgo: 'medio',
    pruebaMitigadora: 'Acreditar perjuicio concreto por el retraso en la notificación',
  },
  {
    id: 'risk-5',
    titulo: 'Email 01/10/2025 "reconocimiento deuda"',
    descripcion:
      'Vicenta alega que Juan reconoció la deuda en un email y propuso pagar 100€. Esto podría usarse en su contra.',
    riesgo: 'alto',
    pruebaMitigadora: 'Contexto completo del email mostrando que era una propuesta de acuerdo, no reconocimiento',
  },
];

// ============================================
// NORMATIVA Y JURISPRUDENCIA CITADA
// ============================================

export const normativaQuart = [
  { articulo: 'art. 556 LEC', tema: 'Motivos de oposición a ejecución' },
  { articulo: 'art. 558 LEC', tema: 'Pluspetición' },
  { articulo: 'art. 560 LEC', tema: 'Sustanciación de la oposición' },
  { articulo: 'art. 155-156 LEC', tema: 'Notificaciones y domicilio' },
  { articulo: 'art. 776.1 LEC', tema: 'Multas coercitivas familia' },
  { articulo: 'art. 7.2 CC', tema: 'Abuso de derecho' },
  { articulo: 'art. 247 LEC', tema: 'Mala fe procesal' },
  { articulo: 'art. 142 CC', tema: 'Concepto de alimentos' },
  { articulo: 'art. 151 CC', tema: 'Irrenunciabilidad alimentos' },
  { articulo: 'art. 1195-1196 CC', tema: 'Compensación de créditos' },
  { articulo: 'art. 1124 CC', tema: 'Resolución por incumplimiento' },
];

export const jurisprudenciaQuart = [
  {
    referencia: 'STS 55/2016',
    tema: 'Naturaleza alimenticia',
    citadoPor: 'Vicenta (impugnación)',
  },
  {
    referencia: 'STS 656/2021',
    tema: 'Finalidad alimenticia aportaciones hijos',
    citadoPor: 'Vicenta (impugnación)',
  },
  {
    referencia: 'STS 866/2022',
    tema: 'Alimentos y custodia compartida',
    citadoPor: 'Vicenta (impugnación)',
  },
  {
    referencia: 'SAP Valencia 142/2021 (rec. 657/2021)',
    tema: 'Compensación en ejecución',
    citadoPor: 'Juan (oposición)',
  },
];

// ============================================
// DOCUMENTOS DEL PROCEDIMIENTO
// ============================================

export const documentosQuart = [
  {
    id: 'doc-q-1',
    titulo: 'Demanda de ejecución',
    archivo: 'demanda_ejecucion.pdf',
    parte: 'Vicenta',
    fecha: null, // missing - fecha presentación no visible
    queAcredita: 'Reclamación de 2.400€ por impago 12 mensualidades',
  },
  {
    id: 'doc-q-2',
    titulo: 'Sentencia divorcio 362/2023',
    archivo: 'sentencia.pdf',
    parte: 'Juzgado',
    fecha: '2023-10-17',
    queAcredita: 'Título ejecutivo - Convenio regulador aprobado',
  },
  {
    id: 'doc-q-3',
    titulo: 'Escrito de oposición',
    archivo: 'OPOSICION ETJ JRC.pdf',
    parte: 'Juan',
    fecha: null, // missing
    queAcredita: 'Defensa: pluspetición, compensación, pagos directos',
  },
  {
    id: 'doc-q-4',
    titulo: 'Impugnación de la oposición',
    archivo: 'Quart_impugnac oposic dda ejecución.pdf',
    parte: 'Vicenta',
    fecha: null, // missing
    queAcredita: 'Réplica a la oposición, jurisprudencia TS',
  },
  {
    id: 'doc-q-5',
    titulo: 'Providencia señalando vista',
    archivo: 'Prov acuerda celebración de VISTA.pdf',
    parte: 'Juzgado',
    fecha: '2026-01-14',
    queAcredita: 'Vista señalada para 23/04/2026 a las 09:30',
  },
  {
    id: 'doc-q-6',
    titulo: 'Extracto certificado Openbank',
    archivo: null, // adjunto a oposición
    parte: 'Juan',
    fecha: '2025-11-14',
    queAcredita: 'Movimientos cuenta común y uso indebido alegado',
  },
  {
    id: 'doc-q-7',
    titulo: 'Email 10/04/2025 Juan',
    archivo: null, // doc 1 oposición
    parte: 'Juan',
    fecha: '2025-04-10',
    queAcredita: 'Aviso de que no ingresará más si hay retiradas injustificadas',
  },
];

// ============================================
// RECURSO CONTRA PROVIDENCIA
// ============================================

export const recursoProvidencia = {
  tipo: 'Reposición',
  plazo: '5 días',
  deposito: 2500, // 25€
  cuentaBancaria: 'ES55 0049 3569 9200 0500 1274',
  banco: 'Santander',
  codigo: '00-Reposición',
};

// ============================================
// PRÓXIMAS ACCIONES
// ============================================

export const proximasAcciones = [
  {
    id: 'next-1',
    titulo: 'Preparar prueba para vista',
    descripcion: 'Organizar extractos, tickets, emails y testigos si procede',
    fechaLimite: '2026-04-20',
    prioridad: 'critica',
  },
  {
    id: 'next-2',
    titulo: 'Guion de vista',
    descripcion: 'Preparar alegaciones orales, orden de argumentos, objeciones previstas',
    fechaLimite: '2026-04-22',
    prioridad: 'critica',
  },
  {
    id: 'next-3',
    titulo: 'Escenarios posibles',
    descripcion:
      'Si estiman íntegramente (pagar 2.400€ + costas), si desestiman (archivo), si estiman parcialmente (reducción importe)',
    fechaLimite: '2026-04-22',
    prioridad: 'alta',
  },
];

// ============================================
// CAMPOS MISSING (datos no visibles en documentos)
// ============================================

export const camposMissing = [
  'Fecha exacta presentación demanda ejecución',
  'Fecha presentación escrito oposición',
  'Fecha presentación impugnación',
  'Contenido literal completo cláusula 4ª convenio (escaneado)',
  'Listado completo gastos escolares incluidos en convenio',
  'Fechas exactas de cada retirada indebida alegada',
];

// ============================================
// FUNCIONES DE ACCESO
// ============================================

export function getArgumentosOposicionPorRiesgo(riesgo: 'bajo' | 'medio' | 'alto'): ArgumentoOposicion[] {
  return argumentosOposicion.filter((a) => a.riesgo === riesgo);
}

export function getArgumentosCriticos(): ArgumentoOposicion[] {
  return argumentosOposicion.filter((a) => a.riesgo === 'alto' || a.riesgo === 'medio');
}

export function buscarEnQuart(termino: string): string[] {
  const t = termino.toLowerCase();
  const resultados: string[] = [];

  argumentosOposicion.forEach((a) => {
    if (a.titulo.toLowerCase().includes(t) || a.descripcion.toLowerCase().includes(t)) {
      resultados.push(`Oposición: ${a.titulo}`);
    }
  });

  argumentosImpugnacion.forEach((a) => {
    if (a.titulo.toLowerCase().includes(t) || a.descripcion.toLowerCase().includes(t)) {
      resultados.push(`Impugnación: ${a.titulo}`);
    }
  });

  disputasQuart.forEach((d) => {
    if (d.tema.toLowerCase().includes(t)) {
      resultados.push(`Disputa: ${d.tema}`);
    }
  });

  return resultados;
}

export const matrizRefutacion: RefutacionItem[] = [
  {
    alegacion: 'La ejecución reclama 2.400€ por 12 mensualidades completas.',
    prueba:
      'Los extractos y el cuadro resumen acreditan que el déficit real es 1.828,73€ y que existen pagos directos adicionales.',
    documentTitle: 'Extracto',
  },
  {
    alegacion: 'No hay pagos suficientes tras el despacho.',
    prueba: 'Transferencias post-despacho y facturas de gastos de los hijos acreditan cumplimiento parcial.',
    documentTitle: 'transferencias',
  },
  {
    alegacion: 'No procede pluspetición ni reducción de cuantía.',
    prueba: 'Art. 558 LEC y tabla de déficit muestran exceso en la cuantía solicitada.',
    documentTitle: 'tabla',
  },
];

export { escenarios } from './escenarios';
