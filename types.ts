
export type MainTab = 'Prompts' | 'Image Prompts' | 'Skills' | 'Eval Lab' | 'Blog';

export type Category =
  | 'All'
  | 'Creative' | 'Technical' | 'Business' | 'Academic' | 'Persona'
  | 'Product' | 'Data' | 'Marketing' | 'Personal'
  | 'Legal' | 'Education' | 'Healthcare'
  | 'Cinematic' | 'Portrait' | 'Stylized' | 'Architecture'
  | 'Commercial' | 'Interface'
  | 'Engineering' | 'Writing' | 'Strategy' | 'Design'
  | 'Communication' | 'AI Literacy';

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

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

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
  isNew?: boolean;
  difficulty?: Difficulty;
  workflow?: string[];
  exampleInput?: string;
  exampleOutput?: string;
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
