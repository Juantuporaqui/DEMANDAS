// PGASEN — Dataset de inconcreciones (fuente de verdad)
// Copiar/usar tal cual. No inventar campos. Si algo no cuadra con tipos existentes, adapta SOLO la forma, no el contenido.

export type Severity = "P1" | "P2" | "P3";
export type SourceSide = "DEMANDA" | "CONTESTACION" | "DOC_RELACION";
export type IssueCategory =
  | "DEFECTO_LEGAL_416_1_5"
  | "PLUSPETICION"
  | "CRONOLOGIA"
  | "PETITUM_IMPRECISO"
  | "IMPORTES"
  | "PRUEBA_INCOMPLETA"
  | "OMISION"
  | "PREMISA_FALSA"
  | "DUPLICIDAD"
  | "PROCEDIMIENTO";

export type Issue = {
  id: string;
  severity: Severity;
  category: IssueCategory;
  topic:
    | "HIPOTECA"
    | "VEHICULOS"
    | "TRANSFERENCIAS"
    | "IBI"
    | "ARTUR_PIERA"
    | "MAQUINARIA"
    | "PROCEDIMIENTO"
    | "GENERAL";
  title: string;
  summary: string;
  demandRef?: string;
  responseRef?: string;
  quoteShort?: string;
  source: { side: SourceSide; docName: string; note?: string; docNumbers?: string[]; anchorLabel?: string; refId?: string };
  rebuttalOneLiner: string;
  apAsk: string;
  tags: string[];
  dateHint?: string;
  amountEUR?: number;
};

