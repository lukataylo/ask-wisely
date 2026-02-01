---
title: "Prompt Debugging"
type: Skills
category: AI Literacy
shortDescription: >-
  Debug failing prompts systematically by classifying failures and isolating variables.
skills:
  - Debugging
  - Iteration
  - Optimization
---

When a prompt fails, debug systematically — do not randomly rewrite. Process: 1. Classify the Failure — is the output wrong (factual error), badly formatted (structure error), off-topic (instruction following error), or low quality (nuance error)? Each has a different fix. 2. Isolate the Variable — change one thing at a time. If you change the role AND the format AND the constraints simultaneously, you learn nothing. 3. The Minimal Reproduction — strip the prompt to the bare minimum that still shows the problem. Complexity hides bugs. 4. Common Fixes by Failure Type: Wrong facts — add source grounding or verification step. Bad format — add an explicit example of the desired output. Off-topic — move the key instruction to the first or last sentence. Low quality — add constraints that define what quality means. 5. The Meta-Debug — ask the model: "What instructions did you follow to produce this output?" The model's interpretation of your prompt may surprise you. 6. Temperature Check — if outputs vary too much, lower temperature. If they are too repetitive, raise it. 7. Version Control — keep a log of every prompt version and its output. The fastest prompt engineers debug the most methodically.
