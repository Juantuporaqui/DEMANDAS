import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Clipboard, XCircle, ChevronLeft } from 'lucide-react';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

type ScenarioContent = {
  tesis: string[];
  argumentos: string[];
  riesgos: string[];
  audiencia: string[];
  checklist: string[];
  frases: string[];
};

type Scenario = {
  id: 'A' | 'B' | 'C' | 'D';
  title: string;
  stsInvocada: boolean;
  juezCompra: boolean;
  content: ScenarioContent;
};

const scenarios: Scenario[] = [
  {
    id: 'A',
    title: 'STS 458/2025 invocada + juez la compra',
    stsInvocada: true,
    juezCompra: true,
    content: {
      tesis: [
        'Aun aceptando la STS 458/2025, la compensación solo puede acotarse a aportaciones acreditadas y posteriores al matrimonio.',
        'Prescripción parcial por inactividad y ausencia de reclamaciones útiles durante largos periodos.',
        'Muchos hechos/pagos son muy anteriores y parte de ellos pre-matrimonio, por lo que quedan fuera del debate.',
      ],
      argumentos: [
        'Línea temporal clara: separar periodos pre-matrimonio, primeros años y fase reciente.',
        'Aportaciones pre-matrimonio no integran comunidad ni generan reembolso automático.',
        'Exigir trazabilidad de cada pago: destino, fecha, origen y prueba documental.',
        'Carga de concreción de cuantías y hechos en la parte actora.',
      ],
      riesgos: [
        'El juzgado puede extender la STS a todo el periodo reclamado.',
        'Confusión entre pagos de mantenimiento y aportaciones extraordinarias.',
        'Neutralizar con segmentación temporal, matrices de hechos y exigencia de prueba individualizada.',
      ],
      audiencia: [
        'Delimitar hechos controvertidos por periodos y excluir lo pre-matrimonial.',
        'Exigir detalle de cada partida con fecha, importe y soporte.',
        'Solicitar fijación expresa de hechos pacíficos para cerrar el marco.',
        'Proponer prueba documental y pericial de trazabilidad económica.',
      ],
      checklist: [
        'Certificado/fecha de matrimonio y régimen económico.',
        'Cronograma completo de pagos con soporte bancario.',
        'Extractos y justificantes que acrediten origen y destino.',
        'Contratos, facturas y recibos pre-matrimonio.',
        'Documentación de titularidad y uso del bien en cada periodo.',
        'Comunicaciones previas o reclamaciones fehacientes.',
      ],
      frases: [
        '“Aunque se admita la STS 458/2025, la compensación no puede ignorar la cronología.”',
        '“Lo pre-matrimonial no es común ni reembolsable.”',
        '“Sin fechas ni trazabilidad, no hay condena.”',
        '“La prescripción parcial es un filtro, no una opción.”',
        '“Acotemos el debate a lo probado y posterior al matrimonio.”',
      ],
    },
  },
  {
    id: 'B',
    title: 'STS 458/2025 invocada + juez NO la compra',
    stsInvocada: true,
    juezCompra: false,
    content: {
      tesis: [
        'La STS 458/2025 no es aplicable por falta de identidad fáctica.',
        'Debe prevalecer la defensa principal: prescripción parcial y exclusión de aportaciones pre-matrimonio.',
        'La actora mantiene la carga de concreción y prueba de cada partida.',
      ],
      argumentos: [
        'La STS invocada no se ajusta al contexto temporal ni patrimonial del caso.',
        'Hechos/pagos muy anteriores y ausencia de interrupciones válidas del plazo.',
        'Aportaciones pre-matrimonio ajenas al patrimonio común.',
        'Falta de enriquecimiento actual y prueba insuficiente.',
      ],
      riesgos: [
        'Replanteo del criterio en sentencia.',
        'Intento de reintroducir la STS por la parte actora.',
        'Neutralizar cerrando el marco probatorio y fijando hechos pacíficos.',
      ],
      audiencia: [
        'Declarar improcedente la STS 458/2025 por falta de encaje.',
        'Limitar el debate a periodos posteriores al matrimonio.',
        'Exigir pericial o cuadro de cuantías con soporte documental.',
        'Fijar hechos pacíficos y controvertidos por bloques temporales.',
      ],
      checklist: [
        'Cronología de hechos con fechas verificadas.',
        'Soportes bancarios y facturas por periodos.',
        'Documentación pre-matrimonial separada del resto.',
        'Comunicación previa o ausencia de ella.',
        'Cuadros de cuantías y sumatorios verificables.',
      ],
      frases: [
        '“La STS 458/2025 no convierte en común lo que nació antes.”',
        '“No se puede condenar sin fechas ni soporte.”',
        '“La prescripción parcial protege la seguridad jurídica.”',
      ],
    },
  },
  {
    id: 'C',
    title: 'STS 458/2025 NO invocada + juez la compra',
    stsInvocada: false,
    juezCompra: true,
    content: {
      tesis: [
        'Si el tribunal pretende aplicar la STS 458/2025 de oficio, debe abrir contradicción y acotar su alcance.',
        'Incluso con esa doctrina, procede prescripción parcial y exclusión de aportaciones pre-matrimonio.',
        'La defensa se centra en la cronología y la prueba individualizada.',
      ],
      argumentos: [
        'Derecho de defensa: la cuestión debe discutirse en audiencia previa.',
        'Hechos/pagos antiguos y pre-matrimonio permanecen fuera del perímetro.',
        'Necesidad de prueba concreta de cada partida.',
      ],
      riesgos: [
        'Sorpresa procesal y cambio de marco jurídico.',
        'Extensión indebida de la STS a periodos no acreditados.',
        'Neutralizar solicitando debate específico y delimitación temporal.',
      ],
      audiencia: [
        'Solicitar turno de alegaciones específico sobre STS 458/2025.',
        'Pedir concreción de partidas con fecha e importe.',
        'Delimitar hechos pacíficos/controvertidos por periodos.',
        'Reiterar exclusión de aportaciones pre-matrimonio.',
      ],
      checklist: [
        'Esquema temporal con hitos clave.',
        'Prueba de fecha de matrimonio y régimen.',
        'Extractos y justificantes con fecha.',
        'Documentación pre-matrimonial separada.',
        'Cuadros comparativos de cuantías.',
      ],
      frases: [
        '“Si se quiere aplicar esa doctrina, primero debe discutirse.”',
        '“Aun con STS 458/2025, lo anterior al matrimonio queda fuera.”',
        '“La fecha manda: sin cronología no hay decisión.”',
      ],
    },
  },
  {
    id: 'D',
    title: 'STS 458/2025 NO invocada + juez NO la compra',
    stsInvocada: false,
    juezCompra: false,
    content: {
      tesis: [
        'Defensa principal: prescripción parcial y falta de prueba en hechos antiguos.',
        'Muchos pagos son muy anteriores y varios pre-matrimonio.',
        'El caso se resuelve por cronología y trazabilidad, no por etiquetas.',
      ],
      argumentos: [
        'Inactividad prolongada sin reclamaciones eficaces.',
        'Ausencia de soporte documental suficiente.',
        'Falta de vínculo probado con un patrimonio común.',
        'Necesidad de concreción de cuantías y fechas.',
      ],
      riesgos: [
        'Intento de introducir la STS 458/2025 de forma tardía.',
        'Dispersión del debate por falta de orden temporal.',
        'Neutralizar con objeciones y matriz de hechos por periodos.',
      ],
      audiencia: [
        'Fijar hechos controvertidos y pacíficos por fechas.',
        'Cerrar la introducción de nuevas bases jurídicas fuera de plazo.',
        'Limitar la prueba a hechos concretos y documentados.',
        'Solicitar cuadro de cuantías validado por documentos.',
      ],
      checklist: [
        'Cronograma de hechos con soporte.',
        'Extractos y recibos de pagos clave.',
        'Documentación pre-matrimonial separada.',
        'Comparativa de cuantías reclamadas vs. acreditadas.',
        'Notas de contradicciones en la demanda.',
      ],
      frases: [
        '“El caso se decide por fechas y prueba, no por etiquetas.”',
        '“Sin soporte, no hay condena.”',
        '“La prescripción parcial es el marco natural del litigio.”',
      ],
    },
  },
];

