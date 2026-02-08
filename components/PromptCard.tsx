
import React from 'react';
import { Copy, Check, ArrowUpRight, Heart } from 'lucide-react';
import { Prompt } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import IconButton from './ui/IconButton';

interface PromptCardProps {
  prompt: Prompt;
  onPreview: (prompt: Prompt) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isFocused?: boolean;
  copyCount: number;
  onIncrementCopy: (id: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPreview, isFavorite, onToggleFavorite, isFocused, copyCount, onIncrementCopy }) => {
  const [copied, copy] = useCopyToClipboard(prompt.fullPrompt, () => onIncrementCopy(prompt.id));

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void copy();
  };

  return (
    <div
      className={`prompt-card group relative cursor-pointer focus:outline-none ${isFocused ? 'keyboard-focused' : ''}`}
      onClick={() => onPreview(prompt)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPreview(prompt);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open prompt ${prompt.title}`}
    >
      {/* The Shape-Shifting Background Layer */}
      <div
        className="prompt-card-bg absolute inset-0 bg-[var(--bg-card)] border border-[var(--bg-card-border)] shadow-sm z-0"
      />

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400 font-semibold px-2 py-1 bg-[var(--bg-badge)] rounded-full">
              {prompt.category}
            </span>
            <div className="flex items-center gap-1">
              <IconButton
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(prompt.id); }}
                label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                active={isFavorite}
                className={isFavorite ? 'hover:bg-red-50 dark:hover:bg-red-900/20' : ''}
              >
                <Heart
                  size={16}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400 dark:text-stone-500'}
                />
              </IconButton>
              <IconButton
                onClick={handleCopy}
                label="Copy prompt"
                className="text-stone-600 dark:text-stone-400"
              >
                {copied ? (
                  <Check size={16} className="text-green-600 dark:text-green-400" />
                ) : (
                  <Copy size={16} />
                )}
              </IconButton>
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
