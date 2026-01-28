// ============================================
// CASE OPS - Seed Data
// Initial data for first install
// ============================================

import {
  settingsRepo,
  counterRepo,
  casesRepo,
  factsRepo,
  partidasRepo,
  eventsRepo,
  strategiesRepo,
} from './repositories';
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
    await counterRepo.setCounter('strategies', 0);
    await counterRepo.setCounter('tasks', 0);

    // ==========================================
    // CASE CAS001 - Procedimiento Ordinario Civil (TRONCO)
    // ==========================================
    const cas001 = await casesRepo.create({
      title: 'Procedimiento Ordinario Civil',
      court: 'JPII nº 1 de Picassent (Valencia)',
      autosNumber: '715/2024',
      type: 'ordinario',
      status: 'activo',
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
    // CASE CAS002 - Ejecución de sentencia
    // ==========================================
    await casesRepo.create({
      title: 'Ejecución de sentencia (familia)',
      court: 'Juzgado de Mislata',
      autosNumber: '',
      type: 'ejecucion',
      status: 'activo',
      parentCaseId: cas001.id,
      notes: `Objeto:
- Ejecución por cantidades (≈3.500 € embargados)
- Fondo común hijos / gastos escolares

Deriva del divorcio y del incumplimiento de obligaciones económicas.`,
      tags: ['ejecucion', 'pension', 'gastos'],
    });

    // ==========================================
    // CASE CAS003 - Incidentes hipotecarios
    // ==========================================
    await casesRepo.create({
      title: 'Impagos hipoteca - Reclamación',
      court: 'Pendiente',
      autosNumber: '',
      type: 'incidente',
      status: 'activo',
      parentCaseId: cas001.id,
      notes: `Objeto:
- Impago de hipoteca por Vicenta desde octubre 2023
- Reclamación de cuotas impagadas

Estado: Pre-procesal / preparación de demanda`,
      tags: ['hipoteca', 'impago'],
    });

    // ==========================================
    // CASE CAS004 - Consorcio Compensación Seguros
    // ==========================================
    await casesRepo.create({
      title: 'Expediente Consorcio Compensación Seguros',
      court: 'Consorcio de Compensación de Seguros',
      autosNumber: '',
      type: 'administrativo',
      status: 'cerrado',
      parentCaseId: cas001.id,
      notes: `Objeto: Indemnización por daños en chalet común
Importe: 5.400 €
Estado: Resuelto (abono efectuado a cuenta de Vicenta)

Problema: No se destinó a reparación del bien común

Valor probatorio: ALTO`,
      tags: ['seguro', 'indemnizacion', 'apropiacion'],
    });

    // ==========================================
    // CASE CAS005 - Resolución AEAT
    // ==========================================
    await casesRepo.create({
      title: 'Resolución AEAT (2012)',
      court: 'AEAT',
      autosNumber: '',
      type: 'administrativo',
      status: 'cerrado',
      parentCaseId: cas001.id,
      notes: `Objeto: Reinversión de beneficio de piso privativo en construcción
Estado: Resuelto, firme

Valor: Valida cronología y destino de fondos
Documento "blindado" que neutraliza narrativa contraria`,
      tags: ['aeat', 'fiscal', 'reinversion'],
    });

    // ==========================================
    // CASE CAS006 - Mediación ICAV
    // ==========================================
    await casesRepo.create({
      title: 'Mediación ICAV',
      court: 'ICAV',
      autosNumber: '',
      type: 'mediacion',
      status: 'cerrado',
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

    console.log('Database seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
