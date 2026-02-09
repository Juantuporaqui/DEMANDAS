// ============================================
// MIGRACIÓN: Actualizar caso Quart con datos reales
// ETJ 1428/2025 + Oposición 1428.1/2025
// ============================================

import { db } from '../schema';
import { casesRepo, eventsRepo, partidasRepo, factsRepo, strategiesRepo } from '../repositories';
import {
  procedimientoQuart,
  partesQuart,
  reclamacionVicenta,
  argumentosOposicion,
  desgloseCifrasQuart,
  puntosDebiles,
  disputasQuart,
  desgloseUsoIndebido,
  pagosDirectosJuan,
} from '../../data/quart';
import { timelineQuart } from '../../data/quart/timeline';

export async function migrateQuartCase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Buscar caso Quart existente
    let quartCase = await casesRepo.getByCaseKey('quart');

    // 2. Si existe, actualizar. Si no, crear.
    if (quartCase) {
      await db.cases.update(quartCase.id, {
        caseKey: 'quart',
        title: 'ETJ 1428/2025 · Ejecución Cuenta Hijos',
        court: procedimientoQuart.juzgado,
        autosNumber: procedimientoQuart.ejecucion.numero,
        type: 'ejecucion',
        status: 'activo',
        clientRole: 'ejecutado',
        judge: procedimientoQuart.procedimientoOrigen.juez,
        opposingCounsel: `${partesQuart.ejecutante.procurador} (${partesQuart.ejecutante.nombre})`,
        notes: `Ejecución por supuestos impagos 200€/mes cuenta hijos. Reclamación: 2.400€. Oposición presentada alegando pluspetición, compensación y pagos directos. ${procedimientoQuart.estado}. NIG: ${procedimientoQuart.nig}`,
        tags: procedimientoQuart.tags,
        updatedAt: new Date().toISOString(),
      });
      console.log('Caso Quart actualizado:', quartCase.id);
    } else {
      quartCase = await casesRepo.create({
        caseKey: 'quart',
        title: 'ETJ 1428/2025 · Ejecución Cuenta Hijos',
        court: procedimientoQuart.juzgado,
        autosNumber: procedimientoQuart.ejecucion.numero,
        type: 'ejecucion',
        status: 'activo',
        clientRole: 'ejecutado',
        judge: procedimientoQuart.procedimientoOrigen.juez,
        opposingCounsel: `${partesQuart.ejecutante.procurador} (${partesQuart.ejecutante.nombre})`,
        notes: `Ejecución por supuestos impagos 200€/mes cuenta hijos. Reclamación: 2.400€. ${procedimientoQuart.estado}`,
        tags: procedimientoQuart.tags,
      });
      console.log('Caso Quart creado:', quartCase.id);
    }

    const caseId = quartCase.id;

    // 3. Eliminar eventos antiguos y crear nuevos desde timeline
    const oldEvents = await db.events.where('caseId').equals(caseId).toArray();
    for (const e of oldEvents) {
      await db.events.delete(e.id);
    }

    // Crear eventos desde timeline (solo los más importantes)
    const eventosImportantes = timelineQuart.filter(
      (e) =>
        e.tipo === 'judicial' ||
        e.tags.includes('critico') ||
        e.tags.includes('prueba') ||
        e.tags.includes('pago')
    );

    for (const evento of eventosImportantes) {
      await eventsRepo.create({
        caseId,
        date: evento.fecha,
        type: evento.tipo === 'judicial' ? 'procesal' : 'factico',
        title: evento.titulo,
        description: evento.descripcion,
      } as any);
    }
    console.log(`${eventosImportantes.length} eventos creados para Quart`);

    // 4. Crear partidas económicas
    const oldPartidas = await db.partidas.where('caseId').equals(caseId).toArray();
    for (const p of oldPartidas) {
      await db.partidas.delete(p.id);
    }

    const partidasData = [
      {
        date: '2025-10-30',
        amountCents: desgloseCifrasQuart.reclamadoPorEjecutante,
        concept: 'Reclamado por Vicenta (12 meses x 200€)',
        payer: 'Juan (supuesto deudor)',
        beneficiary: 'Vicenta (ejecutante)',
        state: 'disputada',
        theory: 'Reclamación íntegra de 2.400€ por impagos cuenta hijos',
        tags: ['reclamacion', 'ejecucion'],
      },
      {
        date: '2025-11-14',
        amountCents: desgloseCifrasQuart.usoIndebidoAlegadoCents,
        concept: 'Uso indebido cuenta (alegado por Juan)',
        payer: 'Cuenta común',
        beneficiary: 'Vicenta',
        state: 'disputada',
        theory: 'Efectivo, transferencias, perfumería, ropa, tratamientos no autorizados',
        tags: ['compensacion', 'defensa'],
      },
      {
        date: '2025-11-14',
        amountCents: desgloseCifrasQuart.deficitAlegadoCents,
        concept: 'Déficit real alegado por Juan',
        payer: 'Juan',
        beneficiary: 'Cuenta común',
        state: 'disputada',
        theory: 'Obligación 22 meses (4.400€) - Aportado (2.571,27€) = 1.828,73€',
        tags: ['pluspeticion', 'defensa'],
      },
      {
        date: '2025-11-14',
        amountCents: desgloseCifrasQuart.saldoNetoAFavorJuanCents,
        concept: 'Saldo neto a favor de Juan',
        payer: 'Vicenta',
        beneficiary: 'Juan',
        state: 'disputada',
        theory: 'Uso indebido (2.710,61€) - Déficit (1.828,73€) = 881,88€ a favor',
        tags: ['compensacion', 'defensa', 'saldo'],
      },
      {
        date: '2025-11-14',
        amountCents: desgloseCifrasQuart.pagosDirectosAlegadosCents,
        concept: 'Pagos directos Juan a hijos',
        payer: 'Juan',
        beneficiary: 'Hijos',
        state: 'disputada',
        theory: 'iPad, ordenador, gimnasio, móviles, farmacia, ropa, etc.',
        tags: ['pagos-directos', 'defensa'],
      },
    ];

    for (const p of partidasData) {
      await partidasRepo.create({ caseId, ...p } as any);
    }
    console.log(`${partidasData.length} partidas creadas para Quart`);

    // 5. Crear hechos/facts
    const oldFacts = await db.facts.where('caseId').equals(caseId).toArray();
    for (const f of oldFacts) {
      await db.facts.delete(f.id);
    }

    const factsData = [
      {
        title: 'Sentencia divorcio 362/2023 (título ejecutivo)',
        narrative: `Sentencia de ${procedimientoQuart.procedimientoOrigen.fechaSentencia} aprobando convenio regulador. Cláusula: ambos deben ingresar 200€/mes del 1 al 5 en cuenta común.`,
        status: 'admitido',
        burden: 'neutro',
        risk: 'bajo',
        strength: 5,
        tags: ['base', 'titulo-ejecutivo'],
      },
      {
        title: 'Reclamación de Vicenta: 2.400€ (12 meses)',
        narrative: reclamacionVicenta.mesesReclamados.join(', ') + '. Total reclamado: 2.400€.',
        status: 'controvertido',
        burden: 'ejecutante',
        risk: 'medio',
        strength: 3,
        tags: ['reclamacion', 'impago'],
      },
      {
        title: 'Pluspetición: déficit real es 1.828,73€, no 2.400€',
        narrative: 'Juan aportó 2.571,27€ de 4.400€ (22 meses). Déficit real: 1.828,73€. Hay pluspetición de 571,27€.',
        status: 'a_probar',
        burden: 'demandante',
        risk: 'bajo',
        strength: 4,
        tags: ['pluspeticion', 'defensa'],
      },
      {
        title: 'Uso indebido cuenta: 2.710,61€',
        narrative: 'Vicenta retiró para: efectivo (850€), transferencias (644€), perfumería (415,80€), ropa (320,50€), recargas (250€), clínicos (180,31€), otros (50€).',
        status: 'a_probar',
        burden: 'demandante',
        risk: 'medio',
        strength: 4,
        tags: ['compensacion', 'defensa', 'extractos'],
      },
      {
        title: 'Pagos directos a hijos: 1.895,65€',
        narrative: 'iPad 375€, ordenador 379€, gimnasio 219€, móviles 308€, farmacia 142€, impresora 85€, ropa/calzado varios.',
        status: 'a_probar',
        burden: 'demandante',
        risk: 'medio',
        strength: 3,
        tags: ['pagos-directos', 'defensa'],
      },
      {
        title: 'Domicilio erróneo en demanda',
        narrative: 'Demanda indicó C/ Isabel de Villena 2-5 Mislata (domicilio de Vicenta). Juan nunca residió allí.',
        status: 'a_probar',
        burden: 'demandante',
        risk: 'medio',
        strength: 3,
        tags: ['nulidad', 'defensa'],
      },
      {
        title: 'Transferencias octubre 2025 (antes despacho)',
        narrative: 'Juan transfirió 200€ el 01/10, 06/10 y 15/10/2025, antes del auto de 30/10/2025. Total: 600€ previos al despacho.',
        status: 'admitido',
        burden: 'demandante',
        risk: 'bajo',
        strength: 5,
        tags: ['pago', 'defensa', 'acreditado'],
      },
    ];

    // Añadir disputas como hechos controvertidos
    disputasQuart.forEach((d, i) => {
      factsData.push({
        title: `DISPUTA: ${d.tema}`,
        narrative: `EJECUTADO: ${d.posicionEjecutado}\n\nEJECUTANTE: ${d.posicionEjecutante}`,
        status: 'controvertido',
        burden: 'ambos',
        risk: 'alto',
        strength: 2,
        tags: ['disputa', 'controvertido'],
      });
    });

    for (const f of factsData) {
      await factsRepo.create({ caseId, ...f } as any);
    }
    console.log(`${factsData.length} hechos creados para Quart`);

    // 6. Crear estrategias desde argumentos de oposición y puntos débiles
    const oldStrategies = await db.strategies.where('caseId').equals(caseId).toArray();
    for (const s of oldStrategies) {
      await db.strategies.delete(s.id);
    }

    // Estrategias de defensa (argumentos oposición)
    const strategiesData = argumentosOposicion.map((arg) => ({
      attack: `DEFENSA: ${arg.titulo}`,
      risk: arg.riesgo === 'alto' ? 'Alto' : arg.riesgo === 'medio' ? 'Medio' : 'Bajo',
      rebuttal: arg.descripcion,
      evidencePlan: arg.fundamentoLegal.join(', '),
      tags: ['quart', 'oposicion', arg.codigo],
    }));

    // Añadir puntos débiles como estrategias de riesgo
    puntosDebiles.forEach((p) => {
      strategiesData.push({
        attack: `RIESGO: ${p.titulo}`,
        risk: p.riesgo === 'alto' ? 'Alto' : p.riesgo === 'medio' ? 'Medio' : 'Bajo',
        rebuttal: p.descripcion,
        evidencePlan: p.pruebaMitigadora,
        tags: ['quart', 'riesgo', 'punto-debil'],
      });
    });

    for (const s of strategiesData) {
      await strategiesRepo.create({ caseId, ...s } as any);
    }
    console.log(`${strategiesData.length} estrategias creadas para Quart`);

    return {
      success: true,
      message: `Migración Quart completada: ${eventosImportantes.length} eventos, ${partidasData.length} partidas, ${factsData.length} hechos, ${strategiesData.length} estrategias. Vista: ${procedimientoQuart.piezaOposicion.fechaVista} ${procedimientoQuart.piezaOposicion.horaVista}`,
    };
  } catch (error) {
    console.error('Error en migración Quart:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Desconocido'}`,
    };
  }
}

// Función para ejecutar desde consola del navegador
(window as any).migrateQuart = migrateQuartCase;
