'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { PostMeta } from '@/lib/blog';

const CATEGORY_LABELS: Record<string, string> = {
  education: 'Education',
  spotlight: 'Artist Spotlight',
  trends: 'Trends',
  updates: 'Updates',
  about: 'About Tatulogue',
};

const CAT_COLORS: Record<string, string> = {
  education: 'bg-blue-950/50 text-blue-300 border-blue-800/50',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
  updates: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
  about: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
};

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'education', label: 'Education' },
  { key: 'spotlight', label: 'Artist Spotlight' },
  { key: 'trends', label: 'Trends' },
  { key: 'updates', label: 'Updates' },
  { key: 'about', label: 'About Us' },
];

function PostCard({ post }: { post: PostMeta }) {
  const catLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const catColor = CAT_COLORS[post.category] ?? CAT_COLORS.updates;
  const dateStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(post.date));

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="h-full rounded-xl border border-white/8 bg-zinc-900/60 overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/20 flex flex-col">
        <div className="aspect-video bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-5xl font-black text-white/10 overflow-hidden flex-shrink-0">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            post.title[0]
          )}
        </div>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${catColor}`}>
              {catLabel}
            </span>
          </div>
          <h2 className="text-lg font-bold leading-snug mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">
            {post.title}
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-zinc-500 text-xs">
              {dateStr} · {post.readTime} min
            </span>
            <span className="text-violet-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform inline-block">
              Read →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface CategoryFilterProps {
  posts: PostMeta[];
  featuredSlug: string;
}

export default function CategoryFilter({ posts, featuredSlug }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? posts
      : posts.filter(p => p.category === activeCategory);

  const visible = filtered.filter(p => p.slug !== featuredSlug);

  return (
    <section>
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat.key
                ? 'bg-zinc-800 border-violet-500/60 text-white'
                : 'bg-transparent border-white/10 text-zinc-400 hover:border-white/25 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center py-20 text-zinc-500">
          No posts in this category yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
