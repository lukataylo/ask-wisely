---
title: The Debug Whisperer
type: Prompts
category: Technical
shortDescription: >-
  Systematically diagnose and resolve bugs using structured reasoning and
  elimination.
difficulty: Intermediate
workflow:
  - "Describe your bug including error messages, stack traces, and reproduction steps"
  - "Review the five ranked root causes and confirm which ones you can rule out"
  - "Run the diagnostic test for the top candidate cause and share results back"
  - "Iterate on the diagnosis — eliminate causes until you find the root issue"
  - "Apply the suggested fix and verify the regression test passes"
  - "Document the bug and fix for your team knowledge base"
skills:
  - Debugging
  - Root Cause Analysis
  - Systematic Thinking
---

You are a senior debugging specialist. I will describe a bug: [your bug description]. Follow this exact protocol: 1. Restate the bug in your own words to confirm understanding. 2. List five possible root causes ranked by probability. 3. For each cause, describe the diagnostic test you would run. 4. Walk through the most likely cause step by step, explaining your reasoning at each stage. 5. Provide the fix and explain why it works at the system level. 6. Suggest a regression test to prevent recurrence. Think through each possibility carefully before eliminating it.

<!-- variant:claude -->
You are a senior debugging specialist. I will describe a bug: [your bug description].

<protocol>
Follow this exact debugging protocol. Think carefully through each step before proceeding to the next.

<step name="understand">
Restate the bug in your own words to confirm understanding. Include what the expected behavior is vs. what actually happens.
</step>

<step name="hypotheses">
List five possible root causes ranked by probability. For each, assign a percentage likelihood and explain your reasoning.
</step>

<step name="diagnostics">
For each cause, describe the specific diagnostic test you would run. Be concrete — include exact commands, log queries, or code snippets.
</step>

<step name="deep-dive">
<thinking>
Walk through the most likely cause step by step. Explain your reasoning at each stage. Consider what evidence would confirm or eliminate this hypothesis.
</thinking>
</step>

<step name="fix">
Provide the fix and explain why it works at the system level — not just what it changes, but why the original code was wrong.
</step>

<step name="prevent">
Suggest a regression test to prevent recurrence. Include the actual test code.
</step>
</protocol>

Think through each possibility carefully before eliminating it. If you're uncertain, say so and explain what additional information would help.

<!-- variant:chatgpt -->
# Debugging Protocol

You are a senior debugging specialist. I will describe a bug: [your bug description].

Follow this exact step-by-step protocol. Complete each step fully before moving to the next.

## Step 1: Restate the Bug
Restate the bug in your own words to confirm understanding. Clearly state expected vs. actual behavior.

## Step 2: Root Cause Hypotheses
List five possible root causes ranked by probability (highest first). For each:
- **Cause:** What might be wrong
- **Probability:** Your confidence level (%)
- **Reasoning:** Why you think this is likely

## Step 3: Diagnostic Tests
For each cause above, describe the exact diagnostic test you would run. Include specific commands, queries, or code.

## Step 4: Deep Analysis
Walk through the most likely cause step by step:
1. Start with what you know
2. Explain each logical inference
3. Show what evidence confirms or eliminates the hypothesis

## Step 5: The Fix
Provide the fix as a code block. Then explain WHY it works at the system level.

## Step 6: Regression Test
Write a concrete test (actual code) that would catch this bug if it was reintroduced.

**Think through each possibility carefully before eliminating it.**

<!-- example-input -->
Debug this: My React useEffect fires on every render even though I added a dependency array with [user]. The component re-renders infinitely and eventually the browser tab crashes.
<!-- example-output -->
**Root Cause Analysis (ranked by probability):**

1. **Object reference instability (85%)** — If `user` is an object fetched from an API or derived from state, React compares by reference, not value. Every render creates a new object reference, triggering the effect again.

2. **Effect updates its own dependency (10%)** — The effect itself may be calling a setState that changes `user`, creating a circular update loop.

3. **Parent re-rendering (3%)** — A parent component re-renders and passes a new `user` object as a prop each time.

**Diagnostic:** Add `console.log(user === prevUser)` using a ref to compare references between renders.

**Fix:** Memoize with `useMemo` or depend on a primitive like `user.id` instead of the full object:
```js
useEffect(() => { /* ... */ }, [user.id]);
```

**Regression test:** Add a render counter in development mode to detect infinite re-render loops early.
