import fs from 'fs';
import path from 'path';

const DIST_HTML = path.resolve('dist/index.html');
const SEO_HTML_FILE = path.resolve('public/seo-content.html');
const LD_PROMPTS_FILE = path.resolve('public/ld-prompts.json');

if (!fs.existsSync(DIST_HTML)) {
  console.error('dist/index.html not found. Run vite build first.');
  process.exit(1);
}

let html = fs.readFileSync(DIST_HTML, 'utf-8');

// Inject noscript SEO content
if (fs.existsSync(SEO_HTML_FILE)) {
  const seoContent = fs.readFileSync(SEO_HTML_FILE, 'utf-8');
  const noscriptBlock = `<noscript>${seoContent}</noscript>`;
  html = html.replace('<!-- SEO_NOSCRIPT_PLACEHOLDER -->', noscriptBlock);
  console.log('Injected noscript SEO content into dist/index.html');
} else {
  console.warn('seo-content.html not found, skipping noscript injection.');
}

// Inject JSON-LD ItemList
if (fs.existsSync(LD_PROMPTS_FILE)) {
  const jsonLd = fs.readFileSync(LD_PROMPTS_FILE, 'utf-8');
  const scriptBlock = `<script type="application/ld+json">\n    ${jsonLd}\n    </script>`;
  html = html.replace('<!-- SEO_JSONLD_PLACEHOLDER -->', scriptBlock);
  console.log('Injected JSON-LD ItemList into dist/index.html');
} else {
  console.warn('ld-prompts.json not found, skipping JSON-LD injection.');
}

fs.writeFileSync(DIST_HTML, html);
console.log('SEO injection complete.');
