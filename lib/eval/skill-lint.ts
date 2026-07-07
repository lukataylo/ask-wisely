// SKILL.md linter. Rules encode the Agent Skills spec (agentskills.io),
// Anthropic's skill-authoring best practices, and failure patterns observed
// across popular skill repos (non-triggering descriptions, listing-budget
// truncation, progressive-disclosure violations).

import { parseFrontmatter } from './frontmatter';
import { LintIssue, LintReport, computeStats, scoreFromIssues } from './types';

const SPEC_FIELDS = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
const CLAUDE_CODE_FIELDS = new Set([
  'when_to_use', 'argument-hint', 'arguments', 'disable-model-invocation', 'user-invocable',
  'disallowed-tools', 'model', 'effort', 'context', 'agent', 'hooks', 'paths', 'shell', 'version',
]);
const FIELD_TYPOS: Record<string, string> = {
  'allowed_tools': 'allowed-tools',
  'tools': 'allowed-tools',
  'whentouse': 'when_to_use',
  'when-to-use': 'when_to_use',
  'desc': 'description',
};

export const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export interface SkillAnalysis extends LintReport {
  frontmatter: Record<string, unknown>;
  body: string;
  hasFrontmatter: boolean;
}

export function analyzeSkill(source: string): SkillAnalysis {
  const issues: LintIssue[] = [];
  const strengths: string[] = [];
  const fm = parseFrontmatter(source);
  const body = fm.body;
  const stats = computeStats(body);

  if (!source.trim()) {
    return { issues: [], score: 0, grade: 'F', stats, strengths: [], frontmatter: {}, body: '', hasFrontmatter: false };
  }

  // ── Frontmatter structure ──
  if (!fm.found) {
    issues.push({
      ruleId: 'frontmatter-present',
      severity: 'error',
      title: 'Missing YAML frontmatter',
      detail: 'SKILL.md must start with a --- fenced YAML block containing at least name and description. Without it, Claude loads the body with empty metadata — manual /name invocation may work, but automatic triggering is dead.',
      fix: 'Add a frontmatter block:\n---\nname: my-skill\ndescription: What it does. Use when...\n---',
      line: 1,
      autoFixable: true,
    });
  } else if (fm.unterminated) {
    issues.push({
      ruleId: 'frontmatter-terminated',
      severity: 'error',
      title: 'Unterminated frontmatter block',
      detail: 'The opening --- fence has no closing ---, so the entire file parses as YAML and the skill body is lost.',
      fix: 'Add a closing --- line after the metadata keys.',
      line: 1,
      autoFixable: true,
    });
  }

  const name = typeof fm.data.name === 'string' ? fm.data.name : '';
  const description = typeof fm.data.description === 'string' ? fm.data.description : '';

  // ── name rules ──
  if (fm.found && !fm.unterminated) {
    if (!name) {
      issues.push({
        ruleId: 'name-present',
        severity: 'error',
        title: 'Missing name field',
        detail: 'The spec requires a name (1-64 chars, lowercase letters, digits, hyphens). It must also match the skill directory name.',
        fix: 'Add a name field, e.g. name: processing-pdfs',
        line: fm.keyLines['name'],
      });
    } else {
      if (!NAME_RE.test(name) || name.length > 64) {
        issues.push({
          ruleId: 'name-format',
          severity: 'error',
          title: 'Invalid name format',
          detail: `"${name}" violates the spec: names must be 1-64 chars of lowercase letters, digits, and single hyphens (no spaces, capitals, underscores, or leading/trailing/double hyphens). Invalid names are rejected by validators and the API.`,
          fix: `Rename to something like "${slugifyName(name)}" — and rename the skill directory to match.`,
          line: fm.keyLines['name'],
          autoFixable: true,
        });
      }
      if (/anthropic|claude/i.test(name)) {
        issues.push({
          ruleId: 'name-reserved-words',
          severity: 'error',
          title: 'Reserved word in name',
          detail: `Anthropic's upload validation rejects skill names containing "anthropic" or "claude".`,
          fix: 'Remove the reserved word from the name.',
          line: fm.keyLines['name'],
        });
      }
      if (/^(helper|utils?|tools?|misc|stuff)s?$|-(helper|utils?|misc)s?$/.test(name)) {
        issues.push({
          ruleId: 'name-vague',
          severity: 'warning',
          title: 'Vague skill name',
          detail: 'Names like "helper" or "utils" give the model no signal. Best practice is a gerund or verb-first name describing the capability.',
          fix: 'Rename to a capability, e.g. processing-invoices, writing-changelogs.',
          line: fm.keyLines['name'],
        });
      }
    }
  }

  // ── description rules — the #1 cause of skills that never trigger ──
  if (fm.found && !fm.unterminated) {
    if (!description.trim()) {
      issues.push({
        ruleId: 'description-present',
        severity: 'error',
        title: 'Missing description',
        detail: 'The description is the ONLY text Claude sees when deciding whether to activate the skill. Without one, the skill will never trigger automatically.',
        fix: 'Add a description stating what the skill does AND when to use it, with the concrete keywords users would type.',
        autoFixable: true,
      });
    } else {
      if (description.length > 1024) {
        issues.push({
          ruleId: 'description-length',
          severity: 'error',
          title: 'Description over 1024 characters',
          detail: `At ${description.length} chars the description exceeds the spec maximum of 1024 and will be rejected on upload.`,
          fix: 'Trim to the essential what + when + keywords. Move detail into the skill body.',
          line: fm.keyLines['description'],
        });
      }
      if (/<[^>\n]+>/.test(description) || /<[^>\n]+>/.test(name)) {
        issues.push({
          ruleId: 'no-xml-in-fields',
          severity: 'error',
          title: 'XML tags in name or description',
          detail: 'These fields are injected into the system prompt inside an <available_skills> XML block — embedded tags break the listing and are rejected by validation.',
          fix: 'Remove all < > angle-bracket tags from frontmatter fields.',
          line: fm.keyLines['description'],
          autoFixable: true,
        });
      }
      if (!/\buse (this skill )?(when|whenever|if|for)\b|\btrigger/i.test(description)) {
        issues.push({
          ruleId: 'description-says-when',
          severity: 'warning',
          title: 'Description never says WHEN to use the skill',
          detail: 'The most common cause of skills that never trigger: a description that summarizes what the skill does but not when it applies. Field studies measured directive "Use when..." descriptions activating ~100% vs ~77% for capability-only descriptions.',
          fix: 'Append a trigger clause: "Use when the user mentions X, asks to Y, or works with .ext files."',
          line: fm.keyLines['description'],
          autoFixable: true,
        });
      }
      if (/\b(i|i'll|i can|my|you can use|helps you|lets you)\b/i.test(description.split(/\s+/).slice(0, 8).join(' '))) {
        issues.push({
          ruleId: 'description-third-person',
          severity: 'warning',
          title: 'Description not in third person',
          detail: 'The description is injected into the system prompt; first/second-person phrasing ("I can...", "helps you...") conflicts with the surrounding prose and hurts skill discovery.',
          fix: 'Rewrite in third person: "Processes Excel files with formulas and pivot tables. Use when..."',
          line: fm.keyLines['description'],
        });
      }
      if (description.length < 50) {
        issues.push({
          ruleId: 'description-not-vague',
          severity: 'warning',
          title: 'Description too thin to match against',
          detail: `At ${description.length} chars, the description gives the routing model almost nothing to match user requests against.`,
          fix: 'Enumerate the specific operations and the concrete keywords, file extensions, and phrasings users would actually type.',
          line: fm.keyLines['description'],
        });
      }
      if (/^(this skill (is designed to|allows|provides|enables)|a skill (for|that))/i.test(description.trim())) {
        issues.push({
          ruleId: 'description-front-loaded',
          severity: 'info',
          title: 'Throat-clearing description opener',
          detail: 'Listings get truncated (some surfaces cap at ~250 chars, Claude Code at 1,536 combined). Openers like "This skill is designed to..." burn the most valuable characters.',
          fix: 'Lead with the capability itself: "Extracts text and tables from PDFs..." instead of "This skill is designed to extract..."',
          line: fm.keyLines['description'],
          autoFixable: true,
        });
      }
    }

    // ── other frontmatter fields ──
    const compatibility = typeof fm.data.compatibility === 'string' ? fm.data.compatibility : '';
    if (compatibility.length > 500) {
      issues.push({
        ruleId: 'compatibility-length',
        severity: 'error',
        title: 'compatibility over 500 characters',
        detail: 'The spec caps compatibility at 500 chars. Most skills should omit it entirely.',
        fix: 'Shorten to essential environment requirements, or delete the field.',
        line: fm.keyLines['compatibility'],
      });
    }

    for (const key of Object.keys(fm.data)) {
      const lower = key.toLowerCase();
      if (FIELD_TYPOS[lower]) {
        issues.push({
          ruleId: 'frontmatter-typo',
          severity: 'warning',
          title: `Misspelled field "${key}"`,
          detail: `Unknown frontmatter keys are silently ignored — "${key}" will simply do nothing.`,
          fix: `Rename to "${FIELD_TYPOS[lower]}".`,
          line: fm.keyLines[key],
          autoFixable: true,
        });
      } else if (key !== lower) {
        issues.push({
          ruleId: 'frontmatter-case',
          severity: 'warning',
          title: `Capitalized field "${key}"`,
          detail: 'Frontmatter keys are case-sensitive; capitalized variants are treated as unknown keys and ignored.',
          fix: `Rename to "${lower}".`,
          line: fm.keyLines[key],
          autoFixable: true,
        });
      } else if (!SPEC_FIELDS.has(key) && !CLAUDE_CODE_FIELDS.has(key)) {
        issues.push({
          ruleId: 'unknown-frontmatter-field',
          severity: 'info',
          title: `Unknown field "${key}"`,
          detail: 'Not a spec field or a Claude Code extension — it is ignored. Custom data belongs under metadata: as string values.',
          fix: `Move it under metadata:, e.g.\nmetadata:\n  ${key}: "..."`,
          line: fm.keyLines[key],
        });
      }
    }

    if (fm.raw && /^\s*version:\s*\d+(\.\d+)+\s*$/m.test(fm.raw)) {
      issues.push({
        ruleId: 'metadata-shape',
        severity: 'warning',
        title: 'Unquoted version number',
        detail: 'YAML parses version: 1.0 as a float — "1.10" becomes 1.1. Metadata values must be strings.',
        fix: 'Quote it: version: "1.0"',
        autoFixable: true,
      });
    }
  }

  // ── body rules: progressive disclosure ──
  if (!body.trim() && fm.found && !fm.unterminated) {
    issues.push({
      ruleId: 'body-nonempty',
      severity: 'warning',
      title: 'Empty skill body',
      detail: 'The body is what Claude actually reads after activation. A frontmatter-only skill announces a capability it cannot deliver.',
      fix: 'Add instructions: workflow steps, a concrete example, and edge cases.',
    });
  }

  if (stats.lines > 500) {
    issues.push({
      ruleId: 'body-length-lines',
      severity: 'warning',
      title: `Body is ${stats.lines} lines (guidance: under 500)`,
      detail: 'The whole body enters the context window on activation and persists across turns. Anthropic recommends keeping SKILL.md under 500 lines and moving depth into references/ files loaded on demand (progressive disclosure).',
      fix: 'Split detailed sections into references/*.md files and link them from SKILL.md — one level deep only.',
    });
  } else if (stats.tokens > 5000) {
    issues.push({
      ruleId: 'body-length-tokens',
      severity: 'warning',
      title: `Body is ~${stats.tokens.toLocaleString()} tokens (guidance: under 5,000)`,
      detail: 'Instruction bodies above ~5k tokens crowd out working context every time the skill activates.',
      fix: 'Move reference material into separate files and keep only the operating instructions in SKILL.md.',
    });
  }

  if (/\w\\(scripts|references|assets)\\|[A-Za-z]:\\\w/.test(body)) {
    issues.push({
      ruleId: 'windows-paths',
      severity: 'warning',
      title: 'Windows-style backslash paths',
      detail: 'Backslash-separated paths break on the Unix runners where skills usually execute.',
      fix: 'Use forward slashes: scripts/process.py',
      autoFixable: true,
    });
  }

  const timeSensitive = body.match(/\b(before|after|as of|until)\s+(january|february|march|april|may|june|july|august|september|october|november|december|q[1-4]\s+)?20\d\d|currently in beta|coming soon\b/i);
  if (timeSensitive) {
    issues.push({
      ruleId: 'time-sensitive-content',
      severity: 'info',
      title: 'Time-sensitive content',
      detail: `Found "${timeSensitive[0]}" — dated claims become silently wrong and skills are rarely re-audited.`,
      fix: 'Move dated info into a clearly labeled "Old patterns" section, or remove it.',
    });
  }

  if (body.trim() && !stats.examples && stats.codeBlocks === 0) {
    issues.push({
      ruleId: 'example-presence',
      severity: 'info',
      title: 'No concrete examples',
      detail: 'Official checklist item: "Examples are concrete, not abstract." Input → output pairs beat any amount of description.',
      fix: 'Add at least one worked example showing a real input and the expected result.',
    });
  }

  const optionMenus = body.match(/\byou can use \w+[^.\n]*,[^.\n]*\bor\b[^.\n]*\bor\b/gi);
  if (optionMenus) {
    issues.push({
      ruleId: 'too-many-options',
      severity: 'info',
      title: 'Menu of alternatives without a default',
      detail: 'Offering three-plus libraries or approaches without naming a default causes option paralysis and inconsistent behavior across runs.',
      fix: 'Name one default and at most one escape hatch ("Use pdfplumber. If the PDF is scanned, fall back to OCR via pytesseract").',
    });
  }

  // Script references that don't state execution intent
  const scriptRefs = body.match(/(?:^|\s|`|\()((?:scripts|\.\/scripts)\/[\w./-]+\.(?:py|sh|js|ts))/gm) || [];
  if (scriptRefs.length > 0) {
    const hasRunVerb = /\b(run|execute|invoke)\b[^.\n]{0,60}(scripts\/|\.py|\.sh|\.js)/i.test(body);
    if (!hasRunVerb) {
      issues.push({
        ruleId: 'script-execution-intent',
        severity: 'info',
        title: 'Script referenced without execution intent',
        detail: 'It is ambiguous whether Claude should RUN the bundled script or read it as reference — a known gotcha that wastes turns.',
        fix: 'Prefix script mentions with "Run scripts/foo.py ..." or "Read scripts/foo.py as reference for ..."',
      });
    }
  }

  // ── strengths ──
  if (/\buse (this skill )?(when|whenever|if|for)\b/i.test(description)) strengths.push('Description states when to trigger — the single biggest activation win.');
  if (description && description.length >= 50 && description.length <= 1024) strengths.push('Description length is within spec and substantial enough to match against.');
  if (stats.lines > 0 && stats.lines <= 500 && stats.tokens <= 5000 && body.trim()) strengths.push('Body respects the progressive-disclosure budget (<500 lines, <5k tokens).');
  if (/references\//.test(body)) strengths.push('Uses references/ files for on-demand depth instead of inflating SKILL.md.');
  if (stats.examples || stats.codeBlocks > 0) strengths.push('Includes concrete examples or code blocks.');
  if (/^#{1,3}\s/m.test(body) && /^\s*(\d+\.|[-*])\s/m.test(body)) strengths.push('Structured with headings and step lists — easy for the model to follow.');
  if (typeof fm.data['allowed-tools'] === 'string' && (fm.data['allowed-tools'] as string).trim()) strengths.push('Declares allowed-tools, reducing permission prompts.');

  const { score, grade } = scoreFromIssues(issues, Math.min(12, strengths.length * 2));
  return { issues, score, grade, stats, strengths, frontmatter: fm.data, body, hasFrontmatter: fm.found && !fm.unterminated };
}

export function slugifyName(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-skill';
}
