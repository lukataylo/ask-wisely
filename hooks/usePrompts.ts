import { useState, useEffect, useCallback } from 'react';
import type { Prompt } from '../types';
import { getAllPrompts } from '../lib/getPrompts';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = useCallback(() => {
    setLoading(true);
    setError(null);
    getAllPrompts()
      .then((data) => {
        setPrompts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load prompts');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  return { prompts, loading, error, retry: fetchPrompts };
}
