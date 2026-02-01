import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CONTENT_DIR = path.resolve('content/prompts');
const OUTPUT_FILE = path.resolve('public/prompts.json');
const SEO_HTML_FILE = path.resolve('public/seo-content.html');
const LD_PROMPTS_FILE = path.resolve('public/ld-prompts.json');
const SITEMAP_FILE = path.resolve('public/sitemap.xml');

const TECHNIQUE_PATTERNS = {
  'Role Assignment':   /\b(Act as|You are|Assume the role|Imagine you're|Play the role)\b/i,
  'Structured Output': /\b(format|JSON|markdown|table|numbered|schema|diagram|specification)\b/i,
  'Constraint-Based':  /\b(don't|do not|never|avoid|must not|exactly|only|no more than|limit)\b/i,
  'Chain-of-Thought':  /\b(step.by.step|think through|break down|walk through|before moving)\b/i,
  'Few-Shot':          /\b(example|for instance|e\.g\.|sample|like this)\b/i,
  'Self-Verification': /\b(verify|validate|check.*assumption|reconsider|steelman|counter-?argument)\b/i,
  'Socratic Method':   /\b(Socratic|guide.*question|don't give.*answers|inquiry)\b/i,
  'Meta-Cognitive':    /\b(before responding|consider first|reflect|think about.*before|pause and)\b/i,
};

function detectTechniques(text) {
  const techniques = [];
  for (const [name, pattern] of Object.entries(TECHNIQUE_PATTERNS)) {
    if (pattern.test(text)) {
      techniques.push(name);
    }
  }
  return techniques;
}

function extractVariables(text) {
  const regex = /\[([^\]]+)\]/g;
  const seen = new Set();
  const variables = [];
  let m;
  while ((m = regex.exec(text)) !== null) {
    const name = m[1];
    // Filter out purely numeric matches like [1], [2]
    if (/^\d+$/.test(name.trim())) continue;
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      variables.push({ name, placeholder: m[0] });
    }
  }
  return variables;
}

function parseLLMVariants(body) {
  const variantPattern = /<!--\s*variant:(claude|chatgpt|gemini)\s*-->/gi;
  const markers = [];
  let m;
  while ((m = variantPattern.exec(body)) !== null) {
    markers.push({ provider: m[1].toLowerCase(), index: m.index, length: m[0].length });
  }

  if (markers.length === 0) {
    return { basePrompt: body.trim(), variants: {} };
  }

  const basePrompt = body.substring(0, markers[0].index).trim();
  const variants = {};

  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index + markers[i].length;
    const end = i + 1 < markers.length ? markers[i + 1].index : body.length;
    const text = body.substring(start, end).trim();
    if (text) {
      variants[markers[i].provider] = text;
    }
  }

  return { basePrompt, variants };
}

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
          fields[currentKey] = '';
        } else {
          inList = true;
        }
      } else {
        fields[currentKey] = value.replace(/^['"]|['"]$/g, '');
      }
    } else if (currentKey && !inList && line.startsWith('  ')) {
      fields[currentKey] = ((fields[currentKey] || '') + ' ' + line.trim()).trim();
    }
  }

  if (currentKey && inList && listItems.length > 0) {
    fields[currentKey] = [...listItems];
  }

  const filename = path.basename(filePath, '.md');

  // Parse LLM variants from body
  const { basePrompt, variants } = parseLLMVariants(body);

  // Detect techniques from the base prompt text
  let techniques = detectTechniques(basePrompt);

  // Frontmatter techniques override/supplement
  if (Array.isArray(fields.techniques)) {
    const fromFrontmatter = fields.techniques;
    const merged = new Set([...techniques, ...fromFrontmatter]);
    techniques = [...merged];
  }

  // Extract template variables
  const variables = extractVariables(basePrompt);

  return {
    id: filename,
    title: fields.title || filename,
    type: fields.type || 'Prompts',
    category: fields.category || 'Creative',
    shortDescription: fields.shortDescription || '',
    fullPrompt: basePrompt,
    skills: Array.isArray(fields.skills) ? fields.skills : [],
    techniques,
    variables,
    llmVariants: variants,
    _isNewFlag: fields.isNew === 'true',
  };
}

