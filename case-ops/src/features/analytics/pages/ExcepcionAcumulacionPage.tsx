import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

const SUBNAV_ITEMS = [
  { label: 'Resumen', href: '#resumen' },
  { label: 'Base legal', href: '#base-legal' },
  { label: 'Riesgos', href: '#riesgos' },
  { label: 'Estrategia oral', href: '#estrategia-oral' },
  { label: 'Escenarios', href: '#escenarios' },
  { label: 'Checklist', href: '#checklist' },
  { label: 'Anexos/Pruebas', href: '#anexos' },
];

const LEGAL_CHIPS = ['416.1.4 LEC', '250.1.16 LEC', '73.1.2ª LEC', '73.2 LEC', '249.2 LEC'];

const TEXT_GUION_90 = `Señoría, en este trámite de Audiencia Previa, al amparo del artículo 416.1.4ª LEC, interesamos la depuración del procedimiento porque la demanda acumula dos bloques de naturaleza y cauce incompatibles.

La acción de división de cosa común debe tramitarse por juicio verbal especial por razón de la materia conforme al artículo 250.1.16 LEC. Sin embargo, la reclamación económica / reembolso por pagos y periodos se corresponde con el juicio ordinario por cuantía del artículo 249.2 LEC.

Esa mezcla infringe el artículo 73.1.2ª LEC, que impide la acumulación cuando las acciones deban ventilarse en procedimientos de diferente tipo. Y no es aplicable la absorción del artículo 73.2 LEC, porque aquí el juicio verbal no viene impuesto por cuantía, sino por materia (art. 250.1.16 LEC).

Además, la acumulación no es inocua: la complejidad contable de la reclamación económica está bloqueando la resolución de la división de cosa común, que el legislador ha configurado como verbal especial por materia para dotarla de agilidad. Tras casi dos años de tramitación y sucesivos aplazamientos, la acción divisoria ha quedado subordinada a un debate económico que la desnaturaliza.

Y esta depuración no es una cuestión de conveniencia de parte: en Audiencia Previa corresponde al tribunal asegurar la adecuación del cauce y la regularidad del proceso.

Por ello, con carácter principal, solicitamos que se declare la inadecuación del procedimiento por indebida acumulación de acciones de cauce incompatible, acordando la separación o reconducción procedente.

Y subsidiariamente, para el caso de mantenerse la acumulación, pedimos saneamiento estricto del objeto para evitar indefensión: fijación de hechos controvertidos por bloques A (división) y B (reclamación económica), admisión de prueba vinculada a cada bloque y cuantificación separada por periodos, excluyendo lo impertinente. Esta audiencia existe precisamente para depurar y fijar el objeto litigioso.`;

const TEXT_GUION_30 = `Señoría, solicitamos depuración en Audiencia Previa (art. 416.1.4ª LEC) porque se acumulan acciones de cauce incompatible: división de cosa común por verbal especial de materia (art. 250.1.16 LEC) y reclamación económica por ordinario (art. 249.2 LEC), infringiendo el art. 73.1.2ª LEC. No opera la absorción del 73.2 LEC al ser verbal por materia. Principalmente pedimos separación/reconducción; subsidiariamente, saneamiento del objeto por bloques A/B y prueba estrictamente vinculada.`;

const PETICION_PRINCIPAL = `Que, al amparo del art. 416.1.4ª LEC, se declare la inadecuación del procedimiento por indebida acumulación de acciones de cauce incompatible, por corresponder la división de cosa común al juicio verbal del art. 250.1.16 LEC y la reclamación económica al juicio ordinario del art. 249.2 LEC, en infracción del art. 73.1.2ª LEC, acordando la separación o reconducción procedente, apreciable incluso de oficio por el tribunal en este trámite de Audiencia Previa, al afectar a la correcta constitución y tramitación del procedimiento.`;
const PETICION_SUBSIDIARIA_1 = `Subsidiariamente, que se acuerde el saneamiento del objeto litigioso: delimitación expresa por bloques A/B de hechos controvertidos, prueba y cuantificación (hechos–prueba–cuantías por periodos), excluyendo lo impertinente, para evitar indefensión.`;
const PETICION_SUBSIDIARIA_2 = `Que la admisión de prueba se realice por bloques, exigiendo para cada medio de prueba su conexión directa con el bloque A (división) o el bloque B (reclamación económica), rechazando lo genérico o no vinculado.`;
const PETICIONES_TODAS = `Principal\n${PETICION_PRINCIPAL}\n\nSubsidiaria 1 (saneamiento del objeto)\n${PETICION_SUBSIDIARIA_1}\n\nSubsidiaria 2 (prueba por bloques)\n${PETICION_SUBSIDIARIA_2}`;

