// ============================================
// TIMELINE CASO MISLATA - J.V. 1185/2025
// Cronología estructurada de eventos
// ============================================

export interface EventoMislata {
  id: string;
  fecha: string;
  tipo: 'judicial' | 'impago' | 'payment' | 'email' | 'hipoteca';
  titulo: string;
  descripcion: string;
  actores: string[];
  importeCents?: number;
  disputed: boolean;
  fuente?: {
    doc: string;
    page?: number;
  };
  tags: string[];
}

export const timelineMislata: EventoMislata[] = [
  {
    id: 'evt-m-001',
    fecha: '2023-10-31',
    tipo: 'impago',
    titulo: 'Inicio impago 50% hipoteca',
    descripcion: 'Inicio del impago del 50% de la cuota hipotecaria compartida.',
    actores: ['Vicenta'],
    disputed: false,
    tags: ['impago', 'hipoteca'],
  },
  {
    id: 'evt-m-002',
    fecha: '2025-09-24',
    tipo: 'judicial',
    titulo: 'Presentación demanda J.V. 1185/2025',
    descripcion: 'Se presenta demanda de reclamación de cuotas hipotecarias.',
    actores: ['Juan'],
    disputed: false,
    tags: ['demanda'],
  },
  {
    id: 'evt-m-003',
    fecha: '2025-11-19',
    tipo: 'judicial',
    titulo: 'Admisión a trámite',
    descripcion: 'El Juzgado admite a trámite la demanda.',
    actores: ['Juzgado'],
    disputed: false,
    tags: ['admision'],
  },
  {
    id: 'evt-m-004',
    fecha: '2025-12-19',
    tipo: 'judicial',
    titulo: 'Impugnación recurso reposición',
    descripcion: 'Impugnación del recurso de reposición presentado en el procedimiento.',
    actores: ['Juan'],
    disputed: false,
    tags: ['impugnacion', 'recurso'],
  },
];

// ============================================
// FUNCIONES DE ACCESO
// ============================================

export function getEventosPorTipo(tipo: EventoMislata['tipo']): EventoMislata[] {
  return timelineMislata.filter((e) => e.tipo === tipo);
}

export function getEventosDisputados(): EventoMislata[] {
  return timelineMislata.filter((e) => e.disputed);
}

export function getEventosPorActor(actor: string): EventoMislata[] {
  return timelineMislata.filter((e) => e.actores.includes(actor));
}

export function getEventosProximos(): EventoMislata[] {
  const hoy = new Date().toISOString().split('T')[0];
  return timelineMislata.filter((e) => e.fecha > hoy).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export function getEventosCriticos(): EventoMislata[] {
  return timelineMislata.filter((e) => e.tags.includes('impago') || e.tags.includes('demanda'));
}
