import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Play, Plus, Trash2, Square, CheckCircle2, XCircle, ChevronDown, ChevronUp, FlaskConical } from 'lucide-react';
import {
  Assertion, AssertionType, TestCase, TestResult, ASSERTION_LABELS, runTestCase,
} from '../../lib/eval/runner';
import { estimateCost } from '../../lib/eval/anthropic';
import { SAMPLE_TEST_PROMPT, SAMPLE_TEST_CASES } from '../../lib/eval/samples';

interface TestRunnerProps {
  apiKey: string;
  model: string;
}

let nextId = 1;
const uid = () => `t${nextId++}`;

const ASSERTION_TYPES = Object.keys(ASSERTION_LABELS) as AssertionType[];
const VALUE_FREE_TYPES: AssertionType[] = ['json-valid'];

const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500';

function makeSampleCases(): TestCase[] {
  return SAMPLE_TEST_CASES.map(tc => ({
    id: uid(),
    input: tc.input,
    assertions: tc.assertions.map(a => ({ id: uid(), type: a.type as AssertionType, value: a.value })),
  }));
}

const TestRunner: React.FC<TestRunnerProps> = ({ apiKey, model }) => {
  const [prompt, setPrompt] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [results, setResults] = useState<Map<string, TestResult>>(new Map());
  const [running, setRunning] = useState(false);
  const [runningCase, setRunningCase] = useState<string | null>(null);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadSample = useCallback(() => {
    setPrompt(SAMPLE_TEST_PROMPT);
    setTestCases(makeSampleCases());
    setResults(new Map());
  }, []);

  const addCase = useCallback(() => {
    setTestCases(prev => [...prev, { id: uid(), input: '', assertions: [{ id: uid(), type: 'contains', value: '' }] }]);
  }, []);

  const updateCase = useCallback((id: string, patch: Partial<TestCase>) => {
    setTestCases(prev => prev.map(tc => tc.id === id ? { ...tc, ...patch } : tc));
  }, []);

  const removeCase = useCallback((id: string) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id));
  }, []);

  const updateAssertion = useCallback((caseId: string, assertionId: string, patch: Partial<Assertion>) => {
    setTestCases(prev => prev.map(tc => tc.id !== caseId ? tc : {
      ...tc,
      assertions: tc.assertions.map(a => a.id === assertionId ? { ...a, ...patch } : a),
    }));
  }, []);

  const addAssertion = useCallback((caseId: string) => {
    setTestCases(prev => prev.map(tc => tc.id !== caseId ? tc : {
      ...tc,
      assertions: [...tc.assertions, { id: uid(), type: 'contains' as AssertionType, value: '' }],
    }));
  }, []);

  const removeAssertion = useCallback((caseId: string, assertionId: string) => {
    setTestCases(prev => prev.map(tc => tc.id !== caseId ? tc : {
      ...tc,
      assertions: tc.assertions.filter(a => a.id !== assertionId),
    }));
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    setRunning(false);
    setRunningCase(null);
  }, []);

  const run = useCallback(async () => {
    if (!apiKey || !prompt.trim() || testCases.length === 0) return;
    setRunning(true);
    setResults(new Map());
    const controller = new AbortController();
    abortRef.current = controller;

    // Sequential, not parallel — keeps the visitor inside API rate limits.
    for (const tc of testCases) {
      if (controller.signal.aborted) break;
      setRunningCase(tc.id);
      const result = await runTestCase({
        apiKey,
        model,
        judgeModel: model,
        promptTemplate: prompt,
        testCase: tc,
        signal: controller.signal,
      });
      setResults(prev => new Map(prev).set(tc.id, result));
    }
    setRunning(false);
    setRunningCase(null);
  }, [apiKey, model, prompt, testCases]);

  const summary = useMemo(() => {
    const done = [...results.values()];
    if (done.length === 0) return null;
    const passed = done.filter(r => r.pass).length;
    const tokens = done.reduce((s, r) => s + r.inputTokens + r.outputTokens, 0);
    const cost = done.reduce((s, r) => s + estimateCost(model, r.inputTokens, r.outputTokens), 0);
    return { passed, total: done.length, tokens, cost };
  }, [results, model]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-xl">
          Run a prompt against test cases with pass/fail assertions — the same test shape promptfoo, Braintrust,
          and the Anthropic Console eval tool converged on. Deterministic checks are free; the LLM-judge rubric
          uses your key. Use <code className="font-mono text-xs bg-[var(--bg-badge)] px-1.5 py-0.5 rounded">{'{{input}}'}</code> in
          the prompt where each test case's input should go.
        </p>
        <button
          type="button"
          onClick={loadSample}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all"
        >
          <FlaskConical size={13} />
          Load example suite
        </button>
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Prompt under test</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={8}
          placeholder={'You are a...\n\n<message>\n{{input}}\n</message>\n\nRespond with...'}
          className={`${inputClass} font-mono text-xs leading-relaxed resize-y`}
        />
      </div>

      <div className="space-y-4">
        {testCases.map((tc, idx) => {
          const result = results.get(tc.id);
          const isRunning = runningCase === tc.id;
          return (
            <div key={tc.id} className={`rounded-2xl border p-5 bg-[var(--bg-card)] transition-colors ${
              result ? (result.pass ? 'border-green-300 dark:border-green-800' : 'border-red-300 dark:border-red-900') : 'border-[var(--bg-card-border)]'
            }`}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  Test case {idx + 1}
                  {isRunning && <span className="text-[#FA7506] animate-pulse normal-case tracking-normal">running…</span>}
                  {result && !isRunning && (
                    result.pass
                      ? <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle2 size={13} /> Pass</span>
                      : <span className="inline-flex items-center gap-1 text-red-500"><XCircle size={13} /> Fail</span>
                  )}
                </span>
                <button type="button" onClick={() => removeCase(tc.id)} aria-label={`Remove test case ${idx + 1}`}
                  className="text-stone-300 dark:text-stone-600 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <textarea
                value={tc.input}
                onChange={e => updateCase(tc.id, { input: e.target.value })}
                rows={2}
                placeholder="Input substituted for {{input}}"
                className={`${inputClass} text-xs mb-3 resize-y`}
              />

              <div className="space-y-2">
                {tc.assertions.map(a => (
                  <div key={a.id} className="flex gap-2 items-center">
                    <select
                      value={a.type}
                      onChange={e => updateAssertion(tc.id, a.id, { type: e.target.value as AssertionType })}
                      aria-label="Assertion type"
                      className="px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-300 focus:outline-none"
                    >
                      {ASSERTION_TYPES.map(t => <option key={t} value={t}>{ASSERTION_LABELS[t]}</option>)}
                    </select>
                    {!VALUE_FREE_TYPES.includes(a.type) && (
                      <input
                        value={a.value}
                        onChange={e => updateAssertion(tc.id, a.id, { value: e.target.value })}
                        placeholder={a.type === 'llm-rubric' ? 'Grading criteria for the judge…' : a.type === 'max-words' ? 'e.g. 150' : 'Expected value'}
                        className={`${inputClass} flex-1 text-xs py-2`}
                      />
                    )}
                    <button type="button" onClick={() => removeAssertion(tc.id, a.id)} aria-label="Remove assertion"
                      className="text-stone-300 dark:text-stone-600 hover:text-red-500 transition-colors shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addAssertion(tc.id)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
                  <Plus size={12} /> Assertion
                </button>
              </div>

              {result && (
                <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-700/60">
                  {result.error ? (
                    <p className="text-xs text-red-500">{result.error}</p>
                  ) : (
                    <>
                      <ul className="space-y-1 mb-2">
                        {result.assertionResults.map((ar, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs">
                            {ar.pass
                              ? <CheckCircle2 size={13} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                              : <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />}
                            <span className="text-stone-600 dark:text-stone-400">
                              <span className="font-semibold">{ASSERTION_LABELS[ar.assertion.type]}</span> — {ar.detail}
                            </span>
                          </li>
                        ))}
                        {result.judge && (
                          <li className="flex items-start gap-2 text-xs">
                            {result.judge.pass
                              ? <CheckCircle2 size={13} className="text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                              : <XCircle size={13} className="text-red-500 shrink-0 mt-0.5" />}
                            <span className="text-stone-600 dark:text-stone-400">
                              <span className="font-semibold">Judge: {result.judge.score}/5</span> — {result.judge.reasoning}
                            </span>
                          </li>
                        )}
                      </ul>
                      <button
                        type="button"
                        onClick={() => setExpandedResult(prev => prev === tc.id ? null : tc.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                      >
                        {expandedResult === tc.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        Model output
                      </button>
                      {expandedResult === tc.id && (
                        <pre className="mt-2 p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-[11px] leading-relaxed text-stone-600 dark:text-stone-300 whitespace-pre-wrap max-h-64 overflow-y-auto">{result.output}</pre>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <button type="button" onClick={addCase}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all">
          <Plus size={14} /> Test case
        </button>

        {running ? (
          <button type="button" onClick={stop}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 transition-colors">
            <Square size={13} /> Stop
          </button>
        ) : (
          <button
            type="button"
            onClick={run}
            disabled={!apiKey || !prompt.trim() || testCases.length === 0}
            title={!apiKey ? 'Connect an API key above to run tests' : undefined}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <Play size={13} /> Run suite
          </button>
        )}

        {summary && (
          <span className="text-xs text-stone-500 dark:text-stone-400" aria-live="polite">
            <span className={summary.passed === summary.total ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-500 font-semibold'}>
              {summary.passed}/{summary.total} passed
            </span>
            {' · '}{summary.tokens.toLocaleString()} tokens · ~${summary.cost.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
};

export default TestRunner;
