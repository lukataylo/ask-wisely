<div align="center">

# Ask Wisely

**A curated library of 133 expertly crafted AI prompts for creative writing, coding, image generation, and technical tasks.**

[askwisely.com](https://askwisely.com)

</div>

---

## What is Ask Wisely?

Ask Wisely is a prompt library designed to help people get better results from AI tools like ChatGPT, Claude, Midjourney, and others. Each prompt has been written and refined to produce high-quality output for a specific use case.

The library is organized into three sections:

- **Prompts** — Text prompts for reasoning, creative writing, business analysis, and more. Categories include Creative, Technical, Business, Academic, and Persona.
- **Image Prompts** — Detailed visual descriptions for generative art tools. Categories include Cinematic, Portrait, Stylized, and Architecture.
- **Skills** — Foundational methodologies and reference guides. Categories include Engineering, Writing, Strategy, and Design.

Users can search, filter by category, preview any prompt, and copy it to their clipboard with one click.

---

## Project Structure

```
ask-wisely/
├── index.html                  # HTML shell with SEO meta tags and JSON-LD
├── index.tsx                   # React entry point (mounts <App />)
├── App.tsx                     # Main application component
├── types.ts                    # TypeScript type definitions
│
├── components/
│   ├── PromptCard.tsx          # Card component with copy and preview actions
│   ├── PromptModal.tsx         # Full-screen modal for reading a prompt
│   └── AnimatedBackground.tsx  # Animated gradient background
│
├── hooks/
│   └── usePrompts.ts           # Hook that loads prompts (TinaCMS or static JSON)
│
├── lib/
│   └── getPrompts.ts           # Data fetching logic for dev and production
│
├── content/
│   └── prompts/                # 133 markdown files (one per prompt)
│       ├── accessibility-first.md
│       ├── poetry-forge.md
│       ├── neon-rain-chase.md
│       └── ...
│
├── tina/
│   ├── config.ts               # TinaCMS schema and collection definition
│   └── __generated__/          # Auto-generated TinaCMS client and types
│
├── scripts/
│   ├── generate-prompts.js     # Parses markdown → JSON, SEO HTML, and JSON-LD
│   └── inject-seo.js           # Post-build: injects SEO content into dist/index.html
│
├── public/
│   ├── prompts.json            # Generated: all prompts as static JSON
│   ├── seo-content.html        # Generated: semantic HTML for noscript fallback
│   ├── ld-prompts.json         # Generated: JSON-LD ItemList for search engines
│   ├── favicon.svg             # Owl favicon
│   ├── og-image.svg            # Open Graph social sharing image (1200x630)
│   ├── robots.txt              # Crawling rules and sitemap reference
│   ├── sitemap.xml             # XML sitemap
│   ├── 404.html                # Custom 404 page for GitHub Pages
│   ├── CNAME                   # Custom domain: askwisely.com
│   └── admin/                  # TinaCMS admin interface
│
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build and deploy to GitHub Pages
│
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

---

## How It Works

### Content Management

Prompts are stored as individual markdown files in `content/prompts/`. Each file has YAML frontmatter defining the prompt's metadata and a body containing the full prompt text:

```markdown
---
title: Poetry Forge
type: Prompts
category: Creative
shortDescription: >-
  Craft vivid, emotionally resonant poetry in any style or form.
skills:
  - Creative Writing
  - Poetry
  - Metaphor
---

You are a poet with mastery over form, meter, and imagery...
```

**Editing prompts:** In development, the TinaCMS admin interface provides a visual editor at `/admin`. In production, prompts are edited by modifying the markdown files directly and pushing to `main`.

### Data Flow

The project uses a dual data source approach:

1. **Development** (`npm run dev`): The React app fetches prompts in real time from TinaCMS via its GraphQL client. This allows live editing through the CMS admin panel.

2. **Production** (`npm run build`): A build script (`generate-prompts.js`) parses all 133 markdown files and produces a static `prompts.json`. The React app loads this JSON file at runtime instead of calling TinaCMS.

### Build Pipeline

The build command runs three steps in sequence:

```
node scripts/generate-prompts.js → vite build → node scripts/inject-seo.js
```

1. **generate-prompts.js** reads every markdown file in `content/prompts/` and outputs:
   - `public/prompts.json` — all prompt data as JSON (used by the React app)
   - `public/seo-content.html` — all prompt titles and descriptions in semantic HTML
   - `public/ld-prompts.json` — a JSON-LD `ItemList` with all 133 prompts

2. **vite build** compiles the React/TypeScript app and copies `public/` into `dist/`.

3. **inject-seo.js** modifies `dist/index.html` to replace placeholder comments with:
   - A `<noscript>` block containing the full SEO HTML (so search engines can index all prompts without JavaScript)
   - A `<script type="application/ld+json">` block with the complete `ItemList` structured data

### Deployment

The site is deployed to GitHub Pages via a GitHub Actions workflow (`.github/workflows/deploy.yml`). On every push to `main`:

1. Checks out the code
2. Installs dependencies with `npm ci`
3. Runs `npm run build` (with TinaCMS credentials from repository secrets)
4. Uploads the `dist/` folder as a GitHub Pages artifact
5. Deploys to GitHub Pages

The custom domain `askwisely.com` is configured via the `public/CNAME` file.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 with TypeScript |
| Build tool | Vite 6 |
| CMS | TinaCMS (headless, Git-backed) |
| Styling | Tailwind CSS (CDN) |
| Fonts | EB Garamond (serif), Inter (sans-serif) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## SEO

The site is a single-page app, which means search engines would normally see an empty `<div id="root"></div>` until JavaScript executes. To address this:

- **Noscript fallback:** The build injects a `<noscript>` block into `index.html` containing all 133 prompt titles, descriptions, categories, and skill tags in semantic HTML (`<h1>`, `<h2>`, `<article>`, `<section>`). This content is visible to crawlers that don't run JavaScript.

- **JSON-LD structured data:** Two schema.org blocks are embedded — a `WebSite` schema and an `ItemList` schema listing every prompt with its name, description, and URL.

- **Meta tags:** The page includes a meta description, Open Graph tags, Twitter Card tags, a canonical URL, and a theme color.

- **Static files:** `robots.txt` allows all crawlers and points to `sitemap.xml`. The sitemap lists the homepage URL.

- **404 page:** A styled `404.html` page is served by GitHub Pages for unmatched routes.

---

## Running Locally

**Prerequisites:** Node.js 20+

```bash
# Install dependencies
npm install

# Start the dev server (with TinaCMS)
npm run dev

# Or build for production
npm run build

# Preview the production build
npm run preview
```

The dev server starts at `http://localhost:3000`. The TinaCMS admin panel is available at `http://localhost:3000/admin`.

### Environment Variables (optional, for TinaCMS cloud)

| Variable | Purpose |
|----------|---------|
| `TINA_CLIENT_ID` | TinaCMS cloud project client ID |
| `TINA_TOKEN` | TinaCMS cloud read-only token |
| `TINA_BRANCH` | Git branch for TinaCMS content (defaults to `main`) |

These are only needed for the CMS admin to connect to TinaCloud. The site builds and runs fine without them — it will just use the local markdown files.

---

## Adding a New Prompt

1. Create a new `.md` file in `content/prompts/` (the filename becomes the prompt ID):

```markdown
---
title: Your Prompt Title
type: Prompts
category: Creative
shortDescription: >-
  A brief description of what this prompt does.
skills:
  - Skill One
  - Skill Two
---

The full prompt text goes here...
```

2. Choose the correct `type` and `category`:

| Type | Available Categories |
|------|---------------------|
| Prompts | Creative, Technical, Business, Academic, Persona |
| Image Prompts | Cinematic, Portrait, Stylized, Architecture |
| Skills | Engineering, Writing, Strategy, Design |

3. Commit, push to `main`, and the site redeploys automatically.

---

## License

This project is open source. Prompts are provided for personal and educational use.
