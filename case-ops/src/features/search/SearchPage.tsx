// ============================================
// CASE OPS - Global Search Page (Mejorado)
// Búsqueda unificada en todos los datos
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../../components/SearchBar';
import { EmptyState } from '../../components/EmptyState';
import {
  globalSearchUnified,
  groupResultsByType,
  getSearchStats,
  type SearchResult,
  type ResultType,
} from './SearchEngine';

// Componente para resaltar texto
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight || !highlight.trim()) return <>{text}</>;
  try {
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
  } catch {
    return <>{text}</>;
  }
};

// Iconos por tipo de resultado
const typeIcons: Record<ResultType, string> = {
  hecho: '📋',
  jurisprudencia: '⚖️',
  documento: '📄',
  argumento: '💬',
  frase: '🎯',
  procedimiento: '📁',
};

// Colores por tipo de resultado
const typeColors: Record<ResultType, string> = {
  hecho: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  jurisprudencia: 'bg-red-500/20 text-red-300 border-red-500/30',
  documento: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  argumento: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  frase: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  procedimiento: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

// Labels por tipo
const typeLabels: Record<ResultType, string> = {
  hecho: 'Hechos',
  jurisprudencia: 'Jurisprudencia',
  documento: 'Documentos',
  argumento: 'Argumentos',
  frase: 'Frases clave',
  procedimiento: 'Procedimientos',
};

// Componente de tarjeta de resultado
function ResultCard({
  result,
  query,
  onCopy,
}: {
  result: SearchResult;
  query: string;
  onCopy: (text: string) => void;
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 hover:border-slate-700 transition-colors">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{typeIcons[result.type]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded border ${typeColors[result.type]}`}>
              {typeLabels[result.type]}
            </span>
            {result.link && (
              <Link
                to={result.link}
                className="text-xs text-slate-500 hover:text-amber-400 transition-colors"
              >
                Ver más →
              </Link>
            )}
          </div>
          <h3 className="text-white font-medium mb-1">
            <HighlightText text={result.title} highlight={query} />
          </h3>
          <p className="text-slate-400 text-sm mb-2">{result.subtitle}</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            <HighlightText text={result.snippet} highlight={query} />
          </p>
          <button
            onClick={() => onCopy(result.snippet)}
            className="mt-2 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded transition-colors"
          >
            Copiar snippet
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterType, setFilterType] = useState<ResultType | 'todos'>('todos');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length < 2) {
      setHasSearched(false);
      setResults([]);
      return;
    }
    setHasSearched(true);
    const searchResults = globalSearchUnified(searchQuery);
    setResults(searchResults);
  }, []);

  // Filtrar resultados
  const filteredResults = useMemo(() => {
    if (filterType === 'todos') return results;
    return results.filter((r) => r.type === filterType);
  }, [results, filterType]);

  // Estadísticas
  const stats = useMemo(() => getSearchStats(results), [results]);

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
      {/* Toast de copiado */}
      {copiedText && (
        <div className="fixed top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          Copiado al portapapeles
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Búsqueda Global</h1>
        <p className="text-slate-400 text-sm">
          Busca en hechos, jurisprudencia, documentos, argumentos y frases clave
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} placeholder="Buscar en todo..." autoFocus />
      </div>

      {/* Filtros por tipo (solo si hay resultados) */}
      {hasSearched && results.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterType('todos')}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filterType === 'todos'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
            }`}
          >
            Todos ({stats.total})
          </button>
          {(Object.keys(stats.byType) as ResultType[]).map((type) =>
            stats.byType[type] > 0 ? (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  filterType === type
                    ? typeColors[type]
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {typeIcons[type]} {typeLabels[type]} ({stats.byType[type]})
              </button>
            ) : null
          )}
        </div>
      )}

      {/* Estado vacío inicial */}
      {!hasSearched && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-400">Escribe al menos 2 caracteres para buscar</p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
            {['prescripción', 'litispendencia', 'art. 1145', 'hipoteca', 'solidaridad', 'Vicenta'].map(
              (term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* Sin resultados */}
      {hasSearched && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="Sin resultados"
          description={`No se encontró nada para "${query}"`}
        />
      )}

      {/* Resultados */}
      {hasSearched && filteredResults.length > 0 && (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <ResultCard key={result.id} result={result} query={query} onCopy={handleCopy} />
          ))}
        </div>
      )}
    </div>
  );
}
