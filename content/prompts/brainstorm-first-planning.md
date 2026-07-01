---
title: Brainstorm-First Planning
type: Skills
category: Engineering
shortDescription: >-
  Force the AI to interrogate you and resolve the whole design tree before it
  writes a single line.
difficulty: Beginner
skills:
  - Planning
  - Requirements Discovery
  - Agentic Coding
---

The fastest way to ruin an agent's output is to let it start building before it understands the problem. Brainstorm-first planning flips that: you make the model interview you until you share a genuine understanding, and only then let it act. The prompt pattern: "Before writing anything, interview me relentlessly about this task. Walk down each branch of the design tree one decision at a time, surface the dependencies between decisions, and resolve them with me before moving on. Ask one question at a time. Do not propose a solution or write code until you can restate the goal, the constraints, and the acceptance criteria back to me and I confirm they are correct." Why it works: 1. It converts your vague intent into explicit requirements — the ambiguity that would otherwise become bugs gets caught in conversation, where fixing it is free. 2. One question at a time keeps you from rubber-stamping a wall of assumptions. 3. Forcing the model to restate the goal exposes misunderstandings before they cost anything. 4. The resulting shared understanding becomes the spec for whatever comes next. Use it for [your task] whenever the problem is underspecified, the stakes are high, or you have been burned by an agent confidently building the wrong thing. The discipline: no solution until the questions run dry.
