---
title: The Growth Hacker
type: Prompts
category: Business
shortDescription: >-
  Design data-driven growth experiments with clear hypotheses and measurement
  frameworks.
difficulty: Intermediate
workflow:
  - "Describe your product and share your current key metrics (MRR, DAU, churn rate, etc.)"
  - "Review the growth model analysis and confirm which lever has the most headroom"
  - "Evaluate the ten experiment ideas and refine ICE scores based on your context"
  - "Design and launch the top three experiments with proper tracking"
  - "Run weekly growth meetings using the suggested agenda to review results"
  - "Double down on winners, kill losers fast, and start the next sprint"
skills:
  - Growth Strategy
  - Experimentation
  - Metrics
---

Act as a Head of Growth at a Series B startup. I will describe my product ([your product]) and current metrics. Design a growth sprint: 1. Identify the growth model — which lever (acquisition, activation, retention, revenue, referral) has the most headroom? 2. Generate ten experiment ideas for that lever. 3. Prioritize using ICE scoring (Impact, Confidence, Ease). 4. For the top three experiments, define: hypothesis, success metric, sample size, and duration. 5. Design the dashboard that tracks these experiments. 6. Plan the "growth meeting" agenda for weekly reviews. Think about what would happen if each experiment succeeded — what is the second-order effect?

<!-- variant:claude -->
Act as a Head of Growth at a Series B startup. I will describe my product ([your product]) and current metrics.

<growth-sprint>
Design a complete growth sprint following this framework:

<phase name="diagnosis">
Identify the growth model — analyze which lever (acquisition, activation, retention, revenue, referral) has the most headroom. Show your reasoning with the current metrics.
</phase>

<phase name="ideation">
Generate ten experiment ideas for the identified lever. For each, include a one-sentence description and which sub-metric it targets.
</phase>

<phase name="prioritization">
Prioritize using ICE scoring (Impact 1-10, Confidence 1-10, Ease 1-10). Present as a ranked table.
</phase>

<phase name="experiment-design">
For the top three experiments, define:
- Hypothesis (if we do X, Y will change by Z%)
- Success metric with current baseline
- Minimum sample size for statistical significance
- Duration and rollout plan
</phase>

<phase name="dashboard">
Design the dashboard that tracks these experiments. List every metric, its data source, and alert thresholds.
</phase>

<phase name="cadence">
Plan the "growth meeting" agenda for weekly reviews. Include who attends, what's reported, and decision framework.
</phase>
</growth-sprint>

Think about what would happen if each experiment succeeded — what is the second-order effect?

<!-- variant:chatgpt -->
# Growth Sprint Design

Act as a Head of Growth at a Series B startup. I will describe my product ([your product]) and current metrics.

Design a complete growth sprint following this step-by-step framework:

## Step 1: Growth Model Diagnosis
Analyze each AARRR lever (Acquisition, Activation, Retention, Revenue, Referral) against my current metrics. Identify which lever has the most headroom. Show your reasoning in a table:
| Lever | Current Metric | Benchmark | Gap | Headroom Score |

## Step 2: Experiment Ideation
Generate 10 experiment ideas for the top lever. Format as a numbered list with a one-sentence description and target sub-metric for each.

## Step 3: ICE Prioritization
Score each experiment using ICE framework. Present as a sorted table:
| # | Experiment | Impact (1-10) | Confidence (1-10) | Ease (1-10) | Score |

## Step 4: Top 3 Experiment Design
For each of the top 3 experiments, provide:
- **Hypothesis:** If we [action], [metric] will [change] by [amount]
- **Success Metric:** [metric name] — current baseline: [value]
- **Sample Size:** Minimum needed for statistical significance
- **Duration:** [X weeks] with rollout plan

## Step 5: Tracking Dashboard
Design the dashboard. List every metric, its data source, update frequency, and alert thresholds.

## Step 6: Weekly Growth Meeting Agenda
Template with: attendees, metrics review, experiment updates, decision framework, and next actions.

**For each experiment, think about the second-order effects if it succeeds.**

<!-- example-input -->
Product: A B2B SaaS project management tool. Current metrics: 2,000 MAU, 15% monthly churn, $49 ARPU, CAC $120.
<!-- example-output -->
**Growth Model Analysis:**
The biggest lever is **retention** — at 15% monthly churn, you lose your entire user base every ~6 months. Fixing churn before scaling acquisition prevents pouring water into a leaky bucket.

**Top 3 Experiments (ICE scored):**

1. **Onboarding checklist with milestone emails** (ICE: 9/8/7 = 8.0)
   - Hypothesis: Guided onboarding → 20% more users reach "aha moment" (3+ projects created)
   - Metric: Day-7 retention rate
   - Sample: 500 new signups, 2-week test

2. **Weekly digest email with team activity summary** (ICE: 7/7/9 = 7.7)
   - Hypothesis: Activity reminders → 10% reduction in dormant accounts
   - Metric: WAU/MAU ratio
   - Sample: 1,000 existing users, 4-week test

3. **In-app NPS survey at day 14 with follow-up** (ICE: 6/8/8 = 7.3)
   - Hypothesis: Early feedback loop → identify and save at-risk accounts
   - Metric: 30-day churn rate for surveyed cohort
