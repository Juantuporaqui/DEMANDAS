import type { APCaseContext, APInputs, APExceptionCard, PreclusionStatus } from './types.ts';

export function computePreclusionStatus(
  cardId: string,
  apInputs: APInputs,
  caseContext: APCaseContext,
): { status: PreclusionStatus; why: string[] } {
  if (cardId === 'competencia_territorial') {
    if (apInputs.declinatoriaFiled || apInputs.fueroImperativoApplies) {
      return { status: 'OK', why: ['Competencia territorial activable por declinatoria o por fuero imperativo.'] };
    }
    return {
      status: 'PRECLUDED',
      why: [
        'DIAGNÓSTICO: competencia territorial precluida por falta de declinatoria y ausencia de fuero imperativo declarado.',
        'Riesgo de convalidación/sumisión tácita: no se insertará en guiones salvo habilitación forzada motivada.',
        caseContext.hasAdmisisionDecretoCompetencia
          ? 'Consta decreto de admisión con revisión de competencia territorial atribuida a este juzgado.'
          : 'NO CONSTA: falta decreto de admisión indexado sobre competencia territorial.',
      ],
    };
  }

  if (cardId === 'competencia_objetiva_funcional') {
    return {
      status: 'EX_OFFICIO_ONLY',
      why: ['DIAGNÓSTICO: competencia objetiva/funcional apreciable de oficio; no se auto-inserta en guiones.'],
    };
  }

  if (cardId === 'indebida_acumulacion') {
    return apInputs.raisedInContestacion
      ? { status: 'OK', why: ['Opuesta en contestación: mantenible en saneamiento.'] }
      : { status: 'RISK_MED', why: ['No consta oposición en contestación: defendible en AP con riesgo medio de rechazo.'] };
  }

  if (cardId === 'prescripcion') {
    return apInputs.raisedInContestacion
      ? { status: 'OK', why: ['Excepción preservada en contestación (art. 1964.2 CC + no interrupción).'] }
      : { status: 'RISK_MED', why: ['Requiere validación manual de soporte documental de contestación para mantener prescripción en AP.'] };
  }

  if (cardId === 'defecto_demanda') {
    return { status: 'OK', why: ['Defectos 424–425 LEC activables en AP.'] };
  }

  if (cardId === 'litisconsorcio') {
    return { status: 'EX_OFFICIO_ONLY', why: ['Posible apreciación de oficio; activar con cautela y enfoque de integración.'] };
  }

  return { status: 'UNKNOWN', why: ['NO CONSTA: se requiere validación manual de preclusión para esta excepción.'] };
}

export function computeAvailability(result: { status: PreclusionStatus; why: string[] }, card: APExceptionCard) {
  const isDiagnosticCompetencia = card.id === 'competencia_territorial' || card.id === 'competencia_objetiva_funcional';
  const defaultEnabled = !isDiagnosticCompetencia && result.status === 'OK';
  const warnings = [...result.why];
  if (result.status === 'PRECLUDED' || result.status === 'UNKNOWN') {
    warnings.push('Bloqueada por defecto. Solo habilitar con “Force enable” + motivo obligatorio.');
  }
  if (card.id === 'competencia_territorial' || card.id === 'competencia_objetiva_funcional') {
    warnings.push('Competencia en modo DIAGNÓSTICO; no se auto-inserta en guiones.');
  }
  return { defaultEnabled, warnings };
}
