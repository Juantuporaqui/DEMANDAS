interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { 
    margin: 15mm; 
  }
  
  /* Resetear por completo la página para formato documento clásico */
  html, body {
    height: auto !important;
    min-height: auto !important;
    overflow: visible !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    color: black !important;
    font-size: 11pt !important;
    line-height: 1.5 !important;
  }
  
  /* DESTRUIR Flexbox y Grid: son los culpables de los espacios raros en PDF */
  .flex, .grid, .grid-cols-1, .md\\:grid-cols-2, .xl\\:grid-cols-2 {
    display: block !important;
    width: 100% !important;
  }
  
  /* Ajustar márgenes gigantes de Tailwind */
  .space-y-6 > * + *, .space-y-4 > * + * { 
    margin-top: 1rem !important; 
  }
  
  /* PERMITIR QUE LAS TARJETAS SE PARTAN POR LA MITAD */
  /* Esta es la clave para eliminar los huecos blancos gigantes */
  div, section, article, .card-base, .rounded-2xl, .p-4, .p-5, .p-6 {
    page-break-inside: auto !important;
    break-inside: auto !important;
    margin-bottom: 1rem !important;
  }

  /* Solo protegeremos de saltos a los títulos para que no queden solos al final de la hoja */
  h1, h2, h3, h4, .text-lg, .text-base { 
    break-after: avoid !important; 
    page-break-after: avoid !important; 
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
        <main class="block h-auto overflow-visible p-0 m-0">${cloned.innerHTML}</main>
      </body>
    </html>
  `);
  doc.close();

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
      }, 2000);
    }
  }, 1000);
}
