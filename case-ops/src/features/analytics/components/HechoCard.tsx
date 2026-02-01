// Archivo: src/features/analytics/components/HechoCard.tsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Paperclip, Scale, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { type HechoReclamado, type EstadoHecho } from '../../../data/hechosReclamados';

interface HechoCardProps {
  hecho: HechoReclamado;
}

const estadoConfig: Record<EstadoHecho, { bg: string; border: string; text: string; label: string; icon: any }> = {
  prescrito: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    label: 'Prescrito',
    icon: CheckCircle2,
  },
  compensable: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    label: 'Compensable',
    icon: Scale,
  },
  disputa: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    label: 'En disputa',
    icon: ShieldAlert,
  },
};

// Función de inteligencia: Resalta términos legales críticos
const highlightLegalTerms = (text: string) => {
  const terms = [
    { regex: /Art\. 1964 CC/gi, color: 'text-amber-500 font-bold underline decoration-amber-500/30' },
    { regex: /Art\. 1145 CC/gi, color: 'text-amber-500 font-bold underline decoration-amber-500/30' },
    { regex: /Prescripción/gi, color: 'text-rose-400 font-bold' },
    { regex: /STS 458\/2025/gi, color: 'text-cyan-400 font-bold italic' },
    { regex: /AEAT/g, color: 'text-white font-bold' }
  ];
  
  let parts: (string | JSX.Element)[] = [text];
  
  terms.forEach(({ regex, color }) => {
    let newParts: (string | JSX.Element)[] = [];
    parts.forEach(part => {
      if (typeof part !== 'string') {
        newParts.push(part);
        return;
      }
      const split = part.split(regex);
      const matches = part.match(regex);
      split.forEach((s, i) => {
        newParts.push(s);
        if (matches && matches[i]) {
          newParts.push(<span key={`${regex}-${i}`} className={color}>{matches[i]}</span>);
        }
      });
    });
    parts = newParts;
  });
  return parts;
};

export function HechoCard({ hecho }: HechoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = estadoConfig[hecho.estado];
  const IconoEstado = config.icon;

  return (
    <div className={`
      w-full rounded-2xl border transition-all duration-300
      ${config.border} ${isExpanded ? 'bg-slate-900 shadow-2xl ring-1 ring-white/10' : config.bg + ' hover:bg-white/5'}
      overflow-hidden mb-3
    `}>
      {/* CAPA 1: CONCEPTO (Cabecera Principal) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start justify-between gap-4 text-left focus:outline-none"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-xs font-bold text-slate-300">
              {hecho.id}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
              <IconoEstado className="inline w-3 h-3 mr-1 mb-0.5" /> {config.label}
            </span>
            <span className="text-[10px] text-slate-500 ml-auto font-mono">{hecho.año}</span>
          </div>
          <h3 className="font-bold text-white text-base leading-tight">{hecho.titulo}</h3>
          <div className="flex items-baseline gap-1 mt-1">
            <span className={`text-xl font-black ${config.text}`}>
              {hecho.cuantia.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-bold uppercase">€</span>
          </div>
        </div>
        <div className="mt-1">
          {isExpanded ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
        </div>
      </button>

      {/* CONTENIDO ESTRATÉGICO DESPLEGABLE */}
      {isExpanded && (
        <div className="px-4 pb-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* CAPA 2: CONFLICTO (Cuerpo a Cuerpo) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-rose-500/5 border-l-4 border-rose-500/40">
              <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <ShieldAlert size={10} /> Versión Actora
              </h4>
              <p className="text-xs text-slate-400 italic leading-relaxed">"{hecho.hechoActora}"</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border-l-4 border-emerald-500/40">
              <h4 className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 size={10} /> Realidad Probada
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed">{hecho.realidadHechos}</p>
            </div>
          </div>

          {/* CAPA 3: OPOSICIÓN (Fundamentos Jurídicos) */}
          <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <Scale size={14} className="text-amber-500" />
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Defensa y Oposición</h4>
            </div>
            <ul className="space-y-2">
              {hecho.oposicion.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="text-amber-500 font-bold mt-0.5">·</span>
                  <span>{highlightLegalTerms(item)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CAPA 4: WAR ROOM (Acción Directa) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
              <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Estrategia Definitiva</h4>
                <p className="text-xs text-slate-200 mt-1 font-medium">{hecho.estrategia}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {hecho.documentosRef.map((doc, idx) => (
                <button
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-400 hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-all"
                >
                  <Paperclip className="w-3 h-3" /> {doc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Badge de estado para sumarios
export function HechoBadge({ count, estado }: { count: number; estado: EstadoHecho }) {
  const config = estadoConfig[estado];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${config.bg} ${config.text} border ${config.border}`}>
      {count} {config.label}
    </span>
  );
}
