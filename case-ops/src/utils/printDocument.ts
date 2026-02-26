interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { size: A4; margin: 12mm; }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    color: #111827 !important;
    background: #fff !important;
    font-size: 11pt;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print-root {
    width: 190mm !important;
    max-width: 190mm !important;
    margin: 0 auto !important;
  }

  .print-root * { box-sizing: border-box; }

  @media print {
    * { box-shadow: none !important; text-shadow: none !important; filter: none !important; }

    html, body, .print-root {
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: visible !important;
    }

    .h-screen, .min-h-screen, .max-h-screen {
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
    }

    .overflow-hidden, .overflow-auto, .overflow-scroll { overflow: visible !important; }

    .sticky, .fixed {
      position: static !important;
      top: auto !important; left: auto !important; right: auto !important; bottom: auto !important;
    }

    /* Permitir partir contenedores grandes */
    .card, .print-card, .card-base, .case-card, .kpi-card, section, article, div {
      break-inside: auto !important;
      page-break-inside: auto !important;
    }

    .print-hidden, button, nav, footer, .bottom-nav { display: none !important; }

    h1, h2, h3, h4, h5 { break-after: avoid-page !important; page-break-after: avoid !important; }

    img, svg, canvas, figure, table, pre, blockquote, tr, thead, tfoot {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    img, svg, canvas { max-width: 100% !important; height: auto !important; }

    p, li, blockquote { orphans: 3; widows: 3; }

    .print-page-break { break-before: page !important; page-break-before: always !important; }
    .print-keep-with-next { break-after: avoid-page !important; page-break-after: avoid !important; }
  }
`;


const CLEANUP_DELAY_MS = 1500;

function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images);

  if (images.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(
    images.map((img) => {
      if (img.complete) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  ).then(() => undefined);
}

async function waitForPrintableResources(doc: Document): Promise<void> {
  await waitForImages(doc);

  if ('fonts' in doc) {
    try {
      await (doc as Document & { fonts: FontFaceSet }).fonts.ready;
    } catch {
      // Ignorar si la API de fuentes falla en algún navegador.
    }
  }
}

const CLEANUP_DELAY_MS = 1500;

function waitForImages(doc: Document): Promise<void> {
  const images = Array.from(doc.images);
  if (images.length === 0) return Promise.resolve();

  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  ).then(() => undefined);
}

async function waitForPrintableResources(doc: Document): Promise<void> {
  await waitForImages(doc);
  if ('fonts' in doc) {
    try {
      await (doc as Document & { fonts: FontFaceSet }).fonts.ready;
    } catch {
      // Ignorar si la API de fuentes falla.
    }
  }
}

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.left = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.visibility = 'hidden';
  iframe.style.opacity = '1';
  iframe.style.pointerEvents = 'none';
  iframe.style.zIndex = '2147483647';
  iframe.style.border = '0';

  document.body.appendChild(iframe);

  const printWindow = iframe.contentWindow;
  const doc = printWindow?.document;

  if (!doc || !printWindow) {
    window.print();
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
    return;
  }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((styleNode) => styleNode.outerHTML)
    .join('\n');

  const cloned = element.cloneNode(true) as HTMLElement;

  const cleanup = () => {
    window.setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, CLEANUP_DELAY_MS);
  };

  doc.open();
  doc.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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

  void waitForPrintableResources(doc).finally(() => {
    printWindow.focus();
    printWindow.addEventListener('afterprint', cleanup, { once: true });

    // Fallback: algunos navegadores no disparan afterprint en iframes ocultos.
    window.setTimeout(cleanup, 10000);

    try {
      printWindow.print();
    } catch (error) {
      console.error('Error al imprimir el documento', error);
      cleanup();
    }
  });
}
