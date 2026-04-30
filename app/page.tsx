'use client';

import { useState } from 'react';

const APP_MOCKUP = 'https://framerusercontent.com/images/fcIVSg0e215jRipcqwjLYbZOfcA.png';
const PHONE_SCREENS = 'https://framerusercontent.com/images/zXziPdtIkEnEfcZqYGFYcb5D5A.png';
const LOGO = 'https://framerusercontent.com/images/D6IXxFkDfcfBTQR8M4VqbRaUY0.svg';
const TATTOO_1 = 'https://framerusercontent.com/images/sEyNls7rhlZwJbrVx9oTRQY22E.jpg';
const TATTOO_2 = 'https://framerusercontent.com/images/UIBpEIGYTIoqVMsj8NQFluhdsjE.jpg';
const TATTOO_3 = 'https://framerusercontent.com/images/uGBGnhNvMWidBsmaKcaCVRlOZnQ.jpg';
const TATTOO_4 = 'https://framerusercontent.com/images/3Al1aqTt98M7Kb6eGR4OAg.jpg';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  'Washington D.C.','Other (not USA)',
];

export default function Home() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', state: '', city: '', accountType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to Supabase waitlist table
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-white text-[#11100e] overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[#cdcdd4]/40">
        <img src={LOGO} alt="Tatūlogue" className="h-7 w-auto" />
        <a
          href="#waitlist"
          className="text-sm font-semibold px-5 py-2.5 rounded-full bg-[#11100e] text-white hover:bg-[#41403e] transition-colors"
        >
          Sign up for updates
        </a>
      </nav>

      {/* ── COMING SOON TICKER ── */}
      <div className="bg-[#11100e] text-[#f1f1f9] py-2.5 overflow-hidden">
        <div className="flex gap-12 whitespace-nowrap text-xs font-semibold tracking-widest uppercase animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="flex-shrink-0">Coming Soon &nbsp;·&nbsp; Coming Soon &nbsp;·&nbsp; Coming Soon</span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 text-[#11100e]">
            Getting a tattoo is{' '}
            <span className="text-[#d87137]">exciting!</span>
          </h1>
          <p className="text-2xl text-[#525354] font-light mb-3">But&hellip;</p>
          <p className="text-xl sm:text-2xl text-[#41403e] max-w-2xl mx-auto leading-relaxed">
            The process of finding the right artist can be&hellip;{' '}
            <span className="text-[#11100e] font-semibold">challenging.</span>
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <a
              href="#waitlist"
              className="px-8 py-4 rounded-full bg-[#11100e] text-white hover:bg-[#41403e] font-semibold transition-colors"
            >
              Join the waitlist
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full border-2 border-[#11100e] text-[#11100e] hover:bg-[#f1f1f9] font-semibold transition-colors"
            >
              Learn more
            </a>
          </div>
        </div>

        {/* Hero mockup */}
        <div className="mt-16 max-w-lg mx-auto">
          <img
            src={APP_MOCKUP}
            alt="Tatūlogue app"
            className="w-full rounded-2xl shadow-xl shadow-[#11100e]/10"
          />
        </div>
      </section>

      {/* ── PROBLEM CARDS ── */}
      <section id="how-it-works" className="py-20 px-6 bg-[#f1f1f9]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Artists */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#cdcdd4]/30">
            <div className="w-10 h-10 rounded-full bg-[#d87137]/15 flex items-center justify-center mb-4 text-xl">🎨</div>
            <h2 className="text-2xl font-bold mb-3 text-[#11100e]">The challenge for tattoo artists&hellip;</h2>
            <p className="text-[#525354] leading-relaxed">
              Tattoo artists face a lot of challenges when it comes to getting new customers in the
              door. Having to market themselves non-stop, battling with mega influencers on social
              media — sports, politics, brands, tech companies, podcasts&hellip; you name it. And
              without a massive following you&apos;re stuck in a never-ending cycle of trying to get
              your artwork seen.
            </p>
          </div>

          {/* Canvases */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#cdcdd4]/30">
            <div className="w-10 h-10 rounded-full bg-[#2ba4ac]/15 flex items-center justify-center mb-4 text-xl">✨</div>
            <h2 className="text-2xl font-bold mb-3 text-[#11100e]">The challenge for canvases&hellip;</h2>
            <p className="text-[#525354] leading-relaxed">
              Shopping for an artist is anything but easy. You find something you want tattooed — the
              next step is finding an artist who specializes in that style. Online searches, social
              media, groups, recommendations from friends&hellip; there is no easy way to find artists
              by style that can help bring your vision to reality.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-black mb-6 text-[#11100e]">
            Your tattoo journey should be{' '}
            <span className="text-[#d87137]">MUCH easier.</span>
          </h2>
          <p className="text-xl text-[#525354] leading-relaxed">
            THAT is why we are creating <span className="font-bold text-[#11100e]">Tatūlogue.</span>
          </p>
        </div>
      </section>

      {/* ── PROFILE TYPES ── */}
      <section className="py-20 px-6 bg-[#11100e]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-4 text-[#f1f1f9]">
            Built for everyone in the tattoo world
          </h2>
          <p className="text-center text-[#cdcdd4] mb-14">Two types of accounts. One platform.</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Artist */}
            <div className="group rounded-2xl overflow-hidden">
              <div className="relative h-72 overflow-hidden rounded-2xl">
                <img src={TATTOO_1} alt="Tattoo artist" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100e] via-[#11100e]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#d87137] text-white text-xs font-bold tracking-widest uppercase mb-2">
                    Artist
                  </span>
                  <h3 className="text-xl font-bold text-white">Tattoo Artists</h3>
                  <p className="text-[#cdcdd4] text-sm mt-1">Licensed tattoo professionals. Showcase your portfolio and connect with your ideal clients.</p>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="group rounded-2xl overflow-hidden">
              <div className="relative h-72 overflow-hidden rounded-2xl">
                <img src={TATTOO_2} alt="Tattoo enthusiast" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11100e] via-[#11100e]/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#2ba4ac] text-white text-xs font-bold tracking-widest uppercase mb-2">
                    Canvas
                  </span>
                  <h3 className="text-xl font-bold text-white">Canvas</h3>
                  <p className="text-[#cdcdd4] text-sm mt-1">Clients &amp; tattoo enthusiasts. Discover artists by style and bring your vision to life.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 bg-[#f1f1f9]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-center mb-3 text-[#11100e]">Discover the possibilities</h2>
          <p className="text-center text-[#525354] mb-14">&hellip;and this is just the beginning.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🔍', title: 'Find by style', desc: 'Search artists by style — traditional, neo-trad, realism, blackwork, watercolor, and more.', color: '#d87137' },
              { icon: '📸', title: 'Share your vision', desc: "Upload references and describe your idea so artists know exactly what you're looking for.", color: '#2ba4ac' },
              { icon: '📍', title: 'The right place', desc: 'Browse verified artists in your area or find the one worth traveling to.', color: '#d87137' },
              { icon: '🤝', title: 'The right artist', desc: "Match with artists whose style aligns with your vision, not just who's closest.", color: '#2ba4ac' },
              { icon: '🗓️', title: 'Priority booking', desc: 'Early access to artist calendars. Secure your spot before they fill up.', color: '#d87137' },
              { icon: '🏅', title: 'Verified artists', desc: 'Licensed professionals with verified portfolios. No bots, no fakes.', color: '#2ba4ac' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-[#cdcdd4]/30 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg mb-3" style={{ backgroundColor: f.color + '20' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-[#11100e] mb-1.5">{f.title}</h3>
                <p className="text-[#525354] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* App screens */}
          <div className="mt-16">
            <img src={PHONE_SCREENS} alt="Tatūlogue app screens" className="w-full max-w-3xl mx-auto rounded-2xl shadow-lg" />
          </div>
        </div>
      </section>

      {/* ── PHOTO STRIP ── */}
      <section className="py-10 overflow-hidden bg-white">
        <div className="flex gap-4">
          {[TATTOO_1, TATTOO_2, TATTOO_3, TATTOO_4, TATTOO_1, TATTOO_2].map((src, i) => (
            <div key={i} className="flex-shrink-0 w-44 h-60 rounded-xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* ── WAITLIST FORM ── */}
      <section id="waitlist" className="py-24 px-6 bg-[#11100e]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-black text-[#f1f1f9] mb-3">Join the waitlist</h2>
            <p className="text-[#cdcdd4]">Get project updates, newsletters, and early app access.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-[#2ba4ac]/40 bg-[#2ba4ac]/10 p-10 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-bold text-lg text-[#f1f1f9]">You&apos;re on the list!</p>
              <p className="text-[#cdcdd4] text-sm mt-1">We&apos;ll reach out when we&apos;re ready for you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text" name="firstName" required
                    value={form.firstName} onChange={handleChange}
                    placeholder="David"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30"
                  />
                </div>
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">Last Name</label>
                  <input
                    type="text" name="lastName"
                    value={form.lastName} onChange={handleChange}
                    placeholder="Smyth"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[#cdcdd4] text-sm mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email" name="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="so.many.tattoos@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30"
                />
              </div>

              {/* State + City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">
                    State <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="state" required
                    value={form.state} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e1d1b] border border-white/15 focus:border-[#d87137] focus:outline-none text-white"
                  >
                    <option value="" disabled>Select…</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">City</label>
                  <input
                    type="text" name="city"
                    value={form.city} onChange={handleChange}
                    placeholder="e.g. Miami Beach"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30"
                  />
                </div>
              </div>

              {/* Account type */}
              <div>
                <label className="block text-[#cdcdd4] text-sm mb-1.5">
                  Which account type are you most interested in? <span className="text-red-400">*</span>
                </label>
                <select
                  name="accountType" required
                  value={form.accountType} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1e1d1b] border border-white/15 focus:border-[#d87137] focus:outline-none text-white"
                >
                  <option value="" disabled>Select…</option>
                  <option value="artist">Tattoo Artist (I&apos;m a licensed tattoo artist)</option>
                  <option value="canvas">Canvas (I&apos;m a potential client or tattoo enthusiast)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#d87137] hover:bg-[#c5632a] text-white font-bold text-base transition-colors disabled:opacity-60 mt-2"
              >
                {loading ? 'Submitting…' : 'Notify me'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#cdcdd4]/30 py-8 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="Tatūlogue" className="h-5 w-auto opacity-60" />
            <span className="text-[#525354] text-sm">&copy; 2026 Tatūlogue, LLC</span>
          </div>
          <div className="flex gap-6 text-sm text-[#525354]">
            <a href="/privacy" className="hover:text-[#11100e] transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-[#11100e] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
