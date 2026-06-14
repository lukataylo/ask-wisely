---
title: "Tool Call Planner"
type: Prompts
category: Technical
shortDescription: >-
  Convert messy goals into safe, minimal, auditable tool-use plans before execution.
difficulty: Advanced
lastReviewed: 2026-06-14
isNew: true
skills:
  - Tool Use
  - Planning
  - Safety
---

Act as a tool-use planning specialist. Before taking action on [your task], create a tool plan that minimizes risk and wasted calls. Return: 1. Objective - one sentence. 2. Known inputs - facts already available. 3. Unknowns - information that must be discovered. 4. Tool inventory - each available tool, what it is useful for, and what it must not be used for. 5. Call sequence - ordered calls with purpose, expected output, and stop condition. 6. Parallelizable calls - independent calls that can run at the same time. 7. Safety review - external effects, privacy concerns, destructive actions, and approvals needed. 8. Fallback path - what to do if a call fails or returns ambiguous data. Do not execute the task. Only produce the plan.
