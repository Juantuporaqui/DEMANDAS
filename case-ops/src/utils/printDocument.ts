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
    background: #ffffff !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  @media print {
    /* 1. TEXTO NEGRO Y FONDO BLANCO PARA LEER BIEN */
    * { 
      color: #000000 !important; 
      background-color: transparent !important;
      box-shadow: none !important; 
      border-color: #cbd5e1 !important; /* Bordes gris claro para separar cajas */
    }

    /* 2. LIBERAR ALTURAS Y OVERFLOW PARA QUE NO SE CORTE NADA */
    *, html, body, .print-root {
      overflow: visible !important;
      height: auto !important;
      max-height: none !important;
    }

    /* 3. APLANAR GRIDS (El causante original de que Chrome se bloquee en docs largos) */
    .grid {
      display: block !important;
      width: 100% !important;
    }
    
    /* Al romper el grid, Tailwind pierde el "gap". Le ponemos un margen solo a los hijos directos del grid */
    .grid > * {
      margin-bottom: 1.5rem !important;
    }

    /* 4. PERMITIR CORTES DE PÁGINA NATURALES EN LAS TARJETAS */
    .rounded-2xl, .rounded-xl, section, article {
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    /* 5. OCULTAR INTERFAZ Y BOTONES */
    .print-hidden, button, nav, footer, aside, .bottom-nav { 
      display: none !important; 
    }

    /* 6. PROTEGER TÍTULOS DE QUEDAR AISLADOS AL FINAL DEL FOLIO */
    h1, h2, h3, h4, h5, summary { 
      page-break-after: avoid !important; 
      break-after: avoid !important; 
    }
  }
`;

const CLEANUP_DELAY_MS = 2000;

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  const iframe = document.createElement('iframe');
  
  // IFRAME CON TAMAÑO COMPLETO PARA EVITAR BUG DE RENDERIZADO EN CHROME
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '100vw';
  iframe.style.height = '100vh';
  iframe.style.opacity = '0'; 
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

  // Esperar 1.5s a que Chrome pinte el DOM real antes de mandar a la cola de impresión
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
  }, 1500);
}
