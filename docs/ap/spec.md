CASE OPS • AUDIENCIA PREVIA — CENTRO DE MANDO
ESPECIFICACIÓN DEFINITIVA (REDISEÑO) • P.O. 715/2024 • JPI Nº 1 PICASSENT
Documento operativo para implementación por Codex (React/TS/Tailwind). Versión: 1.0 • Fecha: 27/02/2026

1. Principios no negociables
•	NO INVENTAR: no se crean hechos del caso, importes, fechas, documentos, ni IDs jurisprudenciales (ROJ/ECLI/STS/SAP/AAP) fuera de los adjuntos/datos del repositorio.
•	HECHO ≠ OPINIÓN: cada módulo separa explícitamente HECHOS / HIPÓTESIS-ESTRATEGIA / PRUEBA.
•	PRECLUSIÓN Y ORDEN PÚBLICO: el UI no debe empujar a pedir en sala lo que sea típicamente extemporáneo; se muestra como “diagnóstico” y queda fuera del compositor salvo activación consciente.
•	FUENTES AUTORITATIVAS: (i) PDFs AP2/AP3 para no perder contenido; (ii) Guion sala V5 (DOCX); (iii) SENTENCIAS (DOCX); (iv) BOE (extractos legales) solo para mostrar texto en emergentes.
•	CITAS EMERGENTES: toda referencia normativa/jurisprudencial debe abrir un emergente con el texto/extracto correspondiente; si no consta, mostrar “NO CONSTA” y no inventar.
2. Objetivo de producto y criterios de aceptación
•	Usabilidad en sala (AP): rápido, legible, copiable, y con control de daños (preclusión, acotación del objeto, estándar probatorio).
•	Estructura igual a la AP: SANEAMIENTO → HECHOS → PRUEBA → CIERRE (LEC 414–430).
•	Tres planos: SALA (breve), COMPLETO (texto íntegro), EXPLICATIVO (notas + riesgos + checklists).
•	No saturación visual: citas y notas colapsadas; por defecto manda el guion.
•	Exportables: imprimir A4; teleprónter fullscreen; copia al portapapeles con 1 clic.
•	Regresión cero de contenido: todo texto canónico accesible (aunque esté en pestañas/colapsado).
3. Arquitectura de información de la página
Guía secuencial que replica la AP. Flujo con anclas, no tarjetas dispersas.
3.1 Layout (desktop)
•	Header sticky (64px): título, órgano/fecha/hora, botones operativos (Teleprónter, Imprimir, Copiar 90s, Checklist).
•	Columna izquierda (280px): Timeline AP (Saneamiento/Hechos/Prueba/Cierre) + anclas internas + estado (pendiente/hecho).
•	Columna principal: secciones por fase con: objetivo, guion breve, guion íntegro (colapsado), checklist y prueba.
•	Sin tercera columna: las notas van dentro de acordeones por fase.
3.2 Layout (móvil)
•	Header sticky con botones compactos.
•	Timeline como pestañas horizontales.
•	Teleprónter y citas en modal fullscreen.
4. Diseño visual (tokens obligatorios)
•	Fondo #F8FAFC; tarjetas blancas con borde #E2E8F0.
•	Tipografía Inter/sistema: H1 20–22px, H2 16–18px, cuerpo 14–15px, notas 12–13px.
•	Espaciado: base 8px; padding tarjeta 16px; gaps 12–16px.
•	Semántica mínima: OK verde suave, Riesgo ámbar, Precluido gris, Crítico rojo tenue.
•	Modo Sala: oculta notas; deja solo frases de sala y peticiones; ‘Ver detalle’ abre el resto.
5. Sistema de citas emergentes
Toda cita (norma o jurisprudencia) aparece como chip clickable. Al pulsar, se abre un emergente con extracto (y aviso si NO_VERIFICADA).
5.1 UX
•	Nada de tooltips largos automáticos; solo click/tap.
•	Emergente con: Título, Fuente, Extracto, Notas, botón Copiar.
•	Si la cita no está en dataset → chip muestra “NO CONSTA” y no se inventa texto.
5.2 Esquema de datos
type Citation = {
  id: string;
  kind: "LEC" | "CC" | "JURIS" | "DOC_INTERNO";
  label: string;                 // chip
  status: "VERIFICADA" | "NO_VERIFICADA";
  source: { name: string; ref: string; };
  extract: string;               // texto en emergente
  notes?: string;
};
6. Preclusión y diagnósticos (sin ensuciar la sala)
No abrir la página con competencia territorial. Se ubica al final de SANEAMIENTO en bloque colapsado.
•	Competencia territorial: colapsada, fuera del compositor por defecto.
•	Solo activable con confirmación explícita del usuario (declinatoria o fuero imperativo).
7. CONTENIDO CANÓNICO — TEXTOS ÍNTEGROS
7.1 SALA (breve) — textos finales copiabes
GUION 90s (SALA) — COPIAR
Señoría, con la venia. Antes de entrar en el fondo, esta parte solicita saneamiento y delimitación del objeto (arts. 416 y ss. LEC):
(i) depuración por indebida acumulación (arts. 71–73 y 402 LEC);
(ii) corrección de defectos de claridad y concreción (arts. 424–425 LEC);
(iii) fijación del ámbito temporal y prescripción por partida, con carga de acreditar interrupción fehaciente (arts. 1964.2 y 1973 CC).
Pedimos acotar el objeto por bloques y exigir para cada partida fecha, cuenta, ordenante y soporte íntegro, con constancia expresa en acta.
En prueba, solicitamos oficios bancarios, exhibición y pericial contable (arts. 328–330 y 339 LEC) para reconstrucción íntegra y saldo neto, evitando dobles cómputos.
Subsidiariamente, que cualquier cifra solo se determine tras depuración completa, conforme a la carga probatoria del art. 217 LEC.
ACTA — PETICIONES (PRINCIPAL) — COPIAR
Al amparo de los arts. 416 y ss. LEC, esta parte interesa:
1) que se declare la indebida acumulación o, subsidiariamente, se depure el objeto por bloques (división de cosa común vs. reclamación dineraria) y se excluyan partidas no conectadas;
2) que se requiera concreción por partidas con soporte íntegro (no recortes);
3) que se fije el marco temporal y la prescripción por tramos, con carga de la actora de acreditar actos interruptivos fehacientes.
Se interesa constancia expresa en acta.
ACTA — PETICIONES (SUBSIDIARIO) — COPIAR
Subsidiariamente:
a) mandato de concreción inmediata por partidas (fecha, cuenta, ordenante, concepto y justificante íntegro);
b) condicionamiento de la eficacia probatoria de documental electrónica parcial a corroboración por extractos íntegros/certificados;
c) oficios bancarios y exhibición (arts. 328–330 LEC) y pericial contable (art. 339 LEC) para reconstrucción y saldo neto;
d) protesta a efectos del art. 446 LEC frente a cualquier inadmisión de prueba o denegación de saneamiento que genere indefensión.
7.2 COMPLETO (V5) — texto íntegro para pestaña
Volcar sin reescritura. Divide por fases con anclas internas.
  ---
  ---
  Ahora el guión definitivo completo:
  ---
  GUIÓN DEFINITIVO DE AUDIENCIA PREVIA
  P.O. 715/2024 • JPI nº 1 de Picassent • 10/03/2026 • 09:45h
  Demandado: Juan Rodríguez Crespo
  Versión final — uso exclusivo en sala
  ---
  ---
  FASE 1 — CUESTIONES PROCESALES PREVIAS
  Tomar la palabra antes que la actora • Art. 416 LEC
  ---
  APERTURA
  "Señoría, con la venia del Juzgado, antes de entrar en cualquier otra cuestión, esta parte desea someter a consideración tres
  cuestiones procesales previas al amparo del artículo 416 de la Ley de Enjuiciamiento Civil, cuya resolución afecta a la propia
  viabilidad del procedimiento en su forma actual."
  ---
  ---
  ---
  ---
  ---
  FASE 2 — DEPURACIÓN DEL OBJETO, PASIVO Y MALA FE
  ---
  ---
  ---
  ---
  ---
  ---
  FASE 3 — PRESCRIPCIÓN
  Mantener la excepción de la contestación • Arts. 1964.2 CC + DT 5ª Ley 42/2015
  ---
  ---
  ---
  ---
  FASE 4 — HECHOS CONTROVERTIDOS
  Arts. 426-427 LEC • Proponer en bloque y defender cada uno
  ---
  "Esta parte, al amparo del artículo 426 LEC, estima que los hechos controvertidos que deben ser objeto de prueba son los
  siguientes:"
  HC-01 — Cuantía exacta objeto de pretensión (discrepancia: letra 216.677,08€ vs. cifra 212.677,08€)
  HC-02 — Condición obligacional de cada parte en el préstamo de 22/08/2006 y en la subrogación de 18/06/2009 (titularidad, condición
   deudor hipotecante vs. deudor no hipotecante, solidaridad, entidad acreedora actual)
  HC-03 — Destino real del capital de 310.000€ (compra parcelas Montroy y Godelleta + construcción chalet vs. tesis de financiación
  de bien privativo del demandado — véase declaración AEAT actora, 14/06/2013)
  HC-04 — Saldo vivo del préstamo hipotecario y carga sobre vivienda privativa del demandado (importe actual del pasivo: 182.512,64€
  — nota simple registral — como pasivo vinculado al activo común objeto de división)
  HC-05 — Procedencia de incluir el pasivo hipotecario en la liquidación (si cualquier distribución del producto de la venta de los
  bienes comunes debe destinar, con carácter previo y preferente, los fondos necesarios para la cancelación del préstamo que gravó la
   vivienda privativa del demandado como garantía de la adquisición de dichos bienes comunes)
  HC-06 — Naturaleza de las cuentas comunes y origen de los ingresos (si se nutrieron exclusivamente de nómina/pensión de la actora o
   existieron aportaciones relevantes del demandado: nóminas superiores, ingresos de actividades económicas, rendimientos
  patrimoniales, agrarios y otros)
  HC-07 — Ordenante real de las transferencias 2019-2022 (si la atribución de pagos a la actora es correcta, en particular el ingreso
   de 18.000€ en septiembre de 2008 que se atribuye)
  HC-08 — Integridad de los documentos bancarios aportados (si las capturas de pantalla son completas y sin editar, y si permiten
  identificar el ordenante real, la cuenta de cargo y la trazabilidad de cada movimiento)
  HC-09 — Disposiciones de septiembre de 2022: origen, destino y concepto (32.000€ del demandado y 38.500€ de la actora: cuentas de
  procedencia, cuentas receptoras, naturaleza jurídica como distribución parcial de fondos comunes en contexto de ruptura)
  HC-10 — Disposiciones de septiembre de 2022: finalidad económica y efecto sobre cualquier crédito de reembolso (si responden a un
  ajuste de saldos en contexto de ruptura que neutraliza o compensa el crédito reclamado)
  HC-11 — Piso Artur Piera: préstamo de adquisición, reforma y financiación (si el préstamo era exclusivo de la actora o conjunto, si
   la reforma fue acometida y financiada por el demandado, y el impacto de ambos factores en el producto de la venta de 120.000€)
  HC-12 — IBI 2013-2019: pago efectivo y ordenante (si existe justificante de pago con identificación del ordenante para cada
  ejercicio, distinguiendo entre recibo emitido y abono acreditado)
  HC-13 — Pagos hipotecarios agosto 2022 - octubre 2023 (si la actora los realizó por obligación propia frente a la entidad y si
  formuló reclamación fehaciente o reserva del derecho de repetición en ese momento)
  HC-14 — Incumplimiento de la actora desde octubre de 2023 (si cesó el pago de su 50% y cuantificación de lo asumido unilateralmente
   por el demandado desde entonces, objeto del procedimiento de Mislata)
  HC-15 — Doble imputación de conceptos (si las partidas reclamadas solapan la cancelación del principal con cuotas que incorporan
  amortización de ese mismo principal, y cuantificación del eventual exceso)
  HC-16 — Maquinaria agrícola: adquisición, financiación e ingresos generados (si fue adquirida con rendimientos de la explotación
  agrícola común, si generó rendimientos adicionales percibidos por la actora, y la procedencia de reclamar el gasto sin computar los
   ingresos obtenidos)
  HC-17 — Explotación agrícola y turística: ingresos percibidos por la actora (rendimientos de la explotación agrícola y del
  alojamiento turístico del chalet en el período relevante, y si han sido descontados de la reclamación)
  HC-18 — Prescripción: existencia de actos interruptivos fehacientes (si constan reclamaciones extrajudiciales concretas,
  identificadas e inequívocas respecto de cada partida reclamada anterior al plazo legal)
  HC-19 — Contradicción procesal entre Mislata y Picassent (si la condición de deudora no hipotecante alegada en el verbal de Mislata
   es compatible con la pretensión de reembolso de las mismas cuotas en este procedimiento)
  HC-20 — Uso gratuito de vivienda privativa: valor económico no computado (si el uso de la vivienda privativa del demandado durante
  26 meses, noviembre 2022 - noviembre 2024, con valor de mercado de 980€/mes = 25.480€, ha sido computado en la liquidación
  propuesta y si procede su consideración a efectos de depuración del objeto)
  ---
  FASE 5 — PROPOSICIÓN DE PRUEBA
  Art. 429 LEC
  ---
  5.1 — DOCUMENTAL PROPIA
  "Documental aportada con la contestación a la demanda, documentos uno a veintidós, que esta parte da por reproducida. Se destaca
  especialmente el documento cuatro: declaración de la actora ante la AEAT de 14 de junio de 2013, en la que ella misma afirma el
  destino real del préstamo de 310.000 euros."
  5.2 — INTERROGATORIO DE LA PARTE ACTORA
  "Interrogatorio de Dña. Vicenta Jiménez Vera al amparo del artículo 301 LEC, sobre los siguientes hechos: ordenante real de las
  transferencias impugnadas; finalidad de las disposiciones de septiembre de 2022; destino real del préstamo hipotecario;
  rendimientos percibidos de la explotación agrícola y turística; contenido de su posición procesal en el verbal de Mislata; y
  existencia de reclamaciones extrajudiciales previas a la demanda."
  Preguntas añadidas (art. 301 LEC):
  1. ¿Ha percibido alguna indemnización o ayuda del Consorcio de Compensación de Seguros por daños de la DANA en el chalet de
  Montroy?
  2. ¿Qué importe ha percibido?
  3. ¿Ha destinado esos fondos a la reparación del chalet?
  4. ¿Ha percibido la ayuda de reposición de material escolar para los hijos?
  5. ¿Ha compartido el 50% de esa ayuda con el padre, siendo la custodia compartida y los gastos a medias?
  5.3 — PERICIAL CONTABLE JUDICIAL
  "Pericial contable. El debate central es de naturaleza contable y bancaria, con cuentas canceladas, documentación parcialmente
  aportada e impugnada, y un período de análisis de casi veinte años con conceptos heterogéneos. Esta complejidad hace imprescindible
   la intervención de un perito especializado.
  Se interesa la designación de perito contable judicial por insaculación, conforme al artículo 339.5 LEC, con los siguientes
  términos de referencia:
  - Identificar las cuentas bancarias relevantes y sus titulares en el período 2005-2024
  - Reconstruir los movimientos con identificación del ordenante real de cada operación
  - Determinar el origen privativo o común de los fondos en cada pago reclamado
  - Detectar dobles cómputos entre cancelaciones de principal y cuotas de amortización
  - Calcular el saldo neto de aportaciones de cada parte a las cuentas comunes
  - Cuantificar los rendimientos de la explotación agrícola y turística percibidos por cada parte
  - Segmentar los resultados por períodos a efectos de prescripción
  - Calcular el impacto del pasivo hipotecario pendiente sobre la liquidación neta de la comunidad
  Subsidiariamente, y para el caso de que no se designe perito judicial, se propone pericial de parte."
  5.4 — OFICIOS BANCARIOS
  "Oficios a Caixabank, sucursal 5284, Calle Blasco Ibáñez nº 21, Aldaya, y a BBVA, para que aporten:
  - Extractos íntegros certificados de la cuenta IBAN ES32 2100 5284 9122 0039 0906, desde apertura hasta cancelación, con
  identificación del ordenante en cada movimiento
  - Extractos íntegros certificados de la cuenta BBVA terminada en 9397, desde 2005 hasta su cancelación en julio de 2024, con
  identificación del ordenante
  - Certificado de la condición contractual exacta de cada titular en el préstamo asociado a la cuenta Caixabank: deudor hipotecante,
   deudor no hipotecante, fiador u otra"
  5.5 — OFICIO AL JUZGADO DE PRIMERA INSTANCIA DE MISLATA
  "Oficio al Juzgado de Primera Instancia de Mislata para que remita testimonio del estado procesal del Juicio Verbal entre las
  mismas partes sobre las cuotas hipotecarias del mismo préstamo, incluida la posición procesal alegada por la demandada en ese
  procedimiento, a efectos de acreditar la contradicción procesal denunciada."
  5.6 — OFICIO AL REGISTRO DE LA PROPIEDAD
  "Oficio al Registro de la Propiedad correspondiente para nota simple actualizada de: los inmuebles objeto de división, con
  indicación de cargas; y la vivienda privativa del demandado en Quart de Poblet, con indicación de la carga hipotecaria vigente y su
   importe."
  5.7 — OFICIO A LA NOTARÍA
  "Oficio al Notario autorizante de la escritura de préstamo hipotecario de 22 de agosto de 2006 y al Notario autorizante de la
  subrogación de 18 de junio de 2009, para que aporten copia íntegra certificada de ambas escrituras, dado que las aportadas por la
  actora están incompletas."
  ---
  FASE 6 — CIERRE, RESERVAS Y PROTESTA FINAL
  ---
  6.1 — RESERVA DE ACCIONES
  "Esta parte hace constar expresamente la reserva de acciones respecto de:
  Primero: el valor del uso gratuito de la vivienda privativa del demandado durante veintiséis meses, estimado en 25.480 euros al
  precio de mercado actual.
  Segundo: las cuotas hipotecarias abonadas unilateralmente por el demandado desde agosto de 2022, objeto del procedimiento de
  Mislata.
  Tercero: cualquier cantidad que resulte acreditada tras la depuración contable, incluyendo la mayor aportación del demandado a las
  cuentas comunes documentada en el extracto BBVA.
  Cuarto: el derecho a reclamar la contribución de la actora al pasivo hipotecario pendiente en la forma y cuantía que resulte de la
  liquidación integral de la comunidad.
  Esta reserva se formula al amparo del artículo 400.2 LEC."
  ---
  6.2 — PROTESTA FINAL
  "Para el supuesto de que el Juzgado no admita las cuestiones procesales de la Fase 1, no aprecie los defectos denunciados, o no
  admita alguno de los medios de prueba propuestos, esta parte hace expresa protesta al amparo del artículo 446 LEC, a los efectos
  del recurso que en su día se interponga."
  ---
  6.3 — SUBSANACIÓN
  "Al amparo del artículo 231 LEC, esta parte manifiesta su voluntad de subsanar cualquier defecto en que pudiera haber incurrido en
  sus actuaciones procesales."
  ---
  RESÚMENES PARA SALA
  ---
