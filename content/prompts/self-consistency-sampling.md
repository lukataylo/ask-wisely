---
title: "Self-Consistency Sampling"
type: Skills
category: Engineering
shortDescription: >-
  Sample multiple reasoning paths and take the majority answer for improved reliability.
skills:
  - Self-Consistency
  - Reliability
  - Voting
---

Self-consistency improves accuracy by sampling multiple reasoning paths and taking the majority answer. Process: 1. Run the same prompt 3-5 times with temperature > 0 (0.5-0.7 works well). 2. Extract the final answer from each response. 3. Take the majority vote — the most common answer wins. Why it works: different reasoning paths may make different intermediate errors, but the correct final answer appears most often. Implementation without API calls: use a single prompt — "Solve [your problem] three different ways. For each way, show your work and state your final answer. Then compare your three answers and state which one you are most confident in." Self-consistency is most powerful on math, logic, and factual questions. It is less useful for creative tasks where there is no single correct answer. Combine with CoT for maximum effect: CoT provides the reasoning, self-consistency provides the reliability.
