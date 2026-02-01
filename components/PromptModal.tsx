
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Copy, Check } from 'lucide-react';
import { Prompt } from '../types';

interface PromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, [prompt]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  useEffect(() => {
    if (!prompt) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    dialogRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKey);
  }, [prompt, onClose]);

  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.2s ease' }}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={prompt.title}
        tabIndex={-1}
        className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-[32px] shadow-2xl overflow-hidden border border-[#e5e0d8] flex flex-col max-h-[90vh] focus:outline-none"
        style={{ animation: 'slideUp 0.3s ease' }}
      >
        <div className="p-8 md:p-12 overflow-y-auto">
          <div className="flex justify-between items-start mb-8">
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

          <div className="space-y-8">
            <section>
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">The Wisdom</h3>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-stone-200 to-stone-100 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white border border-stone-100 p-6 rounded-2xl text-stone-800 leading-relaxed font-mono text-sm whitespace-pre-wrap">
                  {prompt.fullPrompt}
                </div>
              </div>
            </section>

            <section className="flex flex-wrap gap-2">
              {prompt.skills.map((skill, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full border border-stone-200 text-stone-600 text-xs font-medium">
                  {skill}
                </span>
              ))}
            </section>
          </div>
        </div>

        <div className="p-6 md:px-12 md:pb-12 bg-stone-50 border-t border-stone-100 flex items-center justify-end">
          <button
            onClick={handleCopy}
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
