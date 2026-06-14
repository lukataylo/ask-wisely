import { useEffect } from 'react';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { Prompt } from '../types';

interface Params {
  selectedPrompt: Prompt | null;
  filteredPrompts: Prompt[];
  focusedCardIndex: number | null;
  setFocusedCardIndex: Dispatch<SetStateAction<number | null>>;
  onSelectPrompt: (prompt: Prompt) => void;
  onCopyPrompt: (prompt: Prompt) => void;
  searchRef: RefObject<HTMLInputElement | null>;
}

function scrollCardIntoView(index: number) {
  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.prompt-card');
    cards[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

export function usePromptKeyboardNav({
  selectedPrompt,
  filteredPrompts,
  focusedCardIndex,
  setFocusedCardIndex,
  onSelectPrompt,
  onCopyPrompt,
  searchRef,
}: Params) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === '/' && !inInput && !selectedPrompt) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (e.key === 'Escape') {
        if (document.activeElement === searchRef.current) {
          searchRef.current?.blur();
        }
        return;
      }

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
        if (prompt) onSelectPrompt(prompt);
      } else if (e.key === 'c' && focusedCardIndex !== null) {
        e.preventDefault();
        const prompt = filteredPrompts[focusedCardIndex];
        if (prompt) onCopyPrompt(prompt);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPrompt, filteredPrompts, focusedCardIndex, setFocusedCardIndex, onSelectPrompt, onCopyPrompt, searchRef]);
}
