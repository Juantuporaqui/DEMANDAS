// ============================================
// CASE OPS - Fact Detail Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ListItem, Chips, Modal } from '../../components';
import { factsRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import type { Fact, Span, Document, Link as LinkType } from '../../types';
import { formatDateTime } from '../../utils/dates';

const STATUS_LABELS = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const BURDEN_LABELS = {
  actora: 'Actora',
  demandado: 'Demandado',
  mixta: 'Mixta',
};

const RISK_LABELS = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

export function FactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fact, setFact] = useState<Fact | null>(null);
  const [evidence, setEvidence] = useState<
    { link: LinkType; span: Span; document: Document }[]
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
      const factData = await factsRepo.getById(factId);
      if (!factData) {
        navigate('/facts');
        return;
      }

      setFact(factData);

      // Load evidence (spans linked to this fact)
      const evidenceLinks = await linksRepo.getEvidenceForFact(factId);
      const evidenceData = [];

      for (const link of evidenceLinks) {
        const span = await spansRepo.getById(link.fromId);
        if (span) {
          const doc = await documentsRepo.getById(span.documentId);
          if (doc) {
            evidenceData.push({ link, span, document: doc });
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
      await linksRepo.deleteByEntity('fact', fact.id);
      await factsRepo.delete(fact.id);
      navigate('/facts');
    } catch (error) {
      console.error('Error deleting fact:', error);
      alert('Error al eliminar el hecho');
    }
  }

  async function handleRemoveEvidence(linkId: string) {
    try {
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
          {fact.id}
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
              {STATUS_LABELS[fact.status]}
            </span>
            <span className="chip">{BURDEN_LABELS[fact.burden]}</span>
            <span
              className={`chip ${
                fact.risk === 'alto'
                  ? 'chip-danger'
                  : fact.risk === 'medio'
                  ? 'chip-warning'
                  : 'chip-success'
              }`}
            >
              Riesgo {RISK_LABELS[fact.risk]}
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

          {fact.tags.length > 0 && (
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
                    {document.title} · Págs. {span.pageStart}-{span.pageEnd}
                  </div>
                </Link>
                <button
                  className="btn btn-ghost btn-icon-sm"
                  onClick={() => handleRemoveEvidence(link.id)}
                  title="Quitar evidencia"
                >
                  ✕
                </button>
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
          Se eliminarán también los {evidence.length} enlaces de evidencia.
        </p>
      </Modal>
    </div>
  );
}
