import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, FileText } from 'lucide-react';
import Badge from '../../../ui/components/Badge';
import { Modal } from '../../../components/Modal';
import { formatCurrency } from '../../../utils/validators';
import {
  argumentosContestacion,
  checklistVista,
  desgloseMislata,
  frasesClaveVista,
  nuestrosArgumentos,
  procedimientoMislata,
  type ArgumentoContrario,
} from '../../../data/mislata';

const CHECKLIST_STORAGE_KEY = 'mislata_checklist_vista_v1';

type Riesgo = 'bajo' | 'medio' | 'alto';

const riskTone: Record<Riesgo, 'ok' | 'warn' | 'danger'> = {
  bajo: 'ok',
  medio: 'warn',
  alto: 'danger',
};

const resolveRisk = (argumento: ArgumentoContrario): Riesgo => {
  if (argumento.estado === 'peligroso') {
    return 'alto';
  }
  if (argumento.estado === 'rebatible') {
    return 'medio';
  }
  return 'bajo';
};

const resolveProbability = (argumento: ArgumentoContrario): string => {
  const risk = resolveRisk(argumento);
  if (risk === 'alto') return '35%';
  if (risk === 'medio') return '60%';
  return '85%';
};

const getClaim15s = (texto: string): string => {
  const sentence = texto.split(/[.!?]\s/).find((part) => part.trim().length > 30);
  return sentence ? `${sentence.trim()}.` : texto;
};

const groupedFrases = frasesClaveVista.reduce<Record<string, string[]>>((acc, item) => {
  acc[item.contexto] = [...(acc[item.contexto] || []), item.frase];
  return acc;
}, {});

const docsClave = [
  { id: 'mislata-demanda-juicio-verbal', label: 'Demanda JV' },
  { id: 'mislata-recurso-reposicion', label: 'Recurso reposición' },
  { id: 'mislata-escrito-impugnacion', label: 'Escrito impugnación' },
  { id: 'mislata-contestacion-demanda', label: 'Contestación demanda' },
  { id: 'mislata-solicitud-prueba', label: 'Solicitud prueba' },
  { id: 'mislata-contra-prueba', label: 'Contra-prueba' },
] as const;

