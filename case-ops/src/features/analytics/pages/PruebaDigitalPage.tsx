import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Copy } from 'lucide-react';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';

const resumen60s = `Señoría, esta defensa impugna la prueba digital por falta de integridad: las capturas y recortes no acreditan el origen ni la autenticidad del movimiento. Sin extracto certificado o firma electrónica, la carga probatoria recae en quien aporta la captura. Solicitamos impugnación expresa, aportación íntegra/certificada y, si persisten, pericial informática o cotejo con registro original. El estándar mínimo exige ordenante, fecha, cuenta de origen/destino, concepto completo e identificador de operación.`;

export function PruebaDigitalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || '/cases';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resumen60s);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnalyticsLayout
      title="Prueba digital: impugnación de integridad y autenticidad"
      subtitle="Protocolo operativo: excluir capturas/recortes sin certificación y forzar cotejo/registro."
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
        <SectionCard title="Resumen 60s (para sala)">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-300 whitespace-pre-line">{resumen60s}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] font-semibold text-emerald-200 hover:border-emerald-400/80 hover:text-emerald-100"
            >
              <Copy className="h-3.5 w-3.5" /> {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Checklist de integridad (mínimos)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Ordenante.</li>
            <li>Fecha.</li>
            <li>Cuenta origen-destino.</li>
            <li>Concepto completo.</li>
            <li>Identificador de operación.</li>
            <li>Certificación o firma electrónica.</li>
            <li>Metadatos si aplica.</li>
            <li>Contexto (no recortes).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Ataque técnico">
          <p className="text-sm text-slate-300">
            Las capturas o recortes son frágiles y manipulables: si omiten campos esenciales (por ejemplo, el “ordenante”) o esconden el desplegable de “mostrar más”, deben ser impugnadas. La defensa exige el documento íntegro y cotejado con el registro original, porque un recorte no permite comprobar el origen real del pago.
          </p>
        </SectionCard>

        <SectionCard title="Base legal de impugnación (anclaje)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Art. 326 LEC (documentos privados).</li>
            <li>Art. 247 LEC (buena fe procesal).</li>
            <li>Art. 265.2 LEC (aportación documental).</li>
            <li>Art. 327 LEC (copias).</li>
            <li>Art. 217 LEC (carga de la prueba).</li>
          </ul>
        </SectionCard>

        <SectionCard title="Qué pedir en Audiencia Previa">
          <p className="text-sm text-slate-300">
            Impugnación expresa de la integridad y autenticidad, requerimiento de aportación íntegra/certificada y, si persisten en la prueba recortada, pericial informática o cotejo con el registro original.
          </p>
        </SectionCard>

        <SectionCard title="Guion de interrogatorio (impacto)">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>“¿Por qué aporta recortes y no extractos completos?”</li>
            <li>“¿Por qué nunca aparece el ordenante en sus capturas?”</li>
            <li>“¿Puede explicar por qué se oculta el ‘mostrar más’ del movimiento?”</li>
            <li>“¿Quién certifica la integridad de estas imágenes?”</li>
          </ul>
        </SectionCard>

        <SectionCard title="Salida ideal">
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Los documentos no alcanzan valor pleno.</li>
            <li>Se fuerza a aportar extractos certificados.</li>
            <li>Se ancla la duda razonable por manipulación/recorte.</li>
          </ul>
        </SectionCard>
      </div>
    </AnalyticsLayout>
  );
}