PRIORIDAD 1: Verificar si Vicenta ha presentado algo vía LexNET
  Que el abogado (o la procuradora Rosa Calvo) compruebe HOY si ha entrado algún escrito de la actora en respuesta al requerimiento.
  Si no hay nada a cierre de hoy → incumplimiento consumado.
  PRIORIDAD 2: Las 4 correcciones del guión que NO son negociables
  Dile al abogado exactamente esto:
  A) En sala NO decir "Ley 8/2021". Donde el guión dice "tras la reforma operada por la Ley 8/2021", decir simplemente: "conforme al
  vigente artículo 250.1, ordinal decimosexto, de la LEC". Si le preguntan qué norma lo introdujo: "RDL 6/2023". Pero que no abra él
  ese tema.
  B) NO citar la "STS de 17 de marzo de 2016" a menos que pueda verificar con ECLI que trata de inadecuación del procedimiento. Si no
   puede verificarla antes del 03/03, que la elimine y diga: "La inadecuación por infracción de normas imperativas de cauce es
  materia de orden público procesal, apreciable en la audiencia previa conforme al artículo 416.1.4ª LEC. La doctrina del Tribunal
  Supremo establece que los procesos especiales del artículo 250.1 son cauces imperativos no disponibles por las partes." El
  argumento se sostiene sin cita concreta.
  C) NO apoyarse en el art. 422 LEC como eje central. El 422 es para inadecuación por cuantía y además presupone alegación en
  contestación (que no se hizo). El ancla es el art. 416.1.4ª LEC (que contempla expresamente esta cuestión en la AP). El 422 puede
  mencionarse como refuerzo secundario pero no como argumento principal.
  D) NO decir "arts. 1895 y ss. CC (cobro de lo indebido) + doctrina jurisprudencial (enriquecimiento injusto) = enriquecimiento injusto". El 1901 CC es presunción de error en el pago, no enriquecimiento injusto.
  Decir en sala: "prohibición del enriquecimiento injusto conforme a la doctrina jurisprudencial consolidada del Tribunal Supremo".
  Si se quiere base de Código Civil: "arts. 1895 y siguientes, cobro de lo indebido".
  E) Pedir "AUTO" no "decreto". En el art. 21.2 LEC, para allanamiento parcial a pretensiones separables, se pide auto del tribunal,
  no decreto del LAJ.
  PRIORIDAD 3: Estrategia para los 5.400€ + 1.000€ en la AP
  Esto es lo nuevo y lo que puede cambiar el tono de la audiencia:
  Los hechos:
  - Vicenta ha percibido ~5.400€ del Consorcio de Compensación de Seguros por daños de la DANA en el chalet de Montroy (bien COMÚN)
  - Ha percibido ~1.000€ de ayuda de reposición de material escolar (con custodia compartida y gastos a medias)
  - No ha comunicado ninguna de estas percepciones ni al copropietario ni al juzgado
  - El juzgado la requirió expresamente para que aportara esta información y (previsiblemente) no ha cumplido
  Lo que NO puedes hacer: aportar el dato del Consorcio directamente porque lo obtuviste por una vía que no es procesalmente limpia.
  Lo que SÍ puedes hacer:
  En la AP, articular esto en 3 movimientos:
  Movimiento 1 — Denunciar el incumplimiento del requerimiento:
  "Señoría, por providencia de 8 de enero de 2026, este Juzgado requirió expresamente a la parte actora para que aportara
  documentación sobre ayudas, subvenciones o indemnizaciones percibidas en relación con bienes comunes, incluidas las vinculadas a
  reclamaciones por daños del chalet de Montroy. El plazo venció el 24 de febrero de 2026. A la fecha de esta audiencia, la actora no
   ha aportado documentación alguna en cumplimiento de dicho requerimiento. Esta parte interesa que quede constancia del
  incumplimiento y solicita que se reitere el requerimiento con apercibimiento, o subsidiariamente, que se libre oficio directo al
  organismo correspondiente."
  Movimiento 2 — Pedir oficio al Consorcio de Compensación de Seguros:
  En la proposición de prueba (Fase 5 del guión), añadir un nuevo oficio:
  "Oficio al Consorcio de Compensación de Seguros para que certifique si Dña. Vicenta Jiménez Vera ha percibido indemnizaciones o
  ayudas por daños causados por la DANA en el inmueble sito en C/ Collao nº 10, Urbanización Balcón de Montroy, término municipal de
  Montroy (Valencia), indicando: importe, fecha de abono, concepto, y si consta justificación del destino de los fondos."
  Esto es perfectamente legítimo como medio de prueba: no necesitas decir cómo lo sabes, solo pides que el Consorcio lo certifique.
  El juzgado puede librarlo de oficio o a instancia de parte.
  Movimiento 3 — Interrogatorio de Vicenta:
  Añadir al interrogatorio (art. 301 LEC) estas preguntas:
  1. ¿Ha percibido alguna indemnización o ayuda del Consorcio de Compensación de Seguros por daños de la DANA en el chalet de
  Montroy?
  2. ¿Qué importe ha percibido?
  3. ¿Ha destinado esos fondos a la reparación del chalet?
  4. ¿Ha percibido la ayuda de reposición de material escolar para los hijos?
  5. ¿Ha compartido el 50% de esa ayuda con el padre, siendo la custodia compartida y los gastos a medias?
  Si miente bajo juramento → art. 304 LEC (ficta confessio) + potencial responsabilidad penal.
  Si dice la verdad → queda acreditada la apropiación.
  Si se niega a contestar → art. 307 LEC, el tribunal puede considerar los hechos como admitidos.
  PRIORIDAD 4: Nuevo hecho controvertido (HC-21)
  Añadir al listado de hechos controvertidos del guión:
  HC-21 — Percepción por la actora de ayudas públicas e indemnizaciones por daños de la DANA en bienes comunes (chalet de Montroy):
  existencia, importe, organismo pagador, destino dado a los fondos, y su integración en la liquidación de la comunidad. Igualmente,
  percepción de ayuda de reposición de material escolar y su reparto conforme al régimen de custodia compartida y gastos compartidos
  vigente.
  PRIORIDAD 5: Impacto de la ayuda escolar de 1.000€
  Los 1.000€ de reposición de material escolar son un argumento distinto pero útil:
  - Custodia compartida = gastos a medias
  - Vicenta percibe 1.000€ de ayuda escolar y no comparte el 50% con Juan
  - Son 500€ que te corresponden
  - No tiene la entidad de los 5.400€ pero refuerza el patrón de apropiación unilateral que estás construyendo (38.500€ de septiembre
   2022, 25.480€ de uso de vivienda, 5.400€ del Consorcio, 1.000€ de ayuda escolar...)
  El patrón es: Vicenta percibe fondos comunes o vinculados a bienes/gastos comunes y se los queda unilateralmente sin comunicarlo.
