// ============================================
// CASE OPS - Analytics Dashboard (Dexie live)
// ============================================

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { db } from '../../db/schema';
import type { CaseStatus } from '../../types';

type StatusBucket = {
  status: CaseStatus;
  label: string;
  count: number;
};

const STATUS_LABEL: Record<CaseStatus, string> = {
  activo: 'Activo',
  suspendido: 'Suspendido',
  archivado: 'Archivado',
  cerrado: 'Cerrado',
};

export function AnalyticsDashboard() {
  const navigate = useNavigate();

  const cases = useLiveQuery(async () => {
    // OJO: aquí ya son datos reales de Dexie
    return db.cases.toArray();
  }, []);

  const statusData: StatusBucket[] = useMemo(() => {
    const base: Record<CaseStatus, number> = {
      activo: 0,
      suspendido: 0,
      archivado: 0,
      cerrado: 0,
    };

    for (const currentCase of cases ?? []) {
      base[currentCase.status] = (base[currentCase.status] ?? 0) + 1;
    }

    return (Object.keys(base) as CaseStatus[]).map((status) => ({
      status,
      label: STATUS_LABEL[status],
      count: base[status],
    }));
  }, [cases]);

  const totalCases = useMemo(() => (cases ? cases.length : 0), [cases]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analítica</h1>
          <p className="page-subtitle">
            Datos en vivo desde tu base local · {totalCases} casos
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ marginBottom: 8 }}>Demandas por estado</h3>
          <p className="text-muted" style={{ marginBottom: 16, fontSize: 13 }}>
            Click en una barra para abrir la lista de casos filtrada.
          </p>

          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  onClick={(data) => {
                    const status = (data?.payload?.status ??
                      null) as CaseStatus | null;
                    if (!status) {
                      return;
                    }
                    navigate(`/cases?status=${encodeURIComponent(status)}`);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hueco para ampliar: métricas económicas, fases, juzgados, etc. */}
      <div className="mt-md text-muted" style={{ fontSize: 13 }}>
        Próximo: sumar gráficos de Partidas (importe total por estado), plazos y
        “fase procesal” cuando amplíes el schema.
      </div>
    </div>
  );
}
