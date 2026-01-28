import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { documentsRepo } from '../../db/repositories';
import type { Document } from '../../types';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import { formatBytes } from '../../utils/validators';
import { formatDate } from '../../utils/dates';

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'recent'>('all');

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      const docs = await documentsRepo.getAll();
      // Ordenamos por fecha de creación (más reciente primero)
      setDocuments(docs.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  }

  // Filtrado simple
  const filteredDocs = filter === 'all' 
    ? documents 
    : documents.slice(0, 5); // Solo los 5 últimos

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando archivo...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* CABECERA (Con botón de volver para móvil) */}
      <header className="flex flex-col gap-4">
        <div>
          <Link 
            to="/dashboard" 
            className="mb-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 lg:hidden"
          >
            ← Volver al Panel
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            Evidencia Digital
          </p>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Documentos
          </h1>
          <p className="text-sm text-slate-400">
            {documents.length} archivos indexados en el sistema.
          </p>
        </div>

        <div className="flex gap-2">
            <Link
            to="/documents/new"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 active:translate-y-0.5"
            >
            + Subir Doc
            </Link>
        </div>
      </header>

      {/* FILTROS TIPO PESTAÑA */}
      <div className="flex gap-2 border-b border-slate-800 pb-1">
        <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'all' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
        >
            Todos
        </button>
        <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === 'recent' 
                ? 'text-blue-400 border-b-2 border-blue-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
        >
            Recientes
        </button>
      </div>

      {/* LISTA DE DOCUMENTOS */}
      {filteredDocs.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-lg font-semibold text-slate-200">Archivo vacío</h3>
          <p className="text-slate-500 mb-6">No hay documentación registrada.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocs.map((doc) => (
            <Link
              key={doc.id}
              to={`/documents/${doc.id}`}
              className="group relative flex items-center justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-blue-500/50 hover:bg-slate-900/80 active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xl group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                  {doc.mime?.includes('pdf') ? '📄' : '📁'}
                </div>
                
                <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-200 group-hover:text-blue-100">
                        {doc.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span>{formatDate(doc.createdAt)}</span>
                        <span>•</span>
                        <span className="uppercase">{doc.docType}</span>
                        {doc.size ? (
                            <>
                                <span>•</span>
                                <span>{formatBytes(doc.size)}</span>
                            </>
                        ) : null}
                    </div>
                </div>
              </div>

              <div className="text-slate-600 group-hover:text-blue-400">
                →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
