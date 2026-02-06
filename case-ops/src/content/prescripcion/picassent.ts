export const prescripcionPicassent = {
  meta: {
    title: 'Prescripción — P.O. 715/2024 (Picassent)',
    slug: 'prescripcion',
    caseId: 'picassent',
    caseCode: 'CAS001',
    status: 'ACTIVO',
    cuantia: '212.677,00 €',
    audienciaPrevia: '10/03/2026 09:45',
    version: 'v2.0 PRO (web)',
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
      'Enfoque: distinguir nuestro caso del supuesto de hecho de la STS 458/2025 por 4 vías: naturaleza del préstamo, ausencia de desequilibrio, retraso desleal y herramienta procesal.',
    frasesTitle: 'Los 4 argumentos (en orden de fuerza):',
    frases: [
      '"ARG 1 (9/10) — NEGOCIO, NO VIVIENDA: El préstamo financió parcelas para construir y vender chalets. Cuando el mercado cayó, se alquiló y Airbnb. Nunca fue domicilio familiar. La STS 458/2025 protege la vivienda habitual, no un negocio inmobiliario especulativo. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni siquiera la hipoteca de la casa familiar es carga del matrimonio."',
      '"ARG 2 (8/10) — SIN DESEQUILIBRIO: La STS 458/2025 requiere que los fondos procedieran casi exclusivamente de uno. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella puso más en hipoteca, Juan puso más en el resto. Economía integrada."',
      '"ARG 3 (7/10) — RETRASO DESLEAL (Verwirkung): Policía con máster en económicas, cotitular de ambas cuentas, 10+ años sin reclamar, sin compensar, sin documentar. Art. 7 CC + confianza legítima."',
      '"ARG 4 (6/10) — PROCESAL: Art. 426.4 LEC para introducir estos argumentos en AP como complemento de alegaciones por hecho jurídico nuevo (sentencia posterior a contestación). Solo como llave, nunca como argumento de fondo."',
    ],
    filtrosTitle: 'Diferencias fácticas clave vs. STS 458/2025:',
    filtros: [
      'STS: vivienda habitual → Nosotros: negocio inmobiliario / segunda residencia / Airbnb',
      'STS: cuenta nutrida casi exclusivamente por ella → Nosotros: 2 sueldos comparables, 2 cuentas conjuntas, 0 privativos',
      'STS: desequilibrio probado → Nosotros: ningún euro privativo identificable',
      'STS: hipoteca de domicilio = carga familiar implícita → Nosotros: inversión especulativa = comunidad ordinaria (392 CC)',
      'STS: cónyuge sin formación financiera / sin visibilidad → Nosotros: policía + máster económicas + cotitular + 0 reclamaciones en 10 años',
    ],
  },
  guion: {
    title: 'Guion de sala (2 minutos)',
    text:
      'Señoría, solicitamos depuración del objeto: la actora formula una reclamación global con hechos y pagos antiguos sin aportar, por bloques/partidas, fecha, concepto, documento, base jurídica, exigibilidad y, en su caso, actos interruptivos. Nuestra posición es técnica: (1) prescripción de lo exigible y no reclamado en plazo; (2) falta de prueba de un crédito exigible y vigente; y (3) subsidiariamente, si se menciona STS 458/2025, limitar estrictamente su alcance: decisión por bloques homogéneos con cuantía separada y motivación del dies a quo por bloque, sin extensión automática a gastos o inversiones.',
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
    { id: 'peticion-prioritaria', label: 'Petición prioritaria' },
    { id: 'regla-de-oro', label: 'Regla de oro' },
    { id: 'como-te-la-intentan-colar', label: 'Cómo te la intentan colar' },
    { id: 'selector-escenarios', label: 'Selector de escenarios' },
    { id: 'plan-a', label: 'Plan A' },
    { id: 'plan-b', label: 'Plan B' },
    { id: 'guion-2-min', label: 'Guion 2 min' },
    { id: 'checklist-24-72', label: 'Checklist 24–72h' },
    { id: 'plantillas', label: 'Plantillas' },
  ],
} as const;
