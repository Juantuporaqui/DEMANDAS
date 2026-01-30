// ============================================
// CASE OPS - Jurisprudencia Page
// Base de datos de citas jurídicas con búsqueda y copiar
// ============================================

import { useState, useMemo } from 'react';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import {
  todasLasCitas,
  buscarJurisprudencia,
  getJurisprudenciaPorProcedimiento,
  getJurisprudenciaPorTematica,
  type CitaJurisprudencia,
  type Procedimiento,
} from '../../data/jurisprudencia';

// Componente para resaltar texto
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-amber-500/30 text-amber-200 font-semibold px-0.5 rounded">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

// Componente de tarjeta de cita
function CitaCard({
  cita,
  query,
  onCopy,
}: {
  cita: CitaJurisprudencia;
  query: string;
  onCopy: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const tribunalColors: Record<string, string> = {
    TS: 'bg-red-500/20 text-red-300 border-red-500/30',
    AP: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    TC: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    CC: 'bg-green-500/20 text-green-300 border-green-500/30',
    TJUE: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };

  const importanciaStars = '★'.repeat(cita.importancia) + '☆'.repeat(5 - cita.importancia);

  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded border ${tribunalColors[cita.tribunal] || 'bg-slate-700 text-slate-300'}`}
            >
              {cita.tribunal}
              {cita.sala ? ` - ${cita.sala}` : ''}
            </span>
            <span className="text-slate-400 text-sm">{cita.numero}</span>
            <span className="text-slate-500 text-xs">{cita.fecha}</span>
          </div>
          <div className="text-amber-400 text-xs mt-1" title={`Importancia: ${cita.importancia}/5`}>
            {importanciaStars}
          </div>
        </div>
        <div className="flex gap-1">
          {cita.procedimientosAplicables.map((proc) => (
            <span
              key={proc}
              className={`text-xs px-2 py-0.5 rounded ${
                proc === 'mislata'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : proc === 'picassent'
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-slate-700 text-slate-300'
              }`}
            >
              {proc.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Fragmento clave - siempre visible */}
      <div className="bg-slate-800/50 rounded p-3 border-l-4 border-amber-500">
        <p className="text-white font-medium italic text-sm leading-relaxed">
          <HighlightText text={cita.fragmentoClave} highlight={query} />
        </p>
        <button
          onClick={() => onCopy(cita.fragmentoClave)}
          className="mt-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded transition-colors"
        >
          Copiar fragmento
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {cita.tematica.map((tema) => (
          <span key={tema} className="text-xs bg-slate-700/50 text-slate-400 px-2 py-0.5 rounded">
            {tema}
          </span>
        ))}
      </div>

      {/* Expandir/Colapsar */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm text-slate-400 hover:text-white transition-colors"
      >
        {expanded ? '▼ Ocultar detalles' : '▶ Ver más detalles'}
      </button>

      {/* Contenido expandido */}
      {expanded && (
        <div className="space-y-4 pt-2 border-t border-slate-700">
          {/* Texto completo */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Texto completo</h4>
            <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
              <HighlightText text={cita.textoCompleto} highlight={query} />
            </p>
            <button
              onClick={() => onCopy(cita.textoCompleto)}
              className="mt-2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition-colors"
            >
              Copiar texto completo
            </button>
          </div>

          {/* Cuándo aplica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold text-emerald-500 uppercase mb-1">Cuándo aplica</h4>
              <p className="text-slate-300 text-sm">{cita.cuandoAplica}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-red-500 uppercase mb-1">Cuándo NO aplica</h4>
              <p className="text-slate-300 text-sm">{cita.cuandoNOaplica}</p>
            </div>
          </div>

          {/* Frase para juez */}
          {cita.fraseParaJuez && (
            <div>
              <h4 className="text-xs font-bold text-amber-500 uppercase mb-1">Frase para el juez</h4>
              <div className="bg-amber-500/10 rounded p-3 border border-amber-500/30">
                <p className="text-amber-200 font-medium">{cita.fraseParaJuez}</p>
                <button
                  onClick={() => onCopy(cita.fraseParaJuez!)}
                  className="mt-2 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded transition-colors"
                >
                  Copiar frase
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function JurisprudenciaPage() {
  const [query, setQuery] = useState('');
  const [filterProc, setFilterProc] = useState<Procedimiento | 'todos'>('todos');
  const [filterTema, setFilterTema] = useState<string>('todos');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Obtener temas únicos
  const temasUnicos = useMemo(() => {
    const temas = new Set<string>();
    todasLasCitas.forEach((c) => c.tematica.forEach((t) => temas.add(t)));
    return Array.from(temas).sort();
  }, []);

  // Filtrar citas
  const citasFiltradas = useMemo(() => {
    let resultado = todasLasCitas;

    // Filtro por procedimiento
    if (filterProc !== 'todos') {
      resultado = getJurisprudenciaPorProcedimiento(filterProc);
    }

    // Filtro por temática
    if (filterTema !== 'todos') {
      resultado = resultado.filter((c) => c.tematica.includes(filterTema));
    }

    // Filtro por búsqueda
    if (query.trim().length >= 2) {
      const busqueda = buscarJurisprudencia(query);
      resultado = resultado.filter((c) => busqueda.some((b) => b.id === c.id));
    }

    // Ordenar por importancia
    return resultado.sort((a, b) => b.importancia - a.importancia);
  }, [query, filterProc, filterTema]);

  // Copiar al portapapeles
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
    <div className="pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Jurisprudencia</h1>
        <p className="text-slate-400 text-sm">
          {todasLasCitas.length} citas jurídicas para Picassent y Mislata
        </p>
      </div>

      {/* Toast de copiado */}
      {copiedText && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Copiado al portapapeles
        </div>
      )}

      {/* Búsqueda */}
      <div className="mb-4">
        <SearchBar
          onSearch={setQuery}
          placeholder="Buscar por tema, artículo, texto..."
          autoFocus={false}
        />
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Filtro procedimiento */}
        <select
          value={filterProc}
          onChange={(e) => setFilterProc(e.target.value as Procedimiento | 'todos')}
          className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-amber-500 focus:outline-none"
        >
          <option value="todos">Todos los procedimientos</option>
          <option value="mislata">Mislata (J.V. 1185/2025)</option>
          <option value="picassent">Picassent (P.O. 715/2024)</option>
        </select>

        {/* Filtro temática */}
        <select
          value={filterTema}
          onChange={(e) => setFilterTema(e.target.value)}
          className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:border-amber-500 focus:outline-none"
        >
          <option value="todos">Todas las temáticas</option>
          {temasUnicos.map((tema) => (
            <option key={tema} value={tema}>
              {tema.charAt(0).toUpperCase() + tema.slice(1)}
            </option>
          ))}
        </select>

        {/* Contador */}
        <div className="flex items-center text-slate-400 text-sm">
          {citasFiltradas.length} resultado{citasFiltradas.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Resultados */}
      {citasFiltradas.length === 0 ? (
        <EmptyState
          icon="⚖️"
          title="Sin resultados"
          description="No se encontró jurisprudencia con esos filtros"
        />
      ) : (
        <div className="space-y-4">
          {citasFiltradas.map((cita) => (
            <CitaCard key={cita.id} cita={cita} query={query} onCopy={handleCopy} />
          ))}
        </div>
      )}
    </div>
  );
}
