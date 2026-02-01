import type { Prompt, MainTab, Category } from '../types';

function extractText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.type === 'text') return node.text || '';
  if (node.children) {
    const text = node.children.map((child: any) => extractText(child)).join('');
    if (node.type === 'p' || node.type === 'h1' || node.type === 'h2' || node.type === 'h3') {
      return text + '\n';
    }
    return text;
  }
  return '';
}

async function getPromptsFromTina(): Promise<Prompt[]> {
  const { default: client } = await import('../tina/__generated__/client');
  const result = await client.queries.promptConnection();
  const prompts: Prompt[] = [];

  if (result.data.promptConnection.edges) {
    for (const edge of result.data.promptConnection.edges) {
      if (!edge?.node) continue;
      const node = edge.node;

      prompts.push({
        id: node._sys.filename,
        type: (node.type as MainTab) || 'Prompts',
        title: node.title,
        category: (node.category as Category) || 'Creative',
        shortDescription: node.shortDescription || '',
        fullPrompt: extractText(node.body).trim(),
        skills: (node.skills || []).filter((s): s is string => s != null),
      });
    }
  }

  return prompts;
}

async function getPromptsFromStatic(): Promise<Prompt[]> {
  const response = await fetch('/prompts.json');
  if (!response.ok) throw new Error('Failed to load prompts.json');
  return response.json();
}

export async function getAllPrompts(): Promise<Prompt[]> {
  if (import.meta.env.DEV) {
    return getPromptsFromTina();
  }
  return getPromptsFromStatic();
}
