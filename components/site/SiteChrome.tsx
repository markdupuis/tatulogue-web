import Link from 'next/link';

export const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,600;0,800;0,900;1,800&family=Space+Grotesk:wght@300;400;500;700&display=swap';

export const SITE_STYLES = `
  .font-display { font-family: 'Archivo', system-ui, sans-serif; }
  .font-body { font-family: 'Space Grotesk', system-ui, sans-serif; }
  .tl-btn-energy { background: linear-gradient(135deg, #F12711, #F5AF19); transition: filter .35s ease; }
  .tl-btn-energy:hover { filter: brightness(1.08) saturate(1.1); }
`;

export function SiteHeader() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="backdrop-blur-xl bg-[#07070d]/60 border-b border-white/[0.08]">
        <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-display font-black tracking-[-0.04em] text-xl sm:text-2xl">TATULOGUE</Link>
          <div className="hidden md:flex items-center gap-9 text-sm text-white/60">
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/investors" className="hover:text-white transition-colors">Investors</Link>
            <Link href="/store" className="hover:text-white transition-colors">Store</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
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
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <Link href="/" className="font-display font-black tracking-[-0.04em] text-2xl">TATULOGUE</Link>
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
            <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
            <Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link>
            <Link href="/investors" className="hover:text-white transition-colors">Investors</Link>
            <Link href="/store" className="hover:text-white transition-colors">Store</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>
        </div>
        <p className="mt-10 text-xs text-white/30">
          &copy; 2026 Tatulogue. Tattoo culture, education, and the artists shaping it.
        </p>
      </div>
    </footer>
  );
}
