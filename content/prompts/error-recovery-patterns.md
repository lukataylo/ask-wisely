---
title: Error Recovery Patterns
type: Skills
category: Engineering
shortDescription: >-
  Handle AI errors, hallucinations, and unexpected outputs with resilient
  prompt design.
skills:
  - Error Handling
  - Hallucination Detection
  - Resilience
---

AI outputs will fail. Build resilience in: 1. Verification Prompts — after generation, ask the model to fact-check its own output on [your topic/domain]. 2. Confidence Scoring — append "Rate your confidence 1-10 and explain why" to detect uncertainty. 3. Contradiction Detection — ask the model to list ways its answer could be wrong. 4. Source Attribution — require citations for every claim. No source = flagged. 5. Fallback Chains — if the first prompt fails format validation, retry with a simplified version. 6. Adversarial Testing — regularly try inputs designed to produce errors. 7. Output Validation — parse, type-check, and constraint-check every response before using it. Treat AI output like user input: never trust, always verify.
