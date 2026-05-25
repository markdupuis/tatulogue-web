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
    title: `${post.title} | Tatulogue Journal`,
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

const CAT_COLORS: Record<string, string> = {
  education: 'bg-blue-950/50 text-blue-300 border-blue-800/50',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-violet-950/50 text-violet-300 border-violet-800/50',
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
    <main className="min-h-screen bg-black">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/8 bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/images/logo-mark.svg" alt="Tatulogue" className="w-7 h-7 brightness-0 invert" />
            <span className="font-bold text-lg tracking-tight">Tatulogue</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors">← Journal</Link>
            <Link href="https://app.tatulogue.com" target="_blank" rel="noopener"
              className="px-4 py-2 rounded-lg bg-zinc-900 border border-white/10 text-sm font-semibold hover:border-violet-500/50 transition-colors">
              Open App
            </Link>
          </div>
        </div>
      </nav>

      <article>
        {/* Header */}
        <header className="pt-14 pb-10 border-b border-white/8">
          <div className="max-w-3xl mx-auto px-6">
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
              prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
              prose-strong:text-white prose-strong:font-semibold
              prose-blockquote:border-l-violet-500 prose-blockquote:bg-violet-950/20 prose-blockquote:rounded-r-lg prose-blockquote:py-1
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
              <span key={tag} className="px-3 py-1 rounded-full bg-zinc-900 border border-white/8 text-zinc-400 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* App CTA */}
      <section className="border-t border-b border-white/8 bg-zinc-950 py-14 my-8">
        <div className="max-w-3xl mx-auto px-6 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
            <div className="absolute -right-10 top-0 w-48 h-48 rounded-full bg-violet-600/10 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to find your next tattoo artist?</h2>
            <p className="text-zinc-400 mb-6 leading-relaxed max-w-md">Browse portfolios, book sessions, and track your tattoo journey on Tatulogue.</p>
            <Link href="https://app.tatulogue.com" target="_blank" rel="noopener"
              className="inline-flex px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-bold text-sm hover:opacity-90 transition-opacity">
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
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block rounded-xl border border-white/8 bg-zinc-900/60 p-5 hover:border-violet-500/40 transition-all hover:-translate-y-0.5">
                  <p className="text-zinc-500 text-xs mb-2">{pDate}</p>
                  <h3 className="font-semibold leading-snug mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">{p.title}</h3>
                  <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <footer className="border-t border-white/8 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-zinc-500 text-sm">
          <span>© {new Date().getFullYear()} Tatulogue</span>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Journal</Link>
            <Link href="https://app.tatulogue.com" target="_blank" rel="noopener" className="hover:text-white transition-colors">App</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
