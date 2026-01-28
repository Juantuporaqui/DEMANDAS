// ============================================
// CASE OPS - Dashboard Page
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
import type { Case, Fact, Partida } from '../../types';
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

      // Get active case (first one for now)
      if (cases.length > 0) {
        setActiveCase(cases[0]);
      }

      // Recent controversial facts
      const controversial = facts.filter(
        (f) => f.status === 'controvertido' || f.status === 'a_probar'
      );
      setRecentFacts(controversial.slice(0, 5));

      // Calculate stats
      const totalAmount = partidas.reduce((sum, p) => sum + p.amountCents, 0);

      setStats({
        cases: cases.length,
        documents: documents.length,
        facts: facts.length,
        factsControvertidos: controversial.length,
        partidas: partidas.length,
        totalAmount,
      });

      // Limit alerts to 3
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
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>
          <p className="text-sm text-zinc-500">Panel de control ejecutivo</p>
        </div>
        <Link
          to="/settings"
          className="rounded-full border border-zinc-200/70 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
        >
          Ajustes
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link to="/documents" className="block">
          <Card className="p-5">
            <Stat label="Documentos" value={stats.documents} />
          </Card>
        </Link>
        <Link to="/facts" className="block">
          <Card className="p-5">
            <Stat label="Hechos controvertidos" value={stats.factsControvertidos} />
          </Card>
        </Link>
        <Link to="/partidas" className="block">
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <SectionTitle
              title="Caso activo"
              action={
                <Link
                  to="/cases"
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
                >
                  Ver todos
                </Link>
              }
            />
            <div className="mt-4">
              {activeCase ? (
                <Link
                  to={`/cases/${activeCase.id}`}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200/70 bg-zinc-50 px-3 py-3 text-sm text-zinc-800"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white">
                    ⚖️
                  </span>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{activeCase.title}</div>
                    <div className="truncate text-xs text-zinc-500">
                      {activeCase.court} · {activeCase.autosNumber}
                    </div>
                  </div>
                </Link>
              ) : (
                <EmptyState
                  title="Sin caso activo"
                  description="Carga un expediente para destacarlo aquí."
                />
              )}
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle title="Alertas" subtitle="Últimas novedades operativas" />
            <div className="mt-4 space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 rounded-xl border border-zinc-200/70 bg-white px-3 py-3"
                  >
                    <span className="mt-1 text-lg">
                      {alert.type === 'warning' ? '⚠️' : 'ℹ️'}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-zinc-800">
                        {alert.title}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {alert.description}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="Sin alertas recientes"
                  description="Todo está bajo control por ahora."
                />
              )}
            </div>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <SectionTitle
            title="Hechos a probar"
            subtitle="Prioridades jurídicas en curso"
            action={
              <Link
                to="/facts"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500"
              >
                Ver todos
              </Link>
            }
          />
          <div className="mt-4 space-y-3">
            {recentFacts.length > 0 ? (
              recentFacts.map((fact) => (
                <Link
                  key={fact.id}
                  to={`/facts/${fact.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-zinc-50 px-3 py-3 text-sm text-zinc-800"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        fact.risk === 'alto'
                          ? 'bg-slate-700'
                          : fact.risk === 'medio'
                          ? 'bg-slate-500'
                          : 'bg-slate-300'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{fact.title}</div>
                      <div className="truncate text-xs text-zinc-500">
                        {fact.status} · {fact.burden}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400">›</span>
                </Link>
              ))
            ) : (
              <EmptyState
                title="Sin hechos pendientes"
                description="No hay hechos controvertidos para revisar."
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <SectionTitle title="Acciones rápidas" subtitle="Atajos operativos" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/documents/new"
              className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-sm font-semibold text-zinc-800"
            >
              Nuevo documento <span className="text-zinc-400">↗</span>
            </Link>
            <Link
              to="/facts/new"
              className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-sm font-semibold text-zinc-800"
            >
              Nuevo hecho <span className="text-zinc-400">↗</span>
            </Link>
            <Link
              to="/partidas/new"
              className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-sm font-semibold text-zinc-800"
            >
              Nueva partida <span className="text-zinc-400">↗</span>
            </Link>
            <Link
              to="/search"
              className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-zinc-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Buscar <span className="text-white/70">↗</span>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
