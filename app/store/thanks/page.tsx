import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Placed | Tatulogue',
  description: 'Your Tatulogue merch order has been placed.',
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white antialiased font-body">
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Space+Grotesk:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Archivo', system-ui, sans-serif; }
        .font-body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .tl-text-grad-blue {
          background: linear-gradient(135deg, #4E4376, #2B5876);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .tl-btn-energy { background: linear-gradient(135deg, #F12711, #F5AF19); transition: filter .35s ease; }
        .tl-btn-energy:hover { filter: brightness(1.08) saturate(1.1); }
        a:focus-visible { outline: 2px solid #F5AF19; outline-offset: 2px; }
      `}</style>

      <header className="fixed top-0 inset-x-0 z-50">
        <div className="backdrop-blur-xl bg-[#07070d]/60 border-b border-white/[0.08]">
          <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <a href="/" className="font-display font-black tracking-[-0.04em] text-xl sm:text-2xl">TATULOGUE</a>
            <div className="hidden md:flex items-center gap-9 text-sm text-white/60">
              <a href="/blog" className="hover:text-white transition-colors">Articles</a>
              <a href="/artists" className="hover:text-white transition-colors">Artists</a>
              <a href="/store" className="hover:text-white transition-colors">Store</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div
          className="absolute -bottom-20 -left-20 w-[34rem] h-[34rem] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(43,88,118,0.45), transparent 70%)' }}
          aria-hidden
        />
        <div
          className="absolute top-10 right-0 w-[26rem] h-[26rem] rounded-full blur-[150px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(241,39,17,0.18), transparent 70%)' }}
          aria-hidden
        />
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 w-full py-28">
          <p className="tl-text-grad-blue text-xs sm:text-sm tracking-[0.35em] font-medium mb-6">STORE</p>
          <h1 className="font-display font-black leading-[0.92] tracking-[-0.035em] text-5xl sm:text-7xl max-w-4xl">
            Order placed 🤘
          </h1>
          <p className="mt-7 max-w-xl text-base sm:text-lg text-white/60 leading-relaxed">
            Check your email for the receipt — tracking comes when it ships.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="/store"
              className="tl-btn-energy rounded-full px-7 py-3.5 font-semibold text-white shadow-[0_0_40px_-10px_rgba(241,39,17,0.8)]"
            >
              Back to the store
            </a>
            <a
              href="/"
              className="rounded-full border border-white/20 hover:border-[#F5AF19] hover:text-[#F5AF19] hover:bg-white/5 px-7 py-3.5 font-medium transition-colors"
            >
              Tatulogue home
            </a>
          </div>
        </div>
      </section>

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
          <p className="mt-10 text-xs text-white/30">© 2026 Tatulogue. Tattoo culture, education, and the artists shaping it.</p>
        </div>
      </footer>
    </main>
  );
}
