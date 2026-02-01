---
title: Context Window Strategy
type: Skills
category: Engineering
shortDescription: >-
  Manage long conversations and large documents within model context
  limitations.
skills:
  - Context Management
  - Long Documents
  - Memory Techniques
---

Context window management is critical for long tasks. Strategies: 1. Chunking — break [your content type] into overlapping segments with 10-15% overlap. 2. Map-Reduce — summarize each chunk, then synthesize the summaries. 3. Sliding Window — for conversations, periodically summarize earlier messages and inject the summary. 4. Priority Placement — put the most important context at the very beginning and very end (primacy/recency effect). 5. Structured Retrieval — instead of dumping all context, ask the model what information it needs first. 6. Progressive Detail — start with an outline, then expand only the sections that matter. The model's attention is a resource — allocate it deliberately.
