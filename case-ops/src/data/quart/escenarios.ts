export interface EscenarioVista {
  tipo: 'favorable' | 'neutral' | 'hostil';
  titulo: string;
  queEsperar: string;
  puntosAClavar: string[];
  queConceder: string[];
  planB: string[];
  peticionesEnOrden: string[];
  documentosDeMano: string[];
  mensaje15s: string;
  mensaje60s: string;
}

export const escenariosQuart: EscenarioVista[] = [
  {
    tipo: 'favorable',
    titulo: 'Juez receptivo a pluspetición',
    queEsperar: 'El juez ve que los 2.400€ no cuadran con el déficit real de 1.828,73€.',
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
    peticionesEnOrden: [
      '1. Estimación parcial: reducir de 2.400€ a 1.228,73€ máximo (déficit - pagos directos necesarios)',
      '2. Compensar con pagos directos acreditados (farmacia, dentista, material escolar)',
      '3. Sin condena en costas por estimación parcial',
    ],
    documentosDeMano: [
      'Extracto certificado Openbank con movimientos',
      'Facturas de pagos directos (farmacia, dentista, óptica, bata)',
      'Tabla resumen: obligación vs aportado vs déficit',
    ],
    mensaje15s:
      'Se reclaman 2.400€ pero el déficit real es 1.828,73€. Además Juan pagó directamente 467€ en gastos necesarios de los hijos. El saldo real es inferior a lo reclamado.',
    mensaje60s:
      'Señoría, hay pluspetición clara: se reclaman 2.400€ por 12 mensualidades de 200€, pero Juan aportó 1.971,27€ a la cuenta hasta septiembre 2025, más 600€ adicionales tras el despacho. El déficit real es 1.828,73€, no 2.400€. Además, Juan ha pagado directamente 467€ en gastos necesarios de los hijos acreditados con facturas: farmacia, dentista, óptica y material escolar. Pedimos estimación parcial y sin costas.',
  },
  {
    tipo: 'neutral',
    titulo: 'Juez técnico — examina motivos tasados',
    queEsperar: 'El juez se ciñe estrictamente a Art. 556 LEC y solo admite motivos tasados.',
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
    peticionesEnOrden: [
      '1. Pago acreditado: reducir la ejecución en la cantidad ya aportada (1.971,27€ + 600€)',
      '2. Pluspetición subsidiaria: que el déficit se fije con extractos certificados',
      '3. Costas proporcionales',
    ],
    documentosDeMano: [
      'Extracto certificado Openbank',
      'Tabla de pagos mes a mes con fechas',
      'Copia Art. 556 y 558 LEC subrayados',
    ],
    mensaje15s:
      'Oponemos por pago parcial (556.1 LEC) y pluspetición (558 LEC). Las cifras hablan solas: la obligación acumulada es 4.200€, lo aportado es 2.571,27€, el déficit es 1.628,73€.',
    mensaje60s:
      'Señoría, nos oponemos por dos motivos tasados del Art. 556 LEC. Primero, pago parcial: Juan ha aportado 2.571,27€ a la cuenta común de los hijos, acreditado con extracto certificado de Openbank. Segundo, pluspetición del Art. 558: se reclaman 2.400€ pero el déficit real, una vez descontados los pagos, es significativamente inferior. Solicitamos que se fije la cuantía con base en los extractos bancarios certificados, no en la cifra alegada por la ejecutante.',
  },
  {
    tipo: 'hostil',
    titulo: 'Juez califica como alimentos — rechaza oposición',
    queEsperar:
      'El juez acepta la tesis de Vicenta: los 200€/mes son alimentos irrenunciables. Rechaza compensación y pagos directos.',
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
    peticionesEnOrden: [
      '1. Subsidiariamente: estimar la pluspetición y fijar el déficit real con extractos',
      '2. No imponer multas coercitivas dada la voluntad de pago',
      '3. Fraccionamiento si procede condena',
      '4. Reserva de acciones para reclamar uso indebido en vía declarativa',
    ],
    documentosDeMano: [
      'Comprobantes de transferencias post-despacho (200€ en oct, oct, oct y nov)',
      'Extracto certificado Openbank',
      'Email 10/04/2025 avisando de las retiradas injustificadas',
    ],
    mensaje15s:
      'Incluso aceptando la calificación como alimentos, la cifra reclamada no cuadra. Pedimos que se fije con extractos, no con la alegación de la ejecutante.',
    mensaje60s:
      'Señoría, respetamos el criterio del tribunal sobre la naturaleza de la obligación. Pero incluso en ese marco, los números son los números: Juan ha pagado a cuenta, las transferencias post-despacho lo acreditan, y el déficit real es inferior a 2.400€. Pedimos que al menos se fije la cuantía de la ejecución con base en los extractos certificados. Además, solicitamos que no se impongan multas coercitivas: Juan ha demostrado voluntad de pago con cuatro transferencias tras el despacho. Si hay un exceso en la cuenta por uso indebido, nos reservamos la acción declarativa correspondiente.',
  },
];
