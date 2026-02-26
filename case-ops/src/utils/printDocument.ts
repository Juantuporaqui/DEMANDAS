interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { 
    margin: 15mm; 
    size: auto;
  }
  
  /* 1. ANULAR POSICIONAMIENTOS ABSOLUTOS QUE ROMPEN LA PAGINACIÓN */
  * {
    position: static !important;
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
    min-height: 0 !important; /* Corregido: auto no es válido aquí */
    color: black !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }

  html, body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 11pt !important;
    line-height: 1.5 !important;
  }

  /* 2. LA CURA CONTRA EL BUG DE CHROME (PÁGINAS EN BLANCO) */
  /* Tenemos que transformar TODO contenedor flex o grid en bloque puro */
  .flex, .inline-flex, .grid, [class*="flex"], [class*="grid"], .print-surface {
    display: block !important;
    width: 100% !important;
  }

  /* Convertir los huecos de Grid/Flex en márgenes clásicos */
  .gap-2 > *, .gap-4 > *, .gap-6 > * {
    margin-bottom: 0.5rem !important;
  }

  /* 3. RESPETAR ELEMENTOS DE TEXTO EN LÍNEA */
  span, a, strong, b, i, em {
    display: inline !important;
  }

  /* 4. PERMITIR CORTES POR LA MITAD PARA QUE FLUYA EL TEXTO */
  div, section, article, .card-base, .rounded-2xl, .card {
    page-break-inside: auto !important;
    break-inside: auto !important;
    margin-bottom: 1rem !important;
  }

  /* 5. PROTEGER TÍTULOS DE QUEDAR HUÉRFANOS */
  h1, h2, h3, h4, h5, .text-lg, .text-xl { 
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-top: 1.5rem !important;
    margin-bottom: 0.5rem !important;
  }

  /* 6. OCULTAR INTERFAZ */
  button, nav, header, footer, .print-hidden { 
    display: none !important; 
  }
  
  /* Bordes suaves para no perder la estructura visual de las tarjetas */
  .border, .border-white\\/10 {
    border: 1px solid #d1d5db !important;
    padding: 1rem !important;
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
        <main class="print-surface block h-auto overflow-visible p-0 m-0">${cloned.outerHTML}</main>
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
      }, 5000);
    }
  }, 2000);
}
