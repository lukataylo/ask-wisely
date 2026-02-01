import { useState, useCallback } from 'react';

const STORAGE_KEY = 'askwisely-copy-counts';

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(counts: Record<string, number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
}

export function useCopyCount() {
  const [counts, setCounts] = useState<Record<string, number>>(load);

  const getCount = useCallback((id: string): number => {
    return counts[id] || 0;
  }, [counts]);

  const increment = useCallback((id: string) => {
    setCounts(prev => {
      const next = { ...prev, [id]: (prev[id] || 0) + 1 };
      save(next);
      return next;
    });
  }, []);

  return { getCount, increment };
}
