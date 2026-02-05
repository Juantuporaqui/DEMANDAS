// ============================================
// HECHO EXPANDIBLE - Muestra toda la información detallada
// ============================================

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  FileSearch,
  FileText,
  Link,
  ListChecks,
  Megaphone,
  MessageCircleQuestion,
  Printer,
  Scale,
  Shield,
  ShieldCheck,
  Sword,
  Target,
  UserRound,
  Download,
} from 'lucide-react';
import type { HechoReclamado, EstadoHecho } from '../../../data/hechosReclamados';
import { getPDFsByCaso, getPDFUrl } from '../../../data/pdfRegistry';

interface HechoExpandibleProps {
  hecho: HechoReclamado;
}

const estadoConfig: Record<EstadoHecho, { bg: string; border: string; text: string; label: string; icon: typeof Clock }> = {
  prescrito: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    label: 'Prescrito',
    icon: Clock,
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
    icon: AlertTriangle,
  },
};

const normalizeTitle = (title: string) => title.toLowerCase().replace(/\s+/g, ' ').trim();

const getSectionIcon = (title: string) => {
  const normalized = normalizeTitle(title).replace(/^\d+\)\s*/, '');
  if (normalized.includes('objetivo procesal')) return Target;
  if (normalized.includes('qué alega la actora')) return UserRound;
  if (normalized.includes('hechos verificables')) return ListChecks;
  if (normalized.includes('prueba y trazabilidad')) return FileSearch;
  if (normalized.includes('líneas de oposición')) return ShieldCheck;
  if (normalized.includes('ataques de credibilidad')) return AlertTriangle;
  if (normalized.includes('plan b')) return Scale;
  if (normalized.includes('preguntas sugeridas')) return MessageCircleQuestion;
  if (normalized.includes('mensaje corto')) return Megaphone;
  return FileText;
};

const parseDocNumber = (text: string) => {
  const match = text.match(/\bdoc\.?[-\s_]*(\d+)\b/i);
  return match ? Number(match[1]) : null;
};

const picassentDocsByNumber = getPDFsByCaso('picassent').reduce((acc, pdf) => {
  const docNumber = parseDocNumber(pdf.archivo);
  if (docNumber !== null) {
    acc.set(docNumber, {
      href: getPDFUrl('picassent', pdf.archivo),
      title: pdf.titulo,
      type: pdf.tipo,
    });
  }
  return acc;
}, new Map<number, { href: string; title: string; type: string }>());

const parseDesarrollo = (markdown?: string) => {
  if (!markdown) {
    return { title: 'Desarrollo', sections: [] as Array<{ title: string; content: string }> };
  }

  const lines = markdown.split('\n');
  let title = 'Desarrollo';
  const sections: Array<{ title: string; content: string[] }> = [];
  let current: { title: string; content: string[] } | null = null;

  lines.forEach(line => {
    if (line.startsWith('# ')) {
      title = line.replace(/^#\s*/, '').trim();
      return;
    }

    if (line.startsWith('## ')) {
      if (current) {
        sections.push(current);
      }
      current = { title: line.replace(/^##\s*/, '').trim(), content: [] };
      return;
    }

    if (line.startsWith('**Chips:**')) {
      return;
    }

    if (current) {
      current.content.push(line);
    }
  });

  if (current) {
    sections.push(current);
  }

  return {
    title,
    sections: sections.map(section => ({
      title: section.title,
      content: section.content.join('\n').trim(),
    })),
  };
};

const renderInline = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });

const renderMarkdownContent = (content: string) => {
  const lines = content.split('\n');
  const blocks: Array<
    | { type: 'paragraph'; text: string }
    | { type: 'list'; items: string[] }
    | { type: 'subheading'; text: string }
  > = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: 'paragraph', text: paragraph.join(' ').trim() });
      paragraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: listItems });
      listItems = [];
    }
  };

  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'subheading', text: trimmed.replace(/^###\s*/, '') });
      return;
    }
    if (trimmed.startsWith('- ')) {
      flushParagraph();
      listItems.push(trimmed.replace(/^- /, '').trim());
      return;
    }
    if (!trimmed) {
      flushParagraph();
      flushList();
      return;
    }
    paragraph.push(trimmed);
  });

  flushParagraph();
  flushList();

  return blocks.map((block, index) => {
    if (block.type === 'subheading') {
      return (
        <h5 key={index} className="text-xs sm:text-sm font-semibold text-slate-200 mt-2">
          {renderInline(block.text)}
        </h5>
      );
    }
    if (block.type === 'list') {
      return (
        <ul key={index} className="list-disc pl-5 space-y-1">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={index}>
        {renderInline(block.text)}
      </p>
    );
  });
};

