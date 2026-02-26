interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

const BASE_PRINT_STYLES = `
  @page { margin: 14mm; }
  body {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    color: #111827;
    background: #ffffff;
    line-height: 1.5;
  }
  * {
    box-sizing: border-box;
  }
  a {
    color: #1f2937;
    text-decoration: underline;
  }
  button, input, textarea, select, nav {
    display: none !important;
  }
  .print-hidden {
    display: none !important;
  }
`;

export function printElementAsDocument({ element, title }: PrintElementOptions): void {
  const printWindow = window.open('', '_blank', 'noopener,noreferrer');
  if (!printWindow) {
    window.print();
    return;
  }

  const cloned = element.cloneNode(true) as HTMLElement;

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((styleNode) => styleNode.outerHTML)
    .join('\n');

  printWindow.document.open();
  printWindow.document.write(`
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
        <main class="print-surface">${cloned.innerHTML}</main>
      </body>
    </html>
  `);
  printWindow.document.close();

  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
  }, 500);
}
