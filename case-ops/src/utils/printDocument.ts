interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { 
    margin: 15mm; 
    size: auto;
  }
  
  html, body {
    background: white !important;
    color: black !important;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 11pt !important;
  }

  /* EL TRUCO MAGICO: Desactivar cualquier límite de altura y scroll oculto 
     Esto evita que las páginas salgan en blanco a partir de la 3 o 4 */
  .print-surface, .print-surface * {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }

  /* MANTENEMOS FLEX Y GRID, PERO PERMITIMOS QUE HAGAN WRAP (salto de línea) */
  .flex {
    flex-wrap: wrap !important;
  }

  /* PERMITIR QUE LAS CAJAS SE CORTEN POR LA MITAD ENTRE PÁGINAS */
  div, section, article, .card-base, .rounded-2xl {
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  /* PROTEGER SOLO LOS TÍTULOS PARA QUE NO QUEDEN HUÉRFANOS AL FINAL DE LA HOJA */
  h1, h2, h3, h4, h5, .text-lg, .text-xl { 
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Ocultar botones e interfaz */
  button, nav, header, footer, .print-hidden { 
    display: none !important; 
  }
  
  /* Limpiar fondos oscuros para ahorrar tinta y leer mejor */
  * {
    box-shadow: none !important;
    background-color: transparent !important;
  }
  
  /* Mantener bordes finos grises para separar secciones */
  .border, .border-white\\/10 {
    border: 1px solid #d1d5db !important;
  }
`;

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  // Extraer estilos base
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((styleNode) => styleNode.outerHTML)
    .join('\n');

  // Clonar el DOM
  const cloned = element.cloneNode(true) as HTMLElement;

  doc.open();
  doc.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${styles}
        <style>${BASE_PRINT_STYLES}</style>
      </head>
      <body>
        <main class="print-surface block h-auto overflow-visible p-0 m-0">${cloned.innerHTML}</main>
      </body>
    </html>
  `);
  doc.close();

  // Mantenemos los 2 segundos de cortesía para que el navegador dibuje bien la estructura
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (error) {
      console.error('Error al imprimir el documento', error);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);
    }
  }, 2000);
}
