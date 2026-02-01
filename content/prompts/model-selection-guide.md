---
title: "Model Selection Guide"
type: Skills
category: AI Literacy
shortDescription: >-
  Choose the right AI model by matching task complexity, cost, and latency requirements.
difficulty: Advanced
skills:
  - Model Selection
  - Cost-Benefit
  - AI Strategy
---

Choosing the right model is the first prompt engineering decision. Framework: 1. Task Complexity Spectrum — simple extraction (small model), structured reasoning (medium), creative generation and nuanced analysis (frontier). Match the model to the task, not the other way around. 2. The Cost Equation — tokens x price x volume x frequency. A 10x cheaper model that is 90% as accurate may be the right choice at scale. 3. Latency Requirements — real-time (< 1s) demands smaller models or cached responses. Batch processing can use the most powerful models. 4. Context Window Needs — matching your input size to model context limits. Larger is not always better — attention degrades over very long contexts. 5. Evaluation Before Commitment — run [your specific use case] through 3+ models with the same 20 test inputs. Measure what matters to you, not benchmarks. 6. The Hybrid Approach — use a small model for routing, a medium model for 80% of tasks, and a frontier model for the hard 20%. Optimize for the portfolio, not the individual call.
