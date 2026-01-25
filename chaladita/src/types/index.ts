// Core Types for Chaladita.net

export interface Procedimiento {
  id: string;
  titulo: string;
  juzgado: string;
  autos: string;
  tipo: 'ordinario' | 'ejecucion' | 'verbal';
  cuantia: number;
  estado: 'activo' | 'suspendido' | 'resuelto';
  proximoHito?: Hito;
  estrategias: Estrategia[];
  color: string;
  icon: string;
}

export interface Hito {
  fecha: string;
  evento: string;
  descripcion?: string;
  completado?: boolean;
}

export interface Estrategia {
  id: string;
  tipo: 'prescripcion' | 'impugnacion' | 'litispendencia' | 'compensacion' | 'oposicion';
  titulo: string;
  fundamento: string;
  estado: 'activo' | 'pendiente' | 'aplicado' | 'desestimado';
  descripcion: string;
  documentosRef?: string[];
}

export interface Documento {
  id: string;
  nombre: string;
  tipo: 'demanda' | 'contestacion' | 'extracto' | 'nomina' | 'factura' | 'recurso' | 'otro';
  procedimientoId: string;
  etiquetas: string[];
  descripcion: string;
  fechaDoc?: string;
  referencia?: string; // e.g., "Doc. 25"
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
