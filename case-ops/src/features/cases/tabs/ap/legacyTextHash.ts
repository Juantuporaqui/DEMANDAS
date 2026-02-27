import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const LEGACY_FILES = [
  'src/data/PO-715-2024-picassent/audienciaPrevia.picassent.ts',
  'src/features/cases/tabs/ap/apLegacySnapshot.ts',
];

export function getLegacyTextHash() {
  const hash = createHash('sha256');
  for (const file of LEGACY_FILES) {
    hash.update(readFileSync(file, 'utf8'));
  }
  return hash.digest('hex');
}

export const EXPECTED_LEGACY_TEXT_HASH = '917414308ca678ae9ab4d6e58a115205834d106d8beab97ff63a3fc9711b5286';
