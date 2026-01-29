// src/data/legal_texts.ts

export const DEMANDA_PICASSENT_HTML = `
<div class="legal-doc">
  <div class="text-center mb-8 border-b border-slate-700 pb-4">
    <h2 class="text-xl font-bold uppercase text-amber-500">Escrito de Demanda</h2>
    <p class="text-sm text-slate-400">Juzgado de Primera Instancia e Instrucción nº 1 de Picassent</p>
    <p class="text-sm text-slate-400">Procedimiento Ordinario 715/2024</p>
  </div>

  <p><strong>AL JUZGADO:</strong></p>
  <p>Dña. ISABEL LUZZY AGUILAR, Procuradora de los Tribunales, en nombre y representación de <strong>Dña. VICENTA JIMÉNEZ VERA</strong>, ante el Juzgado comparezco y DIGO:</p>

  <p>Que mediante el presente escrito interpongo DEMANDA DE JUICIO ORDINARIO de ejercicio de <strong>ACCIÓN DE DIVISIÓN DE COSA COMÚN</strong> acumulada con <strong>ACCIÓN DE REEMBOLSO</strong> contra D. JUAN RODRÍGUEZ CRESPO.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-6 mb-2">HECHOS</h3>
  
  <p><strong>PRIMERO.- De la titularidad de los bienes inmuebles.</strong><br>
  Ambas partes son copropietarios proindiviso, por mitades iguales (50%), de las siguientes fincas registrales...</p>

  <p><strong>CUARTO.- De las aportaciones económicas y derecho de reembolso.</strong><br>
  Mi mandante ha soportado en solitario, o en mayor proporción, cargas que correspondían a la sociedad de gananciales o a la comunidad de bienes, generando un derecho de crédito a su favor.</p>
  
  <ul class="list-disc pl-5 space-y-2 my-4 text-slate-300">
    <li><strong>Préstamos personales (2008):</strong> Abonados en exclusiva por mi mandante.</li>
    <li><strong>Vehículo Seat León (2014):</strong> Financiado al 100% por Dña. Vicenta (13.000€).</li>
    <li><strong>Cuotas Hipotecarias (2009-2018):</strong> Mi mandante abonó cuotas de la hipoteca que gravaba la vivienda familiar por importe de 99.374€.</li>
    <li><strong>IBI y Gastos (2013-2019):</strong> Abonados en exclusiva.</li>
  </ul>

  <p>El importe total adeudado por el demandado a mi mandante asciende a la cantidad de <strong>212.677,08 EUROS</strong>.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-6 mb-2">SUPLICO AL JUZGADO</h3>
  
  <p>Que se dicte Sentencia por la que:</p>
  <ol class="list-decimal pl-5 space-y-2">
    <li>Se declare la disolución de la comunidad de bienes sobre los inmuebles descritos.</li>
    <li>Se condene a D. JUAN RODRÍGUEZ CRESPO a abonar a mi mandante la cantidad de <strong>212.677,08 €</strong> más los intereses legales.</li>
    <li>Se condene en costas a la parte demandada.</li>
  </ol>
</div>
`;

