// Field notes distilled from studying how popular Claude skills on GitHub
// have evolved — the failure modes their issues/commits reveal, and what the
// best eval frameworks converged on. Sources linked per card.

export interface Insight {
  id: string;
  title: string;
  body: string;
  source: { label: string; url: string };
}

export const SKILL_INSIGHTS: Insight[] = [
  {
    id: 'trigger-rate',
    title: 'Directive descriptions activate ~100% of the time; capability-only ones ~77%',
    body: 'The single most-reported skill bug is "my skill never triggers." Field tests found descriptions that open with "Use when the user..." and enumerate concrete keywords activate reliably, while descriptions that only summarize the capability are skipped roughly a quarter of the time. Anthropic\'s own pdf skill description reads "Use this skill whenever the user wants to do anything with PDF files... If the user mentions a .pdf file."',
    source: { label: 'Skill activation field test', url: 'https://dev.to/oluwawunmiadesewa/claude-code-skills-not-triggering-2-fixes-for-100-activation-3b57' },
  },
  {
    id: 'listing-budget',
    title: 'Skill listings share a character budget — verbose descriptions evict other skills',
    body: 'Claude Code gives the skill listing about 1% of the context window (historically ~15,000 chars, ~1,536 per skill). The author of superpowers — the most popular community collection — discovered his own skills were being silently truncated out of the model\'s view, and shipped v4.0 specifically to shorten descriptions and consolidate underused skills.',
    source: { label: 'fsck.com: skills not triggering', url: 'https://blog.fsck.com/2025/12/17/claude-code-skills-not-triggering/' },
  },
  {
    id: 'progressive-disclosure',
    title: 'Even Anthropic breaks the 500-line rule — but with references/ discipline',
    body: 'Official guidance says keep SKILL.md under 500 lines / 5k tokens. Anthropic\'s flagship pdf (~800 lines) and docx (~900 lines) skills exceed it, but both push depth into REFERENCE.md/FORMS.md files loaded on demand, keep references one level deep, and name one default library instead of a menu. The budget is a proxy; progressive disclosure is the real rule.',
    source: { label: 'anthropics/skills', url: 'https://github.com/anthropics/skills' },
  },
  {
    id: 'eval-first',
    title: 'The skill-creator meta-skill grew its own eval harness',
    body: 'Anthropic\'s skill-creator evolved from a scaffolding tool into an eval loop: it generates ~20 should-trigger/should-not-trigger queries, runs 5 optimization iterations against a train/test split, and A/B benchmarks the skill with and without changes. The superpowers "writing-skills" skill goes further: "NO SKILL WITHOUT A FAILING TEST FIRST."',
    source: { label: 'skill-creator plugin', url: 'https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator' },
  },
  {
    id: 'frontmatter-fragility',
    title: 'Malformed frontmatter fails silently — even Anthropic shipped it',
    body: 'Broken YAML doesn\'t error: the skill loads with empty metadata, manual invocation still works, and auto-triggering silently dies. An April 2026 commit to anthropics/skills reads "added proper front-matter to SKILL.md for claude-api" — the official repo itself shipped a skill with malformed frontmatter. Unknown or misspelled keys (tools: instead of allowed-tools:) are ignored without warning.',
    source: { label: 'anthropics/skills commits', url: 'https://github.com/anthropics/skills/commits/main' },
  },
  {
    id: 'assertion-convergence',
    title: 'Every serious eval framework converged on the same test shape',
    body: 'promptfoo, OpenAI Evals, LangSmith, Braintrust, DeepEval, and the Anthropic Console eval tool all landed on: test case = variables + assertions, deterministic checks (contains/regex/JSON) run free and instant, model-graded rubrics handle the subjective dimensions, and every score normalizes to pass/fail against a threshold. The Eval Lab test runner uses the same shape.',
    source: { label: 'promptfoo assertion reference', url: 'https://www.promptfoo.dev/docs/configuration/expected-outputs/' },
  },
  {
    id: 'judge-bias',
    title: 'LLM judges have measurable biases — design the rubric around them',
    body: 'Judges favor whichever answer is presented first (order swaps shift accuracy >10%), favor longer answers regardless of substance, and prefer outputs from their own model family. Mitigations baked into this tool\'s judge: anchored 1-5 scale with per-score descriptions, reason-before-scoring, an explicit "longer is not better" instruction, and pass computed by rule rather than judge vibes.',
    source: { label: 'Evidently: LLM-as-a-judge guide', url: 'https://www.evidentlyai.com/llm-guide/llm-as-a-judge' },
  },
  {
    id: 'improver-recipe',
    title: 'Anthropic\'s Console prompt improver applies four mechanical steps',
    body: 'Example identification → restructure into XML-tagged sections → add chain-of-thought instructions in <analysis> tags → rewrite examples to demonstrate the reasoning, in one standardized format. The improved prompts are longer and slower but measurably more accurate — a 30% accuracy jump on a multilabel classification test. The Eval Lab improver follows the same recipe.',
    source: { label: 'Anthropic prompt improver docs', url: 'https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompt-improver' },
  },
];
