// ============================================
// CHALADITA CASE-OPS - Vista de Procedimientos
// Lista de procedimientos con hechos expandibles
// ============================================

import { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { casesRepo, factsRepo, documentsRepo, partidasRepo } from '../db/repositories';
import { HechoCardChaladitaExpandible } from './HechoCardChaladita';
import type { Case, Fact } from '../types';

type HechoCase = Fact & {
  fecha: string;
  resumenCorto: string;
  tesis: string;
  antitesisEsperada: string;
  fuerza: number;
  riesgo: Fact['risk'];
  pruebasEsperadas: string[];
};

function mapFactToHecho(fact: Fact, linkedDocTags: string[]): HechoCase {
  return {
    ...fact,
    fecha: new Date(fact.updatedAt).toISOString().slice(0, 10),
    resumenCorto: fact.narrative,
    tesis: fact.narrative,
    // TODO: CaseOpsDB no modela antítesis esperada por hecho.
    antitesisEsperada: 'No disponible en el esquema actual.',
    fuerza: fact.strength,
    riesgo: fact.risk,
    pruebasEsperadas: linkedDocTags,
  };
}

function HechosList({ procedimientoId }: { procedimientoId: string }) {
  const hechos = useLiveQuery(async () => {
    const [facts, docs] = await Promise.all([
      factsRepo.getByCaseId(procedimientoId),
      documentsRepo.getByCaseId(procedimientoId),
    ]);

    const docsCountByHecho: Record<string, number> = {};
    const hechosMapped = facts.map((fact) => {
      const tags = fact.tags.filter((tag) => docs.some((doc) => doc.tags.includes(tag)));
      docsCountByHecho[fact.id] = tags.length;
      return {
        hecho: mapFactToHecho(fact, tags),
        documentosVinculados: docsCountByHecho[fact.id] || 0,
      };
    });

    return hechosMapped;
  }, [procedimientoId]) ?? [];

  if (hechos.length === 0) {
    return <p className="text-sm text-slate-500 text-center py-4">No hay hechos registrados para este procedimiento.</p>;
  }

  return (
    <div className="space-y-3">
      {hechos.map(({ hecho, documentosVinculados }) => (
        <HechoCardChaladitaExpandible key={hecho.id} hecho={hecho} documentosVinculados={documentosVinculados} />
      ))}
    </div>
  );
}

function ProcedimientoCard({ proc, isSelected, onSelect }: { proc: Case; isSelected: boolean; onSelect: () => void }) {
  const totals = useLiveQuery(async () => {
    const partidas = await partidasRepo.getByCaseId(proc.id);
    const totalReclamado = partidas
      .filter((p) => p.state === 'reclamada')
      .reduce((sum, p) => sum + p.amountCents, 0);
    const totalPrescrito = partidas
      .filter((p) => p.state === 'prescrita')
      .reduce((sum, p) => sum + p.amountCents, 0);

    return { totalReclamado, totalPrescrito };
  }, [proc.id]) ?? { totalReclamado: 0, totalPrescrito: 0 };

  const estadoColors: Record<string, string> = {
    preparacion: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    en_tramite: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    senalado: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    ejecucion: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    cerrado: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-200
        ${isSelected
          ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
          : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600/50'}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${estadoColors[proc.status] || estadoColors.preparacion}`}>
              {proc.status}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{proc.autosNumber}</span>
          </div>

          <h3 className="font-semibold text-white text-sm leading-tight mb-1">{proc.title}</h3>
          <p className="text-xs text-slate-400 truncate mb-2">{proc.court}</p>
          <p className="text-xs text-slate-500 line-clamp-2">{proc.notes || 'Sin objetivo inmediato registrado.'}</p>

          <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-700/50">
            <div>
              <span className="text-[10px] text-slate-500 block">Reclamado</span>
              <span className="text-sm font-bold text-emerald-400">
                {(totals.totalReclamado / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
              </span>
            </div>
            {totals.totalPrescrito > 0 && (
              <div>
                <span className="text-[10px] text-slate-500 block">Prescrito</span>
                <span className="text-sm font-bold text-rose-400">
                  {(totals.totalPrescrito / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>
        </div>

        {isSelected && <span className="text-amber-400">▶</span>}
      </div>
    </button>
  );
}

export function ProcedimientosChaladita() {
  const procedimientos = useLiveQuery(() => casesRepo.getAll(), []) ?? [];
  const [selectedProcId, setSelectedProcId] = useState<string>('');

  if (procedimientos.length > 0 && !selectedProcId) {
    setSelectedProcId(procedimientos[0].id);
  }

  const selectedProc = procedimientos.find((p) => p.id === selectedProcId);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 mb-1">Chaladita Case-Ops</p>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Procedimientos</h1>
        <p className="text-sm text-slate-400 mt-1">{procedimientos.length} procedimientos cargados. Selecciona uno para ver sus hechos.</p>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Procedimientos</h2>
          {procedimientos.map((proc) => (
            <ProcedimientoCard key={proc.id} proc={proc} isSelected={proc.id === selectedProcId} onSelect={() => setSelectedProcId(proc.id)} />
          ))}
        </div>

        <div>
          {selectedProc ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hechos de</h2>
                  <h3 className="text-lg font-bold text-slate-100">{selectedProc.title}</h3>
                </div>
                <span className="text-xs text-slate-500 font-mono">{selectedProc.id}</span>
              </div>
              <HechosList procedimientoId={selectedProcId} />
            </>
          ) : (
            <div className="text-center py-12 text-slate-500">Selecciona un procedimiento para ver sus hechos.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProcedimientosChaladita;
