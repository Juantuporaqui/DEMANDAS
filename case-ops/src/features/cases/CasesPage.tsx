// ============================================
// CASE OPS - Cases List Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, ListItem, Chips } from '../../components';
import { casesRepo } from '../../db/repositories';
import type { Case, CaseType, CaseStatus } from '../../types';

const TYPE_LABELS: Record<CaseType, string> = {
  ordinario: 'Ordinario',
  ejecucion: 'Ejecución',
  incidente: 'Incidente',
  administrativo: 'Administrativo',
  mediacion: 'Mediación',
  potencial: 'Potencial',
};

const STATUS_LABELS: Record<CaseStatus, string> = {
  activo: 'Activo',
  suspendido: 'Suspendido',
  archivado: 'Archivado',
  cerrado: 'Cerrado',
};

const STATUS_COLORS: Record<CaseStatus, string> = {
  activo: 'var(--color-success)',
  suspendido: 'var(--color-warning)',
  archivado: 'var(--text-muted)',
  cerrado: 'var(--text-muted)',
};

export function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      const allCases = await casesRepo.getAll();
      setCases(allCases);
    } catch (error) {
      console.error('Error loading cases:', error);
    } finally {
      setLoading(false);
    }
  }

  // Group cases by parent
  const mainCases = cases.filter((c) => !c.parentCaseId);
  const childCases = cases.filter((c) => c.parentCaseId);

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
          <h1 className="page-title">Casos</h1>
          <p className="page-subtitle">{cases.length} procedimientos</p>
        </div>
      </div>

      {cases.length === 0 ? (
        <EmptyState
          icon="⚖️"
          title="Sin casos"
          description="Los casos se crean automáticamente con el seed inicial"
        />
      ) : (
        <div className="flex flex-col gap-md">
          {mainCases.map((caseItem) => {
            const children = childCases.filter((c) => c.parentCaseId === caseItem.id);

            return (
              <div key={caseItem.id}>
                <Link
                  to={`/cases/${caseItem.id}`}
                  className="card"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div className="card-body">
                    <div className="flex items-center gap-md mb-sm">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          backgroundColor: 'rgba(37, 99, 235, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem',
                        }}
                      >
                        ⚖️
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-sm">
                          <h3>{caseItem.title}</h3>
                          <span
                            className="status-dot"
                            style={{ backgroundColor: STATUS_COLORS[caseItem.status] }}
                          />
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                          {caseItem.id} · {caseItem.court}
                        </p>
                      </div>
                      <span className="text-muted">›</span>
                    </div>

                    <div className="flex gap-sm flex-wrap">
                      <span className="chip chip-primary">{TYPE_LABELS[caseItem.type]}</span>
                      <span className="chip">{STATUS_LABELS[caseItem.status]}</span>
                      {caseItem.autosNumber && (
                        <span className="chip">Autos: {caseItem.autosNumber}</span>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Child cases */}
                {children.length > 0 && (
                  <div
                    style={{
                      marginLeft: 24,
                      borderLeft: '2px solid var(--border-color)',
                      paddingLeft: 16,
                      marginTop: 8,
                    }}
                  >
                    {children.map((child) => (
                      <Link
                        key={child.id}
                        to={`/cases/${child.id}`}
                        className="card mb-sm"
                        style={{ display: 'block', textDecoration: 'none' }}
                      >
                        <div className="card-body" style={{ padding: 12 }}>
                          <div className="flex items-center gap-sm">
                            <span style={{ fontSize: '1.25rem' }}>
                              {child.type === 'ejecucion'
                                ? '📋'
                                : child.type === 'administrativo'
                                ? '📁'
                                : child.type === 'mediacion'
                                ? '🤝'
                                : '📄'}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p className="font-bold" style={{ fontSize: '0.875rem' }}>
                                {child.title}
                              </p>
                              <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {child.id} · {TYPE_LABELS[child.type]}
                              </p>
                            </div>
                            <span
                              className="status-dot"
                              style={{ backgroundColor: STATUS_COLORS[child.status] }}
                            />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
