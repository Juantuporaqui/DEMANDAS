import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/schema';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import { formatCurrency } from '../../utils/validators';

// Datos DEMO para visualización (hasta que se cree tabla específica en schema)
const CLAIMS = [
  {
    id: 'r01',
    shortLabel: 'R01',
    title: 'Mezcla de Fondos',
    amountCents: 21_600_000,
    probability: 'media',
    color: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
    thesis: 'Unidad de caja funcional 2006-2024 con trazabilidad.',
    evidence: ['Extractos consolidados', 'Resumen bancario'],
  },
  {
    id: 'r02',
    shortLabel: 'R02',
    title: 'Transferencia Errónea',
    amountCents: 1_300_000,
    probability: 'alta',
    color: 'border-rose-400/50 bg-rose-500/10 text-rose-200',
    thesis: 'Impugnación por error material (fecha 2024 imposible).',
    evidence: ['Orden de transferencia', 'Cruce movimientos'],
  },
];

export function DashboardPage() {
  // --- CONEXIÓN A BASE DE DATOS REAL ---
  const activeCasesCount = useLiveQuery(() => db.cases.where('status').equals('open').count(), [], 0);
  
  const urgentTasks = useLiveQuery(() => 
    db.tasks
      .where('status').equals('pending') // Asumiendo que 'pending' es un estado
      .limit(5)
      .toArray()
  , []);

  // Calcular total reclamado (mock + real podría ir aquí)
  const totalAmount = CLAIMS.reduce((acc, curr) => acc + curr.amountCents, 0);

  return (
    <div className="space-y-6 pb-20">
      
      {/* CABECERA DASHBOARD */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 mb-1">
          Panel de Control
        </p>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Resumen Ejecutivo
        </h1>
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <div className="text-xs uppercase text-amber-200/70">Estrategia Global</div>
          <div className="text-sm font-semibold text-amber-100">
            Foco en trazabilidad de fondos y prescripción de deudas antiguas.
          </div>
        </div>
      </header>

      {/* KPIS PRINCIPALES (Conectados a DB y Mock mixto) */}
      <section className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Cuantía en Litigio</div>
          <div className="text-xl font-bold text-slate-100">{formatCurrency(totalAmount)}</div>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Casos Activos</div>
          <div className="text-xl font-bold text-slate-100">{activeCasesCount}</div>
        </Card>
      </section>

      {/* SECCIÓN RECLAMACIONES */}
      <section>
        <SectionTitle title="Frentes Abiertos" subtitle="Análisis de riesgo y tesis" />
        <div className="mt-4 space-y-3">
          {CLAIMS.map((claim) => (
            <div key={claim.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:bg-slate-800/80 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${claim.color}`}>
                  {claim.shortLabel}
                </span>
                <span className="text-sm font-mono text-slate-300">
                  {formatCurrency(claim.amountCents)}
                </span>
              </div>
              <h3 className="font-bold text-slate-100 mb-1">{claim.title}</h3>
              <p className="text-xs text-slate-400 mb-3">{claim.thesis}</p>
              
              <div className="border-t border-slate-800 pt-3 mt-3">
                <p className="text-[10px] uppercase text-slate-500 mb-1">Evidencia Clave</p>
                <div className="flex flex-wrap gap-2">
                   {claim.evidence.slice(0, 2).map(e => (
                     <span key={e} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                       {e}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LISTA DE TAREAS (Datos reales de DB) */}
      <section>
        <div className="flex items-center justify-between mb-2">
           <SectionTitle title="Tareas Pendientes" subtitle="Próximos vencimientos" />
           <Link to="/tasks" className="text-xs text-amber-500 hover:underline">Ver todas</Link>
        </div>
        
        <div className="mt-3 space-y-2">
          {(!urgentTasks || urgentTasks.length === 0) ? (
             <div className="p-4 text-center text-sm text-slate-500 border border-dashed border-slate-800 rounded-lg">
                No hay tareas pendientes.
             </div>
          ) : (
             urgentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
                  <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1">
                    <div className="text-sm text-slate-200 font-medium">{task.title || 'Tarea sin título'}</div>
                    {task.dueDate && <div className="text-xs text-slate-500">Vence: {new Date(task.dueDate).toLocaleDateString()}</div>}
                  </div>
                </div>
             ))
          )}
        </div>
      </section>
    </div>
  );
}
