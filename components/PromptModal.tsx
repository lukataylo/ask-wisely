
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Prompt, LLMProvider, TEXT_LLM_TABS, IMAGE_LLM_TABS } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import ModalHeader from './prompt-modal/ModalHeader';
import ModalFooterActions from './prompt-modal/ModalFooterActions';
import SectionHeading from './ui/SectionHeading';
import PillButton from './ui/PillButton';

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

  const [copied, copy] = useCopyToClipboard(substitutedPrompt, () => onIncrementCopy(prompt.id));

  if (!prompt) return null;

  const hasVariant = (key: LLMProvider) => !!prompt.llmVariants[key];

  const handleCopy = () => {
    void copy();
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
          <ModalHeader
            category={prompt.category}
            title={prompt.title}
            isFavorite={isFavorite}
            onToggleFavorite={onToggleFavorite}
            onClose={onClose}
          />

          {/* LLM Tab Bar */}
          <div className="flex items-center gap-2 mb-8">
            {hasAnyVariant ? (
              allTabs.map((tab) => (
                <PillButton
                  key={tab.key}
                  onClick={() => setActiveLLM(tab.key)}
                  active={activeLLM === tab.key}
                  compact
                >
                  {tab.label}
                  {hasVariant(tab.key) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                </PillButton>
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
              <SectionHeading>The Wisdom</SectionHeading>
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
                  <SectionHeading className="mb-0">Workflow</SectionHeading>
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
                  <SectionHeading className="mb-0">Example</SectionHeading>
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
                <SectionHeading>Customize</SectionHeading>
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
                <SectionHeading>Techniques Used</SectionHeading>
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
                <SectionHeading>Related</SectionHeading>
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

        <ModalFooterActions
          openInRef={openInRef}
          shareRef={shareRef}
          openInDropdown={openInDropdown}
          shareDropdown={shareDropdown}
          setOpenInDropdown={setOpenInDropdown}
          setShareDropdown={setShareDropdown}
          llmOptions={LLM_OPTIONS}
          handleOpenIn={handleOpenIn}
          handleCopyLink={handleCopyLink}
          handleShareTwitter={handleShareTwitter}
          handleShareLinkedIn={handleShareLinkedIn}
          handleCopy={handleCopy}
          copied={copied}
          copyCount={copyCount}
        />

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
