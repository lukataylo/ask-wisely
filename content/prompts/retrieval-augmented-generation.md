---
title: Retrieval-Augmented Generation
type: Skills
category: Engineering
shortDescription: >-
  Ground model output in your own data by retrieving relevant context before
  generation.
difficulty: Advanced
skills:
  - RAG
  - Grounding
  - Retrieval
---

Retrieval-Augmented Generation (RAG) fixes the two biggest LLM weaknesses — stale knowledge and hallucination — by fetching relevant facts and putting them in the prompt before the model answers. The pipeline: 1. Chunk — split [your knowledge base] into passages of roughly 200-500 tokens with 10-15% overlap so ideas are not cut mid-thought. 2. Embed and Index — convert each chunk to a vector and store it in a vector database; add metadata (source, date, section) for filtering. 3. Retrieve — embed the user's question, pull the top-k most similar chunks, then re-rank them so the best evidence sits closest to the answer. 4. Augment — insert the retrieved passages into the prompt with clear delimiters and the instruction: "Answer only from the context below. If the answer is not present, say you don't know and cite nothing." 5. Cite — require the model to reference the source of each claim so answers are auditable. Quality levers: better chunking beats a bigger model; hybrid search (keyword + vector) beats pure vector for names and codes; retrieval evals (is the right chunk in the top-k?) matter more than generation evals. Reach for RAG when answers must be current, private, or verifiable — and prefer it over fine-tuning when the knowledge changes often.
