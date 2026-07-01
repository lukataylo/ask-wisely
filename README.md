<div align="center">

# Ask Wisely

**A curated library of 200+ expertly crafted AI prompts for creative writing, coding, image generation, and technical tasks.**

[askwisely.com](https://askwisely.com) &nbsp;|&nbsp; [Browse the API](https://askwisely.com/prompts.json) &nbsp;|&nbsp; [Contribute](CONTRIBUTING.md)

![Build](https://img.shields.io/github/actions/workflow/status/lukataylo/ask-wisely/deploy.yml?branch=main&label=deploy)
![Prompts](https://img.shields.io/badge/prompts-211-blue)
![License](https://img.shields.io/badge/license-open--source-green)

</div>

---

## Features

- **211 curated prompts** across text prompts, image prompts, and skills
- **Search and filter** by category, technique, or free text
- **Dark mode** with automatic system detection
- **Favorites** — save prompts to a personal collection (localStorage)
- **Copy to clipboard** with one click
- **Open in LLM** — launch prompts directly in Claude, ChatGPT, Gemini, Perplexity, Copilot, or Mistral
- **Share** via direct URL, X/Twitter, or LinkedIn
- **Keyboard shortcuts** — `/` to search, `j`/`k` to navigate, `Enter` to open, `c` to copy
- **LLM-specific variants** — some prompts have versions optimized for Claude, ChatGPT, or Gemini
- **Customizable variables** — fill in `[bracketed]` placeholders to personalize prompts
- **Workflows** — step-by-step guides for complex prompts
- **Examples** — input/output samples showing prompts in action
- **Free JSON API** — fetch all prompts at `/prompts.json`
- **Accessible** — respects `prefers-reduced-motion`, keyboard navigable, screen reader friendly
- **SEO optimized** — noscript fallback, JSON-LD structured data, full sitemap

---

## Prompt Library

The library is organized into three sections:

### Prompts
Text prompts for reasoning, creative writing, business analysis, and more.

| Category | Examples |
|----------|---------|
| Creative | Poetry Forge, Devil's Advocate, Narrative Engine |
| Technical | Code Architect, Debug Detective, System Design |
| Business | Strategy Canvas, Market Analysis, Pitch Deck |
| Academic | Research Synthesis, Thesis Builder, Peer Review |
| Persona | Expert Simulator, Historical Figure, Career Coach |
| Product | PRD Generator, User Story Mapper, Feature Prioritizer |
| Data | Data Storyteller, SQL Architect, Dashboard Designer |
| Marketing | Campaign Strategist, Copy Framework, Brand Voice |
| Personal | Decision Matrix, Habit Builder, Journal Prompts |
| Legal | Contract Analyzer, Compliance Checker, Legal Brief |
| Education | Lesson Planner, Quiz Generator, Rubric Builder |
| Healthcare | Symptom Analyzer, Research Summarizer, Care Plan |

### Image Prompts
Detailed visual descriptions for generative art tools (DALL-E, Midjourney, Imagen).

| Category | Examples |
|----------|---------|
| Cinematic | Neon Rain Chase, Golden Hour Portrait, Noir Detective |
| Portrait | Renaissance Digital, Cyberpunk Elder, Studio Lighting |
| Stylized | Watercolor Dreams, Pixel Art Worlds, Ink Wash |
| Architecture | Ancient Future Temple, Brutalist Garden, Sky Bridge |
| Commercial | Product Photography, Food Styling, Fashion Editorial |
| Interface | Dashboard Concepts, Mobile Flows, Data Visualization |

### Skills
Foundational methodologies for becoming an AI power user.

| Category | Examples |
|----------|---------|
| Engineering | RAG, Model Context Protocol, Agent Skills, Context Engineering |
| Writing | Editing Frameworks, Style Transfer, Tone Calibration |
| Strategy | Decision Trees, SWOT Analysis, Scenario Planning |
| Design | Design System Prompts, UX Audit, Accessibility First |
| Communication | Meeting Facilitator, Feedback Frameworks, Stakeholder Mapping |
| AI Literacy | Prompt Injection Defense, Hallucination Detection, Model Selection |

---

## Using the API

All prompts are available as a JSON file at [`/prompts.json`](https://askwisely.com/prompts.json). Use it in your projects, browser extensions, CLI tools, or workflows:

```bash
curl https://askwisely.com/prompts.json | jq '.[0]'
```

Each prompt has this shape:

```json
{
  "id": "poetry-forge",
  "type": "Prompts",
  "title": "Poetry Forge",
  "category": "Creative",
  "shortDescription": "Generate structured poetry with precise meter...",
  "fullPrompt": "You are a poet-engineer...",
  "skills": ["Poetry", "Meter and Rhyme", "Imagery"],
  "techniques": ["Role Assignment", "Constraint-Based"],
  "variables": [{ "name": "your theme", "placeholder": "[your theme]" }],
  "llmVariants": { "claude": "...", "chatgpt": "..." },
  "workflow": ["Step 1...", "Step 2..."],
  "exampleInput": "A poem about...",
  "exampleOutput": "Here is the generated poem...",
  "isNew": false
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 with TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Fonts | EB Garamond (serif), Inter (sans-serif) |
| Icons | Lucide React |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## Running Locally

**Prerequisites:** Node.js 20+

```bash
npm install
npm run dev       # Start dev server at localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

---

## Project Structure

```
ask-wisely/
├── App.tsx                     # Main app (routing, filters, keyboard nav, dark mode)
├── index.html                  # HTML shell + SEO meta + dark mode init
├── index.css                   # Theme tokens, animations, reduced-motion support
├── types.ts                    # TypeScript type definitions
├── components/
│   ├── PromptCard.tsx          # Card with copy, favorite, preview
│   ├── PromptModal.tsx         # Full modal: LLM launcher, share, variables
│   └── OwlLogo.tsx             # SVG mascot
├── hooks/
│   ├── usePrompts.ts           # Loads prompts with abort controller
│   ├── useFavorites.ts         # localStorage favorites
│   ├── useCopyCount.ts         # localStorage copy tracking
│   ├── useCopyToClipboard.ts   # Clipboard API wrapper
│   └── useDarkMode.ts          # Dark mode toggle + persistence
├── lib/
│   └── getPrompts.ts           # Fetch wrapper with AbortSignal
├── content/prompts/            # 211 markdown source files
├── scripts/
│   ├── generate-prompts.js     # Markdown → JSON, SEO HTML, JSON-LD, sitemap
│   └── inject-seo.js           # Post-build SEO injection
└── public/                     # Static assets, generated files
```

---

## Build Pipeline

```
generate-prompts.js → vite build → inject-seo.js
```

1. **generate-prompts.js** reads all markdown files and outputs: `prompts.json`, `seo-content.html`, `ld-prompts.json`, `sitemap.xml`
2. **vite build** compiles the React app and copies static assets
3. **inject-seo.js** injects noscript fallback content and JSON-LD into `dist/index.html`

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search |
| `Escape` | Close modal / clear search |
| `j` / `↓` | Next prompt |
| `k` / `↑` | Previous prompt |
| `Enter` | Open focused prompt |
| `c` | Copy focused prompt |


---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to submit new prompts, report issues, or improve the site.

---

## License

This project is open source. Prompts are provided for personal and educational use.
