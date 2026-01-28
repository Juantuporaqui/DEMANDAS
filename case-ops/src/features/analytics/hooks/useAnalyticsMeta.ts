import { useCallback, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/schema';
import type { AnalyticsMeta } from '../../../types';
import { DEFAULT_ANALYTICS_META } from '../utils/analytics';

function mergeAnalyticsMeta(existing: AnalyticsMeta): AnalyticsMeta {
  return {
    ...DEFAULT_ANALYTICS_META,
    ...existing,
    lineaTemporal: existing.lineaTemporal ?? DEFAULT_ANALYTICS_META.lineaTemporal,
    courts: existing.courts ?? DEFAULT_ANALYTICS_META.courts,
    prescripcion: {
      ...DEFAULT_ANALYTICS_META.prescripcion,
      ...existing.prescripcion,
    },
    pendientes: existing.pendientes ?? DEFAULT_ANALYTICS_META.pendientes,
  };
}

export function useAnalyticsMeta() {
  const meta = useLiveQuery(async () => db.analytics_meta.get('global'), []);
  const seededRef = useRef(false);

  useEffect(() => {
    if (meta === undefined) return;

    const seedIfMissing = async () => {
      if (meta) {
        const merged = mergeAnalyticsMeta(meta);
        if (JSON.stringify(merged) !== JSON.stringify(meta)) {
          await db.analytics_meta.put({
            ...merged,
            updatedAt: new Date().toISOString(),
          });
        }
        return;
      }

      if (seededRef.current) return;
      seededRef.current = true;
      const fresh: AnalyticsMeta = {
        ...DEFAULT_ANALYTICS_META,
        updatedAt: new Date().toISOString(),
      };
      await db.analytics_meta.put(fresh);
    };

    void seedIfMissing();
  }, [meta]);

  const saveMeta = useCallback(async (next: AnalyticsMeta) => {
    const payload = {
      ...next,
      id: 'global',
      updatedAt: new Date().toISOString(),
    };
    await db.analytics_meta.put(payload);
  }, []);

  return { meta, saveMeta };
}
