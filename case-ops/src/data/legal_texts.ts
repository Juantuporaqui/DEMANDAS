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
