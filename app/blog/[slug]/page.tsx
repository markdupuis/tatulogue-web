import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, getAllSlugs, getAllPostMeta, CATEGORY_LABELS } from '@/lib/blog';

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};

  const ogImage = post.coverImage ?? '/images/og-default.jpg';

  return {
    title: `${post.title} | Tatulogue`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `https://tatulogue.com/blog/${post.slug}`,
      images: [{ url: ogImage.startsWith('http') ? ogImage : `https://tatulogue.com${ogImage}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

// Brand palette — blue identity gradient (#2B5876 → #4E4376),
// red-orange energy gradient (#F12711 → #F5AF19). No violet/purple.
const BRAND = {
  blueFrom: '#2B5876',
  blueTo: '#4E4376',
  proseLink: '#8ea4cf',
  proseLinkHover: '#b9c6e6',
  energyFrom: '#F12711',
  energyTo: '#F5AF19',
  energyHi: '#F5AF19',
} as const;

const BLUE_GRADIENT = `linear-gradient(135deg, ${BRAND.blueFrom}, ${BRAND.blueTo})`;
const ENERGY_GRADIENT = `linear-gradient(135deg, ${BRAND.energyFrom}, ${BRAND.energyTo})`;

const CAT_COLORS: Record<string, string> = {
  education: 'bg-[#2B5876]/30 text-[#9fb6dd] border-[#4E4376]/50',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-[#2B5876]/30 text-[#9fb6dd] border-[#4E4376]/50',
  updates: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
  about: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
};

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const catLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const catColor = CAT_COLORS[post.category] ?? CAT_COLORS.updates;
  const dateStr = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(post.date));

  // Related posts: same category, exclude current
  const allPosts = getAllPostMeta();
  const related = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 3);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Tatulogue', logo: { '@type': 'ImageObject', url: 'https://tatulogue.com/logo.svg' } },
    datePublished: post.date,
    url: `https://tatulogue.com/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#07070d' }}>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] backdrop-blur-xl" style={{ backgroundColor: 'rgba(7,7,13,0.6)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-black text-xl sm:text-2xl tracking-[-0.04em]">TATULOGUE</Link>
          <div className="hidden md:flex items-center gap-9 text-sm text-white/60">
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm text-white/60 hover:text-white transition-colors">← Articles</Link>
            <Link href="https://app.tatulogue.com" target="_blank" rel="noopener"
              className="px-5 py-2.5 rounded-full text-sm font-medium text-white transition-[filter] hover:brightness-110"
              style={{ background: ENERGY_GRADIENT, boxShadow: '0 0 30px -6px rgba(241,39,17,0.7)' }}>
              Get early access
            </Link>
          </div>
        </div>
      </nav>

      <article>
        {/* Header */}
        <header className="pt-14 pb-10 border-b border-white/[0.08]">
          <div className="max-w-3xl mx-auto px-6">
            <p
              className="text-xs tracking-[0.3em] font-medium mb-5"
              style={{
                background: `linear-gradient(135deg, ${BRAND.blueTo}, ${BRAND.blueFrom})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              ARTICLES
            </p>
            <div className="flex items-center gap-3 mb-6">
              <Link href={`/blog?category=${post.category}`}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border ${catColor}`}>
                {catLabel}
              </Link>
              <span className="text-zinc-500 text-sm">{post.readTime} min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-5">{post.title}</h1>
            <p className="text-zinc-400 text-xl leading-relaxed mb-6">{post.description}</p>
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <span className="text-zinc-300 font-medium">{post.author}</span>
              <span>·</span>
              <time dateTime={post.date}>{dateStr}</time>
            </div>
          </div>
        </header>

        {/* Cover image */}
        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-6 my-8">
            <img src={post.coverImage} alt={post.coverAlt ?? post.title}
              className="w-full rounded-2xl object-cover max-h-[480px]" />
          </div>
        )}

        {/* Body */}
        <div className="max-w-3xl mx-auto px-6 py-10">
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-zinc-300 prose-p:leading-relaxed
              prose-a:text-[#8ea4cf] prose-a:no-underline hover:prose-a:text-[#b9c6e6]
              prose-strong:text-white prose-strong:font-semibold
              prose-blockquote:border-l-[#4E4376] prose-blockquote:bg-[#2B5876]/15 prose-blockquote:rounded-r-lg prose-blockquote:py-1
              prose-code:text-amber-400 prose-code:bg-zinc-900 prose-code:rounded prose-code:px-1.5 prose-code:text-sm
              prose-hr:border-white/10
              prose-li:text-zinc-300
              prose-table:text-sm prose-th:text-zinc-300 prose-td:text-zinc-400 prose-thead:border-white/20 prose-tbody:border-white/10"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 pb-8 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-400 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* App CTA — red-orange energy accent */}
      <section className="border-t border-b border-white/[0.08] py-14 my-8" style={{ backgroundColor: '#0c0c14' }}>
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <div
              className="absolute -right-10 top-0 w-48 h-48 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(241,39,17,0.18), rgba(245,175,25,0.08) 55%, transparent 75%)' }}
            />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to find your next tattoo artist?</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed max-w-md">Browse portfolios, book sessions, and track your tattoo journey on Tatulogue.</p>
            <Link href="https://app.tatulogue.com" target="_blank" rel="noopener"
              className="inline-flex px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-[filter] hover:brightness-110"
              style={{ background: ENERGY_GRADIENT, boxShadow: '0 0 40px -8px rgba(241,39,17,0.8)' }}>
              Open Tatulogue →
            </Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">More from {catLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map(p => {
              const pDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(p.date));
              return (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[#4E4376]/55 transition-all hover:-translate-y-0.5">
                  <p className="text-zinc-500 text-xs mb-2">{pDate}</p>
                  <h3 className="font-semibold leading-snug mb-2 transition-colors line-clamp-2 group-hover:text-[#b9c6e6]">{p.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <footer className="border-t border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <Link href="/" className="font-black text-2xl tracking-[-0.04em]">TATULOGUE</Link>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
              <Link href="/store" className="hover:text-white transition-colors">Store</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="https://app.tatulogue.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">App</Link>
            </nav>
          </div>
          <p className="mt-10 text-xs text-white/30">© {new Date().getFullYear()} Tatulogue. Tattoo culture, education, and the artists shaping it.</p>
        </div>
      </footer>
    </main>
  );
}
