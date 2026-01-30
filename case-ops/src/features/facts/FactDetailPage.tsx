// ============================================
// CHALADITA CASE-OPS - Detalle de Reclamación (Hecho)
// VISTA ESTRATÉGICA LIMPIA
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Scale, ShieldAlert, Sword, FileText, Target, Briefcase } from 'lucide-react';
import { chaladitaDb } from '../../db/chaladitaDb';

// Componente simple para secciones
const DetailSection = ({ title, icon: Icon, children, className = '' }: any) => (
  <div className={`p-5 rounded-2xl border border-slate-700/50 bg-slate-800/20 ${className}`}>
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="w-5 h-5 text-slate-400" />}
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">{title}</h3>
    </div>
    <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
      {children}
    </div>
  </div>
);

export function FactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hechoId = id || ''; // Usamos el ID como texto directamente

  // 1. Consultamos el Hecho
  const hecho = useLiveQuery(
    () => chaladitaDb.hechos.get(hechoId),
    [hechoId]
  );

  // 2. Consultamos documentos relacionados
  const documentos = useLiveQuery(
    async () => {
      if (!hecho?.procedimientoId) return [];
      return await chaladitaDb.documentos
        .where('procedimientoId')
        .equals(hecho.procedimientoId)
        .limit(10)
        .toArray();
    },
    [hecho?.procedimientoId]
  );

  if (!hecho) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Cargando información o hecho no encontrado...</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-400 hover:underline">Volver</button>
      </div>
    );
  }

  const isAltoRiesgo = hecho.riesgo === 'alto';
  const statusColor = isAltoRiesgo ? 'text-rose-400' : 'text-emerald-400';

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-800 transition text-slate-400">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Hecho: {hecho.id}</div>
          <h1 className="text-2xl font-bold text-white">{hecho.titulo}</h1>
        </div>
        <div className="text-right hidden sm:block">
           <div className={`text-xl font-mono font-bold ${statusColor}`}>
             {hecho.titulo.includes('€') ? hecho.titulo.match(/\d+(?:[.,]\d+)?€/)?.[0] : 'Consultar'}
           </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <p className="text-lg text-slate-200 font-medium">"{hecho.resumenCorto}"</p>
      </div>

      {/* Tesis vs Antítesis */}
      <div className="grid md:grid-cols-2 gap-4">
        <DetailSection title="Nuestra Tesis" icon={ShieldAlert} className="bg-emerald-500/5 border-emerald-500/20">
          {hecho.tesis || "Sin definir."}
        </DetailSection>
        <DetailSection title="Contrario" icon={Sword} className="bg-rose-500/5 border-rose-500/20">
          {hecho.antitesisEsperada || "Sin definir."}
        </DetailSection>
      </div>

      {/* Estrategia */}
      <DetailSection title="Estrategia" icon={Target} className="bg-blue-500/5 border-blue-500/20">
        {hecho.tags?.length ? `Enfoque: ${hecho.tags.join(', ')}` : "Analizar estrategia."}
      </DetailSection>

      {/* Documentos */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
          <Briefcase className="w-4 h-4" /> Documentos ({documentos?.length || 0})
        </h3>
        {documentos?.map(doc => (
          <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-700 bg-slate-800/40">
            <FileText className="w-4 h-4 text-cyan-500" />
            <span className="text-sm text-slate-300 truncate">{doc.descripcion || doc.tipo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FactDetailPage;
