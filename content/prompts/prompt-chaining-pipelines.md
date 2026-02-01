---
title: "Prompt Chaining Pipelines"
type: Skills
category: Engineering
shortDescription: >-
  Connect multiple prompts into pipelines where each step feeds the next for complex workflows.
skills:
  - Chaining
  - Pipelines
  - Orchestration
---

Prompt chaining connects multiple prompts into a pipeline where each step's output feeds the next. Architecture patterns: 1. Sequential Chain — A → B → C. Example: Research → Draft → Edit → Format. 2. Branching Chain — A → [B1, B2, B3] → C (merge). Generate three perspectives, then synthesize. 3. Validation Chain — A → B (validate) → if fail, A (retry). 4. Refinement Loop — A → B (critique) → A (revise) → B (critique) until pass. Design principles for [your workflow]: Each step should have a single, clear responsibility. Define the exact output format of each step so the next step can parse it. Include error handling: "If the input doesn't contain X, respond with ERROR: [reason]." Keep each step's context window focused — summarize prior steps rather than passing full transcripts. Chaining outperforms single mega-prompts because each step gets full attention on a narrower task. The tradeoff is latency and cost — use chaining when quality matters more than speed.
