import { AlertTriangle, Calendar, CreditCard, Mail, Scale } from 'lucide-react';

export interface CaseTimelineItem {
  id: string;
  fecha: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  actores: string[];
  importeCents?: number;
  disputed?: boolean;
  fuente?: {
    doc: string;
    page?: number;
  };
  tags: string[];
}

type CaseTimelineMeta = {
  bg: string;
  border: string;
  text: string;
  icon: typeof Calendar;
};

interface CaseTimelineBaseProps {
  title: string;
  subtitle?: string;
  items: CaseTimelineItem[];
  getMeta?: (item: CaseTimelineItem) => CaseTimelineMeta;
}

const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

const formatIsoDate = (fecha: string) => {
  const [year, month, day] = fecha.split('-');
  if (!year || !month || !day) return fecha;
  return `${day}/${month}/${year}`;
};

const formatTipoLabel = (tipo: string) => tipo.replace(/_/g, ' ');

const defaultMetaForTipo = (tipo: string): CaseTimelineMeta => {
  const normalized = tipo.toLowerCase();

  if (normalized === 'judicial' || normalized === 'procesal') {
    return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: Scale };
  }
  if (normalized === 'payment' || normalized === 'hipoteca' || normalized === 'bank_event') {
    return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: CreditCard };
  }
  if (normalized === 'email') {
    return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: Mail };
  }
  if (normalized === 'impago') {
    return { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: AlertTriangle };
  }

  return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400', icon: Calendar };
};

export function CaseTimelineBase({ title, subtitle, items, getMeta }: CaseTimelineBaseProps) {
  const eventosPorAño = items.reduce((acc, evt) => {
    const año = evt.fecha.split('-')[0];
    if (!acc[año]) acc[año] = [];
    acc[año].push(evt);
    return acc;
  }, {} as Record<string, CaseTimelineItem[]>);

  const años = Object.keys(eventosPorAño).sort((a, b) => a.localeCompare(b));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="text-amber-400" size={22} />
          {title}
        </h2>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>

      <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/60 to-slate-900/60 p-5">
        <div className="space-y-6">
          {años.map((año) => {
            const eventos = [...eventosPorAño[año]].sort((a, b) => a.fecha.localeCompare(b.fecha));

            return (
              <div key={año}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-lg font-bold text-amber-400">{año}</div>
                  <div className="flex-1 h-px bg-slate-700/50" />
                  <div className="text-xs text-slate-500">{eventos.length} eventos</div>
                </div>

                <div className="space-y-2 ml-4 border-l-2 border-slate-700/50 pl-4">
                  {eventos.map((evento) => {
                    const meta = getMeta ? getMeta(evento) : defaultMetaForTipo(evento.tipo);
                    const IconComponent = meta.icon;

                    return (
                      <div
                        key={evento.id}
                        className={`p-3 rounded-lg border ${meta.bg} ${meta.border} relative`}
                      >
                        <div
                          className={`absolute -left-[22px] top-4 w-3 h-3 rounded-full ${meta.text.replace(
                            'text-',
                            'bg-'
                          )} border-2 border-slate-900`}
                        />

                        <div className="flex items-start gap-3">
                          <IconComponent className={`${meta.text} shrink-0 mt-0.5`} size={16} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-slate-500 font-mono">{formatIsoDate(evento.fecha)}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-500/20 text-slate-200 uppercase">
                                {formatTipoLabel(evento.tipo)}
                              </span>
                              {evento.disputed && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/30 text-rose-300 font-bold uppercase">
                                  Disputado
                                </span>
                              )}
                              {typeof evento.importeCents === 'number' && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-200 uppercase">
                                  {formatCents(evento.importeCents)}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-medium text-white mt-1">{evento.titulo}</h4>
                            <p className="text-xs text-slate-400 mt-1">{evento.descripcion}</p>
                            {evento.actores.length > 0 && (
                              <div className="mt-2 text-[11px] text-slate-500">
                                Actores: {evento.actores.join(', ')}
                              </div>
                            )}
                            {evento.fuente && (
                              <div className="mt-1 text-[10px] text-blue-400">
                                Fuente: {evento.fuente.doc}
                                {evento.fuente.page ? ` p.${evento.fuente.page}` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CaseTimelineBase;
