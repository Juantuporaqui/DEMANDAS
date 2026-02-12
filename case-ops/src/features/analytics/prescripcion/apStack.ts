export interface APStackItem {
  id: `P${number}`;
  title: string;
  tesis: string;
  pedir: [string, string];
  prueba: string[];
  fraseSala: string;
}

export const AP_STACK_ITEMS: APStackItem[] = [
  {
    id: 'P0',
    title: 'Depuración del objeto + tabla verificable + carga de la prueba',
    tesis:
      'Sin individualización por partidas o bloques homogéneos (fecha, concepto, importe, documento, acción y exigibilidad), la pretensión se mantiene en un relato global y no permite contradicción efectiva ni control de prescripción.',
    pedir: [
      'Que se requiera a la actora para que individualice su pretensión por partidas o, al menos, por bloques homogéneos A/B/C, con fecha o periodo, concepto, cuantía exacta, base jurídica y documento soporte.',
      'Que se fijen como hechos controvertidos, por cada partida o bloque, la existencia del pago, cuantía, acción aplicable, exigibilidad o dies a quo e interrupción, con expresa atribución de la carga probatoria a quien afirma el hecho constitutivo (art. 217 LEC).',
    ],
    prueba: [
      'Ausencia de tabla verificable en demanda.',
      'Extractos, recibos y transferencias por partida.',
    ],
    fraseSala:
      'Con carácter previo, se interesa la depuración del objeto: la actora formula una reclamación global sin aportar una relación verificable por partidas o bloques homogéneos. Sin fecha, concepto, cuantía, documento y base jurídica por partida no es posible articular contradicción ni efectuar control de prescripción. Procede, por tanto, requerir dicha individualización y fijar hechos controvertidos con carga probatoria a cargo de quien sostiene el crédito.',
  },
  {
    id: 'P1',
    title: 'Falta de presupuesto del crédito (pago en exceso no acreditado)',
    tesis:
      'Antes de discutir dies a quo, debe acreditarse el presupuesto del reembolso: pago en exceso respecto de la cuota interna y trazabilidad. La domiciliación de una nómina en cuenta conjunta no acredita pago exclusivo.',
    pedir: [
      'Que se declare que la mera domiciliación de la nómina en la cuenta de cargo no acredita pago privativo ni exceso y que la actora debe probar trazabilidad y exceso neto por periodos.',
      'Subsidiariamente, que cualquier eventual reembolso se limite a excesos acreditados tras conciliación intercuentas, excluyendo reconstrucciones globales sin soporte.',
    ],
    prueba: ['Titularidad de cuentas conjuntas.', 'Extractos completos y conciliación de transferencias cruzadas.'],
    fraseSala:
      'La acción de reembolso exige presupuesto previo: la existencia de un pago en exceso por un codeudor. En un sistema de cuentas conjuntas alimentadas por ambos, el hecho de que el cargo hipotecario se efectúe en una cuenta donde se domicilia una nómina no convierte ese pago en privativo ni acredita exceso.',
  },
  {
    id: 'P2',
    title: 'Prescripción clásica por cuota o pago (actio nata)',
    tesis:
      'Regla general: el plazo corre desde que la acción pudo ejercitarse; en obligaciones periódicas, cada cuota genera un crédito autónomo con prescripción propia.',
    pedir: [
      'Que se declare prescrita toda partida o cuota cuyo vencimiento o pago sea anterior al plazo aplicable, con segmentación por tramos y DT 5ª Ley 42/2015.',
      'Que se rechace la construcción de un crédito único global que diluya la prescripción por cuotas y periodos.',
    ],
    prueba: ['Cuadro de amortización y recibos con fechas.', 'Cómputo por tramos pre y post 07/10/2015.'],
    fraseSala:
      'Conforme al art. 1969 CC, el cómputo se inicia desde que la acción pudo ejercitarse; tratándose de cuotas periódicas, cada cuota genera un crédito autónomo exigible desde su vencimiento o pago, con prescripción individual.',
  },
  {
    id: 'P3',
    title: 'STS 458/2025 no automática; aplicación estricta por bloques',
    tesis:
      'La STS 458/2025 no suprime la necesidad de prueba ni autoriza su extensión automática a cualquier bloque o periodo.',
    pedir: [
      'Que, si se invoca la STS 458/2025, se delimite expresamente su ámbito por bloques homogéneos y se motive el dies a quo por cada bloque.',
      'Que, en todo caso, el dies a quo se fije como máximo en la separación de hecho definitiva, no en un final indeterminado.',
    ],
    prueba: ['Hechos de separación de hecho definitiva.', 'Ausencia de reclamaciones fehacientes e interrupción.'],
    fraseSala:
      'Aun cuando se invocara la STS 458/2025, su doctrina no opera de forma automática ni convierte cualquier partida en imprescriptible durante décadas: exige presupuestos fácticos y delimitación por bloques homogéneos.',
  },
  {
    id: 'P4',
    title: 'Distinguishing material: inversión patrimonial ≠ vivienda habitual',
    tesis:
      'Si el préstamo financia una operación de inversión patrimonial, no concurre la ratio protectora de cargas familiares.',
    pedir: [
      'Que se declare que la STS 458/2025 no resulta trasladable, o solo de forma muy limitada, a una operación de inversión patrimonial.',
      'Que rija el criterio general de exigibilidad por cuota o pago y prescripción individual.',
    ],
    prueba: ['Escrituras y préstamo.', 'Documental de explotación o arrendamiento, según se acreditará.'],
    fraseSala:
      'La STS 458/2025 se construye sobre convivencia y cargas familiares. En este caso, según resulta de la documental aportada, el préstamo se vinculó a una operación patrimonial de inversión.',
  },
  {
    id: 'P5',
    title: 'Crítica a la analogía CCCat',
    tesis:
      'El CC común no contiene suspensión general de prescripción entre cónyuges equivalente al art. 121-16 CCCat.',
    pedir: [
      'Que se rechace una extensión automática de la STS 458/2025 equivalente a suspender la prescripción durante todo el matrimonio sin norma expresa.',
      'Que prevalezca el art. 1969 CC en obligaciones periódicas, sin congelación indefinida.',
    ],
    prueba: ['Comparación normativa CC común vs CCCat.', 'Argumento de seguridad jurídica.'],
    fraseSala:
      'No procede convertir una referencia orientativa en una suspensión de facto durante toda la vida matrimonial que permita reactivar cuotas remotas en perjuicio de la seguridad jurídica.',
  },
  {
    id: 'P6',
    title: 'Retraso desleal y no interrupción',
    tesis:
      'El silencio prolongado sin reclamación fehaciente refuerza la falta de interrupción y la exigencia de depuración estricta.',
    pedir: [
      'Que se declare no acreditada interrupción si no se identifican actos fehacientes con acto, fecha, contenido y destinatario.',
      'Que se valore el retraso desleal como refuerzo para inadmitir reconstrucciones tardías sin soporte.',
    ],
    prueba: ['No consta burofax o requerimiento fehaciente.', 'Cotitularidad y acceso a información bancaria.'],
    fraseSala:
      'No consta acto interruptivo fehaciente en los términos del art. 1973 CC. El silencio prolongado durante años, con acceso a la información, excluye interrupción y refuerza la exigencia de buena fe del art. 7 CC.',
  },
  {
    id: 'P7',
    title: 'Doctrina sobrevenida y complemento de prueba',
    tesis:
      'Si la actora reconfigura el debate con STS 458/2025, procede complemento de alegaciones y prueba para evitar indefensión.',
    pedir: [
      'Que se tenga por justificada la necesidad de complementar alegaciones y aportar prueba dirigida a los presupuestos fácticos que se introduzcan.',
      'Que se admita aportación documental posterior y proposición de prueba pertinente (arts. 426, 270 y 286 LEC).',
    ],
    prueba: ['Documentación bancaria completa de ambas cuentas.', 'Documental de separación de hecho, domicilio y destino del préstamo.'],
    fraseSala:
      'La STS 458/2025 es posterior a la contestación y, si se invoca para desplazar el dies a quo, altera el presupuesto fáctico a debatir. Por ello se interesa complemento de alegaciones y prueba conexa.',
  },
];
