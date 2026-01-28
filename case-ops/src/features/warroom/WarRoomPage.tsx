import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { strategiesRepo } from '../../db/repositories';
import type { Strategy } from '../../types';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import { EmptyState } from '../../components'; // Asegúrate de que este export existe o usa ui/components/EmptyState

export function WarRoomPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    strategiesRepo.getAll().then((data) => {
      setStrategies(data);
      setLoading(false);
    });
  }, []);

  // Función para determinar el color según el riesgo (Estilo Semáforo)
  const getRiskColor = (riskText: string) => {
    const text = riskText.toLowerCase();
    if (text.includes('alto')) return 'border-l-4 border-l-rose-500 bg-rose-500/5';
    if (text.includes('medio')) return 'border-l-4 border-l-amber-500 bg-amber-500/5';
    return 'border-l-4 border-l-emerald-500 bg-emerald-500/5';
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando inteligencia...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* CABECERA CON NAVEGACIÓN MÓVIL */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          {/* Botón de retorno seguro para móvil */}
          <Link 
            to="/dashboard" 
            className="mb-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 lg:hidden"
          >
            ← Volver al Panel
          </Link>
          
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Estrategia Procesal
          </p>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            War Room
          </h1>
          <p className="text-sm text-slate-400">
            {strategies.length} líneas de defensa activas
          </p>
        </div>

        <Link
          to="/warroom/new"
          className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20 transition hover:bg-rose-500 active:translate-y-0.5"
        >
          + Nueva Estrategia
        </Link>
      </header>

      {/* LISTA DE ESTRATEGIAS */}
      {strategies.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-lg font-semibold text-slate-200">Sala de guerra vacía</h3>
          <p className="text-slate-500 mb-6">No hay estrategias definidas para este caso.</p>
          <Link
            to="/warroom/new"
            className="text-amber-400 hover:underline text-sm uppercase tracking-wider font-bold"
          >
            Definir primera línea de defensa
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {strategies.map((strategy) => (
            <Link
              key={strategy.id}
              to={`/warroom/${strategy.id}/edit`} // Asumiendo que existe ruta de edición
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-slate-600 hover:shadow-2xl hover:shadow-black/50"
            >
              <div className={`absolute inset-y-0 left-0 w-1 ${getRiskColor(strategy.risk || '').split(' ')[1]}`} />
              
              <div className="space-y-4">
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-start justify-between gap-2 pl-3">
                  <div className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {strategy.caseId ? 'Vinculada' : 'General'}
                  </div>
                  <span className="text-xs font-mono text-slate-500">#{strategy.id.slice(0, 4)}</span>
                </div>

                {/* Contenido Principal */}
                <div className="pl-3">
                  <h3 className="font-bold text-slate-100 leading-snug group-hover:text-amber-400 transition-colors">
                    {strategy.attack}
                  </h3>
                  
                  <div className="mt-3 space-y-2">
                    <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                      <p className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider mb-1">
                        Nuestra Respuesta
                      </p>
                      <p className="text-sm text-slate-300 line-clamp-3">
                        {strategy.rebuttal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie de tarjeta */}
              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 pl-3">
                 <div className="flex gap-2">
                    {strategy.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] text-slate-500">#{tag}</span>
                    ))}
                 </div>
                 <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">
                   EDITAR →
                 </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
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
