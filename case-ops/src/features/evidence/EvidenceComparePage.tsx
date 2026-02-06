import { ImageCompareSlider } from './ImageCompareSlider';

export function EvidenceComparePage() {
  return (
    <div className="page flex flex-col gap-4 sm:gap-6 p-3 sm:p-6">
      <ImageCompareSlider
        beforeSrc="/evidence/prueba-actora-incompleta.svg"
        afterSrc="/evidence/prueba-real-certificada.svg"
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
