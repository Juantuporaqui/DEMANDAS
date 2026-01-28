import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import Stat from '../../ui/components/Stat';
import { claimFilesRepo, docFilesRepo } from '../../db/repositories';
import { formatBytes, formatCurrency } from '../../utils/validators';
import { sha256 } from '../../utils/hash';

type ClaimTab = 'resumen' | 'ampliar' | 'prueba';

type ClaimFile = {
  id: string;
  fileId: string;
  filename: string;
  size: number;
  mime: string;
  createdAt: number;
};

const CASES = [
  {
    id: 'pic-715-24',
    title: 'Picassent · División Cosa Común',
    autos: 'Autos 715/2024',
    court: 'JPI nº1 Picassent',
    status: 'Audiencia previa en preparación',
    tags: ['División cosa común', 'Unidad de caja', 'Prescripción 1964.2 CC'],
  },
  {
    id: 'qua-362-23',
    title: 'Quart · Ejecución Familia',
    autos: 'Autos 362/2023',
    court: 'Juzgado Quart',
    status: 'Ejecución en seguimiento',
    tags: ['DANA', 'Ayuda material escolar', 'Cuenta privativa'],
  },
];

const CLAIMS = [
  {
    id: 'r01',
    shortLabel: 'R01',
    title: 'Mezcla de Fondos',
    amountCents: 21_600_000,
    probability: 'media',
    color: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
    thesis: 'Unidad de caja funcional 2006-2024 con trazabilidad de aportaciones.',
    antithesis: 'Se opondrán aportaciones privativas sin rastro documental.',
    detail:
      'Se sostiene que el patrimonio común se gestionó como unidad de caja durante todo el ciclo 2006-2024. La falta de segregación contable habilita la compensación por aportaciones privativas conforme a la doctrina de los gastos comunes.',
    evidence: ['Extractos consolidados 2006-2024', 'Resumen bancario conjunto', 'Cuadro comparativo de ingresos'],
  },
  {
    id: 'r02',
    shortLabel: 'R02',
    title: 'Transferencia Errónea',
    amountCents: 1_300_000,
    probability: 'alta',
    color: 'border-rose-400/50 bg-rose-500/10 text-rose-200',
    thesis: 'Impugnación por error material: la demanda cita 2024, fecha imposible.',
    antithesis: 'Se intentará reconducir como error formal subsanable.',
    detail:
      'El relato cronológico acredita que la transferencia no puede corresponder al año 2024, fecha posterior a los hechos descritos. Se impulsa la rectificación por error material con base en la propia narrativa de la demanda.',
    evidence: ['Orden de transferencia con sello bancario', 'Cruce de movimientos con fecha real'],
  },
  {
    id: 'r03',
    shortLabel: 'R03',
    title: 'SEAT LEÓN',
    amountCents: 1_450_000,
    probability: 'media',
    color: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200',
    thesis: 'Uso exclusivo del vehículo desde agosto 2022.',
    antithesis: 'Se alegará uso compartido y gastos comunes.',
    detail:
      'La tenencia exclusiva del SEAT LEÓN desde agosto 2022 refuerza la compensación por privación de uso. Se documenta con seguros, mantenimientos y testifical.',
    evidence: ['Póliza de seguro 2022-2024', 'Tickets de mantenimiento', 'Testifical vecinal'],
  },
];

const AUDIENCE_CHECKLIST = [
  {
    phase: 'Procesal',
    items: ['Competencia y cuantía confirmadas', 'Subsistencia de legitimación activa'],
  },
  {
    phase: 'Hechos',
    items: ['Unidad de caja 2006-2024', 'Error material transferencia 2024', 'Uso exclusivo SEAT LEÓN'],
  },
  {
    phase: 'Prueba',
    items: ['Extractos consolidados listos', 'Dogv ayuda DANA (Quart)', 'Listado de anexos actualizado'],
  },
  {
    phase: 'Alegaciones complementarias',
    items: ['Prescripción art. 1964.2 CC', 'Inaplicabilidad STS 458/2025 tramo 2006-2013'],
  },
];

