
export type MainTab = 'Prompts' | 'Image Prompts' | 'Skills';

export type Category = 
  | 'All' 
  | 'Creative' | 'Technical' | 'Business' | 'Academic' | 'Persona' 
  | 'Cinematic' | 'Portrait' | 'Stylized' | 'Architecture'
  | 'Engineering' | 'Writing' | 'Strategy' | 'Design';

export interface Prompt {
  id: string;
  type: MainTab;
  title: string;
  category: Category;
  shortDescription: string;
  fullPrompt: string;
  skills: string[];
}
