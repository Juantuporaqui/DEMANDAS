import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/components/Card';
import SectionTitle from '../../ui/components/SectionTitle';
import Stat from '../../ui/components/Stat';
import { claimFilesRepo, docFilesRepo } from '../../db/repositories';
import { formatBytes, formatCurrency } from '../../utils/validators';
import { sha256 } from '../../utils/hash';

type ClaimTab = 'resumen' | 'ampliar' | 'prueba';

type ClaimFile = {
  id: string;
  fileId: string;
  filename: string;
  size: number;
  mime: string;
  createdAt: number;
};

// Datos DEMO para visualización inmediata
const CASES = [
  {
    id: 'pic-715-24',
    title: 'Picassent · División Cosa Común',
    autos: 'Autos 715/2024',
    court: 'JPI nº1 Picassent',
    status: 'Audiencia previa en preparación',
    tags: ['División cosa común', 'Unidad de caja', 'Prescripción 1964.2 CC'],
  },
];

const CLAIMS = [
  {
    id: 'r01',
    shortLabel: 'R01',
    title: 'Mezcla de Fondos',
    amountCents: 21_600_000,
    probability: 'media',
    color: 'border-amber-400/50 bg-amber-500/10 text-amber-200',
    thesis: 'Unidad de caja funcional 2006-2024 con trazabilidad.',
    antithesis: 'Se opondrán aportaciones privativas sin rastro.',
    detail: 'Gestión como unidad de caja durante todo el ciclo.',
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
    antithesis: 'Reconducción como error formal subsanable.',
    detail: 'Transferencia no puede corresponder al año 2024.',
    evidence: ['Orden de transferencia', 'Cruce movimientos'],
  },
];

const TASKS = [
  { title: 'Formalizar alegación prescripción', priority: 'alta', due: '24/06' },
  { title: 'Solicitar extractos BBVA', priority: 'alta', due: '20/06' },
];

export function DashboardPage() {
  const [selectedClaimId, setSelectedClaimId] = useState(CLAIMS[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<ClaimTab>('resumen');
  const [claimFiles, setClaimFiles] = useState<Record<string, ClaimFile[]>>({});
  const [uploading, setUploading] = useState(false);

  const selectedClaim = CLAIMS.find((claim) => claim.id === selectedClaimId) ?? CLAIMS[0];

  useEffect(() => {
    // Carga inicial simulada
    const loadFiles = async () => {
       // Lógica futura de carga
    };
    void loadFiles();
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    // Lógica futura de subida
  };

  const handleRemoveFile = async (claimId: string, fileId: string) => {
    // Lógica futura de borrado
  };

  return (
    <div className="space-y-6 pb-20">
      {/* --- MENU MÓVIL (SOLO VISIBLE EN MÓVIL) --- */}
      <section className="lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Acceso Rápido</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/cases" className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center active:bg-slate-800">
            <span className="text-2xl mb-2">⚖️</span>
            <span className="text-sm font-semibold text-slate-200">Procedimientos</span>
          </Link>
          <Link to="/documents" className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center active:bg-slate-800">
            <span className="text-2xl mb-2">📂</span>
            <span className="text-sm font-semibold text-slate-200">Documentos</span>
          </Link>
          <Link to="/warroom" className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center active:bg-slate-800">
            <span className="text-2xl mb-2">🛡️</span>
            <span className="text-sm font-semibold text-slate-200">War Room</span>
          </Link>
           <Link to="/tasks" className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-center active:bg-slate-800">
            <span className="text-2xl mb-2">✅</span>
            <span className="text-sm font-semibold text-slate-200">Tareas</span>
          </Link>
        </div>
      </section>

      {/* CABECERA DASHBOARD */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500 mb-1">
          Panel de Control
        </p>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
          Picassent · División CC
        </h1>
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
          <div className="text-xs uppercase text-amber-200/70">Estrategia Activa</div>
          <div className="text-sm font-semibold text-amber-100">
            Prescripción Art. 1964.2 CC + Inaplicabilidad STS 458/2025
          </div>
        </div>
      </header>

      {/* KPIS PRINCIPALES */}
      <section className="grid grid-cols-2 gap-3">
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Total</div>
          <div className="text-xl font-bold text-slate-100">24.3K €</div>
        </Card>
        <Card className="p-4 bg-slate-900/60 border-slate-800">
          <div className="text-xs text-slate-500 uppercase tracking-wider">Frentes</div>
          <div className="text-xl font-bold text-slate-100">{CLAIMS.length}</div>
        </Card>
      </section>

      {/* SECCIÓN RECLAMACIONES (MÓVIL FRIENDLY) */}
      <section>
        <SectionTitle title="Frentes Abiertos" subtitle="Análisis de riesgo y tesis" />
        <div className="mt-4 space-y-3">
          {CLAIMS.map((claim) => (
            <div key={claim.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
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
                     <span key={e} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded">
                       {e}
                     </span>
                   ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LISTA DE TAREAS URGENTES */}
      <section>
        <SectionTitle title="Prioridades" subtitle="Para sala de vistas" />
        <div className="mt-3 space-y-2">
          {TASKS.map((task) => (
             <div key={task.title} className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40 border border-slate-800/50">
               <div className={`w-2 h-2 rounded-full ${task.priority === 'alta' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
               <div className="flex-1">
                 <div className="text-sm text-slate-200 font-medium">{task.title}</div>
                 <div className="text-xs text-slate-500">Vence: {task.due}</div>
               </div>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}
