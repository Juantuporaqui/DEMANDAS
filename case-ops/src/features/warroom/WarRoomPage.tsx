// ============================================
// CASE OPS - War Room Page (Mejorado)
// Estrategia integrada para Picassent y Mislata
// ============================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { strategiesRepo } from '../../db/repositories';
import type { Strategy } from '../../types';
import Card from '../../ui/components/Card';
import {
  getAllEstrategias,
  getEstrategiaPorProcedimiento,
  getEstrategiaPorTipo,
  type LineaEstrategica,
  type Procedimiento,
  type TipoEstrategia,
} from '../../data/estrategia/informeEstrategico';

// Colores y estilos
const tipoColors: Record<TipoEstrategia, string> = {
  defensa: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  ataque: 'bg-red-500/20 text-red-300 border-red-500/50',
  replica: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  pregunta: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
};

const tipoIcons: Record<TipoEstrategia, string> = {
  defensa: '🛡️',
  ataque: '⚔️',
  replica: '💬',
  pregunta: '❓',
};

const prioridadColors: Record<string, string> = {
  critica: 'bg-red-500',
  alta: 'bg-orange-500',
  media: 'bg-amber-500',
  baja: 'bg-slate-500',
};

// Componente de tarjeta de estrategia
function EstrategiaCard({
  estrategia,
  onCopy,
}: {
  estrategia: LineaEstrategica;
  onCopy: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden transition-all ${
        estrategia.prioridad === 'critica' ? 'ring-1 ring-red-500/30' : ''
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{tipoIcons[estrategia.tipo]}</span>
            <span className={`text-xs px-2 py-0.5 rounded border ${tipoColors[estrategia.tipo]}`}>
              {estrategia.tipo.toUpperCase()}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${prioridadColors[estrategia.prioridad]}`}
              title={`Prioridad: ${estrategia.prioridad}`}
            />
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded ${
              estrategia.procedimiento === 'mislata'
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'bg-orange-500/20 text-orange-300'
            }`}
          >
            {estrategia.procedimiento.toUpperCase()}
          </span>
        </div>

        <h3 className="font-bold text-white text-lg">{estrategia.titulo}</h3>
        <p className="text-slate-400 text-sm mt-1">{estrategia.descripcion}</p>
      </div>

      {/* Fundamento */}
      <div className="px-4 py-3 bg-slate-800/30">
        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Fundamento</p>
        <p className="text-slate-300 text-sm">{estrategia.fundamento}</p>
      </div>

      {/* Frases clave - siempre visibles */}
      {estrategia.frasesClave.length > 0 && (
        <div className="p-4 border-t border-slate-800/50">
          <p className="text-xs text-amber-500 uppercase font-bold mb-2">Frases clave</p>
          <div className="space-y-2">
            {estrategia.frasesClave.map((frase, i) => (
              <div
                key={i}
                className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 flex items-start gap-2"
              >
                <p className="text-amber-200 text-sm italic flex-1">{frase}</p>
                <button
                  onClick={() => onCopy(frase)}
                  className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2 py-1 rounded transition-colors flex-shrink-0"
                >
                  Copiar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandir */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 text-sm text-slate-500 hover:text-white transition-colors border-t border-slate-800/50 text-left"
      >
        {expanded ? '▼ Ocultar detalles' : '▶ Ver más detalles'}
      </button>

      {/* Contenido expandido */}
      {expanded && (
        <div className="p-4 border-t border-slate-800/50 space-y-3">
          {estrategia.articulosRelacionados.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Artículos</p>
              <div className="flex flex-wrap gap-1">
                {estrategia.articulosRelacionados.map((art) => (
                  <span
                    key={art}
                    className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded"
                  >
                    {art}
                  </span>
                ))}
              </div>
            </div>
          )}

          {estrategia.documentosSoporte.length > 0 && (
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Documentos soporte</p>
              <div className="flex flex-wrap gap-1">
                {estrategia.documentosSoporte.map((doc) => (
                  <span
                    key={doc}
                    className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {estrategia.riesgos && (
            <div>
              <p className="text-xs text-red-500 uppercase font-bold mb-1">Riesgos</p>
              <p className="text-slate-400 text-sm">{estrategia.riesgos}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function WarRoomPage() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProc, setFilterProc] = useState<Procedimiento | 'todos'>('todos');
  const [filterTipo, setFilterTipo] = useState<TipoEstrategia | 'todos'>('todos');
  const [showOnlyCriticas, setShowOnlyCriticas] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'estrategia' | 'custom'>('estrategia');

  useEffect(() => {
    strategiesRepo.getAll().then((data) => {
      setStrategies(data);
      setLoading(false);
    });
  }, []);

  // Filtrar estrategias
  const estrategiasFiltradas = getAllEstrategias().filter((e) => {
    if (filterProc !== 'todos' && e.procedimiento !== filterProc) return false;
    if (filterTipo !== 'todos' && e.tipo !== filterTipo) return false;
    if (showOnlyCriticas && e.prioridad !== 'critica') return false;
    return true;
  });

  // Estadísticas
  const stats = {
    total: getAllEstrategias().length,
    picassent: getEstrategiaPorProcedimiento('picassent').length,
    mislata: getEstrategiaPorProcedimiento('mislata').length,
    criticas: getAllEstrategias().filter((e) => e.prioridad === 'critica').length,
  };

  const getRiskColor = (riskText: string) => {
    const text = (riskText || '').toLowerCase();
    if (text.includes('alto')) return 'border-l-rose-500 bg-rose-500/5';
    if (text.includes('medio')) return 'border-l-amber-500 bg-amber-500/5';
    return 'border-l-emerald-500 bg-emerald-500/5';
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast de copiado */}
      {copiedText && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Copiado al portapapeles
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col gap-4">
        <div>
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 lg:hidden"
          >
            ← Volver al Panel
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
            Estrategia
          </p>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">War Room</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-3 text-center">
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-slate-500">Total</p>
          </div>
          <div className="bg-orange-500/10 rounded-lg border border-orange-500/30 p-3 text-center">
            <p className="text-2xl font-bold text-orange-300">{stats.picassent}</p>
            <p className="text-xs text-orange-400">Picassent</p>
          </div>
          <div className="bg-emerald-500/10 rounded-lg border border-emerald-500/30 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-300">{stats.mislata}</p>
            <p className="text-xs text-emerald-400">Mislata</p>
          </div>
          <div className="bg-red-500/10 rounded-lg border border-red-500/30 p-3 text-center">
            <p className="text-2xl font-bold text-red-300">{stats.criticas}</p>
            <p className="text-xs text-red-400">Críticas</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('estrategia')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'estrategia'
              ? 'bg-slate-800 text-white'
              : 'text-slate-500 hover:text-white'
          }`}
        >
          Estrategia Predefinida
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-4 py-2 rounded-t-lg transition-colors ${
            activeTab === 'custom' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-white'
          }`}
        >
          Personalizada ({strategies.length})
        </button>
      </div>

      {/* Tab: Estrategia Predefinida */}
      {activeTab === 'estrategia' && (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterProc}
              onChange={(e) => setFilterProc(e.target.value as Procedimiento | 'todos')}
              className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700"
            >
              <option value="todos">Todos los procedimientos</option>
              <option value="mislata">Mislata (demandante)</option>
              <option value="picassent">Picassent (demandado)</option>
            </select>

            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value as TipoEstrategia | 'todos')}
              className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700"
            >
              <option value="todos">Todos los tipos</option>
              <option value="defensa">🛡️ Defensas</option>
              <option value="ataque">⚔️ Ataques</option>
              <option value="replica">💬 Réplicas</option>
              <option value="pregunta">❓ Preguntas</option>
            </select>

            <button
              onClick={() => setShowOnlyCriticas(!showOnlyCriticas)}
              className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
                showOnlyCriticas
                  ? 'bg-red-500/20 border-red-500/50 text-red-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Solo críticas
            </button>

            <span className="text-slate-500 text-sm flex items-center ml-auto">
              {estrategiasFiltradas.length} líneas
            </span>
          </div>

          {/* Lista de estrategias */}
          <div className="grid gap-4 md:grid-cols-2">
            {estrategiasFiltradas.map((e) => (
              <EstrategiaCard key={e.id} estrategia={e} onCopy={handleCopy} />
            ))}
          </div>

          {estrategiasFiltradas.length === 0 && (
            <Card className="p-8 text-center border-dashed border-slate-800 bg-slate-900/30">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-slate-500">No hay estrategias con esos filtros</p>
            </Card>
          )}
        </>
      )}

      {/* Tab: Personalizada */}
      {activeTab === 'custom' && (
        <>
          <Link
            to="/warroom/new"
            className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-rose-900/20"
          >
            + Nueva Estrategia
          </Link>

          {loading ? (
            <div className="p-8 text-center text-slate-500">Cargando...</div>
          ) : strategies.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-slate-800 bg-slate-900/30">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-semibold text-slate-200">Sin estrategias personalizadas</h3>
              <p className="text-slate-500 mb-6">Define tu primera línea de defensa.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {strategies.map((strategy) => (
                <Link
                  key={strategy.id}
                  to={`/warroom/${strategy.id}/edit`}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 transition active:scale-95 border-l-4 ${getRiskColor(strategy.risk)}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-mono text-slate-500">
                        #{strategy.id.slice(0, 4)}
                      </span>
                      <div className="rounded bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {strategy.caseId ? 'Vinculada' : 'General'}
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-100 leading-snug">{strategy.attack}</h3>

                    <div className="rounded-lg bg-black/40 p-3 border border-white/5">
                      <p className="text-[10px] uppercase text-emerald-500 font-bold tracking-wider mb-1">
                        Respuesta
                      </p>
                      <p className="text-sm text-slate-300 line-clamp-3">{strategy.rebuttal}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
