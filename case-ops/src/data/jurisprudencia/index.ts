// ============================================
// BASE DE DATOS DE JURISPRUDENCIA OPERATIVA
// Archivo: /src/data/jurisprudencia/index.ts
// ============================================

export type Tribunal = 'TS' | 'AP' | 'TC' | 'TJUE' | 'CC';
export type Importancia = 1 | 2 | 3 | 4 | 5;
export type Procedimiento = 'picassent' | 'mislata' | 'ambos';

export interface CitaJurisprudencia {
  id: string;
  tribunal: Tribunal;
  sala?: string;
  numero: string;
  fecha: string;
  ponente?: string;

  // Clasificación
  tematica: string[];
  tags: string[];
  importancia: Importancia;
  procedimientosAplicables: Procedimiento[];
  hechosVinculados?: number[];

  // Contenido
  fragmentoClave: string; // Para copiar rápido (max 300 chars)
  textoCompleto: string;

  // Aplicación práctica
  cuandoAplica: string;
  cuandoNOaplica: string;
  fraseParaJuez?: string;
}

// ============================================
// JURISPRUDENCIA - LITISPENDENCIA
// ============================================

export const jurisprudenciaLitispendencia: CitaJurisprudencia[] = [
  {
    id: 'sts-140-2012',
    tribunal: 'TS',
    sala: 'Civil',
    numero: '140/2012',
    fecha: '2012-03-13',
    tematica: ['litispendencia', 'cosa juzgada', 'identidad procesal'],
    tags: ['identidad subjetiva', 'identidad objetiva', 'identidad causal', 'art. 410 LEC'],
    importancia: 5,
    procedimientosAplicables: ['mislata'],

    fragmentoClave: '"La litispendencia exige identidad subjetiva, objetiva y causal entre el pleito en que se alega y otro anterior"',

    textoCompleto: `La litispendencia consiste en un efecto de la admisión de la demanda, tal como dispone el Art. 410 LEC. En realidad, se trata de evitar el efecto de cosa juzgada, es decir, que puedan existir sentencias contradictorias sobre el mismo objeto procesal y por ello, el Art. 222.1 LEC dice que ésta excluye "conforme a la ley, un ulterior proceso cuyo objeto sea idéntico al del proceso en que aquella se produjo". La litispendencia se adelanta a este efecto, precisamente para evitarlo.

Los requisitos exigidos por la jurisprudencia de esta Sala para que pueda entenderse que concurre litispendencia son tres:
1º La identidad de las partes o identidad subjetiva;
2º La identidad del objeto del proceso o identidad objetiva;
3º La pendencia de auténticos procesos, por lo que se requiere que se hayan interpuesto demandas que resulten admitidas, de acuerdo con el Art. 410 LEC y que el primer procedimiento deba acabar con una sentencia que produzca los efectos de cosa juzgada.`,

    cuandoAplica: 'Cuando la parte contraria alega litispendencia sin que exista identidad TOTAL (tres requisitos) entre ambos procedimientos.',
    cuandoNOaplica: 'Cuando efectivamente hay dos procedimientos idénticos en sujetos, objeto y causa.',
    fraseParaJuez: '"Señoría, la STS 140/2012 exige identidad TOTAL: sujetos, objeto Y causa. Aquí falta la identidad objetiva: mis cuotas son posteriores."',
  },
  {
    id: 'sts-706-2007',
    tribunal: 'TS',
    numero: '706/2007',
    fecha: '2007-06-11',
    tematica: ['litispendencia', 'cosa juzgada', 'identidad causal'],
    tags: ['triple identidad', 'causa de pedir'],
    importancia: 4,
    procedimientosAplicables: ['mislata'],

    fragmentoClave: '"La litispendencia exige identidad subjetiva, objetiva y causal entre el pleito en que se alega y otro anterior"',

    textoCompleto: `La STS 706/2007, de 11 junio, dice de acuerdo con la sentencia de 9 de marzo de 2000: "La litispendencia exige identidad subjetiva, objetiva y causal entre el pleito en que se alega y otro anterior, como recuerda la sentencia de 2 de noviembre de 1999 que reproduce lo dicho en la de 31 de junio de 1990 con apoyo jurisprudencial anterior y dice, literalmente: es una figura procesal cuya interpretación teleológica coincide plenamente con la de la cosa juzgada, pues no se puede olvidar que la litispendencia es un anticipo de dicha figura procesal de la cosa juzgada, ya que como dice la jurisprudencia de esta Sala, la litispendencia en nuestro Derecho procesal es una excepción dirigida a impedir la simultánea tramitación de dos procesos; es una institución presuntiva y tutelar de la cosa juzgada o de la univocidad procesal y del legítimo derecho de quien la esgrime a no quedar sometido a un doble litigio."`,

    cuandoAplica: 'Para reforzar que la litispendencia requiere triple identidad estricta.',
    cuandoNOaplica: 'Si hay identidad total entre los procesos.',
  },
  {
    id: 'sts-942-2011',
    tribunal: 'TS',
    numero: '942/2011',
    fecha: '2011-12-29',
    tematica: ['litispendencia', 'pendencia simultánea'],
    tags: ['situaciones patológicas', 'sentencia de fondo'],
    importancia: 4,
    procedimientosAplicables: ['mislata'],

    fragmentoClave: '"Nuestro sistema reacciona frente a situaciones patológicas de pendencia simultánea de dos procesos con identidad de objetos, sujetos y causas"',

    textoCompleto: `La STS 942/2011, de 29 diciembre señala que "[...] nuestro sistema, de forma similar a otros próximos -así los artículos 100 del Código de Procedimiento francés, 497.1 del portugués y el 39 del italiano- reacciona frente a situaciones patológicas de pendencia simultánea de dos procesos con identidad de objetos, sujetos y causas, a fin de impedir que el segundo finalice con una sentencia sobre el fondo (en este sentido, sentencia 539/2010, de 28 julio)"`,

    cuandoAplica: 'Para mostrar que la litispendencia solo aplica a situaciones "patológicas" de duplicidad total.',
    cuandoNOaplica: 'Cuando los procesos son distintos en objeto o causa.',
  },
];

