---
title: Context Engineering
type: Skills
category: Engineering
shortDescription: >-
  Curate everything in the context window — instructions, tools, memory, and
  retrieved data — as a system.
difficulty: Advanced
skills:
  - Context Engineering
  - Memory
  - Information Design
---

Context engineering is the discipline that grew out of prompt engineering: as models moved into agents and long-running tasks, the hard problem stopped being the wording of one prompt and became the deliberate assembly of everything in the context window — system instructions, tool definitions, retrieved documents, conversation history, and memory. Core principles: 1. Treat context as a budget — attention degrades over very long inputs ("context rot"), so every token must earn its place; more context is not better context. 2. Right-size the payload — give the model exactly what the current step needs, not the entire knowledge base; retrieve and inject just-in-time rather than front-loading everything. 3. Compact aggressively — summarize finished sub-tasks and old turns into durable notes, and drop raw transcripts once their conclusions are captured. 4. Externalize memory — persist facts, decisions, and state to files or a store the agent can read back, so working memory stays lean across a long task. 5. Structure for retrieval — order matters (primacy and recency), delimiters aid parsing, and clear section labels help the model find what it needs. 6. Isolate with sub-agents — hand a narrow, well-scoped context to a specialist and return only its result, keeping the orchestrator's window clean. For [your agent], design the whole context as a system, and curate it every turn — the quality of what you put in front of the model is now the main lever on output quality.
