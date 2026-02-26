interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { 
    margin: 15mm; 
    size: auto;
  }
  
  /* 1. EL ARREGLO DEL MODO OSCURO (DARK MODE FIX) */
  /* Forzar texto negro y fondo transparente para TODO. Adiós al texto invisible. */
  * {
    color: #000000 !important;
    background-color: transparent !important;
    border-color: #d1d5db !important; /* Gris medio para los bordes */
    box-shadow: none !important;
    text-shadow: none !important;
  }

  html, body {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
    font-size: 11pt !important;
    line-height: 1.5 !important;
  }

  /* 2. EL TRUCO PARA QUE NO SE CORTEN LAS PÁGINAS NI SALGAN EN BLANCO */
  .print-surface, .print-surface * {
    overflow: visible !important;
    height: auto !important;
    min-height: auto !important;
    max-height: none !important;
    position: static !important; /* Evita que elementos flotantes salgan del papel */
  }

  /* 3. MANTENER LA ESTRUCTURA PERO ADAPTADA A PAPEL */
  .flex {
    flex-wrap: wrap !important;
  }

  /* 4. PERMITIR QUE LAS TARJETAS SE PARTAN POR LA MITAD ENTRE DOS PÁGINAS */
  div, section, article, .card-base, .rounded-2xl, .card {
    page-break-inside: auto !important;
    break-inside: auto !important;
  }

  /* 5. PROTEGER TÍTULOS (para que no queden sueltos al final de la página) */
  h1, h2, h3, h4, h5, .text-lg, .text-xl { 
    page-break-after: avoid !important;
    break-after: avoid !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-bottom: 0.5rem !important;
  }

  /* 6. OCULTAR BOTONES E INTERFAZ INNECESARIA */
  button, nav, header, footer, .print-hidden { 
    display: none !important; 
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

  // Extraer todos los estilos (Tailwind)
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((styleNode) => styleNode.outerHTML)
    .join('\n');

  // Clonar el DOM. Usamos outerHTML para asegurarnos de no perder las clases del contenedor padre.
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

  // Mantenemos 2 segundos de tiempo para que Tailwind asigne los estilos antes de imprimir
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
      }, 8000);
    }
  }, 6000);
}
