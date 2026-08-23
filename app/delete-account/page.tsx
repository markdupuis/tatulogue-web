import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Delete Your Account | Tatulogue',
  description: 'How to request deletion of your Tatulogue account and data.',
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white antialiased font-body">
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,600;0,800;0,900;1,800&family=Space+Grotesk:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Archivo', system-ui, sans-serif; }
        .font-body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .tl-btn-energy { background: linear-gradient(135deg, #F12711, #F5AF19); transition: filter .35s ease; }
        .tl-btn-energy:hover { filter: brightness(1.08) saturate(1.1); }
      `}</style>

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

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-4xl font-black mb-2">Delete Your Account</h1>
        <p className="text-white/40 text-sm mb-12">TATULOGUE, LLC</p>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          <Section title="Delete from within the app (fastest)">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Open Tatulogue and sign in.</li>
              <li>Go to your <strong className="text-white/80">Profile</strong> tab.</li>
              <li>Scroll to the bottom and select <strong className="text-white/80">Delete Account</strong>, then confirm.</li>
            </ol>
            <p>This permanently and immediately removes your account and profile data.</p>
          </Section>

          <Section title="Request deletion without the app">
            <p>
              Email <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a> from
              the email address on your account with the subject line &ldquo;Delete my account.&rdquo; We'll verify the request and
              delete your account within 30 days.
            </p>
          </Section>

          <Section title="What gets deleted">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white/80">Deleted immediately:</strong> profile information, posts, photos and videos, messages, and search history.</li>
              <li><strong className="text-white/80">Retained:</strong> records we're required to keep for legal, security, or fraud-prevention purposes (e.g. transaction records), for as long as the law requires.</li>
            </ul>
            <p>See our <Link href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link> for full detail on how we handle your data.</p>
          </Section>
        </div>
      </div>

      <footer className="border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <Link href="/" className="font-display font-black tracking-[-0.04em] text-2xl">TATULOGUE</Link>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <Link href="/blog" className="hover:text-white transition-colors">Articles</Link>
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
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
