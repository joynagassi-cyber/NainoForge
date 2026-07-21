// packages/extension/src/hooks/use-sources.ts
import { useState, useEffect, useCallback } from 'react';
import { engineBridge } from '../lib/engine-bridge.js';
import type { DCM } from '@nainoforge/shared';

export function useSources() {
  const [sources, setSources] = useState<DCM[]>(() => engineBridge.getSources());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load already done via lazy useState initializer above.
    setLoading(false);

    // Subscribe to new sources
    const unsub = engineBridge.subscribe('source:captured', (data) => {
      setSources((prev) => [...prev, data as DCM]);
    });

    return unsub;
  }, []);

  const refresh = useCallback(() => {
    setSources(engineBridge.getSources());
  }, []);

  return { sources, loading, refresh };
}
