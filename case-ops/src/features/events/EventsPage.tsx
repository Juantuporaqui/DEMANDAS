// ============================================
// CASE OPS - Events (Timeline/Agenda) Page
// ============================================

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FAB, EmptyState } from '../../components';
import { eventsRepo } from '../../db/repositories';
import type { Event } from '../../types';
import { formatDate } from '../../utils/dates';
import { eventosDefault } from '../../data/eventosDefault';
import { ArrowLeft, Calendar, Clock, Scale } from 'lucide-react';

export function EventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'procesal' | 'factico'>('all');
  const [usingDefaults, setUsingDefaults] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    try {
      const allEvents = await eventsRepo.getAll();

      // Si no hay eventos en BD, usar eventos de ejemplo
      if (allEvents.length === 0) {
        setUsingDefaults(true);
        // Convertir eventos default a formato Event con IDs temporales
        const defaultEvents: Event[] = eventosDefault.map((e, idx) => ({
          ...e,
          id: `default-${idx + 1}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }));
        setEvents(defaultEvents.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      } else {
        setUsingDefaults(false);
        setEvents(allEvents.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      // En caso de error, mostrar eventos de ejemplo
      setUsingDefaults(true);
      const defaultEvents: Event[] = eventosDefault.map((e, idx) => ({
        ...e,
        id: `default-${idx + 1}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      setEvents(defaultEvents);
    } finally {
      setLoading(false);
    }
  }

  // Separar próximos eventos de históricos
  const hoy = new Date().toISOString().split('T')[0];
  const eventosProximos = events.filter(e => e.date >= hoy);
  const eventosHistoricos = events.filter(e => e.date < hoy);

  const filteredEvents = events.filter((e) => {
    if (filter === 'all') return true;
    return e.type === filter;
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
            title="Volver al Dashboard"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="page-title flex items-center gap-2">
              <Calendar size={20} className="text-amber-400" />
              Agenda / Cronología
            </h1>
            <p className="page-subtitle">
              {events.length} eventos {usingDefaults && '(datos de ejemplo)'}
            </p>
          </div>
        </div>
      </div>

      {/* PRÓXIMOS EVENTOS - Destacados */}
      {eventosProximos.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">
              Próximos ({eventosProximos.length})
            </span>
          </div>
          <div className="space-y-2">
            {eventosProximos.slice(0, 5).map((event) => {
              const diasRestantes = Math.ceil(
                (new Date(event.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/50 border border-slate-800/50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-amber-500/20 border border-amber-500/30 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-amber-300">
                      {diasRestantes > 0 ? diasRestantes : 'HOY'}
                    </span>
                    {diasRestantes > 0 && <span className="text-[9px] text-amber-400">días</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{event.title}</div>
                    <div className="text-xs text-slate-500">{formatDate(event.date)}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    event.type === 'procesal'
                      ? 'bg-blue-500/20 text-blue-300'
                      : 'bg-slate-700/50 text-slate-400'
                  }`}>
                    {event.type === 'procesal' ? 'Procesal' : 'Fáctico'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todos ({events.length})
        </button>
        <button
          className={`tab ${filter === 'procesal' ? 'active' : ''}`}
          onClick={() => setFilter('procesal')}
        >
          Procesales ({events.filter((e) => e.type === 'procesal').length})
        </button>
        <button
          className={`tab ${filter === 'factico' ? 'active' : ''}`}
          onClick={() => setFilter('factico')}
        >
          Fácticos ({events.filter((e) => e.type === 'factico').length})
        </button>
      </div>

      {filteredEvents.length === 0 ? (
        <EmptyState
          icon="📅"
          title="Sin eventos"
          description="Añade eventos a la cronología"
          action={{
            label: 'Añadir evento',
            onClick: () => (window.location.href = '/events/new'),
          }}
        />
      ) : (
        <div className="timeline">
          {filteredEvents.map((event, index) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-marker">
                <span>{event.type === 'procesal' ? '⚖️' : '📅'}</span>
              </div>
              <div className="timeline-content">
                <Link
                  to={`/events/${event.id}/edit`}
                  className="card"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <div className="card-body">
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {formatDate(event.date)}
                    </div>
                    <h3
                      style={{
                        marginTop: 'var(--spacing-xs)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      {event.title}
                    </h3>
                    {event.description && (
                      <p
                        className="text-muted"
                        style={{
                          fontSize: '0.875rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {event.description}
                      </p>
                    )}
                    <div className="flex gap-sm mt-sm">
                      <span
                        className={`chip ${
                          event.type === 'procesal' ? 'chip-primary' : ''
                        }`}
                      >
                        {event.type === 'procesal' ? 'Procesal' : 'Fáctico'}
                      </span>
                      {event.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .timeline {
          position: relative;
          padding-left: 40px;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background-color: var(--border-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: var(--spacing-md);
        }

        .timeline-marker {
          position: absolute;
          left: -40px;
          width: 32px;
          height: 32px;
          background-color: var(--bg-primary);
          border: 2px solid var(--border-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
        }

        .timeline-content {
          padding-left: var(--spacing-sm);
        }
      `}</style>

      <Link to="/events/new">
        <FAB icon="+" label="Nuevo evento" onClick={() => {}} />
      </Link>
    </div>
  );
}
