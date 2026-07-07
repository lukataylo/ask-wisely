// Mechanical skill fixer: applies the deterministic repairs the linter marks
// autoFixable, without an LLM. Conservative — anything requiring judgment is
// left for the LLM improver and marked with a TODO the author can search for.

import { parseFrontmatter, serializeFrontmatter } from './frontmatter';
import { slugifyName } from './skill-lint';

export interface FixResult {
  fixed: string;
  applied: string[];
}

const FIELD_RENAMES: Record<string, string> = {
  'allowed_tools': 'allowed-tools',
  'tools': 'allowed-tools',
  'when-to-use': 'when_to_use',
  'desc': 'description',
};

export function autoFixSkill(source: string): FixResult {
  const applied: string[] = [];
  const fm = parseFrontmatter(source);
  let body = fm.body;
  let data: Record<string, unknown> = { ...fm.data };

  // Missing or unterminated frontmatter → scaffold one from what we can infer.
  if (!fm.found || fm.unterminated) {
    const firstHeading = source.match(/^#\s+(.+)$/m)?.[1];
    const firstParagraph = source.split(/\n\s*\n/).map(s => s.trim()).find(s => s && !s.startsWith('#'));
    data = {
      name: slugifyName(firstHeading || 'my-skill'),
      description: `${(firstParagraph || 'TODO: what this skill does').split('\n')[0].slice(0, 900)} Use when TODO: describe the user requests that should trigger this skill.`,
    };
    body = fm.unterminated ? '' : source;
    applied.push(fm.unterminated ? 'Closed the unterminated frontmatter block and scaffolded metadata' : 'Added a frontmatter block scaffolded from the document');
  }

  // Rename misspelled / capitalized fields.
  for (const key of Object.keys(data)) {
    const lower = key.toLowerCase();
    const target = FIELD_RENAMES[lower] || (key !== lower ? lower : null);
    if (target && target !== key && !(target in data)) {
      data[target] = data[key];
      delete data[key];
      applied.push(`Renamed frontmatter field "${key}" to "${target}"`);
    }
  }

  // Fix name format.
  if (typeof data.name === 'string' && data.name) {
    const slug = slugifyName(data.name);
    if (slug !== data.name) {
      data.name = slug;
      applied.push(`Normalized name to "${slug}" (remember to rename the skill directory to match)`);
    }
  } else if (!data.name) {
    data.name = 'my-skill';
    applied.push('Added a placeholder name (rename it to match the skill directory)');
  }

  // Description repairs.
  let desc = typeof data.description === 'string' ? data.description : '';
  if (/<[^>\n]+>/.test(desc)) {
    desc = desc.replace(/<[^>\n]+>/g, '').replace(/\s{2,}/g, ' ').trim();
    applied.push('Stripped XML tags from the description');
  }
  const throatClearing = desc.match(/^this skill (is designed to|allows you to|allows|provides|enables you to|enables)\s+/i);
  if (throatClearing) {
    desc = desc.slice(throatClearing[0].length);
    desc = desc.charAt(0).toUpperCase() + desc.slice(1);
    applied.push('Removed throat-clearing opener so the capability leads');
  }
  if (desc && !/\buse (this skill )?(when|whenever|if|for)\b|\btrigger/i.test(desc)) {
    desc = `${desc.replace(/\s*$/, '')}${/[.!?]$/.test(desc.trim()) ? '' : '.'} Use when TODO: list the user requests, keywords, and file types that should trigger this skill.`;
    applied.push('Appended a "Use when..." trigger clause (fill in the TODO)');
  }
  if (!desc) {
    desc = 'TODO: what this skill does. Use when TODO: describe the triggering requests.';
    applied.push('Added a placeholder description');
  }
  data.description = desc;

  // Quote bare version numbers so YAML doesn't parse them as floats.
  // (Parser already gives us strings; re-serialization quotes as needed.)

  // Body repairs.
  if (/\w\\(scripts|references|assets)\\/.test(body)) {
    body = body.replace(/(\w)\\(scripts|references|assets)\\/g, '$1/$2/').replace(/(scripts|references|assets)\\/g, '$1/');
    applied.push('Converted Windows-style backslash paths to forward slashes');
  }

  const fixed = `${serializeFrontmatter(data)}\n\n${body.replace(/^\n+/, '')}`;
  return { fixed, applied };
}
