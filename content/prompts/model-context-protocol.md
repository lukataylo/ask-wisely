---
title: Model Context Protocol (MCP)
type: Skills
category: Engineering
shortDescription: >-
  Connect AI assistants to tools and data through the open MCP standard instead
  of one-off integrations.
difficulty: Intermediate
skills:
  - MCP
  - Tool Integration
  - Agent Design
---

The Model Context Protocol (MCP) is an open standard that lets AI assistants talk to external tools, data sources, and services through one common interface — think of it as a universal adapter that replaces bespoke, per-app integrations. The model: 1. Servers expose capabilities — an MCP server offers Tools (actions the model can call, like "create issue" or "query database"), Resources (readable context, like files or records), and Prompts (reusable templates). 2. Clients consume them — an MCP-capable app (an IDE assistant, a desktop agent, a chatbot) connects to any server and instantly gains its capabilities. 3. The model decides — given the available tools and the user's goal, the model chooses which tool to call, with what arguments, and when. Why it matters for [your workflow]: build a tool once and every MCP client can use it; swap models without rewriting integrations; keep secrets and business logic on the server side, not in the prompt. Best practices: give each tool a crisp name and a description written for the model, not the developer; return errors as structured, actionable messages so the model can recover; scope permissions tightly and treat tool output as untrusted input. MCP is the plumbing that turns a chat model into an agent that can actually do things.