// ============================================
// JURISPRUDENCIA - SOLIDARIDAD Y REGRESO
// ============================================

export const jurisprudenciaSolidaridad: CitaJurisprudencia[] = [
  {
    id: 'sap-valencia-2014',
    tribunal: 'AP',
    sala: 'Valencia',
    numero: 'S 30.12.2014',
    fecha: '2014-12-30',
    tematica: ['solidaridad', 'hipoteca', 'regreso', 'more uxorio'],
    tags: ['art. 1145 CC', 'art. 393 CC', 'cuotas hipotecarias', 'comunidad'],
    importancia: 5,
    procedimientosAplicables: ['mislata'],

    fragmentoClave: '"Las cuotas pagadas por el demandante extinta la relación more uxorio, generan en aquél un crédito frente a la comunidad, con derecho al cobro de la mitad (artículo 1145 Código Civil)"',

    textoCompleto: `Ya que las cuotas pagadas por el demandante extinta la relación «more uxorio», generan en aquél un crédito frente a la comunidad, en base al art. 393 del Código Civil, y frente a la demandada, por haber suscrito conjuntamente el préstamo, con derecho al cobro de la mitad del importe de aquella (artículo 1145 Código Civil).`,

    cuandoAplica: 'Para fundamentar la demanda de Mislata: derecho a reclamar el 50% de cuotas pagadas tras la ruptura.',
    cuandoNOaplica: 'Si se prueba un pacto diferente de reparto entre las partes.',
    fraseParaJuez: '"La AP Valencia dice claramente: las cuotas pagadas tras la ruptura generan un crédito con derecho al cobro de la mitad. Art. 1145 CC."',
  },
  {
    id: 'sap-coruna-2013',
    tribunal: 'AP',
    sala: 'A Coruña',
    numero: 'S 14.10.2013',
    fecha: '2013-10-14',
    tematica: ['solidaridad', 'comunidad', 'regreso', 'copropietario'],
    tags: ['art. 395 CC', 'art. 393 CC', 'art. 1145 CC', 'gastos comuneros'],
    importancia: 4,
    procedimientosAplicables: ['mislata'],

    fragmentoClave: '"Acción de regreso del copropietario que abonó gastos que habían de repartirse entre todos los comuneros, con base en el art. 1145.2º como la propia del deudor solidario"',

    textoCompleto: `Ello fundamenta la pretensión ejercitada por D. Doroteo y estimada por la sentencia que ahora se combate en esta apelación de reclamar contra Dª Teodora la mitad de lo que él pagó en exclusiva del préstamo hipotecario suscrito para la adquisición de la vivienda, más una amortización por importe de 4.191,96 euros, bien se contemple desde la perspectiva del art. 395, en relación con el art. 393 Código Civil, como acción de regreso del copropietario que abonó gastos que habían de repartirse entre todos los comuneros, bien, incluso, con base en el art. 1145.2º como la propia del deudor solidario que pagó al acreedor y reclama de sus codeudores.`,

    cuandoAplica: 'Refuerza el derecho de regreso tanto por comunidad (393/395 CC) como por solidaridad (1145 CC).',
    cuandoNOaplica: 'Si no hay copropiedad ni solidaridad documental.',
  },
];

