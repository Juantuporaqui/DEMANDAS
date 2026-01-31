// ============================================
// REGISTRO DE PDFs - Documentos del Expediente
// ============================================
//
// INSTRUCCIONES SIMPLIFICADAS:
// 1. Sube tu PDF a:  public/docs/{caso}/  (ej: public/docs/quart/MiDocumento.pdf)
// 2. Añade UNA línea abajo usando la función pdf():
//    pdf('MiDocumento.pdf', 'Título visible', 'escrito')
//
// Tipos disponibles: 'demanda' | 'contestacion' | 'sentencia' | 'escrito' | 'prueba' | 'otro'
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
// FUNCIÓN HELPER - Simplifica añadir PDFs
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
  // pendiente de carga
];

// ============================================
// CASO MISLATA - J.V. 1185/2025
// ============================================
export const pdfsMislata: PDFDocument[] = [
  pdf('Doc_02_RecursoReposicion.pdf', 'Recurso de reposición', 'escrito', {
    descripcion: 'Recurso de reposición presentado en el procedimiento',
  }),

  pdf('Doc_03_Impugnacion.pdf', 'Impugnación', 'escrito', {
    descripcion: 'Impugnación al escrito presentado por la parte contraria',
  }),

  pdf('Doc_04_ContestacionDemanda.pdf', 'Contestación a la demanda', 'contestacion', {
    descripcion: 'Escrito de contestación a la demanda principal',
  }),

  pdf('Doc_06_AlegacionesImpugnacion.pdf', 'Alegaciones a la impugnación', 'escrito', {
    descripcion: 'Alegaciones frente a la impugnación presentada',
  }),

  pdf('Doc_07_ContrPrueba.pdf', 'Contradicción / impugnación de prueba', 'prueba', {
    descripcion: 'Escrito de oposición o contradicción a la prueba propuesta',
  }),

  pdf('Doc_08_SolPrueva.pdf', 'Solicitud de prueba', 'prueba', {
    descripcion: 'Escrito de proposición de prueba',
  }),
];

// ============================================
// CASO QUART - ETJ 1428/2025
// ============================================
export const pdfsQuart: PDFDocument[] = [
  pdf(
    'Doc_01_SentenciaDivorcio.pdf',
    'Sentencia de Divorcio 362/2023',
    'sentencia',
    { fecha: '2023-10-17', descripcion: 'Título judicial que se ejecuta' }
  ),
  pdf(
    'Doc_02_DemandaEjecucion.pdf',
    'Demanda de Ejecución',
    'demanda',
    { descripcion: 'Escrito inicial de ejecución' }
  ),
  pdf(
    'Doc_03_OposicionEjecucion.pdf',
    'Oposición a la Ejecución',
    'contestacion',
    { descripcion: 'Oposición formulada a la ejecución' }
  ),
  pdf(
    'Doc_04_ImpugnacionOposicion.pdf',
    'Impugnación de la Oposición',
    'escrito',
    { descripcion: 'Impugnación presentada por la parte contraria' }
  ),
];

// ============================================
// FUNCIONES DE ACCESO
// ============================================
export function getPDFsByCaso(caso: 'picassent' | 'mislata' | 'quart'): PDFDocument[] {
  switch (caso) {
    case 'picassent': return pdfsPicassent;
    case 'mislata': return pdfsMislata;
    case 'quart': return pdfsQuart;
    default: return [];
  }
}

export function getPDFUrl(
  caso: 'picassent' | 'mislata' | 'quart',
  archivo: string
): string {
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
