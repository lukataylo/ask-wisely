import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.resolve('content/prompts');
const OUTPUT_FILE = path.resolve('public/prompts.json');
const SEO_HTML_FILE = path.resolve('public/seo-content.html');
const LD_PROMPTS_FILE = path.resolve('public/ld-prompts.json');

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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateSeoHtml(prompts) {
  const grouped = {};
  for (const p of prompts) {
    const type = p.type || 'Prompts';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(p);
  }

  let html = '<div>\n';
  html += '  <h1>Ask Wisely — Curated AI Prompt Library</h1>\n';
  html += '  <p>A collection of 133+ expertly crafted prompts for creative writing, coding, image generation, and technical tasks.</p>\n';

  for (const [type, items] of Object.entries(grouped)) {
    html += `  <section>\n    <h2>${escapeHtml(type)}</h2>\n`;
    for (const p of items) {
      html += '    <article>\n';
      html += `      <h3>${escapeHtml(p.title)}</h3>\n`;
      if (p.shortDescription) {
        html += `      <p>${escapeHtml(p.shortDescription)}</p>\n`;
      }
      html += `      <p>Category: ${escapeHtml(p.category)}</p>\n`;
      if (p.skills.length > 0) {
        html += `      <p>Skills: ${p.skills.map(escapeHtml).join(', ')}</p>\n`;
      }
      html += '    </article>\n';
    }
    html += '  </section>\n';
  }

  html += '</div>';
  return html;
}

function generateJsonLd(prompts) {
  const items = prompts.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
    description: p.shortDescription,
    url: `https://askwisely.com/#${p.id}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'AI Prompt Collection',
    description: 'A curated collection of expertly crafted AI prompts for creative, technical, and visual tasks.',
    numberOfItems: prompts.length,
    itemListElement: items,
  };
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
const prompts = files.map(f => parseMarkdown(path.join(CONTENT_DIR, f))).filter(Boolean);

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });

// Write prompts.json
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(prompts, null, 2));
console.log(`Generated ${prompts.length} prompts to ${OUTPUT_FILE}`);

// Write SEO HTML fragment
const seoHtml = generateSeoHtml(prompts);
fs.writeFileSync(SEO_HTML_FILE, seoHtml);
console.log(`Generated SEO content to ${SEO_HTML_FILE}`);

// Write JSON-LD prompts data
const jsonLd = generateJsonLd(prompts);
fs.writeFileSync(LD_PROMPTS_FILE, JSON.stringify(jsonLd, null, 2));
console.log(`Generated JSON-LD data to ${LD_PROMPTS_FILE}`);
