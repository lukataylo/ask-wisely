import fs from 'fs';
import path from 'path';

const DIST_DIR = path.resolve('dist');
const DIST_HTML = path.resolve('dist/index.html');
const SEO_HTML_FILE = path.resolve('public/seo-content.html');
const LD_PROMPTS_FILE = path.resolve('public/ld-prompts.json');
const PROMPTS_FILE = path.resolve('public/prompts.json');
const SITE_URL = 'https://askwisely.com';

// Directories in dist/ that must not be overwritten by prompt pages
const RESERVED_DIRS = new Set(['assets', 'admin']);

if (!fs.existsSync(DIST_HTML)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str, maxLen = 160) {
  if (str.length <= maxLen) return str;
  return str.substring(0, maxLen - 3) + '...';
}

// Read the built HTML template (before any injection)
const template = fs.readFileSync(DIST_HTML, 'utf-8');

// ── 1. Homepage: inject global SEO ──

let homepageHtml = template;

if (fs.existsSync(SEO_HTML_FILE)) {
  const seoContent = fs.readFileSync(SEO_HTML_FILE, 'utf-8');
  homepageHtml = homepageHtml.replace(
    '<!-- SEO_NOSCRIPT_PLACEHOLDER -->',
    `<noscript>${seoContent}</noscript>`
  );
  console.log('Injected noscript SEO content into homepage');
}

if (fs.existsSync(LD_PROMPTS_FILE)) {
  const jsonLd = fs.readFileSync(LD_PROMPTS_FILE, 'utf-8');
  homepageHtml = homepageHtml.replace(
    '<!-- SEO_JSONLD_PLACEHOLDER -->',
    () => `<script type="application/ld+json">\n    ${jsonLd}\n    </script>`
  );
  console.log('Injected JSON-LD ItemList into homepage');
}

fs.writeFileSync(DIST_HTML, homepageHtml);

// ── 2. Per-prompt pages ──

if (!fs.existsSync(PROMPTS_FILE)) {
  console.warn('prompts.json not found, skipping per-prompt page generation.');
  console.log('SEO injection complete.');
  process.exit(0);
}

const prompts = JSON.parse(fs.readFileSync(PROMPTS_FILE, 'utf-8'));
let generated = 0;

for (const prompt of prompts) {
  if (RESERVED_DIRS.has(prompt.id)) {
    console.warn(`Skipping reserved directory name: ${prompt.id}`);
    continue;
  }

  let html = template;

  const promptUrl = `${SITE_URL}/${prompt.id}`;
  const title = `${prompt.title} — Ask Wisely`;
  const description = truncate(
    prompt.shortDescription || `${prompt.title} - A curated AI prompt from Ask Wisely.`
  );

  // Replace <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    () => `<title>${escapeHtml(title)}</title>`
  );

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    () => `<meta name="description" content="${escapeHtml(description)}">`
  );

  // Replace canonical URL
  html = html.replace(
    /<link rel="canonical" href="[^"]*">/,
    () => `<link rel="canonical" href="${promptUrl}">`
  );

  // Replace Open Graph tags
  html = html.replace(
    /<meta property="og:type" content="[^"]*">/,
    () => `<meta property="og:type" content="article">`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*">/,
    () => `<meta property="og:title" content="${escapeHtml(title)}">`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*">/,
    () => `<meta property="og:description" content="${escapeHtml(description)}">`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*">/,
    () => `<meta property="og:url" content="${promptUrl}">`
  );

  // Replace Twitter Card tags
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    () => `<meta name="twitter:title" content="${escapeHtml(title)}">`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    () => `<meta name="twitter:description" content="${escapeHtml(description)}">`
  );

  // Inject per-prompt JSON-LD (CreativeWork schema)
  const promptJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: prompt.title,
    description: prompt.shortDescription,
    url: promptUrl,
    category: prompt.category,
    keywords: [...(prompt.techniques || []), ...(prompt.skills || [])].join(', '),
    isPartOf: {
      '@type': 'WebSite',
      name: 'Ask Wisely',
      url: SITE_URL,
    },
  }, null, 2);

  html = html.replace(
    '<!-- SEO_JSONLD_PLACEHOLDER -->',
    () => `<script type="application/ld+json">\n    ${promptJsonLd}\n    </script>`
  );

  // Inject per-prompt noscript content (visible to crawlers without JS)
  const skills = (prompt.skills || []).length > 0
    ? `\n      <p>Skills: ${prompt.skills.map(escapeHtml).join(', ')}</p>` : '';
  const techniques = (prompt.techniques || []).length > 0
    ? `\n      <p>Techniques: ${prompt.techniques.map(escapeHtml).join(', ')}</p>` : '';

  const noscript = `<noscript>
    <article>
      <h1>${escapeHtml(prompt.title)}</h1>
      <p>${escapeHtml(description)}</p>
      <p>Category: ${escapeHtml(prompt.category)} | Type: ${escapeHtml(prompt.type)}</p>${skills}${techniques}
      <h2>Prompt</h2>
      <pre>${escapeHtml(prompt.fullPrompt)}</pre>
      <p><a href="/">Browse all prompts at Ask Wisely</a></p>
    </article>
  </noscript>`;

  html = html.replace('<!-- SEO_NOSCRIPT_PLACEHOLDER -->', () => noscript);

  // Write to dist/{prompt-id}/index.html
  // GitHub Pages serves this for /{prompt-id} requests
  const promptDir = path.join(DIST_DIR, prompt.id);
  fs.mkdirSync(promptDir, { recursive: true });
  fs.writeFileSync(path.join(promptDir, 'index.html'), html);
  generated++;
}

console.log(`Generated ${generated} individual prompt pages`);
console.log('SEO injection complete.');
