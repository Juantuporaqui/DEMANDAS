import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clipboard,
  Clock,
  FileText,
  Search,
  Scale,
  Users
} from 'lucide-react';
import { eventsRepo } from '../../../db/repositories';
import type { Event } from '../../../types';
import { formatDateTime } from '../../../utils/dates';
import { printElementAsDocument } from '../../../utils/printDocument';
import { SectionCard } from '../../analytics/components/SectionCard';
import { CopyButton } from '../../analytics/prescripcion/CopyButton';
import { PICASSENT_AP } from '../../../data/PO-715-2024-picassent/audienciaPrevia.picassent';
import { AP_EXCEPTIONS_CATALOG } from './ap/exceptionsCatalog';
import { computeAvailability, computePreclusionStatus } from './ap/preclusionEngine';
import { APCommandCenterPresentation } from '../../../modules/ap/ui/APCommandCenterPresentation';
import type { APInputs } from './ap/types';
import type {
  EstadoHechoControvertido,
  TipoPrueba
} from '../../../data/audienciaPrevia';

type TabAudienciaPreviaPicassentProps = {
  caseId: string;
  isReadMode?: boolean;
};

type ChecklistState = Record<string, boolean>;
type HechoState = Record<string, { done: boolean; notas: string; prioridad: 'baja' | 'media' | 'alta' }>;
type AlegacionState = Record<string, { done: boolean; notas: string }>;
type BloqueState = Record<string, { done: boolean; notas: string }>;
type OverrideState = Record<string, { forcedEnabled: boolean; reason: string }>;

type FilterEstado = 'todos' | EstadoHechoControvertido;
type FilterPrueba = 'todos' | TipoPrueba;
type FilterRiesgo = 'todos' | 'baja' | 'media' | 'alta';

const checklistStorageKey = 'ap.picassent.checklist.v1';
const hechosStorageKey = 'ap.picassent.hechos.v1';
const alegacionesStorageKey = 'ap.picassent.alegaciones.v1';
const bloquesStorageKey = 'ap.picassent.bloques.v1';
const salaStorageKey = 'ap.picassent.sala.v1';
const apInputsStorageKey = 'ap.picassent.inputs.v1';
const apOverridesStorageKey = 'ap.picassent.overrides.v1';

const estadoConfig: Record<EstadoHechoControvertido, { bg: string; border: string; text: string; icon: typeof Clock }> = {
  pendiente: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    icon: Clock,
  },
  propuesto: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    icon: AlertCircle,
  },
  admitido: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    icon: CheckCircle,
  },
};

const pruebaConfig: Record<TipoPrueba, { bg: string; border: string; text: string; icon: typeof FileText; label: string }> = {
  documental: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    icon: FileText,
    label: 'Documental',
  },
  pericial: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    icon: Search,
    label: 'Pericial',
  },
  testifical: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    icon: Users,
    label: 'Testifical',
  },
  interrogatorio: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    icon: Scale,
    label: 'Interrogatorio',
  },
};

const riesgoConfig: Record<'baja' | 'media' | 'alta', { bg: string; border: string; text: string; label: string }> = {
  baja: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    label: 'Bajo',
  },
  media: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    label: 'Medio',
  },
  alta: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-300',
    label: 'Alto',
  },
};

const navItems = [
  { id: 'saneamiento', label: 'Saneamiento' },
  { id: 'excepciones', label: 'Excepciones' },
  { id: 'matriz', label: 'Matriz' },
  { id: 'escenarios', label: 'Escenarios' },
  { id: 'hechos', label: 'Hechos' },
  { id: 'prueba', label: 'Prueba' },
  { id: 'bloques', label: 'Bloques' },
  { id: 'guiones', label: 'Guiones' },
];

const fases = [
  {
    id: 'fase-saneamiento',
    titulo: 'Saneamiento',
    resumen: 'Depura objeto, excepciones y límites del debate.',
    objetivo: 'Juan: acotar y excluir lo impertinente.',
  },
  {
    id: 'fase-hechos',
    titulo: 'Hechos',
    resumen: 'Se fijan los hechos controvertidos y pacíficos.',
    objetivo: 'Juan: dejar constancia de carga probatoria.',
  },
  {
    id: 'fase-prueba',
    titulo: 'Prueba',
    resumen: 'Proposición y admisión de prueba.',
    objetivo: 'Juan: oficios, exhibición y pericial.',
  },
  {
    id: 'fase-cierre',
    titulo: 'Cierre',
    resumen: 'Conclusiones operativas para decisión.',
    objetivo: 'Juan: liquidación neta y compensación.',
  },
];

const safeParse = <T,>(value: string | null, fallback: T) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn('Invalid localStorage data, resetting.', error);
    return fallback;
  }
};

