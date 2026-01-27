import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header, ProcedureCard, TimelineChart } from '../components';
import { hitosLinea } from '../data/procedimientos';
import {
  AlertTriangle,
  TrendingUp,
  CheckSquare,
  Calendar,
  FileText,
  BookOpen,
  Plus,
  Check,
  Clock,
  ChevronDown,
  ChevronUp,
  Download,
  Upload,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';
import { useLitigationStore } from '../store/litigationStore';
import type { Tarea, EventoCronologia } from '../types';

export function HomePage() {
  const {
    procedimientos,
    cronologia,
    tareas,
    getEstadisticas,
    addTarea,
    updateTarea,
    completarTarea,
    deleteTarea,
    addEvento,
    updateEvento,
    deleteEvento,
    exportBackup,
    importBackup,
  } = useLitigationStore();

  const stats = getEstadisticas();

  const [showTareaModal, setShowTareaModal] = useState(false);
  const [showEventoModal, setShowEventoModal] = useState(false);
  const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
  const [editingEvento, setEditingEvento] = useState<EventoCronologia | null>(null);
  const [expandedTareas, setExpandedTareas] = useState(true);
  const [expandedCronologia, setExpandedCronologia] = useState(true);

  // Formulario de tarea
  const [tareaForm, setTareaForm] = useState({
    titulo: '',
    descripcion: '',
    procesoId: '',
    dueDate: '',
    prioridad: 'normal' as Tarea['prioridad'],
  });

  // Formulario de evento
  const [eventoForm, setEventoForm] = useState({
    titulo: '',
    descripcion: '',
    procesoId: '',
    fecha: '',
    tipo: 'hito' as EventoCronologia['tipo'],
    importancia: 'media' as EventoCronologia['importancia'],
    pasado: false,
  });

  // Próximos hitos
  const proximosHitos = cronologia
    .filter((e) => !e.pasado && !e.completado)
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const diasHastaProximo =
    proximosHitos.length > 0
      ? Math.ceil(
          (new Date(proximosHitos[0].fecha).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  // Tareas pendientes ordenadas por fecha
  const tareasPendientes = tareas
    .filter((t) => t.estado === 'pendiente' || t.estado === 'en_progreso')
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

  // Toda la cronología ordenada
  const cronologiaOrdenada = [...cronologia].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  const handleSaveTarea = () => {
    if (!tareaForm.titulo || !tareaForm.procesoId) {
      alert('Titulo y procedimiento son obligatorios');
      return;
    }

    if (editingTarea) {
      updateTarea(editingTarea.id, {
        titulo: tareaForm.titulo,
        descripcion: tareaForm.descripcion || undefined,
        procesoId: tareaForm.procesoId,
        dueDate: tareaForm.dueDate || undefined,
        prioridad: tareaForm.prioridad,
      });
    } else {
      addTarea({
        titulo: tareaForm.titulo,
        descripcion: tareaForm.descripcion || undefined,
        procesoId: tareaForm.procesoId,
        dueDate: tareaForm.dueDate || undefined,
        prioridad: tareaForm.prioridad,
        estado: 'pendiente',
        linkedIds: {},
      });
    }

    setTareaForm({
      titulo: '',
      descripcion: '',
      procesoId: '',
      dueDate: '',
      prioridad: 'normal',
    });
    setEditingTarea(null);
    setShowTareaModal(false);
  };

  const handleEditTarea = (tarea: Tarea) => {
    setTareaForm({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || '',
      procesoId: tarea.procesoId,
      dueDate: tarea.dueDate || '',
      prioridad: tarea.prioridad,
    });
    setEditingTarea(tarea);
    setShowTareaModal(true);
  };

  const handleSaveEvento = () => {
    if (!eventoForm.titulo || !eventoForm.procesoId || !eventoForm.fecha) {
      alert('Titulo, procedimiento y fecha son obligatorios');
      return;
    }

    if (editingEvento) {
      updateEvento(editingEvento.id, {
        titulo: eventoForm.titulo,
        descripcion: eventoForm.descripcion || undefined,
        procesoId: eventoForm.procesoId,
        fecha: eventoForm.fecha,
        tipo: eventoForm.tipo,
        importancia: eventoForm.importancia,
        pasado: eventoForm.pasado,
      });
    } else {
      addEvento({
        titulo: eventoForm.titulo,
        descripcion: eventoForm.descripcion || undefined,
        procesoId: eventoForm.procesoId,
        fecha: eventoForm.fecha,
        tipo: eventoForm.tipo,
        importancia: eventoForm.importancia,
        pasado: eventoForm.pasado,
      });
    }

    setEventoForm({
      titulo: '',
      descripcion: '',
      procesoId: '',
      fecha: '',
      tipo: 'hito',
      importancia: 'media',
      pasado: false,
    });
    setEditingEvento(null);
    setShowEventoModal(false);
  };

  const handleEditEvento = (evento: EventoCronologia) => {
    setEventoForm({
      titulo: evento.titulo,
      descripcion: evento.descripcion || '',
      procesoId: evento.procesoId,
      fecha: evento.fecha,
      tipo: evento.tipo,
      importancia: evento.importancia,
      pasado: evento.pasado,
    });
    setEditingEvento(evento);
    setShowEventoModal(true);
  };

  const handleExportBackup = () => {
    const backup = exportBackup();
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chaladita-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const backup = JSON.parse(text);
        const result = importBackup(backup);
        if (result.success) {
          alert('Backup importado correctamente');
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch {
        alert('Error al leer el archivo');
      }
    };
    input.click();
  };

  const getProcesoNombre = (id: string) => {
    const proc = procedimientos.find((p) => p.id === id);
    return proc?.titulo.split(' - ')[0] || id;
  };

  const getPrioridadColor = (prioridad: Tarea['prioridad']) => {
    switch (prioridad) {
      case 'urgente':
        return 'text-red-400 bg-red-900/30';
      case 'alta':
        return 'text-amber-400 bg-amber-900/30';
      case 'normal':
        return 'text-blue-400 bg-blue-900/30';
      case 'baja':
        return 'text-slate-400 bg-slate-700';
    }
  };

  const getImportanciaColor = (importancia: EventoCronologia['importancia']) => {
    switch (importancia) {
      case 'alta':
        return 'border-red-500';
      case 'media':
        return 'border-amber-500';
      case 'baja':
        return 'border-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Alert banner if upcoming deadline */}
        {diasHastaProximo !== null && diasHastaProximo <= 14 && proximosHitos[0] && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-4 animate-fadeIn">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-semibold text-amber-400">
                {proximosHitos[0].titulo} - {getProcesoNombre(proximosHitos[0].procesoId)}
              </p>
              <p className="text-sm text-slate-300 mt-1">
                {new Date(proximosHitos[0].fecha).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                ({diasHastaProximo === 0 ? 'HOY' : `en ${diasHastaProximo} dias`})
              </p>
            </div>
          </div>
        )}

        {/* Summary stats - DERIVADOS DEL STORE */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">
              {stats.procedimientosActivos}
            </p>
            <p className="text-sm text-slate-400">Procedimientos Activos</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">
              {stats.totalReclamado.toLocaleString('es-ES')}€
            </p>
            <p className="text-sm text-slate-400">Total Reclamado</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {stats.estrategiasActivas}
            </p>
            <p className="text-sm text-slate-400">Estrategias Activas</p>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">
              {stats.tareasPendientes}
            </p>
            <p className="text-sm text-slate-400">Tareas Pendientes</p>
          </div>
        </div>

        {/* Stats secundarias */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <div className="bg-slate-800/30 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-gray-400">
              {stats.totalPrescrito.toLocaleString('es-ES')}€
            </p>
            <p className="text-xs text-slate-500">Prescrito</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-yellow-400">
              {stats.totalDiscutido.toLocaleString('es-ES')}€
            </p>
            <p className="text-xs text-slate-500">Discutido</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-slate-300">{stats.hechosTotal}</p>
            <p className="text-xs text-slate-500">Hechos</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-orange-400">
              {stats.hechosSinDocumentos}
            </p>
            <p className="text-xs text-slate-500">Sin prueba</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green-400">
              {stats.reclamacionesPorProbabilidad.alta}
            </p>
            <p className="text-xs text-slate-500">Prob. Alta</p>
          </div>
          <div className="bg-slate-800/30 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-amber-400">
              {diasHastaProximo ?? '-'}
            </p>
            <p className="text-xs text-slate-500">Dias hasta hito</p>
          </div>
        </div>

        {/* Panel de Tareas Pendientes */}
        <section className="bg-slate-800/50 rounded-2xl overflow-hidden">
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/70"
            onClick={() => setExpandedTareas(!expandedTareas)}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-400" />
              Deberes Pendientes ({tareasPendientes.length})
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTareaForm({
                    titulo: '',
                    descripcion: '',
                    procesoId: '',
                    dueDate: '',
                    prioridad: 'normal',
                  });
                  setEditingTarea(null);
                  setShowTareaModal(true);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg text-emerald-400"
                title="Añadir tarea"
              >
                <Plus className="w-5 h-5" />
              </button>
              {expandedTareas ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
          {expandedTareas && (
            <div className="px-4 pb-4">
              {tareasPendientes.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  No hay tareas pendientes
                </p>
              ) : (
                <div className="space-y-2">
                  {tareasPendientes.map((tarea) => (
                    <div
                      key={tarea.id}
                      className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg group"
                    >
                      <button
                        onClick={() => completarTarea(tarea.id)}
                        className="p-1 hover:bg-emerald-900/50 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                        title="Marcar como completada"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {tarea.titulo}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>{getProcesoNombre(tarea.procesoId)}</span>
                          {tarea.dueDate && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(tarea.dueDate).toLocaleDateString('es-ES')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getPrioridadColor(
                          tarea.prioridad
                        )}`}
                      >
                        {tarea.prioridad}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditTarea(tarea)}
                          className="p-1 hover:bg-slate-600 rounded text-slate-400"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar esta tarea?')) {
                              deleteTarea(tarea.id);
                            }
                          }}
                          className="p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Cronología Global Editable */}
        <section className="bg-slate-800/50 rounded-2xl overflow-hidden">
          <div
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/70"
            onClick={() => setExpandedCronologia(!expandedCronologia)}
          >
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Cronologia Global ({cronologia.length})
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEventoForm({
                    titulo: '',
                    descripcion: '',
                    procesoId: '',
                    fecha: '',
                    tipo: 'hito',
                    importancia: 'media',
                    pasado: false,
                  });
                  setEditingEvento(null);
                  setShowEventoModal(true);
                }}
                className="p-2 hover:bg-slate-700 rounded-lg text-blue-400"
                title="Añadir evento"
              >
                <Plus className="w-5 h-5" />
              </button>
              {expandedCronologia ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </div>
          </div>
          {expandedCronologia && (
            <div className="px-4 pb-4">
              {cronologiaOrdenada.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  No hay eventos en la cronologia
                </p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {cronologiaOrdenada.map((evento) => (
                    <div
                      key={evento.id}
                      className={`flex items-start gap-3 p-3 rounded-lg group border-l-4 ${
                        evento.pasado || evento.completado
                          ? 'bg-slate-700/30 opacity-60'
                          : 'bg-slate-700/50'
                      } ${getImportanciaColor(evento.importancia)}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">
                            {new Date(evento.fecha).toLocaleDateString('es-ES')}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-600 rounded text-xs text-slate-300">
                            {evento.tipo}
                          </span>
                          {(evento.pasado || evento.completado) && (
                            <span className="px-2 py-0.5 bg-green-900/50 rounded text-xs text-green-400">
                              completado
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-white mt-1">{evento.titulo}</p>
                        <p className="text-xs text-slate-400">
                          {getProcesoNombre(evento.procesoId)}
                        </p>
                        {evento.descripcion && (
                          <p className="text-sm text-slate-400 mt-1">
                            {evento.descripcion}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditEvento(evento)}
                          className="p-1 hover:bg-slate-600 rounded text-slate-400"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este evento?')) {
                              deleteEvento(evento.id);
                            }
                          }}
                          className="p-1 hover:bg-red-900/50 rounded text-slate-400 hover:text-red-400"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Main navigation grid */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Frentes Judiciales
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {procedimientos.map((proc) => (
              <ProcedureCard
                key={proc.id}
                procedimiento={{
                  ...proc,
                  proximoHito: proximosHitos.find((h) => h.procesoId === proc.id)
                    ? {
                        fecha: proximosHitos.find((h) => h.procesoId === proc.id)!
                          .fecha,
                        evento: proximosHitos.find((h) => h.procesoId === proc.id)!
                          .titulo,
                      }
                    : undefined,
                  estrategias: [],
                }}
              />
            ))}
          </div>
        </section>

        {/* Timeline from static data */}
        <section>
          <TimelineChart data={hitosLinea} />
        </section>

        {/* Quick access links - CORREGIDOS CON Link */}
        <section className="bg-slate-800/30 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Acceso Rapido</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              to="/documentos"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Documentos
            </Link>
            <Link
              to="/jurisprudencia"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              Jurisprudencia
            </Link>
            <Link
              to="/picassent#checklist"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center"
            >
              Checklist Audiencia
            </Link>
            <Link
              to="/quart#compensacion"
              className="p-3 bg-slate-800 rounded-xl text-sm hover:bg-slate-700 transition-colors text-center"
            >
              Calculadora
            </Link>
          </div>
        </section>

        {/* Backup / Import */}
        <section className="bg-slate-800/30 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Backup y Restauracion</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportBackup}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar Backup
            </button>
            <button
              onClick={handleImportBackup}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
            >
              <Upload className="w-4 h-4" />
              Importar Backup
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Los datos se guardan automaticamente en tu navegador. Exporta un backup
            periodicamente para mayor seguridad.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-slate-800">
        <p className="text-center text-sm text-slate-500">
          Chaladita.net - Sistema de Soporte a Litigios
        </p>
        <p className="text-center text-xs text-slate-600 mt-1">
          Defensa de Juan Rodriguez Crespo
        </p>
      </footer>

      {/* Modal de Tarea */}
      {showTareaModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingTarea ? 'Editar tarea' : 'Nueva tarea'}
              </h2>
              <button
                onClick={() => setShowTareaModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Titulo *
                </label>
                <input
                  type="text"
                  value={tareaForm.titulo}
                  onChange={(e) =>
                    setTareaForm({ ...tareaForm, titulo: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Titulo de la tarea"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Procedimiento *
                </label>
                <select
                  value={tareaForm.procesoId}
                  onChange={(e) =>
                    setTareaForm({ ...tareaForm, procesoId: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Seleccionar...</option>
                  {procedimientos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha limite
                  </label>
                  <input
                    type="date"
                    value={tareaForm.dueDate}
                    onChange={(e) =>
                      setTareaForm({ ...tareaForm, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={tareaForm.prioridad}
                    onChange={(e) =>
                      setTareaForm({
                        ...tareaForm,
                        prioridad: e.target.value as Tarea['prioridad'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="urgente">Urgente</option>
                    <option value="alta">Alta</option>
                    <option value="normal">Normal</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripcion
                </label>
                <textarea
                  value={tareaForm.descripcion}
                  onChange={(e) =>
                    setTareaForm({ ...tareaForm, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Descripcion opcional..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowTareaModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveTarea}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                  {editingTarea ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Evento */}
      {showEventoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-md w-full">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {editingEvento ? 'Editar evento' : 'Nuevo evento'}
              </h2>
              <button
                onClick={() => setShowEventoModal(false)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Titulo *
                </label>
                <input
                  type="text"
                  value={eventoForm.titulo}
                  onChange={(e) =>
                    setEventoForm({ ...eventoForm, titulo: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Titulo del evento"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Procedimiento *
                  </label>
                  <select
                    value={eventoForm.procesoId}
                    onChange={(e) =>
                      setEventoForm({ ...eventoForm, procesoId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar...</option>
                    {procedimientos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.titulo.split(' - ')[0]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={eventoForm.fecha}
                    onChange={(e) =>
                      setEventoForm({ ...eventoForm, fecha: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tipo
                  </label>
                  <select
                    value={eventoForm.tipo}
                    onChange={(e) =>
                      setEventoForm({
                        ...eventoForm,
                        tipo: e.target.value as EventoCronologia['tipo'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="demanda">Demanda</option>
                    <option value="contestacion">Contestacion</option>
                    <option value="audiencia">Audiencia</option>
                    <option value="sentencia">Sentencia</option>
                    <option value="recurso">Recurso</option>
                    <option value="notificacion">Notificacion</option>
                    <option value="hito">Hito</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Importancia
                  </label>
                  <select
                    value={eventoForm.importancia}
                    onChange={(e) =>
                      setEventoForm({
                        ...eventoForm,
                        importancia: e.target.value as EventoCronologia['importancia'],
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={eventoForm.pasado}
                    onChange={(e) =>
                      setEventoForm({ ...eventoForm, pasado: e.target.checked })
                    }
                    className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                  />
                  Ya ocurrio (pasado)
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Descripcion
                </label>
                <textarea
                  value={eventoForm.descripcion}
                  onChange={(e) =>
                    setEventoForm({ ...eventoForm, descripcion: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descripcion opcional..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowEventoModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEvento}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {editingEvento ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