EL PROBLEMA DEL PASIVO: DIAGNÓSTICO LEGAL
  La trampa que identificas es real y tiene nombre jurídico: división de activo sin liquidación del pasivo vinculado. Si el juez
  ordena la venta del chalet y las parcelas sin pronunciarse sobre la hipoteca de 182.512,64€ que grava tu vivienda privativa como
  garantía de ese mismo préstamo, el resultado es:
  - Vicenta recibe ~150.000€ limpios de su mitad de la venta
  - Tú recibes ~150.000€ pero sigues debiendo 182.512,64€ en tu propiedad privada
  - Te queda un saldo neto negativo de ~32.000€
  - Y a partir de ahí: demandas mensuales de repetición para siempre
  Esto no es solo injusto. Es jurídicamente atacable desde varios frentes:
  Base legal del pasivo preferente:
  - Art. 393 CC: Los gastos de conservación de la cosa común son obligación de todos los partícipes en proporción a su cuota
  - Art. 395 CC: Si un copropietario se niega a contribuir a los gastos, puede ser compelido o forzado a ceder su parte
  - Art. 1404 CC por analogía (liquidación de gananciales): "Antes de proceder a la liquidación se pagarán las deudas" — la analogía
  con la comunidad ordinaria es aceptada por la jurisprudencia cuando existe un pasivo vinculado al activo común
  - Prohibición del enriquecimiento injusto (arts. 1895 y ss. CC (cobro de lo indebido) + doctrina jurisprudencial (enriquecimiento injusto) + doctrina TS): nadie puede beneficiarse del activo de una comunidad
  eludiendo el pasivo que lo generó
  - Art. 519 LEC y ss. (ejecución de sentencias que afectan a terceros): si el bien hipotecado es privativo del demandado, la
  ejecución hipotecaria recaería solo sobre él pese a que la deuda es común
  La solución procesal concreta:
  En la audiencia previa, al hablar de la división allanada, solicitar expresamente que cualquier auto de división o decreto de venta
   incluya como condición suspensiva o como carga previa: la cancelación del préstamo hipotecario con cargo a los primeros fondos
  obtenidos de la venta, antes de cualquier distribución entre las partes. Esto se llama pasivo preferente y es la única forma de no
  quedar atrapado en el ciclo de repetición.
  Si el juez no lo recoge en la AP, hay que hacerlo constar en la proposición de prueba (nota simple que acredita la carga) y en las
  conclusiones del juicio. No es reconvención: es condicionamiento de la ejecución de una pretensión que tú mismo allanaste.
  CHECKLIST DE ENTRADA — 30 MINUTOS ANTES
  - Contestación a la demanda — marcadas: página del allanamiento expreso + suplico final
  - Demanda — marcado: suplico (discrepancia 212.677€/216.677€) + todas las referencias a "hipoteca del Sr. Rodríguez"
  - Nota simple registral de la vivienda Lope de Vega — carga hipotecaria 182.512,64€ vigente
  - Escritura hipotecaria Kutxa 22/08/2006 + subrogación Barclays 18/06/2009
  - Documento AEAT (contestación requerimiento IRPF 2008, Vicenta, 14/06/2013) — destino del préstamo
  - Recibo hipoteca febrero 2025 (saldo deudor 182.512,64€)
  - Cualquier resolución del verbal de Mislata (admisión + recurso de revisión)
  - Tabla de partidas prescritas (impresa — dos copias)
  - Este guión (dos copias: abogado + Juan para seguimiento)
  1.1 — INADECUACIÓN DEL PROCEDIMIENTO: INDEBIDA ACUMULACIÓN
  Art. 416.1.4ª LEC • Arts. 73.1.2ª y 250.1.16 LEC
  "Primera cuestión. Inadecuación del procedimiento por indebida acumulación de acciones que deben ventilarse en procesos de
  diferente tipo.
  La actora ha acumulado en este juicio ordinario dos acciones cuyo cauce legal es incompatible. De un lado, la acción de división de
   cosa común de los inmuebles y muebles de los expositivos segundo y tercero de la demanda. Conforme al vigente artículo 250.1, ordinal decimosexto, de la LEC, esta acción debe tramitarse como juicio verbal especial conforme al artículo 250.1.16 LEC, con independencia de la cuantía;
   es un cauce imperativo por razón de la materia, no disponible por las partes. De otro lado, la acción de reintegro del artículo
  1358 CC, que por su cuantía corresponde al ordinario conforme al artículo 249.2 LEC.
  Esta acumulación infringe el artículo 73.1.2ª LEC, que prohíbe expresamente acumular acciones que deban ventilarse en procesos de
  diferente tipo por razón de la materia. La regla de absorción del artículo 73.2 LEC opera únicamente respecto de verbales por razón
   de cuantía; no alcanza a los procesos especiales del artículo 250.1, cuya especialidad procedimental es imperativa.
  Jurisprudencialmente, la STS de 5 de febrero de 2013 establece que los procesos especiales del artículo 250.1 LEC son cauces
  imperativos no disponibles por las partes. La inadecuación por infracción de normas imperativas de cauce es materia de orden público procesal, apreciable en la audiencia previa conforme al artículo 416.1.4ª LEC. La doctrina del Tribunal Supremo establece que los procesos especiales del artículo 250.1 son cauces imperativos no disponibles por las partes. Se interesa que el Juzgado aprecie la inadecuación y acuerde la tramitación separada de ambas acciones por sus respectivos cauces
  legales."
  ➜ Si el juez invoca que no se alegó en la contestación:
  "El artículo 416.1.4ª LEC contempla expresamente esta cuestión para la audiencia previa. La inadecuación por infracción de normas imperativas de cauce es materia de orden público procesal y debe ser examinada en este acto. La doctrina del Tribunal Supremo establece que los procesos especiales del artículo 250.1 son cauces imperativos no disponibles por las partes."
  ➜ Si el juez invoca el art. 73.2 LEC (absorción):
  "El artículo 73.2 absorbe el verbal cuando la diferencia es solo de cuantía. El artículo 250.1.16 no establece un verbal por
  cuantía: establece un proceso especial por razón de la materia, con tramitación propia introducida por el legislador en 2021. Si la
   absorción del 73.2 borrara esa especialidad, la reforma de 2021 carecería de cualquier efecto práctico."
  1.2 — AUTO DE ALLANAMIENTO: ARCHIVO DE LA ACCIÓN DE DIVISIÓN
  Art. 21.2 LEC • STS 19 de diciembre de 2006
  "Segunda cuestión, directamente ligada a la anterior.
  En la contestación a la demanda, esta parte formuló allanamiento expreso, total e incondicional a las pretensiones de división de
  cosa común de los inmuebles del expositivo segundo y de los bienes muebles del expositivo tercero A. Esas pretensiones no son
  objeto de controversia alguna en este procedimiento.
  El artículo 21.2 LEC es taxativo: si el allanamiento fuere parcial a pretensiones separables, el tribunal podrá dictar de inmediato
   auto acogiendo las pretensiones allanadas. La STS de 19 de diciembre de 2006 confirma que el allanamiento a pretensiones autónomas
   y separables produce un efecto procesal inmediato que no puede quedar en suspenso pendiente del resultado de las restantes
  pretensiones.
  La acción de división es perfectamente separable de la acción de reembolso: tienen distinta naturaleza jurídica, distinto
  fundamento legal y distinto cauce procesal. No existe razón legal ni procesal para mantenerlas conjuntas cuando una está allanada.
  Se interesa que el Juzgado dicte auto estimando las pretensiones de división de cosa común allanadas, con una precisión esencial
   que esta parte solicita expresamente y que desarrollará en la fase de hechos controvertidos: que dicho auto contemple la
  cancelación del pasivo hipotecario vinculado a la adquisición de los bienes comunes como condición previa a cualquier distribución
  del producto de la venta entre las partes.
  Si la actora de verdad quería dividir los bienes comunes —que es lo que dice la demanda— hoy puede tenerlo resuelto. El demandado
  lo acepta desde el primer día. Que esta audiencia se haya aplazado cinco veces en seis meses a instancia de quien dice querer
  urgentemente la división habla por sí mismo de cuál es el verdadero objetivo de mantener ambas acciones acumuladas."
  1.3 — DEFECTO FORMAL: DISCREPANCIA EN LA CUANTÍA
  Art. 416.1.5ª LEC • Art. 219 LEC
  "Tercera cuestión procesal. Defecto legal en el modo de proponer la demanda por discrepancia entre la cuantía expresada en letra y
  en cifra en el suplico.
  El suplico de la demanda solicita literalmente la condena al pago de, cito textualmente: 'DOSCIENTOS DIECISEIS MIL SEISCIENTOS
  SETENTA Y SIETE EUROS CON OCHO CÉNTIMOS, (212.677,08€)'. La cantidad en letra es doscientos dieciséis mil seiscientos setenta y
  siete euros; la cantidad en cifra es doscientos doce mil seiscientos setenta y siete euros. Diferencia: cuatro mil euros.
  El artículo 219 LEC exige que las condenas dinerarias sean líquidas y determinadas. Una pretensión con cuantía internamente
  contradictoria en el propio documento de demanda no cumple este requisito. Se interesa que la actora precise la cuantía exacta
  reclamada y que quede constancia en acta, con los efectos sobre la delimitación del objeto del proceso."
  1.4 — PROTESTA CAUTELAR PARA RECURSO
  "Para el supuesto de que el Juzgado no estime las cuestiones procesales planteadas, esta parte hace expresa protesta al amparo del
  artículo 446 LEC, reservándose el derecho a invocarlas en el recurso de apelación que en su día se interponga."
  2.1 — LA TRAMPA DEL ACTIVO SIN PASIVO: ARGUMENTO NUEVO Y ESENCIAL
  "Señoría, antes de entrar en la depuración del objeto de la reclamación de reembolso, esta parte debe poner de manifiesto una
  omisión estructural de la demanda que afecta directamente a la viabilidad y equidad de la pretensión de división.
  La demanda describe con detalle el activo de la comunidad: el chalet de Montroy, las parcelas de Godelleta, los bienes muebles.
  Pero omite deliberadamente el pasivo vinculado a ese activo.
  El préstamo de 310.000 euros con el que ambas partes adquirieron y construyeron esos bienes comunes tiene un saldo vivo actual de
  182.512,64 euros. Ese préstamo no grava registralmente los bienes comunes —que figuran libres de cargas en el Registro— sino la
  vivienda privativa del demandado en Quart de Poblet, aportada como garantía hipotecaria. Este hecho consta en la nota simple
  registral aportada con la contestación.
  Si el Juzgado ordenara la venta de los bienes comunes sin pronunciarse sobre el pasivo, el resultado sería el siguiente: la actora
  recibiría la mitad del producto de la venta de los bienes que el préstamo financió, y el demandado recibiría esa misma mitad pero
  con su vivienda privativa todavía gravada por 182.512,64 euros de un préstamo que financió, en su mayor parte, bienes que acaba de
  vender. Eso no es una liquidación: es un expolio encubierto.
  El artículo 393 del Código Civil establece que los gastos de conservación de la cosa común son obligación de todos en proporción a
  su parte. El artículo 395 obliga al copropietario renuente. La jurisprudencia del Tribunal Supremo y de esta misma Sala, por
  analogía con el artículo 1404 CC, exige que el pasivo vinculado al activo común sea liquidado antes de proceder a la distribución
  del activo neto.
  Por tanto, esta parte solicita expresamente que cualquier decreto de división o resolución que ordene la venta de los bienes
  comunes contenga el siguiente pronunciamiento: con carácter previo a cualquier distribución del producto de la venta entre las
  partes, se destinará la cantidad necesaria a la cancelación íntegra del préstamo hipotecario identificado como IBAN ES32 2100 5284
  9122 0039 0906, cuyo saldo vivo asciende a 182.512,64 euros, liberando así la garantía hipotecaria que actualmente grava la
  vivienda privativa del demandado.
  Si no se procede así, el demandado se vería obligado a interponer demandas de repetición mes a mes durante los próximos años para
  recuperar los pagos que la actora sigue sin abonar, generando una litigiosidad artificial e indefinida que podría y debe ser
  resuelta aquí y ahora."
  Base legal:
  - Art. 393 CC (gastos comunes)
  - Art. 395 CC (compulsión al copropietario renuente)
  - Art. 1404 CC por analogía (liquidar pasivo antes de dividir activo)
  - Art. 1901 CC (prohibición del enriquecimiento injusto)
  - STS Sala 1ª (doctrina sobre liquidación de comunidades con pasivo vinculado)
  2.2 — PETICIÓN P0: TABLA VERIFICABLE POR BLOQUES
  Art. 219 LEC • Art. 217 LEC • Art. 24 CE
  "En cuanto a la acción de reintegro y reembolso del expositivo cuarto, esta parte solicita con carácter previo la depuración del
  objeto del proceso.
  La pretensión de 212.677 euros —o 216.677, según se lea la letra o el número del suplico— consiste en una agregación narrativa de
  conceptos heterogéneos: cuotas hipotecarias de distintos períodos, cancelación de hipoteca anterior, préstamos personales de 2008,
  adquisición de vehículo, maquinaria agrícola, IBI de distintos ejercicios. Todo ello presentado sin individualización por partidas,
   sin motivación del dies a quo para ninguna de ellas, y soportado en su mayor parte por capturas de pantalla incompletas.
  Sin individualización, esta parte no puede ejercer contradicción efectiva, no puede practicarse control de prescripción partida a
  partida, y el Juzgado no podrá dictar sentencia conforme al artículo 219 LEC sobre una cuantía determinada. Esto no es un defecto
  menor: es la ausencia del presupuesto mínimo de cualquier condena dineraria.
  Se interesa que se requiera a la actora para que presente relación individualizada por partidas o bloques homogéneos que incluya,
  para cada una: fecha o período exacto, concepto, cuantía precisa, base jurídica aplicable, exigibilidad y dies a quo motivado, y
  documento soporte identificado. Sin tabla verificable no existe crédito individualizado susceptible de condena."
  2.3 — IMPUGNACIÓN DOCUMENTAL SELECTIVA
  Art. 427 LEC
  "En cuanto a los documentos aportados por la actora, esta parte procede a su reconocimiento e impugnación conforme al artículo 427
  LEC.
  Se impugnan específicamente:
  Primero: las capturas de pantalla de movimientos bancarios. No son extractos íntegros ni certificados por la entidad. No permiten
  identificar el ordenante real, la cuenta de cargo ni la trazabilidad completa de cada operación. Se interesa que sean sustituidas
  por extractos bancarios íntegros y certificados.
  Segundo: las fotocopias de escrituras públicas aportadas sin cotejo notarial. Se interesa testimonio notarial o librar oficio al
  notario correspondiente.
  Tercero: la escritura de hipoteca Kutxa aportada únicamente en cinco páginas de un documento notarial completo. Esta selección
  parcial impide conocer el clausulado íntegro, en particular las condiciones de solidaridad y la descripción de la garantía real. Se
   interesa la aportación íntegra o el librado de oficio al notario.
  Por el contrario, esta parte tiene por reconocido y destaca como prueba favorable el documento de la contestación que recoge la
  declaración de la actora ante la Agencia Estatal de Administración Tributaria de fecha 14 de junio de 2013, en la que la propia
  demandante afirma literalmente que el destino del préstamo de 310.000 euros fue 'la compra del terreno sito en C/ Collao nº 10 Urb
  Balcón de Montroy, Montroy, otro terreno y para la cancelación de deudas pendientes'. Esta declaración, realizada ante autoridad
  pública bajo responsabilidad fiscal, constituye confesión extrajudicial de la demandante y desmonta la premisa central sobre la que
   construye la totalidad de su reclamación hipotecaria."
  2.4 — CONTRADICCIÓN PROCESAL MISLATA/PICASSENT
  Art. 247 LEC • Art. 7.1 CC • Venire contra factum proprium
  "Señoría, esta parte pone en conocimiento del Juzgado una contradicción procesal de especial gravedad.
  Existe actualmente en tramitación ante el Juzgado de Primera Instancia de Mislata un Juicio Verbal en el que Dña. Vicenta Jiménez
  Vera figura como demandada. En ese procedimiento, ya admitido con recurso de revisión desestimado, la Sra. Jiménez alega
  expresamente su condición de deudora no hipotecante para eximirse del pago de las cuotas del mismo préstamo hipotecario cuyo
  reembolso íntegro reclama en el presente procedimiento.
  La demanda de Picassent llama sistemáticamente a ese préstamo 'la hipoteca del Sr. Rodríguez'. Pues bien: si es la hipoteca del Sr.
   Rodríguez, ¿qué pagó ella que deba ser reembolsado? Y si es deudora no hipotecante sin obligación de pago —como alega en Mislata—
  ¿cómo fundamenta aquí que pagó más de lo que le correspondía?
  Estas dos posiciones son jurídicamente incompatibles. Constituyen una manifestación del principio venire contra factum proprium,
  prohibido por el artículo 7.1 del Código Civil. Constituyen además mala fe procesal en los términos del artículo 247 LEC.
  Se solicita que quede constancia expresa en acta y se interesa que el Juzgado tome nota a los efectos del artículo 247.3 LEC y de
  la eventual condena en costas por temeridad del artículo 394.2 LEC."
  2.5 — BENEFICIO ECONÓMICO NO COMPUTADO: USO DE VIVIENDA PRIVATIVA
  "Esta parte hace constar además que el convenio regulador del divorcio de octubre de 2023 atribuyó a la actora el uso de la
  vivienda privativa del demandado —la misma que soporta como garantía la hipoteca de los bienes comunes— desde noviembre de 2022
  hasta noviembre de 2024: veintiséis meses.
  Esa vivienda se alquila actualmente por novecientos ochenta euros mensuales, lo que supone un beneficio económico recibido por la
  actora de veinticinco mil cuatrocientos ochenta euros, no computado en ningún concepto de la demanda.
  La demanda que presenta una liquidación económica entre excónyuges omitiendo deliberadamente un beneficio de esa magnitud ya
  recibido por la reclamante no es una liquidación honesta: es una selección interesada de los datos favorables con exclusión de los
  desfavorables. Este hecho se incluirá en los hechos controvertidos y se hará valer en el juicio."
  3.1 — REGLA GENERAL: CORTE DURO DEL 7 DE OCTUBRE DE 2020
  "Esta parte mantiene íntegramente la excepción de prescripción formulada en la contestación, con el siguiente desarrollo:
  El artículo 1964.2 del Código Civil establece un plazo de prescripción de cinco años para las acciones personales. La Disposición
  Transitoria 5ª de la Ley 42/2015 establece que para todas las acciones nacidas antes del 7 de octubre de 2015, el nuevo plazo de
  cinco años comenzó a correr en esa fecha. Fecha máxima de prescripción: 7 de octubre de 2020. La demanda se presentó en octubre de
  2024. En consecuencia, están prescritas todas las partidas cuya exigibilidad real sea anterior a octubre de 2019.
  Aplicando este criterio:
  - Cancelación hipoteca previa, agosto 2006, 16.979 euros: prescrita
  - Préstamos personales 2008, 20.085 euros: prescritos
  - Cuotas hipotecarias 2009, 5.996 euros: prescritas
  - Cuotas hipotecarias 2010, 11.534 euros: prescritas
  - Cuotas hipotecarias 2011, 11.856 euros: prescritas
  - Cuotas hipotecarias 2012, 12.000 euros: prescritas
  - IBI 2013 a 2018 completo: prescrito
  - Adquisición vehículo Seat León, octubre 2014, 13.000 euros: prescrito
  Total prescrito bajo la regla general: aproximadamente 92.500 euros sobre 212.677 reclamados. El cuarenta y tres por ciento de la
  demanda está prescrito antes de discutir el fondo."
  3.2 — ANTI-STS 458/2025: DISTINGUISHING EN CUATRO PLANOS
  Si la actora invoca o el juez introduce la STS 458/2025:
  "Para el caso de que la parte actora invoque la STS 458/2025 para desplazar el dies a quo al momento de la ruptura, esta parte se
  opone a su aplicación al presente caso por razones fácticas y jurídicas específicas que distinguen nuestro supuesto del resuelto
  por esa sentencia.
  Primero: el tipo de bien financiado. La STS 458/2025 opera sobre el pago de la hipoteca de la vivienda habitual familiar o de un
  bien vinculado a las cargas del hogar, donde la dificultad de reclamar durante la convivencia justifica el desplazamiento del dies
  a quo. En este caso, el préstamo de 310.000 euros no financió la vivienda habitual del matrimonio: financió la compra de parcelas
  en Montroy y Godelleta y la construcción de un chalet. Así lo declaró la propia actora ante la Agencia Tributaria en 2013
  —documento obrante en autos—. Ese chalet fue explotado comercialmente como alojamiento turístico con licencia, con presencia en
  plataformas de reservas. Es una inversión patrimonial, no una carga familiar. No concurre el supuesto de hecho que da sentido a la
  sentencia.
  Segundo: la actora misma niega que fuera su obligación. En el procedimiento de Mislata, la actora se autoproclama deudora no
  hipotecante para eximirse del pago. Si reconociera que era su obligación abonar esas cuotas, no podría eximirse en Mislata. Si se
  exime en Mislata, no puede reclamar aquí reembolso por haberlas pagado voluntariamente. La STS 458/2025 protege al cónyuge que pagó
   lo que le correspondía y algo más; no puede proteger a quien en otro procedimiento niega que le correspondiera pagar nada.
  Tercero: ausencia de desequilibrio demostrable. La STS exige como presupuesto fáctico que se acredite que uno de los cónyuges pagó
  significativamente más que el otro. Aquí la nómina del demandado fue superior durante toda la relación. Aportó ingresos
  extraordinarios. Fue cotitular de ambas cuentas con aportaciones propias acreditadas. La contestación a la demanda documenta que
  las aportaciones del demandado superaron a las de la actora. Sin trazabilidad contable íntegra —que la actora no ha aportado— no
  puede presumirse el desequilibrio que la sentencia requiere como presupuesto.
  Cuarto: retraso desleal. La actora es funcionaria del cuerpo de policía con Máster en formación económico-empresarial por la Cámara
   de Comercio. Fue cotitular de ambas cuentas durante toda la relación, con acceso completo a la información financiera. No consta
  en estos autos una sola reclamación extrajudicial fehaciente anterior a la demanda de 2024 respecto de ninguno de los conceptos
  reclamados desde 2006. Casi veinte años de silencio con conocimiento pleno excluye la interrupción del artículo 1973 CC y
  constituye retraso desleal como manifestación del artículo 7 CC.
  Quinto, y en todo caso: incluso si el Juzgado considerara aplicable la STS 458/2025 a algún bloque concreto, su aplicación exige
  delimitación fáctica estricta del bloque afectado, resolución separada por bloques homogéneos, motivación expresa del dies a quo
  por bloque y prueba de las aportaciones con trazabilidad. La sentencia no autoriza la reactivación global e indiscriminada de
  veinte años de pagos heterogéneos bajo un único dies a quo sin prueba ni individualización."
  3.3 — INTERRUPCIÓN: ANTICIPAR Y NEUTRALIZAR
  "Para el caso de que la actora alegue interrupción de la prescripción, se interesa que precise y acredite el acto interruptivo
  concreto: fecha exacta, contenido íntegro, identificación del crédito específico interrumpido y medio fehaciente. El artículo 1973
  CC exige acto idóneo; no son actos interruptivos los mensajes genéricos sobre liquidar los bienes comunes, ni la mera convivencia,
  ni el conocimiento compartido de la situación. No consta en autos ningún acto de esa naturaleza."
  RESUMEN 30 SEGUNDOS — Si el juez pide brevedad extrema
  "Señoría, tres ejes. Primero: la división de cosa común está allanada; pedimos decreto inmediato condicionado a la cancelación del
  pasivo hipotecario de 182.000 euros que carga mi vivienda privativa como garantía de los bienes que se van a vender. Segundo: el
  43% de lo reclamado está prescrito por el corte del 7 de octubre de 2020 de la DT 5ª de la Ley 42/2015. Tercero: lo que resta no
  puede ser probado con capturas de pantalla: pedimos pericial contable y oficios bancarios."
  RESUMEN 60 SEGUNDOS — Versión estándar
  "Señoría, esta defensa tiene cuatro ejes. Procesal: la división está allanada y debe decretarse ahora, pero condicionada a la
  cancelación previa del pasivo hipotecario vinculado a esos bienes; dividir el activo sin el pasivo generaría un enriquecimiento
  injusto de la actora y condenaría al demandado a años de reclamaciones de repetición. Prescripción: con el corte del 7 de octubre
  de 2020 que impone la DT 5ª, aproximadamente 92.500 euros de los reclamados están prescritos antes de entrar al fondo; y la STS
  458/2025 no puede aplicarse porque el préstamo financió una inversión patrimonial, no la vivienda habitual, y la propia actora
  niega en Mislata que tuviera obligación de pago. Prueba: la demanda se sostiene en capturas de pantalla incompletas sin certificar,
   lo que impide la contradicción; necesitamos pericial contable judicial y oficios bancarios. Y mala fe: la actora alega en Mislata
  que es deudora no hipotecante para no pagar, y aquí reclama reembolso por haber pagado; esas dos posiciones no pueden ser ciertas
  al mismo tiempo."
  TABLA DE RESPUESTAS RÁPIDAS
  ┌────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ Si la actora o el juez │                                         Respuesta inmediata                                         │
  │         dice...        │                                                                                                     │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "El art. 73.2 LEC      │ "El 73.2 absorbe verbales por cuantía. El 250.1.16 es proceso especial por materia. La distinción   │
  │ permite la absorción"  │ es del propio texto legal."                                                                         │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "No se alegó en la     │ "El 416.1.4ª y el 422 LEC lo contemplan para la AP. La inadecuación por proceso especial es orden   │
  │ contestación"          │ público procesal, sin preclusión. STS 17/03/2016."                                                  │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "El pasivo no forma    │ "Si se venden los bienes comunes sin cancelar el pasivo que los financia, la actora recibe activo   │
  │ parte de esta demanda" │ neto y el demandado recibe activo bruto con 182.000€ de deuda. Eso es enriquecimiento injusto       │
  │                        │ prohibido por el arts. 1895 y ss. CC (cobro de lo indebido) + doctrina jurisprudencial (enriquecimiento injusto). El Juzgado puede y debe condicionar la ejecución."                   │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "La STS 458/2025 lo    │ "Cuatro razones: inversión, no vivienda habitual; la actora misma niega obligación en Mislata; no   │
  │ salva todo"            │ hay desequilibrio probado con trazabilidad; y retraso desleal de 20 años. Requiere además bloques y │
  │                        │  prueba, no reactivación global."                                                                   │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "Los documentos son    │ "Están impugnados. Que los aporten íntegros y certificados por la entidad bancaria."                │
  │ válidos"               │                                                                                                     │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "No hay contradicción  │ "Que la actora explique cómo es deudora no hipotecante sin obligación de pago en Mislata y          │
  │ con Mislata"           │ simultáneamente pagó de más lo mismo en Picassent. Las dos cosas no pueden ser ciertas."            │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "La prescripción se    │ "Perfectamente. Pero los hechos controvertidos sobre dies a quo, exigibilidad e interrupción deben  │
  │ decide en sentencia"   │ fijarse ahora para ordenar la prueba. Sin esa fijación no hay juicio practicable."                  │
  ├────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────┤
  │ "Ya está todo          │ "Detallar narrativamente no es individualizar por partidas. Sin fecha, concepto, cuantía exacta,    │
  │ detallado en la        │ base jurídica y documento soporte por cada partida, no hay crédito verificable a efectos del art.   │
  │ demanda"               │ 219 LEC."                                                                                           │
  └────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────┘
