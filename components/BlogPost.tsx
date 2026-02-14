import React from 'react';
import { ArrowLeft } from 'lucide-react';
import type { BlogPost as BlogPostType } from '../lib/blog-data';

interface BlogPostProps {
  post: BlogPostType;
  onBack: () => void;
}

function renderMarkdown(content: string): React.ReactNode[] {
  return content.split('\n\n').map((block, i) => {
    const trimmed = block.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={i}
          className="serif text-3xl md:text-4xl font-medium text-stone-900 dark:text-stone-100 leading-snug mt-16 mb-6"
        >
          {trimmed.replace('## ', '')}
        </h2>
      );
    }

    // Bold line (standalone): **text**
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('\n')) {
      return (
        <p
          key={i}
          className="text-lg font-semibold text-stone-900 dark:text-stone-100 leading-relaxed mb-4"
        >
          {trimmed.replace(/\*\*/g, '')}
        </p>
      );
    }

    // Lines that start with a number and period: ordered list items
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => l.trim());
      return (
        <ol key={i} className="space-y-3 mb-8 ml-1">
          {items.map((item, j) => (
            <li
              key={j}
              className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed font-light pl-2"
            >
              {renderInline(item.replace(/^\d+\.\s/, ''))}
            </li>
          ))}
        </ol>
      );
    }

    // Lines that start with -: unordered list items
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter(l => l.trim());
      return (
        <ul key={i} className="space-y-3 mb-8 ml-1">
          {items.map((item, j) => (
            <li
              key={j}
              className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-relaxed font-light pl-2 flex gap-3"
            >
              <span className="text-stone-400 dark:text-stone-600 shrink-0">&mdash;</span>
              <span>{renderInline(item.replace(/^-\s/, ''))}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Bold label + text pattern: **Label:** rest of text, or **Label** — rest
    if (trimmed.startsWith('**') && (trimmed.includes(':**') || trimmed.includes('** —'))) {
      const parts = trimmed.split('\n').filter(l => l.trim());
      if (parts.length === 1) {
        return (
          <p key={i} className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-[1.85] mb-6 font-light">
            {renderInline(trimmed)}
          </p>
        );
      }
      return (
        <div key={i} className="mb-6">
          {parts.map((line, j) => (
            <p key={j} className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-[1.85] mb-3 font-light">
              {renderInline(line)}
            </p>
          ))}
        </div>
      );
    }

    // Default paragraph
    return (
      <p
        key={i}
        className="text-lg md:text-xl text-stone-700 dark:text-stone-300 leading-[1.85] mb-6 font-light"
      >
        {renderInline(trimmed)}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (match[1]) {
      parts.push(
        <strong key={match.index} className="font-semibold text-stone-900 dark:text-stone-100">
          {match[1]}
        </strong>
      );
    } else if (match[2]) {
      parts.push(
        <em key={match.index} className="italic">
          {match[2]}
        </em>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export default function BlogPost({ post, onBack }: BlogPostProps) {
  return (
    <article className="animate-fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors mb-16"
      >
        <ArrowLeft size={14} />
        Back to Blog
      </button>

      {/* Header */}
      <header className="mb-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
            {post.category}
          </span>
          <span className="text-stone-300 dark:text-stone-700">&middot;</span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500 tracking-wide">
            {post.readTime}
          </span>
        </div>

        <h1 className="serif text-5xl md:text-6xl lg:text-7xl font-medium text-stone-900 dark:text-stone-100 leading-[1.1] mb-6">
          {post.title}
        </h1>

        <p className="serif text-2xl md:text-3xl text-stone-500 dark:text-stone-400 font-light leading-snug italic">
          {post.subtitle}
        </p>

        <div className="flex items-center gap-4 mt-10 pt-8 border-t border-stone-200 dark:border-stone-800">
          <div className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-sm font-bold text-stone-500 dark:text-stone-400">
            AW
          </div>
          <div>
            <div className="text-sm font-medium text-stone-900 dark:text-stone-100">{post.author}</div>
            <div className="text-xs text-stone-400 dark:text-stone-500">{post.date}</div>
          </div>
        </div>
      </header>

      {/* Feature paragraph */}
      <div className="mb-16 max-w-3xl">
        <p className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 leading-[1.8] font-light">
          {post.featureParagraph}
        </p>
      </div>

      {/* Divider */}
      <div className="max-w-3xl mb-16">
        <div className="w-16 h-px bg-stone-300 dark:bg-stone-700" />
      </div>

      {/* Content */}
      <div className="max-w-3xl">
        {renderMarkdown(post.content)}
      </div>

      {/* Footer */}
      <div className="max-w-3xl mt-20 pt-10 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </button>
      </div>
    </article>
  );
}
