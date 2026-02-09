import { timelineMislata } from '../../data/mislata/timeline';
import CaseTimelineBase, { type CaseTimelineItem } from './CaseTimelineBase';

export function MislataTimeline() {
  const items: CaseTimelineItem[] = timelineMislata.map((evento, index) => ({
    id: evento.id,
    fecha: evento.fecha,
    order: index,
    tipo: evento.tipo,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    actores: evento.actores,
    importeCents: evento.importeCents,
    disputed: evento.disputed,
    fuente: evento.fuente,
    tags: evento.tags,
  }));

  return (
    <CaseTimelineBase
      title="Línea Temporal - Mislata"
      subtitle="J.V. 1185/2025 · Reclamación cuotas hipotecarias"
      items={items}
    />
  );
}

export default MislataTimeline;
