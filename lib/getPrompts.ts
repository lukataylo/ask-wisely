import type { Prompt } from '../types';

export async function getAllPrompts(): Promise<Prompt[]> {
  const response = await fetch('/prompts.json');
  if (!response.ok) throw new Error('Failed to load prompts.json');
  return response.json();
}
