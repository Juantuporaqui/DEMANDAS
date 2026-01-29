// ============================================
// CHALADITA CASE-OPS - Detalle de Reclamación (Hecho)
// Vista estratégica de un punto de litigio
// ============================================

import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  ArrowLeft, 
  Scale, 
  ShieldAlert, 
  Sword, 
  FileText, 
  Target, 
  Briefcase 
} from 'lucide-react';
import { chaladitaDb } from '../../db/chaladitaDb';

// Componente para secciones de texto con estilo
interface DetailSectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}

const DetailSection = ({ title, icon: Icon, children, className = '' }: DetailSectionProps) => {
  return (
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
};

export function FactDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Convertimos a string o usamos vacío para evitar errores
  const hechoId = id || '';

  // Consultamos el Hecho (Reclamación)
  const hecho = useLiveQuery(
    () => chaladitaDb.hechos.get(hechoId),
    [hechoId]
  );

  // Consultamos documentos vinculados
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
        <p>Cargando información estratégica o hecho no encontrado...</p>
        <p className="text-xs text-slate-600 mt-2">ID buscado: {hechoId}</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-400 hover:underline">
          Volver atrás
        </button>
      </div>
    );
  }

  // Colores dinámicos según el riesgo
  const isAltoRiesgo = hecho.riesgo === 'alto';
  const statusColor = isAltoRiesgo ? 'text-rose-400' : 'text-emerald-400';

  // Intentamos extraer cuantía del título si existe, o ponemos placeholder
  const cuantiaDisplay = hecho.titulo.includes('€') 
    ? hecho.titulo.match(/\d+(?:[.,]\d+)?€/)?.[0] 
    : 'Consultar Partida';

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6 pb-24">
      
      {/* 1. Header de Navegación */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-slate-800 transition text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest mb-1">
            <span>Hecho: {hecho.id}</span>
            <span>•</span>
            <span>Riesgo {hecho.riesgo}</span>
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">{hecho.titulo}</h1>
        </div>
        <div className="text-right hidden sm:block">
           <div className={`text-xl font-mono font-bold ${statusColor}`}>
             {cuantiaDisplay}
           </div>
           <span className="text-xs text-slate-500 uppercase font-medium">Impacto</span>
        </div>
      </div>

      {/* 2. Resumen Ejecutivo */}
      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <p className="text-lg text-slate-200 font-medium leading-relaxed">
          "{hecho.resumenCorto}"
        </p>
      </div>

      {/* 3. El Tablero: Tesis vs Antítesis */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Nuestra Postura */}
        <DetailSection 
          title="Nuestra Tesis (Defensa)" 
          icon={ShieldAlert}
          className="bg-emerald-500/5 border-emerald-500/20"
        >
          {hecho.tesis || "No se ha definido la tesis de defensa para este hecho todavía."}
        </DetailSection>

        {/* Su Postura */}
        <DetailSection 
          title="Antítesis (Contrario)" 
          icon={Sword}
          className="bg-rose-500/5 border-rose-500/20"
        >
          {hecho.antitesisEsperada || "Pendiente de análisis de la demanda contraria."}
        </DetailSection>
      </div>

      {/* 4. Estrategia y War Room */}
      <div className="grid gap-4">
        <DetailSection 
          title="Estrategia (War Room)" 
          icon={Target}
          className="bg-blue-500/5 border-blue-500/20 relative overflow-hidden"
        >
          <div className="relative z-10">
            {hecho.tags && hecho.tags.length > 0 
              ? `Enfoque basado en: ${hecho.tags.join(', ')}. Se requiere análisis de jurisprudencia reciente.`
              : "Analizar prescripción y falta de legitimación activa."}
          </div>
          <Target className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/5 z-0" />
        </DetailSection>
      </div>

      {/* 5. Arsenal Probatorio (Documental) */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400 pl-1">
          <Briefcase className="w-4 h-4" /> 
          Arsenal Probatorio ({hecho.pruebasEsperadas?.length || 0})
        </h3>
        
        {/* Lista de pruebas requeridas */}
        <div className="grid sm:grid-cols-2 gap-3">
          {hecho.pruebasEsperadas && hecho.pruebasEsperadas.length > 0 ? (
            hecho.pruebasEsperadas.map((prueba: string, index: number) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition"
              >
                <div className="mt-1 min-w-[20px]">
                   <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500/20" />
                </div>
                <div className="text-sm text-slate-300">
                  {prueba}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 p-6 rounded-xl border border-dashed border-slate-700 text-center text-slate-500 text-sm">
              No hay pruebas específicas asignadas a este hecho.
            </div>
          )}
        </div>

        {/* Documentos vinculados encontrados en el expediente */}
        {documentos && documentos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800">
             <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Documentos disponibles en expediente ({documentos.length})</h4>
             <div className="space-y-2">
               {documentos.map(doc => (
                 <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition cursor-pointer group border border-transparent hover:border-slate-700">
                   <FileText className="w-4 h-4 text-cyan-500" />
                   <div className="flex-1 min-w-0">
                     <div className="text-sm text-slate-300 group-hover:text-cyan-400 transition truncate">{doc.descripcion || doc.tipo}</div>
                     <div className="text-xs text-slate-600 flex gap-2">
                        <span>{doc.fecha}</span>
                        <span>•</span>
                        <span className="uppercase">{doc.tipo}</span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Footer de acción flotante */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 shadow-2xl shadow-black/50 z-50 flex items-center gap-4">
         <button className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition flex items-center gap-2">
            <Scale className="w-4 h-4" /> Valorar
         </button>
         <div className="w-px h-4 bg-slate-700"></div>
         <button className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2">
            <FileText className="w-4 h-4" /> Nota
         </button>
      </div>

    </div>
  );
}

export default FactDetailPage;
