import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { computePreclusionStatus } from './preclusionEngine.ts';
import { EXPECTED_LEGACY_TEXT_HASH, getLegacyTextHash } from './legacyTextHash.ts';

const ctx = { hasAdmisisionDecretoCompetencia: true };

test('competencia territorial is precluded by default', () => {
  const result = computePreclusionStatus('competencia_territorial', {
    raisedInContestacion: false,
    declinatoriaFiled: false,
    fueroImperativoApplies: false,
  }, ctx);
  assert.equal(result.status, 'PRECLUDED');
});

test('competencia territorial can be enabled with declinatoria/fuero', () => {
  const a = computePreclusionStatus('competencia_territorial', {
    raisedInContestacion: false,
    declinatoriaFiled: true,
    fueroImperativoApplies: false,
  }, ctx);
  const b = computePreclusionStatus('competencia_territorial', {
    raisedInContestacion: false,
    declinatoriaFiled: false,
    fueroImperativoApplies: true,
  }, ctx);
  assert.equal(a.status, 'OK');
  assert.equal(b.status, 'OK');
});

test('competencia objetiva/funcional remains diagnostic ex officio', () => {
  const result = computePreclusionStatus('competencia_objetiva_funcional', {
    raisedInContestacion: false,
    declinatoriaFiled: false,
    fueroImperativoApplies: false,
  }, ctx);
  assert.equal(result.status, 'EX_OFFICIO_ONLY');
});

test('legacy AP snapshot hash remains intact', () => {
  assert.equal(getLegacyTextHash(), EXPECTED_LEGACY_TEXT_HASH);
});

test('canonical legacy source artifacts are present', () => {
  assert.equal(existsSync('public/docs/picassent/legacy/Case Ops -AP_27-02.pdf'), true);
  assert.equal(existsSync('public/docs/picassent/legacy/Guion_sala_formateado_v5_CORRECCIONES.docx'), true);
});

test('forbidden strings do not appear in AP UI and AP snapshot modules', () => {
  const files = [
    'src/features/cases/tabs/TabAudienciaPreviaPicassent.tsx',
    'src/features/cases/tabs/ap/apLegacySnapshot.ts',
    'src/features/cases/tabs/ap/exceptionsCatalog.ts',
  ];
  const source = files.map((file) => readFileSync(file, 'utf8')).join('\n');

  assert.equal(/Ley\s+8\/2021/i.test(source), false);
  assert.equal(/1901\s*CC[\s\S]{0,80}enriquecimiento\s+injusto/i.test(source), false);
  assert.equal(/21\.2\s*LEC[\s\S]{0,80}decreto/i.test(source), false);

  const unsupportedJurisId = /\b(?:STS|SAP|ECLI|ROJ)\b(?!\s*458\/2025)/;
  assert.equal(unsupportedJurisId.test(source), false);
});
