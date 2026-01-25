// ============================================
// CASE OPS - Case Detail Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ListItem, Chips } from '../../components';
import {
  casesRepo,
  documentsRepo,
  factsRepo,
  partidasRepo,
  eventsRepo,
  strategiesRepo,
} from '../../db/repositories';
import type { Case, Document, Fact, Partida, Event, Strategy } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

export function CaseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caseData, setCaseData] = useState<Case | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [childCases, setChildCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCase(id);
    }
  }, [id]);

  async function loadCase(caseId: string) {
    try {
      const [
        caseInfo,
        caseDocs,
        caseFacts,
        casePartidas,
        caseEvents,
        caseStrategies,
        allCases,
      ] = await Promise.all([
        casesRepo.getById(caseId),
        documentsRepo.getByCaseId(caseId),
        factsRepo.getByCaseId(caseId),
        partidasRepo.getByCaseId(caseId),
        eventsRepo.getByCaseId(caseId),
        strategiesRepo.getByCaseId(caseId),
        casesRepo.getAll(),
      ]);

      if (!caseInfo) {
        navigate('/cases');
        return;
      }

      setCaseData(caseInfo);
      setDocuments(caseDocs);
      setFacts(caseFacts);
      setPartidas(casePartidas);
      setEvents(caseEvents);
      setStrategies(caseStrategies);
      setChildCases(allCases.filter((c) => c.parentCaseId === caseId));
    } catch (error) {
      console.error('Error loading case:', error);
    } finally {
      setLoading(false);
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

  if (!caseData) {
    return (
      <div className="page">
        <p>Caso no encontrado</p>
      </div>
    );
  }

  const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);
  const controversialFacts = facts.filter(
    (f) => f.status === 'controvertido' || f.status === 'a_probar'
  );

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {caseData.id}
        </h1>
      </div>

      {/* Main Info */}
      <div className="card mb-md">
        <div className="card-body">
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>{caseData.title}</h2>

          <div className="flex gap-sm flex-wrap mb-md">
            <span className="chip chip-primary">{caseData.type}</span>
            <span
              className={`chip ${
                caseData.status === 'activo'
                  ? 'chip-success'
                  : caseData.status === 'suspendido'
                  ? 'chip-warning'
                  : ''
              }`}
            >
              {caseData.status}
            </span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--border-radius-sm)',
            }}
          >
            <p style={{ fontSize: '0.875rem' }}>
              <strong>Juzgado:</strong> {caseData.court}
            </p>
            {caseData.autosNumber && (
              <p style={{ fontSize: '0.875rem' }}>
                <strong>Autos:</strong> {caseData.autosNumber}
              </p>
            )}
          </div>

          {caseData.notes && (
            <div className="mt-md">
              <p
                className="text-muted"
                style={{ fontSize: '0.75rem', fontWeight: 600 }}
              >
                Notas:
              </p>
              <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                {caseData.notes}
              </p>
            </div>
          )}

          {caseData.tags.length > 0 && (
            <div className="mt-md">
              <Chips items={caseData.tags} />
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-2 mb-lg">
        <div className="stat-card">
          <div className="stat-value">{documents.length}</div>
          <div className="stat-label">Documentos</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{controversialFacts.length}</div>
          <div className="stat-label">Hechos a probar</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{partidas.length}</div>
          <div className="stat-label">Partidas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{formatCurrency(totalAmount)}</div>
          <div className="stat-label">Total económico</div>
        </div>
      </div>

      {/* Child Cases */}
      {childCases.length > 0 && (
        <section className="section">
          <h2 className="section-title">Procedimientos vinculados</h2>
          <div className="card">
            {childCases.map((child) => (
              <Link
                key={child.id}
                to={`/cases/${child.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  icon={<span style={{ fontSize: '1.25rem' }}>📋</span>}
                  title={child.title}
                  subtitle={`${child.id} · ${child.type}`}
                  action="›"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Links */}
      <section className="section">
        <h2 className="section-title">Acceso rápido</h2>
        <div className="grid grid-2">
          <Link to="/documents" className="btn btn-secondary">
            📄 Documentos ({documents.length})
          </Link>
          <Link to="/facts" className="btn btn-secondary">
            📋 Hechos ({facts.length})
          </Link>
          <Link to="/partidas" className="btn btn-secondary">
            💰 Partidas ({partidas.length})
          </Link>
          <Link to="/events" className="btn btn-secondary">
            📅 Cronología ({events.length})
          </Link>
          <Link to="/warroom" className="btn btn-secondary">
            🎯 War Room ({strategies.length})
          </Link>
          <Link to="/tasks" className="btn btn-secondary">
            ✅ Tareas
          </Link>
        </div>
      </section>

      {/* Recent Facts */}
      {facts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Hechos recientes</h2>
            <Link to="/facts" className="btn btn-ghost btn-sm">
              Ver todos
            </Link>
          </div>
          <div className="card">
            {facts.slice(0, 5).map((fact) => (
              <Link
                key={fact.id}
                to={`/facts/${fact.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  icon={
                    <div
                      className="status-dot"
                      style={{
                        backgroundColor:
                          fact.status === 'controvertido' || fact.status === 'a_probar'
                            ? 'var(--color-danger)'
                            : 'var(--color-success)',
                      }}
                    />
                  }
                  title={fact.title}
                  subtitle={`${fact.id} · ${fact.status}`}
                  action="›"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Events */}
      {events.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Próximos eventos</h2>
            <Link to="/events" className="btn btn-ghost btn-sm">
              Ver todos
            </Link>
          </div>
          <div className="card">
            {events.slice(0, 3).map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}/edit`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <ListItem
                  icon={<span>{event.type === 'procesal' ? '⚖️' : '📅'}</span>}
                  title={event.title}
                  subtitle={formatDate(event.date)}
                  action="›"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