const AUDIENCE_SCRIPTS = [
  'Con la venia, esta parte interesa la inadmisión del tramo 2006-2013 por ausencia de régimen económico probado.',
  'Se interesa la rectificación del error material en la demanda respecto de la fecha 2024, imposible según el relato.',
  'Se solicita se tenga por acreditado el uso exclusivo del SEAT LEÓN desde agosto de 2022.',
];

const PENDING_DOCS = [
  {
    title: 'Extractos BBVA 2011',
    status: 'Solicitado',
    note: 'Necesarios para reconstruir unidad de caja.',
  },
  {
    title: 'Cuadro comparativo ingresos 2006-2010',
    status: 'Pendiente',
    note: 'Soporte a la tesis de mezcla de fondos.',
  },
  {
    title: 'Resolución DOGV ayuda DANA',
    status: 'Recibido',
    note: 'Caso Quart · cuenta privativa.',
  },
];

const TASKS = [
  {
    title: 'Formalizar alegación prescripción art. 1964.2 CC',
    priority: 'alta',
    due: '24/06',
  },
  {
    title: 'Solicitar extractos BBVA 2011 (unidad de caja)',
    priority: 'alta',
    due: '20/06',
  },
  {
    title: 'Validar error material en transferencia 2024',
    priority: 'media',
    due: '18/06',
  },
  {
    title: 'Ensayar guiones audiencia previa',
    priority: 'baja',
    due: '15/06',
  },
];

const TIMELINE_SEED = [
  {
    type: 'Hito',
    date: '2006-01-01',
    title: 'Inicio unidad de caja funcional',
    detail: 'Comienzo del periodo que la actora pretende compensar.',
  },
  {
    type: 'Hecho',
    date: '2013-12-31',
    title: 'Tramo pre-matrimonial sin régimen probado',
    detail: 'Base para excluir 2006-2013 de la STS 458/2025.',
  },
  {
    type: 'Documento',
    date: '2022-08-01',
    title: 'Uso exclusivo SEAT LEÓN',
    detail: 'Se documenta desde agosto 2022.',
  },
  {
    type: 'Hito',
    date: '2024-02-12',
    title: 'Demanda división cosa común',
    detail: 'Autos 715/2024 · JPI nº1 Picassent.',
  },
  {
    type: 'Hecho',
    date: '2024-02-20',
    title: 'Detección error material transferencia',
    detail: 'La demanda cita 2024, fecha imposible.',
  },
];

