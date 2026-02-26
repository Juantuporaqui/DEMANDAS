import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { AnalyticsLayout } from '../layout/AnalyticsLayout';
import { SectionCard } from '../components/SectionCard';
import { printElementAsDocument } from '../../../utils/printDocument';

const SUBNAV_ITEMS = [
  { label: 'Resumen', href: '#resumen' },
  { label: 'Base legal', href: '#base-legal' },
  { label: 'Riesgos', href: '#riesgos' },
  { label: 'Escenarios', href: '#escenarios' },
  { label: 'Checklist', href: '#checklist' },
  { label: 'Anexos', href: '#anexos' },
];

const LEGAL_CHIPS = ['416.1.4ª LEC', '250.1.16 LEC', '73.1.2ª LEC', '73.2 LEC', '249.2 LEC'] as const;
type LegalChip = (typeof LEGAL_CHIPS)[number];

const TEXT_GUION_90 = `Señoría, en este trámite de Audiencia Previa, al amparo del artículo 416.1.4ª LEC, interesamos la depuración del procedimiento porque la demanda acumula dos bloques de naturaleza y cauce incompatibles.

La acción de división de cosa común debe tramitarse por juicio verbal especial por razón de la materia conforme al artículo 250.1.16 LEC. Sin embargo, la reclamación económica / reembolso por pagos y periodos se corresponde con el juicio ordinario por cuantía del artículo 249.2 LEC.

Esa mezcla infringe el artículo 73.1.2ª LEC, que impide la acumulación cuando las acciones deban ventilarse en procedimientos de diferente tipo. Y no es aplicable la absorción del artículo 73.2 LEC, porque aquí el juicio verbal no viene impuesto por cuantía, sino por materia (art. 250.1.16 LEC).

Además, la acumulación no es inocua: la complejidad contable de la reclamación económica está bloqueando la resolución de la división de cosa común, que el legislador ha configurado como verbal especial por materia para dotarla de agilidad. Tras casi dos años de tramitación y sucesivos aplazamientos, la acción divisoria ha quedado subordinada a un debate económico que la desnaturaliza.

En Audiencia Previa corresponde al tribunal depurar el cauce y ordenar el objeto litigioso, garantizando contradicción y evitando indefensión.

Por ello, con carácter principal, solicitamos que se declare la inadecuación del procedimiento por indebida acumulación de acciones de cauce incompatible, acordando la separación o reconducción procedente.

Y subsidiariamente, para el caso de mantenerse la acumulación, pedimos saneamiento estricto del objeto para evitar indefensión: fijación de hechos controvertidos por bloques A (división) y B (reclamación económica), admisión de prueba vinculada a cada bloque y cuantificación separada por periodos, excluyendo lo impertinente. Esta audiencia existe precisamente para depurar y fijar el objeto litigioso.`;

const TEXT_GUION_30 = `Señoría, solicitamos depuración en Audiencia Previa (art. 416.1.4ª LEC) porque se acumulan acciones de cauce incompatible: división de cosa común por verbal especial de materia (art. 250.1.16 LEC) y reclamación económica por ordinario (art. 249.2 LEC), infringiendo el art. 73.1.2ª LEC. No opera la absorción del 73.2 LEC al ser verbal por materia. Principalmente pedimos separación/reconducción; subsidiariamente, saneamiento del objeto por bloques A/B y prueba estrictamente vinculada.`;

const TEXT_PETICION_PRINCIPAL = `Que, al amparo del art. 416.1.4ª LEC, se declare la inadecuación del procedimiento por indebida acumulación de acciones de cauce incompatible, por corresponder la división de cosa común al juicio verbal del art. 250.1.16 LEC y la reclamación económica al juicio ordinario del art. 249.2 LEC, en infracción del art. 73.1.2ª LEC, acordando la separación o reconducción procedente, apreciable incluso de oficio por el tribunal en este trámite de Audiencia Previa, al afectar a la correcta constitución y tramitación del procedimiento, interesando que la resolución conste de forma expresa en acta.`;

const TEXT_PETICION_SUB1 = `Subsidiariamente, que se acuerde el saneamiento del objeto litigioso: delimitación expresa por bloques A/B de hechos controvertidos, prueba y cuantificación (hechos–prueba–cuantías por periodos), excluyendo lo impertinente, para evitar indefensión.`;

const TEXT_PETICION_SUB2 = `Que la admisión de prueba se realice por bloques, exigiendo para cada medio de prueba su conexión directa con el bloque A (división) o el bloque B (reclamación económica), rechazando lo genérico o no vinculado.`;

