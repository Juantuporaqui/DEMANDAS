// ============================================
// CASE OPS - Cases List (Dark Mode Fusion)
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../../components';
import { casesRepo } from '../../db/repositories';
import type { Case } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  activo: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]',
  suspendido: 'bg-amber-500',
  archivado: 'bg-slate-600',
  cerrado: 'bg-slate-700',
};

export function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    casesRepo.getAll().then(setCases).finally(() => setLoading(false));
  }, []);

  const mainCases = cases.filter((c) => !c.parentCaseId);
  const childCases = cases.filter((c) => c.parentCaseId);

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando casos...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Casos</h1>
          <p className="text-sm text-slate-400">{cases.length} procedimientos activos</p>
        </div>
        <Link to="/cases/new" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 transition-colors">
          Nuevo Caso
        </Link>
      </div>

      {cases.length === 0 ? (
        <EmptyState title="Sin casos" description="Crea tu primer procedimiento judicial." />
      ) : (
        <div className="grid gap-4">
          {mainCases.map((caseItem) => {
            const children = childCases.filter((c) => c.parentCaseId === caseItem.id);
            return (
              <div key={caseItem.id} className="space-y-2">
                <Link to={`/cases/${caseItem.id}`} className="block group">
                  <div className="relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 transition-all hover:border-slate-600 hover:bg-slate-800">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-900/20 text-2xl group-hover:bg-blue-900/40 transition-colors">
                        ⚖️
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-base font-bold text-slate-200 group-hover:text-white">
                            {caseItem.title}
                          </h3>
                          <span className={`h-2 w-2 rounded-full ${STATUS_COLORS[caseItem.status] || 'bg-slate-500'}`} />
                        </div>
                        <p className="text-sm text-slate-500 mt-1 font-medium">
                          {caseItem.court} <span className="text-slate-700 mx-1">•</span> {caseItem.autosNumber || 'S/N'}
                        </p>

                        <div className="mt-3 flex gap-2">
                          <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 border border-slate-700">
                            {caseItem.type}
                          </span>
                        </div>
                      </div>
                      <span className="self-center text-slate-600 group-hover:text-slate-400">›</span>
                    </div>
                  </div>
                </Link>

                {children.length > 0 && (
                  <div className="ml-8 border-l-2 border-slate-800 pl-6 space-y-2">
                    {children.map((child) => (
                      <Link key={child.id} to={`/cases/${child.id}`} className="block rounded-lg border border-slate-800 bg-slate-900/50 p-3 hover:bg-slate-800 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-lg opacity-70">
                            {child.type === 'ejecucion' ? '📋' : '📄'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-slate-300 truncate">{child.title}</div>
                            <div className="text-xs text-slate-600">{child.type}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
