// LLM-powered improver. Mirrors the approach of Anthropic's Console prompt
// improver (restructure into XML sections, add reasoning scaffold, enrich and
// standardize examples) and the skill-creator description optimizer, running
// entirely in the visitor's browser with their own API key.

import { sendMessage } from './anthropic';
import type { LintIssue } from './types';

const SKILL_IMPROVER_SYSTEM = `You are an expert Claude Agent Skills author. You rewrite SKILL.md files to follow the Agent Skills spec and Anthropic's authoring best practices:

- Frontmatter: name (1-64 chars, lowercase-hyphen, matches directory), description (max 1024 chars, third person, states WHAT the skill does AND WHEN to use it, front-loads the capability, includes the concrete keywords/file types/phrasings users would type).
- Body under 500 lines / ~5k tokens: operating instructions only. Move reference-grade depth into suggested references/*.md files (mention them, one level deep).
- Clear workflow: numbered steps or checklists, one default approach (not a menu of options), validation loops where output correctness matters.
- Concrete input/output examples over abstract description. Consistent terminology throughout.
- No time-sensitive claims, no first-person, no XML tags in frontmatter fields, forward-slash paths, explicit "Run" vs "Read" intent for any bundled scripts.

You preserve the skill's intent and domain knowledge exactly — you restructure, sharpen, and fill gaps; you never invent capabilities the skill does not have.`;

const PROMPT_IMPROVER_SYSTEM = `You are an expert prompt engineer. You rewrite prompts following Anthropic's prompt-engineering best practices:

- Clear and direct: state the task, context, constraints, and success criteria explicitly. The golden rule: a colleague with no context should know exactly what to do.
- Structure with XML tags (<instructions>, <context>, <example>) and reference the tags by name.
- One-sentence role assignment when the task benefits from domain expertise.
- 3-5 diverse examples in <example> tags when output format matters, all in one standardized format.
- Explicit output-format specification.
- For analytical tasks, instruct step-by-step reasoning in <analysis> tags before the final answer.
- Positive instructions (what TO do) with the motivation behind non-obvious rules; prohibitions only where essential.
- Long documents at the top, instructions and the question at the bottom; ask for grounding quotes when extracting from documents.

You preserve the author's intent and voice — you sharpen and structure, you do not change what the prompt is for. Keep placeholders like {{input}} or [bracketed variables] intact.`;

function issueSummary(issues: LintIssue[]): string {
  if (issues.length === 0) return '(no automated lint findings — improve clarity, structure, and triggering anyway)';
  return issues.map(i => `- [${i.severity}] ${i.title}: ${i.detail}`).join('\n');
}

export async function improveSkill(params: {
  apiKey: string;
  model: string;
  source: string;
  issues: LintIssue[];
  signal?: AbortSignal;
}): Promise<string> {
  const res = await sendMessage({
    apiKey: params.apiKey,
    model: params.model,
    system: SKILL_IMPROVER_SYSTEM,
    maxTokens: 8192,
    signal: params.signal,
    prompt: `Rewrite this SKILL.md to fix the lint findings and follow best practices.

<skill_md>
${params.source}
</skill_md>

<lint_findings>
${issueSummary(params.issues)}
</lint_findings>

First think through what the skill is actually for and which findings matter most. Then respond with ONLY the complete improved SKILL.md file (frontmatter and body) inside a single \`\`\`markdown code fence — no commentary before or after.`,
  });
  return extractFencedDoc(res.text);
}

export async function improvePrompt(params: {
  apiKey: string;
  model: string;
  source: string;
  issues: LintIssue[];
  signal?: AbortSignal;
}): Promise<string> {
  const res = await sendMessage({
    apiKey: params.apiKey,
    model: params.model,
    system: PROMPT_IMPROVER_SYSTEM,
    maxTokens: 8192,
    signal: params.signal,
    prompt: `Rewrite this prompt to fix the lint findings and follow best practices.

<prompt_to_improve>
${params.source}
</prompt_to_improve>

<lint_findings>
${issueSummary(params.issues)}
</lint_findings>

Respond with ONLY the complete improved prompt inside a single \`\`\` code fence — no commentary before or after.`,
  });
  return extractFencedDoc(res.text);
}

function extractFencedDoc(text: string): string {
  const fenced = text.match(/```(?:markdown|md)?\n([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  return text.trim();
}
