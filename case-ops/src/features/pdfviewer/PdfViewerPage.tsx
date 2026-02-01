// ============================================
// CASE OPS - PDF Viewer Optimizado Mobile & Touch
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Maximize, Minimize } from 'lucide-react';
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

// Configuración del Worker para procesar el PDF en segundo plano
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function PdfViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Referencias DOM y de control
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Estado del Documento
  const [document, setDocument] = useState<Document | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [docFile, setDocFile] = useState<DocFile | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
  // Estado de Visualización
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // 1. Carga Inicial del Documento
  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Sincronización de página por URL
  useEffect(() => {
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    if (totalPages > 0 && initialPage > 0 && initialPage <= totalPages) {
      setCurrentPage(initialPage);
    }
  }, [searchParams, totalPages]);

  // 2. Lógica de Gestos Táctiles (Pinch to Zoom)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Solo prevenimos el comportamiento por defecto si hay 2 dedos (zoom)
        // Esto permite que el scroll con 1 dedo funcione nativamente (pan-x pan-y en CSS)
        e.preventDefault();
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
        
        // Calcular nueva escala temporal basada en la distancia
        const ratio = dist / touchState.current.initialDistance;
        const newTempScale = Math.min(Math.max(0.5, touchState.current.initialScale * ratio), 5.0);
        
        // Aplicar transformación visual CSS (Rendimiento 60fps)
        // Calculamos la escala relativa al renderizado actual del canvas
        const cssScale = newTempScale / scale;
        canvasRef.current.style.transform = `scale(${cssScale})`;
        // El origen 'center top' suele dar mejor sensación al hacer zoom y scroll a la vez
        canvasRef.current.style.transformOrigin = 'center top'; 
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchState.current.isPinching && e.touches.length < 2) {
        touchState.current.isPinching = false;
        
        if (canvasRef.current) {
          // Leer la escala final de la transformación CSS
          const transform = canvasRef.current.style.transform;
          const match = transform.match(/scale\((.+)\)/);
          
          if (match) {
            const cssScaleRatio = parseFloat(match[1]);
            const finalScale = Math.min(Math.max(0.5, scale * cssScaleRatio), 5.0);
            
            // Limpiar estilos temporales del canvas
            canvasRef.current.style.transform = '';
            canvasRef.current.style.transformOrigin = '';
            
            // Disparar renderizado real con la nueva escala (Calidad nítida)
            setScale(finalScale);
          }
        }
      }
    };

    // { passive: false } es necesario para poder llamar a preventDefault()
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale]);

  // 3. Renderizado del PDF (Page Rendering)
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      // Cancelar tarea anterior si existe (Mejora la agilidad al cambiar rápido)
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (err) {
          // Ignoramos error de cancelación
        }
      }

      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        
        // Soporte HiDPI (Retina Display) para texto nítido en móviles
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });
        
        if (!context) return;

        // Dimensiones físicas del buffer (multiplicadas por densidad de píxeles)
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        
        // Dimensiones visuales CSS (tamaño en pantalla)
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        // Matriz de transformación para corregir el escalado HiDPI
        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : null;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          transform: transform as any,
        };

        // Guardamos referencia a la tarea para poder cancelarla
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

  // Efecto que dispara el renderizado cuando cambia página o doc
  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, renderPage]);

  // 4. Carga de datos
  async function loadDocument(docId: string) {
    try {
      setLoading(true);
      const doc = await documentsRepo.getById(docId);
      if (!doc) {
        navigate('/documents');
        return;
      }

      setDocument(doc);

      // Obtener el ArrayBuffer del archivo
      let arrayBuffer: ArrayBuffer;

      if (doc.filePath) {
        try {
          const url = new URL(doc.filePath, import.meta.url).href;
          const response = await fetch(url);
          if (!response.ok) {
            alert(`Documento no encontrado en: ${doc.filePath}`);
            navigate(`/documents/${docId}`);
            return;
          }
          arrayBuffer = await response.arrayBuffer();
        } catch (e) {
          alert(`Error cargando documento: ${doc.filePath}`);
          navigate(`/documents/${docId}`);
          return;
        }
      } else {
        // Fallback: cargar desde DB (Blob)
        const file = await docFilesRepo.getById(doc.fileId);
        if (!file) {
          alert('Archivo PDF no encontrado');
          navigate(`/documents/${docId}`);
          return;
        }
        setDocFile(file);
        arrayBuffer = await file.blob.arrayBuffer();
      }

      // Cargar Spans existentes
      const docSpans = await spansRepo.getByDocumentId(docId);
      setSpans(docSpans);

      // Iniciar carga de PDFjs
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.530/cmaps/',
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);

      // Cargar datos para enlaces (Hechos y Partidas)
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

  // --- Funciones de Gestión de Spans y Links ---

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
        tags: spanForm.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
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

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
    // Intentar activar pantalla completa nativa del navegador si es posible
    if (!isFullscreen && containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else if (document.exitFullscreen) {
      // @ts-ignore - document.exitFullscreen puede no existir en TS estricto a veces
      document.exitFullscreen().catch(() => {});
    }
  }

  // Renderizados de Carga y Error
  if (loading) {
    return (
      <div className="page center-loading">
        <div className="spinner" />
        <span style={{ marginLeft: '1rem' }}>Cargando documento...</span>
      </div>
    );
  }

  if (!document || !pdfDoc) {
    return (
      <div className="page center-error">
        <p>Documento no encontrado</p>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${isFullscreen ? 'pdf-fullscreen-mode' : ''}`}>
      {/* Header - Oculto en modo inmersivo */}
      {!isFullscreen && (
        <div className="pdf-header">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            ←
          </button>
          <div className="pdf-title">
            <span className="truncate">{document.title}</span>
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              {document.id}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn btn-ghost btn-icon" 
              onClick={toggleFullscreen}
              title="Pantalla completa"
            >
              <Maximize size={18} />
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreateSpan}
            >
              + Span
            </button>
          </div>
        </div>
      )}

      {/* Canvas Container - Maneja Scroll y Gestos */}
      <div 
        className="pdf-canvas-container" 
        ref={containerRef}
      >
        {rendering && (
          <div className="pdf-loading">
            <div className="spinner" />
          </div>
        )}
        
        {/* Botón flotante para salir de Fullscreen */}
        {isFullscreen && (
          <button 
            className="pdf-floating-exit-btn"
            onClick={toggleFullscreen}
          >
            <Minimize size={20} />
          </button>
        )}

        <canvas ref={canvasRef} className="pdf-canvas" />
      </div>

      {/* Navigation - Oculto en modo inmersivo */}
      {!isFullscreen && (
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
            <span>/ {totalPages}</span>
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
              onClick={() => setScale(Math.min(5, scale + 0.25))}
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Spans Panel - Oculto en modo inmersivo */}
      {!isFullscreen && (
        <div className="pdf-spans">
          <h3 className="section-title">Spans ({spans.length})</h3>
          {spans.length === 0 ? (
            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
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
                      {span.id} · Págs. {span.pageStart}-{span.pageEnd}
                    </div>
                  </div>
                  <div className="span-item-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleLinkSpan(span)}
                      title="Enlazar a hecho/partida"
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
      )}

      {/* Create Span Modal */}
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
            placeholder="Ej: Firma del contrato, Cláusula 5..."
            autoFocus
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Página inicio</label>
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
            <label className="form-label">Página fin</label>
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
            placeholder="Descripción o contexto..."
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

      {/* Link Modal */}
      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title={`Enlazar span: ${selectedSpan?.label}`}
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
          <label className="form-label">Enlazar a</label>
          <div className="flex gap-sm mb-md">
            <button
              className={`btn ${linkType === 'fact' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setLinkType('fact');
                setSelectedLinkTarget('');
              }}
            >
              📋 Hecho
            </button>
            <button
              className={`btn ${linkType === 'partida' ? 'btn-primary' : 'btn-secondary'}`}
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
            className="form-select"
            value={selectedLinkTarget}
            onChange={(e) => setSelectedLinkTarget(e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {linkType === 'fact'
              ? facts.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.id} - {f.title}
                  </option>
                ))
              : partidas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.concept}
                  </option>
                ))}
          </select>
        </div>
      </Modal>
    </div>
  );
}
