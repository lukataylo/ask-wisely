/**
 * One-time script to inject [bracket] template variables into all prompt markdown files.
 * Run: node scripts/inject-variables.js
 */
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/prompts');

// Curated replacements per file: { filename: [[search, replace], ...] }
const REPLACEMENTS = {
  // === PROMPTS (type: Prompts) ===
  'api-design-architect.md': [
    ['a task management system', '[your system/product]'],
  ],
  'clean-code-sage.md': [
    ['functional programming and React', '[your language/framework]'],
    ['this component', '[your code/component]'],
  ],
  'database-schema-sage.md': [
    ['an e-commerce platform', '[your application/platform]'],
  ],
  'flash-fiction-architect.md': [
    ['exactly 250 words', 'exactly [word count] words'],
    ['exactly one character', 'exactly [number of characters] character(s)'],
  ],
  'poetry-forge.md': [
    ['"digital isolation."', '"[your theme]."'],
  ],
  'system-design-blueprint.md': [
    ['a real-time collaborative document editor (like Google Docs)', '[your system to design]'],
  ],
  'the-abstract-crafter.md': [
    ['my research paper', 'my research paper on [your research topic]'],
  ],
  'the-brand-storyteller.md': [
    ['I will describe my brand.', 'I will describe my brand: [your brand/company].'],
  ],
  'the-concept-mapper.md': [
    ['a complex topic spanning multiple disciplines', 'a complex topic: [your topic]'],
  ],
  'the-critical-thinker.md': [
    ['I will present an argument or claim.', 'I will present an argument or claim: [your argument/claim].'],
  ],
  'the-data-interpreter.md': [
    ['I will share a dataset description or statistical results.', 'I will share a dataset description or statistical results for [your dataset/study].'],
  ],
  'the-debug-whisperer.md': [
    ['I will describe a bug.', 'I will describe a bug: [your bug description].'],
  ],
  'the-devops-navigator.md': [
    ['a microservices application', '[your application type]'],
  ],
  'the-dialogue-alchemist.md': [
    ['share a secret they don\'t know about yet', 'share a secret about [the shared secret] they don\'t know about yet'],
  ],
  'the-diplomatic-envoy.md': [
    ['I will describe a conflict (interpersonal, organizational, or ideological).', 'I will describe a conflict: [your conflict situation].'],
  ],
  'the-emotional-cartographer.md': [
    ['a short story about grief', 'a short story about [your emotion/theme]'],
  ],
  'the-financial-modeler.md': [
    ['I will describe my business model.', 'I will describe my business model: [your business model].'],
  ],
  'the-genre-blender.md': [
    ['Regency Romance and Cyberpunk Thriller', '[genre 1] and [genre 2]'],
  ],
  'the-growth-hacker.md': [
    ['I will describe my product and current metrics.', 'I will describe my product ([your product]) and current metrics.'],
  ],
  'the-hypothesis-generator.md': [
    ['I will describe an observation or phenomenon.', 'I will describe an observation: [your observation/phenomenon].'],
  ],
  'the-jazz-improviser.md': [
    ['I will give you a creative challenge or a stuck project.', 'I will give you a creative challenge: [your creative challenge].'],
  ],
  'the-literature-reviewer.md': [
    ['I will provide a research topic.', 'I will provide a research topic: [your research topic].'],
  ],
  'the-market-analyst.md': [
    ['the market I describe', 'the [your market/industry] market'],
  ],
  'the-metaphor-engine.md': [
    ['"the passage of time."', '"[your abstract concept]."'],
  ],
  'the-narrative-architect.md': [
    ['a high-fantasy novel', 'a [your genre] novel'],
    ['a nation of nomadic scholars', 'a nation of [your society type]'],
  ],
  'the-negotiation-strategist.md': [
    ['I will describe my upcoming negotiation.', 'I will describe my upcoming negotiation: [your negotiation context].'],
  ],
  'the-okr-architect.md': [
    ['I will describe my team and our goals.', 'I will describe my team ([your team/department]) and our goals.'],
  ],
  'the-peer-reviewer.md': [
    ['I will share a draft paper or section.', 'I will share a draft paper on [your paper topic].'],
  ],
  'the-performance-oracle.md': [
    ['I will share a piece of code.', 'I will share a piece of code in [your programming language].'],
  ],
  'the-pitch-perfectionist.md': [
    ['I will describe my startup.', 'I will describe my startup: [your startup/product].'],
  ],
  'the-regex-artisan.md': [
    ['I will describe a text pattern I need to match.', 'I will describe a text pattern: [your pattern description].'],
  ],
  'the-renaissance-polymath.md': [
    ['I will present a modern challenge or question.', 'I will present a modern challenge: [your challenge/question].'],
  ],
  'the-research-methodologist.md': [
    ['I will describe my research question.', 'I will describe my research question: [your research question].'],
  ],
  'the-risk-assessor.md': [
    ['I will describe a business decision.', 'I will describe a business decision: [your decision/initiative].'],
  ],
  'the-scene-painter.md': [
    ['a kitchen at 3 AM after a celebration has ended', '[your setting and situation]'],
  ],
  'the-security-sentinel.md': [
    ['the code I provide', 'the [your programming language] code I provide'],
  ],
  'the-silicon-valley-mentor.md': [
    ['I will describe my startup situation.', 'I will describe my startup situation: [your startup situation].'],
  ],
  'the-socrates-tutor.md': [
    ['Quantum Entanglement', '[your topic]'],
    ['my current understanding of physics', 'my current understanding of [your field]'],
  ],
  'the-stakeholder-whisperer.md': [
    ['I will describe a project with multiple stakeholders.', 'I will describe a project: [your project description].'],
  ],
  'the-stoic-philosopher.md': [
    ['I will describe a modern dilemma I face.', 'I will describe a modern dilemma: [your dilemma].'],
  ],
  'the-strategic-mind.md': [
    ['a startup in the green tech space', 'a startup in the [your industry] space'],
    ['Southeast Asia', '[your target market/region]'],
  ],
  'the-test-strategist.md': [
    ['the feature I describe', 'the feature: [your feature description]'],
  ],
  'the-thesis-architect.md': [
    ['I will give you my research topic and initial thoughts.', 'I will give you my research topic ([your research topic]) and initial thoughts.'],
  ],
  'the-three-act-structure.md': [],  // Educational content, no direct customization needed
  'the-time-traveler-historian.md': [
    ['I will describe a current event or situation.', 'I will describe a current event: [your event/situation].'],
  ],
  'the-tone-shapeshifter.md': [
    ['"A company released a new product. It sold well. Competitors took notice."', '"[your paragraph to transform]"'],
  ],
  'the-unreliable-narrator.md': [
    ['a "perfect" dinner party', 'a "perfect" [your event/scene]'],
  ],
  'the-victorian-detective.md': [
    ['I will present you with a puzzle, mystery, or problem to solve.', 'I will present you with a puzzle: [your mystery/problem].'],
  ],
  'the-war-room-general.md': [
    ['I will describe a competitive or strategic challenge (business, personal, or organizational).', 'I will describe a strategic challenge: [your challenge].'],
  ],
  'the-zen-master.md': [
    ['A student (me) comes to you with a problem that feels urgent.', 'A student (me) comes to you with a problem: [your problem].'],
  ],

  // === IMAGE PROMPTS ===
  'ancient-future-temple.md': [
    ['traditional Khmer temple details', 'traditional [architectural style] details'],
    ['twilight sky', '[time of day] sky'],
  ],
  'arctic-solitude.md': [
    ['a single tiny red wooden cabin', 'a single tiny [color] wooden [structure]'],
    ['a vast white Arctic landscape', 'a vast [environment]'],
  ],
  'art-deco-metropolis.md': [
    ['metallic gold and deep navy blue color scheme', '[primary color] and [secondary color] color scheme'],
  ],
  'bio-organic-tower.md': [
    ['a bio-organic skyscraper', 'a bio-organic [building type]'],
  ],
  'brutalist-oasis.md': [
    ['a brutalist concrete villa in a jungle', 'a brutalist concrete [building type] in [your setting]'],
  ],
  'celestial-observatory.md': [
    ['a massive retro-futuristic observatory', 'a massive [architectural style] observatory'],
  ],
  'claymation-explorer.md': [
    ['a tiny claymation astronaut on a mushroom planet', 'a tiny claymation [character] on a [setting]'],
  ],
  'desert-mirage-oasis.md': [
    ['cracked white salt flat', '[barren landscape type]'],
  ],
  'desert-monastery.md': [
    ['a rammed-earth monastery complex in the Sahara Desert', 'a rammed-earth [building type] in [your location]'],
  ],
  'double-exposure-spirit.md': [
    ['a woman\'s profile silhouette filled with a dense misty forest', 'a [subject]\'s profile silhouette filled with [your scene/environment]'],
  ],
  'film-noir-femme.md': [
    ['a woman in a 1940s wide-brim hat', 'a [subject] in [period/style] attire'],
  ],
  'floating-pavilion.md': [
    ['a minimalist concrete pavilion', 'a minimalist [material] [structure type]'],
    ['single cherry blossom tree', 'single [organic element]'],
  ],
  'fog-of-war.md': [
    ['soldiers emerging from dense fog on a WW1 battlefield', '[subjects] emerging from dense fog on a [setting]'],
  ],
  'glass-canyon-bridge.md': [
    ['a transparent glass-bottomed bridge spanning a 500-meter deep canyon', 'a transparent glass-bottomed bridge spanning [your landscape]'],
  ],
  'golden-hour-wasteland.md': [
    ['a lone figure walking through a vast post-apocalyptic desert', 'a lone figure walking through [your environment/setting]'],
  ],
  'ice-hotel-aurora.md': [
    ['an ice hotel suite in Swedish Lapland', 'an [architectural interior] in [your location]'],
  ],
  'ink-wash-dragon.md': [
    ['a dragon emerging from mountain mist', 'a [your subject] emerging from [your setting]'],
  ],
  'isometric-sanctuary.md': [
    ['a cozy writer\'s sanctuary', 'a cozy [your room type]'],
  ],
  'low-poly-wilderness.md': [
    ['a vast wilderness at sunset', 'a vast [your landscape] at [time of day]'],
    ['a geometric bear standing by a faceted river', 'a geometric [animal] standing by a faceted river'],
  ],
  'midnight-express-train.md': [
    ['an Orient Express-style luxury train', 'a [your train/vehicle style]'],
    ['snow-covered Alpine mountains', '[your landscape setting]'],
  ],
  'neon-noir-streetscape.md': [
    ['a rain-slicked Cyberpunk alleyway', 'a rain-slicked [your urban setting]'],
    ['teal and orange color grading', '[your color palette] color grading'],
  ],
  'neon-rain-chase.md': [
    ['a motorcycle chase through rain-soaked Tokyo streets', 'a [vehicle] chase through rain-soaked [your city] streets'],
  ],
  'neon-youth.md': [
    ['a young person with bleached buzz cut hair', 'a [subject description]'],
    ['hot pink on the left, electric blue on the right', '[color 1] on the left, [color 2] on the right'],
  ],
  'papercraft-cosmos.md': [
    ['the solar system', '[your subject/scene]'],
    ['warm cream and indigo color palette', '[your color palette]'],
  ],
  'parametric-concert-hall.md': [
    ['a parametric concert hall', 'a parametric [building type]'],
    ['a grand piano on stage', '[focal object] on stage'],
  ],
  'pixel-art-odyssey.md': [
    ['a pixelated forest through mountains into a desert to a glowing city', '[your biome sequence]'],
  ],
  'porcelain-mask.md': [
    ['the left half of a face is natural human skin and the right half transitions into cracked white porcelain ceramic', 'the left half of a face is natural human skin and the right half transitions into [your material/texture]'],
  ],
  'renaissance-digital.md': [
    ['a young software engineer wearing a hoodie', 'a [your subject description]'],
    ['Jan van Eyck', '[Renaissance artist]'],
  ],
  'stained-glass-galaxy.md': [
    ['The Andromeda Galaxy', '[your celestial subject]'],
    ['ruby, sapphire, and amber', '[your glass colors]'],
  ],
  'subterranean-library.md': [
    ['a vast subterranean library carved into natural limestone caves', 'a vast subterranean [space type] carved into [your geological setting]'],
  ],
  'the-alchemist-portrait.md': [
    ['an ancient alchemist in a candlelit laboratory', 'an [your character] in a [your setting]'],
  ],
  'the-astronauts-gaze.md': [
    ['an astronaut in a spacesuit', 'a [your character/subject] in [their attire]'],
  ],
  'the-elder-sage.md': [
    ['an elderly Tibetan Buddhist monk in saffron robes', 'an elderly [your character] in [their attire]'],
    ['a candlelit monastery', 'a [your setting]'],
  ],
  'the-last-light.md': [
    ['a lighthouse on a rocky cliff', 'a [your structure] on a [your landscape]'],
  ],
  'treehouse-metropolis.md': [
    ['redwood-scale ancient trees', '[your tree/plant type]'],
  ],
  'tribal-royalty.md': [
    ['traditional Maasai beadwork', 'traditional [cultural tradition] adornments'],
    ['contemporary haute couture', 'contemporary [fashion style]'],
  ],
  'underwater-cathedral.md': [
    ['a sunken gothic cathedral underwater', 'a sunken [your structure] underwater'],
    ['teal and amber color grading', '[your color palette] color grading'],
  ],
  'urban-decay-renaissance.md': [
    ['an abandoned industrial factory reclaimed by nature', 'an abandoned [your setting] reclaimed by nature'],
  ],
  'vaporwave-temple.md': [
    ['a classical Greek temple floating in a purple void', 'a classical [your architectural style] temple floating in a [color] void'],
  ],
  'vertical-garden-city.md': [
    ['a residential mega-tower', 'a [building type]'],
  ],
  'watercolor-dreamscape.md': [
    ['a single red fox', 'a single [your focal subject]'],
    ['indigo and burnt sienna palette', '[your color palette]'],
  ],
  'weathered-storyteller.md': [
    ['an elderly fisherman\'s face', 'an elderly [your subject]\'s face'],
  ],
  'woodblock-print-storm.md': [
    ['a modern container ship', 'a [your subject/vessel]'],
  ],

  // === SKILLS ===
  'chain-of-thought-mastery.md': [
    ['"Let\'s think step by step"', '"Let\'s think step by step" to [your task/problem]'],
  ],
  'context-window-strategy.md': [
    ['large documents into overlapping segments', '[your content type] into overlapping segments'],
  ],
  'error-recovery-patterns.md': [
    ['after generation, ask the model to fact-check its own output against the source', 'after generation, ask the model to fact-check its own output on [your topic/domain]'],
  ],
  'evaluation-and-benchmarking.md': [
    ['create 20+ diverse test inputs', 'create 20+ diverse test inputs for [your use case]'],
  ],
  'few-shot-learning-patterns.md': [
    ['Provide 3-5 input/output pairs before your actual query.', 'Provide 3-5 input/output pairs for [your task] before your actual query.'],
  ],
  'multi-agent-orchestration.md': [
    ['A "Researcher" feeds a "Writer" which feeds an "Editor."', 'A "[your agent role 1]" feeds a "[your agent role 2]" which feeds a "[your agent role 3]."'],
  ],
  'output-formatting-mastery.md': [
    ['specify the exact schema with field names and types', 'specify the exact schema for [your output format]'],
  ],
  'prompt-engineering-101.md': [
    ['parts of the input', 'parts of [your input/prompt]'],
  ],
  'system-prompt-architecture.md': [
    ['who is the AI? Define role, expertise, and personality', 'who is the AI? Define role as [your AI role], expertise, and personality'],
  ],
  'token-optimization.md': [
    ['summarize background information instead of pasting raw text', 'summarize [your context/background] instead of pasting raw text'],
  ],

  // === REMAINING SKILLS (educational/framework content — add contextual variables) ===
  'blue-ocean-strategy.md': [
    ['for your industry', 'for [your industry]'],
  ],
  'decision-tree-analysis.md': [
    ['what choice are you making?', 'what choice are you making about [your decision]?'],
  ],
  'first-principles-thinking.md': [
    ['Identify the problem.', 'Identify the problem: [your problem].'],
  ],
  'mental-model-stacking.md': [
    ['take any problem and analyze it', 'take [your problem] and analyze it'],
  ],
  'scenario-planning.md': [
    ['the two most impactful uncertainties facing your situation', 'the two most impactful uncertainties facing [your situation/organization]'],
  ],
  'second-order-thinking.md': [
    ['Identify the action and its immediate consequence', 'Identify the action ([your action/decision]) and its immediate consequence'],
  ],
  'the-80-20-principle.md': [
    ['list all inputs (customers, features, tasks, employees)', 'list all inputs for [your domain] (customers, features, tasks, employees)'],
  ],
  'the-eisenhower-matrix.md': [],  // Pure educational framework
  'the-flywheel-effect.md': [
    ['what success feeds back into more success?', 'what success in [your business/project] feeds back into more success?'],
  ],
  'the-hook-formula.md': [],  // Writing technique reference
  'the-inversion-method.md': [
    ['Define the desired outcome.', 'Define the desired outcome: [your goal].'],
  ],
  'the-power-of-brevity.md': [],  // Writing technique reference
  'the-three-act-structure.md': [],  // Narrative framework reference

  // === REMAINING SKILLS (design/technical — add contextual variables) ===
  'accessibility-first.md': [
    ['every interactive element', 'every interactive element in [your application]'],
  ],
  'color-psychology.md': [
    ['the CTA button must contrast', 'the CTA button in [your design/project] must contrast'],
  ],
  'design-systems-fundamentals.md': [
    ['the atoms: colors, spacing, typography, shadows, radii', 'the atoms for [your product/brand]: colors, spacing, typography, shadows, radii'],
  ],
  'grid-systems.md': [
    ['divide the page into 4, 8, or 12 columns', 'divide [your layout] into 4, 8, or 12 columns'],
  ],
  'information-architecture.md': [
    ['give users cards with content labels', 'give users of [your product] cards with content labels'],
  ],
  'micro-interactions.md': [],  // Technical reference patterns
  'motion-design-principles.md': [],  // Design principles reference
  'responsive-design-patterns.md': [
    ['start with the smallest screen', 'start [your project] with the smallest screen'],
  ],
  'typography-fundamentals.md': [],  // Design fundamentals reference
  'visual-hierarchy.md': [],  // Brief tip - already concise

  // === WRITING SKILLS ===
  'art-of-narrative-voice.md': [
    ['the target audience emotion', 'the target audience emotion for [your story/project]'],
  ],
  'dialogue-dynamics.md': [],  // Writing craft reference
  'editing-as-craft.md': [],  // Writing process reference
  'sensory-writing-craft.md': [],  // Writing technique reference
  'show-dont-tell.md': [],  // Writing advice reference
  'subtext-and-implication.md': [],  // Writing technique reference
  'world-building-foundations.md': [
    ['define one thing that is different from our world', 'define one thing that is different in [your world/setting]'],
  ],
};

let totalReplacements = 0;
let filesModified = 0;

for (const [filename, replacements] of Object.entries(REPLACEMENTS)) {
  if (!replacements || replacements.length === 0) continue;

  const filePath = path.join(CONTENT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filename}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
      modified = true;
      totalReplacements++;
    } else {
      console.warn(`  Pattern not found in ${filename}: "${search.substring(0, 50)}..."`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesModified++;
    console.log(`Updated: ${filename}`);
  }
}

console.log(`\nDone! Modified ${filesModified} files with ${totalReplacements} replacements.`);
