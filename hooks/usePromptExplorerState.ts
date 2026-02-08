import { useCallback, useState, useTransition } from 'react';
import { Category, MainTab, Prompt, Technique } from '../types';

interface Params {
  initialTab: MainTab;
  initialCategory: Category;
  initialPromptId: string | null;
  updateURL: (tab: MainTab, cat: Category, promptId: string | null) => void;
}

export function usePromptExplorerState({ initialTab, initialCategory, initialPromptId, updateURL }: Params) {
  const [activeTab, setActiveTab] = useState<MainTab>(initialTab);
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [activeTechniques, setActiveTechniques] = useState<Technique[]>([]);
  const [pendingPromptId, setPendingPromptId] = useState<string | null>(initialPromptId);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
  const [isFilterPending, startFilterTransition] = useTransition();

  const handleTabChange = useCallback((tab: MainTab) => {
    setActiveTab(tab);
    setActiveCategory('All');
    setActiveTechniques([]);
    setFocusedCardIndex(null);
    updateURL(tab, 'All', null);
  }, [updateURL]);

  const handleCategoryChange = useCallback((cat: Category) => {
    startFilterTransition(() => {
      setActiveCategory(cat);
      setFocusedCardIndex(null);
      updateURL(activeTab, cat, null);
    });
  }, [activeTab, updateURL]);

  const handleSelectPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setFocusedCardIndex(null);
    updateURL(activeTab, activeCategory, prompt.id);
  }, [activeTab, activeCategory, updateURL]);

  const handleCloseModal = useCallback(() => {
    setSelectedPrompt(null);
    updateURL(activeTab, activeCategory, null);
  }, [activeTab, activeCategory, updateURL]);

  const toggleTechnique = useCallback((technique: Technique) => {
    startFilterTransition(() => {
      setActiveTechniques(prev =>
        prev.includes(technique)
          ? prev.filter(t => t !== technique)
          : [...prev, technique],
      );
    });
  }, []);

  return {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    selectedPrompt,
    setSelectedPrompt,
    activeTechniques,
    setActiveTechniques,
    pendingPromptId,
    setPendingPromptId,
    showFavoritesOnly,
    setShowFavoritesOnly,
    focusedCardIndex,
    setFocusedCardIndex,
    isFilterPending,
    startFilterTransition,
    handleTabChange,
    handleCategoryChange,
    handleSelectPrompt,
    handleCloseModal,
    toggleTechnique,
  };
}
