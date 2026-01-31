// ============================================
// Visor PDF - Versión Final (Zoom Híbrido + Soporte Offline)
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

  // Estados del PDF
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [baseScale, setBaseScale] = useState(1); // Escala "real" de renderizado
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs para gestión de gestos (sin re-renderizar React para mayor fluidez)
  const gestureRef = useRef({
    startDist: 0,
    startScale: 1,
    isActive: false,
    currentScale: 1
  });

  // --- 1. Carga del PDF ---
  useEffect(() => {
    let cancelled = false;

    async function loadPDF() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const arrayBuffer = await response.arrayBuffer();
        if (cancelled) return;
        
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        if (cancelled) return;

        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error carga');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPDF();
    return () => { cancelled = true; };
  }, [url]);

  // --- 2. Renderizado del PDF (Alta Calidad) ---
  const renderPage = useCallback(async (pageNum: number, scaleToRender: number) => {
    if (!pdfDoc || !canvasRef.current) return;
    
    setRendering(true);

    try {
      const page = await pdfDoc.getPage(pageNum);
      
      // Ajuste para pantallas retina (Móviles se ven borrosos sin esto)
      const pixelRatio = window.devicePixelRatio || 1;
      const viewport = page.getViewport({ scale: scaleToRender * pixelRatio });

      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Dimensiones internas (Resolución real)
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      // Dimensiones visuales (CSS) - Ajustadas al pixel ratio
      const cssWidth = Math.floor(viewport.width / pixelRatio);
      const cssHeight = Math.floor(viewport.height / pixelRatio);
      
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      
      // Limpiamos cualquier transformación CSS residual del gesto
      canvas.style.transform = 'none'; 
      canvas.style.transformOrigin = 'top left';

      const transform = pixelRatio !== 1
        ? [pixelRatio, 0, 0, pixelRatio, 0, 0]
        : undefined;

      await page.render({
        canvasContext: context,
        viewport,
        transform: transform as any,
      }).promise;

    } catch (err) {
      console.error('Render error:', err);
    } finally {
      setRendering(false);
    }
  }, [pdfDoc]);

  // Efecto disparador de renderizado
  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage, baseScale);
    }
  }, [pdfDoc, currentPage, baseScale, renderPage]);

  // --- 3. Ajuste inicial automático al ancho del contenedor ---
  useEffect(() => {
    if (!containerRef.current || !pdfDoc) return;
    async function fit() {
      try {
        const page = await pdfDoc!.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const containerWidth = containerRef.current!.clientWidth - 32;
        // Ajustar al ancho, con un máximo de 1.5x inicial
        setBaseScale(Math.min(containerWidth / viewport.width, 1.5));
      } catch (e) {}
    }
    fit();
  }, [pdfDoc]);

  // --- 4. GESTIÓN DE GESTOS (Fluidez nativa) ---
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Inicio del pellizco (dos dedos)
      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      
      gestureRef.current.startDist = dist;
      gestureRef.current.startScale = baseScale; // Escala base actual
      gestureRef.current.isActive = true;
      
      // Cambiamos el origen de la transformación al centro para que el zoom se sienta natural
      if (canvasRef.current) {
        canvasRef.current.style.transformOrigin = 'center center';
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && gestureRef.current.isActive) {
      e.preventDefault(); // Evitar scroll/zoom del navegador

      const dist = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );

      // Factor de escala relativo al movimiento actual
      const scaleFactor = dist / gestureRef.current.startDist;
      
      // Nueva escala objetivo
      let newScale = gestureRef.current.startScale * scaleFactor;
      newScale = Math.min(Math.max(0.5, newScale), 5); // Límites 0.5x a 5x

      gestureRef.current.currentScale = newScale;

      // APLICAMOS CSS TRANSFORM: Truco de rendimiento (60fps)
      // Solo "estiramos" la imagen visualmente mientras mueves los dedos
      if (canvasRef.current) {
         const visualScale = newScale / baseScale;
         canvasRef.current.style.transform = `scale(${visualScale})`;
      }
    }
  };

  const handleTouchEnd = () => {
    if (gestureRef.current.isActive) {
      gestureRef.current.isActive = false;
      
      // AL SOLTAR: Actualizamos el estado de React.
      // Esto dispara renderPage() que redibuja el PDF con nitidez perfecta a la nueva escala.
      setBaseScale(gestureRef.current.currentScale);
    }
  };

  // Botones de zoom (actualizan estado directo)
  const zoomIn = () => setBaseScale(s => Math.min(5, s * 1.25));
  const zoomOut = () => setBaseScale(s => Math.max(0.5, s * 0.8));

  if (loading) return (
    <div className={`flex flex-col items-center justify-center h-full bg-slate-900 ${className}`}>
      <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
      <p className="text-sm text-slate-400">Cargando PDF...</p>
    </div>
  );

  if (error) return (
    <div className={`flex flex-col items-center justify-center h-full bg-slate-900 p-6 ${className}`}>
        <p className="text-rose-300 font-medium mb-2">Error al cargar el PDF</p>
        <p className="text-slate-500 text-sm text-center mb-4">{error}</p>
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm">
          <ExternalLink size={16} /> Abrir en nueva pestaña
        </a>
    </div>
  );

  return (
    <div className={`flex flex-col h-full bg-slate-950 ${className}`} ref={containerRef}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 shrink-0 z-20 relative">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-400 min-w-[60px] text-center">{currentPage} / {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors"><ZoomOut size={18} /></button>
          <button onClick={zoomIn} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 transition-colors"><ZoomIn size={18} /></button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-600 hover:bg-blue-500 rounded text-white transition-colors"><ExternalLink size={18} /></a>
        </div>
      </div>

      {/* Área de Visualización 
         - overflow-auto: permite movernos por el documento ampliado
         - touch-action: none: IMPORTANTE para que el navegador no interfiera
      */}
      <div 
        className="flex-1 overflow-auto bg-slate-950 flex justify-center p-4"
        style={{ touchAction: 'none' }} 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          {rendering && (
            <div className="absolute inset-0 z-10 bg-slate-900/20 flex items-center justify-center backdrop-blur-[1px]">
              <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
          )}
          <canvas 
            ref={canvasRef} 
            className="block shadow-2xl bg-white transition-transform duration-75 ease-linear origin-center"
            // IMPORTANTE: Esto sobrescribe cualquier CSS global que limite el tamaño
            style={{ maxWidth: 'none' }} 
          />
        </div>
      </div>
    </div>
  );
}
