---
title: Prompt Engineering 101
type: Skills
category: Engineering
shortDescription: >-
  The foundational principles of clear, structured prompting for modern
  reasoning models.
difficulty: Beginner
skills:
  - LLM Logic
  - Structure
  - Precision
---

Master the fundamentals of prompting. 1. Be explicit — state the task, audience, and desired outcome in the first sentence. Ambiguity is the number one cause of bad output. 2. Use delimiters (XML tags, triple quotes, or markdown headers) to separate your instructions from [your input]. 3. Specify the output format (JSON, markdown, a filled template) and show one example of it. 4. Provide examples (few-shot) whenever the task has a specific style or tricky edge cases. 5. Let the model reason — modern reasoning models (Claude extended thinking, OpenAI o-series, Gemini thinking) plan step by step on their own, so "let's think step by step" is rarely needed anymore; reserve explicit chain-of-thought for older or smaller models. 6. Iterate — treat your first prompt as a draft and refine it based on where the output misses. Good prompting is clear communication, not magic words.
