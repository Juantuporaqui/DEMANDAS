// ============================================
// CHALADITA CASE-OPS - Audiencia Quick Nav
// Botones estilo app móvil para secciones audiencia
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { eventsRepo } from '../db/repositories';
import type { Event } from '../types';

interface AudienciaQuickNavProps {
  procedimientoId: string;
}

type SeccionAudienciaView = {
  id: string;
  titulo: string;
  bullets: string[];
  updatedAt: number;
  orden: number;
};

const seccionColors = [
  { bg: '#7f1d1d', border: '#ef4444', text: '#fca5a5', icon: '⚖️' },
  { bg: '#78350f', border: '#f59e0b', text: '#fcd34d', icon: '📄' },
  { bg: '#065f46', border: '#10b981', text: '#6ee7b7', icon: '👤' },
  { bg: '#1e3a5f', border: '#3b82f6', text: '#93c5fd', icon: '📊' },
  { bg: '#581c87', border: '#a855f7', text: '#d8b4fe', icon: '❓' },
  { bg: '#164e63', border: '#06b6d4', text: '#67e8f9', icon: '📋' },
  { bg: '#713f12', border: '#eab308', text: '#fef08a', icon: '⚡' },
  { bg: '#1c1917', border: '#78716c', text: '#d6d3d1', icon: '📌' },
];

function toSections(events: Event[]): SeccionAudienciaView[] {
  return events
    .filter((event) => event.title.toLowerCase().includes('audiencia') || event.tags.some((tag) => tag.toLowerCase().includes('audiencia')))
    .map((event, index) => ({
      id: event.id,
      titulo: event.title,
      bullets: event.description
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      updatedAt: event.updatedAt,
      orden: index + 1,
    }));
}

export function AudienciaQuickNav({ procedimientoId }: AudienciaQuickNavProps) {
  const [selectedSeccion, setSelectedSeccion] = useState<SeccionAudienciaView | null>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  const secciones = useLiveQuery(async () => {
    const events = await eventsRepo.getByCaseId(procedimientoId);
    // TODO: CaseOpsDB no tiene tabla de secciones de audiencia; usamos eventos de audiencia como fallback.
    return toSections(events).sort((a, b) => a.orden - b.orden);
  }, [procedimientoId]);

  useEffect(() => {
    if (selectedSeccion && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedSeccion]);

  if (!secciones || secciones.length === 0) {
    return <div style={styles.empty}>No hay secciones de audiencia para este procedimiento.</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Audiencia Previa</h3>
        <span style={styles.badge}>{secciones.length} secciones</span>
      </div>

      <div style={styles.buttonGrid}>
        {secciones.map((seccion, index) => {
          const colorConfig = seccionColors[index % seccionColors.length];
          const isSelected = selectedSeccion?.id === seccion.id;
          return (
            <button
              key={seccion.id}
              onClick={() => setSelectedSeccion(isSelected ? null : seccion)}
              style={{
                ...styles.navButton,
                backgroundColor: isSelected ? colorConfig.border : colorConfig.bg,
                borderColor: colorConfig.border,
                color: isSelected ? '#000' : colorConfig.text,
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <div style={styles.buttonTop}>
                <span style={styles.buttonIcon}>{colorConfig.icon}</span>
                <span style={styles.buttonNum}>{index + 1}</span>
              </div>
              <span style={styles.buttonTitle}>{seccion.titulo.length > 20 ? `${seccion.titulo.slice(0, 20)}...` : seccion.titulo}</span>
              <span style={styles.buttonCount}>{seccion.bullets.length} puntos</span>
            </button>
          );
        })}
      </div>

      {selectedSeccion && (
        <div ref={detailRef} style={styles.detailPanel}>
          <div style={styles.detailHeader}>
            <div style={styles.detailTitleRow}>
              <span style={styles.detailNum}>{secciones.findIndex((s) => s.id === selectedSeccion.id) + 1}</span>
              <h4 style={styles.detailTitle}>{selectedSeccion.titulo}</h4>
            </div>
            <button onClick={() => setSelectedSeccion(null)} style={styles.closeBtn}>✕</button>
          </div>

          <ul style={styles.bulletList}>
            {selectedSeccion.bullets.map((bullet, i) => (
              <li key={i} style={styles.bulletItem}>
                <span style={styles.bulletDot}>•</span>
                <span style={styles.bulletText}>{bullet}</span>
              </li>
            ))}
          </ul>

          <div style={styles.detailFooter}>
            <span style={styles.updatedAt}>Actualizado: {new Date(selectedSeccion.updatedAt).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { padding: '1rem', backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid #334155' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  title: { fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 },
  badge: { fontSize: '0.625rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '9999px', backgroundColor: '#1e293b', color: '#94a3b8', textTransform: 'uppercase' },
  buttonGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' },
  navButton: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0.75rem', borderRadius: '0.75rem', border: '2px solid', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'left', minHeight: '85px' },
  buttonTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '0.375rem' },
  buttonIcon: { fontSize: '1.125rem' },
  buttonNum: { fontSize: '0.625rem', fontWeight: 700, width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.3)' },
  buttonTitle: { fontSize: '0.6875rem', fontWeight: 600, lineHeight: 1.3, marginBottom: 'auto' },
  buttonCount: { fontSize: '0.5rem', marginTop: '0.375rem', opacity: 0.7, textTransform: 'uppercase' },
  detailPanel: { marginTop: '1rem', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '0.75rem', border: '1px solid #475569' },
  detailHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' },
  detailTitleRow: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  detailNum: { width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700, backgroundColor: '#f59e0b', color: '#000', borderRadius: '50%' },
  detailTitle: { fontSize: '1rem', fontWeight: 700, color: '#f1f5f9', margin: 0 },
  closeBtn: { padding: '0.25rem 0.5rem', fontSize: '0.875rem', backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer' },
  bulletList: { margin: 0, padding: 0, listStyle: 'none' },
  bulletItem: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid #334155' },
  bulletDot: { color: '#f59e0b', fontSize: '1rem', lineHeight: 1.4 },
  bulletText: { fontSize: '0.8125rem', color: '#e2e8f0', lineHeight: 1.5 },
  detailFooter: { marginTop: '0.75rem', textAlign: 'right' },
  updatedAt: { fontSize: '0.625rem', color: '#64748b' },
  empty: { padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem', backgroundColor: '#1e293b', borderRadius: '0.5rem', border: '1px solid #334155' },
};

export default AudienciaQuickNav;
