/**
 * Registro central de archivos PDF disponibles en la aplicación.
 * Mapea IDs lógicos a la ruta relativa en la carpeta public.
 */
export const PDF_REGISTRY: Record<string, string> = {
  // --- Caso Quart (ETJ 1428/2025) ---
  'quart_sentencia_divorcio': '/docs/quart/Doc_01_SentenciaDivorcio.pdf',
  'quart_demanda_ejecucion': '/docs/quart/Doc_02_DemandaEjecucion.pdf',
  'quart_oposicion_ejecucion': '/docs/quart/Doc_03_OposicionEjecucion.pdf',
  'quart_impugnacion_oposicion': '/docs/quart/Doc_04_ImpugnacionOposicion.pdf',

  // --- Caso Picassent (PO 715/2024) ---
  // Descomenta y ajusta cuando subas los PDFs a public/docs/picassent/
  // 'picassent_demanda': '/docs/picassent/Demanda.pdf',
  // 'picassent_contestacion': '/docs/picassent/Contestacion.pdf',

  // --- Caso Mislata (JV 1185/2025) ---
  // Descomenta y ajusta cuando subas los PDFs a public/docs/mislata/
  // 'mislata_demanda': '/docs/mislata/Demanda.pdf',
};

/**
 * Obtiene la URL pública de un documento PDF por su ID.
 * @param id El identificador del documento (ej: 'quart_sentencia_divorcio')
 * @returns La ruta relativa al archivo en public, o undefined si no existe.
 */
export const getPdfUrl = (id: string): string | undefined => {
  return PDF_REGISTRY[id];
};

/**
 * Tipado para las claves del registro para uso estricto en TypeScript.
 * Permite autocompletado de IDs en el editor.
 */
export type PdfDocumentId = keyof typeof PDF_REGISTRY;
