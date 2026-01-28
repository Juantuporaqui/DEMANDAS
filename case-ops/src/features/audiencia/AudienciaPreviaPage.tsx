import { useEffect, useMemo, useState } from 'react';
import { casesRepo, audienciaPhasesRepo, claimsRepo, documentsRepo } from '../../db/repositories';
import type { AudienciaPhase, Case, Claim, Document } from '../../types';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import { formatDate } from '../../utils/dates';
import { generateUUID } from '../../utils/id';

const IMPORTANCE_STYLES: Record<string, string> = {
  alta: 'border-rose-400/40 bg-rose-500/10 text-rose-200',
  media: 'border-amber-400/40 bg-amber-500/10 text-amber-200',
  baja: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
};

export function AudienciaPreviaPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [phases, setPhases] = useState<AudienciaPhase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [savingPhaseId, setSavingPhaseId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const [casesData, claimsData, documentsData, phaseData] = await Promise.all([
        casesRepo.getAll(),
        claimsRepo.getAll(),
        documentsRepo.getAll(),
        audienciaPhasesRepo.getAll(),
      ]);

      if (!mounted) return;
      setCases(casesData);
      setClaims(claimsData);
      setDocuments(documentsData);
      setPhases(phaseData);

      const firstActiveCase = casesData.find((caseItem) => caseItem.status === 'activo');
      setSelectedCaseId(firstActiveCase?.id ?? casesData[0]?.id ?? '');
    };

    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const casePhases = useMemo(
    () => phases.filter((phase) => phase.caseId === selectedCaseId),
    [phases, selectedCaseId]
  );

  const claimMap = useMemo(() => new Map(claims.map((claim) => [claim.id, claim])), [claims]);
  const documentMap = useMemo(
    () => new Map(documents.map((doc) => [doc.id, doc])),
    [documents]
  );

  const handleItemChange = (
    phaseId: string,
    itemId: string,
    updates: Partial<AudienciaPhase['items'][number]>
  ) => {
    setPhases((prev) =>
      prev.map((phase) => {
        if (phase.id !== phaseId) return phase;
        return {
          ...phase,
          items: phase.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          ),
        };
      })
    );
  };

  const handlePhaseChange = (phaseId: string, updates: Partial<AudienciaPhase>) => {
    setPhases((prev) =>
      prev.map((phase) => (phase.id === phaseId ? { ...phase, ...updates } : phase))
    );
  };

  const handleAddItem = (phaseId: string) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              items: [
                ...phase.items,
                {
                  id: generateUUID(),
                  title: '',
                  importance: 'media',
                  linkedClaimIds: [],
                  linkedDocIds: [],
                },
              ],
            }
          : phase
      )
    );
  };

  const handleSavePhase = async (phase: AudienciaPhase) => {
    setSavingPhaseId(phase.id);
    try {
      await audienciaPhasesRepo.update(phase.id, {
        phase: phase.phase,
        importance: phase.importance,
        script: phase.script,
        items: phase.items,
      });
    } finally {
      setSavingPhaseId(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-300">
            Audiencia previa
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Guion operativo por fases
          </h1>
          <p className="text-sm text-slate-400">
            Controla la vista con listas editables y guiones listos para sala.
          </p>
        </div>
        <select
          value={selectedCaseId}
          onChange={(event) => setSelectedCaseId(event.target.value)}
          className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
        >
          {cases.map((caseItem) => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.title}
            </option>
          ))}
        </select>
      </header>

      {casePhases.length === 0 ? (
        <Card className="p-6">
          <SectionTitle title="Sin fases configuradas" subtitle="Crea fases para esta audiencia." />
          <p className="mt-3 text-sm text-slate-400">
            No hay fases cargadas para este procedimiento.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {casePhases.map((phase) => (
            <Card key={phase.id} className="p-6 border border-rose-500/30 bg-black/70">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-rose-300">
                    {phase.phase}
                  </div>
                  <div className="mt-1 text-sm text-slate-200">
                    Actualizado: {formatDate(new Date(phase.updatedAt).toISOString())}
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    IMPORTANCE_STYLES[phase.importance] || 'border-slate-500/40 text-slate-300'
                  }`}
                >
                  {phase.importance}
                </span>
              </div>

              <div className="mt-4">
                <label className="text-xs uppercase tracking-[0.2em] text-rose-300">
                  Guion para sala
                </label>
                <textarea
                  value={phase.script}
                  onChange={(event) =>
                    handlePhaseChange(phase.id, { script: event.target.value })
                  }
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-rose-500/20 bg-black/60 p-3 text-sm text-slate-100"
                />
              </div>

              <div className="mt-4 space-y-3">
                {phase.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-rose-500/20 bg-black/60 p-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <input
                        value={item.title}
                        placeholder="Nuevo punto de sala"
                        onChange={(event) =>
                          handleItemChange(phase.id, item.id, { title: event.target.value })
                        }
                        className="w-full flex-1 rounded-lg border border-rose-500/20 bg-black/50 px-3 py-2 text-sm text-slate-100"
                      />
                      <select
                        value={item.importance}
                        onChange={(event) =>
                          handleItemChange(phase.id, item.id, {
                            importance: event.target.value as AudienciaPhase['importance'],
                          })
                        }
                        className="rounded-lg border border-rose-500/20 bg-black/60 px-2 py-1 text-xs text-slate-200"
                      >
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                      </select>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                      {item.linkedClaimIds.map((claimId) => (
                        <span
                          key={claimId}
                          className="rounded-full border border-rose-500/20 bg-black/60 px-2 py-0.5"
                        >
                          {claimMap.get(claimId)?.shortLabel ?? 'Reclamación'}
                        </span>
                      ))}
                      {item.linkedDocIds.map((docId) => (
                        <span
                          key={docId}
                          className="rounded-full border border-rose-500/20 bg-black/60 px-2 py-0.5"
                        >
                          {documentMap.get(docId)?.title ?? 'Documento'}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleAddItem(phase.id)}
                  className="rounded-full border border-rose-500/30 px-3 py-1 text-xs text-rose-200"
                >
                  + Añadir punto
                </button>
                <button
                  type="button"
                  onClick={() => handleSavePhase(phase)}
                  className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
                  disabled={savingPhaseId === phase.id}
                >
                  {savingPhaseId === phase.id ? 'Guardando…' : 'Guardar fase'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
