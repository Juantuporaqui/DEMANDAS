// ============================================
// DATOS COMPLETOS MISLATA - J.V. 1185/2025
// Archivo: /src/data/mislata/index.ts
// ============================================

import type { RefutacionItem } from '../escenarios/types';
import { normalizeDate } from '../../utils/dates';

const fechaContestacion = normalizeDate('2025-12-XX');
const fechaRecursoReposicion = normalizeDate('2025-12-XX');
const fechaIngresoOct2023 = normalizeDate('2023-10-XX');
const fechaRetiro2024 = normalizeDate('2024-XX-XX');

// ====================
// PROCEDIMIENTO
// ====================
export const procedimientoMislata = {
  id: 'mislata-1185-2025',
  nombre: 'Juicio Verbal 1185/2025 - Reclamación cuotas hipotecarias',
  juzgado: 'Sección Civil y de Instrucción del Tribunal de Instancia de Mislata. Plaza Nº 3',
  autos: '1185/2025',
  tipo: 'verbal' as const,
  rol: 'DEMANDANTE' as const,
  estado: 'Contestación presentada - Pendiente resolución recurso reposición',

  // Partes
  demandante: 'Juan Rodríguez Crespo',
  demandada: 'Vicenta Jiménez Vera',
  procuradorPropio: 'Rosa Calvo Barber (320 ICPV)',
  letradoPropio: 'Óscar Javier Benita Godoy (11365 ICAV)',
  procuradorContrario: 'Isabel Luzzy Aguilar',
  letradoContrario: 'Mª Auxiliadora Gómez Martín (10.175 ICAV)',

  // Cuantías
  cuantiaReclamada: 711998, // céntimos = 7.119,98 €

  // Fechas clave
  fechaDemanda: '2025-09-24',
  fechaAdmision: '2025-11-19',
  fechaContestacion: fechaContestacion.date,
  fechaContestacionApprox: fechaContestacion.approx,
  fechaContestacionNota: fechaContestacion.label,
  fechaRecursoReposicion: fechaRecursoReposicion.date,
  fechaRecursoReposicionApprox: fechaRecursoReposicion.approx,
  fechaRecursoReposicionNota: fechaRecursoReposicion.label,
  fechaImpugnacionRecurso: '2025-12-19',

  // Procedimiento vinculado
  vinculadoA: 'picassent-715-2024',
  relacionConPicassent: 'Mislata reclama cuotas POSTERIORES (oct 2023 - jun 2025). Picassent reclama cuotas ANTERIORES (2009-2023).',

  // Objetivo
  objetivoInmediato: 'Desestimar litispendencia/prejudicialidad alegada por Vicenta y obtener condena al pago del 50% de cuotas',

  tags: ['hipoteca', 'cuotas', 'solidaridad', 'regreso', 'art-1145-CC'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

// ====================
// DESGLOSE ECONÓMICO
// ====================
export const desgloseMislata = {
  // Periodo reclamado
  periodoDesde: '2023-08-01',
  periodoHasta: '2025-06-30',

  // Deuda común total
  pagosPrestamo: 1426824, // 14.268,24 €
  comisionesBancarias: 16903, // 169,03 €
  gastosComunes: 12311, // 123,11 € (agua, diputación - NO se reclaman)
  totalDeudaComun: 1456981, // 14.569,81 €

  // Obligación por titular (50%)
  obligacion50: 728490, // 7.284,90 €

  // Aportaciones reales
  aportacionJuan: 1440488, // 14.404,88 €
  aportacionVicenta: 115905, // 1.159,05 € (2248 ingresados - 1088,95 retirados)

  // Cálculo exceso
  excesoJuan: 711998, // 7.119,98 € = Aportación Juan - Obligación 50%

  // Detalle aportaciones Vicenta
  ingresosVicenta: [
    { fecha: fechaIngresoOct2023.date, approx: fechaIngresoOct2023.approx, notaFecha: fechaIngresoOct2023.label, importe: 56200, concepto: 'Ingreso cuota' },
    { fecha: fechaIngresoOct2023.date, approx: fechaIngresoOct2023.approx, notaFecha: fechaIngresoOct2023.label, importe: 56200, concepto: 'Ingreso cuota' },
    { fecha: fechaIngresoOct2023.date, approx: fechaIngresoOct2023.approx, notaFecha: fechaIngresoOct2023.label, importe: 56200, concepto: 'Ingreso cuota' },
    { fecha: fechaIngresoOct2023.date, approx: fechaIngresoOct2023.approx, notaFecha: fechaIngresoOct2023.label, importe: 56200, concepto: 'Ingreso cuota' },
  ],
  retirosVicenta: [
    { fecha: fechaRetiro2024.date, approx: fechaRetiro2024.approx, notaFecha: fechaRetiro2024.label, importe: 65000, concepto: 'Retirada cajero' },
    { fecha: fechaRetiro2024.date, approx: fechaRetiro2024.approx, notaFecha: fechaRetiro2024.label, importe: 25695, concepto: 'Retirada' },
    { fecha: fechaRetiro2024.date, approx: fechaRetiro2024.approx, notaFecha: fechaRetiro2024.label, importe: 18200, concepto: 'Retirada' },
  ],
};

// ====================
// ARGUMENTOS DE LA CONTESTACIÓN (VICENTA)
// ====================
export type EstadoArgumento = 'peligroso' | 'rebatible' | 'debil';

export interface ArgumentoContrario {
  id: number;
  titulo: string;
  argumentoVicenta: string;
  articulosInvocados: string[];
  nuestraReplica: string;
  jurisprudenciaAFavor: string[];
  estado: EstadoArgumento;
  prioridad: number;
}

export const argumentosContestacion: ArgumentoContrario[] = [
  {
    id: 1,
    titulo: 'LITISPENDENCIA (Art. 421 LEC)',
    argumentoVicenta: `Existe procedimiento ordinario previo (Picassent 715/2024) con identidad de partes, objeto y causa. El objeto del verbal (cuotas hipoteca) ya se debate en el ordinario (reembolso cuotas hipoteca). Pide sobreseimiento o suspensión.`,
    articulosInvocados: ['art. 421 LEC', 'art. 222 LEC', 'art. 410 LEC'],
    nuestraReplica: `NO hay litispendencia:
1) OBJETO DISTINTO: Picassent = división cosa común + reembolso cuotas 2009-2023. Mislata = regreso cuotas 2023-2025.
2) CUOTAS DIFERENTES: Las de Mislata son POSTERIORES, no habían vencido cuando se interpuso Picassent.
3) CAUSA DIFERENTE: Picassent = art. 393/1438 CC (liberalidad). Mislata = art. 1145 CC (solidaridad).
4) La STS 140/2012 exige "identidad TOTAL" para litispendencia.`,
    jurisprudenciaAFavor: [
      'STS 140/2012: "La litispendencia exige identidad subjetiva, objetiva y causal"',
      'STS 706/2007: "Identidad de sujetos, objeto y causa de pedir"',
    ],
    estado: 'rebatible',
    prioridad: 1,
  },
  {
    id: 2,
    titulo: 'PREJUDICIALIDAD CIVIL (Art. 43 LEC)',
    argumentoVicenta: `La cuestión litigiosa depende de la resolución de Picassent. El saldo definitivo entre las partes se determinará allí. Pide suspensión hasta sentencia firme de Picassent.`,
    articulosInvocados: ['art. 43 LEC'],
    nuestraReplica: `NO procede suspensión:
1) El art. 43 LEC es FACULTATIVO ("podrá"), no obligatorio.
2) La prejudicialidad exige que la cuestión sea "objeto PRINCIPAL" del otro proceso. En Picassent el objeto principal es la DIVISIÓN DE COSA COMÚN, no las cuotas.
3) Las cuotas de Mislata son LÍQUIDAS y EXIGIBLES por sí mismas (art. 1145 CC).
4) No necesitamos esperar a Picassent para saber que ella dejó de pagar desde octubre 2023.`,
    jurisprudenciaAFavor: [
      'Art. 43 LEC: "el tribunal PODRÁ... suspender" (facultativo)',
    ],
    estado: 'rebatible',
    prioridad: 2,
  },
  {
    id: 3,
    titulo: 'FALTA DE LEGITIMACIÓN ACTIVA',
    argumentoVicenta: `Juan carece de crédito líquido, vencido y exigible. La cuantía forma parte de una relación económica integral sometida a Picassent. Hasta que no se determine si Juan es acreedor o deudor neto, no puede afirmarse derecho de crédito.`,
    articulosInvocados: ['Doctrina legitimación TS'],
    nuestraReplica: `FALSO:
1) La obligación de pagar el 50% es CONTRACTUAL (préstamo hipotecario solidario).
2) Los extractos bancarios prueban que Juan pagó el 100% desde oct 2023.
3) El crédito es LÍQUIDO (7.119,98 €), VENCIDO (cuotas mensuales) y EXIGIBLE (art. 1145 CC).
4) La acción de regreso es AUTÓNOMA, no depende de liquidación global.`,
    jurisprudenciaAFavor: [
      'SAP Valencia 30.12.2014: "las cuotas pagadas generan un crédito con derecho al cobro de la mitad"',
      'SAP A Coruña 14.10.2013: "acción de regreso del deudor solidario"',
    ],
    estado: 'debil',
    prioridad: 3,
  },
  {
    id: 4,
    titulo: 'INEXISTENCIA DE DEUDA (Convenio divorcio)',
    argumentoVicenta: `El punto 5º del convenio de divorcio establece que "todos los gastos de la vivienda serían asumidos en exclusiva por Juan". Los gastos de hipoteca son gastos de vivienda.`,
    articulosInvocados: ['Sentencia divorcio 362/2023'],
    nuestraReplica: `FALSO:
1) El convenio habla de "GASTOS de la vivienda" (IBI, comunidad, suministros).
2) La HIPOTECA no es un "gasto", es una DEUDA SOLIDARIA contraída por ambos.
3) Ella FIRMÓ como deudora en la escritura. Su obligación es contractual, no convencional.
4) Si quisieron incluir la hipoteca, debieron pactarlo expresamente.`,
    jurisprudenciaAFavor: [],
    estado: 'debil',
    prioridad: 4,
  },
  {
    id: 5,
    titulo: 'COMPENSACIÓN DE CRÉDITOS',
    argumentoVicenta: `Vicenta tiene derecho de reembolso de 122.282,28 € por cuotas pagadas (2009-2023) según Picassent. Este crédito compensa y supera lo que Juan reclama.`,
    articulosInvocados: ['art. 1196 CC'],
    nuestraReplica: `NO cabe compensación (art. 1196 CC):
1) Su supuesto crédito NO ES LÍQUIDO (está en disputa en Picassent).
2) NO ES EXIGIBLE (está prescrito en su mayoría: hechos de 2006-2019).
3) NO ES VENCIDO (pendiente de sentencia).
4) La compensación requiere deudas "líquidas y exigibles" (art. 1196.4º CC).
5) No puede compensar un crédito CIERTO con uno DISPUTADO.`,
    jurisprudenciaAFavor: [
      'Art. 1196 CC: "Que las dos deudas estén vencidas. Que sean líquidas y exigibles."',
    ],
    estado: 'debil',
    prioridad: 5,
  },
  {
    id: 6,
    titulo: 'FALTA DE ACREDITACIÓN DE CUOTAS',
    argumentoVicenta: `Juan no acredita fehacientemente las cuotas que dice haber abonado. No aporta documento bancario que permita verificar qué cuotas pagó, en qué fechas, desde qué cuenta.`,
    articulosInvocados: ['art. 217 LEC'],
    nuestraReplica: `TOTALMENTE FALSO:
1) Se aportó Doc. 3: extractos bancarios de la cuenta común.
2) Se identifican TODAS las aportaciones de Juan con fecha, importe y concepto.
3) Se identifican TODAS las aportaciones de Vicenta (solo 1.159,05 € netos).
4) Se solicitó oficio a CaixaBank para aportar comunicaciones de impago.`,
    jurisprudenciaAFavor: [],
    estado: 'debil',
    prioridad: 6,
  },
];

export const matrizRefutacion: RefutacionItem[] = argumentosContestacion.map((argumento) => ({
  alegacion: argumento.argumentoVicenta,
  prueba: argumento.nuestraReplica,
  documentTitle: 'Extracto',
}));

// ====================
// NUESTROS ARGUMENTOS PRINCIPALES
// ====================
export const nuestrosArgumentos = [
  {
    id: 1,
    titulo: 'SOLIDARIDAD CONTRACTUAL',
    fundamento: 'Art. 1145 CC',
    texto: 'Ambos firmaron como deudores solidarios del préstamo hipotecario. El deudor solidario que paga tiene acción de regreso contra el codeudor por su parte.',
    cita: '"El que paga por cuenta de otro puede repetir contra el deudor lo que hubiere satisfecho" (art. 1158 CC)',
  },
  {
    id: 2,
    titulo: 'CUOTAS LÍQUIDAS Y EXIGIBLES',
    fundamento: 'Art. 1145.2 CC',
    texto: 'Las cuotas hipotecarias son deuda líquida (importe determinado), vencida (cuotas mensuales) y exigible (obligación contractual).',
    cita: 'SAP Valencia 30.12.2014: "generan un crédito con derecho al cobro de la mitad"',
  },
  {
    id: 3,
    titulo: 'CESE UNILATERAL DE PAGO',
    fundamento: 'Art. 1091 CC',
    texto: 'Vicenta dejó de pagar unilateralmente desde agosto 2023. Las obligaciones contractuales tienen fuerza de ley y deben cumplirse.',
    cita: '"Las obligaciones que nacen de los contratos tienen fuerza de ley entre las partes"',
  },
  {
    id: 4,
    titulo: 'NO HAY LITISPENDENCIA',
    fundamento: 'STS 140/2012',
    texto: 'Falta identidad objetiva: Picassent = división + reembolso 2009-2023. Mislata = regreso 2023-2025. Cuotas distintas, periodos distintos, fundamento distinto.',
    cita: '"La litispendencia exige identidad subjetiva, objetiva Y causal"',
  },
];

// ====================
// FRASES CLAVE PARA VISTA
// ====================
export const frasesClaveVista = [
  {
    contexto: 'Contra litispendencia',
    frase: '"Señoría, las cuotas que reclamo son POSTERIORES a la demanda de Picassent. No pueden estar allí porque no habían vencido."',
  },
  {
    contexto: 'Contra prejudicialidad',
    frase: '"El art. 43 LEC dice \'podrá\', no \'deberá\'. La suspensión es facultativa. Y mi crédito es líquido: 7.119,98 €."',
  },
  {
    contexto: 'Sobre solidaridad',
    frase: '"Ella firmó como deudora solidaria. El art. 1145 me da derecho a reclamarle su mitad. Es una obligación contractual, no negociable."',
  },
  {
    contexto: 'Sobre convenio divorcio',
    frase: '"El convenio habla de gastos de vivienda: IBI, luz, agua. La hipoteca es una DEUDA que ambos contrajimos. No es lo mismo."',
  },
  {
    contexto: 'Sobre compensación',
    frase: '"No puede compensar con un crédito que está en disputa, prescrito en su mayoría, y pendiente de sentencia. Art. 1196: deudas líquidas y exigibles."',
  },
];

// ====================
// CHECKLIST PARA VISTA
// ====================
export const checklistVista = [
  { id: 1, texto: 'Rebatir litispendencia: cuotas POSTERIORES', hecho: false },
  { id: 2, texto: 'Rebatir prejudicialidad: art. 43 es facultativo', hecho: false },
  { id: 3, texto: 'Invocar art. 1145 CC: solidaridad', hecho: false },
  { id: 4, texto: 'Distinguir convenio (gastos) de hipoteca (deuda)', hecho: false },
  { id: 5, texto: 'Rebatir compensación: no es líquida ni exigible', hecho: false },
  { id: 6, texto: 'Citar SAP Valencia 30.12.2014', hecho: false },
  { id: 7, texto: 'Recordar: ella dejó de pagar desde agosto 2023', hecho: false },
];
