// ============================================
// CASE OPS - Seed Data (CASO REAL: PICASSENT 715/2024 - VERSIÓN EXTENDIDA)
// ============================================

import {
  settingsRepo,
  counterRepo,
  casesRepo,
  factsRepo,
  partidasRepo,
  eventsRepo,
  strategiesRepo,
  documentsRepo
} from './repositories';
import { eurosToCents } from '../utils/validators';
import { nanoid } from 'nanoid';

export async function seedDatabase(): Promise<boolean> {
  const settings = await settingsRepo.get();
  if (settings) {
    console.log('Database already initialized');
    return false;
  }

  console.log('Seeding database with EXTENDED REAL CASE DATA...');

  try {
    // 1. Configuración Inicial
    await settingsRepo.init('Desktop');
    const counters = ['cases', 'documents', 'spans', 'facts', 'partidas', 'events', 'strategies', 'tasks'];
    for (const c of counters) await counterRepo.setCounter(c, 0);

    // =====================================================================
    // 1. CASO PRINCIPAL
    // =====================================================================
    const mainCase = await casesRepo.create({
      title: 'P.O. 715/2024 · División Cosa Común y Reclamación',
      court: 'JPI nº 1 de Picassent',
      autosNumber: '715/2024',
      type: 'ordinario',
      status: 'activo',
      clientRole: 'demandado',
      judge: '[Pendiente]',
      opposingCounsel: 'Isabel Luzzy Aguilar',
      notes: 'Reclamación de 212.677€ por Vicenta. Defensa basada en Prescripción (71% cuantía), Naturaleza de Hipoteca y Compensación de saldos.',
      tags: ['familia', 'civil', 'complejo', 'prescripcion']
    });

    // =====================================================================
    // 2. CASOS SECUNDARIOS
    // =====================================================================
    const quartCase = await casesRepo.create({
      title: 'ETJ 1428/2025 · Ejecución Cuenta Hijos',
      court: 'Juzgado de Primera Instancia nº 1 de Quart de Poblet',
      autosNumber: '1428/2025',
      type: 'ejecucion',
      status: 'activo',
      clientRole: 'ejecutado',
      judge: 'Sandra Lozano López',
      opposingCounsel: 'Isabel Luzzy Aguilar (Vicenta Jiménez Vera)',
      notes: 'Ejecución por supuestos impagos 200€/mes cuenta hijos. Reclamación: 2.400€. Oposición presentada. Vista: 23/04/2026 09:30. NIG: 4610241120230002538',
      tags: ['ejecucion', 'familia', 'cuenta-hijos', 'oposicion', 'vista']
    });

    const mislataCase = await casesRepo.create({
      title: 'J.V. 1185/2025 · Reclamación Cuotas Hipotecarias',
      court: 'JPI nº 3 de Mislata',
      autosNumber: '1185/2025',
      type: 'verbal',
      status: 'activo',
      clientRole: 'demandante',
      judge: '[Pendiente]',
      opposingCounsel: 'Isabel Luzzy Aguilar (Vicenta Jiménez Vera)',
      notes: 'Reclamación de 7.119,98€ por cuotas hipotecarias pagadas en exceso (oct 2023 - jun 2025). Art. 1145 CC - Acción de regreso deudor solidario. Pendiente resolución recurso reposición contra litispendencia.',
      tags: ['hipoteca', 'cuotas', 'solidaridad', 'regreso', 'art-1145-CC']
    });

    // Eventos básicos para Quart (ETJ 1428/2025)
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2023-10-17',
      type: 'procesal',
      title: 'Sentencia Divorcio 362/2023',
      description: 'Sentencia aprobando convenio regulador. Juez: Sandra Lozano López. Base del título ejecutivo.'
    } as any);
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2025-10-30',
      type: 'procesal',
      title: 'Auto y Decreto Despacho Ejecución',
      description: 'Se despacha ejecución por 2.400€ y se decreta embargo de cuentas y devoluciones tributarias.'
    } as any);
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2025-11-06',
      type: 'procesal',
      title: 'Notificación a Juan',
      description: 'Juan es notificado del Auto y Decreto de ejecución.'
    } as any);
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2026-01-14',
      type: 'procesal',
      title: 'Providencia señalando Vista',
      description: 'Se señala vista para el 23/04/2026 a las 09:30. Se tiene por impugnada la oposición.'
    } as any);
    await eventsRepo.create({
      caseId: quartCase.id,
      date: '2026-04-23',
      type: 'procesal',
      title: 'VISTA ORAL',
      description: 'Celebración de la vista oral en el procedimiento de oposición a la ejecución 1428.1/2025. Hora: 09:30.'
    } as any);

    // Eventos básicos para Mislata (J.V. 1185/2025)
    await eventsRepo.create({
      caseId: mislataCase.id,
      date: '2025-09-24',
      type: 'procesal',
      title: 'Presentación Demanda',
      description: 'Demanda de reclamación de cantidad (7.119,98€) por cuotas hipotecarias.'
    } as any);
    await eventsRepo.create({
      caseId: mislataCase.id,
      date: '2025-11-19',
      type: 'procesal',
      title: 'Admisión a Trámite',
      description: 'Admitida demanda de juicio verbal.'
    } as any);
    await eventsRepo.create({
      caseId: mislataCase.id,
      date: '2025-12-19',
      type: 'procesal',
      title: 'Impugnación Recurso Reposición',
      description: 'Impugnación del recurso de Vicenta contra litispendencia/prejudicialidad.'
    } as any);

    // =====================================================================
    // HECHOS, ESTRATEGIAS Y PARTIDAS PARA QUART (ETJ 1428/2025)
    // =====================================================================
    const quartFactsData = [
      { title: 'Cumplimiento / Pago parcial', narrative: 'Juan aportó 1.971,27€ hasta sept 2025. Tras el despacho, transfirió 200€ adicionales. Déficit real es 1.828,73€, no 2.400€.', status: 'a_probar', burden: 'ejecutado', risk: 'bajo', strength: 4, tags: ['pago', 'art-556-LEC'] },
      { title: 'Compensación de créditos', narrative: 'Vicenta retiró 2.710,61€ de la cuenta común para gastos no autorizados. Juan tiene crédito a su favor: 881,88€.', status: 'controvertido', burden: 'ejecutado', risk: 'medio', strength: 3, tags: ['compensacion', 'art-1195-CC'] },
      { title: 'Pluspetición', narrative: 'Se reclaman 2.400€ cuando el déficit real es 1.828,73€. Juan realizó pagos directos por 1.895,65€.', status: 'a_probar', burden: 'ejecutado', risk: 'bajo', strength: 4, tags: ['pluspeticion', 'art-558-LEC'] },
      { title: 'Domicilio erróneo en demanda', narrative: 'Figura C/ Isabel de Villena 2-5 Mislata (domicilio de Vicenta). Juan nunca residió allí.', status: 'controvertido', burden: 'ejecutado', risk: 'medio', strength: 2, tags: ['notificacion', 'art-155-LEC'] },
      { title: 'Abuso de derecho y mala fe', narrative: 'La cuenta tenía 1.005,42€ al interponer demanda. Vicenta dejó de pagar hipoteca y retira fondos personales.', status: 'controvertido', burden: 'ejecutado', risk: 'medio', strength: 3, tags: ['abuso', 'art-7-2-CC'] },
      { title: 'Naturaleza no alimenticia', narrative: 'La cuenta común es fondo finalista con reglas de consenso, no alimentos incondicionales.', status: 'controvertido', burden: 'ejecutado', risk: 'alto', strength: 2, tags: ['alimentos', 'convenio'] },
      { title: 'Email 01/10/2025 - Riesgo', narrative: 'Vicenta alega que Juan reconoció la deuda. Contexto: era propuesta de acuerdo, no reconocimiento.', status: 'controvertido', burden: 'ejecutado', risk: 'alto', strength: 2, tags: ['email', 'riesgo'] },
    ];
    for (const f of quartFactsData) await factsRepo.create({ caseId: quartCase.id, ...f } as any);

    const quartStrategiesData = [
      { attack: 'Reclamación íntegra 2.400€ sin descontar pagos', risk: 'Bajo', rebuttal: 'Acreditar todos los pagos: transferencias Oct-Nov 2025 + aportaciones previas. Déficit real: 1.828,73€.', evidencePlan: 'Extractos Openbank certificados.', tags: ['pago'] },
      { attack: 'Uso indebido cuenta común (2.710,61€)', risk: 'Medio', rebuttal: 'Detallar cada cargo: efectivo 850€, transferencias 644€, perfumería 415€, ropa 320€, recargas 250€.', evidencePlan: 'Extractos con marcado de cargos.', tags: ['compensacion'] },
      { attack: 'Pagos directos como "regalos"', risk: 'Medio', rebuttal: 'Son gastos necesarios: ordenador 379€, iPad 375€, gimnasio 219€, móviles 308€.', evidencePlan: 'Tickets y facturas.', tags: ['pagos-directos'] },
      { attack: 'Calificación como alimentos (STS 55/2016)', risk: 'Alto', rebuttal: 'Literal del convenio: "fondo común con reglas de consenso".', evidencePlan: 'Análisis cláusula 4ª convenio.', tags: ['alimentos'] },
      { attack: 'Domicilio incorrecto', risk: 'Medio', rebuttal: 'Error deliberado: figuraba domicilio de Vicenta.', evidencePlan: 'Certificado empadronamiento.', tags: ['notificacion'] },
    ];
    for (const s of quartStrategiesData) await strategiesRepo.create({ caseId: quartCase.id, ...s } as any);

    const quartPartidasData = [
      { date: '2024-04-01', concepto: 'Déficit mensualidades (22 meses)', importe: 1828.73, estado: 'reclamada' },
      { date: '2025-10-01', concepto: 'Uso indebido: Retiradas efectivo', importe: -850, estado: 'compensable' },
      { date: '2025-10-01', concepto: 'Uso indebido: Transferencias a Vicenta', importe: -644, estado: 'compensable' },
      { date: '2025-10-01', concepto: 'Uso indebido: Perfumería/Ropa/Otros', importe: -1216.61, estado: 'compensable' },
      { date: '2024-01-01', concepto: 'Pagos directos Juan: Tecnología', importe: -754, estado: 'reclamable' },
      { date: '2024-06-01', concepto: 'Pagos directos Juan: Gimnasio/Móviles', importe: -527, estado: 'reclamable' },
      { date: '2024-06-01', concepto: 'Pagos directos Juan: Otros gastos hijos', importe: -614.65, estado: 'reclamable' },
    ];
    for (const p of quartPartidasData) {
      await partidasRepo.create({ caseId: quartCase.id, date: p.date, amountCents: eurosToCents(Math.abs(p.importe)), concept: p.concepto, payer: 'Juan', beneficiary: 'Cuenta/Hijos', state: p.estado as any, theory: 'Oposición ETJ 1428/2025', notes: '', tags: ['quart'] });
    }

    // =====================================================================
    // HECHOS, ESTRATEGIAS Y PARTIDAS PARA MISLATA (J.V. 1185/2025)
    // =====================================================================
    const mislataFactsData = [
      { title: 'Litispendencia (Art. 421 LEC)', narrative: 'Vicenta alega litispendencia con Picassent. FALSO: objeto distinto (cuotas 2023-2025 vs 2009-2023). STS 140/2012 exige identidad TOTAL.', status: 'controvertido', burden: 'demandado', risk: 'medio', strength: 4, tags: ['litispendencia', 'art-421-LEC'] },
      { title: 'Prejudicialidad Civil (Art. 43 LEC)', narrative: 'Vicenta pide suspensión. Art. 43 es FACULTATIVO. Nuestro crédito es líquido: 7.119,98€.', status: 'controvertido', burden: 'demandado', risk: 'medio', strength: 4, tags: ['prejudicialidad', 'art-43-LEC'] },
      { title: 'Solidaridad Contractual', narrative: 'Ambos son deudores solidarios. Art. 1145 CC: derecho de regreso.', status: 'a_probar', burden: 'demandante', risk: 'bajo', strength: 5, tags: ['solidaridad', 'art-1145-CC'] },
      { title: 'Cuotas líquidas y exigibles', narrative: 'Crédito LÍQUIDO (7.119,98€), VENCIDO (oct 2023 - jun 2025) y EXIGIBLE.', status: 'a_probar', burden: 'demandante', risk: 'bajo', strength: 5, tags: ['liquidez', 'exigibilidad'] },
      { title: 'Cese unilateral de pago', narrative: 'Vicenta dejó de pagar desde agosto 2023. Juan pagó 14.404,88€; Vicenta solo 1.159,05€ netos.', status: 'a_probar', burden: 'demandante', risk: 'bajo', strength: 5, tags: ['incumplimiento'] },
      { title: 'Convenio divorcio', narrative: 'Vicenta alega que Juan debe pagar "gastos vivienda". FALSO: hipoteca es DEUDA SOLIDARIA, no gasto.', status: 'controvertido', burden: 'demandado', risk: 'bajo', strength: 4, tags: ['convenio'] },
    ];
    for (const f of mislataFactsData) await factsRepo.create({ caseId: mislataCase.id, ...f } as any);

    const mislataStrategiesData = [
      { attack: 'Litispendencia con Picassent', risk: 'Medio', rebuttal: 'NO hay identidad: Picassent = cuotas 2009-2023. Mislata = cuotas 2023-2025.', evidencePlan: 'Cuadro comparativo + STS 140/2012.', tags: ['litispendencia'] },
      { attack: 'Prejudicialidad civil', risk: 'Medio', rebuttal: 'Art. 43 es FACULTATIVO. Crédito es líquido y exigible.', evidencePlan: 'Literal artículo + extractos.', tags: ['prejudicialidad'] },
      { attack: 'Falta legitimación activa', risk: 'Bajo', rebuttal: 'Crédito LÍQUIDO, VENCIDO, EXIGIBLE. Acción de regreso autónoma.', evidencePlan: 'SAP Valencia 30.12.2014.', tags: ['legitimacion'] },
      { attack: 'Compensación con crédito Picassent', risk: 'Bajo', rebuttal: 'NO cabe: su crédito NO es líquido ni exigible (art. 1196 CC).', evidencePlan: 'Art. 1196.4º CC.', tags: ['compensacion'] },
      { attack: 'Convenio = Juan paga hipoteca', risk: 'Bajo', rebuttal: 'Convenio habla de "gastos vivienda". Hipoteca es DEUDA SOLIDARIA.', evidencePlan: 'Literal convenio + escritura préstamo.', tags: ['convenio'] },
      { attack: 'Falta acreditación cuotas', risk: 'Bajo', rebuttal: 'Doc. 3 = extractos con TODAS las aportaciones identificadas.', evidencePlan: 'Oficio a CaixaBank.', tags: ['prueba'] },
    ];
    for (const s of mislataStrategiesData) await strategiesRepo.create({ caseId: mislataCase.id, ...s } as any);

    const mislataPartidasData = [
      { date: '2023-10-01', concepto: 'Total pagos préstamo (oct 2023 - jun 2025)', importe: 14268.24, estado: 'pagada' },
      { date: '2023-10-01', concepto: 'Comisiones bancarias período', importe: 169.03, estado: 'pagada' },
      { date: '2023-10-01', concepto: 'Obligación 50% Vicenta', importe: -7284.90, estado: 'reclamada' },
      { date: '2023-10-01', concepto: 'Aportaciones reales Vicenta', importe: 1159.05, estado: 'pagada' },
      { date: '2025-06-30', concepto: 'EXCESO PAGADO POR JUAN', importe: 7119.98, estado: 'reclamada' },
    ];
    for (const p of mislataPartidasData) {
      await partidasRepo.create({ caseId: mislataCase.id, date: p.date, amountCents: eurosToCents(Math.abs(p.importe)), concept: p.concepto, payer: 'Juan', beneficiary: 'CaixaBank', state: p.estado as any, theory: 'Art. 1145 CC - Acción de regreso', notes: '', tags: ['mislata', 'hipoteca'] });
    }

    // =====================================================================
    // 4. DOCUMENTOS CLAVE (MOCK) - PICASSENT
    // Para probar la vinculación Hecho <-> Documento
    // =====================================================================
    const docsData = [
      { title: 'Doc. 25 - Recibos Oficiales CaixaBank', docType: 'prueba', description: 'Recibos íntegros que identifican a Juan como ordenante real.' },
      { title: 'Doc. 26 - Cuadro Comparativo Visual', docType: 'prueba', description: 'Gráfico enfrentando captura recortada vs recibo real.' },
      { title: 'Escritura Compraventa Piso Madrid (2000)', docType: 'prueba', description: 'Prueba del carácter privativo y origen de fondos.' },
      { title: 'Resolución AEAT 2012 Reinversión', docType: 'sentencia', description: 'Prueba oficial del destino de los fondos a la obra común.' },
      { title: 'Demanda Contraria', docType: 'demanda', description: 'Escrito inicial de la actora.' },
      { title: 'Extracto Cuenta Común (Retirada 38.500)', docType: 'prueba', description: 'Doc. 3 Contestación. Acredita la retirada de fondos de ella.' },
      { title: 'STS 458/2025 (Doctrina Cuentas)', docType: 'sentencia', description: 'Jurisprudencia sobre caja única familiar.' }
    ];

    const docIds: Record<string, string> = {}; // Para vincular luego
    for (const d of docsData) {
      const doc = await documentsRepo.create({
        caseId: mainCase.id,
        title: d.title,
        docType: d.docType as any,
        mime: 'application/pdf',
        size: 1024 * 500, // Fake size
        path: 'mock/path',
        tags: ['importante']
      });
      docIds[d.title] = doc.id;
    }

    // =====================================================================
    // 3. HECHOS CONTROVERTIDOS (FACTS) - 10 HECHOS COMPLETOS PICASSENT
    // Fuentes: FIJAR.docx, APORTACIÓN DE TESTIGOS.docx
    // =====================================================================
    const factsData = [
      // HECHO 1: Préstamos Personales BBVA
      {
        title: 'Préstamos Personales BBVA - 20.085€ (PRESCRITO)',
        narrative: 'Vicenta alega que pagó préstamos personales en 2008. PRESCRITO +15 años (Art. 1964 CC). Sin justificante de ingreso. AEAT: préstamos para chalet común.',
        status: 'controvertido', burden: 'demandado', risk: 'bajo', strength: 5,
        tags: ['prescrito', 'bbva', 'prestamo'],
        linkedDocIds: [docIds['Doc. 25 - Recibos Oficiales CaixaBank']]
      },
      // HECHO 2: Vehículo Seat León
      {
        title: 'Vehículo Seat León - 13.000€ (PRESCRITO)',
        narrative: 'Compra 2014, prescrito +10 años. Cuenta Barclays común. Liberalidad familiar. Juan pagó Renault Scenic 4.500€. Doble rasero de la actora.',
        status: 'controvertido', burden: 'demandado', risk: 'bajo', strength: 5,
        tags: ['prescrito', 'vehiculo', 'liberalidad']
      },
      // HECHO 3: Venta Vivienda Artur Piera
      {
        title: 'Retirada de Fondos: 38.500€ (Ella) vs 32.000€ (Él)',
        narrative: 'En la ruptura, Juan retiró 32.000€ (que se reclaman) pero Vicenta retiró 38.500€ de la cuenta común (6.500€ MÁS). Se opone compensación.',
        status: 'a_probar', burden: 'demandado', risk: 'medio', strength: 5,
        tags: ['compensacion', 'cuentas', 'artur_piera'],
        linkedDocIds: [docIds['Extracto Cuenta Común (Retirada 38.500)']]
      },
      // HECHO 4: Hipoteca Lope de Vega
      {
        title: 'Hipoteca Lope de Vega - 122.282€ (PRESCRITO parcial)',
        narrative: 'Cuotas 2009-2024. Pre-2019 PRESCRITO. Préstamo 310K fue para terrenos comunes, no para vivienda privativa. Lope de Vega solo fue garantía, no destino.',
        status: 'controvertido', burden: 'mixta', risk: 'alto', strength: 4,
        tags: ['prescrito', 'hipoteca', 'lope_de_vega']
      },
      // HECHO 5: IBI Lope de Vega
      {
        title: 'IBI Lope de Vega - 1.826,91€ (PRESCRITO)',
        narrative: 'IBI 2013-2019, PRESCRITO pre-2019. Cuenta BBVA 9397 nutrida por nómina de Juan durante 16 años.',
        status: 'controvertido', burden: 'demandado', risk: 'bajo', strength: 5,
        tags: ['prescrito', 'ibi', 'quart']
      },
      // HECHO 6: IBI Chalet Montroy
      {
        title: 'IBI Chalet Montroy - 530,85€ (DISPUTA)',
        narrative: 'Fondos comunes para bienes comunes. No cabe reembolso. Extracto BBVA 12/02/2021 muestra cargo directo de cuenta común.',
        status: 'controvertido', burden: 'demandado', risk: 'medio', strength: 4,
        tags: ['disputa', 'ibi', 'montroy']
      },
      // HECHO 7: IBI Fincas Rústicas
      {
        title: 'IBI Fincas Rústicas - 151,81€ (COMPENSABLE)',
        narrative: 'Compensación Art. 1196 CC. Juan pagó fitosanitarios 308,24€. Deuda ella > este IBI.',
        status: 'a_probar', burden: 'demandado', risk: 'bajo', strength: 4,
        tags: ['compensable', 'ibi', 'rusticas']
      },
      // HECHO 8: Comunidad Loma de los Caballeros
      {
        title: 'Comunidad Loma Caballeros - 19,39€ (COMPENSABLE)',
        narrative: 'Compensación directa. Juan pagó Q1/2024 (36,06€). Saldo neto a favor de Juan.',
        status: 'a_probar', burden: 'demandado', risk: 'bajo', strength: 5,
        tags: ['compensable', 'comunidad']
      },
      // HECHO 9: Amortización Hipoteca Previa
      {
        title: 'Amortización Hipoteca Previa - 16.979€ (PRESCRITO)',
        narrative: 'Prescrito 19 años. Condición del banco para préstamo 310K terrenos comunes. Vicenta aceptó en 2006 para comprar Montroy.',
        status: 'controvertido', burden: 'demandado', risk: 'bajo', strength: 5,
        tags: ['prescrito', 'hipoteca', 'amortizacion']
      },
      // HECHO 10: Maquinaria Agrícola
      {
        title: 'Maquinaria Agrícola Olivar - 5.801€ (DISPUTA)',
        narrative: 'Inversión en negocio de olivos. Vicenta cobró 10.887,57€ beneficios 2023 (Factura Oleos Dels Alforins). Si se reclama la inversión, también los beneficios.',
        status: 'controvertido', burden: 'demandado', risk: 'medio', strength: 4,
        tags: ['disputa', 'maquinaria', 'olivar']
      }
    ];

    for (const f of factsData) {
      await factsRepo.create({ caseId: mainCase.id, ...f } as any);
    }

    // =====================================================================
    // 4. ESTRATEGIAS (WAR ROOM)
    // Fuentes: PRESCRIPCIÓN.docx, DEFENSA ARTURO PIERA.docx
    // =====================================================================
    const strategiesData = [
      {
        attack: 'Reclamación de deudas de 2008-2019 (150.502€)',
        risk: 'Alto',
        rebuttal: 'Excepción de PRESCRIPCIÓN (Art. 1964 CC). Falta de reclamación previa interruptiva (Art. 1973 CC). "Arqueología contable".',
        evidencePlan: 'Calendario de plazos + Ausencia de burofaxes.',
        tags: ['prescripcion', 'defensa_total']
      },
      {
        attack: 'Aportación de Perito de Parte (Vínculo personal)',
        risk: 'Medio',
        rebuttal: 'TACHA DE PERITO. El perito tiene relación de amistad/familiaridad con la actora. Solicitar perito judicial insaculado.',
        evidencePlan: 'Interrogatorio sobre imparcialidad (Art. 343 LEC).',
        tags: ['procesal', 'peritos']
      },
      {
        attack: 'Negativa de la actora a la retirada de 38.500€',
        risk: 'Bajo',
        rebuttal: 'Solicitar OFICIO A CAIXABANK si no reconoce el Doc. 3. El rastro bancario es indeleble.',
        evidencePlan: 'Documental bancaria + Oficio judicial subsidiario.',
        tags: ['prueba_judicial']
      }
    ];

    for (const s of strategiesData) {
      await strategiesRepo.create({ caseId: mainCase.id, ...s } as any);
    }

    // =====================================================================
    // 5. PARTIDAS ECONÓMICAS (DESGLOSE COMPLETO)
    // Fuente: FIJAR.docx, Defensa_STS_458_2025.docx
    // =====================================================================
    const partidasList = [
      // Bloque Prescrito
      { date: '2008-09-01', concepto: 'Préstamos Personales 2008', importe: 20085, estado: 'prescrita', notas: 'Prescrito (16 años)' },
      { date: '2006-08-22', concepto: 'Cancelación Hipoteca Previa', importe: 16979, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2014-10-01', concepto: 'Compra Vehículo Seat León', importe: 13000, estado: 'prescrita', notas: 'Prescrito (10 años)' },
      
      // IBI (Ejemplo de serie)
      { date: '2013-01-01', concepto: 'IBI 2013-2019 (Acumulado)', importe: 1063, estado: 'prescrita', notas: 'Prescrito' },

      // Hipoteca (Desglose por tramos de Defensa_STS...)
      { date: '2009-12-31', concepto: 'Hipoteca 2009 (Jul-Dic)', importe: 5996, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2010-12-31', concepto: 'Hipoteca 2010 (Anual)', importe: 11534, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2011-12-31', concepto: 'Hipoteca 2011 (Anual)', importe: 11856, estado: 'prescrita', notas: 'Prescrito' },
      { date: '2012-12-31', concepto: 'Hipoteca 2012 (Anual)', importe: 12000, estado: 'prescrita', notas: 'Prescrito' },
      
      // Bloque Compensable
      { date: '2023-11-01', concepto: 'Retirada Juan (Objeto Demanda)', importe: -32000, estado: 'reclamada', notas: 'Reclamado por actora' },
      { date: '2023-11-02', concepto: 'Retirada Vicenta (A Compensar)', importe: 38500, estado: 'reclamable', notas: 'Crédito a nuestro favor' }
    ];

    for (const p of partidasList) {
      await partidasRepo.create({
        caseId: mainCase.id,
        date: p.date,
        amountCents: eurosToCents(p.importe),
        concept: p.concepto,
        payer: 'N/A',
        beneficiary: 'N/A',
        state: p.estado as any, // 'reclamada', 'pagada', etc.
        theory: 'Desglose Demanda',
        notes: p.notas,
        tags: ['financiero', p.estado === 'prescrita' ? 'prescripcion' : 'fondo']
      });
    }

    // =====================================================================
    // 6. CRONOLOGÍA (EVENTS)
    // Fuente: INFORME_ESTRATEGICO.pdf
    // =====================================================================
    const eventsData = [
      { date: '2006-08-22', type: 'factico', title: 'Cancelación Carga Previa', description: 'Origen de la reclamación de 16.979€.' },
      { date: '2012-01-15', type: 'factico', title: 'Venta Piso Madrid', description: 'Venta bien privativo Juan. Reinversión en obra.' },
      { date: '2023-10-01', type: 'factico', title: 'Ruptura Convivencia', description: 'Inicio de la separación de hecho y retiradas de fondos.' },
      { date: '2023-11-01', type: 'factico', title: 'Inicio Pago Hipoteca Exclusivo', description: 'Juan asume el 100% de la cuota (850€/mes).' },
      { date: '2024-01-20', type: 'procesal', title: 'Presentación Demanda', description: 'Vicenta reclama 212.677€.' },
      { date: '2025-02-19', type: 'procesal', title: 'Contestación Demanda', description: 'Presentación del escrito de defensa.' },
      { date: '2025-10-24', type: 'procesal', title: 'Señalamiento Audiencia Previa', description: 'Fecha prevista para la vista preliminar.' }
    ];

    for (const e of eventsData) {
      await eventsRepo.create({ caseId: mainCase.id, ...e } as any);
    }

    // =====================================================================
    // PARTIDAS DE LOS 10 HECHOS RECLAMADOS
    // Fuente: hechosReclamados.ts (extraído de rama claude/setup-litigation-system-yDgIX)
    // =====================================================================

    // Hecho 1: Préstamos Personales BBVA (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2008-09-05',
      amountCents: eurosToCents(20085),
      concept: 'Préstamos Personales BBVA - Cancelación',
      payer: 'Vicenta (alega)',
      beneficiary: 'BBVA',
      state: 'prescrita_interna',
      theory: 'Prescrito +15 años. Art. 1964 CC. Sin justificante de ingreso.',
      notes: 'Docs. 13, 11, 4. Contradicción AEAT: préstamos para chalet común.',
      tags: ['prescrito', 'bbva', 'prestamo']
    });

    // Hecho 2: Vehículo Seat León (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2014-01-01',
      amountCents: eurosToCents(13000),
      concept: 'Vehículo Seat León',
      payer: 'Cuenta Barclays Común',
      beneficiary: 'Concesionario',
      state: 'prescrita_interna',
      theory: 'Prescrito +10 años. Liberalidad familiar. Juan pagó Renault Scenic 4.500€.',
      notes: 'Docs. 2, 17, 16. Doble rasero: reclama 100% sin mencionar Scenic.',
      tags: ['prescrito', 'vehiculo', 'liberalidad']
    });

    // Hecho 3: Venta Vivienda Artur Piera (DISPUTA)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2022-09-01',
      amountCents: eurosToCents(32000),
      concept: 'Retirada Juan - Venta Artur Piera',
      payer: 'Cuenta Común',
      beneficiary: 'Juan (Privativo)',
      state: 'discutida',
      theory: 'Compensación: Vicenta retiró 38.500€ (6.500€ más). Inversión común en subasta.',
      notes: 'Docs. 20, 3, 22. Juan hizo reforma física. Mala fe de actora al omitir su retirada mayor.',
      tags: ['disputa', 'artur_piera', 'compensacion']
    });

    // Hecho 4: Hipoteca Vivienda Lope de Vega (PRESCRITO parcial)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2009-07-01',
      amountCents: eurosToCents(122282.28),
      concept: 'Cuotas Hipoteca Lope de Vega (2009-2024)',
      payer: 'Cuentas Comunes',
      beneficiary: 'Entidad Bancaria',
      state: 'prescrita_interna',
      theory: 'Pre-2019 prescrito. Préstamo 310K para terrenos comunes, no para vivienda privativa.',
      notes: 'Doc. 6. Lope de Vega solo fue garantía, no destino. Ella pide 50% terrenos.',
      tags: ['prescrito', 'hipoteca', 'lope_de_vega']
    });

    // Hecho 5: IBI Lope de Vega (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2013-01-01',
      amountCents: eurosToCents(1826.91),
      concept: 'IBI Lope de Vega (2013-2019)',
      payer: 'Cuenta BBVA 9397',
      beneficiary: 'Ayuntamiento Quart',
      state: 'prescrita_interna',
      theory: 'Prescrito pre-2019. Cuenta nutrida por nómina de Juan 16 años.',
      notes: 'Doc. 12. Vincular recibos a historial nóminas Juan.',
      tags: ['prescrito', 'ibi', 'quart']
    });

    // Hecho 6: IBI Chalet Montroy (DISPUTA)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2020-02-12',
      amountCents: eurosToCents(530.85),
      concept: 'IBI Chalet Montroy (50%)',
      payer: 'Cuenta Común BBVA',
      beneficiary: 'Ayuntamiento',
      state: 'discutida',
      theory: 'Fondos comunes para bienes comunes. No cabe reembolso.',
      notes: 'Doc. 1. Extracto BBVA 12/02/2021 muestra cargo directo.',
      tags: ['disputa', 'ibi', 'montroy']
    });

    // Hecho 7: IBI Fincas Rústicas (COMPENSABLE)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2020-01-01',
      amountCents: eurosToCents(151.81),
      concept: 'IBI Fincas Rústicas',
      payer: 'Vicenta (Privativo)',
      beneficiary: 'Ayuntamiento',
      state: 'reclamable',
      theory: 'Compensación Art. 1196 CC. Juan pagó fitosanitarios 308,24€.',
      notes: 'Doc. 27. Deuda ella > este IBI.',
      tags: ['compensable', 'ibi', 'rusticas']
    });

    // Hecho 8: Comunidad Loma de los Caballeros (COMPENSABLE)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2023-10-01',
      amountCents: eurosToCents(19.39),
      concept: 'Comunidad Loma Caballeros Q4/2023',
      payer: 'Vicenta',
      beneficiary: 'Comunidad',
      state: 'reclamable',
      theory: 'Compensación. Juan pagó Q1/2024 (36,06€).',
      notes: 'Doc. 28. Compensación directa.',
      tags: ['compensable', 'comunidad']
    });

    // Hecho 9: Amortización Hipoteca Previa (PRESCRITO)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2006-08-22',
      amountCents: eurosToCents(16979.59),
      concept: 'Amortización Hipoteca Previa Juan',
      payer: 'Fondos Comunes',
      beneficiary: 'Entidad Bancaria',
      state: 'prescrita_interna',
      theory: 'Prescrito 19 años. Condición banco para préstamo 310K terrenos comunes.',
      notes: 'Vicenta aceptó en 2006 para comprar Montroy. Vinculado a Hecho 4.',
      tags: ['prescrito', 'hipoteca', 'amortizacion']
    });

    // Hecho 10: Maquinaria Agrícola (DISPUTA)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2018-01-01',
      amountCents: eurosToCents(5801.25),
      concept: 'Maquinaria Agrícola Olivar',
      payer: 'Fondos Comunes',
      beneficiary: 'Proveedor',
      state: 'discutida',
      theory: 'Inversión negocio olivos. Vicenta cobró 10.887,57€ beneficios 2023.',
      notes: 'Doc. 29. Factura Oleos Dels Alforins a nombre Vicenta.',
      tags: ['disputa', 'maquinaria', 'olivar']
    });

    console.log('Database seeded successfully with REAL DATA + 10 HECHOS RECLAMADOS');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
