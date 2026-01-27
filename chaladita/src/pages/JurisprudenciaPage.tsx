import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit2,
  X,
  ExternalLink,
  Scale,
  Calendar,
  Link2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLitigationStore } from '../store/litigationStore';
import type { Jurisprudencia, TipoJurisprudencia } from '../types';

const tiposJurisprudencia: { value: TipoJurisprudencia; label: string }[] = [
  { value: 'STS', label: 'Sentencia TS' },
  { value: 'STC', label: 'Sentencia TC' },
  { value: 'SAP', label: 'Sentencia AP' },
  { value: 'STSJ', label: 'Sentencia TSJ' },
  { value: 'Auto', label: 'Auto' },
  { value: 'Circular', label: 'Circular' },
  { value: 'Otro', label: 'Otro' },
];

export default function JurisprudenciaPage() {
  const {
    jurisprudencia,
    procedimientos,
    reclamaciones,
    hechos,
    estrategias,
    addJurisprudencia,
    updateJurisprudencia,
    deleteJurisprudencia,
  } = useLitigationStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Formulario
  const emptyForm = {
    referencia: '',
    tipo: 'STS' as TipoJurisprudencia,
    tribunal: '',
    fecha: '',
    resumen: '',
    extractosRelevantes: '',
    notasDeUso: '',
    url: '',
    procesosIds: [] as string[],
    reclamacionesIds: [] as string[],
    hechosIds: [] as string[],
    estrategiasIds: [] as string[],
  };
  const [form, setForm] = useState(emptyForm);

  // Filtrar jurisprudencia
  const filteredJur = jurisprudencia.filter((j) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      j.referencia.toLowerCase().includes(searchLower) ||
      j.resumen.toLowerCase().includes(searchLower) ||
      j.tribunal.toLowerCase().includes(searchLower) ||
      j.notasDeUso.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = () => {
    if (!form.referencia || !form.resumen) {
      alert('Referencia y resumen son obligatorios');
      return;
    }

    const extractos = form.extractosRelevantes
      .split('\n\n')
      .filter((e) => e.trim());

    const data = {
      referencia: form.referencia,
      tipo: form.tipo,
      tribunal: form.tribunal,
      fecha: form.fecha,
      resumen: form.resumen,
      extractosRelevantes: extractos,
      notasDeUso: form.notasDeUso,
      linkedTo: {
        procesosIds: form.procesosIds,
        reclamacionesIds: form.reclamacionesIds,
        hechosIds: form.hechosIds,
        estrategiasIds: form.estrategiasIds,
      },
      url: form.url || undefined,
    };

    if (editingId) {
      updateJurisprudencia(editingId, data);
    } else {
      addJurisprudencia(data);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const handleEdit = (jur: Jurisprudencia) => {
    setForm({
      referencia: jur.referencia,
      tipo: jur.tipo,
      tribunal: jur.tribunal,
      fecha: jur.fecha,
      resumen: jur.resumen,
      extractosRelevantes: jur.extractosRelevantes.join('\n\n'),
      notasDeUso: jur.notasDeUso,
      url: jur.url || '',
      procesosIds: jur.linkedTo.procesosIds,
      reclamacionesIds: jur.linkedTo.reclamacionesIds,
      hechosIds: jur.linkedTo.hechosIds,
      estrategiasIds: jur.linkedTo.estrategiasIds,
    });
    setEditingId(jur.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta jurisprudencia?')) {
      deleteJurisprudencia(id);
    }
  };

  const toggleMultiSelect = (
    field: 'procesosIds' | 'reclamacionesIds' | 'hechosIds' | 'estrategiasIds',
    id: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter((i) => i !== id)
        : [...prev[field], id],
    }));
  };

  const getProcesoName = (id: string) =>
    procedimientos.find((p) => p.id === id)?.titulo || id;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Volver al inicio"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                  Jurisprudencia
                </h1>
                <p className="text-sm text-slate-400">
                  {jurisprudencia.length} referencias
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setForm(emptyForm);
                setEditingId(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Añadir
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar jurisprudencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Lista */}
        {filteredJur.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <Scale className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay jurisprudencia
            </h3>
            <p className="text-slate-400 mb-4">
              {jurisprudencia.length === 0
                ? 'Añade sentencias y resoluciones relevantes para tu caso'
                : 'No hay resultados que coincidan con tu busqueda'}
            </p>
            {jurisprudencia.length === 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Añadir jurisprudencia
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJur.map((jur) => (
              <div
                key={jur.id}
                className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden"
              >
                {/* Cabecera */}
                <div
                  className="p-4 cursor-pointer hover:bg-slate-750"
                  onClick={() =>
                    setExpandedId(expandedId === jur.id ? null : jur.id)
                  }
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 bg-amber-900/50 text-amber-300 rounded text-xs font-medium">
                          {jur.tipo}
                        </span>
                        <h3 className="font-bold text-white">{jur.referencia}</h3>
                        {jur.fecha && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(jur.fecha).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400">{jur.tribunal}</p>
                      <p className="text-slate-300 mt-2">{jur.resumen}</p>
                      {/* Vinculaciones */}
                      {jur.linkedTo.procesosIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {jur.linkedTo.procesosIds.map((id) => (
                            <span
                              key={id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs"
                            >
                              <Link2 className="w-3 h-3" />
                              {getProcesoName(id)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {jur.url && (
                        <a
                          href={jur.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                          title="Ver fuente"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(jur);
                        }}
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(jur.id);
                        }}
                        className="p-2 hover:bg-red-900/50 rounded-lg text-slate-400 hover:text-red-400"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {expandedId === jur.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contenido expandido */}
                {expandedId === jur.id && (
                  <div className="px-4 pb-4 border-t border-slate-700 pt-4">
                    {jur.extractosRelevantes.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-400 mb-2">
                          Extractos relevantes:
                        </h4>
                        <div className="space-y-2">
                          {jur.extractosRelevantes.map((ext, i) => (
                            <blockquote
                              key={i}
                              className="border-l-2 border-amber-500 pl-3 py-1 text-sm text-slate-300 italic"
                            >
                              "{ext}"
                            </blockquote>
                          ))}
                        </div>
                      </div>
                    )}
                    {jur.notasDeUso && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">
                          Notas de uso en tu caso:
                        </h4>
                        <p className="text-slate-300 text-sm bg-slate-700/50 p-3 rounded-lg">
                          {jur.notasDeUso}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar' : 'Añadir'} jurisprudencia
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Referencia y Tipo */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Referencia *
                  </label>
                  <input
                    type="text"
                    value={form.referencia}
                    onChange={(e) =>
                      setForm({ ...form, referencia: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="STS 458/2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm({ ...form, tipo: e.target.value as TipoJurisprudencia })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {tiposJurisprudencia.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tribunal y Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tribunal
                  </label>
                  <input
                    type="text"
                    value={form.tribunal}
                    onChange={(e) =>
                      setForm({ ...form, tribunal: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="Tribunal Supremo, Sala 1ª"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Resumen */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Resumen *
                </label>
                <textarea
                  value={form.resumen}
                  onChange={(e) => setForm({ ...form, resumen: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Resumen de la doctrina o ratio decidendi..."
                />
              </div>

              {/* Extractos */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Extractos relevantes (separados por linea en blanco)
                </label>
                <textarea
                  value={form.extractosRelevantes}
                  onChange={(e) =>
                    setForm({ ...form, extractosRelevantes: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none font-mono text-sm"
                  placeholder="Primer extracto relevante...&#10;&#10;Segundo extracto relevante..."
                />
              </div>

              {/* Notas de uso */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Notas de uso en tu caso
                </label>
                <textarea
                  value={form.notasDeUso}
                  onChange={(e) =>
                    setForm({ ...form, notasDeUso: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Como aplicar esta jurisprudencia a tu caso..."
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  URL (opcional)
                </label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="https://..."
                />
              </div>

              {/* Vinculaciones */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  <Link2 className="w-4 h-4 inline mr-1" />
                  Vincular a procedimientos
                </label>
                <div className="flex flex-wrap gap-2">
                  {procedimientos.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleMultiSelect('procesosIds', p.id)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        form.procesosIds.includes(p.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {p.titulo.split(' - ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                >
                  {editingId ? 'Guardar cambios' : 'Añadir'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
