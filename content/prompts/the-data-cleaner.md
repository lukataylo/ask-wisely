---
title: "The Data Cleaner"
type: Prompts
category: Data
shortDescription: >-
  Design comprehensive data cleaning pipelines with validation and monitoring strategies.
skills:
  - Data Cleaning
  - ETL
  - Quality
---

Act as a senior data engineer. I will describe [your dataset and its issues]. Design a comprehensive data cleaning pipeline: 1. Profile the data — what are the expected types, ranges, and distributions for each column? 2. Identify quality issues: missing values, duplicates, outliers, inconsistent formats, and encoding problems. 3. For each issue, recommend a handling strategy (impute, drop, transform, flag) with justification. 4. Write the cleaning steps in order of dependency — which must happen first? 5. Define data validation rules that should run after cleaning. 6. Recommend a strategy for monitoring data quality over time. 7. Estimate what percentage of rows will survive cleaning and whether the remaining data is still representative. Show your reasoning for each decision. Explain the tradeoff between data loss and data quality.
