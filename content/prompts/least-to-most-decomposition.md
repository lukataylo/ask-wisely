---
title: "Least-to-Most Decomposition"
type: Skills
category: Engineering
shortDescription: >-
  Break complex problems into subproblems and solve from simplest to hardest, building up.
skills:
  - Decomposition
  - Scaffolding
  - Complexity
---

Least-to-most prompting breaks complex problems into subproblems, solving the easiest first and building up. Two phases: Phase 1 — Decomposition: "Break [your complex problem] into the simplest possible sub-problems, ordered from easiest to hardest." Phase 2 — Sequential solving: solve each sub-problem using the answers to all previous sub-problems as context. Example — "How much would it cost to build a SaaS product for 10,000 users?" Decomposition: (1) What infrastructure is needed? (2) What are the compute costs per user? (3) What are the storage costs? (4) What team is needed? (5) What is the total cost model? Solve each in order. Key differences from CoT: CoT reasons within a single prompt. Least-to-most explicitly scaffolds — each answer feeds the next. This prevents the model from skipping steps or making compounding errors. Best for: math word problems, multi-step planning, architectural decisions, and any problem where later steps depend on earlier answers.
