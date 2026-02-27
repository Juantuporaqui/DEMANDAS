export type APPhase = 'SANEAMIENTO' | 'HECHOS' | 'PRUEBA' | 'CIERRE';

export type PreclusionStatus = 'OK' | 'RISK_MED' | 'RISK_HIGH' | 'PRECLUDED' | 'EX_OFFICIO_ONLY' | 'UNKNOWN';

export type APInputs = {
  raisedInContestacion: boolean;
  declinatoriaFiled: boolean;
  fueroImperativoApplies: boolean;
};

export type APExceptionCard = {
  id: string;
  title: string;
  phase: APPhase;
  status: PreclusionStatus;
  why: string[];
  ask: string[];
  legalBasis: string[];
  checklist: string[];
  counterAttacks: string[];
  evidence: {
    supports: string[];
    missing: string[];
  };
  overrides: {
    forcedEnabled: boolean;
    reason: string;
  };
  userInputs: APInputs;
  copyBlocks: {
    legacy: {
      actaPrincipal: string;
      actaSubsidiario: string;
      s90: string;
      m3: string;
      m5: string;
    };
    improved?: {
      actaPrincipal?: string;
      actaSubsidiario?: string;
      s90?: string;
      m3?: string;
      m5?: string;
    };
  };
};

export type APCaseContext = {
  hasAdmisisionDecretoCompetencia: boolean;
};
