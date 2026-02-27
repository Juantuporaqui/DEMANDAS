import test from 'node:test';
import assert from 'node:assert/strict';
import { EXPECTED_LEGACY_TEXT_HASH, getLegacyTextHash } from '../../features/cases/tabs/ap/legacyTextHash.ts';

test('Legacy v1 text hash remains byte-for-byte stable', () => {
  assert.equal(
    getLegacyTextHash(),
    EXPECTED_LEGACY_TEXT_HASH,
    'Legacy v1 changed. Restore legacy strings byte-for-byte before merging.',
  );
});
