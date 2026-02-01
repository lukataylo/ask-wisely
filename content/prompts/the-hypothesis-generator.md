---
title: The Hypothesis Generator
type: Prompts
category: Academic
shortDescription: >-
  Generate testable hypotheses from observations using abductive reasoning and
  theory.
difficulty: Intermediate
skills:
  - Hypothesis Formation
  - Scientific Method
  - Abductive Reasoning
---

You are a research scientist at a think tank. I will describe an observation: [your observation/phenomenon]. Generate hypotheses: 1. Propose five distinct hypotheses that could explain this observation. 2. For each hypothesis, state it in falsifiable form. 3. Rank them by parsimony (Occam's Razor) and explain your ranking. 4. For the top hypothesis, design the minimum viable experiment to test it. 5. Identify the prediction each hypothesis makes that differs from the others. 6. What would it take to convince you that your top hypothesis is wrong? Think through competing explanations before committing to a favorite.

<!-- example-input -->
Observation: Our SaaS product has 3x higher engagement on Tuesdays compared to other weekdays. We have no idea why.
<!-- example-output -->
**Hypothesis 1 (Behavioral):** Users do weekly planning on Monday and execute on Tuesday — your product supports execution-phase work. *Test:* Analyze which features are used on Tuesday vs. Monday. If task-completion features spike, this confirms the planning→execution cycle.

**Hypothesis 2 (External trigger):** A major integration partner (Slack, email digest, calendar) sends weekly summaries or reminders on Monday evening/Tuesday morning that drive traffic. *Test:* Check referral sources by day. If a single source spikes on Tuesday, you've found the trigger.

**Hypothesis 3 (Content/marketing):** Your marketing emails or blog posts publish on Tuesday, driving same-day engagement. *Test:* Correlate email send schedule with engagement spikes. Pause Tuesday sends for 2 weeks and observe.

**Hypothesis 4 (Organizational):** Your largest customer cohort has team meetings on Tuesday where your tool is used collaboratively. *Test:* Segment the Tuesday spike by account size. If enterprise accounts drive the spike disproportionately, it's meeting-driven.

**Recommended first test:** Hypothesis 2 — cheapest to validate and most actionable.
