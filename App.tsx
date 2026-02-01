
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { OwlLogo } from './components/OwlLogo';
import { Category, Prompt, MainTab, Technique } from './types';
import { usePrompts } from './hooks/usePrompts';
import PromptCard from './components/PromptCard';
import PromptModal from './components/PromptModal';
import AnimatedBackground from './components/AnimatedBackground';

const MAIN_TABS: MainTab[] = ['Prompts', 'Image Prompts', 'Skills'];

const CATEGORY_MAP: Record<MainTab, Category[]> = {
  'Prompts': ['All', 'Creative', 'Technical', 'Business', 'Academic', 'Persona'],
  'Image Prompts': ['All', 'Cinematic', 'Portrait', 'Stylized', 'Architecture'],
  'Skills': ['All', 'Engineering', 'Writing', 'Strategy', 'Design']
};

const ALL_TECHNIQUES: Technique[] = [
  'Role Assignment', 'Structured Output', 'Constraint-Based',
  'Chain-of-Thought', 'Few-Shot', 'Self-Verification',
  'Socratic Method', 'Meta-Cognitive',
];

const App: React.FC = () => {
  const { prompts: PROMPTS, loading, error } = usePrompts();
  const [activeTab, setActiveTab] = useState<MainTab>('Prompts');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [activeTechniques, setActiveTechniques] = useState<Technique[]>([]);

  const toggleTechnique = (technique: Technique) => {
    setActiveTechniques(prev =>
      prev.includes(technique)
        ? prev.filter(t => t !== technique)
        : [...prev, technique]
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
      return matchesTab && matchesCategory && matchesSearch && matchesTechniques;
    });
  }, [activeTab, activeCategory, searchQuery, activeTechniques, PROMPTS]);

  // Reset category and techniques when tab changes
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveCategory('All');
    setActiveTechniques([]);
  };

  return (
    <div className="min-h-screen selection:bg-stone-200 selection:text-stone-900">
      <AnimatedBackground />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#fdfbf7]/80 backdrop-blur-md border-b border-stone-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            className="serif text-2xl font-bold tracking-tight text-stone-900 cursor-pointer flex items-center gap-2 appearance-none bg-transparent border-none p-0 animate-fade-in"
            onClick={() => {
              handleTabChange('Prompts');
              setSearchQuery('');
            }}
          >
            <OwlLogo size={24} className="text-stone-400" />
            Ask Wisely<span className="text-stone-400 font-light">.</span>
          </button>

          <div className="hidden md:flex items-center bg-stone-100 p-1 rounded-full border border-stone-200">
            {MAIN_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-200'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="hidden md:block w-[120px]" />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* Hero Section */}
        <header className="max-w-3xl mb-16">
          <h1
            key={activeTab}
            className="serif text-6xl md:text-7xl font-medium text-stone-900 leading-tight mb-6 animate-fade-in-up"
          >
            {activeTab === 'Prompts' && <>The Art of <span className="italic text-stone-500">Inquiry</span></>}
            {activeTab === 'Image Prompts' && <>The Art of <span className="italic text-stone-500">Vision</span></>}
            {activeTab === 'Skills' && <>The Art of <span className="italic text-stone-500">Mastery</span></>}
          </h1>
          <p className="text-stone-500 text-lg md:text-xl leading-relaxed font-light animate-fade-in-slow">
            {activeTab === 'Prompts' && "A collection of sophisticated text prompts for complex reasoning and creative storytelling."}
            {activeTab === 'Image Prompts' && "Precision visual parameters for high-end generative art and cinematic world-building."}
            {activeTab === 'Skills' && "Foundational blueprints and methodologies for becoming a power user of digital intelligence."}
          </p>
        </header>

        {/* Search and Filters */}
        <section className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between border-b border-stone-200/50 pb-8">
            <div className="flex flex-wrap gap-2">
              {CATEGORY_MAP[activeTab].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border ${
                    activeCategory === cat
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-stone-900 transition-colors" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-stone-900/5 focus:border-stone-900 transition-all shadow-sm"
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
                    ? 'bg-stone-800 text-white border-stone-800 shadow-sm'
                    : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                }`}
              >
                {technique}
              </button>
            ))}
            {activeTechniques.length > 0 && (
              <button
                onClick={() => setActiveTechniques([])}
                className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-stone-500 hover:text-stone-900 transition-colors"
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
            <div className="serif text-3xl text-stone-300 mb-2">Loading prompts...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-32 text-center animate-fade-in-fast">
            <div className="serif text-3xl text-stone-300 mb-2">Failed to load prompts</div>
            <p className="text-stone-400">{error}</p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onPreview={setSelectedPrompt}
            />
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPrompts.length === 0 && (
          <div className="py-32 text-center animate-fade-in-fast">
            <div className="serif text-3xl text-stone-300 mb-2">No {activeTab.toLowerCase()} found</div>
            <p className="text-stone-400">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>

      <PromptModal
        prompt={selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />

      {/* Footer */}
      <footer className="border-t border-stone-200 py-16 px-6 bg-stone-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="serif text-xl font-bold text-stone-400 flex items-center gap-2">
            <OwlLogo size={20} />
            Ask Wisely.
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <a href="#" className="hover:text-stone-900 transition-colors">Library</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Methodology</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Manifesto</a>
          </div>
          <div className="text-[10px] text-stone-400 italic tracking-wider">Curated by Architects of Intelligence.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
