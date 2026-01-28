import Card from '../../../ui/components/Card';
import { textMuted } from '../../../ui/tokens';

const placeholderItems = [
  { id: 't1', title: 'Admisión de demanda', date: '15 Ene' },
  { id: 't2', title: 'Vista preliminar', date: '03 Feb' },
  { id: 't3', title: 'Señalamiento principal', date: '20 Mar' },
];

export function Timeline() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600">
          Timeline del caso
        </h3>
        <span className={`text-xs ${textMuted}`}>placeholder</span>
      </div>
      <div className="mt-4 space-y-3">
        {placeholderItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-dashed border-zinc-200/70 bg-zinc-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-zinc-800">
              {item.title}
            </span>
            <span className="text-xs font-semibold text-zinc-500">
              {item.date}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
