// ============================================
// HECHOS RECLAMADOS - P.O. 715/2024 Picassent
// Fuente: Rama claude/setup-litigation-system-yDgIX
// ============================================

/**
 * Estado del hecho reclamado desde perspectiva de defensa
 */
export type EstadoHecho = 'prescrito' | 'compensable' | 'disputa';

/**
 * Estructura detallada de cada hecho reclamado por la actora
 */
export interface HechoReclamado {
  id: number;
  titulo: string;
  cuantia: number; // En euros
  año: number;
  hechoActora: string;
  realidadHechos: string;
  oposicion: string[];
  estrategia: string;
  desarrolloMD: string;
  estado: EstadoHecho;
  documentosRef: string[];
  tareas: string[];
  vinculadoA?: number;
}

/**
 * Calcula el resumen contable dinámicamente basado en los hechos
 * Fórmula: Deuda Real = Reclamado - Prescrito - Compensable
 */
export const getResumenContador = () => {
  const totales = calcularTotalesInterno();
  const totalReclamado = totales.prescrito + totales.compensable + totales.disputa;
  const deudaReal = totales.disputa; // Lo que queda en disputa activa
  const reduccion = totalReclamado > 0
    ? Math.round(((totales.prescrito + totales.compensable) / totalReclamado) * 100)
    : 0;

  return {
    totalReclamado,
    prescrito: totales.prescrito,
    compensable: totales.compensable,
    cifraRiesgoReal: deudaReal, // Deuda Real = Reclamado - Prescrito - Compensable
    reduccionObjetivo: reduccion,
    fundamentoLegal: 'Art. 1964.2 CC',
  };
};

// Función interna para evitar dependencia circular
const calcularTotalesInterno = () => {
  const totales = { prescrito: 0, compensable: 0, disputa: 0 };
  hechosReclamados.forEach(h => {
    totales[h.estado] += h.cuantia;
  });
  return totales;
};

// Mantener compatibilidad con código existente (valores calculados, no hardcoded)
export const resumenContador = {
  get totalReclamado() { return getResumenContador().totalReclamado; },
  get cifraRiesgoReal() { return getResumenContador().cifraRiesgoReal; },
  get reduccionObjetivo() { return getResumenContador().reduccionObjetivo; },
  fundamentoLegal: 'Art. 1964.2 CC',
};

/**
 * Los 10 hechos reclamados por la actora con análisis de defensa
 */
