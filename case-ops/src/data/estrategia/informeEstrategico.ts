// ============================================
// INFORME ESTRATÉGICO - PICASSENT Y MISLATA
// Líneas de defensa, ataques, réplicas y preguntas
// ============================================

export type Procedimiento = 'picassent' | 'mislata' | 'quart';
export type TipoEstrategia = 'defensa' | 'ataque' | 'replica' | 'pregunta';
export type Prioridad = 'critica' | 'alta' | 'media' | 'baja';
export type Estado = 'pendiente' | 'preparado' | 'usado' | 'descartado';

export interface LineaEstrategica {
  id: string;
  procedimiento: Procedimiento;
  tipo: TipoEstrategia;
  titulo: string;
  descripcion: string;
  fundamento: string;
  prioridad: Prioridad;
  estado: Estado;
  articulosRelacionados: string[];
  documentosSoporte: string[];
  frasesClave: string[];
  riesgos?: string;
  notasInternas?: string;
}

// ============================================
// ESTRATEGIA PICASSENT (DEMANDADO)
// ============================================

export const estrategiaPicassent: LineaEstrategica[] = [
  // DEFENSAS
  {
    id: 'pic-def-1',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'PRESCRIPCIÓN RADICAL',
    descripcion: 'El 70% de las reclamaciones está prescrito. Hechos de 2006, 2008, 2014 superan cualquier plazo.',
    fundamento: 'Art. 1964 CC (5 años) + DT 5ª Ley 42/2015 (máximo 7/10/2020 para acciones anteriores a 2015)',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['art. 1964 CC', 'art. 1969 CC', 'DT 5ª Ley 42/2015'],
    documentosSoporte: [],
    frasesClave: [
      '"Señoría, los pagos de 2006 y 2008 prescribieron hace años. No hay interrupción acreditada."',
      '"La DT 5ª Ley 42/2015 establece que acciones anteriores a 2015 prescribieron el 7/10/2020 como máximo."',
    ],
    riesgos: 'Puede alegar que el matrimonio suspendía la prescripción (FALSO en separación de bienes)',
  },
  {
    id: 'pic-def-2',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'CARGAS DEL MATRIMONIO',
    descripcion: 'Las aportaciones a gastos comunes durante la convivencia son cargas del matrimonio, no préstamos.',
    fundamento: 'Art. 1438 CC - Contribución a cargas matrimoniales',
    prioridad: 'alta',
    estado: 'preparado',
    articulosRelacionados: ['art. 1438 CC', 'art. 1319 CC'],
    documentosSoporte: [],
    frasesClave: [
      '"Esto no fue un préstamo, fue una FAMILIA. Durante 15 años nadie llevaba cuentas."',
      '"Las aportaciones a gastos comunes se presumen realizadas en cumplimiento del deber de contribuir a las cargas del matrimonio."',
    ],
  },
  {
    id: 'pic-def-3',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'PRUEBA MANIPULADA',
    descripcion: 'Documentos 39, 41, 43, 45 están recortados. Ocultan información relevante.',
    fundamento: 'Art. 326 LEC - Valoración de documentos',
    prioridad: 'alta',
    estado: 'preparado',
    articulosRelacionados: ['art. 326 LEC', 'art. 319 LEC'],
    documentosSoporte: ['Doc. 39', 'Doc. 41', 'Doc. 43', 'Doc. 45'],
    frasesClave: [
      '"¿Por qué estos documentos están recortados? ¿Qué ocultan?"',
      '"Solicitamos que se aporten los documentos completos, no versiones editadas."',
    ],
    riesgos: 'Si aportan completos, ver qué información contenían',
  },
  {
    id: 'pic-def-4',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'DOC. 4 CONTRADICE LA DEMANDA',
    descripcion: 'Declaración de Vicenta a Hacienda contradice lo que dice en la demanda sobre sus aportaciones.',
    fundamento: 'Doctrina de los actos propios',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['Doctrina actos propios'],
    documentosSoporte: ['Doc. 4'],
    frasesClave: [
      '"En el Doc. 4, Vicenta declaró a Hacienda exactamente lo contrario de lo que ahora reclama."',
      '"No puede contradecir sus propias declaraciones fiscales cuando le conviene."',
    ],
  },
  {
    id: 'pic-def-5',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'DOBLE COBRO / ENRIQUECIMIENTO INJUSTO',
    descripcion:
      'La actora reclama reembolso del préstamo Y el 50% de los terrenos/chalet que se compraron con ese préstamo. Es doble cobro.',
    fundamento: 'Art. 1901 CC (cobro de lo indebido) + Doctrina enriquecimiento sin causa',
    prioridad: 'alta',
    estado: 'pendiente',
    articulosRelacionados: ['art. 1901 CC', 'art. 10 CC', 'Doctrina enriquecimiento sin causa'],
    documentosSoporte: ['Doc. 6'],
    frasesClave: [
      '"No se puede cobrar dos veces: el reembolso del préstamo Y la mitad del patrimonio que financió."',
      '"Si pretende el 50% de los terrenos, no puede además reclamar el 100% de las cuotas que financiaron esos terrenos."',
    ],
    riesgos: 'El juez puede considerar que son pretensiones independientes si la actora lo argumenta bien',
  },
  {
    id: 'pic-def-6',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'CONSECUENCIAS ADVERSAS DE DOCS INCOMPLETOS (Art. 329 LEC)',
    descripcion:
      'Los Docs 39, 41, 43, 45 están recortados. El Art. 329 LEC permite al tribunal tener por ciertos los hechos que la otra parte alegue si se aportan documentos incompletos.',
    fundamento: 'Art. 329 LEC - Deber de exhibición documental',
    prioridad: 'critica',
    estado: 'pendiente',
    articulosRelacionados: ['art. 329 LEC', 'art. 328 LEC'],
    documentosSoporte: ['Doc. 39', 'Doc. 41', 'Doc. 43', 'Doc. 45'],
    frasesClave: [
      '"Señoría, solicitamos que aplique el Art. 329 LEC: si la actora oculta información relevante en documentos recortados, el tribunal puede tener por ciertos los hechos que alegamos."',
      '"Pedimos diligencia final para que el banco aporte los extractos COMPLETOS (Art. 435 LEC)."',
    ],
  },
  {
    id: 'pic-def-7',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'COHERENCIA ECONÓMICA + TRAZABILIDAD (TEST DE CAPACIDAD DE AHORRO)',
    descripcion:
      'No es un reproche (“cómo vivió”). Es un argumento PROBATORIO: si la actora estima ingresos totales en convivencia ≈ 359.000 € y, aun así, sostiene una reclamación dineraria ≈ 212.677,08 € + pretende el 50% del patrimonio común, habiendo además existido retirada de líquido (38.500 €) y un pasivo hipotecario común que condiciona el activo (≈ 180.000 €), entonces la consecuencia procesal es OBLIGAR A TRAZABILIDAD: qué pagó, desde qué cuenta, con qué origen (privativo/común), y qué parte eran cargas familiares (no reembolsables). Esto se convierte en HECHOS CONTROVERTIDOS (art. 428 LEC) y en PRUEBA (art. 429 LEC) bajo carga de la actora (art. 217 LEC).',
    fundamento:
      'CUANTIFICACIÓN (marco de coherencia; no sustituye la prueba):\n' +
      '• Ingresos estimados actora durante convivencia: 359.000 € (estimación del demandado; se contrasta con AEAT/TGSS).\n' +
      '• Cuantía demanda (Picassent): 212.677,08 € (dato del caso /timeline).\n' +
      '• Retirada de líquido de cuentas: 38.500 € (dato corregido).\n' +
      '• Activo conjunto BRUTO estimado (referencial): 450.000 €.\n' +
      '• Pasivo hipotecario común (referencial): 180.000 €.\n' +
      '• Activo NETO estimado = 450.000 − 180.000 = 270.000 €.\n' +
      '• Mitad del neto = 135.000 € (si el tribunal opera en términos netos).\n' +
      '• “Exposición económica mínima” que resulta de sumar: 212.677,08 + 135.000 + 38.500 = 386.177,08 € (sin intereses/costas).\n' +
      '  (Si se discute sobre bruto: 212.677,08 + 225.000 + 38.500 = 476.177,08 €).\n\n' +
      'TRADUCCIÓN JURÍDICO-PROCESAL:\n' +
      '1) CARGA DE LA PRUEBA (art. 217 LEC): quien afirma pagos y origen privativo debe acreditarlo con extractos completos, nóminas/IRPF y trazabilidad.\n' +
      '2) CARGAS DEL MATRIMONIO (arts. 1318 y 1438 CC, y el régimen primario): lo destinado a sostenimiento familiar durante convivencia NO se presume préstamo. Reembolso exige prueba clara de “anticipo/credito” y no mera convivencia.\n' +
      '3) AUDIENCIA PREVIA: \n' +
      '   • art. 426 LEC: alegaciones complementarias SIN alterar pretensión: se introduce como criterio de depuración y necesidad de prueba.\n' +
      '   • art. 428 LEC: fijación de HECHOS controvertidos (ingresos reales actora; aportaciones reales; origen fondos; retiro 38.500; naturaleza de pagos: carga familiar vs inversión patrimonial).\n' +
      '   • art. 429 LEC: proposición de prueba: oficios AEAT/TGSS + banco (extractos completos) + pericial contable de reconstrucción de flujos.\n\n' +
      'PETICIÓN OPERATIVA (en sala): que el tribunal exija trazabilidad mínima y, si falta, valore la insuficiencia probatoria y limite la pretensión a lo efectivamente acreditado.',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: [
      'art. 217 LEC',
      'art. 426 LEC',
      'art. 428 LEC',
      'art. 429 LEC',
      'art. 1318 CC',
      'art. 1438 CC',
    ],
    documentosSoporte: [
      'AEAT (IRPF/retenciones actora)',
      'TGSS (vida laboral/bases)',
      'Bancos: extractos COMPLETOS (no recortes)',
      'Pericial contable (reconstrucción de flujos)',
      'Extracto/soporte retirada 38.500 €',
    ],
    frasesClave: [
      '“Señoría, esto no es un juicio moral: es un problema de CARGA DE LA PRUEBA. Si se afirma pago privativo, hay que traer trazabilidad completa (art. 217 LEC).”',
      '“Pedimos que se fijen como HECHOS CONTROVERTIDOS: ingresos reales, origen de fondos, retiro de 38.500 € y naturaleza de los pagos: cargas familiares vs inversión (art. 428 LEC).”',
      '“Y como PRUEBA: oficios a AEAT/TGSS y al banco para extractos completos, más pericial contable de flujos (art. 429 LEC).”',
      '“Lo que no esté trazado, no puede convertirse en condena: no hay presunción de préstamo en una convivencia/matrimonio; la carga es de quien reclama.”',
    ],
    riesgos:
      'Riesgo: que el juez intente cortar por “irrelevante”. Mitigación: enmarcarlo SIEMPRE como distribución de carga probatoria + delimitación de hechos controvertidos + necesidad de prueba objetiva (no como reproche personal).',
    notasInternas:
      'Usar como “palanca de prueba”: no discutir estilos de vida. Objetivo: obligar a AEAT/TGSS/banco + pericial contable y, si no hay trazabilidad, pedir que se limite la reclamación a lo efectivamente acreditado.',
  },
  {
    id: 'pic-def-8',
    procedimiento: 'picassent',
    tipo: 'defensa',
    titulo: 'PRÉSTAMO KUTXA 22/08/2006: SOLIDARIDAD, GARANTÍA PRIVATIVA, TASACIÓN/LTV Y TRAZABILIDAD',
    descripcion:
      'Esta escritura (Kutxa, 22/08/2006) es un “ancla de hechos duros”: (1) Vicenta figura como DEUDORA aunque no hipotecante, (2) existe responsabilidad SOLIDARIA, (3) la garantía real recae sobre vivienda PRIVATIVA del demandado, y (4) el principal financiado (310.000 €) es coherente con un LTV prudencial cercano al 80% respecto del valor de referencia (387.960,24 €) reflejado en la propia escritura. Consecuencia procesal: lo que la actora llame “aportación” debe depurarse, porque pagar cuotas en una deuda propia/solidaria NO es inversión privativa salvo exceso acreditado; y el destino real de fondos exige trazabilidad (oficio bancario + pericial contable).',
    fundamento:
      'CITAS LITERALES (escritura Kutxa 22/08/2006; fragmentos exactos):\n' +
      '• “PARTE DEUDORA-HIPOTECANTE: DON JUAN RODRÍGUEZ CRESPO.”\n' +
      '• “PARTE DEUDORA-NO HIPOTECANTE: DOÑA VICENTA JIMÉNEZ VERA.”\n' +
      '• “Kutxa entrega… la suma de TRESCIENTOS DIEZ MIL EUROS (310.000,00 €).”\n' +
      '• “Los prestatarios responden solidariamente del cumplimiento de las obligaciones dimanantes de este contrato.”\n' +
      '• “Pertenece a DON JUAN RODRÍGUEZ CRESPO, en pleno dominio, con carácter privativo…” (título: Auto 10/10/2000).\n' +
      '• “tasan los interesados la finca hipotecada en… (387.960,24 €).”\n' +
      '• “extendido en quince folios… el presente y sus catorce anteriores…” (integridad: si solo se aportan 5 páginas, es recorte material).\n' +
      '• “La parte prestataria domicilia el pago… en la cuenta número 2101060471001178701 de Kutxa.”\n\n' +
      'CUANTIFICACIÓN (objetiva, verificable):\n' +
      '• Fecha escritura: 22/08/2006.\n' +
      '• Principal: 310.000,00 €.\n' +
      '• Valor de referencia en escritura para ejecución/subasta: 387.960,24 €.\n' +
      '• LTV = 310.000 / 387.960,24 = 0,799051 → 79,905%.\n' +
      '  (Conclusión prudencial: ratio alineada con el estándar habitual ~80% en vivienda; no se afirma como absoluto, pero sí como coherencia financiera).\n\n' +
      'LÍNEAS DE DEFENSA (material + procesal):\n' +
      '1) PAGO DE DEUDA PROPIA (solidaridad): Si la actora pagó cuotas/recibos del préstamo, en principio estaba cumpliendo obligación propia frente a Kutxa. No puede presentarse automáticamente como “aportación privativa al patrimonio del demandado”. Solo cabría, en su caso, un DERECHO DE REGRESO por exceso de pago sobre su parte (art. 1145 CC), y siempre acreditado pago a pago.\n' +
      '2) GARANTÍA PRIVATIVA = APORTACIÓN ESTRUCTURAL DEL DEMANDADO: La financiación se obtiene gravando una vivienda privativa del demandado. La actora no aporta garantía real; su relato de “yo puse el dinero” debe confrontarse con el hecho de que el colateral y el riesgo patrimonial privativo lo soporta el demandado.\n' +
      '3) DESTINO DE FONDOS: la vivienda ya era privativa (Auto 2000), por tanto el préstamo 2006 no financia la compra de esa casa. El destino real (parcelas/obra/inversión u otros) se acredita con trazabilidad bancaria (disposiciones, transferencias a terceros, recibos, movimientos de la cuenta domiciliada).\n' +
      '4) INTEGRIDAD DOCUMENTAL: si la actora aportó “solo 5 páginas”, existe riesgo de sesgo por selección. Debe exigirse copia íntegra/testimonio completo y anexos (incluida tasación Tinsa si existe) para contradicción plena.\n\n' +
      'AUDIENCIA PREVIA (palanca limpia):\n' +
      '• art. 426 LEC: alegación complementaria: “esto no es juicio moral, es depuración probatoria”.\n' +
      '• art. 428 LEC: HECHOS CONTROVERTIDOS a fijar: (i) condición deudora de actora, (ii) solidaridad, (iii) carácter privativo del inmueble y su aportación como garantía, (iv) ratio LTV coherente ~80%, (v) integridad documental, (vi) destino y trazabilidad de fondos.\n' +
      '• art. 429 LEC: PRUEBA: oficio a entidad/archivo (histórico préstamo, disposiciones, cuadro amortización, recibos), extractos completos de la cuenta domiciliada, y pericial contable de reconstrucción de flujos.\n\n' +
      'NOTA TÉCNICA (para blindar): el valor 387.960,24 € consta en escritura como tipo/valor a efectos de ejecución; adicionalmente puede existir tasación formal de Tinsa. Usar ambos como coherencia financiera/LTV, sin convertirlo en “verdad absoluta”, y centrar el tiro en la TRazabilidad bancaria.',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: [
      'art. 217 LEC',
      'art. 426 LEC',
      'art. 428 LEC',
      'art. 429 LEC',
      'art. 1145 CC',
      'Ley 2/1981 art. 5 (referencia LTV 60/80)',
    ],
    documentosSoporte: [
      'Escritura Kutxa 22/08/2006 (COPIA ÍNTEGRA + anexos)',
      'Tasación Tinsa (si consta/si se aporta)',
      'Oficio Kutxa: histórico préstamo 25.1863109.4 (disposiciones, cuadro amortización, recibos)',
      'Oficio Kutxa: extractos COMPLETOS cuenta domiciliada 2101060471001178701',
      'Pericial contable: reconstrucción de flujos (disposición → pagos → destino)',
    ],
    frasesClave: [
      '“Señoría, esto no es un juicio moral: la actora es DEUDORA y existe SOLIDARIDAD. Pagar cuotas no es aportación privativa; como mucho, regreso por exceso probado (art. 1145 CC).”',
      '“La garantía real recae sobre vivienda privativa del demandado: la financiación se obtuvo con su riesgo patrimonial, lo que obliga a depurar el relato de aportaciones.”',
      '“Pedimos fijar como HECHOS CONTROVERTIDOS la condición deudora, la solidaridad, el carácter privativo del bien hipotecado y el destino real de los fondos.”',
      '“Solicitamos PRUEBA objetiva: oficio bancario (histórico y extractos completos de la cuenta domiciliada) y pericial contable. Lo no trazado no puede convertirse en condena.”',
    ],
    riesgos:
      'Riesgo: que intenten desviar con “irrelevante” o “solo tipo subasta”. Mitigación: (i) el núcleo es solidaridad + deuda propia + trazabilidad; (ii) el LTV es solo coherencia prudencial, no dogma; (iii) pedir oficio y pericial para destino real de fondos.',
    notasInternas:
      'No discutir “cómo vivió”. Enmarcar como: (1) calificación jurídica de pagos (deuda propia), (2) asimetría de garantía privativa, (3) integridad documental, (4) trazabilidad bancaria obligatoria.',
  },

  // ATAQUES
  {
    id: 'pic-atk-1',
    procedimiento: 'picassent',
    tipo: 'ataque',
    titulo: 'FALTA DE PRUEBA DE PAGOS',
    descripcion: 'Vicenta no acredita fehacientemente los pagos que dice haber realizado desde su cuenta.',
    fundamento: 'Art. 217 LEC - Carga de la prueba',
    prioridad: 'media',
    estado: 'preparado',
    articulosRelacionados: ['art. 217 LEC'],
    documentosSoporte: [],
    frasesClave: [
      '"¿Dónde están los extractos de su cuenta personal acreditando esos pagos?"',
    ],
  },
  {
    id: 'pic-atk-2',
    procedimiento: 'picassent',
    tipo: 'ataque',
    titulo: 'DILIGENCIA FINAL — EXTRACTOS COMPLETOS DEL BANCO',
    descripcion:
      'Solicitar al banco los extractos completos de las transferencias donde se recortó el ordenante. Art. 435 LEC.',
    fundamento: 'Art. 435 LEC - Diligencias finales',
    prioridad: 'alta',
    estado: 'pendiente',
    articulosRelacionados: ['art. 435 LEC'],
    documentosSoporte: [],
    frasesClave: [
      '"Solicitamos como diligencia final que se oficie al banco para que aporte los extractos completos de las operaciones correspondientes a los Docs 39, 41, 43 y 45."',
    ],
  },

  // PREGUNTAS PARA INTERROGATORIO
  {
    id: 'pic-preg-1',
    procedimiento: 'picassent',
    tipo: 'pregunta',
    titulo: 'Sobre declaración a Hacienda',
    descripcion: 'Preguntar por la contradicción entre Doc. 4 y la demanda',
    fundamento: 'Interrogatorio de parte',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['art. 301 LEC'],
    documentosSoporte: ['Doc. 4'],
    frasesClave: [
      '"¿Reconoce su firma en este documento presentado a Hacienda?"',
      '"¿Por qué declaró entonces algo distinto a lo que ahora reclama?"',
    ],
  },
  {
    id: 'pic-preg-2',
    procedimiento: 'picassent',
    tipo: 'pregunta',
    titulo: 'Sobre documentos recortados',
    descripcion: 'Preguntar por qué los documentos están incompletos',
    fundamento: 'Interrogatorio de parte',
    prioridad: 'alta',
    estado: 'preparado',
    articulosRelacionados: ['art. 301 LEC'],
    documentosSoporte: ['Docs. 39, 41, 43, 45'],
    frasesClave: [
      '"¿Por qué estos documentos aparecen recortados?"',
      '"¿Tiene usted las versiones completas?"',
    ],
  },
];