export const PGASEN_ISSUES: Issue[] = [
  {
    id: "I-011",
    severity: "P1",
    category: "DEFECTO_LEGAL_416_1_5",
    topic: "PROCEDIMIENTO",
    title:
      "Defecto legal: cuantía global y petitum por remisión al Hecho Cuarto sin cuadro aritmético completo por partidas",
    summary:
      "La demanda fija cuantía total y remite a conceptos del Hecho Cuarto, pero no aporta en el suplico una base aritmética cerrada por subpartidas.",
    demandRef:
      "Demanda: fundamento de cuantía + suplico con remisión a Hecho Cuarto",
    quoteShort:
      "“...cuantía... 212.677,08 euros...” / “...según conceptos del Hecho Cuarto...”",
    source: {
      side: "DEMANDA",
      docName: "Demanda_picassent_Transcrita.docx",
      anchorLabel: "Cuantía y suplico por remisión",
      refId: "demanda-hecho4-cuantia-suplico",
    },
    rebuttalOneLiner:
      "Sin desglose aritmético autosuficiente del petitum, el objeto no queda suficientemente determinado para contradicción plena.",
    apAsk:
      "Solicitar subsanación/clarificación en AP: cuadro por partidas, dies a quo y criterio de intereses por cada subpartida.",
    tags: ["HECHO_4", "PARTIDAS_H4", "defecto_legal", "cuantia"],
  },
  {
    id: "I-012",
    severity: "P1",
    category: "DEFECTO_LEGAL_416_1_5",
    topic: "PROCEDIMIENTO",
    title:
      "Defecto legal: mención de capitalización/intereses sin bases individualizadas ni dies a quo por subpartidas",
    summary:
      "Se identifica petición económica con referencia a intereses legales, pero no constan bases diferenciadas de cálculo temporal por cada concepto reclamado.",
    demandRef: "Demanda: suplico/intereses",
    quoteShort:
      "“...intereses legales...” sin desglose de base y fecha inicial por cada partida.",
    source: {
      side: "DEMANDA",
      docName: "Demanda_picassent_Transcrita.docx",
      anchorLabel: "Suplico e intereses legales",
      refId: "demanda-suplico-intereses",
    },
    rebuttalOneLiner:
      "Pedir intereses sin base/dies a quo por partida impide control de congruencia y defensa eficaz.",
    apAsk:
      "Requerir concreción de intereses por subpartida o, en su defecto, exclusión de pretensiones indeterminadas.",
    tags: ["HECHO_4", "PARTIDAS_H4", "defecto_legal", "intereses"],
  },
  {
    id: "I-001",
    severity: "P1",
    category: "PREMISA_FALSA",
    topic: "HIPOTECA",
    title: "La demanda llama ‘hipoteca de vivienda privativa del demandado’ a un préstamo solidario con destino común",
    summary:
      "Se construye el reembolso principal sobre una calificación (privativa/del demandado) incompatible con la firma solidaria y el destino a bienes comunes.",
    demandRef:
      "Demanda: Hecho Cuarto – ‘Cuotas… préstamo hipotecario de la vivienda privativa del demandado…’",
    quoteShort: "“...préstamo hipotecario de la vivienda privativa del demandado...” …",
    source: { side: "DEMANDA", docName: "Demanda_picassent_Transcrita.docx", docNumbers: ["24–27"] },
    rebuttalOneLiner:
      "Si el préstamo es solidario y para bienes comunes, no puede presentarse como ‘hipoteca del demandado’ para fabricar un crédito unilateral.",
    apAsk:
      "Que se depure como hecho controvertido la premisa ‘hipoteca privativa del demandado’ y se exija trazabilidad/justificación íntegra por periodos.",
    tags: ["hipoteca", "premisa_falsa", "cuentas_comunes", "HECHO_4", "PARTIDAS_H4"],
    dateHint: "2009-06-18 / 2009–2023",
  },
  {
    id: "I-002",
    severity: "P1",
    category: "DUPLICIDAD",
    topic: "HIPOTECA",
    title:
      "Duplicidad/pluspetición: reclama cuotas (punto 4) y además 50% de amortización de préstamo previo 33.959,19 (punto 9)",
    summary:
      "La contestación denuncia que reclamar ambos conceptos produce doble cobro y enriquecimiento injusto.",
    responseRef: "Contestación: ‘Duplicidad y reconocimiento de capital común’",
    quoteShort: "“...reclama... cuotas... y... además... 33.959,19 €... por duplicado...” …",
    source: { side: "CONTESTACION", docName: "Contestacion_picassent_transcrita.docx" },
    rebuttalOneLiner:
      "No es liquidación: es doble cómputo del mismo marco hipotecario (cuotas + amortización previa) para inflar saldo.",
    apAsk:
      "Que se obligue a la actora a un cuadro único de préstamo (origen→subrogación→destino→cuotas) y se excluya cualquier duplicidad.",
    tags: ["pluspeticion", "duplicidad", "hipoteca", "HECHO_4", "PARTIDAS_H4"],
  },
  {
    id: "I-003",
    severity: "P1",
    category: "PRUEBA_INCOMPLETA",
    topic: "TRANSFERENCIAS",
    title:
      "Atribución de pagos con capturas BBVA incompletas que ocultan el ordenante (‘Mostrar más’)",
    summary:
      "La contestación afirma que se oculta el verdadero ordenante y que se han pedido recibos del banco receptor.",
    responseRef:
      "Contestación: capturas incompletas docs demanda 39/41/43/45 + ‘Mostrar más’",
    quoteShort: "“...capturas... ocultando... ‘Mostrar más’... el verdadero ordenante...” …",
    source: {
      side: "CONTESTACION",
      docName: "Contestacion_picassent_transcrita.docx",
      docNumbers: ["25–26"],
    },
    rebuttalOneLiner:
      "Sin extractos íntegros y recibos certificables, esas capturas no sirven para fijar quién paga ni con qué fondos.",
    apAsk:
      "Impugnación documental; requerir extractos completos/recibos/ certificación del ordenante y cuenta de cargo.",
    tags: ["capturas", "bbva", "ordenante", "impugnacion", "HECHO_4", "PARTIDAS_H4"],
  },
  {
    id: "I-004",
    severity: "P2",
    category: "PRUEBA_INCOMPLETA",
    topic: "TRANSFERENCIAS",
    title:
      "Cancelación unilateral de la cuenta BBVA (julio 2024) tras generar capturas: dificulta verificación",
    summary:
      "La contestación sostiene que se canceló la cuenta para impedir verificación posterior en la app.",
    responseRef: "Contestación: cancelación unilateral julio 2024 + eliminación recibos app",
    quoteShort: "“...cancelado unilateralmente... en julio de 2024... dificultar la defensa...” …",
    source: {
      side: "CONTESTACION",
      docName: "Contestacion_picassent_transcrita.docx",
      docNumbers: ["11"],
    },
    rebuttalOneLiner:
      "Si se impide verificar, debe exigirse documental bancaria certificada; lo demás es narración no auditada.",
    apAsk:
      "Requerir a BBVA/CaixaBank documentación certificada; en su defecto, minorar/neutralizar valor probatorio.",
    tags: ["cancelacion_cuenta", "verificacion", "trazabilidad"],
  },
  {
    id: "I-005",
    severity: "P1",
    category: "OMISION",
    topic: "TRANSFERENCIAS",
    title:
      "Omisión simétrica: acusa por 32.000€ pero omite retirada superior 38.500€ por la actora a su cuenta privativa",
    summary:
      "La contestación lo afirma expresamente y lo vincula a un patrón de relato selectivo.",
    responseRef: "Contestación: Punto 3 correlativo — ‘OMITIENDO... 38.500 €’",
    quoteShort: "“...OMITIENDO... RETIRÓ... (38.500 €)... a su cuenta privativa.”",
    source: {
      side: "CONTESTACION",
      docName: "Contestacion_picassent_transcrita.docx",
      docNumbers: ["3"],
    },
    rebuttalOneLiner:
      "No puede aislar un movimiento de 32.000€ como ‘deuda’ y ocultar el movimiento simétrico y mayor de la actora.",
    apAsk:
      "Fijar como hecho controvertido la retirada 38.500€ y exigir cuadro completo de saldos/órdenes/fechas.",
    tags: ["omision", "simetria", "38500", "saldo"],
    amountEUR: 38500,
  },
  {
    id: "I-006",
    severity: "P2",
    category: "OMISION",
    topic: "VEHICULOS",
    title:
      "Relato asimétrico de vehículos: reclama Seat León pero se omite compra de Renault Megane Scenic pagado desde BBVA común y a nombre de ella",
    summary:
      "La contestación aporta fecha (25/05/2015), importe (4.500€), matrícula (7229 FMZ) y titularidad DGT de la actora.",
    responseRef: "Contestación: omisión intencionada — Renault Megane Scenic 4.500€",
    quoteShort:
      "“...se omite... 25 de mayo de 2015... 4.500 euros... Renault Megane Scenic... 7229 FMZ...” …",
    source: {
      side: "CONTESTACION",
      docName: "Contestacion_picassent_transcrita.docx",
      docNumbers: ["16–17"],
    },
    rebuttalOneLiner:
      "Si los coches se pagan desde cuenta común para uso familiar, no hay ‘préstamo privativo’ selectivo solo cuando conviene.",
    apAsk:
      "Fijar la compra del Megane como hecho relevante y exigir trazabilidad simétrica para cualquier ‘reembolso’ de vehículos.",
    tags: ["vehiculos", "omision", "cuenta_comun", "dgt"],
    dateHint: "2015-05-25",
    amountEUR: 4500,
  },
  {
    id: "I-007",
    severity: "P2",
    category: "IMPORTES",
    topic: "GENERAL",
    title:
      "Cuantía en letra vs cifra: ‘DOSCIENTOS DIECISEIS MIL…’ frente a (212.677,08€)",
    summary:
      "La demanda expresa cuantía en letra y cifra; la letra no coincide con la cifra. Además menciona ‘capitalización’ y luego suplica intereses legales sin desarrollar.",
    demandRef: "Demanda: Hecho Cuarto + Suplico 3º",
    quoteShort: "“...DOSCIENTOS DIECISEIS MIL... (212.677,08€)...” …",
    source: { side: "DEMANDA", docName: "Demanda_picassent_Transcrita.docx" },
    rebuttalOneLiner:
      "Si ni la cuantía está cerrada sin contradicción, el desglose exige depuración y concreción partida a partida.",
    apAsk:
      "Que se requiera subsanación/concreción de cuantía y desglose, fijando importes, periodos y base de intereses.",
    tags: ["cuantia", "letra_vs_cifra", "capitalizacion"],
    amountEUR: 212677.08,
  },
  {
    id: "I-008",
    severity: "P2",
    category: "PREMISA_FALSA",
    topic: "IBI",
    title:
      "IBI 2013–2019 pagado desde cuenta ‘solo pensión’: en 2013 no había pensión y no se identifica cuenta",
    summary:
      "La demanda dice ‘cuenta común que se nutría únicamente de la pensión’; la contestación lo niega por fecha y falta de identificación/trazabilidad.",
    demandRef: "Demanda: IBI 2013–2019 ‘cuenta… pensión’",
    responseRef: "Contestación: Punto 5 correlativo — ‘en 2013 no percibía pensión’",
    quoteShort:
      "“...cuenta común que se nutría únicamente de la pensión...” … / “...en 2013... no percibía pensión...” …",
    source: { side: "DEMANDA", docName: "Demanda_picassent_Transcrita.docx" },
    rebuttalOneLiner:
      "No puedes justificar pagos 2013–2019 con ‘pensión’ y sin identificar cuenta: es una premisa fáctica rota.",
    apAsk:
      "Exigir identificación de cuenta + extractos completos por año; en su defecto, no acreditado.",
    tags: ["ibi", "pension", "trazabilidad"],
  },
  {
    id: "I-009",
    severity: "P2",
    category: "CRONOLOGIA",
    topic: "GENERAL",
    title:
      "Saltos temporales: 2006 (Kutxa) se mezcla con 2021–2023 y luego vuelve a 2009/2014",
    summary:
      "El relato económico se construye por conceptos sueltos (coche/hipoteca/IBI) sin cuadro cronológico único.",
    demandRef: "Demanda: Hecho Cuarto (conceptos 1–10)",
    quoteShort: "“...por los siguientes conceptos e importes...” …",
    source: { side: "DEMANDA", docName: "Demanda_picassent_Transcrita.docx" },
    rebuttalOneLiner: "Sin cronología única y cuadro de saldos, el ‘reembolso’ es una suma de relatos inconexos.",
    apAsk:
      "Que se obligue a la actora a presentar cronología y cuadro único por cuentas, fechas y conceptos (trazabilidad).",
    tags: ["cronologia", "saltos", "cuadro_unico"],
  },
  {
    id: "I-010",
    severity: "P3",
    category: "PROCEDIMIENTO",
    topic: "PROCEDIMIENTO",
    title:
      "La demanda reconoce verbal para división y ordinario para cantidad, pero concluye que todo siga por ordinario (art. 73 LEC)",
    summary:
      "Punto procesal que debe quedar accesible para alegación en AP si forma parte de la estrategia.",
    demandRef:
      "Demanda: apartado procedimiento/cuantía con referencia a 250.1.16, 249.2 y 73 LEC",
    quoteShort: "“...división... juicio verbal... 250.1.16... reintegro... ordinario... 73...” …",
    source: { side: "DEMANDA", docName: "Demanda_picassent_Transcrita.docx" },
    rebuttalOneLiner:
      "La propia demanda admite procedimientos distintos; esto habilita depuración y discusión sobre acumulación/objeto.",
    apAsk:
      "Dejar listo para alegación procesal: depuración de acciones/procedimiento si se decide emplearlo.",
    tags: ["procedimiento", "lec", "acumulacion"],
  },
];

