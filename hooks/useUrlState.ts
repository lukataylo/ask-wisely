import { useCallback, useEffect } from 'react';
import { Category, MainTab } from '../types';

const TAB_SLUGS: Record<string, MainTab> = {
  'prompts': 'Prompts',
  'image-prompts': 'Image Prompts',
  'skills': 'Skills',
};

const TAB_TO_SLUG: Record<MainTab, string> = {
  'Prompts': 'prompts',
  'Image Prompts': 'image-prompts',
  'Skills': 'skills',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '-');
}

export function parseURL(categoryMap: Record<MainTab, Category[]>): { tab: MainTab; cat: Category; promptId: string | null } {
  const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const params = new URLSearchParams(window.location.search);

  if (pathname && !pathname.includes('/')) {
    return { tab: 'Prompts', cat: 'All', promptId: pathname };
  }

  const tabSlug = params.get('tab');
  const catSlug = params.get('cat');
  const tab: MainTab = (tabSlug && TAB_SLUGS[tabSlug]) || 'Prompts';

  let cat: Category = 'All';
  if (catSlug) {
    const categories = categoryMap[tab];
    const match = categories.find(c => slugify(c) === catSlug);
    if (match) cat = match;
  }

  return { tab, cat, promptId: null };
}

function buildURL(tab: MainTab, cat: Category, promptId: string | null): string {
  if (promptId) return `/${promptId}`;
  const params = new URLSearchParams();
  if (tab !== 'Prompts') params.set('tab', TAB_TO_SLUG[tab]);
  if (cat !== 'All') params.set('cat', slugify(cat));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export function useUrlState() {
  const updateURL = useCallback((tab: MainTab, cat: Category, promptId: string | null, replace = false) => {
    const url = buildURL(tab, cat, promptId);
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  }, []);

  const usePopStateListener = (
    handler: (payload: { tab: MainTab; cat: Category; promptId: string | null }) => void,
    categoryMap: Record<MainTab, Category[]>,
  ) => {
    useEffect(() => {
      const onPopState = () => handler(parseURL(categoryMap));
      window.addEventListener('popstate', onPopState);
      return () => window.removeEventListener('popstate', onPopState);
    }, [handler, categoryMap]);
  };

  return { updateURL, usePopStateListener };
}
