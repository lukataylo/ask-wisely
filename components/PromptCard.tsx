
import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onPreview: (prompt: Prompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPreview }) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="prompt-card group relative cursor-pointer"
      onClick={() => onPreview(prompt)}
    >
      {/* The Shape-Shifting Background Layer */}
      <div
        className="prompt-card-bg absolute inset-0 bg-[#f9f7f2] border border-[#e5e0d8] shadow-sm z-0"
      />

      <div className="relative z-10 p-8 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold px-2 py-1 bg-[#eeeae3] rounded-full">
              {prompt.category}
            </span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-600"
              aria-label="Copy prompt"
            >
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          </div>

          <h3 className="serif text-2xl font-medium text-stone-800 mb-3 group-hover:text-stone-900 transition-colors">
            {prompt.title}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            {prompt.shortDescription}
          </p>
        </div>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-stone-200/50">
          <div className="flex -space-x-1">
            {prompt.skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="text-[10px] text-stone-400 bg-white border border-stone-100 px-2 py-0.5 rounded shadow-sm">
                {skill}
              </span>
            ))}
          </div>
          <div className="flex items-center text-xs font-medium text-stone-500 group-hover:text-stone-900 transition-colors">
            Preview
            <span className="arrow-icon ml-1">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
