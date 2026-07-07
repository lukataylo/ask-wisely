// Mechanical prompt-quality linter. Rules are distilled from Anthropic's
// prompt-engineering guidance and the checks used by eval frameworks like
// promptfoo and the Anthropic Console prompt improver — no LLM call needed.

import { LintIssue, LintReport, computeStats, scoreFromIssues } from './types';

interface PromptSignals {
  hasRole: boolean;
  hasXmlTags: boolean;
  hasExamples: boolean;
  exampleCount: number;
  hasOutputFormat: boolean;
  hasCot: boolean;
  hasReasoningTask: boolean;
  wordCount: number;
}

function detectSignals(prompt: string): PromptSignals {
  const exampleMatches = prompt.match(/<example[s]?[\s>]|^#+\s*example|^example\s*\d*\s*:|^input\s*:/gim) || [];
  return {
    hasRole: /you are (a|an|the)\s|act as\s|your role is/i.test(prompt),
    hasXmlTags: /<[a-z_][a-z0-9_-]*>[\s\S]*?<\/[a-z_][a-z0-9_-]*>/i.test(prompt),
    hasExamples: exampleMatches.length > 0,
    exampleCount: exampleMatches.length,
    hasOutputFormat: /\b(json|markdown|xml|csv|yaml|bullet|numbered list|table|format|structure your (response|output|answer)|respond (with|in|using)|output (should|must|format))\b/i.test(prompt),
    hasCot: /\b(step[ -]by[ -]step|think through|reason(ing)? (first|through|about)|before (answering|responding)|<(thinking|analysis|scratchpad)>)\b/i.test(prompt),
    hasReasoningTask: /\b(why|analyz|classif|decide|compare|evaluate|assess|diagnos|recommend|prioriti)/i.test(prompt),
    wordCount: prompt.split(/\s+/).filter(Boolean).length,
  };
}

function findUnclosedTags(prompt: string): string[] {
  const opens = new Map<string, number>();
  // Skip code fences (tags inside them are content) and instructional
  // mentions like `in <analysis> tags` (references, not structure).
  const withoutCode = prompt
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[a-z_][a-z0-9_-]*>\s+tags?\b/gi, '');
  const tagRe = /<(\/?)([a-z_][a-z0-9_-]*)\s*>/gi;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(withoutCode)) !== null) {
    const name = m[2].toLowerCase();
    // Skip common HTML-ish inline noise
    if (['br', 'hr', 'p', 'b', 'i', 'em', 'strong', 'li', 'ul', 'ol', 'code', 'pre'].includes(name)) continue;
    opens.set(name, (opens.get(name) || 0) + (m[1] === '/' ? -1 : 1));
  }
  return [...opens.entries()].filter(([, count]) => count !== 0).map(([name]) => name);
}

