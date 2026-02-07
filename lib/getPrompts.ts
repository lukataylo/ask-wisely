import type { Prompt } from '../types';

export async function getAllPrompts(signal?: AbortSignal): Promise<Prompt[]> {
  const response = await fetch('/prompts.json', { signal });
  if (!response.ok) throw new Error('Failed to load prompts.json');
  return response.json();
}
