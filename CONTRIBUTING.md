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
---

The full prompt text goes here. Use [bracketed placeholders] for
parts the user should customize.
```

### 3. Choose the right type and category

| Type | Categories |
|------|-----------|
| **Prompts** | Creative, Technical, Business, Academic, Persona, Product, Data, Marketing, Personal, Legal, Education, Healthcare |
| **Image Prompts** | Cinematic, Portrait, Stylized, Architecture, Commercial, Interface |
| **Skills** | Engineering, Writing, Strategy, Design, Communication, AI Literacy |

### 4. Guidelines

- **Be specific.** Vague prompts ("write something good") aren't useful. Include constraints, structure, and clear instructions.
- **Include variables.** Use `[bracketed placeholders]` so users can customize the prompt (e.g., `[your topic]`, `[target audience]`).
- **Test it.** Run your prompt through at least one LLM (Claude, ChatGPT, or Gemini) and verify it produces quality output.
- **Keep it focused.** One prompt = one task. Don't try to do everything in a single prompt.
- **3-5 skills.** Tag 3-5 relevant skills that the prompt teaches or requires.
- **Techniques are auto-detected** from the prompt text at build time, but you can also specify them in frontmatter if needed.

### 5. LLM-specific variants (optional)

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
```

### 6. Submit

```bash
# Fork the repo, create a branch
git checkout -b add/my-prompt-name

# Add your file
git add content/prompts/my-prompt-name.md

# Test locally
npm install
npm run dev

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

---

## Code of Conduct

Be kind, constructive, and respectful. We're all here to make AI tools more accessible.
