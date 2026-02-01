
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Prompt, LLMProvider, TEXT_LLM_TABS, IMAGE_LLM_TABS } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';

interface PromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
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
      <span key={match.index} className="bg-amber-100 text-amber-800 px-1 rounded">
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

const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose }) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activeLLM, setActiveLLM] = useState<LLMProvider>('claude');
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  // Reset state when prompt changes
  useEffect(() => {
    if (prompt) {
      const tabs = prompt.type === 'Image Prompts' ? IMAGE_LLM_TABS : TEXT_LLM_TABS;
      setActiveLLM(tabs[0].key);
      setVariableValues({});
    }
  }, [prompt]);

  useEffect(() => {
    if (!prompt) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [prompt, onClose]);

  const allTabs = prompt?.type === 'Image Prompts' ? IMAGE_LLM_TABS : TEXT_LLM_TABS;
  const hasAnyVariant = prompt ? Object.values(prompt.llmVariants).some(v => !!v) : false;

  const activePromptText = useMemo(() => {
    if (!prompt) return '';
    if (!hasAnyVariant) return prompt.fullPrompt;
    return prompt.llmVariants[activeLLM] || prompt.fullPrompt;
  }, [prompt, activeLLM, hasAnyVariant]);

  const substitutedPrompt = useMemo(() => {
    let text = activePromptText;
    for (const [placeholder, value] of Object.entries(variableValues)) {
      if (value.trim()) {
        text = text.split(placeholder).join(value);
      }
    }
    return text;
  }, [activePromptText, variableValues]);

  const [copied, copy] = useCopyToClipboard(substitutedPrompt);

  if (!prompt) return null;

  const hasVariant = (key: LLMProvider) => !!prompt.llmVariants[key];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in-fast"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={prompt.title}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-[32px] shadow-2xl overflow-hidden border border-[#e5e0d8] flex flex-col max-h-[90vh] focus:outline-none animate-slide-up"
      >
        <div className="p-8 md:p-12 overflow-y-auto">
          {/* 1. Category badge + title + close */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold bg-stone-100 px-3 py-1 rounded-full">
                {prompt.category}
              </span>
              <h2 className="serif text-4xl md:text-5xl font-medium text-stone-900 mt-4 leading-tight">
                {prompt.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-900"
            >
              <X size={24} />
            </button>
          </div>

          {/* 2. LLM Tab Bar */}
          <div className="flex items-center gap-2 mb-8">
            {hasAnyVariant ? (
              allTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveLLM(tab.key)}
                  className={`relative px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
                    activeLLM === tab.key
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {tab.label}
                  {hasVariant(tab.key) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
                  )}
                </button>
              ))
            ) : (
              <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] bg-stone-900 text-white border border-stone-900">
                All LLMs
              </span>
            )}
          </div>

          <div className="space-y-8">
            {/* 3. The Wisdom — prompt preview */}
            <section>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">The Wisdom</h3>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-stone-100 p-6 rounded-2xl text-stone-800 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                  {highlightVariables(substitutedPrompt)}
                </div>
              </div>
            </section>

            {/* 4. Customize — variable input fields */}
            {prompt.variables.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Customize</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {prompt.variables.map((v) => (
                    <div key={v.placeholder}>
                      <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
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
                        className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Techniques Used */}
            {prompt.techniques.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Techniques Used</h3>
                <div className="flex flex-wrap gap-2">
                  {prompt.techniques.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Skills */}
            <section className="flex flex-wrap gap-2">
              {prompt.skills.map((skill, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full border border-stone-200 text-stone-600 text-xs font-medium">
                  {skill}
                </span>
              ))}
            </section>
          </div>
        </div>

        {/* 7. Footer with Copy button */}
        <div className="p-6 md:px-12 md:pb-12 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
          <button
            onClick={copy}
            className="flex items-center gap-2 px-8 py-3 rounded-full border-2 border-stone-200 font-medium hover:border-stone-900 hover:text-stone-900 text-stone-600 transition-all w-full sm:w-auto justify-center"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "Copied!" : "Copy Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;
