---
title: Reasoning Model Prompting
type: Skills
category: Engineering
shortDescription: >-
  Prompt extended-thinking models by setting goals and budgets instead of
  scripting their steps.
difficulty: Intermediate
skills:
  - Reasoning Models
  - Extended Thinking
  - Prompt Strategy
---

Reasoning models (Claude with extended thinking, OpenAI's o-series, Gemini thinking) plan, decompose, and self-check internally before answering — so the prompting playbook that suited earlier models can actively hurt them. What changes: 1. Describe the destination, not the route — state the goal, the constraints, and what a great answer looks like, then let the model find the path. Micromanaging with "first do X, then do Y" fights its own planning and often lowers quality. 2. Drop the incantations — "let's think step by step" is redundant because the reasoning already happens; use that space for real context instead. 3. Tune the thinking budget — spend more reasoning effort on genuinely hard math, code, and multi-constraint problems; dial it down for simple lookups where extra thinking wastes latency and tokens. 4. Give it room to be wrong first — reasoning models excel when allowed to explore and revise, so avoid over-constraining the format until the final answer. 5. Provide verifiable context — grounding facts, test cases, and success criteria let the model check its own work, which is where these models shine. When to skip them: high-volume, latency-sensitive, or trivially simple tasks, where a fast non-reasoning model is cheaper and just as accurate. Match the tool to [your task] — reasoning is powerful, but it is not free.