8. Jurisprudencia (SENTENCIAS.docx) — texto íntegro para dataset
SENTENCIAS.
AAP Tarragona, Sección 3ª, Auto 185/2024, de 23 de mayo de 2024 — indebida acumulación de acciones y apreciación de oficio en Audiencia Previa.
El Auto analiza si la indebida acumulación de acciones puede apreciarse en fase de apelación y si es susceptible de ser examinada de oficio. Declara que la acumulación indebida, cuando afecta a la válida constitución del procedimiento, constituye una cuestión procesal relevante que puede ser apreciada tanto a instancia de parte como de oficio. Señala que el art. 73 LEC regula el control inicial, pero no impide que el tribunal pueda examinar la cuestión en un momento posterior si no fue advertida al admitir la demanda. Destaca que en Audiencia Previa el tribunal tiene facultades para resolver sobre la procedencia y admisibilidad de la acumulación conforme al art. 419 LEC. Asimismo, remite al art. 425 LEC para fundamentar la posibilidad de resolver circunstancias procesales análogas que afecten a la correcta prosecución del procedimiento. El Auto subraya que no se trata de una cuestión estrictamente sometida a preclusión cuando afecta a la estructura procesal. En consecuencia, confirma que la indebida acumulación puede ser objeto de control judicial incluso aunque no haya sido oportunamente planteada en la fase inicial del procedimiento.
SAP Baleares, Sección 3ª, Sentencia de 18 de septiembre de 2018 (ROJ SAP IB 1884/2018) — facultad del juez para apreciar indebida acumulación no advertida en admisión.
La Sentencia examina si el juez puede plantear y resolver de oficio una indebida acumulación de acciones cuando el Letrado de la Administración de Justicia no la detectó en el momento de admitir la demanda. Parte del análisis del art. 73 LEC, que regula el control previo de la acumulación, y concluye que dicho precepto no excluye el control posterior por el tribunal. Afirma que el juez conserva la competencia para examinar la procedencia de la acumulación en la Audiencia Previa, de conformidad con el art. 419 LEC. Añade que privar al órgano judicial de esa facultad supondría dejar en manos exclusivas del LAJ una cuestión que afecta a la delimitación objetiva del proceso. La resolución destaca que la acumulación indebida puede impedir la correcta prosecución del procedimiento y, por tanto, debe poder ser examinada incluso en fases posteriores. En consecuencia, valida la actuación judicial consistente en plantear la cuestión en Audiencia Previa y resolver sobre su procedencia.
-----------------------------------------------------------
(VENIRE CONTRA ACTOS PROPIOS)
----------------------------------------------------------------------------------------------------------
SAP Bizkaia (Sec. 4ª), Sentencia 575/2020, 8 oct 2020 (ECLI: ES:APBI:2020:1969) (RETRASO DESLEAL)
Esta sentencia recoge la doctrina del retraso desleal o verwirkung. Tras citar las STS de 7 jun 2010 y 19 sept 2013, indica que el retraso desleal impide el ejercicio de un derecho cuando su titular, con pleno conocimiento, permanece inactivo durante mucho tiempo creando en la otra parte la creencia legítima de que el derecho no será ejercitado. El mero transcurso del tiempo no basta; se requiere una conducta omisiva prolongada, conocimiento del derecho y confianza ajena. La Audiencia concluye que, en el caso de reclamaciones entre ex cónyuges, la inactividad prolongada habiendo podido reclamar puede enervar la acción.
SAP A Coruña, Sección 5ª, Sentencia de 11 de junio de 2009 (ROJ SAP C 1749/2009) — alcance de la Audiencia Previa y examen de cuestiones procesales análogas.
La Sentencia aborda el contenido y alcance de la Audiencia Previa regulada en los arts. 416 y siguientes de la LEC. Declara que el art. 416 no establece un listado cerrado de cuestiones procesales que puedan examinarse en dicha fase, sino que debe interpretarse de forma abierta. Con apoyo en el art. 425 LEC, sostiene que pueden resolverse circunstancias procesales análogas a las expresamente previstas cuando afecten a la válida prosecución del procedimiento. La resolución distingue entre cuestiones estrictamente procesales y cuestiones de fondo, precisando que solo las primeras pueden ser examinadas en esa fase sin necesidad de actividad probatoria compleja. Entre las cuestiones procesales susceptibles de análisis incluye la indebida acumulación de acciones no advertida previamente. Subraya que la finalidad de la Audiencia Previa es depurar el proceso y garantizar su correcta tramitación antes de entrar en el fondo del litigio.
Auto de la Audiencia Provincial de Valencia, Sección 9ª, 420/2010, de 22 de diciembre de 2010 — límites a la acumulación cuando no existe deuda preexistente.
El Auto analiza la acumulación de una acción contractual con una acción de responsabilidad frente al administrador societario. Examina los requisitos de conexidad y la necesidad de que exista una deuda social previamente determinada para justificar la acumulación. Concluye que la acumulación es viable cuando la obligación es preexistente y constituye presupuesto necesario de la acción acumulada. Sin embargo, cuando la deuda no preexiste y se constituye en el propio proceso mediante la declaración judicial pretendida, la acumulación resulta improcedente. La resolución distingue entre reconocimiento de una deuda ya existente y constitución de una obligación a través del litigio. En consecuencia, afirma que no toda relación entre pretensiones justifica su acumulación, siendo necesario un análisis estructural de la naturaleza de cada acción.
ATS 9 de diciembre de 2010 — diferenciación entre acciones reales y acciones personales a efectos de acumulación.
El Auto del Tribunal Supremo distingue entre acciones reales, como la división de cosa común, y acciones personales derivadas de relaciones obligacionales. Señala que la naturaleza jurídica de cada acción determina su causa de pedir y el marco probatorio aplicable. Destaca que la conexión entre pretensiones no puede afirmarse de forma genérica, sino que debe analizarse atendiendo a su fundamento jurídico específico. La resolución pone de relieve que la autonomía estructural de determinadas acciones puede impedir su acumulación cuando no exista un nexo jurídico suficiente. En consecuencia, reafirma la necesidad de examinar la naturaleza y finalidad de cada acción para valorar su eventual acumulación.



