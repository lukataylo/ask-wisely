
export type MainTab = 'Prompts' | 'Image Prompts' | 'Skills';

export type Category =
  | 'All'
  | 'Creative' | 'Technical' | 'Business' | 'Academic' | 'Persona'
  | 'Cinematic' | 'Portrait' | 'Stylized' | 'Architecture'
  | 'Engineering' | 'Writing' | 'Strategy' | 'Design';

export type LLMProvider = 'claude' | 'chatgpt' | 'gemini';

export type Technique =
  | 'Role Assignment' | 'Structured Output' | 'Constraint-Based'
  | 'Chain-of-Thought' | 'Few-Shot' | 'Self-Verification'
  | 'Socratic Method' | 'Meta-Cognitive';

export interface TemplateVariable {
  name: string;
  placeholder: string;
}

export interface LLMVariants {
  claude?: string;
  chatgpt?: string;
  gemini?: string;
}

export interface Prompt {
  id: string;
  type: MainTab;
  title: string;
  category: Category;
  shortDescription: string;
  fullPrompt: string;
  skills: string[];
  techniques: Technique[];
  variables: TemplateVariable[];
  llmVariants: LLMVariants;
}

export const TEXT_LLM_TABS: { key: LLMProvider; label: string }[] = [
  { key: 'claude', label: 'Claude' },
  { key: 'chatgpt', label: 'ChatGPT' },
  { key: 'gemini', label: 'Gemini' },
];

export const IMAGE_LLM_TABS: { key: LLMProvider; label: string }[] = [
  { key: 'chatgpt', label: 'ChatGPT / DALL-E' },
  { key: 'gemini', label: 'Gemini / Imagen' },
];
