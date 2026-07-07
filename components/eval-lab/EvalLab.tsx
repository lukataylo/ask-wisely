import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Wand2, Sparkles, FlaskConical, Copy, Check, ArrowLeftRight, X, BookOpen, ArrowUpRight } from 'lucide-react';
import PillButton from '../ui/PillButton';
import ScoreGauge from './ScoreGauge';
import IssueList from './IssueList';
import DiffView from './DiffView';
import ApiKeyPanel from './ApiKeyPanel';
import TestRunner from './TestRunner';
import { analyzeSkill } from '../../lib/eval/skill-lint';
import { analyzePrompt } from '../../lib/eval/prompt-lint';
import { autoFixSkill } from '../../lib/eval/fixer';
import { improveSkill, improvePrompt } from '../../lib/eval/improver';
import { SAMPLE_SKILL, SAMPLE_PROMPT } from '../../lib/eval/samples';
import { SKILL_INSIGHTS } from '../../lib/eval/insights-data';
import { useApiKey } from '../../hooks/useApiKey';
import { copyText } from '../../lib/copyText';

type LabMode = 'Skill Evaluator' | 'Prompt Evaluator' | 'Test Runner' | 'Field Notes';
const MODES: LabMode[] = ['Skill Evaluator', 'Prompt Evaluator', 'Test Runner', 'Field Notes'];

const textareaClass = 'w-full px-5 py-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs font-mono leading-relaxed text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500 resize-y';
const primaryBtn = 'inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors';
const outlineBtn = 'inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-stone-900 dark:hover:border-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed';

interface ImprovedState {
  text: string;
  source: 'auto-fix' | 'ai';
  applied: string[];
}

