import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Tatulogue',
  description:
    'Tatulogue is a social platform that connects clients and enthusiasts with their local tattoo artists — find a tattooer by style and location, in one touch.',
};

const BLUE_GRADIENT = 'linear-gradient(135deg, #2B5876, #4E4376)';
const FIRE_GRADIENT = 'linear-gradient(135deg, #F12711, #F5AF19)';

const FEATURES = [
  {
    name: 'Home Feed',
    detail: 'A familiar feed of work from the artists and enthusiasts you follow.',
  },
  {
    name: 'For You',
    detail: 'A discovery feed that prioritizes nearby artists, so good work gets found.',
  },
  {
    name: 'Bangers',
    detail: 'Short-form video built for tattoos — not sketch comedy to game an algorithm.',
  },
  {
    name: 'Articles',
    detail:
      'A community forum organized by Topic — Best Practices, Tutorials, Guest Spots — with exclusive Topics for verified artists.',
  },
  {
    name: 'Search',
    detail:
      'The standout: one-touch search for nearby artists by the style you want, plus advanced filters.',
  },
];

const TEAM = [
  {
    name: 'Charlie Padilla',
    role: 'Founder',
    img: '/images/team-charlie.jpg',
    focus: 'Strategy · Marketing · Product Direction · Partnerships',
    credentials: 'Ex-Pinterest, Ex-Reddit, Ex-AdRoll. Marketing & business consulting, sales.',
  },
  {
    name: 'Eric Marshall',
    role: 'Co-Founder',
    img: '/images/team-eric.jpg',
    focus: 'Creative Strategy & Design · Operations',
    credentials: 'Tattoo-industry veteran. CEO of SecondSkin Tattoo Aftercare.',
  },
  {
    name: 'Mark Dupuis',
    role: 'Co-Founder',
    img: '/images/team-mark.jpg',
    focus: 'Head of Product',
    credentials: 'SaaS founder, Director of Product, founder & CEO of multiple companies.',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Back to Tatulogue
        </Link>
        <span className="text-white/30 text-xs">TATULOGUE, LLC</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-4 bg-clip-text text-transparent"
          style={{ backgroundImage: BLUE_GRADIENT }}
        >
          A catalog for tattoos
        </p>
        <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] mb-5">
          There&apos;s an app for every industry. Somehow not one for{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: BLUE_GRADIENT }}>
            finding a tattoo artist.
          </span>
        </h1>
        <p className="text-white/40 text-sm">TATULOGUE, LLC | State of Utah</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-12">
        <div className="space-y-12 text-white/70 leading-relaxed text-[15px]">
          <Section title="The problem">
            <p>
              You can hail a car, book a barber, or order dinner in two taps. But finding a tattoo
              artist who actually does the style you want, near where you live? You&apos;re still
              digging through social media like you&apos;re shouting into the void. The maddening
              part is that the right tattooer might have been a few blocks away the whole time — you
              just had no way to find them.
            </p>
          </Section>

          <Section title="The algorithm turned on artists">
            <p>
              Instagram changed how tattooers showed their work, and for a while it was great. Then
              the algorithm turned on them. Chronological feeds are gone. Now artists get pushed to
              perform sketch comedy and chase whatever trend is spiking just to stay visible.
            </p>
            <p>
              Most of them don&apos;t want any of that. They&apos;ve got plenty to do between drawing
              and tattooing. They shouldn&apos;t need a social-media manager and a film crew just to
              get seen.
            </p>
          </Section>

          <Section title="The fix">
            <p>
              Tatulogue is a social platform built for one job: connecting clients and enthusiasts
              with their local tattooers. Think a catalog for tattoos — with the artists at the heart
              of it. Not an afterthought, not content fuel for an algorithm. The whole point.
            </p>
          </Section>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-4">
        <h2 className="text-lg font-bold text-white mb-6">What it is</h2>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div key={feature.name} className="bg-[#07070d] p-6">
              <h3
                className="text-sm font-black uppercase tracking-wider mb-2 bg-clip-text text-transparent"
                style={{ backgroundImage: BLUE_GRADIENT }}
              >
                {feature.name}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">{feature.detail}</p>
            </div>
          ))}
          <div className="flex items-center bg-[#07070d] p-6">
            <p className="text-white/40 text-sm leading-relaxed">
              And a roadmap of more to come — this is the foundation, not the finish line.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-6 sm:p-8">
          <p className="text-white/70 text-[15px] leading-relaxed">
            Tatulogue is built by people from inside the tattoo world and from product and marketing
            at scale — so it&apos;s credible to the artists who use it and built to actually grow.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <p
          className="text-xs font-bold tracking-[0.2em] uppercase mb-3 bg-clip-text text-transparent"
          style={{ backgroundImage: BLUE_GRADIENT }}
        >
          Who&apos;s building it
        </p>
        <h2 className="text-3xl sm:text-4xl font-black mb-10">The Team</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-5"
            >
              <img
                src={member.img}
                alt={`Portrait of ${member.name}, ${member.role} of Tatulogue`}
                width={400}
                height={400}
                className="w-full aspect-square rounded-xl object-cover grayscale mb-5"
              />
              <h3 className="text-lg font-black text-white">{member.name}</h3>
              <p
                className="text-xs font-bold uppercase tracking-wider mt-1 mb-3 bg-clip-text text-transparent inline-block"
                style={{ backgroundImage: BLUE_GRADIENT }}
              >
                {member.role}
              </p>
              <p className="text-white/60 text-sm font-medium leading-snug mb-3">{member.focus}</p>
              <p className="text-white/40 text-sm leading-relaxed">{member.credentials}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">
            Built for artists. Made for finding them.
          </h2>
          <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md mx-auto">
            Tatulogue is built and operated by TATULOGUE, LLC, organized in the State of Utah. Want
            in, or want to talk?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
            style={{ backgroundImage: FIRE_GRADIENT }}
          >
            Get in touch →
          </Link>
        </div>

        <p className="text-white/25 text-xs pt-10 mt-10 border-t border-white/8 text-center">
          &copy; 2026 TATULOGUE, LLC. All rights reserved.
        </p>
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
