interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page {
    size: A4;
    margin: 12mm;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    color: #111827 !important;
    background: #ffffff !important;
    font-size: 11pt;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .print-root {
    width: 100%;
  }

  .print-root * {
    box-sizing: border-box;
  }

  .print-hidden,
  button,
  nav,
  footer,
  .bottom-nav {
    display: none !important;
  }

  h1, h2, h3, h4, h5 {
    break-after: avoid-page;
    page-break-after: avoid;
  }

  img, canvas, svg {
    max-width: 100% !important;
    height: auto !important;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  p, li, blockquote {
    orphans: 3;
    widows: 3;
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

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
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
