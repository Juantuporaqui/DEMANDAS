import { alegacionesComplementarias, hechosControvertidos } from '../audienciaPrevia';

export type ChecklistItem = {
  id: string;
  fase: 'SANEAMIENTO' | 'HECHOS' | 'PRUEBA' | 'CIERRE';
  titulo: string;
  fraseSala: string;
  pedir: string[];
  base: string[];
};

export type BloqueDefensa = {
  id: string;
  titulo: string;
  objetivo: string;
  mensajeSala: string; // 1 línea
  pedir: string[];
  fundamento: string[];
  prueba: string[];
  contraataques: string[];
  planB: string[];
};

export const PICASSENT_AP = {
  // Sección 0 — Guiones listos para copiar
  guiones: {
    s90: [
      'Señoría, antes de entrar al fondo, solicitamos saneamiento y delimitación del objeto: la demanda mezcla división de cosa común con una reclamación económica histórica y heterogénea. Pedimos que se acote el objeto y se excluyan partidas impertinentes para evitar indefensión.',
      'Sostenemos la prescripción de todo lo anterior a 2019 (art. 1964.2 y 1969 CC), salvo interrupción fehaciente, que no consta. Y advertimos que la STS 458/2025 no puede usarse como “barra libre”: su lógica exige convivencia patrimonial normal y vivienda familiar; aquí el bien controvertido no es vivienda habitual sino inversión, y además no procede convertir en imprescriptible una arqueología contable.',
      'La carga de la prueba corresponde a la actora (art. 217 LEC). Recortes, capturas y PDFs parciales de cuentas canceladas no acreditan trazabilidad ni autenticidad. Impugnamos la prueba digital si no viene acompañada de extractos íntegros/certificados.',
      'Para resolver de forma limpia: pedimos exhibición/oficios bancarios y, si persiste controversia, pericial contable con designación judicial (art. 339 LEC) para depurar origen/destino, evitar dobles cómputos y fijar saldo real.',
      'Y subsidiariamente, si se admitiera algún reembolso, solicitamos liquidación global con compensación de créditos y cargos correlativos para evitar enriquecimiento injusto.'
    ].join('\n\n'),

    m3: [
      '1) AP — SANEAMIENTO / OBJETO',
      'Señoría: la demanda es un cajón de sastre. Acumula división de cosa común con una reclamación económica masiva sin trazabilidad completa y con partidas de naturaleza distinta. Pedimos: (i) declarar indebida acumulación o, como mínimo, (ii) acotar el objeto por bloques y excluir lo ajeno/impertinente; y (iii) exigir concreción por partidas con soporte completo, evitando indefensión material.',
      '',
      '2) PRESCRIPCIÓN (pre-2019) + STS 458/2025 (neutralización)',
      'Pedimos que se estime la prescripción de todo lo anterior a 2019 (1964.2/1969 CC). La STS 458/2025 desplaza el dies a quo al divorcio/separación de hecho SOLO cuando existe convivencia patrimonial normal y se trata de pagos ligados a la vida familiar (vivienda familiar) donde no es razonable litigar “dentro” del matrimonio.',
      'Aquí hay diferencias: (a) el inmueble no fue vivienda habitual sino inversión/uso económico; (b) no hay “normalidad” de cargas familiares asociada a esa vivienda; (c) lo reclamado es arqueología contable con selección interesada de movimientos y sin exhibición íntegra de cuentas. Por tanto, rige la regla general: cada pago hace nacer la acción y prescribe a los 5 años si no se interrumpe.',
      'Subsidiario: si el juzgado quiere aplicar STS 458/2025, exigimos prueba reforzada de (i) origen privativo de fondos, (ii) inexistencia de caudal común, (iii) destino real, y (iv) ausencia de convivencia patrimonial “normal”. Sin eso, no hay base para reembolso.',
      '',
      '3) CARGA PROBATORIA + PRUEBA DIGITAL',
      'Art. 217 LEC: no puedo probar un negativo universal. Quien afirma pagos privativos y deuda ajena debe probarlo con documentación íntegra, no con capturas recortadas. Pedimos: aportación de extractos completos/certificados, y si hay disputa de integridad, pericial (contable y, si procede, informática).',
      '',
      '4) PRUEBA (LO QUE SE PIDE HOY)',
      '- Oficios a entidades bancarias para extractos íntegros de cuentas relevantes.',
      '- Exhibición de documentación que la actora dice tener (LEC 328–330).',
      '- Pericial contable con designación judicial (art. 339 LEC) con objeto: reconstrucción, trazabilidad y liquidación neta evitando dobles cómputos.',
      '',
      '5) MALA FE / ABUSO / INDEFENSIÓN (para credibilidad y para prueba)',
      'Invocamos art. 247 LEC y buena fe procesal: ocultación de cuentas/documentación, aportación sesgada, dilaciones. Esto no se pide como “castigo”, se usa para justificar rigor probatorio, oficios y pericial.',
      '',
      '6) COMPENSACIÓN / LIQUIDACIÓN GLOBAL (subsidiaria)',
      'Si se entra al fondo, pedimos liquidación global: lo que se reconozca debe compensarse con cargos y créditos correlativos acreditados, evitando enriquecimiento injusto.'
    ].join('\n'),

    m5: [
      'GUION 5–7 MIN (si el juez te deja desarrollar)',
      '',
      'A) Qué está en juego hoy (AP):',
      '— Saneamiento: depurar objeto y excepciones.',
      '— Fijar hechos controvertidos.',
      '— Proponer/admitir prueba: aquí se gana o se muere.',
      '',
      'B) Saneamiento / improcedencia / acotación:',
      'La demanda acumula pretensiones y partidas heterogéneas. Pedimos acotar el objeto por bloques y excluir lo impertinente, exigiendo concreción por partida + soporte completo. Esto no es formalismo: es defensa efectiva.',
      '',
      'C) Prescripción (pre-2019) y por qué STS 458/2025 no debe “barrer” aquí:',
      '1) Regla: 1964.2 y 1969 CC ⇒ cada pago genera acción exigible y prescribe a los 5 años si no hay interrupción.',
      '2) STS 458/2025 desplaza dies a quo al divorcio/separación de hecho cuando hay convivencia patrimonial normal y pagos ligados a vida familiar (vivienda familiar) donde no es razonable litigar dentro del matrimonio.',
      '3) Distinción del caso: no vivienda habitual sino inversión/uso económico; no normalidad; arqueología contable; selección sesgada; ausencia de exhibición íntegra.',
      '4) Subsidiario: si se aplicara STS 458/2025, exigir prueba reforzada de origen privativo + inexistencia de caudal común + destino real; sin eso no hay reembolso.',
      '',
      'D) Carga de la prueba / prueba digital:',
      'Art. 217 LEC: la actora debe probar hechos constitutivos. Capturas recortadas o PDFs parciales no acreditan trazabilidad ni autenticidad. Pedimos impugnación y exigimos extracto íntegro/certificado, y pericial si hay controversia.',
      '',
      'E) Prueba concreta que solicitamos hoy:',
      '— Oficios bancarios / certificaciones.',
      '— Exhibición documental (LEC 328–330).',
      '— Pericial contable con designación judicial (art. 339 LEC) con términos claros.',
      '',
      'F) Mala fe / abuso / indefensión:',
      'Art. 247 LEC: aportación sesgada, ocultación de cuentas y documentación, dilación. Se invoca para reforzar rigor probatorio y necesidad de pericial/oficios.',
      '',
      'G) Cierre:',
      'Primero: prescripción + acotación. Si el juzgado entra al fondo: liquidación neta, no por recortes; con pericial y compensación global para evitar enriquecimiento injusto.'
    ].join('\n')
  },

  // Sección 1 — Checklist por fases (persistente en UI)
  checklist: [
    {
      id: 'saneamiento_objeto',
      fase: 'SANEAMIENTO',
      titulo: 'Acotar objeto / indebida acumulación (o depuración por bloques)',
      fraseSala: 'Señoría, solicitamos depuración del objeto: acotar por bloques y excluir partidas impertinentes para evitar indefensión.',
      pedir: [
        'Que se delimite el objeto litigioso por bloques (división cosa común vs. reclamación económica) y se excluya lo ajeno/impertinente.',
        'Que se exija a la actora concreción por partida + soporte íntegro (no recortes).'
      ],
      base: [
        'LEC 71–73 (acumulación objetiva) + saneamiento en AP (LEC 414–430).',
        'Art. 24 CE (defensa efectiva) como principio rector.'
      ]
    },
    {
      id: 'prescripcion_pre2019',
      fase: 'SANEAMIENTO',
      titulo: 'Prescripción pre-2019 + neutralizar STS 458/2025',
      fraseSala: 'Pedimos que se declare prescrita toda partida anterior a 2019: 1964.2/1969 CC; STS 458/2025 no aplica a inversión/no vivienda habitual ni a arqueología contable sin exhibición íntegra.',
      pedir: [
        'Que se estime la prescripción de todo lo anterior a 2019 salvo interrupción fehaciente acreditada por la actora.',
        'Subsidiario: si se aplica STS 458/2025, exigir prueba reforzada de origen privativo, inexistencia de caudal común y destino real.'
      ],
      base: [
        'CC 1964.2 y 1969 (dies a quo).',
        'STS 458/2025 (dies a quo divorcio/separación de hecho solo con convivencia patrimonial normal y vivienda familiar).'
      ]
    },
    {
      id: 'hechos_controvertidos',
      fase: 'HECHOS',
      titulo: 'Fijar hechos controvertidos (lista operativa)',
      fraseSala: 'Solicito que se tengan por controvertidos (y se fijen expresamente) los hechos nucleares sobre cuentas, origen/destino de fondos, y trazabilidad de partidas.',
      pedir: [
        'Que se incluyan como hechos controvertidos los relativos a: cuentas comunes, retiradas (32k/38.5k), destino real de préstamos/hipoteca, y autenticidad de extractos/capturas.',
        'Que se haga constar que la carga de probarlos recae en quien los afirma.'
      ],
      base: ['LEC 426 (fijación hechos controvertidos).', 'LEC 217 (carga de la prueba).']
    },
    {
      id: 'prueba_documental',
      fase: 'PRUEBA',
      titulo: 'Exigir extractos íntegros/certificados + exhibición',
      fraseSala: 'Impugnamos la prueba parcial: pedimos extractos íntegros/certificados y exhibición de documentación bancaria completa.',
      pedir: [
        'Oficio a entidades bancarias para extractos íntegros/certificados de cuentas relevantes.',
        'Exhibición de documentación completa que la actora dice tener (LEC 328–330).'
      ],
      base: ['LEC 299.2 (documentos electrónicos).', 'LEC 328–330 (exhibición).']
    },
    {
      id: 'pericial_contable_judicial',
      fase: 'PRUEBA',
      titulo: 'Pericial contable con designación judicial (términos claros)',
      fraseSala: 'Si hay controversia contable, solicitamos pericial contable judicial (art. 339 LEC) para reconstrucción y liquidación neta.',
      pedir: [
        'Designación judicial de perito contable (insaculación), o admisión de pericial con posibilidad de designación judicial si hay discrepancia.',
        'Objeto pericia: reconstruir movimientos, origen/destino, evitar dobles cómputos, y calcular saldo neto por periodos (con módulo prescripción).'
      ],
      base: ['LEC 339 y ss. (pericial).', 'Principio de tutela judicial efectiva (art. 24 CE).']
    },
    {
      id: 'cierre_liquidacion_neta',
      fase: 'CIERRE',
      titulo: 'Cierre: liquidación neta + compensación global',
      fraseSala: 'Si el juzgado entra al fondo: que sea liquidación neta con compensación global y no por recortes aislados, para evitar enriquecimiento injusto.',
      pedir: [
        'Que cualquier suma se determine de forma neta tras depuración completa (no por pantallazos).',
        'Que se tome en cuenta la compensación de créditos/cargos correlativos acreditados.'
      ],
      base: ['CC 1195–1202 (compensación, como esquema de cierre).', 'Art. 7 CC (abuso/enriquecimiento como principio).']
    }
  ] as ChecklistItem[],

  // Sección 2 — Bloques de defensa / ataque (los 7 tuyos, desarrollados para sala)
  bloques: [
    {
      id: 'improcedencia',
      titulo: '1) IMPROCEDENCIA / DEPURACIÓN DEL OBJETO (acumulación y “cajón de sastre”)',
      objetivo: 'Evitar que el pleito sea un vertedero de partidas: forzar acotación por bloques y excluir lo impertinente.',
      mensajeSala: 'Señoría, esto no puede tramitarse como arqueología contable sin depurar objeto: pedimos acotar por bloques y excluir partidas ajenas/impertinentes.',
      pedir: [
        'Depuración del objeto en AP: separación funcional por bloques y exclusión de partidas no conectadas.',
        'Exigir concreción por partida: fecha, cuenta, ordenante, justificante íntegro.'
      ],
      fundamento: [
        'LEC 71–73 (acumulación objetiva) + AP como fase de saneamiento (LEC 414–430).',
        'Art. 24 CE (defensa efectiva): sin concreción no hay contradicción real.'
      ],
      prueba: [
        'Estructura de la demanda: volumen masivo + anexos; señalamiento de “recortes/capturas” como soporte.',
        'Contradicciones internas (si existen) entre cuantías, cuentas y fechas.'
      ],
      contraataques: [
        'La actora dirá: “todo está conectado”. Respuesta: conexión no sustituye trazabilidad; y la defensa exige depurar por bloques y excluir lo impertinente.',
        'La actora dirá: “ya está detallado”. Respuesta: detallar no es aportar extracto íntegro/certificado ni acreditar ordenante y destino.'
      ],
      planB: [
        'Si el juez no excluye acciones: pedir al menos concreción y ordenar que la prueba sea íntegra (extractos completos + oficios).'
      ]
    },
    {
      id: 'prescripcion',
      titulo: '2) PRESCRIPCIÓN pre-2019 + ANTÍDOTO STS 458/2025 (vivienda no habitual / inversión)',
      objetivo: 'Blindar prescripción pre-2019 y evitar que STS 458/2025 la convierta en imprescriptible.',
      mensajeSala: 'Prescripción pre-2019 por 1964.2/1969 CC; STS 458/2025 no aplica a inversión/no vivienda habitual ni a arqueología contable sin convivencia patrimonial normal.',
      pedir: [
        'Que se declare prescrita cualquier partida anterior a 2019 salvo interrupción fehaciente probada por la actora.',
        'Subsidiario: si se pretende STS 458/2025, exigir prueba reforzada de “convivencia patrimonial normal”, vivienda familiar y fondos privativos.'
      ],
      fundamento: [
        'CC 1964.2 (5 años) + CC 1969 (dies a quo).',
        'STS 458/2025: el dies a quo se desplaza a divorcio/separación de hecho cuando hay convivencia patrimonial normal y pagos vinculados a vivienda familiar.'
      ],
      prueba: [
        'Acreditar que NO era vivienda habitual: domicilio familiar distinto, uso/inversión del inmueble, ausencia de “unidad familiar” allí.',
        'Acreditar que la actora podía ejercitar acciones antes: inexistencia de convivencia patrimonial normal respecto de ese bien.',
        'Acreditar selección sesgada de movimientos: pedir extractos íntegros y oficios.'
      ],
      contraataques: [
        '“STS 458/2025 dice que no prescribe hasta divorcio”: Respuesta: esa doctrina presupone convivencia normal y vivienda familiar. Si el bien es inversión/segundo inmueble y no hay normalidad, rige regla general.',
        '“No se puede reclamar dentro del matrimonio”: Respuesta: precisamente, aquí no era “vida familiar” sobre ese bien; y además se exige prueba íntegra (no pantallazos).'
      ],
      planB: [
        'Si el juez quiere aplicar STS 458/2025: convertirlo en requisito probatorio duro (fondos privativos + inexistencia caudal común + destino real). Sin eso, no hay reembolso.'
      ]
    },
    {
      id: 'mala_fe',
      titulo: '3) MALA FE / ABUSO / ENRIQUECIMIENTO (para credibilidad y rigor probatorio)',
      objetivo: 'Atacar credibilidad y justificar pericial/oficios por aportación sesgada u ocultación.',
      mensajeSala: 'Invoco art. 247 LEC: aportación sesgada/ocultación no puede rebajar el estándar probatorio; al contrario, exige prueba íntegra y pericial.',
      pedir: [
        'Que se valore mala fe procesal (247 LEC) a efectos de rigor en admisión y valoración de prueba.',
        'Que no se admitan “recortes” sin soporte completo; que se ordenen oficios/exhibición.'
      ],
      fundamento: [
        'LEC 247 (buena fe procesal).',
        'Art. 7 CC (abuso de derecho como principio).'
      ],
      prueba: [
        'Comparativa de extractos vs capturas; detección de recortes.',
        'Requerimientos judiciales previos (si existieron) y su cumplimiento/incumplimiento.'
      ],
      contraataques: [
        '“Son solo valoraciones”: Respuesta: no pedimos sanción, pedimos método: si hay sesgo, se exige prueba íntegra y pericial.',
        '“No tengo más documentación”: Respuesta: entonces procede oficio bancario/exhibición; sin eso no se acredita.'
      ],
      planB: [
        'Si el juez no entra a mala fe: insistir en que la prueba parcial no cumple trazabilidad; pedir oficios y pericial igual.'
      ]
    },
    {
      id: 'compensacion',
      titulo: '4) COMPENSACIÓN / LIQUIDACIÓN GLOBAL (si el juez entra al fondo)',
      objetivo: 'Evitar condena “por piezas”: forzar liquidación neta y compensación global de cargos/créditos.',
      mensajeSala: 'Si se entra al fondo, que sea liquidación neta: lo que se reconozca debe compensarse con cargos/créditos correlativos para evitar enriquecimiento injusto.',
      pedir: [
        'Que cualquier cifra se determine tras depuración completa y saldo neto (no por recortes aislados).',
        'Que se tengan en cuenta créditos/cargos correlativos acreditados (IBIs, gastos, retiradas, pagos directos, etc.) en una liquidación global.'
      ],
      fundamento: [
        'CC 1195–1202 (compensación como esquema civil).',
        'Principio anti enriquecimiento injusto.'
      ],
      prueba: [
        'Retiradas de fondos (32k/38.5k) y cualquier pago directo acreditable (IBI, comunidad, etc.).',
        'Documental bancaria y recibos originales.'
      ],
      contraataques: [
        '“Eso es otra demanda”: Respuesta: no pedimos reconvención ex novo; pedimos liquidación neta y evitar doble cómputo.',
        '“No es líquido”: Respuesta: por eso pedimos pericial contable y depuración, no condena por pantallazos.'
      ],
      planB: [
        'Si el juez no lo trata como compensación: mantenerlo como criterio contable de depuración + reserva de acciones.'
      ]
    },
    {
      id: 'indefension',
      titulo: '5) INDEFENSIÓN PRÁCTICA (1000 folios + ocultación → pedir método y prueba íntegra)',
      objetivo: 'Convertir el problema (volumen/ocultación) en una ventaja: justificar oficios/pericial/impugnación de prueba parcial.',
      mensajeSala: 'No se puede exigir defensa efectiva con arqueología contable parcial: si la actora no aporta íntegro, procede oficio/pericial y excluir recortes.',
      pedir: [
        'Que se impida sorpresa/indefensión: no admitir nuevosÚM “recortes” sin soporte íntegro.',
        'Que se acuerde oficio a bancos / exhibición para reconstrucción completa.'
      ],
      fundamento: [
        'Art. 24 CE (tutela y defensa).',
        'LEC 265/270 (aportación documental y preclusión, como marco de orden).'
      ],
      prueba: [
        'Volumen y estructura de la demanda, anexos y falta de extractos íntegros.',
        'Cuentas canceladas / acceso limitado: necesidad de oficios.'
      ],
      contraataques: [
        '“Tuviste 20 días”: Respuesta: el plazo no convierte recortes en prueba válida; la solución es método: extracto íntegro y pericial.',
        '“Es irrelevante”: Respuesta: si el soporte es parcial/manipulable, la controversia es precisamente probatoria.'
      ],
      planB: [
        'Si el juez no compra “indefensión”: insistir en carga probatoria 217 LEC + impugnación de prueba digital.'
      ]
    },
    {
      id: 'carga_probatoria',
      titulo: '6) CARGA PROBATORIA DEMANDANTE + IMPUGNACIÓN PRUEBA DIGITAL (capturas ≠ trazabilidad)',
      objetivo: 'Evitar inversión de la carga: quien afirma pagos privativos y deuda debe probar con extractos íntegros/certificados.',
      mensajeSala: 'Art. 217 LEC: la actora debe probar hechos constitutivos; capturas recortadas no acreditan ordenante, cuenta ni destino sin extracto íntegro/certificado.',
      pedir: [
        'Impugnar prueba digital parcial y exigir soporte íntegro/certificado.',
        'Oficios bancarios y/o pericial si se discute integridad.'
      ],
      fundamento: [
        'LEC 217 (carga de la prueba).',
        'LEC 299.2 (documentos electrónicos) + necesidad de integridad/autenticidad.'
      ],
      prueba: [
        'Comparativa: captura vs extracto completo (si existe).',
        'Solicitar certificación bancaria (origen/destino, titularidad, ordenante).'
      ],
      contraataques: [
        '“Es un PDF del banco”: Respuesta: que sea íntegro/certificado y completo; un recorte no permite contradicción.',
        '“No hay más”: Respuesta: entonces procede oficio bancario; sin eso no se acredita.'
      ],
      planB: [
        'Si el juez admite la documental: pedir que su fuerza probatoria quede condicionada a corroboración por oficio/pericial.'
      ]
    },
    {
      id: 'pericial',
      titulo: '7) SOLICITAR PERICIAL CONTABLE JUDICIAL (si se admite trámite / si hay controversia)',
      objetivo: 'Cerrar la puerta a la condena por pantallazos y abrir la vía “método”: reconstrucción y saldo neto.',
      mensajeSala: 'Para depurar esto con garantías: pericial contable judicial (art. 339 LEC) con términos de referencia y módulo prescripción.',
      pedir: [
        'Designación judicial de perito contable (insaculación) o, al menos, admisión de pericial contable y posibilidad de perito judicial si hay discrepancia.',
        'Términos de referencia: (i) identificar cuentas relevantes; (ii) reconstruir movimientos; (iii) determinar origen (privativo/común) y destino; (iv) detectar dobles cómputos; (v) calcular saldo neto; (vi) segmentar por periodos con prescripción.'
      ],
      fundamento: [
        'LEC 339 y ss. (pericial).',
        'Necesidad de conocimiento técnico cuando el debate es contable/bancario.'
      ],
      prueba: [
        'Complejidad bancaria + cuentas canceladas + aportación parcial.',
        'Hechos controvertidos centrados en trazabilidad.'
      ],
      contraataques: [
        '“No hace falta perito”: Respuesta: sí hace falta si se pretende condena por arqueología contable parcial; el método correcto es pericial.',
        '“Ya hay perito de parte”: Respuesta: pedir tacha/neutralidad y perito judicial si hay vínculo o sesgo.'
      ],
      planB: [
        'Si el juez no designa judicial: al menos admisión de pericial de parte y oficios para que el perito trabaje con datos íntegros.'
      ]
    }
  ] as BloqueDefensa[],

  // Sección 3 — lo que ya existía en /analytics/audiencia (sin perderlo)
  hechosControvertidos,
  alegacionesComplementarias
};
