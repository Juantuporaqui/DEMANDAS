// ============================================
// AUTO-DETECTOR DE DOCUMENTOS
// ============================================
// Este módulo escanea automáticamente las carpetas de cada caso
// y carga cualquier archivo .html o .txt que encuentre.
//
// Para añadir un documento:
// 1. Sube el archivo HTML a la carpeta correspondiente:
//    - src/data/quart/       → Caso Quart (ETJ 1428/2025)
//    - src/data/mislata/     → Caso Mislata (J.V. 1185/2025)
//    - src/data/picassent/   → Caso Picassent (P.O. 715/2024)
// 2. El nombre del archivo se convierte en el título del documento
// 3. Al hacer build, el documento aparece automáticamente
// ============================================

// Importar todos los archivos HTML de cada carpeta
const quartDocs = import.meta.glob('./quart/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const mislataDocs = import.meta.glob('./mislata/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const picassentDocs = import.meta.glob('./picassent/*.html', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

// También soportar archivos .txt
const quartDocsTxt = import.meta.glob('./quart/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const mislataDocsTxt = import.meta.glob('./mislata/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const picassentDocsTxt = import.meta.glob('./picassent/*.txt', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export interface AutoDocument {
  id: string;
  filename: string;
  title: string;
  content: string;
  caso: 'quart' | 'mislata' | 'picassent';
  extension: 'html' | 'txt';
}

// Función para extraer el nombre limpio del archivo
function cleanFilename(path: string): { filename: string; title: string; extension: 'html' | 'txt' } {
  // Ejemplo: "./quart/SENTENCIA_DIVORCIO.html" → "SENTENCIA_DIVORCIO"
  const parts = path.split('/');
  const filenameWithExt = parts[parts.length - 1];
  const extension = filenameWithExt.endsWith('.html') ? 'html' : 'txt';
  const filename = filenameWithExt.replace(/\.(html|txt)$/, '');

  // Convertir SNAKE_CASE a título legible
  const title = filename
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return { filename, title, extension };
}

// Procesar documentos de una carpeta
function processFolder(
  docs: Record<string, string>,
  caso: 'quart' | 'mislata' | 'picassent'
): AutoDocument[] {
  return Object.entries(docs).map(([path, content]) => {
    const { filename, title, extension } = cleanFilename(path);
    return {
      id: `auto-${caso}-${filename.toLowerCase()}`,
      filename,
      title,
      content,
      caso,
      extension,
    };
  });
}

// Combinar todos los documentos de cada carpeta
const quartDocuments: AutoDocument[] = [
  ...processFolder(quartDocs, 'quart'),
  ...processFolder(quartDocsTxt, 'quart'),
];

const mislataDocuments: AutoDocument[] = [
  ...processFolder(mislataDocs, 'mislata'),
  ...processFolder(mislataDocsTxt, 'mislata'),
];

const picassentDocuments: AutoDocument[] = [
  ...processFolder(picassentDocs, 'picassent'),
  ...processFolder(picassentDocsTxt, 'picassent'),
];

// Exportar documentos por caso
export const AUTO_DOCS = {
  quart: quartDocuments,
  mislata: mislataDocuments,
  picassent: picassentDocuments,
};

// Obtener todos los documentos de un caso
export function getDocumentsByCaso(caso: 'quart' | 'mislata' | 'picassent'): AutoDocument[] {
  return AUTO_DOCS[caso] || [];
}

// Obtener un documento por su ID
export function getDocumentById(id: string): AutoDocument | undefined {
  const allDocs = [...quartDocuments, ...mislataDocuments, ...picassentDocuments];
  return allDocs.find(doc => doc.id === id);
}

// Crear mapa para LEGAL_DOCS_MAP (compatibilidad)
export function createLegalDocsMap(): Record<string, string> {
  const map: Record<string, string> = {};

  [...quartDocuments, ...mislataDocuments, ...picassentDocuments].forEach(doc => {
    map[doc.id] = doc.content;
  });

  return map;
}

// Log de documentos detectados (para debug)
console.log(`📂 Auto-detectados: Quart=${quartDocuments.length}, Mislata=${mislataDocuments.length}, Picassent=${picassentDocuments.length}`);
