import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Scale,
  ClipboardList,
  Mic,
  Target,
  Crosshair,
} from 'lucide-react';
import { prescripcionPicassent } from '../../../content/prescripcion/picassent';
import { CollapsibleSection } from './CollapsibleSection';
import { CopyButton } from './CopyButton';
import { CronologiaMatrix } from './CronologiaMatrix';
import { DistinguishingSection } from './DistinguishingSection';
import { ErroresFatalesSection } from './ErroresFatalesSection';
import { HypothesisToggle } from './HypothesisToggle';
import { MarcoNormativoSection } from './MarcoNormativoSection';
import { LegalReferenceText } from './LegalReferenceText';
import { ScenarioCard } from './ScenarioCard';
import { StickyTOC } from './StickyTOC';
import { TablaPartidasSection } from './TablaPartidasSection';
import { APStackSection } from './APStackSection';
import { AP_STACK_ITEMS } from './apStack';
import { printElementAsDocument } from '../../../utils/printDocument';

interface PrescripcionPlaybookPageProps {
  returnTo: string;
}

const formatMarcoNormativo = (items: typeof prescripcionPicassent.marcoNormativo.items) =>
  items.map((item) => `- ${item.norma}: ${item.texto} | uso: ${item.uso}`).join('\n');

const formatCronologia = (tramos: typeof prescripcionPicassent.cronologiaPrescripcion.tramos) =>
  tramos
    .map((tramo) =>
      [
        `- ${tramo.rango}: ${tramo.descripcion}`,
        `  H1: ${tramo.estadoH1}`,
        `  H2: ${tramo.estadoH2}`,
        tramo.nota ? `  Nota: ${tramo.nota}` : null,
      ]
        .filter(Boolean)
        .join('\n')
    )
    .join('\n');

const formatErrores = (items: typeof prescripcionPicassent.erroresFatales.items) =>
  items
    .map((item) =>
      [
        `- ${item.title ?? 'Error'}`,
        `  MAL: ${item.mal}`,
        `  BIEN: ${item.bien}`,
      ].join('\n')
    )
    .join('\n');

const salaTemplates = {
  principal:
    'Con carácter previo, y a efectos de depuración del objeto del proceso, se interesa que la parte actora individualice la pretensión mediante relación por partidas o bloques homogéneos, indicando para cada una: fecha o periodo, concepto, cuantía exacta, base jurídica (acción ejercitada), momento de exigibilidad y dies a quo con motivación, así como el documento soporte. Sin dicha individualización, la pretensión queda reducida a una narrativa global que impide contradicción efectiva y control de prescripción.',
  carga:
    'Se interesa que se fijen como hechos controvertidos, por cada partida o bloque, (i) la existencia del pago, (ii) su cuantía, (iii) la razón jurídica del eventual reintegro, (iv) la exigibilidad y el dies a quo, y (v) la interrupción, si se invoca; con expresa atribución de la carga probatoria a quien sostiene el hecho constitutivo.',
  interrupcion:
    'Para el caso de que la actora alegue interrupción, se interesa su concreción y acreditación: acto interruptivo concreto, fecha, contenido, destinatario y soporte fehaciente, a fin de permitir la contradicción y su valoración jurídica.',
  cierre:
    'La cuestión exige identificar acción aplicable, exigibilidad, dies a quo, prueba por partidas y, en su caso, interrupción acreditada. Sin ello no existe crédito verificable.',
};

