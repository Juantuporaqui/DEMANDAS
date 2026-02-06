import { useMemo } from 'react';
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
        resultado: 'Resultado esperado: el procedimiento continúa solo con la acción admitida; la otra se canaliza aparte.',
        pedir: 'Qué pides inmediatamente: calendario procesal y delimitación del bloque que sigue.',
      },
      {
        title: 'Escenario 2 — “No la admite por preclusión (no se alegó en contestación)”',
        resultado: 'Plan B: reconducir a ordenación del objeto: inadecuación/defecto legal/claridad + fijación por bloques.',
        pedir: 'Objetivo real: que el juicio no sea un “cajón desastre”.',
      },
      {
        title: 'Escenario 3 — “Dice que la acumulación es correcta”',
        resultado: 'Plan B reforzado: separación funcional total dentro del mismo pleito (hechos–prueba–cuantías por bloques) + exclusión de hechos impertinentes.',
        pedir: 'Insistir en control del objeto y prueba estrictamente vinculada.',
      },
      {
        title: 'Escenario 4 — “Solución intermedia del juez”',
        resultado: 'Mantiene el pleito, pero ordena: recorte del objeto, concreción de periodos y cuantías, admisión de prueba solo si enlaza con un bloque concreto.',
        pedir: 'Concretar medidas de separación y calendario de trabajo.',
      },
    ],
    []
  );

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
          Volver al Caso
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
              Pedir al tribunal que controle el objeto, evite mezcla de debates y garantice el derecho de defensa, ya sea inadmitiendo la acumulación, limitando el pleito o separando funcionalmente los bloques (hechos–prueba–cuantificación).
            </p>
          </SectionCard>

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
                  <div className="space-y-4 text-sm text-slate-200">
                    <ol className="list-decimal space-y-3 pl-5 text-sm text-slate-300">
                      <li>
                        Que se declare no procedente la acumulación si no cumple requisitos legales (misma clase de juicio, compatibilidad, competencia, etc.).
                      </li>
                    <li>
                      Subsidiariamente: que se acuerde saneamiento del objeto por inadecuación del procedimiento y/o defecto legal por mezcla que genera indefensión, obligando a delimitar: (i) división de cosa común y (ii) reclamación de deuda, con hechos, prueba y cuantías separados.
                    </li>
                    <li>
                      Que, en todo caso, la audiencia previa se use para fijar el objeto y controversia por bloques y admitir prueba igualmente por bloques (A: división, B: deuda).
                    </li>
                    </ol>
                  </div>
                </SectionCard>
              </div>

              <div id="base-legal" className="scroll-mt-24">
                <SectionCard title="Base legal" subtitle="Regla general y momento procesal">
                  <div className="space-y-4 text-sm text-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">2) Regla general: acumulación objetiva de acciones</div>
                    <p className="mt-2 text-sm text-slate-300">
                      La acumulación objetiva exige cumplir requisitos legales: compatibilidad y acumulación permitida conforme a la LEC (arts. 71–73). En particular, cuando el tipo de procedimiento sea distinto o no pueda tramitarse en el mismo cauce, la acumulación no es admisible (regla de “misma clase de juicio” y demás límites).
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-emerald-300">3) Momento procesal y cómo lo resuelve el tribunal</div>
                    <p className="mt-2 text-sm text-slate-300">
                      La audiencia previa existe para depurar cuestiones procesales que impidan sentencia de fondo y para fijar el objeto. Y si hay acumulación en demanda y el demandado se opuso en contestación, el tribunal decide en audiencia previa la admisibilidad de la acumulación.
                    </p>
                    <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                      Nota técnica importante (riesgo): si no se impugnó en contestación, la “vía directa” puede considerarse precluida. Por eso esta página contempla plan principal y plan subsidiario (saneamiento/objeto/indefensión).
                    </div>
                  </div>
                  </div>
                </SectionCard>
              </div>

              <div id="riesgos" className="scroll-mt-24">
                <SectionCard title="Riesgos y cómo los conviertes en ventaja">
                  <div className="space-y-4 text-sm text-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-rose-300">4) Riesgo 1: “No lo alegaste en contestación”</div>
                    <p className="mt-2 text-sm text-slate-300">
                      La LEC concentra la audiencia previa en depurar y ordenar el proceso.
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Aquí no se busca “un truco”, sino evitar indefensión y hacer posible un juicio ordenado: separar hechos y prueba por bloques y exigir determinación clara del objeto.
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      Contexto objetivo: contestación con plazo limitado frente a volumen documental extraordinario; se priorizó contestar al fondo, sin renunciar a que el tribunal ordene el procedimiento en audiencia previa para garantizar igualdad de armas.
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-rose-300">5) Riesgo 2: “La acumulación está permitida”</div>
                    <p className="mt-2 text-sm text-slate-300">
                      Si el tribunal entiende que cabe, entonces el objetivo cambia: no peleas la admisión, peleas el control del objeto: fijación de hechos controvertidos por bloques, exclusión de hechos irrelevantes, prueba estrictamente vinculada a cada bloque, cuantías y periodos temporales separados para evitar confusión.
                    </p>
                  </div>
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                    Advertencia procesal: Si la impugnación de la acumulación no se formuló en la contestación, el tribunal puede considerar la cuestión precluida y limitarse a ordenar el proceso. Por eso esta página incluye un plan subsidiario centrado en saneamiento, delimitación del objeto y prevención de indefensión.
                  </div>
                  </div>
                </SectionCard>
              </div>

              <div id="estrategia-oral" className="scroll-mt-24">
                <SectionCard title="Guion oral (60–90 segundos, listo para sala)">
                  <div className="space-y-4 text-sm text-slate-200">
                  <p>
                    Señoría, al amparo de la audiencia previa como trámite de depuración y ordenación del proceso, solicitamos que se controle el objeto litigioso porque la demanda acumula dos bloques distintos: división de cosa común y reclamación económica.
                  </p>
                  <p>
                    Con carácter principal, interesamos que se declare no procedente la acumulación si no cumple los requisitos de la LEC (compatibilidad, competencia y, especialmente, posibilidad de tramitarse en el mismo tipo de juicio).
                  </p>
                  <p>
                    Y subsidiariamente, si se mantiene, pedimos saneamiento del objeto para evitar indefensión: delimitación expresa de hechos controvertidos, prueba y cuantificación por bloques (A: división; B: deuda), con exclusión de lo que no sea pertinente. Esta audiencia existe precisamente para depurar y fijar el objeto.
                  </p>
                  </div>
                </SectionCard>
              </div>

              <div id="escenarios" className="scroll-mt-24">
                <SectionCard title="Los 4 escenarios (matriz)" subtitle="Matriz de decisión rápida">
                  <div className="space-y-4 text-sm text-slate-200">
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
                  </div>
                </SectionCard>
              </div>

              <div id="checklist" className="scroll-mt-24">
                <SectionCard title="Checklist (para preparar audiencia previa)">
                  <div className="space-y-4 text-sm text-slate-200">
                  <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                    <li>Identificar el bloque A (división): hechos estrictos de copropiedad y necesidad de división.</li>
                    <li>Identificar el bloque B (deuda): hechos de pagos, periodos, cuantificación, títulos de imputación.</li>
                    <li>Lista de hechos controvertidos por bloque (máximo 10 por bloque).</li>
                    <li>Prueba propuesta por bloque (documental/pericial/testifical) con “para qué” concreto.</li>
                    <li>Petición final escalonada: principal (inadmisión acumulación) + subsidiaria (saneamiento por bloques).</li>
                  </ul>
                  </div>
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
              <SectionCard title="Guion 60 segundos" subtitle="Resumen que se pueda leer en sala" className="sticky top-24">
                <div className="space-y-3 text-sm text-slate-200">
                  <p>
                    Solicitamos que se controle el objeto litigioso porque la demanda acumula división de cosa común y reclamación económica. Con carácter principal, pedimos que se declare no procedente la acumulación si no cumple los requisitos de la LEC (compatibilidad, competencia y misma clase de juicio).
                  </p>
                  <p>
                    Subsidiariamente, si se mantiene, pedimos saneamiento del objeto para evitar indefensión: hechos, prueba y cuantificación por bloques (A: división; B: deuda), con exclusión de lo que no sea pertinente. Esta audiencia existe para depurar y fijar el objeto.
                  </p>
                </div>
              </SectionCard>
            </div>
          </div>
        </div>
      )}
    </AnalyticsLayout>
  );
}
