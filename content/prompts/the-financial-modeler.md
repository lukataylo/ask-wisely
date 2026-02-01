---
title: The Financial Modeler
type: Prompts
category: Business
shortDescription: >-
  Build financial projections with sensitivity analysis and key assumption
  documentation.
difficulty: Advanced
workflow:
  - "Describe your business model, current revenue, and key cost drivers"
  - "Review the unit economics breakdown and validate the assumptions"
  - "Examine the three scenario projections and challenge the base case assumptions"
  - "Run the sensitivity analysis — focus on the single variable with most impact"
  - "Identify your cash-out date and plan fundraising or cost cuts accordingly"
  - "Set up weekly metric tracking using the recommended KPIs"
skills:
  - Financial Modeling
  - Forecasting
  - Unit Economics
---

Act as a CFO with experience in high-growth startups. I will describe my business model: [your business model]. Build: 1. A unit economics breakdown — CAC, LTV, payback period, and the ratios between them. 2. A 24-month revenue projection with three scenarios (conservative, base, optimistic). 3. For each scenario, state the three assumptions that most impact the outcome. 4. Run a sensitivity analysis — which single variable, if 20% wrong, changes the conclusion? 5. Identify the cash-out date for each scenario. 6. Recommend the key financial metrics to track weekly. Show your calculations step by step. Flag where you are estimating vs. calculating.

<!-- variant:claude -->
Act as a CFO with experience in high-growth startups. I will describe my business model: [your business model].

<financial-model>

<section name="unit-economics">
Build a unit economics breakdown:
- CAC (Customer Acquisition Cost): show calculation
- LTV (Lifetime Value): show formula and inputs
- Payback period
- LTV:CAC ratio with benchmark comparison
Present as a structured table with your calculations visible.
</section>

<section name="projections">
Build a 24-month revenue projection with three scenarios:
| Month | Conservative | Base | Optimistic |
For each scenario, state the three assumptions that most impact the outcome.
</section>

<section name="sensitivity">
Run a sensitivity analysis:
- Identify which single variable, if 20% wrong, changes the conclusion
- Show the impact matrix
- Highlight the critical threshold where the model breaks
</section>

<section name="runway">
Identify the cash-out date for each scenario. Calculate months of runway remaining.
</section>

<section name="metrics">
Recommend the key financial metrics to track weekly. For each metric, define the formula and alert threshold.
</section>

</financial-model>

Show your calculations step by step. Use artifacts for tables and spreadsheet-like outputs. Flag explicitly where you are estimating vs. calculating.

<!-- variant:chatgpt -->
# Financial Model Builder

Act as a CFO with experience in high-growth startups. I will describe my business model: [your business model].

Build a comprehensive financial model following these steps. **Show all calculations.** Use Code Interpreter for complex math if needed.

## 1. Unit Economics Breakdown
Calculate and present in a table:
| Metric | Value | Formula | Benchmark |
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)
- Payback Period
- LTV:CAC Ratio

## 2. 24-Month Revenue Projection
Create a month-by-month projection table with three scenarios:
| Month | Conservative | Base | Optimistic |

For each scenario, list the 3 key assumptions that drive the numbers.

## 3. Sensitivity Analysis
- Test: what happens if each key variable is 20% wrong?
- Format as an impact matrix: | Variable | -20% Impact | +20% Impact | Conclusion Change? |
- Highlight the single variable that matters most

## 4. Cash Runway Analysis
For each scenario:
- Monthly burn rate
- Cash-out date
- Months of runway remaining
- Minimum revenue needed to reach breakeven

## 5. Weekly Metrics Dashboard
| Metric | Formula | Current | Target | Alert Threshold |

**Flag explicitly where you are estimating vs. calculating with real data.**
