---
title: "Step-Back Prompting"
type: Skills
category: Engineering
shortDescription: >-
  Derive general principles before solving specific problems to reduce errors by 36%.
skills:
  - Abstraction
  - Step-Back
  - Reasoning
---

Step-back prompting asks the model to derive a general principle before solving the specific problem. Process: 1. Present [your specific question]. 2. Before answering, ask: "What is the general principle or concept behind this question?" 3. Have the model answer the general question first. 4. Then apply that principle to the specific case. Example — Specific: "What happens to the pressure of an ideal gas if I double the temperature and halve the volume?" Step-back: "What are the physics principles governing ideal gas behavior?" The model retrieves PV=nRT, then applies it correctly. Why it works: specific questions trigger pattern matching (which can be wrong). Abstract questions trigger deeper knowledge retrieval. Step-back prompting reduces errors on physics and chemistry benchmarks significantly. Use it whenever the question has an underlying framework the model might skip over in its rush to answer.