export const hechosReclamados: HechoReclamado[] = [
  {
    id: 1,
    titulo: 'Préstamos Personales BBVA',
    cuantia: 20085.00,
    año: 2008,
    hechoActora: 'Vicenta afirma que se cancelaron con dinero privativo de la venta de su casa en Mislata.',
    realidadHechos: 'El ingreso de 18.000€ en efectivo (05/09/2008) lo realizó Juan (Doc. 13). Vicenta usó su dinero para gastos de su propia transmisión de vivienda.',
    oposicion: [
      'Prescripción: Han transcurrido más de 15 años. Acción personal extinguida (Art. 1964 CC).',
      'Falta de Prueba: Vicenta no aporta justificante de ingreso, solo un apunte en libreta que Juan no puede verificar por la cancelación unilateral de la cuenta (Doc. 11).',
    ],
    estrategia: 'Resaltar la contradicción ante la AEAT (Doc. 4) donde ella reconoció que eran préstamos para la construcción del chalet común.',
    desarrolloMD: `# Desarrollo — Hecho 1: Préstamos Personales BBVA (2008)

**Chips:** Año 2008 · Cuantía 20.085,00 € · Estado: **PRESCRITO**

## 1) Objetivo procesal del hecho
Neutralizar una reclamación antigua (2008) por doble vía:
- **Prescripción** (acción personal) y
- **Falta de prueba / contradicción documental** sobre el origen real de los fondos.

## 2) Qué alega la actora
La actora sostiene que los préstamos personales se cancelaron con **dinero privativo** procedente de la venta de una vivienda en Mislata, por lo que existiría un crédito a su favor.

## 3) Hechos verificables y cronología
- En 2008 se formalizan/cancelan operaciones vinculadas a financiación del proyecto inmobiliario común (contexto general del chalet/terrenos).
- Consta un **ingreso de 18.000 € en efectivo (05/09/2008)** realizado por Juan.
- La pretensión intenta reconstruir el origen del dinero “a posteriori” sin trazabilidad bancaria completa.

## 4) Prueba y trazabilidad (qué demuestra cada documento)
- **Doc. 13**: soporte del **ingreso de 18.000 € en efectivo** y su fecha.
  - Clave: atribución del ingreso a Juan (ordenante/ingresante) y ausencia de trazabilidad que lo conecte con “venta privativa” de ella.
- **Doc. 11**: evidencia de **imposibilidad sobrevenida de verificación plena** por cancelación unilateral / falta de continuidad documental de la cuenta.
  - Clave: si la actora rompe la trazabilidad, no puede invertir la carga probatoria.
- **Doc. 4 (AEAT)**: pieza de **contradicción**: reconocimiento previo de finalidad/encaje de esos movimientos con la construcción/proyecto común.
  - Clave: si ante la AEAT se sostuvo un relato distinto (reinversión / finalidad), reduce credibilidad del relato actual.

## 5) Líneas de oposición (procesales y de fondo)
### 5.1 Prescripción (acción personal) — art. 1964 CC
- La reclamación se basa en un supuesto crédito de reembolso de 2008.
- Aun en el escenario más favorable a la actora, han transcurrido **sobradamente** los plazos máximos aplicables tras la reforma de 2015 (art. 1964 CC y régimen transitorio).
- **Dies a quo**: el derecho a reclamar nace cuando se produce el pago/cancelación (2008), no cuando conviene estratégicamente (años después).

### 5.2 Carga de la prueba — art. 217 LEC
- Si la actora afirma “dinero privativo de venta X”, debe aportar:
  - (i) venta (fecha/importe neto),
  - (ii) trazabilidad bancaria (entrada real en cuenta),
  - (iii) conexión directa con la cancelación del préstamo.
- Si no aporta esa cadena documental, **cae la pretensión** por falta de prueba del hecho constitutivo.

### 5.3 Contradicción y credibilidad
- Si la propia actora sostuvo ante la AEAT un relato finalista distinto, se refuerza:
  - inconsistencia,
  - oportunismo,
  - reconstrucción interesada.

## 6) Ataques de credibilidad/contradicciones (cómo plantearlo)
- “Usted afirma venta privativa → muestre la trazabilidad completa venta → ingreso → cancelación.”
- “¿Por qué ante la AEAT sostuvo una finalidad distinta?”
- “¿Por qué el ingreso relevante aparece como efectivo y no como transferencia trazable de venta?”

## 7) Plan B si el juez compra el marco STS 458/2025
- **ARG 1 — NEGOCIO, NO VIVIENDA (9/10):** El préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Tras caer el mercado, se alquiló y Airbnb. NUNCA fue domicilio familiar. La STS 458/2025 protege la vivienda habitual (arts. 67-68 CC, socorro mutuo), no inversiones especulativas. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni la hipoteca de la casa familiar es carga del matrimonio.
- **ARG 2 — SIN DESEQUILIBRIO (8/10):** La STS 458/2025 requiere probar que los fondos procedían «casi exclusivamente» de un cónyuge. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella «puso más» en hipoteca, Juan «puso más» en el resto (comida, ropa, hijos, facturas). Economía integrada. Art. 217 LEC: carga de la prueba sobre quien reclama.
- **ARG 3 — RETRASO DESLEAL (7/10):** Policía con máster en económicas + cotitular de ambas cuentas + 10+ años sin reclamar, sin transferencia compensatoria, sin documentar desequilibrio. Confianza legítima (art. 7 CC). Verwirkung.
- **ARG 4 — PROCESAL (6/10):** Si estos argumentos no constan en contestación, art. 426.4 LEC permite complemento de alegaciones en AP por hecho jurídico nuevo (STS posterior a contestación).
Además, este hecho es PRE-matrimonio (matrimonio 08/2013), lo que refuerza la inaplicabilidad de la doctrina matrimonial de la STS 458/2025.

## 8) Preguntas sugeridas (interrogatorio/pericial)
- “Identifique fecha exacta de la venta, neto recibido y cuenta de abono.”
- “Aporte extracto completo del mes del supuesto ingreso y del día de cancelación.”
- “Explique por qué el ingreso es en efectivo y quién lo realiza.”
- “Confirme su declaración/posición ante AEAT sobre el destino del dinero.”

## 9) Mensaje corto (15s) para sala
“Hecho de 2008: está prescrito y, además, no hay cadena documental que conecte venta privativa con la cancelación; al contrario, hay un ingreso en efectivo atribuible a Juan y un relato previo ante AEAT incompatible.”`,
    estado: 'prescrito',
    documentosRef: ['Doc. 13', 'Doc. 11', 'Doc. 4'],
    tareas: ['Localizar extracto bancario que identifique a Juan como ordenante de los 18.000€'],
  },
  {
    id: 2,
    titulo: 'Vehículo Seat León',
    cuantia: 13000.00,
    año: 2014,
    hechoActora: 'Dice que se pagó desde la cuenta Barclays que "solo se nutría de sus nóminas".',
    realidadHechos: 'La cuenta tenía ingresos extra de Juan por más de 100.000€ (Doc. 2). Juan pagó el otro coche familiar (Renault Scenic) por 4.500€ (Doc. 17).',
    oposicion: [
      'Prescripción: Acción de más de 10 años.',
      'Acto de Liberalidad: Compra familiar de mutuo acuerdo. Uso exclusivo de Vicenta durante los últimos 2 años.',
    ],
    estrategia: '"Doble Rasero": Ella reclama el 100% de este coche pero oculta que Juan pagó el Scenic que ella también usa.',
    desarrolloMD: `# Desarrollo — Hecho 2: Vehículo Seat León (2014)

**Chips:** Año 2014 · Cuantía 13.000,00 € · Estado: **PRESCRITO**

## 1) Objetivo procesal
Desactivar una reclamación “selectiva” (solo un coche) demostrando:
- prescripción,
- cuenta con ingresos mixtos,
- compensación material por otro vehículo familiar pagado por Juan,
- y uso exclusivo de la actora en los últimos años.

## 2) Qué alega la actora
Que el Seat León se pagó desde una cuenta que “solo se nutría de sus nóminas”, por lo que reclama el 100% del importe como crédito a su favor.

## 3) Hechos verificables y cronología
- Compra del vehículo en 2014.
- Existencia de otros gastos familiares y de otro vehículo (Renault Scenic) sufragado por Juan.

## 4) Prueba y trazabilidad
- **Doc. 2**: movimientos/ingresos que muestran aportaciones de Juan (más de 100.000 €).
- **Doc. 17**: pago/adquisición del Renault Scenic (4.500 €).
- **Doc. 16**: informe DGT / titularidad / trazabilidad del Scenic.

## 5) Líneas de oposición
### 5.1 Prescripción
- Reclamación de 2014: acción personal de reembolso, hoy claramente fuera de plazo (art. 1964 CC y transitorio).

### 5.2 Carga de la prueba (art. 217 LEC)
- Si afirma “solo nóminas de ella”, debe aportar extractos completos que excluyan ingresos de Juan.
- Con Doc. 2 se acredita lo contrario.

### 5.3 Hecho de familia / equilibrio patrimonial
- Vehículo adquirido para la familia y dinámicas de uso compartido.
- Además, la actora pretende el 100% del Seat mientras **omite** el Scenic pagado por Juan y utilizado por ambos (doble rasero).

## 6) Contradicciones explotables
- “Si la cuenta era solo suya, ¿por qué hay ingresos relevantes de Juan?”
- “¿Por qué reclama un coche y no se compensa con el otro coche familiar pagado por Juan?”

## 7) Plan B STS 458/2025
- **ARG 1 — NEGOCIO, NO VIVIENDA (9/10):** El préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Tras caer el mercado, se alquiló y Airbnb. NUNCA fue domicilio familiar. La STS 458/2025 protege la vivienda habitual (arts. 67-68 CC, socorro mutuo), no inversiones especulativas. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni la hipoteca de la casa familiar es carga del matrimonio.
- **ARG 2 — SIN DESEQUILIBRIO (8/10):** La STS 458/2025 requiere probar que los fondos procedían «casi exclusivamente» de un cónyuge. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella «puso más» en hipoteca, Juan «puso más» en el resto (comida, ropa, hijos, facturas). Economía integrada. Art. 217 LEC: carga de la prueba sobre quien reclama.
- **ARG 3 — RETRASO DESLEAL (7/10):** Policía con máster en económicas + cotitular de ambas cuentas + 10+ años sin reclamar, sin transferencia compensatoria, sin documentar desequilibrio. Confianza legítima (art. 7 CC). Verwirkung.
- **ARG 4 — PROCESAL (6/10):** Si estos argumentos no constan en contestación, art. 426.4 LEC permite complemento de alegaciones en AP por hecho jurídico nuevo (STS posterior a contestación).

## 8) Preguntas sugeridas
- “Aporte extractos anuales completos de la cuenta durante 2013–2015.”
- “Reconozca uso del Seat y del Scenic y su destino familiar.”
- “Explique por qué reclama solo un activo y omite el otro.”

## 9) Mensaje 15s
“2014: prescrito. Y además la cuenta tenía ingresos de Juan; pretender el 100% del Seat ocultando el Scenic pagado por Juan es incoherente y reduce credibilidad.”`,
    estado: 'prescrito',
    documentosRef: ['Doc. 2', 'Doc. 17', 'Doc. 16'],
    tareas: ['Aportar informe DGT del Renault Scenic (Doc. 16)'],
  },
  {
    id: 3,
    titulo: 'Venta Vivienda Artur Piera',
    cuantia: 32000.00,
    año: 2022,
    hechoActora: 'Transferencia de Juan a su cuenta privativa sin consentimiento.',
    realidadHechos: 'Inversión común (Subasta). Juan hizo la reforma físicamente (Doc. 20). Tras la venta, Vicenta retiró 38.500€ (Doc. 3), superando en 6.500€ lo retirado por Juan.',
    oposicion: [
      'Juan necesitaba el dinero para subsistir tras ser expulsado de su casa privativa (Lope de Vega).',
      'Es un reparto de beneficios de una inversión común.',
    ],
    estrategia: 'Destacar la mala fe de Vicenta al omitir que ella retiró una cantidad mayor.',
    desarrolloMD: `# Desarrollo — Hecho 3: Venta Vivienda Artur Piera (2022)

**Chips:** Año 2022 · Cuantía 32.000,00 € · Estado: **DISPUTA**

## 1) Objetivo procesal
Reencuadrar la “transferencia sin consentimiento” como:
- reparto de beneficios de inversión común,
- necesidad de subsistencia tras pérdida de uso de vivienda privativa,
- y neutralización por retirada posterior/superior de la actora.

## 2) Qué alega la actora
Que Juan transfirió 32.000 € a su cuenta privativa sin consentimiento.

## 3) Hechos verificables y cronología
- Operación/inversión común (subasta).
- Juan realiza la reforma de forma material y/o asume gastos.
- Tras la venta:
  - Juan recibe 32.000 €.
  - La actora retira 38.500 € (más que Juan), excediendo en 6.500 €.

## 4) Prueba y trazabilidad
- **Doc. 20**: acreditación de reforma/actuaciones ejecutadas por Juan.
- **Doc. 3**: retirada de 38.500 € por la actora.
- **Doc. 22**: detalle de gastos de reforma (Leroy Merlin/Bricomart).

## 5) Líneas de oposición
### 5.1 Hecho neutralizador: reparto neto
Si la actora retiró más, la narrativa de “apropiación unilateral” se desinfla: el neto no favorece a Juan.

### 5.2 Necesidad y proporcionalidad
Contexto: expulsión/falta de uso de vivienda privativa → necesidad de liquidez para subsistir.
No es un “ánimus de apropiación”, sino una extracción vinculada al reparto de beneficios.

### 5.3 Carga de la prueba (217 LEC)
Si acusa “sin consentimiento”, debe probar:
- qué pacto existía,
- qué destino debió darse a los fondos,
- y por qué su propia retirada mayor no se integra en el mismo régimen.

## 6) Contradicciones
- Omisión deliberada de su retirada superior.
- Presentación sesgada del flujo económico.

## 7) Plan B STS 458/2025
- **ARG 1 — NEGOCIO, NO VIVIENDA (9/10):** El préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Tras caer el mercado, se alquiló y Airbnb. NUNCA fue domicilio familiar. La STS 458/2025 protege la vivienda habitual (arts. 67-68 CC, socorro mutuo), no inversiones especulativas. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni la hipoteca de la casa familiar es carga del matrimonio.
- **ARG 2 — SIN DESEQUILIBRIO (8/10):** La STS 458/2025 requiere probar que los fondos procedían «casi exclusivamente» de un cónyuge. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella «puso más» en hipoteca, Juan «puso más» en el resto (comida, ropa, hijos, facturas). Economía integrada. Art. 217 LEC: carga de la prueba sobre quien reclama.
- **ARG 3 — RETRASO DESLEAL (7/10):** Policía con máster en económicas + cotitular de ambas cuentas + 10+ años sin reclamar, sin transferencia compensatoria, sin documentar desequilibrio. Confianza legítima (art. 7 CC). Verwirkung.
- **ARG 4 — PROCESAL (6/10):** Si estos argumentos no constan en contestación, art. 426.4 LEC permite complemento de alegaciones en AP por hecho jurídico nuevo (STS posterior a contestación).

## 8) Preguntas sugeridas
- “Reconozca su retirada de 38.500 € y explique por qué no la incluye.”
- “Acepte que hubo inversión y reforma, y quién la ejecutó/pagó.”
- “¿Cuál era el criterio pactado de reparto?”

## 9) Mensaje 15s
“No hay apropiación: fue una inversión común y, tras la venta, ella retiró incluso más que Juan. Si se liquida, debe ser por neto y con todos los movimientos.”`,
    estado: 'disputa',
    documentosRef: ['Doc. 20', 'Doc. 3', 'Doc. 22'],
    tareas: ['Cuadrar tabla de gastos de reforma (Leroy Merlin, Bricomart) pagados por Juan (Doc. 22)'],
  },
  {
    id: 4,
    titulo: 'Hipoteca Vivienda Lope de Vega',
    cuantia: 122282.28,
    año: 2009,
    hechoActora: 'Dice que pagó la hipoteca de la casa privativa de Juan.',
    realidadHechos: 'El préstamo de 310.000€ se usó para comprar los terrenos de Montroy y Godelleta. La casa de Lope de Vega fue solo la garantía (aval) (Doc. 6).',
    oposicion: [
      'Prescripción: Todo lo anterior a junio de 2019 está prescrito.',
      'Naturaleza: Es una deuda solidaria para adquirir patrimonio común del que ella ahora pide el 50%.',
    ],
    estrategia: 'Vicenta quiere el 50% de los terrenos sin haber pagado el préstamo con el que se compraron. “Mala fe procesal”.',
    desarrolloMD: `# Desarrollo — Hecho 4: Hipoteca / Garantía Lope de Vega (2009)

**Chips:** Año 2009 · Cuantía 122.282,28 € · Estado: **PRESCRITO**

## 1) Objetivo procesal
Desmontar la tesis “pagué la hipoteca de tu casa privativa” aclarando:
- naturaleza real: préstamo para patrimonio común (terrenos/chalet) con vivienda privativa como garantía,
- solidaridad y beneficio común,
- y prescripción de cualquier reembolso histórico.

## 2) Qué alega la actora
Que pagó la hipoteca de la casa privativa de Juan y por ello le corresponde un crédito.

## 3) Hechos verificables y cronología
- Existió financiación principal para compra de terrenos y construcción vinculada al patrimonio común.
- La vivienda privativa de Lope de Vega se utilizó como **garantía/aval**, no como destino del capital.

## 4) Prueba
- **Doc. 6**: documental bancaria/notarial que acredita finalidad del préstamo (310.000 €) y encaje de la garantía.

## 5) Líneas de oposición
### 5.1 Naturaleza jurídica (fondo)
Si el préstamo financia patrimonio común, no cabe “reembolso por pagar tu casa”:
- La deuda se asume para adquirir bienes comunes.
- Pretender el 50% de los bienes y, a la vez, reclamar como si el préstamo fuera “de Juan” es inconsistente.

### 5.2 Prescripción (art. 1964 CC + transitorio)
Cualquier pretensión de reembolso por pagos antiguos (especialmente pre-2019 según tu propio corte de trabajo) está prescrita.

### 5.3 Carga de la prueba (217 LEC)
Que precise:
- qué cuotas pagó ella,
- desde qué cuenta,
- con qué origen (privativo vs común),
- y cómo separa esos pagos del beneficio patrimonial que reclama.

## 6) Contradicciones
- Reclama reembolso como si no hubiera adquirido/pretendido adquirir el patrimonio financiado.
- Pretende “doble cobro”: 50% de bienes + devolución de financiación.

## 7) Plan B STS 458/2025
- **ARG 1 — NEGOCIO, NO VIVIENDA (9/10):** El préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Tras caer el mercado, se alquiló y Airbnb. NUNCA fue domicilio familiar. La STS 458/2025 protege la vivienda habitual (arts. 67-68 CC, socorro mutuo), no inversiones especulativas. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni la hipoteca de la casa familiar es carga del matrimonio.
- **ARG 2 — SIN DESEQUILIBRIO (8/10):** La STS 458/2025 requiere probar que los fondos procedían «casi exclusivamente» de un cónyuge. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella «puso más» en hipoteca, Juan «puso más» en el resto (comida, ropa, hijos, facturas). Economía integrada. Art. 217 LEC: carga de la prueba sobre quien reclama.
- **ARG 3 — RETRASO DESLEAL (7/10):** Policía con máster en económicas + cotitular de ambas cuentas + 10+ años sin reclamar, sin transferencia compensatoria, sin documentar desequilibrio. Confianza legítima (art. 7 CC). Verwirkung.
- **ARG 4 — PROCESAL (6/10):** Si estos argumentos no constan en contestación, art. 426.4 LEC permite complemento de alegaciones en AP por hecho jurídico nuevo (STS posterior a contestación).

## 8) Preguntas sugeridas
- “Reconozca que el destino del préstamo fue compra/obra del patrimonio común.”
- “Explique cómo puede querer el 50% de esos bienes y reclamar a la vez como si no hubiera sido beneficiaria.”
- “Detalle cuotas concretas supuestamente pagadas por usted y su fuente.”

## 9) Mensaje 15s
“El préstamo fue para bienes comunes; Lope de Vega fue garantía. No puede pedir el 50% del patrimonio financiado y, además, cobrar como si hubiera pagado ‘mi casa’. Y lo antiguo, prescrito.”`,
    estado: 'prescrito',
    documentosRef: ['Doc. 6'],
    tareas: ['Certificación de nóminas de Juan (2016-2022) superiores a las de Vicenta'],
    vinculadoA: 9,
  },
  {
    id: 5,
    titulo: 'IBI Lope de Vega',
    cuantia: 1826.91,
    año: 2013,
    hechoActora: 'Pagados por ella desde la cuenta común.',
    realidadHechos: 'Pagados desde la cuenta BBVA 9397 donde Juan ingresaba su nómina (Doc. 12).',
    oposicion: [
      'Prescripción pre-2019.',
      'Juan es quien ha nutrido esa cuenta durante 16 años.',
    ],
    estrategia: 'Vincular los recibos del Ayuntamiento de Quart al historial de nóminas de Juan.',
    desarrolloMD: `# Desarrollo — Hecho 5: IBI Lope de Vega (2013)

**Chips:** Año 2013 · Cuantía 1.826,91 € · Estado: **PRESCRITO**

## 1) Objetivo procesal
Eliminar reclamaciones accesorias antiguas:
- prescripción,
- pagos desde cuenta nutrida por Juan,
- y encaje como gasto vinculado a convivencia/uso.

## 2) Qué alega la actora
Que ella abonó el IBI desde cuenta común y debe reintegrarse.

## 3) Hechos verificables
- Pagos desde cuenta BBVA 9397 donde Juan ingresaba nómina (según tu dato de trabajo).

## 4) Prueba
- **Doc. 12**: extractos/recibos que conectan recibos del Ayuntamiento con la cuenta y su nutrición.

## 5) Líneas de oposición
- Prescripción.
- Carga de la prueba: demostrar origen privativo de ella (si pretende reembolso).
- Si la cuenta era de uso común y nutrida por Juan, no hay hecho constitutivo del crédito.

## 6) Plan B STS 458/2025
- **ARG 1 — NEGOCIO, NO VIVIENDA (9/10):** El préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Tras caer el mercado, se alquiló y Airbnb. NUNCA fue domicilio familiar. La STS 458/2025 protege la vivienda habitual (arts. 67-68 CC, socorro mutuo), no inversiones especulativas. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni la hipoteca de la casa familiar es carga del matrimonio.
- **ARG 2 — SIN DESEQUILIBRIO (8/10):** La STS 458/2025 requiere probar que los fondos procedían «casi exclusivamente» de un cónyuge. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella «puso más» en hipoteca, Juan «puso más» en el resto (comida, ropa, hijos, facturas). Economía integrada. Art. 217 LEC: carga de la prueba sobre quien reclama.
- **ARG 3 — RETRASO DESLEAL (7/10):** Policía con máster en económicas + cotitular de ambas cuentas + 10+ años sin reclamar, sin transferencia compensatoria, sin documentar desequilibrio. Confianza legítima (art. 7 CC). Verwirkung.
- **ARG 4 — PROCESAL (6/10):** Si estos argumentos no constan en contestación, art. 426.4 LEC permite complemento de alegaciones en AP por hecho jurídico nuevo (STS posterior a contestación).

## 7) Mensaje 15s
“IBI antiguo, prescrito, y además pagado desde cuenta sustentada por la nómina de Juan; no hay base probatoria para reembolso.”`,
    estado: 'prescrito',
    documentosRef: ['Doc. 12'],
    tareas: [],
  },
  {
    id: 6,
    titulo: 'IBI Chalet Montroy',
    cuantia: 530.85,
    año: 2020,
    hechoActora: 'Reclama el 50% de los pagos.',
    realidadHechos: 'Pagados desde la cuenta común del BBVA (Doc. 1).',
    oposicion: [
      'No cabe reembolso de gastos pagados con fondos comunes para el mantenimiento de bienes comunes.',
    ],
    estrategia: 'Presentar el extracto del BBVA del 12/02/2021 que muestra el cargo directo.',
    desarrolloMD: `# Desarrollo — Hecho 6: IBI Chalet Montroy (2020)

**Chips:** Año 2020 · Cuantía 530,85 € · Estado: **DISPUTA**

## 1) Objetivo procesal
Cerrar la discusión: si se pagó con fondos comunes, **no hay reembolso**.

## 2) Qué alega la actora
Reclama el 50% de pagos del IBI.

## 3) Hechos verificables
- Pagado desde cuenta común BBVA.

## 4) Prueba
- **Doc. 1**: extracto con cargo directo (12/02/2021 u otra fecha concreta que conste).

## 5) Líneas de oposición
- Gastos de conservación/mantenimiento de bien común pagados con fondos comunes → no generan crédito.
- Si pretende que fue “privativo”, debe probarlo (217 LEC).

## 6) Mensaje 15s
“Si sale de cuenta común, no hay reembolso: es gasto del bien común pagado con dinero común.”`,
    estado: 'disputa',
    documentosRef: ['Doc. 1'],
    tareas: [],
  },
  {
    id: 7,
    titulo: 'IBI Fincas Rústicas',
    cuantia: 151.81,
    año: 2020,
    hechoActora: 'Pagados desde su cuenta privativa.',
    realidadHechos: 'Cantidad menor comparada con los gastos que Juan ha asumido directamente.',
    oposicion: [
      'Compensación de créditos. Juan pagó facturas de fitosanitarios por 308,24€ (Doc. 27).',
    ],
    estrategia: 'Invocar Art. 1196 CC. La deuda de ella con Juan es mayor que estos 151€.',
    desarrolloMD: `# Desarrollo — Hecho 7: IBI Fincas Rústicas (2020)

**Chips:** Año 2020 · Cuantía 151,81 € · Estado: **COMPENSABLE**

## 1) Objetivo procesal
No pelearlo “a muerte”: convertirlo en **compensación de créditos** y pasar página.

## 2) Qué alega la actora
Que lo pagó desde cuenta privativa.

## 3) Hechos verificables
- El importe es menor y existe gasto superior asumido por Juan (fitosanitarios).

## 4) Prueba
- **Doc. 27**: facturas fitosanitarios (308,24 €) pagadas por Juan.

## 5) Líneas de oposición
- Compensación de créditos (arts. 1195 y ss. CC): si Juan tiene crédito mayor contra ella, se compensa.
- Carga probatoria: ella prueba pago; tú pruebas pagos mayores.

## 6) Mensaje 15s
“Si ella pagó 151 €, se compensa con gastos mayores pagados por Juan (308 €). Cero saldo a su favor.”`,
    estado: 'compensable',
    documentosRef: ['Doc. 27'],
    tareas: [],
  },
  {
    id: 8,
    titulo: 'Comunidad Loma de los Caballeros',
    cuantia: 19.39,
    año: 2023,
    hechoActora: 'Pago del 4º Trimestre 2023.',
    realidadHechos: 'Juan ha pagado cuotas posteriores que compensan esta cantidad.',
    oposicion: [
      'Compensación. Juan pagó el 1er Trimestre 2024 (36,06€) (Doc. 28).',
    ],
    estrategia: 'Aplicar la misma lógica de compensación del punto 7.',
    desarrolloMD: `# Desarrollo — Hecho 8: Comunidad Loma de los Caballeros (2023)

**Chips:** Año 2023 · Cuantía 19,39 € · Estado: **COMPENSABLE**

## 1) Objetivo
Tratarlo como micro-saldo compensable (evitar ruido).

## 2) Prueba
- **Doc. 28**: pago posterior de Juan (36,06 €).

## 3) Oposición
- Compensación automática por pagos posteriores.
- Proporcionalidad: no elevarlo a “pretensión” relevante.

## 4) Mensaje 15s
“19,39 € queda compensado con pagos posteriores de Juan acreditados; saldo neto no favorece a la actora.”`,
    estado: 'compensable',
    documentosRef: ['Doc. 28'],
    tareas: [],
  },
  {
    id: 9,
    titulo: 'Amortización Hipoteca Previa',
    cuantia: 16979.59,
    año: 2006,
    hechoActora: 'Dice que se usó dinero común para cancelar la hipoteca previa de Juan.',
    realidadHechos: 'Fue una condición del banco para conceder el préstamo de 310.000€ para los terrenos comunes.',
    oposicion: [
      'Prescripción radical. Hecho de hace 19 años.',
      'Fue una condición del banco para darles el préstamo de 310.000€.',
    ],
    estrategia: 'Ella aceptó esto en 2006 para poder comprar el chalet de Montroy. No puede reclamarlo ahora.',
    desarrolloMD: `# Desarrollo — Hecho 9: Amortización Hipoteca Previa (2006)

**Chips:** Año 2006 · Cuantía 16.979,59 € · Estado: **PRESCRITO**

## 1) Objetivo procesal
Cortar por lo sano: hecho remotísimo + condición bancaria + prescripción.

## 2) Qué alega la actora
Que se usó dinero común para cancelar hipoteca previa de Juan.

## 3) Hechos verificables
- Fue condición del banco para conceder financiación posterior para bienes comunes.

## 4) Oposición
- Prescripción “radical” por antigüedad.
- Aun si hubiera pago, fue presupuesto para conseguir préstamo orientado a patrimonio común: aceptación consciente en 2006.

## 5) Plan B STS 458/2025
- **ARG 1 — NEGOCIO, NO VIVIENDA (9/10):** El préstamo financió parcelas para construir y vender chalets como negocio inmobiliario. Tras caer el mercado, se alquiló y Airbnb. NUNCA fue domicilio familiar. La STS 458/2025 protege la vivienda habitual (arts. 67-68 CC, socorro mutuo), no inversiones especulativas. Refuerzo: STS 20/03/2013 y STS 246/2018 — ni la hipoteca de la casa familiar es carga del matrimonio.
- **ARG 2 — SIN DESEQUILIBRIO (8/10):** La STS 458/2025 requiere probar que los fondos procedían «casi exclusivamente» de un cónyuge. Aquí: sueldos comparables, 2 cuentas conjuntas, 0 patrimonio privativo, nóminas en bancos distintos solo por comisiones. Si ella «puso más» en hipoteca, Juan «puso más» en el resto (comida, ropa, hijos, facturas). Economía integrada. Art. 217 LEC: carga de la prueba sobre quien reclama.
- **ARG 3 — RETRASO DESLEAL (7/10):** Policía con máster en económicas + cotitular de ambas cuentas + 10+ años sin reclamar, sin transferencia compensatoria, sin documentar desequilibrio. Confianza legítima (art. 7 CC). Verwirkung.
- **ARG 4 — PROCESAL (6/10):** Si estos argumentos no constan en contestación, art. 426.4 LEC permite complemento de alegaciones en AP por hecho jurídico nuevo (STS posterior a contestación).

## 6) Mensaje 15s
“Hecho de 2006: prescrito y, además, fue condición bancaria para financiar bienes comunes que ella ahora pretende al 50%.”`,
    estado: 'prescrito',
    documentosRef: [],
    tareas: [],
    vinculadoA: 4,
  },
  {
    id: 10,
    titulo: 'Maquinaria Agrícola',
    cuantia: 5801.25,
    año: 2018,
    hechoActora: 'Comprada con dinero común, pero la tiene Juan.',
    realidadHechos: 'Inversión para el negocio de olivos. Vicenta cobró 10.887,57€ netos de beneficios en 2023 (Doc. 29) gracias a esa maquinaria.',
    oposicion: [
      'No puede cobrar beneficios y no pagar la inversión.',
    ],
    estrategia: 'Presentar la factura de Oleos Dels Alforins a nombre de Vicenta.',
    desarrolloMD: `# Desarrollo — Hecho 10: Maquinaria Agrícola (2018)

**Chips:** Año 2018 · Cuantía 5.801,25 € · Estado: **DISPUTA**

## 1) Objetivo procesal
Evitar que la actora convierta “posesión” en “apropiación” cuando:
- la inversión genera rendimientos cobrados por ella,
- y el reparto debe ser coherente: inversión + beneficios.

## 2) Qué alega la actora
Que se compró con dinero común pero la maquinaria está con Juan.

## 3) Hechos verificables
- Inversión destinada al negocio de olivos.
- La actora cobró beneficios netos 2023 (10.887,57 €) derivados del negocio apoyado por esa maquinaria.

## 4) Prueba
- **Doc. 29**: factura/beneficios/ingresos vinculados (a su nombre o cobrados por ella).

## 5) Oposición
- Principio de coherencia: no puede reclamar el activo sin integrar los beneficios ya cobrados.
- Liquidación correcta: o se adjudica maquinaria con compensación, o se reparte junto con frutos/rendimientos.

## 6) Preguntas sugeridas
- “¿Reconoce haber cobrado 10.887,57 € netos en 2023?”
- “¿Qué inversión lo hizo posible y quién la soportó/gestionó?”
- “¿Por qué reclama el activo sin traer a colación los frutos?”

## 7) Mensaje 15s
“No se puede reclamar la maquinaria sin computar los beneficios que ella ya cobró gracias a esa inversión; la liquidación debe integrar activo + rendimientos.”`,
    estado: 'disputa',
    documentosRef: ['Doc. 29'],
    tareas: ['Acreditar el ingreso de los beneficios del olivar en la cuenta privativa de ella'],
  },
];

/**
 * Calcula totales por estado de los hechos reclamados
 */
export const calcularTotales = () => {
  const totales = {
    prescrito: 0,
    compensable: 0,
    disputa: 0,
  };

  hechosReclamados.forEach(h => {
    totales[h.estado] += h.cuantia;
  });

  return totales;
};

/**
 * Obtiene el porcentaje de reducción potencial
 */
export const getPorcentajeReduccion = () => {
  const totales = calcularTotales();
  const reducible = totales.prescrito + totales.compensable;
  return Math.round((reducible / resumenContador.totalReclamado) * 100);
};
