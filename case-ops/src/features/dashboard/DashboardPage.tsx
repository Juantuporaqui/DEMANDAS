// ============================================
// CASE OPS - Dashboard Page (Dark Mode Fusion)
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  casesRepo,
  documentsRepo,
  factsRepo,
  partidasRepo,
  getAlerts,
} from '../../db/repositories';
import { formatCurrency } from '../../utils/validators';
import type { Case, Fact } from '../../types';
import Card from '../../ui/components/Card';
import EmptyState from '../../ui/components/EmptyState';
import SectionTitle from '../../ui/components/SectionTitle';
import Stat from '../../ui/components/Stat';

export function DashboardPage() {
  const [stats, setStats] = useState({
    cases: 0,
    documents: 0,
    facts: 0,
    factsControvertidos: 0,
    partidas: 0,
    totalAmount: 0,
  });
  const [alerts, setAlerts] = useState<
    { id: string; type: string; title: string; description: string }[]
  >([]);
  const [activeCase, setActiveCase] = useState<Case | null>(null);
  const [recentFacts, setRecentFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [cases, documents, facts, partidas, alertsData] = await Promise.all([
        casesRepo.getAll(),
        documentsRepo.getAll(),
        factsRepo.getAll(),
        partidasRepo.getAll(),
        getAlerts(),
      ]);

      if (cases.length > 0) setActiveCase(cases[0]);

      const controversial = facts.filter(
        (f) => f.status === 'controvertido' || f.status === 'a_probar'
      );
      setRecentFacts(controversial.slice(0, 5));

      const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);

      setStats({
        cases: cases.length,
        documents: documents.length,
        facts: facts.length,
        factsControvertidos: controversial.length,
        partidas: partidas.length,
        totalAmount,
      });

      setAlerts(alertsData.slice(0, 3));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-400 font-medium">Panel de control ejecutivo</p>
        </div>
        <Link
          to="/settings"
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          Ajustes
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/documents" className="block transition-transform hover:-translate-y-1">
          <Card className="p-5">
            <Stat label="Documentos" value={stats.documents} />
          </Card>
        </Link>
        <Link to="/facts" className="block transition-transform hover:-translate-y-1">
          <Card className="p-5">
            <Stat label="Hechos" value={stats.factsControvertidos} delta="Controvertidos" />
          </Card>
        </Link>
        <Link to="/partidas" className="block transition-transform hover:-translate-y-1">
          <Card className="p-5">
            <Stat label="Partidas" value={stats.partidas} />
          </Card>
        </Link>
        <Card className="p-5">
          <Stat label="Total económico" value={formatCurrency(stats.totalAmount)} />
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card className="p-6">
          <SectionTitle
            title="Tendencias"
            subtitle="Volumen operativo consolidado"
          />
          <div className="mt-6 h-64">
            <ResponsiveContainer>
              <BarChart
                data={[
                  { name: 'Casos', value: stats.cases },
                  { name: 'Docs', value: stats.documents },
                  { name: 'Hechos', value: stats.factsControvertidos },
                  { name: 'Partidas', value: stats.partidas },
                ]}
              >
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                  itemStyle={{ color: '#60a5fa' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle
              title="Caso activo"
              action={
                <Link to="/cases" className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300">
                  Ver todos
                </Link>
              }
            />
            <div className="mt-4">
              {activeCase ? (
                <Link
                  to={`/cases/${activeCase.id}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-700/50 bg-slate-800/50 px-3 py-3 hover:bg-slate-800 transition-colors"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900/30 text-blue-400 text-lg">
                    ⚖️
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-200">{activeCase.title}</div>
                    <div className="truncate text-xs text-slate-500 font-medium">
                      {activeCase.court} · {activeCase.autosNumber}
                    </div>
                  </div>
                </Link>
              ) : (
                <EmptyState title="Sin caso activo" description="Carga un expediente." />
              )}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Alertas" subtitle="Novedades operativas" />
            <div className="mt-4 space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2.5"
                  >
                    <span className="mt-0.5 text-base">
                      {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-slate-300">
                        {alert.title}
                      </div>
                      <div className="text-xs text-slate-500">
                        {alert.description}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500 italic py-2">Todo en orden.</div>
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="Hechos a probar"
            subtitle="Prioridades jurídicas"
            action={<Link to="/facts" className="text-xs font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300">Ver todos</Link>}
          />
          <div className="mt-4 space-y-2">
            {recentFacts.map((fact) => (
              <Link
                key={fact.id}
                to={`/facts/${fact.id}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      fact.risk === 'alto'
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                        : fact.risk === 'medio'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-300">{fact.title}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-600">›</span>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Acciones rápidas" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Nuevo documento', to: '/documents/new', accent: false },
              { label: 'Nuevo hecho', to: '/facts/new', accent: false },
              { label: 'Nueva partida', to: '/partidas/new', accent: false },
              { label: 'Buscar global', to: '/search', accent: true },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
                  action.accent
                    ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-500'
                    : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                {action.label} <span className="opacity-70">↗</span>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