POR COMPROBAR

JURISPRUDENCIA Roj: AAP V 308/2025 - ECLI:ES:APV:2025:308A Id Cendoj:46250370102025200133 Órgano:Audiencia Provincial Sede:Valencia Sección:10 Fecha:03/03/2025 Nº de Recurso:1108/2024 Nº de Resolución:137/2025 Procedimiento:Recurso de apelación Ponente:MARIA PILAR MANZANA LAGUARDA Tipo de Resolución:Auto AUDIENCIA PROVINCIAL SECCIÓN DÉCIMA VALENCIA NIG: 46250-42-1-2024-0029111 RECURSO DE APELACIÓN (LECN) [RPL] Nº 001108/2024 -BL Dimana de: Juicio Verbal [VRB] Nº 000748/2024 Del JUZGADO DE PRIMERA INSTANCIA Nº 29 DE VALENCIA A U T O nº.137/25 SECCIÓN DECIMA: Ilustrísimas Señorías: Presidenta, DÑA PILAR MANZANA LAGUARDA Magistrados: D. CARLOS ESPARZA OLCINA DÑA PATRICIA MONTAGUD ALARIO En Valencia a, tres de marzo de dos mil veinticinco Vistos ante la Sección Décima de la Ilma. Audiencia Provincial, en grado de apelación, los autos de Juicio Verbal [VRB] nº 000748/2024, seguidos ante el JUZGADO DE PRIMERA INSTANCIA Nº 29 DE VALENCIA, entre partes, de una como demandante, D/Dª. Juan , dirigida por el letrado D/Dª. JUAN ALBERTO PITARCH GARCIA y representada por el Procurador D/Dª. BEATRIZ VENTURA FALCO, y de otra como demandado, D/Dª. María Inmaculada , dirigida por el letrado D/Dª. CARLOS SANZ RUIZ y representada por el Procurador D/Dª. JOSE LUIS MEDINA GIL. Siendo parte el MINISTERIO FISCAL. Es ponente la Ilma. Sra. Magistrada Dña. MARÍA DEL PILAR MANZANA LAGUARDA. ANTECEDENTES DE HECHO: PRIMERO.-En dichos autos por el Iltmo. Sr. Juez de JUZGADO DE PRIMERA INSTANCIA Nº 29 DE VALENCIA, en fecha 2-9-24 se dictó auto, cuya parte dispositiva es como sigue: " 1) Se declara la falta de jurisdicción de este Juzgado para conocer del asunto reseñado en los antecedentes de esta resolución. 2) Se señala a las partes que pueden usar de su derecho ante los Juzgados de Familia de Valencia. 3) Se sobresee el presente proceso." SEGUNDO.-Contra dicho auto por la representación procesal de la parte demandante se interpuso recurso de apelación, y verificados los oportunos traslados a las demás partes para su oposición al recurso o impugnación del auto se remitieron las actuaciones a esta Secretaría donde se formó el oportuno rollo, señalándose el día 3-3-25 para la deliberación, votación y fallo del recurso, sin celebración de vista. TERCERO.-Que se han observado las formalidades y prescripciones legales. 1 JURISPRUDENCIA FUNDAMENTOS JURIDICOS: PRIMERO.-Por la dirección letrada de la parte recurrente que representa los intereses de Juan se impugna la resolución recurrida de fecha 2 de septiembre de 2024. SEGUNDO.-Son circunstancias relevantes para resolver el recurso el que por Juan en abril de 2024 se instó demanda de división de la cosa común, que fue turnada al juzgado de primera instancia numero 29 de los de Valencia, quien la admitió a trámite. Emplazada la parte demandada se personó y allanó a la misma con ciertas matizaciones; tras alegar la parte actora que se encontraba fuera de plazo la contestación y distintos escritos de alegaciones de las partes, el Juez dictó providencia el día 1 de julio de 2024 para oírlas sobre su competencia objetiva y acumulación al proceso seguido ante el Juzgado de Familia número 8 de esta ciudad. El actor ratificó la competencia del Juzgado y respecto a la acumulación manifestó que quedaba a discreción de la parte, mientras que la demanda consideró que era posible esa acumulación. Tras lo cual el Juzgado dictó la resolución recurrida, en fecha 2 de septiembre, en la que 1) Se declara la falta de jurisdicción de este Juzgado para conocer del asunto reseñado en los antecedentes de esta resolución. 2) Se señala a las partes que pueden usar de su derecho ante los Juzgados de Familia de Valencia. 3) Se sobresee el presente proceso. Contra dicha resolución se ha interpuesto recurso por la representación procesal de Juan , turnándose a la Sección 7 de esta Audiencia, cuyo LAJ por Decreto de 7 de octubre de 2024 rechazó la competencia, remitió el rollo a la oficina de reparto para turnarse a la Sección décima. Y en Sección tras los trámites oportunos se señaló para la resolución del recurso el día de hoy. TERCERO.-Se trata de un matrimonio en régimen de separación de bienes, que a diferencia de aquellos cuyo régimen es de gananciales, deben acudir a la vía de la acción de división de la cosa común para liquidar sus bienes comunes - artículos 400 y ss del CC. Tras la nueva redacción del art. 250.1.16 de la LEC todos los juicios de división de cosa común se ventilarán por razón de la materia siguiendo las normas del juicio verbal con independencia del valor del bien, siendo competente el Juzgado de primera instancia del lugar donde se halle el bien. ( artículos 85 y ss de la LOPJ). No obstante, se permite la acumulación del proceso de división al de divorcio con la nueva redacción del art. 437 núm. 4 de la LEC operada por ley 42/2015, de reforma de la Ley de Enjuiciamiento Civil 1/2000 en estos términos: " En los procedimientos de separación, divorcio o nulidad y en los que tengan por objeto obtener la eficacia civil de las resoluciones o decisiones eclesiásticas, cualquiera de los cónyuges podráejercer simultáneamente la acción de división de la cosa común respecto de los bienes que tengan en comunidad ordinaria indivisa. Si hubiere diversos bienes en régimen de comunidad ordinaria indivisa y uno de los cónyuges lo solicitare, el tribunal puede considerarlos en conjunto a los efectos de formar lotes o adjudicarlos." LA SALA ACUERDA Ciertamente hasta la entrada en vigor de esta nueva Ley, los cónyuges debían acudir a los juzgados de familia para su divorcio o separación, pero a su vez, tenían que iniciar un procedimiento declarativo para proceder a la liquidación de su patrimonio común. Con esta reforma de la Ley de Enjuiciamiento Civil se les permite acumular la acción de división de cosa común al procedimiento de divorcio, pero en todo caso es algo potestativo a disposición de las partes, y en el concreto caso sometido a nuestra decisión, la parte actora eligió de forma independiente accionar la acción de división sin acumulación alguna al divorcio del que se estaba conociendo en otro Juzgado de competencia exclusiva en materia de familia. En consecuencia, el Juzgado de Primera instancia sí tenía competencia para conocer de la acción ejercitada y desde luego jurisdicción en la materia. Por lo tanto, procede la estimación del recurso, la revocación de la resolución recurrida ordenando al Juzgado de Primera Instancia número 29 que conocía del juicio verbal seguir los trámites del mismo. CUARTO.-La estimación del recurso conlleva la no imposición de las costas de esta alzada. Vistos los preceptos legales aplicables concordantes y demás de general aplicación, Primero.-Estimar el recurso de apelación interpuesto por la representación procesal de Juan . Segundo.-Revocar la resolución recurrida, para en su lugar ordenar al Juzgado de Iª Instancia núm. 29 de Valencia la continuación del proceso de división de la cosa común. Tercero.-No hacer imposición de las costas de esta alzada. Cuarto.-En cuanto al depósito consignado para recurrir devuélvase. 2 JURISPRUDENCIA Así por este nuestro auto, contra el que no cabe recurso, del que se llevará certificación al rollo, lo pronunciamos, mandamos y firmamos. 3
STS 79/2015, 27 feb 2015 (ECLI: ES:TS:2015:79) [cita doctrinal]
(INADECUACIÓN ES ORDEN PÚBLICO)
La Sala 1ª declaró que la inadecuación del procedimiento por razón de la materia constituye cuestión de orden público y puede ser apreciada de oficio por el juez aunque no se haya planteado en la contestación. Según el comentario jurisprudencial a la STS 79/2015, el tribunal advierte que el órgano judicial debe reconducir o anular el procedimiento cuando advierte la inadecuación, incluso en la audiencia previa, y que la apreciación en apelación puede acarrear la nulidad de actuaciones. Esta doctrina evita que la parte contraria alegue preclusión por no haberlo invocado en la contestación.
SAP Málaga (Sec. 5ª), Sentencia 251/2022, 6 jun 2022 (ECLI: ES:APMA:2022:2327)
(EL ARTICULO LEC.250 SIEMPRE POR VERBAL)
La Audiencia Provincial de Málaga anuló una providencia que reconducía al procedimiento ordinario una demanda de desahucio por impago de rentas y reclamación de cantidad. La Sala recuerda que el art. 250.1.1º LEC establece un cauce imperativo para las acciones de reclamación de rentas o cantidades debidas por arrendamiento; por tanto, la acción «siempre ha de tramitarse por el cauce de juicio verbal, con independencia de su cuantía», y no puede absorberse por el juicio ordinario por razón de la complejidad o la cuantía. Esta sentencia impide acumular en un ordinario la acción verbal especial del art. 250.1 LEC, reforzando la idea de que el juicio verbal especial por materia no admite absorción por el art. 73.2 LEC.
El Auto nº 22/2023 de la Audiencia Provincial de Palencia (Sección 1ª, 8 de mayo de 2023) revoca la decisión de un juzgado que había permitido acumular en un mismo procedimiento de ejecución una deuda dineraria (tasación de costas) y la ejecución de una división de cosa común (venta por subasta de una vivienda), declarando que ambas acciones son jurídicamente heterogéneas, con naturaleza, finalidad y régimen procesal distintos, y que las normas sobre acumulación tienen carácter de orden público, por lo que no pueden flexibilizarse por razones de economía procesal ni utilizarse vías indirectas o ampliaciones para introducir obligaciones nuevas y diferentes, debiendo cada pretensión tramitarse por su cauce legal propio e independiente.
--------------------------------------------------------------------------------------------------------
STS 668/2013, 6 nov 2013 (ECLI: ES:TS:2013:5292)
Esta sentencia del Tribunal Supremo sistematiza la doctrina de los actos propios y el principio venire contra factum proprium. Basada en la buena fe del art. 7.1 CC, declara que quien genera en otro una expectativa legítima mediante un acto propio no puede posteriormente adoptar una conducta contradictoria. Los actos deben provenir de la misma relación jurídica o de las partes litigantes y no puede admitirse un cambio de posición en otro proceso cuando ese comportamiento contradice la conducta anterior. La sentencia sirve para sancionar la defensa contradictoria en procedimientos distintos.
9. Anexo — texto extraído de PDF AP2 (recuperación de UI)
27/2/26, 8:48

