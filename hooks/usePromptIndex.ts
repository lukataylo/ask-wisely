import { useMemo } from 'react';
import { Prompt } from '../types';

export function usePromptIndex(prompts: Prompt[]) {
  return useMemo(() => {
    const byId = new Map<string, Prompt>();
    for (const prompt of prompts) {
      byId.set(prompt.id, prompt);
    }
    return { byId };
  }, [prompts]);
}
