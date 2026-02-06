// ============================================
// CASE OPS - Partidas (Economic Items) List Page
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAB, EmptyState } from '../../components';
import { partidasRepo, linksRepo } from '../../db/repositories';
import type { Partida, PartidaState } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

type FilterType = 'all' | 'reclamable' | 'discutida' | 'neutral' | 'prescrita_interna';

const STATE_LABELS: Record<PartidaState, string> = {
  reclamable: 'Reclamable',
  discutida: 'Discutida',
  prescrita_interna: 'Prescrita (interna)',
  neutral: 'Neutral',
};

const STATE_COLORS: Record<PartidaState, string> = {
  reclamable: 'var(--color-success)',
  discutida: 'var(--color-danger)',
  prescrita_interna: 'var(--text-muted)',
  neutral: 'var(--color-info)',
};

export function PartidasPage() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [evidenceCounts, setEvidenceCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadPartidas();
  }, []);

  async function loadPartidas() {
    try {
      const allPartidas = await partidasRepo.getAll();
      setPartidas(allPartidas);

      // Get evidence counts
      const counts: Record<string, number> = {};
      for (const partida of allPartidas) {
        const evidence = await linksRepo.getEvidenceForPartida(partida.id);
        counts[partida.id] = evidence.length;
      }
      setEvidenceCounts(counts);
    } catch (error) {
      console.error('Error loading partidas:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredPartidas = partidas.filter((p) => {
    if (filter === 'all') return true;
    return p.state === filter;
  });

  const counts = {
    all: partidas.length,
    reclamable: partidas.filter((p) => p.state === 'reclamable').length,
    discutida: partidas.filter((p) => p.state === 'discutida').length,
    neutral: partidas.filter((p) => p.state === 'neutral').length,
    prescrita_interna: partidas.filter((p) => p.state === 'prescrita_interna').length,
  };

  const totalAmount = filteredPartidas.reduce((sum, p) => sum + p.amountCents, 0);

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
          <h1 className="page-title">Partidas</h1>
          <p className="page-subtitle">Total: {formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-md flex flex-wrap gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-2">
        <button
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'all'
              ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500'
          }`}
          onClick={() => setFilter('all')}
        >
          Todas ({counts.all})
        </button>
        <button
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'reclamable'
              ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
              : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500'
          }`}
          onClick={() => setFilter('reclamable')}
        >
          Reclamables ({counts.reclamable})
        </button>
        <button
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'discutida'
              ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
              : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500'
          }`}
          onClick={() => setFilter('discutida')}
        >
          Discutidas ({counts.discutida})
        </button>
        <button
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            filter === 'neutral'
              ? 'border-sky-500/40 bg-sky-500/20 text-sky-300'
              : 'border-slate-700 bg-slate-900/50 text-slate-300 hover:border-slate-500'
          }`}
          onClick={() => setFilter('neutral')}
        >
          Neutras ({counts.neutral})
        </button>
      </div>

      {filteredPartidas.length === 0 ? (
        <EmptyState
          icon="💰"
          title="Sin partidas"
          description={
            filter === 'all'
              ? 'Añade partidas económicas para el análisis'
              : `No hay partidas con estado "${filter}"`
          }
          action={
            filter === 'all'
              ? {
                  label: 'Añadir partida',
                  onClick: () => (window.location.href = '/partidas/new'),
                }
              : undefined
          }
        />
      ) : (
        <div className="space-y-3 rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-900/70 to-slate-950/60 p-3">
          {filteredPartidas.map((partida) => {
            const hasEvidence = evidenceCounts[partida.id] > 0;
            const needsEvidence = partida.state === 'discutida';

            return (
              <Link
                key={partida.id}
                to={`/partidas/${partida.id}`}
                className="block rounded-xl border border-slate-700/70 bg-slate-900/50 p-3 text-inherit no-underline transition hover:-translate-y-0.5 hover:border-emerald-500/40 hover:bg-slate-900/80"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        backgroundColor: `${STATE_COLORS[partida.state]}20`,
                        border: `1px solid ${STATE_COLORS[partida.state]}55`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                      }}
                    >
                      💰
                    </div>
                    <div>
                      <p className="m-0 text-base font-bold text-white">{formatCurrency(partida.amountCents)}</p>
                      <p className="m-0 text-sm text-slate-200">{partida.concept}</p>
                      <p className="m-0 mt-1 text-xs text-slate-400">
                        {partida.id} · {formatDate(partida.date)} · {evidenceCounts[partida.id] || 0} evidencias
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        color: STATE_COLORS[partida.state],
                        borderColor: `${STATE_COLORS[partida.state]}66`,
                        backgroundColor: `${STATE_COLORS[partida.state]}1A`,
                      }}
                    >
                      {STATE_LABELS[partida.state]}
                    </span>
                    {needsEvidence && !hasEvidence && (
                      <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold text-rose-300">
                        Sin evidencia
                      </span>
                    )}
                    <span className="text-sm text-slate-500">›</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <div className="mt-lg rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4">
        <h3 className="mb-md text-sm font-semibold uppercase tracking-wider text-slate-300">Resumen económico</h3>
        <div className="grid grid-2 gap-3">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Reclamables
              </p>
              <p className="font-bold text-success">
                {formatCurrency(
                  partidas
                    .filter((p) => p.state === 'reclamable')
                    .reduce((sum, p) => sum + p.amountCents, 0)
                )}
              </p>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
              <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                Discutidas
              </p>
              <p className="font-bold text-danger">
                {formatCurrency(
                  partidas
                    .filter((p) => p.state === 'discutida')
                    .reduce((sum, p) => sum + p.amountCents, 0)
                )}
              </p>
            </div>
        </div>
      </div>

      <Link to="/partidas/new">
        <FAB icon="+" label="Nueva partida" onClick={() => {}} />
      </Link>
    </div>
  );
}