const TEXT_PROTESTA = `Para el supuesto de que no se estime la depuración solicitada (inadecuación/indebida acumulación) o no se acuerde separación estricta por bloques A/B, esta parte formula expresa PROTESTA y solicita que conste en acta, a los efectos del art. 446 LEC y de los recursos procedentes.`;

const TEXT_JURISPRUDENCIA = [
  'STS 79/2015, 27/02/2015 (ECLI: ES:TS:2015:79) — Inadecuación por materia = orden público; apreciable de oficio aunque no se alegue.',
  'AAP Tarragona, Secc. 3ª, Auto 185/2024 (23/05/2024) — Control en AP incluso tras admisión; apoyo en arts. 419 y 425 LEC.',
  'SAP Baleares, Secc. 3ª, 18/09/2018 (ROJ SAP IB 1884/2018) — Examen judicial en AP aunque no se detectara en admisión.',
  'SAP A Coruña, Secc. 5ª, 11/06/2009 (ROJ SAP C 1749/2009) — Art. 416 no es lista cerrada; art. 425 permite resolver cuestiones análogas.',
  'AAP Valencia, Secc. 10ª, Auto 137/2025, 03/03/2025 (ROJ: AAP V 308/2025; ECLI:ES:APV:2025:308A) — División de cosa común por verbal de materia (art. 250.1.16 LEC) con independencia del valor.',
] as const;

const ARTICLE_SUMMARIES: Record<LegalChip, string> = {
  '416.1.4ª LEC': 'En AP permite depurar inadecuación del procedimiento: el tribunal decide si el cauce seguido es idóneo.',
  '250.1.16 LEC': 'División cosa común: juicio verbal por razón de la materia, con independencia de cuantía.',
  '73.1.2ª LEC': 'No cabe acumulación cuando las acciones deban ventilarse en procedimientos de diferente tipo.',
  '73.2 LEC': 'Absorción solo cuando la diferencia sea por cuantía; no aplica si el verbal es por materia.',
  '249.2 LEC': 'Acciones de reclamación económica por cuantía: cauce ordinario cuando proceda.',
};

const QUICK_REPLICAS = [
  {
    title: 'Preclusión en contestación',
    body: 'Si no se estima la excepción por preclusión, pedimos al menos saneamiento estricto del objeto por bloques A/B para evitar indefensión material.',
  },
  {
    title: 'Economía procesal',
    body: 'La economía procesal no permite mezclar cauces imperativos: 73.1.2ª LEC impide acumulación de procedimientos de distinto tipo.',
  },
  {
    title: 'Absorción 73.2',
    body: 'La absorción de 73.2 LEC no opera porque el verbal aquí es por materia (250.1.16), no por cuantía.',
  },
  {
    title: 'Si mantienen acumulación',
    body: 'Solicitamos fijación por bloques, hechos controvertidos separados, prueba vinculada y cuantificación por periodos.',
  },
  {
    title: 'Cierre para acta',
    body: 'Si no se estima lo anterior, formulamos PROTESTA expresa del art. 446 LEC y pedimos constancia literal en acta.',
  },
] as const;

const PETICIONES_TODAS = `${TEXT_PETICION_PRINCIPAL}\n---\n${TEXT_PETICION_SUB1}\n---\n${TEXT_PETICION_SUB2}`;

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'true');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  }
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(text);
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

function highlightText(paragraph: string, highlights: string[]) {
  const sorted = [...highlights].sort((a, b) => b.length - a.length);
  const nodes: ReactNode[] = [paragraph];

  sorted.forEach((highlight) => {
    const next: ReactNode[] = [];
    nodes.forEach((node, index) => {
      if (typeof node !== 'string') {
        next.push(node);
        return;
      }
      const parts = node.split(highlight);
      parts.forEach((part, partIndex) => {
        if (part) {
          next.push(<span key={`${highlight}-${index}-${partIndex}-txt`}>{part}</span>);
        }
        if (partIndex < parts.length - 1) {
          next.push(
            <strong key={`${highlight}-${index}-${partIndex}-hl`} className="text-white">
              {highlight}
            </strong>
          );
        }
      });
    });
    nodes.splice(0, nodes.length, ...next);
  });

  return nodes;
}

