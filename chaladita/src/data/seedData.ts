// Seed Data para el sistema de litigio
// Contiene datos de ejemplo para Picassent, Quart y Mislata

import type {
  Procedimiento,
  EventoCronologia,
  Reclamacion,
  Hecho,
  Tarea,
  Estrategia,
  Documento,
  Jurisprudencia,
  LitigationState,
} from '../types';

// ============================================
// PROCEDIMIENTOS
// ============================================

export const seedProcedimientos: Procedimiento[] = [
  {
    id: 'picassent',
    titulo: 'P.O. 715/2024 - Liquidación Gananciales',
    juzgado: 'Juzgado 1ª Instancia nº3 Picassent',
    autos: '715/2024',
    tipo: 'ordinario',
    cuantia: 212677,
    estado: 'activo',
    fechaInicio: '2024-06-15',
    fechaUltimaActuacion: '2025-01-10',
    color: '#3b82f6',
    icon: 'Scale',
    descripcion: 'Procedimiento principal de liquidación de sociedad de gananciales. Demanda de Vicenta reclamando 212.677€.',
  },
  {
    id: 'quart',
    titulo: 'Ejecución 1428/2025 - Compensación',
    juzgado: 'Juzgado 1ª Instancia nº2 Quart de Poblet',
    autos: '1428/2025',
    tipo: 'ejecucion',
    cuantia: 2400,
    estado: 'activo',
    fechaInicio: '2025-01-05',
    color: '#f59e0b',
    icon: 'Gavel',
    descripcion: 'Ejecución de sentencia. Compensación por gastos exclusivos de hijos pagados por Juan.',
  },
  {
    id: 'mislata',
    titulo: 'Juicio Verbal 1185/2025 - Hipoteca',
    juzgado: 'Juzgado 1ª Instancia nº1 Mislata',
    autos: '1185/2025',
    tipo: 'verbal',
    cuantia: 6945,
    estado: 'activo',
    fechaInicio: '2025-02-01',
    color: '#10b981',
    icon: 'Home',
    descripcion: 'Reclamación de mitad de hipoteca pagada por Juan (2022-2024). Opción de litispendencia.',
  },
];

// ============================================
// CRONOLOGÍA
// ============================================

export const seedCronologia: EventoCronologia[] = [
  // Picassent
  {
    id: 'cron-1',
    procesoId: 'picassent',
    fecha: '2024-06-15',
    tipo: 'demanda',
    titulo: 'Presentación de demanda',
    descripcion: 'Vicenta presenta demanda de liquidación de gananciales',
    pasado: true,
    importancia: 'alta',
    completado: true,
  },
  {
    id: 'cron-2',
    procesoId: 'picassent',
    fecha: '2024-09-20',
    tipo: 'contestacion',
    titulo: 'Contestación a la demanda',
    descripcion: 'Presentación de contestación con reconvención',
    pasado: true,
    importancia: 'alta',
    completado: true,
  },
  {
    id: 'cron-3',
    procesoId: 'picassent',
    fecha: '2025-02-15',
    tipo: 'audiencia',
    titulo: 'Audiencia Previa',
    descripcion: 'Audiencia previa al juicio. Fijación de hechos controvertidos.',
    pasado: false,
    importancia: 'alta',
    completado: false,
  },
  {
    id: 'cron-4',
    procesoId: 'picassent',
    fecha: '2025-04-10',
    tipo: 'audiencia',
    titulo: 'Juicio Oral',
    descripcion: 'Celebración del juicio oral',
    pasado: false,
    importancia: 'alta',
    completado: false,
  },
  // Quart
  {
    id: 'cron-5',
    procesoId: 'quart',
    fecha: '2025-01-05',
    tipo: 'demanda',
    titulo: 'Solicitud de ejecución',
    descripcion: 'Inicio del procedimiento de ejecución',
    pasado: true,
    importancia: 'alta',
    completado: true,
  },
  {
    id: 'cron-6',
    procesoId: 'quart',
    fecha: '2025-03-01',
    tipo: 'hito',
    titulo: 'Resolución ejecución',
    descripcion: 'Fecha prevista para resolución',
    pasado: false,
    importancia: 'media',
    completado: false,
  },
  // Mislata
  {
    id: 'cron-7',
    procesoId: 'mislata',
    fecha: '2025-02-01',
    tipo: 'demanda',
    titulo: 'Demanda verbal',
    descripcion: 'Presentación de demanda de juicio verbal',
    pasado: true,
    importancia: 'alta',
    completado: true,
  },
  {
    id: 'cron-8',
    procesoId: 'mislata',
    fecha: '2025-03-20',
    tipo: 'audiencia',
    titulo: 'Vista juicio verbal',
    descripcion: 'Celebración de la vista del juicio verbal',
    pasado: false,
    importancia: 'alta',
    completado: false,
  },
];

