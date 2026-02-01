// ============================================
// CASE OPS - PDF Viewer Optimizado Mobile & Touch
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Modal } from '../../components';
import {
  documentsRepo,
  docFilesRepo,
  spansRepo,
  linksRepo,
  factsRepo,
  partidasRepo,
} from '../../db/repositories';
import type { Document, DocFile, Span, Fact, Partida } from '../../types';
import * as pdfjsLib from 'pdfjs-dist';
import './PdfViewer.css';

// ------------------------------------------------------------------
// CONFIGURACIÓN CRÍTICA DEL WORKER
// Esto mueve el procesamiento pesado a otro hilo, liberando la UI
// ------------------------------------------------------------------
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function PdfViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Referencias para manipulación directa del DOM (Performance)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null); // Para cancelar renderizados en curso

  // Estado del Documento
  const [document, setDocument] = useState<Document | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [docFile, setDocFile] = useState<DocFile | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
  // Estado de Visualización
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0); // Escala lógica
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);

  // Estado para Gestos Táctiles (Pinch Zoom)
  const touchState = useRef({
    initialDistance: 0,
    initialScale: 1,
    isPinching: false,
  });

  // Estado de Spans (Anotaciones)
  const [spans, setSpans] = useState<Span[]>([]);
  const [showSpanModal, setShowSpanModal] = useState(false);
  const [spanForm, setSpanForm] = useState({
    pageStart: 1,
    pageEnd: 1,
    label: '',
    note: '',
    tags: '',
  });

  // Estado de Enlaces (Links)
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);
  const [linkType, setLinkType] = useState<'fact' | 'partida'>('fact');
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [selectedLinkTarget, setSelectedLinkTarget] = useState('');

  // ------------------------------------------------------------------
  // 1. CARGA INICIAL
  // ------------------------------------------------------------------
  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    // Solo actualizamos si ya tenemos el total de páginas cargado para verificar validez
    if (totalPages > 0 && initialPage > 0 && initialPage <= totalPages) {
      setCurrentPage(initialPage);
    }
  }, [searchParams, totalPages]);

  // ------------------------------------------------------------------
  // 2. LÓGICA DE GESTOS TÁCTILES (PINCH TO ZOOM)
  // Usa transformaciones CSS para agilidad y luego renderiza
  // ------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault(); // Evitar zoom del navegador completo
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        touchState.current.isPinching = true;
        touchState.current.initialDistance = dist;
        touchState.current.initialScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchState.current.isPinching && e.touches.length === 2 && canvasRef.current) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        
        // Calcular nueva escala temporal
        const ratio = dist / touchState.current.initialDistance;
        const newTempScale = Math.min(Math.max(0.5, touchState.current.initialScale * ratio), 4.0);
        
        // Aplicar transformación CSS (Barato y rápido)
        // Calculamos la escala relativa al renderizado actual
        const cssScale = newTempScale / scale;
        canvasRef.current.style.transform = `scale(${cssScale})`;
        canvasRef.current.style.transformOrigin = 'center center';
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchState.current.isPinching && e.touches.length < 2) {
        touchState.current.isPinching = false;
        
        if (canvasRef.current) {
          // Recuperar la escala de la transformación CSS
          const transform = canvasRef.current.style.transform;
          const match = transform.match(/scale\((.+)\)/);
          
          if (match) {
            const cssScaleRatio = parseFloat(match[1]);
            const finalScale = Math.min(Math.max(0.5, scale * cssScaleRatio), 4.0);
            
            // Limpiar estilos temporales
            canvasRef.current.style.transform = '';
            canvasRef.current.style.transformOrigin = '';
            
            // Disparar renderizado real de alta calidad
            setScale(finalScale);
          }
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale]); // Dependencia scale necesaria para calcular el ratio correcto

  // ------------------------------------------------------------------
  // 3. RENDERIZADO DEL PDF
  // ------------------------------------------------------------------
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      // Cancelar tarea anterior si existe (Agilidad al cambiar página rápido)
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (err) {
          // Ignorar errores de cancelación
          console.debug('Renderizado anterior cancelado');
        }
      }

      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        
        // Soporte HiDPI (Retina Display) - Texto nítido
        const outputScale = window.devicePixelRatio || 1;
        
        // Ajustar viewport a la escala deseada
        const viewport = page.getViewport({ scale: scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false }); // alpha false mejora rendimiento
        
        if (!context) return;

        // Dimensiones físicas del canvas (multiplicadas por densidad de píxeles)
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        
        // Dimensiones visuales CSS (lo que ocupa en pantalla)
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        // Matriz de transformación para corregir el escalado HiDPI
        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : null;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: transform as any, // Tipo any para evitar conflicto estricto de TS en versions viejas
        };

        // Guardar la tarea de renderizado
        renderTaskRef.current = page.render(renderContext);

        await renderTaskRef.current.promise;
      } catch (error: any) {
        if (error.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', error);
        }
      } finally {
        setRendering(false);
        renderTaskRef.current = null;
      }
    },
    [pdfDoc, scale]
  );

  // Efecto trigger para renderizar
  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, renderPage]); // renderPage ya incluye scale como dependencia

  async function loadDocument(docId: string) {
    try {
      setLoading(true);
      const doc = await documentsRepo.getById(docId);
      if (!doc) {
        navigate('/documents');
        return;
      }

      setDocument(doc);

      // Carga del Buffer
      let arrayBuffer: ArrayBuffer;
      if (doc.filePath) {
        try {
          const url = new URL(doc.filePath, import.meta.url).href;
          const response = await fetch(url);
          if (!response.ok) throw new Error('Network response was not ok');
          arrayBuffer = await response.arrayBuffer();
        } catch (e) {
          console.error(e);
          alert(`Error cargando documento: ${doc.filePath}`);
          navigate(`/documents/${docId}`);
          return;
        }
      } else {
        const file = await docFilesRepo.getById(doc.fileId);
        if (!file) {
          alert('Archivo PDF no encontrado');
          navigate(`/documents/${docId}`);
          return;
        }
        setDocFile(file);
        arrayBuffer = await file.blob.arrayBuffer();
      }

      // Cargar Spans
      const docSpans = await spansRepo.getByDocumentId(docId);
      setSpans(docSpans);

      // Cargar PDF con options optimizadas
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.530/cmaps/', // Mejor soporte de fuentes
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);

      // Load facts/partidas
      if (doc.caseId) {
        const [caseFacts, casePartidas] = await Promise.all([
          factsRepo.getByCaseId(doc.caseId),
          partidasRepo.getByCaseId(doc.caseId),
        ]);
        setFacts(caseFacts);
        setPartidas(casePartidas);
      }
    } catch (error) {
      console.error('Error loading document:', error);
      alert('Error al cargar el documento');
    } finally {
      setLoading(false);
    }
  }

  // Navegación
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

  // --- MÉTODOS DE SPANS Y LINKS (Sin cambios lógicos, solo UI hook) ---
  function handleCreateSpan() {
    setSpanForm({
      pageStart: currentPage,
      pageEnd: currentPage,
      label: '',
      note: '',
      tags: '',
    });
    setShowSpanModal(true);
  }

  async function handleSaveSpan() {
    if (!document || !spanForm.label.trim()) {
      alert('El label es obligatorio');
      return;
    }
    try {
      const span = await spansRepo.create({
        documentId: document.id,
        caseId: document.caseId,
        pageStart: spanForm.pageStart,
        pageEnd: spanForm.pageEnd,
        label: spanForm.label.trim(),
        note: spanForm.note.trim(),
        tags: spanForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setSpans([...spans, span]);
      setShowSpanModal(false);
    } catch (error) {
      console.error('Error creating span:', error);
      alert('Error al crear el span');
    }
  }

  function handleLinkSpan(span: Span) {
    setSelectedSpan(span);
    setSelectedLinkTarget('');
    setShowLinkModal(true);
  }

  async function handleCreateLink() {
    if (!selectedSpan || !selectedLinkTarget) {
      alert('Selecciona un destino');
      return;
    }
    try {
      await linksRepo.create(
        'span',
        selectedSpan.id,
        linkType,
        selectedLinkTarget,
        'evidence',
        `Enlazado desde visor PDF`
      );
      alert(`Enlace creado correctamente`);
      setShowLinkModal(false);
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Error al crear el enlace');
    }
  }

  async function handleDeleteSpan(span: Span) {
    if (!confirm(`¿Eliminar span "${span.label}"?`)) return;
    try {
      await linksRepo.deleteByEntity('span', span.id);
      await spansRepo.delete(span.id);
      setSpans(spans.filter((s) => s.id !== span.id));
    } catch (error) {
      console.error('Error deleting span:', error);
      alert('Error al eliminar el span');
    }
  }

  if (loading) {
    return (
      <div className="page flex justify-center items-center h-screen bg-slate-950">
        <div className="spinner text-blue-500" />
        <span className="ml-3 text-slate-400">Cargando documento...</span>
      </div>
    );
  }

  if (!document || !pdfDoc) {
    return (
      <div className="page p-8 text-center text-slate-400">
        <p>Documento no encontrado</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      {/* Header */}
      <div className="pdf-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <div className="pdf-title">
          <span className="truncate">{document.title}</span>
          <span className="text-muted text-xs">
            {document.id}
          </span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleCreateSpan}
        >
          + Span
        </button>
      </div>

      {/* Canvas Container: ref para gestos táctiles */}
      <div 
        className="pdf-canvas-container" 
        ref={containerRef}
      >
        {rendering && (
          <div className="pdf-loading">
            <div className="spinner" />
          </div>
        )}
        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>

      {/* Navigation */}
      <div className="pdf-nav">
        <button
          className="btn btn-secondary btn-icon"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          ‹
        </button>

        <div className="pdf-page-info">
          <input
            type="number"
            className="pdf-page-input"
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value, 10))}
            min={1}
            max={totalPages}
          />
          <span className="whitespace-nowrap">/ {totalPages}</span>
        </div>

        <button
          className="btn btn-secondary btn-icon"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          ›
        </button>

        <div className="pdf-zoom">
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={() => setScale(Math.max(0.5, scale - 0.25))}
          >
            −
          </button>
          <span>{Math.round(scale * 100)}%</span>
          <button
            className="btn btn-ghost btn-icon-sm"
            onClick={() => setScale(Math.min(4, scale + 0.25))}
          >
            +
          </button>
        </div>
      </div>

      {/* Spans Panel */}
      <div className="pdf-spans">
        <h3 className="section-title">Spans ({spans.length})</h3>
        {spans.length === 0 ? (
          <p className="text-muted text-sm">
            No hay spans. Pulsa "+ Span" para crear uno.
          </p>
        ) : (
          <div className="spans-list">
            {spans.map((span) => (
              <div
                key={span.id}
                className={`span-item ${
                  currentPage >= span.pageStart && currentPage <= span.pageEnd
                    ? 'span-item-active'
                    : ''
                }`}
              >
                <div
                  className="span-item-content"
                  onClick={() => goToPage(span.pageStart)}
                >
                  <div className="span-item-label">{span.label}</div>
                  <div className="span-item-pages">
                    Págs. {span.pageStart}-{span.pageEnd}
                  </div>
                </div>
                <div className="span-item-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleLinkSpan(span)}
                    title="Enlazar"
                  >
                    🔗
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDeleteSpan(span)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODALS (Igual que original) --- */}
      <Modal
        isOpen={showSpanModal}
        onClose={() => setShowSpanModal(false)}
        title="Crear Span"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowSpanModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSaveSpan}>
              Guardar
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Etiqueta *</label>
          <input
            type="text"
            className="form-input"
            value={spanForm.label}
            onChange={(e) =>
              setSpanForm((prev) => ({ ...prev, label: e.target.value }))
            }
            placeholder="Ej: Firma del contrato..."
            autoFocus
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Pág. Inicio</label>
            <input
              type="number"
              className="form-input"
              value={spanForm.pageStart}
              onChange={(e) =>
                setSpanForm((prev) => ({
                  ...prev,
                  pageStart: parseInt(e.target.value, 10) || 1,
                }))
              }
              min={1}
              max={totalPages}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Pág. Fin</label>
            <input
              type="number"
              className="form-input"
              value={spanForm.pageEnd}
              onChange={(e) =>
                setSpanForm((prev) => ({
                  ...prev,
                  pageEnd: parseInt(e.target.value, 10) || 1,
                }))
              }
              min={spanForm.pageStart}
              max={totalPages}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Nota</label>
          <textarea
            className="form-textarea"
            value={spanForm.note}
            onChange={(e) =>
              setSpanForm((prev) => ({ ...prev, note: e.target.value }))
            }
            placeholder="Contexto..."
            rows={3}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            type="text"
            className="form-input"
            value={spanForm.tags}
            onChange={(e) =>
              setSpanForm((prev) => ({ ...prev, tags: e.target.value }))
            }
            placeholder="Separados por comas"
          />
        </div>
      </Modal>

      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title={`Enlazar: ${selectedSpan?.label}`}
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowLinkModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleCreateLink}>
              Crear enlace
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Tipo de enlace</label>
          <div className="flex gap-2 mb-4">
            <button
              className={`btn flex-1 ${linkType === 'fact' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setLinkType('fact');
                setSelectedLinkTarget('');
              }}
            >
              📋 Hecho
            </button>
            <button
              className={`btn flex-1 ${linkType === 'partida' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setLinkType('partida');
                setSelectedLinkTarget('');
              }}
            >
              💰 Partida
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">
            Seleccionar {linkType === 'fact' ? 'hecho' : 'partida'}
          </label>
          <select
            className="form-select w-full"
            value={selectedLinkTarget}
            onChange={(e) => setSelectedLinkTarget(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {linkType === 'fact'
              ? facts.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.title}
                  </option>
                ))
              : partidas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.concept}
                  </option>
                ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