export function ExcepcionAcumulacionPage() {
  const navigate = useNavigate();
  const { caseId = 'CAS001' } = useParams<{ caseId: string }>();
  const [searchParams] = useSearchParams();
  const returnToParam = searchParams.get('returnTo');
  const returnTo = returnToParam || `/cases/${caseId}?tab=estrategia`;
  const normalizedCaseId = caseId.toLowerCase();
  const isPicassent = normalizedCaseId.includes('picassent') || caseId === 'CAS001';

  const [mode, setMode] = useState<'sala' | 'operativo'>(() => {
    const stored = localStorage.getItem('cas001_excepcion_mode');
    return stored === 'sala' ? 'sala' : 'operativo';
  });
  const [articleModal, setArticleModal] = useState<LegalChip | null>(null);
  const [caseModal, setCaseModal] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [subsidiariasOpen, setSubsidiariasOpen] = useState(false);
  const [openReplica, setOpenReplica] = useState<number | null>(0);

  useEffect(() => {
    localStorage.setItem('cas001_excepcion_mode', mode);
  }, [mode]);

  useEffect(() => {
    const loaded: Record<number, string> = {};
    TEXT_JURISPRUDENCIA.forEach((_, index) => {
      loaded[index] = localStorage.getItem(`cas001_excepcion_juris_note_${index}`) || '';
    });
    setNotes(loaded);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setArticleModal(null);
        setCaseModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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
        pedir: 'Objetivo real: ordenar bloques A/B + pertinencia estricta. Si no lo estima: formular PROTESTA y pedir que conste en acta (art. 446 LEC).',
      },
      {
        title: 'Escenario 3 — “Dice que la acumulación es correcta”',
        resultado: 'Plan B reforzado: separación funcional total dentro del mismo pleito (hechos–prueba–cuantías por bloques) + exclusión de hechos impertinentes.',
        pedir: 'Insistir en control del objeto y prueba estrictamente vinculada. Si no lo estima: formular PROTESTA y pedir que conste en acta (art. 446 LEC).',
      },
      {
        title: 'Escenario 4 — “Solución intermedia del juez”',
        resultado: 'Mantiene el pleito, pero ordena: recorte del objeto, concreción de periodos y cuantías, admisión de prueba solo si enlaza con un bloque concreto.',
        pedir: 'Concretar medidas de separación y calendario de trabajo.',
      },
    ],
    []
  );

  const scrollToSala = () => {
    document.getElementById('sala')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handlePrint = () => window.print();

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
      <main lang="es">
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
                  <span key={item} className="rounded-full border border-slate-600/60 bg-slate-800/50 px-3 py-1 text-xs font-semibold text-slate-200">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm text-slate-300">
                Solicitamos al tribunal que controle el objeto litigioso y evite la mezcla de debates y cuantificaciones, garantizando el derecho de defensa: 1) declarando la inadecuación del procedimiento por acumulación de cauces incompatibles; 2) subsidiariamente, saneando el objeto por bloques A/B (hechos–prueba–cuantificación).
              </p>
            </SectionCard>

            <div className="sticky top-3 z-20 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {LEGAL_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setArticleModal(chip)}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="rounded-full border border-amber-400/50 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-100 transition hover:border-amber-300/70 hover:bg-amber-500/20"
                  >
                    Imprimir / PDF
                  </button>
                  <CopyButton text={TEXT_GUION_90} label="Copiar Guion 90s" />
                  <CopyButton text={TEXT_PETICION_PRINCIPAL} label="Copiar Petición Principal" />
                  <CopyButton text={PETICIONES_TODAS} label="Copiar Peticiones" />
                </div>
              </div>
            </div>

            <SectionCard title="Modo de uso" subtitle="Conmutador rápido">
              <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={mode === 'sala'} onChange={(e) => setMode(e.target.checked ? 'sala' : 'operativo')} />
                  MODO SALA
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={mode === 'operativo'} onChange={(e) => setMode(e.target.checked ? 'operativo' : 'sala')} />
                  MODO OPERATIVO
                </label>
              </div>
            </SectionCard>

            <div id="sala" className="grid gap-4 sm:gap-6 xl:grid-cols-2 scroll-mt-24">
              <SectionCard title="SALA · Guion 90 segundos" subtitle="Lectura directa, sin improvisar">
                <div className="space-y-4 text-sm leading-relaxed text-slate-200">
                  {TEXT_GUION_90.split('\n\n').map((paragraph) => (
                    <p key={paragraph} className="justify-pro" style={{ textAlignLast: 'left' }}>
                      {highlightText(paragraph, [
                        'artículo 416.1.4ª LEC',
                        'artículo 250.1.16 LEC',
                        'artículo 249.2 LEC',
                        'artículo 73.1.2ª LEC',
                        'artículo 73.2 LEC',
                        'bloques A (división) y B (reclamación económica)',
                      ])}
                    </p>
                  ))}
                  <CopyButton text={TEXT_GUION_90} label="Copiar" />
                </div>
              </SectionCard>

              <div className="space-y-4 sm:space-y-6">
                <SectionCard title="Peticiones (escalonadas)">
                  <div className="space-y-3 text-sm text-slate-200">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="text-sm font-semibold text-white">Principal</div>
                      <p className="mt-2 text-sm text-slate-300">
                        {highlightText(TEXT_PETICION_PRINCIPAL, ['inadecuación del procedimiento', 'apreciable incluso de oficio', 'conste de forma expresa en acta'])}
                      </p>
                      <div className="mt-3">
                        <CopyButton text={TEXT_PETICION_PRINCIPAL} label="Copiar" />
                      </div>
                    </div>
                    <details open={mode === 'operativo' || subsidiariasOpen} onToggle={(e) => setSubsidiariasOpen((e.target as HTMLDetailsElement).open)} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <summary className="cursor-pointer text-sm font-semibold text-white">Peticiones subsidiarias</summary>
                      <div className="mt-3 space-y-3">
                        <p className="text-sm text-slate-300">{TEXT_PETICION_SUB1}</p>
                        <CopyButton text={TEXT_PETICION_SUB1} label="Copiar subsidiaria 1" />
                        <p className="text-sm text-slate-300">{TEXT_PETICION_SUB2}</p>
                        <CopyButton text={TEXT_PETICION_SUB2} label="Copiar subsidiaria 2" />
                      </div>
                    </details>
                    <CopyButton text={PETICIONES_TODAS} label="Copiar todo" />
                  </div>
                </SectionCard>

                <SectionCard title="PROTESTA (para acta y recursos)">
                  <div className="space-y-4 text-sm text-slate-200">
                    <p className="text-slate-300">{highlightText(TEXT_PROTESTA, ['PROTESTA', 'art. 446 LEC'])}</p>
                    <CopyButton text={TEXT_PROTESTA} label="Copiar protesta" />
                  </div>
                </SectionCard>

                <SectionCard title="SALA · Guion 30 segundos">
                  <div className="space-y-4 text-sm text-slate-200">
                    {TEXT_GUION_30.split('\n\n').map((paragraph) => (
                      <p key={paragraph} className="justify-pro" style={{ textAlignLast: 'left' }}>
                        {paragraph}
                      </p>
                    ))}
                    <CopyButton text={TEXT_GUION_30} label="Copiar" />
                  </div>
                </SectionCard>

                <SectionCard title="Réplicas rápidas">
                  <div className="space-y-2">
                    {QUICK_REPLICAS.map((item, index) => (
                      <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200">
                        <button type="button" className="w-full text-left font-semibold text-white" onClick={() => setOpenReplica(openReplica === index ? null : index)}>
                          {item.title}
                        </button>
                        {openReplica === index && <p className="mt-2 text-slate-300">{item.body}</p>}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>

            {mode === 'operativo' && (
              <>
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
                          <li>Que se declare la inadecuación del procedimiento por acumulación de cauces incompatibles (416.1.4, 250.1.16, 73.1.2ª y 249.2 LEC), sin absorción por 73.2.</li>
                          <li>Subsidiariamente: saneamiento por bloques A/B (hechos–prueba–cuantificación), excluyendo lo impertinente.</li>
                          <li>Admisión y control de prueba por bloques, con conexión directa a cada bloque.</li>
                        </ol>
                      </SectionCard>
                    </div>

                    <div id="base-legal" className="scroll-mt-24">
                      <SectionCard title="Base legal (anclaje exacto)">
                        <div className="space-y-3 text-sm text-slate-200">
                          {LEGAL_CHIPS.map((chip) => (
                            <div key={chip} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                              <button type="button" onClick={() => setArticleModal(chip)} className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10">
                                {chip}
                              </button>
                              <p className="mt-2 text-sm text-slate-300">{ARTICLE_SUMMARIES[chip]}</p>
                            </div>
                          ))}
                          <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4">
                            <h3 className="text-base font-semibold text-sky-100">Control judicial de oficio</h3>
                            <div className="mt-2 space-y-2 text-sm text-sky-50/90">
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>La indebida acumulación que afecta al cauce procesal no es una mera cuestión dispositiva entre partes, sino un problema de correcta constitución y prosecución del procedimiento.</p>
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>En la Audiencia Previa el tribunal no solo resuelve lo alegado, sino que debe velar por la adecuación del procedimiento y la regularidad del proceso (arts. 416 y ss. LEC).</p>
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>Cuando la acumulación determina la tramitación por un cauce no idóneo o impide el correcto enjuiciamiento, el tribunal puede apreciarlo incluso de oficio en este trámite, al afectar a la estructura del proceso y a la tutela judicial efectiva.</p>
                            </div>
                          </div>
                        </div>
                      </SectionCard>
                    </div>

                    <div id="riesgos" className="scroll-mt-24">
                      <SectionCard title="Riesgos" subtitle="Objeciones previsibles y réplica útil">
                        <div className="space-y-4 text-sm text-slate-200">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <h3 className="text-base font-semibold text-white">Jurisprudencia relevante</h3>
                            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-300">
                              {TEXT_JURISPRUDENCIA.map((item, index) => (
                                <li key={item}>
                                  {item}
                                  <button type="button" onClick={() => setCaseModal(index)} className="ml-2 rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15">
                                    Ver
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <SectionCard title="Dilación estructural y bloqueo de la acción de división">
                            <div className="space-y-2 text-sm text-slate-300">
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>La acumulación no es neutra. La acción de división de cosa común, por su configuración legal, está diseñada para una tramitación ágil y de resolución funcional.</p>
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>Sin embargo, la acumulación con una reclamación económica de carácter contable y plurianual ha generado una dilación estructural del procedimiento, con múltiples aplazamientos y una prolongación temporal incompatible con la finalidad propia de la acción divisoria.</p>
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>La complejidad probatoria y cuantificadora del bloque de reembolso está absorbiendo y retrasando la resolución de la división, convirtiendo el proceso en un litigio híbrido que frustra la naturaleza ágil que el legislador quiso imprimir a este tipo de acciones.</p>
                              <p className="justify-pro" style={{ textAlignLast: 'left' }}>Esta situación no es una mera cuestión estratégica entre partes, sino un efecto procesal objetivo que el tribunal debe valorar al ejercer su función de ordenación y depuración.</p>
                            </div>
                          </SectionCard>
                        </div>
                      </SectionCard>
                    </div>

                    <div id="escenarios" className="scroll-mt-24">
                      <SectionCard title="Los 4 escenarios (matriz)" subtitle="Matriz de decisión rápida">
                        <div className="grid gap-4 md:grid-cols-2">
                          {scenarioCards.map((scenario) => (
                            <div key={scenario.title} className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-4 text-sm text-slate-200">
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
                          <li>Petición final escalonada: principal (inadecuación) + subsidiarias (saneamiento por bloques).</li>
                          <li>Preparar réplicas de preclusión/absorción/economía procesal.</li>
                          <li>Llevar impreso Guion 90s + Petición principal + Protesta.</li>
                        </ul>
                      </SectionCard>
                    </div>

                    <div id="anexos" className="scroll-mt-24">
                      <SectionCard title="Anexos">
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
              </>
            )}

            {articleModal && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4" onClick={() => setArticleModal(null)}>
                <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900 p-5" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-white">Artículo {articleModal}</h3>
                  <p className="mt-2 text-sm text-slate-300">{ARTICLE_SUMMARIES[articleModal]}</p>
                  <div className="mt-4 flex justify-end gap-2">
                    <CopyButton text={ARTICLE_SUMMARIES[articleModal]} label="Copiar artículo (resumen)" />
                    <button type="button" onClick={() => setArticleModal(null)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white">
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {caseModal !== null && (
              <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4" onClick={() => setCaseModal(null)}>
                <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-5" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold text-white">Sentencia / Auto</h3>
                  <p className="mt-2 text-sm text-slate-300">{TEXT_JURISPRUDENCIA[caseModal]}</p>
                  <p className="mt-3 text-sm text-slate-300">Para qué sirve: {TEXT_JURISPRUDENCIA[caseModal].split('— ')[1] || ''}</p>
                  <label className="mt-4 block text-sm text-slate-200">Notas</label>
                  <textarea
                    value={notes[caseModal] || ''}
                    onChange={(event) => {
                      const value = event.target.value;
                      setNotes((current) => ({ ...current, [caseModal]: value }));
                      localStorage.setItem(`cas001_excepcion_juris_note_${caseModal}`, value);
                    }}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-sm text-slate-200"
                  />
                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={() => setCaseModal(null)} className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white">
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </AnalyticsLayout>
  );
}
