// ============================================
// Visor PDF embebido - Versión Móvil Mejorada
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

  // Estado para gestión de gestos táctiles
  const touchStartDist = useRef<number>(0);
  const touchStartScale = useRef<number>(1);

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
    return () => { cancelled = true; };
  }, [url]);

  // Renderizar página
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || rendering) return;

    setRendering(true);
    try {
      const page = await pdfDoc.getPage(pageNum);
      // Usamos scale * window.devicePixelRatio para mayor nitidez en móviles
      const outputScale = window.devicePixelRatio || 1; 
      const viewport = page.getViewport({ scale: scale * outputScale });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      // Ajustamos el estilo CSS para que coincida con el tamaño lógico, no físico
      canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
      canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : undefined;

      await page.render({
        canvasContext: context,
        viewport,
        transform: transform as any,
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

  // Ajustar escala inicial al contenedor
  useEffect(() => {
    if (!containerRef.current || !pdfDoc) return;
    async function fitToWidth() {
      const page = await pdfDoc!.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const containerWidth = containerRef.current!.clientWidth - 32;
      // Ajustamos para que inicialmente encaje
      const newScale = containerWidth / viewport.width;
      setScale(newScale);
    }
    fitToWidth();
  }, [pdfDoc]);

  // --- LÓGICA DE GESTOS TÁCTILES (PINCH ZOOM) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Calcular distancia inicial entre dos dedos
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      touchStartDist.current = dist;
      touchStartScale.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      if (touchStartDist.current > 0) {
        const delta = dist / touchStartDist.current;
        // Limitamos el zoom mínimo y máximo durante el gesto
        const newScale = Math.min(Math.max(0.5, touchStartScale.current * delta), 4);
        
        // Opcional: Para rendimiento, podrías solo aplicar CSS transform aquí 
        // y hacer el setScale en onTouchEnd. Por ahora lo hacemos directo:
        // Usamos requestAnimationFrame para no saturar el renderizado
        requestAnimationFrame(() => {
            setScale(newScale);
        });
      }
    }
  };
  // ------------------------------------------------

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
        {/* ... (código de error igual que antes) ... */}
        <p className="text-rose-300 font-medium mb-2">Error al cargar el PDF</p>
        <p className="text-slate-500 text-sm text-center mb-4">{error}</p>
        {/* ... */}
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-slate-950 ${className}`} ref={containerRef}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0 z-10">
        {/* Navegación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={18} className="text-slate-300" />
          </button>
          
          <span className="text-sm text-slate-400 min-w-[60px] text-center">
            {currentPage}/{totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomOut size={16} className="text-slate-300" />
          </button>
          {/* Ocultamos el porcentaje en pantallas muy pequeñas */}
          <span className="hidden sm:inline text-xs text-slate-500 min-w-[45px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale(s => Math.min(3, s + 0.25))}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ZoomIn size={16} className="text-slate-300" />
          </button>
        </div>
      </div>

      {/* Canvas Container con scroll y gestos */}
      <div 
        className="flex-1 overflow-auto p-4 flex justify-center items-start touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="relative origin-top">
          {rendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="shadow-2xl rounded block"
            // IMPORTANTE: Quitamos maxWidth: '100%' y height: 'auto'
            // Dejamos que el canvas tome el tamaño que calculamos en renderPage
          />
        </div>
      </div>
    </div>
  );
}