export function PrescripcionPlaybookPage({ returnTo }: PrescripcionPlaybookPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const content = prescripcionPicassent;
  const defaultHypothesis = searchParams.get('hyp') === 'H2' ? 'H2' : 'H1';
  const [hypothesis, setHypothesis] = useState<'H1' | 'H2'>(defaultHypothesis);
  const [expandAllCards, setExpandAllCards] = useState(false);
  const [printingInProgress, setPrintingInProgress] = useState(false);
  const printContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHypothesis(defaultHypothesis);
  }, [defaultHypothesis]);

  const metaBadges = useMemo(
    () => [
      content.meta.caseCode,
      content.meta.status,
      `Cuantía ${content.meta.cuantia}`,
      `AP ${content.meta.audienciaPrevia}`,
      content.meta.version,
      `Hipótesis ${hypothesis}`,
    ],
    [content.meta, hypothesis]
  );

  const forceExpandedView = expandAllCards || printingInProgress;

  const handlePrint = async () => {
    setPrintingInProgress(true);
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    try {
      if (printContainerRef.current) {
        await printElementAsDocument({
          element: printContainerRef.current,
          title: `${content.meta.caseCode} · Prescripción`,
        });
      } else {
        window.print();
      }
    } finally {
      setPrintingInProgress(false);
    }
  };

  const handleCopied = (text: string) => {
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleHypothesisChange = (value: 'H1' | 'H2') => {
    setHypothesis(value);
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('hyp', value);
    setSearchParams(nextParams, { replace: true });
  };

  const scrollToGuion = () => {
    const target = document.getElementById('guion-2-min');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={printContainerRef} className="relative space-y-6">
      {copiedText && (
        <div className="fixed top-4 right-4 z-50 max-w-[calc(100vw-2rem)] rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-lg animate-pulse sm:px-4 sm:text-sm">
          Copiado al portapapeles
        </div>
      )}

      {/* ───── CABECERA (siempre visible) ───── */}
      <section className="sticky top-3 z-20 rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-slate-900/95 p-4 sm:p-6 text-slate-100 shadow-sm print-card">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div>
              <p className="break-words text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                {content.meta.tags.join(' · ')}
              </p>
              <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{content.hero.title}</h1>
              <p className="text-sm text-slate-300">{content.hero.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {metaBadges.map((item) => (
                <span
                  key={item}
                  className="max-w-full rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-center text-xs font-semibold text-slate-200 break-words"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={returnTo}
              className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-white/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]"
            >
              Volver
            </Link>
            <button
              type="button"
              onClick={() => setExpandAllCards((value) => !value)}
              className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-200 transition hover:border-sky-400/70 hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]"
            >
              {expandAllCards ? 'Contraer menús' : 'Expandir menús'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-200 transition hover:border-emerald-400/70 hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]"
            >
              Imprimir / PDF
            </button>
          </div>
        </div>
        <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p className="font-semibold">{content.hero.metaReal}</p>
          <p className="mt-2 text-emerald-100/80">{content.hero.metaRealNote}</p>
        </div>
      </section>

      <APStackSection onCopied={handleCopied} />

      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-slate-100 print-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Peticiones prioritarias (P0)</h2>
          <CopyButton
            text={[
              'Peticiones prioritarias (P0)',
              ...AP_STACK_ITEMS[0].pedir.map((entry, index) => `${index + 1}) ${entry}`),
            ].join('\n')}
            label="Copiar peticiones"
            onCopied={handleCopied}
          />
        </div>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-emerald-100/95">
          {AP_STACK_ITEMS[0].pedir.map((entry) => (
            <li key={entry}><LegalReferenceText text={entry} /></li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-100 print-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Anti-STS 458/2025</h2>
          <a
            href="/docs/STS_458_2025.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-indigo-400/50 px-3 py-1 text-xs font-semibold text-indigo-100"
            title="STS 458/2025: desplazamiento del dies a quo en supuestos concretos; exige identidad de presupuesto y prueba."
          >
            Abrir STS 458/2025
          </a>
        </div>
        <p className="mt-2 text-sm text-slate-300">
          La STS 458/2025 solo puede operar con delimitación fáctica estricta y resolución por bloques homogéneos. No
          autoriza, por sí sola, la reconstrucción global de periodos extensos sin prueba detallada ni desplaza de forma
          automática el régimen general de prescripción.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {AP_STACK_ITEMS.filter((item) => ['P3', 'P4', 'P5', 'P6', 'P7'].includes(item.id)).map((item) => (
            <details key={item.id} open={forceExpandedView} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-3">
              <summary className="cursor-pointer text-sm font-semibold text-white">{item.id} — {item.title}</summary>
              <p className="mt-2 text-xs text-slate-300"><LegalReferenceText text={item.tesis} /></p>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-100 print-card">
        <h2 className="text-base font-semibold text-white">Jurisprudencia y normativa</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
          <li><LegalReferenceText text="STS 458/2025" /></li>
          <li><LegalReferenceText text="Art. 217 LEC" /></li>
          <li><LegalReferenceText text="Art. 1969 CC" /></li>
          <li><LegalReferenceText text="Art. 1964.2 CC" /></li>
          <li><LegalReferenceText text="Art. 1973 CC" /></li>
          <li><a href="/docs/prescripcion_cas001.pdf" target="_blank" rel="noopener noreferrer" className="text-emerald-300 underline">PDF completo de prescripción (CAS001)</a></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 text-sm text-slate-100 print-card">
        <h2 className="text-base font-semibold text-white">Modo sala — guiones automáticos</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {[
            {
              name: '60s',
              items: ['P0', 'P1'],
            },
            {
              name: '2m',
              items: ['P0', 'P1', 'P2', 'P3'],
            },
            {
              name: '5m',
              items: ['P0', 'P1', 'P2', 'P3', 'P4'],
            },
          ].map((script) => {
            const selected = AP_STACK_ITEMS.filter((item) => script.items.includes(item.id));
            const scriptText = selected
              .map((item) => `${item.id} — ${item.title}\n${item.fraseSala}`)
              .join('\n\n');
            return (
              <article key={script.name} className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-white">Guion {script.name}</h3>
                  <CopyButton text={scriptText} label="Copiar" onCopied={handleCopied} />
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-300">
                  {selected.map((item) => (
                    <li key={item.id}>{item.id} — {item.title}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="hidden print:block rounded-xl border border-slate-400 p-4 text-black bg-white">
        <h2 className="text-lg font-semibold">Resumen imprimible AP — CAS001</h2>
        <p className="mt-1 text-sm">Panel rápido + peticiones + guion 2 minutos + ranking de argumentos.</p>
        <h3 className="mt-3 font-semibold">Peticiones prioritarias</h3>
        <ol className="list-decimal pl-5 text-sm">
          {AP_STACK_ITEMS[0].pedir.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ol>
        <h3 className="mt-3 font-semibold">Guion 2 minutos</h3>
        <ul className="list-disc pl-5 text-sm">
          {AP_STACK_ITEMS.filter((item) => ['P0', 'P1', 'P2', 'P3'].includes(item.id)).map((item) => (
            <li key={item.id}>{item.id}: {item.fraseSala}</li>
          ))}
        </ul>
        <h3 className="mt-3 font-semibold">Ranking</h3>
        <ul className="list-disc pl-5 text-sm">
          {AP_STACK_ITEMS.map((item) => (
            <li key={item.id}>{item.id} — {item.title}</li>
          ))}
        </ul>
      </section>

      <footer className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold text-white">Checklist 72h</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Actualizar tabla A/B/C con documentos efectivamente aportados.</li>
              <li>Preparar petición P0 literal y copia inmediata para sala.</li>
              <li>Verificar cómputo de tramos y cortes temporales aplicables.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white">Errores críticos a evitar</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Entrar en fondo sin depurar previamente el objeto litigioso.</li>
              <li>Aceptar un crédito global sin individualización de partidas.</li>
              <li>Admitir extensión automática de STS 458/2025 sin bloques ni motivación.</li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ───── SELECTOR DE HIPÓTESIS (siempre visible) ───── */}
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200 print-card">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Selector de hipótesis</h2>
        <div className="mt-3">
          <HypothesisToggle
            value={hypothesis}
            onChange={handleHypothesisChange}
            hint={
              <p className="text-slate-300">
                458 solo cambia el <span className="font-semibold text-emerald-200">dies a quo</span>; no altera prueba,
                exceso, interrupción ni causa. Esta vista solo reordena prioridades, sin borrar el Plan A.
              </p>
            }
          />
        </div>
      </section>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4 sm:space-y-6 print-surface">
          <section id="panel-rapido" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 sm:p-5 text-sm text-slate-200 print-card">
            <h2 className="text-base font-semibold text-white">{content.panelRapido.title}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              {content.panelRapido.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="resumen-60s" className="scroll-mt-24 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-6 text-sm text-slate-100 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="min-w-0 break-words text-base font-semibold text-white">{content.resumen.title}</h2>
              <CopyButton
                text={[
                  content.resumen.title,
                  '',
                  content.resumen.intro,
                  ...content.resumen.puntos.map((item, index) => `${index + 1}) ${item}`),
                  '',
                  content.resumen.riesgoIntro,
                  ...content.resumen.riesgos.map((item) => `- ${item}`),
                  '',
                  content.resumen.solucionIntro,
                  content.resumen.solucion,
                ].join('\n')}
                label="Copiar resumen"
                onCopied={handleCopied}
              />
            </div>
          <p className="mt-3 text-sm text-slate-100/90"><LegalReferenceText text={content.resumen.intro} /></p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-100/90">
              {content.resumen.puntos.map((item) => (
                <li key={item}><LegalReferenceText text={item} /></li>
              ))}
            </ol>
            <p className="mt-4 text-sm font-semibold text-slate-100">{content.resumen.riesgoIntro}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-100/90">
              {content.resumen.riesgos.map((item) => (
                <li key={item}><LegalReferenceText text={item} /></li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-slate-100">{content.resumen.solucionIntro}</p>
            <p className="mt-2 text-sm text-slate-100/90"><LegalReferenceText text={content.resumen.solucion} /></p>
          </section>

          {/* ═══════ GRUPO 1: RESUMEN Y PREPARACIÓN (abierto por defecto) ═══════ */}
          <CollapsibleSection
            forceOpen={forceExpandedView}
            id="panel-rapido"
            title="Resumen y preparación"
            subtitle="Panel rápido + resumen ejecutivo"
            icon={<Target className="h-5 w-5" />}
            defaultOpen
            variant="highlight"
          >
            <div className="space-y-5">
              {/* Panel de preparación */}
              <div>
                <h3 className="text-sm font-semibold text-white">{content.panelRapido.title}</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {content.panelRapido.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Resumen 60s */}
              <div id="resumen-60s" className="scroll-mt-24 rounded-xl border border-sky-500/30 bg-sky-500/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="min-w-0 break-words text-sm font-semibold text-white">{content.resumen.title}</h3>
                  <CopyButton
                    text={[
                      content.resumen.title,
                      '',
                      content.resumen.intro,
                      ...content.resumen.puntos.map((item, index) => `${index + 1}) ${item}`),
                      '',
                      content.resumen.riesgoIntro,
                      ...content.resumen.riesgos.map((item) => `- ${item}`),
                      '',
                      content.resumen.solucionIntro,
                      content.resumen.solucion,
                    ].join('\n')}
                    label="Copiar resumen"
                    onCopied={handleCopied}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-100/90"><LegalReferenceText text={content.resumen.intro} /></p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-100/90">
                  {content.resumen.puntos.map((item) => (
                    <li key={item}><LegalReferenceText text={item} /></li>
                  ))}
                </ol>
                <p className="mt-4 text-sm font-semibold text-slate-100">{content.resumen.riesgoIntro}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-100/90">
                  {content.resumen.riesgos.map((item) => (
                    <li key={item}><LegalReferenceText text={item} /></li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-semibold text-slate-100">{content.resumen.solucionIntro}</p>
                <p className="mt-2 text-sm text-slate-100/90"><LegalReferenceText text={content.resumen.solucion} /></p>
              </div>
            </div>
          </CollapsibleSection>

          <TablaPartidasSection
            id="tabla-partidas"
            title="Tabla verificable por partidas (A/B/C)"
            subtitle="Fuente: relación interna de partidas (pendiente de soporte documental)."
            onCopied={handleCopied}
          />

          <section id="regla-de-oro" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">{content.reglaDeOro.title}</h2>
              <CopyButton
                text={[
                  content.reglaDeOro.title,
                  ...content.reglaDeOro.bullets.map((item) => `- ${item}`),
                ].join('\n')}
                label="Copiar regla"
                onCopied={handleCopied}
              />
            </div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              {content.reglaDeOro.bullets.map((item) => (
                <li key={item}><LegalReferenceText text={item} /></li>
              ))}
            </ul>
          </section>

          <section id="como-te-la-intentan-colar" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">{content.comoTeLaIntentanColar.title}</h2>
              <CopyButton
                text={[
                  content.comoTeLaIntentanColar.title,
                  ...content.comoTeLaIntentanColar.bullets.map((item, index) => `${index + 1}) ${item}`),
                  '',
                  content.comoTeLaIntentanColar.antidoto,
                ].join('\n')}
                label="Copiar respuesta"
                onCopied={handleCopied}
              />
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
              {content.comoTeLaIntentanColar.bullets.map((item) => (
                <li key={item}><LegalReferenceText text={item} /></li>
              ))}
            </ol>
            <p className="mt-3 text-sm font-semibold text-emerald-200"><LegalReferenceText text={content.comoTeLaIntentanColar.antidoto} /></p>
          </section>

          <section id="resumen-peticiones" className="scroll-mt-24 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-sm text-slate-100 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">Resumen y peticiones (modo sala)</h2>
            </div>
            <div className="mt-4 space-y-4">
              {Object.entries(salaTemplates).map(([key, text]) => (
                <div key={key} className="rounded-xl border border-slate-700/60 bg-slate-900/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">{key}</p>
                    <CopyButton text={text} label="Copiar" onCopied={handleCopied} />
                  </div>
                  <p className="mt-2 text-sm text-slate-200"><LegalReferenceText text={text} /></p>
                </div>
              ))}
            </div>
          </section>

          <CronologiaMatrix
            id="cronologia-prescripcion"
            title={content.cronologiaPrescripcion.title}
            subtitle={content.cronologiaPrescripcion.subtitle}
            tramos={content.cronologiaPrescripcion.tramos}
            activeHypothesis={hypothesis}
            actions={
              <CopyButton
                text={[
                  content.cronologiaPrescripcion.title,
                  '',
                  formatCronologia(content.cronologiaPrescripcion.tramos),
                ].join('\n')}
                label="Copiar cronología"
                onCopied={handleCopied}
              />
            }
          />

          {/* ═══════ GRUPO 3: PETICIÓN PRIORITARIA + REGLAS (abierto por defecto) ═══════ */}
          <CollapsibleSection
            forceOpen={forceExpandedView}
            id="peticion-prioritaria"
            title="Petición prioritaria y reglas de contradicción"
            subtitle="Depuración del objeto + tabla obligatoria"
            icon={<Scale className="h-5 w-5" />}
            defaultOpen
            variant="warning"
          >
            <div className="space-y-5">
              {/* Petición prioritaria */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{content.peticionPrioritaria.title}</h3>
                    <p className="text-xs text-amber-100/80">{content.peticionPrioritaria.subtitle}</p>
                  </div>
                  <CopyButton
                    text={[
                      content.peticionPrioritaria.title,
                      content.peticionPrioritaria.subtitle,
                      '',
                      content.peticionPrioritaria.intro,
                      ...content.peticionPrioritaria.bloques.map((item) => `- ${item}`),
                      '',
                      content.peticionPrioritaria.matrizTitle,
                      ...content.peticionPrioritaria.matriz.map((item, index) => `${index + 1}) ${item}`),
                      '',
                      content.peticionPrioritaria.mantra,
                    ].join('\n')}
                    label="Copiar petición"
                    onCopied={handleCopied}
                  />
                </div>
                <p className="mt-3 text-sm text-amber-100/90">{content.peticionPrioritaria.intro}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-100/90">
                  {content.peticionPrioritaria.bloques.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-semibold text-amber-50">{content.peticionPrioritaria.matrizTitle}</p>
                <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-amber-100/90">
                  {content.peticionPrioritaria.matriz.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <p className="mt-4 text-sm font-semibold text-amber-50">{content.peticionPrioritaria.mantra}</p>
              </div>

              {/* Regla de oro */}
              <div id="regla-de-oro" className="scroll-mt-24">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{content.reglaDeOro.title}</h3>
                  <CopyButton
                    text={[
                      content.reglaDeOro.title,
                      ...content.reglaDeOro.bullets.map((item) => `- ${item}`),
                    ].join('\n')}
                    label="Copiar regla"
                    onCopied={handleCopied}
                  />
                </div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {content.reglaDeOro.bullets.map((item) => (
                    <li key={item}><LegalReferenceText text={item} /></li>
                  ))}
                </ul>
              </div>

              {/* Patrones habituales */}
              <div id="como-te-la-intentan-colar" className="scroll-mt-24">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{content.comoTeLaIntentanColar.title}</h3>
                  <CopyButton
                    text={[
                      content.comoTeLaIntentanColar.title,
                      ...content.comoTeLaIntentanColar.bullets.map((item, index) => `${index + 1}) ${item}`),
                      '',
                      content.comoTeLaIntentanColar.antidoto,
                    ].join('\n')}
                    label="Copiar respuesta"
                    onCopied={handleCopied}
                  />
                </div>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
                  {content.comoTeLaIntentanColar.bullets.map((item) => (
                    <li key={item}><LegalReferenceText text={item} /></li>
                  ))}
                </ol>
                <p className="mt-3 text-sm font-semibold text-emerald-200"><LegalReferenceText text={content.comoTeLaIntentanColar.antidoto} /></p>
              </div>
            </div>
          </CollapsibleSection>

          {/* ═══════ GRUPO 4: ESTRATEGIA Y ESCENARIOS (cerrado por defecto) ═══════ */}
          <CollapsibleSection
            forceOpen={forceExpandedView}
            id="selector-escenarios"
            title="Estrategia y escenarios"
            subtitle="Planes A/B, escenarios de decisión y distinguishing"
            icon={<Crosshair className="h-5 w-5" />}
            badge={hypothesis === 'H1' ? 'Plan A' : 'Plan B'}
          >
            <div className="space-y-5">
              {/* Escenarios */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{content.escenarios.title}</h3>
                    <p className="mt-1 text-xs text-slate-400">{content.escenarios.subtitle}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {content.escenarios.items.map((scenario) => (
                    <ScenarioCard
                      key={scenario.id}
                      title={scenario.title}
                      sostener={scenario.sostener}
                      pedir={scenario.pedir}
                      riesgo={scenario.riesgo}
                      contramedida={scenario.contramedida}
                      onCopied={handleCopied}
                      onScrollToGuion={scrollToGuion}
                    />
                  ))}
                </div>
              </div>

              {/* Plan A */}
              <div id="plan-a" className="scroll-mt-24 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">{content.planA.title}</h3>
                    <span className="inline-flex rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                      {hypothesis === 'H1' ? 'Prioridad actual: Plan A' : 'Plan A (siempre activo)'}
                    </span>
                  </div>
                  <CopyButton
                    text={[
                      content.planA.title,
                      '',
                      content.planA.thesis,
                      '',
                      content.planA.checklistTitle,
                      ...content.planA.checklist.map((item) => `- ${item}`),
                    ].join('\n')}
                    label="Copiar Plan A"
                    onCopied={handleCopied}
                  />
                </div>
                <p className="mt-3 text-sm break-words text-slate-300">{content.planA.thesis}</p>
                <p className="mt-4 text-sm font-semibold text-slate-200">{content.planA.checklistTitle}</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {content.planA.checklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Plan B */}
              <div id="plan-b" className="scroll-mt-24 rounded-xl border border-slate-700/60 bg-slate-900/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">{content.planB.title}</h3>
                    <span className="inline-flex rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">
                      {hypothesis === 'H2' ? 'Carril activo: Plan B' : 'Plan B (subsidiario)'}
                    </span>
                  </div>
                  <CopyButton
                    text={[
                      content.planB.title,
                      '',
                      content.planB.enfoque,
                      '',
                      content.planB.frasesTitle,
                      ...content.planB.frases.map((item) => `- ${item}`),
                      '',
                      content.planB.filtrosTitle,
                      ...content.planB.filtros.map((item) => `- ${item}`),
                    ].join('\n')}
                    label="Copiar Plan B"
                    onCopied={handleCopied}
                  />
                </div>
                <p className="mt-3 text-sm break-words text-slate-300">{content.planB.enfoque}</p>
                <p className="mt-4 text-sm font-semibold text-slate-200">{content.planB.frasesTitle}</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {content.planB.frases.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-sm font-semibold text-slate-200">{content.planB.filtrosTitle}</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                  {content.planB.filtros.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {/* Distinguishing */}
              <DistinguishingSection
                id="distinguishing"
                title={content.distinguishing.title}
                subtitle={content.distinguishing.subtitle}
                intro={content.distinguishing.intro}
                activeHypothesis={hypothesis}
                returnTo={returnTo}
                onCopied={handleCopied}
              />
            </div>
          </CollapsibleSection>

          {/* ═══════ GRUPO 5: ANÁLISIS TÉCNICO (cerrado por defecto) ═══════ */}
          <CollapsibleSection
            forceOpen={forceExpandedView}
            id="marco-normativo"
            title="Análisis técnico"
            subtitle="Marco normativo, cronología y tabla de partidas"
            icon={<BookOpen className="h-5 w-5" />}
          >
            <div className="space-y-5">
              <MarcoNormativoSection
                title={content.marcoNormativo.title}
                subtitle={content.marcoNormativo.subtitle}
                items={content.marcoNormativo.items}
                actions={
                  <CopyButton
                    text={[content.marcoNormativo.title, '', formatMarcoNormativo(content.marcoNormativo.items)].join('\n')}
                    label="Copiar marco"
                    onCopied={handleCopied}
                  />
                }
              />

              <div id="tabla-partidas" className="scroll-mt-24">
                <TablaPartidasSection
                  title="Tabla verificable por partidas (A/B/C)"
                  subtitle="Fuente: relación interna de partidas (pendiente de soporte documental)."
                  onCopied={handleCopied}
                />
              </div>

              <div id="cronologia-prescripcion" className="scroll-mt-24">
                <CronologiaMatrix
                  title={content.cronologiaPrescripcion.title}
                  subtitle={content.cronologiaPrescripcion.subtitle}
                  tramos={content.cronologiaPrescripcion.tramos}
                  activeHypothesis={hypothesis}
                  actions={
                    <CopyButton
                      text={[
                        content.cronologiaPrescripcion.title,
                        '',
                        formatCronologia(content.cronologiaPrescripcion.tramos),
                      ].join('\n')}
                      label="Copiar cronología"
                      onCopied={handleCopied}
                    />
                  }
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* ═══════ GRUPO 6: HERRAMIENTAS Y CHECKLIST (cerrado por defecto) ═══════ */}
          <CollapsibleSection
            forceOpen={forceExpandedView}
            id="checklist-24-72"
            title="Herramientas y checklist"
            subtitle="Checklist pre-audiencia, plantillas y errores a evitar"
            icon={<ClipboardList className="h-5 w-5" />}
          >
            <div className="space-y-5">
              {/* Checklist 24-72h */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{content.checklist.title}</h3>
                  <CopyButton
                    text={[
                      content.checklist.title,
                      ...content.checklist.items.map((item, index) => `${index + 1}) ${item}`),
                    ].join('\n')}
                    label="Copiar checklist"
                    onCopied={handleCopied}
                  />
                </div>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
                  {content.checklist.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>

              {/* Plantillas */}
              <div id="plantillas" className="scroll-mt-24">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-white">{content.plantillas.title}</h3>
                  <CopyButton
                    text={[
                      content.plantillas.title,
                      '',
                      content.plantillas.tablaTitle,
                      content.plantillas.tablaHeaders.join(' | '),
                      content.plantillas.tablaRow.join(' | '),
                      '',
                      content.plantillas.peticionesTitle,
                      ...content.plantillas.peticiones.map((item) => `- ${item}`),
                    ].join('\n')}
                    label="Copiar plantillas"
                    onCopied={handleCopied}
                  />
                </div>
                <div className="mt-4 space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{content.plantillas.tablaTitle}</h4>
                    <div className="mt-3 overflow-x-auto">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="text-[11px] uppercase text-slate-500">
                          <tr>
                            {content.plantillas.tablaHeaders.map((header) => (
                              <th key={header} className="px-2 py-2">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          <tr>
                            {content.plantillas.tablaRow.map((cell) => (
                              <td key={cell} className="px-2 py-2">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{content.plantillas.peticionesTitle}</h4>
                    <div className="mt-2">
                      <CopyButton
                        text={[content.plantillas.peticionesTitle, ...content.plantillas.peticiones.map((item) => `- ${item}`)].join(
                          '\n'
                        )}
                        label="Copiar peticiones"
                        onCopied={handleCopied}
                      />
                    </div>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                      {content.plantillas.peticiones.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Errores fatales */}
              <div id="errores-fatales" className="scroll-mt-24">
                <ErroresFatalesSection
                  title={content.erroresFatales.title}
                  subtitle={content.erroresFatales.subtitle}
                  items={content.erroresFatales.items}
                  actions={
                    <CopyButton
                      text={[content.erroresFatales.title, '', formatErrores(content.erroresFatales.items)].join('\n')}
                      label="Copiar errores"
                      onCopied={handleCopied}
                    />
                  }
                />
              </div>
            </div>
          </CollapsibleSection>

        </div>

        <aside className="sticky top-6 hidden h-max lg:block">
          <StickyTOC items={content.toc} />
        </aside>
      </div>

      <div className="lg:hidden">
        <StickyTOC items={content.toc} />
      </div>
    </div>
  );
}
