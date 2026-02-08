import React from 'react';
import { Prompt } from '../types';
import PromptCard from './PromptCard';

interface PromptGridProps {
  prompts: Prompt[];
  focusedCardIndex: number | null;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onPreview: (prompt: Prompt) => void;
  copyCounts: Record<string, number>;
  onIncrementCopy: (id: string) => void;
}

const PromptGrid: React.FC<PromptGridProps> = ({
  prompts,
  focusedCardIndex,
  isFavorite,
  onToggleFavorite,
  onPreview,
  copyCounts,
  onIncrementCopy,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {prompts.map((prompt, index) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onPreview={onPreview}
          isFavorite={isFavorite(prompt.id)}
          onToggleFavorite={onToggleFavorite}
          isFocused={focusedCardIndex === index}
          copyCount={copyCounts[prompt.id] || 0}
          onIncrementCopy={onIncrementCopy}
        />
      ))}
    </div>
  );
};

export default React.memo(PromptGrid);
