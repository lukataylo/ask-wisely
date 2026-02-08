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
  const filteredPrompts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return prompts.filter(p => {
      const matchesTab = p.type === activeTab;
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const searchableText = [
        p.title,
        p.shortDescription,
        p.fullPrompt,
        p.category,
        ...p.skills,
        ...p.techniques,
        ...(p.variables?.map(v => `${v.name} ${v.placeholder}`) || []),
      ].join(' ').toLowerCase();
      const matchesSearch = !q || searchableText.includes(q);
      const matchesTechniques = activeTechniques.length === 0 ||
        activeTechniques.some(t => p.techniques.includes(t));
      const matchesFavorites = !showFavoritesOnly || isFavorite(p.id);
      return matchesTab && matchesCategory && matchesSearch && matchesTechniques && matchesFavorites;
    });
  }, [activeTab, activeCategory, searchQuery, activeTechniques, prompts, showFavoritesOnly, isFavorite]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    for (const cat of categoryMap[activeTab]) {
      if (cat !== 'All') counts[cat] = 0;
    }
    for (const p of prompts) {
      if (p.type !== activeTab) continue;
      counts.All++;
      counts[p.category]++;
    }
    return counts;
  }, [activeTab, prompts, categoryMap]);

  const relatedPrompts = useMemo(() => {
    if (!selectedPrompt) return [];
    return prompts
      .filter(p =>
        p.id !== selectedPrompt.id && (
          p.category === selectedPrompt.category ||
          p.techniques.some(t => selectedPrompt.techniques.includes(t))
        ),
      )
      .slice(0, 3);
  }, [selectedPrompt, prompts]);

  return { filteredPrompts, categoryCounts, relatedPrompts };
}
