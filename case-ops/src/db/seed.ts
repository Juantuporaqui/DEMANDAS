// ============================================
// CASE OPS - Seed Data (CASO REAL: PICASSENT 715/2024 - VERSIÓN EXTENDIDA & CORREGIDA)
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

export async function seedDatabase(): Promise<boolean> {
  const settings = await settingsRepo.get();
  if (settings) {
    console.log('Database already initialized');
    return false;
  }

  console.log('Seeding database with EXTENDED REAL CASE DATA (FIXED VISUALIZATIONS)...');

  try {
    // 1. Configuración Inicial
    await settingsRepo.init('Desktop');
    const counters = [
      'cases',
      'documents',
      'spans',
      'facts',
      'issues',
      'partidas',
      'events',
      'strategies',
      'tasks',
      'rules',
      'scenario_models',
      'scenario_nodes',
    ];
    for (const c of counters) await counterRepo.setCounter(c, 0);

    // =====================================================================
    // 1. CASO PRINCIPAL - PICASSENT
    // =====================================================================
    const mainCase = await casesRepo.create({
      title: 'P.O. 715/2024 · División Cosa Común y Reclamación',
      court: 'JPI nº 1 de Picassent',
      autosNumber: '715/2024',
      type: 'ordinario',
      status: 'activo',
      clientRole: 'demandado',
      judge: '[Pendiente]',
      opposingPartyName: 'Vicenta Jiménez',
      opposingLawyerName: 'Auxiliadora Gómez',
      opposingCounsel: 'Auxiliadora Gómez',
      amountClaimedCents: eurosToCents(212677),
      amountTotalCents: eurosToCents(212677),
      notes: 'Reclamación de 212.677€ por Vicenta. Defensa basada en Prescripción (71% cuantía), Naturaleza de Hipoteca y Compensación de saldos.',
      tags: ['familia', 'civil', 'complejo', 'prescripcion']
    });

    // =====================================================================
    // 2. CASOS SECUNDARIOS - QUART Y MISLATA
    // =====================================================================
    const quartCase = await casesRepo.create({
      title: 'ETJ 1428/2025 · Ejecución Cuenta Hijos',
      court: 'Juzgado de Primera Instancia nº 1 de Quart de Poblet',
      autosNumber: '1428/2025',
      type: 'ejecucion',
      status: 'activo',
      clientRole: 'ejecutado',
      judge: 'Sandra Lozano López',
      nig: '4610241120230002538',
      opposingPartyName: 'Vicenta Jiménez Vera',
      opposingLawyerName: 'Auxiliadora Gómez',
      opposingCounsel: 'Auxiliadora Gómez (Vicenta Jiménez Vera)',
      amountClaimedCents: eurosToCents(2400),
      amountTotalCents: eurosToCents(2400),
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
      opposingPartyName: 'Vicenta Jiménez Vera',
      opposingLawyerName: 'Auxiliadora Gómez',
      opposingCounsel: 'Auxiliadora Gómez (Vicenta Jiménez Vera)',
      amountClaimedCents: eurosToCents(7119.98),
      amountTotalCents: eurosToCents(7119.98),
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
    // FIX: Se han añadido los campos 'amountCents' y ajustado 'status'
    // =====================================================================
    const quartFactsData = [
      { 
        title: 'Cumplimiento / Pago parcial', 
        narrative: 'Juan aportó 1.971,27€ hasta sept 2025. Tras el despacho, transfirió 200€ adicionales. Déficit real es 1.828,73€, no 2.400€.', 
        status: 'a_probar', 
        burden: 'demandado', 
        risk: 'bajo', 
        strength: 4, 
        amountCents: eurosToCents(571.27), // Diferencia a favor de Juan respecto a lo reclamado (aprox)
        tags: ['pago', 'art-556-LEC'] 
      },
      { 
        title: 'Compensación de créditos', 
        narrative: 'Vicenta retiró 2.710,61€ de la cuenta común para gastos no autorizados. Juan tiene crédito a su favor: 881,88€.', 
        status: 'compensable', // FIX: Estado corregido para visualización
        burden: 'demandado', 
        risk: 'medio', 
        strength: 3, 
        amountCents: eurosToCents(2710.61), // Importe del uso indebido
        tags: ['compensacion', 'art-1195-CC'] 
      },
      { 
        title: 'Pluspetición', 
        narrative: 'Se reclaman 2.400€ cuando el déficit real es 1.828,73€. Juan realizó pagos directos por 1.895,65€.', 
        status: 'a_probar', 
        burden: 'demandado', 
        risk: 'bajo', 
        strength: 4, 
        amountCents: eurosToCents(1895.65), // Importe de pagos directos
        tags: ['pluspeticion', 'art-558-LEC'] 
      },
      { 
        title: 'Domicilio erróneo en demanda', 
        narrative: 'Figura C/ Isabel de Villena 2-5 Mislata (domicilio de Vicenta). Juan nunca residió allí.', 
        status: 'controvertido', 
        burden: 'demandado', 
        risk: 'medio', 
        strength: 2, 
        amountCents: 0, // No económico
        tags: ['notificacion', 'art-155-LEC'] 
      },
      { 
        title: 'Abuso de derecho y mala fe', 
        narrative: 'La cuenta tenía 1.005,42€ al interponer demanda. Vicenta dejó de pagar hipoteca y retira fondos personales.', 
        status: 'controvertido', 
        burden: 'demandado', 
        risk: 'medio', 
        strength: 3, 
        amountCents: eurosToCents(1005.42), // Saldo existente
        tags: ['abuso', 'art-7-2-CC'] 
      },
      { 
        title: 'Naturaleza no alimenticia', 
        narrative: 'La cuenta común es fondo finalista con reglas de consenso, no alimentos incondicionales.', 
        status: 'controvertido', 
        burden: 'demandado', 
        risk: 'alto', 
        strength: 2, 
        amountCents: 0,
        tags: ['alimentos', 'convenio'] 
      },
      { 
        title: 'Email 01/10/2025 - Riesgo', 
        narrative: 'Vicenta alega que Juan reconoció la deuda. Contexto: era propuesta de acuerdo, no reconocimiento.', 
        status: 'controvertido', 
        burden: 'demandado', 
        risk: 'alto', 
        strength: 2, 
        amountCents: 0,
        tags: ['email', 'riesgo'] 
      },
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
      await partidasRepo.create({ caseId: quartCase.id, date: p.date, amountCents: eurosToCents(p.importe), concept: p.concepto, payer: 'Juan', beneficiary: 'Cuenta/Hijos', state: p.estado as any, theory: 'Oposición ETJ 1428/2025', notes: '', tags: ['quart'] });
    }

    // =====================================================================
    // HECHOS, ESTRATEGIAS Y PARTIDAS PARA MISLATA (J.V. 1185/2025)
    // FIX: Se han añadido los campos 'amountCents' y ajustado 'status'
    // =====================================================================
    const mislataFactsData = [
      { 
        title: 'Litispendencia (Art. 421 LEC)', 
        narrative: 'Vicenta alega litispendencia con Picassent. FALSO: objeto distinto (cuotas 2023-2025 vs 2009-2023). STS 140/2012 exige identidad TOTAL.', 
        status: 'controvertido', 
        burden: 'demandado', 
        risk: 'medio', 
        strength: 4, 
        amountCents: 0,
        tags: ['litispendencia', 'art-421-LEC'] 
      },
      { 
        title: 'Prejudicialidad Civil (Art. 43 LEC)', 
        narrative: 'Vicenta pide suspensión. Art. 43 es FACULTATIVO. Nuestro crédito es líquido: 7.119,98€.', 
        status: 'controvertido', 
        burden: 'demandado', 
        risk: 'medio', 
        strength: 4, 
        amountCents: 0,
        tags: ['prejudicialidad', 'art-43-LEC'] 
      },
      { 
        title: 'Solidaridad Contractual', 
        narrative: 'Ambos son deudores solidarios. Art. 1145 CC: derecho de regreso.', 
        status: 'a_probar', 
        burden: 'demandante', 
        risk: 'bajo', 
        strength: 5, 
        amountCents: eurosToCents(7119.98), // El importe principal reclamado
        tags: ['solidaridad', 'art-1145-CC'] 
      },
      { 
        title: 'Cuotas líquidas y exigibles', 
        narrative: 'Crédito LÍQUIDO (7.119,98€), VENCIDO (oct 2023 - jun 2025) y EXIGIBLE.', 
        status: 'a_probar', 
        burden: 'demandante', 
        risk: 'bajo', 
        strength: 5, 
        amountCents: eurosToCents(7119.98),
        tags: ['liquidez', 'exigibilidad'] 
      },
      { 
        title: 'Cese unilateral de pago', 
        narrative: 'Vicenta dejó de pagar desde agosto 2023. Juan pagó 14.404,88€; Vicenta solo 1.159,05€ netos.', 
        status: 'a_probar', 
        burden: 'demandante', 
        risk: 'bajo', 
        strength: 5, 
        amountCents: eurosToCents(14404.88), // Total pagado por Juan
        tags: ['incumplimiento'] 
      },
      { 
        title: 'Compensación alegada (Picassent)', 
        narrative: 'Vicenta intenta compensar con supuesta deuda de 2009. NO ES LÍQUIDA ni EXIGIBLE (Art. 1196 CC) y está en disputa en Picassent.', 
        status: 'disputa', 
        burden: 'demandado', 
        risk: 'bajo', 
        strength: 4, 
        amountCents: eurosToCents(122282), // El importe que ella intenta usar para compensar
        tags: ['compensacion', 'picassent'] 
      },
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
      await partidasRepo.create({ caseId: mislataCase.id, date: p.date, amountCents: eurosToCents(p.importe), concept: p.concepto, payer: 'Juan', beneficiary: 'CaixaBank', state: p.estado as any, theory: 'Art. 1145 CC - Acción de regreso', notes: '', tags: ['mislata', 'hipoteca'] });
    }

    // =====================================================================
    // 4. DOCUMENTOS CON FILEPATH (FASE 3) - PICASSENT
    // =====================================================================
    const picassentDocsData = [
      { title: 'Demanda División Cosa Común', docType: 'demanda', filePath: '/src/data/PO-715-2024-picassent/docs/2024-06-24__DEMANDA__division_cosa_comun__v01.pdf', status: 'pending' },
      { title: 'Contestación a la Demanda', docType: 'contestacion', filePath: '/src/data/PO-715-2024-picassent/docs/2025-02-19__CONTESTACION__defensa__v01.pdf', status: 'pending' },
      { title: 'Auto Admisión a Trámite', docType: 'auto', filePath: '/src/data/PO-715-2024-picassent/docs/2024-07-15__AUTO__admision_tramite__v01.pdf', status: 'pending' },
      { title: 'Señalamiento Audiencia Previa', docType: 'escrito', filePath: '/src/data/PO-715-2024-picassent/docs/2025-10-24__PROVIDENCIA__señalamiento__v01.pdf', status: 'pending' },
      { title: 'Extracto Cuenta Común (38.500€)', docType: 'extracto', filePath: '/src/data/PO-715-2024-picassent/docs/2023-11-01__EXTRACTO__cuenta_comun__v01.pdf', status: 'pending' },
      { title: 'Recibos CaixaBank Originales', docType: 'prueba', filePath: '/src/data/PO-715-2024-picassent/docs/2024-01-01__RECIBOS__caixabank__v01.pdf', status: 'pending' },
      { title: 'Escritura Préstamo Hipotecario', docType: 'contrato', filePath: '/src/data/PO-715-2024-picassent/docs/2006-08-22__ESCRITURA__prestamo_310k__v01.pdf', status: 'pending' },
      { title: 'Cálculo Cuantías Prescripción', docType: 'informe', filePath: '/src/data/PO-715-2024-picassent/docs/2025-01-01__CALCULO__cuantias__v01.pdf', status: 'pending' },
    ];

    const docIds: Record<string, string> = {};
    for (const d of picassentDocsData) {
      const doc = await documentsRepo.create({
        caseId: mainCase.id,
        title: d.title,
        docType: d.docType as any,
        filePath: d.filePath,
        status: d.status as any,
        tags: ['importante']
      });
      docIds[d.title] = doc.id;
    }

    // =====================================================================
    // DOCUMENTOS CON FILEPATH - QUART (ETJ 1428/2025)
    // =====================================================================
    const quartDocsData = [
      { title: 'Sentencia Divorcio 362/2023', docType: 'sentencia', filePath: '/src/data/ETJ-1428-2025-quart/docs/2023-10-17__SENTENCIA__divorcio__v01.pdf', status: 'pending' },
      { title: 'Auto Despacho Ejecución', docType: 'auto', filePath: '/src/data/ETJ-1428-2025-quart/docs/2025-10-30__AUTO__despacho_ejecucion__v01.pdf', status: 'pending' },
      { title: 'Escrito Oposición a Ejecución', docType: 'contestacion', filePath: '/src/data/ETJ-1428-2025-quart/docs/2025-11-15__OPOSICION__ejecucion__v01.pdf', status: 'pending' },
      { title: 'Providencia Señalamiento Vista', docType: 'escrito', filePath: '/src/data/ETJ-1428-2025-quart/docs/2026-01-14__PROVIDENCIA__señalamiento_vista__v01.pdf', status: 'pending' },
      { title: 'Extractos Openbank Aportaciones', docType: 'extracto', filePath: '/src/data/ETJ-1428-2025-quart/docs/2024-01-01__EXTRACTO__openbank__v01.pdf', status: 'pending' },
      { title: 'Cálculo Compensación Pagos', docType: 'informe', filePath: '/src/data/ETJ-1428-2025-quart/docs/2025-11-01__CALCULO__compensacion__v01.pdf', status: 'pending' },
    ];

    for (const d of quartDocsData) {
      await documentsRepo.create({
        caseId: quartCase.id,
        title: d.title,
        docType: d.docType as any,
        filePath: d.filePath,
        status: d.status as any,
        tags: ['quart']
      });
    }

    // =====================================================================
    // DOCUMENTOS CON FILEPATH - MISLATA (J.V. 1185/2025)
    // =====================================================================
    const mislataDocsData = [
      { title: 'Demanda Reclamación Cuotas', docType: 'demanda', filePath: '/src/data/JV-1185-2025-mislata/docs/2025-09-24__DEMANDA__reclamacion_cuotas__v01.pdf', status: 'pending' },
      { title: 'Auto Admisión a Trámite', docType: 'auto', filePath: '/src/data/JV-1185-2025-mislata/docs/2025-11-19__AUTO__admision__v01.pdf', status: 'pending' },
      { title: 'Contestación de Vicenta', docType: 'contestacion', filePath: '/src/data/JV-1185-2025-mislata/docs/2025-12-01__CONTESTACION__vicenta__v01.pdf', status: 'pending' },
      { title: 'Impugnación Recurso Reposición', docType: 'escrito', filePath: '/src/data/JV-1185-2025-mislata/docs/2025-12-19__ESCRITO__impugnacion__v01.pdf', status: 'pending' },
      { title: 'Extractos CaixaBank Cuotas', docType: 'extracto', filePath: '/src/data/JV-1185-2025-mislata/docs/2023-10-01__EXTRACTO__cuotas_hipoteca__v01.pdf', status: 'pending' },
      { title: 'Cálculo Art. 1145 CC', docType: 'informe', filePath: '/src/data/JV-1185-2025-mislata/docs/2025-09-01__CALCULO__accion_regreso__v01.pdf', status: 'pending' },
    ];

    for (const d of mislataDocsData) {
      await documentsRepo.create({
        caseId: mislataCase.id,
        title: d.title,
        docType: d.docType as any,
        filePath: d.filePath,
        status: d.status as any,
        tags: ['mislata']
      });
    }

    // =====================================================================
    // 3. HECHOS PICASSENT (10 HECHOS COMPLETOS - YA TENÍAN IMPORTE EN EL SEED ORIGINAL)
    // =====================================================================
    const factsData = [
      {
        title: 'Préstamos Personales BBVA - 20.085€ (PRESCRITO)',
        narrative: 'Vicenta alega que pagó préstamos personales en 2008. PRESCRITO +15 años (Art. 1964 CC). Sin justificante de ingreso. AEAT: préstamos para chalet común.',
        status: 'prescrito', burden: 'demandado', risk: 'bajo', strength: 5,
        amountCents: eurosToCents(20085),
        tags: ['prescrito', 'bbva', 'prestamo'],
        linkedDocIds: [docIds['Doc. 25 - Recibos Oficiales CaixaBank']]
      },
      {
        title: 'Vehículo Seat León - 13.000€ (PRESCRITO)',
        narrative: 'Compra 2014, prescrito +10 años. Cuenta Barclays común. Liberalidad familiar. Juan pagó Renault Scenic 4.500€. Doble rasero de la actora.',
        status: 'prescrito', burden: 'demandado', risk: 'bajo', strength: 5,
        amountCents: eurosToCents(13000),
        tags: ['prescrito', 'vehiculo', 'liberalidad']
      },
      {
        title: 'Retirada de Fondos: 38.500€ (Ella) vs 32.000€ (Él)',
        narrative: 'En la ruptura, Juan retiró 32.000€ (que se reclaman) pero Vicenta retiró 38.500€ de la cuenta común (6.500€ MÁS). Se opone compensación.',
        status: 'compensable', burden: 'demandado', risk: 'medio', strength: 5,
        amountCents: eurosToCents(38500),
        tags: ['compensacion', 'cuentas', 'artur_piera'],
        linkedDocIds: [docIds['Extracto Cuenta Común (Retirada 38.500)']]
      },
      {
        title: 'Hipoteca Lope de Vega - 122.282€ (PRESCRITO parcial)',
        narrative: 'Cuotas 2009-2024. Pre-2019 PRESCRITO. Préstamo 310K fue para terrenos comunes, no para vivienda privativa. Lope de Vega solo fue garantía, no destino.',
        status: 'prescrito', burden: 'mixta', risk: 'alto', strength: 4,
        amountCents: eurosToCents(122282),
        tags: ['prescrito', 'hipoteca', 'lope_de_vega']
      },
      {
        title: 'IBI Lope de Vega - 1.826,91€ (PRESCRITO)',
        narrative: 'IBI 2013-2019, PRESCRITO pre-2019. Cuenta BBVA 9397 nutrida por nómina de Juan durante 16 años.',
        status: 'prescrito', burden: 'demandado', risk: 'bajo', strength: 5,
        amountCents: eurosToCents(1826.91),
        tags: ['prescrito', 'ibi', 'quart']
      },
      {
        title: 'IBI Chalet Montroy - 530,85€ (DISPUTA)',
        narrative: 'Fondos comunes para bienes comunes. No cabe reembolso. Extracto BBVA 12/02/2021 muestra cargo directo de cuenta común.',
        status: 'disputa', burden: 'demandado', risk: 'medio', strength: 4,
        amountCents: eurosToCents(530.85),
        tags: ['disputa', 'ibi', 'montroy']
      },
      {
        title: 'IBI Fincas Rústicas - 151,81€ (COMPENSABLE)',
        narrative: 'Compensación Art. 1196 CC. Juan pagó fitosanitarios 308,24€. Deuda ella > este IBI.',
        status: 'compensable', burden: 'demandado', risk: 'bajo', strength: 4,
        amountCents: eurosToCents(151.81),
        tags: ['compensable', 'ibi', 'rusticas']
      },
      {
        title: 'Comunidad Loma de los Caballeros - 19,39€ (COMPENSABLE)',
        narrative: 'Compensación directa. Juan pagó Q1/2024 (36,06€). Saldo neto a favor de Juan.',
        status: 'compensable', burden: 'demandado', risk: 'bajo', strength: 5,
        amountCents: eurosToCents(19.39),
        tags: ['compensable', 'comunidad']
      },
      {
        title: 'Amortización Hipoteca Previa - 16.979€ (PRESCRITO)',
        narrative: 'Prescrito 19 años. Condición del banco para préstamo 310K terrenos comunes. Vicenta aceptó en 2006 para comprar Montroy.',
        status: 'prescrito', burden: 'demandado', risk: 'bajo', strength: 5,
        amountCents: eurosToCents(16979),
        tags: ['prescrito', 'hipoteca', 'amortizacion']
      },
      {
        title: 'Maquinaria Agrícola Olivar - 5.801€ (DISPUTA)',
        narrative: 'Inversión en negocio de olivos. Vicenta cobró 10.887,57€ beneficios 2023 (Factura Oleos Dels Alforins). Si se reclama la inversión, también los beneficios.',
        status: 'disputa', burden: 'demandado', risk: 'medio', strength: 4,
        amountCents: eurosToCents(5801),
        tags: ['disputa', 'maquinaria', 'olivar']
      }
    ];

    for (const f of factsData) {
      await factsRepo.create({ caseId: mainCase.id, ...f } as any);
    }

    // =====================================================================
    // 4. ESTRATEGIAS (WAR ROOM) - PICASSENT
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
    // 5. PARTIDAS ECONÓMICAS (DESGLOSE COMPLETO) - PICASSENT
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
    // 6. CRONOLOGÍA (EVENTS) - PICASSENT
    // =====================================================================
    const eventsData = [
      { date: '2006-08-22', type: 'factico', title: 'Cancelación Carga Previa', description: 'Origen de la reclamación de 16.979€.' },
      { date: '2012-01-15', type: 'factico', title: 'Venta Piso Madrid', description: 'Venta bien privativo Juan. Reinversión en obra.' },
      { date: '2023-10-01', type: 'factico', title: 'Ruptura Convivencia', description: 'Inicio de la separación de hecho y retiradas de fondos.' },
      { date: '2023-11-01', type: 'factico', title: 'Inicio Pago Hipoteca Exclusivo', description: 'Juan asume el 100% de la cuota (850€/mes).' },
      { date: '2024-01-20', type: 'procesal', title: 'Presentación Demanda', description: 'Vicenta reclama 212.677€.' },
      { date: '2025-02-19', type: 'procesal', title: 'Contestación Demanda', description: 'Presentación del escrito de defensa.' },
      { date: '2026-03-10T09:45:00', type: 'procesal', title: 'Audiencia Previa', description: 'Señalada para el 10/03/2026 a las 09:45.' }
    ];

    for (const e of eventsData) {
      await eventsRepo.create({ caseId: mainCase.id, ...e } as any);
    }

    console.log('Database seeded successfully with REAL DATA');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
