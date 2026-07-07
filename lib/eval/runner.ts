// Client-side eval runner: executes a prompt against test cases via the
// Anthropic API and grades outputs with deterministic assertions and/or an
// LLM-as-judge rubric.

import { sendMessage, extractJson } from './anthropic';

export type AssertionType =
  | 'contains'        // output includes value (case-insensitive)
  | 'not-contains'    // output must not include value
  | 'regex'           // output matches JS regex
  | 'starts-with'     // output begins with value
  | 'json-valid'      // output parses as JSON (value ignored)
  | 'max-words'       // output word count <= value
  | 'llm-rubric';     // judge model grades output against the rubric in value

export interface Assertion {
  id: string;
  type: AssertionType;
  value: string;
}

export interface TestCase {
  id: string;
  /** Text substituted for {{input}} in the prompt, or appended if no placeholder. */
  input: string;
  assertions: Assertion[];
}

export interface AssertionResult {
  assertion: Assertion;
  pass: boolean;
  detail: string;
}

export interface JudgeVerdict {
  score: number; // 1-5
  pass: boolean;
  reasoning: string;
  dimensions?: Record<string, number>;
}

export interface TestResult {
  testCase: TestCase;
  output: string;
  error: string | null;
  assertionResults: AssertionResult[];
  judge: JudgeVerdict | null;
  pass: boolean;
  inputTokens: number;
  outputTokens: number;
  durationMs: number;
}

export const ASSERTION_LABELS: Record<AssertionType, string> = {
  'contains': 'Contains text',
  'not-contains': 'Does not contain',
  'regex': 'Matches regex',
  'starts-with': 'Starts with',
  'json-valid': 'Is valid JSON',
  'max-words': 'Max word count',
  'llm-rubric': 'LLM judge rubric',
};

export function buildPromptWithInput(promptTemplate: string, input: string): string {
  if (promptTemplate.includes('{{input}}')) {
    return promptTemplate.split('{{input}}').join(input);
  }
  return input ? `${promptTemplate}\n\n${input}` : promptTemplate;
}

export function runDeterministicAssertion(assertion: Assertion, output: string): AssertionResult {
  const value = assertion.value;
  switch (assertion.type) {
    case 'contains': {
      const pass = output.toLowerCase().includes(value.toLowerCase());
      return { assertion, pass, detail: pass ? `Found "${value}"` : `"${value}" not found in output` };
    }
    case 'not-contains': {
      const pass = !output.toLowerCase().includes(value.toLowerCase());
      return { assertion, pass, detail: pass ? `"${value}" correctly absent` : `Forbidden text "${value}" found in output` };
    }
    case 'regex': {
      try {
        const re = new RegExp(value, 'ms');
        const pass = re.test(output);
        return { assertion, pass, detail: pass ? `Matched /${value}/` : `No match for /${value}/` };
      } catch {
        return { assertion, pass: false, detail: `Invalid regex: /${value}/` };
      }
    }
    case 'starts-with': {
      const pass = output.trimStart().toLowerCase().startsWith(value.toLowerCase());
      return { assertion, pass, detail: pass ? `Starts with "${value}"` : `Output starts with "${output.trimStart().slice(0, 40)}..."` };
    }
    case 'json-valid': {
      // Accept fenced JSON too — models often wrap output in code fences.
      const fenced = output.match(/```(?:json)?\s*([\s\S]*?)```/);
      const candidate = (fenced?.[1] ?? output).trim();
      try {
        JSON.parse(candidate);
        return { assertion, pass: true, detail: 'Parsed as valid JSON' };
      } catch (e) {
        return { assertion, pass: false, detail: `JSON parse failed: ${e instanceof Error ? e.message.slice(0, 80) : 'unknown error'}` };
      }
    }
    case 'max-words': {
      const limit = parseInt(value, 10);
      const count = output.split(/\s+/).filter(Boolean).length;
      if (isNaN(limit)) return { assertion, pass: false, detail: `"${value}" is not a number` };
      const pass = count <= limit;
      return { assertion, pass, detail: `${count} words (limit ${limit})` };
    }
    case 'llm-rubric':
      return { assertion, pass: false, detail: 'Judge assertion handled separately' };
  }
}