Audiencia previa • Picassent

Centro de mando operativo para preparar la Audiencia Previa conforme a la LEC.

Aquí se ejecuta la sala. La matriz vive en Estrategia. Las tarjetas editables viven en War Room.

Abrir Matriz estratégica

Líneas de defensa, riesgos, escenarios.

Abrir War Room (tarjetas)

Tácticas rápidas ataque/respuesta.

Nueva tarjeta (War Room)

Crear tarjeta táctica y volver aquí.

Prescripción

Mapa de escenarios + DT 5ª.

Liquidación Justa

Bases de liquidación y pasivo.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

1/9

27/2/26, 8:48

Audiencia previa • Picassent

Por qué puede abordarse en AP aunque no se desarrollara con amplitud en la contestación

La AP es fase de saneamiento: el tribunal debe resolver excepciones procesales, defectos de demanda y
presupuestos procesales.

El deber judicial de ordenar y depurar el proceso permite encauzar cuestiones que estén ya planteadas o que
sean apreciables de oficio.

La preclusión es la regla (art. 136 LEC), pero no impide el saneamiento cuando la ley impone resolver y evitar
indefensión.

LEC 416, 424 y 425.

Art. 24 CE.

LEC 136.

Falta de competencia objetiva/territorial o funcional

Señoría, interesa que se depure de oficio y, en su caso, se declare la incompetencia conforme a la LEC.

