import { ImageCompareSlider } from './ImageCompareSlider';

const buildSvg = (label: string, accent: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'>
    <defs>
      <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='#0f172a'/>
        <stop offset='100%' stop-color='#1f2937'/>
      </linearGradient>
    </defs>
    <rect width='1200' height='675' fill='url(#bg)' />
    <rect x='80' y='110' width='1040' height='455' rx='26' fill='${accent}' opacity='0.18' />
    <rect x='120' y='160' width='960' height='70' rx='18' fill='${accent}' opacity='0.35' />
    <rect x='120' y='260' width='760' height='38' rx='12' fill='#e2e8f0' opacity='0.3' />
    <rect x='120' y='330' width='640' height='38' rx='12' fill='#e2e8f0' opacity='0.22' />
    <rect x='120' y='400' width='520' height='38' rx='12' fill='#e2e8f0' opacity='0.16' />
    <text x='120' y='120' fill='#e2e8f0' font-size='28' font-family='Inter, sans-serif'>${label}</text>
  </svg>
  `)}`;

export function EvidenceComparePage() {
  return (
    <div className="page flex flex-col gap-6 p-6">
      <ImageCompareSlider
        beforeSrc={buildSvg('Prueba actora (incompleta)', '#f59e0b')}
        afterSrc={buildSvg('Prueba real (certificada)', '#38bdf8')}
        offsetX={0}
        offsetY={0}
        scale={1}
        hotspotX={62}
        hotspotY={46}
        redactions={[
          { x: 68, y: 28, width: 18, height: 8 },
          { x: 72, y: 36, width: 16, height: 6 },
        ]}
      />
    </div>
  );
}
