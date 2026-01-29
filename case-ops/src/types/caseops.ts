// ============================================
// CHALADITA CASE-OPS - Type Definitions
// Nueva DB aislada para Chaladita
// ============================================

// Estados de Procedimiento
export type EstadoProcedimiento =
  | 'Preparación'
  | 'En trámite'
  | 'Señalado'
  | 'Ejecución'
  | 'Cerrado';

// Nivel de Riesgo
export type Riesgo = 'bajo' | 'medio' | 'alto';

// Tipos de Documento
export type TipoDocumento =
  | 'sentencia'
  | 'convenio'
  | 'demanda'
  | 'contestacion'
  | 'extracto'
  | 'resolucion'
  | 'whatsapp'
  | 'correo'
  | 'escritura'
  | 'recibo'
  | 'otro';

// Estado de Partida Económica
export type EstadoPartida = 'reclamada' | 'discutida' | 'admitida';

// Tipo de Prescripción
export type TipoPrescripcion = 'no' | 'si' | 'parcial' | 'posible';

// Prioridad de Tarea
export type PrioridadTarea = 'baja' | 'media' | 'alta';

// Estado de Tarea
export type EstadoTarea = 'pendiente' | 'hecha' | 'bloqueada';

// Tipo de Timeline
export type TipoTimeline = 'hito' | 'hecho' | 'documento' | 'audiencia' | 'recordatorio';

// ============================================
// Interfaces principales
// ============================================

export interface ProcedimientoCase {
  id: string;
  nombre: string;
  juzgado: string;
  autos: string;
  estado: EstadoProcedimiento;
  objetivoInmediato: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface HechoCase {
  id: string;
  procedimientoId: string;
  titulo: string;
  fecha: string; // ISO date o rango "2023-01-01/2023-06-30"
  tesis: string;
  antitesisEsperada: string;
  riesgo: Riesgo;
  fuerza: number; // 1-5
  resumenCorto: string;
  tags: string[];
  pruebasEsperadas: string[];
  createdAt: number;
  updatedAt: number;
}

export interface DocumentoCase {
  id: string;
  procedimientoId: string;
  tipo: TipoDocumento;
  fecha: string; // ISO date
  fuente: string;
  descripcion: string;
  tags: string[];
  hechosIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface PartidaEconomica {
  id: string;
  procedimientoId: string;
  concepto: string;
  importe: number; // en céntimos
  estado: EstadoPartida;
  prescripcion: TipoPrescripcion;
  soportes: string[]; // IDs de documentos
  resumen: string;
  createdAt: number;
  updatedAt: number;
}

export interface HitoProc {
  id: string;
  procedimientoId: string;
  fecha: string; // ISO date
  titulo: string;
  detalle: string;
  createdAt: number;
  updatedAt: number;
}

export interface TareaProc {
  id: string;
  procedimientoId: string;
  titulo: string;
  detalle?: string;
  prioridad: PrioridadTarea;
  fechaLimite: string; // ISO date
  estado: EstadoTarea;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface LinkProc {
  id: string;
  fromId: string;
  toId: string;
  relationType: string;
  createdAt: number;
  updatedAt: number;
}

export interface TimelineItem {
  id: string;
  procedimientoId: string;
  fecha: string; // ISO date
  tipo: TipoTimeline;
  evento: string;
  refId?: string;
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Seed Data Interface
// ============================================

export interface SeedData {
  procedimientos: ProcedimientoCase[];
  hechos: HechoCase[];
  documentos: DocumentoCase[];
  partidas: PartidaEconomica[];
  hitos: HitoProc[];
  tareas: TareaProc[];
  links: LinkProc[];
  timeline: TimelineItem[];
}

// ============================================
// Timeline Agregado (para cronología)
// ============================================

export interface TimelineItemAgg {
  id: string;
  procedimientoId: string;
  fecha: string;
  tipo: TipoTimeline | 'partida' | 'tarea';
  evento: string;
  refId?: string;
  color?: string;
  importancia?: number;
}