export type Partida = {
  idx: number;
  concept: string;
  period: string;
  amountEUR: number;
  mainProblem: string;
  sources: { demand?: string; response?: string; docNumbers?: string[] };
  rebuttalOneLiner: string;
};

export const PGASEN_PARTIDAS: Partida[] = [
  { idx: 1, concept: "Préstamos personales BBVA (cancelación 05/09/2008)", period: "2008-07 a 2008-09", amountEUR: 20085, mainProblem: "Falta de pacto de devolución + trazabilidad discutida", sources: { demand: "Demanda: doc 13", response: "Contestación: punto 1" }, rebuttalOneLiner: "Sin documento de deuda/pacto, es aporte a cuenta común; exigir trazabilidad íntegra." },
  { idx: 2, concept: "Seat León (4327 HZM) como reembolso", period: "2014", amountEUR: 13000, mainProblem: "No acredita compra ni origen privativo; cuenta común; prescripción alegada", sources: { demand: "Demanda: vehículo", response: "Contestación: punto 2" }, rebuttalOneLiner: "Pago desde cuenta común no genera préstamo privativo; y además acción prescrita según contestación." },
  { idx: 3, concept: "Transferencia 32.000€ (Artur Piera)", period: "2022", amountEUR: 32000, mainProblem: "Omisión simétrica: retirada 38.500€ por actora", sources: { demand: "Demanda: 32.000€", response: "Contestación: punto 3", docNumbers: ["3"] }, rebuttalOneLiner: "No hay ‘deuda’ aislada: hay dos disposiciones; exigir cuadro de saldos completo." },
  { idx: 4, concept: "Cuotas hipoteca (Barclays/CaixaBank) como si fuera ‘privativa’ del demandado", period: "2009-07 a 2023-12", amountEUR: 122282.28, mainProblem: "Premisa falsa + posible duplicidad con punto 9", sources: { demand: "Demanda: hipoteca 2009", response: "Contestación: solidaria + duplicidad" }, rebuttalOneLiner: "No puede presentarse como deuda privativa: es obligación solidaria y proyecto patrimonial común." },
  { idx: 5, concept: "IBI vivienda Quart (Lope de Vega 7)", period: "2013–2023", amountEUR: 1826.91, mainProblem: "‘pensión’ en años sin pensión + falta identificación cuenta/pagos", sources: { demand: "Demanda: IBI", response: "Contestación: punto 5" }, rebuttalOneLiner: "Pensión no aplica en 2013; sin cuenta + extractos completos, no acreditado." },
  { idx: 6, concept: "IBI Montroy (2020 y 2023)", period: "2020 & 2023", amountEUR: 530.85, mainProblem: "Trazabilidad/soporte a depurar", sources: { demand: "Demanda: IBI Montroy", response: "Contestación: crítica de trazabilidad" }, rebuttalOneLiner: "Partida menor sin cuadro contable: pedir acreditación estricta." },
  { idx: 7, concept: "IBI rústicas (2023 / 03-2024)", period: "2023–2024-03", amountEUR: 151.81, mainProblem: "Desencajado; mezcolanza sin cuadro único", sources: { demand: "Demanda: IBI rústicas", response: "Contestación: enfoque de cuadro" }, rebuttalOneLiner: "Micro-partidas mezcladas: exigir depuración y pertinencia." },
  { idx: 8, concept: "Comunidad Loma de los Caballeros (4T 2023)", period: "2023-Q4", amountEUR: 19.39, mainProblem: "Partida mínima en pleito de 212k; refuerza heterogeneidad", sources: { demand: "Demanda: comunidad", response: "Contestación: crítica de conjunto (si aplica)" }, rebuttalOneLiner: "Esto evidencia falta de depuración: microreclamaciones heterogéneas." },
  { idx: 9, concept: "Amortización préstamo previo 33.959,19 (22/08/2006)", period: "2006-08-22", amountEUR: 16979.59, mainProblem: "Duplicidad con cuotas + prescripción alegada", sources: { demand: "Demanda: Kutxa 2006", response: "Contestación: duplicidad/prescripción" }, rebuttalOneLiner: "Además de prescripción, es duplicidad con narrativa de cuotas: pluspetición." },
  { idx: 10, concept: "Maquinaria agrícola (tractor/atomizador)", period: "2021-11 a 2021-12", amountEUR: 5801.25, mainProblem: "Compra con dinero común y beneficios; reclama 100% sin depreciación", sources: { demand: "Demanda: maquinaria", response: "Contestación: compensación/beneficios" }, rebuttalOneLiner: "No puede reclamar 100% de algo comprado con dinero común y explotado con beneficios." }
];

