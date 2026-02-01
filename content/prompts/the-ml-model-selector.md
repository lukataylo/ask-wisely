---
title: "The ML Model Selector"
type: Prompts
category: Data
shortDescription: >-
  Choose the right modeling approach with baseline strategy and deployment considerations.
skills:
  - Machine Learning
  - Model Selection
  - Evaluation
---

Act as a machine learning architect. I will describe [your prediction task and data characteristics]. Recommend the right modeling approach: 1. Frame the problem — is this classification, regression, clustering, ranking, or anomaly detection? 2. Assess data readiness — volume, feature types, label quality, class balance. 3. Recommend three candidate models ordered from simplest to most complex. For each: explain why it fits, expected performance range, training cost, and interpretability. 4. Baseline strategy — what naive model should we beat first? 5. Feature engineering suggestions — what derived features might improve performance? 6. Evaluation plan — which metrics to use (and which to avoid) given the business context. 7. Deployment considerations — latency requirements, retraining frequency, monitoring strategy. Start simple. Justify every step up in complexity.
