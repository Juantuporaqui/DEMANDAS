import type { RefutacionItem } from '../escenarios/types';

export const matrizRefutacion: RefutacionItem[] = [
  {
    alegacion: 'La actora puede reclamar íntegramente cuotas 2008-2018 sin límites temporales.',
    prueba:
      'El art. 1964 CC delimita la prescripción y obliga a separar 2008-2015 como bloque prescrito frente a 2016-2018.',
    documentTitle: 'prescripcion',
  },
  {
    alegacion: 'El uso exclusivo de la vivienda es irrelevante para la liquidación.',
    prueba:
      'El uso exclusivo sin compensación genera enriquecimiento injusto que debe ponderarse en la liquidación.',
    documentTitle: 'vivienda',
  },
  {
    alegacion: 'No hay prueba suficiente de pagos del demandado en el tramo reclamable.',
    prueba: 'Extractos y cuadros de aportaciones acreditan pagos 2016-2018 y deben descontarse.',
    documentTitle: 'extracto',
  },
];
