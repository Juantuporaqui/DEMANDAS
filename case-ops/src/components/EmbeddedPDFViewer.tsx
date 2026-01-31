// ============================================
// Visor PDF embebido - Usa fetch + pdfjs-dist
// Evita que React Router intercepte las URLs
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, ExternalLink, Loader2 } from 'lucide-react';

interface EmbeddedPDFViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export function EmbeddedPDFViewer({ url, title, className = '' }: EmbeddedPDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar PDF con fetch
  useEffect(() => {
    let cancelled = false;

    async function loadPDF() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudo cargar el PDF`);
        }

        const arrayBuffer = await response.arrayBuffer();

        if (cancelled) return;

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

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

  // Renderizar página
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || rendering) return;

    setRendering(true);

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
    } finally {
      setRendering(false);
    }
  }, [pdfDoc, scale, rendering]);

  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, scale, renderPage]);

  // Ajustar escala al contenedor
  useEffect(() => {
    if (!containerRef.current || !pdfDoc) return;

    async function fitToWidth() {
      const page = await pdfDoc!.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current!.clientWidth - 32; // padding
      const newScale = Math.min(containerWidth / viewport.width, 1.5);
      setScale(newScale);
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
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800">
        {/* Navegación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-300" />
          </button>

          <span className="text-sm text-slate-400 min-w-[80px] text-center">
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

        {/* Zoom */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomOut size={16} className="text-slate-300" />
          </button>

          <span className="text-xs text-slate-500 min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={() => setScale(s => Math.min(3, s + 0.25))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomIn size={16} className="text-slate-300" />
          </button>
        </div>

        {/* Abrir en nueva pestaña */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-colors"
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">Nueva pestaña</span>
        </a>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div className="relative">
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="shadow-2xl rounded"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}
