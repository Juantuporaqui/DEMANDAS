interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { 
    margin: 12mm 15mm; /* Márgenes estándar de folio A4 */
  }
  html, body {
    height: auto !important;
    overflow: visible !important;
    display: block !important;
    margin: 0;
    padding: 0;
    font-family: Inter, system-ui, -apple-system, sans-serif;
    background: #ffffff;
    color: #111827;
  }
  * { box-sizing: border-box; }
  
  /* Forzar ocultación de botones y navegación */
  .print-hidden, button, nav, header, footer, aside { display: none !important; }

  /* Protección contra elementos cortados (sólo interiores, no contenedores padre) */
  img, table, .card-base, .rounded-2xl { 
    break-inside: avoid; 
    page-break-inside: avoid;
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
        <main class="print-surface block h-auto overflow-visible">${cloned.innerHTML}</main>
      </body>
    </html>
  `);
  doc.close();

  // Aumentamos ligeramente el tiempo de espera para asegurar que carga tipografías y CSS
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
  }, 1200);
}
