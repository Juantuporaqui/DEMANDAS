// ============================================
// CASE OPS - Documents List Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState, ListItem } from '../../components';
import { documentsRepo, spansRepo } from '../../db/repositories';
import type { Document } from '../../types';
import { formatDate } from '../../utils/dates';

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [spanCounts, setSpanCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'no-spans'>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await documentsRepo.getAll();
      setDocuments(docs);

      // Get span counts for each document
      const counts: Record<string, number> = {};
      for (const doc of docs) {
        const spans = await spansRepo.getByDocumentId(doc.id);
        counts[doc.id] = spans.length;
      }
      setSpanCounts(counts);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    if (filter === 'no-spans') {
      return spanCounts[doc.id] === 0;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documentos</h1>
          <p className="page-subtitle">{documents.length} documentos</p>
        </div>
      </div>

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({documents.length})
        </button>
        <button
          className={`tab ${filter === 'no-spans' ? 'active' : ''}`}
          onClick={() => setFilter('no-spans')}
        >
          Sin spans ({documents.filter((d) => spanCounts[d.id] === 0).length})
        </button>
      </div>

      {filteredDocuments.length === 0 ? (
        <EmptyState
          icon="📄"
          title="Sin documentos"
          description={
            filter === 'no-spans'
              ? 'Todos los documentos tienen spans marcados'
              : 'Añade documentos para comenzar'
          }
          action={
            filter === 'all'
              ? {
                  label: 'Añadir documento',
                  onClick: () => (window.location.href = '/documents/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="card">
          {filteredDocuments.map((doc) => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItem
                icon={<span style={{ fontSize: '1.5rem' }}>📄</span>}
                title={doc.title}
                subtitle={
                  <span>
                    {doc.id}
                    {doc.annexCode && ` · ${doc.annexCode}`} · {doc.docType} ·{' '}
                    {doc.pagesCount} págs. · {spanCounts[doc.id] || 0} spans
                  </span>
                }
                action={
                  <div className="flex items-center gap-sm">
                    {spanCounts[doc.id] === 0 && (
                      <span
                        className="chip chip-warning"
                        style={{ fontSize: '0.625rem' }}
                      >
                        Sin spans
                      </span>
                    )}
                    <span>›</span>
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      )}

      <Link to="/documents/new">
        <FAB icon="+" label="Nuevo documento" onClick={() => {}} />
      </Link>
    </div>
  );
}
