import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

export function PasivoPreferentePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases';

  return (
    <AnalyticsLayout
      title="Pasivo preferente: hipoteca y reparto del precio"
      subtitle="Estrategia para impedir que la actora liquide el activo ignorando la deuda que lo financió."
      actions={
        <button
          type="button"
          onClick={() => navigate(returnTo)}
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Volver
        </button>
      }
    >
      <div className="space-y-6">
        <SectionCard title="Ficha rápida">
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-200">
            {caseId ? (
              <span className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1">
                {caseId}
              </span>
            ) : (
              <span className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1">
                (sin caseId)
              </span>
            )}
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-indigo-200">
              AP / bases de liquidación
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Idea fuerza">
          <p className="text-sm text-slate-300">
            En una división de cosa común con inmuebles gravados, no tiene sentido práctico ni equidad material repartir el “activo limpio” si el pasivo que lo financió queda fuera. La venta debe fijar bases de liquidación: del precio, primero gastos y cancelación (total o parcial) del préstamo hipotecario; después, reparto del remanente.
          </p>
        </SectionCard>

        <SectionCard title="Qué se pide en Audiencia Previa (petición clara)">
          <div className="space-y-4 text-sm text-slate-300">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-emerald-300">Petición principal</div>
              <p className="mt-2">
                Que se haga constar como base de liquidación/venta que, del precio obtenido por la enajenación de las fincas, se destine con carácter preferente a:
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>gastos inherentes a la venta (si los hubiera), y</li>
                <li>cancelación total o parcial del préstamo hipotecario vinculado a la adquisición/construcción.</li>
              </ul>
              <p className="mt-2">Que el remanente (si lo hubiera) se distribuya entre las partes conforme a su cuota.</p>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-amber-300">Subsidiaria (si el juzgado no quiere fijarlo tan cerrado)</div>
              <p className="mt-2">
                Que se acuerde retención/consignación en cuenta judicial de una cantidad equivalente a la parte proporcional del pasivo pendiente (p.ej. 50% si la cuota es 50/50), hasta que se concrete el mecanismo definitivo de cancelación.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Por qué esto importa (el riesgo real)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Si se vende y se reparte sin tratar el pasivo, el resultado es una sentencia inejecutable o injusta: el activo se transforma en liquidez repartida, pero la deuda permanece.</li>
            <li>Se incentiva el “free-rider”: una parte puede cobrar del activo y desentenderse del pasivo, trasladando el problema al otro copropietario/co-deudor.</li>
            <li>En tu caso (contexto del procedimiento): se denuncia que la demanda omite deliberadamente el vínculo entre hipoteca y adquisición/construcción, generando un relato sesgado sobre el origen de la deuda.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Fundamento jurídico (sin exceso, pero con anclaje)">
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              En comunidades ordinarias, los partícipes deben contribuir a cargas y gastos vinculados al bien común y su financiación; y la división no debe producir un resultado materialmente desequilibrado. En sede de Audiencia Previa es razonable fijar bases de realización y reparto para evitar un fallo meramente declarativo que deje fuera el elemento económico determinante: la deuda garantizada.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>CC: principios de comunidad y contribución a cargas (arts. 392 y ss.; especialmente idea de contribución proporcional y gastos/cargas del bien).</li>
              <li>LEC: orientación a depurar objeto, fijar hechos controvertidos y concretar el alcance de lo pedido para evitar indefensión y ejecución problemática.</li>
            </ul>
          </div>
        </SectionCard>

        <SectionCard title="Cómo decirlo en sala (guion oral de 45–60s)">
          <p className="text-sm text-slate-300">
            “Señoría, aquí no basta con vender y repartir, porque existe un pasivo que financió directamente los inmuebles. Si el juzgado no fija bases de liquidación, el resultado es repartir liquidez mientras la deuda sigue viva, con un riesgo claro de desequilibrio y de ejecución inviable. Por eso solicitamos que, como base de la eventual venta, del precio se destine preferentemente a cancelar total o parcialmente el préstamo hipotecario asociado y, solo después, se reparta el remanente. Subsidiariamente, que se retenga o consigne judicialmente la parte proporcional del pasivo pendiente hasta concretar el mecanismo de cancelación.”
          </p>
        </SectionCard>

        <SectionCard title="Objeciones previsibles y réplica">
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <div className="text-xs font-semibold text-slate-200">Objeción A: “Eso no es objeto de la división de cosa común.”</div>
              <div>Réplica: “No se altera el objeto; se fijan bases de liquidación para que la división produzca un resultado realizable y no una declaración vacía.”</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Objeción B: “La hipoteca es un tema con el banco.”</div>
              <div>Réplica: “Correcto; por eso se pide que del precio se atienda la deuda, evitando repartir dinero mientras subsiste el pasivo.”</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Objeción C: “Ya se verá después.”</div>
              <div>Réplica: “Después es tarde: el dinero ya estaría repartido. Esto se fija ahora para evitar conflicto y garantizar una ejecución ordenada.”</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Prueba y documentación mínima (checklist)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Escritura del préstamo/subrogación y datos identificativos (entidad, fecha, nº contrato si aplica).</li>
            <li>Nota simple/Registro: cargas actuales.</li>
            <li>Cuadro de amortización / certificado de deuda pendiente.</li>
            <li>Documentos que vinculen la finalidad (adquisición parcelas / construcción) si existieran (escrituras, transferencias, pagos a proveedores, etc.).</li>
            <li>Cualquier escrito presentado (si ya existe) relativo a “pasivo preferente”.</li>
          </ul>
        </SectionCard>

        <SectionCard title="Resultado que buscas (muy concreto)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Que el juez “compre” la idea de que activo y pasivo van juntos.</li>
            <li>Que el Auto/Acta deje fijado un mecanismo: pagar hipoteca con el precio o retener/consignar.</li>
            <li>Que la actora no pueda sostener luego “yo ya cobré mi 50% y la deuda es cosa tuya”.</li>
          </ul>
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
