---
title: System Prompt Architecture
type: Skills
category: Engineering
shortDescription: >-
  Design robust system prompts that establish consistent AI behavior and
  constraints.
skills:
  - System Prompts
  - Behavioral Control
  - Constraint Design
---

System prompts are the constitution of AI behavior. Architecture: 1. Identity Layer — who is the AI? Define role as [your AI role], expertise, and personality in the first paragraph. 2. Behavioral Rules — use numbered constraints. "ALWAYS do X. NEVER do Y." 3. Output Format — specify structure (JSON, markdown, bullet points). 4. Guardrails — define what to do when uncertain, off-topic, or facing edge cases. 5. Examples Layer — embed few-shot examples within the system prompt. 6. Priority Hierarchy — when rules conflict, which takes precedence? Advanced: Use XML tags to section your system prompt for clarity. Test adversarially — try to break your own prompt.
