import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ARTISTS, buildCtaUrl, getSocialIcon } from '../../../lib/artists';

export function generateStaticParams() {
  return Object.keys(ARTISTS).map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const artist = ARTISTS[params.slug];
  if (!artist) return {};
  const title = `${artist.name} — ${artist.shopName} | Tatulogue`;
  const description = `${artist.tagline}. ${artist.specialties.join(', ')}. Follow ${artist.name} on TATULOGUE.`;
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
  const firstName = artist.name.split(' ')[0];
  const fullAddress = `${artist.address.street}, ${artist.address.city}, ${artist.address.state} ${artist.address.zip}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${artist.mapEmbedQuery}&output=embed`;

  return (
    <main className="min-h-screen bg-[#07070d] text-white overflow-x-hidden antialiased font-body">
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,600;0,800;0,900;1,800&family=Space+Grotesk:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Archivo', system-ui, sans-serif; }
        .font-body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .tl-surface { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
        .tl-text-grad-blue {
          background: linear-gradient(135deg, #4E4376, #2B5876);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .tl-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .tl-card { transition: transform .4s cubic-bezier(.2,.8,.2,1), border-color .4s; }
        .tl-card:hover { transform: translateY(-8px); border-color: rgba(78,67,118,0.55); }
        .tl-card-img { transition: transform .7s cubic-bezier(.2,.8,.2,1); }
        .tl-card:hover .tl-card-img { transform: scale(1.06); }
        .tl-btn-energy { background: linear-gradient(135deg, #F12711, #F5AF19); transition: filter .35s ease; }
        .tl-btn-energy:hover { filter: brightness(1.08) saturate(1.1); }
        .tl-btn-blue { background: linear-gradient(135deg, #2B5876, #4E4376); transition: filter .35s ease; }
        .tl-btn-blue:hover { filter: brightness(1.12); }
        ::selection { background: #4E4376; color: #fff; }
        a:focus-visible, button:focus-visible { outline: 2px solid #F5AF19; outline-offset: 2px; }
      `}</style>

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="backdrop-blur-xl bg-[#07070d]/60 border-b border-white/[0.08]">
          <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <a href="/" className="font-display font-black tracking-[-0.04em] text-xl sm:text-2xl">TATULOGUE</a>
            <div className="hidden md:flex items-center gap-9 text-sm text-white/60">
              <a href="/blog" className="hover:text-white transition-colors">Articles</a>
              <a href="/investors" className="hover:text-white transition-colors">Investors</a>
              <a href="/store" className="hover:text-white transition-colors">Store</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <a
              href={ctaUrl}
              className="tl-btn-energy rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_30px_-6px_rgba(241,39,17,0.7)]"
            >
              Join Tatulogue
            </a>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden tl-grain">
        <div
          className="absolute -bottom-20 -left-20 w-[34rem] h-[34rem] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'rgba(43,88,118,0.35)' }}
        />
        <div
          className="absolute top-10 right-0 w-[26rem] h-[26rem] rounded-full blur-[150px] pointer-events-none"
          style={{ background: 'rgba(78,67,118,0.3)' }}
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-36 pb-16 sm:pt-44 sm:pb-24">
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-14">
            {/* Photo — leads, seen first */}
            <div className="shrink-0 mx-auto lg:mx-0">
              <div
                className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden border border-white/10"
                style={{ boxShadow: '0 0 60px -12px rgba(43,88,118,0.55)' }}
              >
                <img
                  src={artist.heroImage}
                  alt={artist.heroImageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text — offset to the right of / below the photo */}
            <div className="min-w-0">
              <p className="tl-text-grad-blue text-xs sm:text-sm tracking-[0.35em] font-medium mb-6">
                {artist.type === 'industry' ? 'INDUSTRY SPOTLIGHT' : 'ARTIST SPOTLIGHT'}
              </p>
              <h1 className="font-display font-black leading-[0.92] tracking-[-0.035em] text-5xl sm:text-7xl max-w-4xl">
                {artist.name}
              </h1>
              <p className="mt-6 max-w-xl text-base sm:text-lg text-white/65 leading-relaxed">
                {artist.tagline} · {artist.shopName} · @{artist.instagramHandle}
              </p>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {artist.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href={ctaUrl}
                  className="group tl-btn-blue rounded-full text-white px-7 py-3.5 font-semibold shadow-[0_0_40px_-10px_rgba(43,88,118,0.9)]"
                >
                  {artist.ctaLabel}{' '}
                  <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BIO ── */}
      <section className="relative max-w-4xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="space-y-7 text-lg sm:text-xl text-white/70 leading-relaxed">
          {artist.bio.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="font-display font-bold text-2xl sm:text-3xl tracking-[-0.02em] text-white">
            For the <span className="tl-text-grad-blue">Artists.</span>
          </p>
        </div>
      </section>

      {/* ── CONTACT & LOCATION ── */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-20 sm:pb-24">
        <p className="tl-text-grad-blue text-xs tracking-[0.3em] mb-4">FIND {firstName.toUpperCase()}</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-[-0.03em] mb-12">
          Location &amp; contact
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact details */}
          <div className="tl-surface rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Shop name */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Shop</p>
              <p className="text-lg font-semibold">{artist.shopName}</p>
            </div>

            {/* Address */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Address</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors leading-relaxed"
              >
                {artist.address.street}<br />
                {artist.address.city}, {artist.address.state} {artist.address.zip}
              </a>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Phone</p>
              <a
                href={`tel:${artist.phone.replace(/[^+\d]/g, '')}`}
                className="text-white/70 hover:text-white transition-colors"
              >
                {artist.phone}
              </a>
            </div>

            {/* Website */}
            {artist.website && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Website</p>
                <a
                  href={artist.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors break-all"
                >
                  {artist.website.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}

            {/* Email */}
            {artist.email && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Email</p>
                <a
                  href={`mailto:${artist.email}`}
                  className="text-white/70 hover:text-white transition-colors break-all"
                >
                  {artist.email}
                </a>
              </div>
            )}

            {/* Hours */}
            {artist.hours && (
              <div>
                <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Hours</p>
                <p className="text-white/70">{artist.hours}</p>
              </div>
            )}

            {/* Social media */}
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Social</p>
              <div className="flex flex-wrap gap-3">
                {artist.socials.map((s) => (
                  <a
                    key={s.url}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                      aria-hidden="true"
                    >
                      <path d={getSocialIcon(s.platform)} />
                    </svg>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="tl-surface rounded-2xl overflow-hidden min-h-[320px] lg:min-h-0">
            <iframe
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '320px', filter: 'invert(0.9) hue-rotate(180deg) saturate(0.3) brightness(0.7)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${artist.shopName}`}
            />
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <p className="tl-text-grad-blue text-xs tracking-[0.3em] mb-4">RECENT WORK</p>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-[-0.03em] mb-12">
          {firstName}&apos;s portfolio
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {artist.portfolio.map((img, i) => (
            <div key={i} className="tl-card tl-surface relative aspect-square overflow-hidden rounded-2xl">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="tl-card-img h-full w-full object-cover opacity-70"
              />
              {img.placeholder && (
                <span className="absolute inset-x-0 bottom-0 bg-black/80 px-2 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#F5AF19]">
                  Placeholder — awaiting artist photos
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="mt-16 tl-surface rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden tl-grain">
          <h3 className="font-display font-extrabold text-3xl sm:text-4xl tracking-[-0.03em]">
            Follow <span className="tl-text-grad-blue">{firstName}</span> on TATULOGUE
          </h3>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            Find artists by style and location. Alternative social media for People Over Profit —
            made for tattooers and tattoo culture.
          </p>
          <a
            href={ctaUrl}
            className="tl-btn-energy inline-block mt-8 rounded-full px-8 py-4 font-bold text-white shadow-[0_0_30px_-6px_rgba(241,39,17,0.7)]"
          >
            {artist.ctaLabel}
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <a href="/" className="font-display font-black tracking-[-0.04em] text-2xl">TATULOGUE</a>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <a href="/blog" className="hover:text-white transition-colors">Articles</a>
              <a href="/investors" className="hover:text-white transition-colors">Investors</a>
              <a href="/store" className="hover:text-white transition-colors">Store</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            </nav>
          </div>
          <p className="mt-10 text-xs text-white/30">
            © 2026 Tatulogue. Tattoo culture, education, and the artists shaping it.
          </p>
        </div>
      </footer>
    </main>
  );
}
