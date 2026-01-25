// ============================================
// CASE OPS - Global Search Page
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar, EmptyState, ListItem, Chips } from '../../components';
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
      case 'facts':
        return { ...emptyResults, facts: results.facts };
      case 'partidas':
        return { ...emptyResults, partidas: results.partidas };
      case 'documents':
        return { ...emptyResults, documents: results.documents };
      case 'spans':
        return { ...emptyResults, spans: results.spans };
      case 'events':
        return { ...emptyResults, events: results.events };
      default:
        return results;
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
        <div className="tabs mt-md">
          <button
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todo ({totalResults})
          </button>
          <button
            className={`tab ${filter === 'facts' ? 'active' : ''}`}
            onClick={() => setFilter('facts')}
          >
            Hechos ({results.facts.length})
          </button>
          <button
            className={`tab ${filter === 'partidas' ? 'active' : ''}`}
            onClick={() => setFilter('partidas')}
          >
            Partidas ({results.partidas.length})
          </button>
          <button
            className={`tab ${filter === 'documents' ? 'active' : ''}`}
            onClick={() => setFilter('documents')}
          >
            Docs ({results.documents.length})
          </button>
          <button
            className={`tab ${filter === 'spans' ? 'active' : ''}`}
            onClick={() => setFilter('spans')}
          >
            Spans ({results.spans.length})
          </button>
          <button
            className={`tab ${filter === 'events' ? 'active' : ''}`}
            onClick={() => setFilter('events')}
          >
            Eventos ({results.events.length})
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
        <div className="mt-md">
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
                  <h2 className="section-title">Casos</h2>
                  <div className="card">
                    {filteredResults.cases.map((item) => (
                      <Link
                        key={item.id}
                        to={`/cases/${item.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="⚖️"
                          title={item.title}
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
                  <h2 className="section-title">Hechos</h2>
                  <div className="card">
                    {filteredResults.facts.map((item) => (
                      <Link
                        key={item.id}
                        to={`/facts/${item.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="📋"
                          title={item.title}
                          subtitle={`${item.id} · ${item.status} · ${item.burden}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Partidas */}
              {filteredResults.partidas.length > 0 && (
                <section className="section">
                  <h2 className="section-title">Partidas</h2>
                  <div className="card">
                    {filteredResults.partidas.map((item) => (
                      <Link
                        key={item.id}
                        to={`/partidas/${item.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="💰"
                          title={item.concept}
                          subtitle={`${item.id} · ${formatDate(item.date)} · ${formatCurrency(item.amountCents)}`}
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
                  <h2 className="section-title">Documentos</h2>
                  <div className="card">
                    {filteredResults.documents.map((item) => (
                      <Link
                        key={item.id}
                        to={`/documents/${item.id}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="📄"
                          title={item.title}
                          subtitle={`${item.id} · ${item.docType} · ${item.pagesCount} págs.`}
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
                  <h2 className="section-title">Spans</h2>
                  <div className="card">
                    {filteredResults.spans.map((item) => (
                      <Link
                        key={item.id}
                        to={`/documents/${item.documentId}/view?page=${item.pageStart}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="📑"
                          title={item.label}
                          subtitle={`${item.id} · Págs. ${item.pageStart}-${item.pageEnd}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Events */}
              {filteredResults.events.length > 0 && (
                <section className="section">
                  <h2 className="section-title">Eventos</h2>
                  <div className="card">
                    {filteredResults.events.map((item) => (
                      <Link
                        key={item.id}
                        to={`/events/${item.id}/edit`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon={item.type === 'procesal' ? '⚖️' : '📅'}
                          title={item.title}
                          subtitle={`${formatDate(item.date)} · ${item.type}`}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Strategies */}
              {filteredResults.strategies.length > 0 && (
                <section className="section">
                  <h2 className="section-title">Estrategias</h2>
                  <div className="card">
                    {filteredResults.strategies.map((item) => (
                      <Link
                        key={item.id}
                        to={`/warroom/${item.id}/edit`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="🎯"
                          title={item.attack.substring(0, 50) + '...'}
                          subtitle={item.id}
                          action="›"
                        />
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Tasks */}
              {filteredResults.tasks.length > 0 && (
                <section className="section">
                  <h2 className="section-title">Tareas</h2>
                  <div className="card">
                    {filteredResults.tasks.map((item) => (
                      <Link
                        key={item.id}
                        to="/tasks"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <ListItem
                          icon="✅"
                          title={item.title}
                          subtitle={`${item.id} · ${item.status} · ${item.priority}`}
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
            title="Busca en todo el caso"
            description="Escribe al menos 2 caracteres para buscar en hechos, documentos, partidas, spans y más"
          />

          <div className="mt-lg">
            <h3 className="section-title">Atajos de búsqueda</h3>
            <div className="card mt-md">
              <div className="card-body">
                <p className="mb-sm">
                  <span className="chip">Ctrl + K</span> Abrir búsqueda rápida
                </p>
                <p className="mb-sm">
                  <span className="chip">H001</span> Buscar por ID
                </p>
                <p>
                  <span className="chip">#tag</span> Buscar por etiqueta
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
