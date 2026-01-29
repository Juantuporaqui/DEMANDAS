// ============================================
// CASE OPS - Seed Data (CASO REAL: PICASSENT 715/2024)
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
  // Verificamos si ya existe la base de datos
  const settings = await settingsRepo.get();
  if (settings) {
    console.log('Database already initialized');
    return false;
  }

  console.log('Seeding database with REAL CASE DATA...');

  try {
    // 1. Inicialización básica
    const deviceName =
      typeof navigator !== 'undefined' && navigator.userAgent.includes('Android')
        ? 'Android'
        : 'Desktop';

    await settingsRepo.init(deviceName);

    // Reiniciamos contadores
    await counterRepo.setCounter('cases', 0);
    await counterRepo.setCounter('documents', 0);
    await counterRepo.setCounter('spans', 0);
    await counterRepo.setCounter('facts', 0);
    await counterRepo.setCounter('partidas', 0);
    await counterRepo.setCounter('events', 0);
    await counterRepo.setCounter('strategies', 0);
    await counterRepo.setCounter('tasks', 0);

    // =====================================================================
    // CASO PRINCIPAL: P.O. 715/2024 (División de Cosa Común)
    // Fuente: Demanda_picassent_Transcrita.docx / Contestacion_picassent_transcrita.docx
    // =====================================================================
    const mainCase = await casesRepo.create({
      title: 'P.O. 715/2024 · División Cosa Común y Reclamación',
      court: 'Juzgado de Primera Instancia e Instrucción nº 1 de Picassent',
      autosNumber: '715/2024',
      type: 'ordinario',
      status: 'activo',
      clientRole: 'demandado', // Juan es el cliente
      opposingCounsel: 'Isabel Luzzy Aguilar (Procuradora)', 
      judge: '[Pendiente Asignación]',
      notes: `OBJETO DEL PLEITO:
1. División de la cosa común (inmuebles y bienes).
2. Reclamación económica de la actora (Vicenta) por 212.677,08 €.
3. Reconvención/Compensación solicitada por Juan.

PARTES:
- Actora: Dña. Vicenta Jiménez Vera.
- Demandado: D. Juan Rodríguez Crespo.

CLAVES DEL CASO:
- La actora pretende cobrar deudas prescritas (2008-2019).
- Discusión sobre la naturaleza del préstamo ("Hipoteca del demandado" vs "Préstamo solidario").
- Compensación de saldos por retiradas de efectivo (38.500€ vs 32.000€).
- Impugnación de documentos bancarios manipulados (recortes).`,
      tags: ['división', 'reclamacion', 'familia', 'hipoteca'],
    });

    // =====================================================================
    // HECHOS CONTROVERTIDOS (FACTS)
    // Fuente: FIJAR.docx, 1_CONTRV_NTRALZA_HIPOTECA.docx
    // =====================================================================
    const factsData = [
      {
        title: 'Naturaleza del Préstamo Hipotecario',
        narrative: 'La actora lo califica como "Hipoteca del demandado". Esta parte sostiene que es un préstamo solidario suscrito por ambos cónyuges, donde la vivienda privativa del demandado (Lope de Vega) solo actúa como garantía real, no como causa del préstamo.',
        status: 'controvertido' as const,
        burden: 'demandante' as const,
        risk: 'alto' as const,
        strength: 5,
        tags: ['hipoteca', 'naturaleza_juridica', 'garantia_real']
      },
      {
        title: 'Retirada de fondos: 38.500€ vs 32.000€',
        narrative: 'La actora reclama 32.000€ retirados por Juan de la cuenta común. Se oculta que ELLA retiró 38.500€ (6.500€ más) en el mismo periodo de ruptura. Se opone compensación (Art. 1196 CC).',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 5,
        tags: ['compensacion', 'cuentas', 'retiradas']
      },
      {
        title: 'Prescripción de deudas (2008-2019)',
        narrative: 'La actora reclama gastos de IBI, préstamos y cuotas desde 2008. Esta parte alega prescripción (Art. 1964 CC - 5 años) y falta de reclamación previa (Art. 1969 CC). Se trata de "arqueología contable".',
        status: 'controvertido' as const,
        burden: 'demandado' as const, // Es excepción nuestra
        risk: 'alto' as const, // Si falla, se paga mucho
        strength: 4,
        tags: ['prescripcion', 'plazos', '1964_CC']
      },
      {
        title: 'Autoría de Transferencias (BBVA vs Caixa)',
        narrative: 'La actora aporta capturas de pantalla recortadas de BBVA donde no se ve el ordenante. Esta parte aporta los recibos íntegros de CaixaBank que demuestran que el ordenante real fue JUAN RODRÍGUEZ.',
        status: 'a_probar' as const,
        burden: 'demandado' as const,
        risk: 'bajo' as const, // Prueba documental sólida
        strength: 5,
        tags: ['falsedad', 'documental', 'bancos']
      },
      {
        title: 'Existencia de Comunidad de Bienes Tácita',
        narrative: 'Existía un sistema de "caja única" con dos cuentas conjuntas indistintas. La STS 458/2025 avala que en economías familiares confundidas no cabe reclamación retroactiva de partidas de consumo.',
        status: 'controvertido' as const,
        burden: 'demandado' as const,
        risk: 'medio' as const,
        strength: 4,
        tags: ['doctrina_ts', 'caja_unica', 'sts_458_2025']
      }
    ];

    for (const f of factsData) {
      await factsRepo.create({ caseId: mainCase.id, ...f });
    }

    // =====================================================================
    // ESTRATEGIAS (WAR ROOM)
    // Fuente: PRESCRIPCIÓN.docx, DEFENSA ARTURO PIERA.docx, Demostración_gráfica..docx
    // =====================================================================
    const strategiesData = [
      {
        attack: 'La actora reclama 150.502€ acumulados en facturas y cuotas desde 2008.',
        risk: 'Alto: Supone el 70% de la cuantía reclamada.',
        rebuttal: 'Invocar PRESCRIPCIÓN (Art. 1964.2 CC). No hubo interrupción (Art. 1973 CC). Argumento: "El divorcio no resucita deudas muertas".',
        evidencePlan: 'Calendario de prescripción (Excel) + Falta de burofaxes previos.',
        tags: ['prescripcion', 'defensa_total']
      },
      {
        attack: 'La actora reclama 32.000€ por la venta del piso de Arturo Piera.',
        risk: 'Medio: El movimiento bancario existe.',
        rebuttal: 'Excepción de COMPENSACIÓN. Acreditar que ella retiró 38.500€ de la cuenta común ES72...9491 a su privativa ES61...4052.',
        evidencePlan: 'Doc. 3 Contestación (Extracto CaixaBank con la salida de 38.500€).',
        tags: ['compensacion', 'arturo_piera']
      },
      {
        attack: 'La actora presenta capturas de app bancaria recortadas para atribuirse pagos.',
        risk: 'Bajo: Fácil de desmontar.',
        rebuttal: 'IMPUGNACIÓN por falta de autenticidad parcial. Aportar el "Cuadro Comparativo" (Doc. 26) enfrentando su captura con nuestro recibo bancario completo.',
        evidencePlan: 'Doc. 25 (Recibos oficiales) + Doc. 26 (Comparativa visual).',
        tags: ['impugnacion', 'manipulacion_prueba']
      },
      {
        attack: 'Aportación de Perito de Parte (Familiar/Amigo).',
        risk: 'Medio: Sesgo en la valoración.',
        rebuttal: 'Tacha de perito por interés. Solicitar perito judicial insaculado o aportar contraperitaje.',
        evidencePlan: 'Interrogatorio sobre relación personal con la actora.',
        tags: ['peritos', 'tacha']
      }
    ];

    for (const s of strategiesData) {
      await strategiesRepo.create({ caseId: mainCase.id, ...s });
    }

    // =====================================================================
    // EVENTOS (CRONOLOGÍA)
    // Fuente: INFORME_ESTRATEGICO.pdf, FIJAR.docx
    // =====================================================================
    const eventsData = [
      { date: '2006-08-22', type: 'factico', title: 'Cancelación Hipoteca Previa', description: 'Cancelación de carga previa privativa (22/08/2006). Base de una reclamación de la actora.' },
      { date: '2008-09-01', type: 'factico', title: 'Inicio Deudas Prescritas', description: 'Fecha de origen de los Préstamos Personales reclamados (Prescritos hace 16 años).' },
      { date: '2009-07-01', type: 'factico', title: 'Hipoteca Lope de Vega', description: 'Inicio de pagos de la hipoteca sobre vivienda privativa, usada como garantía.' },
      { date: '2012-01-01', type: 'factico', title: 'Venta Piso Madrid', description: 'Venta del inmueble privativo de Juan. Reinversión en obra común.' },
      { date: '2023-11-01', type: 'factico', title: 'Ruptura / Separación de Hecho', description: 'Momento de las retiradas de fondos (38.500€ vs 32.000€). Inicio pago exclusivo hipoteca por Juan.' },
      { date: '2024-01-20', type: 'procesal', title: 'Presentación Demanda', description: 'Vicenta presenta demanda reclamando 212.677€.' },
      { date: '2025-01-27', type: 'procesal', title: 'Emplazamiento', description: 'Notificación del juzgado para contestar en 20 días.' },
      { date: '2025-02-19', type: 'procesal', title: 'Contestación a la Demanda', description: 'Presentación del escrito de defensa por Procuradora Rosa Calvo. Allanamiento parcial a división, oposición a pagos.' }
    ];

    for (const e of eventsData) {
      await eventsRepo.create({ caseId: mainCase.id, ...e } as any);
    }

    // =====================================================================
    // PARTIDAS ECONÓMICAS
    // Fuente: FIJAR.docx, Defensa_STS_458_2025.docx
    // =====================================================================
    // Partida 1: Lo que ella reclama (IBI Prescrito)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2013-01-01',
      amountCents: eurosToCents(1063),
      concept: 'IBI Quart 2013-2019',
      payer: 'Vicenta (Actora)',
      beneficiary: 'Comunidad',
      state: 'prescrita', // Estado especial
      theory: 'Reclamación de gastos de hace 11 años',
      notes: 'Prescrito por Art. 1964 CC (5 años).',
      tags: ['ibi', 'prescrito']
    });

    // Partida 2: La retirada de fondos de ella (Compensación)
    await partidasRepo.create({
      caseId: mainCase.id,
      date: '2023-11-01',
      amountCents: eurosToCents(38500),
      concept: 'Retirada fondos cuenta común (Caixa)',
      payer: 'Cuenta Común',
      beneficiary: 'Vicenta (Privativo)',
      state: 'reclamable',
      theory: 'Compensación art. 1196 CC frente a los 32.000 reclamados',
      notes: 'Acreditado en Doc. 3 de la Contestación.',
      tags: ['compensacion', 'bancos']
    });

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