export type TimelineEvent = {
  id: string;
  date: string;
  label: string;
  detail: string;
  source: { side: SourceSide; docName: string };
  tags: string[];
};

export const PGASEN_TIMELINE_LOGICAL: TimelineEvent[] = [
  { id:"T-2006-08-22", date:"2006-08-22", label:"Kutxa 310.000€ (préstamo solidario) + cancelación 33.959,19", detail:"Préstamo suscrito por ambos; garantía vivienda privativa; destino bienes comunes.", source:{side:"CONTESTACION", docName:"Contestacion_picassent_transcrita.docx"}, tags:["hipoteca","kutxa"] },
  { id:"T-2009-06-18", date:"2009-06-18", label:"Subrogación a Barclays (luego Caixabank)", detail:"Continuidad del préstamo (según contestación).", source:{side:"CONTESTACION", docName:"Contestacion_picassent_transcrita.docx"}, tags:["hipoteca","barclays","caixa"] },
  { id:"T-2014-10", date:"2014-10", label:"Compra Seat León (13.000€)", detail:"Demanda lo trata como reembolso; contestación niega trazabilidad privativa.", source:{side:"CONTESTACION", docName:"Contestacion_picassent_transcrita.docx"}, tags:["vehiculos"] },
  { id:"T-2015-05-25", date:"2015-05-25", label:"Compra Renault Megane Scenic (4.500€) — omisión alegada", detail:"Pago desde cuenta común BBVA; titularidad DGT de la actora (según contestación).", source:{side:"CONTESTACION", docName:"Contestacion_picassent_transcrita.docx"}, tags:["vehiculos","omision"] },
  { id:"T-2019-05-24", date:"2019-05-24", label:"Compra Artur Piera nº2 (subasta) según contestación", detail:"Adquisición con fondos comunes + hipoteca conjunta 53.000€ (según contestación).", source:{side:"CONTESTACION", docName:"Contestacion_picassent_transcrita.docx"}, tags:["artur_piera"] },
  { id:"T-2022-05-24", date:"2022-05-24", label:"Venta Artur Piera (según demanda) + transferencias 33.700/32.000", detail:"Demanda reclama 32.000€; contestación introduce retirada 38.500€ omitida.", source:{side:"DEMANDA", docName:"Demanda_picassent_Transcrita.docx"}, tags:["transferencias"] },
  { id:"T-2024-07", date:"2024-07", label:"Cancelación cuenta común BBVA (según contestación)", detail:"Tras generar capturas; se invoca dificultad de verificación.", source:{side:"CONTESTACION", docName:"Contestacion_picassent_transcrita.docx"}, tags:["prueba","bbva"] }
];

