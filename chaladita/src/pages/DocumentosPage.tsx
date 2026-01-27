import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  FileText,
  Search,
  Filter,
  Trash2,
  Eye,
  Link2,
  Tag,
  Calendar,
  FolderOpen,
  X,
  Plus,
  Download,
} from 'lucide-react';
import { useLitigationStore } from '../store/litigationStore';
import type { Documento, TipoDocumento } from '../types';

const tiposDocumento: { value: TipoDocumento; label: string }[] = [
  { value: 'demanda', label: 'Demanda' },
  { value: 'contestacion', label: 'Contestacion' },
  { value: 'extracto', label: 'Extracto bancario' },
  { value: 'nomina', label: 'Nomina' },
  { value: 'factura', label: 'Factura' },
  { value: 'recurso', label: 'Recurso' },
  { value: 'sentencia', label: 'Sentencia' },
  { value: 'auto', label: 'Auto' },
  { value: 'providencia', label: 'Providencia' },
  { value: 'certificado', label: 'Certificado' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'email', label: 'Email' },
  { value: 'mensaje', label: 'Mensaje' },
  { value: 'foto', label: 'Foto' },
  { value: 'otro', label: 'Otro' },
];

export default function DocumentosPage() {
  const {
    documentos,
    procedimientos,
    hechos,
    reclamaciones,
    estrategias,
    addDocumento,
    deleteDocumento,
  } = useLitigationStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterProceso, setFilterProceso] = useState<string>('');
  const [filterTipo, setFilterTipo] = useState<TipoDocumento | ''>('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);

  // Formulario de subida
  const [newDoc, setNewDoc] = useState({
    nombre: '',
    tipo: 'otro' as TipoDocumento,
    descripcion: '',
    referencia: '',
    tags: '',
    procesoId: '',
    hechoId: '',
    reclamacionId: '',
    estrategiaId: '',
    fechaDocumento: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Filtrar documentos
  const filteredDocs = documentos.filter((doc) => {
    const matchesSearch =
      doc.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProceso = !filterProceso || doc.linkedTo.procesoId === filterProceso;
    const matchesTipo = !filterTipo || doc.tipo === filterTipo;
    return matchesSearch && matchesProceso && matchesTipo;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewDoc((prev) => ({
        ...prev,
        nombre: file.name,
      }));
    }
  };

  const handleUpload = async () => {
    if (!newDoc.nombre || !newDoc.procesoId) {
      alert('Nombre y procedimiento son obligatorios');
      return;
    }

    let contenidoBase64: string | undefined;
    if (selectedFile && selectedFile.size < 5 * 1024 * 1024) {
      // Max 5MB para base64
      contenidoBase64 = await fileToBase64(selectedFile);
    }

    addDocumento({
      nombre: newDoc.nombre,
      tipo: newDoc.tipo,
      tamaño: selectedFile?.size,
      fechaDocumento: newDoc.fechaDocumento || undefined,
      tags: newDoc.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      descripcion: newDoc.descripcion || undefined,
      referencia: newDoc.referencia || undefined,
      linkedTo: {
        procesoId: newDoc.procesoId,
        hechoId: newDoc.hechoId || undefined,
        reclamacionId: newDoc.reclamacionId || undefined,
        estrategiaId: newDoc.estrategiaId || undefined,
      },
      contenidoBase64,
      mimeType: selectedFile?.type,
    });

    // Reset form
    setNewDoc({
      nombre: '',
      tipo: 'otro',
      descripcion: '',
      referencia: '',
      tags: '',
      procesoId: '',
      hechoId: '',
      reclamacionId: '',
      estrategiaId: '',
      fechaDocumento: '',
    });
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este documento?')) {
      deleteDocumento(id);
    }
  };

  const getProcesoName = (id: string) => {
    const proc = procedimientos.find((p) => p.id === id);
    return proc?.titulo || id;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
                  <FolderOpen className="w-6 h-6 text-blue-400" />
                  Evidence Locker
                </h1>
                <p className="text-sm text-slate-400">
                  {documentos.length} documentos
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Upload className="w-5 h-5" />
              Subir documento
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filtros */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-slate-700">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filterProceso}
                onChange={(e) => setFilterProceso(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los procedimientos</option>
                {procedimientos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titulo}
                  </option>
                ))}
              </select>
              <select
                value={filterTipo}
                onChange={(e) => setFilterTipo(e.target.value as TipoDocumento | '')}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los tipos</option>
                {tiposDocumento.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de documentos */}
        {filteredDocs.length === 0 ? (
          <div className="bg-slate-800 rounded-xl p-12 text-center border border-slate-700">
            <FileText className="w-16 h-16 mx-auto text-slate-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay documentos
            </h3>
            <p className="text-slate-400 mb-4">
              {documentos.length === 0
                ? 'Sube tu primer documento para empezar'
                : 'No hay documentos que coincidan con los filtros'}
            </p>
            {documentos.length === 0 && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                Subir documento
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 bg-slate-700 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">
                        {doc.nombre}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">
                        {getProcesoName(doc.linkedTo.procesoId)}
                      </p>
                      {doc.descripcion && (
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                          {doc.descripcion}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                          <Tag className="w-3 h-3" />
                          {doc.tipo}
                        </span>
                        {doc.referencia && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-900/50 rounded text-xs text-blue-300">
                            {doc.referencia}
                          </span>
                        )}
                        {doc.fechaDocumento && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700 rounded text-xs text-slate-400">
                            <Calendar className="w-3 h-3" />
                            {new Date(doc.fechaDocumento).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          {formatFileSize(doc.tamaño)}
                        </span>
                        {doc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-slate-600 rounded text-xs text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                      title="Ver detalles"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {doc.contenidoBase64 && (
                      <a
                        href={doc.contenidoBase64}
                        download={doc.nombre}
                        className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                        title="Descargar"
                      >
                        <Download className="w-5 h-5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 hover:bg-red-900/50 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de subida */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Subir documento</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Archivo */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Archivo
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
                >
                  {selectedFile ? (
                    <span className="flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5" />
                      {selectedFile.name}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" />
                      Seleccionar archivo
                    </span>
                  )}
                </button>
              </div>

              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={newDoc.nombre}
                  onChange={(e) => setNewDoc({ ...newDoc, nombre: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del documento"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo
                </label>
                <select
                  value={newDoc.tipo}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, tipo: e.target.value as TipoDocumento })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {tiposDocumento.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Procedimiento */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Procedimiento *
                </label>
                <select
                  value={newDoc.procesoId}
                  onChange={(e) => setNewDoc({ ...newDoc, procesoId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {procedimientos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Vincular a hecho */}
              {newDoc.procesoId && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Link2 className="w-4 h-4 inline mr-1" />
                    Vincular a hecho (opcional)
                  </label>
                  <select
                    value={newDoc.hechoId}
                    onChange={(e) => setNewDoc({ ...newDoc, hechoId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ninguno</option>
                    {hechos
                      .filter((h) => h.procesoId === newDoc.procesoId)
                      .map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.titulo}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Vincular a reclamación */}
              {newDoc.procesoId && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Link2 className="w-4 h-4 inline mr-1" />
                    Vincular a reclamacion (opcional)
                  </label>
                  <select
                    value={newDoc.reclamacionId}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, reclamacionId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ninguna</option>
                    {reclamaciones
                      .filter((r) => r.procesoId === newDoc.procesoId)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.titulo} ({r.importe.toLocaleString('es-ES')}€)
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Vincular a estrategia */}
              {newDoc.procesoId && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    <Link2 className="w-4 h-4 inline mr-1" />
                    Vincular a estrategia (opcional)
                  </label>
                  <select
                    value={newDoc.estrategiaId}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, estrategiaId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Ninguna</option>
                    {estrategias
                      .filter((e) => e.procesoId === newDoc.procesoId)
                      .map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.titulo}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Referencia */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Referencia (ej: Doc. 25)
                </label>
                <input
                  type="text"
                  value={newDoc.referencia}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, referencia: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doc. 25"
                />
              </div>

              {/* Fecha del documento */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Fecha del documento
                </label>
                <input
                  type="date"
                  value={newDoc.fechaDocumento}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, fechaDocumento: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Etiquetas (separadas por coma)
                </label>
                <input
                  type="text"
                  value={newDoc.tags}
                  onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="nomina, ingresos, 2024"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripcion
                </label>
                <textarea
                  value={newDoc.descripcion}
                  onChange={(e) =>
                    setNewDoc({ ...newDoc, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descripcion del documento..."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-lg w-full">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white truncate pr-4">
                {selectedDoc.nombre}
              </h2>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Tipo:</span>
                  <span className="text-white ml-2">{selectedDoc.tipo}</span>
                </div>
                <div>
                  <span className="text-slate-400">Tamaño:</span>
                  <span className="text-white ml-2">
                    {formatFileSize(selectedDoc.tamaño)}
                  </span>
                </div>
                {selectedDoc.referencia && (
                  <div>
                    <span className="text-slate-400">Referencia:</span>
                    <span className="text-white ml-2">{selectedDoc.referencia}</span>
                  </div>
                )}
                {selectedDoc.fechaDocumento && (
                  <div>
                    <span className="text-slate-400">Fecha:</span>
                    <span className="text-white ml-2">
                      {new Date(selectedDoc.fechaDocumento).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <span className="text-slate-400 text-sm">Procedimiento:</span>
                <p className="text-white">
                  {getProcesoName(selectedDoc.linkedTo.procesoId)}
                </p>
              </div>
              {selectedDoc.descripcion && (
                <div>
                  <span className="text-slate-400 text-sm">Descripcion:</span>
                  <p className="text-white">{selectedDoc.descripcion}</p>
                </div>
              )}
              {selectedDoc.tags.length > 0 && (
                <div>
                  <span className="text-slate-400 text-sm">Etiquetas:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedDoc.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-slate-600 rounded text-xs text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="text-xs text-slate-500">
                Subido: {new Date(selectedDoc.fechaSubida).toLocaleString('es-ES')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