function SectionAccordion({
  title,
  children,
  onCopy,
}: {
  title: string;
  children: ReactNode;
  onCopy?: () => void;
}) {
  return (
    <details className="group rounded-2xl border border-slate-700/50 bg-slate-900/40 p-4 open:border-emerald-500/30 open:bg-slate-900/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white">
        {title}
        {onCopy ? (
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onCopy();
            }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 px-3 py-1 text-[11px] font-semibold text-emerald-200 hover:border-emerald-400/80 hover:text-emerald-100"
          >
            <Clipboard className="h-3.5 w-3.5" /> Copiar
          </button>
        ) : null}
      </summary>
      <div className="mt-3 text-sm text-slate-300">{children}</div>
    </details>
  );
}

function ScenarioToggle({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-300">
      {value ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      ) : (
        <XCircle className="h-4 w-4 text-rose-400" />
      )}
      <span className="text-slate-400">{label}:</span>
      <span className={value ? 'text-emerald-300' : 'text-rose-300'}>
        {value ? 'Sí' : 'No'}
      </span>
    </div>
  );
}

export function CasePrescripcionPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<Scenario['id']>('A');
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;
    let mounted = true;
    (async () => {
      const data = await casesRepo.getById(caseId);
      if (mounted) {
        setCaseData(data ?? null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [caseId]);

  const selectedScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === selectedScenarioId) ?? scenarios[0],
    [selectedScenarioId]
  );

  const isPicassent =
    caseData?.id?.includes('picassent') ||
    caseData?.title?.toLowerCase().includes('picassent') ||
    caseData?.autosNumber?.includes('715') ||
    caseId?.includes('picassent');

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(`Copiado: ${label}`);
      setTimeout(() => setCopiedMessage(null), 2000);
    } catch {
      setCopiedMessage('No se pudo copiar. Selecciona el texto manualmente.');
      setTimeout(() => setCopiedMessage(null), 2500);
    }
  };

  const caseTitle = caseData?.title || caseId || 'Caso';

  return (
    <div className="space-y-6 pb-12">
      <nav className="breadcrumbs">
        <Link to="/cases">Casos</Link>
        <span className="separator">›</span>
        <Link to={`/cases/${caseId}`}>{caseTitle}</Link>
        <span className="separator">›</span>
        <span className="current">Prescripción</span>
      </nav>

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(`/cases/${caseId}?tab=estrategia`)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver
            </button>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">Prescripción</h1>
          <p className="text-sm text-slate-400">
            Matriz de escenarios y guion operativo para audiencia previa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {caseData?.autosNumber && (
            <span className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-200">
              Autos: {caseData.autosNumber}
            </span>
          )}
          {caseData?.court && (
            <span className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-200">
              Juzgado: {caseData.court}
            </span>
          )}
        </div>
      </div>

      {!isPicassent && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          Plantilla general — personaliza contenido por caso.
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Selector de escenarios</h2>
            <p className="text-xs text-slate-400">Selecciona el contexto para ajustar la tesis.</p>
          </div>
          {copiedMessage && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
              {copiedMessage}
            </span>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedScenario.id;
            return (
              <button
                key={scenario.id}
                type="button"
                onClick={() => setSelectedScenarioId(scenario.id)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-slate-700/50 bg-slate-900/40 hover:border-slate-500/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400">
                      Escenario {scenario.id}
                    </div>
                    <h3 className="text-sm font-semibold text-white">{scenario.title}</h3>
                  </div>
                  {isSelected && (
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">
                      Seleccionado
                    </span>
                  )}
                </div>
                <div className="mt-3 space-y-2">
                  <ScenarioToggle label="STS 458/2025" value={scenario.stsInvocada} />
                  <ScenarioToggle label="Juez la compra" value={scenario.juezCompra} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
          <h2 className="text-lg font-semibold text-white">{selectedScenario.title}</h2>
          <p className="text-sm text-slate-400">
            Escenario {selectedScenario.id}. Ajusta la narrativa a hechos, fechas y prueba disponible.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionAccordion title="Tesis">
            <ul className="list-disc space-y-2 pl-5">
              {selectedScenario.content.tesis.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionAccordion>
          <SectionAccordion title="Argumentos operativos">
            <ul className="list-disc space-y-2 pl-5">
              {selectedScenario.content.argumentos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionAccordion>
          <SectionAccordion title="Riesgos y cómo neutralizarlos">
            <ul className="list-disc space-y-2 pl-5">
              {selectedScenario.content.riesgos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionAccordion>
          <SectionAccordion
            title="Qué pedir en Audiencia Previa"
            onCopy={() =>
              handleCopy(selectedScenario.content.audiencia.join('\n'), 'Qué pedir en Audiencia Previa')
            }
          >
            <ul className="list-disc space-y-2 pl-5">
              {selectedScenario.content.audiencia.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionAccordion>
          <SectionAccordion title="Checklist de prueba / documentos">
            <ul className="list-disc space-y-2 pl-5">
              {selectedScenario.content.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionAccordion>
          <SectionAccordion
            title="Frases martillo (sala)"
            onCopy={() =>
              handleCopy(selectedScenario.content.frases.join('\n'), 'Frases martillo')
            }
          >
            <ul className="list-disc space-y-2 pl-5">
              {selectedScenario.content.frases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </SectionAccordion>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/cases/${caseId}?tab=estrategia`)}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 hover:border-white/30"
          >
            Volver
          </button>
        </div>
      </section>
    </div>
  );
}
