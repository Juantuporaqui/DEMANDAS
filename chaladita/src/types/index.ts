// Core Types for Chaladita.net - Sistema de Apoyo a Litigio
// Modelo de datos central y unificado

// ============================================
// MODELO CENTRAL: PROCEDIMIENTO
// ============================================

export interface Procedimiento {
  id: string;
  titulo: string;
  juzgado: string;
  autos: string;
  tipo: 'ordinario' | 'ejecucion' | 'verbal';
  cuantia: number;
  estado: 'activo' | 'suspendido' | 'resuelto';
  fechaInicio: string;
  fechaUltimaActuacion?: string;
  color: string;
  icon: string;
  descripcion?: string;
  // Campos para compatibilidad con código existente
  proximoHito?: Hito;
  estrategias?: EstrategiaLegacy[];
}

// Tipo legacy para estrategias en procedimientos (compatibilidad)
export interface EstrategiaLegacy {
  id: string;
  tipo: string;
  titulo: string;
  fundamento: string;
  estado: string;
  descripcion: string;
  documentosRef?: string[];
}

// ============================================
// CRONOLOGÍA
// ============================================

export interface EventoCronologia {
  id: string;
  procesoId: string;
  fecha: string;
  tipo: 'demanda' | 'contestacion' | 'audiencia' | 'sentencia' | 'recurso' | 'notificacion' | 'hito' | 'otro';
  titulo: string;
  descripcion?: string;
  pasado: boolean; // true = ya ocurrió, false = futuro
  importancia: 'alta' | 'media' | 'baja';
  completado?: boolean;
}

// ============================================
// RECLAMACIONES (PRETENSIONES)
// ============================================

export type ProbabilidadExito = 'alta' | 'media' | 'baja' | 'prescrito' | 'desestimado';

