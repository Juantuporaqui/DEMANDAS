// ============================================
// EVENTOS DEFAULT - Agenda del caso P.O. 715/2024
// Eventos del proceso legal para mostrar en la Agenda
// ============================================

import type { Event } from '../types';

/**
 * Eventos procesales y fácticos del caso Picassent
 * Usados como datos de ejemplo cuando la BD está vacía
 */
export const eventosDefault: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>[] = [
  // HITOS PROCESALES
  {
    caseId: 'CAS001',
    title: 'Audiencia Previa',
    description: 'Alegaciones complementarias y fijación de hechos controvertidos. Juzgado de Primera Instancia nº 4 de Picassent. Sala de Vistas 2.',
    date: '2026-03-10T09:45:00',
    type: 'procesal',
    tags: ['urgente', 'audiencia', 'picassent'],
  },
  {
    caseId: 'CAS001',
    title: 'Presentación Demanda por Vicenta',
    description: 'Demanda de división de cosa común con reclamación de reembolso por 212.677,08€',
    date: '2024-03-15',
    type: 'procesal',
    tags: ['demanda', 'inicio'],
  },
  {
    caseId: 'CAS001',
    title: 'Contestación a la Demanda',
    description: 'Contestación alegando prescripción (Art. 1964.2 CC), compensación de créditos y solidaridad del préstamo.',
    date: '2024-05-20',
    type: 'procesal',
    tags: ['contestacion', 'defensa'],
  },
  {
    caseId: 'CAS001',
    title: 'Proposición de Prueba',
    description: 'Solicitud de pericial contable, documental bancaria completa y testifical.',
    date: '2024-07-10',
    type: 'procesal',
    tags: ['prueba'],
  },
  // HECHOS FÁCTICOS RELEVANTES
  {
    caseId: 'CAS001',
    title: 'Separación de hecho',
    description: 'Ruptura de la convivencia entre las partes. Fecha clave para cálculo de prescripción.',
    date: '2022-08-01',
    type: 'factico',
    tags: ['separacion', 'prescripcion'],
  },
  {
    caseId: 'CAS001',
    title: 'Retirada de 38.500€ por Vicenta',
    description: 'Disposición de fondos de cuenta común (Doc. 3). Hecho omitido en la demanda.',
    date: '2022-07-04',
    type: 'factico',
    tags: ['transferencia', 'compensacion'],
  },
  {
    caseId: 'CAS001',
    title: 'Transferencia de 32.000€ por Juan',
    description: 'Ingreso en cuenta privativa tras venta de Artur Piera. Objeto de disputa.',
    date: '2022-09-15',
    type: 'factico',
    tags: ['transferencia', 'disputa'],
  },
  {
    caseId: 'CAS001',
    title: 'Préstamo Hipotecario 310.000€',
    description: 'Firma del préstamo solidario con garantía hipotecaria sobre Lope de Vega para adquisición de parcelas comunes.',
    date: '2006-08-22',
    type: 'factico',
    tags: ['hipoteca', 'prestamo'],
  },
  {
    caseId: 'CAS001',
    title: 'Matrimonio',
    description: 'Fecha de matrimonio civil entre las partes.',
    date: '2013-09-08',
    type: 'factico',
    tags: ['matrimonio'],
  },
  {
    caseId: 'CAS001',
    title: 'Fecha corte prescripción',
    description: 'Todo pago anterior a esta fecha está prescrito según Art. 1964.2 CC (5 años desde demanda).',
    date: '2019-03-15',
    type: 'factico',
    tags: ['prescripcion', 'legal'],
  },
  // PRÓXIMOS PASOS
  {
    caseId: 'CAS001',
    title: 'Vista de Juicio (estimada)',
    description: 'Fecha estimada para la vista oral del juicio.',
    date: '2026-06-15',
    type: 'procesal',
    tags: ['juicio', 'pendiente'],
  },
];

/**
 * Obtiene eventos ordenados por fecha (más recientes primero para próximos, más antiguos primero para histórico)
 */
export const getEventosProximos = () => {
  const hoy = new Date().toISOString().split('T')[0];
  return eventosDefault
    .filter(e => e.date >= hoy)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getEventosHistoricos = () => {
  const hoy = new Date().toISOString().split('T')[0];
  return eventosDefault
    .filter(e => e.date < hoy)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
