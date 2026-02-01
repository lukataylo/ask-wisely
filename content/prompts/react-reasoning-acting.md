---
title: "ReAct Framework"
type: Skills
category: Engineering
shortDescription: >-
  Combine reasoning with tool use for tasks requiring real-time information gathering.
difficulty: Advanced
skills:
  - ReAct
  - Tool Use
  - Agent Design
---

ReAct (Reasoning + Acting) combines thinking with doing. The loop: Thought → Action → Observation → Thought. Structure: 1. Thought — the model reasons about what it knows and what it needs. "I need to find the current data on [your topic] to answer this." 2. Action — the model calls a tool or performs a step. "Search: [your query]." 3. Observation — the result comes back with new information. 4. Repeat — the model reasons about the new information and decides the next action. Implementation: Use explicit labels in your prompt: "Thought: [your reasoning]. Action: [what to do]. Observation: [what you learned]." ReAct outperforms pure CoT on tasks requiring external knowledge because it grounds reasoning in real data. Key principle: the model should explain WHY it needs information before requesting it. This prevents aimless tool calls and keeps reasoning on track.
