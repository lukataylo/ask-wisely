---
title: "Hallucination Detection"
type: Skills
category: AI Literacy
shortDescription: >-
  Identify and prevent AI fabrications with specificity tests and grounding techniques.
skills:
  - Hallucination
  - Verification
  - Trust
---

Language models generate plausible text, not truthful text. They will confidently fabricate facts, citations, statistics, and quotes. Detection strategies: 1. The Specificity Test — the more specific the claim (names, dates, numbers, URLs), the higher the hallucination risk. Verify every specific claim independently. 2. The Confidence Inversion — counterintuitively, the most confidently stated facts are often the most fabricated. Hedged statements ("likely," "approximately") are often more reliable. 3. Citation Verification — if the model cites a paper or source, check that it exists. Fabricated citations are extremely common. 4. Internal Consistency — ask the same factual question three times in different ways. If answers contradict, at least some are hallucinated. 5. Knowledge Boundary Testing — ask the model "What don't you know about [your topic]?" Models that acknowledge uncertainty are in a more reliable mode. 6. Grounding Techniques — provide source documents and instruct "Only use information from the provided text. If the answer is not in the text, say so." The rule: treat model output like a first draft from a knowledgeable but unreliable colleague. Trust the structure, verify the facts.