export type SourceKind = 'PGASEN' | 'EXTERNO_OFICIAL';

export type NormRef = {
  id: string;
  kind: 'NORMA' | 'JURIS';
  title: string;
  contextTag: string;
  sourceKind: SourceKind;
  literalSnippets: { text: string; max25w: true }[];
  source: { label: string; url?: string; note?: string };
  usageInCourt: string;
  linkedFrom: string[];
};

export const PGASEN_LAW_REFS: NormRef[] = [
  {
    id: 'LEC-399',
    kind: 'NORMA',
    title: 'LEC art. 399',
    contextTag: 'Defecto legal / claridad petitum',
    sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'El juicio principiará por demanda, en la que se consignarán los datos y circunstancias de identificación del actor.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 399', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a399', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Anclar que la demanda debe venir correctamente identificada y estructurada desde inicio, sin remisiones indeterminadas.',
    linkedFrom: ['I-011', 'I-012'],
  },
  {
    id: 'LEC-416-1-5', kind: 'NORMA', title: 'LEC art. 416.1.5ª', contextTag: 'Defecto legal / claridad petitum', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'En la audiencia, examinadas las alegaciones, se resolverá sobre defectos procesales que impidan la válida prosecución y término del proceso.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 416', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a416', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Fundamentar la depuración en AP cuando falta concreción apta para contradicción y prueba útil.', linkedFrom: ['I-011', 'I-012'],
  },
  {
    id: 'LEC-424', kind: 'NORMA', title: 'LEC art. 424', contextTag: 'Subsanación en audiencia previa', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'Cuando no se hubiese formulado con claridad y precisión lo alegado, las partes podrán realizar aclaraciones y precisiones oportunas.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 424', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a424', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Pedir aclaración material del petitum y de bases de cálculo sin reabrir hechos nuevos.', linkedFrom: ['I-011', 'I-012'],
  },
  {
    id: 'LEC-219', kind: 'NORMA', title: 'LEC art. 219', contextTag: 'Condena dineraria / bases aritméticas', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'Cuando se reclame cantidad de dinero, la demanda deberá fijarla con claridad o establecer con precisión las bases para su liquidación.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 219', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a219', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Reforzar que no basta cuantía global: se exige cifra o bases concretas liquidables.', linkedFrom: ['I-011', 'I-007'],
  },
  {
    id: 'LEC-250-1-16', kind: 'NORMA', title: 'LEC art. 250.1.16', contextTag: 'Procedimiento', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'Se decidirán en juicio verbal, cualquiera que sea su cuantía, las demandas que pretendan la división judicial de patrimonios.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 250.1.16', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a250', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Separar cauce especial por materia frente a reclamaciones dinerarias por cuantía.', linkedFrom: ['I-010'],
  },
  {
    id: 'LEC-249-2', kind: 'NORMA', title: 'LEC art. 249.2', contextTag: 'Procedimiento', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'Se decidirán también en juicio ordinario las demandas cuya cuantía exceda de quince mil euros.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 249.2', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a249', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Oponer el tramo de reintegro por cuantía para evidenciar incompatibilidad con el verbal por materia.', linkedFrom: ['I-010'],
  },
  {
    id: 'LEC-73', kind: 'NORMA', title: 'LEC art. 73', contextTag: 'Acumulación de acciones', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'Para la acumulación de acciones será preciso que no sean incompatibles entre sí y que corresponda su conocimiento al mismo tribunal.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 73', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a73', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Sostener la incompatibilidad de mezclar acciones de cauce heterogéneo en una sola tramitación.', linkedFrom: ['I-010'],
  },
  {
    id: 'LEC-394', kind: 'NORMA', title: 'LEC art. 394', contextTag: 'Costas', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'En los procesos declarativos, las costas de la primera instancia se impondrán a la parte que haya visto rechazadas todas sus pretensiones.', max25w: true }],
    source: { label: 'BOE-A-2000-323 · art. 394', url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2000-323#a394', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Cerrar petición de costas con referencia breve en caso de estimación íntegra de objeciones procesales.', linkedFrom: [],
  },
  {
    id: 'CC-1964-2', kind: 'NORMA', title: 'CC art. 1964.2', contextTag: 'Prescripción', sourceKind: 'PGASEN',
    literalSnippets: [{ text: 'Citado literalmente en contestación; verificar en visor interno para reproducción íntegra.', max25w: true }],
    source: { label: 'Contestacion_picassent_transcrita.docx · Prescripción', note: 'Fuente interna PGASEN.' },
    usageInCourt: 'Usar solo para bloque de prescripción si se abre debate de fondo sobre partidas antiguas.', linkedFrom: ['I-009'],
  },
  {
    id: 'J-STS-280-2022', kind: 'JURIS', title: 'STS 280/2022', contextTag: 'Jurisprudencia procesal', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'ROJ STS 1387/2022 · ECLI:ES:TS:2022:1387 · CENDOJ 28079110012022100291 (literal pendiente de inserción verificable).', max25w: true }],
    source: { label: 'CENDOJ / CGPJ · STS 280/2022', url: 'https://www.poderjudicial.es/search/indexAN.jsp', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'Cita de refuerzo solo con identificador completo; si no se abre documento oficial, no leer literal.', linkedFrom: ['I-010'],
  },
  {
    id: 'J-ATS-8529-2023', kind: 'JURIS', title: 'ATS 8529/2023', contextTag: 'Jurisprudencia procesal', sourceKind: 'EXTERNO_OFICIAL',
    literalSnippets: [{ text: 'NO_CONSTA: falta ROJ/CENDOJ completo verificable en este repositorio.', max25w: true }],
    source: { label: 'CENDOJ / CGPJ', url: 'https://www.poderjudicial.es/search/indexAN.jsp', note: 'Referencia externa oficial; no forma parte de PGASEN.' },
    usageInCourt: 'No citar literal en sala sin resolución oficial completa y contrastada.', linkedFrom: ['I-010'],
  },
];