export function TabAudienciaPreviaPicassent({ caseId, isReadMode = false }: TabAudienciaPreviaPicassentProps) {
  const [audienciaEvent, setAudienciaEvent] = useState<Event | null>(null);
  const [selectedGuion, setSelectedGuion] = useState<'s90' | 'm3' | 'm5'>('s90');
  const [checklistState, setChecklistState] = useState<ChecklistState>({});
  const [hechosState, setHechosState] = useState<HechoState>({});
  const [alegacionesState, setAlegacionesState] = useState<AlegacionState>({});
  const [bloquesState, setBloquesState] = useState<BloqueState>({});
  const [openChecklist, setOpenChecklist] = useState<Record<string, boolean>>({});
  const [openAlegaciones, setOpenAlegaciones] = useState<Record<string, boolean>>({});
  const [openBloques, setOpenBloques] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<FilterEstado>('todos');
  const [filterPrueba, setFilterPrueba] = useState<FilterPrueba>('todos');
  const [filterRiesgo, setFilterRiesgo] = useState<FilterRiesgo>('todos');
  const [salaMode, setSalaMode] = useState(false);
  const [copyVariant, setCopyVariant] = useState<'legacy' | 'improved'>('legacy');
  const [apInputs, setApInputs] = useState<APInputs>({
    raisedInContestacion: true,
    declinatoriaFiled: false,
    fueroImperativoApplies: false,
  });
  const [apOverrides, setApOverrides] = useState<OverrideState>({});
  const [expandAllCards, setExpandAllCards] = useState(false);
  const [printingInProgress, setPrintingInProgress] = useState(false);
  const printContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const allEvents = await eventsRepo.getAll();
      const matches = allEvents
        .filter((event) => event.caseId === caseId)
        .filter((event) => event.title?.toLowerCase().includes('audiencia previa'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const upcoming = matches.find((event) => new Date(event.date).getTime() >= Date.now()) ?? null;

      if (isMounted) {
        setAudienciaEvent(upcoming);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedChecklist = safeParse<ChecklistState>(localStorage.getItem(checklistStorageKey), {});
    const storedHechos = safeParse<HechoState>(localStorage.getItem(hechosStorageKey), {});
    const storedAlegaciones = safeParse<AlegacionState>(localStorage.getItem(alegacionesStorageKey), {});
    const storedBloques = safeParse<BloqueState>(localStorage.getItem(bloquesStorageKey), {});
    const storedSala = safeParse<boolean>(localStorage.getItem(salaStorageKey), false);
    const storedApInputs = safeParse<APInputs>(localStorage.getItem(apInputsStorageKey), {
      raisedInContestacion: true,
      declinatoriaFiled: false,
      fueroImperativoApplies: false,
    });
    const storedApOverrides = safeParse<OverrideState>(localStorage.getItem(apOverridesStorageKey), {});

    const checklistDefaults = PICASSENT_AP.checklist.reduce<ChecklistState>((acc, item) => {
      acc[item.id] = false;
      return acc;
    }, {});

    const hechosDefaults = PICASSENT_AP.hechosControvertidos.reduce<HechoState>((acc, item) => {
      acc[String(item.id)] = { done: false, notas: '', prioridad: 'media' };
      return acc;
    }, {});

    const alegacionesDefaults = PICASSENT_AP.alegacionesComplementarias.reduce<AlegacionState>((acc, item) => {
      acc[String(item.id)] = { done: false, notas: '' };
      return acc;
    }, {});

    const bloquesDefaults = PICASSENT_AP.bloques.reduce<BloqueState>((acc, item) => {
      acc[item.id] = { done: false, notas: '' };
      return acc;
    }, {});

    setChecklistState(() => ({
      ...checklistDefaults,
      ...storedChecklist,
    }));
    setHechosState(() => ({
      ...hechosDefaults,
      ...storedHechos,
    }));
    setAlegacionesState(() => ({
      ...alegacionesDefaults,
      ...storedAlegaciones,
    }));
    setBloquesState(() => ({
      ...bloquesDefaults,
      ...storedBloques,
    }));
    setSalaMode(storedSala);
    setApInputs(storedApInputs);
    setApOverrides(storedApOverrides);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(checklistStorageKey, JSON.stringify(checklistState));
  }, [checklistState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(hechosStorageKey, JSON.stringify(hechosState));
  }, [hechosState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(alegacionesStorageKey, JSON.stringify(alegacionesState));
  }, [alegacionesState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(bloquesStorageKey, JSON.stringify(bloquesState));
  }, [bloquesState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(salaStorageKey, JSON.stringify(salaMode));
  }, [salaMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(apInputsStorageKey, JSON.stringify(apInputs));
  }, [apInputs]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(apOverridesStorageKey, JSON.stringify(apOverrides));
  }, [apOverrides]);

  const salaHiddenClass = salaMode ? 'hidden print:block' : '';
  const forceExpandedView = expandAllCards || printingInProgress;

  const handleToggleExpandAll = () => {
    setExpandAllCards((prev) => {
      const next = !prev;
      if (next) {
        setOpenChecklist(Object.fromEntries(PICASSENT_AP.checklist.map((item) => [item.id, true])));
        setOpenAlegaciones(Object.fromEntries(PICASSENT_AP.alegacionesComplementarias.map((item) => [String(item.id), true])));
        setOpenBloques(Object.fromEntries(PICASSENT_AP.bloques.map((item) => [item.id, true])));
      } else {
        setOpenChecklist({});
        setOpenAlegaciones({});
        setOpenBloques({});
      }
      return next;
    });
  };

  const handlePrint = async () => {
    setPrintingInProgress(true);
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    try {
      if (printContainerRef.current) {
        await printElementAsDocument({
          element: printContainerRef.current,
          title: 'Audiencia previa · Picassent',
        });
      } else {
        window.print();
      }
    } finally {
      setPrintingInProgress(false);
    }
  };

  const audienciaDateLabel = useMemo(() => {
    if (!audienciaEvent) {
      return '(sin señalamiento cargado)';
    }
    return formatDateTime(new Date(audienciaEvent.date).getTime());
  }, [audienciaEvent]);

  const audienciaCountdownLabel = useMemo(() => {
    if (!audienciaEvent) return null;
    const eventDate = new Date(audienciaEvent.date);
    const diffMs = eventDate.getTime() - Date.now();
    if (diffMs <= 0) return null;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `Faltan ${diffDays} días`;
  }, [audienciaEvent]);

  const checklistByFase = useMemo(() => {
    return PICASSENT_AP.checklist.reduce<Record<string, typeof PICASSENT_AP.checklist>>((acc, item) => {
      if (!acc[item.fase]) acc[item.fase] = [];
      acc[item.fase].push(item);
      return acc;
    }, {});
  }, []);

  const filteredHechos = useMemo(() => {
    return PICASSENT_AP.hechosControvertidos.filter((hecho) => {
      const state = hechosState[String(hecho.id)];
      const matchEstado = filterEstado === 'todos' || hecho.estado === filterEstado;
      const matchPrueba = filterPrueba === 'todos' || hecho.tipoPrueba === filterPrueba;
      const matchRiesgo = filterRiesgo === 'todos' || state?.prioridad === filterRiesgo;
      const matchSearch = searchTerm === '' ||
        hecho.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hecho.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      return matchEstado && matchPrueba && matchRiesgo && matchSearch;
    });
  }, [filterEstado, filterPrueba, filterRiesgo, hechosState, searchTerm]);

  const countByEstado = useMemo(() => ({
    pendiente: PICASSENT_AP.hechosControvertidos.filter(h => h.estado === 'pendiente').length,
    propuesto: PICASSENT_AP.hechosControvertidos.filter(h => h.estado === 'propuesto').length,
    admitido: PICASSENT_AP.hechosControvertidos.filter(h => h.estado === 'admitido').length,
  }), []);

  const countByPrueba = useMemo(() => ({
    documental: PICASSENT_AP.hechosControvertidos.filter(h => h.tipoPrueba === 'documental').length,
    pericial: PICASSENT_AP.hechosControvertidos.filter(h => h.tipoPrueba === 'pericial').length,
    testifical: PICASSENT_AP.hechosControvertidos.filter(h => h.tipoPrueba === 'testifical').length,
    interrogatorio: PICASSENT_AP.hechosControvertidos.filter(h => h.tipoPrueba === 'interrogatorio').length,
  }), []);

  const countByRiesgo = useMemo(() => ({
    baja: Object.values(hechosState).filter((item) => item?.prioridad === 'baja').length,
    media: Object.values(hechosState).filter((item) => item?.prioridad === 'media').length,
    alta: Object.values(hechosState).filter((item) => item?.prioridad === 'alta').length,
  }), [hechosState]);


  const preclusionCards = useMemo(() => {
    return AP_EXCEPTIONS_CATALOG.map((card) => {
      const result = computePreclusionStatus(card.id, apInputs, { hasAdmisisionDecretoCompetencia: true });
      const availability = computeAvailability(result, card);
      const override = apOverrides[card.id] ?? { forcedEnabled: false, reason: '' };
      const enabled = availability.defaultEnabled || override.forcedEnabled;
      return { card, result, availability, override, enabled };
    });
  }, [apInputs, apOverrides]);

  const handleNavClick = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderHechoCard = (hecho: (typeof PICASSENT_AP.hechosControvertidos)[number]) => {
    const hechoState = hechosState[String(hecho.id)] ?? { done: false, notas: '', prioridad: 'media' };
    const estado = estadoConfig[hecho.estado];
    const prueba = pruebaConfig[hecho.tipoPrueba];
    const riesgo = riesgoConfig[hechoState.prioridad];
    const EstadoIcon = estado.icon;
    const PruebaIcon = prueba.icon;

    return (
      <div
        key={hecho.id}
        className={`rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 ${hechoState.done ? '' : 'print:hidden'}`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] ${estado.bg} ${estado.border} ${estado.text}`}>
                <EstadoIcon className="h-3 w-3" />
                {hecho.estado}
              </div>
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] ${prueba.bg} ${prueba.border} ${prueba.text}`}>
                <PruebaIcon className="h-3 w-3" />
                {prueba.label}
              </div>
              <div className={`rounded-full border px-3 py-1 text-[11px] ${riesgo.bg} ${riesgo.border} ${riesgo.text}`}>
                Riesgo {riesgo.label}
              </div>
            </div>
            <div className="text-sm font-semibold text-white">{hecho.titulo}</div>
            <div className="text-xs text-slate-200">{hecho.descripcion}</div>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <CopyButton text={`${hecho.titulo}\n${hecho.descripcion}`} label="Copiar" />
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[auto_1fr] print:hidden">
          <label className="flex items-center gap-2 text-xs text-slate-200">
            <input
              type="checkbox"
              checked={hechoState.done}
              onChange={(event) =>
                setHechosState((prev) => ({
                  ...prev,
                  [String(hecho.id)]: {
                    ...prev[String(hecho.id)],
                    done: event.target.checked,
                  },
                }))
              }
              className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            />
            Usar en sala
          </label>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200">
            <span>Riesgo:</span>
            <select
              value={hechoState.prioridad}
              aria-label="Prioridad de riesgo"
              onChange={(event) =>
                setHechosState((prev) => ({
                  ...prev,
                  [String(hecho.id)]: {
                    ...prev[String(hecho.id)],
                    prioridad: event.target.value as 'baja' | 'media' | 'alta',
                  },
                }))
              }
              className="rounded-lg border border-slate-700/50 bg-slate-900/60 px-2 py-1 text-xs text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              <option value="baja">Bajo</option>
              <option value="media">Medio</option>
              <option value="alta">Alto</option>
            </select>
          </div>
        </div>
        <textarea
          value={hechoState.notas}
          onChange={(event) =>
            setHechosState((prev) => ({
              ...prev,
              [String(hecho.id)]: {
                ...prev[String(hecho.id)],
                notas: event.target.value,
              },
            }))
          }
          placeholder="Notas (uso en sala, enfoque, objeciones)."
          className={`mt-3 w-full rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 text-xs text-white placeholder-slate-500 ${isReadMode ? 'hidden' : ''} print:hidden`}
          rows={3}
        />
      </div>
    );
  };

  return (
    <div ref={printContainerRef} className="space-y-6 animate-in fade-in duration-500 print:bg-white print:text-slate-900">
      <SectionCard
        title="Audiencia Previa — Centro de mando"
        subtitle={`Picassent · ${audienciaDateLabel}${audienciaCountdownLabel ? ` · ${audienciaCountdownLabel}` : ''} · Objetivo: saneamiento, hechos, prueba`}
        action={(
          <div className="flex flex-wrap gap-2">
            <Link
              to="/audiencia/telepronter?proc=picassent"
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-100 transition hover:border-blue-400/60 hover:bg-blue-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300"
            >
              <Clipboard className="h-3.5 w-3.5" />
              Abrir Teleprónter
            </Link>
            <Link
              to="/audiencia/checklist?proc=picassent"
              className="inline-flex items-center gap-2 rounded-full border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-slate-400/60 hover:bg-slate-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300"
            >
              <Calendar className="h-3.5 w-3.5" />
              Abrir Checklist
            </Link>
            <button
              type="button"
              onClick={() => setSalaMode((prev) => !prev)}
              aria-pressed={salaMode}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                salaMode
                  ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200 focus-visible:outline-emerald-300'
                  : 'border-slate-600/60 bg-slate-800/60 text-slate-200 hover:border-emerald-400/40 focus-visible:outline-slate-300'
              }`}
            >
              Modo Sala {salaMode ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={handleToggleExpandAll}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/50 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-100 transition hover:border-sky-300/70 hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 print:hidden"
            >
              {expandAllCards ? 'Contraer menús' : 'Expandir menús'}
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:border-amber-300/70 hover:bg-amber-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 print:hidden"
            >
              Imprimir AP
            </button>
            <CopyButton text={copyVariant === 'legacy' ? PICASSENT_AP.guiones.s90 : PICASSENT_AP.guiones.s90} label="Copiar guion 90s" />
          </div>
        )}
      >
        <div className="text-sm text-slate-200">
          Centro de mando operativo para preparar la Audiencia Previa conforme a la LEC.
        </div>
      </SectionCard>


      <APCommandCenterPresentation />

      {/* Atajos operativos */}
      <SectionCard id="atajos" title="Atajos operativos">
        <p className="text-xs text-slate-400 mb-3">
          Aquí se ejecuta la sala. La matriz vive en Estrategia. Las tarjetas editables viven en War Room.
        </p>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Link
            to={`/cases/${caseId}?tab=estrategia`}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 transition hover:border-emerald-400/60"
          >
            <div className="text-xs font-bold text-emerald-300 mb-1">Abrir Matriz estratégica</div>
            <p className="text-[11px] text-slate-400">Líneas de defensa, riesgos, escenarios.</p>
          </Link>
          <Link
            to="/warroom?caseId=picassent"
            className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 transition hover:border-rose-400/60"
          >
            <div className="text-xs font-bold text-rose-300 mb-1">Abrir War Room (tarjetas)</div>
            <p className="text-[11px] text-slate-400">Tácticas rápidas ataque/respuesta.</p>
          </Link>
          <Link
            to={`/warroom/new?caseId=${caseId}&returnTo=${encodeURIComponent(`/cases/${caseId}?tab=audiencia`)}&caseKey=picassent`}
            className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 transition hover:border-amber-400/60"
          >
            <div className="text-xs font-bold text-amber-300 mb-1">Nueva tarjeta (War Room)</div>
            <p className="text-[11px] text-slate-400">Crear tarjeta táctica y volver aquí.</p>
          </Link>
          <Link
            to={`/analytics/prescripcion?caseId=${caseId}`}
            className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 transition hover:border-amber-400/60"
          >
            <div className="text-xs font-bold text-amber-300 mb-1">Prescripción</div>
            <p className="text-[11px] text-slate-400">Mapa de escenarios + DT 5ª.</p>
          </Link>
          <Link
            to="/analytics/liquidacion-justa"
            className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 transition hover:border-indigo-400/60"
          >
            <div className="text-xs font-bold text-indigo-300 mb-1">Liquidación Justa</div>
            <p className="text-[11px] text-slate-400">Bases de liquidación y pasivo.</p>
          </Link>
        </div>
      </SectionCard>

      <div className={`sticky top-4 z-10 rounded-2xl border border-slate-700/40 bg-slate-900/80 p-2 backdrop-blur print:hidden ${salaMode ? 'hidden' : ''}`}>
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className="rounded-full border border-slate-600/50 bg-slate-800/60 px-4 py-1.5 text-xs font-semibold text-slate-100 transition hover:border-emerald-500/60 hover:text-emerald-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <SectionCard id="saneamiento" title="Fases AP (LEC 414–430)" className={`print:hidden ${salaMode ? 'hidden' : ''}`}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {fases.map((fase) => (
            <div key={fase.id} className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
              <div className="text-sm font-semibold text-white">{fase.titulo}</div>
              <div className="mt-2 text-xs text-slate-200">{fase.resumen}</div>
              <div className="mt-2 text-xs text-emerald-200">{fase.objetivo}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="excepciones" title="Excepciones procesales en AP (Picassent)" className="print:break-inside-avoid">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
            <div className="text-sm font-semibold text-white">{PICASSENT_AP.excepcionesProcesales.saneamiento.sala.titulo}</div>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-200">
              {PICASSENT_AP.excepcionesProcesales.saneamiento.sala.contenido.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-100">
              {PICASSENT_AP.excepcionesProcesales.saneamiento.sala.base.map((line) => (
                <span key={line} className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1">
                  {line}
                </span>
              ))}
            </div>
            {!salaMode && (
              <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-200 print:hidden">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                  {PICASSENT_AP.excepcionesProcesales.saneamiento.interno.titulo}
                </div>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {PICASSENT_AP.excepcionesProcesales.saneamiento.interno.contenido.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-emerald-100/90">
                  {PICASSENT_AP.excepcionesProcesales.saneamiento.interno.notas.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {PICASSENT_AP.excepcionesProcesales.excepciones.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">{item.titulo}</div>
                    <p className="mt-2 text-xs text-slate-200">{item.sala.mensaje}</p>
                  </div>
                  <CopyButton
                    text={`${item.titulo}\n${item.sala.mensaje}\n${item.sala.pedir.join('\n')}`}
                    label="Copiar"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-200">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Pedir</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {item.sala.pedir.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-100">
                  {item.sala.base.map((line) => (
                    <span key={line} className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1">
                      {line}
                    </span>
                  ))}
                </div>
                {!salaMode && (
                  <div className="mt-4 grid gap-3 text-xs text-slate-200 print:hidden">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Checklist</div>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        {item.interno.checklist.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Riesgos</div>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        {item.interno.riesgos.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Contraataques</div>
                      <ul className="mt-2 list-disc space-y-1 pl-4">
                        {item.interno.contraataques.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">Guion de sala + texto copiable para acta</div>
                <p className="mt-2 text-xs text-slate-200">Versión principal y subsidiaria para dejar constancia en acta.</p>
              </div>
              <CopyButton
                text={[
                  'PRINCIPAL:',
                  PICASSENT_AP.excepcionesProcesales.guionActa.sala.principal,
                  '',
                  'SUBSIDIARIO:',
                  PICASSENT_AP.excepcionesProcesales.guionActa.sala.subsidiario
                ].join('\n')}
                label="Copiar acta"
              />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-200">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em]">Principal</div>
                <p className="mt-2 whitespace-pre-wrap">{PICASSENT_AP.excepcionesProcesales.guionActa.sala.principal}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em]">Subsidiario</div>
                <p className="mt-2 whitespace-pre-wrap">{PICASSENT_AP.excepcionesProcesales.guionActa.sala.subsidiario}</p>
              </div>
            </div>
            {!salaMode && (
              <div className="mt-4 grid gap-3 md:grid-cols-2 text-xs text-slate-200 print:hidden">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Notas internas (principal)</div>
                  <p className="mt-2 whitespace-pre-wrap">{PICASSENT_AP.excepcionesProcesales.guionActa.interno.principal}</p>
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Notas internas (subsidiario)</div>
                  <p className="mt-2 whitespace-pre-wrap">{PICASSENT_AP.excepcionesProcesales.guionActa.interno.subsidiario}</p>
                </div>
                <div className="md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Checklist</div>
                  <ul className="mt-2 list-disc space-y-1 pl-4">
                    {PICASSENT_AP.excepcionesProcesales.guionActa.interno.checklist.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <details open={forceExpandedView} className="rounded-2xl border border-dashed border-slate-700/60 bg-slate-900/30 p-4">
            <summary className="cursor-pointer text-xs font-semibold text-slate-200">
              {PICASSENT_AP.excepcionesProcesales.jurisprudenciaPendiente.titulo}
            </summary>
            <p className="mt-2 text-xs text-amber-200">
              {PICASSENT_AP.excepcionesProcesales.jurisprudenciaPendiente.nota}
            </p>
          </details>
        </div>
      </SectionCard>

      <SectionCard title="Motor de preclusión y activación (diagnóstico operativo)" className="print:break-inside-avoid">
        <div className="grid gap-3 md:grid-cols-3 print:hidden">
          <label className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 text-xs text-slate-200">
            <input type="checkbox" className="mr-2" checked={apInputs.raisedInContestacion} onChange={(event) => setApInputs((prev) => ({ ...prev, raisedInContestacion: event.target.checked }))} />
            Opuesta en contestación
          </label>
          <label className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 text-xs text-slate-200">
            <input type="checkbox" className="mr-2" checked={apInputs.declinatoriaFiled} onChange={(event) => setApInputs((prev) => ({ ...prev, declinatoriaFiled: event.target.checked }))} />
            Declinatoria presentada
          </label>
          <label className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3 text-xs text-slate-200">
            <input type="checkbox" className="mr-2" checked={apInputs.fueroImperativoApplies} onChange={(event) => setApInputs((prev) => ({ ...prev, fueroImperativoApplies: event.target.checked }))} />
            Aplica fuero imperativo
          </label>
        </div>
        <div className="mt-4 flex items-center gap-2 print:hidden">
          <span className="text-xs text-slate-300">Variante:</span>
          <button type="button" onClick={() => setCopyVariant('legacy')} className={`rounded-full border px-3 py-1 text-xs ${copyVariant === 'legacy' ? 'border-emerald-400/60 text-emerald-200' : 'border-slate-700/60 text-slate-300'}`}>Legacy v1</button>
          <button type="button" onClick={() => setCopyVariant('improved')} className={`rounded-full border px-3 py-1 text-xs ${copyVariant === 'improved' ? 'border-emerald-400/60 text-emerald-200' : 'border-slate-700/60 text-slate-300'}`}>Improved v2</button>
        </div>
        <div className="mt-4 space-y-3">
          {preclusionCards.map(({ card, result, availability, override, enabled }) => (
            <div key={card.id} className="rounded-xl border border-slate-700/50 bg-slate-900/40 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{card.title}</div>
                <div className="text-xs text-amber-200">{result.status}</div>
              </div>
              <ul className="mt-2 list-disc pl-4 text-xs text-slate-200">
                {availability.warnings.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <div className="mt-2 text-xs text-slate-300">PRUEBA soporte: {card.evidence.supports[0] ?? 'NO CONSTA'} · Falta: {card.evidence.missing[0] ?? 'NO CONSTA'}</div>
              <div className="mt-2 flex flex-wrap gap-2 print:hidden">
                <CopyButton text={copyVariant === 'legacy' ? card.copyBlocks.legacy.s90 : (card.copyBlocks.improved?.s90 ?? card.copyBlocks.legacy.s90)} label="Copiar 90s" />
                <CopyButton text={copyVariant === 'legacy' ? card.copyBlocks.legacy.actaPrincipal : (card.copyBlocks.improved?.actaPrincipal ?? card.copyBlocks.legacy.actaPrincipal)} label="Copiar acta" />
              </div>
              {(result.status === 'PRECLUDED' || result.status === 'UNKNOWN') && (
                <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/5 p-2 print:hidden">
                  <label className="text-xs text-rose-200">
                    <input type="checkbox" className="mr-2" checked={override.forcedEnabled} onChange={(event) => setApOverrides((prev) => ({ ...prev, [card.id]: { ...override, forcedEnabled: event.target.checked } }))} />
                    Force enable
                  </label>
                  <input value={override.reason} onChange={(event) => setApOverrides((prev) => ({ ...prev, [card.id]: { ...override, reason: event.target.value } }))} placeholder="Motivo obligatorio" className="mt-2 w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white" />
                </div>
              )}
              <div className="mt-2 text-xs text-emerald-200">{enabled ? 'Activada en compositor' : 'No activada en compositor'}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="matriz" title="Matriz: momento procesal / riesgo de preclusión" className="print:break-inside-avoid">
        <div className="space-y-3">
          {PICASSENT_AP.excepcionesProcesales.matrizPreclusion.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-[11px] ${
                    riesgoConfig[item.riesgo].bg
                  } ${riesgoConfig[item.riesgo].border} ${riesgoConfig[item.riesgo].text}`}
                >
                  Riesgo {riesgoConfig[item.riesgo].label}
                </span>
                <span className="text-xs text-slate-200">{item.momento}</span>
              </div>
              <div className="mt-2 text-sm font-semibold text-white">{item.clave}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-100">
                {item.base.map((line) => (
                  <span key={line} className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1">
                    {line}
                  </span>
                ))}
              </div>
              {!salaMode && (
                <p className="mt-3 text-xs text-slate-200 print:hidden">{item.notaInterna}</p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="escenarios" title="Escenarios de decisión judicial + respuesta táctica" className="print:break-inside-avoid">
        <div className="space-y-3">
          {PICASSENT_AP.excepcionesProcesales.escenariosDecision.map((escenario) => (
            <div key={escenario.id} className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{escenario.decision}</div>
                  <p className="mt-2 text-xs text-emerald-200">{escenario.sala}</p>
                </div>
                <CopyButton text={`${escenario.decision}\n${escenario.sala}`} label="Copiar respuesta" />
              </div>
              {!salaMode && (
                <p className="mt-3 text-xs text-slate-200 print:hidden">{escenario.interno}</p>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard id="guiones" title="Guiones (listos para sala)" className="print:break-inside-avoid">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedGuion('s90')}
            className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
              selectedGuion === 's90'
                ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-700/60 bg-slate-800/60 text-slate-200 hover:border-emerald-400/40'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300`}
          >
            90s
          </button>
          <button
            type="button"
            onClick={() => setSelectedGuion('m3')}
            className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
              selectedGuion === 'm3'
                ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-700/60 bg-slate-800/60 text-slate-200 hover:border-emerald-400/40'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300`}
          >
            3–4min
          </button>
          <button
            type="button"
            onClick={() => setSelectedGuion('m5')}
            className={`rounded-full border px-4 py-1 text-xs font-semibold transition ${
              selectedGuion === 'm5'
                ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-700/60 bg-slate-800/60 text-slate-200 hover:border-emerald-400/40'
            } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300`}
          >
            5–7min
          </button>
          <CopyButton text={PICASSENT_AP.guiones[selectedGuion]} label="Copiar guion" />
        </div>
        <pre
          className={`mt-4 whitespace-pre-wrap rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 text-slate-100 print:text-slate-900 print:bg-white ${
            salaMode ? 'text-sm md:text-base leading-relaxed' : 'text-xs'
          }`}
        >
          {PICASSENT_AP.guiones[selectedGuion]}
        </pre>
      </SectionCard>

      <SectionCard id="prueba" title="Checklist por fases (persistente)" className="print:break-inside-avoid">
        <div className="space-y-4">
          {Object.entries(checklistByFase).map(([fase, items]) => (
            <div key={fase} className="rounded-2xl border border-slate-700/40 bg-slate-900/40 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">{fase}</div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`group rounded-xl border border-slate-700/50 bg-slate-900/60 p-3 ${openChecklist[item.id] ? 'border-emerald-500/30' : ''}`}
                  >
                    <div className="flex flex-col gap-3 text-sm font-semibold text-white md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checklistState[item.id] ?? false}
                          onChange={(event) =>
                            setChecklistState((prev) => ({
                              ...prev,
                              [item.id]: event.target.checked,
                            }))
                          }
                          className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                        />
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenChecklist((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                              }))
                            }
                            aria-expanded={forceExpandedView || (openChecklist[item.id] ?? false)}
                            aria-controls={`checklist-panel-${item.id}`}
                            className="text-left text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                          >
                            {item.titulo}
                          </button>
                          {salaMode && (
                            <p className="mt-1 text-sm text-slate-100 md:text-base">{item.fraseSala}</p>
                          )}
                        </div>
                      </div>
                      <CopyButton text={item.fraseSala} label="Copiar frase de sala" />
                    </div>
                    <div
                      id={`checklist-panel-${item.id}`}
                      className={`mt-3 space-y-3 text-xs text-slate-200 ${forceExpandedView || openChecklist[item.id] ? '' : 'hidden print:block'}`}
                    >
                      {!salaMode && (
                        <>
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Pedir</div>
                            <ul className="mt-2 list-disc space-y-1 pl-4">
                              {item.pedir.map((line) => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Base</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.base.map((line) => (
                                <span
                                  key={line}
                                  className="rounded-full border border-slate-600/60 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-100"
                                >
                                  {line}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        id="hechos"
        title="Hechos controvertidos (filtro + marcado + notas)"
        subtitle={`Total: ${PICASSENT_AP.hechosControvertidos.length} hechos`}
        className={`print:break-inside-avoid ${salaHiddenClass}`}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center print:hidden">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar hechos controvertidos..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="w-full rounded-xl border border-slate-700/50 bg-slate-900/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-emerald-500/50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setFilterEstado('todos')}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                    filterEstado === 'todos'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  Oposición ({PICASSENT_AP.hechosControvertidos.length})
                </button>
                {(['pendiente', 'propuesto', 'admitido'] as EstadoHechoControvertido[]).map((estado) => {
                  const config = estadoConfig[estado];
                  const Icon = config.icon;
                  return (
                    <button
                      key={estado}
                      type="button"
                      onClick={() => setFilterEstado(filterEstado === estado ? 'todos' : estado)}
                      className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 ${
                        filterEstado === estado
                          ? `${config.bg} ${config.text} border ${config.border}`
                          : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {estado} ({countByEstado[estado]})
                    </button>
                  );
                })}
              </div>
            </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => setFilterPrueba('todos')}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                filterPrueba === 'todos'
                  ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40'
                  : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              Prueba ({PICASSENT_AP.hechosControvertidos.length})
            </button>
            {(['documental', 'pericial', 'testifical', 'interrogatorio'] as TipoPrueba[]).map((tipo) => {
              const config = pruebaConfig[tipo];
              const Icon = config.icon;
              return (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setFilterPrueba(filterPrueba === tipo ? 'todos' : tipo)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${
                    filterPrueba === tipo
                      ? `${config.bg} ${config.text} border ${config.border}`
                      : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {config.label} ({countByPrueba[tipo]})
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-2 print:hidden">
            <button
              type="button"
              onClick={() => setFilterRiesgo('todos')}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                filterRiesgo === 'todos'
                  ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40'
                  : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              Riesgo ({PICASSENT_AP.hechosControvertidos.length})
            </button>
            {(['baja', 'media', 'alta'] as const).map((nivel) => {
              const config = riesgoConfig[nivel];
              return (
                <button
                  key={nivel}
                  type="button"
                  onClick={() => setFilterRiesgo(filterRiesgo === nivel ? 'todos' : nivel)}
                  className={`rounded-xl px-3 py-2 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 ${
                    filterRiesgo === nivel
                      ? `${config.bg} ${config.text} border ${config.border}`
                      : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  {config.label} ({countByRiesgo[nivel]})
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {filteredHechos.map(renderHechoCard)}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Alegaciones complementarias (completas)"
        subtitle={`Total: ${PICASSENT_AP.alegacionesComplementarias.length} alegaciones`}
        className={`print:break-inside-avoid ${salaHiddenClass}`}
      >
        <div className="space-y-3">
          {PICASSENT_AP.alegacionesComplementarias.map((alegacion) => {
            const state = alegacionesState[String(alegacion.id)] ?? { done: false, notas: '' };
            const isOpen = forceExpandedView || (openAlegaciones[String(alegacion.id)] ?? false);
            return (
                <div
                  key={alegacion.id}
                  className={`group rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 ${isOpen ? 'border-emerald-500/30' : ''} ${state.done ? '' : 'print:hidden'}`}
                >
                  <div className="flex flex-col gap-3 text-sm font-semibold text-white md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={state.done}
                        onChange={(event) =>
                          setAlegacionesState((prev) => ({
                            ...prev,
                            [String(alegacion.id)]: {
                              ...prev[String(alegacion.id)],
                              done: event.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 print:hidden"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setOpenAlegaciones((prev) => ({
                            ...prev,
                            [String(alegacion.id)]: !prev[String(alegacion.id)],
                          }))
                        }
                        aria-expanded={isOpen}
                        aria-controls={`alegacion-panel-${alegacion.id}`}
                        className="text-left text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                      >
                        {alegacion.titulo}
                      </button>
                    </div>
                    <div className="print:hidden">
                      <CopyButton text={`${alegacion.titulo}\n${alegacion.contenido}`} label="Copiar" />
                    </div>
                  </div>
                  <div
                    id={`alegacion-panel-${alegacion.id}`}
                    className={`mt-3 text-xs text-slate-200 ${isOpen ? '' : 'hidden print:block'}`}
                  >
                    <p className="whitespace-pre-wrap">{alegacion.contenido}</p>
                    {alegacion.fundamentoLegal ? (
                      <p className="mt-2 text-[11px] text-emerald-200">{alegacion.fundamentoLegal}</p>
                    ) : null}
                    <textarea
                      value={state.notas}
                      onChange={(event) =>
                        setAlegacionesState((prev) => ({
                          ...prev,
                          [String(alegacion.id)]: {
                            ...prev[String(alegacion.id)],
                            notas: event.target.value,
                          },
                        }))
                      }
                      placeholder="Notas para esta alegación."
                      className={`mt-3 w-full rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 text-xs text-white placeholder-slate-500 ${isReadMode ? 'hidden' : ''} print:hidden`}
                      rows={3}
                    />
                  </div>
                </div>
              );
          })}
        </div>
      </SectionCard>

      <SectionCard
        id="bloques"
        title="Bloques de defensa / ataque (7)"
        subtitle={`Total: ${PICASSENT_AP.bloques.length} bloques`}
        className="print:break-inside-avoid"
      >
        <div className="space-y-3">
          {PICASSENT_AP.bloques.map((bloque) => {
            const state = bloquesState[bloque.id] ?? { done: false, notas: '' };
            const isOpen = forceExpandedView || (openBloques[bloque.id] ?? false);
            return (
              <div
                key={bloque.id}
                className={`group rounded-2xl border border-slate-700/50 bg-slate-900/50 p-4 ${isOpen ? 'border-emerald-500/30' : ''}`}
              >
                <div className="flex flex-col gap-3 text-sm font-semibold text-white md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    {!salaMode && (
                      <input
                        type="checkbox"
                        checked={state.done}
                        onChange={(event) =>
                          setBloquesState((prev) => ({
                            ...prev,
                            [bloque.id]: {
                              ...prev[bloque.id],
                              done: event.target.checked,
                            },
                          }))
                        }
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-emerald-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 print:hidden"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setOpenBloques((prev) => ({
                          ...prev,
                          [bloque.id]: !prev[bloque.id],
                        }))
                      }
                      aria-expanded={isOpen}
                      aria-controls={`bloque-panel-${bloque.id}`}
                      className="text-left text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    >
                      {bloque.titulo}
                    </button>
                  </div>
                  <div className="print:hidden">
                    <CopyButton text={`${bloque.titulo}\n${bloque.mensajeSala}`} label="Copiar mensaje sala" />
                  </div>
                </div>
                <div
                  id={`bloque-panel-${bloque.id}`}
                  className={`mt-4 space-y-3 text-xs text-slate-200 ${isOpen ? '' : 'hidden print:block'}`}
                >
                  {!salaMode && (
                    <div className="print:hidden">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Objetivo</div>
                      <p className="mt-2">{bloque.objetivo}</p>
                    </div>
                  )}
                  <div
                    className={`rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-emerald-200 ${
                      salaMode ? 'text-sm md:text-base leading-relaxed' : ''
                    }`}
                  >
                    {bloque.mensajeSala}
                  </div>
                  {!salaMode && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2 print:hidden">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Pedir</div>
                          <ul className="mt-2 list-disc space-y-1 pl-4">
                            {bloque.pedir.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Fundamento</div>
                          <ul className="mt-2 list-disc space-y-1 pl-4">
                            {bloque.fundamento.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2 print:hidden">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Prueba</div>
                          <ul className="mt-2 list-disc space-y-1 pl-4">
                            {bloque.prueba.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Contraataques</div>
                          <ul className="mt-2 list-disc space-y-1 pl-4">
                            {bloque.contraataques.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="print:hidden">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">Plan B</div>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          {bloque.planB.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <textarea
                        value={state.notas}
                        onChange={(event) =>
                          setBloquesState((prev) => ({
                            ...prev,
                            [bloque.id]: {
                              ...prev[bloque.id],
                              notas: event.target.value,
                            },
                          }))
                        }
                        placeholder="Notas del bloque (cómo usarlo en sala)."
                        className={`mt-3 w-full rounded-xl border border-slate-700/50 bg-slate-900/50 p-3 text-xs text-white placeholder-slate-500 ${isReadMode ? 'hidden' : ''} print:hidden`}
                        rows={3}
                      />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