export default function EvalLab() {
  const [mode, setMode] = useState<LabMode>('Skill Evaluator');
  const { apiKey, setApiKey, clearApiKey, model, setModel } = useApiKey();

  const [skillSource, setSkillSource] = useState('');
  const [promptSource, setPromptSource] = useState('');
  const [improved, setImproved] = useState<ImprovedState | null>(null);
  const [improving, setImproving] = useState(false);
  const [improveError, setImproveError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const isSkillMode = mode === 'Skill Evaluator';
  const source = isSkillMode ? skillSource : promptSource;
  const setSource = isSkillMode ? setSkillSource : setPromptSource;

  const report = useMemo(() => {
    if (!source.trim()) return null;
    return isSkillMode ? analyzeSkill(source) : analyzePrompt(source);
  }, [source, isSkillMode]);

  const switchMode = useCallback((m: LabMode) => {
    setMode(m);
    setImproved(null);
    setImproveError(null);
    abortRef.current?.abort();
    setImproving(false);
  }, []);

  const loadSample = useCallback(() => {
    setSource(isSkillMode ? SAMPLE_SKILL : SAMPLE_PROMPT);
    setImproved(null);
    setImproveError(null);
  }, [isSkillMode, setSource]);

  const handleAutoFix = useCallback(() => {
    const { fixed, applied } = autoFixSkill(source);
    setImproved({ text: fixed, source: 'auto-fix', applied });
    setImproveError(null);
  }, [source]);

  const handleAiImprove = useCallback(async () => {
    if (!apiKey || !report) return;
    setImproving(true);
    setImproveError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const fn = isSkillMode ? improveSkill : improvePrompt;
      const text = await fn({ apiKey, model, source, issues: report.issues, signal: controller.signal });
      setImproved({ text, source: 'ai', applied: [] });
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        setImproveError(e instanceof Error ? e.message : 'Improve request failed');
      }
    } finally {
      setImproving(false);
    }
  }, [apiKey, model, source, report, isSkillMode]);

  const handleApply = useCallback(() => {
    if (!improved) return;
    setSource(improved.text);
    setImproved(null);
  }, [improved, setSource]);

  const handleCopyImproved = useCallback(() => {
    if (!improved) return;
    copyText(improved.text).then(ok => {
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    });
  }, [improved]);

  return (
    <div className="animate-fade-in">
      <header className="max-w-3xl mb-12">
        <h1 className="serif text-6xl md:text-7xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-6 animate-fade-in-up">
          The Art of <span className="italic text-[#FA7506]">Refinement</span>
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-lg md:text-xl leading-relaxed font-light animate-fade-in-slow">
          Evaluate, fix, and improve Claude skills and prompts — right in your browser.
          A linter built from the Agent Skills spec and the failure patterns of popular skills on GitHub,
          plus a promptfoo-style test runner and AI improver powered by your own API key.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        {MODES.map(m => (
          <PillButton key={m} compact active={mode === m} onClick={() => switchMode(m)}>
            {m}
          </PillButton>
        ))}
      </div>

      {mode === 'Field Notes' && (
        <div className="max-w-4xl">
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-10 max-w-2xl flex items-start gap-2">
            <BookOpen size={16} className="shrink-0 mt-0.5 text-stone-400" />
            What we learned studying how popular Claude skills on GitHub evolved — the bugs their issue trackers
            reveal, and what the best eval frameworks converged on. Every rule in the evaluator traces back to one of these.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SKILL_INSIGHTS.map(insight => (
              <div key={insight.id} className="rounded-[24px] border border-[var(--bg-card-border)] bg-[var(--bg-card)] p-7 flex flex-col">
                <h3 className="serif text-xl font-medium text-stone-800 dark:text-stone-100 mb-3 leading-snug">{insight.title}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-4 flex-1">{insight.body}</p>
                <a
                  href={insight.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                >
                  {insight.source.label}
                  <ArrowUpRight size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'Test Runner' && (
        <div className="space-y-6">
          <ApiKeyPanel apiKey={apiKey} setApiKey={setApiKey} clearApiKey={clearApiKey} model={model} setModel={setModel} />
          <TestRunner apiKey={apiKey} model={model} />
        </div>
      )}

      {(mode === 'Skill Evaluator' || mode === 'Prompt Evaluator') && (
        <div className="space-y-6">
          <ApiKeyPanel apiKey={apiKey} setApiKey={setApiKey} clearApiKey={clearApiKey} model={model} setModel={setModel} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ── Editor column ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="eval-source" className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {isSkillMode ? 'Paste a SKILL.md' : 'Paste a prompt'}
                </label>
                <button type="button" onClick={loadSample}
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
                  <FlaskConical size={12} />
                  Load flawed example
                </button>
              </div>
              <textarea
                id="eval-source"
                value={source}
                onChange={e => { setSource(e.target.value); setImproved(null); }}
                rows={improved ? 12 : 22}
                spellCheck={false}
                placeholder={isSkillMode
                  ? '---\nname: my-skill\ndescription: ...\n---\n\n# Instructions\n...'
                  : 'You are a...\n\nAnalyze the following...'}
                className={textareaClass}
              />

              {report && (
                <div className="flex items-center gap-3 flex-wrap mt-4">
                  {isSkillMode && (
                    <button type="button" onClick={handleAutoFix} className={outlineBtn}>
                      <Wand2 size={14} />
                      Auto-fix
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleAiImprove}
                    disabled={!apiKey || improving}
                    title={!apiKey ? 'Connect an API key above to use the AI improver' : undefined}
                    className={primaryBtn}
                  >
                    <Sparkles size={14} className={improving ? 'animate-pulse' : ''} />
                    {improving ? 'Improving…' : 'Improve with AI'}
                  </button>
                  {improving && (
                    <button type="button" onClick={() => abortRef.current?.abort()} className={outlineBtn}>
                      <X size={13} /> Cancel
                    </button>
                  )}
                </div>
              )}
              {improveError && <p className="mt-3 text-xs text-red-500">{improveError}</p>}

              {improved && (
                <div className="mt-6 animate-fade-in-fast">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                    <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                      {improved.source === 'ai' ? 'AI-improved version' : 'Auto-fixed version'}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handleCopyImproved}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
                        {copied ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                      <button type="button" onClick={handleApply}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors">
                        <ArrowLeftRight size={12} />
                        Use as input
                      </button>
                      <button type="button" onClick={() => setImproved(null)} aria-label="Dismiss improved version"
                        className="text-stone-300 dark:text-stone-600 hover:text-stone-500 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  {improved.applied.length > 0 && (
                    <ul className="mb-3 space-y-1">
                      {improved.applied.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-stone-500 dark:text-stone-400">
                          <Check size={12} className="text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  <DiffView before={source} after={improved.text} />
                </div>
              )}
            </div>

            {/* ── Report column ── */}
            <div>
              {!report && (
                <div className="rounded-[24px] border border-dashed border-stone-200 dark:border-stone-700 p-12 text-center">
                  <div className="serif text-2xl text-stone-300 dark:text-stone-600 mb-3">
                    {isSkillMode ? 'Your skill report appears here' : 'Your prompt report appears here'}
                  </div>
                  <p className="text-sm text-stone-400 dark:text-stone-500 leading-relaxed max-w-sm mx-auto">
                    {isSkillMode
                      ? 'Checks 25+ rules from the Agent Skills spec and Anthropic\'s authoring guidance — frontmatter validity, trigger-ready descriptions, progressive disclosure budgets, and more. Everything runs locally.'
                      : 'Checks structure, clarity, and technique against Anthropic\'s prompt-engineering guidance — output format, examples, reasoning scaffolds, conflicting instructions. Everything runs locally.'}
                  </p>
                </div>
              )}

              {report && (
                <div className="space-y-8">
                  <div className="flex items-center gap-8 flex-wrap">
                    <ScoreGauge score={report.score} grade={report.grade} label={isSkillMode ? 'Skill quality' : 'Prompt quality'} />
                    <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Lines</dt>
                        <dd className={`font-mono ${isSkillMode && report.stats.lines > 500 ? 'text-red-500' : 'text-stone-700 dark:text-stone-300'}`}>
                          {report.stats.lines}{isSkillMode ? ' / 500' : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">~Tokens</dt>
                        <dd className={`font-mono ${isSkillMode && report.stats.tokens > 5000 ? 'text-red-500' : 'text-stone-700 dark:text-stone-300'}`}>
                          {report.stats.tokens.toLocaleString()}{isSkillMode ? ' / 5,000' : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Words</dt>
                        <dd className="font-mono text-stone-700 dark:text-stone-300">{report.stats.words.toLocaleString()}</dd>
                      </div>
                      <div>
                        <dt className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Issues</dt>
                        <dd className="font-mono text-stone-700 dark:text-stone-300">{report.issues.length}</dd>
                      </div>
                    </dl>
                  </div>

                  <IssueList issues={report.issues} strengths={report.strengths} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
