import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

export function PrescripcionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = (searchParams.get('caseId') || 'picassent').toLowerCase();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases/CAS001?tab=estrategia';
  const isPicassent = caseId === 'picassent';

  const scenarioCards = useMemo(
    () => [
      {
        title: 'Escenario 1',
        tags: ['STS458: No', 'Juez la compra: No'],
        sostener:
          'Prescripción clásica por pagos/devengo: cada exceso pagado (o cada hecho patrimonial reclamable) genera acción exigible en ese momento; si no se reclama en plazo, prescribe.',
        pedir:
          'Estimación de la excepción de prescripción por bloques temporales y depuración del objeto: fuera todo lo anterior al umbral temporal aplicable (y, como mínimo, lo claramente remoto).',
        riesgo: 'Que intenten “re-empaquetar” como crédito único a liquidar al final.',
        contramedida: 'Insistir en exigibilidad individualizada y ausencia de actos interruptivos.',
      },
      {
        title: 'Escenario 2',
        tags: ['STS458: No', 'Juez la compra: Sí'],
        sostener:
          'Diferencias fácticas: la STS 458/2025 responde a una lógica ligada a comunidad de vida/vivienda familiar; aquí hay inversión/patrimonio, y hechos previos al matrimonio. No hay identidad de razón para desplazar actio nata.',
        pedir:
          'Resolución motivada por bloques: si aplica a “cuotas entre codeudores”, que NO se extienda a gastos/inversiones; y, en todo caso, cuantificación separada.',
        riesgo: 'Extensión indiscriminada “a todo”.',
        contramedida:
          'Pedir explicitación del dies a quo por cada bloque y exigencia de prueba de exigibilidad/interrupción.',
      },
      {
        title: 'Escenario 3',
        tags: ['STS458: Sí', 'Juez la compra: No'],
        sostener:
          'Volver a la prescripción clásica + carga de la prueba: si la demandante no acredita crédito exigible y no prescrito, cae.',
        pedir:
          'Depuración: hechos remotos fuera + requerir concreción: fechas, importes, concepto, soporte documental.',
        riesgo: 'Que el debate se convierta en “relato” sin documentos.',
        contramedida:
          'Convertirlo en tabla: hecho → fecha → importe → documento → exigibilidad → prescripción.',
      },
      {
        title: 'Escenario 4',
        tags: ['STS458: Sí', 'Juez la compra: Sí'],
        sostener:
          'Plan B: limitar alcance por “bloques” y por cronología (hechos pre-matrimonio). Si el juez asume STS458 para cuotas entre codeudores, impedir que se use para reembolsos ajenos (gastos, inversiones, mejoras, etc.). Además, reforzar “falta de prueba” y “cuantificación”.',
        pedir:
          'Decisión por bloques: (A) cuotas/codeudores, (B) gastos, (C) inversiones. Para cada bloque: base jurídica, dies a quo y prueba. Sin eso, indefensión.',
        riesgo: 'Que el dies a quo se desplace artificialmente al final y reviva todo.',
        contramedida:
          'Exigir motivación reforzada + oponerse a extensión analógica; insistir en hechos anteriores al matrimonio y en ausencia de vivienda familiar.',
      },
    ],
    []
  );

  return (
    <AnalyticsLayout
      title="Prescripción — P.O. 715/2024 (Picassent)"
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
        <SectionCard title="Prescripción" subtitle="Estado del caso">
          <div className="space-y-4 text-sm text-slate-300">
            <p>Prescripción todavía no preparada para este caso.</p>
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
          <SectionCard title="Prescripción — P.O. 715/2024 (Picassent)">
            <div className="flex flex-wrap gap-2">
              {['CAS001', 'ACTIVO', 'Cuantía 212.677,00 €', 'AP 10/03/2026 09:45'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Resumen ejecutivo (para audiencia previa)" subtitle="Resumen ejecutivo (60s)">
            <div className="space-y-4 text-sm text-slate-200">
              <p>
                Esta defensa se basa en una idea simple: no puedes reclamar hoy como ‘deuda viva’ pagos y
                hechos de hace más de una década sin superar dos filtros: (1) prescripción de la acción
                (art. 1964 CC, en relación con actio nata), y (2) carga de la prueba de que existió un
                crédito exigible, no satisfecho y no prescrito. En Picassent se discuten hechos muy
                anteriores al matrimonio (2013) y muy anteriores a la demanda (24/06/2024). La estrategia
                es modular: si el juzgado no compra la STS 458/2025, se empuja prescripción clásica por
                pagos/devengos; si la cita o la asume, se limita su alcance por diferencias fácticas (no
                vivienda familiar / no comunidad de vida protegible) y por bloques (cuotas entre codeudores
                vs. gastos/inversiones).
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  'Eje 1: Prescripción (regla clásica)',
                  'Eje 2: Falta de prueba (exigibilidad / trazabilidad)',
                  'Eje 3: Diferenciar STS 458/2025 (si la invocan)',
                  'Eje 4: Segmentación por bloques y cuantías',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Mapa de escenarios (decisión rápida de discurso)" subtitle="Mapa de escenarios (4)">
            <p className="text-sm text-slate-400">
              Selecciona el escenario real y usa el guion y peticiones asociadas.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {scenarioCards.map((scenario) => (
                <div
                  key={scenario.title}
                  className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {scenario.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-600/60 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">Qué sostener</div>
                      <p className="text-xs text-slate-300">{scenario.sostener}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-amber-300">Qué pedir</div>
                      <p className="text-xs text-slate-300">{scenario.pedir}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-rose-300">Riesgo</div>
                      <p className="text-xs text-slate-300">{scenario.riesgo}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Contramedida</div>
                      <p className="text-xs text-slate-300">{scenario.contramedida}</p>
                    </div>
                  </div>
                  <a
                    href="#prescripcion-guion"
                    className="mt-4 inline-flex text-xs font-semibold text-emerald-300 hover:text-emerald-200"
                  >
                    Abrir guion →
                  </a>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Tesis principal: prescripción clásica + actio nata" subtitle="Tesis principal (sin STS458)">
            <div className="space-y-4 text-sm text-slate-200">
              <p>
                Marco: la prescripción extingue la acción si no se ejercita dentro del plazo legal. La
                clave práctica es el dies a quo: cuándo pudo ejercitarse la acción (exigibilidad real). En
                este caso, gran parte de los hechos económicos son antiguos y se presentaron como
                reclamación global en 2024. La defensa exige que cada partida tenga (1) fecha, (2)
                concepto, (3) documento, (4) fundamento del crédito, (5) dies a quo, (6) actos
                interruptivos. Si falta cualquiera, no puede sobrevivir como ‘bloque’.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
                <li>Sin fecha y sin soporte: no entra.</li>
                <li>Sin exigibilidad explicada: no entra.</li>
                <li>Sin prueba de interrupción: prescribe.</li>
                <li>No mezclar bloques: cuotas ≠ gastos ≠ inversiones.</li>
              </ul>
            </div>
          </SectionCard>

          <SectionCard title="Plan B: Anti-STS 458/2025 (distinguishing)" subtitle="Plan B si entra STS 458/2025">
            <div className="space-y-4 text-sm text-slate-200">
              <p>
                Si la contraparte invoca la STS 458/2025 (o el juzgado se apoya en ella), la defensa no
                discute ‘la sentencia’ como dogma: discute la identidad de razón. Puntos diferenciales
                (para repetir sin adornos): (1) Hechos relevantes muy anteriores al matrimonio (2013). (2)
                Naturaleza patrimonial/inversión (no núcleo de vivienda familiar protegido). (3) Bloques
                heterogéneos: si algo fuera ‘cuota entre codeudores’ no autoriza a arrastrar
                gastos/inversiones. (4) Seguridad jurídica y exigibilidad: no se puede convertir una suma
                de partidas antiguas en un crédito único sin justificar dies a quo e interrupción.
              </p>
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                <div className="font-semibold text-rose-100">Lo que NO decir</div>
                <ul className="list-disc space-y-1 pl-5">
                  <li>No digas: ‘es injusto’.</li>
                  <li>Di: ‘falta identidad de razón’, ‘exigibilidad’, ‘seguridad jurídica’, ‘carga de la prueba’, ‘bloques’.</li>
                </ul>
              </div>
            </div>
          </SectionCard>

          <div id="prescripcion-guion">
            <SectionCard title="Guion de sala (versión 2 minutos)" subtitle="Guion de sala">
              <div className="space-y-4 text-sm text-slate-200">
                <p>
                  Señoría, pedimos que se depure el objeto: la demandante pretende una reclamación global
                  construida con hechos y pagos muy antiguos sin acreditar, partida a partida,
                  exigibilidad, soporte documental y actos interruptivos. Nuestra posición es técnica:
                  (1) prescripción por bloques temporales cuando el crédito era exigible en su momento y
                  no se reclamó en plazo; (2) falta de prueba suficiente para sostener un crédito exigible
                  hoy; y (3) subsidiariamente, si se menciona la STS 458/2025, que se limite estrictamente
                  por diferencias fácticas y por bloques, sin extensión indiscriminada a gastos o
                  inversiones, y con motivación del dies a quo.
                </p>
                <div className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-4">
                  <div className="text-xs font-semibold text-slate-200">
                    Guion de sala (versión 5 minutos)
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    Añadir: (a) recordar que muchos hechos son pre-matrimonio, (b) pedir decisión por
                    bloques con tabla de cuantías, (c) insistir en que sin fecha+documento no hay debate
                    serio, (d) si el juez ‘compra’ STS458: exigir que delimite qué bloque y por qué, y que
                    no la use para revivir todo.
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Checklist probatorio y de acciones (24–72h)" subtitle="Checklist 24–72h">
            <div className="space-y-4 text-sm text-slate-200">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Redactar ‘Hecho diferencial’: no vivienda familiar / inversión-patrimonio / hechos pre-matrimonio.</li>
                <li>
                  Preparar 3–5 pruebas simples (aunque sean indiciarias) para sostener el distinguishing
                  (padrón, contratos, anuncios, etc., si existen).
                </li>
                <li>Convertir las partidas en tabla: fecha → importe → concepto → doc → exigibilidad → prescripción.</li>
                <li>Preparar escrito/petición para que el juez resuelva por bloques (A cuotas; B gastos; C inversiones).</li>
                <li>Preparar petición de exhibición/oficios si falta soporte documental esencial.</li>
              </ol>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                Tono: técnico. Palabras clave: seguridad jurídica, exigibilidad, identidad de razón, carga de
                la prueba, bloques, motivación.
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Riesgos y mitigación">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2 pr-3">Riesgo</th>
                    <th className="py-2 pr-3">Impacto</th>
                    <th className="py-2">Mitigación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr>
                    <td className="py-2 pr-3">Aplicación expansiva STS458</td>
                    <td className="py-2 pr-3 text-rose-300">Alto</td>
                    <td className="py-2">Limitar por bloques + hechos pre-matrimonio + motivación dies a quo</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3">Debate sin documentos</td>
                    <td className="py-2 pr-3 text-amber-300">Medio-Alto</td>
                    <td className="py-2">Tabla + exigencia de soporte</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3">Reempaquetado como crédito único</td>
                    <td className="py-2 pr-3 text-rose-300">Alto</td>
                    <td className="py-2">Exigibilidad individualizada + ausencia de interrupción</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}
    </AnalyticsLayout>
  );
}
