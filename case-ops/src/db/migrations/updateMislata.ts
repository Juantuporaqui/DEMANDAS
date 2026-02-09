// ============================================
// MIGRACIÓN: Actualizar caso Mislata con datos reales
// Ejecutar desde consola o botón en Settings
// ============================================

import { db } from '../schema';
import { casesRepo, eventsRepo, partidasRepo, factsRepo, strategiesRepo } from '../repositories';
import { eurosToCents } from '../../utils/validators';
import { procedimientoMislata, desgloseMislata, argumentosContestacion } from '../../data/mislata';

export async function migrateMislataCase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Buscar caso Mislata existente (por caseKey)
    let mislataCase = await casesRepo.getByCaseKey('mislata');

    // 2. Si existe, actualizar. Si no, crear.
    if (mislataCase) {
      // Actualizar caso existente
      await db.cases.update(mislataCase.id, {
        caseKey: 'mislata',
        title: 'J.V. 1185/2025 · Reclamación Cuotas Hipotecarias',
        court: procedimientoMislata.juzgado,
        autosNumber: procedimientoMislata.autos,
        type: 'verbal',
        status: 'activo',
        clientRole: 'demandante',
        opposingCounsel: `${procedimientoMislata.procuradorContrario} (${procedimientoMislata.demandada})`,
        notes: `Reclamación de ${(procedimientoMislata.cuantiaReclamada / 100).toLocaleString('es-ES')}€ por cuotas hipotecarias pagadas en exceso (oct 2023 - jun 2025). Art. 1145 CC - Acción de regreso deudor solidario. ${procedimientoMislata.estado}`,
        tags: procedimientoMislata.tags,
        updatedAt: new Date().toISOString(),
      });
      console.log('Caso Mislata actualizado:', mislataCase.id);
    } else {
      // Crear nuevo caso
      mislataCase = await casesRepo.create({
        caseKey: 'mislata',
        title: 'J.V. 1185/2025 · Reclamación Cuotas Hipotecarias',
        court: procedimientoMislata.juzgado,
        autosNumber: procedimientoMislata.autos,
        type: 'verbal',
        status: 'activo',
        clientRole: 'demandante',
        judge: '[Pendiente]',
        opposingCounsel: `${procedimientoMislata.procuradorContrario} (${procedimientoMislata.demandada})`,
        notes: `Reclamación de ${(procedimientoMislata.cuantiaReclamada / 100).toLocaleString('es-ES')}€. Art. 1145 CC.`,
        tags: procedimientoMislata.tags,
      });
      console.log('Caso Mislata creado:', mislataCase.id);
    }

    const caseId = mislataCase.id;

    // 3. Eliminar eventos antiguos de Mislata y crear nuevos
    const oldEvents = await db.events.where('caseId').equals(caseId).toArray();
    for (const e of oldEvents) {
      await db.events.delete(e.id);
    }

    // Crear eventos correctos
    const eventosData = [
      {
        date: procedimientoMislata.fechaDemanda,
        type: 'procesal',
        title: 'Presentación Demanda',
        description: `Demanda de reclamación de cantidad (${(procedimientoMislata.cuantiaReclamada / 100).toLocaleString('es-ES')}€) por cuotas hipotecarias.`,
      },
      {
        date: procedimientoMislata.fechaAdmision,
        type: 'procesal',
        title: 'Admisión a Trámite',
        description: 'Admitida demanda de juicio verbal.',
      },
      {
        date: procedimientoMislata.fechaImpugnacionRecurso,
        type: 'procesal',
        title: 'Impugnación Recurso Reposición',
        description: 'Impugnación del recurso de Vicenta contra litispendencia/prejudicialidad.',
      },
      {
        date: '2023-08-01',
        type: 'factico',
        title: 'Cese de aportaciones Vicenta',
        description: 'Vicenta deja de contribuir al pago de las cuotas hipotecarias.',
      },
      {
        date: '2023-10-01',
        type: 'factico',
        title: 'Juan asume 100% cuotas',
        description: 'Juan comienza a pagar el 100% de las cuotas desde la cuenta común.',
      },
    ];

    for (const e of eventosData) {
      await eventsRepo.create({ caseId, ...e } as any);
    }
    console.log(`${eventosData.length} eventos creados para Mislata`);

    // 4. Crear partidas económicas de Mislata
    const oldPartidas = await db.partidas.where('caseId').equals(caseId).toArray();
    for (const p of oldPartidas) {
      await db.partidas.delete(p.id);
    }

    const partidasData = [
      {
        date: '2023-08-01',
        amountCents: desgloseMislata.pagosPrestamo,
        concept: 'Pagos préstamo hipotecario (ago 2023 - jun 2025)',
        payer: 'Juan Rodríguez Crespo',
        beneficiary: 'CaixaBank',
        state: 'pagada',
        theory: 'Cuotas pagadas íntegramente por Juan desde cuenta común',
        notes: `Total: ${(desgloseMislata.pagosPrestamo / 100).toLocaleString('es-ES')}€`,
        tags: ['hipoteca', 'cuotas', 'pagado'],
      },
      {
        date: '2023-10-01',
        amountCents: desgloseMislata.aportacionVicenta,
        concept: 'Aportación neta Vicenta (ingresos - retiradas)',
        payer: 'Vicenta Jiménez Vera',
        beneficiary: 'Cuenta común',
        state: 'recibida',
        theory: 'Ingresó 2.248€ pero retiró 1.088,95€ = 1.159,05€ netos',
        notes: 'Solo 4 ingresos de 562€ y luego retiradas en cajero',
        tags: ['aportacion', 'vicenta'],
      },
      {
        date: '2025-06-30',
        amountCents: desgloseMislata.excesoJuan,
        concept: 'EXCESO PAGADO POR JUAN (Reclamación)',
        payer: 'Juan',
        beneficiary: 'A reclamar a Vicenta',
        state: 'reclamada',
        theory: 'Art. 1145 CC - Acción de regreso del deudor solidario',
        notes: `Aportación Juan (14.404,88€) - Obligación 50% (7.284,90€) = 7.119,98€`,
        tags: ['reclamacion', 'exceso', 'principal'],
      },
    ];

    for (const p of partidasData) {
      await partidasRepo.create({ caseId, ...p } as any);
    }
    console.log(`${partidasData.length} partidas creadas para Mislata`);

    // 5. Crear hechos/facts para Mislata
    const oldFacts = await db.facts.where('caseId').equals(caseId).toArray();
    for (const f of oldFacts) {
      await db.facts.delete(f.id);
    }

    const factsData = [
      {
        title: 'Solidaridad en préstamo hipotecario',
        narrative:
          'Ambas partes firmaron como deudores solidarios del préstamo hipotecario. El art. 1145 CC otorga acción de regreso al deudor que paga más de su parte.',
        status: 'admitido',
        burden: 'demandante',
        risk: 'bajo',
        strength: 5,
        tags: ['solidaridad', 'art-1145', 'fundamento'],
      },
      {
        title: 'Cese unilateral de pago por Vicenta',
        narrative:
          'Desde agosto 2023, Vicenta dejó de contribuir al pago de las cuotas. Los extractos bancarios (Doc. 3) acreditan que Juan pagó el 100%.',
        status: 'a_probar',
        burden: 'demandante',
        risk: 'bajo',
        strength: 5,
        tags: ['cese', 'prueba', 'extractos'],
      },
      {
        title: 'Cuantía líquida y exigible',
        narrative: `El exceso pagado por Juan asciende a 7.119,98€. Es cantidad líquida (determinada), vencida (cuotas mensuales) y exigible (obligación contractual).`,
        status: 'a_probar',
        burden: 'demandante',
        risk: 'bajo',
        strength: 5,
        tags: ['cuantia', 'liquidez'],
      },
      {
        title: 'Contestación: Litispendencia alegada',
        narrative:
          'Vicenta alega litispendencia con Picassent 715/2024. FALSO: las cuotas de Mislata son POSTERIORES y no estaban incluidas en Picassent.',
        status: 'controvertido',
        burden: 'demandado',
        risk: 'medio',
        strength: 4,
        tags: ['litispendencia', 'rebatir', 'contestacion'],
      },
      {
        title: 'Contestación: Prejudicialidad civil',
        narrative:
          'Vicenta pide suspensión por prejudicialidad (art. 43 LEC). El artículo dice "podrá", es facultativo. Nuestro crédito es autónomo y líquido.',
        status: 'controvertido',
        burden: 'demandado',
        risk: 'medio',
        strength: 4,
        tags: ['prejudicialidad', 'rebatir', 'contestacion'],
      },
      {
        title: 'Contestación: Compensación de créditos',
        narrative:
          'Vicenta pretende compensar con su supuesto crédito de Picassent. Art. 1196 CC exige deudas líquidas y exigibles. Su crédito está disputado y prescrito.',
        status: 'controvertido',
        burden: 'demandado',
        risk: 'bajo',
        strength: 5,
        tags: ['compensacion', 'rebatir', 'art-1196'],
      },
    ];

    for (const f of factsData) {
      await factsRepo.create({ caseId, ...f } as any);
    }
    console.log(`${factsData.length} hechos creados para Mislata`);

    // 6. Crear estrategias para Mislata
    const oldStrategies = await db.strategies.where('caseId').equals(caseId).toArray();
    for (const s of oldStrategies) {
      await db.strategies.delete(s.id);
    }

    const strategiesData = argumentosContestacion.map((arg) => ({
      attack: arg.titulo,
      risk: arg.estado === 'peligroso' ? 'Alto' : arg.estado === 'rebatible' ? 'Medio' : 'Bajo',
      rebuttal: arg.nuestraReplica,
      evidencePlan: arg.articulosInvocados.join(', '),
      tags: ['mislata', 'contestacion', arg.estado],
    }));

    for (const s of strategiesData) {
      await strategiesRepo.create({ caseId, ...s } as any);
    }
    console.log(`${strategiesData.length} estrategias creadas para Mislata`);

    return {
      success: true,
      message: `Migración completada: Caso Mislata actualizado con ${eventosData.length} eventos, ${partidasData.length} partidas, ${factsData.length} hechos y ${strategiesData.length} estrategias.`,
    };
  } catch (error) {
    console.error('Error en migración Mislata:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
    };
  }
}

// Función para ejecutar desde consola del navegador
(window as any).migrateMislata = migrateMislataCase;
