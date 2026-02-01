
import React, { useState } from 'react';
import { Copy, Check, ArrowUpRight, Heart } from 'lucide-react';
import { Prompt } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useCopyCount } from '../hooks/useCopyCount';

interface PromptCardProps {
  prompt: Prompt;
  onPreview: (prompt: Prompt) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isFocused?: boolean;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPreview, isFavorite, onToggleFavorite, isFocused }) => {
  const [copied, copy] = useCopyToClipboard(prompt.fullPrompt);
  const { getCount, increment } = useCopyCount();
  const [copyCount, setCopyCount] = useState(() => getCount(prompt.id));

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copy();
    increment(prompt.id);
    setCopyCount(prev => prev + 1);
  };

  return (
    <div
      className={`prompt-card group relative cursor-pointer ${isFocused ? 'keyboard-focused' : ''}`}
      onClick={() => onPreview(prompt)}
    >
      {/* The Shape-Shifting Background Layer */}
      <div
        className="prompt-card-bg absolute inset-0 bg-[var(--bg-card)] border border-[var(--bg-card-border)] shadow-sm z-0"
      />

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold px-2 py-1 bg-[var(--bg-badge)] rounded-full">
                {prompt.category}
              </span>
              {prompt.difficulty && (
                <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${
                  prompt.difficulty === 'Beginner'
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : prompt.difficulty === 'Intermediate'
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    : 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                }`}>
                  {prompt.difficulty}
                </span>
              )}
              {prompt.isNew && (
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full">
                  New
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onToggleFavorite}
                className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={16}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400 dark:text-stone-500'}
                />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-stone-600 dark:text-stone-400"
                aria-label="Copy prompt"
              >
                {copied ? (
                  <Check size={16} className="text-green-600 dark:text-green-400" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>

          <h3 className="serif text-2xl font-medium text-stone-800 dark:text-stone-100 mb-3 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
            {prompt.title}
          </h3>
          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4">
            {prompt.shortDescription}
          </p>

          {/* Technique badges */}
          {prompt.techniques.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {prompt.techniques.slice(0, 2).map((tech) => (
                <span
                  key={tech}
                  className="text-[9px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded"
                >
                  {tech}
                </span>
              ))}
              {prompt.techniques.length > 2 && (
                <span className="text-[9px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 px-1 py-0.5">
                  +{prompt.techniques.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-200/50 dark:border-stone-700/50">
          <div className="flex -space-x-1">
            {prompt.skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[10px] text-stone-400 bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 px-2 py-0.5 rounded shadow-sm">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {copyCount > 0 && (
              <span className="text-[10px] text-stone-400 dark:text-stone-500">
                {copyCount}x
              </span>
            )}
            <div className="flex items-center shrink-0 whitespace-nowrap text-xs font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors">
              Open
              <span className="arrow-icon ml-1">
                <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PromptCard);
