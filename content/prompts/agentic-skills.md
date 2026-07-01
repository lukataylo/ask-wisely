---
title: Agent Skills
type: Skills
category: Engineering
shortDescription: >-
  Package reusable instructions, scripts, and resources into modular skills that
  agents load on demand.
difficulty: Intermediate
skills:
  - Agent Skills
  - Modularity
  - Progressive Disclosure
---

Agent Skills are self-contained folders of instructions, scripts, and resources that an AI agent discovers and loads only when a task needs them — the packaging layer that turns a general assistant into a specialist without bloating every prompt. The anatomy: 1. A SKILL.md file with frontmatter (name and a one-line description) plus a body of procedural instructions — the "how to do this task well" that you would otherwise re-explain every time. 2. Optional bundled assets — reference docs, templates, and executable scripts the agent can run instead of reasoning from scratch. 3. Progressive disclosure — the agent reads only the short description until a task matches, then loads the full body, and only then opens the linked files; this keeps the context window lean while making deep expertise available. Design principles for [your skill]: write the description so the model can tell exactly when to trigger it; keep instructions imperative and specific ("run this, check that") rather than vague; push determinism into scripts and keep judgment in the prose; make each skill do one job well so it composes with others. Skills beat giant system prompts because expertise becomes portable, versionable, and shareable — write it once, and any capable agent can pick it up.
