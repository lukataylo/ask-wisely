import { useState, useCallback } from 'react';

const STORAGE_KEY = 'askwisely-copy-counts';

function load(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, number] => (
        typeof entry[0] === 'string' && typeof entry[1] === 'number' && Number.isFinite(entry[1])
      ))
    );
  } catch {
    return {};
  }
}

function save(counts: Record<string, number>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Copy counts are non-critical analytics; ignore quota/private-mode failures.
  }
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

  return { counts, getCount, increment };
}