export function HechoExpandible({ hecho }: HechoExpandibleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<'vista' | 'desarrollo'>('vista');
  const [copied, setCopied] = useState(false);

  const linkedDocuments = useMemo(
    () =>
      (hecho.documentosRef ?? [])
        .map((docLabel) => {
          const docNumber = parseDocNumber(docLabel);
          if (docNumber === null) return null;

          const registryMatch = picassentDocsByNumber.get(docNumber);
          if (!registryMatch) return null;

          return {
            docLabel,
            href: registryMatch.href,
            title: registryMatch.title,
            type: registryMatch.type,
          };
        })
        .filter((doc): doc is { docLabel: string; href: string; title: string; type: string } => Boolean(doc)),
    [hecho.documentosRef]
  );
  const config = estadoConfig[hecho.estado];
  const EstadoIcon = config.icon;
  const desarrollo = useMemo(() => parseDesarrollo(hecho.desarrolloMD), [hecho.desarrolloMD]);

  const handleCopy = async () => {
    const texto = hecho.desarrolloMD || 'Pendiente';
    try {
      await navigator.clipboard.writeText(texto);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden transition-all duration-300`}>
      {/* HEADER - Siempre visible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left flex items-start gap-3 hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 text-sm font-bold text-slate-300 shrink-0">
          {hecho.id}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} border ${config.border} flex items-center gap-1`}>
              <EstadoIcon size={10} />
              {config.label}
            </span>
            <span className="text-[10px] text-slate-500">{hecho.año}</span>
          </div>

          <h3 className="font-semibold text-white text-sm leading-tight mb-1">
            {hecho.titulo}
          </h3>

          <div className="flex items-baseline gap-1">
            <span className={`text-lg font-bold ${config.text}`}>
              {hecho.cuantia.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500">€</span>
          </div>
        </div>

        <div className="shrink-0 mt-1">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {/* CONTENIDO EXPANDIDO - Optimizado móvil */}
      {isExpanded && (
        <div className="px-3 sm:px-4 pb-4 space-y-3 sm:space-y-4 border-t border-slate-700/30 pt-3 sm:pt-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 -mx-1 px-1">
            {(['vista', 'desarrollo'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setVistaActiva(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-colors ${
                  vistaActiva === tab
                    ? 'bg-slate-900 text-white border-slate-500'
                    : 'bg-slate-900/40 text-slate-400 border-slate-700/60 hover:text-slate-200'
                }`}
              >
                {tab === 'vista' ? 'Vista rápida' : 'Desarrollo'}
              </button>
            ))}
          </div>

          {vistaActiva === 'vista' && (
            <>
              {/* LO QUE DICE LA ACTORA */}
              <div className="rounded-lg sm:rounded-xl bg-rose-950/30 border border-rose-500/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sword size={14} className="text-rose-400 sm:w-4 sm:h-4" />
                  <h4 className="text-xs sm:text-sm font-bold text-rose-400 uppercase tracking-wider">Demandante</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {hecho.hechoActora}
                </p>
              </div>

              {/* REALIDAD DE LOS HECHOS */}
              <div className="rounded-lg sm:rounded-xl bg-emerald-950/30 border border-emerald-500/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-emerald-400 sm:w-4 sm:h-4" />
                  <h4 className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">Realidad</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {hecho.realidadHechos}
                </p>
              </div>

              {/* ARGUMENTOS DE OPOSICIÓN */}
              {hecho.oposicion && hecho.oposicion.length > 0 && (
                <div className="rounded-lg sm:rounded-xl bg-blue-950/30 border border-blue-500/20 p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Scale size={14} className="text-blue-400 sm:w-4 sm:h-4" />
                    <h4 className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">Defensa</h4>
                  </div>
                  <ul className="space-y-2">
                    {hecho.oposicion.map((arg, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 size={12} className="text-blue-400 shrink-0 mt-0.5 sm:w-3.5 sm:h-3.5" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ESTRATEGIA DE DEFENSA */}
              <div className="rounded-lg sm:rounded-xl bg-amber-950/30 border border-amber-500/20 p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-amber-400 sm:w-4 sm:h-4" />
                  <h4 className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">Estrategia</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {hecho.estrategia}
                </p>
              </div>

              {/* DOCUMENTOS DE PRUEBA */}
              {linkedDocuments.length > 0 && (
                <div className="rounded-lg sm:rounded-xl bg-slate-800/50 border border-slate-700/50 p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <FileText size={14} className="text-cyan-400 sm:w-4 sm:h-4" />
                    <h4 className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider">Documentos</h4>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {linkedDocuments.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer"
                        download
                        className="group rounded-xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-2.5 sm:p-3 text-left hover:border-cyan-400/50 hover:from-cyan-500/20 transition-all"
                        title={`Descargar ${doc.docLabel}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-mono text-[11px] sm:text-xs text-cyan-300 group-hover:text-cyan-200">{doc.docLabel}</p>
                            <p className="text-[10px] sm:text-xs text-slate-300 leading-snug mt-1">{doc.title}</p>
                          </div>
                          <Download size={14} className="text-cyan-400/80 group-hover:text-cyan-300 shrink-0" />
                        </div>
                        <span className="inline-flex mt-2 rounded-full border border-cyan-500/30 px-2 py-0.5 text-[9px] sm:text-[10px] uppercase tracking-wider text-cyan-200/90">
                          {doc.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* TAREAS PENDIENTES */}
              {hecho.tareas && hecho.tareas.length > 0 && (
                <div className="rounded-lg sm:rounded-xl bg-purple-950/30 border border-purple-500/20 p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <CheckCircle2 size={14} className="text-purple-400 sm:w-4 sm:h-4" />
                    <h4 className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider">Tareas</h4>
                  </div>
                  <ul className="space-y-2">
                    {hecho.tareas.map((tarea, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <span className="w-4 h-4 sm:w-5 sm:h-5 rounded border border-purple-500/50 flex items-center justify-center text-[9px] sm:text-[10px] text-purple-400 shrink-0">
                          {i + 1}
                        </span>
                        <span>{tarea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* VINCULACIÓN */}
              {hecho.vinculadoA && (
                <div className="text-xs text-slate-500 italic">
                  Vinculado al Hecho #{hecho.vinculadoA}
                </div>
              )}
            </>
          )}

          {vistaActiva === 'desarrollo' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-slate-900/60 border border-slate-700 text-slate-200">
                  Año {hecho.año}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-slate-900/60 border border-slate-700 text-slate-200">
                  Cuantía {hecho.cuantia.toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-slate-900/60 border border-slate-700 text-slate-200">
                  Estado: {hecho.estado}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <Copy size={14} />
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/70 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white transition-colors"
                >
                  <Printer size={14} />
                  Imprimir
                </button>
              </div>

              {hecho.desarrolloMD ? (
                <div className="space-y-4">
                  <h3 className="text-sm sm:text-base font-semibold text-white">{desarrollo.title}</h3>
                  {desarrollo.sections.map(section => {
                    const Icon = getSectionIcon(section.title);
                    const anchor = slugify(section.title);
                    return (
                      <section key={section.title} className="rounded-lg sm:rounded-xl bg-slate-900/50 border border-slate-700/60 p-3 sm:p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon size={14} className="text-cyan-300 sm:w-4 sm:h-4" />
                          <h4 id={anchor} className="text-xs sm:text-sm font-semibold text-slate-100">
                            {section.title}
                          </h4>
                          <a href={`#${anchor}`} className="text-slate-500 hover:text-slate-300" aria-label={`Ancla ${section.title}`}>
                            <Link size={12} />
                          </a>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                          {renderMarkdownContent(section.content)}
                        </div>
                      </section>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-4 text-xs sm:text-sm text-slate-400">
                  Pendiente
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
