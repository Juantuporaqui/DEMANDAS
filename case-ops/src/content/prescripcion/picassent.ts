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
    version: 'Versión 3.0',
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
      'Sin individualización y soporte documental, no existe crédito verificable a efectos de contradicción y control de prescripción.',
  },
  panelRapido: {
    title: 'Panel de preparación',
    bullets: [
      'Caso: CAS001 · Cuantía: 212.677,00 € · AP: 10/03/2026 09:45',
      `Matrimonio: ${PICASSENT_FACTS.matrimonio.human}`,
      'Acción prioritaria: Depuración del objeto + resolución por bloques',
      'Regla operativa: sin tabla verificable no puede efectuarse control de prescripción',
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
      'agrupar conceptos heterogéneos y presentarlos como crédito único, y',
      'usar STS 458/2025 para desplazar el dies a quo al final (ruptura/disolución) y reactivar partidas antiguas.',
    ],
    solucionIntro: 'Respuesta procesal:',
    solucion: 'Se interesa depuración del objeto, bloques homogéneos, tabla verificable y motivación del dies a quo por bloque. En defecto de ello, la pretensión queda insuficientemente individualizada para su adecuado control contradictorio.',
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
    matrizTitle: 'Matriz mínima por bloque/partida (requisito para una contradicción efectiva):',
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
    title: 'Reglas operativas de contradicción y prueba',
    bullets: [
      'Sin fecha y sin documento, la alegación carece de individualización suficiente para su contradicción.',
      'Sin identificación de la acción y su base jurídica, no puede determinarse el plazo aplicable.',
      'Sin explicación de exigibilidad y dies a quo por partida, no puede practicarse control de prescripción.',
      'Si se invoca interrupción, debe precisarse y acreditarse el acto interruptivo, con fecha, contenido y destinatario identificables.',
      `Si ${PICASSENT_FACTS.reclamacionExtrajudicial.short} → no hay interrupción; se aplica prescripción por tramos y, además, refuerza retraso desleal (art. 7 CC).`,
      'No mezclar: cuotas ≠ gastos ≠ inversiones.',
    ],
  },
  comoTeLaIntentanColar: {
    title: 'Patrones habituales de articulación de la pretensión',
    bullets: [
      'Presentación de cuantías globales por periodos amplios.',
      'Sustitución de la prueba individualizada por una narrativa genérica.',
      'Invocación de STS 458/2025 para desplazar el dies a quo sin justificar identidad de supuesto.',
      `Silencio previo total: ${PICASSENT_FACTS.reclamacionExtrajudicial.short} (sin acto concreto no hay interrupción: art. 1973 CC).`,
      'Pretensión de tratar partidas heterogéneas como un crédito único a liquidar.',
    ],
    antidoto: 'Respuesta procesal: depuración del objeto + tabla verificable por bloques/partidas + dies a quo motivado + exigencia de prueba.',
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
        texto: 'La interrupción exige acto idóneo acreditado y susceptible de contradicción.',
        uso: 'Si se invoca interrupción, exigir identificación del acto, fecha, contenido y destinatario.',
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
        estadoH1: 'Prescrita',
        estadoH2: 'Prescrita',
        nota: `DT 5ª (Ley 42/2015) y segmentación por bloques. Si existen partidas anteriores al matrimonio (${PICASSENT_FACTS.matrimonio.human}), se tratan como sub-bloque separado; no procede crédito único.`,
      },
      {
        id: 'tramo-2015-10-07-2019-06-24',
        rango: '07/10/2015 – 24/06/2019',
        descripcion:
          'Bajo H1, prescripción por pago (actio nata). Bajo H2, exige verificar presupuestos fácticos de STS 458/2025; en todo caso, depuración y prueba por partidas.',
        estadoH1: 'Prescrita',
        estadoH2: 'Controvertida (condicionada)',
        nota: 'Solo podría salvarse si hay tabla y motivación de dies a quo por bloque.',
      },
      {
        id: 'tramo-2019-06-24-2022-08',
        rango: '24/06/2019 – ago. 2022',
        descripcion:
          'Normalmente dentro de plazo. La cuestión central se desplaza a la prueba, cuantificación y trazabilidad, junto con las eventuales interrupciones alegadas.',
        estadoH1: 'No prescrita',
        estadoH2: 'No prescrita',
      },
      {
        id: 'tramo-2022-08-2023-10',
        rango: 'ago. 2022 – oct. 2023',
        descripcion:
          'Post-separación: dentro de plazo, foco en compensaciones y pagos posteriores; la STS 458 no suple prueba.',
        estadoH1: 'No prescrita',
        estadoH2: 'No prescrita',
      },
    ],
  },
  distinguishing: {
    title: 'Respuesta procesal frente a STS 458/2025',
    subtitle: 'Resumen operativo con acceso inmediato a ficha y sentencia en PDF.',
    intro:
      'Resumen de 4 argumentos para distinguir la STS 458/2025: naturaleza de inversión, falta de desequilibrio probado, retraso desleal y llave procesal.',
    ctaLabel: 'Abrir versión extendida',
  },
  escenarios: {
    title: 'Selector de escenarios (decisión rápida)',
    subtitle: 'En Audiencia Previa resulta decisivo delimitar el objeto y fijar la carga probatoria por bloques.',
    items: [
      {
        id: 'escenario-1',
        title: 'Escenario 1 — STS 458/2025 no invocada; aplicación de regla general de actio nata por pago (H1)',
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
        title: 'Escenario 2 — STS 458/2025 introducida como criterio por el tribunal; delimitación estricta de su alcance',
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
        title: 'Escenario 3 — STS 458/2025 invocada por la actora; el tribunal no aprecia identidad de supuesto',
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
        title: 'Escenario 4 — STS 458/2025 considerada aplicable; aplicación parcial y por bloques homogéneos',
        sostener:
          'Aunque el tribunal considere aplicable la STS 458/2025 para un bloque concreto, no procede convertir A+B+C en crédito único ni desplazar el dies a quo sin motivación específica por bloque.',
        pedir: [
          'Decisión por BLOQUES A/B/C con base jurídica y cuantía separada.',
          'Para cada bloque: dies a quo motivado + prueba + (si alegan) interrupción acreditada. Sin eso: desestimación de lo no probado.',
        ],
        riesgo: 'Reactivación masiva de partidas antiguas.',
        contramedida: 'Motivación reforzada + no extensión automática + tabla + carga de prueba.',
      },

      {
        id: 'escenario-5',
        title: 'Escenario 5 — El tribunal difiere la prescripción a sentencia; aun así, depuración, concreción y carga probatoria',
        sostener:
          'Aunque el tribunal reserve la valoración final, la contradicción exige delimitación del objeto, individualización de partidas y fijación de hechos controvertidos.',
        pedir: [
          'Requerimiento de individualización por partidas/bloques para ordenar la prueba y evitar indefensión.',
          'Fijación expresa de hechos controvertidos y carga probatoria por partida (existencia, cuantía, acción, exigibilidad, interrupción).',
        ],
        riesgo: 'Llegar a juicio con objeto difuso y prueba inabordable.',
        contramedida: 'Forzar arquitectura probatoria en AP: tabla verificable, documentos y hechos controvertidos.',
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
      `ARG 1 — Activo patrimonial no destinado a vivienda habitual, según consta en documental sobre inversión turística (${PICASSENT_FACTS.alquilerTuristico.canal} + licencia de alojamiento turístico).`,
      'ARG 2 — No consta acreditado desequilibrio patrimonial con trazabilidad suficiente en cuentas conjuntas.',
      `ARG 3 — Retraso desleal: cotitularidad + ${PICASSENT_FACTS.formacionActora} + ${PICASSENT_FACTS.reclamacionExtrajudicial.short}`,
      'ARG 4 — Llave procesal: art. 426.4 LEC (doctrina sobrevenida).',
    ],
    filtrosTitle: 'Diferencias fácticas clave vs. STS 458/2025:',
    filtros: [
      `STS: vivienda habitual → Nosotros: negocio inmobiliario / segunda residencia / ${PICASSENT_FACTS.alquilerTuristico.canal} + licencia de alojamiento turístico`,
      'STS: cuenta nutrida casi exclusivamente por ella → Aquí: no consta acreditación trazable de aportaciones privativas exclusivas; constan cuentas conjuntas.',
      'STS: desequilibrio probado → Aquí: no consta acreditación de aportaciones privativas identificables con trazabilidad suficiente',
      'STS: hipoteca de domicilio como carga familiar implícita → Aquí: operación de inversión inmobiliaria en el ámbito de la comunidad ordinaria (art. 392 CC)',
      `STS: cónyuge sin formación financiera / sin visibilidad → Aquí, según consta en autos: policía + ${PICASSENT_FACTS.formacionActora} + cotitular + ${PICASSENT_FACTS.reclamacionExtrajudicial.short}`,
    ],
  },
  erroresFatales: {
    title: 'Errores críticos a evitar en sala',
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
        mal: 'Negar la aplicabilidad sin distinguir hechos ni articular una tesis subsidiaria.',
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
      `Señoría, solicitamos depuración del objeto: la actora formula una reclamación global con hechos y pagos antiguos sin aportar, por bloques/partidas, fecha, concepto, documento, base jurídica, exigibilidad y, en su caso, actos interruptivos. Además, ${PICASSENT_FACTS.reclamacionExtrajudicial.short}, lo que excluye la interrupción del art. 1973 CC y refuerza la buena fe (art. 7 CC). Nuestra posición es técnica: (1) prescripción de lo exigible y no reclamado en plazo; (2) falta de prueba de un crédito exigible y vigente; y (3) subsidiariamente, si se menciona STS 458/2025, se interesa delimitar estrictamente su alcance: decisión por bloques homogéneos con cuantía separada y motivación del dies a quo por bloque, sin extensión automática a gastos o inversiones. Además, según consta en la documental aportada, el inmueble se explotó como ${PICASSENT_FACTS.alquilerTuristico.canal} con licencia de alojamiento turístico y responde a una ${PICASSENT_FACTS.dinamicaPatrimonial}`,
  },
  checklist: {
    title: 'Checklist 24–72h (actuaciones prioritarias)',
    items: [
      'Convertir la pretensión en tabla por partidas: fecha, importe, concepto, documento, bloque, base, exigibilidad y prescripción.',
      'Preparar petición/guion de “decisión por bloques A/B/C”',
      'Identificar 3–5 documentos “matrices” que desmonten el relato (si existen)',
      'Preparar petición de exhibición/oficios solo si falta un documento esencial y concreto',
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
      'P3 (condicional): Si se invoca interrupción, identificación y aportación del acto interruptivo con fecha, contenido y destinatario.',
    ],
  },
  toc: [
    { id: 'panel-rapido', label: 'Panel de preparación' },
    { id: 'resumen-60s', label: 'Resumen 60s' },
    { id: 'marco-normativo', label: 'Marco normativo' },
    { id: 'peticion-prioritaria', label: 'Petición prioritaria' },
    { id: 'tabla-partidas', label: 'Tabla por partidas (A/B/C)' },
    { id: 'regla-de-oro', label: 'Reglas operativas de contradicción y prueba' },
    { id: 'como-te-la-intentan-colar', label: 'Patrones habituales de articulación' },
    { id: 'cronologia-prescripcion', label: 'Cronología (H1/H2)' },
    { id: 'distinguishing', label: 'Distinguishing' },
    { id: 'selector-escenarios', label: 'Selector de escenarios' },
    { id: 'plan-a', label: 'Plan A' },
    { id: 'plan-b', label: 'Plan B' },
    { id: 'guion-2-min', label: 'Guion 2 min' },
    { id: 'checklist-24-72', label: 'Checklist 24–72h' },
    { id: 'plantillas', label: 'Plantillas' },
    { id: 'errores-fatales', label: 'Errores críticos' },
  ],
} as const;
