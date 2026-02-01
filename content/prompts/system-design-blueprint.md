---
title: System Design Blueprint
type: Prompts
category: Technical
shortDescription: >-
  Architect distributed systems with proper scaling, resilience, and data
  consistency patterns.
difficulty: Intermediate
workflow:
  - "Start a new conversation with this prompt and describe the system you need to design"
  - "Review the clarified requirements and confirm or adjust assumptions about scale and latency"
  - "Examine the high-level architecture diagram and identify any missing components"
  - "Dive deep into the data model and storage layer — challenge the consistency vs availability tradeoffs"
  - "Review failure modes and capacity estimates, then iterate on bottlenecks"
  - "Use the final design as a living document — revisit when requirements change"
skills:
  - System Design
  - Distributed Systems
  - Architecture
---

You are a principal systems architect at a FAANG company. Design a system for [your system to design]. Follow this structured approach: 1. Clarify requirements — list your assumptions about scale, latency, and consistency. 2. Design the high-level architecture with a component diagram. 3. Deep-dive into the conflict resolution strategy (OT vs CRDT — pick one and defend it). 4. Design the data model and storage layer. 5. Address failure modes and recovery. 6. Calculate back-of-envelope capacity estimates. Walk through each decision and the tradeoffs you considered.

<!-- variant:claude -->
You are a principal systems architect at a FAANG company. Design a system for [your system to design].

<approach>
Follow this structured design process:
</approach>

<step name="requirements">
Clarify requirements — list your assumptions about scale, latency, and consistency. Present them in a table:
| Dimension | Assumption | Justification |
</step>

<step name="architecture">
Design the high-level architecture with a component diagram. Use ASCII art or describe each component and its connections.
</step>

<step name="conflict-resolution">
Deep-dive into the conflict resolution strategy. Compare OT vs CRDT:
<comparison>
- OT: [strengths, weaknesses, when to use]
- CRDT: [strengths, weaknesses, when to use]
</comparison>
Pick one and defend your choice with specific reasoning.
</step>

<step name="data-model">
Design the data model and storage layer. Show schemas and justify your database choices.
</step>

<step name="failure-modes">
Address failure modes and recovery. For each failure scenario, describe detection, impact, and recovery strategy.
</step>

<step name="capacity">
Calculate back-of-envelope capacity estimates. Show your math step by step.
</step>

Walk through each decision and the tradeoffs you considered. Use artifacts for diagrams where helpful.

<!-- variant:chatgpt -->
# System Design Task

You are a principal systems architect at a FAANG company. Design a system for [your system to design].

## Instructions

Follow this structured approach and use markdown headers for each section:

### 1. Requirements Clarification
List your assumptions about scale, latency, and consistency in a table format.

### 2. High-Level Architecture
Design the architecture with a component diagram. Use a code block to draw an ASCII diagram showing all major components and their connections.

### 3. Conflict Resolution Deep-Dive
Compare OT vs CRDT. Pick one approach and defend it with specific technical reasoning. Use a pros/cons comparison.

### 4. Data Model & Storage Layer
Design the data model. Show table schemas in code blocks. Justify your database and caching choices.

### 5. Failure Modes & Recovery
For each failure scenario, create a table: | Failure | Detection | Impact | Recovery |

### 6. Capacity Estimates
Show back-of-envelope calculations step by step. Use actual numbers and show your arithmetic.

**Important:** Walk through each decision explicitly stating what tradeoffs you considered and why you chose one option over another.

<!-- example-input -->
Design a real-time collaborative document editor like Google Docs that supports 100 concurrent editors per document.
<!-- example-output -->
**Requirements Clarification:**
- Scale: 100 concurrent editors/doc, 10M total documents, 50ms max latency for keystrokes
- Consistency: eventual consistency acceptable with conflict resolution
- Availability: 99.9% uptime target

**High-Level Architecture:**
- WebSocket Gateway → Operation Transform (OT) Server → Document Store
- Components: Load Balancer, WebSocket Gateway, OT Engine, Document Service, Presence Service, Redis (cursor/presence), PostgreSQL (document metadata), S3 (document snapshots)

**Conflict Resolution:** CRDT (Conflict-free Replicated Data Types) — specifically Yjs — chosen over OT because it's decentralizable and handles offline editing.

**Capacity Estimate:** 100 editors × 2 keystrokes/sec × 50 bytes/op = 10KB/s per document. At 10K active docs = 100MB/s throughput.
