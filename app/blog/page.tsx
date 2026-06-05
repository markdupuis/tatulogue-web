import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPostMeta, CATEGORY_LABELS, type PostMeta } from '@/lib/blog';
import CategoryFilter from './components/CategoryFilter';

export const metadata: Metadata = {
  title: 'Articles — Tattoo Education, Artist Spotlights & Trends | Tatulogue',
  description:
    'In-depth guides on tattoo styles, aftercare, artist spotlights, and the latest trends in the tattoo community.',
  openGraph: {
    title: 'Articles',
    description:
      'Tattoo education, artist spotlights, trends and stories from the Tatulogue community.',
    url: 'https://tatulogue.com/blog',
  },
};

const CAT_COLORS: Record<string, string> = {
  education: 'bg-blue-950/50 text-blue-300 border-blue-800/50',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
  updates: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
  about: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
};

function FeaturedCard({ post }: { post: PostMeta }) {
  const catLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const catColor = CAT_COLORS[post.category] ?? CAT_COLORS.updates;
  const dateStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(post.date));

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="rounded-2xl border border-white/8 bg-zinc-900/60 overflow-hidden hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-violet-950/30 md:flex">
        <div className="md:w-[55%] bg-gradient-to-br from-zinc-800 to-zinc-900 aspect-video md:aspect-auto flex items-center justify-center text-7xl font-black text-white/10 flex-shrink-0">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            post.title[0]
          )}
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border ${catColor}`}>
              {catLabel}
            </span>
            <span className="text-zinc-500 text-sm">{post.readTime} min read</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3 group-hover:text-violet-300 transition-colors">
            {post.title}
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6 line-clamp-3">{post.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-zinc-500 text-sm">{dateStr}</span>
            <span className="text-violet-400 text-sm font-semibold group-hover:translate-x-1 transition-transform inline-block">
              Read →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function BlogIndex() {
  const allPosts = getAllPostMeta();
  const featured = allPosts.find(p => p.featured) ?? allPosts[0];

  return (
    <main className="min-h-screen bg-black">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo-mark.svg" alt="Tatulogue" className="w-7 h-7 brightness-0 invert" />
            <span className="font-bold text-lg tracking-tight">Tatulogue</span>
          </Link>
          <Link
            href="https://app.tatulogue.com"
            target="_blank"
            rel="noopener"
            className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-sm font-semibold hover:border-violet-500/50 transition-colors"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-12 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-6">
          <span className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest border border-violet-800/50 bg-violet-950/30 text-violet-400">
            Articles
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4">
            Tattoo education,
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              stories, and inspiration.
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl leading-relaxed">
            Guides for first-timers and collectors. Spotlights on artists. Everything you need to
            know about tattoos.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Featured */}
        {featured && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-5">
              Featured
            </p>
            <FeaturedCard post={featured} />
          </section>
        )}

        {/* Client-side category filter + grid */}
        <CategoryFilter posts={allPosts} featuredSlug={featured?.slug ?? ''} />

        {/* App CTA */}
        <section className="rounded-2xl border border-white/8 bg-zinc-900/60 p-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="absolute right-40 -bottom-20 w-48 h-48 rounded-full bg-blue-600/8 blur-3xl" />
          </div>
          <div className="relative max-w-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to find your next tattoo artist?
            </h2>
            <p className="text-zinc-400 mb-6 leading-relaxed">
              Browse portfolios, book sessions, and track your tattoo journey on Tatulogue.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://app.tatulogue.com"
                target="_blank"
                rel="noopener"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Open Tatulogue
              </Link>
              <Link
                href="/blog"
                className="px-6 py-3 rounded-xl border border-white/10 font-semibold text-sm text-zinc-300 hover:border-white/25 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-zinc-500 text-sm">
          <span>© {new Date().getFullYear()} Tatulogue</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              Articles
            </Link>
            <Link
              href="https://app.tatulogue.com"
              target="_blank"
              rel="noopener"
              className="hover:text-white transition-colors"
            >
              App
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
