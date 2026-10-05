import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPostMeta } from '@/lib/blog';
import { FONT_LINK, SITE_STYLES, SiteHeader, SiteFooter } from '@/components/site/SiteChrome';

export const metadata: Metadata = {
  title: 'Changelog | Tatulogue',
  description: 'Product updates, patch notes and app announcements from Tatulogue.',
  alternates: { canonical: 'https://tatulogue.com/changelog' },
  openGraph: {
    title: 'Tatulogue Changelog',
    description: 'Product updates, patch notes and app announcements from Tatulogue.',
    url: 'https://tatulogue.com/changelog',
    siteName: 'Tatulogue',
  },
};

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

export default function ChangelogIndex() {
  const entries = getAllPostMeta('changelog');

  return (
    <main className="min-h-screen antialiased font-body text-white" style={{ backgroundColor: '#07070d' }}>
      <link href={FONT_LINK} rel="stylesheet" />
      <style>{SITE_STYLES}</style>
      <SiteHeader />

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-20">
        <p className="text-xs tracking-[0.3em] font-medium mb-5 text-[#8ea4cf]">CHANGELOG</p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4">What&apos;s new in Tatulogue</h1>
        <p className="text-zinc-400 text-lg leading-relaxed mb-12">
          Patch notes, release announcements and product updates. Looking for tattoo guides instead?{' '}
          <Link href="/blog" className="text-[#8ea4cf] hover:text-[#b9c6e6] transition-colors">Read our articles</Link>.
        </p>

        <ul className="space-y-4">
          {entries.map(entry => (
            <li key={entry.slug}>
              <Link
                href={`/changelog/${entry.slug}`}
                className="group block rounded-xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-[#4E4376]/55 transition-all hover:-translate-y-0.5"
              >
                <time dateTime={entry.date} className="text-zinc-500 text-xs">
                  {dateFormat.format(new Date(entry.date))}
                </time>
                <h2 className="mt-2 text-xl font-semibold leading-snug group-hover:text-[#b9c6e6] transition-colors">{entry.title}</h2>
                <p className="mt-2 text-zinc-400 text-sm leading-relaxed">{entry.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <SiteFooter />
    </main>
  );
}
