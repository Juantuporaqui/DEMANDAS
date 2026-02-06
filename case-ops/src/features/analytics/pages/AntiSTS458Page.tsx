import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

export function AntiSTS458Page() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases';

  return (
    <AnalyticsLayout
      title="Defensa Anti-STS 458/2025 — Distinguishing completo"
      subtitle="4 argumentos verificados para impedir que apliquen esta sentencia a nuestro caso. ROJ: STS 1292/2025."
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
        {/* QUÉ DICE LA STS 458/2025 */}
        <SectionCard title="⚠️ Qué dice la STS 458/2025 (conoce al enemigo)">
          <div className="space-y-3 text-sm text-slate-300">
            <p className="border-l-2 border-red-500/50 pl-3 italic text-red-300">
              «En la acción de repetición o reembolso entre cónyuges fundada en el artículo 1145 CC, el plazo de prescripción quinquenal no comienza a computarse desde la fecha en que se realizó cada pago, sino desde la disolución del matrimonio o desde el momento en que tuvo lugar la separación de hecho definitiva.»
            </p>
            <p className="border-l-2 border-red-500/50 pl-3 italic text-red-300">
              «No resulta razonable que el plazo de prescripción comience a correr cuando ambos cónyuges siguen haciendo vida en común y contribuyendo al sostenimiento de las cargas y gastos comunes de la familia, con vocación de permanencia.»
            </p>
            <p className="mt-2 text-amber-300 font-medium">
              Caso de la STS: Pareja en separación de bienes, vivienda adquirida por mitades indivisas como DOMICILIO FAMILIAR, préstamo hipotecario SOLIDARIO, cuenta común nutrida CASI EXCLUSIVAMENTE del sueldo de ella. Ella demostró que pagaba más. El TS le dio razón.
            </p>
          </div>
        </SectionCard>

        {/* ARGUMENTO 1 — EL MÁS FUERTE */}
        <SectionCard title="🔴 ARGUMENTO 1 — Negocio inmobiliario, NO vivienda habitual (9/10)">
          <div className="space-y-3 text-sm text-slate-300">
            <p className="font-semibold text-emerald-400">Este es el argumento que puede ganar la prescripción por sí solo.</p>
            <p>
              La STS 458/2025 protege al cónyuge que paga de más la hipoteca de LA CASA DONDE AMBOS VIVEN. Su fundamento es el deber de socorro mutuo (arts. 67, 68 CC) y la «contribución al sostenimiento de las cargas y gastos comunes de la familia, con vocación de permanencia».
            </p>
            <p>
              <strong>Nuestro caso es radicalmente distinto:</strong> El préstamo financió la compra de PARCELAS para construir y vender chalets como negocio inmobiliario especulativo. Cuando cayó el mercado y no se pudo vender, se alquiló y después se explotó como Airbnb. NUNCA fue domicilio familiar. Siempre fue un activo productivo o segunda residencia.
            </p>
            <p>
              Un negocio es un negocio. Las deudas de un negocio conjunto se rigen por las normas de la comunidad ordinaria (arts. 392 y ss. CC) y de la sociedad civil (arts. 1665 y ss. CC), no por la lógica protectora del matrimonio.
            </p>
            <p>
              Refuerzo jurisprudencial: La propia doctrina del TS dice que las cuotas de amortización del préstamo hipotecario para adquisición de vivienda — incluso la FAMILIAR — no se reputan cargas del matrimonio (STS 20/03/2013, RJ 2013/4936; STS 246/2018). Si ni la hipoteca de la casa familiar es carga matrimonial, MUCHO MENOS la hipoteca de unas parcelas de negocio.
            </p>
            <div className="mt-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40 p-3">
              <p className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-1">Frase para sala</p>
              <p className="text-emerald-200 italic">
                «La STS 458/2025 protege al cónyuge que paga de más la hipoteca de la casa donde ambos viven. No protege al socio de un negocio inmobiliario especulativo. El préstamo financió parcelas para construir y vender chalets. Cuando el negocio fracasó, se alquiló y se explotó como Airbnb. Nunca fue vivienda habitual. Esto es una inversión conjunta, no una carga del matrimonio, y las reglas de prescripción son las generales: desde cada pago.»
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ARGUMENTO 2 */}
        <SectionCard title="🟠 ARGUMENTO 2 — No hay desequilibrio demostrable en aportaciones (8/10)">
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              En la STS 458/2025, la demandante PROBÓ que la cuenta común «se nutría casi exclusivamente de su sueldo». Había un desequilibrio objetivo y demostrable.
            </p>
            <p>
              <strong>En nuestro caso ese presupuesto fáctico NO concurre:</strong> Ambos trabajaban con sueldos comparables (ella policía, él con sus ingresos). Solo existían 2 cuentas, AMBAS conjuntas. Cada uno tenía domiciliada la nómina en un banco distinto simplemente para evitar comisiones. No existía patrimonio privativo. No existía una cuenta de la que «procedieran casi exclusivamente» los fondos de uno.
            </p>
            <p className="font-medium text-amber-300">
              La carga de la prueba recae sobre Vicenta (art. 217 LEC). Debe demostrar que ella aportó más. Y no basta con decir «la hipoteca se pagaba desde la cuenta X» — tiene que probar que esa cuenta se alimentaba desproporcionadamente con SU dinero. Si ambos ingresaban sueldos similares en cuentas conjuntas, esa prueba es fácticamente imposible.
            </p>
            <p>
              Además: Vicenta no puede reclamar más de lo que ganó. Si ambos tenían sueldos comparables y solo existían cuentas conjuntas, cada euro que ella dice haber «puesto de más» en la hipoteca es un euro que Juan puso de más en todo lo demás: comida, ropa, hijos, facturas, coches. El matrimonio funcionaba como economía integrada. No se puede aislar la hipoteca del supermercado.
            </p>
            <div className="mt-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40 p-3">
              <p className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-1">Frase para sala</p>
              <p className="text-emerald-200 italic">
                «La STS 458/2025 exige como presupuesto que se demuestre que los fondos procedían casi exclusivamente de uno de los cónyuges. Aquí eso no solo no se ha probado, sino que es fácticamente imposible: dos sueldos comparables, dos cuentas conjuntas, cero patrimonio privativo. La demandante no puede identificar ni un solo euro privativo suyo que financiara la hipoteca, porque no existían euros privativos. Y si dice que aportó más a la hipoteca, la pregunta obligada es: ¿quién aportó más al supermercado, la ropa, los colegios y las facturas? La economía familiar era un todo integrado.»
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ARGUMENTO 3 */}
        <SectionCard title="🟡 ARGUMENTO 3 — Retraso desleal / Verwirkung (7/10)">
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              La doctrina del retraso desleal (Verwirkung) es una manifestación de la buena fe (art. 7 CC) que sanciona al titular de un derecho que, pudiendo ejercerlo, no lo ejerce durante un tiempo prolongado generando en la otra parte la confianza legítima de que no lo hará.
            </p>
            <p>
              <strong>Vicenta era policía con un máster en económicas.</strong> Era cotitular de ambas cuentas. Veía todos los movimientos. Durante más de una década NUNCA hizo una transferencia compensatoria, NUNCA reclamó, NUNCA documentó un desequilibrio. Esta inacción no fue por ignorancia — tenía la formación y la información para actuar. Fue por decisión: porque no había desequilibrio, o porque lo aceptaba dentro de la economía conjunta.
            </p>
            <p>
              Esta conducta prolongada y consciente generó en Juan la confianza legítima de que la organización económica era satisfactoria para ambas partes.
            </p>
            <div className="mt-3 rounded-lg bg-emerald-900/30 border border-emerald-700/40 p-3">
              <p className="font-semibold text-emerald-300 text-xs uppercase tracking-wider mb-1">Frase para sala</p>
              <p className="text-emerald-200 italic">
                «La demandante, licenciada en económicas y profesional de cuerpos de seguridad, fue cotitular de ambas cuentas durante todo el matrimonio. Tenía acceso completo a la información financiera. Durante más de una década no realizó ninguna transferencia compensatoria, no documentó ningún desequilibrio, no formuló ninguna reclamación. Esta conducta prolongada y consciente generó en mi mandante la confianza legítima de que la organización económica era satisfactoria para ambas partes. Reclamar ahora vulnera la doctrina del retraso desleal como manifestación del art. 7 CC.»
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ARGUMENTO 4 */}
        <SectionCard title="🟢 ARGUMENTO 4 — Herramienta procesal: complemento de alegaciones (6/10)">
          <div className="space-y-3 text-sm text-slate-300">
            <p>
              La STS 458/2025 es de 24/03/2025. La contestación a la demanda es anterior. Por tanto, cuando Juan contestó, la doctrina vigente era la regla general (dies a quo = fecha de pago). Juan no se sintió obligado a justificar exhaustivamente la prescripción de hechos que en ese momento estaban legalmente prescritos bajo la doctrina entonces vigente.
            </p>
            <p>
              <strong>Esto NO funciona como defensa de fondo</strong> — el juez aplica la jurisprudencia vigente con independencia de cuándo se dictó. <strong>PERO SÍ funciona como llave procesal</strong> para introducir argumentos nuevos en la Audiencia Previa:
            </p>
            <p className="font-medium text-amber-300">
              Art. 426.4 LEC: complemento de alegaciones por hechos jurídicos nuevos. «Han surgido hechos jurídicos nuevos — una sentencia del TS posterior a la contestación — que obligan a esta parte a completar sus alegaciones sobre prescripción.» Esto da cobertura para introducir los argumentos 1, 2 y 3 en la AP del 10/03/2026 aunque no estuvieran en la contestación.
            </p>
            <div className="mt-3 rounded-lg bg-amber-900/30 border border-amber-700/40 p-3">
              <p className="font-semibold text-amber-300 text-xs uppercase tracking-wider mb-1">Uso correcto</p>
              <p className="text-amber-200">
                Usar SOLO como herramienta procesal para abrir la puerta al debate en AP. NUNCA decir al juez «no conocía la sentencia» como argumento sustantivo.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ORDEN DE INTERVENCIÓN */}
        <SectionCard title="📋 Orden de intervención en sala">
          <div className="space-y-2 text-sm text-slate-300">
            <div className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
              <span className="flex-shrink-0 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">1º</span>
              <div>
                <p className="font-semibold text-white">Argumento 1 — Negocio, no vivienda</p>
                <p className="text-slate-400">Distingue objetivamente el caso. Es irrebatible si se prueba que nunca fue domicilio.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
              <span className="flex-shrink-0 rounded-full bg-orange-600 px-2.5 py-0.5 text-xs font-bold text-white">2º</span>
              <div>
                <p className="font-semibold text-white">Argumento 2 — No hay desequilibrio</p>
                <p className="text-slate-400">Destruye el presupuesto fáctico de la STS 458/2025. Sin desequilibrio probado, la sentencia no aplica.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
              <span className="flex-shrink-0 rounded-full bg-yellow-600 px-2.5 py-0.5 text-xs font-bold text-white">3º</span>
              <div>
                <p className="font-semibold text-white">Argumento 3 — Retraso desleal</p>
                <p className="text-slate-400">Ataca la buena fe de la reclamación. Policía + máster en económicas + cotitular + 0 reclamaciones en 10+ años.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
              <span className="flex-shrink-0 rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-bold text-white">4º</span>
              <div>
                <p className="font-semibold text-white">Argumento 4 — Art. 426.4 LEC</p>
                <p className="text-slate-400">Solo como llave procesal para introducir los anteriores en la AP. No como argumento sustantivo.</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* GUION COMPLETO 2 MINUTOS */}
        <SectionCard title="🎯 Guion completo anti-458 (2 minutos)">
          <div className="rounded-lg bg-slate-800/70 border border-slate-600/30 p-4 text-sm text-slate-200 space-y-3 leading-relaxed">
            <p>
              «Señoría, si la parte actora invoca la STS 458/2025, esta parte solicita que se examine el encaje fáctico antes de aplicar su doctrina.»
            </p>
            <p>
              «Primero: la STS 458/2025 trata de una hipoteca sobre la VIVIENDA HABITUAL de los cónyuges. Nuestro caso es distinto: el préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Cuando el mercado cayó, se alquiló y se explotó como Airbnb. Nunca fue domicilio familiar. Es una inversión conjunta, regida por la comunidad ordinaria, no por las cargas del matrimonio.»
            </p>
            <p>
              «Segundo: la STS 458/2025 exige como presupuesto que se demuestre que los fondos procedían casi exclusivamente de uno de los cónyuges. Aquí eso no concurre. Dos sueldos comparables, dos cuentas conjuntas, cero patrimonio privativo. Cada nómina domiciliada en un banco distinto solo para evitar comisiones. No existe un solo euro privativo identificable. Y si la demandante dice que aportó más a la hipoteca, ¿quién aportó más al supermercado, la ropa, los colegios y las facturas? La economía era un todo integrado.»
            </p>
            <p>
              «Tercero: la demandante, licenciada en económicas y cotitular de ambas cuentas, tuvo durante más de una década acceso completo a la información financiera y no realizó una sola transferencia compensatoria ni documentó desequilibrio alguno. La doctrina del retraso desleal impide amparar esta conducta.»
            </p>
            <p>
              «Por todo ello, solicitamos que no se aplique la STS 458/2025 a este supuesto, y subsidiariamente, que si se aplica, sea exclusivamente a bloques homogéneos con motivación del dies a quo por bloque y prueba específica del desequilibrio.»
            </p>
          </div>
        </SectionCard>

        {/* QUÉ NO DECIR */}
        <SectionCard title="🚫 Qué NO decir nunca">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>
              <span className="text-red-400 font-medium">«No conocía la sentencia»</span> — El juez aplica la jurisprudencia vigente. Da igual cuándo la conociste.
            </li>
            <li>
              <span className="text-red-400 font-medium">«Es injusto»</span> — No es un argumento jurídico. Usa «retraso desleal», «buena fe», «art. 7 CC».
            </li>
            <li>
              <span className="text-red-400 font-medium">«Ella no era tonta»</span> — Suena despectivo. Usa «formación en económicas y acceso completo a la información financiera».
            </li>
            <li>
              <span className="text-red-400 font-medium">«La 458 no aplica y punto»</span> — Siempre ofrece subsidiaria: «si se aplica, que sea por bloques con prueba específica».
            </li>
          </ul>
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