export function TabDefensa360Mislata() {
  const [included, setIncluded] = useState<Record<number, boolean>>(
    Object.fromEntries(argumentosContestacion.map((arg) => [arg.id, true]))
  );
  const [toast, setToast] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [includeIntro, setIncludeIntro] = useState(true);
  const [includeSuplico, setIncludeSuplico] = useState(true);
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>(() => {
    if (typeof window === 'undefined') {
      return Object.fromEntries(checklistVista.map((item) => [item.id, item.hecho]));
    }

    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!stored) {
      return Object.fromEntries(checklistVista.map((item) => [item.id, item.hecho]));
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, boolean>;
      return Object.fromEntries(
        checklistVista.map((item) => [item.id, Boolean(parsed[String(item.id)])])
      );
    } catch {
      return Object.fromEntries(checklistVista.map((item) => [item.id, item.hecho]));
    }
  });

  const selectedExceptions = useMemo(
    () => argumentosContestacion.filter((arg) => included[arg.id]),
    [included]
  );

  const generatedText = useMemo(() => {
    const intro = includeIntro
      ? [
          'AL JUZGADO DE PRIMERA INSTANCIA E INSTRUCCIÓN DE MISLATA QUE POR TURNO CORRESPONDA, comparece esta parte y, como mejor proceda en Derecho, DICE:',
          'Que formula guion sintético para vista en el J.V. 1185/2025, manteniendo la acción de regreso del art. 1145 CC y oponiéndose a las excepciones planteadas por la demandada.',
        ]
      : [];

    const bloques = selectedExceptions.map((arg, index) => (
      `${index + 1}. ${arg.titulo}\n${arg.nuestraReplica}`
    ));

    const suplico = includeSuplico
      ? [
          'SUPLICO AL JUZGADO: que desestime las excepciones de litispendencia, prejudicialidad y compensación alegadas por la demandada, continúe el procedimiento y dicte resolución conforme a Derecho con expresa imposición de costas si procede.',
        ]
      : [];

    return [...intro, '', ...bloques, '', ...suplico].filter(Boolean).join('\n');
  }, [includeIntro, includeSuplico, selectedExceptions]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 1800);
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copiado: ${label}`);
    } catch {
      showToast('No se pudo copiar');
    }
  };

  const toggleChecklist = (id: number) => {
    setChecklistState((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleChecklistAll = (value: boolean) => {
    const next = Object.fromEntries(checklistVista.map((item) => [item.id, value]));
    setChecklistState(next);
    window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(next));
  };

  const downloadTxt = () => {
    const blob = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mislata-defensa-1145.txt';
    a.click();
    URL.revokeObjectURL(url);
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
            <h2 className="text-xl font-bold text-white">Defensa 1145 — Mislata (J.V. 1185/2025)</h2>
            <p className="mt-1 text-sm text-slate-300">Operativo de vista: argumentos de réplica, frases y generador.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="ok">ROL: {procedimientoMislata.rol}</Badge>
            <Badge tone="info">ART. 1145 CC</Badge>
            <Badge tone="warn">OBJETIVO: {formatCurrency(procedimientoMislata.cuantiaReclamada)}</Badge>
          </div>
        </div>
      </section>

      <section className="card-base card-elevated rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Docs clave (1 click)</h3>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-100 hover:bg-blue-500/20"
          >
            <FileText className="h-4 w-4" />
            Generar escrito (selección)
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {docsClave.map((doc) => (
            <Link
              key={doc.id}
              to={`?tab=documentos&doc=${doc.id}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 hover:border-emerald-400/40"
            >
              {doc.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="card-base rounded-2xl p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Cifras clave</h3>
          <Badge tone="muted">Periodo oct 2023 — jun 2025</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Cuantía reclamada</p>
            <p className="mt-1 text-lg font-bold text-rose-300">{formatCurrency(procedimientoMislata.cuantiaReclamada)}</p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Pagos préstamo</p>
            <p className="mt-1 text-lg font-bold text-emerald-300">{formatCurrency(desgloseMislata.pagosPrestamo)}</p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Aportación neta Vicenta</p>
            <p className="mt-1 text-lg font-bold text-sky-300">{formatCurrency(desgloseMislata.aportacionVicenta)}</p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Exceso Juan</p>
            <p className="mt-1 text-lg font-bold text-amber-300">{formatCurrency(desgloseMislata.excesoJuan)}</p>
          </div>
          <div className="card-base card-subtle rounded-xl p-3">
            <p className="text-xs uppercase tracking-wide text-slate-400">Periodo</p>
            <p className="mt-1 text-sm font-semibold text-slate-200">Oct 2023 — Jun 2025</p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-white">Núcleo del caso</h3>
        {nuestrosArgumentos.map((argumento) => (
          <details key={argumento.id} className="card-base rounded-2xl p-4" open>
            <summary className="cursor-pointer list-none">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">{argumento.titulo}</p>
                <Badge tone="muted">{argumento.fundamento}</Badge>
              </div>
            </summary>
            <div className="mt-3 space-y-3">
              <p className="text-sm text-slate-200">{argumento.texto}</p>
              <p className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-sm italic text-amber-100">
                {argumento.cita}
              </p>
              <button
                type="button"
                onClick={() => copyText(`${argumento.titulo}\n${argumento.texto}\n${argumento.cita}`, argumento.titulo)}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20"
              >
                <Copy className="h-3.5 w-3.5" /> Copiar
              </button>
            </div>
          </details>
        ))}
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold text-white">Excepciones de Vicenta → réplica</h3>
        {argumentosContestacion.map((arg) => {
          const risk = resolveRisk(arg);
          const probability = resolveProbability(arg);
          return (
            <details key={arg.id} className="card-base rounded-2xl p-4" open>
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">{arg.titulo}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={riskTone[risk]}>Riesgo: {risk}</Badge>
                    <Badge tone="info">Probabilidad: {probability}</Badge>
                  </div>
                </div>
              </summary>

              <div className="mt-3 space-y-3">
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-rose-200">Alegación de Vicenta</p>
                  <p className="mt-1 text-sm text-rose-100">{arg.argumentoVicenta}</p>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">Nuestra réplica</p>
                  <p className="mt-1 whitespace-pre-line text-sm text-emerald-100">{arg.nuestraReplica}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {arg.articulosInvocados.map((articulo) => (
                    <Badge key={articulo} tone="info">{articulo}</Badge>
                  ))}
                  {arg.jurisprudenciaAFavor.map((item) => (
                    <Badge key={item} tone="muted">{item}</Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => copyText(getClaim15s(arg.nuestraReplica), '15s')}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/20"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copiar 15s
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText(arg.nuestraReplica, 'párrafo')}
                    className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100 hover:bg-sky-500/20"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copiar párrafo
                  </button>
                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={Boolean(included[arg.id])}
                      onChange={() => setIncluded((prev) => ({ ...prev, [arg.id]: !prev[arg.id] }))}
                      className="h-3.5 w-3.5"
                    />
                    Incluir en generador
                  </label>
                </div>
              </div>
            </details>
          );
        })}
      </section>

      <section className="card-base rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Frases clave para vista</h3>
          <Badge tone="warn">No improvisar: 10 segundos cada una</Badge>
        </div>
        {Object.entries(groupedFrases).map(([contexto, frases]) => (
          <div key={contexto} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{contexto}</p>
            {frases.map((frase) => (
              <div key={frase} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 flex items-start justify-between gap-3">
                <span className="text-sm italic text-amber-100">{frase}</span>
                <button
                  type="button"
                  onClick={() => copyText(frase, 'frase')}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 px-2 py-1 text-[10px] font-semibold text-amber-200 hover:border-amber-400/70"
                >
                  <Copy className="h-3 w-3" /> Copiar
                </button>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="card-base rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-white">Checklist vista</h3>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleChecklistAll(true)}
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/20"
            >
              Marcar todo
            </button>
            <button
              type="button"
              onClick={() => handleChecklistAll(false)}
              className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700/70"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {checklistVista.map((item) => (
            <label key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-700/60 bg-slate-900/40 px-3 py-2 text-sm text-slate-200">
              <input
                type="checkbox"
                checked={Boolean(checklistState[item.id])}
                onChange={() => toggleChecklist(item.id)}
                className="h-4 w-4"
              />
              <span>{item.texto}</span>
            </label>
          ))}
        </div>
      </section>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Guion / Escrito de vista (selección)"
        size="lg"
        footer={(
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText(generatedText, 'escrito completo')}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-3 py-1 text-xs font-semibold text-emerald-200 hover:border-emerald-300/70"
            >
              <Copy className="h-3.5 w-3.5" /> Copiar completo
            </button>
            <button
              type="button"
              onClick={downloadTxt}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 px-3 py-1 text-xs font-semibold text-sky-200 hover:border-sky-300/70"
            >
              Descargar .txt
            </button>
          </div>
        )}
      >
        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs">
              <input
                type="checkbox"
                checked={includeIntro}
                onChange={() => setIncludeIntro((prev) => !prev)}
                className="h-3.5 w-3.5"
              />
              Incluir intro fija
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-1.5 text-xs">
              <input
                type="checkbox"
                checked={includeSuplico}
                onChange={() => setIncludeSuplico((prev) => !prev)}
                className="h-3.5 w-3.5"
              />
              Incluir SUPLICO final
            </label>
          </div>
          <div className="rounded-xl border border-slate-700/60 bg-slate-900/50 p-3 text-xs text-slate-200">
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{generatedText}</pre>
          </div>
        </div>
      </Modal>
    </div>
  );
}
