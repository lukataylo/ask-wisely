import { useMemo } from 'react';
import { Category, MainTab, Prompt, Technique } from '../types';

interface Params {
  prompts: Prompt[];
  activeTab: MainTab;
  activeCategory: Category;
  searchQuery: string;
  activeTechniques: Technique[];
  showFavoritesOnly: boolean;
  isFavorite: (id: string) => boolean;
  selectedPrompt: Prompt | null;
  categoryMap: Record<MainTab, Category[]>;
}

export function usePromptFilters({
  prompts,
  activeTab,
  activeCategory,
  searchQuery,
  activeTechniques,
  showFavoritesOnly,
  isFavorite,
  selectedPrompt,
  categoryMap,
}: Params) {
  const tabPrompts = useMemo(
    () => prompts.filter((p) => p.type === activeTab),
    [prompts, activeTab],
  );

  const searchableTextById = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of tabPrompts) {
      map.set(
        p.id,
        [
          p.title,
          p.shortDescription,
          p.fullPrompt,
          p.category,
          ...p.skills,
          ...p.techniques,
          ...(p.variables?.map(v => `${v.name} ${v.placeholder}`) || []),
        ].join(' ').toLowerCase(),
      );
    }
    return map;
  }, [tabPrompts]);

  const filteredPrompts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tabPrompts.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = !q || (searchableTextById.get(p.id)?.includes(q) ?? false);
      const matchesTechniques = activeTechniques.length === 0 ||
        activeTechniques.some(t => p.techniques.includes(t));
      const matchesFavorites = !showFavoritesOnly || isFavorite(p.id);
      return matchesCategory && matchesSearch && matchesTechniques && matchesFavorites;
    });
  }, [activeCategory, searchQuery, activeTechniques, tabPrompts, showFavoritesOnly, isFavorite, searchableTextById]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    for (const cat of categoryMap[activeTab]) {
      if (cat !== 'All') counts[cat] = 0;
    }
    for (const p of tabPrompts) {
      counts.All++;
      counts[p.category]++;
    }
    return counts;
  }, [activeTab, tabPrompts, categoryMap]);

  const relatedPrompts = useMemo(() => {
    if (!selectedPrompt) return [];
    return tabPrompts
      .filter(p =>
        p.id !== selectedPrompt.id && (
          p.category === selectedPrompt.category ||
          p.techniques.some(t => selectedPrompt.techniques.includes(t))
        ),
      )
      .slice(0, 3);
  }, [selectedPrompt, tabPrompts]);

  return { tabPrompts, filteredPrompts, categoryCounts, relatedPrompts };
}
