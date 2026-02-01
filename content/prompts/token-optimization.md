---
title: Token Optimization
type: Skills
category: Engineering
shortDescription: >-
  Maximize output quality while minimizing token usage for cost-effective
  prompting.
difficulty: Intermediate
skills:
  - Efficiency
  - Cost Optimization
  - Compression
---

Token optimization is the art of saying more with less. Techniques: 1. Front-load critical instructions — models attend most to the beginning and end. 2. Use structured formats (tables, bullet points) over prose for context. 3. Replace repeated instructions with a reference label defined once. 4. Compress context: summarize [your context/background] instead of pasting raw text. 5. Use output constraints: "Respond in exactly 3 bullet points" prevents rambling. 6. Batch related questions into one prompt instead of multiple calls. 7. For code tasks, provide the function signature and let the model fill the body. Measure: track tokens-per-useful-output as your efficiency metric.
