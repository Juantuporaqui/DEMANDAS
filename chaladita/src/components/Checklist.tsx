import { useState } from 'react';
import { Check, AlertCircle, FileText } from 'lucide-react';
import type { ChecklistItem } from '../types';

interface ChecklistProps {
  items: ChecklistItem[];
  onToggle?: (id: string, completed: boolean) => void;
  title?: string;
}

export function Checklist({ items, onToggle, title }: ChecklistProps) {
  const [checkItems, setCheckItems] = useState(items);

  const handleToggle = (id: string) => {
    setCheckItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completado: !item.completado } : item
      )
    );
    const item = checkItems.find(i => i.id === id);
    if (item && onToggle) {
      onToggle(id, !item.completado);
    }
  };

  const completados = checkItems.filter(i => i.completado).length;
  const total = checkItems.length;

  // Group by category
  const grouped = checkItems.reduce((acc, item) => {
    if (!acc[item.categoria]) acc[item.categoria] = [];
    acc[item.categoria].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-slate-400">
            {completados}/{total} completados
          </span>
        </div>
      )}

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${(completados / total) * 100}%` }}
        />
      </div>

      {Object.entries(grouped).map(([categoria, categoryItems]) => (
        <div key={categoria} className="space-y-2">
          <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            {categoria}
          </h4>
          {categoryItems.map(item => (
            <div
              key={item.id}
              className={`
                p-4 rounded-xl border transition-all cursor-pointer
                ${item.completado
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'}
              `}
              onClick={() => handleToggle(item.id)}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`
                    w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5
                    ${item.completado
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-500'}
                  `}
                >
                  {item.completado && <Check className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${item.completado ? 'line-through text-slate-400' : ''}`}>
                    {item.texto}
                  </p>
                  {item.articuloLEC && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      <FileText className="w-3 h-3" />
                      {item.articuloLEC}
                    </span>
                  )}
                  {item.notas && (
                    <p className="text-sm text-slate-400 mt-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                      {item.notas}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
