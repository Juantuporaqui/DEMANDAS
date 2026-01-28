import { useEffect, useMemo, useState } from 'react';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import {
  casesRepo,
  claimsRepo,
  jurisprudenceRepo,
  strategiesRepo,
  linksRepo,
} from '../../db/repositories';
import type { Case, Claim, Jurisprudence, Strategy, Link } from '../../types';
import { formatDate } from '../../utils/dates';

export function ToolsPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [jurisprudence, setJurisprudence] = useState<Jurisprudence[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedClaimId, setSelectedClaimId] = useState<string>('');
  const [selectedJurisprudenceId, setSelectedJurisprudenceId] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      const [casesData, claimsData, jurisprudenceData, strategiesData, linksData] =
        await Promise.all([
          casesRepo.getAll(),
          claimsRepo.getAll(),
          jurisprudenceRepo.getAll(),
          strategiesRepo.getAll(),
          linksRepo.getAll(),
        ]);

      if (!mounted) return;
      setCases(casesData);
      setClaims(claimsData);
      setJurisprudence(jurisprudenceData);
      setStrategies(strategiesData);
      setLinks(linksData);

      const firstClaim = claimsData[0];
      setSelectedClaimId(firstClaim?.id ?? '');
      setSelectedJurisprudenceId(jurisprudenceData[0]?.id ?? '');
    };

    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedClaim = useMemo(
    () => claims.find((claim) => claim.id === selectedClaimId),
    [claims, selectedClaimId]
  );

  const claimOptions = useMemo(() => {
    return claims.map((claim) => {
      const caseItem = cases.find((caseData) => caseData.id === claim.caseId);
      return {
        id: claim.id,
        label: `${claim.shortLabel} · ${claim.title}`,
        caseLabel: caseItem?.title ?? 'Procedimiento',
      };
    });
  }, [claims, cases]);

  const filteredJurisprudence = useMemo(() => {
    if (!selectedClaim) return jurisprudence;
    return jurisprudence.filter((item) => item.linkedClaimIds.includes(selectedClaim.id));
  }, [jurisprudence, selectedClaim]);

  const selectedJurisprudence = useMemo(
    () => jurisprudence.find((item) => item.id === selectedJurisprudenceId),
    [jurisprudence, selectedJurisprudenceId]
  );

  const strategiesWithClaims = useMemo(() => {
    return strategies.map((strategy) => {
      const linked = links
        .filter((link) => link.fromType === 'strategy' && link.fromId === strategy.id)
        .map((link) => link.toId);
      const fallbackClaims = claims
        .filter((claim) => claim.caseId === strategy.caseId)
        .map((claim) => claim.id);
      const claimIds = linked.length > 0 ? linked : fallbackClaims;
      return {
        ...strategy,
        claimIds,
      };
    });
  }, [strategies, links, claims]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
            Herramientas
          </p>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Jurisprudencia y estrategias defensivas
          </h1>
          <p className="text-sm text-slate-400">
            Referencias legales y guiones estratégicos vinculados a reclamaciones.
          </p>
        </div>
        <select
          value={selectedClaimId}
          onChange={(event) => setSelectedClaimId(event.target.value)}
          className="rounded-xl border border-slate-800/70 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"
        >
          {claimOptions.map((claim) => (
            <option key={claim.id} value={claim.id}>
              {claim.label} · {claim.caseLabel}
            </option>
          ))}
        </select>
      </header>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-6">
          <SectionTitle title="Jurisprudencia" subtitle="Listado vinculado por reclamación" />
          <div className="mt-4 space-y-3">
            {filteredJurisprudence.length === 0 ? (
              <div className="rounded-lg border border-slate-800/70 bg-slate-900/40 px-3 py-3 text-sm text-slate-500">
                No hay jurisprudencia vinculada a esta reclamación.
              </div>
            ) : (
              filteredJurisprudence.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedJurisprudenceId(item.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
                    selectedJurisprudenceId === item.id
                      ? 'border-amber-400/60 bg-amber-500/10 text-amber-100'
                      : 'border-slate-800/70 bg-slate-900/40 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{item.ref}</div>
                    <span className="text-xs text-slate-400">{formatDate(item.dateISO)}</span>
                  </div>
                  <div className="text-xs text-slate-400">{item.court}</div>
                  <div className="text-xs text-slate-500">{item.summaryShort}</div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Detalle" subtitle="Resumen extendido" />
          {selectedJurisprudence ? (
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                {selectedJurisprudence.ref}
              </div>
              <div className="text-xs text-slate-400">
                {selectedJurisprudence.court} · {formatDate(selectedJurisprudence.dateISO)}
              </div>
              <p>{selectedJurisprudence.summaryLong}</p>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-500">Selecciona una referencia.</div>
          )}
        </Card>
      </section>

      <section className="space-y-4">
        <SectionTitle title="Estrategias defensivas" subtitle="Guiones vinculados a reclamaciones" />
        <div className="grid gap-4 lg:grid-cols-2">
          {strategiesWithClaims.map((strategy) => (
            <Card key={strategy.id} className="p-5">
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Ataque</div>
              <div className="mt-1 text-sm text-slate-200">{strategy.attack}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">Respuesta</div>
              <div className="mt-1 text-sm text-slate-200">{strategy.rebuttal}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.3em] text-slate-500">
                Evidencia sugerida
              </div>
              <div className="mt-1 text-xs text-slate-400">{strategy.evidencePlan}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {strategy.claimIds.map((claimId) => (
                  <span
                    key={claimId}
                    className="rounded-full border border-slate-700/70 bg-slate-900/40 px-3 py-1 text-xs text-slate-300"
                  >
                    {claims.find((claim) => claim.id === claimId)?.shortLabel ?? 'Reclamación'}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
