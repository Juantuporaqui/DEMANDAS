import { Fragment, useMemo, useState } from 'react';
import { PICASSENT_PARTIDAS, type PicassentPartida } from '../../../content/prescripcion/picassent.partidas';
import { CopyButton } from './CopyButton';

type BloqueFiltro = 'ALL' | 'A' | 'B' | 'C';

interface TablaPartidasSectionProps {
  id?: string;
  title: string;
  subtitle?: string;
  onCopied: (text: string) => void;
}

const estadoBadgeMap: Record<string, string> = {
  PRESCRITO: 'bg-red-500/20 text-red-200 border-red-500/40',
  'NO PRESCRITO': 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  'CAMPO DE BATALLA': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
};

const bloqueLabels: Record<Exclude<BloqueFiltro, 'ALL'>, string> = {
  A: 'Bloque A — Cuotas/Pagos',
  B: 'Bloque B — Gastos/Transferencias',
  C: 'Bloque C — Inversiones/Aportaciones',
};

const formatPartida = (partida: PicassentPartida) =>
  [
    `${partida.concepto} (${partida.fecha})`,
    `Bloque: ${partida.bloque}`,
    `Importe: ${partida.importe}`,
    `Documento: ${partida.documento}`,
    `Base jurídica: ${partida.baseJuridica}`,
    `Exigibilidad: ${partida.exigibilidad}`,
    `Interrupción: ${partida.interrupcion}`,
    `Estado H1: ${partida.estadoH1}`,
    `Estado H2: ${partida.estadoH2}`,
    partida.notas ? `Notas: ${partida.notas}` : null,
    partida.fuente ? `Fuente: ${partida.fuente}` : null,
  ]
    .filter(Boolean)
    .join('\n');

export function TablaPartidasSection({ id, title, subtitle, onCopied }: TablaPartidasSectionProps) {
  const [bloqueFiltro, setBloqueFiltro] = useState<BloqueFiltro>('ALL');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredPartidas = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return PICASSENT_PARTIDAS.filter((partida) => {
      if (bloqueFiltro !== 'ALL' && partida.bloque !== bloqueFiltro) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const haystack = [
        partida.fecha,
        partida.concepto,
        partida.importe,
        partida.documento,
        partida.baseJuridica,
        partida.exigibilidad,
        partida.interrupcion,
        partida.notas,
        partida.fuente,
        partida.estadoH1,
        partida.estadoH2,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [bloqueFiltro, query]);

  const copyTableText = useMemo(
    () =>
      [
        title,
        subtitle ?? '',
        '',
        ...filteredPartidas.map((partida) => formatPartida(partida)),
      ]
        .filter(Boolean)
        .join('\n'),
    [filteredPartidas, subtitle, title]
  );

  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-700/60 bg-slate-900/40 p-5 text-sm text-slate-200 print-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        <CopyButton text={copyTableText} label="Copiar tabla" onCopied={onCopied} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(['ALL', 'A', 'B', 'C'] as const).map((bloque) => (
          <button
            key={bloque}
            type="button"
            onClick={() => setBloqueFiltro(bloque)}
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
              bloqueFiltro === bloque
                ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-600/60 bg-slate-800/50 text-slate-300'
            }`}
          >
            {bloque === 'ALL' ? 'Todos' : bloque}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
            {filteredPartidas.length} partidas
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar..."
            className="rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
          />
        </div>
      </div>

      {bloqueFiltro !== 'ALL' ? (
        <p className="mt-2 text-xs text-slate-400">{bloqueLabels[bloqueFiltro]}</p>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-xs text-slate-300">
          <thead className="text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Bloque</th>
              <th className="px-3 py-2">Fecha</th>
              <th className="px-3 py-2">Concepto</th>
              <th className="px-3 py-2">Importe</th>
              <th className="px-3 py-2">H1</th>
              <th className="px-3 py-2">H2</th>
              <th className="px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredPartidas.map((partida) => (
              <Fragment key={partida.id}>
                <tr key={partida.id} className="align-top">
                  <td className="px-3 py-3 font-semibold text-slate-100">{partida.bloque}</td>
                  <td className="px-3 py-3 text-slate-200">{partida.fecha}</td>
                  <td className="px-3 py-3">{partida.concepto}</td>
                  <td className="px-3 py-3 font-semibold text-emerald-200">{partida.importe}</td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        estadoBadgeMap[partida.estadoH1] ?? 'border-slate-600/60 bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      {partida.estadoH1}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                        estadoBadgeMap[partida.estadoH2] ?? 'border-slate-600/60 bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      {partida.estadoH2}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === partida.id ? null : partida.id)}
                        className="rounded-full border border-slate-600/60 bg-slate-800/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200"
                      >
                        {expandedId === partida.id ? 'Cerrar' : 'Ver'}
                      </button>
                      <CopyButton text={formatPartida(partida)} label="Copiar" onCopied={onCopied} />
                    </div>
                  </td>
                </tr>
                {expandedId === partida.id ? (
                  <tr className="bg-slate-900/40">
                    <td colSpan={7} className="px-4 py-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Documento</p>
                          <p className="text-sm text-slate-200">{partida.documento}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Base jurídica</p>
                          <p className="text-sm text-slate-200">{partida.baseJuridica}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Exigibilidad</p>
                          <p className="text-sm text-slate-200">{partida.exigibilidad}</p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Interrupción</p>
                          <p className="text-sm text-slate-200">{partida.interrupcion}</p>
                        </div>
                        {partida.notas ? (
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Notas</p>
                            <p className="text-sm text-slate-200">{partida.notas}</p>
                          </div>
                        ) : null}
                        {partida.fuente ? (
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Fuente</p>
                            <p className="text-sm text-slate-200">{partida.fuente}</p>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
