import { useState, useEffect } from 'react';

const STORAGE_KEY = 'askwisely-theme';

export function useDarkMode() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) return stored === 'dark';
    } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {}
    // Update theme-color meta tag
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0c0a09' : '#fdfbf7');
    // Set favicon
    document.getElementById('favicon')?.setAttribute('href', '/images/favion.svg');
    document.getElementById('apple-touch-icon')?.setAttribute('href', '/images/favion.svg');
  }, [isDark]);

  const toggle = () => setIsDark(prev => !prev);

  return { isDark, toggle };
}
