import Link from 'next/link';
import {
  getAllPostMeta,
  lastModifiedIso,
  wasUpdated,
  CATEGORY_LABELS,
  type Post,
} from '@/lib/blog';
import { getAuthorByName, authorPersonSchema, SITE_URL } from '@/lib/authors';
import { getPublicImageSize } from '@/lib/image-size';
import { FONT_LINK, SITE_STYLES, SiteHeader, SiteFooter } from './SiteChrome';
import { absoluteImage, postUrl, sectionPath } from './postMetadata';

// Brand palette — blue identity gradient (#2B5876 → #4E4376),
// red-orange energy gradient (#F12711 → #F5AF19). No violet/purple.
const BRAND = {
  blueFrom: '#2B5876',
  blueTo: '#4E4376',
  energyFrom: '#F12711',
  energyTo: '#F5AF19',
} as const;

const ENERGY_GRADIENT = `linear-gradient(135deg, ${BRAND.energyFrom}, ${BRAND.energyTo})`;

const CAT_COLORS: Record<string, string> = {
  education: 'bg-[#2B5876]/30 text-[#9fb6dd] border-[#4E4376]/50',
  spotlight: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
  trends: 'bg-[#2B5876]/30 text-[#9fb6dd] border-[#4E4376]/50',
  updates: 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50',
  about: 'bg-orange-950/40 text-amber-400 border-orange-800/40',
};

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
const shortDateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const MAX_BODY_IMAGE_HEIGHT = 560;

// Body images from markdown get lazy loading plus intrinsic dimensions so they reserve
// space before loading, and tall photos are width-capped to stay under a readable height.
// The cover image is handled separately.
function lazyBodyImages(contentHtml: string): string {
  return contentHtml.replace(/<img src="([^"]+)"/g, (_match, src: string) => {
    const size = getPublicImageSize(src);
    if (!size) return `<img loading="lazy" decoding="async" src="${src}"`;
    const maxWidth = Math.min(size.width, Math.round((MAX_BODY_IMAGE_HEIGHT * size.width) / size.height));
    return `<img loading="lazy" decoding="async" width="${size.width}" height="${size.height}" style="max-width:min(100%,${maxWidth}px)" src="${src}"`;
  });
}

export default function PostPage({ post }: { post: Post }) {
  const basePath = sectionPath(post.section);
  const isChangelog = post.section === 'changelog';
  const catLabel = CATEGORY_LABELS[post.category] ?? post.category;
  const catColor = CAT_COLORS[post.category] ?? CAT_COLORS.updates;
  const author = getAuthorByName(post.author);
  const updated = wasUpdated(post);

  const related = getAllPostMeta(post.section)
    .filter(p => p.slug !== post.slug && (isChangelog || p.category === post.category))
    .slice(0, 3);

  const url = postUrl(post);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: author
      ? authorPersonSchema(author)
      : { '@type': 'Organization', name: post.author, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Tatulogue',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    datePublished: post.date,
    dateModified: lastModifiedIso(post),
    image: [absoluteImage(post.coverImage)],
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };

  return (
    <main className="min-h-screen antialiased font-body" style={{ backgroundColor: '#07070d' }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{SITE_STYLES}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {post.faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.faqSchema) }} />
      )}

      <SiteHeader />

      <article>
        <header className="pt-28 pb-10 border-b border-white/[0.08]">
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
              {isChangelog ? 'CHANGELOG' : 'ARTICLES'}
            </p>
            <div className="flex items-center gap-3 mb-6">
              {isChangelog ? (
                <Link
                  href="/changelog"
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border ${catColor}`}
                >
                  {catLabel}
                </Link>
              ) : (
                <Link
                  href={`/blog?category=${post.category}`}
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border ${catColor}`}
                >
                  {catLabel}
                </Link>
              )}
              <span className="text-zinc-500 text-sm">{post.readTime} min read</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-5">{post.title}</h1>
            <p className="text-zinc-400 text-xl leading-relaxed mb-6">{post.description}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
              {author ? (
                <Link href={`/authors/${author.slug}`} className="text-zinc-300 font-medium hover:text-white transition-colors">
                  {post.author}
                </Link>
              ) : (
                <span className="text-zinc-300 font-medium">{post.author}</span>
              )}
              <span>·</span>
              <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
              {updated && (
                <>
                  <span>·</span>
                  <span>
                    Updated <time dateTime={lastModifiedIso(post)}>{dateFormat.format(new Date(lastModifiedIso(post)))}</time>
                  </span>
                </>
              )}
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="max-w-4xl mx-auto px-6 my-8">
            <img
              src={post.coverImage}
              alt={post.coverAlt ?? post.title}
              width={1200}
              height={750}
              fetchPriority="high"
              decoding="async"
              className="w-full rounded-2xl object-cover max-h-[480px]"
            />
          </div>
        )}

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
              prose-table:text-sm prose-th:text-zinc-300 prose-td:text-zinc-400 prose-thead:border-white/20 prose-tbody:border-white/10
              prose-img:mx-auto prose-img:h-auto prose-img:rounded-xl prose-img:border prose-img:border-white/8"
            dangerouslySetInnerHTML={{ __html: lazyBodyImages(post.contentHtml) }}
          />
        </div>

        {post.tags.length > 0 && (
          <div className="max-w-3xl mx-auto px-6 pb-8 flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-400 text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {author && (
          <aside className="max-w-3xl mx-auto px-6 pb-10" aria-label="About the author">
            <div className="flex gap-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <img
                src={author.image}
                alt={`Portrait of ${author.name}`}
                width={72}
                height={72}
                loading="lazy"
                decoding="async"
                className="h-[72px] w-[72px] rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Written by</p>
                <p className="font-semibold text-white">
                  <Link href={`/authors/${author.slug}`} className="hover:text-[#b9c6e6] transition-colors">
                    {author.name}
                  </Link>
                  <span className="text-zinc-500 font-normal">, {author.jobTitle}</span>
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed mt-2">{author.bio}</p>
                <Link
                  href={`/authors/${author.slug}`}
                  className="inline-block mt-3 text-sm text-[#8ea4cf] hover:text-[#b9c6e6] transition-colors"
                >
                  More from {author.name.split(' ')[0]} →
                </Link>
              </div>
            </div>
          </aside>
        )}
      </article>

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
            <p className="text-zinc-400 mb-6 leading-relaxed max-w-md">Discover artists by style and location, browse portfolios, and follow your tattoo journey on Tatulogue.</p>
            <Link
              href="https://app.tatulogue.com"
              target="_blank"
              rel="noopener"
              className="inline-flex px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-[filter] hover:brightness-110"
              style={{ background: ENERGY_GRADIENT, boxShadow: '0 0 40px -8px rgba(241,39,17,0.8)' }}
            >
              Open Tatulogue →
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">
            {isChangelog ? 'More updates' : `More from ${catLabel}`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {related.map(p => (
              <Link
                key={p.slug}
                href={`${basePath}/${p.slug}`}
                className="group block rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[#4E4376]/55 transition-all hover:-translate-y-0.5"
              >
                <p className="text-zinc-500 text-xs mb-2">{shortDateFormat.format(new Date(p.date))}</p>
                <h3 className="font-semibold leading-snug mb-2 transition-colors line-clamp-2 group-hover:text-[#b9c6e6]">{p.title}</h3>
                <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed">{p.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