// ============================================
// ESTRATEGIA MISLATA (DEMANDANTE)
// ============================================

export const estrategiaMislata: LineaEstrategica[] = [
  // ATAQUES (somos demandantes)
  {
    id: 'mis-atk-1',
    procedimiento: 'mislata',
    tipo: 'ataque',
    titulo: 'SOLIDARIDAD CONTRACTUAL',
    descripcion: 'Ambos firmaron como deudores solidarios. El art. 1145 CC da derecho de regreso.',
    fundamento: 'Art. 1145 CC - Acción de regreso del deudor solidario',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['art. 1145 CC', 'art. 1158 CC'],
    documentosSoporte: ['Escritura préstamo hipotecario'],
    frasesClave: [
      '"Ella firmó como deudora solidaria. El art. 1145 me da derecho a reclamarle su mitad."',
      '"Es una obligación contractual, no negociable."',
    ],
  },
  {
    id: 'mis-atk-2',
    procedimiento: 'mislata',
    tipo: 'ataque',
    titulo: 'CESE UNILATERAL DE PAGO',
    descripcion: 'Vicenta dejó de pagar unilateralmente desde agosto 2023.',
    fundamento: 'Art. 1091 CC - Fuerza de ley de los contratos',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['art. 1091 CC'],
    documentosSoporte: ['Doc. 3 - Extractos bancarios'],
    frasesClave: [
      '"Desde agosto 2023, no ha aportado un solo euro a la cuenta común."',
      '"Los extractos bancarios lo demuestran claramente."',
    ],
  },
  {
    id: 'mis-atk-3',
    procedimiento: 'mislata',
    tipo: 'ataque',
    titulo: 'CUANTÍA LÍQUIDA Y EXIGIBLE',
    descripcion: '7.119,98 € es una cantidad líquida, vencida y exigible.',
    fundamento: 'Art. 1145.2 CC',
    prioridad: 'alta',
    estado: 'preparado',
    articulosRelacionados: ['art. 1145.2 CC'],
    documentosSoporte: ['Doc. 3'],
    frasesClave: [
      '"La cantidad es líquida: 7.119,98 €. Las cuotas ya vencieron. Es exigible ahora."',
    ],
  },
  {
    id: 'mis-atk-4',
    procedimiento: 'mislata',
    tipo: 'ataque',
    titulo: 'INTERESES MORATORIOS',
    descripcion: 'Cada cuota impagada genera intereses desde su vencimiento. Art. 1108 CC.',
    fundamento: 'Art. 1108 CC - Intereses moratorios',
    prioridad: 'media',
    estado: 'pendiente',
    articulosRelacionados: ['art. 1108 CC', 'art. 1100 CC'],
    documentosSoporte: ['Doc. 3 - Extractos bancarios'],
    frasesClave: [
      '"Además del principal, reclamamos intereses moratorios desde el vencimiento de cada cuota impagada, conforme al Art. 1108 CC."',
    ],
  },

  // RÉPLICAS (contra argumentos de Vicenta)
  {
    id: 'mis-rep-1',
    procedimiento: 'mislata',
    tipo: 'replica',
    titulo: 'CONTRA LITISPENDENCIA',
    descripcion: 'Las cuotas de Mislata son POSTERIORES a Picassent. No hay identidad objetiva.',
    fundamento: 'STS 140/2012 - Triple identidad',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['art. 421 LEC', 'art. 410 LEC'],
    documentosSoporte: [],
    frasesClave: [
      '"Señoría, las cuotas que reclamo son POSTERIORES a la demanda de Picassent. No pueden estar allí porque no habían vencido."',
      '"La STS 140/2012 exige identidad TOTAL. Aquí falta la identidad objetiva."',
    ],
  },
  {
    id: 'mis-rep-2',
    procedimiento: 'mislata',
    tipo: 'replica',
    titulo: 'CONTRA PREJUDICIALIDAD',
    descripcion: 'El art. 43 LEC es facultativo ("podrá"), no obligatorio.',
    fundamento: 'Art. 43 LEC - Prejudicialidad civil',
    prioridad: 'critica',
    estado: 'preparado',
    articulosRelacionados: ['art. 43 LEC'],
    documentosSoporte: [],
    frasesClave: [
      '"El art. 43 LEC dice \'podrá\', no \'deberá\'. La suspensión es facultativa."',
      '"Mi crédito es líquido y exigible ahora. No necesito esperar a Picassent."',
    ],
  },
  {
    id: 'mis-rep-3',
    procedimiento: 'mislata',
    tipo: 'replica',
    titulo: 'CONTRA COMPENSACIÓN',
    descripcion: 'Su supuesto crédito de Picassent no es líquido ni exigible.',
    fundamento: 'Art. 1196 CC - Requisitos compensación',
    prioridad: 'alta',
    estado: 'preparado',
    articulosRelacionados: ['art. 1196 CC'],
    documentosSoporte: [],
    frasesClave: [
      '"El art. 1196 CC exige deudas líquidas y exigibles. Su crédito está en disputa, prescrito en su mayoría, y pendiente de sentencia."',
      '"No puede compensar un crédito CIERTO con uno DISPUTADO."',
    ],
  },
  {
    id: 'mis-rep-4',
    procedimiento: 'mislata',
    tipo: 'replica',
    titulo: 'CONTRA CONVENIO DIVORCIO',
    descripcion: 'El convenio habla de "gastos de vivienda", no de la hipoteca que es una DEUDA.',
    fundamento: 'Interpretación restrictiva de convenios',
    prioridad: 'alta',
    estado: 'preparado',
    articulosRelacionados: ['Sentencia divorcio 362/2023'],
    documentosSoporte: ['Convenio divorcio'],
    frasesClave: [
      '"El convenio habla de gastos de vivienda: IBI, luz, agua. La hipoteca es una DEUDA que ambos contrajimos. No es lo mismo."',
      '"Si quisieron incluir la hipoteca, debieron pactarlo expresamente."',
    ],
  },
  {
    id: 'mis-rep-5',
    procedimiento: 'mislata',
    tipo: 'replica',
    titulo: 'SUBSIDIARIO: MEDIDA CAUTELAR SI SUSPENSIÓN',
    descripcion:
      'Si el juez suspende por prejudicialidad, pedir medida cautelar: que Vicenta deposite el 50% de las cuotas que vayan venciendo.',
    fundamento: 'Art. 721 LEC - Medidas cautelares',
    prioridad: 'alta',
    estado: 'pendiente',
    articulosRelacionados: ['art. 721 LEC', 'art. 728 LEC'],
    documentosSoporte: [],
    frasesClave: [
      '"Señoría, si suspende el procedimiento, solicitamos medida cautelar: que la demandada deposite el 50% de las cuotas que vayan venciendo para evitar perjuicio irreparable."',
      '"El periculum in mora es evidente: cada mes que pasa, Juan paga el 100% y la deuda crece."',
    ],
    riesgos: 'El juez puede considerar que no hay periculum in mora suficiente',
  },
  {
    id: 'mis-atk-5',
    procedimiento: 'mislata',
    tipo: 'ataque',
    titulo: 'COSTAS POR TEMERIDAD',
    descripcion:
      'Solicitar condena en costas. Los argumentos de Vicenta son débiles (según nuestro análisis) y la deuda es líquida.',
    fundamento: 'Art. 394 LEC - Costas',
    prioridad: 'baja',
    estado: 'pendiente',
    articulosRelacionados: ['art. 394 LEC'],
    documentosSoporte: [],
    frasesClave: [
      '"Solicitamos condena en costas: la deuda es líquida, vencida y exigible, y la oposición carece de fundamento serio."',
    ],
  },
];

