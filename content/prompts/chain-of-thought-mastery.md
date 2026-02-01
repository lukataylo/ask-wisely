---
title: Chain of Thought Mastery
type: Skills
category: Engineering
shortDescription: >-
  Force step-by-step reasoning to improve accuracy on complex multi-step
  problems.
difficulty: Advanced
skills:
  - Chain of Thought
  - Reasoning
  - Accuracy
---

Chain-of-Thought (CoT) prompting forces the model to show its work. Technique: Add "Let's think step by step" to [your task/problem] or "Walk through your reasoning" to any complex prompt. Advanced CoT: 1. Break the problem into numbered sub-problems. 2. Require the model to solve each sub-problem before moving to the next. 3. Ask it to verify each step before proceeding. 4. Use "Wait — let me reconsider step N" to trigger self-correction. CoT increases accuracy on math, logic, and multi-step reasoning by 20-40%. The key insight: thinking tokens are compute tokens.

<!-- variant:claude -->
Chain-of-Thought (CoT) prompting forces the model to show its work.

<technique-guide>

<core>
Add "Let's think step by step" to [your task/problem] or "Walk through your reasoning" to any complex prompt.
</core>

<advanced-techniques>
1. Break the problem into numbered sub-problems
2. Require the model to solve each sub-problem before moving to the next
3. Ask it to verify each step before proceeding
4. Use "Wait — let me reconsider step N" to trigger self-correction
</advanced-techniques>

<claude-specific>
Claude supports extended thinking with the thinking parameter. For maximum CoT effectiveness:
- Use XML tags to structure reasoning: <thinking>, <analysis>, <conclusion>
- Ask Claude to "use artifacts" for complex outputs so reasoning stays separate
- Leverage Claude's strength with long, structured prompts — don't simplify
- Use "Before answering, consider..." to front-load reasoning
</claude-specific>

CoT increases accuracy on math, logic, and multi-step reasoning by 20-40%. The key insight: thinking tokens are compute tokens.
</technique-guide>

<!-- variant:chatgpt -->
# Chain-of-Thought (CoT) Prompting Mastery

CoT prompting forces the model to show its work.

## Core Technique
Add "Let's think step by step" to [your task/problem] or "Walk through your reasoning" to any complex prompt.

## Advanced CoT Techniques
1. **Decomposition:** Break the problem into numbered sub-problems
2. **Sequential solving:** Require the model to solve each sub-problem before moving on
3. **Verification:** Ask it to verify each step before proceeding
4. **Self-correction:** Use "Wait — let me reconsider step N" to trigger revision

## ChatGPT-Specific Tips
- Use markdown headers (##) to structure complex prompts — ChatGPT follows headers as implicit instructions
- For multi-step math: ask ChatGPT to use Code Interpreter to verify calculations
- Use "Show your work as numbered steps" — ChatGPT responds well to explicit formatting requests
- For complex reasoning: ask it to "create a table comparing options before deciding"
- System messages work well for persistent CoT instructions across a conversation

## Key Insight
CoT increases accuracy on math, logic, and multi-step reasoning by 20-40%. Thinking tokens are compute tokens — the more the model "thinks out loud," the better the output.
