import React from 'react';
import { Check, Copy, ExternalLink, Link, Share2 } from 'lucide-react';
import ActionButton from '../ui/ActionButton';

interface LlmOption {
  name: string;
  url: string;
}

interface ModalFooterActionsProps {
  openInRef: React.RefObject<HTMLDivElement | null>;
  shareRef: React.RefObject<HTMLDivElement | null>;
  openInDropdown: boolean;
  shareDropdown: boolean;
  setOpenInDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  setShareDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  llmOptions: LlmOption[];
  handleOpenIn: (llm: LlmOption) => void;
  handleCopyLink: () => void;
  handleShareTwitter: () => void;
  handleShareLinkedIn: () => void;
  handleCopy: () => void;
  copied: boolean;
  copyCount: number;
}

const ModalFooterActions: React.FC<ModalFooterActionsProps> = ({
  openInRef,
  shareRef,
  openInDropdown,
  shareDropdown,
  setOpenInDropdown,
  setShareDropdown,
  llmOptions,
  handleOpenIn,
  handleCopyLink,
  handleShareTwitter,
  handleShareLinkedIn,
  handleCopy,
  copied,
  copyCount,
}) => {
  return (
    <div className="shrink-0 p-6 md:px-12 md:pb-10 bg-stone-50 dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="relative" ref={openInRef}>
          <ActionButton
            onClick={() => { setOpenInDropdown(!openInDropdown); setShareDropdown(false); }}
            aria-label="Open in LLM"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:inline">Open in...</span>
          </ActionButton>
          {openInDropdown && (
            <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl overflow-hidden z-10 animate-fade-in-fast">
              {llmOptions.map((llm) => (
                <button
                  key={llm.name}
                  type="button"
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

        <div className="relative" ref={shareRef}>
          <ActionButton
            onClick={() => { setShareDropdown(!shareDropdown); setOpenInDropdown(false); }}
            aria-label="Share"
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </ActionButton>
          {shareDropdown && (
            <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl shadow-xl overflow-hidden z-10 animate-fade-in-fast">
              <button type="button" onClick={handleCopyLink} className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2">
                <Link size={14} />
                Copy Link
              </button>
              <button type="button" onClick={handleShareTwitter} className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X / Twitter
              </button>
              <button type="button" onClick={handleShareLinkedIn} className="w-full text-left px-4 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </button>
            </div>
          )}
        </div>
      </div>

      <ActionButton onClick={handleCopy} variant="primary">
        {copied ? <Check size={18} /> : <Copy size={18} />}
        {copied ? 'Copied!' : 'Copy Prompt'}
        {copyCount > 0 && !copied && (
          <span className="text-stone-400 dark:text-stone-500 text-xs">{copyCount}x</span>
        )}
      </ActionButton>
    </div>
  );
};

export default React.memo(ModalFooterActions);
