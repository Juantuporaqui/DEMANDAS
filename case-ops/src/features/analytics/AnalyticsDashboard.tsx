// ============================================
// CASE OPS - Analytics Dashboard
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
import type { CaseStatus } from '../../types';
import { db } from '../../db/schema';

const statusLabels: Record<CaseStatus, string> = {
  activo: 'Activo',
  suspendido: 'Suspendido',
  archivado: 'Archivado',
  cerrado: 'Cerrado',
};

const statusOrder: CaseStatus[] = ['activo', 'suspendido', 'archivado', 'cerrado'];

export function AnalyticsDashboard() {
  const navigate = useNavigate();
  const cases = useLiveQuery(() => db.cases.toArray(), []);

  const chartData = useMemo(() => {
    const counts: Record<CaseStatus, number> = {
      activo: 0,
      suspendido: 0,
      archivado: 0,
      cerrado: 0,
    };

    (cases ?? []).forEach((caseItem) => {
      counts[caseItem.status] = (counts[caseItem.status] || 0) + 1;
    });

    return statusOrder.map((status) => ({
      name: statusLabels[status],
      count: counts[status],
      status,
    }));
  }, [cases]);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Analítica</h1>
          <p className="page-subtitle">Dashboard en construcción</p>
        </div>
      </header>

      <section className="card">
        <div className="card-header">
          <h2 className="card-title">Casos por estado</h2>
        </div>
        <div className="card-body" style={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar
                dataKey="count"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                onClick={(data) => {
                  const payload = data?.payload as { status?: CaseStatus } | undefined;
                  if (payload?.status) {
                    navigate(`/cases?status=${payload.status}`);
                  }
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
