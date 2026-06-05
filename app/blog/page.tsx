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

const BLUE_GRADIENT = 'linear-gradient(135deg, #2B5876, #4E4376)';
const ENERGY_GRADIENT = 'linear-gradient(135deg, #F12711, #F5AF19)';

const CAT_COLORS: Record<string, string> = {
  education: 'bg-[#2B5876]/20 text-[#9db8d4] border-[#4E4376]/40',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-amber-950/30 text-amber-300 border-amber-700/40',
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
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#4E4376]/55 hover:shadow-2xl hover:shadow-[#2B5876]/20 md:flex">
        <div className="md:w-[55%] bg-gradient-to-br from-zinc-800 to-zinc-900 aspect-video md:aspect-auto flex items-center justify-center text-7xl font-black text-white/10 flex-shrink-0 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
            <span className="text-white/40 text-sm">{post.readTime} min read</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-3 transition-colors group-hover:text-[#F5AF19]">
            {post.title}
          </h2>
          <p className="text-white/50 leading-relaxed mb-6 line-clamp-3">{post.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-sm">{dateStr}</span>
            <span
              className="text-sm font-semibold inline-block transition-transform group-hover:translate-x-1"
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

export default function BlogIndex() {
  const allPosts = getAllPostMeta();
  const featured = allPosts.find(p => p.featured) ?? allPosts[0];

  return (
    <main className="min-h-screen bg-[#07070d] text-white antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/8 bg-[#07070d]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Tatulogue" className="h-6 w-auto" />
          </Link>
          <nav className="flex items-center gap-6 text-sm font-semibold">
            <Link href="/blog" className="text-white transition-colors">Articles</Link>
            <Link href="/about" className="text-white/70 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link>
            <Link
              href="https://app.tatulogue.com"
              target="_blank"
              rel="noopener"
              className="px-4 py-2 rounded-full text-white shadow-[0_0_30px_-6px_rgba(241,39,17,0.7)] transition-[filter] hover:brightness-110"
              style={{ background: ENERGY_GRADIENT }}
            >
              Open App
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 border-b border-white/8">
        <div
          className="absolute -bottom-24 -left-24 w-[34rem] h-[34rem] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(43,88,118,0.4), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute -top-10 right-0 w-[26rem] h-[26rem] rounded-full blur-[150px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(241,39,17,0.16), transparent 70%)' }}
          aria-hidden
        />
        <div className="relative max-w-6xl mx-auto px-6">
          <p
            className="text-xs sm:text-sm tracking-[0.35em] font-medium mb-6"
            style={{
              background: BLUE_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            ARTICLES
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95] mb-5 max-w-4xl">
            Tattoo culture, education,
            <br />
            <span
              style={{
                background: BLUE_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              and the artists shaping it.
            </span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-xl leading-relaxed">
            In-depth guides for first-timers and collectors. Spotlights on artists. Everything you
            need to know about tattoos.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Featured */}
        {featured && (
          <section>
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] mb-5"
              style={{
                background: BLUE_GRADIENT,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Featured
            </p>
            <FeaturedCard post={featured} />
          </section>
        )}

        {/* Client-side category filter + grid */}
        <CategoryFilter posts={allPosts} featuredSlug={featured?.slug ?? ''} />

        {/* App CTA */}
        <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-10 sm:p-14 text-center">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full blur-[120px]"
              style={{
                background:
                  'radial-gradient(circle, rgba(43,88,118,0.32), rgba(241,39,17,0.12) 55%, transparent 75%)',
              }}
            />
          </div>
          <div className="relative max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
              The articles are just the start.
            </h2>
            <p className="text-white/55 mb-7 leading-relaxed">
              Browse portfolios, book sessions, and track your tattoo journey on Tatulogue.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="https://app.tatulogue.com"
                target="_blank"
                rel="noopener"
                className="px-7 py-3.5 rounded-full font-semibold text-sm text-white shadow-[0_0_40px_-10px_rgba(241,39,17,0.8)] transition-[filter] hover:brightness-110"
                style={{ background: ENERGY_GRADIENT }}
              >
                Open Tatulogue
              </Link>
              <Link
                href="/blog"
                className="px-7 py-3.5 rounded-full border border-white/20 font-medium text-sm text-white/80 transition-colors hover:border-[#F5AF19] hover:text-[#F5AF19] hover:bg-white/5"
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/8 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Tatulogue" className="h-5 w-auto opacity-70" />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-white/50">
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>
        </div>
        <p className="max-w-6xl mx-auto px-6 mt-8 text-xs text-white/30">
          © {new Date().getFullYear()} Tatulogue. Tattoo culture, education, and the artists shaping it.
        </p>
      </footer>
    </main>
  );
}
