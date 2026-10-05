import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AUTHORS, authorPersonSchema, authorUrl, SITE_URL } from '@/lib/authors';
import { getAllPostMeta } from '@/lib/blog';
import { FONT_LINK, SITE_STYLES, SiteHeader, SiteFooter } from '@/components/site/SiteChrome';

export function generateStaticParams() {
  return Object.keys(AUTHORS).map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const author = AUTHORS[params.slug];
  if (!author) return {};
  const title = `${author.name}, ${author.jobTitle} | Tatulogue`;
  return {
    title,
    description: author.bio,
    alternates: { canonical: authorUrl(author) },
    openGraph: {
      title: `${author.name}, ${author.jobTitle}`,
      description: author.bio,
      type: 'profile',
      url: authorUrl(author),
      siteName: 'Tatulogue',
      images: [{ url: `${SITE_URL}${author.image}` }],
    },
  };
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = AUTHORS[params.slug];
  if (!author) notFound();

  const posts = getAllPostMeta('blog').filter(p => p.author === author.name);
  const jsonLd = {
    '@context': 'https://schema.org',
    ...authorPersonSchema(author),
    description: author.bio,
    mainEntityOfPage: authorUrl(author),
  };

  return (
    <main className="min-h-screen antialiased font-body text-white" style={{ backgroundColor: '#07070d' }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{SITE_STYLES}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col sm:flex-row gap-6 sm:items-center mb-10">
          <img
            src={author.image}
            alt={`Portrait of ${author.name}`}
            width={128}
            height={128}
            className="h-32 w-32 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <p className="text-xs tracking-[0.3em] font-medium mb-3 text-[#8ea4cf]">AUTHOR</p>
            <h1 className="text-4xl font-black tracking-tight leading-tight">{author.name}</h1>
            <p className="text-zinc-400 mt-1">{author.jobTitle}, Tatulogue</p>
          </div>
        </div>

        <p className="text-zinc-300 text-lg leading-relaxed mb-4">{author.bio}</p>
        <p className="text-zinc-500 text-sm mb-12">{author.focus}</p>

        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">
          Articles by {author.name.split(' ')[0]} ({posts.length})
        </h2>
        <ul className="space-y-3">
          {posts.map(post => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 hover:border-[#4E4376]/55 transition-all"
              >
                <time dateTime={post.date} className="text-zinc-500 text-xs">{dateFormat.format(new Date(post.date))}</time>
                <h3 className="mt-1 font-semibold leading-snug group-hover:text-[#b9c6e6] transition-colors">{post.title}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <SiteFooter />
    </main>
  );
}
