"use client";

import { useEffect, useEffectEvent, useState } from "react";

export interface QueryState<T> {
  data: T | undefined;
  error: Error | null;
  // True while a fetch for the current key is in flight; previous data stays available.
  loading: boolean;
  refetch: () => void;
}

// Refetches when `key` changes, cancels stale requests, and keeps the previous result while loading.
export function useQuery<T>(
  key: string,
  fetcher: (signal: AbortSignal) => Promise<T>,
  { enabled = true }: { enabled?: boolean } = {},
): QueryState<T> {
  const [tick, setTick] = useState(0);
  const requestId = enabled ? `${key}#${tick}` : "";
  const [resolved, setResolved] = useState<{ id: string; data: T | undefined; error: Error | null }>({
    id: "",
    data: undefined,
    error: null,
  });

  // Reading the (usually inline) fetcher through an effect event keeps the effect keyed on requestId alone.
  const run = useEffectEvent((signal: AbortSignal) => fetcher(signal));

  useEffect(() => {
    if (!requestId) return;
    const controller = new AbortController();
    run(controller.signal)
      .then((data) => setResolved({ id: requestId, data, error: null }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setResolved((prev) => ({ id: requestId, data: prev.data, error: error instanceof Error ? error : new Error(String(error)) }));
      });
    return () => controller.abort();
  }, [requestId]);

  return {
    data: resolved.data,
    error: resolved.id === requestId ? resolved.error : null,
    loading: Boolean(requestId) && resolved.id !== requestId,
    refetch: () => setTick((t) => t + 1),
  };
}
