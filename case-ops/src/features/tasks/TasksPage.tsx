import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksRepo } from '../../db/repositories';
import type { Task } from '../../types';
import Card from '../../ui/components/Card';
import { formatDate } from '../../utils/dates';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      const data = await tasksRepo.getAll();
      // Ordenar: Primero las pendientes, luego por prioridad, luego por fecha
      setTasks(data.sort((a, b) => {
        if (a.done === b.done) {
            // Si ambas tienen mismo estado, priorizamos la "Alta"
            if (a.priority === 'alta' && b.priority !== 'alta') return -1;
            if (a.priority !== 'alta' && b.priority === 'alta') return 1;
            return (b.createdAt || 0) - (a.createdAt || 0);
        }
        return a.done ? 1 : -1; // Pendientes primero
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleTask = async (task: Task) => {
    try {
      const updated = { ...task, done: !task.done };
      await tasksRepo.update(updated);
      setTasks(current => 
        current.map(t => t.id === task.id ? updated : t)
               .sort((a, b) => a.done === b.done ? 0 : a.done ? 1 : -1)
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string, done: boolean) => {
    if (done) return 'border-slate-800 opacity-50';
    if (priority === 'alta') return 'border-rose-500/50 bg-rose-500/5';
    if (priority === 'media') return 'border-amber-500/50 bg-amber-500/5';
    return 'border-blue-500/50 bg-blue-500/5';
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => !t.done);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Cargando operaciones...</div>;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* CABECERA */}
      <header className="flex flex-col gap-4">
        <div>
          <Link 
            to="/dashboard" 
            className="mb-4 inline-flex items-center text-xs font-semibold uppercase tracking-widest text-slate-400 hover:text-amber-400 lg:hidden"
          >
            ← Volver al Panel
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Operaciones
          </p>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Tareas
          </h1>
          <p className="text-sm text-slate-400">
            {tasks.filter(t => !t.done).length} acciones pendientes de ejecución.
          </p>
        </div>

        {/* PESTAÑAS SIMPLES */}
        <div className="flex gap-4 border-b border-slate-800 text-sm">
            <button 
                onClick={() => setFilter('pending')}
                className={`pb-2 px-1 border-b-2 transition-colors ${filter === 'pending' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-500'}`}
            >
                Pendientes
            </button>
            <button 
                onClick={() => setFilter('all')}
                className={`pb-2 px-1 border-b-2 transition-colors ${filter === 'all' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-slate-500'}`}
            >
                Histórico
            </button>
        </div>
      </header>

      {/* LISTA DE TAREAS */}
      {filteredTasks.length === 0 ? (
        <Card className="p-8 text-center border-dashed border-slate-800 bg-slate-900/30">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-slate-200">Todo limpio</h3>
          <p className="text-slate-500">No hay tareas pendientes en esta vista.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task)}
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-4 transition-all hover:bg-slate-800/50 ${getPriorityColor(task.priority, task.done)}`}
            >
              <div className="flex items-start gap-4">
                <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    task.done 
                    ? 'border-emerald-500 bg-emerald-500 text-black' 
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}>
                  {task.done && <span className="text-xs font-bold">✓</span>}
                </div>
                
                <div>
                    <h3 className={`font-medium transition-all ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                        {task.title}
                    </h3>
                    {task.dueDate && (
                        <p className="text-xs text-slate-500 mt-1">
                            Vence: {formatDate(task.dueDate)}
                        </p>
                    )}
                </div>
              </div>

              <div className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                  task.priority === 'alta' ? 'text-rose-400 bg-rose-500/10' :
                  task.priority === 'media' ? 'text-amber-400 bg-amber-500/10' :
                  'text-blue-400 bg-blue-500/10'
              }`}>
                {task.priority}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
