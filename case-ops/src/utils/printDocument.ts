interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { margin: 14mm; }
  /* Reglas de seguridad extra inyectadas en el iframe */
  html, body {
    height: auto !important;
    overflow: visible !important;
    display: block !important;
    margin: 0;
    font-family: Inter, system-ui, -apple-system, sans-serif;
    background: #ffffff;
    color: #111827;
  }
  * { box-sizing: border-box; }
  .print-hidden, button, nav, header, footer, aside { display: none !important; }

  /* Protección contra elementos cortados */
  img, table, .card-base { break-inside: avoid; }
`;

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  // 1. Crear Iframe invisible (Evita el bug de 0 KB de Chrome en window.open)
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print(); // Fallback
    return;
  }

  // 2. Extraer los estilos de la ventana principal (Tailwind + tu print.css)
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((styleNode) => styleNode.outerHTML)
    .join('\n');

  // 3. Clonar el DOM objetivo
  const cloned = element.cloneNode(true) as HTMLElement;

  // 4. Inyectar todo en el Iframe
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

  // 5. Esperar 1 segundo para que el navegador dibuje el DOM y calcule la paginación
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (error) {
      console.error('Error al imprimir el documento', error);
    } finally {
      // Limpiar memoria borrando el iframe 2 segundos después
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 1000);
}
