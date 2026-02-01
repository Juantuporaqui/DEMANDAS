import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Maximize, Minimize, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
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

// Configuración del Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

export function PdfViewerPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Referencias al DOM
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Estado de Datos
  const [document, setDocument] = useState<Document | null>(null);
  const [docFile, setDocFile] = useState<DocFile | null>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  
  // Estado de Visualización
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Estado de Gestos Táctiles (Mutable para rendimiento)
  const touchState = useRef({
    startDist: 0,
    startScale: 1,
    isPinching: false,
  });

  // Estado de Spans y Links (Negocio)
  const [spans, setSpans] = useState<Span[]>([]);
  const [showSpanModal, setShowSpanModal] = useState(false);
  const [spanForm, setSpanForm] = useState({
    pageStart: 1,
    pageEnd: 1,
    label: '',
    note: '',
    tags: '',
  });

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedSpan, setSelectedSpan] = useState<Span | null>(null);
  const [linkType, setLinkType] = useState<'fact' | 'partida'>('fact');
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [selectedLinkTarget, setSelectedLinkTarget] = useState('');

  // ------------------------------------------------------------------
  // 1. CARGA DE DATOS
  // ------------------------------------------------------------------
  useEffect(() => {
    if (id) {
      loadDocument(id);
    }
  }, [id]);

  useEffect(() => {
    const initialPage = parseInt(searchParams.get('page') || '1', 10);
    if (totalPages > 0 && initialPage > 0 && initialPage <= totalPages) {
      setCurrentPage(initialPage);
    }
  }, [searchParams, totalPages]);

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
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          arrayBuffer = await response.arrayBuffer();
        } catch (e) {
          console.error(e);
          // Fallback o manejo de error
          const file = await docFilesRepo.getById(doc.fileId);
          if (file) {
             setDocFile(file);
             arrayBuffer = await file.blob.arrayBuffer();
          } else {
             alert(`Error cargando documento: ${doc.filePath}`);
             navigate(`/documents/${docId}`);
             return;
          }
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

      // Cargar PDF con options
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        cMapUrl: 'https://unpkg.com/pdfjs-dist@5.4.530/cmaps/',
        cMapPacked: true,
      });
      
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);

      // Cargar hechos/partidas para enlaces
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

  // ------------------------------------------------------------------
  // 2. GESTIÓN DE GESTOS TÁCTILES (FIXED PINCH ZOOM)
  // ------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        // Prevenir zoom nativo del navegador para controlar nosotros el canvas
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        touchState.current.isPinching = true;
        touchState.current.startDist = dist;
        touchState.current.startScale = scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchState.current.isPinching && e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        
        const ratio = dist / touchState.current.startDist;
        // Limitamos el zoom visual temporal (0.5x a 5.0x)
        const newTempScale = Math.min(Math.max(0.5, touchState.current.startScale * ratio), 5.0);
        
        // Aplicamos transformación CSS al canvas para feedback inmediato (60fps)
        if (canvasRef.current) {
          const cssScale = newTempScale / scale;
          canvasRef.current.style.transform = `scale(${cssScale})`;
          // 'center top' suele funcionar mejor para la experiencia de usuario en listas largas
          canvasRef.current.style.transformOrigin = 'center top';
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchState.current.isPinching && e.touches.length < 2) {
        touchState.current.isPinching = false;
        
        if (canvasRef.current) {
          // Leer la escala final aplicada via CSS
          const transform = canvasRef.current.style.transform;
          const match = transform.match(/scale\((.+)\)/);
          
          if (match) {
            const cssRatio = parseFloat(match[1]);
            const finalScale = Math.min(Math.max(0.5, scale * cssRatio), 5.0);
            
            // Limpiar estilos temporales
            canvasRef.current.style.transform = '';
            canvasRef.current.style.transformOrigin = '';
            
            // Disparar renderizado real con la nueva escala para nitidez
            setScale(finalScale);
          }
        }
      }
    };

    // Añadir listeners con { passive: false } es CRÍTICO para que preventDefault funcione
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scale]); 

  // ------------------------------------------------------------------
  // 3. RENDERIZADO DEL PDF
  // ------------------------------------------------------------------
  const renderPage = useCallback(
    async (pageNum: number) => {
      if (!pdfDoc || !canvasRef.current) return;

      // Cancelar renderizado previo si existe
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch (err) {
          // Ignorar error de cancelación
        }
      }

      setRendering(true);

      try {
        const page = await pdfDoc.getPage(pageNum);
        
        // Usar devicePixelRatio para pantallas retina/móviles
        const outputScale = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale });

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d', { alpha: false });
        
        if (!context) return;

        // Dimensiones físicas (Buffer)
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        
        // Dimensiones visuales (CSS)
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const transform = outputScale !== 1 
          ? [outputScale, 0, 0, outputScale, 0, 0] 
          : null;

        renderTaskRef.current = page.render({
          canvasContext: context,
          viewport: viewport,
          transform: transform as any,
        });

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

  useEffect(() => {
    if (pdfDoc && currentPage > 0) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, renderPage]);

  // ------------------------------------------------------------------
  // 4. LÓGICA DE NEGOCIO (SPANS, LINKS, UI)
  // ------------------------------------------------------------------

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }

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

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  if (loading) {
    return (
      <div className="page center-loading">
        <div className="spinner" />
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
    <div className={`pdf-viewer ${isFullscreen ? 'mode-fullscreen' : ''}`}>
      
      {/* HEADER (Visible si no es fullscreen) */}
      {!isFullscreen && (
        <header className="pdf-header">
          <button className="btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="pdf-title-container">
            <h1 className="pdf-doc-title">{document.title}</h1>
            <span className="pdf-doc-meta">Página {currentPage} de {totalPages}</span>
          </div>
          <div className="pdf-header-actions">
            <button className="btn-icon" onClick={toggleFullscreen} title="Pantalla completa">
              <Maximize size={20} />
            </button>
            <button className="btn-primary-sm" onClick={handleCreateSpan}>
              + Span
            </button>
          </div>
        </header>
      )}

      {/* VIEWPORT (Área de Canvas con Scroll) */}
      <div className="pdf-viewport" ref={containerRef}>
        {rendering && (
          <div className="pdf-loader">
            <div className="spinner" />
          </div>
        )}
        
        {/* Botón flotante para salir de fullscreen */}
        {isFullscreen && (
          <button className="floating-exit-btn" onClick={toggleFullscreen}>
            <Minimize size={24} />
          </button>
        )}
        
        <canvas ref={canvasRef} className="pdf-canvas-element" />
      </div>

      {/* FOOTER TOOLBAR (Visible si no es fullscreen) */}
      {!isFullscreen && (
        <footer className="pdf-toolbar">
          <div className="pdf-pagination">
            <button 
              className="btn-icon" 
              disabled={currentPage <= 1} 
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft size={24} />
            </button>
            <span className="page-indicator">{currentPage} / {totalPages}</span>
            <button 
              className="btn-icon" 
              disabled={currentPage >= totalPages} 
              onClick={() => goToPage(currentPage + 1)}
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          <div className="pdf-zoom-controls">
            <button className="btn-icon" onClick={() => setScale(s => Math.max(0.5, s - 0.25))}>
              <ZoomOut size={20} />
            </button>
            <span className="zoom-indicator">{Math.round(scale * 100)}%</span>
            <button className="btn-icon" onClick={() => setScale(s => Math.min(5, s + 0.25))}>
              <ZoomIn size={20} />
            </button>
          </div>
        </footer>
      )}

      {/* SPANS DRAWER (Visible si no es fullscreen y hay spans) */}
      {!isFullscreen && spans.length > 0 && (
        <div className="pdf-spans-drawer">
          <div className="spans-header">Marcadores ({spans.length})</div>
          <div className="spans-scroll">
            {spans.map((span) => (
              <div
                key={span.id}
                className={`span-chip ${
                  currentPage >= span.pageStart && currentPage <= span.pageEnd
                    ? 'active'
                    : ''
                }`}
                onClick={() => goToPage(span.pageStart)}
              >
                <span className="span-label">{span.label}</span>
                <button
                  className="span-del"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSpan(span);
                  }}
                >
                  ×
                </button>
                <button
                  className="span-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLinkSpan(span);
                  }}
                >
                  🔗
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALES */}
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
            placeholder="Ej: Firma del contrato"
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
            />
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Enlazar Span"
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
          <label className="form-label">Tipo</label>
          <div className="flex gap-2 mb-4">
            <button
              className={`btn flex-1 ${linkType === 'fact' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLinkType('fact')}
            >
              Hecho
            </button>
            <button
              className={`btn flex-1 ${linkType === 'partida' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLinkType('partida')}
            >
              Partida
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Seleccionar destino</label>
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
