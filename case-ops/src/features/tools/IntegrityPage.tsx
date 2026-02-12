import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { casesRepo, strategiesRepo } from '../../db/repositories';
import {
  bulkMoveStrategiesByText,
  deleteOrphanStrategies,
  getIntegritySnapshot,
  moveStrategyToCase,
  runDuplicateMergeRepair,
  type IntegritySnapshot,
  type RepairReport,
} from '../../db/integrity';
import type { Strategy } from '../../types';

export function IntegrityPage() {
  const [snapshot, setSnapshot] = useState<IntegritySnapshot | null>(null);
  const [cases, setCases] = useState<Array<{ id: string; title: string }>>([]);
  const [report, setReport] = useState<RepairReport | null>(null);
  const [allStrategies, setAllStrategies] = useState<Strategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkFilter, setBulkFilter] = useState('');
  const [bulkCaseId, setBulkCaseId] = useState('');
  const [bulkMoved, setBulkMoved] = useState<number | null>(null);

  const load = async () => {
    const [snap, allCases, strategies] = await Promise.all([getIntegritySnapshot(), casesRepo.getAll(), strategiesRepo.getAll()]);
    setSnapshot(snap);
    setCases(allCases.map((c) => ({ id: c.id, title: c.title })));
    setAllStrategies(strategies);
    if (!bulkCaseId && allCases.length > 0) {
      setBulkCaseId(allCases[0].id);
    }
  };

  useEffect(() => {
    load().catch((error) => console.error('integrity load error', error));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const strategyRows = useMemo(() => {
    if (!snapshot) return [];
    const byCase = new Map(snapshot.strategiesByCase.map((group) => [group.caseId, group]));
    const rows = allStrategies.map((strategy) => ({
      ...strategy,
      caseTitle: byCase.get(strategy.caseId)?.caseTitle ?? '(caso no encontrado)',
      autosNumber: byCase.get(strategy.caseId)?.autosNumber ?? '(sin autos)',
    }));

    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((row) => {
      const blob = `${row.caseId} ${row.caseTitle} ${row.autosNumber} ${row.attack} ${row.rebuttal} ${(row.tags || []).join(' ')}`.toLowerCase();
      return blob.includes(query);
    });
  }, [snapshot, allStrategies, searchQuery]);

  if (!snapshot) {
    return <div className="text-slate-400">Cargando integridad...</div>;
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-amber-400">Herramientas</p>
        <h1 className="text-2xl font-semibold text-white">Integridad</h1>
      </header>

      <section className="card-base card-subtle p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Duplicados por autosNumber</h2>
        {snapshot.duplicateGroups.length === 0 ? (
          <p className="text-xs text-slate-400">No hay duplicados detectados.</p>
        ) : (
          <div className="space-y-2">
            {snapshot.duplicateGroups.map((group) => (
              <div key={group.autosNumber} className="rounded-lg border border-slate-700 p-3 text-xs text-slate-300">
                <div>
                  Autos: <strong>{group.autosNumber}</strong>
                </div>
                <div>Canónico: {group.canonicalCaseId}</div>
                <div>Duplicados: {group.duplicateCaseIds.join(', ')}</div>
              </div>
            ))}
          </div>
        )}
        <button
          className="btn btn-primary"
          onClick={async () => {
            const confirmed = window.confirm('¿Fusionar duplicados y reasignar entidades ahora?');
            if (!confirmed) return;
            const result = await runDuplicateMergeRepair();
            setReport(result);
            await load();
          }}
        >
          Merge duplicates
        </button>
        {report && (
          <p className="text-xs text-emerald-300">Reparación ejecutada: {report.deletedDuplicateCases} casos eliminados.</p>
        )}
      </section>

      <section className="card-base card-subtle p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Estrategias por caso (detección real)</h2>
        <div className="text-xs text-slate-400">
          {snapshot.strategiesByCase.map((group) => (
            <div key={group.caseId}>
              {group.caseTitle} ({group.autosNumber}) → {group.count} estrategias
            </div>
          ))}
        </div>
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por texto, autos o caso"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs"
        />
        <div className="grid gap-2">
          {strategyRows.map((strategy) => (
            <div key={strategy.id} className="rounded-lg border border-slate-700 bg-slate-900/40 p-3 text-xs">
              <p className="text-slate-200">
                <strong>{strategy.caseTitle}</strong> · {strategy.autosNumber} · {strategy.id}
              </p>
              <p className="text-slate-400 line-clamp-2">{strategy.attack}</p>
              <select
                defaultValue=""
                className="mt-2 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                onChange={async (e) => {
                  if (!e.target.value) return;
                  await moveStrategyToCase(strategy.id, e.target.value);
                  await load();
                }}
              >
                <option value="">Mover a caso…</option>
                {cases.map((caseItem) => (
                  <option key={caseItem.id} value={caseItem.id}>
                    {caseItem.id} - {caseItem.title}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      <section className="card-base card-subtle p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Reasignación masiva por texto</h2>
        <input
          value={bulkFilter}
          onChange={(e) => setBulkFilter(e.target.value)}
          placeholder="Ej: 715/2024 o Picassent"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs"
        />
        <select
          value={bulkCaseId}
          onChange={(e) => setBulkCaseId(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs"
        >
          {cases.map((caseItem) => (
            <option key={caseItem.id} value={caseItem.id}>
              {caseItem.id} - {caseItem.title}
            </option>
          ))}
        </select>
        <button
          className="btn btn-secondary"
          onClick={async () => {
            if (!bulkFilter.trim() || !bulkCaseId) return;
            const ok = window.confirm('¿Aplicar reasignación masiva de estrategias por texto?');
            if (!ok) return;
            const moved = await bulkMoveStrategiesByText(bulkFilter, bulkCaseId);
            setBulkMoved(moved);
            await load();
          }}
        >
          Ejecutar reasignación masiva
        </button>
        {bulkMoved !== null && <p className="text-xs text-emerald-300">Estrategias movidas: {bulkMoved}</p>}
      </section>

      <section className="card-base card-subtle p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Estrategias huérfanas</h2>
        {snapshot.orphanStrategies.length === 0 ? (
          <p className="text-xs text-slate-400">No hay estrategias huérfanas.</p>
        ) : (
          <div className="space-y-2">
            {snapshot.orphanStrategies.map((strategy) => (
              <div key={strategy.id} className="rounded-lg border border-rose-500/40 bg-rose-500/5 p-3 text-xs">
                <p className="text-rose-200">
                  {strategy.id} · caseId={strategy.caseId}
                </p>
                <p className="text-slate-300 line-clamp-2">{strategy.attack}</p>
              </div>
            ))}
          </div>
        )}
        <button
          className="btn btn-secondary"
          onClick={async () => {
            const confirmed = window.confirm('¿Eliminar todas las estrategias huérfanas detectadas?');
            if (!confirmed) return;
            await deleteOrphanStrategies();
            await load();
          }}
        >
          Eliminar huérfanas
        </button>
      </section>

      <section className="card-base card-subtle p-4 space-y-3">
        <h2 className="text-sm font-semibold text-white">Candidatas mal vinculadas</h2>
        {snapshot.mislinkedCandidates.length === 0 ? (
          <p className="text-xs text-slate-400">Sin candidatas sospechosas por texto.</p>
        ) : (
          <div className="space-y-2">
            {snapshot.mislinkedCandidates.map((candidate) => (
              <div key={candidate.strategyId} className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs">
                <p className="text-amber-100">{candidate.strategyId} · {candidate.caseTitle} ({candidate.autosNumber})</p>
                <p className="text-amber-300">{candidate.reason}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <Link to="/tools" className="text-xs text-slate-400 underline">
        Volver a Tools
      </Link>
    </div>
  );
}
