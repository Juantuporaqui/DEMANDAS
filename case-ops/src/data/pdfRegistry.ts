// ============================================
// REGISTRO DE PDFs - Documentos del Expediente
// ============================================
//
// INSTRUCCIONES:
// 1. Sube tu PDF a: public/docs/{caso}/
// 2. Añade UNA línea usando pdf('archivo.pdf','Título','tipo')
//
// Tipos: 'demanda' | 'contestacion' | 'sentencia' | 'escrito' | 'prueba' | 'otro'
//
// ============================================

export interface PDFDocument {
  id: string;
  titulo: string;
  archivo: string;
  descripcion?: string;
  tipo: 'demanda' | 'contestacion' | 'sentencia' | 'escrito' | 'prueba' | 'otro';
  fecha?: string;
  paginas?: number;
}

export interface PDFRegistroCaso {
  caso: 'picassent' | 'mislata' | 'quart';
  titulo: string;
  documentos: PDFDocument[];
}

// ============================================
// HELPER
// ============================================
let pdfCounter = 0;
function pdf(
  archivo: string,
  titulo: string,
  tipo: PDFDocument['tipo'] = 'otro',
  extras?: { descripcion?: string; fecha?: string }
): PDFDocument {
  pdfCounter++;
  return {
    id: `pdf-${pdfCounter.toString().padStart(3, '0')}`,
    archivo,
    titulo,
    tipo,
    ...extras
  };
}

// ============================================
// CASO PICASSENT - P.O. 715/2024
// ============================================
export const pdfsPicassent: PDFDocument[] = [
  pdf('Doc-03-retirada 38500_Vicen.pdf', 'Retirada de 38.500 € en efectivo (Vicenta)', 'prueba', {
    descripcion: 'Justificante de retirada en efectivo atribuida a la demandada',
  }),

  pdf('Doc-04_Respuesta_reque Hacienda.pdf', 'Respuesta a requerimiento de Hacienda', 'prueba', {
    descripcion: 'Documento de la AEAT sobre movimientos económicos',
  }),

  pdf('Doc-13_Retiradas_Efectivo_BBVA_2008.pdf', 'Extracto de retiradas de efectivo BBVA (2008)', 'prueba', {
    descripcion: 'Relación de disposiciones en efectivo relevantes',
  }),

  pdf('Doc-15_EXTRACTO_RETIRADA VOLVO.pdf', 'Extracto retirada vehículo Volvo', 'prueba', {
    descripcion: 'Movimiento bancario asociado a retirada para adquisición de vehículo',
  }),

  pdf('Doc-18_Deposito_subasta.pdf', 'Depósito para subasta judicial', 'prueba', {
    descripcion: 'Justificante de consignación judicial',
  }),

  pdf('Doc-26_Demostracion_grafica_manipulacion.pdf', 'Demostración gráfica de manipulación económica', 'prueba', {
    descripcion: 'Informe gráfico explicativo de inconsistencias contables',
  }),
];

// ============================================
// CASO MISLATA - J.V. 1185/2025
// ============================================
export const pdfsMislata: PDFDocument[] = [
  pdf('Doc_02_RecursoReposicion.pdf', 'Recurso de reposición', 'escrito'),
  pdf('Doc_03_Impugnacion.pdf', 'Impugnación', 'escrito'),
  pdf('Doc_06_AlegacionesImpugnacion.pdf', 'Alegaciones a la impugnación', 'escrito'),
  pdf('Doc_07_ContrPrueba.pdf', 'Contradicción / impugnación de prueba', 'prueba'),
  pdf('Doc_08_SolPrueba.pdf', 'Solicitud de prueba', 'prueba'),
];

// ============================================
// CASO QUART - ETJ 1428/2025
// ============================================
export const pdfsQuart: PDFDocument[] = [
  pdf('Doc_01_SentenciaDivorcio.pdf', 'Sentencia de Divorcio 362/2023', 'sentencia', {
    fecha: '2023-10-17',
    descripcion: 'Título judicial ejecutado',
  }),

  pdf('Doc_02_DemandaEjecucion.pdf', 'Demanda de Ejecución', 'demanda', {
    descripcion: 'Escrito inicial de ejecución',
  }),

  pdf('Doc_03_OposicionEjecucion.pdf', 'Oposición a la ejecución', 'contestacion', {
    descripcion: 'Oposición formulada por la parte ejecutada',
  }),

  pdf('Doc_04_ImpugnacionOposicion.pdf', 'Impugnación de la oposición', 'escrito', {
    descripcion: 'Impugnación presentada por la parte contraria',
  }),
];

// ============================================
// FUNCIONES
// ============================================
export function getPDFsByCaso(caso: 'picassent' | 'mislata' | 'quart'): PDFDocument[] {
  switch (caso) {
    case 'picassent': return pdfsPicassent;
    case 'mislata': return pdfsMislata;
    case 'quart': return pdfsQuart;
    default: return [];
  }
}

export function getPDFUrl(caso: 'picassent' | 'mislata' | 'quart', archivo: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}docs/${caso}/${archivo}`;
}

export function getAllPDFs(): PDFDocument[] {
  return [...pdfsPicassent, ...pdfsMislata, ...pdfsQuart];
}

// ============================================
// ICONOS Y COLORES
// ============================================
export const tipoDocIcons: Record<PDFDocument['tipo'], string> = {
  demanda: '📜',
  contestacion: '🛡️',
  sentencia: '⚖️',
  escrito: '📝',
  prueba: '📎',
  otro: '📄',
};

export const tipoDocColors: Record<PDFDocument['tipo'], string> = {
  demanda: 'amber',
  contestacion: 'emerald',
  sentencia: 'blue',
  escrito: 'violet',
  prueba: 'cyan',
  otro: 'slate',
};