P E D I R

Que se aprecie y resuelva la competencia con carácter preferente, dejando constancia expresa en acta.

Subsidiario: si se mantiene la competencia, que se motive el criterio aplicado.

LEC 416–418 (excepciones procesales en AP).

LEC 48–60 (competencia).

Indebida acumulación objetiva (división + reclamación heterogénea)

Señoría, la demanda acumula pretensiones heterogéneas: pedimos inadmisión parcial o depuración por bloques.

P E D I R

Que se declare la indebida acumul
ación o, al menos, se acote el objeto por bloques y se excluya lo ajeno.

Que se exija concreción por partida con soporte íntegro.

LEC 71–73 (acumulación objetiva).

LEC 402 (oposición en contestación y resolución en AP).

Defectos de demanda (falta de claridad/concreción)

Señoría, la demanda carece de concreción suficiente: pedimos aclaración, depuración o inadmisión parcial.

P E D I R

Que se requiera concreción y depuración por partidas, con fechas, cuentas y soportes íntegros.

Que se tenga por no alegado lo que no se concrete con precisión.

LEC 424 (defectos de la demanda).

Art. 24 CE (defensa efectiva).

Prescripción de partidas anteriores a 2019

Señoría, pedimos que se declare prescrita toda partida anterior a 2019 conforme al CC.

P E D I R

Estimación de la prescripción pre-2019 salvo interrupción fehaciente acreditada.

En su caso, fijación del dies a quo por cada pago.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

2/9

27/2/26, 8:48

Audiencia previa • Picassent

CC 1964.2 y 1969.

LEC 416–418 (excepciones).

Litisconsorcio pasivo necesario (si procede)

Señoría, si hay terceros indispensables para la eficacia del fallo, procede integrar el litisconsorcio.

P E D I R

Que se declare la necesidad de integrar a los litisconsortes pasivos indispensables.

Suspensión y emplazamiento si procede.

LEC 12 (litisconsorcio).

LEC 416–418 (excepciones).

Guion de sala + texto copiable para acta

Versión principal y subsidiaria para dejar constancia en acta.

P R I N C I P A L

Señoría, al amparo de los arts. 416 y ss. LEC, interesamos el saneamiento procesal y la resolución de 

excepciones: (i) depuración del objeto por indebida acumulación; (ii) defectos de concreción de la demanda; y 

(iii) prescripción de partidas anteriores a 2019.


Solicitamos que se acote el objeto litigioso por bloques, se excluyan partidas impertinentes y se exija soporte 

íntegro por partida, dejando constancia expresa en acta.

S U B S I D I A R I O

Subsidiariamente, si el juzgado decide no excluir acciones, pedimos que se imponga un mandato de 

concreción inmediata y se condicione la prueba a extractos íntegros/certificados, para evitar indefensión.

Y, en todo caso, que se fije como cuestión previa la prescripción pre-2019 con resolución expresa.

Jurisprudencia (pendiente de incorporar)

PENDIENTE: no se incorpora ROJ/CENDOJ en este módulo. Añadir solo con referencia verificada.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

3/9

27/2/26, 8:48

Audiencia previa • Picassent

Competencia objetiva/funcional (DIAGNÓSTICO)

EX_OFFICIO_ONLY

DIAGNÓSTICO: competencia objetiva/funcional apreciable de oficio; no se auto-inserta en guiones.
Competencia en modo DIAGNÓSTICO; no se auto-inserta en guiones.

PRUEBA soporte: Verificar si la demanda encaja en la competencia objetiva y territorial. • Falta: NO CONSTA: se
requiere identificar documento concreto que pruebe este extremo.

Activada en compositor

Competencia territorial (DIAGNÓSTICO)

PRECLUDED

DIAGNÓSTICO: competencia territorial precluida por falta de declinatoria y ausencia de fuero imperativo
declarado.
Riesgo de convalidación/sumisión tácita: no se insertará en guiones salvo habilitación forzada motivada.
Consta decreto de admisión con revisión de competencia territorial atribuida a este juzgado.
Bloqueada por defecto. Solo habilitar con “Force enable” + motivo obligatorio.
Competencia en modo DIAGNÓSTICO; no se auto-inserta en guiones.

PRUEBA soporte: Verificar si la demanda encaja en la competencia objetiva y territorial. • Falta: NO CONSTA: 
se
requiere identificar documento concreto que pruebe este extremo.

No activada en compositor

Indebida acumulación objetiva (división + reclamación heterogénea)

RISK_MED

No consta oposición en contestación: defendible en AP con riesgo medio de rechazo.

PRUEBA soporte: Marcar partidas sin conexión funcional con la división de cosa común. • Falta: NO CONSTA: se
requiere identificar documento concreto que pruebe este extremo.

No activada en compositor

Defectos de demanda (falta de claridad/concreción)

OK

Defectos 424–425 LEC activables en AP.

PRUEBA soporte: Identificar bloques sin fecha/cuenta/ordenante. • Falta: NO CONSTA: se requiere identificar
documento concreto que pruebe este extremo.

Activada en compositor

Prescripción de partidas anteriores a 2019

RISK_HIGH

No consta alegación en contestación: riesgo alto/preclusión según delimitación del debate.

PRUEBA soporte: Separar por periodos y exigir prueba de interrupción. • Falta: NO CONSTA: se requiere identificar
documento concreto que pruebe este extremo.

No activada en compositor

Litisconsorcio pasivo necesario (si procede)

EX_OFFICIO_ONLY

Posible apreciación de oficio; activar con cautela y enfoque de integración.

PRUEBA soporte: Comprobar si hay titulares registrales o cotitulares omitidos. • Falta: NO CONSTA: se requiere
identificar documento concreto que pruebe este extremo.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

4/9

27/2/26, 8:48

Audiencia previa • Picassent

Activada en compositor

Riesgo Alto

AP (fase saneamiento)

Competencia: debe resolverse en AP con carácter preferente.

LEC 48–60.

LEC 416–418.

Riesgo Medio

Contestación / AP

Indebida acumulación: oposición en contestación y resolución en AP.

LEC 402.

LEC 71–73.

Riesgo Medio

AP (saneamiento)

Def
ectos de demanda: concreción y claridad.

LEC 424–425.

Riesgo Alto

Contestación / AP

Prescripción: excepción material con fuerte efecto preclusivo.

CC 1964.2 y 1969.

LEC 136.

Riesgo Medio

AP

Litisconsorcio necesario: puede apreciarse de oficio.

LEC 12.

LEC 416–418.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

5/9

27/2/26, 8:48

Audiencia previa • Picassent

El juez admite la excepción y depura el objeto

Solicitamos que se deje constancia en acta del perímetro del litigio y de las partidas excluidas.

El juez rechaza la excepción pero permite seguir

Formulamos protesta por indefensión y pedimos mandato de concreción y prueba íntegra.

El juez difiere la decisión al momento de sentencia

Interesamos que se deje constancia en acta de la cuestión previa y que se limite la prueba a lo pertinente.

Señoría, antes de entrar al fondo, solicitamos saneamiento y delimitación del objeto: la 
demanda mezcla división de cosa común con una reclamación económica histórica y heterogénea. 
Pedimos que se acote el objeto y se excluyan partidas impertinentes para evitar indefensión.

Sostenemos la prescripción de todo lo anterior a 2019 (art. 1964.2 y 1969 CC), salvo 
interrupción fehaciente, que no consta. Y advertimos que la STS 458/2025 no puede usarse 
como “barra libre”: su lógica exige convivencia patrimonial normal y vivienda familiar; aquí 
el bien controvertido no es vivienda habitual sino inversión, y además no procede convertir 
en imprescriptible una arqueología contable.

La carga de la prueba corresponde a la actora (art. 217 LEC). Recortes, capturas y PDFs 
parciales de cuentas canceladas no acreditan trazabilidad ni autenticidad. Impugnamos la 
prueba digital si no viene acompañada de extractos íntegros/certificados.

Para resolver de 
forma limpia: pedimos exhibición/oficios bancarios y, si persiste 
controversia, pericial contable con designación judicial (art. 339 LEC) para depurar 
origen/destino, evitar dobles cómputos y fijar saldo real.

