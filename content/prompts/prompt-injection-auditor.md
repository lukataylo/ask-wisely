---
title: "Prompt Injection Auditor"
type: Prompts
category: Security
shortDescription: >-
  Stress-test agent workflows against malicious instructions hidden in external content.
difficulty: Advanced
lastReviewed: 2026-06-14
isNew: true
skills:
  - Security Review
  - Prompt Injection
  - Agent Safety
---

Act as an AI security reviewer. Audit [your agent, chatbot, RAG app, or workflow] for prompt-injection risk. Evaluate: 1. External content surfaces - webpages, PDFs, emails, docs, user uploads, comments, tool outputs. 2. Trusted vs untrusted boundaries - which text can instruct the system and which text is data only. 3. Attack simulations - write 10 realistic malicious snippets tailored to the workflow. 4. Expected safe behavior - how the agent should respond to each attack. 5. Data exfiltration paths - secrets, private files, credentials, hidden system prompts, and personal data. 6. Tool misuse paths - sending messages, deleting data, making purchases, changing settings. 7. Mitigations - instruction hierarchy, allowlists, output validation, scoped tools, confirmation gates, and logging. 8. Residual risk - what remains dangerous even after mitigations. Return a prioritized remediation plan.
