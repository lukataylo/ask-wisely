
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Moon, Sun, Heart, Shuffle, ArrowDown, RotateCcw, Mail, Bot, ShieldCheck, BriefcaseBusiness, Clapperboard, ArrowRight } from 'lucide-react';
import { OwlLogo } from './components/OwlLogo';
import { Category, Prompt, MainTab, Technique } from './types';
import { usePrompts } from './hooks/usePrompts';
import { useFavorites } from './hooks/useFavorites';
import { useDarkMode } from './hooks/useDarkMode';
import { useCopyCount } from './hooks/useCopyCount';
import { parseURL, useUrlState } from './hooks/useUrlState';
import { usePromptFilters } from './hooks/usePromptFilters';
import { usePromptKeyboardNav } from './hooks/usePromptKeyboardNav';
import { usePromptIndex } from './hooks/usePromptIndex';
import { usePromptExplorerState } from './hooks/usePromptExplorerState';
import { copyText } from './lib/copyText';
import PromptGrid from './components/PromptGrid';
import FilterControls from './components/FilterControls';
import PromptModal from './components/PromptModal';
import IconButton from './components/ui/IconButton';
import BlogList from './components/BlogList';
import BlogPost from './components/BlogPost';
import SkillsList from './components/SkillsList';
import { getBlogPostBySlug, type BlogPost as BlogPostType } from './lib/blog-data';

const MAIN_TABS: MainTab[] = ['Prompts', 'Image Prompts', 'Skills', 'Blog'];

const CATEGORY_MAP: Record<MainTab, Category[]> = {
  'Prompts': ['All', 'Creative', 'Technical', 'Business', 'Academic', 'Persona', 'Product', 'Data', 'Marketing', 'Personal', 'Legal', 'Education', 'Healthcare', 'Security'],
  'Image Prompts': ['All', 'Cinematic', 'Portrait', 'Stylized', 'Architecture', 'Commercial', 'Interface'],
  'Skills': ['All', 'Engineering', 'Writing', 'Strategy', 'Design', 'Communication', 'AI Literacy', 'Development', 'Automation', 'Documents', 'Data & Research', 'Writing & Content', 'Creative & Media', 'Productivity', 'Security'],
  'Blog': ['All'],
};

const ALL_TECHNIQUES: Technique[] = [
  'Role Assignment', 'Structured Output', 'Constraint-Based',
  'Chain-of-Thought', 'Few-Shot', 'Self-Verification',
  'Socratic Method', 'Meta-Cognitive',
];

const BTN_OUTLINE = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all';

const DEFAULT_TITLE = 'Ask Wisely — Curated AI Prompt Library for Creative, Technical & Visual Prompts';

const WORKFLOW_LANES = [
  {
    title: 'Agentic Workflows',
    description: 'Plan tools, approvals, MCP servers, and multi-step agent work.',
    query: 'agent workflow tool mcp approval',
    icon: Bot,
  },
  {
    title: 'Safety & Evals',
    description: 'Stress-test prompts, sources, claims, and prompt-injection risks.',
    query: 'eval verification prompt injection source grounded audit',
    icon: ShieldCheck,
  },
  {
    title: 'Work & Business',
    description: 'Turn messy product, data, marketing, and strategy inputs into action.',
    query: 'product data marketing roadmap metric business',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Creative Systems',
    description: 'Storyboard, direct, and iterate visual/video ideas with more control.',
    query: 'video storyboard multimodal creative director campaign',
    icon: Clapperboard,
  },
];

