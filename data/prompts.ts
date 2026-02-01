
import { Prompt } from '../types';

export const PROMPTS: Prompt[] = [
  // TEXT PROMPTS
  {
    id: 't1',
    type: 'Prompts',
    title: 'The Narrative Architect',
    category: 'Creative',
    shortDescription: 'Build immersive worlds with consistent internal logic and sensory-rich environments.',
    fullPrompt: 'Act as a Narrative Architect. Help me world-build for a high-fantasy novel. Focus on the political system, the economy of magic, and three specific cultural taboos for a nation of nomadic scholars. Use sensory-rich language.',
    skills: ['Fiction Writing', 'World Building', 'Atmosphere']
  },
  {
    id: 't2',
    type: 'Prompts',
    title: 'Clean Code Sage',
    category: 'Technical',
    shortDescription: 'Refactor complex logic into readable, performant, and maintainable TypeScript patterns.',
    fullPrompt: 'You are a Senior Software Engineer specializing in functional programming and React. Review this component and suggest refactoring for better performance and type safety, prioritizing readability over cleverness.',
    skills: ['Code Review', 'Refactoring', 'Architecture']
  },
  {
    id: 't3',
    type: 'Prompts',
    title: 'The Strategic Mind',
    category: 'Business',
    shortDescription: 'Develop high-level business strategies with detailed SWOT analysis and market entry plans.',
    fullPrompt: 'Assume the role of a McKinsey Consultant. I have a startup in the green tech space. Analyze my market entry strategy for Southeast Asia, focusing on regulatory hurdles and competitive advantages.',
    skills: ['Analysis', 'Strategy', 'Market Research']
  },
  {
    id: 't4',
    type: 'Prompts',
    title: 'The Socrates Tutor',
    category: 'Academic',
    shortDescription: 'Master complex subjects through guided questioning and first-principles thinking.',
    fullPrompt: 'Act as a Socratic Tutor. I want to understand Quantum Entanglement. Don\'t give me answers directly; instead, guide me through the concepts using questions that challenge my current understanding of physics.',
    skills: ['Pedagogy', 'Physics', 'Inquiry']
  },

  // IMAGE PROMPTS
  {
    id: 'i1',
    type: 'Image Prompts',
    title: 'Neon Noir Streetscape',
    category: 'Cinematic',
    shortDescription: 'A rain-slicked futuristic alleyway with deep shadows and vibrant cyan-magenta lighting.',
    fullPrompt: 'Cinematic wide shot of a rain-slicked Cyberpunk alleyway, neon signs flickering in Japanese kanji, deep contrast, volumetric lighting, 8k resolution, shot on 35mm film, f/1.8, teal and orange color grading.',
    skills: ['Lighting', 'Composition', 'Color Theory']
  },
  {
    id: 'i2',
    type: 'Image Prompts',
    title: 'Brutalist Oasis',
    category: 'Architecture',
    shortDescription: 'Raw concrete structures intertwined with lush, overflowing tropical vegetation.',
    fullPrompt: 'Architectural photography of a brutalist concrete villa in a jungle, large floor-to-ceiling windows, sunlight dappled through leaves, hyper-realistic, minimal furniture, overcast soft lighting.',
    skills: ['Spatial Design', 'Textures', 'Materiality']
  },
  {
    id: 'i3',
    type: 'Image Prompts',
    title: 'Claymation Explorer',
    category: 'Stylized',
    shortDescription: 'Hand-crafted aesthetic featuring tactile textures and whimsical proportions.',
    fullPrompt: 'Macro 3D render of a tiny claymation astronaut on a mushroom planet, stop-motion aesthetic, fingerprint textures visible, soft studio lighting, tilt-shift, vibrant pastel colors.',
    skills: ['3D Rendering', 'Character Design', 'Textures']
  },

  // SKILLS
  {
    id: 's1',
    type: 'Skills',
    title: 'Prompt Engineering 101',
    category: 'Engineering',
    shortDescription: 'The foundational principles of Chain-of-Thought and Few-Shot prompting techniques.',
    fullPrompt: 'Master the art of prompting. 1. Use Delimiters to clearly separate parts of the input. 2. Ask for structured output (JSON/Markdown). 3. Provide examples (Few-Shot). 4. Use Chain-of-Thought ("Let\'s think step by step").',
    skills: ['LLM Logic', 'Structure', 'Precision']
  },
  {
    id: 's2',
    type: 'Skills',
    title: 'Art of Narrative Voice',
    category: 'Writing',
    shortDescription: 'Developing a unique brand voice through diction, rhythm, and intentional pacing.',
    fullPrompt: 'To develop a strong narrative voice: Identify the target audience emotion, choose a primary metaphor style (mechanical, organic, cosmic), and regulate sentence length to control reader attention span.',
    skills: ['Voice', 'Pacing', 'Psychology']
  },
  {
    id: 's3',
    type: 'Skills',
    title: 'Visual Hierarchy',
    category: 'Design',
    shortDescription: 'Guiding user attention through size, color, and whitespace in UI/UX design.',
    fullPrompt: 'Hierarchy fundamentals: Use size to denote importance, leverage high-contrast for primary actions, and utilize whitespace (negative space) to group related elements and reduce cognitive load.',
    skills: ['UX', 'UI', 'Visual Flow']
  }
];
