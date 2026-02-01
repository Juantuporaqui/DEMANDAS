import { ChevronDown, Paperclip, Scale, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { EstadoHecho, HechoReclamado } from '../../../data/hechosReclamados';
import { accent, border, card, textMuted, textPrimary, textSecondary } from '../../../ui/tokens';

interface HechoCardProps {
  hecho: HechoReclamado;
}

const estadoConfig: Record<EstadoHecho, { bg: string; border: string; text: string; label: string }> = {
  prescrito: {
    bg: 'bg-slate-500/20',
    border: 'border-slate-400/40',
    text: 'text-slate-200',
    label: 'Prescrito',
  },
  compensable: {
    bg: 'bg-orange-500/20',
    border: 'border-orange-400/40',
    text: 'text-orange-200',
    label: 'Compensable',
  },
  disputa: {
    bg: 'bg-rose-500/20',
    border: 'border-rose-400/40',
    text: 'text-rose-200',
    label: 'En disputa',
  },
};

const highlightRegex = /(STS\s*458\/2025|Art\.?\s*1964\s*CC)/gi;
const isHighlightMatch = (value: string) => /^(STS\s*458\/2025|Art\.?\s*1964\s*CC)$/i.test(value);

const formatEuro = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

const getDocLink = (docRef: string) => {
  const match = docRef.match(/(\d+)/);
  if (!match) {
    return '/documents';
  }
  return `/documents?doc=${match[1]}`;
};

const renderHighlighted = (text: string) => {
  const parts = text.split(highlightRegex);
  return parts.map((part, index) => (
    isHighlightMatch(part) ? (
      <strong key={`${part}-${index}`} className="font-semibold text-white">
        {part}
      </strong>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    )
  ));
};

export function HechoCard({ hecho }: HechoCardProps) {
  const config = estadoConfig[hecho.estado];

  return (
    <article
      className={`
        w-full rounded-2xl ${card} ${border}
        p-4 sm:p-5 space-y-4
      `}
    >
      {/* CAPA 1: CABECERA */}
      <header className="flex flex-wrap items-start gap-3 justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900/70 text-xs font-bold text-slate-200">
            {hecho.id}
          </span>
          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border}`}>
            {config.label}
          </span>
        </div>
        <div className="text-right">
          <p className={`text-xs ${textMuted}`}>{hecho.año}</p>
          <p className={`text-lg font-semibold ${hecho.estado === 'disputa' ? accent : textPrimary}`}>
            {formatEuro(hecho.cuantia)}
          </p>
        </div>
        <h3 className={`w-full text-sm sm:text-base font-semibold ${textPrimary}`}>
          {hecho.titulo}
        </h3>
      </header>

      {/* CAPA 2: EL CONFLICTO */}
      <details className="group rounded-xl border border-slate-700/60 bg-slate-900/40 p-3 sm:p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-200">
          <span>El conflicto</span>
          <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-sky-200 mb-2">Versión de la Actora</h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>{hecho.hechoActora}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-200 mb-2">Realidad de los Hechos</h4>
            <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>{hecho.realidadHechos}</p>
          </div>
        </div>

        {/* CAPA 3: ARGUMENTACIÓN LEGAL */}
        {hecho.oposicion.length > 0 && (
          <details className="group mt-4 rounded-lg border border-slate-700/60 bg-slate-950/40 p-3">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-200">
              <span className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-300" />
                Argumentación legal
              </span>
              <ChevronDown className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm text-slate-200">
              {hecho.oposicion.map((argumento, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span className={textSecondary}>{renderHighlighted(argumento)}</span>
                </li>
              ))}
            </ul>
          </details>
        )}
      </details>

      {/* CAPA 4: WAR ROOM */}
      <details className="group rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 sm:p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-amber-200">
          <span className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            War Room
          </span>
          <ChevronDown className="h-4 w-4 text-amber-200 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-3">
          <div className="rounded-lg border border-amber-300/40 bg-slate-950/60 p-3">
            <p className="text-xs sm:text-sm font-semibold text-amber-100 uppercase tracking-wider mb-2">Nota de inteligencia</p>
            <p className={`text-xs sm:text-sm leading-relaxed ${textSecondary}`}>{hecho.estrategia}</p>
          </div>
          {hecho.documentosRef.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-200 uppercase tracking-wider">
                <Paperclip className="h-4 w-4 text-slate-300" />
                Documentos clave
              </div>
              <div className="flex flex-wrap gap-2">
                {hecho.documentosRef.map((doc) => (
                  <Link
                    key={doc}
                    to={getDocLink(doc)}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-600/50 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-amber-300/40 hover:text-amber-200 transition-colors"
                  >
                    {doc}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </details>
    </article>
  );
}

// Badge pequeño para resúmenes
interface HechoBadgeProps {
  count: number;
  estado: EstadoHecho;
}

export function HechoBadge({ count, estado }: HechoBadgeProps) {
  const config = estadoConfig[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
      {count} {config.label}
    </span>
  );
}
