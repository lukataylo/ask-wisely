import { useCallback, useEffect } from 'react';
import { Category, MainTab } from '../types';

const TAB_SLUGS: Record<string, MainTab> = {
  'prompts': 'Prompts',
  'image-prompts': 'Image Prompts',
  'skills': 'Skills',
  'eval-lab': 'Eval Lab',
  'blog': 'Blog',
};

const TAB_TO_SLUG: Record<MainTab, string> = {
  'Prompts': 'prompts',
  'Image Prompts': 'image-prompts',
  'Skills': 'skills',
  'Eval Lab': 'eval-lab',
  'Blog': 'blog',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/\s+/g, '-');
}

export function parseURL(categoryMap: Record<MainTab, Category[]>): { tab: MainTab; cat: Category; promptId: string | null; blogSlug: string | null } {
  const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const params = new URLSearchParams(window.location.search);

  // Blog post detail: /blog/some-post-slug
  if (pathname.startsWith('blog/') && pathname.split('/').length === 2) {
    const slug = pathname.split('/')[1];
    return { tab: 'Blog', cat: 'All', promptId: null, blogSlug: slug };
  }

  if (pathname && !pathname.includes('/')) {
    return { tab: 'Prompts', cat: 'All', promptId: pathname, blogSlug: null };
  }

  const tabSlug = params.get('tab');
  const catSlug = params.get('cat');
  const tab: MainTab = (tabSlug && TAB_SLUGS[tabSlug]) || 'Prompts';

  let cat: Category = 'All';
  if (catSlug) {
    const categories = categoryMap[tab];
    const match = categories?.find(c => slugify(c) === catSlug);
    if (match) cat = match;
  }

  return { tab, cat, promptId: null, blogSlug: null };
}

function buildURL(tab: MainTab, cat: Category, promptId: string | null, blogSlug?: string | null): string {
  if (blogSlug) return `/blog/${blogSlug}`;
  if (promptId) return `/${promptId}`;
  const params = new URLSearchParams();
  if (tab !== 'Prompts') params.set('tab', TAB_TO_SLUG[tab]);
  if (cat !== 'All') params.set('cat', slugify(cat));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

export function useUrlState() {
  const updateURL = useCallback((tab: MainTab, cat: Category, promptId: string | null, replace = false, blogSlug?: string | null) => {
    const url = buildURL(tab, cat, promptId, blogSlug);
    if (replace) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  }, []);

  const usePopStateListener = (
    handler: (payload: { tab: MainTab; cat: Category; promptId: string | null; blogSlug: string | null }) => void,
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
