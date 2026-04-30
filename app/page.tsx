'use client';

import { useState } from 'react';

const APP_MOCKUP = 'https://framerusercontent.com/images/fcIVSg0e215jRipcqwjLYbZOfcA.png';
const PHONE_SCREENS = 'https://framerusercontent.com/images/zXziPdtIkEnEfcZqYGFYcb5D5A.png';
const LOGO = 'https://framerusercontent.com/images/D6IXxFkDfcfBTQR8M4VqbRaUY0.svg';
const TATTOO_1 = 'https://framerusercontent.com/images/sEyNls7rhlZwJbrVx9oTRQY22E.jpg';
const TATTOO_2 = 'https://framerusercontent.com/images/UIBpEIGYTIoqVMsj8NQFluhdsjE.jpg';
const TATTOO_3 = 'https://framerusercontent.com/images/uGBGnhNvMWidBsmaKcaCVRlOZnQ.jpg';
const TATTOO_4 = 'https://framerusercontent.com/images/3Al1aqTt98M7Kb6eGR4OAg.jpg';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO: wire to Supabase waitlist table
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#07070d] text-white overflow-x-hidden">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#07070d]/80 border-b border-white/5">
        <img src={LOGO} alt="Tatūlogue" className="h-7 w-auto" />
        <a
          href="#waitlist"
          className="text-sm font-medium px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 transition-colors"
        >
          Sign up for updates
        </a>
      </nav>

      {/* HERO */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-700/20 blur-[120px]" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-widest uppercase">
            Coming Soon
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Getting a tattoo is{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              exciting!
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/60 font-light mb-4">But&hellip;</p>
          <p className="text-xl sm:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            The process of finding the right artist can be&hellip;{' '}
            <span className="text-white font-semibold">challenging.</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#waitlist"
              className="px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 font-semibold text-base transition-all hover:scale-105"
            >
              Join the waitlist
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full border border-white/20 hover:border-white/40 font-semibold text-base transition-all hover:bg-white/5"
            >
              Learn more
            </a>
          </div>
        </div>
        <div className="relative mt-16 max-w-xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07070d] z-10" />
          <img src={APP_MOCKUP} alt="Tatūlogue app" className="w-full rounded-2xl opacity-90 shadow-2xl shadow-violet-900/30" />
        </div>
      </section>

      {/* PROBLEM */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 hover:border-violet-500/30 transition-colors">
            <div className="text-3xl mb-4">🎨</div>
            <h2 className="text-2xl font-bold mb-3">The challenge for tattoo artists&hellip;</h2>
            <p className="text-white/60 leading-relaxed">
              Tattoo artists face a lot of challenges when it comes to getting new customers in the door.
              Having to market themselves non-stop, battling with mega influencers on social media from
              sports, to politics, to brands, tech companies, podcasts&hellip; you name it. And without
              a massive following you&apos;re stuck in a never-ending cycle of trying to get your artwork seen.
            </p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 hover:border-pink-500/30 transition-colors">
            <div className="text-3xl mb-4">✨</div>
            <h2 className="text-2xl font-bold mb-3">The challenge for canvases&hellip;</h2>
            <p className="text-white/60 leading-relaxed">
              Shopping for an artist is anything but easy. You find something you want tattooed — the next
              step is finding an artist who specializes in that style. Where do you start? Online searches,
              social media scrolling, asking in groups, getting recommendations from friends&hellip; there is
              no easy way to find artists by style that can help bring your vision to reality.
            </p>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-800/15 blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            Your tattoo journey should be{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              MUCH easier.
            </span>
          </h2>
          <p className="text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            THAT is why we are creating <span className="font-bold text-white">Tatūlogue.</span>
          </p>
        </div>
      </section>

      {/* PROFILE TYPES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-16">
            Built for everyone in the tattoo world
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="group rounded-3xl overflow-hidden border border-white/8 bg-gradient-to-br from-violet-900/20 to-transparent hover:border-violet-500/40 transition-all">
              <div className="relative h-64 overflow-hidden">
                <img src={TATTOO_1} alt="Tattoo artist at work" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 rounded-full bg-violet-600/80 text-xs font-semibold tracking-wide">ARTIST</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Tattoo Artists</h3>
                <p className="text-white/60">Licensed tattoo artists. Showcase your portfolio, connect with your ideal clients, and grow your business without fighting the algorithm.</p>
              </div>
            </div>
            <div className="group rounded-3xl overflow-hidden border border-white/8 bg-gradient-to-br from-pink-900/20 to-transparent hover:border-pink-500/40 transition-all">
              <div className="relative h-64 overflow-hidden">
                <img src={TATTOO_2} alt="Tattoo enthusiast" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="px-3 py-1 rounded-full bg-pink-600/80 text-xs font-semibold tracking-wide">CANVAS</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Canvas</h3>
                <p className="text-white/60">Clients &amp; tattoo enthusiasts. Discover artists by style, save inspiration, and connect with the right artist to bring your vision to life.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4">Discover the possibilities</h2>
          <p className="text-white/50 text-center mb-16 text-lg">&hellip;and this is just the beginning.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🔍', title: 'Find by style', desc: 'Search artists by tattoo style — traditional, neo-trad, realism, blackwork, watercolor, and more.' },
              { icon: '📸', title: 'Share your vision', desc: "Upload reference images and describe your idea so artists know exactly what you're looking for." },
              { icon: '📍', title: 'The right place', desc: 'Browse verified artists in your area or find the one worth traveling to.' },
              { icon: '🤝', title: 'The right artist', desc: "Match with artists whose style aligns with your vision, not just who's closest." },
              { icon: '🗓️', title: 'Priority booking', desc: 'Get early access to artist calendars and secure your spot before they fill up.' },
              { icon: '🏅', title: 'Verified artists', desc: 'Licensed professionals with verified portfolios. No bots, no fakes.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#07070d] via-transparent to-[#07070d] z-10 pointer-events-none" />
            <img src={PHONE_SCREENS} alt="Tatūlogue app screens" className="w-full max-w-3xl mx-auto rounded-2xl opacity-80" />
          </div>
        </div>
      </section>

      {/* PHOTO STRIP */}
      <section className="py-12 overflow-hidden">
        <div className="flex gap-4">
          {[TATTOO_1, TATTOO_2, TATTOO_3, TATTOO_4, TATTOO_1, TATTOO_2].map((src, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-64 rounded-xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section id="waitlist" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-violet-700/20 blur-[120px]" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-violet-500/40 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-widest uppercase">
            Early Access
          </span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4">Join the waitlist</h2>
          <p className="text-white/60 mb-3">Get notified when we launch. Zero spam.</p>
          <div className="flex flex-col gap-2 text-sm text-white/40 mb-10">
            <span>✓ Project updates</span>
            <span>✓ Newsletters</span>
            <span>✓ Early app access</span>
          </div>
          {submitted ? (
            <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-bold text-lg">You&apos;re on the list!</p>
              <p className="text-white/50 text-sm mt-1">We&apos;ll reach out when we&apos;re ready.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-5 py-4 rounded-full bg-white/8 border border-white/15 focus:border-violet-500 focus:outline-none placeholder-white/30 text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-full bg-violet-600 hover:bg-violet-500 font-semibold transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {loading ? 'Joining…' : 'Notify me'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="Tatūlogue" className="h-5 w-auto opacity-70" />
            <span className="text-white/30 text-sm">&copy; 2026 Tatūlogue, LLC</span>
          </div>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="/privacy" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-white/70 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