// ============================================
// FUNCIONES DE ACCESO
// ============================================

export function getEstrategiaPorProcedimiento(proc: Procedimiento): LineaEstrategica[] {
  if (proc === 'picassent') return estrategiaPicassent;
  if (proc === 'mislata') return estrategiaMislata;
  return [];
}

export function getEstrategiaPorTipo(proc: Procedimiento, tipo: TipoEstrategia): LineaEstrategica[] {
  const estrategia = getEstrategiaPorProcedimiento(proc);
  return estrategia.filter((e) => e.tipo === tipo);
}

export function getEstrategiaCritica(proc: Procedimiento): LineaEstrategica[] {
  const estrategia = getEstrategiaPorProcedimiento(proc);
  return estrategia.filter((e) => e.prioridad === 'critica');
}

export function getAllEstrategias(): LineaEstrategica[] {
  return [...estrategiaPicassent, ...estrategiaMislata];
}

export function buscarEstrategia(termino: string): LineaEstrategica[] {
  const t = termino.toLowerCase();
  return getAllEstrategias().filter(
    (e) =>
      e.titulo.toLowerCase().includes(t) ||
      e.descripcion.toLowerCase().includes(t) ||
      e.fundamento.toLowerCase().includes(t) ||
      e.frasesClave.some((f) => f.toLowerCase().includes(t))
  );
}
