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

export const EXPECTED_LEGACY_TEXT_HASH = 'e33746101c35bad51826a4e595b470623a8ec2009b984b79b0391b6fe8a98d30';