// Judge prompt follows LLM-as-judge best practice: reason first, score after,
// concrete anchors per score, and a fixed output contract.
const JUDGE_SYSTEM = `You are a strict, impartial evaluator of AI outputs. You grade a candidate output against a rubric. You are not lenient: outputs that partially satisfy the rubric score in the middle of the scale, not the top. Long outputs are not better by default — judge substance, not verbosity.`;

function buildJudgePrompt(rubric: string, input: string, output: string): string {
  return `Grade the candidate output below against the rubric.

<rubric>
${rubric}
</rubric>

<task_input>
${input || '(no input — the prompt ran standalone)'}
</task_input>

<candidate_output>
${output}
</candidate_output>

Score anchors:
1 = fails the rubric entirely or is off-task
2 = attempts the task but misses key rubric requirements
3 = satisfies the rubric partially with clear gaps
4 = satisfies the rubric with only minor issues
5 = fully satisfies every rubric requirement

First reason step by step about how the output measures against each rubric requirement. Then respond with ONLY a JSON object on the final lines:
{"reasoning": "<2-3 sentence summary of your analysis>", "score": <1-5>, "pass": <true if score >= 4>}`;
}

export async function runJudge(params: {
  apiKey: string;
  model: string;
  rubric: string;
  input: string;
  output: string;
  signal?: AbortSignal;
}): Promise<JudgeVerdict> {
  const res = await sendMessage({
    apiKey: params.apiKey,
    model: params.model,
    system: JUDGE_SYSTEM,
    prompt: buildJudgePrompt(params.rubric, params.input, params.output),
    maxTokens: 1024,
    signal: params.signal,
  });
  const parsed = extractJson<{ reasoning?: string; score?: number; pass?: boolean }>(res.text);
  if (!parsed || typeof parsed.score !== 'number') {
    return { score: 0, pass: false, reasoning: 'Judge response could not be parsed.' };
  }
  const score = Math.max(1, Math.min(5, Math.round(parsed.score)));
  return {
    score,
    pass: typeof parsed.pass === 'boolean' ? parsed.pass : score >= 4,
    reasoning: parsed.reasoning || 'No reasoning provided.',
  };
}

export async function runTestCase(params: {
  apiKey: string;
  model: string;
  judgeModel: string;
  promptTemplate: string;
  system?: string;
  testCase: TestCase;
  signal?: AbortSignal;
}): Promise<TestResult> {
  const { testCase } = params;
  const started = performance.now();
  let output = '';
  let inputTokens = 0;
  let outputTokens = 0;

  try {
    const res = await sendMessage({
      apiKey: params.apiKey,
      model: params.model,
      system: params.system,
      prompt: buildPromptWithInput(params.promptTemplate, testCase.input),
      maxTokens: 2048,
      signal: params.signal,
    });
    output = res.text;
    inputTokens = res.inputTokens;
    outputTokens = res.outputTokens;
  } catch (e) {
    return {
      testCase,
      output: '',
      error: e instanceof Error ? e.message : 'Request failed',
      assertionResults: [],
      judge: null,
      pass: false,
      inputTokens: 0,
      outputTokens: 0,
      durationMs: performance.now() - started,
    };
  }

  const deterministic = testCase.assertions
    .filter(a => a.type !== 'llm-rubric')
    .map(a => runDeterministicAssertion(a, output));

  let judge: JudgeVerdict | null = null;
  const rubricAssertion = testCase.assertions.find(a => a.type === 'llm-rubric');
  if (rubricAssertion && rubricAssertion.value.trim()) {
    try {
      judge = await runJudge({
        apiKey: params.apiKey,
        model: params.judgeModel,
        rubric: rubricAssertion.value,
        input: testCase.input,
        output,
        signal: params.signal,
      });
    } catch (e) {
      judge = { score: 0, pass: false, reasoning: e instanceof Error ? e.message : 'Judge call failed' };
    }
  }

  const pass = deterministic.every(r => r.pass) && (judge === null || judge.pass);
  return {
    testCase,
    output,
    error: null,
    assertionResults: deterministic,
    judge,
    pass,
    inputTokens,
    outputTokens,
    durationMs: performance.now() - started,
  };
}
