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

const BLUE_GRADIENT = 'linear-gradient(135deg, #2B5876, #4E4376)';

const CAT_COLORS: Record<string, string> = {
  education: 'bg-[#2B5876]/20 text-[#9db8d4] border-[#4E4376]/40',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-amber-950/30 text-amber-300 border-amber-700/40',
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
      <div className="h-full rounded-xl border border-white/8 bg-white/[0.03] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#4E4376]/55 hover:shadow-xl hover:shadow-[#2B5876]/20 flex flex-col">
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
          <h2 className="text-lg font-bold leading-snug mb-2 line-clamp-2 transition-colors group-hover:text-[#F5AF19]">
            {post.title}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
            {post.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-white/40 text-xs">
              {dateStr} · {post.readTime} min
            </span>
            <span
              className="text-xs font-semibold inline-block transition-transform group-hover:translate-x-0.5"
              style={{
                background: BLUE_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
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
            className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-all ${
              activeCategory === cat.key
                ? 'border-[#4E4376]/70 text-white bg-gradient-to-br from-[#2B5876]/50 to-[#4E4376]/50'
                : 'bg-white/5 border-white/10 text-white/60 hover:border-[#F12711]/60 hover:text-[#F5AF19]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-center py-20 text-white/40">
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
