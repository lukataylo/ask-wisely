
import React, { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { Moon, Sun, Heart, Shuffle, ArrowDown, RotateCcw, Mail } from 'lucide-react';
import { OwlLogo } from './components/OwlLogo';
import { Category, Prompt, MainTab, Technique } from './types';
import { usePrompts } from './hooks/usePrompts';
import { useFavorites } from './hooks/useFavorites';
import { useDarkMode } from './hooks/useDarkMode';
import { useCopyCount } from './hooks/useCopyCount';
import { parseURL, useUrlState } from './hooks/useUrlState';
import { usePromptFilters } from './hooks/usePromptFilters';
import { usePromptKeyboardNav } from './hooks/usePromptKeyboardNav';
import { copyText } from './lib/copyText';
import PromptGrid from './components/PromptGrid';
import FilterControls from './components/FilterControls';
import PromptModal from './components/PromptModal';
import IconButton from './components/ui/IconButton';

const MAIN_TABS: MainTab[] = ['Prompts', 'Image Prompts', 'Skills'];

const CATEGORY_MAP: Record<MainTab, Category[]> = {
  'Prompts': ['All', 'Creative', 'Technical', 'Business', 'Academic', 'Persona', 'Product', 'Data', 'Marketing', 'Personal', 'Legal', 'Education', 'Healthcare'],
  'Image Prompts': ['All', 'Cinematic', 'Portrait', 'Stylized', 'Architecture', 'Commercial', 'Interface'],
  'Skills': ['All', 'Engineering', 'Writing', 'Strategy', 'Design', 'Communication', 'AI Literacy']
};

const ALL_TECHNIQUES: Technique[] = [
  'Role Assignment', 'Structured Output', 'Constraint-Based',
  'Chain-of-Thought', 'Few-Shot', 'Self-Verification',
  'Socratic Method', 'Meta-Cognitive',
];

const BTN_OUTLINE = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all';

const DEFAULT_TITLE = 'Ask Wisely — Curated AI Prompt Library for Creative, Technical & Visual Prompts';

const App: React.FC = () => {
  const { prompts: PROMPTS, loading, error, retry } = usePrompts();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { favorites, toggleFavorite, isFavorite, count: favCount } = useFavorites();
  const { counts: copyCounts, increment: incrementCopy } = useCopyCount();
  const searchRef = useRef<HTMLInputElement>(null);
  const { updateURL, usePopStateListener, resolvePromptFromId } = useUrlState();

  // Initialize state from URL
  const initial = parseURL(CATEGORY_MAP);
  const [activeTab, setActiveTab] = useState<MainTab>(initial.tab);
  const [activeCategory, setActiveCategory] = useState<Category>(initial.cat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [activeTechniques, setActiveTechniques] = useState<Technique[]>([]);
  const [pendingPromptId, setPendingPromptId] = useState<string | null>(initial.promptId);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
  const [isFilterPending, startFilterTransition] = useTransition();

  // Once prompts load, resolve pending prompt ID from URL
  useEffect(() => {
    if (!loading && PROMPTS.length > 0 && pendingPromptId) {
      const found = resolvePromptFromId(PROMPTS, pendingPromptId);
      if (found) {
        setSelectedPrompt(found);
        setActiveTab(found.type);
      }
      setPendingPromptId(null);
    }
  }, [loading, PROMPTS, pendingPromptId, resolvePromptFromId]);


  // Update document title
  useEffect(() => {
    if (selectedPrompt) {
      document.title = `${selectedPrompt.title} — Ask Wisely`;
    } else if (activeTab !== 'Prompts') {
      document.title = `${activeTab} — Ask Wisely`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [selectedPrompt, activeTab]);

  usePopStateListener(({ tab, cat, promptId }) => {
    setActiveTab(tab);
    setActiveCategory(cat);
    setActiveTechniques([]);
    setSelectedPrompt(resolvePromptFromId(PROMPTS, promptId));
  }, CATEGORY_MAP);

  const toggleTechnique = (technique: Technique) => {
    startFilterTransition(() => {
      setActiveTechniques(prev =>
        prev.includes(technique)
          ? prev.filter(t => t !== technique)
          : [...prev, technique]
      );
    });
  };

  const { tabPrompts, filteredPrompts, categoryCounts, relatedPrompts } = usePromptFilters({
    prompts: PROMPTS,
    activeTab,
    activeCategory,
    searchQuery,
    activeTechniques,
    showFavoritesOnly,
    isFavorite,
    selectedPrompt,
    categoryMap: CATEGORY_MAP,
  });

  // Reset category and techniques when tab changes
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveCategory('All');
    setActiveTechniques([]);
    setFocusedCardIndex(null);
    updateURL(tab, 'All', null);
  };

  const handleCategoryChange = (cat: Category) => {
    startFilterTransition(() => {
      setActiveCategory(cat);
      setFocusedCardIndex(null);
      updateURL(activeTab, cat, null);
    });
  };

  const handleSelectPrompt = useCallback((prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setFocusedCardIndex(null);
    updateURL(activeTab, activeCategory, prompt.id);
  }, [activeTab, activeCategory, updateURL]);

  const handleCloseModal = useCallback(() => {
    setSelectedPrompt(null);
    updateURL(activeTab, activeCategory, null);
  }, [activeTab, activeCategory, updateURL]);

  const handleSurpriseMe = () => {
    if (tabPrompts.length === 0) return;
    const random = tabPrompts[Math.floor(Math.random() * tabPrompts.length)];
    handleSelectPrompt(random);
  };

  const handleCopyPrompt = useCallback((prompt: Prompt) => {
    copyText(prompt.fullPrompt).then((ok) => {
      if (ok) incrementCopy(prompt.id);
    });
  }, [incrementCopy]);

  usePromptKeyboardNav({
    selectedPrompt,
    filteredPrompts,
    focusedCardIndex,
    setFocusedCardIndex,
    onSelectPrompt: handleSelectPrompt,
    onCopyPrompt: handleCopyPrompt,
    searchRef,
  });

  // Keep keyboard focus stable when filtered list changes
  useEffect(() => {
    setFocusedCardIndex(prev => {
      if (prev === null) return null;
      if (filteredPrompts.length === 0) return null;
      return Math.min(prev, filteredPrompts.length - 1);
    });
  }, [filteredPrompts.length]);

  const tabPromptCount = categoryCounts['All'] || 0;

  return (
    <div className="min-h-screen selection:bg-stone-200 dark:selection:bg-stone-700 selection:text-stone-900 dark:selection:text-stone-100 animated-bg">

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[var(--bg-nav)] backdrop-blur-md border-b border-stone-200/50 dark:border-stone-800/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            className="serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100 cursor-pointer flex items-center gap-2 appearance-none bg-transparent border-none p-0 animate-fade-in shrink-0"
            onClick={() => {
              handleTabChange('Prompts');
              setSearchQuery('');
              setShowFavoritesOnly(false);
            }}
          >
            <OwlLogo size={24} className="text-stone-400" />
            <span className="hidden sm:inline">Ask Wisely</span><span className="text-stone-400 font-light hidden sm:inline">.</span>
          </button>

          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-full border border-stone-200 dark:border-stone-700 overflow-x-auto scrollbar-hide">
            {MAIN_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`shrink-0 px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm border border-stone-200 dark:border-stone-600'
                    : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <IconButton
              onClick={() => startFilterTransition(() => setShowFavoritesOnly(prev => !prev))}
              label="Toggle favorites"
              active={showFavoritesOnly}
              aria-pressed={showFavoritesOnly}
              className="relative"
            >
              <Heart size={18} className={showFavoritesOnly ? 'fill-red-500' : ''} />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[8px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </IconButton>
            <IconButton
              onClick={toggleDarkMode}
              label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* Hero Section */}
        <header className="max-w-3xl mb-16">
          <h1
            key={activeTab}
            className="serif text-6xl md:text-7xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-6 animate-fade-in-up"
          >
            {activeTab === 'Prompts' && <>The Art of <span className="italic text-stone-500 dark:text-stone-400">Inquiry</span></>}
            {activeTab === 'Image Prompts' && <>The Art of <span className="italic text-stone-500 dark:text-stone-400">Vision</span></>}
            {activeTab === 'Skills' && <>The Art of <span className="italic text-stone-500 dark:text-stone-400">Mastery</span></>}
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl leading-relaxed font-light animate-fade-in-slow mb-6">
            {activeTab === 'Prompts' && (
              !loading && tabPromptCount > 0
                ? `A collection of ${tabPromptCount} sophisticated text prompts for complex reasoning and creative storytelling.`
                : "A collection of sophisticated text prompts for complex reasoning and creative storytelling."
            )}
            {activeTab === 'Image Prompts' && (
              !loading && tabPromptCount > 0
                ? `Browse ${tabPromptCount} precision visual parameters for high-end generative art and cinematic world-building.`
                : "Precision visual parameters for high-end generative art and cinematic world-building."
            )}
            {activeTab === 'Skills' && (
              !loading && tabPromptCount > 0
                ? `Explore ${tabPromptCount} foundational blueprints and methodologies for becoming a power user of digital intelligence.`
                : "Foundational blueprints and methodologies for becoming a power user of digital intelligence."
            )}
          </p>
          {!loading && PROMPTS.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleSurpriseMe}
                className={BTN_OUTLINE}
              >
                <Shuffle size={14} />
                Surprise Me
              </button>
              <button
                onClick={() => {
                  searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => searchRef.current?.focus(), 400);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-all"
              >
                Browse Collection
                <ArrowDown size={14} />
              </button>
            </div>
          )}
        </header>

        {/* Search and Filters */}
        <FilterControls
          activeTab={activeTab}
          activeCategory={activeCategory}
          categoryMap={CATEGORY_MAP}
          categoryCounts={categoryCounts}
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={(q) => startFilterTransition(() => setSearchQuery(q))}
          searchRef={searchRef}
          allTechniques={ALL_TECHNIQUES}
          activeTechniques={activeTechniques}
          toggleTechnique={toggleTechnique}
          setActiveTechniques={setActiveTechniques}
          showFavoritesOnly={showFavoritesOnly}
          setShowFavoritesOnly={setShowFavoritesOnly}
          onCategoryChange={handleCategoryChange}
        />

        {isFilterPending && !loading && (
          <div className="text-[11px] uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4">
            Updating results...
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-12 animate-fade-in-fast" aria-busy="true" aria-live="polite">
            <div className="serif text-3xl text-stone-300 dark:text-stone-600 mb-8 text-center">Loading prompts...</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[24px] border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 p-8 shadow-sm"
                  aria-hidden="true"
                >
                  <div className="h-5 w-20 rounded-full bg-stone-200/70 dark:bg-stone-700/70 mb-6 animate-pulse" />
                  <div className="h-7 w-3/4 rounded bg-stone-200/70 dark:bg-stone-700/70 mb-3 animate-pulse" />
                  <div className="h-4 w-full rounded bg-stone-200/60 dark:bg-stone-700/60 mb-2 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-stone-200/60 dark:bg-stone-700/60 mb-6 animate-pulse" />
                  <div className="flex gap-2 mb-6">
                    <div className="h-5 w-16 rounded bg-stone-200/60 dark:bg-stone-700/60 animate-pulse" />
                    <div className="h-5 w-20 rounded bg-stone-200/60 dark:bg-stone-700/60 animate-pulse" />
                  </div>
                  <div className="h-px w-full bg-stone-200/70 dark:bg-stone-700/70 mb-4" />
                  <div className="h-4 w-24 rounded bg-stone-200/60 dark:bg-stone-700/60 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-32 text-center animate-fade-in-fast">
            <div className="serif text-3xl text-stone-300 dark:text-stone-600 mb-2">Failed to load prompts</div>
            <p className="text-stone-400 dark:text-stone-500 mb-6">{error}</p>
            <button
              onClick={retry}
              className={BTN_OUTLINE}
            >
              <RotateCcw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Screen reader announcement for filter results */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {!loading && !error && `${filteredPrompts.length} ${activeTab.toLowerCase()} found`}
        </div>

        {/* Grid */}
        {!loading && !error && (
          <PromptGrid
            prompts={filteredPrompts}
            focusedCardIndex={focusedCardIndex}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onPreview={handleSelectPrompt}
            copyCounts={copyCounts}
            onIncrementCopy={incrementCopy}
          />
        )}

        {/* Empty State */}
        {!loading && !error && filteredPrompts.length === 0 && (
          <div className="py-32 text-center animate-fade-in-fast">
            <div className="serif text-3xl text-stone-300 dark:text-stone-600 mb-2">
              {showFavoritesOnly ? 'No favorites yet' : `No ${activeTab.toLowerCase()} found`}
            </div>
            <p className="text-stone-400 dark:text-stone-500 mb-6">
              {showFavoritesOnly
                ? 'Save prompts you love by clicking the heart icon.'
                : 'Try adjusting your filters or search terms.'}
            </p>
            {!showFavoritesOnly && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                  setActiveTechniques([]);
                }}
                className={BTN_OUTLINE}
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            )}
          </div>
        )}
      </main>

      <PromptModal
        prompt={selectedPrompt}
        onClose={handleCloseModal}
        relatedPrompts={relatedPrompts}
        onSelectPrompt={handleSelectPrompt}
        isFavorite={selectedPrompt ? isFavorite(selectedPrompt.id) : false}
        onToggleFavorite={() => {
          if (selectedPrompt) toggleFavorite(selectedPrompt.id);
        }}
        copyCount={selectedPrompt ? (copyCounts[selectedPrompt.id] || 0) : 0}
        onIncrementCopy={incrementCopy}
      />

      {/* Subscribe Section */}
      <section className="relative overflow-hidden border-t border-stone-200 dark:border-stone-800">
        <div className="subscribe-glow absolute inset-0 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="subscribe-icon-ring w-16 h-16 rounded-full flex items-center justify-center mb-8">
            <Mail size={24} className="text-stone-600 dark:text-stone-300" />
          </div>
          <h2 className="serif text-4xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-4">
            Stay <span className="italic text-stone-500 dark:text-stone-400">Curious</span>
          </h2>
          <p className="text-stone-500 dark:text-stone-400 text-lg font-light max-w-md mb-10 leading-relaxed">
            New prompts, techniques, and ideas delivered to your inbox. No noise, just signal.
          </p>
          <a
            href="https://askwisely.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="group subscribe-btn relative inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-3">
              <Mail size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
              Subscribe
            </span>
          </a>
          <p className="mt-6 text-[11px] text-stone-400 dark:text-stone-600 tracking-wide">Free forever. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-16 px-6 bg-stone-50/50 dark:bg-stone-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="serif text-xl font-bold text-stone-400 flex items-center gap-2">
            <OwlLogo size={20} />
            Ask Wisely.
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <a href="https://github.com/lukataylo/ask-wisely" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">GitHub</a>
            <a href="/prompts.json" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">API</a>
            <a href="https://github.com/lukataylo/ask-wisely/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors">Contribute</a>
          </div>
          <div className="text-[10px] text-stone-400 dark:text-stone-500 italic tracking-wider">Curated by Architects of Intelligence.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
