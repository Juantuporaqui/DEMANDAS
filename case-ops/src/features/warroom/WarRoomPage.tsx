// ============================================
// CASE OPS - War Room (Strategies) Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState, Chips } from '../../components';
import { strategiesRepo } from '../../db/repositories';
import type { Strategy } from '../../types';

export function WarRoomPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStrategies();
  }, []);

  async function loadStrategies() {
    try {
      const allStrategies = await strategiesRepo.getAll();
      setStrategies(allStrategies);
    } catch (error) {
      console.error('Error loading strategies:', error);
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

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">War Room</h1>
          <p className="page-subtitle">{strategies.length} estrategias</p>
        </div>
      </div>

      {strategies.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="Sin estrategias"
          description="Documenta los posibles ataques y las réplicas"
          action={{
            label: 'Añadir estrategia',
            onClick: () => (window.location.href = '/warroom/new'),
          }}
        />
      ) : (
        <div className="flex flex-col gap-md">
          {strategies.map((strategy) => (
            <Link
              key={strategy.id}
              to={`/warroom/${strategy.id}/edit`}
              className="card"
              style={{ textDecoration: 'none' }}
            >
              <div className="card-body">
                <div className="flex items-center gap-sm mb-sm">
                  <span
                    style={{
                      fontSize: '1.25rem',
                      width: 32,
                      height: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: 8,
                    }}
                  >
                    ⚔️
                  </span>
                  <span className="chip chip-danger">Ataque probable</span>
                  <span className="text-muted" style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                    {strategy.id}
                  </span>
                </div>

                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>
                  {strategy.attack.substring(0, 100)}
                  {strategy.attack.length > 100 ? '...' : ''}
                </h3>

                {strategy.risk && (
                  <div className="mb-sm">
                    <p
                      className="text-muted"
                      style={{ fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Riesgo:
                    </p>
                    <p
                      className="text-warning"
                      style={{ fontSize: '0.875rem' }}
                    >
                      {strategy.risk.substring(0, 80)}
                      {strategy.risk.length > 80 ? '...' : ''}
                    </p>
                  </div>
                )}

                <div
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-sm)',
                    marginTop: 'var(--spacing-sm)',
                  }}
                >
                  <div className="flex items-center gap-sm mb-sm">
                    <span>🛡️</span>
                    <span
                      className="text-success"
                      style={{ fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      Réplica
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem' }}>
                    {strategy.rebuttal.substring(0, 100)}
                    {strategy.rebuttal.length > 100 ? '...' : ''}
                  </p>
                </div>

                {strategy.tags.length > 0 && (
                  <div className="mt-sm">
                    <Chips items={strategy.tags.slice(0, 3)} />
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link to="/warroom/new">
        <FAB icon="+" label="Nueva estrategia" onClick={() => {}} />
      </Link>
    </div>
  );
}
