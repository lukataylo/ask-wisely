
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, X, Moon, Sun, Heart, Shuffle, ArrowDown, RotateCcw, Mail } from 'lucide-react';
import { OwlLogo } from './components/OwlLogo';
import { Category, Prompt, MainTab, Technique, Difficulty } from './types';
import { usePrompts } from './hooks/usePrompts';
import { useFavorites } from './hooks/useFavorites';
import { useDarkMode } from './hooks/useDarkMode';
import PromptCard from './components/PromptCard';
import PromptModal from './components/PromptModal';
import AnimatedBackground from './components/AnimatedBackground';

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

const ALL_DIFFICULTIES: Difficulty[] = ['Beginner', 'Intermediate', 'Advanced'];

const DIFFICULTY_COLORS: Record<Difficulty, { active: string; inactive: string }> = {
  Beginner: {
    active: 'bg-emerald-700 dark:bg-emerald-400 text-white dark:text-stone-900 border-emerald-700 dark:border-emerald-400',
    inactive: 'bg-white dark:bg-stone-800 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600',
  },
  Intermediate: {
    active: 'bg-amber-700 dark:bg-amber-400 text-white dark:text-stone-900 border-amber-700 dark:border-amber-400',
    inactive: 'bg-white dark:bg-stone-800 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600',
  },
  Advanced: {
    active: 'bg-rose-700 dark:bg-rose-400 text-white dark:text-stone-900 border-rose-700 dark:border-rose-400',
    inactive: 'bg-white dark:bg-stone-800 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:border-rose-400 dark:hover:border-rose-600',
  },
};

// --- URL Routing helpers ---
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

function parseURL(): { tab: MainTab; cat: Category; promptId: string | null } {
  const pathname = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const params = new URLSearchParams(window.location.search);

  // A non-empty single-segment path is a prompt slug: /the-devils-advocate
  if (pathname && !pathname.includes('/')) {
    return { tab: 'Prompts', cat: 'All', promptId: pathname };
  }

  // Otherwise read tab/cat from query params
  const tabSlug = params.get('tab');
  const catSlug = params.get('cat');

  const tab: MainTab = (tabSlug && TAB_SLUGS[tabSlug]) || 'Prompts';

  let cat: Category = 'All';
  if (catSlug) {
    const categories = CATEGORY_MAP[tab];
    const match = categories.find(c => slugify(c) === catSlug);
    if (match) cat = match;
  }

  return { tab, cat, promptId: null };
}

function buildURL(tab: MainTab, cat: Category, promptId: string | null): string {
  if (promptId) {
    return `/${promptId}`;
  }
  const params = new URLSearchParams();
  if (tab !== 'Prompts') params.set('tab', TAB_TO_SLUG[tab]);
  if (cat !== 'All') params.set('cat', slugify(cat));
  const qs = params.toString();
  return qs ? `/?${qs}` : '/';
}

const DEFAULT_TITLE = 'Ask Wisely — Curated AI Prompt Library for Creative, Technical & Visual Prompts';

