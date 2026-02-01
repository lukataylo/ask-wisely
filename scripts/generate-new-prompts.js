/**
 * One-time script to generate all new prompt markdown files (Tiers 1-3).
 * Run: node scripts/generate-new-prompts.js
 */
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/prompts');

const PROMPTS = [
  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — New Technique Skills (Engineering)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'zero-shot-mastery',
    title: 'Zero-Shot Mastery',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Craft precise instructions that produce accurate results without any examples.',
    skills: ['Zero-Shot', 'Instruction Design', 'Clarity'],
    body: `Zero-shot prompting is the foundation — no examples, just clear instruction. Techniques: 1. Task Definition — state exactly what you want in the first sentence. "Classify the following review as positive, negative, or neutral." 2. Format Specification — define the output shape. "Respond with only the label, no explanation." 3. Constraint Framing — set boundaries. "Use only information provided. Do not infer." 4. Role Priming — "You are an expert [your domain] analyst" activates relevant knowledge without examples. 5. Instruction Ordering — put the most important constraint first. Models attend most to the beginning. 6. Negative Constraints — "Do NOT include..." is often more effective than "Only include..." Zero-shot works best when the task is well-defined and the model has strong prior knowledge. When accuracy drops, add examples (few-shot) or reasoning (CoT). The art is knowing which technique to reach for.`,
  },
  {
    id: 'react-reasoning-acting',
    title: 'ReAct Framework',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Combine reasoning with tool use for tasks requiring real-time information gathering.',
    skills: ['ReAct', 'Tool Use', 'Agent Design'],
    body: `ReAct (Reasoning + Acting) combines thinking with doing. The loop: Thought → Action → Observation → Thought. Structure: 1. Thought — the model reasons about what it knows and what it needs. "I need to find the current data on [your topic] to answer this." 2. Action — the model calls a tool or performs a step. "Search: [your query]." 3. Observation — the result comes back with new information. 4. Repeat — the model reasons about the new information and decides the next action. Implementation: Use explicit labels in your prompt: "Thought: [your reasoning]. Action: [what to do]. Observation: [what you learned]." ReAct outperforms pure CoT on tasks requiring external knowledge because it grounds reasoning in real data. Key principle: the model should explain WHY it needs information before requesting it. This prevents aimless tool calls and keeps reasoning on track.`,
  },
  {
    id: 'tree-of-thought',
    title: 'Tree of Thought',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Explore multiple reasoning paths before committing to improve planning and creative tasks.',
    skills: ['Tree-of-Thought', 'Exploration', 'Planning'],
    body: `Tree-of-Thought (ToT) explores multiple reasoning paths before committing. Unlike Chain-of-Thought (one linear path), ToT branches: 1. Generate — propose 3-5 different approaches to [your problem]. 2. Evaluate — for each approach, assess feasibility and likelihood of success (score 1-10). 3. Expand — take the top 2-3 and develop each one step further. 4. Prune — eliminate paths that hit dead ends or contradictions. 5. Select — choose the path with the strongest reasoning chain. Prompt template: "Consider this problem: [your problem]. Generate three distinct solution approaches. For each, take one reasoning step. Evaluate which approach is most promising and explain why. Continue only with the best path." ToT excels at planning, creative problems, and puzzles where the first intuition is often wrong. The cost is more tokens — use it when accuracy matters more than speed.`,
  },
  {
    id: 'self-consistency-sampling',
    title: 'Self-Consistency Sampling',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Sample multiple reasoning paths and take the majority answer for improved reliability.',
    skills: ['Self-Consistency', 'Reliability', 'Voting'],
    body: `Self-consistency improves accuracy by sampling multiple reasoning paths and taking the majority answer. Process: 1. Run the same prompt 3-5 times with temperature > 0 (0.5-0.7 works well). 2. Extract the final answer from each response. 3. Take the majority vote — the most common answer wins. Why it works: different reasoning paths may make different intermediate errors, but the correct final answer appears most often. Implementation without API calls: use a single prompt — "Solve [your problem] three different ways. For each way, show your work and state your final answer. Then compare your three answers and state which one you are most confident in." Self-consistency is most powerful on math, logic, and factual questions. It is less useful for creative tasks where there is no single correct answer. Combine with CoT for maximum effect: CoT provides the reasoning, self-consistency provides the reliability.`,
  },
  {
    id: 'step-back-prompting',
    title: 'Step-Back Prompting',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Derive general principles before solving specific problems to reduce errors by 36%.',
    skills: ['Abstraction', 'Step-Back', 'Reasoning'],
    body: `Step-back prompting asks the model to derive a general principle before solving the specific problem. Process: 1. Present [your specific question]. 2. Before answering, ask: "What is the general principle or concept behind this question?" 3. Have the model answer the general question first. 4. Then apply that principle to the specific case. Example — Specific: "What happens to the pressure of an ideal gas if I double the temperature and halve the volume?" Step-back: "What are the physics principles governing ideal gas behavior?" The model retrieves PV=nRT, then applies it correctly. Why it works: specific questions trigger pattern matching (which can be wrong). Abstract questions trigger deeper knowledge retrieval. Step-back prompting reduces errors on physics and chemistry benchmarks significantly. Use it whenever the question has an underlying framework the model might skip over in its rush to answer.`,
  },
  {
    id: 'least-to-most-decomposition',
    title: 'Least-to-Most Decomposition',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Break complex problems into subproblems and solve from simplest to hardest, building up.',
    skills: ['Decomposition', 'Scaffolding', 'Complexity'],
    body: `Least-to-most prompting breaks complex problems into subproblems, solving the easiest first and building up. Two phases: Phase 1 — Decomposition: "Break [your complex problem] into the simplest possible sub-problems, ordered from easiest to hardest." Phase 2 — Sequential solving: solve each sub-problem using the answers to all previous sub-problems as context. Example — "How much would it cost to build a SaaS product for 10,000 users?" Decomposition: (1) What infrastructure is needed? (2) What are the compute costs per user? (3) What are the storage costs? (4) What team is needed? (5) What is the total cost model? Solve each in order. Key differences from CoT: CoT reasons within a single prompt. Least-to-most explicitly scaffolds — each answer feeds the next. This prevents the model from skipping steps or making compounding errors. Best for: math word problems, multi-step planning, architectural decisions, and any problem where later steps depend on earlier answers.`,
  },
  {
    id: 'prompt-chaining-pipelines',
    title: 'Prompt Chaining Pipelines',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Connect multiple prompts into pipelines where each step feeds the next for complex workflows.',
    skills: ['Chaining', 'Pipelines', 'Orchestration'],
    body: `Prompt chaining connects multiple prompts into a pipeline where each step's output feeds the next. Architecture patterns: 1. Sequential Chain — A → B → C. Example: Research → Draft → Edit → Format. 2. Branching Chain — A → [B1, B2, B3] → C (merge). Generate three perspectives, then synthesize. 3. Validation Chain — A → B (validate) → if fail, A (retry). 4. Refinement Loop — A → B (critique) → A (revise) → B (critique) until pass. Design principles for [your workflow]: Each step should have a single, clear responsibility. Define the exact output format of each step so the next step can parse it. Include error handling: "If the input doesn't contain X, respond with ERROR: [reason]." Keep each step's context window focused — summarize prior steps rather than passing full transcripts. Chaining outperforms single mega-prompts because each step gets full attention on a narrower task. The tradeoff is latency and cost — use chaining when quality matters more than speed.`,
  },
  {
    id: 'contrastive-prompting',
    title: 'Contrastive Prompting',
    type: 'Skills',
    category: 'Engineering',
    shortDescription: 'Show both good and bad examples to sharpen output quality and define clear boundaries.',
    skills: ['Contrastive Learning', 'Boundaries', 'Quality'],
    body: `Contrastive prompting sharpens output quality by showing both good and bad examples. Structure: "Here is an excellent example of [your task]: [good example]. Here is a poor example of the same task: [bad example]. Notice the differences in [specific quality dimensions]. Now produce output that matches the excellent example's quality." Why it works: positive-only examples leave the boundaries undefined — the model knows what to aim for but not what to avoid. Contrastive pairs define both the target and the boundary. Advanced technique — self-contrast: 1. Ask the model to generate a response. 2. Ask it to generate a deliberately bad version. 3. Ask it to articulate the differences. 4. Ask it to generate a final version that maximizes the good qualities. Dimensions to contrast: specificity vs. vagueness, evidence-based vs. opinion, actionable vs. abstract, concise vs. verbose. Contrastive prompting is especially effective for subjective tasks (writing, design feedback, code review) where quality is hard to define but easy to compare.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — Product Management (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-prd-architect',
    title: 'The PRD Architect',
    type: 'Prompts',
    category: 'Product',
    shortDescription: 'Write comprehensive product requirements documents ready for engineering handoff.',
    skills: ['Product Requirements', 'Documentation', 'Specifications'],
    body: `Act as a Senior Product Manager at a top tech company. I will describe a feature idea for [your product]. Write a comprehensive Product Requirements Document: 1. Problem Statement — what user pain does this solve? Include evidence. 2. Success Metrics — define 3-5 measurable KPIs with targets. 3. User Stories — write 5-8 stories in "As a [user], I want [action], so that [value]" format. 4. Functional Requirements — numbered list with priority (P0/P1/P2). 5. Non-Functional Requirements — performance, security, accessibility, scalability. 6. Scope — explicitly state what is IN and OUT of scope. 7. Dependencies and Risks — what could block or delay this? 8. Open Questions — what still needs to be answered before building? Format as a structured specification document ready for engineering handoff.`,
  },
  {
    id: 'the-user-story-crafter',
    title: 'The User Story Crafter',
    type: 'Prompts',
    category: 'Product',
    shortDescription: 'Generate complete user stories with acceptance criteria and implementation order.',
    skills: ['User Stories', 'Acceptance Criteria', 'Agile'],
    body: `Act as a product owner with deep expertise in [your domain]. I will describe a feature. Generate a complete set of user stories: 1. Identify all user personas who interact with this feature. 2. For each persona, write 3-5 user stories using the format: "As a [persona], I want [action], so that [benefit]." 3. For each story, write acceptance criteria using Given/When/Then format. 4. Estimate story points (1, 2, 3, 5, 8) and justify each estimate. 5. Identify dependencies between stories and suggest an implementation order. 6. Flag edge cases that need separate stories. 7. Write one "unhappy path" story for each persona — what happens when things go wrong? Prioritize using MoSCoW (Must/Should/Could/Won't) and explain your reasoning.`,
  },
  {
    id: 'the-prioritization-engine',
    title: 'The Prioritization Engine',
    type: 'Prompts',
    category: 'Product',
    shortDescription: 'Apply RICE, Value/Effort, and Kano frameworks to rank your product backlog.',
    skills: ['Prioritization', 'RICE', 'Frameworks'],
    body: `Act as a VP of Product who has shipped products used by millions. I will describe [your product backlog or feature list]. Apply three prioritization frameworks and compare results: 1. RICE Scoring — for each feature, estimate Reach, Impact (0.25/0.5/1/2/3), Confidence (50-100%), and Effort (person-months). Calculate the RICE score. 2. Value vs. Effort Matrix — plot each feature on a 2x2 grid. Identify your quick wins, big bets, incremental improvements, and money pits. 3. Kano Model — classify each feature as Basic (expected), Performance (linear satisfaction), or Delighter (unexpected joy). Synthesize: where do all three frameworks agree? That is your highest-confidence priority. Where do they disagree? Explain why and make a recommendation. Output a ranked roadmap with quarterly milestones.`,
  },
  {
    id: 'the-competitive-analyst',
    title: 'The Competitive Analyst',
    type: 'Prompts',
    category: 'Product',
    shortDescription: 'Conduct thorough competitive analysis with feature matrices and strategic responses.',
    skills: ['Competitive Analysis', 'Market Intel', 'Strategy'],
    body: `Act as a competitive intelligence analyst. I will describe [your product] and its market. Conduct a thorough competitive analysis: 1. Identify the top 5 competitors (direct and indirect) and justify your selection. 2. For each competitor, analyze: positioning, target segment, pricing model, key differentiators, and weaknesses. 3. Build a feature comparison matrix across the most critical capabilities. 4. Map each competitor's likely next move based on their recent actions and hiring patterns. 5. Identify the "white space" — capabilities no competitor offers well. 6. Assess switching costs and lock-in mechanisms for each competitor. 7. Recommend three strategic responses: one defensive, one offensive, one flanking. Support each claim with reasoning. Flag where you are speculating vs. analyzing.`,
  },
  {
    id: 'the-product-strategist',
    title: 'The Product Strategist',
    type: 'Prompts',
    category: 'Product',
    shortDescription: 'Assess product-market fit, moats, and growth models with a strategic advisor.',
    skills: ['Product Strategy', 'Vision', 'Roadmap'],
    body: `You are a product strategy advisor who has guided products from 0-to-1 and from 1-to-N. I will describe [your product vision and current state]. Help me think through: 1. Product-Market Fit assessment — what signals suggest we have it (or don't)? 2. The Jobs-to-be-Done framework — what job is the user hiring this product for? 3. Moat analysis — what is defensible? Network effects, data, brand, switching costs, or technology? 4. Growth model — is this product-led, sales-led, or community-led? Why? 5. Platform vs. feature risk — are we a feature of someone else's platform? 6. The anti-roadmap — what should we explicitly NOT build, and why? 7. The one-metric-that-matters — if I could track only one number, what should it be? Challenge my assumptions. Tell me what I am likely wrong about.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — Data Science (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-data-cleaner',
    title: 'The Data Cleaner',
    type: 'Prompts',
    category: 'Data',
    shortDescription: 'Design comprehensive data cleaning pipelines with validation and monitoring strategies.',
    skills: ['Data Cleaning', 'ETL', 'Quality'],
    body: `Act as a senior data engineer. I will describe [your dataset and its issues]. Design a comprehensive data cleaning pipeline: 1. Profile the data — what are the expected types, ranges, and distributions for each column? 2. Identify quality issues: missing values, duplicates, outliers, inconsistent formats, and encoding problems. 3. For each issue, recommend a handling strategy (impute, drop, transform, flag) with justification. 4. Write the cleaning steps in order of dependency — which must happen first? 5. Define data validation rules that should run after cleaning. 6. Recommend a strategy for monitoring data quality over time. 7. Estimate what percentage of rows will survive cleaning and whether the remaining data is still representative. Show your reasoning for each decision. Explain the tradeoff between data loss and data quality.`,
  },
  {
    id: 'the-ml-model-selector',
    title: 'The ML Model Selector',
    type: 'Prompts',
    category: 'Data',
    shortDescription: 'Choose the right modeling approach with baseline strategy and deployment considerations.',
    skills: ['Machine Learning', 'Model Selection', 'Evaluation'],
    body: `Act as a machine learning architect. I will describe [your prediction task and data characteristics]. Recommend the right modeling approach: 1. Frame the problem — is this classification, regression, clustering, ranking, or anomaly detection? 2. Assess data readiness — volume, feature types, label quality, class balance. 3. Recommend three candidate models ordered from simplest to most complex. For each: explain why it fits, expected performance range, training cost, and interpretability. 4. Baseline strategy — what naive model should we beat first? 5. Feature engineering suggestions — what derived features might improve performance? 6. Evaluation plan — which metrics to use (and which to avoid) given the business context. 7. Deployment considerations — latency requirements, retraining frequency, monitoring strategy. Start simple. Justify every step up in complexity.`,
  },
  {
    id: 'the-eda-navigator',
    title: 'The EDA Navigator',
    type: 'Prompts',
    category: 'Data',
    shortDescription: 'Guide thorough exploratory data analysis from first questions to executive headlines.',
    skills: ['Exploratory Analysis', 'Statistics', 'Visualization'],
    body: `Act as a data scientist starting a new analysis. I will describe [your dataset and analysis goals]. Guide me through a thorough exploratory data analysis: 1. First questions — what are the five most important questions this data can answer? 2. Univariate analysis — for each key variable, what distribution do you expect, and what chart type reveals it best? 3. Bivariate analysis — which variable pairs should I cross-tabulate or correlate, and why? 4. Temporal patterns — if time-series data exists, what trends, seasonality, or structural breaks should I look for? 5. Segmentation — what natural groupings might exist in the data? 6. Red flags — what patterns would indicate data quality problems vs. genuine findings? 7. Summary — write the "executive headline" that this EDA would likely reveal. Think about what would surprise the stakeholder most.`,
  },
  {
    id: 'the-visualization-storyteller',
    title: 'The Visualization Storyteller',
    type: 'Prompts',
    category: 'Data',
    shortDescription: 'Design data visualizations that tell compelling stories with clarity over cleverness.',
    skills: ['Data Visualization', 'Storytelling', 'Charts'],
    body: `Act as a data visualization expert. I will describe [your data and audience]. Design a visualization strategy: 1. The headline — what is the single most important insight this data reveals? 2. Chart selection — for each finding, recommend the chart type and explain why alternatives would be worse. 3. Visual hierarchy — what should the viewer see first, second, third? 4. Annotation strategy — what context must be added directly to the chart? 5. Color encoding — what does each color represent, and is it colorblind-safe? 6. Common mistakes to avoid for this data type. 7. The "so what" test — for each chart, write the one-sentence takeaway that should appear as the title. Design for clarity over cleverness. Every pixel of ink should encode data or aid comprehension.`,
  },
  {
    id: 'the-statistical-detective',
    title: 'The Statistical Detective',
    type: 'Prompts',
    category: 'Data',
    shortDescription: 'Walk through hypothesis testing, effect sizes, and confidence intervals for rigorous analysis.',
    skills: ['Statistics', 'Hypothesis Testing', 'Inference'],
    body: `Act as a biostatistician. I will describe [your analysis question and data]. Walk me through the statistical analysis: 1. State the null and alternative hypotheses precisely. 2. Check assumptions — what must be true for the test to be valid? How do we verify? 3. Select the appropriate test and explain why alternatives are inferior. 4. Calculate or describe the expected test statistic and p-value interpretation. 5. Effect size — is the result practically significant, not just statistically significant? 6. Confidence intervals — report them and explain what they mean in plain language. 7. Limitations — what confounders, biases, or design flaws should we disclose? Write the results paragraph as it would appear in a peer-reviewed publication. Then translate it into one sentence a non-statistician would understand.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 1 — Marketing / Content (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-seo-strategist',
    title: 'The SEO Strategist',
    type: 'Prompts',
    category: 'Marketing',
    shortDescription: 'Build a complete SEO content strategy with keyword clusters and pillar-cluster models.',
    skills: ['SEO', 'Content Strategy', 'Keywords'],
    body: `Act as a head of SEO at a growth-stage company. I will describe [your website and target audience]. Build an SEO content strategy: 1. Keyword universe — identify 20 target keywords organized by intent (informational, navigational, transactional). 2. Content gap analysis — what topics do competitors rank for that we don't? 3. Pillar-cluster model — design 3 content pillars with 5-8 supporting articles each. 4. On-page optimization checklist for each piece — title tag, meta description, header structure, internal links. 5. Content brief template — write one full brief for the highest-priority article. 6. Technical SEO quick wins — site speed, schema markup, crawlability issues to check. 7. Measurement plan — which metrics indicate progress at 30, 60, and 90 days? Focus on sustainable organic growth over quick tricks.`,
  },
  {
    id: 'the-email-sequence-builder',
    title: 'The Email Sequence Builder',
    type: 'Prompts',
    category: 'Marketing',
    shortDescription: 'Design high-converting email sequences with segmentation and A/B testing strategies.',
    skills: ['Email Marketing', 'Copywriting', 'Automation'],
    body: `Act as an email marketing specialist who has optimized campaigns for [your industry]. I will describe my product and audience. Design a high-converting email sequence: 1. Sequence architecture — map the full journey: welcome, nurture, conversion, post-purchase. 2. For each email, provide: subject line (and one A/B variant), preview text, body structure, and CTA. 3. Timing — optimal send cadence with reasoning. 4. Segmentation strategy — how should the list be segmented and what triggers which sequence? 5. Personalization tokens — what dynamic content should vary per segment? 6. Win-back sequence — 3 emails for users who disengage. 7. Metrics framework — open rate, click rate, and conversion benchmarks for each email. Write subject lines that create curiosity without clickbait. Every email should provide value even if the reader never buys.`,
  },
  {
    id: 'the-social-media-architect',
    title: 'The Social Media Architect',
    type: 'Prompts',
    category: 'Marketing',
    shortDescription: 'Design a 30-day content strategy with platform-specific posts and engagement plans.',
    skills: ['Social Media', 'Content Calendar', 'Engagement'],
    body: `Act as a social media strategist. I will describe [your brand, audience, and goals]. Design a 30-day content strategy: 1. Platform selection — which 2-3 platforms deserve focus, and why? What to explicitly skip? 2. Content pillars — define 4-5 recurring themes with the ratio between them. 3. Content calendar — map out 30 days with post type, topic, format (carousel, video, text, story), and optimal posting time. 4. Engagement strategy — how to respond to comments, handle DMs, and build community. 5. Hashtag strategy — 3 tiers: branded, niche, and trending. 6. Repurposing framework — how does one piece of content become 5 across platforms? 7. Performance review template — what to measure weekly and what to adjust. Be specific about the content — write actual post copy for the first week, not just topic suggestions.`,
  },
  {
    id: 'the-copywriting-alchemist',
    title: 'The Copywriting Alchemist',
    type: 'Prompts',
    category: 'Marketing',
    shortDescription: 'Write high-converting copy with headlines, objection handling, and A/B test plans.',
    skills: ['Copywriting', 'Persuasion', 'A/B Testing'],
    body: `Act as a direct-response copywriter. I will describe [your product and target customer]. Write high-converting copy: 1. Headline — write 10 variants using different frameworks (PAS, AIDA, curiosity gap, social proof, specificity). 2. Value proposition — one sentence, under 15 words, that makes the reader think "that's exactly what I need." 3. Feature-to-benefit translation — take 5 product features and rewrite each as a customer benefit. 4. Social proof section — structure testimonials, case studies, and credibility markers. 5. Objection handling — identify the top 5 buying objections and write copy that neutralizes each. 6. CTA variations — write 5 call-to-action buttons with different psychological triggers. 7. A/B test plan — which two elements should be tested first, and what sample size is needed? Write at a sixth-grade reading level. Clear beats clever.`,
  },
  {
    id: 'the-content-strategist',
    title: 'The Content Strategist',
    type: 'Prompts',
    category: 'Marketing',
    shortDescription: 'Build a content strategy from audience personas to distribution and ROI models.',
    skills: ['Content Strategy', 'Audience', 'Distribution'],
    body: `Act as a VP of Content at a media company. I will describe [your brand and content goals]. Build a content strategy from the ground up: 1. Audience personas — define 3 reader personas with their information needs, preferred formats, and where they consume content. 2. Content audit — what framework should I use to evaluate existing content (keep, update, merge, kill)? 3. Editorial positioning — what unique angle do we own that no competitor can replicate? 4. Content formats — which formats (long-form, newsletter, podcast, video, tools) best serve each persona? 5. Distribution strategy — for each piece, what are the owned, earned, and paid channels? 6. Content operations — what team, tools, and workflow support sustainable output? 7. ROI model — how does content drive pipeline, and how do we attribute it? Strategy without distribution is a diary. Make sure every piece has a path to its audience.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — Commercial Image Prompts
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'luxury-product-hero',
    title: 'Luxury Product Hero',
    type: 'Image Prompts',
    category: 'Commercial',
    shortDescription: 'A dramatic studio hero shot with editorial lighting and luxury material backdrop.',
    skills: ['Product Photography', 'Lighting', 'Luxury'],
    body: `Studio hero shot of [your product] on a slab of raw [material, e.g. marble], dramatic side lighting casting long shadows, reflection visible on polished surface, shallow depth of field with creamy bokeh, minimalist composition with 70% negative space, [your color palette] tones, single accent light creating a rim highlight on the product edge, editorial luxury aesthetic, Phase One IQ4 150MP, f/4.0, 8k resolution, retouched to commercial perfection.`,
  },
  {
    id: 'flat-lay-essentials',
    title: 'Flat Lay Essentials',
    type: 'Image Prompts',
    category: 'Commercial',
    shortDescription: 'An overhead flat lay product arrangement with precise grid alignment and soft shadows.',
    skills: ['Flat Lay', 'Styling', 'E-Commerce'],
    body: `Overhead flat lay product photography of [your product collection] arranged in a precise grid pattern on [your background surface], each item casting a soft uniform shadow from diffused top lighting, color-coordinated props filling negative space — [accent items], ruler-straight alignment with 2cm gaps between objects, clean white margins, Instagram-ready square crop, soft natural daylight from north-facing window, Canon R5 tethered, f/8 for edge-to-edge sharpness, 8k, Kinfolk magazine aesthetic.`,
  },
  {
    id: 'packaging-showcase',
    title: 'Packaging Showcase',
    type: 'Image Prompts',
    category: 'Commercial',
    shortDescription: 'A dynamic 3D product packaging visualization with unboxing elements and brand identity.',
    skills: ['Packaging', '3D Render', 'Branding'],
    body: `3D product visualization of [your packaging type] floating at a dynamic 30-degree angle, [your brand colors] with [material finish — matte/gloss/metallic], clean typography visible on the front panel, soft studio lighting with three-point setup, subtle environment reflection on glossy surfaces, unboxing elements scattered below — tissue paper, stickers, thank-you card, [your background color] seamless backdrop, commercial CGI quality, octane render, 8k resolution, ready for Amazon hero image or Dribbble showcase.`,
  },
  {
    id: 'food-editorial-feast',
    title: 'Food Editorial Feast',
    type: 'Image Prompts',
    category: 'Commercial',
    shortDescription: 'Editorial food photography with styled imperfection, directional lighting, and rich textures.',
    skills: ['Food Photography', 'Styling', 'Mood'],
    body: `Editorial food photography of [your dish/cuisine] styled on [your tableware], overhead three-quarter angle, hero dish in sharp focus with supporting elements in soft bokeh — scattered [garnish/ingredients], vintage utensils, linen napkin with natural creases, warm directional lighting from the upper left creating texture-revealing shadows on the food surface, steam rising naturally, [your color palette] tones, styled imperfection — a crumb trail, a drip of sauce, Bon Appetit magazine quality, shot on medium format, f/3.5, 8k.`,
  },
  {
    id: 'cosmetics-beauty-shot',
    title: 'Cosmetics Beauty Shot',
    type: 'Image Prompts',
    category: 'Commercial',
    shortDescription: 'A macro beauty product shot with texture as the hero and clinical-meets-artistic precision.',
    skills: ['Beauty', 'Product', 'Texture'],
    body: `Macro beauty product photography of [your cosmetic product] with its texture as the hero — visible [texture type: cream swirl, powder dust, liquid droplet], floating in a [your background — gradient, water, silk], light refracting through the product creating [color] caustic patterns, clinical cleanliness with artistic flair, one perfect application element — a brush stroke, a finger swatch, a drip — frozen mid-action, bright even lighting with a single specular highlight, 8k hyperdetail, Glossier meets scientific precision aesthetic.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — Interface Image Prompts
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'dashboard-dark-mode',
    title: 'Dashboard Dark Mode',
    type: 'Image Prompts',
    category: 'Interface',
    shortDescription: 'An analytics dashboard in dark mode with glass morphism panels and real-time data charts.',
    skills: ['UI Design', 'Dashboard', 'Data Display'],
    body: `UI design mockup of a [your application type] analytics dashboard in dark mode, deep charcoal (#1a1a2e) background with [your accent color] highlights on key metrics, clean card-based layout with subtle glass morphism panels, real-time data charts — a large area chart as the hero, supporting bar charts and KPI cards, sidebar navigation with icon labels, avatar and notification bell in the top-right, Inter or SF Pro typeface, 8px grid spacing, data visualizations using [your color palette], subtle shadows and 1px borders, designed in Figma, 4K resolution, Apple design quality.`,
  },
  {
    id: 'mobile-app-concept',
    title: 'Mobile App Concept',
    type: 'Image Prompts',
    category: 'Interface',
    shortDescription: 'Three-screen mobile app flow showing onboarding through main experience in iOS style.',
    skills: ['Mobile Design', 'UX', 'App UI'],
    body: `Mobile app UI concept for a [your app type] application, three iPhone 15 Pro screens side by side showing onboarding, main view, and detail view, clean minimal design with [your color palette] accent colors on white background, bottom tab navigation with 5 icons, generous whitespace and 16px body text for readability, custom illustrations in [your illustration style] style, smooth rounded corners on all cards, status bar with realistic time and icons, subtle depth with layered shadows, SF Pro Display typeface, iOS Human Interface Guidelines compliant, Dribbble-quality presentation, 4K.`,
  },
  {
    id: 'landing-page-hero',
    title: 'Landing Page Hero',
    type: 'Image Prompts',
    category: 'Interface',
    shortDescription: 'A full SaaS landing page design with hero section, features, testimonials, and pricing.',
    skills: ['Web Design', 'Landing Page', 'Conversion'],
    body: `Full landing page design for [your product/service], hero section with a bold serif headline and supporting sans-serif subtext, [your accent color] primary CTA button with white text, hero image or 3D illustration of [your product visual] floating with a subtle shadow, trust badges row with company logos, three feature cards with icons below the fold, testimonial section with real photo avatars, pricing table with the recommended plan highlighted, sticky navigation with logo and CTA, designed on a 12-column grid, [your color palette] throughout, modern SaaS aesthetic, desktop viewport at 1440px width, 4K resolution.`,
  },
  {
    id: 'design-system-showcase',
    title: 'Design System Showcase',
    type: 'Image Prompts',
    category: 'Interface',
    shortDescription: 'A component library showcase with buttons, inputs, cards, and modals on a clean canvas.',
    skills: ['Design Systems', 'Components', 'UI Kit'],
    body: `Design system component showcase arranged on a [your background color] canvas, organized grid displaying: button variants (primary, secondary, ghost, destructive) in all states (default, hover, active, disabled), text input fields with labels and validation states, card components with image and text variants, toggle switches and checkboxes, modal dialog, dropdown menu expanded, toast notifications (success, error, info), avatar stack, badge collection, progress indicators, all using [your brand color] as the primary accent with a consistent 8px spacing grid, clean annotation arrows showing spacing tokens, Figma-style presentation, 4K.`,
  },
  {
    id: 'data-visualization-ui',
    title: 'Data Visualization UI',
    type: 'Image Prompts',
    category: 'Interface',
    shortDescription: 'An information dashboard with multiple chart types arranged in a bento grid layout.',
    skills: ['Data Viz', 'Charts', 'Information Design'],
    body: `Information dashboard showcasing multiple data visualization types for [your data domain], large hero visualization — a [chart type: sankey diagram, network graph, treemap] as the centerpiece, supporting charts arranged in a bento grid: line chart with gradient fill, horizontal bar chart with labels, donut chart with center metric, scatter plot with trend line, heat map calendar, all sharing a cohesive [your color palette] with sequential and diverging scales, dark or light theme with excellent contrast ratios, clean axis labels in a monospace typeface, interactive hover states shown on one chart, 4K resolution.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — Personal / Productivity (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-decision-journal',
    title: 'The Decision Journal',
    type: 'Prompts',
    category: 'Personal',
    shortDescription: 'Structure a decision journal entry to improve judgment through reflection and pre-mortems.',
    skills: ['Decision Making', 'Reflection', 'Journaling'],
    body: `You are a cognitive behavioral coach. Help me create a decision journal entry for [your decision]. Structure the entry: 1. The Decision — state it precisely in one sentence. 2. Context — what is the situation and what triggered this decision point? 3. Options — list every option I considered (including "do nothing"). 4. Mental State — what emotions am I feeling right now that could bias me? Am I deciding under stress, excitement, or fatigue? 5. Expected Outcomes — for my chosen option, what do I expect to happen in 1 week, 1 month, 1 year? 6. Pre-Mortem — if this decision fails, what was the most likely cause? 7. Reversal Test — what would have to be true for me to choose the opposite? 8. Review Date — when should I revisit this entry to evaluate the outcome? Write in second person to encourage honest self-examination.`,
  },
  {
    id: 'the-weekly-reviewer',
    title: 'The Weekly Reviewer',
    type: 'Prompts',
    category: 'Personal',
    shortDescription: 'Run a thorough weekly review covering wins, misses, energy audits, and next priorities.',
    skills: ['Productivity', 'Weekly Review', 'GTD'],
    body: `You are a productivity coach trained in GTD and deep work principles. Guide me through a thorough weekly review for [your role/context]. The review should cover: 1. Capture — what loose threads, tasks, and commitments are floating in my head? Get them all out. 2. Wins — what did I accomplish this week that I should acknowledge? 3. Misses — what did I commit to but not complete? For each, why? Be honest. 4. Energy Audit — what activities gave me energy vs. drained me? 5. Next Week's Priorities — identify the three most important outcomes for next week. For each, what is the very next physical action? 6. Calendar Review — scan the next 14 days. What needs preparation? 7. Waiting For — who owes me something, and do I need to follow up? 8. Someday/Maybe — anything to add to or remove from the long-term list? Keep the output scannable. Use bullet points, not paragraphs.`,
  },
  {
    id: 'the-goal-decomposer',
    title: 'The Goal Decomposer',
    type: 'Prompts',
    category: 'Personal',
    shortDescription: 'Break ambitious goals into milestones, weekly habits, and accountability structures.',
    skills: ['Goal Setting', 'Planning', 'Execution'],
    body: `Act as a strategic planning consultant for personal goals. I will share [your goal]. Break it down into an actionable plan: 1. Goal Clarity — rewrite my goal to be specific, measurable, and time-bound. 2. Success Criteria — how will I objectively know when I have achieved this? 3. Milestone Map — break the goal into 4-6 milestones, each building on the last. 4. For each milestone, define the weekly habits and one-time actions required. 5. Bottleneck Prediction — what is the most likely point of failure, and what is the contingency? 6. Environment Design — what changes to my environment would make the default behavior the desired one? 7. Accountability Structure — what system ensures I stay on track when motivation fades? 8. Anti-Goals — what should I explicitly NOT pursue while working toward this? Focus on systems over outcomes. The goal is the direction; the system is the vehicle.`,
  },
  {
    id: 'the-habit-architect',
    title: 'The Habit Architect',
    type: 'Prompts',
    category: 'Personal',
    shortDescription: 'Design evidence-based habit systems with cue design, tracking, and progressive difficulty.',
    skills: ['Habits', 'Behavior Design', 'Systems'],
    body: `You are a behavioral scientist specializing in habit formation. I want to build [your desired habit]. Design a habit system using evidence-based principles: 1. Cue Design — what existing routine will this habit attach to? Be specific about time, location, and preceding action. 2. Craving — what reward does the brain anticipate? How do we make the habit attractive? 3. Response — make the first version embarrassingly small. What is the two-minute version? 4. Reward — what immediate positive feedback follows completion? 5. Tracking Method — what simple system records consistency without becoming a chore? 6. Failure Protocol — when I miss a day, what is the exact recovery rule? (Never miss twice.) 7. Identity Shift — reframe: I am not "trying to [habit]" — I am "someone who [identity]." 8. 30/60/90 Day Progression — how does the habit evolve as it becomes automatic? Design for consistency, not intensity.`,
  },
  {
    id: 'the-life-auditor',
    title: 'The Life Auditor',
    type: 'Prompts',
    category: 'Personal',
    shortDescription: 'Conduct an honest life audit across all domains with gap analysis and bold move planning.',
    skills: ['Self-Assessment', 'Balance', 'Priorities'],
    body: `You are a life design coach. Help me conduct an honest life audit for [your current life situation]. Evaluate each domain: 1. Rate each area 1-10 with a one-sentence justification: Health, Relationships, Career, Finances, Learning, Fun/Recreation, Physical Environment, Personal Growth. 2. Highlight the two domains with the biggest gap between current and desired state. 3. For each gap, identify the one lever that would create the most improvement. 4. Identify where over-investment in one domain is causing under-investment in another. 5. The Deathbed Test — if I continue exactly as I am for 10 years, what will I regret? 6. Energy Allocation — where does my time actually go vs. where I say my priorities are? 7. One Bold Move — what single change would have the most positive cascading effect? Be direct. Comfortable truths are worthless in an audit.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 2 — Communication Skills
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'presentation-architecture',
    title: 'Presentation Architecture',
    type: 'Skills',
    category: 'Communication',
    shortDescription: 'Structure presentations using narrative frameworks that hold attention and drive action.',
    skills: ['Presentations', 'Structure', 'Storytelling'],
    body: `Presentation structure is narrative architecture. Frameworks: 1. The Pyramid Principle (Minto) — lead with the answer, then support with arguments, then evidence. Executives read top-down. 2. The Situation-Complication-Resolution (SCR) — set context, introduce the tension, deliver the solution. Every great presentation is a story. 3. The Rule of Three — three main points, three supporting details each. The brain chunks information in threes. 4. Slide Architecture — one idea per slide, six words per bullet maximum, full-bleed images over clip art. 5. The Assertion-Evidence Model — the slide title IS the insight ("Revenue grew 40% in Q3"), the body is the supporting chart. Never use a noun phrase as a title ("Q3 Revenue"). 6. The Opening — start with a question, a surprising stat, or a story. Never start with an agenda slide. 7. The Close — end with a clear ask and a memorable callback to your opening. Design slides for the back row. If they can't read it from 20 feet away, there's too much text.`,
  },
  {
    id: 'executive-summary-craft',
    title: 'Executive Summary Craft',
    type: 'Skills',
    category: 'Communication',
    shortDescription: 'Write executive summaries that lead with the recommendation and respect the reader\'s time.',
    skills: ['Executive Communication', 'Brevity', 'Clarity'],
    body: `Executive summaries are the highest-leverage writing in business. Structure: 1. The BLUF (Bottom Line Up Front) — state the recommendation or conclusion in the first sentence. Not the background, not the context — the answer. 2. The Context Line — one sentence of essential background. Only what the reader needs to evaluate the recommendation. 3. Three Supporting Points — the strongest evidence, each in one sentence. 4. The Ask — what action is needed, by whom, by when? 5. The Risk Line — the single biggest risk of action AND inaction. Length rules: if it is over one page, it is not a summary. If the first paragraph does not contain the recommendation, rewrite it. The test: a busy executive who reads only the first sentence should know what you want. An executive who reads the whole thing should be able to make a decision. Respect their time — it is the most expensive resource in the room.`,
  },
  {
    id: 'async-communication-mastery',
    title: 'Async Communication Mastery',
    type: 'Skills',
    category: 'Communication',
    shortDescription: 'Master written async communication with context-first messages and decision summaries.',
    skills: ['Remote Work', 'Written Communication', 'Clarity'],
    body: `Async communication is the default mode of modern work. Principles: 1. Write for Scanning — use headers, bullets, and bold for key points. No one reads walls of text. 2. Lead with Context — "I am writing about X because Y needs to happen by Z." Three seconds to orient the reader. 3. Separate Information from Action — use clear labels: "[FYI]", "[Action Required]", "[Decision Needed]", "[Blocking]". 4. Include the Deadline — "Please review by Thursday 5pm ET" not "when you get a chance." 5. Provide Enough Context to Decide — do not force a reply just to ask clarifying questions. Include options: "I recommend A because X. Alternative B would Y. Which do you prefer?" 6. One Thread, One Topic — never hijack threads. 7. Summarize Decisions — every discussion should end with someone writing "Decision: [X]. Next step: [Y]. Owner: [Z]." Async done well is faster than meetings. Async done poorly is slower than carrier pigeons.`,
  },
  {
    id: 'difficult-conversations-framework',
    title: 'Difficult Conversations Framework',
    type: 'Skills',
    category: 'Communication',
    shortDescription: 'Navigate difficult conversations by separating impact from intent and using the AND stance.',
    skills: ['Conflict Resolution', 'Feedback', 'Courage'],
    body: `Every important conversation feels difficult before it happens. Framework: 1. The Three Conversations — every difficult conversation is actually three: What happened (facts), Feelings (emotions), and Identity (what this means about who I am). Address all three. 2. Start from the Third Story — not your version, not theirs, but the neutral observer's. "It seems like we see this situation differently." 3. Separate Impact from Intent — "When you did X, the impact on me was Y" — not "You intended to hurt me." 4. The AND Stance — hold two truths simultaneously. "I understand you were under pressure AND the deadline was missed." 5. Ask before Telling — "Help me understand how you saw the situation." 6. Make it Safe — "I am raising this because I value [your relationship/this project], not because I want to criticize." 7. Agree on Next Steps — never end without a clear, shared commitment. Practice the first sentence out loud before the conversation. The opening determines the trajectory.`,
  },
  {
    id: 'active-listening-framework',
    title: 'Active Listening Framework',
    type: 'Skills',
    category: 'Communication',
    shortDescription: 'Train deep listening through mirroring, labeling emotions, and strategic silence.',
    skills: ['Listening', 'Empathy', 'Understanding'],
    body: `Listening is the most undervalued communication skill. Framework: 1. Level 1 — Internal Listening: You hear the words but are thinking about your response. This is where most people operate. Recognize it. 2. Level 2 — Focused Listening: Full attention on the speaker. Notice tone, pace, emotion, and word choice. No internal monologue. 3. Level 3 — Global Listening: You sense the whole environment — body language, energy, what is NOT being said. Techniques: 4. Mirroring — repeat the last 2-3 words as a question. "It felt overwhelming?" This keeps them talking without steering. 5. Labeling — name the emotion. "It sounds like you are frustrated." Naming an emotion reduces its intensity. 6. Summarize and Ask — "So the core issue is X, and you need Y. What am I missing?" 7. Strategic Silence — after they finish, wait 3 seconds before responding. They will often add the most important thing in that gap. The goal is not to have the right answer. The goal is to make the other person feel fully understood.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — Expanded Techniques (existing categories)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-socratic-debugger',
    title: 'The Socratic Debugger',
    type: 'Prompts',
    category: 'Technical',
    shortDescription: 'Debug code through guided questions that teach problem isolation without giving direct answers.',
    skills: ['Debugging', 'Socratic Method', 'Teaching'],
    body: `You are a senior engineer who never gives direct answers. Instead, you teach through questions. I will describe [your bug or code issue]. Guide me to the solution using only questions: 1. Start with a diagnostic question that helps me identify the category of bug (logic, state, timing, data, environment). 2. Ask what I expected to happen vs. what actually happened. 3. Ask me to identify the last point where the system behaved correctly. 4. Guide me to narrow the search space: "What would happen if you...?" 5. When I am close, ask me to articulate why the fix works, not just what the fix is. 6. If I go down a wrong path, ask a question that reveals the contradiction. Never say "the bug is X." Only ask questions. The learning should feel like discovery.`,
  },
  {
    id: 'the-assumption-auditor',
    title: 'The Assumption Auditor',
    type: 'Prompts',
    category: 'Business',
    shortDescription: 'Systematically destroy hidden assumptions in business plans through pre-mortems and stress tests.',
    skills: ['Self-Verification', 'Critical Analysis', 'Risk'],
    body: `Act as a board advisor with a reputation for finding what others miss. I will present [your business plan or strategy]. Your job is to systematically destroy my assumptions: 1. Identify every implicit assumption in my plan — the ones I stated AND the ones I did not realize I was making. 2. For each assumption, assess: how confident am I in this? What evidence supports it? What would falsify it? 3. Run the pre-mortem: "It is 12 months later and this failed spectacularly. Write the post-mortem." 4. Steelman the strongest counter-argument against my plan. 5. Identify the assumption that, if wrong, would cause the fastest and most catastrophic failure. 6. Recommend three low-cost experiments I could run this week to test my most fragile assumptions. 7. Tell me honestly: what is the most likely reason this will not work? Be uncomfortable. Comfortable advisors are worthless.`,
  },
  {
    id: 'the-reflective-writer',
    title: 'The Reflective Writer',
    type: 'Prompts',
    category: 'Creative',
    shortDescription: 'Develop metacognitive writing skills through guided self-reflection before receiving feedback.',
    skills: ['Meta-Cognitive', 'Self-Reflection', 'Craft'],
    body: `You are a writing mentor who focuses on metacognition — thinking about how you think while writing. I will share [your writing piece or challenge]. Before giving any advice, guide me through a reflective process: 1. Ask me to articulate what I was trying to achieve with this piece. What emotion, insight, or action? 2. Ask me where I felt the writing was working and where it felt forced. 3. Have me identify my default patterns — what do I always reach for? (Metaphors? Short sentences? Humor?) 4. Ask: "If you could only keep three paragraphs, which would they be and why?" 5. Prompt me to consider my reader's journey — where might their attention wander? 6. Before I revise, ask: "What are you afraid to cut?" That is usually what needs cutting. Only after this reflection, offer three specific craft suggestions. The goal is to build a writer who can self-edit, not one who depends on feedback.`,
  },
  {
    id: 'the-devils-advocate',
    title: "The Devil's Advocate",
    type: 'Prompts',
    category: 'Academic',
    shortDescription: 'Challenge arguments through steelmanning, counter-arguments, and falsifiability testing.',
    skills: ['Self-Verification', 'Counter-Arguments', 'Rigor'],
    body: `Act as a rigorous academic opponent. I will present [your thesis or argument]. Your sole job is to find its weaknesses: 1. Steelman my argument first — state it more clearly and forcefully than I did. This proves you understand it before attacking it. 2. Identify the three strongest counter-arguments, with evidence. 3. Find the logical fallacy I am closest to committing (even if I have not committed it yet). 4. Locate the weakest link in my evidence chain — what claim is most poorly supported? 5. Propose an alternative explanation that accounts for the same evidence. 6. Design the study or experiment that could disprove my thesis. 7. Give your honest assessment: is this argument strong enough to survive peer review? Intellectual rigor is kindness. Unchallenged ideas are unproven ideas.`,
  },
  {
    id: 'the-inquiry-architect',
    title: 'The Inquiry Architect',
    type: 'Prompts',
    category: 'Persona',
    shortDescription: 'Design Socratic inquiry sequences that lead groups to insights through questions alone.',
    skills: ['Socratic Method', 'Questioning', 'Facilitation'],
    body: `You are a master facilitator who leads groups to insights through questions alone. I will describe [your problem or discussion topic]. Design a Socratic inquiry sequence: 1. The Opening Question — broad enough to invite multiple perspectives, specific enough to prevent wandering. 2. The Deepening Question — when someone gives a surface answer, what question peels back the next layer? 3. The Assumption Question — "What would have to be true for that to be correct?" 4. The Counter Question — "Can you think of a case where the opposite is true?" 5. The Implication Question — "If that is true, what follows?" 6. The Synthesis Question — "How does that connect to what was said earlier about X?" 7. The Commitment Question — "Given everything we have discussed, what should we do differently?" For each question, explain the cognitive move it forces. The power of a question is in what it makes the other person think, not in the answer it produces.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — Legal (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-contract-reviewer',
    title: 'The Contract Reviewer',
    type: 'Prompts',
    category: 'Legal',
    shortDescription: 'Analyze contracts for red flags, hidden obligations, and negotiation priorities.',
    skills: ['Contract Analysis', 'Risk', 'Legal'],
    body: `Act as a corporate attorney reviewing [your contract type]. Analyze the contract I provide with this framework: 1. Summary — what are the essential terms in plain language? Who is obligated to do what? 2. Red Flags — identify clauses that are unusually one-sided, vague, or potentially harmful. 3. Key Risks — what could go wrong under this agreement? Focus on termination, liability, IP ownership, and indemnification. 4. Missing Provisions — what clauses would you expect to see that are absent? 5. Negotiation Priorities — rank the top 5 clauses I should push back on, with suggested alternative language. 6. Hidden Obligations — what commitments am I making that I might not realize? 7. Plain-Language Summary — rewrite the three most important clauses so a non-lawyer could understand them. Flag anything that requires jurisdiction-specific legal counsel. This analysis is not legal advice — it is an informed starting point.`,
  },
  {
    id: 'the-compliance-navigator',
    title: 'The Compliance Navigator',
    type: 'Prompts',
    category: 'Legal',
    shortDescription: 'Assess regulatory compliance readiness with gap analysis and audit preparation.',
    skills: ['Compliance', 'Regulation', 'Risk Management'],
    body: `Act as a compliance officer with expertise in [your industry/regulation]. I will describe my business operations. Assess compliance readiness: 1. Regulatory Landscape — what regulations apply to this business? List each with a one-sentence summary. 2. Gap Analysis — for each regulation, what is likely in compliance vs. at risk? 3. Priority Matrix — rank compliance risks by likelihood of enforcement and severity of penalty. 4. Quick Wins — what are the three easiest fixes that would materially reduce risk? 5. Documentation Gaps — what records, policies, or procedures are likely missing? 6. Training Needs — what must employees understand, and how should they be trained? 7. Audit Preparation — if a regulator appeared tomorrow, what would they find? This is an informational assessment, not legal advice. Engage qualified counsel for jurisdiction-specific compliance.`,
  },
  {
    id: 'the-legal-argument-builder',
    title: 'The Legal Argument Builder',
    type: 'Prompts',
    category: 'Legal',
    shortDescription: 'Structure legal arguments using IRAC methodology with counter-arguments and policy reasoning.',
    skills: ['Legal Analysis', 'Argumentation', 'Logic'],
    body: `Act as a legal research assistant. I will describe [your legal issue or dispute]. Structure a comprehensive legal argument: 1. Issue Statement — frame the legal question precisely. 2. Rule — identify the relevant legal principles, statutes, or precedents that govern this issue. 3. Application — apply the rules to the facts. Show how the facts satisfy (or fail to satisfy) each element. 4. Counter-Argument — what is the strongest argument the opposing side would make? 5. Rebuttal — how do I respond to that counter-argument? 6. Policy Argument — beyond the letter of the law, why does the desired outcome serve justice or public interest? 7. Conclusion — state the expected outcome based on the analysis. Use IRAC structure throughout. This is analytical assistance, not legal advice.`,
  },
  {
    id: 'the-policy-drafter',
    title: 'The Policy Drafter',
    type: 'Prompts',
    category: 'Legal',
    shortDescription: 'Draft clear, enforceable policy documents with definitions, provisions, and review cadence.',
    skills: ['Policy Writing', 'Terms of Service', 'Governance'],
    body: `Act as a legal writer who specializes in clear, enforceable policy documents. I will describe [your organization and policy needs]. Draft a policy document: 1. Purpose Statement — why does this policy exist? One sentence. 2. Scope — who does this apply to, and in what circumstances? 3. Definitions — define every term that could be interpreted ambiguously. 4. Core Provisions — numbered sections with clear, affirmative statements ("Employees shall..." not "It is expected that..."). 5. Exceptions — under what conditions do the rules not apply? 6. Enforcement — what happens when the policy is violated? Be specific about process and consequences. 7. Review Cadence — when is this policy reviewed and by whom? Write in plain language. If a sentence requires a law degree to understand, simplify it. Enforceability depends on clarity.`,
  },
  {
    id: 'the-regulatory-analyst',
    title: 'The Regulatory Analyst',
    type: 'Prompts',
    category: 'Legal',
    shortDescription: 'Analyze regulatory environments with classification, precedent analysis, and engagement strategies.',
    skills: ['Regulatory Analysis', 'Policy Impact', 'Strategy'],
    body: `Act as a regulatory affairs consultant. I will describe [your product or service and target market]. Analyze the regulatory environment: 1. Regulatory Map — which agencies, bodies, or frameworks have jurisdiction? 2. Classification — how would regulators likely classify this product/service, and what obligations follow? 3. Approval Pathway — what permits, licenses, or certifications are required? Estimate timeline and cost. 4. Precedent Analysis — how have similar products been treated by regulators? 5. Risk Scenarios — what regulatory actions could disrupt the business (new rules, enforcement actions, classification changes)? 6. Compliance-by-Design — what can be built into the product now to preempt regulatory requirements? 7. Engagement Strategy — should we engage regulators proactively? What are the risks and benefits? Frame regulatory compliance as a competitive advantage, not just a cost.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — Education (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-curriculum-designer',
    title: 'The Curriculum Designer',
    type: 'Prompts',
    category: 'Education',
    shortDescription: 'Design complete curricula with learning outcomes, assessments, and scaffolding plans.',
    skills: ['Curriculum Design', 'Learning Objectives', 'Pedagogy'],
    body: `Act as an instructional designer with expertise in [your subject area]. I will describe the course I want to build. Design a complete curriculum: 1. Learning Outcomes — write 5-8 outcomes using Bloom's Taxonomy verbs (analyze, evaluate, create — not "understand" or "learn about"). 2. Prerequisite Mapping — what must students already know? 3. Module Architecture — break the course into logical units. For each: title, learning objective, key concepts, and estimated time. 4. Pedagogical Strategy — lecture, discussion, project-based, flipped classroom? Justify for this content type. 5. Assessment Design — formative (during learning) and summative (final evaluation). Each assessment must map to a specific learning outcome. 6. Scaffolding Plan — how does complexity increase from module to module? 7. Differentiation — how do you support students who are ahead or behind? Design for mastery, not coverage. Less content deeply understood beats more content quickly forgotten.`,
  },
  {
    id: 'the-rubric-builder',
    title: 'The Rubric Builder',
    type: 'Prompts',
    category: 'Education',
    shortDescription: 'Build comprehensive grading rubrics with observable descriptors and self-assessment versions.',
    skills: ['Assessment', 'Rubrics', 'Evaluation Criteria'],
    body: `Act as an assessment specialist. I will describe [your assignment or project]. Build a comprehensive grading rubric: 1. Identify 4-6 assessment criteria, each tied to a specific learning outcome. 2. For each criterion, define 4 performance levels: Exemplary, Proficient, Developing, Beginning. 3. Each cell must contain observable, specific descriptors — not vague quality words. "Cites 5+ peer-reviewed sources with proper formatting" not "Good use of sources." 4. Weight each criterion by importance (must total 100%). 5. Include a row for "Above and Beyond" — what does exceptional work look like? 6. Write one sample piece of feedback for each performance level on the most important criterion. 7. Self-Assessment Version — adapt the rubric so students can evaluate their own work before submission. The rubric should make the grade unsurprising. If a student reads it carefully and follows it, they should earn an A.`,
  },
  {
    id: 'the-lesson-planner',
    title: 'The Lesson Planner',
    type: 'Prompts',
    category: 'Education',
    shortDescription: 'Design detailed lesson plans with hooks, guided practice, and formative assessments.',
    skills: ['Lesson Planning', 'Engagement', 'Instruction'],
    body: `Act as a master teacher with 20 years of classroom experience in [your subject]. I will describe what I need to teach. Design a detailed lesson plan: 1. Objective — by the end of this lesson, students will be able to [specific verb + content]. 2. Hook (5 min) — how do you grab attention in the first minute? Use a question, a demonstration, or a surprising fact. 3. Activation (5 min) — what do students already know? How do we surface and connect to prior knowledge? 4. Direct Instruction (15 min) — the core content. Chunked into 5-minute segments with a check-for-understanding after each. 5. Guided Practice (15 min) — students apply the concept with support. What activity? What scaffolding? 6. Independent Practice (10 min) — students work alone. What is the task and what does success look like? 7. Closure (5 min) — students summarize what they learned in their own words. 8. Assessment — how will you know they got it before they leave the room? Include one backup plan for when the lesson runs long or short.`,
  },
  {
    id: 'the-adaptive-quiz-master',
    title: 'The Adaptive Quiz Master',
    type: 'Prompts',
    category: 'Education',
    shortDescription: 'Design adaptive quiz sequences with branching logic and targeted remediation paths.',
    skills: ['Quiz Design', 'Adaptive Learning', 'Assessment'],
    body: `Act as an educational assessment designer. I will describe [your topic and student level]. Design an adaptive quiz sequence: 1. Diagnostic Entry — 3 questions that determine whether the student is beginner, intermediate, or advanced. 2. For each level, design a 10-question path that progressively increases in difficulty. 3. Question Types — mix: multiple choice (for recall), short answer (for application), and scenario-based (for analysis). 4. Branching Logic — if a student gets questions 1-3 correct, skip to question 6. If they miss 2+ in a row, branch to a remediation path. 5. Feedback Design — for each wrong answer, explain WHY it is wrong and point to the specific concept to review. 6. Mastery Gate — what score demonstrates mastery vs. needs reteaching? 7. Write all questions, answer options, correct answers, and explanations. Questions should test understanding, not memorization. If a student can answer by Googling, the question is too shallow.`,
  },
  {
    id: 'the-learning-path-architect',
    title: 'The Learning Path Architect',
    type: 'Prompts',
    category: 'Education',
    shortDescription: 'Build personalized self-directed learning paths with milestones and plateau prevention.',
    skills: ['Learning Design', 'Self-Directed', 'Progression'],
    body: `Act as an expert in self-directed learning design. I will describe [your learning goal and current level]. Build a personalized learning path: 1. Skills Audit — based on my goal, what sub-skills are required? Map the dependency tree. 2. Gap Assessment — given my current level, which sub-skills are the highest priority? 3. Resource Curation — for each priority skill, recommend the single best resource (book, course, tutorial, project) and explain why it beats the alternatives. 4. Practice Design — for each skill, define a deliberate practice exercise with clear success criteria. 5. Milestone Sequence — what should I be able to do after week 1, month 1, month 3? 6. Plateau Prevention — what are the common sticking points, and how do I push through each? 7. Accountability System — what evidence of progress should I produce weekly? Design for retention, not consumption. The goal is not to finish the resources but to build the skill.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — Healthcare (new Prompts category)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'the-clinical-reasoner',
    title: 'The Clinical Reasoner',
    type: 'Prompts',
    category: 'Healthcare',
    shortDescription: 'Walk through diagnostic reasoning from differential diagnosis to clinical decision points.',
    skills: ['Clinical Reasoning', 'Differential Diagnosis', 'Medicine'],
    body: `Act as a clinical reasoning tutor for medical education. I will describe [your patient presentation]. Walk through the diagnostic process: 1. Chief Complaint — restate the presenting concern in clinical terms. 2. Differential Diagnosis — generate a ranked list of possible diagnoses from most to least likely. For each, state the supporting and opposing evidence. 3. Critical Actions — what must be ruled out immediately due to life-threatening potential? 4. Diagnostic Workup — what tests, labs, or imaging would you order, and what would each result tell you? 5. Bayesian Reasoning — how does each test result shift the probability of each diagnosis? 6. Clinical Decision Point — based on the available information, what is the working diagnosis and next step? 7. Red Flags — what findings, if present, would change the entire approach? This is for educational purposes only. Always defer to qualified medical professionals for actual clinical decisions.`,
  },
  {
    id: 'the-patient-communicator',
    title: 'The Patient Communicator',
    type: 'Prompts',
    category: 'Healthcare',
    shortDescription: 'Explain medical topics at a 6th-grade reading level with analogies and action steps.',
    skills: ['Patient Communication', 'Health Literacy', 'Empathy'],
    body: `Act as a health communication specialist. I need to explain [your medical topic/diagnosis/procedure] to a patient. Help me communicate effectively: 1. Teach-Back Statement — explain the concept at a 6th-grade reading level using no jargon. 2. Analogy — create a relatable everyday analogy that captures the essential mechanism. 3. What to Expect — timeline of what happens next, in plain language. 4. Common Questions — anticipate and answer the 5 questions patients most often ask about this. 5. Emotional Acknowledgment — suggest language that validates the patient's likely emotional response. 6. Action Steps — what does the patient need to DO, in numbered steps they can follow at home? 7. Warning Signs — what symptoms should prompt them to call or return immediately? Use short sentences. Repeat the most important information.`,
  },
  {
    id: 'the-research-protocol-designer',
    title: 'The Research Protocol Designer',
    type: 'Prompts',
    category: 'Healthcare',
    shortDescription: 'Design clinical study protocols with methodology, blinding strategy, and ethical considerations.',
    skills: ['Research Protocol', 'Clinical Research', 'Methodology'],
    body: `Act as a clinical research methodologist. I will describe [your research question and study population]. Design a study protocol: 1. Study Design — recommend and justify the design (RCT, cohort, case-control, cross-sectional). 2. Population — define inclusion and exclusion criteria with clinical precision. 3. Sample Size — estimate the minimum sample needed for adequate power. State your assumptions. 4. Intervention and Comparator — define exactly what each group receives. 5. Primary Outcome — state the primary endpoint and how it will be measured. 6. Blinding Strategy — who is blinded, and how? What are the unblinding criteria? 7. Statistical Analysis Plan — pre-specify the primary analysis, secondary analyses, and subgroup analyses. 8. Ethical Considerations — informed consent, data safety monitoring, stopping rules. This is an educational protocol template. Actual clinical research requires ethics committee approval and qualified oversight.`,
  },
  {
    id: 'the-medical-literature-synthesizer',
    title: 'The Medical Literature Synthesizer',
    type: 'Prompts',
    category: 'Healthcare',
    shortDescription: 'Synthesize medical evidence using PICO, GRADE criteria, and clinical bottom lines.',
    skills: ['Literature Synthesis', 'Evidence Review', 'Critical Appraisal'],
    body: `Act as a clinical epidemiologist. I will describe [your clinical question]. Synthesize the evidence: 1. PICO Framework — frame the question precisely: Population, Intervention, Comparator, Outcome. 2. Search Strategy — what databases, keywords, and MeSH terms would you use? 3. Study Hierarchy — rank the expected evidence types from strongest to weakest for this question. 4. Critical Appraisal — for a typical study on this topic, what are the key biases to evaluate? 5. Evidence Summary — structure a summary table: study, design, population, intervention, outcome, and risk of bias. 6. Certainty of Evidence — using GRADE criteria, what is the overall certainty (high/moderate/low/very low)? 7. Clinical Bottom Line — in one sentence, what should a clinician do based on current evidence? Acknowledge gaps. "Absence of evidence is not evidence of absence."`,
  },
  {
    id: 'the-differential-diagnosis-engine',
    title: 'The Differential Diagnosis Engine',
    type: 'Prompts',
    category: 'Healthcare',
    shortDescription: 'Generate comprehensive differentials with cannot-miss diagnoses and cognitive bias checks.',
    skills: ['Diagnosis', 'Pattern Recognition', 'Clinical Decision'],
    body: `Act as a diagnostic reasoning engine for medical education. I will describe [your symptoms, findings, and patient demographics]. Generate a comprehensive differential: 1. Broad Differential — list all plausible diagnoses organized by organ system. 2. Prioritized Differential — reorder by probability given the specific presentation. 3. Cannot-Miss Diagnoses — which diagnoses, if missed, would lead to serious harm? These are tested first regardless of probability. 4. Discriminating Features — for the top 5 diagnoses, what single finding would most reliably distinguish one from another? 5. Diagnostic Algorithm — create a stepwise decision tree: if Test A is positive, go to path X; if negative, go to path Y. 6. Cognitive Bias Check — what anchoring, premature closure, or availability bias might affect this case? 7. Pivot Triggers — what new information would cause you to completely rethink the differential? This is a teaching tool for clinical reasoning. It is not a substitute for qualified medical evaluation.`,
  },

  // ═══════════════════════════════════════════════════════════════
  // TIER 3 — AI Literacy Skills
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'model-selection-guide',
    title: 'Model Selection Guide',
    type: 'Skills',
    category: 'AI Literacy',
    shortDescription: 'Choose the right AI model by matching task complexity, cost, and latency requirements.',
    skills: ['Model Selection', 'Cost-Benefit', 'AI Strategy'],
    body: `Choosing the right model is the first prompt engineering decision. Framework: 1. Task Complexity Spectrum — simple extraction (small model), structured reasoning (medium), creative generation and nuanced analysis (frontier). Match the model to the task, not the other way around. 2. The Cost Equation — tokens x price x volume x frequency. A 10x cheaper model that is 90% as accurate may be the right choice at scale. 3. Latency Requirements — real-time (< 1s) demands smaller models or cached responses. Batch processing can use the most powerful models. 4. Context Window Needs — matching your input size to model context limits. Larger is not always better — attention degrades over very long contexts. 5. Evaluation Before Commitment — run [your specific use case] through 3+ models with the same 20 test inputs. Measure what matters to you, not benchmarks. 6. The Hybrid Approach — use a small model for routing, a medium model for 80% of tasks, and a frontier model for the hard 20%. Optimize for the portfolio, not the individual call.`,
  },
  {
    id: 'hallucination-detection',
    title: 'Hallucination Detection',
    type: 'Skills',
    category: 'AI Literacy',
    shortDescription: 'Identify and prevent AI fabrications with specificity tests and grounding techniques.',
    skills: ['Hallucination', 'Verification', 'Trust'],
    body: `Language models generate plausible text, not truthful text. They will confidently fabricate facts, citations, statistics, and quotes. Detection strategies: 1. The Specificity Test — the more specific the claim (names, dates, numbers, URLs), the higher the hallucination risk. Verify every specific claim independently. 2. The Confidence Inversion — counterintuitively, the most confidently stated facts are often the most fabricated. Hedged statements ("likely," "approximately") are often more reliable. 3. Citation Verification — if the model cites a paper or source, check that it exists. Fabricated citations are extremely common. 4. Internal Consistency — ask the same factual question three times in different ways. If answers contradict, at least some are hallucinated. 5. Knowledge Boundary Testing — ask the model "What don't you know about [your topic]?" Models that acknowledge uncertainty are in a more reliable mode. 6. Grounding Techniques — provide source documents and instruct "Only use information from the provided text. If the answer is not in the text, say so." The rule: treat model output like a first draft from a knowledgeable but unreliable colleague. Trust the structure, verify the facts.`,
  },
  {
    id: 'prompt-debugging',
    title: 'Prompt Debugging',
    type: 'Skills',
    category: 'AI Literacy',
    shortDescription: 'Debug failing prompts systematically by classifying failures and isolating variables.',
    skills: ['Debugging', 'Iteration', 'Optimization'],
    body: `When a prompt fails, debug systematically — do not randomly rewrite. Process: 1. Classify the Failure — is the output wrong (factual error), badly formatted (structure error), off-topic (instruction following error), or low quality (nuance error)? Each has a different fix. 2. Isolate the Variable — change one thing at a time. If you change the role AND the format AND the constraints simultaneously, you learn nothing. 3. The Minimal Reproduction — strip the prompt to the bare minimum that still shows the problem. Complexity hides bugs. 4. Common Fixes by Failure Type: Wrong facts — add source grounding or verification step. Bad format — add an explicit example of the desired output. Off-topic — move the key instruction to the first or last sentence. Low quality — add constraints that define what quality means. 5. The Meta-Debug — ask the model: "What instructions did you follow to produce this output?" The model's interpretation of your prompt may surprise you. 6. Temperature Check — if outputs vary too much, lower temperature. If they are too repetitive, raise it. 7. Version Control — keep a log of every prompt version and its output. The fastest prompt engineers debug the most methodically.`,
  },
  {
    id: 'when-not-to-use-ai',
    title: 'When Not to Use AI',
    type: 'Skills',
    category: 'AI Literacy',
    shortDescription: 'Know the boundaries — when AI should assist vs. when human judgment is irreplaceable.',
    skills: ['AI Limitations', 'Critical Thinking', 'Ethics'],
    body: `Knowing when NOT to use AI is as important as knowing how to use it. Do not use AI when: 1. The stakes require certainty — legal advice, medical diagnosis, financial decisions, safety-critical systems. AI assists humans in these domains; it does not replace them. 2. The task requires real-time truth — AI models have knowledge cutoffs and no access to current events (unless tool-augmented). 3. Original research is needed — models remix existing knowledge. They do not generate novel empirical data. 4. Emotional labor is required — genuine empathy, grief support, and human connection cannot be outsourced to a model. 5. The output will not be reviewed — if no human will verify the output before it is used, the risk of hallucination becomes the risk of harm. 6. Confidentiality is absolute — anything entered into a model may be logged or reviewed. Treat prompts like postcards, not sealed letters. 7. The learning IS the point — if the goal is to develop [your skill], having AI do it defeats the purpose. The red line: AI should augment human judgment, never replace it in consequential decisions.`,
  },
  {
    id: 'ai-output-verification',
    title: 'AI Output Verification',
    type: 'Skills',
    category: 'AI Literacy',
    shortDescription: 'Apply the VERIFY framework to validate every AI output before use in production.',
    skills: ['Verification', 'Quality Assurance', 'Trust'],
    body: `Every AI output should pass through a verification framework before use. The VERIFY method: 1. V — Validate Format: does the output match the requested structure? Parse it programmatically if possible. 2. E — Evidence Check: for every factual claim, can you trace it to a reliable source? No source, no trust. 3. R — Reasoning Audit: does the logic chain hold? Ask the model to explain its reasoning step by step and look for gaps. 4. I — Internal Consistency: do different parts of the output contradict each other? Check conclusions against stated premises. 5. F — Freshness Check: is this information potentially outdated? Check the model's knowledge cutoff against your needs. 6. Y — You Decide: after all checks, apply human judgment. Does this pass the smell test? Would you stake your reputation on it? Automation ladder: for low-stakes tasks, spot-check 10%. For medium-stakes, verify every output. For high-stakes, require two independent verification methods. Build verification into [your workflow], not as an afterthought.`,
  },
];

// Generate markdown files
let created = 0;
for (const p of PROMPTS) {
  const skills = p.skills.map(s => `  - ${s}`).join('\n');
  const content = `---
title: "${p.title}"
type: ${p.type}
category: ${p.category}
shortDescription: >-
  ${p.shortDescription}
skills:
${skills}
---

${p.body}
`;
  const filePath = path.join(CONTENT_DIR, `${p.id}.md`);
  if (fs.existsSync(filePath)) {
    console.warn(`Skipped (exists): ${p.id}.md`);
    continue;
  }
  fs.writeFileSync(filePath, content, 'utf-8');
  created++;
  console.log(`Created: ${p.id}.md`);
}

console.log(`\nDone! Created ${created} new prompt files.`);
