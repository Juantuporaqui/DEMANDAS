// ============================================
// CHALADITA CASE-OPS - VISTA DE DETALLE ESTRATÉGICA (FINAL)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Chips, Modal } from '../../components';
import { factsRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import { chaladitaDb } from '../../db/chaladitaDb'; 
import { formatDateTime } from '../../utils/dates';

// Mapeo de etiquetas para que se vean bonitas
const STATUS_LABELS: Record<string, string> = {
  pacifico: 'Pacífico',
  controvertido: 'Controvertido',
  admitido: 'Admitido',
  a_probar: 'A probar',
};

const RISK_LABELS: Record<string, string> = {
  alto: 'Alto',
  medio: 'Medio',
  bajo: 'Bajo',
};

const BURDEN_LABELS: Record<string, string> = {
  actora: 'Actora',
  demandado: 'Demandado',
  mixta: 'Mixta',
};

export function FactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estado local
  const [fact, setFact] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (id) loadFact(id);
  }, [id]);

  async function loadFact(factId: string) {
    try {
      setLoading(true);
      
      // PASO 1: Buscar en el sistema antiguo
      let factData = await factsRepo.getById(factId);
      let isFromNewDb = false;

      // PASO 2: Si no está, buscar en el sistema nuevo (chaladitaDb)
      if (!factData) {
        const newFact = await chaladitaDb.hechos.get(factId);
        if (newFact) {
          isFromNewDb = true;
          // Transformamos los datos nuevos para usarlos en la vista
          factData = {
            id: newFact.id,
            title: newFact.titulo,
            narrative: newFact.resumenCorto,
            status: 'controvertido', // Default
            burden: 'mixta',         // Default
            risk: newFact.riesgo,
            strength: newFact.fuerza,
            tags: newFact.tags || [],
            caseId: newFact.procedimientoId,
            createdAt: new Date(newFact.createdAt).getTime(),
            updatedAt: new Date(newFact.updatedAt).getTime(),
            
            // --- DATOS DEL DESGLOSE ESTRATÉGICO ---
            tesis: newFact.tesis,
            antitesis: newFact.antitesisEsperada,
            pruebasText: newFact.pruebasEsperadas || [],
            customAmount: newFact.titulo.includes('€') ? newFact.titulo.match(/\d+(?:[.,]\d+)?€/)?.[0] : null
          };
        }
      }

      if (!factData) {
        setFact(null); 
        return;
      }

      setFact(factData);

      // PASO 3: Cargar Evidencias / Documentos
      const evidenceData = [];
      if (!isFromNewDb) {
        // Lógica antigua (enlaces manuales)
        const evidenceLinks = await linksRepo.getEvidenceForFact(factId);
        for (const link of evidenceLinks) {
          const span = await spansRepo.getById(link.fromId);
          if (span) {
            const doc = await documentsRepo.getById(span.documentId);
            if (doc) evidenceData.push({ link, span, document: doc });
          }
        }
      } else {
        // Lógica nueva (documentos por procedimiento)
        if (factData.caseId) {
             const docs = await chaladitaDb.documentos
                .where('procedimientoId').equals(factData.caseId)
                .limit(10)
                .toArray();
            
            // Filtramos para mostrar lo relevante
            const relevantDocs = docs.filter(d => 
                d.hechosIds?.includes(factData.id) || d.tipo === 'demanda' || d.tipo === 'contestacion'
            );
            // Si no hay específicos, mostramos algunos generales para no dejarlo vacío
            const docsToShow = relevantDocs.length > 0 ? relevantDocs : docs.slice(0, 3);

            for (const doc of docsToShow) {
                evidenceData.push({
                    link: { id: `lnk-virt-${doc.id}` },
                    span: { label: 'Documento relacionado', pageStart: 1, pageEnd: 1 },
                    document: { id: doc.id, title: doc.descripcion || doc.tipo }
                });
            }
        }
      }
      setEvidence(evidenceData);

    } catch (error) {
      console.error('Error cargando hecho:', error);
    } finally {
      setLoading(false);
    }
  }

  // Borrar hecho
  async function handleDelete() {
    if (!fact) return;
    try {
      await linksRepo.deleteByEntity('fact', fact.id);
      await factsRepo.delete(fact.id);
      if (fact.id) await chaladitaDb.hechos.delete(fact.id); // Borrar también de nueva DB
      navigate('/facts');
    } catch (error) { console.error(error); }
  }

  // Quitar evidencia de la lista
  async function handleRemoveEvidence(linkId: string) {
    try {
        if (linkId.startsWith('lnk-virt-')) {
             setEvidence(evidence.filter((e) => e.link.id !== linkId));
             return;
        }
      await linksRepo.delete(linkId);
      setEvidence(evidence.filter((e) => e.link.id !== linkId));
    } catch (error) { console.error(error); }
  }

  // --- RENDERIZADO VISUAL ---

  if (loading) return <div className="page"><div className="flex justify-center p-md"><div className="spinner" /></div></div>;
  if (!fact) return <div className="page"><div className="p-md text-muted">Hecho no encontrado ({id})</div></div>;

  const needsEvidence = fact.status === 'controvertido' || fact.status === 'a_probar';
  const hasEvidence = evidence.length > 0;

  return (
    <div className="page">
      {/* 1. CABECERA */}
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>←</button>
        <h1 className="page-title" style={{ flex: 1, fontSize: '1.25rem' }}>
          {fact.customAmount && <span style={{ color: '#10b981', marginRight: '8px', fontFamily: 'monospace' }}>{fact.customAmount}</span>}
          {fact.title}
        </h1>
        <Link to={`/facts/${fact.id}/edit`} className="btn btn-ghost btn-icon">✏️</Link>
      </div>

      {needsEvidence && !hasEvidence && (
        <div className="alert alert-warning mb-md">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">
            <div className="alert-title">Sin evidencia</div>
            <div className="alert-description">Este hecho no tiene documentos vinculados.</div>
          </div>
        </div>
      )}

      {/* 2. DATOS PRINCIPALES Y RESUMEN */}
      <div className="card mb-md">
        <div className="card-body">
          <div className="flex flex-wrap gap-sm mb-md">
            <span className={`chip ${['controvertido','a_probar'].includes(fact.status)?'chip-danger':'chip-success'}`}>
              {STATUS_LABELS[fact.status] || fact.status}
            </span>
            <span className="chip">{BURDEN_LABELS[fact.burden] || fact.burden}</span>
            <span className={`chip ${fact.risk==='alto'?'chip-danger':fact.risk==='medio'?'chip-warning':'chip-success'}`}>
              Riesgo {RISK_LABELS[fact.risk] || fact.risk}
            </span>
            <span className="chip">Fuerza: {fact.strength}/5</span>
          </div>

          <div className="mt-md">
            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: 600 }}>RELATO DE HECHOS:</p>
            <p style={{ whiteSpace: 'pre-wrap', marginTop: '4px', fontSize: '1rem', lineHeight: '1.6' }}>
              {fact.narrative || "Sin descripción disponible."}
            </p>
          </div>
          
          {fact.tags?.length > 0 && <div className="mt-md"><Chips items={fact.tags} /></div>}
        </div>
      </div>

      {/* 3. DESGLOSE ESTRATÉGICO (TESIS vs ANTÍTESIS) */}
      {(fact.tesis || fact.antitesis) && (
        <div className="mb-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Tarjeta Verde: Tesis */}
            <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                <div className="card-body">
                    <h3 style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        🛡️ Nuestra Tesis
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {fact.tesis || "No definida."}
                    </p>
                </div>
            </div>
            {/* Tarjeta Roja: Antítesis */}
            <div className="card" style={{ borderLeft: '4px solid #ef4444' }}>
                <div className="card-body">
                    <h3 style={{ fontSize: '0.9rem', color: '#ef4444', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                        ⚔️ Antítesis / Riesgo
                    </h3>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                        {fact.antitesis || "No definida."}
                    </p>
                </div>
            </div>
        </div>
      )}

      {/* 4. ESTRATEGIA Y DOCUMENTAL */}
      {fact.pruebasText && fact.pruebasText.length > 0 && (
          <div className="card mb-md">
              <div className="card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px' }}>📋 Estrategia Probatoria</h3>
                  <ul style={{ paddingLeft: '20px', margin: 0 }}>
                      {fact.pruebasText.map((p: string, i: number) => (
                          <li key={i} style={{ marginBottom: '6px' }}>{p}</li>
                      ))}
                  </ul>
              </div>
          </div>
      )}

      {/* 5. LISTADO DE DOCUMENTOS */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Documentos ({evidence.length})</h2>
        </div>
        {evidence.length === 0 ? (
          <div className="card">
            <div className="card-body text-center text-muted">
              <p>No hay documentos vinculados.</p>
            </div>
          </div>
        ) : (
          <div className="card">
            {evidence.map(({ link, span, document }) => (
              <div key={link.id} className="list-item">
                <span style={{ fontSize: '1.5rem' }}>📄</span>
                <Link to={`/documents/${document.id}/view`} className="list-item-content" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="list-item-title">{span.label}</div>
                  <div className="list-item-subtitle">{document.title}</div>
                </Link>
                {!link.id.toString().startsWith('lnk-virt-') && (
                     <button className="btn btn-ghost btn-icon-sm" onClick={() => handleRemoveEvidence(link.id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FOOTER: METADATOS Y BORRADO */}
      <section className="section">
        <div className="card mb-md">
            <div className="card-body text-muted" style={{ fontSize: '0.75rem' }}>
                <p><strong>Actualizado:</strong> {formatDateTime(fact.updatedAt)}</p>
            </div>
        </div>
        <button className="btn btn-danger btn-block" onClick={() => setShowDeleteModal(true)}>
          Eliminar hecho
        </button>
      </section>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar hecho"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
          </>
        }
      >
        <p>¿Seguro que quieres eliminar <strong>{fact.title}</strong>?</p>
      </Modal>
    </div>
  );
}
