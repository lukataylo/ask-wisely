import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/prompts');
const OUTPUT_FILE = path.resolve('public/prompts.json');

function parseMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const frontmatter = match[1];
  const body = match[2].trim();

  const fields = {};
  let currentKey = null;
  let inList = false;
  const listItems = [];

  for (const line of frontmatter.split('\n')) {
    if (line.match(/^\s*- /)) {
      listItems.push(line.replace(/^\s*- /, '').trim());
      continue;
    }

    if (currentKey && inList) {
      fields[currentKey] = [...listItems];
      listItems.length = 0;
      inList = false;
    }

    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value === '' || value === '>-') {
        inList = value !== '>-';
        if (value === '>-') {
          // multiline string - read ahead handled below
          fields[currentKey] = '';
        } else {
          inList = true;
        }
      } else {
        fields[currentKey] = value.replace(/^['"]|['"]$/g, '');
      }
    } else if (currentKey && !inList && line.startsWith('  ')) {
      // continuation of multiline string
      fields[currentKey] = ((fields[currentKey] || '') + ' ' + line.trim()).trim();
    }
  }

  if (currentKey && inList && listItems.length > 0) {
    fields[currentKey] = [...listItems];
  }

  const filename = path.basename(filePath, '.md');

  return {
    id: filename,
    title: fields.title || filename,
    type: fields.type || 'Prompts',
    category: fields.category || 'Creative',
    shortDescription: fields.shortDescription || '',
    fullPrompt: body,
    skills: Array.isArray(fields.skills) ? fields.skills : [],
  };
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
const prompts = files.map(f => parseMarkdown(path.join(CONTENT_DIR, f))).filter(Boolean);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prompts, null, 2));
console.log(`Generated ${prompts.length} prompts to ${OUTPUT_FILE}`);