export function DashboardPage() {
  const [selectedClaimId, setSelectedClaimId] = useState(CLAIMS[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<ClaimTab>('resumen');
  const [claimFiles, setClaimFiles] = useState<Record<string, ClaimFile[]>>({});
  const [uploading, setUploading] = useState(false);

  const selectedClaim = CLAIMS.find((claim) => claim.id === selectedClaimId) ?? CLAIMS[0];

  const totalClaimed = useMemo(
    () => CLAIMS.reduce((sum, claim) => sum + claim.amountCents, 0),
    []
  );

  const timelineItems = useMemo(() => {
    return [...TIMELINE_SEED].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadFiles = async () => {
      const entries = await Promise.all(
        CLAIMS.map(async (claim) => ({
          claimId: claim.id,
          files: await claimFilesRepo.getByClaimId(claim.id),
        }))
      );
      if (!mounted) return;
      const mapped = entries.reduce<Record<string, ClaimFile[]>>((acc, entry) => {
        acc[entry.claimId] = entry.files;
        return acc;
      }, {});
      setClaimFiles(mapped);
    };
    void loadFiles();
    return () => {
      mounted = false;
    };
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedClaim) return;

    setUploading(true);
    try {
      const updates = await Promise.all(
        Array.from(files).map(async (file) => {
          const hashSha256 = await sha256(file);
          const stored = await docFilesRepo.create({
            hashSha256,
            filename: file.name,
            mime: file.type || 'application/octet-stream',
            size: file.size,
            blob: file,
          });
          return claimFilesRepo.addForClaim({
            claimId: selectedClaim.id,
            fileId: stored.id,
            filename: stored.filename,
            size: stored.size,
            mime: stored.mime,
          });
        })
      );

      setClaimFiles((prev) => ({
        ...prev,
        [selectedClaim.id]: [...(prev[selectedClaim.id] ?? []), ...updates],
      }));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveFile = async (claimId: string, fileId: string) => {
    await claimFilesRepo.remove(fileId);
    setClaimFiles((prev) => ({
      ...prev,
      [claimId]: (prev[claimId] ?? []).filter((file) => file.id !== fileId),
    }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Case Ops · Dashboard Operativo
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Picassent · División cosa común
          </h1>
          <p className="text-sm text-slate-400">
            Autos 715/2024 · JPI nº1 Picassent · Offline-first en sala de vistas
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 px-4 py-3">
          <div className="text-xs uppercase text-slate-400">Prescripción estratégica</div>
          <div className="text-sm font-semibold text-slate-200">
            Art. 1964.2 CC · Inaplicabilidad STS 458/2025 tramo 2006-2013
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <Stat label="Total reclamado" value={formatCurrency(totalClaimed)} />
          <div className="mt-2 text-xs text-slate-500">Suma real Picassent</div>
        </Card>
        <Card className="p-5">
          <Stat label="Reclamaciones" value={CLAIMS.length} delta="R01 · R02 · R03" />
          <div className="mt-2 text-xs text-slate-500">Tiles activos</div>
        </Card>
        <Card className="p-5">
          <Stat label="Docs pendientes" value={PENDING_DOCS.length} />
          <div className="mt-2 text-xs text-slate-500">Solicitudes en curso</div>
        </Card>
        <Card className="p-5">
          <Stat label="Deberes críticos" value={TASKS.length} />
          <div className="mt-2 text-xs text-slate-500">Prioridades en sala</div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-6">
          <SectionTitle title="Reclamaciones" subtitle="Vista por tiles con probabilidad" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {CLAIMS.map((claim) => (
              <button
                key={claim.id}
                type="button"
                onClick={() => setSelectedClaimId(claim.id)}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  selectedClaimId === claim.id
                    ? 'border-amber-400/70 bg-amber-500/10 text-amber-100'
                    : 'border-slate-800/70 bg-slate-900/40 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {claim.shortLabel}
                  </span>
                  <span>{claim.title}</span>
                </div>
                <span className="text-sm text-slate-200">{formatCurrency(claim.amountCents)}</span>
              </button>
            ))}
          </div>

          {selectedClaim && (
            <div className="mt-6 rounded-2xl border border-slate-800/70 bg-slate-950/60 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {selectedClaim.shortLabel}
                  </div>
                  <div className="text-lg font-semibold text-slate-100">
                    {selectedClaim.title}
                  </div>
                  <div className="text-sm text-slate-400">
                    {formatCurrency(selectedClaim.amountCents)} · Probabilidad{' '}
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${selectedClaim.color}`}>
                      {selectedClaim.probability}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['resumen', 'ampliar', 'prueba'] as ClaimTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                        activeTab === tab
                          ? 'bg-amber-400/20 text-amber-200'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === 'resumen' && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Tesis</div>
                    <p className="mt-2 text-sm text-slate-200">{selectedClaim.thesis}</p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Antítesis
                    </div>
                    <p className="mt-2 text-sm text-slate-200">{selectedClaim.antithesis}</p>
                  </div>
                </div>
              )}

              {activeTab === 'ampliar' && (
                <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-200">
                  {selectedClaim.detail}
                </div>
              )}

              {activeTab === 'prueba' && (
                <div className="mt-5 space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Evidencia base
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {selectedClaim.evidence.map((item) => (
                        <li
                          key={item}
                          className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2"
                        >
                          <span>{item}</span>
                          <span className="text-xs text-slate-500">Doc</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Subir archivos vinculados
                    </div>
                    <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      <span>{uploading ? 'Cargando evidencias…' : 'Añadir prueba (PDF/Imagen)'}</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      <span className="text-xs uppercase tracking-[0.2em] text-amber-200">
                        Subir
                      </span>
                    </label>
                    <div className="mt-3 space-y-2">
                      {(claimFiles[selectedClaim.id] ?? []).length === 0 ? (
                        <div className="rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
                          Sin archivos adicionales vinculados.
                        </div>
                      ) : (
                        (claimFiles[selectedClaim.id] ?? []).map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-300"
                          >
                            <div>
                              <div className="text-sm text-slate-200">{file.filename}</div>
                              <div className="text-xs text-slate-500">
                                {formatBytes(file.size)} · {file.mime || 'archivo'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(selectedClaim.id, file.id)}
                              className="rounded-full border border-slate-700/70 px-2 py-1 text-xs text-slate-400 hover:text-slate-200"
                            >
                              Quitar
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="p-5">
            <SectionTitle title="Panel de deberes" subtitle="Tasks con prioridad" />
            <div className="mt-4 space-y-3">
              {TASKS.map((task) => (
                <div
                  key={task.title}
                  className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-200">{task.title}</div>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        task.priority === 'alta'
                          ? 'border-rose-400/40 bg-rose-500/10 text-rose-200'
                          : task.priority === 'media'
                          ? 'border-amber-400/40 bg-amber-500/10 text-amber-200'
                          : 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">Vence: {task.due}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Documentación a consultar" subtitle="Solicitudes activas" />
            <div className="mt-4 space-y-3">
              {PENDING_DOCS.map((doc) => (
                <div
                  key={doc.title}
                  className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-200">{doc.title}</div>
                    <span className="rounded-full border border-slate-700/80 px-2 py-0.5 text-xs text-slate-400">
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{doc.note}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-6">
          <SectionTitle title="Cronología combinada" subtitle="Hitos + hechos + documentos" />
          <div className="mt-5 space-y-3">
            {timelineItems.map((item) => (
              <div
                key={`${item.type}-${item.date}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-sm"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.type}
                  </div>
                  <div className="font-semibold text-slate-200">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.detail}</div>
                </div>
                <div className="text-xs text-slate-400">{item.date}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-rose-500/50 bg-black/70">
          <SectionTitle
            title="Modo Audiencia Previa"
            subtitle="Interfaz simplificada rojo/negro"
          />
          <div className="mt-4 space-y-4">
            {AUDIENCE_CHECKLIST.map((phase) => (
              <div key={phase.phase}>
                <div className="text-xs uppercase tracking-[0.2em] text-rose-300">
                  {phase.phase}
                </div>
                <ul className="mt-2 space-y-2 text-xs text-slate-200">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 rounded-lg border border-rose-500/20 bg-black/60 px-2 py-1"
                    >
                      <span className="text-rose-400">▣</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-rose-300">
                Guiones listos
              </div>
              <ul className="mt-2 space-y-2 text-xs text-slate-200">
                {AUDIENCE_SCRIPTS.map((script) => (
                  <li
                    key={script}
                    className="rounded-lg border border-rose-500/20 bg-black/60 px-2 py-2"
                  >
                    “{script}”
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {CASES.map((caseItem) => (
          <Card key={caseItem.id} className="p-5">
            <SectionTitle title={caseItem.title} subtitle={caseItem.court} />
            <div className="mt-3 text-sm text-slate-300">{caseItem.autos}</div>
            <div className="mt-2 text-xs text-slate-500">{caseItem.status}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {caseItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-700/70 bg-slate-900/40 px-3 py-1 text-xs text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </section>
    </div>
  );
}
