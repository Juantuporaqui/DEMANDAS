import { type ReactNode, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, FileText } from 'lucide-react';
import Badge from '../../../ui/components/Badge';
import { Modal } from '../../../components/Modal';
import { formatCurrency } from '../../../utils/validators';
import {
  argumentosOposicion,
  desgloseCifrasQuart,
  pagosDirectosJuan,
} from '../../../data/quart';
import { DEFENSA_360_QUART } from '../../../data/quart/defensa360';
import { EMAIL_REGULARIZACION } from '../../../data/quart/evidencias';

const probTone = {
  alta: 'ok',
  media: 'warn',
  baja: 'danger',
} as const;

const carrilTone = {
  tasado: 'ok',
  contexto: 'muted',
} as const;

const eurosToCents = (euros: number) => Math.round(euros * 100);

function highlight(text: string, parts: string[]): ReactNode {
  if (!parts.length) {
    return text;
  }

  const escapedParts = parts
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!escapedParts.length) {
    return text;
  }

  const matcher = new RegExp(`(${escapedParts.join('|')})`, 'g');
  const segments = text.split(matcher);

  return segments.map((segment, index) => (
    parts.includes(segment) ? (
      <mark key={`hl-${index}`} className="rounded bg-amber-400/30 px-0.5 text-amber-100">
        {segment}
      </mark>
    ) : (
      <span key={`tx-${index}`}>{segment}</span>
    )
  ));
}

