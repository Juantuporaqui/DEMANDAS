// ============================================
// TIMELINE CASO PICASSENT - P.O. 715/2024
// Cronología de hipoteca, pagos y hechos clave
// ============================================

export interface EventoPicassent {
  id: string;
  fecha: string;
  tipo: 'hipoteca' | 'pago' | 'adquisicion' | 'judicial' | 'personal' | 'impago';
  titulo: string;
  descripcion: string;
  importeCents?: number;
  actores: string[];
  relevancia: 'critica' | 'alta' | 'media' | 'baja';
  documentoRef?: string;
  tags: string[];
}

export const procedimientoPicassent = {
  caseId: 'picassent-po-715-2024',
  titulo: 'P.O. 715/2024 · División Patrimonial',
  juzgado: 'Juzgado de Primera Instancia e Instrucción nº 1 de Picassent',
  autos: '715/2024',
  materia: 'División de cosa común y reclamación de cantidad',
  demandante: 'Vicenta Jiménez Vera',
  demandado: 'Juan Rodríguez Crespo',
  letradoDemandante: 'María Auxiliadora Gómez Martín',
  letradoDemandado: 'Óscar Javier Benita Godoy',
  procuradorDemandante: 'Isabel Luzzy Aguilar',
  procuradorDemandado: 'Rosa Calvo Barber',
  cuantiaDemanda: 21267708, // 212.677,08€ en céntimos
  estado: 'Audiencia Previa pendiente',
};

