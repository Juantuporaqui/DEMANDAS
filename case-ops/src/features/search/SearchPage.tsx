// ============================================
// CASE OPS - Global Search Page
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar, EmptyState, ListItem } from '../../components';
import { globalSearch } from '../../db/repositories';
import type { Case, Document, Span, Fact, Partida, Event, Strategy, Task } from '../../types';
import { formatDate } from '../../utils/dates';
import { formatCurrency } from '../../utils/validators';

type ResultType = 'all' | 'facts' | 'partidas' | 'documents' | 'spans' | 'events';

interface SearchResults {
  cases: Case[];
  documents: Document[];
  spans: Span[];
  facts: Fact[];
  partidas: Partida[];
  events: Event[];
  strategies: Strategy[];
  tasks: Task[];
}

const emptyResults: SearchResults = {
  cases: [],
  documents: [],
  spans: [],
  facts: [],
  partidas: [],
  events: [],
  strategies: [],
  tasks: [],
};

// --- COMPONENTE AUXILIAR PARA RESALTAR TEXTO ---
const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  
  // Escapar caracteres especiales de regex
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
  
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-amber-500/30 text-amber-200 font-semibold px-0.5 rounded border border-amber-500/20">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>(emptyResults);
  const [filter, setFilter] = useState<ResultType>('all');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.trim().length < 2) {
      setResults(emptyResults);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const searchResults = await globalSearch(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults(emptyResults);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalResults = useMemo(() => {
    return (
      results.cases.length +
      results.documents.length +
      results.spans.length +
      results.facts.length +
      results.partidas.length +
      results.events.length +
      results.strategies.length +
      results.tasks.length
    );
  }, [results]);

  const filteredResults = useMemo(() => {
    switch (filter) {
      case 'facts': return { ...emptyResults, facts: results.facts };
      case 'partidas': return { ...emptyResults, partidas: results.partidas };
      case 'documents': return { ...emptyResults, documents: results.documents };
      case 'spans': return { ...emptyResults, spans: results.spans };
      case 'events': return { ...emptyResults, events: results.events };
      default: return results;
    }
  }, [filter, results]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Buscar</h1>
      </div>

      <SearchBar
        onSearch={handleSearch}
        placeholder="Buscar en hechos, documentos, partidas..."
        autoFocus
      />

      {/* Filters */}
      {hasSearched && totalResults > 0 && (
        <div className="tabs mt-md overflow-x-auto">
          <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Todo ({totalResults})
          </button>
          <button className={`tab ${filter === 'facts' ? 'active' : ''}`} onClick={() => setFilter('facts')}>
            Hechos ({results.facts.length})
          </button>
          <button className={`tab ${filter === 'partidas' ? 'active' : ''}`} onClick={() => setFilter('partidas')}>
            Partidas ({results.partidas.length})
          </button>
          <button className={`tab ${filter === 'documents' ? 'active' : ''}`} onClick={() => setFilter('documents')}>
            Docs ({results.documents.length})
          </button>
          <button className={`tab ${filter === 'spans' ? 'active' : ''}`} onClick={() => setFilter('spans')}>
            Spans ({results.spans.length})
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center p-md mt-lg">
          <div className="spinner" />
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <div className="mt-md space-y-8 pb-20">
          {totalResults === 0 ? (
            <EmptyState
              icon="🔍"
              title="Sin resultados"
              description={`No se encontraron coincidencias para "${query}"`}
            />
          ) : (
            <>
              {/* Cases */}
              {filteredResults.cases.length > 0 && (
                <section className="section">
                  <h2 className="section-title text-slate-400 text-sm uppercase font-bold tracking-wider mb-3">Expedientes</h2>
                  <div className="card">
                    {filteredResults.cases.map((item) => (
                      <Link key={item.id} to={`/cases/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem
                          icon="⚖️"
                          title={<HighlightText text={item.title} highlight={query} />}
                          subtitle={`${item.id} · ${item.court}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Facts */}
              {filteredResults.facts.length > 0 && (
                <section className="section">
                  <h2 className="section-title text-slate-400 text-sm uppercase font-bold tracking-wider mb-3">Hechos</h2>
                  <div className="card">
                    {filteredResults.facts.map((item) => (
                      <Link key={item.id} to={`/facts/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem
                          icon="📋"
                          title={<HighlightText text={item.title} highlight={query} />}
                          subtitle={`${item.id} · ${item.status}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Documents */}
              {filteredResults.documents.length > 0 && (
                <section className="section">
                  <h2 className="section-title text-slate-400 text-sm uppercase font-bold tracking-wider mb-3">Documentos</h2>
                  <div className="card">
                    {filteredResults.documents.map((item) => (
                      <Link key={item.id} to={`/documents/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem
                          icon="📄"
                          title={<HighlightText text={item.title} highlight={query} />}
                          subtitle={`${item.docType}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Spans */}
              {filteredResults.spans.length > 0 && (
                <section className="section">
                  <h2 className="section-title text-slate-400 text-sm uppercase font-bold tracking-wider mb-3">Extractos (Spans)</h2>
                  <div className="card">
                    {filteredResults.spans.map((item) => (
                      <Link key={item.id} to={`/documents/${item.documentId}/view?page=${item.pageStart}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem
                          icon="📑"
                          title={<HighlightText text={item.label} highlight={query} />}
                          subtitle={`Págs. ${item.pageStart}-${item.pageEnd}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}

      {/* Initial state */}
      {!hasSearched && !loading && (
        <div className="mt-lg">
          <EmptyState
            icon="🔍"
            title="Búsqueda Global"
            description="Encuentra hechos, documentos y partidas económicas al instante."
          />
          <div className="mt-lg text-center">
             <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">Tip: Usa #tags para filtrar</span>
          </div>
        </div>
      )}
    </div>
  );
}
