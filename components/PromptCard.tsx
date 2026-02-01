
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowUpRight } from 'lucide-react';
import { Prompt } from '../types';

interface PromptCardProps {
  prompt: Prompt;
  onPreview: (prompt: Prompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPreview }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.fullPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layoutId={`card-${prompt.id}`}
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative cursor-pointer"
      onClick={() => onPreview(prompt)}
    >
      {/* The Shape-Shifting Background Layer */}
      <motion.div
        className="absolute inset-0 bg-[#f9f7f2] border border-[#e5e0d8] shadow-sm z-0"
        initial={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', borderRadius: '24px' }}
        whileHover={{ 
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)'
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
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
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Check size={16} className="text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Copy size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
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
            <motion.div
              animate={{ x: 0 }}
              whileHover={{ x: 4 }}
              className="ml-1"
            >
              <ArrowUpRight size={14} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PromptCard;
