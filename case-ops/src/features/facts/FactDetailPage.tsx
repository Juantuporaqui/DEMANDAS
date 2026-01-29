// ============================================
// CASE OPS - Fact Detail Page
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ListItem, Chips, Modal } from '../../components';
import { factsRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import type { Fact, Span, Document, Link as LinkType } from '../../types';
import { formatDateTime } from '../../utils/dates';

const STATUS_LABELS = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const BURDEN_LABELS = {
  actora: 'Actora',
  demandado: 'Demandado',
  mixta: 'Mixta',
};

const RISK_LABELS = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

export function FactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fact, setFact] = useState<Fact | null>(null);
  const [evidence, setEvidence] = useState<
    { link: LinkType; span: Span; document: Document }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadFact(id);
    }
  }, [id]);

  async function loadFact(factId: string) {
    try {
      const factData = await factsRepo.getById(factId);
      if (!factData) {
        navigate('/facts');
        return;
      }

      setFact(factData);

      // Load evidence (spans linked to this fact)
      const evidenceLinks = await linksRepo.getEvidenceForFact(factId);
      const evidenceData = [];

      for (const link of evidenceLinks) {
        const span = await spansRepo.getById(link.fromId);
        if (span) {
          const doc = await documentsRepo.getById(span.documentId);
          if (doc) {
            evidenceData.push({ link, span, document: doc });
          }
        }
      }

      setEvidence(evidenceData);
    } catch (error) {
      console.error('Error loading fact:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!fact) return;

    try {
      await linksRepo.deleteByEntity('fact', fact.id);
      await factsRepo.delete(fact.id);
      navigate('/facts');
    } catch (error) {
      console.error('Error deleting fact:', error);
      alert('Error al eliminar el hecho');
    }
  }

  async function handleRemoveEvidence(linkId: string) {
    try {
      await linksRepo.delete(linkId);
      setEvidence(evidence.filter((e) => e.link.id !== linkId));
    } catch (error) {
      console.error('Error removing evidence:', error);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="flex justify-center p-md">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!fact) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 className="page-title">Hecho no encontrado</h1>
        </div>
      </div>
    );
  }

  const needsEvidence =
    fact.status === 'controvertido' || fact.status === 'a_probar';
  const hasEvidence = evidence.length > 0;

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
          ←
        </button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {fact.id}
        </h1>
        <Link to={`/facts/${fact.id}/edit`} className="btn btn-ghost btn-icon">
          ✏️
        </Link>
      </div>

      {/* Warning if no evidence */}
      {needsEvidence && !hasEvidence && (
        <div className="alert alert-warning mb-md">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <div className="alert-title">Sin evidencia</div>
            <div className="alert-description">
              Este hecho {fact.status === 'controvertido' ? 'controvertido' : 'a probar'}{' '}
              no tiene evidencia documental vinculada
            </div>
          </div>
        </div>
      )}

      {/* Main Info */}
      <div className="card mb-md">
        <div className="card-body">
          <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{fact.title}</h2>

          <div className="flex flex-wrap gap-sm mb-md">
            <span
              className={`chip ${
                fact.status === 'controvertido' || fact.status === 'a_probar'
                  ? 'chip-danger'
                  : fact.status === 'pacifico'
                  ? 'chip-success'
                  : 'chip-primary'
              }`}
            >
              {STATUS_LABELS[fact.status]}
            </span>
            <span className="chip">{BURDEN_LABELS[fact.burden]}</span>
            <span
              className={`chip ${
                fact.risk === 'alto'
                  ? 'chip-danger'
                  : fact.risk === 'medio'
                  ? 'chip-warning'
                  : 'chip-success'
              }`}
            >
              Riesgo {RISK_LABELS[fact.risk]}
            </span>
            <span className="chip">Fuerza: {fact.strength}/5</span>
          </div>

          {fact.narrative && (
            <div className="mt-md">
              <p
                className="text-muted"
                style={{ fontSize: '0.875rem', fontWeight: 600 }}
              >
                Relato:
              </p>
              <p style={{ whiteSpace: 'pre-wrap', marginTop: 'var(--spacing-xs)' }}>
                {fact.narrative}
              </p>
            </div>
          )}

          {fact.tags.length > 0 && (
            <div className="mt-md">
              <Chips items={fact.tags} />
            </div>
          )}
        </div>
      </div>

      {/* Evidence */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Evidencias ({evidence.length})</h2>
        </div>

        {evidence.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted">
              <p>No hay evidencias vinculadas</p>
              <p className="mt-sm" style={{ fontSize: '0.875rem' }}>
                Ve a un documento, crea un span y enlázalo a este hecho
              </p>
              <Link to="/documents" className="btn btn-secondary mt-md">
                Ir a documentos
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            {evidence.map(({ link, span, document }) => (
              <div key={link.id} className="list-item">
                <span style={{ fontSize: '1.5rem' }}>📑</span>
                <Link
                  to={`/documents/${document.id}/view?page=${span.pageStart}`}
                  className="list-item-content"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="list-item-title">{span.label}</div>
                  <div className="list-item-subtitle">
                    {document.title} · Págs. {span.pageStart}-{span.pageEnd}
                  </div>
                </Link>
                <button
                  className="btn btn-ghost btn-icon-sm"
                  onClick={() => handleRemoveEvidence(link.id)}
                  title="Quitar evidencia"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Metadata */}
      <section className="section">
        <h2 className="section-title">Metadatos</h2>
        <div className="card">
          <div className="card-body">
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Caso:</strong> {fact.caseId}
            </p>
            <p className="text-muted mt-sm" style={{ fontSize: '0.75rem' }}>
              <strong>Creado:</strong> {formatDateTime(fact.createdAt)}
            </p>
            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
              <strong>Actualizado:</strong> {formatDateTime(fact.updatedAt)}
            </p>
          </div>
        </div>
      </section>

      {/* Delete */}
      <section className="section">
        <button
          className="btn btn-danger btn-block"
          onClick={() => setShowDeleteModal(true)}
        >
          Eliminar hecho
        </button>
      </section>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar hecho"
        footer={
          <>
            <button
              className="btn btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Eliminar
            </button>
          </>
        }
      >
        <p>
          ¿Estás seguro de que quieres eliminar el hecho{' '}
          <strong>{fact.title}</strong>?
        </p>// ============================================
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
import { AppShell } from '../../app/AppShell';

// Componente para secciones de texto con estilo
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
  const hechoId = Number(id);

  // Consultamos el Hecho (Reclamación)
  const hecho = useLiveQuery(
    () => chaladitaDb.hechos.get(hechoId),
    [hechoId]
  );

  // Consultamos documentos vinculados (si existiera la relación en la DB)
  // Por ahora simulado o buscando por ID de procedimiento si tienes esa relación
  const documentos = useLiveQuery(
    () => chaladitaDb.documentos.where('procedimientoId').equals(hecho?.procedimientoId || 0).limit(5).toArray(),
    [hecho?.procedimientoId]
  );

  if (!hecho) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Cargando información estratégica...</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-emerald-400 hover:underline">
          Volver atrás
        </button>
      </div>
    );
  }

  // Colores dinámicos según el estado/riesgo
  const isPrescrito = hecho.riesgo === 'alto'; // Asumiendo lógica de riesgo para color
  const statusColor = isPrescrito ? 'text-rose-400' : 'text-emerald-400';

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
            <span>Hecho #{hecho.id}</span>
            <span>•</span>
            <span>{hecho.año || '2024'}</span>
          </div>
          <h1 className="text-2xl font-bold text-white leading-tight">{hecho.titulo}</h1>
        </div>
        <div className="text-right">
           <div className={`text-2xl font-mono font-bold ${statusColor}`}>
             {hecho.cuantia ? hecho.cuantia.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }) : '0,00 €'}
           </div>
           <span className="text-xs text-slate-500 uppercase font-medium">Cuantía Reclamada</span>
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
            {hecho.estrategia || "Analizar prescripción y falta de legitimación activa."}
          </div>
          {/* Decoración de fondo */}
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

        {/* Documentos vinculados (Ejemplo de integración con DB) */}
        {documentos && documentos.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-800">
             <h4 className="text-xs font-semibold text-slate-500 uppercase mb-3">Documentos en expediente relacionados</h4>
             <div className="space-y-2">
               {documentos.map(doc => (
                 <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 transition cursor-pointer group">
                   <FileText className="w-4 h-4 text-cyan-500" />
                   <span className="text-sm text-slate-300 group-hover:text-cyan-400 transition">{doc.titulo}</span>
                   <span className="ml-auto text-xs text-slate-600">{doc.fecha}</span>
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Footer de acción flotante (opcional) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur border border-slate-700 rounded-full px-6 py-3 shadow-2xl shadow-black/50 z-50 flex items-center gap-4">
         <button className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition flex items-center gap-2">
            <Scale className="w-4 h-4" /> Valorar Riesgo
         </button>
         <div className="w-px h-4 bg-slate-700"></div>
         <button className="text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2">
            <FileText className="w-4 h-4" /> Añadir Nota
         </button>
      </div>

    </div>
  );
}

export default FactDetailPage;
        <p className="mt-sm text-muted" style={{ fontSize: '0.875rem' }}>
          Se eliminarán también los {evidence.length} enlaces de evidencia.
        </p>
      </Modal>
    </div>
  );
}
