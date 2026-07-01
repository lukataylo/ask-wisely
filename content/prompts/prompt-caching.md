---
title: Prompt Caching
type: Skills
category: Engineering
shortDescription: >-
  Cut latency and cost dramatically by reusing a cached prefix across repeated
  calls.
difficulty: Intermediate
skills:
  - Prompt Caching
  - Cost Optimization
  - Latency
---

Prompt caching stores the model's processed representation of a stable prompt prefix so repeated calls skip re-reading it — often cutting cost by up to 90% and latency by more than half on the cached portion. How to exploit it: 1. Structure for stability — put the parts that never change (system prompt, tool definitions, [your reference documents], few-shot examples) at the very top, and the parts that change (the user's latest turn) at the bottom. Caches match on an exact prefix, so a single edited character near the top invalidates everything after it. 2. Mark the boundary — with providers that use explicit cache breakpoints, place the marker at the end of your stable block; with automatic caching, simply keep that block byte-for-byte identical between calls. 3. Keep it warm — caches expire after a few minutes of inactivity, so batch related calls together or send periodic keep-alive requests for hot workloads. 4. Measure — watch cache-read vs. cache-write token counts to confirm you are actually hitting the cache. Best fits: multi-turn chat over a large fixed context, RAG with a shared instruction block, agent loops that resend the same tools and system prompt every step, and batch jobs that reuse the same lengthy preamble. The rule: cache the boring parts, pay full price only for what is genuinely new.
