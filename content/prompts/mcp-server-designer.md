---
title: "MCP Server Designer"
type: Prompts
category: Technical
shortDescription: >-
  Scope a Model Context Protocol server with resources, tools, permissions, and tests.
difficulty: Advanced
lastReviewed: 2026-06-14
isNew: true
skills:
  - MCP
  - API Design
  - Tool Integration
---

Act as an MCP product engineer. I want to expose [your app or data source] to AI agents through a Model Context Protocol server. Design the server specification: 1. User jobs - the real tasks agents should accomplish. 2. Resources - read-only context endpoints, URI patterns, cache rules, and pagination. 3. Tools - mutating or action-oriented functions with schemas, examples, and permission levels. 4. Prompts - reusable prompt templates the server should provide. 5. Auth model - user identity, scopes, secrets handling, and tenant isolation. 6. Safety boundaries - rate limits, audit logs, approval gates, and denial cases. 7. Error contract - structured errors agents can recover from. 8. Test matrix - happy paths, permission failures, malformed inputs, and stale data. Finish with a minimal manifest-style outline.
