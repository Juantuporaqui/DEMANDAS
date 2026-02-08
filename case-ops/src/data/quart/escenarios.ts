import type { EscenarioVista } from '../escenarios/types';

export const escenarios: EscenarioVista[] = [
  {
    tipo: 'favorable',
    titulo: 'Juez receptivo a pluspetición',
    puntosAClavar: [
      'Pluspetición: se reclaman 2.400€ pero el déficit acreditado es 1.828,73€ (Art. 558 LEC)',
      'Juan aportó 1.971,27€ hasta sept 2025 + 600€ adicionales en oct-nov 2025',
      'Pagos directos de 1.895,65€ en gastos de los hijos (acreditados con facturas)',
    ],
    queConceder: [
      'Se puede reconocer que hubo retraso en algunos meses',
      'No negar la obligación de los 200€/mes — solo que el déficit es menor',
    ],
    planB: ['Si pide pago inmediato: solicitar plazo para pago fraccionado'],
    documentosDeMano: [
      'Extracto certificado Openbank con movimientos',
      'Facturas de pagos directos (farmacia, dentista, óptica, bata)',
      'Tabla resumen: obligación vs aportado vs déficit',
    ],
    mensaje60s:
      'Señoría, hay pluspetición clara: se reclaman 2.400€ por 12 mensualidades de 200€, pero Juan aportó 1.971,27€ a la cuenta hasta septiembre 2025, más 600€ adicionales tras el despacho. El déficit real es 1.828,73€, no 2.400€. Además, Juan ha pagado directamente 467€ en gastos necesarios de los hijos acreditados con facturas: farmacia, dentista, óptica y material escolar. Pedimos estimación parcial y sin costas.',
  },
  {
    tipo: 'neutral',
    titulo: 'Juez técnico — examina motivos tasados',
    puntosAClavar: [
      'Pago parcial: Art. 556.1 LEC — Juan ha pagado parte de la obligación',
      'Pluspetición: Art. 558 LEC — la cuantía reclamada excede la deuda real',
      'NO insistir en compensación (no es motivo tasado en ejecución de resoluciones judiciales)',
    ],
    queConceder: [
      'Retirar argumentos sobre uso indebido de la cuenta si el juez los considera fuera de Art. 556',
      'Aceptar que la obligación de 200€/mes existe',
    ],
    planB: [
      'Si no admite pagos directos como cumplimiento: reservar para procedimiento declarativo posterior',
      'Si condena al pago íntegro: solicitar fraccionamiento',
    ],
    documentosDeMano: [
      'Extracto certificado Openbank',
      'Tabla de pagos mes a mes con fechas',
      'Copia Art. 556 y 558 LEC subrayados',
    ],
    mensaje60s:
      'Señoría, nos oponemos por dos motivos tasados del Art. 556 LEC. Primero, pago parcial: Juan ha aportado 2.571,27€ a la cuenta común de los hijos, acreditado con extracto certificado de Openbank. Segundo, pluspetición del Art. 558: se reclaman 2.400€ pero el déficit real, una vez descontados los pagos, es significativamente inferior. Solicitamos que se fije la cuantía con base en los extractos bancarios certificados, no en la cifra alegada por la ejecutante.',
  },
  {
    tipo: 'hostil',
    titulo: 'Juez califica como alimentos — rechaza oposición',
    puntosAClavar: [
      'Incluso si son alimentos, la pluspetición SIGUE siendo válida (558 LEC)',
      'El déficit REAL sigue siendo menor que 2.400€ — esto es un hecho contable, no jurídico',
      'Acreditar los pagos a cuenta como cumplimiento parcial',
    ],
    queConceder: [
      'No discutir la naturaleza alimenticia si el juez ya la ha decidido',
      'Reconocer la obligación y mostrar voluntad de cumplimiento',
    ],
    planB: [
      'Solicitar fraccionamiento del pago',
      'Pedir que no se impongan multas coercitivas (Art. 776.1 LEC) dado que hay voluntad de pago acreditada',
      'Reservar la cuestión del uso indebido de la cuenta para procedimiento declarativo',
    ],
    documentosDeMano: [
      'Comprobantes de transferencias post-despacho (200€ en oct, oct, oct y nov)',
      'Extracto certificado Openbank',
      'Email 10/04/2025 avisando de las retiradas injustificadas',
    ],
    mensaje60s:
      'Señoría, respetamos el criterio del tribunal sobre la naturaleza de la obligación. Pero incluso en ese marco, los números son los números: Juan ha pagado a cuenta, las transferencias post-despacho lo acreditan, y el déficit real es inferior a 2.400€. Pedimos que al menos se fije la cuantía de la ejecución con base en los extractos certificados. Además, solicitamos que no se impongan multas coercitivas: Juan ha demostrado voluntad de pago con cuatro transferencias tras el despacho. Si hay un exceso en la cuenta por uso indebido, nos reservamos la acción declarativa correspondiente.',
  },
];
