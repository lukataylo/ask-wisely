import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { MODEL_OPTIONS } from '../../lib/eval/anthropic';

interface ApiKeyPanelProps {
  apiKey: string;
  setApiKey: (key: string, opts?: { sessionOnly?: boolean }) => void;
  clearApiKey: () => void;
  model: string;
  setModel: (model: string) => void;
}

const ApiKeyPanel: React.FC<ApiKeyPanelProps> = ({ apiKey, setApiKey, clearApiKey, model, setModel }) => {
  const [draft, setDraft] = useState('');
  const [sessionOnly, setSessionOnly] = useState(true);
  const [expanded, setExpanded] = useState(!apiKey);

  const masked = apiKey ? `${apiKey.slice(0, 10)}…${apiKey.slice(-4)}` : '';

  return (
    <div className="rounded-2xl border border-[var(--bg-card-border)] bg-[var(--bg-card)]">
      <button
        type="button"
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <KeyRound size={16} className={apiKey ? 'text-green-600 dark:text-green-400 shrink-0' : 'text-stone-400 shrink-0'} />
          <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
            {apiKey ? `API key connected (${masked})` : 'Connect your Anthropic API key'}
          </span>
        </span>
        {expanded ? <ChevronUp size={16} className="text-stone-400 shrink-0" /> : <ChevronDown size={16} className="text-stone-400 shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4">
          <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed flex items-start gap-2">
            <ShieldCheck size={14} className="shrink-0 mt-0.5 text-stone-400" />
            Optional — the linter and fixer work without it. A key unlocks live test runs and AI-powered improving.
            The key stays in your browser and is only ever sent directly to api.anthropic.com. This site has no server.
          </p>

          {!apiKey && (
            <>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="sk-ant-..."
                  autoComplete="off"
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm font-mono text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 dark:focus:border-stone-500"
                />
                <button
                  type="button"
                  disabled={!draft.trim().startsWith('sk-ant-')}
                  onClick={() => { setApiKey(draft.trim(), { sessionOnly }); setDraft(''); }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                >
                  Save
                </button>
              </div>
              <label className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sessionOnly}
                  onChange={e => setSessionOnly(e.target.checked)}
                  className="accent-stone-900 dark:accent-stone-100"
                />
                Forget the key when I close this tab (recommended)
              </label>
            </>
          )}

          {apiKey && (
            <button
              type="button"
              onClick={clearApiKey}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border border-stone-200 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:border-red-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
              Remove key
            </button>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Model</label>
            <div className="flex flex-wrap gap-2">
              {MODEL_OPTIONS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModel(m.id)}
                  title={m.note}
                  className={`px-4 py-2 rounded-xl text-xs font-medium border transition-colors ${
                    model === m.id
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                      : 'bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                  }`}
                >
                  {m.label}
                  <span className="block text-[9px] opacity-60 font-normal">${m.inputPerMTok}/{m.outputPerMTok === Math.floor(m.outputPerMTok) ? m.outputPerMTok : m.outputPerMTok.toFixed(2)} per MTok</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ApiKeyPanel);
