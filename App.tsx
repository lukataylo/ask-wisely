
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { Category, Prompt, MainTab } from './types';
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

const App: React.FC = () => {
  const { prompts: PROMPTS, loading, error } = usePrompts();
  const [activeTab, setActiveTab] = useState<MainTab>('Prompts');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = useMemo(() => {
    return PROMPTS.filter(p => {
      const matchesTab = p.type === activeTab;
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [activeTab, activeCategory, searchQuery, PROMPTS]);

  // Reset category when tab changes
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setActiveCategory('All');
  };

  return (
    <div className="min-h-screen selection:bg-stone-200 selection:text-stone-900">
      <AnimatedBackground />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#fdfbf7]/80 backdrop-blur-md border-b border-stone-200/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="serif text-2xl font-bold tracking-tight text-stone-900 cursor-pointer flex items-center gap-2"
            onClick={() => {
              handleTabChange('Prompts');
              setSearchQuery('');
            }}
          >
            <Sparkles size={24} className="text-stone-400" />
            Ask Wisely<span className="text-stone-400 font-light">.</span>
          </motion.div>
          
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

          <button className="hidden md:block px-5 py-2 rounded-full bg-stone-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors shadow-lg shadow-stone-200">
            Contribute
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* Hero Section */}
        <header className="max-w-3xl mb-16">
          <motion.h1 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="serif text-6xl md:text-7xl font-medium text-stone-900 leading-tight mb-6"
          >
            {activeTab === 'Prompts' && <>The Art of <span className="italic text-stone-500">Inquiry</span></>}
            {activeTab === 'Image Prompts' && <>The Art of <span className="italic text-stone-500">Vision</span></>}
            {activeTab === 'Skills' && <>The Art of <span className="italic text-stone-500">Mastery</span></>}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-stone-500 text-lg md:text-xl leading-relaxed font-light"
          >
            {activeTab === 'Prompts' && "A collection of sophisticated text prompts for complex reasoning and creative storytelling."}
            {activeTab === 'Image Prompts' && "Precision visual parameters for high-end generative art and cinematic world-building."}
            {activeTab === 'Skills' && "Foundational blueprints and methodologies for becoming a power user of digital intelligence."}
          </motion.p>
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
        </section>

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <div className="serif text-3xl text-stone-300 mb-2">Loading prompts...</div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <div className="serif text-3xl text-stone-300 mb-2">Failed to load prompts</div>
            <p className="text-stone-400">{error}</p>
          </motion.div>
        )}

        {/* Grid */}
        {!loading && !error && (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onPreview={setSelectedPrompt}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPrompts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center"
          >
            <div className="serif text-3xl text-stone-300 mb-2">No {activeTab.toLowerCase()} found</div>
            <p className="text-stone-400">Try adjusting your filters or search terms.</p>
          </motion.div>
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
            <Sparkles size={20} />
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