export const timelinePicassent: EventoPicassent[] = [
  // ======== 2005 ========
  {
    id: 'evt-p-001',
    fecha: '2005-01-01',
    tipo: 'personal',
    titulo: 'Inicio de la convivencia',
    descripcion: 'Juan y Vicenta inician relación de pareja. Vicenta vive en piso alquilado en Av. del Cid, Valencia. Juan vive en su vivienda privativa de C/ Lope de Vega 7, Quart de Poblet.',
    actores: ['Juan', 'Vicenta'],
    relevancia: 'alta',
    tags: ['relacion', 'base'],
  },

  // ======== 2006 ========
  {
    id: 'evt-p-002',
    fecha: '2006-01-01',
    tipo: 'personal',
    titulo: 'Vicenta se traslada al domicilio de Juan',
    descripcion: 'Vicenta deja el alquiler y se traslada a la vivienda privativa de Juan en C/ Lope de Vega 7, Quart de Poblet. Ahorro del alquiler.',
    actores: ['Juan', 'Vicenta'],
    relevancia: 'media',
    tags: ['convivencia'],
  },
  {
    id: 'evt-p-003',
    fecha: '2006-08-22',
    tipo: 'hipoteca',
    titulo: 'Hipoteca solidaria 310.000€ (Kutxa)',
    descripcion: 'Ambos suscriben préstamo hipotecario de 310.000€ en Caja de Ahorros de Guipúzcoa (Kutxa). Se usa como garantía la vivienda PRIVATIVA de Juan en Lope de Vega. Para constituirla, Juan cancela su hipoteca anterior (33.959,19€).',
    importeCents: 31000000,
    actores: ['Juan', 'Vicenta', 'Kutxa'],
    relevancia: 'critica',
    documentoRef: 'Doc. 53',
    tags: ['hipoteca', 'financiacion', 'critico'],
  },
  {
    id: 'evt-p-004',
    fecha: '2006-08-22',
    tipo: 'adquisicion',
    titulo: 'Compra parcela Montroy',
    descripcion: 'Adquisición del solar en Montroy (parcela 16, Plan Parcial Balcón 1) por 35.310€. Financiado con el préstamo hipotecario solidario.',
    importeCents: 3531000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'alta',
    documentoRef: 'Doc. 2',
    tags: ['adquisicion', 'inmueble', 'montroy'],
  },
  {
    id: 'evt-p-005',
    fecha: '2006-09-18',
    tipo: 'adquisicion',
    titulo: 'Compra parcela Godelleta',
    descripcion: 'Adquisición de finca en Godelleta por 90.000€ (35 días después de Montroy). Financiada con el mismo préstamo hipotecario solidario.',
    importeCents: 9000000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'alta',
    documentoRef: 'Doc. 5',
    tags: ['adquisicion', 'inmueble', 'godelleta'],
  },

  // ======== 2007 ========
  {
    id: 'evt-p-006',
    fecha: '2007-09-20',
    tipo: 'hipoteca',
    titulo: 'Préstamos personales BBVA (39.000€)',
    descripcion: 'Ambos suscriben dos préstamos personales en BBVA: 19.900€ + 19.100€ = 39.000€. Destinados a finalizar la construcción del chalé de Montroy.',
    importeCents: 3900000,
    actores: ['Juan', 'Vicenta', 'BBVA'],
    relevancia: 'alta',
    tags: ['prestamo', 'construccion'],
  },

  // ======== 2008 ========
  {
    id: 'evt-p-007',
    fecha: '2008-07-01',
    tipo: 'adquisicion',
    titulo: 'Fin de obra chalé Montroy',
    descripcion: 'Finalización de la construcción del chalé en C/ Collao 10, Urbanización Balcón de Montroy. Valor de obra nueva: 220.000€.',
    importeCents: 22000000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'alta',
    tags: ['construccion', 'montroy', 'finalizacion'],
  },
  {
    id: 'evt-p-008',
    fecha: '2008-09-05',
    tipo: 'pago',
    titulo: 'Cancelación préstamos personales BBVA',
    descripcion: 'Se cancelan los préstamos personales del BBVA. Vicenta alega que el ingreso de 18.000€ fue suyo, pero Juan afirma que lo realizó él (Doc. 13).',
    importeCents: 3900000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'critica',
    documentoRef: 'Doc. 13',
    tags: ['pago', 'disputa', 'prestamo'],
  },

  // ======== 2009 ========
  {
    id: 'evt-p-009',
    fecha: '2009-06-18',
    tipo: 'hipoteca',
    titulo: 'Subrogación hipoteca a Barclays',
    descripcion: 'La hipoteca de Kutxa es subrogada por la entidad Barclays. Posteriormente Barclays será absorbida por Caixabank.',
    actores: ['Juan', 'Vicenta', 'Barclays'],
    relevancia: 'media',
    tags: ['hipoteca', 'subrogacion'],
  },

  // ======== 2013 ========
  {
    id: 'evt-p-010',
    fecha: '2013-06-14',
    tipo: 'judicial',
    titulo: 'Declaración de Vicenta ante AEAT',
    descripcion: 'Vicenta declara ante la AEAT que el préstamo de 310.000€ se empleó para comprar el terreno de Montroy, otro terreno, y cancelar deudas pendientes. CONTRADICE la demanda actual.',
    actores: ['Vicenta', 'AEAT'],
    relevancia: 'critica',
    documentoRef: 'Doc. 4',
    tags: ['aeat', 'contradiccion', 'prueba'],
  },
  {
    id: 'evt-p-011',
    fecha: '2013-08-09',
    tipo: 'personal',
    titulo: 'Matrimonio civil',
    descripcion: 'Juan y Vicenta contraen matrimonio civil. Régimen económico: gananciales.',
    actores: ['Juan', 'Vicenta'],
    relevancia: 'alta',
    tags: ['matrimonio', 'gananciales'],
  },

  // ======== 2014 ========
  {
    id: 'evt-p-012',
    fecha: '2014-01-01',
    tipo: 'adquisicion',
    titulo: 'Compra Seat León (13.000€)',
    descripcion: 'Se adquiere un Seat León por 13.000€. Vicenta reclama que se pagó desde la cuenta Barclays que "solo se nutría de sus nóminas". Juan aporta Doc. 2 mostrando +100.000€ de ingresos extra.',
    importeCents: 1300000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'media',
    documentoRef: 'Doc. 2, Doc. 17',
    tags: ['vehiculo', 'disputa', 'prescrito'],
  },

  // ======== 2016 ========
  {
    id: 'evt-p-013',
    fecha: '2016-01-01',
    tipo: 'personal',
    titulo: 'Reducción salario de Vicenta',
    descripcion: 'El salario de Vicenta se reduce por situación de baja laboral. A partir de aquí, la aportación salarial de Juan es evidentemente superior.',
    actores: ['Vicenta'],
    relevancia: 'alta',
    tags: ['salario', 'aportacion'],
  },

  // ======== 2019 ========
  {
    id: 'evt-p-014',
    fecha: '2019-06-20',
    tipo: 'judicial',
    titulo: 'Fecha límite prescripción (5 años antes)',
    descripcion: 'Las deudas anteriores a esta fecha están prescritas según Art. 1964 CC (5 años). Referencia para calcular prescripción de demanda 2024.',
    actores: [],
    relevancia: 'critica',
    tags: ['prescripcion', 'limite', 'legal'],
  },

  // ======== 2022 ========
  {
    id: 'evt-p-015',
    fecha: '2022-09-12',
    tipo: 'pago',
    titulo: 'Reparto ahorros familiares',
    descripcion: 'Juan transfiere 33.700€ de la cuenta común, de ahí 32.000€ a su cuenta. Vicenta transfiere 38.500€ a su cuenta privativa (6.500€ MÁS que Juan). Doc. 3.',
    importeCents: 3850000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'critica',
    documentoRef: 'Doc. 3',
    tags: ['reparto', 'ahorros', 'disputa'],
  },
  {
    id: 'evt-p-016',
    fecha: '2022-09-15',
    tipo: 'adquisicion',
    titulo: 'Venta vivienda Artur Piera',
    descripcion: 'Se vende la vivienda de Artur Piera (inversión común por subasta). Juan hizo la reforma físicamente (Doc. 20). Vicenta retiró 38.500€, Juan 32.000€.',
    importeCents: 3200000,
    actores: ['Juan', 'Vicenta'],
    relevancia: 'alta',
    documentoRef: 'Doc. 20, Doc. 3',
    tags: ['venta', 'inmueble', 'disputa'],
  },

  // ======== 2023 ========
  {
    id: 'evt-p-017',
    fecha: '2023-10-17',
    tipo: 'judicial',
    titulo: 'Sentencia de divorcio',
    descripcion: 'El Juzgado de Primera Instancia nº 1 de Quart de Poblet dicta sentencia de divorcio (autos 892/23). Se aprueba el convenio regulador.',
    actores: ['Juzgado Quart'],
    relevancia: 'critica',
    documentoRef: 'Sentencia 362/2023',
    tags: ['divorcio', 'sentencia'],
  },
  {
    id: 'evt-p-018',
    fecha: '2023-10-31',
    tipo: 'impago',
    titulo: 'Vicenta deja de pagar hipoteca',
    descripcion: 'Desde octubre 2023, Vicenta deja de abonar su 50% de las cuotas del préstamo hipotecario solidario. Juan debe pagar el 100%.',
    actores: ['Vicenta'],
    relevancia: 'critica',
    tags: ['impago', 'hipoteca', 'mislata'],
  },

  // ======== 2024 ========
  {
    id: 'evt-p-019',
    fecha: '2024-06-24',
    tipo: 'judicial',
    titulo: 'Demanda P.O. 715/2024',
    descripcion: 'Vicenta presenta demanda de división de cosa común y reclamación de cantidad por 212.677,08€. Incluye 10 hechos reclamados.',
    importeCents: 21267708,
    actores: ['Vicenta'],
    relevancia: 'critica',
    tags: ['demanda', 'inicio'],
  },

  // ======== 2025 ========
  {
    id: 'evt-p-021',
    fecha: '2025-01-27',
    tipo: 'judicial',
    titulo: 'Emplazamiento contestación',
    descripcion: 'Juan es emplazado para contestar la demanda en 20 días.',
    actores: ['Juzgado Picassent', 'Juan'],
    relevancia: 'alta',
    tags: ['emplazamiento', 'contestacion'],
  },
  {
    id: 'evt-p-022',
    fecha: '2025-02-10',
    tipo: 'pago',
    titulo: 'Saldo deudor hipoteca actual',
    descripcion: 'El saldo pendiente del préstamo hipotecario es de 182.512,64€. Grava únicamente la vivienda privativa de Juan en Lope de Vega.',
    importeCents: 18251264,
    actores: ['Caixabank'],
    relevancia: 'critica',
    documentoRef: 'Doc. 7',
    tags: ['hipoteca', 'saldo', 'actual'],
  },
  {
    id: 'evt-p-023',
    fecha: '2025-02-20',
    tipo: 'judicial',
    titulo: 'Contestación a la demanda',
    descripcion: 'Presentación de la contestación a la demanda dentro del plazo conferido.',
    actores: ['Juan'],
    relevancia: 'alta',
    tags: ['contestacion', 'escrito'],
  },
  {
    id: 'evt-p-020',
    fecha: '2025-10-24',
    tipo: 'judicial',
    titulo: 'Audiencia Previa señalada (1º señalamiento)',
    descripcion: 'Primer señalamiento de Audiencia Previa para preparación de alegaciones y hechos controvertidos.',
    actores: ['Juzgado Picassent'],
    relevancia: 'critica',
    tags: ['audiencia', 'vista', 'proximo'],
  },

  // ======== 2026 ========
  {
    id: 'evt-p-024',
    fecha: '2026-01-08',
    tipo: 'judicial',
    titulo: 'Providencia requiriendo documentación',
    descripcion: 'Providencia que requiere documentación con 5 días de antelación; se cumple pese a recurso.',
    actores: ['Juzgado Picassent'],
    relevancia: 'alta',
    tags: ['providencia', 'documentacion'],
  },
  {
    id: 'evt-p-025',
    fecha: '2026-01-16',
    tipo: 'judicial',
    titulo: 'Recurso de reposición de la actora',
    descripcion: 'La parte actora interpone recurso de reposición contra la providencia.',
    actores: ['Vicenta'],
    relevancia: 'alta',
    tags: ['recurso', 'reposicion'],
  },
  {
    id: 'evt-p-026',
    fecha: '2026-01-19',
    tipo: 'judicial',
    titulo: 'Suspensión/cancelación del señalamiento',
    descripcion: 'Se suspende o cancela el señalamiento fijado.',
    actores: ['Juzgado Picassent'],
    relevancia: 'critica',
    tags: ['suspension', 'señalamiento'],
  },
  {
    id: 'evt-p-027',
    fecha: '2026-01-20',
    tipo: 'judicial',
    titulo: 'Audiencia previa (no celebrada)',
    descripcion: 'Audiencia previa prevista que no llega a celebrarse por suspensión.',
    actores: ['Juzgado Picassent'],
    relevancia: 'critica',
    tags: ['audiencia', 'suspension'],
  },
];

