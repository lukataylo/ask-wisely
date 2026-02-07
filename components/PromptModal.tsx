
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Copy, Check, Heart, Link, ExternalLink, ChevronDown, ArrowRight, Share2 } from 'lucide-react';
import { Prompt, LLMProvider, TEXT_LLM_TABS, IMAGE_LLM_TABS } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface PromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  relatedPrompts: Prompt[];
  onSelectPrompt: (prompt: Prompt) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  copyCount: number;
  onIncrementCopy: (id: string) => void;
}

function highlightVariables(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\[([^\]]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-1 rounded">
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

const LLM_OPTIONS = [
  { name: 'Claude', url: 'https://claude.ai/new' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/' },
  { name: 'Gemini', url: 'https://gemini.google.com/app' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com/' },
  { name: 'Mistral', url: 'https://chat.mistral.ai/chat' },
];

const BTN_SECONDARY = 'flex items-center gap-2 px-4 py-3 rounded-full border border-stone-200 dark:border-stone-700 font-medium hover:border-stone-400 dark:hover:border-stone-500 text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-all text-sm';

const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose, relatedPrompts, onSelectPrompt, isFavorite, onToggleFavorite, copyCount, onIncrementCopy }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activeLLM, setActiveLLM] = useState<LLMProvider>('claude');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [openInDropdown, setOpenInDropdown] = useState(false);
  const [shareDropdown, setShareDropdown] = useState(false);
  const [openInToast, setOpenInToast] = useState('');
  const openInRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [exampleOpen, setExampleOpen] = useState(false);

  // Reset state when prompt changes
  useEffect(() => {
    if (prompt) {
      const tabs = prompt.type === 'Image Prompts' ? IMAGE_LLM_TABS : TEXT_LLM_TABS;
      setActiveLLM(tabs[0].key);
      setVariableValues({});
      setOpenInDropdown(false);
      setShareDropdown(false);
      setOpenInToast('');
      setWorkflowOpen(false);
      setExampleOpen(false);
    }
  }, [prompt]);

  // Focus trap + Escape handling
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!prompt) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      previousFocusRef.current?.focus();
    };
  }, [prompt, onClose]);

  // Close dropdowns on outside click
  useEffect(() => {
    if (!openInDropdown && !shareDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (openInRef.current && !openInRef.current.contains(e.target as Node)) {
        setOpenInDropdown(false);
      }
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShareDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [openInDropdown, shareDropdown]);

  const allTabs = prompt?.type === 'Image Prompts' ? IMAGE_LLM_TABS : TEXT_LLM_TABS;
  const hasAnyVariant = prompt ? Object.values(prompt.llmVariants).some(v => !!v) : false;

  const activePromptText = useMemo(() => {
    if (!prompt) return '';
    if (!hasAnyVariant) return prompt.fullPrompt;
    return prompt.llmVariants[activeLLM] || prompt.fullPrompt;
  }, [prompt, activeLLM, hasAnyVariant]);

  const substitutedPrompt = useMemo(() => {
    let text = activePromptText;
    for (const [placeholder, value] of Object.entries(variableValues) as [string, string][]) {
      if (value.trim()) {
        text = text.split(placeholder).join(value);
      }
    }
    return text;
  }, [activePromptText, variableValues]);

  const [copied, copy] = useCopyToClipboard(substitutedPrompt);

  if (!prompt) return null;

  const hasVariant = (key: LLMProvider) => !!prompt.llmVariants[key];

  const handleCopy = () => {
    copy();
    onIncrementCopy(prompt.id);
  };

  const shareUrl = `${window.location.origin}/${prompt.id}`;

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${prompt.title} — ${prompt.shortDescription}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
    setShareDropdown(false);
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    setShareDropdown(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch { /* clipboard unavailable */ }
    setShareDropdown(false);
  };

  const handleOpenIn = async (llm: typeof LLM_OPTIONS[number]) => {
    try {
      await navigator.clipboard.writeText(substitutedPrompt);
    } catch { /* clipboard unavailable */ }
    window.open(llm.url, '_blank', 'noopener,noreferrer');
    setOpenInDropdown(false);
    setOpenInToast(llm.name);
    setTimeout(() => setOpenInToast(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-[var(--bg-modal-overlay)] backdrop-blur-sm animate-fade-in-fast"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={prompt.title}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-[var(--bg-page)] rounded-[32px] shadow-2xl overflow-hidden border border-[var(--bg-card-border)] flex flex-col max-h-[90vh] focus:outline-none animate-slide-up"
      >
        <div className="p-8 md:p-12 overflow-y-auto">
          {/* Header: Category + title + actions */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 font-bold bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
                {prompt.category}
              </span>
              <h2 className="serif text-4xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 mt-4 leading-tight">
                {prompt.title}
              </h2>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-4">
              <button
                onClick={onToggleFavorite}
                className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart
                  size={22}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400 dark:text-stone-500'}
                />
              </button>
              <button
                onClick={onClose}
                className="p-3 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* LLM Tab Bar */}
          <div className="flex items-center gap-2 mb-8">
            {hasAnyVariant ? (
              allTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveLLM(tab.key)}
                  className={`relative px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
                    activeLLM === tab.key
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100'
                      : 'bg-white dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
                  }`}
                >
                  {tab.label}
                  {hasVariant(tab.key) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                </button>
              ))
            ) : (
              <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border border-stone-900 dark:border-stone-100">
                All LLMs
              </span>
            )}
          </div>

          <div className="space-y-8">
            {/* The Wisdom — prompt preview */}
            <section>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">The Wisdom</h3>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 dark:from-stone-700 to-stone-100 dark:to-stone-800 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 p-6 rounded-2xl text-stone-800 dark:text-stone-200 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                  {highlightVariables(substitutedPrompt)}
                </div>
              </div>
            </section>

            {/* Workflow Accordion */}
            {prompt.workflow && prompt.workflow.length > 0 && (
              <section>
                <button
                  onClick={() => setWorkflowOpen(!workflowOpen)}
                  className="w-full flex items-center justify-between group/acc cursor-pointer"
                >
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Workflow</h3>
                  <ChevronDown
                    size={16}
                    className={`text-stone-400 transition-transform duration-300 ${workflowOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`accordion-content ${workflowOpen ? 'open' : ''}`}>
                  <div className="pt-4">
                    <ol className="relative ml-4 border-l-2 border-stone-200 dark:border-stone-700">
                      {prompt.workflow.map((step, i) => (
                        <li key={i} className="mb-4 last:mb-0 pl-6 relative">
                          <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-stone-100 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-600 flex items-center justify-center text-[10px] font-bold text-stone-500 dark:text-stone-400">
                            {i + 1}
                          </span>
                          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{step}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </section>
            )}

            {/* Example Accordion */}
            {prompt.exampleInput && prompt.exampleOutput && (
              <section>
                <button
                  onClick={() => setExampleOpen(!exampleOpen)}
                  className="w-full flex items-center justify-between group/acc cursor-pointer"
                >
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Example</h3>
                  <ChevronDown
                    size={16}
                    className={`text-stone-400 transition-transform duration-300 ${exampleOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div className={`accordion-content ${exampleOpen ? 'open' : ''}`}>
                  <div className="pt-4 space-y-3">
                    <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Input</div>
                      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">{prompt.exampleInput}</p>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight size={16} className="text-stone-300 dark:text-stone-600 rotate-90" />
                    </div>
                    <div className="bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl p-4">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">Output</div>
                      <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">{prompt.exampleOutput}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Customize — variable input fields */}
            {prompt.variables.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Customize</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prompt.variables.map((v) => (
                    <div key={v.placeholder}>
                      <label className="block text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
                        {v.name}
                      </label>
                      <input
                        type="text"
                        placeholder={v.placeholder}
                        value={variableValues[v.placeholder] || ''}
                        onChange={(e) =>
                          setVariableValues(prev => ({
                            ...prev,
                            [v.placeholder]: e.target.value,
                          }))
                        }
                        className="w-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl py-2 px-3 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-900/10 dark:focus:ring-stone-100/10 focus:border-stone-400 dark:focus:border-stone-500 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Techniques Used */}
            {prompt.techniques.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Techniques Used</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.techniques.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {prompt.skills.length > 0 && (
              <section className="flex flex-wrap gap-2">
                {prompt.skills.map((skill, i) => (
                  <span key={i} className="px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </section>
            )}

            {/* Related Prompts */}
            {relatedPrompts.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Related</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedPrompts.map((rp) => (
                    <button
                      key={rp.id}
                      onClick={() => onSelectPrompt(rp)}
                      className="text-left p-4 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-stone-400 dark:hover:border-stone-500 transition-colors"
                    >
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 font-semibold">
                        {rp.category}
                      </span>
                      <div className="serif text-sm font-medium text-stone-800 dark:text-stone-200 mt-1 line-clamp-2">
                        {rp.title}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer with actions */}
        <div className="shrink-0 p-6 md:px-12 md:pb-10 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Open in LLM dropdown */}
            <div className="relative" ref={openInRef}>
              <button
                onClick={() => { setOpenInDropdown(!openInDropdown); setShareDropdown(false); }}
                className={BTN_SECONDARY}
                aria-label="Open in LLM"
              >
                <ExternalLink size={16} />
                <span className="hidden sm:inline">Open in...</span>
              </button>
              {openInDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl overflow-hidden z-10 animate-fade-in-fast">
                  {LLM_OPTIONS.map((llm) => (
                    <button
                      key={llm.name}
                      onClick={() => handleOpenIn(llm)}
                      className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center justify-between"
                    >
                      {llm.name}
                      <ExternalLink size={12} className="text-stone-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Share dropdown */}
            <div className="relative" ref={shareRef}>
              <button
                onClick={() => { setShareDropdown(!shareDropdown); setOpenInDropdown(false); }}
                className={BTN_SECONDARY}
                aria-label="Share"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>
              {shareDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl overflow-hidden z-10 animate-fade-in-fast">
                  <button
                    onClick={handleCopyLink}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
                  >
                    <Link size={14} />
                    Copy Link
                  </button>
                  <button
                    onClick={handleShareTwitter}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    X / Twitter
                  </button>
                  <button
                    onClick={handleShareLinkedIn}
                    className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Primary CTA: Copy Prompt */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-all shadow-lg hover:shadow-xl"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Prompt'}
            {copyCount > 0 && !copied && (
              <span className="text-stone-400 dark:text-stone-500 text-xs">{copyCount}x</span>
            )}
          </button>
        </div>

        {/* "Copied! Paste in chat" toast */}
        {openInToast && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-fade-in-fast z-20">
            Copied! Paste in {openInToast}
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptModal;
