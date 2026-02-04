import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clipboard } from 'lucide-react';
import { eventsRepo } from '../../../db/repositories';
import type { Event } from '../../../types';
import { formatDateTime } from '../../../utils/dates';
import { SectionCard } from '../../analytics/components/SectionCard';
import { CopyButton } from '../../analytics/prescripcion/CopyButton';

type TabAudienciaPreviaPicassentProps = {
  caseId: string;
};

export function TabAudienciaPreviaPicassent({ caseId }: TabAudienciaPreviaPicassentProps) {
  const [audienciaEvent, setAudienciaEvent] = useState<Event | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const allEvents = await eventsRepo.getAll();
      const matches = allEvents
        .filter((event) => event.caseId === caseId)
        .filter((event) => event.title?.toLowerCase().includes('audiencia previa'))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const upcoming = matches.find((event) => new Date(event.date).getTime() >= Date.now()) ?? null;

      if (isMounted) {
        setAudienciaEvent(upcoming);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [caseId]);

  const audienciaDateLabel = useMemo(() => {
    if (!audienciaEvent) {
      return '(sin señalamiento cargado)';
    }
    return formatDateTime(new Date(audienciaEvent.date).getTime());
  }, [audienciaEvent]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SectionCard
        title="Audiencia Previa — Centro de mando"
        subtitle={`Picassent · ${audienciaDateLabel} · Objetivo: saneamiento, hechos, prueba`}
        action={(
          <div className="flex flex-wrap gap-2">
            <Link
              to="/audiencia/telepronter?proc=picassent"
              className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-100 transition hover:border-blue-400/60 hover:bg-blue-500/20"
            >
              <Clipboard className="h-3.5 w-3.5" />
              Abrir Teleprónter
            </Link>
            <Link
              to="/audiencia/checklist?proc=picassent"
              className="inline-flex items-center gap-2 rounded-full border border-slate-500/40 bg-slate-500/10 px-3 py-1 text-xs font-semibold text-slate-100 transition hover:border-slate-400/60 hover:bg-slate-500/20"
            >
              <Calendar className="h-3.5 w-3.5" />
              Abrir Checklist
            </Link>
            <CopyButton text="(se carga en Fase 2)" label="Copiar guion 90s" />
          </div>
        )}
      >
        <div className="text-sm text-slate-300">
          Centro de mando operativo para preparar la Audiencia Previa conforme a la LEC.
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Fases de la Audiencia Previa (LEC 414–430)">
          <div className="text-sm text-slate-400">
            (pendiente de carga en Fase 2)
          </div>
        </SectionCard>

        <SectionCard title="Checklist operativa">
          <div className="text-sm text-slate-400">
            (pendiente de carga en Fase 2)
          </div>
        </SectionCard>

        <SectionCard title="Hechos controvertidos y alegaciones complementarias">
          <div className="text-sm text-slate-400">
            (pendiente de carga en Fase 2)
          </div>
        </SectionCard>

        <SectionCard title="Bloques de defensa / ataque (7)">
          <div className="text-sm text-slate-400">
            (pendiente de carga en Fase 2)
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
