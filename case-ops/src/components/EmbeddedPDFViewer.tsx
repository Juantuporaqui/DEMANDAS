// ============================================
// Visor PDF embebido optimizado
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Loader2 } from 'lucide-react';

// Configurar Worker también aquí por si se usa de forma aislada
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface EmbeddedPDFViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export function EmbeddedPDFViewer({ url, title, className = '' }: EmbeddedPDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPDF() {
      setLoading(true);
      setError(null);

      try {
        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.530/cmaps/',
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;

        if (cancelled) return;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPDF();

    return () => {
      cancelled = true;
    };
  }, [url]);

  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return;

    if (renderTaskRef.current) {
        try { renderTaskRef.current.cancel(); } catch { /* ignore */ }
    }

    setRendering(true);

    try {
      const page = await pdfDoc.getPage(pageNum);
      
      // HiDPI Support
      const outputScale = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { alpha: false });
      if (!context) return;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;

      const transform = outputScale !== 1 
        ? [outputScale, 0, 0, outputScale, 0, 0] 
        : null;

      renderTaskRef.current = page.render({
        canvasContext: context,
        viewport,
        transform: transform as any,
      });

      await renderTaskRef.current.promise;
    } catch (err: any) {
        if (err.name !== 'RenderingCancelledException') {
            console.error('Error rendering page:', err);
        }
    } finally {
      setRendering(false);
      renderTaskRef.current = null;
    }
  }, [pdfDoc, scale]);

  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  // Ajustar escala al contenedor (Mejorado)
  useEffect(() => {
    if (!containerRef.current || !pdfDoc) return;

    async function fitToWidth() {
      try {
        const page = await pdfDoc!.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current!.clientWidth - 32;
        if (containerWidth > 0 && viewport.width > 0) {
            const newScale = Math.min(containerWidth / viewport.width, 1.5);
            setScale(newScale);
        }
      } catch (e) { console.error(e); }
    }

    fitToWidth();
  }, [pdfDoc]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-slate-900 ${className}`}>
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
        <p className="text-sm text-slate-400">Cargando PDF...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center h-full bg-slate-900 p-6 ${className}`}>
        <div className="text-rose-400 text-4xl mb-4">📄</div>
        <p className="text-rose-300 font-medium mb-2">Error al cargar el PDF</p>
        <p className="text-slate-500 text-sm text-center mb-4">{error}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors"
        >
          <ExternalLink size={16} />
          Abrir en nueva pestaña
        </a>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-slate-950 ${className}`} ref={containerRef}>
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-300" />
          </button>

          <span className="text-sm text-slate-400 min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomOut size={16} className="text-slate-300" />
          </button>
          <button
            onClick={() => setScale(s => Math.min(3, s + 0.25))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomIn size={16} className="text-slate-300" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex justify-center bg-slate-950">
        <div className="relative">
            {/* Sin spinner aquí para evitar parpadeos molestos en actualizaciones rápidas */}
            <canvas
                ref={canvasRef}
                className="shadow-2xl rounded bg-white"
            />
        </div>
      </div>
    </div>
  );
}
