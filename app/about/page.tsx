import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Tatulogue',
  description:
    'Tatulogue is a platform that connects tattoo artists and enthusiasts — discover artists by style, explore portfolios, and learn through The Tatulogue Journal.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Back to Tatulogue
        </Link>
        <span className="text-white/30 text-xs">TATULOGUE, LLC</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2">About Tatulogue</h1>
        <p className="text-white/40 text-sm mb-12">TATULOGUE, LLC | State of Utah</p>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          <Section title="What Tatulogue Is">
            <p>
              Tatulogue is a platform built to connect tattoo artists with the people who want
              their work. It is part discovery engine, part portfolio home, and part community —
              a single place where you can browse fresh artwork, explore tattoo styles, study an
              artist&apos;s body of work, and find the right person to bring your idea to life. Artists
              get a dedicated space to showcase their craft and reach new clients; enthusiasts get
              a structured, style-first way to discover artists instead of guessing.
            </p>
          </Section>

          <Section title="Why We Exist">
            <p>
              Getting a tattoo is exciting. Finding the right artist for it usually is not. Today
              most people start with a screenshot of a design they love, then fall down a rabbit
              hole of Instagram hashtags, random shop pages, group recommendations, and word of
              mouth — with no reliable way to filter by the specific style they actually want.
              Instagram was never built to match a client&apos;s vision to an artist&apos;s specialty, and
              talented artists without a massive following stay invisible no matter how good their
              work is.
            </p>
            <p>
              Tatulogue exists to fix that gap. By organizing artists and their work around style
              and location, we make it possible to search the way people actually think — &ldquo;I want
              this kind of tattoo, who near me does it best?&rdquo; — instead of scrolling endlessly and
              hoping. The result is a better experience on both sides of the chair: clients find
              artists who genuinely fit their vision, and artists get discovered on the strength of
              their work rather than their follower count.
            </p>
          </Section>

          <Section title="Who It&apos;s For">
            <p>
              Tatulogue serves two communities. Licensed tattoo artists use it to build a portfolio,
              share new pieces, and connect with clients who are specifically looking for their
              style. Enthusiasts — clients planning their next piece and anyone who simply loves
              tattoo culture — use it to find inspiration, follow artists, and discover where to
              book. Both groups share the same feed and forums, so the platform stays a living,
              social space rather than a static directory.
            </p>
          </Section>

          <Section title="The Tatulogue Journal">
            <p>
              Alongside the platform, we publish{' '}
              <Link href="/blog" className="text-violet-400 hover:text-violet-300">
                The Tatulogue Journal
              </Link>
              {' '}— our editorial home for in-depth tattoo education and culture. The Journal covers
              the things people actually need before and after they sit down: honest style guides,
              placement and aging advice, day-by-day aftercare and healing breakdowns, artist
              spotlights, and the trends shaping the industry. It is written to help first-timers
              walk in prepared and to give seasoned collectors something worth reading. If you want
              to understand a style before you commit to it for life, that is where to start.
            </p>
          </Section>

          <Section title="Who&apos;s Behind It">
            <p>
              Tatulogue is built and operated by TATULOGUE, LLC, a company organized in the State of
              Utah. We are building the platform we wished existed when we went looking for our own
              artists. To learn more, head back to the{' '}
              <Link href="/" className="text-violet-400 hover:text-violet-300">
                home page
              </Link>
              {' '}or reach out through our{' '}
              <Link href="/contact" className="text-violet-400 hover:text-violet-300">
                contact page
              </Link>
              .
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
