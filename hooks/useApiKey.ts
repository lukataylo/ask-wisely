import { useCallback, useState } from 'react';
import { DEFAULT_MODEL } from '../lib/eval/anthropic';

const KEY_STORAGE = 'askwisely-anthropic-key';
const MODEL_STORAGE = 'askwisely-eval-model';
const SESSION_ONLY_STORAGE = 'askwisely-key-session-only';

// The visitor's Anthropic API key. Stored locally (localStorage or, if the
// visitor prefers, sessionStorage) and only ever sent to api.anthropic.com.
export function useApiKey() {
  const [sessionOnly, setSessionOnlyState] = useState<boolean>(() => {
    try { return localStorage.getItem(SESSION_ONLY_STORAGE) === '1'; } catch { return false; }
  });
  const [apiKey, setApiKeyState] = useState<string>(() => {
    try {
      return sessionStorage.getItem(KEY_STORAGE) || localStorage.getItem(KEY_STORAGE) || '';
    } catch { return ''; }
  });
  const [model, setModelState] = useState<string>(() => {
    try { return localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL; } catch { return DEFAULT_MODEL; }
  });

  const setApiKey = useCallback((key: string, opts?: { sessionOnly?: boolean }) => {
    const useSession = opts?.sessionOnly ?? sessionOnly;
    setApiKeyState(key);
    setSessionOnlyState(useSession);
    try {
      localStorage.setItem(SESSION_ONLY_STORAGE, useSession ? '1' : '0');
      if (!key) {
        localStorage.removeItem(KEY_STORAGE);
        sessionStorage.removeItem(KEY_STORAGE);
      } else if (useSession) {
        sessionStorage.setItem(KEY_STORAGE, key);
        localStorage.removeItem(KEY_STORAGE);
      } else {
        localStorage.setItem(KEY_STORAGE, key);
        sessionStorage.removeItem(KEY_STORAGE);
      }
    } catch { /* storage unavailable (private mode) — key stays in memory */ }
  }, [sessionOnly]);

  const clearApiKey = useCallback(() => setApiKey(''), [setApiKey]);

  const setModel = useCallback((m: string) => {
    setModelState(m);
    try { localStorage.setItem(MODEL_STORAGE, m); } catch { /* in-memory only */ }
  }, []);

  return { apiKey, setApiKey, clearApiKey, model, setModel, sessionOnly };
}
