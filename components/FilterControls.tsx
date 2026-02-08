import React from 'react';
import { Search, RotateCcw, X } from 'lucide-react';
import { Category, MainTab, Technique } from '../types';
import PillButton from './ui/PillButton';

interface FilterControlsProps {
  activeTab: MainTab;
  activeCategory: Category;
  categoryMap: Record<MainTab, Category[]>;
  categoryCounts: Record<string, number>;
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchRef: React.RefObject<HTMLInputElement | null>;
  allTechniques: Technique[];
  activeTechniques: Technique[];
  toggleTechnique: (technique: Technique) => void;
  setActiveTechniques: React.Dispatch<React.SetStateAction<Technique[]>>;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: React.Dispatch<React.SetStateAction<boolean>>;
  onCategoryChange: (cat: Category) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  activeTab,
  activeCategory,
  categoryMap,
  categoryCounts,
  loading,
  searchQuery,
  setSearchQuery,
  searchRef,
  allTechniques,
  activeTechniques,
  toggleTechnique,
  setActiveTechniques,
  showFavoritesOnly,
  setShowFavoritesOnly,
  onCategoryChange,
}) => {
  const hasAnyFilter = !!searchQuery || activeCategory !== 'All' || activeTechniques.length > 0 || showFavoritesOnly;

  return (
    <section className="mb-12 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-stone-200/50 dark:border-stone-700/50 pb-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categoryMap[activeTab].map((cat) => (
            <PillButton
              key={cat}
              onClick={() => onCategoryChange(cat)}
              active={activeCategory === cat}
              className={activeCategory === cat ? '' : 'border-stone-100 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-500'}
            >
              {cat}
              {!loading && categoryCounts[cat] !== undefined && (
                <span className={`ml-1.5 ${
                  activeCategory === cat
                    ? 'text-white/60 dark:text-stone-900/60'
                    : 'text-stone-300 dark:text-stone-600'
                }`}>
                  {categoryCounts[cat]}
                </span>
              )}
            </PillButton>
          ))}
        </div>

        <div className="relative group min-w-0 w-full md:min-w-[300px] md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 dark:text-stone-600 group-focus-within:text-stone-900 dark:group-focus-within:text-stone-300 transition-colors" size={18} />
          <input
            ref={searchRef}
            type="text"
            placeholder={`Search ${activeTab.toLowerCase()}... (press /)`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full py-3 pl-12 pr-6 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-4 focus:ring-stone-900/5 dark:focus:ring-stone-100/5 focus:border-stone-900 dark:focus:border-stone-400 transition-all shadow-sm placeholder:text-stone-400 dark:placeholder:text-stone-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
        {allTechniques.map((technique) => (
          <PillButton
            key={technique}
            onClick={() => toggleTechnique(technique)}
            active={activeTechniques.includes(technique)}
            compact
            className={activeTechniques.includes(technique)
              ? 'bg-stone-800 dark:bg-stone-200 border-stone-800 dark:border-stone-200'
              : ''}
          >
            {technique}
          </PillButton>
        ))}
        {activeTechniques.length > 0 && (
          <button
            onClick={() => setActiveTechniques([])}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
          >
            <X size={12} />
            Clear
          </button>
        )}

        {hasAnyFilter && (
          <button
            onClick={() => {
              setSearchQuery('');
              onCategoryChange('All');
              setActiveTechniques([]);
              setShowFavoritesOnly(false);
            }}
            className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
          >
            <RotateCcw size={12} />
            Reset All
          </button>
        )}
      </div>
    </section>
  );
};

export default React.memo(FilterControls);
