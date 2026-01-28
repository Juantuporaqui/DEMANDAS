// ============================================
// CASE OPS - Seed Data
// Initial data for first install
// ============================================

import { db } from './schema';
import {
  settingsRepo,
  counterRepo,
  casesRepo,
  claimsRepo,
  factsRepo,
  partidasRepo,
  eventsRepo,
  timelineEventsRepo,
  audienciaPhasesRepo,
  strategiesRepo,
  tasksRepo,
  jurisprudenceRepo,
  docRequestsRepo,
} from './repositories';
import { generateUUID } from '../utils/id';
import { eurosToCents } from '../utils/validators';

export async function seedDatabase(): Promise<boolean> {
  // Check if already seeded
  const settings = await settingsRepo.get();
  if (settings) {
    console.log('Database already initialized');
    return false;
  }

  console.log('Seeding database...');

  try {
    // Initialize settings
    const deviceName =
      typeof navigator !== 'undefined' && navigator.userAgent.includes('Android')
        ? 'Android'
        : 'Desktop';

    await settingsRepo.init(deviceName);

    // Set counters to start from 0
    await counterRepo.setCounter('cases', 0);
    await counterRepo.setCounter('documents', 0);
    await counterRepo.setCounter('spans', 0);
    await counterRepo.setCounter('facts', 0);
    await counterRepo.setCounter('partidas', 0);
    await counterRepo.setCounter('events', 0);
    await counterRepo.setCounter('timelineEvents', 0);
    await counterRepo.setCounter('audienciaPhases', 0);
    await counterRepo.setCounter('strategies', 0);
    await counterRepo.setCounter('tasks', 0);
    await counterRepo.setCounter('claims', 0);
    await counterRepo.setCounter('jurisprudence', 0);
    await counterRepo.setCounter('docRequests', 0);

    // ==========================================
    // CASE CAS001 - Procedimiento Ordinario Civil (TRONCO)
    // ==========================================
    const cas001 = await casesRepo.create({
      title: 'Procedimiento Ordinario Civil',
      court: 'JPII nº 1 de Picassent (Valencia)',
      autosNumber: '715/2024',
      type: 'ordinario',
      status: 'activo',
      amountTotal: eurosToCents(216000),
      nextMilestone: 'Audiencia Previa',
      nextDate: '2025-10-24',
      themeColor: '#F59E0B',
      notes: `Objeto:
- División de la cosa común
- Reclamación económica entre ex-cónyuges

Estado actual: Audiencia Previa pendiente
Señalamiento inicial: 24/10/2025
Múltiples aplazamientos (≥5)

Partes:
- Actora: Vicenta Jiménez Vera (DNI 52.708.915-E)
- Demandado: Juan Rodríguez

ASSETS REGISTRADOS:
A001 - Chalet en construcción (Picassent) - Bien común
A002 - Piso Madrid (vendido 2012) - Privativo Juan
A003 - Vehículo Nissan - Bien común
A004 - Cuenta corriente conjunta - Bien común
A005 - Cuentas privativas - A determinar

PRÉSTAMOS:
L001 - Hipoteca Chalet (Banco X) - Impagos desde Oct 2023
L002 - Préstamo personal (ya amortizado)
L003 - Crédito mejoras vivienda

Riesgo procesal: ALTO
Este procedimiento es el "TRONCO" del árbol de procedimientos.`,
      tags: ['principal', 'division', 'hipoteca', 'chalet'],
    });

    // ==========================================
    // CASE CAS002 - Ejecución de sentencia (Mislata)
    // ==========================================
    const cas002 = await casesRepo.create({
      title: 'Ejecución de sentencia (familia)',
      court: 'Juzgado de Mislata',
      autosNumber: '362/2023',
      type: 'ejecucion',
      status: 'activo',
      amountTotal: eurosToCents(3500),
      nextMilestone: 'Requerimiento de pago',
      nextDate: '2025-07-18',
      themeColor: '#10B981',
      parentCaseId: cas001.id,
      notes: `Objeto:
- Ejecución por cantidades (≈3.500 € embargados)
- Fondo común hijos / gastos escolares

Situación:
- Cuenta privativa en control de la parte actora
- Incumplimientos reiterados de gastos extraordinarios

Deriva del divorcio y del incumplimiento de obligaciones económicas.`,
      tags: ['mislata', 'ejecucion', 'pension', 'gastos'],
    });

    // ==========================================
    // CASE CAS003 - Quart (ejecución DANA)
    // ==========================================
    const cas003 = await casesRepo.create({
      title: 'Quart · Ejecución Familia',
      court: 'Juzgado de Quart',
      autosNumber: '362/2023',
      type: 'ejecucion',
      status: 'activo',
      amountTotal: eurosToCents(9800),
      nextMilestone: 'Liquidación de cantidades',
      nextDate: '2025-07-10',
      themeColor: '#F97316',
      parentCaseId: cas001.id,
      notes: `Objeto:
- Gastos extraordinarios derivados de DANA
- Ayuda material escolar y cuentas comunes

Estado:
- Documentación DANA pendiente de completar
- Pendiente resolución sobre cuenta privativa`,
      tags: ['quart', 'dana', 'ejecucion', 'escolar'],
    });

    // ==========================================
    // CASE CAS004 - Incidentes hipotecarios
    // ==========================================
    const cas004 = await casesRepo.create({
      title: 'Impagos hipoteca - Reclamación',
      court: 'Pendiente',
      autosNumber: '',
      type: 'incidente',
      status: 'activo',
      amountTotal: eurosToCents(12800),
      nextMilestone: 'Borrador demanda',
      nextDate: '2025-07-08',
      themeColor: '#60A5FA',
      parentCaseId: cas001.id,
      notes: `Objeto:
- Impago de hipoteca por Vicenta desde octubre 2023
- Reclamación de cuotas impagadas

Estado: Pre-procesal / preparación de demanda`,
      tags: ['hipoteca', 'impago'],
    });

    // ==========================================
    // CASE CAS005 - Consorcio Compensación Seguros
    // ==========================================
    await casesRepo.create({
      title: 'Expediente Consorcio Compensación Seguros',
      court: 'Consorcio de Compensación de Seguros',
      autosNumber: '',
      type: 'administrativo',
      status: 'cerrado',
      amountTotal: eurosToCents(5400),
      nextMilestone: 'Archivo',
      nextDate: '2024-07-02',
      themeColor: '#6366F1',
      parentCaseId: cas001.id,
      notes: `Objeto: Indemnización por daños en chalet común
Importe: 5.400 €
Estado: Resuelto (abono efectuado a cuenta de Vicenta)

Problema: No se destinó a reparación del bien común

Valor probatorio: ALTO`,
      tags: ['seguro', 'indemnizacion', 'apropiacion'],
    });

    // ==========================================
    // CASE CAS006 - Resolución AEAT
    // ==========================================
    await casesRepo.create({
      title: 'Resolución AEAT (2012)',
      court: 'AEAT',
      autosNumber: '',
      type: 'administrativo',
      status: 'cerrado',
      amountTotal: eurosToCents(0),
      nextMilestone: 'Documento firme',
      nextDate: '2012-09-30',
      themeColor: '#0EA5E9',
      parentCaseId: cas001.id,
      notes: `Objeto: Reinversión de beneficio de piso privativo en construcción
Estado: Resuelto, firme

Valor: Valida cronología y destino de fondos
Documento "blindado" que neutraliza narrativa contraria`,
      tags: ['aeat', 'fiscal', 'reinversion'],
    });

    // ==========================================
    // CASE CAS007 - Mediación ICAV
    // ==========================================
    await casesRepo.create({
      title: 'Mediación ICAV',
      court: 'ICAV',
      autosNumber: '',
      type: 'mediacion',
      status: 'cerrado',
      amountTotal: eurosToCents(0),
      nextMilestone: 'Cierre mediación',
      nextDate: '2025-04-17',
      themeColor: '#A855F7',
      parentCaseId: cas001.id,
      notes: `Fecha: 17/04/2025
Estado: Fracasada (negativa de la otra parte)

Valor:
- Prueba de buena fe
- Contraargumento de dilación y bloqueo`,
      tags: ['mediacion', 'buena_fe'],
    });

    // ==========================================
    // HECHOS H001-H010
    // ==========================================
    const factsData = [
      {
        title: 'Origen fondos construcción chalet',
        narrative:
          'Los fondos para la construcción del chalet provinieron de la venta del piso privativo de Juan en Madrid (2012), reinvirtiendo el beneficio fiscal conforme a resolución AEAT.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'alto' as const,
        strength: 4,
        tags: ['fondos', 'construccion', 'privativo'],
      },
      {
        title: 'Aportaciones hipotecarias de Juan',
        narrative:
          'Juan ha realizado aportaciones continuadas al pago de la hipoteca del chalet desde 2012 hasta 2023, incluso tras la separación de hecho.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'alto' as const,
        strength: 4,
        tags: ['hipoteca', 'aportaciones'],
      },
      {
        title: 'Impago hipoteca por Vicenta desde Oct 2023',
        narrative:
          'Desde octubre de 2023, Vicenta ha dejado de pagar las cuotas hipotecarias que le correspondían, acumulando un impago que pone en riesgo el bien común.',
        status: 'controvertido' as const,
        burden: 'demandado' as const,
        risk: 'alto' as const,
        strength: 5,
        tags: ['impago', 'hipoteca'],
      },
      {
        title: 'Apropiación indemnización Consorcio',
        narrative:
          'La indemnización de 5.400€ del Consorcio de Compensación de Seguros por daños en el chalet fue cobrada por Vicenta y no destinada a la reparación del bien común.',
        status: 'controvertido' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 5,
        tags: ['consorcio', 'indemnizacion', 'apropiacion'],
      },
      {
        title: 'Uso exclusivo del chalet por Vicenta',
        narrative:
          'Desde la separación de hecho, Vicenta ha mantenido el uso exclusivo del chalet sin compensación económica a Juan.',
        status: 'pacifico' as const,
        burden: 'mixta' as const,
        risk: 'bajo' as const,
        strength: 3,
        tags: ['uso', 'ocupacion'],
      },
      {
        title: 'Intento de mediación fallido',
        narrative:
          'Juan propuso mediación a través del ICAV (17/04/2025) que fue rechazada por Vicenta, demostrando buena fe procesal por parte del demandado.',
        status: 'pacifico' as const,
        burden: 'demandado' as const,
        risk: 'bajo' as const,
        strength: 5,
        tags: ['mediacion', 'buena_fe'],
      },
      {
        title: 'Aplazamientos reiterados de Audiencia Previa',
        narrative:
          'La Audiencia Previa ha sufrido múltiples aplazamientos (≥5), retrasando la resolución del conflicto.',
        status: 'pacifico' as const,
        burden: 'mixta' as const,
        risk: 'bajo' as const,
        strength: 3,
        tags: ['procedimiento', 'aplazamientos'],
      },
      {
        title: 'Gastos extraordinarios de hijos no compensados',
        narrative:
          'Juan ha asumido gastos extraordinarios de los hijos (escolares, médicos) que no han sido reembolsados ni compensados por Vicenta.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 3,
        tags: ['hijos', 'gastos', 'pension'],
      },
      {
        title: 'Deterioro del chalet por falta de mantenimiento',
        narrative:
          'El chalet presenta deterioro por falta de mantenimiento durante el período de uso exclusivo por Vicenta.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 2,
        tags: ['deterioro', 'mantenimiento'],
      },
      {
        title: 'Bloqueo de venta del bien común',
        narrative:
          'Vicenta ha bloqueado cualquier intento de venta del chalet para división de la cosa común, prolongando la situación de copropiedad conflictiva.',
        status: 'controvertido' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 3,
        tags: ['venta', 'bloqueo', 'division'],
      },
    ];

    for (const factData of factsData) {
      await factsRepo.create({
        caseId: cas001.id,
        ...factData,
      });
    }

    const factsMislata = [
      {
        title: 'Cuenta privativa utilizada para gastos comunes',
        narrative:
          'La parte actora ha utilizado una cuenta privativa para gastos comunes sin rendición de cuentas.',
        status: 'controvertido' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 3,
        tags: ['mislata', 'cuenta', 'gastos'],
      },
      {
        title: 'Gastos escolares extraordinarios no reintegrados',
        narrative:
          'Se han asumido gastos escolares extraordinarios que no han sido reintegrados.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 4,
        tags: ['mislata', 'escolar'],
      },
    ];

    for (const factData of factsMislata) {
      await factsRepo.create({
        caseId: cas002.id,
        ...factData,
      });
    }

    const factsQuart = [
      {
        title: 'Ayuda DANA aplicada a cuenta privativa',
        narrative:
          'La ayuda por DANA fue ingresada en cuenta privativa sin reflejo en el fondo común.',
        status: 'controvertido' as const,
        burden: 'demandado' as const,
        risk: 'alto' as const,
        strength: 4,
        tags: ['quart', 'dana', 'cuenta'],
      },
      {
        title: 'Necesidad de documentación DOGV',
        narrative:
          'Se requiere resolución DOGV para acreditar la cuantía y destino de la ayuda.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 3,
        tags: ['quart', 'dogv'],
      },
    ];

    for (const factData of factsQuart) {
      await factsRepo.create({
        caseId: cas003.id,
        ...factData,
      });
    }

    // ==========================================
    // RECLAMACIONES R001-R008 (Picassent)
    // ==========================================
    const claimsData = [
      {
        shortLabel: 'R01',
        title: 'Unidad de caja y mezcla de fondos',
        amount: eurosToCents(216000),
        winChance: 'media' as const,
        importance: 'alta' as const,
        summaryShort: 'Trazabilidad de aportaciones y gestión conjunta 2006-2024.',
        summaryLong:
          'Se sostiene que la economía matrimonial operó como unidad de caja desde 2006, con aportaciones cruzadas y ausencia de segregación contable. La trazabilidad de los ingresos y gastos soporta la compensación por aportaciones privativas.',
        defenseShort: 'Reforzar trazabilidad con extractos y pericial contable.',
        defenseLong:
          'Acreditar con extractos bancarios, movimientos consolidados y pericial contable la unidad funcional de caja y la ausencia de separación patrimonial durante el periodo controvertido.',
        linkedFactIds: ['H001', 'H002'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R02',
        title: 'Error material en transferencia 2024',
        amount: eurosToCents(13000),
        winChance: 'alta' as const,
        importance: 'media' as const,
        summaryShort: 'La demanda cita 2024 con fecha imposible.',
        summaryLong:
          'El relato cronológico contiene un error material al citar 2024 en una transferencia que, por contexto, corresponde a 2014. Se solicita rectificación y pérdida de fuerza probatoria del tramo alegado.',
        defenseShort: 'Impulsar rectificación en audiencia previa.',
        defenseLong:
          'Aportar cronología bancaria y solicitar aclaración judicial de la fecha, evitando que la parte actora reconduzca el error como subsanable sin impacto.',
        linkedFactIds: ['H007'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R03',
        title: 'Uso exclusivo del chalet por Vicenta',
        amount: eurosToCents(24000),
        winChance: 'media' as const,
        importance: 'media' as const,
        summaryShort: 'Compensación por uso exclusivo sin contraprestación.',
        summaryLong:
          'Se reclama compensación por el uso exclusivo del chalet por parte de Vicenta desde la separación de hecho, sin abono de renta ni compensación económica.',
        defenseShort: 'Acreditar empadronamiento y ausencia de uso por Juan.',
        defenseLong:
          'Reforzar con certificados de empadronamiento, testifical vecinal y datos de consumo que acrediten el uso exclusivo por Vicenta.',
        linkedFactIds: ['H005'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R04',
        title: 'Impago cuotas hipotecarias desde 2023',
        amount: eurosToCents(12800),
        winChance: 'alta' as const,
        importance: 'alta' as const,
        summaryShort: 'Reclamación por cuotas impagadas.',
        summaryLong:
          'Desde octubre de 2023 se registran cuotas hipotecarias impagadas atribuibles a la parte actora, con riesgo de ejecución sobre el bien común.',
        defenseShort: 'Solicitar certificación bancaria de impagos.',
        defenseLong:
          'Aportar certificaciones bancarias y cuadros de amortización para acreditar el impago y su impacto económico.',
        linkedFactIds: ['H003'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R05',
        title: 'Indemnización Consorcio no aplicada',
        amount: eurosToCents(5400),
        winChance: 'media' as const,
        importance: 'media' as const,
        summaryShort: 'Cobro de indemnización sin reparar bien común.',
        summaryLong:
          'Se reclama que la indemnización por daños del Consorcio se destinó a fines personales y no a la reparación del chalet, generando perjuicio.',
        defenseShort: 'Cruzar facturas de reparación con fecha de pago.',
        defenseLong:
          'Solicitar facturas de reparación y pericial del estado del inmueble para evidenciar la falta de aplicación de fondos.',
        linkedFactIds: ['H004'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R06',
        title: 'Gastos extraordinarios de hijos',
        amount: eurosToCents(8600),
        winChance: 'media' as const,
        importance: 'media' as const,
        summaryShort: 'Reintegro de gastos escolares y médicos.',
        summaryLong:
          'Se solicita reintegro de gastos extraordinarios asumidos por Juan para los hijos comunes sin compensación.',
        defenseShort: 'Aportar recibos y comunicaciones previas.',
        defenseLong:
          'Compilar justificantes de pagos, comunicaciones con la parte actora y decisiones escolares/médicas.',
        linkedFactIds: ['H008'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R07',
        title: 'Deterioro por falta de mantenimiento',
        amount: eurosToCents(15000),
        winChance: 'baja' as const,
        importance: 'baja' as const,
        summaryShort: 'Daños por falta de mantenimiento del chalet.',
        summaryLong:
          'Se reclama compensación por deterioro del chalet derivado de falta de mantenimiento durante el uso exclusivo por Vicenta.',
        defenseShort: 'Necesaria pericial del estado actual.',
        defenseLong:
          'Preparar pericial técnica y reportaje fotográfico para cuantificar daños y causas.',
        linkedFactIds: ['H009'],
        linkedDocIds: [],
      },
      {
        shortLabel: 'R08',
        title: 'Bloqueo de venta del bien común',
        amount: eurosToCents(9000),
        winChance: 'baja' as const,
        importance: 'media' as const,
        summaryShort: 'Daños por bloqueo a la venta.',
        summaryLong:
          'Se solicita compensación por el bloqueo continuado de la venta del chalet, prolongando la copropiedad conflictiva.',
        defenseShort: 'Acreditar intentos de venta frustrados.',
        defenseLong:
          'Aportar comunicaciones y ofertas de mercado rechazadas, así como propuestas notariales de división.',
        linkedFactIds: ['H010'],
        linkedDocIds: [],
      },
    ];

    const claimIdMap = new Map<string, string>();
    for (const claimData of claimsData) {
      const created = await claimsRepo.create({
        caseId: cas001.id,
        ...claimData,
      });
      claimIdMap.set(claimData.shortLabel, created.id);
    }

    const claimsMislata = [
      {
        shortLabel: 'M01',
        title: 'Reintegro gastos escolares extraordinarios',
        amount: eurosToCents(1800),
        winChance: 'media' as const,
        importance: 'media' as const,
        summaryShort: 'Reintegro de gastos escolares 2022-2024.',
        summaryLong:
          'Se solicita reintegro de gastos escolares extraordinarios asumidos por Juan y vinculados al fondo común de hijos.',
        defenseShort: 'Aportar recibos y comunicaciones previas.',
        defenseLong:
          'Reunir recibos, facturas y mensajes de notificación para acreditar la necesidad y el pago.',
        linkedFactIds: [],
        linkedDocIds: [],
      },
      {
        shortLabel: 'M02',
        title: 'Regularización de cuenta privativa',
        amount: eurosToCents(1700),
        winChance: 'baja' as const,
        importance: 'baja' as const,
        summaryShort: 'Conciliar movimientos de cuenta privativa.',
        summaryLong:
          'Se solicita conciliación de movimientos de cuenta privativa utilizada para gastos comunes.',
        defenseShort: 'Solicitar extractos y justificar movimientos.',
        defenseLong:
          'Solicitar extractos completos y justificar cada cargo para demostrar su impacto en el fondo común.',
        linkedFactIds: [],
        linkedDocIds: [],
      },
    ];

    const claimsQuart = [
      {
        shortLabel: 'Q01',
        title: 'Ayuda DANA aplicada a fondo común',
        amount: eurosToCents(5200),
        winChance: 'alta' as const,
        importance: 'alta' as const,
        summaryShort: 'Reintegro de ayuda DANA al fondo común.',
        summaryLong:
          'La ayuda DANA debe imputarse al fondo común de hijos, no a cuenta privativa.',
        defenseShort: 'Aportar resolución DOGV y trazabilidad bancaria.',
        defenseLong:
          'Acreditar con resolución DOGV y extractos el destino real de la ayuda.',
        linkedFactIds: [],
        linkedDocIds: [],
      },
      {
        shortLabel: 'Q02',
        title: 'Compensación por material escolar',
        amount: eurosToCents(4600),
        winChance: 'media' as const,
        importance: 'media' as const,
        summaryShort: 'Compensación por compras escolares.',
        summaryLong:
          'Se reclama compensación por material escolar financiado sin reembolso.',
        defenseShort: 'Justificar compras y pagos.',
        defenseLong:
          'Reunir facturas de material escolar y evidencias de pago realizadas por Juan.',
        linkedFactIds: [],
        linkedDocIds: [],
      },
    ];

    const claimMapMislata = new Map<string, string>();
    for (const claimData of claimsMislata) {
      const created = await claimsRepo.create({
        caseId: cas002.id,
        ...claimData,
      });
      claimMapMislata.set(claimData.shortLabel, created.id);
    }

    const claimMapQuart = new Map<string, string>();
    for (const claimData of claimsQuart) {
      const created = await claimsRepo.create({
        caseId: cas003.id,
        ...claimData,
      });
      claimMapQuart.set(claimData.shortLabel, created.id);
    }

    // ==========================================
    // PARTIDAS P001-P015 (Hipoteca aportaciones)
    // ==========================================
    const partidasData = [
      { date: '2020-01-15', amount: 850.0, concept: 'Cuota hipoteca enero 2020' },
      { date: '2020-02-15', amount: 850.0, concept: 'Cuota hipoteca febrero 2020' },
      { date: '2020-03-15', amount: 850.0, concept: 'Cuota hipoteca marzo 2020' },
      { date: '2020-04-15', amount: 850.0, concept: 'Cuota hipoteca abril 2020' },
      { date: '2020-05-15', amount: 850.0, concept: 'Cuota hipoteca mayo 2020' },
      { date: '2020-06-15', amount: 850.0, concept: 'Cuota hipoteca junio 2020' },
      { date: '2020-07-15', amount: 850.0, concept: 'Cuota hipoteca julio 2020' },
      { date: '2020-08-15', amount: 850.0, concept: 'Cuota hipoteca agosto 2020' },
      { date: '2020-09-15', amount: 850.0, concept: 'Cuota hipoteca septiembre 2020' },
      { date: '2020-10-15', amount: 850.0, concept: 'Cuota hipoteca octubre 2020' },
      { date: '2020-11-15', amount: 850.0, concept: 'Cuota hipoteca noviembre 2020' },
      { date: '2020-12-15', amount: 850.0, concept: 'Cuota hipoteca diciembre 2020' },
      { date: '2021-01-15', amount: 850.0, concept: 'Cuota hipoteca enero 2021' },
      { date: '2021-02-15', amount: 850.0, concept: 'Cuota hipoteca febrero 2021' },
      { date: '2021-03-15', amount: 850.0, concept: 'Cuota hipoteca marzo 2021' },
    ];

    for (const partidaData of partidasData) {
      await partidasRepo.create({
        caseId: cas001.id,
        date: partidaData.date,
        amountCents: eurosToCents(partidaData.amount),
        currency: 'EUR',
        concept: partidaData.concept,
        payer: 'Juan Rodríguez',
        beneficiary: 'Banco X (Hipoteca)',
        theory: 'Aportación a bien común (hipoteca) realizada por Juan',
        state: 'reclamable',
        tags: ['hipoteca', 'aportacion'],
        notes: '',
      });
    }

    // Partida especial: Indemnización Consorcio
    await partidasRepo.create({
      caseId: cas001.id,
      date: '2023-06-01',
      amountCents: eurosToCents(5400.0),
      currency: 'EUR',
      concept: 'Indemnización Consorcio Compensación Seguros',
      payer: 'Consorcio de Compensación de Seguros',
      beneficiary: 'Vicenta Jiménez Vera',
      theory:
        'Indemnización por daños en chalet común cobrada por Vicenta y no aplicada a reparación',
      state: 'discutida',
      tags: ['consorcio', 'indemnizacion', 'apropiacion'],
      notes:
        'Importe destinado a uso particular, no a reparación del bien común. Reclamable como perjuicio.',
    });

    // ==========================================
    // EVENTOS (Cronología)
    // ==========================================
    const eventsData = [
      {
        date: '2012-06-15',
        type: 'factico' as const,
        title: 'Venta piso Madrid',
        description: 'Venta del piso privativo de Juan en Madrid. Reinversión del beneficio.',
        tags: ['venta', 'privativo'],
      },
      {
        date: '2012-09-01',
        type: 'factico' as const,
        title: 'Inicio construcción chalet',
        description: 'Comienzo de obras de construcción del chalet en Picassent con fondos de la venta.',
        tags: ['construccion', 'chalet'],
      },
      {
        date: '2023-10-01',
        type: 'factico' as const,
        title: 'Inicio impagos hipoteca por Vicenta',
        description: 'Vicenta deja de abonar su parte de las cuotas hipotecarias.',
        tags: ['impago', 'hipoteca'],
      },
      {
        date: '2024-01-15',
        type: 'procesal' as const,
        title: 'Presentación demanda',
        description: 'Presentación de demanda de división de cosa común y reclamación económica.',
        tags: ['demanda'],
      },
      {
        date: '2024-03-20',
        type: 'procesal' as const,
        title: 'Admisión a trámite',
        description: 'Auto de admisión a trámite de la demanda.',
        tags: ['admision'],
      },
      {
        date: '2025-04-17',
        type: 'procesal' as const,
        title: 'Mediación ICAV - Fracasada',
        description: 'Intento de mediación rechazado por la parte actora.',
        tags: ['mediacion'],
      },
      {
        date: '2025-10-24',
        type: 'procesal' as const,
        title: 'Audiencia Previa (señalamiento)',
        description:
          'Fecha prevista para Audiencia Previa. Múltiples aplazamientos anteriores.',
        tags: ['audiencia', 'señalamiento'],
      },
    ];

    for (const eventData of eventsData) {
      await eventsRepo.create({
        caseId: cas001.id,
        ...eventData,
      });
    }

    // ==========================================
    // TIMELINE EVENTS (Combinado)
    // ==========================================
    const timelineEvents = [
      {
        dateISO: '2006-01-01',
        title: 'Inicio unidad de caja funcional',
        description: 'Comienzo del periodo de gestión conjunta de fondos.',
        importance: 'media' as const,
      },
      {
        dateISO: '2012-06-15',
        title: 'Venta piso privativo Madrid',
        description: 'Venta que financia la construcción del chalet.',
        importance: 'alta' as const,
      },
      {
        dateISO: '2023-10-01',
        title: 'Impagos hipotecarios',
        description: 'Inicio de impagos por la parte actora.',
        importance: 'alta' as const,
      },
      {
        dateISO: '2024-02-12',
        title: 'Presentación demanda',
        description: 'Inicio del procedimiento ordinario en Picassent.',
        importance: 'media' as const,
      },
      {
        dateISO: '2025-10-24',
        title: 'Audiencia previa señalada',
        description: 'Fecha prevista para la audiencia previa.',
        importance: 'alta' as const,
      },
    ];

    for (const item of timelineEvents) {
      await timelineEventsRepo.create({
        caseId: cas001.id,
        ...item,
      });
    }

    // ==========================================
    // ESTRATEGIAS (War Room)
    // ==========================================
    const strategiesData = [
      {
        attack:
          'La parte actora alegará que el piso de Madrid era bien ganancial y no privativo de Juan.',
        risk: 'Alto: Podría afectar a la trazabilidad de fondos de la construcción.',
        rebuttal:
          'Aportar escritura de propiedad anterior al matrimonio y declaración IRPF de reinversión aprobada por AEAT.',
        evidencePlan: 'Escritura notarial piso Madrid + Resolución AEAT 2012 + Extractos bancarios transferencia a obra',
        questions: '¿Cuándo adquirió el demandado el piso de Madrid? ¿Existía matrimonio en ese momento?',
        tags: ['propiedad', 'fondos'],
      },
      {
        attack: 'Actora negará haber dejado de pagar la hipoteca, alegando pago en efectivo.',
        risk: 'Medio: Sin documentación, difícil de rebatir.',
        rebuttal:
          'Solicitar extractos bancarios de la cuenta hipotecaria donde consten todos los cargos. Los pagos en efectivo no aparecerían.',
        evidencePlan: 'Extractos cuenta hipotecaria Oct 2023 - presente + Requerimiento banco sobre origen de fondos',
        questions: '¿Puede aportar justificantes de los pagos en efectivo alegados?',
        tags: ['impago', 'hipoteca'],
      },
      {
        attack:
          'Actora argumentará que la indemnización del Consorcio se usó para reparaciones del chalet.',
        risk: 'Medio: Si demuestra gastos de reparación, debilita la reclamación.',
        rebuttal:
          'Solicitar facturas de reparación y cruzar con fecha de cobro de indemnización. Inspección actual del chalet para verificar daños sin reparar.',
        evidencePlan: 'Informe pericial estado actual chalet + Certificado Consorcio fecha y destino pago',
        questions:
          '¿Qué reparaciones se realizaron con la indemnización? ¿Puede aportar facturas?',
        tags: ['consorcio', 'indemnizacion'],
      },
      {
        attack:
          'Actora solicitará compensación por uso exclusivo del chalet por Juan.',
        risk: 'Bajo: Es Vicenta quien tiene uso exclusivo.',
        rebuttal:
          'Acreditar que Juan no reside ni ha residido en el chalet desde la separación. Vicenta tiene las llaves y uso exclusivo.',
        evidencePlan: 'Certificado empadronamiento Juan + Testigos vecinos',
        questions: '¿Dónde ha residido el demandado desde la separación?',
        tags: ['uso', 'ocupacion'],
      },
      {
        attack: 'Actora alegará mala fe procesal por retrasar el procedimiento.',
        risk: 'Medio: Los aplazamientos pueden interpretarse en contra.',
        rebuttal:
          'Documentar que los aplazamientos fueron solicitados por ambas partes o por causas ajenas. Aportar acta de mediación como prueba de buena fe.',
        evidencePlan: 'Providencias de aplazamiento + Acta mediación ICAV',
        questions: '¿Quién solicitó cada uno de los aplazamientos de la Audiencia Previa?',
        tags: ['procedimiento', 'buena_fe'],
      },
      {
        attack:
          'Actora reclamará derecho preferente de adjudicación del chalet.',
        risk: 'Alto: Podría obtener el bien a valor inferior de mercado.',
        rebuttal:
          'Solicitar tasación pericial actualizada. Argumentar que la venta en subasta garantiza mejor precio para ambas partes.',
        evidencePlan: 'Tasación pericial inmueble + Comparables de mercado zona Picassent',
        questions: '¿Está dispuesta a igualar el precio de mercado para la adjudicación?',
        tags: ['adjudicacion', 'venta'],
      },
    ];

    for (const strategyData of strategiesData) {
      await strategiesRepo.create({
        caseId: cas001.id,
        ...strategyData,
      });
    }

    const strategiesMislata = [
      {
        attack: 'Actora alegará que los gastos escolares son voluntarios y no exigibles.',
        risk: 'Medio: posible falta de consenso previo.',
        rebuttal:
          'Aportar comunicaciones previas y pruebas de necesidad, así como precedentes de reparto.',
        evidencePlan: 'Mensajes, emails y facturas escolares 2022-2024',
        questions: '¿Se notificaron los gastos antes de realizarse?',
        tags: ['mislata', 'escolar'],
      },
    ];

    for (const strategyData of strategiesMislata) {
      await strategiesRepo.create({
        caseId: cas002.id,
        ...strategyData,
      });
    }

    const strategiesQuart = [
      {
        attack: 'La ayuda DANA se considerará privativa por ingreso individual.',
        risk: 'Alto: pueden alegar titularidad exclusiva.',
        rebuttal:
          'Demostrar que la ayuda se concedió para necesidades familiares y se destinó a bienes comunes.',
        evidencePlan: 'Resolución DOGV + extractos bancarios + facturas de reparación',
        questions: '¿En qué se aplicó la ayuda DANA?',
        tags: ['quart', 'dana'],
      },
    ];

    for (const strategyData of strategiesQuart) {
      await strategiesRepo.create({
        caseId: cas003.id,
        ...strategyData,
      });
    }

    // ==========================================
    // JURISPRUDENCIA
    // ==========================================
    const jurisprudenceData = [
      {
        ref: 'STS 458/2025',
        court: 'Tribunal Supremo',
        dateISO: '2025-02-12',
        summaryShort: 'Prescripción en reclamaciones de aportaciones privativas.',
        summaryLong:
          'Sentencia que fija criterios sobre prescripción en acciones de reembolso de aportaciones privativas, con especial atención a la prueba del régimen económico matrimonial.',
        linkedClaims: ['R01', 'R02'],
      },
      {
        ref: 'STS 120/2023',
        court: 'Tribunal Supremo',
        dateISO: '2023-04-05',
        summaryShort: 'Unidad de caja y compensación de gastos comunes.',
        summaryLong:
          'Doctrina sobre la unidad de caja y su impacto en la compensación de aportaciones cuando no existe separación patrimonial clara.',
        linkedClaims: ['R01'],
      },
      {
        ref: 'SAP Valencia 86/2024',
        court: 'AP Valencia',
        dateISO: '2024-03-19',
        summaryShort: 'Uso exclusivo de inmueble y compensación económica.',
        summaryLong:
          'Resolución que admite compensación por uso exclusivo del inmueble común tras la separación de hecho.',
        linkedClaims: ['R03'],
      },
      {
        ref: 'SAP Valencia 22/2022',
        court: 'AP Valencia',
        dateISO: '2022-01-21',
        summaryShort: 'Impagos hipotecarios y responsabilidad solidaria.',
        summaryLong:
          'Criterio sobre responsabilidad en impagos hipotecarios en régimen de copropiedad.',
        linkedClaims: ['R04'],
      },
      {
        ref: 'STS 312/2021',
        court: 'Tribunal Supremo',
        dateISO: '2021-06-11',
        summaryShort: 'Bloqueo de venta del bien común.',
        summaryLong:
          'Doctrina sobre la obligación de no bloquear la venta del bien común sin causa justificada.',
        linkedClaims: ['R08'],
      },
      {
        ref: 'SAP Valencia 104/2024',
        court: 'AP Valencia',
        dateISO: '2024-05-07',
        summaryShort: 'Gastos escolares extraordinarios en ejecuciones.',
        summaryLong:
          'Criterio sobre reintegro de gastos escolares extraordinarios en procedimientos de ejecución.',
        linkedClaims: ['M01'],
      },
      {
        ref: 'SAP Valencia 42/2023',
        court: 'AP Valencia',
        dateISO: '2023-02-14',
        summaryShort: 'Ayudas públicas y fondos comunes.',
        summaryLong:
          'Reconoce que ayudas públicas destinadas a la unidad familiar deben imputarse al fondo común.',
        linkedClaims: ['Q01'],
      },
    ];

    for (const jurisprudence of jurisprudenceData) {
      const { linkedClaims, ...rest } = jurisprudence;
      const linkedClaimIds = linkedClaims
        .map((key) => claimIdMap.get(key) ?? claimMapMislata.get(key) ?? claimMapQuart.get(key))
        .filter((id): id is string => Boolean(id));
      await jurisprudenceRepo.create({
        ...rest,
        linkedClaimIds,
      });
    }

    // ==========================================
    // DOCUMENTACIÓN PENDIENTE
    // ==========================================
    const docRequests = [
      {
        title: 'Extractos BBVA 2011',
        source: 'BBVA',
        purpose: 'Reconstruir unidad de caja 2010-2012.',
        priority: 'alta' as const,
        status: 'solicitado' as const,
      },
      {
        title: 'Extractos caja rural 2012-2013',
        source: 'Caja Rural',
        purpose: 'Contrastar transferencias de obra.',
        priority: 'alta' as const,
        status: 'pendiente' as const,
      },
      {
        title: 'Facturas reparación chalet 2023',
        source: 'Parte actora',
        purpose: 'Verificar destino indemnización Consorcio.',
        priority: 'media' as const,
        status: 'pendiente' as const,
      },
      {
        title: 'Tasación pericial actualizada',
        source: 'Perito externo',
        purpose: 'Actualizar valor de mercado del inmueble.',
        priority: 'media' as const,
        status: 'solicitado' as const,
      },
      {
        title: 'Justificantes gastos escolares 2022-2024',
        source: 'Centro escolar',
        purpose: 'Soportar reclamación de gastos extraordinarios.',
        priority: 'media' as const,
        status: 'pendiente' as const,
      },
      {
        title: 'Certificado empadronamiento Juan',
        source: 'Ayuntamiento',
        purpose: 'Acreditar ausencia de uso del chalet.',
        priority: 'baja' as const,
        status: 'recibido' as const,
      },
      {
        title: 'Informe pericial estado chalet',
        source: 'Arquitecto',
        purpose: 'Valorar deterioro por falta de mantenimiento.',
        priority: 'media' as const,
        status: 'pendiente' as const,
      },
      {
        title: 'Acta mediación ICAV',
        source: 'ICAV',
        purpose: 'Respaldar buena fe procesal.',
        priority: 'baja' as const,
        status: 'recibido' as const,
      },
    ];

    for (const docRequest of docRequests) {
      await docRequestsRepo.create({
        caseId: cas001.id,
        ...docRequest,
      });
    }

    const docRequestsMislata = [
      {
        title: 'Recibos material escolar 2022-2024',
        source: 'Centro escolar',
        purpose: 'Justificar gastos extraordinarios.',
        priority: 'media' as const,
        status: 'pendiente' as const,
      },
    ];

    for (const docRequest of docRequestsMislata) {
      await docRequestsRepo.create({
        caseId: cas002.id,
        ...docRequest,
      });
    }

    const docRequestsQuart = [
      {
        title: 'Resolución DOGV ayuda DANA',
        source: 'DOGV',
        purpose: 'Acreditar cuantía y beneficiario.',
        priority: 'alta' as const,
        status: 'solicitado' as const,
      },
    ];

    for (const docRequest of docRequestsQuart) {
      await docRequestsRepo.create({
        caseId: cas003.id,
        ...docRequest,
      });
    }

    // ==========================================
    // TAREAS
    // ==========================================
    const tasks = [
      {
        title: 'Formalizar alegación prescripción art. 1964.2 CC',
        dueDate: '2025-06-24',
        priority: 'alta' as const,
        status: 'pendiente' as const,
        notes: 'Relacionar con STS 458/2025.',
        links: [],
      },
      {
        title: 'Solicitar extractos BBVA 2011',
        dueDate: '2025-06-20',
        priority: 'alta' as const,
        status: 'pendiente' as const,
        notes: 'Unidad de caja y aportaciones.',
        links: [],
      },
      {
        title: 'Validar error material transferencia 2024',
        dueDate: '2025-06-18',
        priority: 'media' as const,
        status: 'pendiente' as const,
        notes: 'Preparar cronología bancaria.',
        links: [],
      },
      {
        title: 'Ensayar guiones audiencia previa',
        dueDate: '2025-06-15',
        priority: 'baja' as const,
        status: 'pendiente' as const,
        notes: 'Preparar lectura en sala.',
        links: [],
      },
      {
        title: 'Actualizar cuadro comparativo de ingresos',
        dueDate: '2025-06-22',
        priority: 'media' as const,
        status: 'en_progreso' as const,
        notes: 'Pendiente de facturas 2012.',
        links: [],
      },
      {
        title: 'Coordinar pericial del estado del chalet',
        dueDate: '2025-06-28',
        priority: 'media' as const,
        status: 'pendiente' as const,
        notes: 'Solicitar presupuesto perito.',
        links: [],
      },
      {
        title: 'Revisar anexos documentales',
        dueDate: '2025-06-19',
        priority: 'baja' as const,
        status: 'pendiente' as const,
        notes: 'Listado de anexos actualizados.',
        links: [],
      },
      {
        title: 'Preparar testifical vecinal',
        dueDate: '2025-07-01',
        priority: 'media' as const,
        status: 'pendiente' as const,
        notes: 'Uso exclusivo del chalet.',
        links: [],
      },
      {
        title: 'Verificar gastos extraordinarios de hijos',
        dueDate: '2025-06-25',
        priority: 'alta' as const,
        status: 'en_progreso' as const,
        notes: 'Recopilar recibos pendientes.',
        links: [],
      },
      {
        title: 'Revisar borrador de demanda hipoteca',
        dueDate: '2025-07-05',
        priority: 'media' as const,
        status: 'pendiente' as const,
        notes: 'Procedimiento de impagos.',
        links: [],
      },
    ];

    for (const task of tasks) {
      await tasksRepo.create({
        caseId: cas001.id,
        ...task,
      });
    }

    const tasksMislata = [
      {
        title: 'Preparar ejecución gastos escolares',
        dueDate: '2025-06-30',
        priority: 'media' as const,
        status: 'pendiente' as const,
        notes: 'Consolidar recibos y notificaciones.',
        links: [],
      },
    ];

    for (const task of tasksMislata) {
      await tasksRepo.create({
        caseId: cas002.id,
        ...task,
      });
    }

    const tasksQuart = [
      {
        title: 'Verificar ayuda DANA en cuenta',
        dueDate: '2025-06-26',
        priority: 'alta' as const,
        status: 'pendiente' as const,
        notes: 'Solicitar extractos y resolución DOGV.',
        links: [],
      },
    ];

    for (const task of tasksQuart) {
      await tasksRepo.create({
        caseId: cas003.id,
        ...task,
      });
    }

    // ==========================================
    // AUDIENCIA PREVIA (FASES)
    // ==========================================
    const audienciaPhases = [
      {
        phase: 'Cuestiones procesales',
        importance: 'alta' as const,
        script:
          'Con la venia, esta parte se remite a las cuestiones procesales planteadas, solicitando se ratifique la competencia y se tenga por válidamente constituida la relación procesal.',
        items: [
          {
            id: generateUUID(),
            title: 'Competencia objetiva y territorial confirmadas',
            importance: 'alta' as const,
            linkedClaimIds: [],
            linkedDocIds: [],
          },
          {
            id: generateUUID(),
            title: 'Legitimación activa/pasiva sin incidencias',
            importance: 'media' as const,
            linkedClaimIds: [],
            linkedDocIds: [],
          },
        ],
      },
      {
        phase: 'Hechos controvertidos',
        importance: 'alta' as const,
        script:
          'Se fijan como controvertidos los hechos relativos a la unidad de caja, el impago hipotecario y el destino de la indemnización del Consorcio.',
        items: [
          {
            id: generateUUID(),
            title: 'Unidad de caja funcional 2006-2024',
            importance: 'alta' as const,
            linkedClaimIds: [claimIdMap.get('R01')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
          {
            id: generateUUID(),
            title: 'Impago de cuotas hipotecarias desde octubre 2023',
            importance: 'alta' as const,
            linkedClaimIds: [claimIdMap.get('R04')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
          {
            id: generateUUID(),
            title: 'Destino de indemnización Consorcio',
            importance: 'media' as const,
            linkedClaimIds: [claimIdMap.get('R05')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
        ],
      },
      {
        phase: 'Proposición de prueba',
        importance: 'alta' as const,
        script:
          'Se proponen documentales, pericial y testifical para acreditar la trazabilidad de fondos y el uso exclusivo del inmueble.',
        items: [
          {
            id: generateUUID(),
            title: 'Extractos bancarios y cuadro consolidado de ingresos',
            importance: 'alta' as const,
            linkedClaimIds: [claimIdMap.get('R01')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
          {
            id: generateUUID(),
            title: 'Pericial estado chalet y tasación actualizada',
            importance: 'media' as const,
            linkedClaimIds: [claimIdMap.get('R07')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
          {
            id: generateUUID(),
            title: 'Testifical vecinal sobre uso exclusivo',
            importance: 'media' as const,
            linkedClaimIds: [claimIdMap.get('R03')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
        ],
      },
      {
        phase: 'Sobrevenidos',
        importance: 'media' as const,
        script:
          'Se reserva la posibilidad de introducir documentación sobrevenida vinculada a extractos bancarios y mediación.',
        items: [
          {
            id: generateUUID(),
            title: 'Aportación de nuevos extractos bancarios',
            importance: 'media' as const,
            linkedClaimIds: [claimIdMap.get('R02')].filter(
              (id): id is string => Boolean(id)
            ),
            linkedDocIds: [],
          },
        ],
      },
      {
        phase: 'Peticiones de ordenación',
        importance: 'baja' as const,
        script:
          'Se interesa el señalamiento preferente y la fijación clara de hechos controvertidos para evitar nuevos aplazamientos.',
        items: [
          {
            id: generateUUID(),
            title: 'Señalamiento preferente por dilaciones previas',
            importance: 'baja' as const,
            linkedClaimIds: [],
            linkedDocIds: [],
          },
        ],
      },
    ];

    for (const phase of audienciaPhases) {
      await audienciaPhasesRepo.create({
        caseId: cas001.id,
        ...phase,
      });
    }

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
