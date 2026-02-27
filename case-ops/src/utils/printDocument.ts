interface PrintElementOptions {
  element: HTMLElement;
  title: string;
}

export function printElementAsDocument({ element, title }: PrintElementOptions): Promise<void> {
  return new Promise<void>((resolve) => {
    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-10000px;left:-10000px;width:210mm;height:297mm;border:none;';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument!;
    const iframeWin = iframe.contentWindow!;

    // Write base HTML document
    iframeDoc.open();
    iframeDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title></head><body></body></html>`);
    iframeDoc.close();

    // Copy all stylesheets from parent document
    const stylePromises: Promise<void>[] = [];

    document.head.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const cloned = link.cloneNode(true) as HTMLLinkElement;
      iframeDoc.head.appendChild(cloned);
      // Wait for each external stylesheet to load
      stylePromises.push(
        new Promise<void>((res) => {
          cloned.onload = () => res();
          cloned.onerror = () => res(); // Resolve even on error to avoid blocking
        })
      );
    });

    document.head.querySelectorAll('style').forEach((style) => {
      const cloned = style.cloneNode(true) as HTMLStyleElement;
      iframeDoc.head.appendChild(cloned);
    });

    // Inject print-specific CSS inside the iframe
    const printStyle = iframeDoc.createElement('style');
    printStyle.textContent = `
      @page { margin: 1.5cm; size: A4; }
      body { background: #fff !important; color: #1e293b !important; font-family: inherit; }
      * { box-shadow: none !important; backdrop-filter: none !important; text-shadow: none !important; }
      .print-hidden, button, [role="button"] { display: none !important; }
      details { display: block !important; }
      details > * { display: block !important; }
    `;
    iframeDoc.head.appendChild(printStyle);

    // Clone the target element into the iframe body
    const clone = element.cloneNode(true) as HTMLElement;

    // Force open all <details> elements in the clone
    clone.querySelectorAll('details').forEach((d) => {
      d.setAttribute('open', '');
    });

    // Remove buttons and .print-hidden elements from clone
    clone.querySelectorAll('button, [role="button"], .print-hidden').forEach((el) => {
      el.remove();
    });

    iframeDoc.body.appendChild(clone);

    // Setup cleanup
    let cleaned = false;
    let fallbackTimeout: ReturnType<typeof setTimeout>;
    const cleanup = () => {
      if (cleaned) return;
      cleaned = true;
      clearTimeout(fallbackTimeout);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      resolve();
    };

    iframeWin.addEventListener('afterprint', cleanup, { once: true });
    // Fallback cleanup in case afterprint doesn't fire
    fallbackTimeout = setTimeout(cleanup, 2000);

    // Wait for all stylesheets to load, then fonts, then paint
    Promise.all(stylePromises)
      .then(() => (iframeDoc.fonts?.ready ?? Promise.resolve()))
      .then(
        () =>
          new Promise<void>((r) =>
            requestAnimationFrame(() => requestAnimationFrame(() => r()))
          )
      )
      .then(() => {
        iframeWin.focus();
        iframeWin.print();
      });
  });
}
