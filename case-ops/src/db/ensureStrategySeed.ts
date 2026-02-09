import { estrategiaPicassent, estrategiaMislata, type LineaEstrategica } from '../data/estrategia/informeEstrategico';
import { escenarios as escenariosPicassent } from '../data/picassent/escenarios';
import { escenarios as escenariosMislata } from '../data/mislata/escenarios';
import { escenarios as escenariosQuart } from '../data/quart/escenarios';
import { matrizRefutacion as refutacionPicassent } from '../data/picassent';
import { matrizRefutacion as refutacionMislata } from '../data/mislata';
import { matrizRefutacion as refutacionQuart } from '../data/quart';
import {
  casesRepo,
  scenarioBriefsRepo,
  scenarioRefutationsRepo,
  strategiesRepo,
} from './repositories';
import type { ScenarioBrief, ScenarioRefutation, Strategy } from '../types';

type CaseKey = 'picassent' | 'mislata' | 'quart';

const estrategiaByCaseKey: Partial<Record<CaseKey, LineaEstrategica[]>> = {
  picassent: estrategiaPicassent,
  mislata: estrategiaMislata,
};

const escenariosByCaseKey: Record<CaseKey, typeof escenariosPicassent> = {
  picassent: escenariosPicassent,
  mislata: escenariosMislata,
  quart: escenariosQuart,
};

const refutacionByCaseKey: Record<CaseKey, typeof refutacionPicassent> = {
  picassent: refutacionPicassent,
  mislata: refutacionMislata,
  quart: refutacionQuart,
};

const mapLineaToStrategy = (
  linea: LineaEstrategica
): Omit<Strategy, 'id' | 'createdAt' | 'updatedAt' | 'caseId'> => ({
  attack: linea.titulo,
  risk: linea.riesgos ?? linea.prioridad,
  rebuttal: linea.descripcion,
  evidencePlan: linea.fundamento,
  questions: linea.frasesClave.join('\n'),
  tags: [`tipo:${linea.tipo}`, linea.prioridad, ...linea.articulosRelacionados],
});

export async function ensureStrategySeed(caseId: string): Promise<void> {
  const caseData = await casesRepo.getById(caseId);
  const caseKey = caseData?.caseKey as CaseKey | undefined;
  if (!caseKey) return;

  const [existingStrategies, existingBriefs, existingRefutations] = await Promise.all([
    strategiesRepo.getByCaseId(caseId),
    scenarioBriefsRepo.getByCaseId(caseId),
    scenarioRefutationsRepo.getByCaseId(caseId),
  ]);

  if (existingStrategies.length === 0) {
    const data = estrategiaByCaseKey[caseKey] ?? [];
    for (const linea of data) {
      await strategiesRepo.create({ caseId, ...mapLineaToStrategy(linea) });
    }
  }

  if (existingBriefs.length === 0) {
    const data = escenariosByCaseKey[caseKey] ?? [];
    for (const escenario of data) {
      const entry: Omit<ScenarioBrief, 'id' | 'createdAt' | 'updatedAt'> = {
        caseId,
        ...escenario,
      };
      await scenarioBriefsRepo.create(entry);
    }
  }

  if (existingRefutations.length === 0) {
    const data = refutacionByCaseKey[caseKey] ?? [];
    for (const refutacion of data) {
      const entry: Omit<ScenarioRefutation, 'id' | 'createdAt' | 'updatedAt'> = {
        caseId,
        ...refutacion,
      };
      await scenarioRefutationsRepo.create(entry);
    }
  }
}
