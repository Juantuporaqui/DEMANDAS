// ============================================
// CASE OPS - Fact Detail Page (VERSIÓN HÍBRIDA)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ListItem, Chips, Modal } from '../../components';
import { factsRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import { chaladitaDb } from '../../db/chaladitaDb'; // Importamos la DB nueva
import type { Fact, Span, Document, Link as LinkType } from '../../types';
import { formatDateTime } from '../../utils/dates';

const STATUS_LABELS: Record<string, string> = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const BURDEN_LABELS: Record<string, string> = {
  actora: 'Actora',
  demandado: 'Demandado',
  mixta: 'Mixta',
};

const RISK_LABELS: Record<string, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

export function FactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // Usamos 'any' para permitir objetos antiguos y nuevos transformados
  const [fact, setFact] = useState<any>(null);
  const [evidence, setEvidence] = useState<
    { link: any; span: any; document: any }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadFact(id);
    }
  }, [id]);

  async function loadFact(factId: string) {
    try {
      setLoading(true);
      
      // 1. Intentamos cargar de tu sistema original (factsRepo)
      let factData = await factsRepo.getById(factId);
      let isFromNewDb = false;

      // 2. Si no existe, intentamos cargar de la DB nueva (chaladitaDb)
      if (!factData) {
        // Buscamos en la tabla de hechos nueva
        // Nota: chaladitaDb usa ids string en seed.caseops.ts (ej: 'h-pic-001')
        const newFact = await chaladitaDb.hechos.get(factId);
        
        if (newFact) {
          isFromNewDb = true;
          // ADAPTADOR: Convertimos el dato nuevo al formato que tu página espera
          // para que no explote el renderizado.
          factData = {
            id: newFact.id,
            title: newFact.titulo,
            narrative: newFact.resumenCorto + (newFact.tesis ? `\n\nTESIS: ${newFact.tesis}` : ''),
            status: 'controvertido', // Valor por defecto
            burden: 'mixta',         // Valor por defecto
            risk: newFact.riesgo,
            strength: newFact.fuerza,
            tags: newFact.tags || [],
            caseId: newFact.procedimientoId, 
            createdAt: new Date(newFact.createdAt).getTime(),
            updatedAt: new Date(newFact.updatedAt).getTime(),
            // Campo extra para mostrar dinero si existe en el título
            customAmount: newFact.titulo.includes('€') ? newFact.titulo.match(/\d+(?:[.,]\d+)?€/)?.[0] : null
          };
        }
      }

      if (!factData) {
        console.warn(`Hecho ${factId} no encontrado en ninguna DB`);
        setFact(null); 
        return;
      }

      setFact(factData);

      // 3. Cargar evidencias (Lógica Híbrida)
      const evidenceData = [];

      if (!isFromNewDb) {
        // Lógica antigua: busca en linksRepo y spansRepo
        const evidenceLinks = await linksRepo.getEvidenceForFact(factId);
        for (const link of evidenceLinks) {
          const span = await spansRepo.getById(link.fromId);
          if (span) {
            const doc = await documentsRepo.getById(span.documentId);
            if (doc) {
              evidenceData.push({ link, span, document: doc });
            }
          }
        }
      } else {
        // Lógica nueva: Busca documentos en chaladitaDb relacionados por ID de procedimiento
        // Esto permite mostrar documentos aunque no tengan "spans" creados todavía
        if (factData.caseId) {
            const docs = await chaladitaDb.documentos
            .where('procedimientoId').equals(factData.caseId)
            .limit(10)
            .toArray();
            
            // Filtramos un poco para intentar ser relevantes (si el documento está vinculado al hecho)
            // Si tuvieras un campo de relación directa mejor, pero por ahora mostramos los del caso.
            const relatedDocs = docs.filter(d => 
                d.hechosIds?.includes(factData.id) || 
                // O si el título del documento parece relevante
                d.tipo === 'demanda' || 
                d.tipo === 'contestacion'
            );

            // Si no hay específicos, mostramos los primeros 3 para que no esté vacío
            const docsToShow = relatedDocs.length > 0 ? relatedDocs : docs.slice(0, 3);

            for (const doc of docsToShow) {
                evidenceData.push({
                    link: { id: `lnk-virt-${doc.id}` }, // ID virtual para la key de React
                    span: { 
                        label: 'Documento completo', 
                        pageStart: 1, 
                        pageEnd: 1 
                    },
                    document: { 
                        id: doc.id, 
                        title: doc.descripcion || doc.tipo || 'Documento sin título' 
                    }
                });
            }
        }
      }

      setEvidence(evidenceData);

    } catch (error) {
      console.error('Error loading fact:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!fact) return;

    try {
      // Intentamos borrar en el sistema antiguo
      await linksRepo.deleteByEntity('fact', fact.id);
      await factsRepo.delete(fact.id);
      
      // Intentamos borrar también en el sistema nuevo por si acaso es de ahí
      // (Si no existe no pasa nada)
      if (fact.id) {
          await chaladitaDb.hechos.delete(fact.id);
      }
      
      navigate('/facts');
    } catch (error) {
      console.error('Error deleting fact:', error);
      alert('Error al eliminar el hecho');
    }
  }

  async function handleRemoveEvidence(linkId: string) {
    try {
        // Si es un link virtual (de la db nueva), solo lo quitamos de la vista
        if (linkId.startsWith('lnk-virt-')) {
             setEvidence(evidence.filter((e) => e.link.id !== linkId));
             return;
        }

      await linksRepo.delete(linkId);
      setEvidence(evidence.filter((e) => e.link.id !== linkId));
    } catch (error) {
      console.error('Error removing evidence:', error);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!fact) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className="page-title">Hecho no encontrado</h1>
        </div>
        <div className="p-md">
            <p className="text-muted">No se pudo cargar la información. El ID solicitado es: {id}</p>
            <button className="btn btn-primary mt-md" onClick={() => navigate('/facts')}>
                Volver a la lista
            </button>
        </div>
      </div>
    );
  }

  const needsEvidence =
    fact.status === 'controvertido' || fact.status === 'a_probar';
  const hasEvidence = evidence.length > 0;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {fact.customAmount && (
            <span style={{ color: '#10b981', marginRight: '0.5rem', fontFamily: 'monospace' }}>
                {fact.customAmount}
            </span>
          )}
          {fact.title}
        </h1>
        <Link to={`/facts/${fact.id}/edit`} className="btn btn-ghost btn-icon">
          ✏️
        </Link>
      </div>

      {/* Warning if no evidence */}
      {needsEvidence && !hasEvidence && (
        <div className="alert alert-warning mb-md">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <div className="alert-title">Sin evidencia</div>
            <div className="alert-description">
              Este hecho {fact.status === 'controvertido' ? 'controvertido' : 'a probar'}{' '}
              no tiene evidencia documental vinculada
            </div>
          </div>
        </div>
      )}

      {/* Main Info */}
      <div className="card mb-md">
        <div className="card-body">
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{fact.title}</h2>

          <div className="flex flex-wrap gap-sm mb-md">
            <span
              className={`chip ${
                fact.status === 'controvertido' || fact.status === 'a_probar'
                  ? 'chip-danger'
                  : fact.status === 'pacifico'
                  ? 'chip-success'
                  : 'chip-primary'
              }`}
            >
              {STATUS_LABELS[fact.status] || fact.status}
            </span>
            <span className="chip">{BURDEN_LABELS[fact.burden] || fact.burden}</span>
            <span
              className={`chip ${
                fact.risk === 'alto'
                  ? 'chip-danger'
                  : fact.risk === 'medio'
                  ? 'chip-warning'
                  : 'chip-success'
              }`}
            >
              Riesgo {RISK_LABELS[fact.risk] || fact.risk}
            </span>
            <span className="chip">Fuerza: {fact.strength}/5</span>
          </div>

          {fact.narrative && (
            <div className="mt-md">
              <p
                className="text-muted"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Relato:
              </p>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: 'var(--spacing-xs)' }}>
                {fact.narrative}
              </p>
            </div>
          )}

          {fact.tags && fact.tags.length > 0 && (
            <div className="mt-md">
              <Chips items={fact.tags} />
            </div>
          )}
        </div>
      </div>

      {/* Evidence */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Evidencias ({evidence.length})</h2>
        </div>

        {evidence.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted">
              <p>No hay evidencias vinculadas</p>
              <p className="mt-sm" style={{ fontSize: '0.875rem' }}>
                Ve a un documento, crea un span y enlázalo a este hecho
              </p>
              <Link to="/documents" className="btn btn-secondary mt-md">
                Ir a documentos
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            {evidence.map(({ link, span, document }) => (
              <div key={link.id} className="list-item">
                <span style={{ fontSize: '1.5rem' }}>📑</span>
                <Link
                  to={`/documents/${document.id}/view?page=${span.pageStart}`}
                  className="list-item-content"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="list-item-title">{span.label}</div>
                  <div className="list-item-subtitle">
                    {document.title} {span.pageEnd > 1 ? `· Págs. ${span.pageStart}-${span.pageEnd}` : ''}
                  </div>
                </Link>
                {!link.id.toString().startsWith('lnk-virt-') && (
                    <button
                    className="btn btn-ghost btn-icon-sm"
                    onClick={() => handleRemoveEvidence(link.id)}
                    title="Quitar evidencia"
                    >
                    ✕
                    </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Metadata */}
      <section className="section">
        <h2 className="section-title">Metadatos</h2>
        <div className="card">
          <div className="card-body">
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Caso:</strong> {fact.caseId}
            </p>
            <p className="text-muted mt-sm" style={{ fontSize: '0.75rem' }}>
              <strong>Creado:</strong> {formatDateTime(fact.createdAt)}
            </p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Actualizado:</strong> {formatDateTime(fact.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Delete */}
      <section className="section">
        <button
          className="btn btn-danger btn-block"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar hecho
        </button>
      </section>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar hecho"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que quieres eliminar el hecho{' '}
          <strong>{fact.title}</strong>?
        </p>
        <p className="mt-sm text-muted" style={{ fontSize: '0.875rem' }}>
          Se eliminarán también los enlaces de evidencia.
        </p>
      </Modal>
    </div>
  );
}
