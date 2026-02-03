import { useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from '../../components/Modal';

export type RedactionRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ImageCompareSliderProps = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  initialPosition?: number;
  offsetX?: number;
  offsetY?: number;
  scale?: number;
  hotspotX?: number;
  hotspotY?: number;
  redactions?: RedactionRect[];
};

const clamp = (value: number, min = 0, max = 100) => Math.min(Math.max(value, min), max);

export function ImageCompareSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = 'Prueba actora (incompleta)',
  afterAlt = 'Prueba real (certificada)',
  initialPosition = 50,
  offsetX = 0,
  offsetY = 0,
  scale = 1,
  hotspotX,
  hotspotY,
  redactions = [],
}: ImageCompareSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(() => clamp(initialPosition));
  const [dragging, setDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePosition = useMemo(() => clamp(position), [position]);

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const next = ((event.clientX - rect.left) / rect.width) * 100;
      setPosition(clamp(next));
    };

    const handleUp = () => {
      setDragging(false);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const next = ((event.clientX - rect.left) / rect.width) * 100;
    setPosition(clamp(next));
  };

  return (
    <div className="card-base card-elevated flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          Comparador de evidencia
        </p>
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-slate-100">
            Prueba actora vs prueba real (certificada)
          </h2>
          <p className="text-xs text-slate-400">Arrastra el divisor para comparar</p>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/40"
        style={{ aspectRatio: '16 / 9' }}
        onClick={handleTrackClick}
        role="presentation"
      >
        <img
          src={afterSrc}
          alt={afterAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - handlePosition}% 0 0)`,
          }}
        >
          <img
            src={beforeSrc}
            alt={beforeAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
              transformOrigin: 'top left',
            }}
          />
        </div>

        {redactions.map((redaction, index) => (
          <div
            key={`redaction-${index}`}
            className="absolute bg-black/90"
            style={{
              left: `${redaction.x}%`,
              top: `${redaction.y}%`,
              width: `${redaction.width}%`,
              height: `${redaction.height}%`,
            }}
          />
        ))}

        <div className="pointer-events-none absolute left-0 right-0 top-0 flex justify-between px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-200">
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
            PRUEBA ACTORA (Incompleta)
          </span>
          <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1">
            PRUEBA REAL (Certificada)
          </span>
        </div>

        <div className="absolute top-0 h-full" style={{ left: `${handlePosition}%` }}>
          <div className="absolute -left-px top-0 h-full w-0.5 bg-slate-200/80" />
          <button
            type="button"
            className="absolute -left-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-slate-100 shadow-md transition hover:border-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            onPointerDown={handlePointerDown}
            onClick={(event) => event.stopPropagation()}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(handlePosition)}
            aria-label="Comparar evidencia"
          >
            ↔
          </button>
        </div>

        {typeof hotspotX === 'number' && typeof hotspotY === 'number' && (
          <button
            type="button"
            className="absolute flex h-4 w-4 items-center justify-center rounded-full bg-amber-300 text-[10px] text-slate-900 shadow"
            style={{ left: `${hotspotX}%`, top: `${hotspotY}%` }}
            onClick={(event) => {
              event.stopPropagation();
              setModalOpen(true);
            }}
            aria-label="Ver detalle de la prueba"
          >
            <span className="absolute h-6 w-6 animate-ping rounded-full border border-amber-200" />
            <span className="relative">!</span>
          </button>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Detalle de evidencia">
        <p className="text-sm text-slate-200">
          En la captura aportada no aparece el campo ‘Ordenante’ al no desplegar/mostrarse la
          interfaz. En el justificante oficial sí consta ‘Ordenante’, acreditando el origen del
          pago.
        </p>
      </Modal>
    </div>
  );
}