// ============================================
// JURISPRUDENCIA - PRESCRIPCIÓN
// ============================================

export const jurisprudenciaPrescripcion: CitaJurisprudencia[] = [
  {
    id: 'sts-prescripcion-separacion',
    tribunal: 'TS',
    numero: 'Doctrina consolidada',
    fecha: '2015-12-21',
    tematica: ['prescripcion', 'separacion bienes', 'dies a quo'],
    tags: ['art. 1964 CC', 'art. 1969 CC', 'reembolso', 'cónyuges'],
    importancia: 5,
    procedimientosAplicables: ['picassent'],
    hechosVinculados: [1, 2, 4, 5, 9],

    fragmentoClave: '"En régimen de separación de bienes de derecho común, no existe suspensión de la prescripción entre cónyuges. Las deudas y derechos de reembolso nacen y son exigibles desde que se realiza el pago (Art. 1969 CC)"',

    textoCompleto: `En supuestos de relaciones obligacionales complejas, continuadas y con prestaciones recíprocas, la determinación de un saldo exige una previa liquidación integral, sin que quepa la reclamación aislada de partidas parciales.

Sin embargo, en régimen de separación de bienes de derecho común, no existe suspensión de la prescripción entre cónyuges para derechos de reembolso derivados de pagos. El tiempo comienza a correr desde que la acción pudo ejercitarse (Art. 1969 CC), es decir, desde cada pago individual.`,

    cuandoAplica: 'Para defender prescripción en Picassent: pagos de 2006, 2008, 2014... prescritos.',
    cuandoNOaplica: 'En gananciales o cuando hay interrupción fehaciente de la prescripción.',
    fraseParaJuez: '"Señoría, la ley no prevé una pausa en la prescripción por estar casado en separación de bienes. La actora pudo reclamar en 2008, en 2014, en 2019. No lo hizo."',
  },
  {
    id: 'dt-5-ley-42-2015',
    tribunal: 'CC',
    numero: 'DT 5ª Ley 42/2015',
    fecha: '2015-10-07',
    tematica: ['prescripcion', 'regimen transitorio', 'plazos'],
    tags: ['15 años', '5 años', 'acciones personales'],
    importancia: 5,
    procedimientosAplicables: ['picassent'],
    hechosVinculados: [1, 2, 4, 5, 9],

    fragmentoClave: '"Las acciones nacidas antes del 7/10/2015 (antiguo plazo 15 años) prescribieron, en todo caso, el 7/10/2020. Las posteriores: 5 años."',

    textoCompleto: `Disposición Transitoria Quinta de la Ley 42/2015:
El tiempo de prescripción de las acciones personales que no tengan señalado término especial de prescripción, nacidas antes de la fecha de entrada en vigor de esta Ley, se regirá por lo dispuesto en el artículo 1964 del Código Civil.

Sin embargo, si desde la entrada en vigor de esta Ley transcurriese todo el tiempo requerido por las leyes anteriores, las acciones prescribirán en todo caso.

INTERPRETACIÓN PRÁCTICA:
- Acciones nacidas ANTES del 7/10/2015: tenían plazo de 15 años, pero prescribieron como máximo el 7/10/2020.
- Acciones nacidas DESPUÉS del 7/10/2015: plazo de 5 años (art. 1964.2 CC reformado).`,

    cuandoAplica: 'Para calcular prescripción de los hechos de Picassent (2006, 2008, 2014...).',
    cuandoNOaplica: 'Para hechos posteriores a 2019.',
    fraseParaJuez: '"Señoría, los pagos de 2006 y 2008 tenían plazo de 15 años, pero la DT 5ª Ley 42/2015 establece que prescribieron el 7/10/2020 como máximo."',
  },
];

// ============================================
// JURISPRUDENCIA - COMPENSACIÓN
// ============================================