export const CONTESTACION_PICASSENT_HTML = `
<div class="legal-doc">
  <div class="text-center mb-8 border-b border-slate-700 pb-4">
    <h2 class="text-xl font-bold uppercase text-emerald-500">Contestación a la Demanda</h2>
    <p class="text-sm text-slate-400">Juzgado de Primera Instancia e Instrucción nº 1 de Picassent</p>
    <p class="text-sm text-slate-400">P.O. 715/2024 - Defensa: Oscar Javier Benita Godoy</p>
  </div>

  <p><strong>AL JUZGADO:</strong></p>
  <p>Dña. ROSA CALVO BARBER, Procuradora, en nombre de <strong>D. JUAN RODRÍGUEZ CRESPO</strong>, comparezco y DIGO:</p>

  <p>Que contestamos a la demanda en base a los siguientes términos:</p>

  <div class="bg-slate-800/50 p-4 rounded-lg border-l-4 border-emerald-500 my-4">
    <p class="font-bold text-emerald-400">ALLANAMIENTO PARCIAL:</p>
    <p class="text-sm">Esta parte se ALLANA exclusivamente a la pretensión de división de cosa común. No nos oponemos a que se vendan los inmuebles y se reparta el precio.</p>
  </div>

  <h3 class="text-lg font-bold text-slate-200 mt-6 mb-2">OPOSICIÓN A LA RECLAMACIÓN ECONÓMICA</h3>

  <p>Nos oponemos rotundamente a la reclamación de 212.677,08€ por los siguientes motivos:</p>

  <h4 class="font-bold text-amber-400 mt-4">1. EXCEPCIÓN DE PRESCRIPCIÓN (Art. 1964 CC)</h4>
  <p>La actora pretende cobrar deudas de hace más de 15 años. El 70% de lo reclamado está prescrito:</p>
  <ul class="list-disc pl-5 space-y-1 text-slate-300">
    <li>Préstamos de 2008 (Prescritos hace 16 años).</li>
    <li>Vehículo de 2014 (Prescrito hace 10 años).</li>
    <li>IBI y gastos anteriores a 2019.</li>
  </ul>
  <p>No existe ninguna reclamación extrajudicial previa que haya interrumpido el plazo.</p>

  <h4 class="font-bold text-amber-400 mt-4">2. NATURALEZA DEL PRÉSTAMO HIPOTECARIO</h4>
  <p>La actora miente al calificar la hipoteca como "del demandado". Se trata de un <strong>préstamo solidario</strong> suscrito por ambos cónyuges para la construcción del chalet común. La vivienda privativa del Sr. Rodríguez solo actuó como garantía real, no como beneficiaria del dinero.</p>

  <h4 class="font-bold text-amber-400 mt-4">3. COMPENSACIÓN DE CRÉDITOS (Art. 1196 CC)</h4>
  <p>Se oculta que la actora, en fecha de la separación de hecho, retiró <strong>38.500 €</strong> de la cuenta común a una cuenta privativa suya (CaixaBank). Esta parte opone compensación respecto a cualquier cantidad que pudiera resultar debida.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-6 mb-2">SUPLICO AL JUZGADO</h3>
  
  <p>Que se dicte Sentencia por la que:</p>
  <ol class="list-decimal pl-5 space-y-2">
    <li>Se estime la división de cosa común (por allanamiento).</li>
    <li><strong>SE DESESTIME ÍNTEGRAMENTE</strong> la reclamación de cantidad por prescripción, falta de legitimación y compensación.</li>
    <li>Se impongan las costas a la actora por temeridad y mala fe, al reclamar deudas a sabiendas de su prescripción ("Arqueología Contable").</li>
  </ol>
</div>
`;

// Mapa para acceder rápido por ID
export const LEGAL_DOCS_MAP: Record<string, string> = {
  'demanda-picassent': DEMANDA_PICASSENT_HTML,
  'contestacion-picassent': CONTESTACION_PICASSENT_HTML,
};

// ==========================================
// CASO MISLATA (JUICIO VERBAL 1185/2025) - TEXTOS ÍNTEGROS
// ==========================================

export const RECURSO_REPOSICION_MISLATA_HTML = `
<div class="legal-doc space-y-6 text-justify">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-rose-500 font-serif tracking-wide">RECURSO DE REPOSICIÓN (CONTRARIO)</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>AL TRIBUNAL DE INSTANCIA DE MISLATA</p>
      <p>J.V. 1185/2025 • Procuradora: Isabel Luzzy</p>
    </div>
  </div>

  <div class="bg-rose-900/10 p-4 rounded-lg border border-rose-900/30 text-sm">
    <p><strong>DIGO:</strong> Que mediante el presente escrito interpongo RECURSO DE REPOSICIÓN contra el Decreto de admisión de la demanda, por infracción del artículo 43 de la LEC (Prejudicialidad Civil).</p>
  </div>

  <h3 class="text-lg font-bold text-rose-400 mt-4">ALEGACIONES</h3>

  <p><strong>PRIMERO.- Identidad de la controversia.</strong><br>
  El actor reclama cantidades derivadas de un préstamo hipotecario solidario sobre la vivienda de Quart de Poblet. Sin embargo, la naturaleza de dicho préstamo, la titularidad real de los fondos y la liquidación de la sociedad conyugal se están discutiendo YA en el <strong>Juzgado de Picassent (P.O. 715/2024)</strong>.</p>

  <p><strong>SEGUNDO.- Prejudicialidad Civil (Art. 43 LEC).</strong><br>
  Para resolver si la Sra. Jiménez debe pagar estas cuotas, primero hay que determinar en Picassent si existe un crédito a favor del Sr. Rodríguez o si, por el contrario, es él quien debe dinero a mi mandante tras la liquidación del patrimonio común.</p>
  
  <div class="pl-4 border-l-2 border-rose-800 italic text-slate-400">
    "No tiene sentido condenar aquí al pago de unas cuotas aisladas cuando la liquidación global podría arrojar un saldo favorable a la demandada."
  </div>

  <h3 class="text-lg font-bold text-rose-400 mt-4">SUPLICO AL TRIBUNAL</h3>
  <p>Que se revoque el Decreto de admisión y se acuerde el <strong>SOBRESEIMIENTO Y ARCHIVO</strong> o, subsidiariamente, la <strong>SUSPENSIÓN</strong> del presente juicio hasta que recaiga sentencia firme en el procedimiento de Picassent.</p>
</div>
`;

