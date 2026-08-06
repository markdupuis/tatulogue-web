import type { Metadata } from 'next';
import { ARTISTS } from '../../lib/artists';

export const metadata: Metadata = {
  title: 'Artists — Tatulogue',
  description: 'Discover tattoo artists on Tatulogue. Real work from real artists — no AI content, ever.',
  openGraph: {
    title: 'Artists — Tatulogue',
    description: 'Discover tattoo artists on Tatulogue. Real work from real artists — no AI content, ever.',
    url: 'https://tatulogue.com/artists',
    siteName: 'Tatulogue',
  },
};

export default function ArtistsPage() {
  const artists = Object.values(ARTISTS);

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
              <a href="/artists" className="text-white transition-colors">Artists</a>
              <a href="/store" className="hover:text-white transition-colors">Store</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <a
              href="https://app.tatulogue.com"
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
          <p className="tl-text-grad-blue text-xs sm:text-sm tracking-[0.35em] font-medium mb-6">
            TATULOGUE ARTISTS
          </p>
          <h1 className="font-display font-black leading-[0.92] tracking-[-0.035em] text-5xl sm:text-7xl max-w-4xl">
            Real artists. <span className="tl-text-grad-blue">Real work.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base sm:text-lg text-white/65 leading-relaxed">
            Discover tattoo artists on TATULOGUE. No AI content, ever.
          </p>
        </div>
      </section>

      {/* ── ARTIST GRID ── */}
      <section className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <a
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="tl-card tl-surface rounded-2xl overflow-hidden group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={artist.portfolio[0]?.src || artist.ogImage}
                  alt={artist.name}
                  className="h-full w-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                />
              </div>
              <div className="p-6">
                <h2 className="font-display font-bold text-xl tracking-[-0.02em]">{artist.name}</h2>
                <p className="text-white/50 text-sm mt-1">{artist.shopName}</p>
                <p className="text-white/40 text-sm mt-3 line-clamp-2">{artist.tagline}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {artist.specialties.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <span className="inline-block mt-5 text-sm font-medium tl-text-grad-blue group-hover:opacity-80 transition-opacity">
                  View profile &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <a href="/" className="font-display font-black tracking-[-0.04em] text-2xl">TATULOGUE</a>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <a href="/blog" className="hover:text-white transition-colors">Articles</a>
              <a href="/artists" className="hover:text-white transition-colors">Artists</a>
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
