---
title: Output Formatting Mastery
type: Skills
category: Engineering
shortDescription: >-
  Control AI output structure using format specifications and parsing
  techniques.
skills:
  - Output Control
  - Structured Data
  - Parsing
---

Controlling output format is essential for programmatic use. Techniques: 1. JSON Mode — specify the exact schema with field names and types. Provide an empty template. 2. Markdown Tables — request tabular data with column headers defined upfront. 3. XML Tags — use custom XML tags to section outputs for easy parsing. 4. Delimiter Patterns — define unique delimiters for sections: "===SECTION_NAME===". 5. Template Filling — provide the template with blanks: "Name: ___\nScore: ___/10\nReason: ___". 6. Constrained Generation — "Your response must start with 'YES' or 'NO' followed by your explanation." Always validate output format programmatically and include retry logic.