export interface Reclamacion {
  id: string;
  procesoId: string;
  titulo: string; // Título corto (1-2 palabras para tile)
  importe: number;
  estado: 'activo' | 'prescrito' | 'desestimado' | 'estimado' | 'pendiente';
  probabilidad: ProbabilidadExito;
  color: string; // Color hex para el tile
  descripcionCorta: string; // Resumen ejecutivo
  descripcionLarga: string; // Desarrollo completo
  fundamentoJuridico?: string;
  documentosIds: string[];
  hechosIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// HECHOS
// ============================================

export type NivelRiesgo = 'alto' | 'medio' | 'bajo' | 'ninguno';

export interface Hecho {
  id: string;
  procesoId: string;
  titulo: string;
  resumenCorto: string; // Para vista lista
  desarrolloLargo: string; // Para vista detalle
  riesgo: NivelRiesgo;
  contraargumentoEsperado?: string;
  respuestaContraargumento?: string;
  documentosIds: string[];
  orden: number; // Para ordenar en lista
  fechaHecho?: string; // Cuándo ocurrió el hecho
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TAREAS
// ============================================

export type PrioridadTarea = 'urgente' | 'alta' | 'normal' | 'baja';
export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';

export interface Tarea {
  id: string;
  procesoId: string;
  titulo: string;
  descripcion?: string;
  dueDate?: string;
  estado: EstadoTarea;
  prioridad: PrioridadTarea;
  linkedIds: {
    hechoId?: string;
    reclamacionId?: string;
    documentoId?: string;
    estrategiaId?: string;
  };
  completadaAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ESTRATEGIAS
// ============================================

export type TipoEstrategia = 'prescripcion' | 'impugnacion' | 'litispendencia' | 'compensacion' | 'oposicion' | 'jurisprudencia' | 'otro';
export type EstadoEstrategia = 'activo' | 'pendiente' | 'aplicado' | 'desestimado';

export interface Estrategia {
  id: string;
  procesoId: string;
  tipo: TipoEstrategia;
  titulo: string;
  resumenEjecutivo: string; // Resumen corto
  desarrolloCompleto: string; // Desarrollo largo
  fundamentoLegal?: string;
  estado: EstadoEstrategia;
  documentosIds: string[];
  jurisprudenciaIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// DOCUMENTOS
// ============================================

export type TipoDocumento = 'demanda' | 'contestacion' | 'extracto' | 'nomina' | 'factura' | 'recurso' | 'sentencia' | 'auto' | 'providencia' | 'certificado' | 'contrato' | 'email' | 'mensaje' | 'foto' | 'otro';

export interface Documento {
  id: string;
  nombre: string;
  tipo: TipoDocumento;
  tamaño?: number; // bytes
  fechaDocumento?: string; // Fecha del documento
  fechaSubida: string;
  tags: string[];
  descripcion?: string;
  referencia?: string; // e.g., "Doc. 25"
  linkedTo: {
    procesoId: string;
    hechoId?: string;
    reclamacionId?: string;
    estrategiaId?: string;
  };
  // Para almacenamiento local
  contenidoBase64?: string; // Solo para archivos pequeños
  blobKey?: string; // Key para IndexedDB blobs
  mimeType?: string;
}

// ============================================
// JURISPRUDENCIA
// ============================================

export type TipoJurisprudencia = 'STS' | 'STC' | 'SAP' | 'STSJ' | 'Auto' | 'Circular' | 'Otro';

export interface Jurisprudencia {
  id: string;
  referencia: string; // e.g., "STS 458/2025"
  tipo: TipoJurisprudencia;
  tribunal: string;
  fecha: string;
  resumen: string;
  extractosRelevantes: string[]; // Párrafos cortos
  notasDeUso: string; // Cómo aplica a tu caso
  linkedTo: {
    procesosIds: string[];
    reclamacionesIds: string[];
    hechosIds: string[];
    estrategiasIds: string[];
  };
  url?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CONFIGURACIÓN DE USUARIO
// ============================================

export interface ConfigUsuario {
  modoJuicio: boolean;
  temaOscuro: boolean;
  notificacionesActivas: boolean;
  ultimoBackup?: string;
}

// ============================================
// TIPOS AUXILIARES (compatibilidad con código existente)
// ============================================

export interface Hito {
  fecha: string;
  evento: string;
  descripcion?: string;
  completado?: boolean;
}

export interface GastoPersonal {
  id: string;
  categoria: string;
  concepto: string;
  importe: number;
  fecha: string;
  pagadoPor: 'vicenta' | 'juan';
  tipoGasto: 'personal' | 'hijos' | 'comun';
  documentoRef?: string;
}

export interface Nomina {
  periodo: string;
  año: number;
  mes: number;
  juan: number;
  vicenta: number;
}

export interface MovimientoBancario {
  fecha: string;
  concepto: string;
  importe: number;
  cuenta: string;
  tipo: 'ingreso' | 'retiro' | 'transferencia';
  persona: 'juan' | 'vicenta' | 'comun';
}

export interface ChecklistItem {
  id: string;
  texto: string;
  completado: boolean;
  categoria: string;
  articuloLEC?: string;
  notas?: string;
}

export interface Activo {
  id: string;
  nombre: string;
  tipo: 'inmueble' | 'vehiculo' | 'cuenta' | 'negocio' | 'otro';
  caracter: 'privativo' | 'ganancial';
  titular: 'juan' | 'vicenta' | 'ambos';
  valorEstimado?: number;
  fechaAdquisicion?: string;
  documentacion: string;
}

export interface Evidencia {
  id: string;
  tipo: 'email' | 'mensaje' | 'documento' | 'declaracion';
  fecha: string;
  descripcion: string;
  contenido: string;
  relevancia: 'mala_fe' | 'contradiccion' | 'favorable';
}

export interface AuditoriaGastos {
  vicentaPersonal: number;
  juanDirectoHijos: number;
  saldoCompensable: number;
  detalleVicenta: GastoPersonal[];
  detalleJuan: GastoPersonal[];
}

export interface ComparativaDoc {
  id: string;
  titulo: string;
  docOriginal: {
    referencia: string;
    descripcion: string;
    datos: Record<string, string | number>;
  };
  docManipulado: {
    referencia: string;
    descripcion: string;
    datos: Record<string, string | number>;
  };
  discrepancias: string[];
}

// ============================================
// TIPOS PARA EL STORE
// ============================================

export interface LitigationState {
  // Entidades principales
  procedimientos: Procedimiento[];
  cronologia: EventoCronologia[];
  reclamaciones: Reclamacion[];
  hechos: Hecho[];
  tareas: Tarea[];
  estrategias: Estrategia[];
  documentos: Documento[];
  jurisprudencia: Jurisprudencia[];

  // Configuración
  config: ConfigUsuario;

  // Metadatos
  schemaVersion: number;
  lastUpdated: string;
}

// ============================================
// TIPOS PARA BACKUP/IMPORT
// ============================================

export interface BackupData {
  version: string;
  schemaVersion: number;
  exportedAt: string;
  data: LitigationState;
}

// ============================================
// SELECTORES DERIVADOS (tipos de retorno)
// ============================================

export interface EstadisticasGlobales {
  totalReclamado: number;
  totalDiscutido: number;
  totalPrescrito: number;
  procedimientosActivos: number;
  tareasPendientes: number;
  hechosTotal: number;
  hechosSinDocumentos: number;
  estrategiasActivas: number;
  proximosHitos30Dias: EventoCronologia[];
  reclamacionesPorProbabilidad: {
    alta: number;
    media: number;
    baja: number;
    prescrito: number;
    desestimado: number;
  };
}