// ============================================
// RESUMEN HIPOTECA - PAGOS JUAN VS VICENTA
// ============================================

export const resumenHipoteca = {
  // Préstamo original
  importeOriginal: 31000000, // 310.000€
  fechaConstitucion: '2006-08-22',
  garantiaAportada: 'Vivienda privativa Juan (Lope de Vega 7, Quart)',

  // Cancelación previa requerida
  cancelacionHipotecaAnterior: 3395919, // 33.959,19€

  // Saldo actual
  saldoActual: 18251264, // 182.512,64€
  fechaSaldo: '2025-02-10',

  // Pagos desde el divorcio (Oct 2023)
  cuotaMensual: 65000, // ~650€ estimado
  mesesImpagadosVicenta: 16, // Oct 2023 - Ene 2025
  totalImpagadoVicenta: 1040000, // ~10.400€ (16 meses x 650€ / 2)

  // Inmuebles adquiridos con la hipoteca
  inmuebles: [
    { nombre: 'Chalé Montroy', valor: 22000000, libre: true },
    { nombre: 'Parcela Godelleta 1', valor: 4500000, libre: true },
    { nombre: 'Parcela Godelleta 2', valor: 4500000, libre: true },
  ],
};

// ============================================
// FUNCIONES DE ACCESO
// ============================================

export function getEventosPorTipo(tipo: EventoPicassent['tipo']): EventoPicassent[] {
  return timelinePicassent.filter(e => e.tipo === tipo);
}

export function getEventosCriticos(): EventoPicassent[] {
  return timelinePicassent.filter(e => e.relevancia === 'critica');
}

export function getEventosProximos(): EventoPicassent[] {
  const hoy = new Date().toISOString().split('T')[0];
  return timelinePicassent.filter(e => e.fecha > hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function getEventosHipoteca(): EventoPicassent[] {
  return timelinePicassent.filter(e => e.tipo === 'hipoteca' || e.tags.includes('hipoteca'));
}

export function calcularTotalHipotecaYPrestamos(): number {
  return timelinePicassent
    .filter(e => e.tipo === 'hipoteca' && e.importeCents)
    .reduce((sum, e) => sum + (e.importeCents || 0), 0);
}
