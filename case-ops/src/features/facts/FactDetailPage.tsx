// ============================================
// CASE OPS - VISTA DE DETALLE DE HECHOS (LEGAL PRO)
// ============================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Chips, Modal } from '../../components';
import { factsRepo, linksRepo, spansRepo, documentsRepo } from '../../db/repositories';
import { chaladitaDb } from '../../db/chaladitaDb';
import { formatDateTime } from '../../utils/dates';
import { hechosReclamados, type HechoReclamado } from '../../data/hechosReclamados';
import { argumentosContestacion, nuestrosArgumentos, frasesClaveVista, procedimientoMislata, desgloseMislata } from '../../data/mislata';
import {
  Scale, Shield, Sword, AlertTriangle, CheckCircle, FileText,
  ArrowLeft, Edit3, Trash2, Link2, Clock, Target
} from 'lucide-react';
import { LinkedText } from '../../utils/documentLinks';

// Mapeo de etiquetas
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

// Formatear céntimos a euros
const formatCents = (cents: number) =>
  (cents / 100).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

export function FactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [fact, setFact] = useState<any>(null);
  const [evidence, setEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMislataFact, setIsMislataFact] = useState(false);

  useEffect(() => {
    if (id) loadFact(id);
  }, [id]);

  async function loadFact(factId: string) {
    try {
      setLoading(true);
      setIsMislataFact(false);

      // Detectar si es un hecho de Mislata (H001-H010 o M001-M006)
      const mislataMatch = factId.match(/^(H|M)(\d{3})$/i);
      if (mislataMatch) {
        setIsMislataFact(true);
        const mislataNum = parseInt(mislataMatch[2]);

        // H = Argumentos contestación de Vicenta
        if (mislataMatch[1].toUpperCase() === 'H' && mislataNum >= 1 && mislataNum <= argumentosContestacion.length) {
          const arg = argumentosContestacion[mislataNum - 1];
          const mislataFact = {
            id: factId,
            title: arg.titulo,
            narrative: arg.argumentoVicenta,
            status: arg.estado === 'peligroso' ? 'controvertido' : arg.estado === 'rebatible' ? 'a_probar' : 'admitido',
            burden: 'demandado',
            risk: arg.estado === 'peligroso' ? 'alto' : arg.estado === 'rebatible' ? 'medio' : 'bajo',
            strength: arg.estado === 'debil' ? 4 : arg.estado === 'rebatible' ? 3 : 2,
            tags: arg.articulosInvocados,
            caseId: 'mislata-1185-2025',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            // Datos Mislata específicos
            tesis: arg.nuestraReplica,
            antitesis: arg.argumentoVicenta,
            pruebasText: arg.jurisprudenciaAFavor,
            estrategia: nuestrosArgumentos.find(a => a.id === arg.prioridad)?.texto || '',
            documentosRef: arg.articulosInvocados,
            estadoArgumento: arg.estado,
            prioridad: arg.prioridad,
            isMislata: true,
          };
          setFact(mislataFact);
          setEvidence([]);
          setLoading(false);
          return;
        }

        // M = Nuestros argumentos principales
        if (mislataMatch[1].toUpperCase() === 'M' && mislataNum >= 1 && mislataNum <= nuestrosArgumentos.length) {
          const arg = nuestrosArgumentos[mislataNum - 1];
          const mislataFact = {
            id: factId,
            title: arg.titulo,
            narrative: arg.texto,
            status: 'pacifico',
            burden: 'demandado',
            risk: 'bajo',
            strength: 5,
            tags: [arg.fundamento],
            caseId: 'mislata-1185-2025',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tesis: arg.texto,
            antitesis: '',
            pruebasText: [arg.cita],
            estrategia: '',
            documentosRef: [arg.fundamento],
            isMislata: true,
            isOurArgument: true,
          };
          setFact(mislataFact);
          setEvidence([]);
          setLoading(false);
          return;
        }
      }

      // PASO 0: Si es un ID numérico simple (1-10), buscar en hechosReclamados (Picassent)
      const numericId = parseInt(factId);
      if (!isNaN(numericId) && numericId >= 1 && numericId <= 10) {
        const hechoReclamado = hechosReclamados.find(h => h.id === numericId);
        if (hechoReclamado) {
          const factFromHechos = {
            id: String(hechoReclamado.id),
            title: hechoReclamado.titulo,
            narrative: hechoReclamado.realidadHechos,
            status: hechoReclamado.estado === 'disputa' ? 'controvertido' :
                    hechoReclamado.estado === 'prescrito' ? 'admitido' : 'a_probar',
            burden: 'actora',
            risk: hechoReclamado.cuantia > 50000 ? 'alto' : hechoReclamado.cuantia > 20000 ? 'medio' : 'bajo',
            strength: hechoReclamado.estado === 'prescrito' ? 5 : hechoReclamado.estado === 'compensable' ? 4 : 2,
            tags: [hechoReclamado.estado, `${hechoReclamado.año}`],
            caseId: 'CAS001',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tesis: hechoReclamado.realidadHechos,
            antitesis: hechoReclamado.hechoActora,
            pruebasText: hechoReclamado.oposicion || [],
            customAmount: `${hechoReclamado.cuantia.toLocaleString('es-ES')}€`,
            estrategia: hechoReclamado.estrategia,
            documentosRef: hechoReclamado.documentosRef,
            tareas: hechoReclamado.tareas,
            vinculadoA: hechoReclamado.vinculadoA,
            hechoActora: hechoReclamado.hechoActora,
            estado: hechoReclamado.estado,
            año: hechoReclamado.año,
            cuantia: hechoReclamado.cuantia,
          };
          setFact(factFromHechos);
          setEvidence([]);
          setLoading(false);
          return;
        }
      }

      // PASO 1: Buscar en repositorios
      let factData = await factsRepo.getById(factId);
      let isFromNewDb = false;

      if (!factData) {
        const newFact = await chaladitaDb.hechos.get(factId);
        if (newFact) {
          isFromNewDb = true;
          factData = {
            id: newFact.id,
            title: newFact.titulo,
            narrative: newFact.resumenCorto,
            status: 'controvertido',
            burden: 'mixta',
            risk: newFact.riesgo,
            strength: newFact.fuerza,
            tags: newFact.tags || [],
            caseId: newFact.procedimientoId,
            createdAt: new Date(newFact.createdAt).getTime(),
            updatedAt: new Date(newFact.updatedAt).getTime(),
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

      // Cargar Evidencias
      const evidenceData = [];
      if (!isFromNewDb) {
        const evidenceLinks = await linksRepo.getEvidenceForFact(factId);
        for (const link of evidenceLinks) {
          const span = await spansRepo.getById(link.fromId);
          if (span) {
            const doc = await documentsRepo.getById(span.documentId);
            if (doc) evidenceData.push({ link, span, document: doc });
          }
        }
      } else {
        if (factData.caseId) {
          const docs = await chaladitaDb.documentos
            .where('procedimientoId').equals(factData.caseId)
            .limit(10)
            .toArray();

          const relevantDocs = docs.filter(d =>
            d.hechosIds?.includes(factData.id) || d.tipo === 'demanda' || d.tipo === 'contestacion'
          );
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

  async function handleDelete() {
    if (!fact) return;
    try {
      await linksRepo.deleteByEntity('fact', fact.id);
      await factsRepo.delete(fact.id);
      if (fact.id) await chaladitaDb.hechos.delete(fact.id);
      navigate('/facts');
    } catch (error) { console.error(error); }
  }

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

  // --- RENDERIZADO LEGAL PRO ---

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-500">Cargando...</div>
      </div>
    );
  }

  if (!fact) {
    return (
      <div className="min-h-screen bg-slate-950 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-8 text-center">
            <AlertTriangle className="mx-auto text-amber-400 mb-4" size={48} />
            <h2 className="text-xl font-bold text-white mb-2">Hecho no encontrado</h2>
            <p className="text-slate-400 mb-4">ID: {id}</p>
            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const needsEvidence = fact.status === 'controvertido' || fact.status === 'a_probar';
  const hasEvidence = evidence.length > 0;

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* HEADER LEGAL PRO */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-20 shadow-xl">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="text-sm hidden sm:inline">Volver</span>
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {fact.customAmount && (
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {fact.customAmount}
                  </span>
                )}
                <h1 className="text-lg font-bold text-white truncate">{fact.title}</h1>
              </div>
              {isMislataFact && (
                <div className="text-xs text-amber-400 mt-1">
                  Caso Mislata · J.V. 1185/2025
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                to={`/facts/${fact.id}/edit`}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                <Edit3 size={18} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ALERTA SIN EVIDENCIA */}
        {needsEvidence && !hasEvidence && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
            <div>
              <div className="text-sm font-bold text-amber-300">Sin evidencia vinculada</div>
              <div className="text-xs text-amber-400/70 mt-1">
                Este hecho requiere documentos de soporte para la vista.
              </div>
            </div>
          </div>
        )}

        {/* CHIPS DE ESTADO */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
            ['controvertido', 'a_probar'].includes(fact.status)
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            {STATUS_LABELS[fact.status] || fact.status}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-slate-700/50 text-slate-300 border border-slate-600/50">
            Carga: {BURDEN_LABELS[fact.burden] || fact.burden}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
            fact.risk === 'alto' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
            fact.risk === 'medio' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
          }`}>
            Riesgo {RISK_LABELS[fact.risk] || fact.risk}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Fuerza: {fact.strength}/5
          </span>
          {fact.estadoArgumento && (
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${
              fact.estadoArgumento === 'peligroso' ? 'bg-rose-500/30 text-rose-300' :
              fact.estadoArgumento === 'rebatible' ? 'bg-amber-500/30 text-amber-300' :
              'bg-emerald-500/30 text-emerald-300'
            }`}>
              {fact.estadoArgumento}
            </span>
          )}
        </div>

        {/* RELATO DE HECHOS */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Relato de Hechos
          </h3>
          <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
            {fact.narrative ? (
              <LinkedText text={fact.narrative} caseId={fact.caseId} />
            ) : (
              "Sin descripción disponible."
            )}
          </div>
          {fact.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {fact.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-1 text-xs bg-slate-800 text-slate-400 rounded border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* TESIS VS ANTÍTESIS */}
        {(fact.tesis || fact.antitesis) && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Nuestra Tesis */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-emerald-400" size={18} />
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  {fact.isOurArgument ? 'Nuestro Argumento' : 'Nuestra Tesis'}
                </h3>
              </div>
              <div className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                {fact.tesis ? (
                  <LinkedText text={fact.tesis} caseId={fact.caseId} />
                ) : (
                  "No definida."
                )}
              </div>
            </div>

            {/* Antítesis / Argumento Contrario */}
            {fact.antitesis && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sword className="text-rose-400" size={18} />
                  <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                    {isMislataFact ? 'Argumento de Vicenta' : 'Antítesis / Riesgo'}
                  </h3>
                </div>
                <div className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                  <LinkedText text={fact.antitesis} caseId={fact.caseId} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ESTRATEGIA DE DEFENSA */}
        {fact.estrategia && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-amber-400" size={18} />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                Estrategia de Defensa
              </h3>
            </div>
            <div className="text-slate-200 leading-relaxed">
              <LinkedText text={fact.estrategia} caseId={fact.caseId} />
            </div>
          </div>
        )}

        {/* ARGUMENTOS / JURISPRUDENCIA */}
        {fact.pruebasText && fact.pruebasText.length > 0 && (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Scale className="text-blue-400" size={18} />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                {isMislataFact ? 'Jurisprudencia a Favor' : 'Argumentos de Oposición'}
              </h3>
            </div>
            <div className="space-y-2">
              {fact.pruebasText.map((p: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3">
                  <CheckCircle className="text-blue-400 shrink-0 mt-0.5" size={16} />
                  <div className="text-slate-300 text-sm leading-relaxed">
                    <LinkedText text={p} caseId={fact.caseId} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCUMENTOS DE REFERENCIA */}
        {fact.documentosRef && fact.documentosRef.length > 0 && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-cyan-400" size={18} />
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
                {isMislataFact ? 'Artículos Invocados' : 'Documentos de Prueba'}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {fact.documentosRef.map((doc: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-sm font-mono text-cyan-300"
                >
                  {doc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* TAREAS PENDIENTES */}
        {fact.tareas && fact.tareas.length > 0 && (
          <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="text-violet-400" size={18} />
              <h3 className="text-sm font-bold text-violet-400 uppercase tracking-wider">
                Tareas Pendientes
              </h3>
            </div>
            <div className="space-y-2">
              {fact.tareas.map((tarea: string, i: number) => (
                <div key={i} className="flex items-start gap-3 bg-slate-900/50 rounded-lg p-3">
                  <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-violet-400 bg-violet-500/20 rounded border border-violet-500/30 shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-slate-300 text-sm">{tarea}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VINCULACIÓN */}
        {fact.vinculadoA && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 flex items-center gap-3">
            <Link2 className="text-slate-500" size={18} />
            <div className="flex-1">
              <span className="text-slate-400 text-sm">
                Vinculado al Hecho #{fact.vinculadoA}
              </span>
            </div>
            <Link
              to={`/facts/${fact.vinculadoA}`}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Ver hecho →
            </Link>
          </div>
        )}

        {/* MISLATA: FRASES CLAVE PARA VISTA */}
        {isMislataFact && fact.prioridad && fact.prioridad <= frasesClaveVista.length && (
          <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-slate-900/60 p-5">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target size={18} />
              Frase Clave para Vista
            </h3>
            <blockquote className="text-lg text-white italic leading-relaxed border-l-4 border-amber-500 pl-4">
              "{frasesClaveVista[fact.prioridad - 1]?.frase}"
            </blockquote>
            <p className="text-xs text-slate-500 mt-3 uppercase">
              Contexto: {frasesClaveVista[fact.prioridad - 1]?.contexto}
            </p>
          </div>
        )}

        {/* DOCUMENTOS VINCULADOS */}
        <div className="rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              Documentos ({evidence.length})
            </h3>
          </div>

          {evidence.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <FileText className="mx-auto mb-2 opacity-50" size={32} />
              <p className="text-sm">No hay documentos vinculados.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {evidence.map(({ link, span, document }) => (
                <div key={link.id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                  <FileText className="text-blue-400 shrink-0" size={20} />
                  <Link to={`/documents/${document.id}/view`} className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{span.label}</div>
                    <div className="text-xs text-slate-500 truncate">{document.title}</div>
                  </Link>
                  {!link.id.toString().startsWith('lnk-virt-') && (
                    <button
                      onClick={() => handleRemoveEvidence(link.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* METADATOS Y ACCIONES */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 flex items-center gap-3">
            <Clock className="text-slate-500" size={18} />
            <div className="text-xs text-slate-500">
              Actualizado: {formatDateTime(fact.updatedAt)}
            </div>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full py-3 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg font-medium transition-colors border border-rose-500/30 flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Eliminar hecho
          </button>
        </div>
      </main>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar hecho"
        footer={
          <>
            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </button>
            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors" onClick={handleDelete}>
              Eliminar
            </button>
          </>
        }
      >
        <p className="text-slate-300">¿Seguro que quieres eliminar <strong className="text-white">{fact.title}</strong>?</p>
      </Modal>
    </div>
  );
}
