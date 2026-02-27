export type APFlowCard = {
  id: string;
  section: 'A'|'B'|'C'|'D'|'E'|'F';
  title: string;
  text: string;
  citations: string[];
  enabledByDefault?: boolean;
};

export const AP_V5_FLOW: APFlowCard[] = [
  { id:'A1',section:'A',title:'A1) Apertura (texto literal)',text:'NO CONSTA: se requiere extracción literal desde Guion_sala_formateado_v5_CORRECCIONES.docx.',citations:['LEC 416.1.4ª'],enabledByDefault:true},
  { id:'A2',section:'A',title:'A2) Inadecuación / Indebida acumulación',text:'Señoría, al amparo del art. 416.1.4ª LEC, solicitamos depuración por indebida acumulación y reconducción del cauce conforme al vigente art. 250.1.16 LEC y art. 73.1.2ª LEC.',citations:['LEC 416.1.4ª','LEC 250.1.16','LEC 73.1.2ª'],enabledByDefault:true},
  { id:'A3',section:'A',title:'A3) Allanamiento parcial: pedir AUTO',text:'Conforme al art. 21.2 LEC, se interesa resolución por AUTO para el allanamiento parcial.',citations:['LEC 21.2'],enabledByDefault:true},
  { id:'A4',section:'A',title:'A4) Defecto de cuantía',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 219'],enabledByDefault:true},
  { id:'A5',section:'A',title:'A5) Protesta cautelar',text:'Para el caso de desestimación, esta parte formula protesta expresa a efectos del art. 446 LEC.',citations:['LEC 446'],enabledByDefault:true},
  { id:'B1',section:'B',title:'B1) Activo sin pasivo',text:'Se interesa depuración integral activo/pasivo con apoyo en CC 393, 395 y 406, evitando enriquecimiento sin causa.',citations:['CC 393','CC 395','CC 406'],enabledByDefault:true},
  { id:'B2',section:'B',title:'B2) Tabla verificable por bloques',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 247'],enabledByDefault:true},
  { id:'B3',section:'B',title:'B3) Impugnación documental selectiva',text:'Se impugna documental parcial y se solicita exhibición íntegra conforme a LEC 328–329 y control de autenticidad por LEC 326.2.',citations:['LEC 328','LEC 329','LEC 326.2'],enabledByDefault:true},
  { id:'B4',section:'B',title:'B4) Contradicción Mislata/Picassent',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 247'],enabledByDefault:true},
  { id:'B5',section:'B',title:'B5) Uso vivienda privativa no computado',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['CC 7.1'],enabledByDefault:true},
  { id:'C1',section:'C',title:'C1) Corte DT 5ª Ley 42/2015',text:'Se mantiene excepción de prescripción ya opuesta en contestación para este caso.',citations:['CC 1964.2','CC 1973'],enabledByDefault:true},
  { id:'C2',section:'C',title:'C2) Anti-STS 458/2025',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:[],enabledByDefault:true},
  { id:'C3',section:'C',title:'C3) Interrupción fehaciente',text:'Se exige acto interruptivo fehaciente y carga de acreditación.',citations:['CC 1973'],enabledByDefault:true},
  { id:'D21',section:'D',title:'HC-21 ayudas/consorcio',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 426'],enabledByDefault:true},
  { id:'D22',section:'D',title:'HC-22 ayuda escolar',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 426'],enabledByDefault:true},
  { id:'E1',section:'E',title:'E1) Documental propia',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E2',section:'E',title:'E2) Interrogatorio actora + DANA/ayuda escolar',text:'Interrogatorio con bloque específico DANA y ayuda escolar.',citations:['LEC 301','LEC 304','LEC 307'],enabledByDefault:true},
  { id:'E3',section:'E',title:'E3) Pericial contable judicial',text:'Solicitud de pericial contable judicial conforme LEC 339.5.',citations:['LEC 339.5'],enabledByDefault:true},
  { id:'E4',section:'E',title:'E4) Oficios bancarios',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E5',section:'E',title:'E5) Oficio Mislata',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E6',section:'E',title:'E6) Oficio Registro',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E7',section:'E',title:'E7) Oficio Notaría',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E8',section:'E',title:'E8) Oficio Consorcio',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E9',section:'E',title:'E9) Oficio Generalitat ayudas DANA',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:['LEC 429'],enabledByDefault:true},
  { id:'E10',section:'E',title:'E10) Exhibición documental 328–329',text:'Exhibición documental al amparo de LEC 328–329.',citations:['LEC 328','LEC 329'],enabledByDefault:true},
  { id:'E11',section:'E',title:'E11) 326.2 LEC',text:'Control de autenticidad e impugnación documental por LEC 326.2.',citations:['LEC 326.2'],enabledByDefault:true},
  { id:'F1',section:'F',title:'F1) Reserva de acciones',text:'Reserva expresa de acciones compatibles.',citations:['LEC 446'],enabledByDefault:true},
  { id:'F2',section:'F',title:'F2) Protesta final',text:'Protesta final por indefensión, si procede.',citations:['LEC 446'],enabledByDefault:true},
  { id:'F3',section:'F',title:'F3) Subsanación 231 LEC',text:'Subsanación procesal al amparo de LEC 231.',citations:['LEC 231'],enabledByDefault:true},
  { id:'F4',section:'F',title:'F4) Resúmenes 30s/60s',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:[],enabledByDefault:true},
  { id:'F5',section:'F',title:'F5) Tabla de respuestas rápidas',text:'NO CONSTA: literal V5 pendiente de extracción documental.',citations:[],enabledByDefault:true},
];
