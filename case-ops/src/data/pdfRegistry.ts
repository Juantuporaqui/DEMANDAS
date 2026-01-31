// ============================================
// REGISTRO DE PDFs - Documentos del Expediente
// ============================================
// Cuando subas un PDF a public/docs/{caso}/, añádelo aquí
// para que aparezca en la pestaña Documentos.

export interface PDFDocument {
  id: string;
  titulo: string;
  archivo: string;  // Nombre del archivo en public/docs/{caso}/
  descripcion?: string;
  tipo: 'demanda' | 'contestacion' | 'sentencia' | 'escrito' | 'prueba' | 'otro';
  fecha?: string;   // YYYY-MM-DD
  paginas?: number;
}

export interface PDFRegistroCaso {
  caso: 'picassent' | 'mislata' | 'quart';
  titulo: string;
  documentos: PDFDocument[];
}

// ============================================
// CASO PICASSENT - P.O. 715/2024
// ============================================
export const pdfsPicassent: PDFDocument[] = [
  // Ejemplo - descomenta y modifica cuando subas PDFs:
  // {
  //   id: 'pdf-pic-001',
  //   titulo: 'Demanda de División de Cosa Común',
  //   archivo: 'Doc_01_Demanda.pdf',
  //   descripcion: 'Demanda presentada por Vicenta',
  //   tipo: 'demanda',
  //   fecha: '2024-06-20',
  // },
];

// ============================================
// CASO MISLATA - J.V. 1185/2025
// ============================================
export const pdfsMislata: PDFDocument[] = [
  // Ejemplo:
  // {
  //   id: 'pdf-mis-001',
  //   titulo: 'Demanda de Reclamación de Cantidad',
  //   archivo: 'Demanda_Reclamacion.pdf',
  //   tipo: 'demanda',
  // },
];

// ============================================
// CASO QUART - ETJ 1428/2025
// ============================================
export const pdfsQuart: PDFDocument[] = [
   {
    id: 'pdf-qua-001',
    titulo: 'Sentencia de Divorcio 362/2023',
    archivo: 'Doc_01_SentenciaDivorcio.pdf',
    tipo: 'sentencia',
    fecha: '2023-10-17',
    descripcion: 'Título judicial que se ejecuta'
   },
   {
    id: 'pdf-qua-002',
    titulo: 'Demanda de Ejecución',
    archivo: 'Doc_02_DemandaEjecucion.pdf',
    tipo: 'demanda',
    descripcion: 'Escrito inicial de ejecución de títulos judiciales'
   },
   {
    id: 'pdf-qua-003',
    titulo: 'Oposición a la Ejecución',
    archivo: 'Doc_03_OposicionEjecucion.pdf',
    tipo: 'contestacion',
    descripcion: 'Oposición presentada por la parte ejecutada'
   },
   {
    id: 'pdf-qua-004',
    titulo: 'Impugnación de la Oposición',
    archivo: 'Doc_04_ImpugnacionOposicion.pdf',
    tipo: 'escrito',
    descripcion: 'Escrito impugnando los motivos de oposición'
   }
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

export function getPDFUrl(caso: 'picassent' | 'mislata' | 'quart', archivo: string): string {
  return `/docs/${caso}/${archivo}`;
}

export function getAllPDFs(): PDFDocument[] {
  return [...pdfsPicassent, ...pdfsMislata, ...pdfsQuart];
}

// Tipos de documento con iconos
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
