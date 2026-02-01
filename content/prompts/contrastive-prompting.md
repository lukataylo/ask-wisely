---
title: "Contrastive Prompting"
type: Skills
category: Engineering
shortDescription: >-
  Show both good and bad examples to sharpen output quality and define clear boundaries.
skills:
  - Contrastive Learning
  - Boundaries
  - Quality
---

Contrastive prompting sharpens output quality by showing both good and bad examples. Structure: "Here is an excellent example of [your task]: [good example]. Here is a poor example of the same task: [bad example]. Notice the differences in [specific quality dimensions]. Now produce output that matches the excellent example's quality." Why it works: positive-only examples leave the boundaries undefined — the model knows what to aim for but not what to avoid. Contrastive pairs define both the target and the boundary. Advanced technique — self-contrast: 1. Ask the model to generate a response. 2. Ask it to generate a deliberately bad version. 3. Ask it to articulate the differences. 4. Ask it to generate a final version that maximizes the good qualities. Dimensions to contrast: specificity vs. vagueness, evidence-based vs. opinion, actionable vs. abstract, concise vs. verbose. Contrastive prompting is especially effective for subjective tasks (writing, design feedback, code review) where quality is hard to define but easy to compare.