export function analyzePrompt(prompt: string): LintReport {
  const issues: LintIssue[] = [];
  const strengths: string[] = [];
  const signals = detectSignals(prompt);
  const stats = computeStats(prompt);
  const trimmed = prompt.trim();

  if (!trimmed) {
    return { issues: [], score: 0, grade: 'F', stats, strengths: [] };
  }

  // ── Errors ──
  const unclosed = findUnclosedTags(prompt);
  if (unclosed.length > 0) {
    issues.push({
      ruleId: 'unclosed-xml-tag',
      severity: 'error',
      title: 'Unclosed XML tag',
      detail: `Tag${unclosed.length > 1 ? 's' : ''} <${unclosed.join('>, <')}> ${unclosed.length > 1 ? 'are' : 'is'} opened but never closed. Claude relies on matched tags to separate prompt sections.`,
      fix: `Close ${unclosed.map(t => `</${t}>`).join(', ')} or remove the opening tag.`,
    });
  }

  const conflicts: [RegExp, RegExp, string][] = [
    [/\b(be )?(brief|concise|short|terse)\b/i, /\b(be )?(comprehensive|detailed|thorough|exhaustive|in.depth)\b/i, '"be concise" and "be comprehensive"'],
    [/\bonly (respond|reply|output|answer) (with|in) (valid )?json\b/i, /\bexplain your (reasoning|thinking|answer)\b/i, '"only output JSON" and "explain your reasoning"'],
    [/\bformal\b/i, /\b(casual|conversational|informal)\b/i, 'a formal tone and a casual tone'],
  ];
  for (const [a, b, label] of conflicts) {
    if (a.test(prompt) && b.test(prompt)) {
      issues.push({
        ruleId: 'conflicting-instructions',
        severity: 'error',
        title: 'Conflicting instructions',
        detail: `The prompt asks for both ${label}. The model resolves contradictions unpredictably — often differently on each run.`,
        fix: 'Pick one instruction, or scope each to a specific part of the output ("a one-line summary, then a detailed appendix").',
      });
    }
  }

  // ── Warnings ──
  if (signals.wordCount < 15) {
    issues.push({
      ruleId: 'prompt-too-short',
      severity: 'warning',
      title: 'Prompt is likely underspecified',
      detail: `At ${signals.wordCount} words, the prompt leaves task, audience, and output format to the model's guess. The golden rule: would a colleague with no context know exactly what to do?`,
      fix: 'State the task, the context it operates on, constraints, and what the output should look like.',
    });
  }

  if (!signals.hasOutputFormat && signals.wordCount >= 15) {
    issues.push({
      ruleId: 'no-output-format',
      severity: 'warning',
      title: 'No output format specified',
      detail: 'The prompt never says what shape the response should take (structure, length, or medium), so format will vary run to run.',
      fix: 'Add an explicit format instruction, e.g. "Respond with a markdown table of ..." or show the format in an example.',
    });
  }

  const sentences = trimmed.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim()).filter(Boolean);
  const negationLines = sentences.filter(s =>
    /\b(don'?t|do not|never|avoid)\b/i.test(s) && !/\binstead\b/i.test(s)
  );
  if (negationLines.length >= 2) {
    issues.push({
      ruleId: 'negation-only-instruction',
      severity: 'warning',
      title: 'Instructions phrased only as prohibitions',
      detail: `${negationLines.length} lines tell the model what NOT to do without saying what to do instead. Models follow positive instructions far more reliably (e.g. "Respond in flowing prose" beats "Don't use markdown").`,
      fix: 'Rewrite each prohibition as the desired behavior, keeping the "why" where it helps generalization.',
    });
  }

  const shoutMatches = prompt.match(/\b(CRITICAL|IMPORTANT|MUST|NEVER|ALWAYS|REMEMBER)\b|!{2,}/g) || [];
  if (shoutMatches.length > 3) {
    issues.push({
      ruleId: 'shouting-instructions',
      severity: 'warning',
      title: 'Heavy use of emphasis caps',
      detail: `${shoutMatches.length} ALL-CAPS emphasis markers found. Modern Claude models follow plain imperatives literally; aggressive emphasis causes over-triggering on those lines at the expense of the rest.`,
      fix: 'Keep at most one or two emphasized constraints; state everything else as plain imperatives.',
    });
  }

  // Multiple example labels using different conventions
  const exampleStyles = [
    /<example[s]?[\s>]/i.test(prompt),
    /^#+\s*example/im.test(prompt),
    /^example\s*\d*\s*:/im.test(prompt),
    /^(input|q)\s*:/im.test(prompt) && /^(output|a)\s*:/im.test(prompt),
  ].filter(Boolean).length;
  if (exampleStyles >= 2) {
    issues.push({
      ruleId: 'inconsistent-example-format',
      severity: 'warning',
      title: 'Examples use mixed formats',
      detail: 'Examples are labeled with more than one convention (XML tags, headings, "Example:" prefixes). Models copy incidental formatting patterns, so inconsistency leaks into outputs.',
      fix: 'Standardize every example on one convention — <example> tags with <input>/<output> inside is the most reliable.',
    });
  }

  // ── Info ──
  if (!signals.hasRole) {
    issues.push({
      ruleId: 'no-role',
      severity: 'info',
      title: 'No role assignment',
      detail: 'The prompt never tells the model who it is. A one-sentence role ("You are a senior contract lawyer...") measurably sharpens domain vocabulary and judgment.',
      fix: 'Open with a role statement matched to the task domain.',
    });
  }

  if (!signals.hasXmlTags && signals.wordCount > 80) {
    issues.push({
      ruleId: 'no-structure-tags',
      severity: 'info',
      title: 'Long prompt without section tags',
      detail: 'Prompts over a paragraph benefit from XML tags (<instructions>, <context>, <example>) so the model can tell instructions apart from data.',
      fix: 'Wrap distinct sections in consistently named XML tags, and reference the tags by name in the instructions.',
    });
  }

  if (!signals.hasExamples && signals.hasOutputFormat && signals.wordCount > 40) {
    issues.push({
      ruleId: 'no-examples-for-format',
      severity: 'info',
      title: 'Structured output requested without an example',
      detail: 'The prompt demands a specific output format but never shows one. A single concrete example beats a paragraph of format description.',
      fix: 'Add 1-3 diverse examples wrapped in <example> tags showing ideal input → output pairs.',
    });
  } else if (signals.exampleCount === 1) {
    issues.push({
      ruleId: 'single-example',
      severity: 'info',
      title: 'Only one example',
      detail: 'With a single example the model overfits to its incidental details (length, phrasing, topic). Anthropic recommends 3-5 diverse examples.',
      fix: 'Add 2-4 more examples that vary along the dimensions you care about (edge cases, lengths, tones).',
    });
  }

  if (signals.hasReasoningTask && !signals.hasCot && signals.wordCount > 25) {
    issues.push({
      ruleId: 'missing-cot-for-reasoning',
      severity: 'info',
      title: 'Reasoning task without a thinking step',
      detail: 'The task involves analysis or judgment, but the prompt never asks the model to reason before answering. Un-scaffolded answers to reasoning tasks are measurably less accurate.',
      fix: 'Add "Think through the problem step by step in <analysis> tags before giving your final answer."',
    });
  }

  const pronounStart = trimmed.match(/^(it|this|that|they)\b/i);
  if (pronounStart) {
    issues.push({
      ruleId: 'ambiguous-pronoun-start',
      severity: 'info',
      title: 'Prompt opens with an ambiguous pronoun',
      detail: `The prompt starts with "${pronounStart[0]}" — but the model has no prior context, so the referent is undefined.`,
      fix: 'Name the object explicitly in the first sentence.',
      line: 1,
    });
  }

  // ── Strengths ──
  if (signals.hasRole) strengths.push('Assigns a clear role, which sharpens domain vocabulary and judgment.');
  if (signals.hasXmlTags) strengths.push('Uses XML tags to separate sections — the most reliable structuring technique for Claude.');
  if (signals.exampleCount >= 2) strengths.push(`Includes ${signals.exampleCount} examples, anchoring format and quality expectations.`);
  if (signals.hasOutputFormat) strengths.push('Specifies the output format explicitly.');
  if (signals.hasCot) strengths.push('Asks the model to reason before answering — proven accuracy boost for analytical tasks.');

  const { score, grade } = scoreFromIssues(issues, Math.min(10, strengths.length * 2));
  return { issues, score, grade, stats, strengths };
}
