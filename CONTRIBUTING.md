# Contributing to Ask Wisely

Thanks for your interest in contributing! Here's how you can help.

## Adding a New Prompt

The easiest way to contribute is by adding a new prompt.

### 1. Create the file

Add a new `.md` file in `content/prompts/`. The filename becomes the prompt's URL slug (e.g., `poetry-forge.md` → `askwisely.com/poetry-forge`).

### 2. Write the frontmatter

```markdown
---
title: Your Prompt Title
type: Prompts
category: Creative
shortDescription: >-
  A brief description of what this prompt does (1-2 sentences).
skills:
  - Skill One
  - Skill Two
  - Skill Three
workflow:
  - First, do this
  - Then, do that
  - Finally, review the output
---

The full prompt text goes here. Use [bracketed placeholders] for
parts the user should customize.

<!-- example-input -->
Example user input that demonstrates how to use this prompt.

<!-- example-output -->
Example AI response showing what the prompt produces.
```

### 3. Choose the right type and category

| Type | Categories |
|------|-----------|
| **Prompts** | Creative, Technical, Business, Academic, Persona, Product, Data, Marketing, Personal, Legal, Education, Healthcare |
| **Image Prompts** | Cinematic, Portrait, Stylized, Architecture, Commercial, Interface |
| **Skills** | Engineering, Writing, Strategy, Design, Communication, AI Literacy |

### 4. Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | The prompt's display name |
| `type` | Yes | One of: `Prompts`, `Image Prompts`, `Skills` |
| `category` | Yes | Must match the type's allowed categories |
| `shortDescription` | Yes | 1-2 sentence summary shown on cards |
| `skills` | Yes | 3-5 relevant skills/topics |
| `workflow` | No | Step-by-step usage guide (list) |
| `techniques` | No | Auto-detected, but can override |

### 5. Adding examples (optional but recommended)

Examples help users understand what to expect. Add them after the main prompt using HTML comment markers:

```markdown
---
title: My Prompt
...
---

Your prompt text here...

<!-- example-input -->
The input you'd provide to this prompt.

<!-- example-output -->
The kind of response you'd get back.
```

Both markers must be present for examples to appear.

### 6. LLM-specific variants (optional)

If the prompt works differently for different models, add variants using HTML comments:

```markdown
---
title: My Prompt
type: Prompts
category: Technical
shortDescription: >-
  Does a thing.
skills:
  - Skill
---

The base prompt that works for all models...

<!-- variant:claude -->
Claude-specific version of the prompt...

<!-- variant:chatgpt -->
ChatGPT-specific version of the prompt...

<!-- variant:gemini -->
Gemini-specific version of the prompt...
```

### 7. Guidelines

- **Be specific.** Vague prompts ("write something good") aren't useful. Include constraints, structure, and clear instructions.
- **Include variables.** Use `[bracketed placeholders]` so users can customize the prompt (e.g., `[your topic]`, `[target audience]`).
- **Test it.** Run your prompt through at least one LLM (Claude, ChatGPT, or Gemini) and verify it produces quality output.
- **Keep it focused.** One prompt = one task. Don't try to do everything in a single prompt.
- **Add a workflow** for complex prompts that require multiple steps.
- **Add examples** to show users what good input/output looks like.
- **3-5 skills.** Tag 3-5 relevant skills that the prompt teaches or requires.
- **Techniques are auto-detected** from the prompt text at build time, but you can also specify them in frontmatter if needed.

### 8. Submit

```bash
# Fork the repo, create a branch
git checkout -b add/my-prompt-name

# Add your file
git add content/prompts/my-prompt-name.md

# Test locally
npm install
node scripts/generate-prompts.js  # Verify it parses correctly
npm run dev                        # Check it appears in the UI

# Commit and push
git commit -m "Add: my-prompt-name"
git push origin add/my-prompt-name
```

Then open a pull request.

---

## Reporting Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/lukataylo/ask-wisely/issues/new/choose).

---

## Improving the Site

For code changes:

1. Fork and clone the repo
2. `npm install` and `npm run dev`
3. Make your changes
4. Run `npm run build` to verify everything compiles
5. Open a pull request with a clear description

### Key files

| File | Purpose |
|------|---------|
| `App.tsx` | Main app logic, routing, filters |
| `components/PromptCard.tsx` | Prompt card component |
| `components/PromptModal.tsx` | Prompt detail modal |
| `hooks/usePrompts.ts` | Data fetching with abort support |
| `scripts/generate-prompts.js` | Markdown parsing and JSON generation |
| `index.css` | Theme tokens and animations |

---

## Code of Conduct

Be kind, constructive, and respectful. We're all here to make AI tools more accessible.