const TEXT_PROTESTA = `Para el supuesto de que no se estime la depuración solicitada (inadecuación/indebida acumulación) o no se acuerde separación estricta por bloques A/B, esta parte formula expresa PROTESTA y solicita que conste en acta, a los efectos del art. 446 LEC y de los recursos procedentes.`;

const REPLICAS = `No se pide un privilegio ni un ‘truco’: se pide depuración para evitar indefensión y garantizar contradicción. Si el tribunal no entra a estimar la excepción por preclusión, debe, como mínimo, ordenar el objeto por bloques A/B (hechos–prueba–cuantificación) y excluir lo impertinente.

La economía procesal no habilita a mezclar cauces imperativos. Si se mantiene la acumulación, se impone saneamiento estricto: periodos, cuantías y prueba por bloques, con pertinencia controlada.`;

const TEXT_JURISPRUDENCIA = `- STS 79/2015, 27/02/2015 (ECLI: ES:TS:2015:79) — Inadecuación por materia = orden público; apreciable de oficio aunque no se alegue.
- AAP Tarragona, Secc. 3ª, Auto 185/2024 (23/05/2024) — Control en AP incluso tras admisión; apoyo en arts. 419 y 425 LEC.
- SAP Baleares, Secc. 3ª, 18/09/2018 (ROJ SAP IB 1884/2018) — Examen judicial en AP aunque no se detectara en admisión.
- SAP A Coruña, Secc. 5ª, 11/06/2009 (ROJ SAP C 1749/2009) — Art. 416 no es lista cerrada; art. 425 permite resolver cuestiones análogas.`;

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
    >
      {copied ? 'Copiado ✓' : label}
    </button>
  );
}

