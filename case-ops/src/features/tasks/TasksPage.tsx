// ============================================
// CASE OPS - Tasks Page
// ============================================

import { useState, useEffect } from 'react';
import { tasksRepo, casesRepo } from '../../db/repositories';
import { Modal, EmptyState } from '../../components';
import type { Task, Case, TaskStatus, TaskPriority } from '../../types';
import { formatDate, getCurrentDate } from '../../utils/dates';

const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
  cancelada: 'Cancelada',
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
};

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const [formData, setFormData] = useState({
    caseId: '',
    title: '',
    dueDate: getCurrentDate(),
    priority: 'media' as TaskPriority,
    status: 'pendiente' as TaskStatus,
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [allTasks, allCases] = await Promise.all([
        tasksRepo.getAll(),
        casesRepo.getAll(),
      ]);
      setTasks(allTasks);
      setCases(allCases);

      if (allCases.length === 1) {
        setFormData((prev) => ({ ...prev, caseId: allCases[0].id }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  function openNewTask() {
    setEditingTask(null);
    setFormData({
      caseId: cases.length === 1 ? cases[0].id : '',
      title: '',
      dueDate: getCurrentDate(),
      priority: 'media',
      status: 'pendiente',
      notes: '',
    });
    setShowModal(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setFormData({
      caseId: task.caseId,
      title: task.title,
      dueDate: task.dueDate || getCurrentDate(),
      priority: task.priority,
      status: task.status,
      notes: task.notes,
    });
    setShowModal(true);
  }

  async function handleSubmit() {
    if (!formData.caseId) {
      alert('Selecciona un caso');
      return;
    }

    if (!formData.title.trim()) {
      alert('El título es obligatorio');
      return;
    }

    try {
      const taskData = {
        caseId: formData.caseId,
        title: formData.title.trim(),
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        status: formData.status,
        notes: formData.notes.trim(),
        links: editingTask?.links || [],
      };

      if (editingTask) {
        await tasksRepo.update(editingTask.id, taskData);
      } else {
        await tasksRepo.create(taskData);
      }

      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Error al guardar la tarea');
    }
  }

  async function handleToggleStatus(task: Task) {
    const newStatus: TaskStatus =
      task.status === 'completada' ? 'pendiente' : 'completada';
    await tasksRepo.update(task.id, { status: newStatus });
    await loadData();
  }

  async function handleDelete() {
    if (!editingTask) return;
    if (!confirm('¿Eliminar esta tarea?')) return;

    try {
      await tasksRepo.delete(editingTask.id);
      await loadData();
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') {
      return task.status === 'pendiente' || task.status === 'en_progreso';
    }
    if (filter === 'completed') {
      return task.status === 'completada';
    }
    return true;
  });

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tareas</h1>
          <p className="page-subtitle">
            {tasks.filter((t) => t.status === 'pendiente').length} pendientes
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNewTask}>
          + Nueva
        </button>
      </div>

      {/* Filters */}
      <div className="tabs mb-md">
        <button
          className={`tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pendientes (
          {tasks.filter((t) => t.status === 'pendiente' || t.status === 'en_progreso').length}
          )
        </button>
        <button
          className={`tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completadas ({tasks.filter((t) => t.status === 'completada').length})
        </button>
        <button
          className={`tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Todas ({tasks.length})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          icon="✅"
          title={filter === 'completed' ? 'Sin tareas completadas' : 'Sin tareas pendientes'}
          description={
            filter === 'pending'
              ? '¡Bien hecho! No tienes tareas pendientes'
              : 'Añade tareas para organizar el trabajo'
          }
          action={
            filter === 'pending'
              ? { label: 'Nueva tarea', onClick: openNewTask }
              : undefined
          }
        />
      ) : (
        <div className="card">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="list-item"
              style={{
                opacity: task.status === 'completada' ? 0.6 : 1,
              }}
            >
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => handleToggleStatus(task)}
                style={{
                  color:
                    task.status === 'completada'
                      ? 'var(--color-success)'
                      : 'var(--text-muted)',
                }}
              >
                {task.status === 'completada' ? '✓' : '○'}
              </button>
              <div
                className="list-item-content"
                onClick={() => openEditTask(task)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className="list-item-title"
                  style={{
                    textDecoration:
                      task.status === 'completada' ? 'line-through' : 'none',
                  }}
                >
                  {task.title}
                </div>
                <div className="list-item-subtitle flex gap-sm items-center">
                  <span
                    className={`chip ${
                      task.priority === 'alta'
                        ? 'chip-danger'
                        : task.priority === 'media'
                        ? 'chip-warning'
                        : ''
                    }`}
                    style={{ fontSize: '0.625rem' }}
                  >
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                  {task.dueDate && (
                    <span>{formatDate(task.dueDate)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTask ? 'Editar tarea' : 'Nueva tarea'}
        footer={
          <>
            {editingTask && (
              <button className="btn btn-danger" onClick={handleDelete}>
                Eliminar
              </button>
            )}
            <div style={{ flex: 1 }} />
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Guardar
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Caso *</label>
          <select
            className="form-select"
            value={formData.caseId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, caseId: e.target.value }))
            }
          >
            <option value="">Seleccionar...</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-input"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="¿Qué hay que hacer?"
          />
        </div>

        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Fecha límite</label>
            <input
              type="date"
              className="form-input"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Prioridad</label>
            <select
              className="form-select"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as TaskPriority,
                }))
              }
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {editingTask && (
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              className="form-select"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as TaskStatus,
                }))
              }
            >
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Notas</label>
          <textarea
            className="form-textarea"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Detalles adicionales..."
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
