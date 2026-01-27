// ============================================
// CASE OPS - Dashboard Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  casesRepo,
  documentsRepo,
  factsRepo,
  partidasRepo,
  getAlerts,
} from '../../db/repositories';
import { formatCurrency } from '../../utils/validators';
import type { Case, Fact, Partida } from '../../types';

export function DashboardPage() {
  const [stats, setStats] = useState({
    cases: 0,
    documents: 0,
    facts: 0,
    factsControvertidos: 0,
    partidas: 0,
    totalAmount: 0,
  });
  const [alerts, setAlerts] = useState<
    { id: string; type: string; title: string; description: string }[]
  >([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [recentFacts, setRecentFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [cases, documents, facts, partidas, alertsData] = await Promise.all([
        casesRepo.getAll(),
        documentsRepo.getAll(),
        factsRepo.getAll(),
        partidasRepo.getAll(),
        getAlerts(),
      ]);

      // Get active case (first one for now)
      if (cases.length > 0) {
        setActiveCase(cases[0]);
      }

      // Recent controversial facts
      const controversial = facts.filter(
        (f) => f.status === 'controvertido' || f.status === 'a_probar'
      );
      setRecentFacts(controversial.slice(0, 5));

      // Calculate stats
      const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);

      setStats({
        cases: cases.length,
        documents: documents.length,
        facts: facts.length,
        factsControvertidos: controversial.length,
        partidas: partidas.length,
        totalAmount,
      });

      // Limit alerts to 3
      setAlerts(alertsData.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="loading-overlay">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Case Ops</h1>
          <p className="page-subtitle">Panel de control</p>
        </div>
        <Link to="/settings" className="btn btn-ghost btn-icon">
          ⚙️
        </Link>
      </div>

      {/* Active Case */}
      {activeCase && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Caso Activo</h2>
            <Link to="/cases" className="btn btn-ghost btn-sm">
              Ver todos
            </Link>
          </div>
          <Link to={`/cases/${activeCase.id}`} className="card" style={{ display: 'block', textDecoration: 'none' }}>
            <div className="card-body">
              <div className="flex items-center gap-md">
                <div
                  className="list-item-icon"
                  style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}
                >
                  ⚖️
                </div>
                <div>
                  <h3 className="list-item-title">{activeCase.title}</h3>
                  <p className="list-item-subtitle">
                    {activeCase.court} - {activeCase.autosNumber}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Stats Grid */}
      <section className="section">
        <h2 className="section-title">Resumen</h2>
        <div className="grid grid-2" style={{ marginTop: 'var(--spacing-md)' }}>
          <Link to="/documents" className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-value">{stats.documents}</div>
            <div className="stat-label">Documentos</div>
          </Link>
          <Link to="/facts" className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-value">{stats.factsControvertidos}</div>
            <div className="stat-label">Hechos controvertidos</div>
          </Link>
          <Link to="/partidas" className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-value">{stats.partidas}</div>
            <div className="stat-label">Partidas</div>
          </Link>
          <div className="stat-card">
            <div className="stat-value">{formatCurrency(stats.totalAmount)}</div>
            <div className="stat-label">Total económico</div>
          </div>
        </div>
      </section>

      {/* Alerts */}
      {alerts.length > 0 && (
        <section className="section">
          <h2 className="section-title">Alertas</h2>
          <div className="flex flex-col gap-sm" style={{ marginTop: 'var(--spacing-md)' }}>
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert alert-${alert.type === 'warning' ? 'warning' : 'info'}`}
              >
                <span className="alert-icon">
                  {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-description">{alert.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Controversial Facts */}
      {recentFacts.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Hechos a probar</h2>
            <Link to="/facts" className="btn btn-ghost btn-sm">
              Ver todos
            </Link>
          </div>
          <div className="card">
            {recentFacts.map((fact) => (
              <Link
                key={fact.id}
                to={`/facts/${fact.id}`}
                className="list-item"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="status-dot"
                  style={{
                    backgroundColor:
                      fact.risk === 'alto'
                        ? 'var(--color-danger)'
                        : fact.risk === 'medio'
                        ? 'var(--color-warning)'
                        : 'var(--color-success)',
                  }}
                />
                <div className="list-item-content">
                  <div className="list-item-title">{fact.title}</div>
                  <div className="list-item-subtitle">
                    {fact.id} · {fact.status} · {fact.burden}
                  </div>
                </div>
                <span className="list-item-action">›</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="section">
        <h2 className="section-title">Acciones rápidas</h2>
        <div className="grid grid-2" style={{ marginTop: 'var(--spacing-md)' }}>
          <Link to="/documents/new" className="btn btn-secondary btn-block">
            📄 Nuevo documento
          </Link>
          <Link to="/facts/new" className="btn btn-secondary btn-block">
            📋 Nuevo hecho
          </Link>
          <Link to="/partidas/new" className="btn btn-secondary btn-block">
            💰 Nueva partida
          </Link>
          <Link to="/search" className="btn btn-primary btn-block">
            🔍 Buscar
          </Link>
        </div>
      </section>
    </div>
  );
}
