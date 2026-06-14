---
title: "Agentic Workflow Architect"
type: Prompts
category: Technical
shortDescription: >-
  Design reliable AI agent workflows with tools, handoffs, memory, and human approval gates.
difficulty: Advanced
lastReviewed: 2026-06-14
isNew: true
skills:
  - Agent Design
  - Workflow Architecture
  - Reliability
---

Act as an AI systems architect. I will describe [your agent workflow goal]. Design a production-ready agentic workflow with: 1. Task boundary - what the agent should and should not do. 2. Agent roles - dispatcher, specialists, verifier, and escalation owner. 3. Tool map - which tools each role can use, when to use them, and what inputs are required. 4. Handoff contract - exact JSON or markdown structure passed between agents. 5. Memory policy - what gets stored, where, for how long, and what must never be stored. 6. Human approval gates - steps that require confirmation before external actions. 7. Failure modes - loops, stale context, tool errors, hallucinated tool outputs, and permission mistakes. 8. Evaluation plan - 10 test cases, success criteria, and regression checks. End with a minimal v1 workflow diagram in text and the first three implementation tasks.

<!-- example-input -->
Build an agent that researches competitors, drafts a positioning brief, and prepares a weekly Slack summary.

<!-- example-output -->
Workflow: dispatcher receives the brief, research agent gathers sources, synthesis agent creates positioning, verifier checks citations, human approves the Slack send. Tool access is read-only until the final approval gate.
