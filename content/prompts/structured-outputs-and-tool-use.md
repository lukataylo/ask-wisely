---
title: Structured Outputs & Tool Use
type: Skills
category: Engineering
shortDescription: >-
  Get schema-valid JSON and reliable function calls so model output plugs
  straight into code.
difficulty: Intermediate
skills:
  - Structured Output
  - Tool Use
  - Function Calling
---

Structured outputs and tool use turn a chat model into a dependable component of a software system by forcing responses into a shape your code can parse and act on. Structured outputs: 1. Define a JSON Schema for [your output] with typed fields, enums for closed choices, and required keys. 2. Use the provider's structured-output or JSON mode so decoding is constrained to valid JSON — this is far more reliable than merely asking "respond in JSON." 3. Keep schemas flat and shallow; deeply nested or ambiguous schemas raise error rates. 4. Give each field a description — the model reads it as an instruction. Tool use (function calling): 1. Expose functions as named tools with a schema for their arguments; the model returns a structured call, your code executes it, and you feed the result back for the next step. 2. Write tool descriptions for the model — state what it does, when to use it, and what it returns. 3. Make tools idempotent and validate arguments server-side; never trust the model to enforce constraints your code depends on. 4. Return errors as structured, descriptive messages so the model can self-correct instead of guessing. The mindset shift: stop treating the model as a text generator and start treating it as a planner that emits structured actions — reliability comes from the schema and your validation, not from hoping the prose is well-formed.