export const jurisprudenciaCompensacion: CitaJurisprudencia[] = [
  {
    id: 'art-1196-cc',
    tribunal: 'CC',
    numero: 'Art. 1196 CC',
    fecha: '1889-07-24',
    tematica: ['compensacion', 'requisitos', 'liquidez'],
    tags: ['deudas líquidas', 'deudas vencidas', 'deudas exigibles'],
    importancia: 5,
    procedimientosAplicables: ['mislata'],

    fragmentoClave: '"Para que proceda la compensación, es preciso: Que ambas deudas estén vencidas. Que sean líquidas y exigibles."',

    textoCompleto: `Artículo 1196 del Código Civil:
Para que proceda la compensación, es preciso:
1º Que cada uno de los obligados lo esté principalmente, y sea a la vez acreedor principal del otro.
2º Que ambas deudas consistan en una cantidad de dinero, o, siendo fungibles las cosas debidas, sean de la misma especie y también de la misma calidad, si ésta se hubiese designado.
3º Que las dos deudas estén vencidas.
4º Que sean líquidas y exigibles.
5º Que sobre ninguna de ellas haya retención o contienda promovida por terceras personas y notificada oportunamente al deudor.`,

    cuandoAplica: 'Para rechazar la compensación alegada por Vicenta: su crédito de Picassent no es líquido ni exigible.',
    cuandoNOaplica: 'Cuando ambos créditos son efectivamente líquidos, vencidos y exigibles.',
    fraseParaJuez: '"El art. 1196 CC exige que las deudas sean líquidas y exigibles. El supuesto crédito de ella está en disputa, prescrito en su mayoría, y pendiente de sentencia. No cabe compensar."',
  },
];

// ============================================
// JURISPRUDENCIA - LIBERALIDAD / CARGAS
// ============================================

export const jurisprudenciaLiberalidad: CitaJurisprudencia[] = [
  {
    id: 'doctrina-1438-cc',
    tribunal: 'TS',
    numero: 'Doctrina art. 1438 CC',
    fecha: '2020-01-01',
    tematica: ['liberalidad', 'cargas matrimonio', 'separacion bienes'],
    tags: ['art. 1438 CC', 'animus donandi', 'gastos familiares'],
    importancia: 4,
    procedimientosAplicables: ['picassent'],
    hechosVinculados: [4, 5],

    fragmentoClave: '"En separación de bienes, las aportaciones a gastos comunes se entienden como cumplimiento del deber de contribuir a las cargas del matrimonio (Art. 1438 CC), no como préstamos que generen reembolso"',

    textoCompleto: `La jurisprudencia del Tribunal Supremo viene estableciendo que en régimen de separación de bienes, las aportaciones realizadas durante la convivencia para el sostenimiento de gastos comunes (alimentación, vivienda, hijos, etc.) se presumen realizadas en cumplimiento del deber legal de contribuir a las cargas del matrimonio (art. 1438 CC).

Esta doctrina excluye el derecho de reembolso si concurre:
a) "Ánimo liberal" (animus donandi), o
b) Un "pacto de reparto de gastos familiares", que no necesita ser escrito.

La prueba de que los pagos NO fueron liberalidad o contribución a cargas corresponde a quien reclama el reembolso.`,

    cuandoAplica: 'Para defender en Picassent que las aportaciones a gastos ordinarios eran cargas familiares, no préstamos.',
    cuandoNOaplica: 'Para gastos extraordinarios o pagos de deudas claramente privativas con fondos comunes.',
    fraseParaJuez: '"Esto no fue una relación de crédito, fue una FAMILIA. Las aportaciones a gastos comunes durante 15 años de convivencia son cargas del matrimonio, no préstamos."',
  },
];

// ============================================
// FUNCIÓN: OBTENER TODA LA JURISPRUDENCIA
// ============================================

export const todasLasCitas: CitaJurisprudencia[] = [
  ...jurisprudenciaLitispendencia,
  ...jurisprudenciaSolidaridad,
  ...jurisprudenciaPrescripcion,
  ...jurisprudenciaCompensacion,
  ...jurisprudenciaLiberalidad,
];

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

export function buscarJurisprudencia(termino: string): CitaJurisprudencia[] {
  const t = termino.toLowerCase();
  return todasLasCitas.filter(j =>
    j.tematica.some(tema => tema.toLowerCase().includes(t)) ||
    j.tags.some(tag => tag.toLowerCase().includes(t)) ||
    j.fragmentoClave.toLowerCase().includes(t) ||
    j.textoCompleto.toLowerCase().includes(t)
  );
}

export function getJurisprudenciaPorProcedimiento(proc: Procedimiento): CitaJurisprudencia[] {
  return todasLasCitas.filter(j =>
    j.procedimientosAplicables.includes(proc) ||
    j.procedimientosAplicables.includes('ambos')
  );
}

export function getJurisprudenciaPorHecho(hechoId: number): CitaJurisprudencia[] {
  return todasLasCitas.filter(j => j.hechosVinculados?.includes(hechoId));
}

export function getJurisprudenciaPorTematica(tematica: string): CitaJurisprudencia[] {
  return todasLasCitas.filter(j =>
    j.tematica.some(t => t.toLowerCase().includes(tematica.toLowerCase()))
  );
}

export function getJurisprudenciaPorImportancia(min: Importancia): CitaJurisprudencia[] {
  return todasLasCitas.filter(j => j.importancia >= min).sort((a, b) => b.importancia - a.importancia);
}