export const PGASEN_AP_SCRIPTS = {
  seconds60: [
    "Con la venia, Señoría.",
    "1) La demanda levanta su partida principal sobre una premisa fáctica incorrecta: llama ‘hipoteca de vivienda privativa del demandado’ a un préstamo solidario y con destino a bienes comunes.",
    "2) Además incurre en duplicidad/pluspetición: reclama cuotas y, además, reclama el 50% de una amortización previa (33.959,19 €) generando doble cómputo.",
    "3) Y atribuye pagos con capturas BBVA incompletas ocultando el ordenante (‘Mostrar más’). Sin extractos íntegros y recibos certificables, no hay trazabilidad.",
    "Solicito: depuración del objeto; impugnación de esas capturas; y requerimiento de documentación bancaria íntegra/certificada y cuadro único por partidas."
  ],
  minutes3to4: [
    "Con la venia, Señoría. Expongo en cuatro bloques, con peticiones concretas.",
    "A) Premisa rota: la demanda califica como ‘hipoteca del demandado’ una obligación solidaria usada para adquirir bienes comunes; esa base contamina el cálculo de 122.282,28 €.",
    "B) Duplicidad/pluspetición: se pretende cobrar cuotas y además amortización previa, inflando el saldo con doble cómputo.",
    "C) Prueba incompleta: capturas BBVA que ocultan el ordenante; impugnación por falta de integridad y petición de extractos/recibos certificables.",
    "D) Omisiones: se acusa por 32.000 € pero se omite retirada superior 38.500 € por la actora; y se omite el vehículo de la actora pagado desde cuenta común (4.500 €).",
    "Pido: fijación de hechos controvertidos y requerimiento de trazabilidad íntegra por periodos y cuentas; en defecto, tener por no acreditadas las partidas."
  ],
  full: [
    "Con la venia, Señoría. Voy a dejar fijado el patrón de redacción selectiva y las incoherencias estructurales que impiden fijar hechos controvertidos sin depuración.",
    "1) Objeto contaminado: la demanda mezcla división y una liquidación contable masiva sin cronología única ni cuadro por cuentas, lo que impide pertinencia probatoria.",
    "2) Hipoteca: se califica como ‘de vivienda privativa del demandado’ y se pretende construir un crédito unilateral, cuando el préstamo es solidario y su destino es común.",
    "3) Pluspetición/duplicidad: cuotas + amortización previa 33.959,19; doble cómputo.",
    "4) Prueba: capturas BBVA incompletas; ocultación del ordenante (‘Mostrar más’); cancelación de cuenta; pedir recibos del banco receptor y certificación.",
    "5) Omisiones simétricas: 32.000€ vs retirada 38.500€; vehículo de actora (Megane Scenic 4.500€) omitido; relato de IBI con ‘pensión’ en años sin pensión.",
    "6) Peticiones: depuración del objeto, impugnación documental, requerimiento de cuadro único, y fijación expresa de estos hechos controvertidos."
  ],
  protests: [
    "Señoría, formulo protesta para que conste en acta: esta parte estaba impugnando la documental bancaria por falta de integridad y solicitando depuración del objeto por pluspetición y premisa fáctica incorrecta.",
    "Protesto: no es valoración de fondo; es fijación del objeto litigioso y pertinencia de prueba. Si se da por buena la premisa ‘hipoteca del demandado’, se construye la prueba sobre un hecho discutido.",
    "Señoría, solicito amparo para terminar una frase. No califico intenciones; señalo falta de trazabilidad y omisiones relevantes con soporte documental."
  ],
  apAsks: [
    "Que se tenga por controvertida la premisa ‘hipoteca de vivienda privativa del demandado’ como base del reembolso.",
    "Que conste la impugnación de capturas BBVA y se requieran extractos completos/recibos/certificación del ordenante.",
    "Que se obligue a la actora a presentar un cuadro único por partidas: fecha, cuenta, ordenante, justificante íntegro y cálculo.",
    "Que se incorpore como hecho controvertido la retirada de 38.500 € por la actora y la compra del Megane Scenic (4.500 €) desde cuenta común."
  ]
} as const;
