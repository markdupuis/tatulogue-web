import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTISTS, buildCtaUrl } from '../../../lib/artists';

// Artist Accent gradient from the app design system (architecture.md).
const BLUE_GRADIENT = 'linear-gradient(135deg, #2B5876, #4E4376)';
const CHARCOAL = '#11100E';

export function generateStaticParams() {
  return Object.keys(ARTISTS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const artist = ARTISTS[params.slug];
  if (!artist) return {};
  const title = `${artist.name} — ${artist.shopName} | Tatulogue`;
  const description = `${artist.tagline}. ${artist.specialties.join(', ')}. Book with ${artist.name} on Tatulogue.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://tatulogue.com/artists/${artist.slug}`,
      siteName: 'Tatulogue',
      type: 'profile',
      images: [{ url: `https://tatulogue.com${artist.ogImage}`, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = ARTISTS[params.slug];
  if (!artist) notFound();
  const ctaUrl = buildCtaUrl(artist);

  return (
    <main className="min-h-screen" style={{ background: CHARCOAL }}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        {/* Brand mark */}
        <Link href="/" className="mb-10 flex items-center gap-2">
          <img src="/images/logo-mark.svg" alt="Tatulogue" className="h-7 w-7" />
          <span className="text-sm font-semibold tracking-widest text-white/60">TATULOGUE</span>
        </Link>

        {/* Hero */}
        <p
          className="mb-3 inline-block rounded-lg px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
          style={{ background: BLUE_GRADIENT }}
        >
          Verified artist spotlight
        </p>
        <h1 className="text-4xl font-black text-white sm:text-5xl">{artist.name}</h1>
        <p className="mt-2 text-lg text-white/60">{artist.tagline}</p>
        <p className="mt-1 text-sm text-white/40">
          {artist.shopName} · @{artist.instagramHandle}
        </p>

        {/* Specialties */}
        <div className="mt-6 flex flex-wrap gap-2">
          {artist.specialties.map((s) => (
            <span
              key={s}
              className="rounded-lg border border-white/15 px-3 py-1 text-sm text-white/80"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Bio */}
        <div className="mt-8 space-y-4">
          {artist.bio.map((p) => (
            <p key={p} className="text-base leading-relaxed text-white/70">
              {p}
            </p>
          ))}
        </div>

        {/* Primary CTA */}
        <a
          href={ctaUrl}
          className="mt-10 block rounded-lg px-6 py-4 text-center text-lg font-bold text-white transition-transform hover:scale-[1.01]"
          style={{ background: BLUE_GRADIENT }}
        >
          {artist.ctaLabel}
        </a>
        <p className="mt-2 text-center text-xs text-white/30">
          Free to join · Find artists by style and location
        </p>

        {/* Portfolio */}
        <h2 className="mt-14 text-xl font-bold text-white">Recent work</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {artist.portfolio.map((img, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover opacity-60"
              />
              {img.placeholder && (
                <span className="absolute inset-x-0 bottom-0 bg-black/80 px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Placeholder — awaiting artist photos
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Secondary CTA */}
        <a
          href={ctaUrl}
          className="mt-10 block rounded-lg border border-white/20 px-6 py-3 text-center text-base font-semibold text-white/90 hover:border-white/40"
        >
          View {artist.name.split(' ')[0]}&apos;s full portfolio
        </a>

        <p className="mt-12 text-center text-xs text-white/25">
          Tatulogue — the social platform built for tattoo culture. No AI content. Real art, real
          artists.
        </p>
      </div>
    </main>
  );
}
