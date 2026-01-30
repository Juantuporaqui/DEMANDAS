// ============================================
// TIMELINE CASO QUART - ETJ 1428/2025
// Cronología estructurada de eventos
// ============================================

export interface EventoQuart {
  id: string;
  fecha: string;
  tipo: 'judicial' | 'party_action' | 'payment' | 'email' | 'bank_event';
  titulo: string;
  descripcion: string;
  actores: string[];
  importeCents?: number;
  disputed: boolean;
  fuente: {
    doc: string;
    page?: number;
    support: 'quote' | 'paraphrase';
    text?: string;
  };
  tags: string[];
}

export const timelineQuart: EventoQuart[] = [
  // 2023
  {
    id: 'evt-q-001',
    fecha: '2023-10-16',
    tipo: 'party_action',
    titulo: 'Firma convenio regulador',
    descripcion: 'Juan y Vicenta firman el convenio regulador de divorcio, incluyendo cláusula de aportación 200€/mes a cuenta común.',
    actores: ['Juan', 'Vicenta'],
    disputed: false,
    fuente: { doc: 'sentencia.pdf', support: 'paraphrase' },
    tags: ['convenio', 'divorcio', 'base'],
  },
  {
    id: 'evt-q-002',
    fecha: '2023-10-17',
    tipo: 'judicial',
    titulo: 'Sentencia 362/2023 divorcio',
    descripcion: 'Juzgado de Primera Instancia nº 1 de Quart de Poblet dicta sentencia aprobando el convenio regulador. Juez: Sandra Lozano López.',
    actores: ['Juzgado'],
    disputed: false,
    fuente: { doc: 'sentencia.pdf', support: 'quote', text: 'Sentencia nº 362/2023' },
    tags: ['sentencia', 'titulo-ejecutivo', 'base'],
  },

  // 2024 - Meses reclamados por Vicenta (abril-julio, sept-oct)
  {
    id: 'evt-q-003',
    fecha: '2024-04-01',
    tipo: 'payment',
    titulo: 'Abril 2024 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en abril 2024.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-004',
    fecha: '2024-05-01',
    tipo: 'payment',
    titulo: 'Mayo 2024 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en mayo 2024.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-005',
    fecha: '2024-06-01',
    tipo: 'payment',
    titulo: 'Junio 2024 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en junio 2024.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-006',
    fecha: '2024-07-01',
    tipo: 'payment',
    titulo: 'Julio 2024 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en julio 2024.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-007',
    fecha: '2024-09-01',
    tipo: 'payment',
    titulo: 'Septiembre 2024 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en septiembre 2024.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-008',
    fecha: '2024-10-01',
    tipo: 'payment',
    titulo: 'Octubre 2024 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en octubre 2024.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },

  // 2025
  {
    id: 'evt-q-009',
    fecha: '2025-04-01',
    tipo: 'payment',
    titulo: 'Abril 2025 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en abril 2025.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-010',
    fecha: '2025-04-10',
    tipo: 'email',
    titulo: 'Email Juan: aviso retiradas injustificadas',
    descripcion: 'Juan envía email advirtiendo que no ingresará más si continúan las retiradas injustificadas de la cuenta común.',
    actores: ['Juan'],
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase', text: 'doc 1' },
    tags: ['comunicacion', 'defensa', 'prueba'],
  },
  {
    id: 'evt-q-011',
    fecha: '2025-05-01',
    tipo: 'payment',
    titulo: 'Mayo 2025 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en mayo 2025.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-012',
    fecha: '2025-06-01',
    tipo: 'payment',
    titulo: 'Junio 2025 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en junio 2025.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-013',
    fecha: '2025-07-01',
    tipo: 'payment',
    titulo: 'Julio 2025 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en julio 2025.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-014',
    fecha: '2025-08-01',
    tipo: 'payment',
    titulo: 'Agosto 2025 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en agosto 2025.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-015',
    fecha: '2025-09-01',
    tipo: 'payment',
    titulo: 'Septiembre 2025 - Mes reclamado',
    descripcion: 'Vicenta alega impago de 200€ en septiembre 2025.',
    actores: ['Vicenta'],
    importeCents: 20000,
    disputed: true,
    fuente: { doc: 'demanda_ejecucion.pdf', support: 'paraphrase' },
    tags: ['impago-alegado', 'reclamacion'],
  },
  {
    id: 'evt-q-016',
    fecha: '2025-10-01',
    tipo: 'payment',
    titulo: 'Transferencia Juan 200€',
    descripcion: 'Juan transfiere 200€ a la cuenta común.',
    actores: ['Juan'],
    importeCents: 20000,
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase' },
    tags: ['pago', 'defensa', 'acreditado'],
  },
  {
    id: 'evt-q-017',
    fecha: '2025-10-06',
    tipo: 'payment',
    titulo: 'Transferencia Juan 200€',
    descripcion: 'Juan transfiere 200€ a la cuenta común.',
    actores: ['Juan'],
    importeCents: 20000,
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase' },
    tags: ['pago', 'defensa', 'acreditado'],
  },
  {
    id: 'evt-q-018',
    fecha: '2025-10-15',
    tipo: 'payment',
    titulo: 'Transferencia Juan 200€',
    descripcion: 'Juan transfiere 200€ a la cuenta común (antes del despacho de ejecución).',
    actores: ['Juan'],
    importeCents: 20000,
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase' },
    tags: ['pago', 'defensa', 'acreditado', 'pre-ejecucion'],
  },
  {
    id: 'evt-q-019',
    fecha: '2025-10-30',
    tipo: 'judicial',
    titulo: 'Auto y Decreto despacho ejecución',
    descripcion: 'Juzgado dicta Auto y Decreto despachando ejecución por 2.400€ y decretando embargo de cuentas y devoluciones tributarias.',
    actores: ['Juzgado'],
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase' },
    tags: ['ejecucion', 'auto', 'embargo'],
  },
  {
    id: 'evt-q-020',
    fecha: '2025-11-06',
    tipo: 'judicial',
    titulo: 'Notificación a Juan del despacho',
    descripcion: 'Juan es notificado del Auto y Decreto de ejecución.',
    actores: ['Juan', 'Juzgado'],
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'quote', text: 'notificado 6/11/2025' },
    tags: ['notificacion', 'ejecucion'],
  },
  {
    id: 'evt-q-021',
    fecha: '2025-11-14',
    tipo: 'bank_event',
    titulo: 'Certificado extracto Openbank',
    descripcion: 'Se obtiene certificado del extracto de la cuenta común en Openbank, acreditando movimientos y uso indebido alegado.',
    actores: ['Juan', 'Openbank'],
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase' },
    tags: ['prueba', 'extracto', 'defensa'],
  },
  {
    id: 'evt-q-022',
    fecha: '2025-11-14',
    tipo: 'payment',
    titulo: 'Transferencia Juan 200€',
    descripcion: 'Juan transfiere 200€ a la cuenta común.',
    actores: ['Juan'],
    importeCents: 20000,
    disputed: false,
    fuente: { doc: 'OPOSICION ETJ JRC.pdf', support: 'paraphrase' },
    tags: ['pago', 'defensa', 'acreditado'],
  },
  {
    id: 'evt-q-023',
    fecha: '2025-12-15',
    tipo: 'judicial',
    titulo: 'Diligencia de ordenación',
    descripcion: 'Diligencia de ordenación mencionada en impugnación.',
    actores: ['Juzgado'],
    disputed: false,
    fuente: { doc: 'Quart_impugnac oposic dda ejecución.pdf', support: 'paraphrase' },
    tags: ['procesal'],
  },

  // 2026
  {
    id: 'evt-q-024',
    fecha: '2026-01-14',
    tipo: 'judicial',
    titulo: 'Providencia señalando vista',
    descripcion: 'Providencia de la Juez Sandra Lozano López señalando vista para el 23/04/2026 a las 09:30. Se tiene por impugnada la oposición.',
    actores: ['Juzgado'],
    disputed: false,
    fuente: { doc: 'Prov acuerda celebración de VISTA.pdf', support: 'quote', text: 'Vista: 23/04/2026 a las 09:30' },
    tags: ['providencia', 'vista', 'señalamiento'],
  },
  {
    id: 'evt-q-025',
    fecha: '2026-04-23',
    tipo: 'judicial',
    titulo: 'VISTA ORAL',
    descripcion: 'Celebración de la vista oral en el procedimiento de oposición a la ejecución 1428.1/2025. Hora: 09:30.',
    actores: ['Juzgado', 'Juan', 'Vicenta'],
    disputed: false,
    fuente: { doc: 'Prov acuerda celebración de VISTA.pdf', support: 'quote' },
    tags: ['vista', 'audiencia', 'critico'],
  },
];

// ============================================
// FUNCIONES DE ACCESO
// ============================================

export function getEventosPorTipo(tipo: EventoQuart['tipo']): EventoQuart[] {
  return timelineQuart.filter((e) => e.tipo === tipo);
}

export function getEventosDisputados(): EventoQuart[] {
  return timelineQuart.filter((e) => e.disputed);
}

export function getEventosPorActor(actor: string): EventoQuart[] {
  return timelineQuart.filter((e) => e.actores.includes(actor));
}

export function getEventosProximos(): EventoQuart[] {
  const hoy = new Date().toISOString().split('T')[0];
  return timelineQuart.filter((e) => e.fecha > hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function getEventosCriticos(): EventoQuart[] {
  return timelineQuart.filter((e) => e.tags.includes('critico') || e.tags.includes('vista'));
}

export function calcularTotalReclamado(): number {
  return timelineQuart
    .filter((e) => e.tags.includes('impago-alegado'))
    .reduce((sum, e) => sum + (e.importeCents || 0), 0);
}

export function calcularTotalPagadoJuan(): number {
  return timelineQuart
    .filter((e) => e.tags.includes('pago') && e.actores.includes('Juan'))
    .reduce((sum, e) => sum + (e.importeCents || 0), 0);
}
