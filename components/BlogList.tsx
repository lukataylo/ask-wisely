import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BLOG_POSTS, type BlogPost } from '../lib/blog-data';

interface BlogListProps {
  onSelectPost: (post: BlogPost) => void;
}

export default function BlogList({ onSelectPost }: BlogListProps) {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <div className="animate-fade-in">
      {/* Featured post */}
      {featured && (
        <button
          onClick={() => onSelectPost(featured)}
          className="w-full text-left group mb-16 block"
        >
          <div className="border-b border-stone-200 dark:border-stone-800 pb-16">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500 mb-6">
              Featured
            </span>
            <h2 className="serif text-4xl md:text-5xl font-medium text-stone-900 dark:text-stone-100 leading-tight mb-4 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
              {featured.title}
            </h2>
            <p className="text-lg md:text-xl text-stone-500 dark:text-stone-400 font-light leading-relaxed mb-6 max-w-3xl">
              {featured.featureParagraph.slice(0, 200)}...
            </p>
            <div className="flex items-center gap-4 text-xs text-stone-400 dark:text-stone-500">
              <span className="font-medium">{featured.author}</span>
              <span>&middot;</span>
              <span>{featured.date}</span>
              <span>&middot;</span>
              <span>{featured.readTime}</span>
              <ArrowRight size={14} className="ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </button>
      )}

      {/* Post list */}
      <div className="space-y-0">
        {rest.map((post) => (
          <button
            key={post.slug}
            onClick={() => onSelectPost(post)}
            className="w-full text-left group block py-10 border-b border-stone-200/60 dark:border-stone-800/60 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 dark:text-stone-500">
                    {post.category}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">&middot;</span>
                  <span className="text-[10px] text-stone-400 dark:text-stone-500 tracking-wide">
                    {post.readTime}
                  </span>
                </div>
                <h3 className="serif text-2xl md:text-3xl font-medium text-stone-900 dark:text-stone-100 leading-snug mb-2 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-stone-500 dark:text-stone-400 font-light leading-relaxed line-clamp-2">
                  {post.subtitle}
                </p>
              </div>
              <div className="hidden md:flex items-center shrink-0 pt-8">
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-200 transition-colors flex items-center gap-2">
                  Read
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4 text-xs text-stone-400 dark:text-stone-500">
              <span>{post.author}</span>
              <span>&middot;</span>
              <span>{post.date}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
