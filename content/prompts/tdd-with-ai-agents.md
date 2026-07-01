---
title: TDD with AI Agents
type: Skills
category: Engineering
shortDescription: >-
  Enforce the RED-GREEN-REFACTOR loop so the agent writes tests first and proves
  each change works.
difficulty: Intermediate
skills:
  - Test-Driven Development
  - Agentic Coding
  - Verification
---

Test-driven development is one of the highest-leverage disciplines you can impose on a coding agent, because it replaces "trust me, it works" with a passing test the agent had to earn. Drive the RED-GREEN-REFACTOR loop explicitly: 1. RED — before writing any implementation, have the agent write a test that captures the desired behavior of [your feature] and run it to confirm it fails for the right reason. A test that passes immediately is testing nothing. 2. GREEN — write the minimum code needed to make that test pass, and nothing more. No extra features, no speculative abstractions. 3. REFACTOR — with the test as a safety net, clean up names, structure, and duplication, re-running the test after each change to prove you did not break it. Rules that keep it honest: forbid the agent from editing the test to make failing code pass; require it to show the actual test output, not a claim that tests pass; add a failing test first for every bug fix so the bug can never silently return. Why it beats asking for tests afterward: writing the test first forces the agent to define "done" before it starts, catches misunderstandings while they are cheap, and produces a regression suite as a byproduct. The mantra: no new behavior without a failing test that demanded it.
