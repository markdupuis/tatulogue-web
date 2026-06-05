import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact | Tatulogue',
  description:
    'Get in touch with Tatulogue. Reach the team at TATULOGUE, LLC for support, account help, press, and legal or privacy questions.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Back to Tatulogue
        </Link>
        <span className="text-white/30 text-xs">TATULOGUE, LLC</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
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
              <Link href="/#waitlist" className="text-violet-400 hover:text-violet-300">
                waitlist on our home page
              </Link>
              {' '}to get project updates, newsletters, and early access to the app when it launches.
            </p>
          </Section>

          <p className="text-white/25 text-xs pt-8 border-t border-white/8">
            &copy; 2026 TATULOGUE, LLC. All rights reserved.
          </p>
        </div>
      </div>
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