export function TabDefensa360Quart() {
  const [included, setIncluded] = useState<Record<string, boolean>>(
    Object.fromEntries(
      DEFENSA_360_QUART.map((pilar) => [pilar.id, pilar.carril === 'tasado'])
    )
  );
  const [toast, setToast] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [includeBuenaFe, setIncludeBuenaFe] = useState(true);

  const cifras = useMemo(() => {
    const pilarPago = argumentosOposicion.find((item) => item.codigo === '556.1_LEC_cumplimiento_pago');
    const aportadoTotal = pilarPago?.cifras?.aportadoTotalCents;
    const transferenciaOct = pilarPago?.cifras?.transferenciaOct2025Cents;

    return {
      reclamado: desgloseCifrasQuart.reclamadoPorEjecutante,
      pagadoTotal: aportadoTotal,
      pagadoPost: transferenciaOct,
      deficit: desgloseCifrasQuart.deficitAlegadoCents,
      pagosDirectos: pagosDirectosJuan.totalCents,
      reserva: desgloseCifrasQuart.saldoNetoAFavorJuanCents,
    };
  }, []);

  const selectedPilares = useMemo(
    () => DEFENSA_360_QUART.filter((pilar) => included[pilar.id]),
    [included]
  );

  const escritoGenerado = useMemo(() => {
    const intro = [
      'AL JUZGADO DE PRIMERA INSTANCIA Nº 1 DE QUART DE POBLET, EN LA PIEZA DE OPOSICIÓN A LA EJECUCIÓN ETJ 1428/2025, comparece esta parte y como mejor proceda en Derecho DICE:',
      'Que formula escrito sintético de defensa para vista, manteniendo el carril principal de oposición por motivos tasados de pago/cumplimiento y depuración de cuantía.',
      'Todo ello sin perjuicio de los extremos contextuales que se interesan exclusivamente a efectos de valoración de conducta procesal y costas.',
    ];

    const bloques = selectedPilares.map((pilar, idx) => `${idx + 1}. ${pilar.titulo}\n${pilar.parrafoEscrito}`);

    const suplica = [
      'SUPLICO AL JUZGADO: que tenga por efectuadas las anteriores manifestaciones, estime la oposición en lo procedente por pago/cumplimiento parcial y fije la cuantía ejecutiva conforme al saldo real acreditado; y, en lo demás, valore el contexto expuesto a efectos de costas y corrección procesal.',
      'OTROSÍ DIGO: se reserva el ejercicio de las acciones declarativas que en Derecho correspondan respecto de extremos no ventilables en el cauce tasado de esta ejecución.',
    ];

    const bloqueBuenaFe = includeBuenaFe
      ? [
          '',
          '“Se acompaña email de fecha [●], aportado a efectos meramente contextuales, en el que esta parte propone regularizar y normalizar aportaciones y establecer control de retiradas, con la finalidad de evitar litigiosidad y asegurar el destino finalista a favor de los menores. No se invoca como requisito procesal, sino como indicio de buena fe (art. 7 CC) y lealtad procesal (art. 247 LEC), así como para fijar la cronología objetiva de los hechos.”',
        ]
      : [];

    return [...intro, '', ...bloques, '', ...suplica, ...bloqueBuenaFe].join('\n');
  }, [includeBuenaFe, selectedPilares]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2000);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copiado: ${label}`);
    } catch {
      showToast('No se pudo copiar');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed right-4 top-20 z-40 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-100">
          {toast}
        </div>
      )}

      <section className="card-base card-elevated rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Defensa 360 — Quart (ETJ 1428/2025)</h2>
            <p className="mt-1 text-sm text-slate-300">Operativo: argumentos en 15s + generador</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="ok">TASADO: 556 LEC</Badge>
            <Badge tone="warn">NO usar compensación como eje</Badge>
          </div>
        </div>
      </section>

      <section className="card-base card-elevated rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-white">Prueba clave: Email de regularización</h3>
              <Badge tone="info">Email</Badge>
              <Badge tone="ok">Buena fe</Badge>
            </div>
            <p className="text-xs text-slate-400">{EMAIL_REGULARIZACION.descripcionCorta}</p>
            <p className="text-[11px] text-slate-500">
              No es mediación ni requisito; se aporta como cronología y buena fe (CC 7 / LEC 247).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEmailModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-100 hover:bg-violet-500/20"
            >
              <FileText className="h-3.5 w-3.5" /> Ver email completo
            </button>
            <button
              type="button"
              onClick={() => copyText(EMAIL_REGULARIZACION.cuerpo ?? '', 'email')}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20"
            >
              <Copy className="h-3.5 w-3.5" /> Copiar email
            </button>
          </div>
        </div>

        <ul className="mt-4 grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
          {(EMAIL_REGULARIZACION.bullets ?? []).map((bullet) => (
            <li key={bullet} className="rounded-lg border border-slate-700/70 bg-slate-900/40 px-3 py-2">
              • {bullet}
            </li>
          ))}
        </ul>

        {EMAIL_REGULARIZACION.riesgo && (
          <div className="mt-4 rounded-xl border border-rose-400/30 bg-rose-500/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <h4 className="text-sm font-semibold text-rose-100">Riesgo procesal</h4>
              <Badge tone={EMAIL_REGULARIZACION.riesgo.nivel === 'alto' ? 'danger' : 'warn'}>
                {EMAIL_REGULARIZACION.riesgo.nivel.toUpperCase()}
              </Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-rose-200">Por qué</p>
                <ul className="mt-1 space-y-1 text-sm text-rose-100/90">
                  {EMAIL_REGULARIZACION.riesgo.porQue.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Lectura defensiva recomendada</p>
                <ul className="mt-1 space-y-1 text-sm text-emerald-100/90">
                  {EMAIL_REGULARIZACION.riesgo.mitigacion.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="card-base rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Cifras clave</h3>
          <Badge tone="muted">ETJ 1428/2025</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Reclamado</p>
            <p className="mt-1 text-lg font-bold text-rose-300">{formatCurrency(cifras.reclamado)}</p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Pagado total</p>
            <p className="mt-1 text-lg font-bold text-emerald-300">
              {typeof cifras.pagadoTotal === 'number' ? formatCurrency(cifras.pagadoTotal) : '—'}
            </p>
            {typeof cifras.pagadoPost === 'number' && (
              <p className="mt-1 text-[11px] text-slate-400">post-despacho: {formatCurrency(cifras.pagadoPost)}</p>
            )}
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Déficit real</p>
            <p className="mt-1 text-lg font-bold text-amber-300">{formatCurrency(cifras.deficit)}</p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Pagos directos</p>
            <p className="mt-1 text-lg font-bold text-sky-300">
              {formatCurrency(eurosToCents(pagosDirectosJuan.totalCents / 100))}
            </p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Crédito por desvío (RESERVA)</p>
            <p className="mt-1 text-lg font-bold text-slate-200">{formatCurrency(cifras.reserva)}</p>
            <div className="mt-1">
              <Badge tone="muted">Reserva de acción declarativa</Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">Pilares</h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-500/20"
          >
            <FileText className="h-4 w-4" />
            Generar escrito (selección)
          </button>
        </div>

        {DEFENSA_360_QUART.map((pilar) => (
          <details key={pilar.id} className="card-base rounded-2xl p-4" open>
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">{pilar.titulo}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={probTone[pilar.probabilidad]}>{pilar.probabilidad.toUpperCase()}</Badge>
                  <Badge tone={carrilTone[pilar.carril]}>{pilar.carril.toUpperCase()}</Badge>
                </div>
              </div>
            </summary>

            <div className="mt-3 space-y-3">
              <div className="flex flex-wrap gap-2">
                {pilar.encaje.map((item) => (
                  <Badge key={item} tone="info">
                    {item}
                  </Badge>
                ))}
                {pilar.tags.map((tag) => (
                  <Badge key={tag} tone="muted">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <p className="text-sm text-slate-200">{pilar.claim15s}</p>
              <p className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-sm leading-relaxed text-slate-300">
                {pilar.parrafoEscrito}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-label="Copiar argumento 15 segundos"
                  onClick={() => copyText(pilar.claim15s, '15s')}
                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar 15s
                </button>
                <button
                  type="button"
                  aria-label="Copiar párrafo del pilar"
                  onClick={() => copyText(pilar.parrafoEscrito, 'párrafo')}
                  className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:bg-sky-500/20"
                >
                  <Copy className="h-3.5 w-3.5" /> Copiar párrafo
                </button>
                <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
                  <input
                    type="checkbox"
                    checked={Boolean(included[pilar.id])}
                    onChange={() => setIncluded((prev) => ({ ...prev, [pilar.id]: !prev[pilar.id] }))}
                    className="h-3.5 w-3.5"
                  />
                  Incluir en generador
                </label>
              </div>

              <div>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Pruebas</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  {pilar.pruebas.map((prueba, idx) => (
                    <li key={`${pilar.id}-prueba-${idx}`} className="flex flex-wrap items-center gap-2">
                      <span>• {prueba.label}</span>
                      {prueba.docId && (
                        <Link
                          to={`?tab=documentos&doc=${prueba.docId}`}
                          className="rounded-full border border-violet-400/40 bg-violet-500/10 px-2 py-0.5 text-[11px] font-semibold text-violet-200"
                        >
                          Abrir
                        </Link>
                      )}
                      {prueba.note && <span className="text-xs text-slate-500">{prueba.note}</span>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-rose-200">Lo que dirá Vicenta</h4>
                  <ul className="mt-2 space-y-1 text-sm text-rose-100/90">
                    {pilar.contra.vicenta.map((item, idx) => (
                      <li key={`${pilar.id}-vicenta-${idx}`}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Respuesta</h4>
                  <ul className="mt-2 space-y-1 text-sm text-emerald-100/90">
                    {pilar.contra.respuesta.map((item, idx) => (
                      <li key={`${pilar.id}-respuesta-${idx}`}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </details>
        ))}
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generador de escrito — Defensa 360"
        footer={(
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => copyText(escritoGenerado, 'escrito')}
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"
            >
              Copiar escrito
            </button>
          </div>
        )}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Se incluirán {selectedPilares.length} pilares (tasados/contexto según tu selección).
          </p>
          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={includeBuenaFe}
              onChange={() => setIncludeBuenaFe((prev) => !prev)}
              className="h-3.5 w-3.5"
            />
            Añadir buena fe (email regularización)
          </label>
          <textarea
            readOnly
            value={escritoGenerado}
            className="h-[48dvh] w-full rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-xs leading-relaxed text-slate-200"
          />
        </div>
      </Modal>

      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title="Email de regularización"
        footer={(
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEmailModalOpen(false)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={() => copyText(EMAIL_REGULARIZACION.cuerpo ?? '', 'email')}
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100"
            >
              Copiar email
            </button>
          </div>
        )}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Riesgo procesal del email: lectura contextual para buena fe y cronología objetiva (no requisito procesal).
          </p>
          <div className="max-h-[50dvh] overflow-auto rounded-xl border border-slate-700 bg-slate-950/70 p-3 text-sm leading-relaxed text-slate-200">
            <p className="whitespace-pre-wrap">
              {highlight(EMAIL_REGULARIZACION.cuerpo ?? '', [
                'iré poniéndome al día con los pagos',
                'conforme pueda',
                'yo no puedo pagar tanto',
              ])}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