Y subsidiariamente, si se admitiera algún reembolso, solicitamos liquidación global con 
compensación de créditos y cargos correlativos para evitar enriquecimiento injusto.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

6/9

27/2/26, 8:48

Audiencia previa • Picassent

S A N E A M I E N T O

P E D I R

Que se delimite el objeto litigioso por bloques (división cosa común vs. reclamación económica) y se
excluya lo ajeno/impertinente.

Que se exija a la actora concreción por partida + soporte íntegro (no recortes).

B A S E

LEC 71–73 (acumulación objetiva) + saneamiento en AP (LEC 414–430).

Art. 24 CE (defensa efectiva) como principio rector.

P E D I R

Que se estime la prescripción de todo lo anterior a 2019 salvo interrupción fehaciente acreditada por la
actora.

Subsidiario: si se aplica STS 458/2025, exigir prueba reforzada de origen privativo, inexistencia de caudal
común y destino real.

B A S E

CC 1964.2 y 1969 (dies a quo).

STS 458/2025 (dies a quo divorcio/separación de hecho solo con convivencia patrimonial normal y vivienda
familiar).

H E C H O S

P E D I R

Que se incluyan como hechos controvertidos los relativos a: cuentas comunes, retiradas (32k/38.5k), destino
real de préstamos/hipoteca, y autenticidad de extractos/capturas.

Que se haga constar que la carga de probarlos recae en quien los afirma.

B A S E

LEC 426 (fijación hechos controvertidos).

LEC 217 (carga de la prueba).

P R U E B A

P E D I R

Oficio a entidades bancarias para extractos íntegros/certificados de cuentas relevantes.

https://juantuporaqui.github.
io/DEMANDAS/cases/CAS001?tab=audiencia

7/9

27/2/26, 8:48

Audiencia previa • Picassent

Exhibición de documentación completa que la actora dice tener (LEC 328–330).

B A S E

LEC 299.2 (documentos electrónicos).

LEC 328–330 (exhibición).

P E D I R

Designación judicial de perito contable (insaculación), o admisión de pericial con posibilidad de designación
judicial si hay discrepancia.

Objeto pericia: reconstruir movimientos, origen/destino, evitar dobles cómputos, y calcular saldo neto por
periodos (con módulo prescripción).

B A S E

LEC 339 y ss. (pericial).

Principio de tutela judicial efectiva (art. 24 CE).

C I E R R E

P E D I R

Que cualquier suma se determine de forma neta tras depuración completa (no por pantallazos).

Que se tome en cuenta la compensación de créditos/cargos correlativos acreditados.

B A S E

CC 1195–1202 (compensación, como esquema de cierre).

Art. 7 CC (abuso/enriquecimiento como principio).

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

8/9

27/2/26, 8:48

Audiencia previa • Picassent

Señoría, esto no puede tramitarse como arqueología contable sin depurar objeto: pedimos acotar por bloques
y excluir partidas ajenas/impertinentes.

Prescripción pre-2019 por 1964.2/1969 CC; STS 458/2025 no aplica a inversión/no vivienda habitual ni a
arqueología contable sin convivencia patrimonial normal.

Invoco art. 247 LEC: aportación sesgada/ocultación no puede rebajar el estándar probatorio; al contrario, exige
prueba íntegra y pericial.

Si se entra al fondo, que sea liquidación neta: lo que se reconozca debe compensarse con cargos/créditos
correlativos para evitar enriquecimiento injusto.

No se puede exigir defensa efectiva con arqueología contable parcial: si la actora no aporta íntegro, procede
oficio/pericial y excl
uir recortes.

Art. 217 LEC: la actora debe probar hechos constitutivos; capturas recortadas no acreditan ordenante, cuenta ni
destino sin extracto íntegro/certificado.

Para depurar esto con garantías: pericial contable judicial (art. 339 LEC) con términos de referencia y módulo
prescripción.

https://juantuporaqui.github.io/DEMANDAS/cases/CAS001?tab=audiencia

9/9


10. Dataset de citas — mínimo para emergentes
Crear archivo TS/JSON con estas entradas. Cada chip referencia un ID.
ID	Etiqueta	Extracto
LEC_136	art. 136 LEC — Preclusión	Transcurrido el plazo o pasado el término señalado para la realización de un acto procesal de parte se producirá la preclusión y se perderá la oportunidad de realizar el acto de que se trate. El Letrado de la Administración de Justicia dejará constancia del transcurso del plazo por medio de diligencia y acordará lo que proceda o dará cuenta al tribunal a fin de que dicte la resolución que corresponda.
LEC_402	art. 402 LEC — Oposición a la acumulación de acciones	El demandado podrá oponerse en la contestación a la demanda a la acumulación pretendida, cuando no se acomode a lo dispuesto en los artículos 71 y siguientes de esta Ley. Sobre esta oposición se resolverá en la audiencia previa al juicio.
LEC_73_1_2	art. 73.1.2.º LEC — Juicios de diferente tipo	Para que sea admisible la acumulación de acciones será preciso: (…) 2.º Que las acciones acumuladas no deban, por razón de su materia, ventilarse en juicios de diferente tipo.
LEC_416	art. 416 LEC — Examen de cuestiones procesales en AP	Descartado el acuerdo entre las partes, el tribunal resolverá (…) sobre cualesquiera circunstancias que puedan impedir la válida prosecución y término del proceso mediante sentencia sobre el fondo…
LEC_424	art. 424 LEC — Demanda defectuosa / falta de claridad	Si el demandado alegare en la contestación a la demanda la falta de claridad o precisión (…) el tribunal (…) admitirá en el acto de la audiencia las aclaraciones o precisiones oportunas.
LEC_425	art. 425 LEC — Circunstancias procesales análogas	La resolución de circunstancias alegadas o puestas de manifiesto de oficio, que no se hallen comprendidas en el artículo 416, se acomodará a las reglas establecidas en estos preceptos para las análogas.
LEC_217	art. 217 LEC — Carga de la prueba	Cuando (…) el tribunal considerase dudosos unos hechos relevantes (…) desestimará las pretensiones (…) según corresponda a unos u otros la carga de probar los hechos…
LEC_247	art. 247 LEC — Buena fe procesal	Los intervinientes (…) deberán ajustarse (…) a las reglas de la buena fe. Los tribunales rechazarán fundadamente las peticiones e incidentes que (…) entrañen fraude de ley o procesal.
LEC_328	art. 328 LEC — Exhibición documental entre partes	Cada parte podrá solicitar de las demás la exhibición de documentos (…) que se refieran al objeto del proceso o a la eficacia de los medios de prueba.
LEC_329	art. 329 LEC — Efectos de negativa	En caso de negativa injustificada (…) el tribunal (…) podrá atribuir valor probatorio a la copia simple (…) o a la versión que del contenido del documento hubiese dado.
LEC_330	art. 330 LEC — Exhibición por terceros	Sólo se requerirá a los terceros no litigantes la exhibición de documentos (…) cuando (…) el tribunal entienda que su conocimiento resulta trascendente a los fines de dictar sentencia.
LEC_339	art. 339 LEC — Designación judicial de peritos	Solicitud de designación de peritos por el tribunal y resolución judicial sobre dicha solicitud. Designación de peritos por el tribunal, sin instancia de parte.
LEC_446	art. 446 LEC — Protesta por prueba	Contra las resoluciones (…) sobre admisión o inadmisión de pruebas (…) cabrá reposición (…) y si se desestimare, la parte podrá formular protesta (…) en la segunda instancia.
LEC_21	art. 21 LEC — Allanamiento total (auto de rechazo)	Cuando el demandado se allane a todas las pretensiones (…) el tribunal dictará sentencia (…) pero si el allanamiento se hiciera en fraude de ley (…) se dictará auto rechazándolo y seguirá el proceso adelante.
CC_1964_2	art. 1964.2 CC — prescripción 5 años	Las acciones personales que no tengan plazo especial prescriben a los cinco años desde que pueda exigirse el cumplimiento de la obligación. En las obligaciones continuadas de hacer o no hacer, el plazo comenzará cada vez que se incumplan.
CC_1973	art. 1973 CC — interrupción	La prescripción de las acciones se interrumpe por su ejercicio ante los Tribunales, por reclamación extrajudicial del acreedor y por cualquier acto de reconocimiento de la deuda por el deudor.
CC_1965	art. 1965 CC — división cosa común no prescribe	No prescribe entre coherederos, condueños o propietarios de fincas colindantes la acción para pedir la partición de la herencia, la división de la cosa común o el deslinde de las propiedades contiguas.
11. PROMPT DEFINITIVO PARA CODEX (copiar/pegar)
ROLE
You are Codex (senior full‑stack engineer + product‑minded legal‑tech builder). Modify the existing React/TypeScript/Tailwind app “Case Ops”.

MISSION
Redesign “Audiencia Previa — Centro de mando” into a court‑usable AP command center aligned to LEC 414–430, for P.O. 715/2024 (Picassent). Must be fast, deterministic, copy‑ready.

AUTHORITATIVE SOURCES (CANONICAL)
- /mnt/data/Guion_sala_formateado_v5_CORRECCIONES.docx  → FULL script text (COMPLETO/V5 tab). NEVER rewrite.
- /mnt/data/SENTENCIAS.docx → jurisprudence dataset. Keep “POR COMPROBAR” as status=NO_VERIFICADA.
- /mnt/data/Case Ops - AP2.pdf → legacy UI text to preserve (must remain accessible).
- This spec Section 10 → statute extracts dataset for citation popovers.

LEGAL DISCIPLINE (NON‑NEGOTIABLE)
- NO INVENTAR facts/amounts/dates/docs/juris IDs.
- HECHOS ≠ OPINIÓN: separate HECHOS / HIPÓTESIS / PRUEBA.
- PRECLUSIÓN: territorial competence is a collapsed DIAGNÓSTICO, excluded from script composer by default. Do not place it at the top.

UX / STRUCTURE (MUST MATCH AP FLOW)
- Sections in this order: SANEAMIENTO → HECHOS → PRUEBA → CIERRE.
- Three planes:
  A) SALA (brief): copy 90s + copy acta principal/subsidiario + teleprompter.
  B) COMPLETO (V5 verbatim): show the full V5 text with anchors; searchable.
  C) EXPLICATIVO: notes/risks/counterattacks/checklists (collapsed by default).
- Citations: any “art. …” or jurisprudence appears as a clickable chip opening a small modal with the extract from dataset. If missing → “NO CONSTA”.

IMPLEMENTATION
1) Locate existing AP page and keep route/tabs/buttons names.
2) Redesign layout exactly per this spec (Sections 3–4).
3) Build citations popover/modal + dataset from Section 10.
4) Implement teleprompter (fullscreen, font size, speed, keyboard shortcuts).
5) Print view A4 with page breaks by phase.
6) Confirm no content loss vs AP2/PDF and V5.
7) Deliver clean patch + run steps + smoke steps (teleprompter/print/citations).

FINAL OUTPUT
Return patch + how-to-run + smoke checklist + NO CONSTA list (only if truly missing).
12. Notas críticas
•	No colocar ‘competencia territorial’ lo primero. Debe ir colapsada al final de Saneamiento.
•	Nunca convertir el texto V5 en “NO CONSTA”: el V5 ya contiene el texto literal; hay que cargarlo.
•	No introducir más jurisprudencia ni IDs fuera de SENTENCIAS.docx.
•	Tono formal judicial (sin expresiones coloquiales).
