// Sample documents so the Eval Lab demos instantly without any setup.
// The skill sample deliberately contains the most common real-world mistakes
// observed across community skill repos.

export const SAMPLE_SKILL = `---
name: PDF_Helper
description: This skill is designed to help you with documents.
Tools: Read, Bash
Version: 1.0
---

# PDF Helper

I can help you process PDF files.

You can use pypdf, or pdfplumber, or PyMuPDF, or pdfminer to work with PDFs.

Don't use OCR.
Don't process files over 100 pages.
Never modify the original file.

See scripts\\extract.py for extraction.

Note: as of March 2025 this is currently in beta.
`;

export const SAMPLE_PROMPT = `Summarize it. Don't make it long. Don't use bullet points. Don't skip anything important. Be comprehensive and detailed but also be brief.`;

export const SAMPLE_TEST_PROMPT = `You are a customer support triage assistant for a software company.

Classify the support message below into exactly one category: billing, bug, feature-request, or other.

<message>
{{input}}
</message>

Respond with ONLY a JSON object: {"category": "<category>", "urgency": <1-3>, "summary": "<one sentence>"}`;

export interface SampleTestCase {
  input: string;
  assertions: { type: string; value: string }[];
}

export const SAMPLE_TEST_CASES: SampleTestCase[] = [
  {
    input: "I was charged twice this month and I can't find a refund button anywhere. Please help, this is urgent!",
    assertions: [
      { type: 'json-valid', value: '' },
      { type: 'contains', value: 'billing' },
    ],
  },
  {
    input: 'The export button crashes the app every time I click it on Safari.',
    assertions: [
      { type: 'json-valid', value: '' },
      { type: 'contains', value: 'bug' },
      { type: 'not-contains', value: 'billing' },
    ],
  },
  {
    input: 'It would be amazing if you added a dark mode to the dashboard.',
    assertions: [
      { type: 'json-valid', value: '' },
      { type: 'contains', value: 'feature-request' },
      { type: 'llm-rubric', value: 'The summary field accurately reflects that the user is requesting dark mode, and urgency is rated 1 (low).' },
    ],
  },
];
