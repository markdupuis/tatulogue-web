import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Child Safety Standards | Tatulogue',
  description: "Tatulogue's standards and policies against child sexual abuse and exploitation (CSAE).",
};

export default function ChildSafetyPage() {
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
        <h1 className="text-4xl font-black mb-2">Child Safety Standards</h1>
        <p className="text-white/40 text-sm mb-1">TATULOGUE, LLC | State of Utah</p>
        <p className="text-white/30 text-xs mb-4">Last updated: August 25, 2026</p>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-12 text-sm text-yellow-200/70">
          Tatulogue is an 18+ platform. We have zero tolerance for child sexual abuse and exploitation (CSAE) in any form.
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          <Section title="1. Age Requirement">
            <p>The Platform is intended exclusively for users 18 years of age or older. We do not knowingly collect personal information from anyone under 18, and we comply fully with the Children&apos;s Online Privacy Protection Act (COPPA).</p>
          </Section>

          <Section title="2. Zero Tolerance for CSAE">
            <p>Tatulogue strictly prohibits child sexual abuse and exploitation (CSAE) in any form, including, without limitation:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Content that sexualizes, exploits, endangers, or otherwise harms minors;</li>
              <li>Grooming, solicitation, or any attempt to contact or exploit minors through the Platform;</li>
              <li>Sharing, distributing, requesting, or possessing child sexual abuse material (CSAM);</li>
              <li>Any other conduct that endangers the safety or wellbeing of minors.</li>
            </ul>
          </Section>

          <Section title="3. Enforcement">
            <p>Any account or content found to violate these standards is removed immediately upon discovery, and the responsible account is permanently banned from the Platform. We cooperate fully with law enforcement and, where required by law, report violations to the National Center for Missing &amp; Exploited Children (NCMEC) and other appropriate authorities.</p>
          </Section>

          <Section title="4. Reporting">
            <p>If you encounter content or behavior on Tatulogue that violates these standards, report it immediately to <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a>. We review all reports promptly.</p>
          </Section>

          <Section title="5. Related Policies">
            <p>This page supplements our <Link href="/terms" className="text-violet-400 hover:text-violet-300">Terms of Service</Link> and <Link href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link>, which are incorporated by reference.</p>
          </Section>

          <Section title="6. Contact Information">
            <address className="not-italic space-y-1">
              <p className="font-semibold text-white/80">TATULOGUE, LLC</p>
              <p>1233 Nayon Dr, Layton, Utah 84040</p>
              <p>Safety &amp; Reports: <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a></p>
              <p>Website: <a href="https://tatulogue.com" className="text-violet-400 hover:text-violet-300">www.tatulogue.com</a></p>
            </address>
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
              <Link href="/child-safety" className="hover:text-white transition-colors">Child Safety</Link>
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
