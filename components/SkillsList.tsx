import React, { useState, useMemo } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SKILLS, SKILL_CATEGORIES } from '../lib/skills-data';
import PillButton from './ui/PillButton';

export default function SkillsList() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(
    () => activeCategory === 'All'
      ? SKILLS
      : SKILLS.filter(s => s.category === activeCategory),
    [activeCategory],
  );

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: SKILLS.length };
    for (const s of SKILLS) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="animate-fade-in">
      <header className="max-w-3xl mb-16">
        <h1 className="serif text-6xl md:text-7xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-6 animate-fade-in-up">
          Claude Code <span className="italic text-[#FA7506]">Skills</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl leading-relaxed font-light animate-fade-in-slow">
          A curated collection of open-source skills that extend Claude Code with new capabilities — from document processing and test automation to app integrations and security tools.
        </p>
      </header>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-10">
        {SKILL_CATEGORIES.map(cat => (
          <PillButton
            key={cat}
            compact
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
            {categoryCounts[cat] != null && (
              <span className="ml-1.5 opacity-50">{categoryCounts[cat]}</span>
            )}
          </PillButton>
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(skill => (
          <a
            key={skill.id}
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="prompt-card group relative cursor-pointer focus:outline-none"
          >
            {/* Background layer matching prompt-card pattern */}
            <div className="prompt-card-bg absolute inset-0 bg-[var(--bg-card)] border border-[var(--bg-card-border)] shadow-sm z-0" />

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold px-2 py-1 bg-[var(--bg-badge)] rounded-full">
                    {skill.category}
                  </span>
                  {skill.author && (
                    <span className="text-[10px] text-stone-400 dark:text-stone-500 tracking-wide">
                      by @{skill.author}
                    </span>
                  )}
                </div>

                <h3 className="serif text-2xl font-medium text-stone-800 dark:text-stone-100 mb-3 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                  {skill.name}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                  {skill.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-200/50 dark:border-stone-700/50">
                <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 truncate mr-4">
                  {skill.url.replace('https://github.com/', '').split('/').slice(0, 2).join('/')}
                </span>
                <div className="flex items-center shrink-0 whitespace-nowrap text-xs font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
                  View
                  <span className="arrow-icon ml-1">
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
