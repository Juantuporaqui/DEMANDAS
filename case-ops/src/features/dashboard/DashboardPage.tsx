import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import Stat from '../../ui/components/Stat';
import {
  casesRepo,
  claimsRepo,
  docFilesRepo,
  documentsRepo,
  linksRepo,
  tasksRepo,
  docRequestsRepo,
  timelineEventsRepo,
  jurisprudenceRepo,
} from '../../db/repositories';
import type { Case, Claim, Task, DocRequest, TimelineEvent, Jurisprudence, Document } from '../../types';
import { formatBytes, formatCurrency } from '../../utils/validators';
import { formatDate } from '../../utils/dates';
import { sha256 } from '../../utils/hash';

type ClaimTab = 'resumen' | 'ampliar' | 'documentos' | 'estrategias';

type ClaimDocument = {
  linkId: string;
  document: Document;
  filename: string;
  size: number;
  mime: string;
};

const WIN_CHANCE_STYLES: Record<Claim['winChance'], string> = {
  alta: 'border-emerald-400/50 bg-emerald-500/10 text-emerald-200',
  media: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
  baja: 'border-rose-400/50 bg-rose-500/10 text-rose-200',
};

export function DashboardPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [docRequests, setDocRequests] = useState<DocRequest[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [jurisprudence, setJurisprudence] = useState<Jurisprudence[]>([]);
  const [claimDocuments, setClaimDocuments] = useState<Record<string, ClaimDocument[]>>({});
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ClaimTab>('resumen');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const [casesData, claimsData, tasksData, docRequestsData, timelineData, jurisprudenceData] =
        await Promise.all([
          casesRepo.getAll(),
          claimsRepo.getAll(),
          tasksRepo.getAll(),
          docRequestsRepo.getAll(),
          timelineEventsRepo.getAll(),
          jurisprudenceRepo.getAll(),
        ]);

      if (!mounted) return;
      setCases(casesData);
      setClaims(claimsData);
      setTasks(tasksData);
      setDocRequests(docRequestsData);
      setTimelineEvents(timelineData);
      setJurisprudence(jurisprudenceData);

      const firstActiveCase = casesData.find((caseItem) => caseItem.status === 'activo');
      const initialCaseId = firstActiveCase?.id ?? casesData[0]?.id ?? '';
      setSelectedCaseId(initialCaseId);
      const caseClaims = claimsData.filter((claim) => claim.caseId === initialCaseId);
      setSelectedClaimId(caseClaims[0]?.id ?? '');
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadClaimDocs = async () => {
      if (claims.length === 0) return;
      const entries = await Promise.all(
        claims.map(async (claim) => {
          const links = await linksRepo.getByTo('claim', claim.id);
          const documentLinks = links.filter((link) => link.fromType === 'document');
          const docs = await Promise.all(
            documentLinks.map(async (link) => {
              const document = await documentsRepo.getById(link.fromId);
              if (!document) return null;
              const file = document.fileId ? await docFilesRepo.getById(document.fileId) : undefined;
              return {
                linkId: link.id,
                document,
                filename: file?.filename ?? document.title,
                size: file?.size ?? 0,
                mime: file?.mime ?? 'documento',
              } as ClaimDocument;
            })
          );
          return { claimId: claim.id, docs: docs.filter(Boolean) as ClaimDocument[] };
        })
      );
      if (!mounted) return;
      const mapped = entries.reduce<Record<string, ClaimDocument[]>>((acc, entry) => {
        acc[entry.claimId] = entry.docs;
        return acc;
      }, {});
      setClaimDocuments(mapped);
    };
    void loadClaimDocs();
    return () => {
      mounted = false;
    };
  }, [claims]);

  useEffect(() => {
    if (!selectedCaseId) return;
    const caseClaims = claims.filter((claim) => claim.caseId === selectedCaseId);
    if (!caseClaims.find((claim) => claim.id === selectedClaimId)) {
      setSelectedClaimId(caseClaims[0]?.id ?? '');
    }
  }, [claims, selectedCaseId, selectedClaimId]);

  const selectedCase = useMemo(
    () => cases.find((caseItem) => caseItem.id === selectedCaseId),
    [cases, selectedCaseId]
  );

  const caseClaims = useMemo(
    () => claims.filter((claim) => claim.caseId === selectedCaseId),
    [claims, selectedCaseId]
  );

  const selectedClaim = useMemo(
    () => claims.find((claim) => claim.id === selectedClaimId),
    [claims, selectedClaimId]
  );

  const totalClaimed = useMemo(
    () => caseClaims.reduce((sum, claim) => sum + claim.amount, 0),
    [caseClaims]
  );

  const timelineItems = useMemo(() => {
    return timelineEvents
      .filter((item) => !item.caseId || item.caseId === selectedCaseId)
      .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
  }, [timelineEvents, selectedCaseId]);

  const claimJurisprudence = useMemo(() => {
    if (!selectedClaim) return [];
    return jurisprudence.filter((item) => item.linkedClaimIds.includes(selectedClaim.id));
  }, [jurisprudence, selectedClaim]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !selectedClaim || !selectedCase) return;

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

          const document = await documentsRepo.create({
            caseId: selectedCase.id,
            title: file.name,
            docType: 'prueba',
            source: 'Carga local',
            docDate: new Date().toISOString().split('T')[0],
            tags: [selectedClaim.shortLabel],
            hashSha256,
            fileId: stored.id,
            pagesCount: 0,
            annexCode: '',
            notes: `Documento vinculado a ${selectedClaim.shortLabel}.`,
          });

          const link = await linksRepo.create(
            'document',
            document.id,
            'claim',
            selectedClaim.id,
            'evidence',
            'Adjunto reclamación'
          );

          await claimsRepo.update(selectedClaim.id, {
            linkedDocIds: [...selectedClaim.linkedDocIds, document.id],
          });

          return {
            linkId: link.id,
            document,
            filename: stored.filename,
            size: stored.size,
            mime: stored.mime,
          } as ClaimDocument;
        })
      );

      setClaimDocuments((prev) => ({
        ...prev,
        [selectedClaim.id]: [...(prev[selectedClaim.id] ?? []), ...updates],
      }));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleRemoveFile = async (claimId: string, linkId: string) => {
    await linksRepo.delete(linkId);
    setClaimDocuments((prev) => ({
      ...prev,
      [claimId]: (prev[claimId] ?? []).filter((file) => file.linkId !== linkId),
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
            {selectedCase?.title ?? 'Procedimiento activo'}
          </h1>
          <p className="text-sm text-slate-400">
            {selectedCase
              ? `${selectedCase.autosNumber || 'Sin autos'} · ${selectedCase.court}`
              : 'Selecciona un procedimiento para iniciar'}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/70 px-4 py-3">
          <div className="text-xs uppercase text-slate-400">Estrategia principal</div>
          <div className="text-sm font-semibold text-slate-200">
            {claimJurisprudence[0]?.ref ?? 'Sin jurisprudencia vinculada'}
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <Stat label="Total reclamado" value={formatCurrency(totalClaimed)} />
          <div className="mt-2 text-xs text-slate-500">Suma de reclamaciones activas</div>
        </Card>
        <Card className="p-5">
          <Stat label="Reclamaciones" value={caseClaims.length} delta="Tiles activos" />
          <div className="mt-2 text-xs text-slate-500">Núcleo de estrategia</div>
        </Card>
        <Card className="p-5">
          <Stat label="Docs pendientes" value={docRequests.length} />
          <div className="mt-2 text-xs text-slate-500">Solicitudes en curso</div>
        </Card>
        <Card className="p-5">
          <Stat label="Deberes críticos" value={tasks.length} />
          <div className="mt-2 text-xs text-slate-500">Prioridades en sala</div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-6">
          <SectionTitle title="Reclamaciones" subtitle="Vista por tiles con probabilidad" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {caseClaims.map((claim) => (
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
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full border ${WIN_CHANCE_STYLES[claim.winChance]}`}
                    />
                    {claim.title}
                  </span>
                </div>
                <span className="text-sm text-slate-200">
                  {formatCurrency(claim.amount)}
                </span>
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
                    {formatCurrency(selectedClaim.amount)} · Probabilidad{' '}
                    <span
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        WIN_CHANCE_STYLES[selectedClaim.winChance]
                      }`}
                    >
                      {selectedClaim.winChance}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(['resumen', 'ampliar', 'documentos', 'estrategias'] as ClaimTab[]).map(
                    (tab) => (
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
                    )
                  )}
                </div>
              </div>

              {activeTab === 'resumen' && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Resumen</div>
                    <p className="mt-2 text-sm text-slate-200">
                      {selectedClaim.summaryShort}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Defensa
                    </div>
                    <p className="mt-2 text-sm text-slate-200">
                      {selectedClaim.defenseShort}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ampliar' && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-200">
                    {selectedClaim.summaryLong}
                  </div>
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-200">
                    {selectedClaim.defenseLong}
                  </div>
                </div>
              )}

              {activeTab === 'documentos' && (
                <div className="mt-5 space-y-4">
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
                      {(claimDocuments[selectedClaim.id] ?? []).length === 0 ? (
                        <div className="rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
                          Sin documentos vinculados.
                        </div>
                      ) : (
                        (claimDocuments[selectedClaim.id] ?? []).map((file) => (
                          <div
                            key={file.linkId}
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
                              onClick={() => handleRemoveFile(selectedClaim.id, file.linkId)}
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

              {activeTab === 'estrategias' && (
                <div className="mt-5 space-y-4">
                  <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-200">
                    {selectedClaim.defenseLong}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Jurisprudencia vinculada
                    </div>
                    <ul className="mt-3 space-y-2 text-sm text-slate-200">
                      {claimJurisprudence.length === 0 ? (
                        <li className="rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2 text-xs text-slate-500">
                          Sin jurisprudencia vinculada.
                        </li>
                      ) : (
                        claimJurisprudence.map((item) => (
                          <li
                            key={item.id}
                            className="rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-2"
                          >
                            <div className="text-sm font-semibold text-slate-200">{item.ref}</div>
                            <div className="text-xs text-slate-500">
                              {item.court} · {formatDate(item.dateISO)}
                            </div>
                            <div className="text-xs text-slate-400">{item.summaryShort}</div>
                          </li>
                        ))
                      )}
                    </ul>
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
              {tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
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
                  <div className="mt-1 text-xs text-slate-500">
                    Vence: {task.dueDate ? formatDate(task.dueDate) : 'Sin fecha'}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Documentación a consultar" subtitle="Solicitudes activas" />
            <div className="mt-4 space-y-3">
              {docRequests.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-800/70 bg-slate-900/40 px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-slate-200">{doc.title}</div>
                    <span className="rounded-full border border-slate-700/80 px-2 py-0.5 text-xs text-slate-400">
                      {doc.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{doc.purpose}</div>
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
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800/70 bg-slate-900/40 px-4 py-3 text-sm"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.importance}
                  </div>
                  <div className="font-semibold text-slate-200">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.description}</div>
                </div>
                <div className="text-xs text-slate-400">{formatDate(item.dateISO)}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-rose-500/50 bg-black/70">
          <SectionTitle
            title="Modo Audiencia Previa"
            subtitle="Interfaz simplificada rojo/negro"
          />
          <div className="mt-4 space-y-3 text-xs text-slate-200">
            <div>Configura la audiencia previa por fases y guion de sala.</div>
            <Link
              to="/audiencia-previa"
              className="inline-flex items-center rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-200"
            >
              Abrir audiencia previa →
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
