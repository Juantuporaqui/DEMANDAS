import type { EscenarioVista } from '../escenarios/types';

export const escenarios: EscenarioVista[] = [
  {
    tipo: 'favorable',
    titulo: 'Juez receptivo a la acción de regreso (art. 1145 CC)',
    mensaje60s:
      'Señoría, la acción de regreso es autónoma: Juan ha pagado el 100% de las cuotas desde octubre 2023 y el crédito es líquido, vencido y exigible. Pedimos condena al 50% de las cuotas, con base en extractos bancarios y sin esperar al pleito de Picassent.',
    puntosAClavar: [
      'Cuotas 2023-2025 son posteriores a la demanda de Picassent.',
      'Crédito líquido y exigible conforme art. 1145 CC.',
      'Extractos bancarios acreditan pagos del 100% por Juan.',
    ],
    queConceder: ['Aceptar revisión puntual de conceptos si no afectan al núcleo del crédito.'],
    planB: ['Solicitar ejecución parcial si la sala exige aclaraciones.'],
    documentosDeMano: [
      'Extractos de la cuenta común 2023-2025.',
      'Tabla de cuotas pagadas y fechas.',
      'Escritura de préstamo hipotecario solidario.',
    ],
  },
  {
    tipo: 'neutral',
    titulo: 'Juez técnico — revisa litispendencia/prejudicialidad',
    mensaje60s:
      'Señoría, no hay litispendencia ni prejudicialidad: el objeto y los periodos son distintos. Picassent versa sobre cuotas 2009-2023 y división de cosa común; aquí se discute el regreso de cuotas 2023-2025. Pedimos que se continúe el procedimiento sin suspensión.',
    puntosAClavar: [
      'Diferencia de objeto: cuotas posteriores y crédito autónomo.',
      'El art. 43 LEC permite, no obliga, a suspender.',
      'No hay identidad total requerida por la litispendencia.',
    ],
    queConceder: ['Ofrecer cronología comparada para despejar dudas del tribunal.'],
    planB: ['Pedir señalamiento cercano para evitar dilaciones.'],
    documentosDeMano: [
      'Cronología comparada Picassent vs Mislata.',
      'Copia de la demanda de Picassent (objeto y periodos).',
      'Extractos bancarios de las cuotas reclamadas.',
    ],
  },
  {
    tipo: 'hostil',
    titulo: 'Juez inclinado a suspender por prejudicialidad',
    mensaje60s:
      'Señoría, si se aprecia prejudicialidad, solicitamos que se delimite la suspensión a los periodos estrictamente discutidos en Picassent. El crédito de 2023-2025 es autónomo y no puede quedar indefinidamente en pausa. Pedimos al menos medidas para asegurar la deuda.',
    puntosAClavar: [
      'El crédito de regreso es independiente y posterior.',
      'Suspensión, en su caso, debe ser mínima y motivada.',
      'Protección del crédito mientras se tramita Picassent.',
    ],
    queConceder: ['Aceptar suspensión limitada si se fijan hitos de revisión.'],
    planB: ['Solicitar medidas de aseguramiento del crédito.'],
    documentosDeMano: [
      'Relación de pagos posteriores a la demanda de Picassent.',
      'Resumen de deuda exigible 2023-2025.',
      'Jurisprudencia sobre autonomía de la acción de regreso.',
    ],
  },
];