export const OPOSICION_RECURSO_MISLATA_HTML = `
<div class="legal-doc space-y-6 text-justify">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-emerald-500 font-serif tracking-wide">OPOSICIÓN AL RECURSO DE REPOSICIÓN</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>Defensa: Oscar Javier Benita Godoy</p>
      <p>Asunto: Oposición a la suspensión del juicio</p>
    </div>
  </div>

  <p><strong>AL JUZGADO:</strong> Dña. ROSA CALVO BARBER, en nombre de D. JUAN RODRÍGUEZ CRESPO, DIGO:</p>

  <h3 class="text-lg font-bold text-emerald-400 mt-4">MOTIVOS DE OPOSICIÓN</h3>

  <p><strong>PRIMERO.- Inexistencia de Prejudicialidad. Objetos diferentes.</strong><br>
  La parte contraria confunde la "liquidación del régimen económico" (Picassent) con el "pago de deudas vencidas y exigibles" (Mislata).</p>
  <ul class="list-disc pl-5 mt-2 space-y-2 text-slate-300">
    <li><strong>En Picassent:</strong> Se discute la división de los inmuebles y las compensaciones por uso o pagos pasados.</li>
    <li><strong>En Mislata:</strong> Se reclaman cuotas hipotecarias generadas <strong>DESPUÉS</strong> de la separación (desde Octubre 2023), que el banco gira mensualmente y que la demandada ha dejado de pagar unilateralmente.</li>
  </ul>

  <p><strong>SEGUNDO.- Riesgo de Ejecución Hipotecaria.</strong><br>
  La suspensión del procedimiento causaría un perjuicio irreparable. Si mi mandante no paga el 100% de la cuota (como está haciendo), el banco ejecutará la vivienda. La demandada pretende paralizar el cobro para seguir incumpliendo su obligación con la entidad bancaria a costa de mi representado.</p>

  <div class="bg-emerald-900/10 p-4 rounded-lg border-l-4 border-emerald-500 my-4">
    <p class="font-bold text-emerald-400">ARGUMENTO CLAVE:</p>
    <p>Son deudas autónomas, líquidas y vencidas. El artículo 43 LEC exige que la decisión de un pleito sea "necesaria" para el otro. Aquí no lo es: la obligación de pago al banco existe independientemente de cómo liquiden sus bienes en el futuro.</p>
  </div>

  <h3 class="text-lg font-bold text-emerald-400 mt-4">SUPLICO</h3>
  <p>Que se desestime el recurso de reposición, se declare inexistente la prejudicialidad y continúe el procedimiento hasta sentencia.</p>
</div>
`;

export const CONTESTACION_MISLATA_HTML = `
<div class="legal-doc space-y-6 text-justify">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-slate-200 font-serif tracking-wide">CONTESTACIÓN A LA DEMANDA (CONTRARIA)</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>J.V. 1185/2025 • Parte Demandada</p>
    </div>
  </div>

  <p><strong>DIGO:</strong> Que contesto a la demanda oponiéndome íntegramente a la reclamación de <strong>8.550 Euros</strong>.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-4">HECHOS Y FUNDAMENTOS</h3>

  <p><strong>PRIMERO.- Sobre la Litispendencia (Art. 410 LEC).</strong><br>
  Se reitera la excepción procesal. No se puede juzgar este asunto aisladamente.</p>

  <p><strong>SEGUNDO.- Falta de Legitimación Activa.</strong><br>
  El Sr. Rodríguez no está legitimado para reclamar el 50% de las cuotas mientras no se liquide la sociedad de gananciales/comunidad en Picassent. Hasta que no se haga el balance final, no se sabe quién debe a quién.</p>

  <p><strong>TERCERO.- Negación de la Deuda.</strong><br>
  Mi mandante niega adeudar cantidad alguna. Los pagos que el actor dice haber realizado se han hecho con fondos que, en origen, pertenecían a la familia o debían compensarse con el uso exclusivo que él hace de otros bienes.</p>

  <h3 class="text-lg font-bold text-slate-200 mt-4">SUPLICO</h3>
  <p>Que se desestime íntegramente la demanda, con imposición de costas al actor.</p>
</div>
`;