export function ExcepcionAcumulacionPage() {
  const navigate = useNavigate();
  const { caseId = 'CAS001' } = useParams<{ caseId: string }>();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || `/cases/${caseId}?tab=estrategia`;
  const normalizedCaseId = caseId.toLowerCase();
  const isPicassent = normalizedCaseId.includes('picassent') || caseId === 'CAS001';

  const scenarioCards = useMemo(
    () => [
      {
        title: 'Escenario 1 — “Admite la excepción (rompe la acumulación)”',
        resultado:
          'Resultado esperado: el procedimiento continúa solo con la acción admitida; la otra se canaliza aparte.',
        pedir: 'Qué pides inmediatamente: calendario procesal y delimitación del bloque que sigue.',
      },
      {
        title: 'Escenario 2 — “No la admite por preclusión (no se alegó en contestación)”',
        resultado: 'Plan B: reconducir a ordenación del objeto: inadecuación/defecto legal/claridad + fijación por bloques.',
        pedir:
          'Objetivo real: que el juicio no sea un “cajón desastre”. Petición inmediata: ordenar bloques A/B + pertinencia estricta. Si no lo estima: formular PROTESTA y pedir que conste en acta (art. 446 LEC).',
      },
      {
        title: 'Escenario 3 — “Dice que la acumulación es correcta”',
        resultado:
          'Plan B reforzado: separación funcional total dentro del mismo pleito (hechos–prueba–cuantías por bloques) + exclusión de hechos impertinentes.',
        pedir:
          'Insistir en control del objeto y prueba estrictamente vinculada. Repetir cortafuegos 73.2 (no aplica por materia). Si no lo estima: formular PROTESTA y pedir que conste en acta (art. 446 LEC).',
      },
      {
        title: 'Escenario 4 — “Solución intermedia del juez”',
        resultado:
          'Mantiene el pleito, pero ordena: recorte del objeto, concreción de periodos y cuantías, admisión de prueba solo si enlaza con un bloque concreto.',
        pedir: 'Concretar medidas de separación y calendario de trabajo.',
      },
    ],
    []
  );

  const scrollToSala = () => {
    document.getElementById('sala')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <AnalyticsLayout
      title="Excepción procesal: acumulación indebida / objeto híbrido"
      subtitle="Estrategia operativa para audiencia previa"
      actions={
        <button
          type="button"
          onClick={() => navigate(returnTo)}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          VOLVER AL CASO
        </button>
      }
    >
      {!isPicassent ? (
        <SectionCard title="Excepción procesal" subtitle="Estado del caso">
          <div className="space-y-4 text-sm text-slate-300">
            <p>Contenido todavía no preparado para este caso.</p>
            {returnToParam && (
              <button
                type="button"
                onClick={() => navigate(returnTo)}
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
              >
                Volver al Caso
              </button>
            )}
          </div>
        </SectionCard>
      ) : (
        <div className="space-y-6">
          <SectionCard title="Excepción procesal / Saneamiento: objeto híbrido por acumulación de acciones (división de cosa común + reclamación económica)">
            <div className="flex flex-wrap gap-2">
              {['PICASSENT · P.O. 715/2024', 'Audiencia previa', 'Objetivo: ordenar el objeto', '4 escenarios'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-300">
              Solicitamos al tribunal que controle el objeto litigioso y evite la mezcla de debates y cuantificaciones, garantizando el derecho de defensa: (i) declarando la inadecuación del procedimiento por acumulación de cauces incompatibles; o, subsidiariamente, (ii) saneando el objeto por bloques A/B (hechos–prueba–cuantificación).
            </p>
          </SectionCard>

          <div className="sticky top-3 z-20 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {LEGAL_CHIPS.map((chip) => (
                  <span key={chip} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <CopyButton text={TEXT_GUION_90} label="Copiar Guion 90s" />
                <CopyButton text={PETICION_PRINCIPAL} label="Copiar Petición Principal" />
                <CopyButton text={REPLICAS} label="Copiar Réplicas" />
              </div>
            </div>
          </div>

          <div id="sala" className="grid gap-4 sm:gap-6 xl:grid-cols-12 scroll-mt-24">
            <div className="space-y-4 sm:space-y-6 xl:col-span-7">
              <SectionCard title="SALA · Guion 90 segundos" subtitle="Lectura directa, sin improvisar">
                <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                  {TEXT_GUION_90.split('\n\n').map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <CopyButton text={TEXT_GUION_90} label="Copiar" />
                </div>
              </SectionCard>

              <SectionCard title="Peticiones (escalonadas)">
                <div className="space-y-3 text-sm text-slate-200">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-white">Principal</div>
                    <p className="mt-2 text-sm text-slate-300">{PETICION_PRINCIPAL}</p>
                    <div className="mt-3">
                      <CopyButton text={PETICION_PRINCIPAL} label="Copiar" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-white">Subsidiaria 1 (saneamiento del objeto)</div>
                    <p className="mt-2 text-sm text-slate-300">{PETICION_SUBSIDIARIA_1}</p>
                    <div className="mt-3">
                      <CopyButton text={PETICION_SUBSIDIARIA_1} label="Copiar" />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-sm font-semibold text-white">Subsidiaria 2 (prueba por bloques)</div>
                    <p className="mt-2 text-sm text-slate-300">{PETICION_SUBSIDIARIA_2}</p>
                    <div className="mt-3">
                      <CopyButton text={PETICION_SUBSIDIARIA_2} label="Copiar" />
                    </div>
                  </div>
                  <CopyButton text={PETICIONES_TODAS} label="Copiar todo" />
                </div>
              </SectionCard>

              <SectionCard title="PROTESTA (para acta y recursos)">
                <div className="space-y-4 text-sm text-slate-200">
                  <p className="text-slate-300">{TEXT_PROTESTA}</p>
                  <CopyButton text={TEXT_PROTESTA} label="Copiar protesta" />
                </div>
              </SectionCard>
            </div>

            <div className="space-y-4 sm:space-y-6 xl:col-span-5">
              <SectionCard title="SALA · Guion 30 segundos">
                <div className="space-y-4 text-sm text-slate-200">
                  <p>{TEXT_GUION_30}</p>
                  <CopyButton text={TEXT_GUION_30} label="Copiar" />
                </div>
              </SectionCard>

              <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5">
                <h3 className="text-lg font-semibold text-white">Higiene (no dispararse al pie)</h3>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-amber-100">
                  <li>En sala NO decir ‘Ley 8/2021’. Decir: ‘vigente art. 250.1.16 LEC’. Si preguntan: ‘RDL 6/2023’.</li>
                  <li>No anclar el argumento en el art. 422 LEC. El ancla es 416.1.4ª LEC (depuración/inadecuación).</li>
                  <li>No citar sentencias sin ECLI/ROJ verificable en tu repositorio.</li>
                  <li>Si el juez menciona ‘absorción’ (73.2), responder: ‘absorción solo por cuantía; aquí verbal por materia (250.1.16)’.</li>
                </ul>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2">
            {SUBNAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs font-semibold text-slate-300 hover:border-emerald-500/60 hover:text-emerald-200"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="grid gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4 sm:space-y-6">
              <div id="resumen" className="scroll-mt-24">
                <SectionCard title="Resumen operativo" subtitle="Qué se pide exactamente">
                  <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-300">
                    <li>
                      1) Que se declare la inadecuación del procedimiento por acumulación de cauces incompatibles (416.1.4, 250.1.16, 73.1.2ª y 249.2 LEC), sin absorción por 73.2.
                    </li>
                    <li>2) Subsidiariamente: saneamiento por bloques A/B (hechos–prueba–cuantificación), excluyendo lo impertinente.</li>
                    <li>3) Admisión y control de prueba por bloques, con conexión directa a cada bloque.</li>
                  </ol>
                </SectionCard>
              </div>

              <div id="base-legal" className="scroll-mt-24">
                <SectionCard title="Base legal (anclaje exacto)">
                  <div className="space-y-3 text-sm text-slate-200">
                    {[
                      {
                        chip: '416.1.4ª LEC',
                        title: 'Inadecuación del procedimiento (AP)',
                        text: 'Permite pedir depuración del cauce cuando la demanda conduce a un procedimiento no idóneo.',
                      },
                      {
                        chip: '250.1.16 LEC',
                        title: 'División de cosa común → verbal por materia',
                        text: 'Impone juicio verbal especial por razón de la materia, no disponible por las partes.',
                      },
                      {
                        chip: '249.2 LEC',
                        title: 'Reclamación económica → ordinario por cuantía',
                        text: 'Canaliza reclamaciones de cantidad por el cauce ordinario cuando proceda por cuantía/materia.',
                      },
                      {
                        chip: '73.1.2ª LEC',
                        title: 'Prohibición de acumular cauces distintos',
                        text: 'Impide acumular acciones que deban ventilarse en procedimientos de diferente tipo.',
                      },
                      {
                        chip: '73.2 LEC',
                        title: 'Absorción (solo por cuantía)',
                        text: 'Si el verbal fuera por cuantía podría absorber; no aplica cuando el verbal es por materia (250.1.16).',
                      },
                    ].map((item) => (
                      <div key={item.chip} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                          {item.chip}
                        </span>
                        <h3 className="mt-2 text-base font-semibold text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-300">{item.text}</p>
                      </div>
                    ))}
                    <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4">
                      <h3 className="text-base font-semibold text-sky-100">Control judicial de oficio</h3>
                      <div className="mt-2 space-y-2 text-sm text-sky-50/90">
                        <p>
                          La indebida acumulación que afecta al cauce procesal no es una mera cuestión dispositiva entre partes, sino un problema de correcta constitución y prosecución del procedimiento.
                        </p>
                        <p>
                          En la Audiencia Previa el tribunal no solo resuelve lo alegado, sino que debe velar por la adecuación del procedimiento y la regularidad del proceso (arts. 416 y ss. LEC).
                        </p>
                        <p>
                          Cuando la acumulación determina la tramitación por un cauce no idóneo o impide el correcto enjuiciamiento, el tribunal puede apreciarlo incluso de oficio en este trámite, al afectar a la estructura del proceso y a la tutela judicial efectiva.
                        </p>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              <div id="riesgos" className="scroll-mt-24">
                <SectionCard title="Riesgos" subtitle="Objeciones previsibles y réplica útil">
                  <div className="space-y-4 text-sm text-slate-200">
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                      <h3 className="text-sm font-semibold text-rose-100">Objeción: ‘No lo alegaste en contestación’</h3>
                      <p className="mt-2 text-sm text-rose-50/90">
                        No se pide un privilegio ni un ‘truco’: se pide depuración para evitar indefensión y garantizar contradicción. Si el tribunal no entra a estimar la excepción por preclusión, debe, como mínimo, ordenar el objeto por bloques A/B (hechos–prueba–cuantificación) y excluir lo impertinente.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
                      <h3 className="text-sm font-semibold text-rose-100">Objeción: ‘La acumulación es correcta / economía procesal’</h3>
                      <p className="mt-2 text-sm text-rose-50/90">
                        La economía procesal no habilita a mezclar cauces imperativos. Si se mantiene la acumulación, se impone saneamiento estricto: periodos, cuantías y prueba por bloques, con pertinencia controlada.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <h3 className="text-base font-semibold text-white">Jurisprudencia relevante (control en Audiencia Previa)</h3>
                      <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                        <li>STS 79/2015, 27/02/2015 (ECLI: ES:TS:2015:79) — Inadecuación por materia = orden público; apreciable de oficio aunque no se alegue.</li>
                        <li>AAP Tarragona, Secc. 3ª, Auto 185/2024 (23/05/2024) — Control en AP incluso tras admisión; apoyo en arts. 419 y 425 LEC.</li>
                        <li>SAP Baleares, Secc. 3ª, 18/09/2018 (ROJ SAP IB 1884/2018) — Examen judicial en AP aunque no se detectara en admisión.</li>
                        <li>SAP A Coruña, Secc. 5ª, 11/06/2009 (ROJ SAP C 1749/2009) — Art. 416 no es lista cerrada; art. 425 permite resolver cuestiones análogas.</li>
                      </ul>
                      <div className="mt-3">
                        <CopyButton text={TEXT_JURISPRUDENCIA} label="Copiar jurisprudencia" />
                      </div>
                    </div>
                  </div>
                </SectionCard>
              </div>

              <div className="scroll-mt-24">
                <SectionCard title="Dilación estructural y secuestro de la acción de división">
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>La acumulación no es neutra.</p>
                    <p>
                      La acción de división de cosa común, configurada por el legislador como juicio verbal especial por razón de la materia (art. 250.1.16 LEC), responde a una finalidad de agilidad y desbloqueo de situaciones de copropiedad.
                    </p>
                    <p>
                      Sin embargo, la acumulación con una reclamación económica de carácter contable y plurianual ha generado una dilación estructural del procedimiento, con múltiples aplazamientos y una prolongación temporal incompatible con la finalidad propia de la acción divisoria.
                    </p>
                    <p>
                      La complejidad probatoria y cuantificadora del bloque de reembolso está absorbiendo y retrasando la resolución de la división, convirtiendo el proceso en un litigio híbrido que frustra la naturaleza ágil que el legislador quiso imprimir a este tipo de acciones.
                    </p>
                    <p>
                      Esta situación no es una mera cuestión estratégica entre partes, sino un efecto procesal objetivo que el tribunal debe valorar al ejercer su función de ordenación y depuración.
                    </p>
                  </div>
                </SectionCard>
              </div>

              <div id="estrategia-oral" className="scroll-mt-24">
                <SectionCard title="Guion 90 segundos (copiable)">
                  <div className="space-y-3 text-sm text-slate-300">
                    <p>Para evitar duplicidades de lectura, usa el bloque superior SALA como fuente única del guion.</p>
                    <button
                      type="button"
                      onClick={scrollToSala}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
                    >
                      Ir a SALA
                    </button>
                  </div>
                </SectionCard>
              </div>

              <div id="escenarios" className="scroll-mt-24">
                <SectionCard title="Los 4 escenarios (matriz)" subtitle="Matriz de decisión rápida">
                  <div className="grid gap-4 md:grid-cols-2">
                    {scenarioCards.map((scenario) => (
                      <div
                        key={scenario.title}
                        className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200"
                      >
                        <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>
                        <p className="mt-2 text-xs text-slate-300">{scenario.resultado}</p>
                        <p className="mt-2 text-xs text-emerald-200">{scenario.pedir}</p>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>

              <div id="checklist" className="scroll-mt-24">
                <SectionCard title="Checklist (para preparar audiencia previa)">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                    <li>Identificar el bloque A (división): hechos estrictos de copropiedad y necesidad de división.</li>
                    <li>Identificar el bloque B (deuda): hechos de pagos, periodos, cuantificación, títulos de imputación.</li>
                    <li>Lista de hechos controvertidos por bloque (máximo 10 por bloque).</li>
                    <li>Prueba propuesta por bloque (documental/pericial/testifical) con “para qué” concreto.</li>
                    <li>Petición final escalonada: principal (inadmisión acumulación) + subsidiaria (saneamiento por bloques).</li>
                    <li>Preparar Réplicas (preclusión / absorción 73.2 / economía procesal).</li>
                    <li>Llevar impreso Guion 90s + Petición Principal.</li>
                  </ul>
                </SectionCard>
              </div>

              <div id="anexos" className="scroll-mt-24">
                <SectionCard title="Anexos / Pruebas">
                  <div className="space-y-3 text-sm text-slate-200">
                    <p>A1. Índice de documentos que acreditan copropiedad y objeto de división.</p>
                    <p>A2. Cuadro de pagos/periodos para la reclamación económica.</p>
                    <p>A3. Esquema “hecho → prueba → cuantía” por bloque.</p>
                  </div>
                </SectionCard>
              </div>
            </div>

            <div className="space-y-4">
              <SectionCard title="Resumen que se pueda leer en sala" className="sticky top-24">
                <div className="space-y-3 text-sm text-slate-300">
                  <p>Fuente única: SALA · Guion 90 segundos.</p>
                  <button
                    type="button"
                    onClick={scrollToSala}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
                  >
                    Ir a SALA
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}
    </AnalyticsLayout>
  );
}