function getGitAddedDate(filePath) {
  try {
    const output = execSync(
      `git log --diff-filter=A --follow --format=%aI -- "${filePath}"`,
      { encoding: 'utf-8', timeout: 5000, stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
    const lines = output.split('\n').filter(Boolean);
    return lines.length > 0 ? lines[lines.length - 1] : null;
  } catch {
    return null;
  }
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
  html += `  <p>A collection of ${prompts.length}+ expertly crafted prompts for creative writing, coding, image generation, and technical tasks.</p>\n`;

  for (const [type, items] of Object.entries(grouped)) {
    html += `  <section>\n    <h2>${escapeHtml(type)}</h2>\n`;
    for (const p of items) {
      html += '    <article>\n';
      html += `      <h3><a href="/${escapeHtml(p.id)}">${escapeHtml(p.title)}</a></h3>\n`;
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
    url: `https://askwisely.com/${p.id}`,
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

function generateSitemap(prompts) {
  const CATEGORY_MAP = {
    'Prompts': ['Creative', 'Technical', 'Business', 'Academic', 'Persona', 'Product', 'Data', 'Marketing', 'Personal', 'Legal', 'Education', 'Healthcare'],
    'Image Prompts': ['Cinematic', 'Portrait', 'Stylized', 'Architecture', 'Commercial', 'Interface'],
    'Skills': ['Engineering', 'Writing', 'Strategy', 'Design', 'Communication', 'AI Literacy'],
  };

  const TAB_SLUGS = {
    'Prompts': 'prompts',
    'Image Prompts': 'image-prompts',
    'Skills': 'skills',
  };

  const urls = [
    { loc: 'https://askwisely.com/', changefreq: 'weekly', priority: '1.0' },
  ];

  // Tab pages
  for (const [tab, slug] of Object.entries(TAB_SLUGS)) {
    if (tab === 'Prompts') continue; // homepage covers this
    urls.push({ loc: `https://askwisely.com/?tab=${slug}`, changefreq: 'weekly', priority: '0.8' });

    // Category pages
    for (const cat of CATEGORY_MAP[tab]) {
      const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
      urls.push({ loc: `https://askwisely.com/?tab=${slug}&cat=${catSlug}`, changefreq: 'monthly', priority: '0.6' });
    }
  }

  // Prompts category pages (default tab)
  for (const cat of CATEGORY_MAP['Prompts']) {
    const catSlug = cat.toLowerCase().replace(/\s+/g, '-');
    urls.push({ loc: `https://askwisely.com/?cat=${catSlug}`, changefreq: 'monthly', priority: '0.6' });
  }

  // Individual prompt pages
  for (const p of prompts) {
    urls.push({ loc: `https://askwisely.com/${p.id}`, changefreq: 'monthly', priority: '0.7' });
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// ── Main ──

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
const parsed = files.map(f => parseMarkdown(path.join(CONTENT_DIR, f)));

for (let i = 0; i < files.length; i++) {
  if (parsed[i] === null) {
    console.warn(`Warning: skipped ${files[i]} (failed to parse frontmatter)`);
  }
}

const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

const prompts = parsed.filter(Boolean).map((prompt, i) => {
  const filePath = path.join(CONTENT_DIR, files[i]);
  const gitDate = getGitAddedDate(filePath);
  const isNewByDate = gitDate ? new Date(gitDate).getTime() > thirtyDaysAgo : false;
  const isNewByFlag = prompt._isNewFlag;

  const { _isNewFlag, ...rest } = prompt;
  return {
    ...rest,
    isNew: isNewByDate || isNewByFlag,
  };
});

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

// Write sitemap
const sitemap = generateSitemap(prompts);
fs.writeFileSync(SITEMAP_FILE, sitemap);
console.log(`Generated sitemap with ${sitemap.split('<url>').length - 1} URLs to ${SITEMAP_FILE}`);
