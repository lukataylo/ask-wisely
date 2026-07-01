---
title: Spec-Driven Development
type: Skills
category: Engineering
shortDescription: >-
  Make the specification the primary artifact — spec, then plan, then code — so
  AI agents build the right thing.
difficulty: Intermediate
skills:
  - Spec-Driven Development
  - Planning
  - Agentic Coding
---

Spec-Driven Development (SDD) is the 2026 antidote to "vibe coding": instead of prompting an agent to write code and hoping, you make a written specification the primary artifact and let code follow it. The three-document flow: 1. Spec — describe what to build and why, in plain language: user-facing behavior, inputs and outputs, constraints, and explicit acceptance criteria. No implementation detail yet. 2. Plan — have the agent turn the spec into an ordered, reviewable implementation plan: the steps, the files touched, the risks, and the test strategy. Read and correct the plan before any code exists — this is the cheapest place to catch a wrong turn. 3. Code — the agent implements the plan step by step, checking each step against the spec's acceptance criteria. How to run it with [your feature]: keep the spec in the repo so it is versioned alongside the code; when requirements change, edit the spec first and regenerate the plan, never patch code directly; require the agent to flag any place the spec is ambiguous rather than guessing. Why it wins: the expensive failures in agentic coding come from building the wrong thing correctly. A spec makes intent explicit, reviewable, and testable — turning the agent from an improviser into an executor of a design you actually approved.
