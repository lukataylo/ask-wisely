---
title: Agent Coding Guardrails
type: Skills
category: Engineering
shortDescription: >-
  Keep coding agents on the rails with a short set of behavioral rules that
  prevent their most expensive failures.
difficulty: Intermediate
skills:
  - Agentic Coding
  - Guardrails
  - Code Quality
---

Coding agents fail in predictable ways, and a handful of standing rules — popularized by Andrej Karpathy's observations on where LLM coding goes wrong — prevent most of the damage. Add these as behavioral guardrails to [your project] instructions or system prompt: 1. Verify assumptions, never assume silently — if a fact, path, type, or API contract is unknown, check it or ask; do not invent it and build on the guess. 2. Do not over-engineer — resist the model's tendency toward code hypertrophy: unnecessary abstractions, speculative generality, and layers nobody asked for. Prefer the simplest thing that satisfies the requirement. 3. Make surgical changes only — touch exactly what the task requires. No opportunistic refactors, no reformatting unrelated code, no collateral edits to things that were working. 4. Define verifiable success criteria up front — state how you will know the change worked (a test, a command, an observable behavior) before writing it, then actually check against it. 5. State uncertainty out loud — flag the parts you are least sure about instead of presenting everything with equal confidence. Use these rules as a menu, not gospel — keep the ones that match how your agent actually misbehaves. The point is not more process; it is naming the concrete rails that turn a fast-but-reckless agent into a reliable collaborator.
