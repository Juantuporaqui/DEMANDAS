import { timelineQuart } from '../../data/quart/timeline';
import CaseTimelineBase, { type CaseTimelineItem } from './CaseTimelineBase';

export function QuartTimeline() {
  const items: CaseTimelineItem[] = timelineQuart.map((evento) => ({
    id: evento.id,
    fecha: evento.fecha,
    tipo: evento.tipo,
    titulo: evento.titulo,
    descripcion: evento.descripcion,
    actores: evento.actores,
    importeCents: evento.importeCents,
    disputed: evento.disputed,
    fuente: evento.fuente ? { doc: evento.fuente.doc, page: evento.fuente.page } : undefined,
    tags: evento.tags,
  }));

  return (
    <CaseTimelineBase
      title="Línea Temporal - Quart"
      subtitle="ETJ 1428/2025 · Oposición a ejecución"
      items={items}
    />
  );
}

export default QuartTimeline;
