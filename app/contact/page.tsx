import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact | Tatulogue',
  description:
    'Get in touch with Tatulogue. Reach the team at TATULOGUE, LLC for support, account help, press, and legal or privacy questions.',
};

export default function ContactPage() {
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
              <Link href="/contact" className="text-white transition-colors">Contact</Link>
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
        <h1 className="text-4xl font-black mb-2">Contact Us</h1>
        <p className="text-white/40 text-sm mb-12">TATULOGUE, LLC | State of Utah</p>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          <p>
            We&apos;d love to hear from you. Whether you&apos;re an artist with a question about your
            profile, an enthusiast who needs a hand, or you&apos;re reaching out about press or a
            partnership, the fastest way to get a response is by email. We read every message and
            aim to reply within a couple of business days.
          </p>

          <Section title="Email Us">
            <p>
              For general questions, support, and account help, email us at{' '}
              <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">
                charlie@tatulogue.com
              </a>
              . This is the best address for anything related to your account, the waitlist, or
              using the platform.
            </p>
          </Section>

          <Section title="Other Contacts">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong className="text-white/80">Support &amp; Accounts:</strong>{' '}
                <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">
                  charlie@tatulogue.com
                </a>
              </li>
              <li>
                <strong className="text-white/80">Legal &amp; Privacy:</strong>{' '}
                <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">
                  legal@tatulogue.com
                </a>
              </li>
              <li>
                <strong className="text-white/80">Copyright / DMCA:</strong>{' '}
                <a href="mailto:DMCA@tatulogue.com" className="text-violet-400 hover:text-violet-300">
                  DMCA@tatulogue.com
                </a>
              </li>
            </ul>
          </Section>

          <Section title="Mailing Address">
            <address className="not-italic space-y-1">
              <p className="font-semibold text-white/80">TATULOGUE, LLC</p>
              <p>1233 Nayon Dr, Layton, Utah 84040</p>
              <p>United States</p>
            </address>
          </Section>

          <Section title="Early Access">
            <p>
              Not a question, just want in? Join the{' '}
              <Link href="/#early-access" className="text-violet-400 hover:text-violet-300">
                waitlist on our home page
              </Link>
              {' '}to get project updates, newsletters, and early access to the app when it launches.
            </p>
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
