import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { prescripcionPicassent } from '../../../content/prescripcion/picassent';
import { CopyButton } from './CopyButton';
import { CronologiaMatrix } from './CronologiaMatrix';
import { DistinguishingSection } from './DistinguishingSection';
import { ErroresFatalesSection } from './ErroresFatalesSection';
import { HypothesisToggle } from './HypothesisToggle';
import { MarcoNormativoSection } from './MarcoNormativoSection';
import { ScenarioCard } from './ScenarioCard';
import { StickyTOC } from './StickyTOC';
import { TablaPartidasSection } from './TablaPartidasSection';

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

export function PrescripcionPlaybookPage({ returnTo }: PrescripcionPlaybookPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const content = prescripcionPicassent;
  const defaultHypothesis = searchParams.get('hyp') === 'H2' ? 'H2' : 'H1';
  const [hypothesis, setHypothesis] = useState<'H1' | 'H2'>(defaultHypothesis);

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
    <div className="relative space-y-6">
      {copiedText && (
        <div className="fixed top-4 right-4 z-50 max-w-[calc(100vw-2rem)] rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-white shadow-lg animate-pulse sm:px-4 sm:text-sm">
          Copiado al portapapeles
        </div>
      )}

      <section className="rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-slate-900/60 p-4 sm:p-6 text-slate-100 shadow-sm print-card">
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
              onClick={() => window.print()}
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
            <p className="mt-3 text-sm text-slate-100/90">{content.resumen.intro}</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-100/90">
              {content.resumen.puntos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="mt-4 text-sm font-semibold text-slate-100">{content.resumen.riesgoIntro}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-100/90">
              {content.resumen.riesgos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm font-semibold text-slate-100">{content.resumen.solucionIntro}</p>
            <p className="mt-2 text-sm text-slate-100/90">{content.resumen.solucion}</p>
          </section>

          <MarcoNormativoSection
            id="marco-normativo"
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

          <section id="peticion-prioritaria" className="relative scroll-mt-24">
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-6 text-sm text-amber-100 shadow-sm md:sticky md:top-6 print-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-white">{content.peticionPrioritaria.title}</h2>
                  <p className="text-sm text-amber-100/90">{content.peticionPrioritaria.subtitle}</p>
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
          </section>

          <TablaPartidasSection
            id="tabla-partidas"
            title="Tabla verificable por partidas (A/B/C)"
            subtitle="Fuente única: seed DB Picassent. Completar con documento/base/exigibilidad cuando se acrediten."
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
                <li key={item}>{item}</li>
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
                label="Copiar antídoto"
                onCopied={handleCopied}
              />
            </div>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-300">
              {content.comoTeLaIntentanColar.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm font-semibold text-emerald-200">{content.comoTeLaIntentanColar.antidoto}</p>
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

          <DistinguishingSection
            id="distinguishing"
            title={content.distinguishing.title}
            subtitle={content.distinguishing.subtitle}
            intro={content.distinguishing.intro}
            activeHypothesis={hypothesis}
            returnTo={returnTo}
            onCopied={handleCopied}
          />

          <section id="selector-escenarios" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">{content.escenarios.title}</h2>
                <p className="mt-1 text-sm text-slate-400">{content.escenarios.subtitle}</p>
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
          </section>

          <section id="plan-a" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">{content.planA.title}</h2>
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
          </section>

          <section id="plan-b" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-white">{content.planB.title}</h2>
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
          </section>

          <section id="guion-2-min" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">{content.guion.title}</h2>
              <CopyButton
                text={[content.guion.title, '', content.guion.text].join('\n')}
                label="Copiar guion"
                onCopied={handleCopied}
              />
            </div>
            <p className="mt-3 text-sm break-words text-slate-300">{content.guion.text}</p>
          </section>

          <section id="checklist-24-72" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-white">{content.checklist.title}</h2>
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
          </section>

          <section id="plantillas" className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">{content.plantillas.title}</h2>
              </div>
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
                <h3 className="text-sm font-semibold text-slate-200">{content.plantillas.tablaTitle}</h3>
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
                <h3 className="text-sm font-semibold text-slate-200">{content.plantillas.peticionesTitle}</h3>
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
          </section>

          <ErroresFatalesSection
            id="errores-fatales"
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