const App: React.FC = () => {
  const { prompts: PROMPTS, loading, error, retry } = usePrompts();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { favorites, toggleFavorite, isFavorite, count: favCount } = useFavorites();
  const searchRef = useRef<HTMLInputElement>(null);

  // Initialize state from URL
  const initial = parseURL();
  const [activeTab, setActiveTab] = useState<MainTab>(initial.tab);
  const [activeCategory, setActiveCategory] = useState<Category>(initial.cat);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [activeTechniques, setActiveTechniques] = useState<Technique[]>([]);
  const [pendingPromptId, setPendingPromptId] = useState<string | null>(initial.promptId);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null);
  const [activeDifficulties, setActiveDifficulties] = useState<Difficulty[]>([]);

  // Once prompts load, resolve pending prompt ID from URL
  useEffect(() => {
    if (!loading && PROMPTS.length > 0 && pendingPromptId) {
      const found = PROMPTS.find(p => p.id === pendingPromptId);
      if (found) {
        setSelectedPrompt(found);
        setActiveTab(found.type);
      }
      setPendingPromptId(null);
    }
  }, [loading, PROMPTS, pendingPromptId]);

  // Sync state → URL
  const updateURL = useCallback((tab: MainTab, cat: Category, promptId: string | null, replace = false) => {
    const url = buildURL(tab, cat, promptId);
    if (replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }
  }, []);

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

  // Listen for popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const { tab, cat, promptId } = parseURL();
      setActiveTab(tab);
      setActiveCategory(cat);
      setActiveTechniques([]);
      setActiveDifficulties([]);
      if (promptId && PROMPTS.length > 0) {
        const found = PROMPTS.find(p => p.id === promptId);
        setSelectedPrompt(found || null);
      } else {
        setSelectedPrompt(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [PROMPTS]);

  const toggleTechnique = (technique: Technique) => {
    setActiveTechniques(prev =>
      prev.includes(technique)
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
    );
  };

  const toggleDifficulty = (d: Difficulty) => {
    setActiveDifficulties(prev =>
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter(p => {
      const matchesTab = p.type === activeTab;
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTechniques = activeTechniques.length === 0 ||
                               activeTechniques.some(t => p.techniques.includes(t));
      const matchesFavorites = !showFavoritesOnly || isFavorite(p.id);
      const matchesDifficulty = activeDifficulties.length === 0 ||
                                (p.difficulty && activeDifficulties.includes(p.difficulty));
      return matchesTab && matchesCategory && matchesSearch && matchesTechniques && matchesFavorites && matchesDifficulty;
    });
  }, [activeTab, activeCategory, searchQuery, activeTechniques, PROMPTS, showFavoritesOnly, isFavorite, activeDifficulties]);

  const tabPromptCount = useMemo(() =>
    PROMPTS.filter(p => p.type === activeTab).length
  , [activeTab, PROMPTS]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const tabPrompts = PROMPTS.filter(p => p.type === activeTab);
    counts['All'] = tabPrompts.length;
    for (const cat of CATEGORY_MAP[activeTab]) {
      if (cat === 'All') continue;
      counts[cat] = tabPrompts.filter(p => p.category === cat).length;
    }
    return counts;
  }, [activeTab, PROMPTS]);

  const relatedPrompts = useMemo(() => {
    if (!selectedPrompt) return [];
    return PROMPTS
      .filter(p =>
        p.id !== selectedPrompt.id && (
          p.category === selectedPrompt.category ||
          p.techniques.some(t => selectedPrompt.techniques.includes(t))
        )
      )
      .slice(0, 3);
  }, [selectedPrompt, PROMPTS]);

  // Reset category and techniques when tab changes
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveCategory('All');
    setActiveTechniques([]);
    setActiveDifficulties([]);
    setFocusedCardIndex(null);
    updateURL(tab, 'All', null);
  };

  const handleCategoryChange = (cat: Category) => {
    setActiveCategory(cat);
    setFocusedCardIndex(null);
    updateURL(activeTab, cat, null);
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
    const tabPrompts = PROMPTS.filter(p => p.type === activeTab);
    if (tabPrompts.length === 0) return;
    const random = tabPrompts[Math.floor(Math.random() * tabPrompts.length)];
    handleSelectPrompt(random);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // "/" focuses search (unless already in an input)
      if (e.key === '/' && !inInput && !selectedPrompt) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Escape: blur search or close modal
      if (e.key === 'Escape') {
        if (document.activeElement === searchRef.current) {
          searchRef.current?.blur();
          setSearchQuery('');
          return;
        }
        // Modal escape is handled in PromptModal
        return;
      }

      // Card navigation only when not in input and no modal
      if (inInput || selectedPrompt) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedCardIndex(prev => {
          const next = prev === null ? 0 : Math.min(prev + 1, filteredPrompts.length - 1);
          scrollCardIntoView(next);
          return next;
        });
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedCardIndex(prev => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0);
          scrollCardIntoView(next);
          return next;
        });
      } else if (e.key === 'Enter' && focusedCardIndex !== null) {
        e.preventDefault();
        const prompt = filteredPrompts[focusedCardIndex];
        if (prompt) handleSelectPrompt(prompt);
      } else if (e.key === 'c' && focusedCardIndex !== null) {
        e.preventDefault();
        const prompt = filteredPrompts[focusedCardIndex];
        if (prompt) navigator.clipboard.writeText(prompt.fullPrompt);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPrompt, filteredPrompts, focusedCardIndex, handleSelectPrompt]);

  // Reset focused card when filters change
  useEffect(() => {
    setFocusedCardIndex(null);
  }, [activeTab, activeCategory, searchQuery, activeTechniques, activeDifficulties]);

  return (
    <div className="min-h-screen selection:bg-stone-200 dark:selection:bg-stone-700 selection:text-stone-900 dark:selection:text-stone-100">
      <AnimatedBackground />

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
            <button
              onClick={() => setShowFavoritesOnly(prev => !prev)}
              className={`p-2 rounded-full transition-colors relative ${
                showFavoritesOnly
                  ? 'text-red-500'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
              aria-label="Toggle favorites"
            >
              <Heart size={18} className={showFavoritesOnly ? 'fill-red-500' : ''} />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[8px] font-bold flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all"
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
        <section className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-stone-200/50 dark:border-stone-700/50 pb-8">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {CATEGORY_MAP[activeTab].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`shrink-0 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-100 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-500'
                  }`}
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
                </button>
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

          {/* Technique Filter Pills */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            {ALL_TECHNIQUES.map((technique) => (
              <button
                key={technique}
                onClick={() => toggleTechnique(technique)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
                  activeTechniques.includes(technique)
                    ? 'bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-900 border-stone-800 dark:border-stone-200 shadow-sm'
                    : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                }`}
              >
                {technique}
              </button>
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
          </div>

          {/* Difficulty Filter Pills */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-stone-400">Level</span>
            {ALL_DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => toggleDifficulty(d)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border shadow-sm ${
                  activeDifficulties.includes(d)
                    ? DIFFICULTY_COLORS[d].active
                    : DIFFICULTY_COLORS[d].inactive
                }`}
              >
                {d}
              </button>
            ))}
            {activeDifficulties.length > 0 && (
              <button
                onClick={() => setActiveDifficulties([])}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
              >
                <X size={12} />
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="py-32 text-center animate-fade-in-fast">
            <div className="serif text-3xl text-stone-300 dark:text-stone-600 mb-2">Loading prompts...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-32 text-center animate-fade-in-fast">
            <div className="serif text-3xl text-stone-300 dark:text-stone-600 mb-2">Failed to load prompts</div>
            <p className="text-stone-400 dark:text-stone-500 mb-6">{error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all"
            >
              <RotateCcw size={14} />
              Try Again
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrompts.map((prompt, index) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onPreview={handleSelectPrompt}
              isFavorite={isFavorite(prompt.id)}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                toggleFavorite(prompt.id);
              }}
              isFocused={focusedCardIndex === index}
            />
          ))}
        </div>
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
                  setActiveDifficulties([]);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all"
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

function scrollCardIntoView(index: number) {
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.prompt-card');
    cards[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

export default App;