// ============================================
// RECLAMACIONES
// ============================================

export const seedReclamaciones: Reclamacion[] = [
  // Picassent - Reclamaciones de la demanda
  {
    id: 'rec-1',
    procesoId: 'picassent',
    titulo: 'Nóminas',
    importe: 89000,
    estado: 'activo',
    probabilidad: 'prescrito',
    color: '#6b7280',
    descripcionCorta: 'Nóminas 2016-2022 (parcialmente prescrito)',
    descripcionLarga: 'Reclamación de diferencia de nóminas entre ambos cónyuges durante el periodo 2016-2022. Aplicable prescripción de 5 años según art. 1964 CC.',
    fundamentoJuridico: 'Art. 1964 CC - Prescripción 5 años',
    documentosIds: ['doc-1', 'doc-2'],
    hechosIds: ['hecho-1'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'rec-2',
    procesoId: 'picassent',
    titulo: 'Vehículo',
    importe: 15000,
    estado: 'activo',
    probabilidad: 'alta',
    color: '#10b981',
    descripcionCorta: 'Mitad del valor del Peugeot 3008',
    descripcionLarga: 'Reclamación de la mitad del valor del vehículo Peugeot 3008 adquirido durante el matrimonio. Bien ganancial conforme art. 1347 CC.',
    fundamentoJuridico: 'Art. 1347 CC - Bienes gananciales',
    documentosIds: ['doc-3'],
    hechosIds: ['hecho-2'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'rec-3',
    procesoId: 'picassent',
    titulo: 'Gastos',
    importe: 45000,
    estado: 'activo',
    probabilidad: 'media',
    color: '#f59e0b',
    descripcionCorta: 'Gastos personales de Vicenta',
    descripcionLarga: 'Reclamación de reembolso por gastos personales realizados con fondos gananciales. Se disputa la naturaleza de los gastos.',
    fundamentoJuridico: 'Art. 1362 CC - Cargas del matrimonio',
    documentosIds: [],
    hechosIds: ['hecho-3'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'rec-4',
    procesoId: 'picassent',
    titulo: 'Artur Piera',
    importe: 35000,
    estado: 'activo',
    probabilidad: 'baja',
    color: '#ef4444',
    descripcionCorta: 'Inmueble C/ Artur Piera',
    descripcionLarga: 'Reclamación sobre inmueble en C/ Artur Piera. Discusión sobre el carácter privativo/ganancial del bien.',
    fundamentoJuridico: 'Art. 1346 CC - Bienes privativos',
    documentosIds: ['doc-4'],
    hechosIds: ['hecho-4'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'rec-5',
    procesoId: 'picassent',
    titulo: 'Pensiones',
    importe: 28677,
    estado: 'activo',
    probabilidad: 'alta',
    color: '#10b981',
    descripcionCorta: 'Pensiones compensatorias abonadas',
    descripcionLarga: 'Reclamación de pensiones compensatorias abonadas desde la separación.',
    fundamentoJuridico: 'Art. 97 CC - Pensión compensatoria',
    documentosIds: [],
    hechosIds: ['hecho-5'],
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  // Quart
  {
    id: 'rec-6',
    procesoId: 'quart',
    titulo: 'Compensación',
    importe: 2400,
    estado: 'activo',
    probabilidad: 'alta',
    color: '#10b981',
    descripcionCorta: 'Gastos hijos pagados por Juan',
    descripcionLarga: 'Compensación por gastos exclusivos de los hijos abonados íntegramente por Juan durante 2024.',
    fundamentoJuridico: 'Sentencia divorcio - Gastos extraordinarios',
    documentosIds: [],
    hechosIds: [],
    createdAt: '2025-01-05T10:00:00Z',
    updatedAt: '2025-01-05T10:00:00Z',
  },
  // Mislata
  {
    id: 'rec-7',
    procesoId: 'mislata',
    titulo: 'Hipoteca',
    importe: 6945,
    estado: 'activo',
    probabilidad: 'media',
    color: '#f59e0b',
    descripcionCorta: 'Mitad hipoteca 2022-2024',
    descripcionLarga: 'Reclamación de la mitad de las cuotas hipotecarias abonadas por Juan durante el periodo 2022-2024. Posible litispendencia con Picassent.',
    fundamentoJuridico: 'Art. 1145 CC - Obligaciones solidarias',
    documentosIds: [],
    hechosIds: [],
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
  },
];

// ============================================
// HECHOS
// ============================================

export const seedHechos: Hecho[] = [
  {
    id: 'hecho-1',
    procesoId: 'picassent',
    titulo: 'Diferencia salarial histórica',
    resumenCorto: 'Juan percibía mayor salario que Vicenta durante el matrimonio',
    desarrolloLargo: 'Durante el periodo 2016-2022, Juan percibió un salario superior al de Vicenta. Sin embargo, la parte actora no acredita que dichos ingresos no se destinaran a cargas familiares. Además, gran parte del periodo está prescrito (anterior a 2019).',
    riesgo: 'bajo',
    contraargumentoEsperado: 'La diferencia salarial genera derecho a compensación',
    respuestaContraargumento: 'Art. 1964 CC: prescripción de 5 años. Además, los ingresos se destinaron íntegramente a cargas familiares (hipoteca, colegios, etc.)',
    documentosIds: ['doc-1', 'doc-2'],
    orden: 1,
    fechaHecho: '2016-01-01',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'hecho-2',
    procesoId: 'picassent',
    titulo: 'Adquisición vehículo Peugeot',
    resumenCorto: 'Compra del Peugeot 3008 con fondos gananciales',
    desarrolloLargo: 'El vehículo Peugeot 3008 fue adquirido en 2019 con fondos de la cuenta común. Se encuentra en posesión de Juan desde la separación. Valor actual estimado: 15.000€.',
    riesgo: 'alto',
    contraargumentoEsperado: 'El vehículo es ganancial y debe incluirse en la liquidación',
    respuestaContraargumento: 'Se acepta el carácter ganancial. Se propone adjudicación a Juan compensando en metálico.',
    documentosIds: ['doc-3'],
    orden: 2,
    fechaHecho: '2019-05-15',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'hecho-3',
    procesoId: 'picassent',
    titulo: 'Gastos personales Vicenta',
    resumenCorto: 'Disposiciones de cuenta común para gastos personales',
    desarrolloLargo: 'Durante 2020-2022, Vicenta realizó disposiciones de la cuenta común por valor de 45.000€ para gastos personales no relacionados con cargas familiares (viajes, compras de lujo, etc.).',
    riesgo: 'medio',
    contraargumentoEsperado: 'Los gastos eran para necesidades del hogar',
    respuestaContraargumento: 'Los extractos bancarios demuestran gastos en comercios de lujo, viajes sin hijos, etc. No son cargas del matrimonio (art. 1362 CC).',
    documentosIds: [],
    orden: 3,
    fechaHecho: '2020-01-01',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'hecho-4',
    procesoId: 'picassent',
    titulo: 'Inmueble Artur Piera',
    resumenCorto: 'Carácter privativo del piso de C/ Artur Piera',
    desarrolloLargo: 'El inmueble situado en C/ Artur Piera fue adquirido por Juan ANTES del matrimonio con fondos procedentes de herencia de sus padres. Por tanto, es bien privativo conforme art. 1346 CC.',
    riesgo: 'bajo',
    contraargumentoEsperado: 'Se abonaron mejoras con fondos gananciales',
    respuestaContraargumento: 'No consta acreditado que se realizaran mejoras. En todo caso, las mejoras no alteran el carácter privativo del inmueble (art. 1359 CC).',
    documentosIds: ['doc-4'],
    orden: 4,
    fechaHecho: '2008-03-20',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'hecho-5',
    procesoId: 'picassent',
    titulo: 'Pago pensiones desde separación',
    resumenCorto: 'Juan ha abonado todas las pensiones puntualmente',
    desarrolloLargo: 'Desde la fecha de separación (enero 2022), Juan ha abonado puntualmente las pensiones establecidas judicialmente: 800€/mes pensión compensatoria + 600€/mes alimentos hijos.',
    riesgo: 'ninguno',
    contraargumentoEsperado: 'N/A',
    respuestaContraargumento: 'Hecho no controvertido. Constan transferencias bancarias.',
    documentosIds: [],
    orden: 5,
    fechaHecho: '2022-01-01',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
];

// ============================================
// TAREAS
// ============================================

export const seedTareas: Tarea[] = [
  {
    id: 'tarea-1',
    procesoId: 'picassent',
    titulo: 'Preparar alegaciones prescripción',
    descripcion: 'Redactar escrito de alegaciones sobre prescripción de nóminas anteriores a 2019',
    dueDate: '2025-02-10',
    estado: 'pendiente',
    prioridad: 'urgente',
    linkedIds: { reclamacionId: 'rec-1' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'tarea-2',
    procesoId: 'picassent',
    titulo: 'Recopilar extractos bancarios',
    descripcion: 'Solicitar al banco extractos de cuenta común periodo 2020-2022',
    dueDate: '2025-02-01',
    estado: 'en_progreso',
    prioridad: 'alta',
    linkedIds: { hechoId: 'hecho-3' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'tarea-3',
    procesoId: 'picassent',
    titulo: 'Revisar STS 458/2025',
    descripcion: 'Analizar aplicabilidad de la nueva jurisprudencia del Supremo',
    dueDate: '2025-02-05',
    estado: 'pendiente',
    prioridad: 'alta',
    linkedIds: { estrategiaId: 'est-1' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'tarea-4',
    procesoId: 'quart',
    titulo: 'Aportar facturas gastos hijos',
    descripcion: 'Recopilar y escanear facturas de gastos extraordinarios 2024',
    dueDate: '2025-02-15',
    estado: 'pendiente',
    prioridad: 'normal',
    linkedIds: { reclamacionId: 'rec-6' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'tarea-5',
    procesoId: 'mislata',
    titulo: 'Analizar litispendencia',
    descripcion: 'Estudiar si procede alegar litispendencia con procedimiento Picassent',
    dueDate: '2025-02-20',
    estado: 'pendiente',
    prioridad: 'alta',
    linkedIds: {},
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
];

// ============================================
// ESTRATEGIAS
// ============================================

export const seedEstrategias: Estrategia[] = [
  {
    id: 'est-1',
    procesoId: 'picassent',
    tipo: 'prescripcion',
    titulo: 'Prescripción Nóminas 2016-2019',
    resumenEjecutivo: 'Las nóminas anteriores a junio 2019 están prescritas (5 años, art. 1964 CC).',
    desarrolloCompleto: `## Fundamento Legal

Art. 1964 CC: "Las acciones personales que no tengan plazo especial prescriben a los cinco años desde que pueda exigirse el cumplimiento de la obligación."

## Aplicación al caso

La demanda se presenta en junio 2024. Por tanto, cualquier crédito nacido antes de junio 2019 está prescrito.

## Cuantificación

- Periodo 2016-2019: ~60.000€ de diferencia salarial
- Periodo 2019-2022: ~29.000€ de diferencia salarial

## Conclusión

Solo son exigibles 29.000€ de los 89.000€ reclamados.`,
    fundamentoLegal: 'Art. 1964 CC',
    estado: 'activo',
    documentosIds: [],
    jurisprudenciaIds: ['jur-1'],
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-20T10:00:00Z',
  },
  {
    id: 'est-2',
    procesoId: 'picassent',
    tipo: 'jurisprudencia',
    titulo: 'STS 458/2025 - Compensación trabajo hogar',
    resumenEjecutivo: 'Nueva doctrina del TS sobre compensación del art. 1438 CC. Requiere dedicación exclusiva.',
    desarrolloCompleto: `## Doctrina STS 458/2025

El Tribunal Supremo establece que la compensación del art. 1438 CC por trabajo en el hogar requiere:

1. Dedicación EXCLUSIVA o PRINCIPAL al hogar
2. Que dicha dedicación haya permitido al otro cónyuge desarrollar su carrera
3. Desequilibrio patrimonial derivado de esa dedicación

## Aplicación al caso

Vicenta trabajaba a tiempo completo durante el matrimonio. No hubo dedicación exclusiva al hogar. Por tanto, NO procede compensación por trabajo doméstico.

## Conclusión

Esta doctrina permite rechazar cualquier reclamación basada en el art. 1438 CC.`,
    fundamentoLegal: 'Art. 1438 CC, STS 458/2025',
    estado: 'activo',
    documentosIds: [],
    jurisprudenciaIds: ['jur-2'],
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
  {
    id: 'est-3',
    procesoId: 'mislata',
    tipo: 'litispendencia',
    titulo: 'Litispendencia con Picassent',
    resumenEjecutivo: 'La reclamación de hipoteca puede estar incluida en el procedimiento de Picassent.',
    desarrolloCompleto: `## Análisis de litispendencia

Art. 416.1.2º LEC: La litispendencia se produce cuando existe identidad de:
- Sujetos
- Objeto
- Causa de pedir

## Aplicación

- Sujetos: Idénticos (Juan vs Vicenta)
- Objeto: Las cuotas hipotecarias podrían incluirse en la liquidación de Picassent
- Causa de pedir: Régimen económico matrimonial

## Estrategia

Alegar litispendencia impropia para conseguir acumulación de procedimientos o, en su caso, la suspensión del juicio verbal hasta resolución de Picassent.`,
    fundamentoLegal: 'Art. 416 LEC',
    estado: 'activo',
    documentosIds: [],
    jurisprudenciaIds: [],
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-01T10:00:00Z',
  },
];

// ============================================
// DOCUMENTOS
// ============================================

export const seedDocumentos: Documento[] = [
  {
    id: 'doc-1',
    nombre: 'Nóminas Juan 2016-2022.pdf',
    tipo: 'nomina',
    fechaDocumento: '2022-12-31',
    fechaSubida: '2024-06-15T10:00:00Z',
    tags: ['nóminas', 'juan', 'ingresos'],
    descripcion: 'Recopilación de nóminas de Juan durante el periodo 2016-2022',
    referencia: 'Doc. 5',
    linkedTo: {
      procesoId: 'picassent',
      hechoId: 'hecho-1',
      reclamacionId: 'rec-1',
    },
  },
  {
    id: 'doc-2',
    nombre: 'Nóminas Vicenta 2016-2022.pdf',
    tipo: 'nomina',
    fechaDocumento: '2022-12-31',
    fechaSubida: '2024-06-15T10:00:00Z',
    tags: ['nóminas', 'vicenta', 'ingresos'],
    descripcion: 'Recopilación de nóminas de Vicenta durante el periodo 2016-2022',
    referencia: 'Doc. 6',
    linkedTo: {
      procesoId: 'picassent',
      hechoId: 'hecho-1',
      reclamacionId: 'rec-1',
    },
  },
  {
    id: 'doc-3',
    nombre: 'Contrato compraventa Peugeot 3008.pdf',
    tipo: 'contrato',
    fechaDocumento: '2019-05-15',
    fechaSubida: '2024-06-15T10:00:00Z',
    tags: ['vehículo', 'compraventa', 'ganancial'],
    descripcion: 'Contrato de compraventa del vehículo Peugeot 3008',
    referencia: 'Doc. 12',
    linkedTo: {
      procesoId: 'picassent',
      hechoId: 'hecho-2',
      reclamacionId: 'rec-2',
    },
  },
  {
    id: 'doc-4',
    nombre: 'Escritura Artur Piera.pdf',
    tipo: 'contrato',
    fechaDocumento: '2008-03-20',
    fechaSubida: '2024-06-15T10:00:00Z',
    tags: ['inmueble', 'escritura', 'privativo'],
    descripcion: 'Escritura de compraventa del piso en C/ Artur Piera (adquirido antes del matrimonio)',
    referencia: 'Doc. 25',
    linkedTo: {
      procesoId: 'picassent',
      hechoId: 'hecho-4',
      reclamacionId: 'rec-4',
    },
  },
];

// ============================================
// JURISPRUDENCIA
// ============================================

export const seedJurisprudencia: Jurisprudencia[] = [
  {
    id: 'jur-1',
    referencia: 'STS 152/2020',
    tipo: 'STS',
    tribunal: 'Tribunal Supremo, Sala 1ª',
    fecha: '2020-03-05',
    resumen: 'La prescripción de las acciones derivadas del régimen económico matrimonial es de 5 años conforme al art. 1964 CC.',
    extractosRelevantes: [
      'El plazo de prescripción de las acciones personales derivadas del régimen económico matrimonial es el general de cinco años del art. 1964 CC.',
      'El dies a quo del plazo de prescripción se sitúa en el momento de la disolución del régimen económico matrimonial.',
    ],
    notasDeUso: 'Aplicable para defender la prescripción de las reclamaciones de nóminas anteriores a 2019. Fundamental en la estrategia de defensa.',
    linkedTo: {
      procesosIds: ['picassent'],
      reclamacionesIds: ['rec-1'],
      hechosIds: [],
      estrategiasIds: ['est-1'],
    },
    url: 'https://www.poderjudicial.es/search/AN/openDocument/...',
    createdAt: '2024-09-20T10:00:00Z',
    updatedAt: '2024-09-20T10:00:00Z',
  },
  {
    id: 'jur-2',
    referencia: 'STS 458/2025',
    tipo: 'STS',
    tribunal: 'Tribunal Supremo, Sala 1ª',
    fecha: '2025-01-08',
    resumen: 'La compensación del art. 1438 CC requiere dedicación exclusiva al hogar que haya impedido desarrollo profesional propio.',
    extractosRelevantes: [
      'La compensación prevista en el art. 1438 CC exige que uno de los cónyuges se haya dedicado de forma exclusiva o principalmente al trabajo para la casa.',
      'No procede compensación cuando ambos cónyuges han desarrollado actividad laboral remunerada a tiempo completo.',
    ],
    notasDeUso: 'Doctrina reciente del TS que permite rechazar la compensación por trabajo doméstico cuando ambos cónyuges trabajaban. Aplicable directamente a nuestro caso.',
    linkedTo: {
      procesosIds: ['picassent'],
      reclamacionesIds: [],
      hechosIds: [],
      estrategiasIds: ['est-2'],
    },
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-01-10T10:00:00Z',
  },
];

// ============================================
// FUNCIÓN PARA CARGAR SEED DATA
// ============================================

export const getSeedData = (): Partial<LitigationState> => ({
  procedimientos: seedProcedimientos,
  cronologia: seedCronologia,
  reclamaciones: seedReclamaciones,
  hechos: seedHechos,
  tareas: seedTareas,
  estrategias: seedEstrategias,
  documentos: seedDocumentos,
  jurisprudencia: seedJurisprudencia,
});
