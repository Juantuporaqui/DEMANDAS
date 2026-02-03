// ============================================
// CASE OPS - Facts (Hechos) List Page
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState, Modal } from '../../components';
import { casesRepo, documentsRepo, factsRepo, linksRepo, spansRepo } from '../../db/repositories';
import type { Case, Document, Fact, FactStatus, Span } from '../../types';

type FilterType = 'all' | 'controvertido' | 'a_probar' | 'pacifico' | 'admitido';

const STATUS_LABELS: Record<FactStatus, string> = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const STATUS_COLORS: Record<FactStatus, string> = {
  pacifico: 'var(--color-success)',
  controvertido: 'var(--color-danger)',
  admitido: 'var(--color-info)',
  a_probar: 'var(--color-warning)',
};

export function FactsPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [evidenceCounts, setEvidenceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [selectedFact, setSelectedFact] = useState<Fact | null>(null);
  const [evidenceDetails, setEvidenceDetails] = useState<
    Array<{ linkId: string; span?: Span; document?: Document; comment?: string }>
  >([]);
  const [evidenceLoading, setEvidenceLoading] = useState(false);

  useEffect(() => {
    loadFacts();
  }, []);

  async function loadFacts() {
    try {
      const allCases = await casesRepo.getAll();
      setCases(allCases);
      const allFacts = await factsRepo.getAll();
      setFacts(allFacts);

      // Get evidence counts
      const counts: Record<string, number> = {};
      for (const fact of allFacts) {
        const evidence = await linksRepo.getEvidenceForFact(fact.id);
        counts[fact.id] = evidence.length;
      }
      setEvidenceCounts(counts);
    } catch (error) {
      console.error('Error loading facts:', error);
    } finally {
      setLoading(false);
    }
  }

  const caseOptions = useMemo(() => {
    return cases
      .map((caseItem) => {
        const lower = `${caseItem.title} ${caseItem.court}`.toLowerCase();
        if (lower.includes('picassent')) {
          return { id: caseItem.id, label: 'PICASSENT' };
        }
        if (lower.includes('mislata')) {
          return { id: caseItem.id, label: 'MISLATA' };
        }
        if (lower.includes('quart')) {
          return { id: caseItem.id, label: 'QUART' };
        }
        return { id: caseItem.id, label: caseItem.title };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [cases]);

  useEffect(() => {
    if (!selectedCaseId && caseOptions.length > 0) {
      const priority = ['PICASSENT', 'MISLATA', 'QUART'];
      const preferred = priority
        .map((label) => caseOptions.find((option) => option.label === label))
        .find(Boolean);
      setSelectedCaseId(preferred?.id ?? caseOptions[0].id);
    }
  }, [caseOptions, selectedCaseId]);

  const filteredFacts = facts.filter((fact) => {
    if (selectedCaseId && fact.caseId !== selectedCaseId) return false;
    if (filter === 'all') return true;
    return fact.status === filter;
  });

  const counts = {
    all: facts.length,
    controvertido: facts.filter((f) => f.status === 'controvertido').length,
    a_probar: facts.filter((f) => f.status === 'a_probar').length,
    pacifico: facts.filter((f) => f.status === 'pacifico').length,
    admitido: facts.filter((f) => f.status === 'admitido').length,
  };

  const selectedCaseLabel =
    caseOptions.find((option) => option.id === selectedCaseId)?.label ?? 'Evidencias';

  async function openEvidenceDetails(fact: Fact) {
    setSelectedFact(fact);
    setEvidenceDetails([]);
    setEvidenceLoading(true);
    try {
      const links = await linksRepo.getEvidenceForFact(fact.id);
      const details = await Promise.all(
        links.map(async (link) => {
          const span = await spansRepo.getById(link.fromId);
          const document = span ? await documentsRepo.getById(span.documentId) : undefined;
          return {
            linkId: link.id,
            span,
            document,
            comment: link.meta.comment,
          };
        })
      );
      setEvidenceDetails(details);
    } catch (error) {
      console.error('Error loading evidence details:', error);
    } finally {
      setEvidenceLoading(false);
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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Evidencias</h1>
          <p className="page-subtitle">{selectedCaseLabel} · {filteredFacts.length} evidencias</p>
        </div>
      </div>

      <div className="tabs mb-md">
        {caseOptions.map((option) => (
          <button
            key={option.id}
            className={`tab ${selectedCaseId === option.id ? 'active' : ''}`}
            onClick={() => setSelectedCaseId(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({counts.all})
        </button>
        <button
          className={`tab ${filter === 'controvertido' ? 'active' : ''}`}
          onClick={() => setFilter('controvertido')}
        >
          Controvertidos ({counts.controvertido})
        </button>
        <button
          className={`tab ${filter === 'a_probar' ? 'active' : ''}`}
          onClick={() => setFilter('a_probar')}
        >
          A probar ({counts.a_probar})
        </button>
        <button
          className={`tab ${filter === 'pacifico' ? 'active' : ''}`}
          onClick={() => setFilter('pacifico')}
        >
          Pacíficos ({counts.pacifico})
        </button>
      </div>

      {filteredFacts.length === 0 ? (
        <EmptyState
          icon="📋"
          title="Sin evidencias"
          description={
            filter === 'all'
              ? 'Añade evidencias para comenzar el análisis'
              : `No hay hechos con estado "${filter}"`
          }
          action={
            filter === 'all'
              ? {
                  label: 'Añadir hecho',
                  onClick: () => (window.location.href = '/facts/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredFacts.map((fact) => {
            const hasEvidence = (evidenceCounts[fact.id] || 0) > 0;
            const needsEvidence =
              fact.status === 'controvertido' || fact.status === 'a_probar';
            const statusLabel = STATUS_LABELS[fact.status as FactStatus] ?? fact.status;
            const statusColor = STATUS_COLORS[fact.status as FactStatus] ?? 'var(--color-muted)';

            return (
              <div
                key={fact.id}
                className="relative rounded-2xl border border-slate-800 bg-slate-950/60 p-4 shadow-lg shadow-slate-950/30 transition hover:border-cyan-500/50"
              >
                <button
                  type="button"
                  onClick={() => openEvidenceDetails(fact)}
                  className="flex h-full w-full flex-col justify-between text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${statusColor}20` }}
                      >
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: statusColor }}
                        />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {statusLabel}
                      </span>
                    </div>
                    {needsEvidence && !hasEvidence && (
                      <span className="chip chip-danger text-[0.65rem]">Sin evidencia</span>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <h3 className="text-base font-semibold text-slate-100">{fact.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-3">{fact.narrative}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>{fact.id}</span>
                    <span>{evidenceCounts[fact.id] || 0} evidencias</span>
                  </div>
                </button>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="uppercase tracking-widest">{fact.burden}</span>
                  <Link
                    to={`/facts/${fact.id}`}
                    className="text-cyan-300 hover:text-cyan-200"
                    onClick={(event) => event.stopPropagation()}
                  >
                    Ver detalle →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link to="/facts/new">
        <FAB icon="+" label="Nuevo hecho" onClick={() => {}} />
      </Link>

      <Modal
        isOpen={Boolean(selectedFact)}
        onClose={() => setSelectedFact(null)}
        title={selectedFact ? `Evidencia · ${selectedFact.title}` : 'Evidencia'}
      >
        {selectedFact && (
          <div className="space-y-4 text-sm text-slate-200">
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Desarrollo de evidencia
              </div>
              <p className="mt-2 text-slate-100">{selectedFact.narrative}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Evidencias vinculadas
              </div>
              {evidenceLoading ? (
                <div className="mt-3 flex items-center gap-2 text-slate-400">
                  <div className="spinner h-4 w-4" /> Cargando evidencias...
                </div>
              ) : evidenceDetails.length === 0 ? (
                <p className="mt-2 text-slate-400">Sin evidencias adjuntas todavía.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {evidenceDetails.map((item) => (
                    <li
                      key={item.linkId}
                      className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                    >
                      <div className="text-sm font-semibold text-slate-100">
                        {item.document?.title ?? 'Documento sin título'}
                      </div>
                      <div className="mt-1 text-xs text-slate-400">
                        {item.span
                          ? `Páginas ${item.span.pageStart}-${item.span.pageEnd}`
                          : 'Span no disponible'}
                      </div>
                      {item.comment && (
                        <p className="mt-2 text-xs text-slate-300">{item.comment}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