export const PRUEBA_JUAN_MISLATA_HTML = `
<div class="legal-doc space-y-6">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-emerald-500 font-serif tracking-wide">NUESTRA PROPOSICIÓN DE PRUEBA</h2>
    <div class="text-sm text-slate-400 mt-2 space-y-1 font-mono">
      <p>Prueba propuesta por D. Juan Rodríguez</p>
    </div>
  </div>

  <div class="space-y-6">
    <div class="border-l-4 border-emerald-500 pl-4">
      <h4 class="font-bold text-emerald-400 mb-1">1. DOCUMENTAL (Oficios Bancarios)</h4>
      <p class="text-slate-300 text-sm mb-2">Se libre oficio a <strong>CAIXABANK</strong> (Oficina Aldaya, Av. Blasco Ibáñez 21) para que certifique:</p>
      <ul class="list-disc pl-5 text-slate-400 text-sm">
        <li>El ingreso realizado por mi representado el 25/04/2024 por importe de 562€, identificando al ordenante.</li>
        <li>Que las cuotas reclamadas han sido abonadas exclusivamente desde la cuenta del Sr. Rodríguez tras la fecha de corte.</li>
      </ul>
    </div>

    <div class="border-l-4 border-emerald-500 pl-4">
      <h4 class="font-bold text-emerald-400 mb-1">2. TESTIFICAL</h4>
      <p class="text-slate-300 text-sm">Declaración de <strong>Dña. SILVIA TORRENTÍ JIMÉNEZ</strong>, empleada de CaixaBank.</p>
      <p class="text-xs text-slate-500 mt-1">Justificación: Tiene conocimiento directo de la gestión de los pagos y de quién acudía a la sucursal a realizar los ingresos para evitar el impago.</p>
    </div>

    <div class="border-l-4 border-emerald-500 pl-4">
      <h4 class="font-bold text-emerald-400 mb-1">3. AVERIGUACIÓN PATRIMONIAL</h4>
      <p class="text-slate-300 text-sm">Consulta al Punto Neutro Judicial (PNJ) y TGSS sobre Dña. Vicenta Jiménez Vera.</p>
      <p class="text-xs text-slate-500 mt-1">Objeto: Acreditar su solvencia y desmontar la alegación de "asfixia económica" o falta de recursos para contribuir a la hipoteca.</p>
    </div>
  </div>
</div>
`;

export const PRUEBA_VICENTA_MISLATA_HTML = `
<div class="legal-doc space-y-6">
  <div class="text-center pb-6 border-b border-slate-700/50">
    <h2 class="text-2xl font-bold text-rose-500 font-serif tracking-wide">PRUEBA PROPUESTA POR LA CONTRARIA</h2>
  </div>

  <div class="space-y-6">
    <div class="border-l-4 border-rose-500 pl-4">
      <h4 class="font-bold text-rose-400 mb-1">1. OFICIO A CAIXABANK</h4>
      <p class="text-slate-300 text-sm">Solicita certificación de "Cuotas vencidas y pendientes de pago" del préstamo nº 9620.299-687761-04.</p>
    </div>

    <div class="border-l-4 border-rose-500 pl-4">
      <h4 class="font-bold text-rose-400 mb-1">2. REQUERIMIENTO A D. JUAN RODRÍGUEZ</h4>
      <p class="text-slate-300 text-sm">Solicita que el actor aporte:</p>
      <ul class="list-disc pl-5 text-slate-400 text-sm mt-1">
        <li><strong>Contratos de Arrendamiento</strong> de la vivienda de Aldaia (Av. Dos de Mayo).</li>
        <li>Justificantes de cobro de rentas.</li>
        <li>Facturas de suministros de dicha vivienda.</li>
      </ul>
      <p class="text-xs text-rose-300 mt-2 italic">Objetivo contrario: Intentar probar que Juan tiene ingresos extra por alquileres que deberían compensar la hipoteca.</p>
    </div>
  </div>
</div>
`;

// ACTUALIZACIÓN DEL MAPA
export const LEGAL_DOCS_MAP: Record<string, string> = {
  // PICASSENT
  'demanda-picassent': DEMANDA_PICASSENT_HTML,
  'contestacion-picassent': CONTESTACION_PICASSENT_HTML,
  
  // MISLATA (Textos Íntegros)
  'recurso-reposicion-mislata': RECURSO_REPOSICION_MISLATA_HTML,
  'oposicion-mislata': OPOSICION_RECURSO_MISLATA_HTML,
  'contestacion-mislata': CONTESTACION_MISLATA_HTML,
  'prueba-juan-mislata': PRUEBA_JUAN_MISLATA_HTML,
  'prueba-vicenta-mislata': PRUEBA_VICENTA_MISLATA_HTML,
};
