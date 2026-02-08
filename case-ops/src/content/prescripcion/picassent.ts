import { PICASSENT_FACTS } from './picassent.facts';

export const prescripcionPicassent = {
  meta: {
    title: 'Prescripción — P.O. 715/2024 (Picassent)',
    slug: 'prescripcion',
    caseId: 'picassent',
    caseCode: 'CAS001',
    status: 'ACTIVO',
    cuantia: '212.677,00 €',
    audienciaPrevia: '10/03/2026 09:45',
    version: 'v3.0 DEFINITIVA',
    tags: [
      'prescripción',
      'dies a quo',
      'actio nata',
      'STS 458/2025',
      'depuración del objeto',
      'carga de la prueba',
    ],
  },
  hero: {
    title: 'Prescripción — P.O. 715/2024 (Picassent)',
    subtitle: 'Estrategia operativa para Audiencia Previa (AP)',
    metaReal:
      'Meta real: ganar la AP obligando a la actora a depurar el objeto y a venir con una tabla verificable por bloques/partidas.',
    metaRealNote:
      'Si no hay fecha + concepto + documento + base jurídica + exigibilidad, no hay “deuda viva”; hay relato.',
  },
  panelRapido: {
    title: 'Panel rápido (para ti)',
    bullets: [
      'Caso: CAS001 · Cuantía: 212.677,00 € · AP: 10/03/2026 09:45',
      `Matrimonio: ${PICASSENT_FACTS.matrimonio.human}`,
      'Acción prioritaria: Depuración del objeto + resolución por bloques',
      'Regla de oro: Sin tabla, no entra',
    ],
  },
  resumen: {
    title: 'Resumen ejecutivo (60s)',
    intro: 'Esta defensa es técnica y se apoya en dos ejes:',
    puntos: [
      'Prescripción: el plazo corre desde que la acción pudo ejercitarse (exigibilidad real).',
      'Carga de la prueba: la actora debe acreditar un crédito existente, exigible, cuantificado y vigente, no una agregación narrativa.',
    ],
    riesgoIntro: 'El riesgo es que intenten:',
    riesgos: [
      '“Reempaquetar” conceptos heterogéneos como crédito único, y',
      'usar STS 458/2025 para desplazar el dies a quo al final (ruptura/disolución) y reactivar partidas antiguas.',
    ],
    solucionIntro: 'Solución definitiva:',
    solucion: '✅ exigir depuración del objeto, bloques homogéneos, tabla verificable y motivación del dies a quo por bloque. Sin eso: indefensión + incontrolabilidad + desestimación de lo no probado.',
  },
  peticionPrioritaria: {
    title: 'Petición prioritaria (siempre, antes de discutir prescripción)',
    subtitle: 'Depuración del objeto + tabla obligatoria por bloques',
    intro: 'Exigir que la actora separe, fundamente y cuantifique:',
    bloques: [
      'Bloque A — Cuotas / pagos de obligaciones comunes (reembolso entre codeudores/cónyuges, si procede)',
      'Bloque B — Gastos ordinarios / transferencias / consumo (si pretende “deuda”, que explique causa y pacto)',
      'Bloque C — Inversiones / mejoras / aportaciones patrimoniales (régimen distinto; no mezclable con cuotas)',
    ],
    matrizTitle: 'Matriz mínima por bloque/partida (sin esto NO hay debate serio):',
    matriz: [
      'Fecha',
      'Concepto',
      'Importe',
      'Documento soporte',
      'Base jurídica (qué acción es)',
      'Exigibilidad / dies a quo',
      'Interrupción (solo si se alega): acto + fecha + contenido + destinatario',
    ],
    mantra: '“Sin tabla verificable no se puede fijar prescripción ni cuantía.”',
  },
  reglaDeOro: {
    title: 'Regla de oro (operativa)',
    bullets: [
      'Sin fecha + documento: NO ENTRA.',
      'Sin base jurídica (acción): NO ENTRA.',
      'Sin exigibilidad explicada (dies a quo): NO ENTRA.',
      'Si alegan interrupción y no la acreditan: cae / prescribe / no probado.',
      'No mezclar: cuotas ≠ gastos ≠ inversiones.',
    ],
  },
  comoTeLaIntentanColar: {
    title: 'Cómo te la intentan colar (patrón típico)',
    bullets: [
      'Presentan un sumatorio de años.',
      'Evitan tabla por partidas y sustituyen prueba por narrativa.',
      'Invocan STS 458/2025 para que el plazo empiece “al final”.',
      'Piden al juez tratarlo como un crédito único a liquidar.',
    ],
    antidoto: 'Antídoto: bloques + tabla + dies a quo motivado por bloque + prueba.',
  },
  marcoNormativo: {
    title: 'Marco normativo operativo',
    subtitle: 'Normas mínimas para sostener prescripción, carga de la prueba y depuración del objeto.',
    items: [
      {
        id: 'cc-1964-2',
        norma: 'Art. 1964.2 CC',
        texto: 'Prescripción de acciones personales a los cinco años.',
        uso: 'Corte temporal base por bloque/partida (H1).',
      },
      {
        id: 'cc-1969',
        norma: 'Art. 1969 CC',
        texto: 'El tiempo para la prescripción comienza desde que la acción pudo ejercitarse (actio nata).',
        uso: 'Exigir dies a quo real por partida, no “al final” por defecto.',
      },
      {
        id: 'cc-1973',
        norma: 'Art. 1973 CC',
        texto: 'Interrupción de prescripción solo por actos válidos, acreditados y dirigidos.',
        uso: 'Si alegan interrupción, pedir acto + fecha + contenido + destinatario.',
      },
      {
        id: 'dt-5-ley-42-2015',
        norma: 'DT 5ª Ley 42/2015',
        texto: 'Régimen transitorio del nuevo plazo de prescripción.',
        uso: 'Controlar partidas antiguas y aplicar el punto de corte del 07/10/2015.',
      },
      {
        id: 'cc-1145',
        norma: 'Art. 1145 CC',
        texto: 'Reembolso entre codeudores: acción de repetición.',
        uso: 'Base jurídica del Bloque A y exigencia de prueba de pagos.',
      },
      {
        id: 'lec-217',
        norma: 'Art. 217 LEC',
        texto: 'Carga de la prueba del hecho constitutivo.',
        uso: 'La actora debe probar crédito, cuantía, exigibilidad e interrupción.',
      },
      {
        id: 'lec-426-4',
        norma: 'Art. 426.4 LEC',
        texto: 'Complemento de alegaciones por hechos jurídicos nuevos.',
        uso: 'Introducir doctrina STS 458/2025 en AP si es posterior a contestación.',
      },
      {
        id: 'cc-7',
        norma: 'Art. 7 CC',
        texto: 'Buena fe y proscripción del abuso del derecho (retraso desleal).',
        uso: 'Neutralizar reclamaciones tardías sin soporte probatorio.',
      },
      {
        id: 'ts-188-2011',
        norma: 'STS 188/2011 + STS 20/03/2013 + STS 246/2018',
        texto: 'Las cuotas hipotecarias de vivienda familiar no son automáticamente cargas del matrimonio.',
        uso: 'Refuerzo para negar extensión automática de cargas y exigir prueba.',
      },
    ],
  },
  cronologiaPrescripcion: {
    title: 'Cronología de prescripción (doble hipótesis)',
    subtitle: 'Matriz comparativa H1 vs H2.',
    tramos: [
      {
        id: 'tramo-pre-2015-10-07',
        rango: 'Pre 07/10/2015',
        descripcion:
          'Periodo pre-reforma (07/10/2015): acciones nacidas antes de esa fecha quedan sujetas a la DT 5ª de la Ley 42/2015 y exigen depuración por partidas/bloques.',
        estadoH1: 'PRESCRITO',
        estadoH2: 'PRESCRITO',
        nota: `DT 5ª (Ley 42/2015) y segmentación por bloques. Si existen partidas anteriores al matrimonio (${PICASSENT_FACTS.matrimonio.human}), se tratan como sub-bloque separado; no procede crédito único.`,
      },
      {
        id: 'tramo-2015-10-07-2019-06-24',
        rango: '07/10/2015 – 24/06/2019',
        descripcion:
          'Bajo H1, prescripción por pago (actio nata). Bajo H2, solo es campo de batalla si se aceptan los presupuestos 458; en todo caso exige depuración y prueba.',
        estadoH1: 'PRESCRITO',
        estadoH2: 'CAMPO DE BATALLA',
        nota: 'Solo podría salvarse si hay tabla y motivación de dies a quo por bloque.',
      },
      {
        id: 'tramo-2019-06-24-2022-08',
        rango: '24/06/2019 – ago. 2022',
        descripcion:
          'Normalmente dentro de plazo. La pelea real es de prueba, exceso, trazabilidad y posibles interrupciones válidas.',
        estadoH1: 'NO PRESCRITO',
        estadoH2: 'NO PRESCRITO',
      },
      {
        id: 'tramo-2022-08-2023-10',
        rango: 'ago. 2022 – oct. 2023',
        descripcion:
          'Post-separación: dentro de plazo, foco en compensaciones y pagos posteriores; la STS 458 no suple prueba.',
        estadoH1: 'NO PRESCRITO',
        estadoH2: 'NO PRESCRITO',
      },
    ],
  },
  distinguishing: {
    title: 'Distinguishing anti-STS 458/2025',
    subtitle: 'Resumen operativo. Ver versión extendida en /analytics/anti-sts-458-2025.',
    intro:
      'Resumen de 4 argumentos para distinguir la STS 458/2025: naturaleza de inversión, falta de desequilibrio probado, retraso desleal y llave procesal.',
    ctaLabel: 'Abrir versión extendida',
  },
  escenarios: {
    title: 'Selector de escenarios (decisión rápida)',
    subtitle: 'En AP no gana el más listo: gana el que impone el marco y fuerza la depuración.',
    items: [
      {
        id: 'escenario-1',
        title: 'Escenario 1 — STS 458/2025 NO entra · Juez NO la compra',
        sostener:
          'Prescripción por exigibilidad real: cada partida/bloque reclamable era ejercitable en su momento; lo no reclamado en plazo no puede sobrevivir como “deuda viva”.',
        pedir: [
          'Estimar prescripción por tramos/bloques temporales (fuera lo remoto).',
          'Depuración del objeto + tabla verificable (sin tabla: desestimación de lo no individualizado).',
        ],
        riesgo: 'Que intenten “crédito único”.',
        contramedida: 'Acción + exigibilidad + ausencia de interrupción acreditada.',
      },
      {
        id: 'escenario-2',
        title: 'Escenario 2 — STS 458/2025 NO la invocan · Juez la menciona / la compra',
        sostener:
          'STS 458/2025 no autoriza mezclar acciones ni sustituye la prueba: como mínimo obliga a delimitar alcance y resolver por bloques homogéneos.',
        pedir: [
          'Resolución por BLOQUES con cuantía separada (A/B/C).',
          'Motivación expresa del dies a quo por bloque + punto de corte cierto si lo fijan al final.',
        ],
        riesgo: 'Extensión indiscriminada “a todo”.',
        contramedida: 'Bloques + tabla + motivación del dies a quo + no extensión automática.',
      },
      {
        id: 'escenario-3',
        title: 'Escenario 3 — STS 458/2025 SÍ la invocan · Juez NO la compra',
        sostener: 'Vuelta a prescripción + falta de prueba: sin crédito exigible y vigente acreditado, cae.',
        pedir: [
          'Exclusión de lo remoto por prescripción/no individualización.',
          'Requerir concreción completa: fecha, concepto, doc, base, exigibilidad.',
        ],
        riesgo: 'Debate “relato vs relato”.',
        contramedida: 'Convertir todo en tabla verificable.',
      },
      {
        id: 'escenario-4',
        title: 'Escenario 4 — STS 458/2025 SÍ la invocan · Juez SÍ la compra',
        sostener:
          'Aunque el juez asuma STS 458/2025 para un bloque concreto, NO puede: convertir A+B+C en un crédito único, extenderla a gastos/inversiones sin depuración, fijar dies a quo “al final” sin punto de corte probado y motivación por bloque.',
        pedir: [
          'Decisión por BLOQUES A/B/C con base jurídica y cuantía separada.',
          'Para cada bloque: dies a quo motivado + prueba + (si alegan) interrupción acreditada. Sin eso: desestimación de lo no probado.',
        ],
        riesgo: 'Reactivación masiva de partidas antiguas.',
        contramedida: 'Motivación reforzada + no extensión automática + tabla + carga de prueba.',
      },
    ],
  },
  planA: {
    title: 'Plan A — Tesis principal (prescripción + actio nata + prueba)',
    thesis:
      'Tesis operativa: una reclamación global en 2024 no convierte hechos antiguos en deuda actual. Cada bloque/partida debe pasar filtros de: existencia → acción → exigibilidad → prueba → (si procede) interrupción.',
    checklistTitle: 'Checklist conceptual (para repetir):',
    checklist: [
      '¿Qué acción es? (reembolso / gasto / inversión)',
      '¿Cuándo fue exigible? (dies a quo real)',
      '¿Qué documento lo prueba?',
      '¿Qué cuantía exacta?',
      '¿Qué interrupción concreta hay, si se invoca?',
    ],
  },
  planB: {
    title: 'Plan B — Anti-STS 458/2025 (4 argumentos reales de distinguishing)',
    enfoque:
      'Enfoque: distinguir nuestro caso del supuesto de hecho de la STS 458/2025 con un enfoque procesal de inversión/explotación patrimonial, ausencia de desequilibrio y retraso desleal, más la llave del art. 426.4 LEC.',
    frasesTitle: 'Los 4 argumentos (en orden de fuerza):',
    frases: [
      `ARG 1 — Negocio, no vivienda: inversión turística (${PICASSENT_FACTS.alquilerTuristico.canal} + licencia de alojamiento turístico).`,
      'ARG 2 — Sin desequilibrio probado: sueldos comparables y cuentas conjuntas.',
      `ARG 3 — Retraso desleal: cotitularidad + ${PICASSENT_FACTS.formacionActora} + ausencia de reclamación fehaciente.`,
      'ARG 4 — Llave procesal: art. 426.4 LEC (doctrina sobrevenida).',
    ],
    filtrosTitle: 'Diferencias fácticas clave vs. STS 458/2025:',
    filtros: [
      `STS: vivienda habitual → Nosotros: negocio inmobiliario / segunda residencia / ${PICASSENT_FACTS.alquilerTuristico.canal} + licencia de alojamiento turístico`,
      'STS: cuenta nutrida casi exclusivamente por ella → Nosotros: 2 sueldos comparables, 2 cuentas conjuntas, 0 privativos',
      'STS: desequilibrio probado → Nosotros: ningún euro privativo identificable',
      'STS: hipoteca de domicilio = carga familiar implícita → Nosotros: inversión especulativa = comunidad ordinaria (392 CC)',
      `STS: cónyuge sin formación financiera / sin visibilidad → Nosotros: policía + ${PICASSENT_FACTS.formacionActora} + cotitular + 0 reclamaciones durante años`,
    ],
  },
  erroresFatales: {
    title: 'Errores fatales (evitarlos en sala)',
    subtitle: 'Checklist rápido para no regalar la prescripción ni el marco probatorio.',
    items: [
      {
        id: 'error-objeto',
        title: 'Discutir sin depurar objeto / sin tabla',
        mal: 'Aceptar un sumatorio global sin fecha, concepto y base jurídica por partida.',
        bien: 'Exigir tabla verificable por bloques y motivación del dies a quo.',
      },
      {
        id: 'error-credito-global',
        title: 'Conceder crédito global',
        mal: 'Tratar todo como “crédito único” y saltarse la prescripción por bloques.',
        bien: 'Forzar resolución por bloques homogéneos con cuantía separada.',
      },
      {
        id: 'error-458-rotundo',
        title: 'Negar la 458 apodícticamente',
        mal: 'Decir “no aplica y punto” sin distinguir hechos ni ofrecer subsidiaria.',
        bien: 'Distinguishing claro + subsidiaria: si aplica, que sea por bloques.',
      },
      {
        id: 'error-emocional',
        title: 'Lenguaje emocional',
        mal: 'Argumentar “es injusto” o “ella sabía” en términos valorativos.',
        bien: 'Hablar de indefensión, falta de prueba y carga del art. 217 LEC.',
      },
      {
        id: 'error-hechos',
        title: 'Hechos académicos/canal incorrectos',
        mal: 'Decir “licenciada en económicas” o “Airbnb” sin base.',
        bien: `Usar ${PICASSENT_FACTS.formacionActora} y ${PICASSENT_FACTS.alquilerTuristico.canal} + licencia de alojamiento turístico.`,
      },
      {
        id: 'error-interrupcion',
        title: 'Aceptar interrupción sin prueba',
        mal: 'Admitir interrupción por simples correos o referencias genéricas.',
        bien: 'Pedir acto, fecha, contenido y destinatario (art. 1973 CC).',
      },
      {
        id: 'error-pretension-mixta',
        title: 'Mezclar pagos, gastos e inversiones',
        mal: 'Combinar cuotas hipotecarias, gastos ordinarios e inversiones como si fueran lo mismo.',
        bien: 'Separar Bloque A/B/C con base jurídica y pruebas distintas.',
      },
      {
        id: 'error-pre-matrimonio',
        title: 'Ignorar el origen pre-reforma',
        mal: 'Ignorar la DT 5ª (07/10/2015) y la heterogeneidad de partidas.',
        bien: `DT 5ª (pre-07/10/2015) + segmentación por bloques/partidas; pre-${PICASSENT_FACTS.matrimonio.human} solo si existen partidas previas al matrimonio.`,
      },
    ],
  },
  guion: {
    title: 'Guion de sala (2 minutos)',
    text:
      `Señoría, solicitamos depuración del objeto: la actora formula una reclamación global con hechos y pagos antiguos sin aportar, por bloques/partidas, fecha, concepto, documento, base jurídica, exigibilidad y, en su caso, actos interruptivos. Nuestra posición es técnica: (1) prescripción de lo exigible y no reclamado en plazo; (2) falta de prueba de un crédito exigible y vigente; y (3) subsidiariamente, si se menciona STS 458/2025, limitar estrictamente su alcance: decisión por bloques homogéneos con cuantía separada y motivación del dies a quo por bloque, sin extensión automática a gastos o inversiones. Además, el inmueble se explotó como ${PICASSENT_FACTS.alquilerTuristico.canal} con licencia de alojamiento turístico y responde a una ${PICASSENT_FACTS.dinamicaPatrimonial}`,
  },
  checklist: {
    title: 'Checklist 24–72h (solo lo que mueve la aguja)',
    items: [
      'Convertir todo a tabla: fecha → importe → concepto → doc → bloque → base → exigibilidad → prescripción',
      'Preparar petición/guion de “decisión por bloques A/B/C”',
      'Identificar 3–5 documentos “matrices” que desmonten el relato (si existen)',
      'Preparar petición de exhibición/oficios SOLO si falta un documento esencial y concreto',
    ],
  },
  plantillas: {
    title: 'Plantillas (para tu tablero)',
    tablaTitle: 'Plantilla de tabla por partidas (copiar)',
    tablaHeaders: [
      'Bloque',
      'Fecha',
      'Concepto',
      'Importe',
      'Documento',
      'Base jurídica',
      'Exigibilidad (dies a quo)',
      'Interrupción (si alegan)',
      'Estado',
    ],
    tablaRow: ['A/B/C', 'AAAA-MM-DD', '…', '…', '…', '…', '…', '…', 'OK / Falta / Prescribe'],
    peticionesTitle: 'Plantilla de peticiones (AP)',
    peticiones: [
      'P1: Depuración del objeto + resolución por bloques A/B/C con cuantías separadas.',
      'P2: Tabla verificable por bloque/partida con soporte y motivación del dies a quo.',
      'P3 (condicional): Si invocan interrupción, identificación y aportación documental del acto concreto.',
    ],
  },
  toc: [
    { id: 'panel-rapido', label: 'Panel rápido' },
    { id: 'resumen-60s', label: 'Resumen 60s' },
    { id: 'marco-normativo', label: 'Marco normativo' },
    { id: 'peticion-prioritaria', label: 'Petición prioritaria' },
    { id: 'tabla-partidas', label: 'Tabla por partidas (A/B/C)' },
    { id: 'regla-de-oro', label: 'Regla de oro' },
    { id: 'como-te-la-intentan-colar', label: 'Cómo te la intentan colar' },
    { id: 'cronologia-prescripcion', label: 'Cronología (H1/H2)' },
    { id: 'distinguishing', label: 'Distinguishing' },
    { id: 'selector-escenarios', label: 'Selector de escenarios' },
    { id: 'plan-a', label: 'Plan A' },
    { id: 'plan-b', label: 'Plan B' },
    { id: 'guion-2-min', label: 'Guion 2 min' },
    { id: 'checklist-24-72', label: 'Checklist 24–72h' },
    { id: 'plantillas', label: 'Plantillas' },
    { id: 'errores-fatales', label: 'Errores fatales' },
  ],
} as const;
