interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { 
    size: A4; 
    margin: 15mm; 
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    font-size: 10.5pt !important;
    line-height: 1.5 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  @media print {
    /* 1. LA MAGIA: Forzar que TODO el texto sea negro y los fondos transparentes */
    /* Esto sobreescribe el text-white de Tailwind */
    * { 
      color: #000000 !important; 
      background-color: transparent !important;
      box-shadow: none !important; 
      text-shadow: none !important; 
      border-color: #cbd5e1 !important; /* Gris claro para las tarjetas */
    }

    /* 2. EVITAR QUE SE CORTEN LAS PÁGINAS EN BLANCO */
    html, body, .print-root, .print-root * {
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: visible !important;
      position: static !important;
    }

    /* 3. APLANAR FLEX Y GRID PARA QUE EL TEXTO FLUYA HACIA ABAJO */
    .flex, .grid, [class*="flex"], [class*="grid"] {
      display: block !important;
      width: 100% !important;
    }

    /* Reducir márgenes gigantes */
    .gap-2 > *, .gap-3 > *, .gap-4 > *, .gap-6 > * {
      margin-bottom: 0.5rem !important;
    }

    /* 4. PERMITIR QUE LAS TARJETAS SE PARTAN POR LA MITAD PARA NO DEJAR HUECOS */
    div, section, article, .rounded-2xl, .rounded-xl, .p-4 {
      break-inside: auto !important;
      page-break-inside: auto !important;
      margin-bottom: 1rem !important;
    }

    /* Ocultar interfaz */
    .print-hidden, button, nav, footer, aside, .bottom-nav { 
      display: none !important; 
    }

    /* Proteger que los títulos no se queden solos a final de página */
    h1, h2, h3, h4, h5, .font-semibold { 
      break-after: avoid !important; 
      page-break-after: avoid !important; 
      page-break-inside: avoid !important;
    }

    /* Respetar elementos inline */
    span, a, strong, b, i, em {
      display: inline !important;
    }
  }
`;

const CLEANUP_DELAY_MS = 2000;

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  const iframe = document.createElement('iframe');
  
  // ARREGLO VITAL: El iframe no puede ser 0x0
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.opacity = '0'; // Lo hacemos invisible pero con tamaño real
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '-9999';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const printWindow = iframe.contentWindow;
  const doc = printWindow?.document;

  if (!doc || !printWindow) {
    window.print();
    if (document.body.contains(iframe)) document.body.removeChild(iframe);
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
        <main class="print-root">${cloned.outerHTML}</main>
      </body>
    </html>
  `);
  doc.close();

  // Damos 1 segundo para que Chrome calcule las 11 páginas correctamente
  window.setTimeout(() => {
    printWindow.focus();
    try {
      printWindow.print();
    } catch (error) {
      console.error('Error al imprimir', error);
    } finally {
      window.setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, CLEANUP_DELAY_MS);
    }
  }, 1000);
}
