import { useState, useEffect, useCallback } from 'react';
import type { Prompt } from '../types';
import { getAllPrompts } from '../lib/getPrompts';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getAllPrompts(controller.signal)
      .then((data) => {
        setPrompts(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : 'Failed to load prompts');
        setLoading(false);
      });

    return () => controller.abort();
  }, [retryCount]);

  const retry = useCallback(() => {
    setRetryCount(c => c + 1);
  }, []);

  return { prompts, loading, error, retry };
}
