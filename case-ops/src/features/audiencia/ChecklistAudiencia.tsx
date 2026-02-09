// ============================================
// CASE OPS - Checklist para Audiencia
// Seguimiento de puntos durante la vista oral
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checklistVista, argumentosContestacion } from '../../data/mislata';

interface CheckItem {
  id: string;
  texto: string;
  categoria: 'obligatorio' | 'recomendado' | 'opcional';
  hecho: boolean;
  notas?: string;
}

// Generar checklist completo
function getFullChecklist(): CheckItem[] {
  const items: CheckItem[] = [];

  // Items del checklist de Mislata
  checklistVista.forEach((item) => {
    items.push({
      id: `mislata-${item.id}`,
      texto: item.texto,
      categoria: 'obligatorio',
      hecho: false,
    });
  });

  // Añadir réplicas a argumentos de Vicenta
  argumentosContestacion.forEach((arg) => {
    items.push({
      id: `replica-${arg.id}`,
      texto: `Rebatir: ${arg.titulo}`,
      categoria: arg.prioridad <= 2 ? 'obligatorio' : 'recomendado',
      hecho: false,
    });
  });

  // Items adicionales genéricos
  const adicionales: Omit<CheckItem, 'hecho'>[] = [
    { id: 'doc-extractos', texto: 'Referir extractos bancarios (Doc. 3)', categoria: 'obligatorio' },
    { id: 'cuantia', texto: 'Confirmar cuantía: 7.119,98 €', categoria: 'obligatorio' },
    { id: 'periodo', texto: 'Confirmar periodo: oct 2023 - jun 2025', categoria: 'obligatorio' },
    { id: 'prueba', texto: 'Solicitar admisión de prueba documental', categoria: 'obligatorio' },
    { id: 'oficio', texto: 'Recordar oficio a CaixaBank pendiente', categoria: 'recomendado' },
    { id: 'costas', texto: 'Solicitar condena en costas', categoria: 'opcional' },
  ];

  adicionales.forEach((item) => {
    items.push({ ...item, hecho: false });
  });

  return items;
}

export function ChecklistAudiencia() {
  const [items, setItems] = useState<CheckItem[]>(() => {
    // Intentar cargar del localStorage
    const saved = localStorage.getItem('checklist-audiencia-mislata');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getFullChecklist();
      }
    }
    return getFullChecklist();
  });

  const [showCompleted, setShowCompleted] = useState(true);
  const [filterCategoria, setFilterCategoria] = useState<'todas' | 'obligatorio' | 'recomendado' | 'opcional'>('todas');

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('checklist-audiencia-mislata', JSON.stringify(items));
  }, [items]);

  // Toggle item
  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, hecho: !item.hecho } : item))
    );
  };

  // Añadir nota
  const addNota = (id: string, nota: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notas: nota } : item))
    );
  };

  // Reset checklist
  const resetChecklist = () => {
    if (confirm('¿Resetear todo el checklist?')) {
      setItems(getFullChecklist());
    }
  };

  // Filtrar items
  const filteredItems = items.filter((item) => {
    if (!showCompleted && item.hecho) return false;
    if (filterCategoria !== 'todas' && item.categoria !== filterCategoria) return false;
    return true;
  });

  // Estadísticas
  const stats = {
    total: items.length,
    completados: items.filter((i) => i.hecho).length,
    obligatorios: items.filter((i) => i.categoria === 'obligatorio'),
    obligatoriosCompletados: items.filter((i) => i.categoria === 'obligatorio' && i.hecho).length,
  };

  const progress = Math.round((stats.completados / stats.total) * 100);
  const obligatoriosProgress = Math.round(
    (stats.obligatoriosCompletados / stats.obligatorios.length) * 100
  );

  // Colores por categoría
  const categoryColors = {
    obligatorio: 'border-red-500/50 bg-red-500/10',
    recomendado: 'border-amber-500/50 bg-amber-500/10',
    opcional: 'border-slate-500/50 bg-slate-500/10',
  };

  const categoryBadges = {
    obligatorio: 'bg-red-500/20 text-red-300',
    recomendado: 'bg-amber-500/20 text-amber-300',
    opcional: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-white">Checklist Audiencia</h1>
          <Link
            to="/audiencia/telepronter?caseKey=mislata"
            className="text-sm bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4 py-2 rounded-lg transition-colors"
          >
            Modo Teleprónter →
          </Link>
        </div>
        <p className="text-slate-400 text-sm">Mislata J.V. 1185/2025 - Vista oral</p>
      </div>

      {/* Progreso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Progreso total</span>
            <span className="text-white font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.completados} de {stats.total} puntos
          </p>
        </div>

        <div className="bg-slate-900/50 rounded-lg border border-red-500/30 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-300 text-sm">Obligatorios</span>
            <span className="text-white font-bold">{obligatoriosProgress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${obligatoriosProgress}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {stats.obligatoriosCompletados} de {stats.obligatorios.length} obligatorios
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filterCategoria}
          onChange={(e) => setFilterCategoria(e.target.value as typeof filterCategoria)}
          className="bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700"
        >
          <option value="todas">Todas las categorías</option>
          <option value="obligatorio">Solo obligatorios</option>
          <option value="recomendado">Solo recomendados</option>
          <option value="opcional">Solo opcionales</option>
        </select>

        <button
          onClick={() => setShowCompleted(!showCompleted)}
          className={`text-sm px-3 py-2 rounded-lg border transition-colors ${
            showCompleted
              ? 'bg-slate-800 border-slate-700 text-slate-300'
              : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
          }`}
        >
          {showCompleted ? 'Ocultar completados' : 'Mostrar completados'}
        </button>

        <button
          onClick={resetChecklist}
          className="text-sm px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-red-400 transition-colors ml-auto"
        >
          Resetear
        </button>
      </div>

      {/* Lista de items */}
      <div className="space-y-2">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`rounded-lg border p-4 transition-all ${
              item.hecho
                ? 'bg-slate-900/30 border-slate-800 opacity-60'
                : categoryColors[item.categoria]
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleItem(item.id)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                  item.hecho
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-500 hover:border-emerald-500'
                }`}
              >
                {item.hecho && '✓'}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${categoryBadges[item.categoria]}`}
                  >
                    {item.categoria.toUpperCase()}
                  </span>
                </div>
                <p
                  className={`text-white ${item.hecho ? 'line-through text-slate-500' : ''}`}
                >
                  {item.texto}
                </p>

                {/* Notas */}
                {item.notas && (
                  <p className="text-sm text-slate-400 mt-1 italic">Nota: {item.notas}</p>
                )}

                {/* Input para añadir nota */}
                {!item.hecho && (
                  <input
                    type="text"
                    placeholder="Añadir nota..."
                    className="mt-2 w-full bg-slate-800/50 text-slate-300 text-sm rounded px-2 py-1 border border-slate-700 focus:border-amber-500 focus:outline-none"
                    value={item.notas || ''}
                    onChange={(e) => addNota(item.id, e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay items */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">✅</div>
          <p className="text-slate-400">
            {showCompleted ? 'No hay items con ese filtro' : '¡Todos los puntos completados!'}
          </p>
        </div>
      )}
    </div>
  );
}