const App: React.FC = () => {
  const { prompts: PROMPTS, loading, error, retry } = usePrompts();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { toggleFavorite, isFavorite, count: favCount } = useFavorites();
  const { counts: copyCounts, increment: incrementCopy } = useCopyCount();
  const searchRef = useRef<HTMLInputElement>(null);
  const [showNotFound, setShowNotFound] = useState(false);
  const { updateURL, usePopStateListener } = useUrlState();
  const { byId: promptById } = usePromptIndex(PROMPTS);

  // Initialize state from URL
  const initial = parseURL(CATEGORY_MAP);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPostType | null>(
    initial.blogSlug ? getBlogPostBySlug(initial.blogSlug) ?? null : null
  );
  const {
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
  } = usePromptExplorerState({
    initialTab: initial.tab,
    initialCategory: initial.cat,
    initialPromptId: initial.promptId,
    updateURL,
  });

  // Once prompts load, resolve pending prompt ID from URL
  useEffect(() => {
    if (!loading && PROMPTS.length > 0 && pendingPromptId) {
      const found = pendingPromptId ? (promptById.get(pendingPromptId) ?? null) : null;
      if (found) {
        setSelectedPrompt(found);
        setActiveTab(found.type);
      } else {
        setShowNotFound(true);
      }
      setPendingPromptId(null);
    }
  }, [loading, PROMPTS, pendingPromptId, promptById]);


  // Update document title
  useEffect(() => {
    if (selectedBlogPost) {
      document.title = `${selectedBlogPost.title} — Ask Wisely`;
    } else if (selectedPrompt) {
      document.title = `${selectedPrompt.title} — Ask Wisely`;
    } else if (activeTab !== 'Prompts') {
      document.title = `${activeTab} — Ask Wisely`;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [selectedPrompt, selectedBlogPost, activeTab]);

  usePopStateListener(({ tab, cat, promptId, blogSlug }) => {
    setActiveTab(tab);
    setActiveCategory(cat);
    setActiveTechniques([]);
    if (blogSlug) {
      setSelectedBlogPost(getBlogPostBySlug(blogSlug) ?? null);
      setSelectedPrompt(null);
    } else {
      setSelectedPrompt(promptId ? (promptById.get(promptId) ?? null) : null);
      setSelectedBlogPost(null);
    }
  }, CATEGORY_MAP);

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

  const handleSurpriseMe = useCallback(() => {
    if (tabPrompts.length === 0) return;
    const random = tabPrompts[Math.floor(Math.random() * tabPrompts.length)];
    handleSelectPrompt(random);
  }, [tabPrompts, handleSelectPrompt]);

  const handleCopyPrompt = useCallback((prompt: Prompt) => {
    copyText(prompt.fullPrompt).then((ok) => {
      if (ok) incrementCopy(prompt.id);
    });
  }, [incrementCopy]);

  const handleWorkflowLane = useCallback((query: string) => {
    startFilterTransition(() => {
      setActiveTab('Prompts');
      setActiveCategory('All');
      setActiveTechniques([]);
      setShowFavoritesOnly(false);
      setSearchQuery(query);
    });
    searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [setActiveTab, setActiveCategory, setActiveTechniques, setShowFavoritesOnly, setSearchQuery, startFilterTransition]);

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
            <OwlLogo size={36} className="text-stone-400" />
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

      {showNotFound ? (
        <main className="max-w-7xl mx-auto px-6 pt-16 pb-32 flex flex-col items-center text-center">
          <img src="/images/404.svg" alt="Page not found" className="w-72 md:w-96 mb-10" />
          <h1 className="serif text-5xl md:text-6xl font-medium text-stone-900 dark:text-stone-100 mb-4">
            Page Not <span className="italic text-[#FA7506]">Found</span>
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-lg font-light max-w-md mb-10 leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => { setShowNotFound(false); updateURL('Prompts', 'All', null, true); }}
            className={BTN_OUTLINE}
          >
            Back to Home
          </button>
        </main>
      ) : (
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">

        {/* ── Skills ── */}
        {activeTab === 'Skills' && <SkillsList />}

        {/* ── Blog ── */}
        {activeTab === 'Blog' && !selectedBlogPost && (
          <>
            <header className="max-w-3xl mb-16">
              <h1 className="serif text-6xl md:text-7xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-6 animate-fade-in-up">
                The Art of <span className="italic text-[#FA7506]">Thinking</span>
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl leading-relaxed font-light animate-fade-in-slow">
                Essays on prompt craft, AI literacy, and the evolving art of human-machine collaboration.
              </p>
            </header>
            <BlogList onSelectPost={(post) => {
              setSelectedBlogPost(post);
              updateURL('Blog', 'All', null, false, post.slug);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </>
        )}

        {activeTab === 'Blog' && selectedBlogPost && (
          <BlogPost
            post={selectedBlogPost}
            onBack={() => {
              setSelectedBlogPost(null);
              updateURL('Blog', 'All', null);
            }}
          />
        )}

        {/* ── Prompts / Image Prompts ── */}
        {(activeTab === 'Prompts' || activeTab === 'Image Prompts') && (
          <>
            {/* Hero Section */}
            <header className="max-w-5xl mb-14">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-stone-200 dark:border-stone-700 bg-white/60 dark:bg-stone-900/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                {!loading && tabPromptCount > 0 ? `${tabPromptCount} reviewed prompts` : 'Reviewed prompt systems'}
              </div>
              <h1
                key={activeTab}
                className="serif text-5xl md:text-7xl font-medium text-stone-900 dark:text-stone-100 leading-[0.98] mb-6 animate-fade-in-up max-w-4xl"
              >
                {activeTab === 'Prompts' && <>Prompt systems for work that needs <span className="italic text-[#FA7506]">judgment</span>.</>}
                {activeTab === 'Image Prompts' && <>Visual prompts for ideas that need <span className="italic text-[#FA7506]">direction</span>.</>}
              </h1>
              <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl leading-relaxed font-light animate-fade-in-slow mb-8 max-w-3xl">
                {activeTab === 'Prompts' && (
                  !loading && tabPromptCount > 0
                    ? `A curated library of ${tabPromptCount} practical prompts for agents, research, product work, data debugging, writing, and safer AI use.`
                    : "A curated library of practical prompts for agents, research, product work, data debugging, writing, and safer AI use."
                )}
                {activeTab === 'Image Prompts' && (
                  !loading && tabPromptCount > 0
                    ? `Browse ${tabPromptCount} precision visual prompts for product imagery, cinematic boards, interfaces, and brand systems.`
                    : "Precision visual prompts for product imagery, cinematic boards, interfaces, and brand systems."
                )}
              </p>
              {!loading && tabPrompts.length > 0 && (
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

            {activeTab === 'Prompts' && (
              <section className="mb-12" aria-labelledby="workflow-lanes-heading">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
                  <div>
                    <h2 id="workflow-lanes-heading" className="serif text-3xl font-medium text-stone-900 dark:text-stone-100">
                      Start with a workflow
                    </h2>
                    <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">
                      Four fast paths into the highest-value parts of the library.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('All');
                      setActiveTechniques([]);
                    }}
                    className="self-start md:self-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                  >
                    Show all prompts
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                  {WORKFLOW_LANES.map((lane) => {
                    const Icon = lane.icon;
                    return (
                      <button
                        key={lane.title}
                        onClick={() => handleWorkflowLane(lane.query)}
                        className="group text-left rounded-xl border border-stone-200 dark:border-stone-800 bg-white/65 dark:bg-stone-900/45 p-5 shadow-sm hover:border-stone-300 dark:hover:border-stone-600 hover:bg-white dark:hover:bg-stone-900 transition-all"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200">
                            <Icon size={18} />
                          </span>
                          <ArrowRight size={15} className="text-stone-300 dark:text-stone-600 transition-transform group-hover:translate-x-1 group-hover:text-[#FA7506]" />
                        </div>
                        <div className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1">
                          {lane.title}
                        </div>
                        <p className="text-sm leading-relaxed text-stone-500 dark:text-stone-400">
                          {lane.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

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
          </>
        )}
      </main>
      )}

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
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 grid grid-cols-1 md:grid-cols-8 items-center gap-12">
          <div className="text-center md:text-left md:col-span-5 order-2 md:order-1">
            <h2 className="serif text-4xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-4">
              Stay <span className="italic text-[#FA7506]">Curious</span>
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
          <div className="md:col-span-3 md:col-start-6 order-1 md:order-2 flex justify-center">
            <img src="/images/newsletter.svg" alt="" className="w-[442px] max-w-none dark:hidden" />
            <img src="/images/newsletter-dark.svg" alt="" className="w-[442px] max-w-none hidden dark:block" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-16 px-6 bg-stone-50/50 dark:bg-stone-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="serif text-xl font-bold text-stone-400 flex items-center gap-2">
            <OwlLogo size={30} />
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
