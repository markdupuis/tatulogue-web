'use client';

import React, { useState, useEffect } from 'react';

// ── Image assets — all self-hosted in /public/images ──────────────────
const HERO_BG       = '/images/hero-poster.jpg';
const AVATAR_ARTIST = '/images/avatar-artist.jpg';
const AVATAR_CANVAS = '/images/avatar-enthusiast.jpg';
const BG_ARTISTS    = '/images/bg-artists.jpg';
const BG_CANVAS     = '/images/bg-enthusiasts.jpg';

// Marquee strip images — lightweight self-hosted JPGs.
const MARQUEE_IMAGES = [
  '/images/strip-1-2.jpg', '/images/strip-1-4.jpg', '/images/strip-1-6.jpg',
  '/images/strip-1-8.jpg', '/images/strip-1-9.jpg', '/images/strip-2-1.jpg',
  '/images/strip-2-3.jpg', '/images/strip-2-5.jpg', '/images/strip-2-7.jpg',
];

// Featured articles — hardcoded because this is a 'use client' component
// and cannot import lib/blog (which uses fs at build time).
const FEATURED_POSTS = [
  {
    slug: 'tattoo-aftercare-guide',
    category: 'Education',
    title: 'Tattoo Aftercare: The Complete Day-by-Day Healing Guide',
    excerpt: 'Exactly what to do hours 1 through week 4 — wraps, washing, scabbing, and when to actually worry.',
    image: '/images/strip-1-1.jpg',
    alt: 'Healing tattoo aftercare',
  },
  {
    slug: 'tattoo-styles-guide-2026',
    category: 'Education',
    title: 'The 10 Most Popular Tattoo Styles in 2026',
    excerpt: 'From blackwork to fine-line micro-realism — what people are actually asking for this year, and why.',
    image: '/images/strip-1-3.jpg',
    alt: 'Bold traditional tattoo style',
  },
  {
    slug: 'fine-line-tattoos-complete-guide',
    category: 'Education',
    title: 'Fine Line Tattoos: Everything You Need to Know',
    excerpt: 'How thin lines really age, who they suit, and the questions to ask before you book a single-needle piece.',
    image: '/images/strip-1-5.jpg',
    alt: 'Fine line tattoo detail',
  },
  {
    slug: 'how-much-do-tattoos-cost',
    category: 'Education',
    title: 'How Much Do Tattoos Cost? A Real 2026 Pricing Breakdown',
    excerpt: 'Hourly vs. flat rates, shop minimums, deposits, and tipping — the numbers nobody posts on their menu.',
    image: '/images/strip-1-7.jpg',
    alt: 'Tattoo artist at work',
  },
  {
    slug: 'tattoo-pain-chart',
    category: 'Education',
    title: 'The Tattoo Pain Chart: Most & Least Painful Spots',
    excerpt: 'Ribs, sternum, ankles, inner arm — ranked honestly, plus what actually makes a session hurt more.',
    image: '/images/strip-2-2.jpg',
    alt: 'Tattoo on ribcage',
  },
  {
    slug: 'how-tattoos-age',
    category: 'Education',
    title: 'How Tattoos Age: What Actually Happens Over Time',
    excerpt: 'Why some pieces blow out and others hold for decades — placement, ink density, sun, and skin.',
    image: '/images/strip-2-4.jpg',
    alt: 'Aged tattoo close up',
  },
];

const TOPICS = ['Education', 'Styles', 'Aftercare', 'Artist Spotlights', 'Trends', 'History'];

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

const GRAD_BLUE   = 'linear-gradient(135deg, #2B5876, #4E4376)';
const GRAD_ENERGY = 'linear-gradient(135deg, #F12711, #F5AF19)';

export default function Home() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', state: '', city: '', accountType: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  useEffect(() => {
    const els = document.querySelectorAll('[data-animate]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        'https://wvndcypeecniuzrnwnmx.supabase.co/rest/v1/waitlist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bmRjeXBlZWNuaXV6cm53bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDQ5NjcsImV4cCI6MjA3OTE4MDk2N30.ssbErAc6AMBL5UcZtd3q8YKRkFdS0qdfNmm7bcoHrUo',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bmRjeXBlZWNuaXV6cm53bm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MDQ5NjcsImV4cCI6MjA3OTE4MDk2N30.ssbErAc6AMBL5UcZtd3q8YKRkFdS0qdfNmm7bcoHrUo',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            first_name:   form.firstName,
            last_name:    form.lastName,
            email:        form.email,
            state:        form.state,
            city:         form.city,
            account_type: form.accountType,
          }),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Waitlist submit failed:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#07070d] text-white overflow-x-hidden antialiased font-body">

      {/* ── Brand fonts + utility classes ported from the approved mockup ── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,300;0,600;0,800;0,900;1,800&family=Space+Grotesk:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .font-display { font-family: 'Archivo', system-ui, sans-serif; }
        .font-body { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .tl-surface { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); }
        .tl-text-grad-blue {
          background: linear-gradient(135deg, #4E4376, #2B5876);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .tl-grain::after {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .5;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
        }
        .tl-card { transition: transform .4s cubic-bezier(.2,.8,.2,1), border-color .4s; }
        .tl-card:hover { transform: translateY(-8px); border-color: rgba(78,67,118,0.55); }
        .tl-card-img { transition: transform .7s cubic-bezier(.2,.8,.2,1); }
        .tl-card:hover .tl-card-img { transform: scale(1.06); }
        .tl-btn-energy { background: linear-gradient(135deg, #F12711, #F5AF19); transition: filter .35s ease; }
        .tl-btn-energy:hover { filter: brightness(1.08) saturate(1.1); }
        .tl-btn-blue { background: linear-gradient(135deg, #2B5876, #4E4376); transition: filter .35s ease; }
        .tl-btn-blue:hover { filter: brightness(1.12); }
        .tl-pill { transition: border-color .35s ease, color .35s ease, background-color .35s ease; }
        .tl-pill:hover { border-color: rgba(241,39,17,0.6); color: #F5AF19; }
        .tl-topic-active {
          border-color: rgba(78,67,118,0.7); color: #fff;
          background: linear-gradient(135deg, rgba(43,88,118,0.5), rgba(78,67,118,0.5));
        }
        @keyframes tl-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .tl-marquee { animation: tl-marquee 48s linear infinite; }
        .tl-marquee-wrap:hover .tl-marquee { animation-play-state: paused; }
        ::selection { background: #4E4376; color: #fff; }
        a:focus-visible, button:focus-visible { outline: 2px solid #F5AF19; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) {
          .tl-marquee { animation: none; }
        }
      `}</style>

      {/* ── NAV ── */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="backdrop-blur-xl bg-[#07070d]/60 border-b border-white/[0.08]">
          <nav className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
            <a href="/" className="font-display font-black tracking-[-0.04em] text-xl sm:text-2xl">TATULOGUE</a>
            <div className="hidden md:flex items-center gap-9 text-sm text-white/60">
              <a href="/blog" className="hover:text-white transition-colors">Articles</a>
              <a href="/investors" className="hover:text-white transition-colors">Investors</a>
              <a href="/store" className="hover:text-white transition-colors">Store</a>
              <a href="/about" className="hover:text-white transition-colors">About</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <a
              href="#early-access"
              className="tl-btn-energy rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_30px_-6px_rgba(241,39,17,0.7)]"
            >
              Get early access
            </a>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex items-end overflow-hidden tl-grain">
        <img
          src={HERO_BG}
          alt="Close-up of a fine-line tattoo in progress under studio light"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-[#07070d]/70 to-[#07070d]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07070d]/80 via-transparent to-transparent" />
        <div
          className="absolute -bottom-20 -left-20 w-[34rem] h-[34rem] rounded-full blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(43,88,118,0.45), transparent 70%)' }}
        />
        <div
          className="absolute top-10 right-0 w-[26rem] h-[26rem] rounded-full blur-[150px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(241,39,17,0.18), transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pb-20 sm:pb-28 pt-32 w-full">
          <p data-animate="" className="tl-text-grad-blue text-xs sm:text-sm tracking-[0.35em] font-medium mb-6">TATULOGUE</p>
          <h1 data-animate="" style={{ transitionDelay: '0.08s' }} className="font-display font-black leading-[0.92] tracking-[-0.035em] text-5xl sm:text-7xl lg:text-8xl max-w-5xl">
            Alternative social media for <span className="tl-text-grad-blue">People Over Profit</span>.
          </h1>
          <p data-animate="" style={{ transitionDelay: '0.16s' }} className="mt-7 max-w-xl text-base sm:text-lg text-white/65 leading-relaxed">
            Made for tattooers and tattoo culture.
          </p>
          <div data-animate="" style={{ transitionDelay: '0.24s' }} className="mt-9 flex flex-wrap items-center gap-4">
            <a href="#early-access" className="group tl-btn-blue rounded-full text-white px-7 py-3.5 font-semibold shadow-[0_0_40px_-10px_rgba(43,88,118,0.9)]">
              Get early access <span className="inline-block group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
            <a href="/blog" className="rounded-full border border-white/20 hover:border-[#F5AF19] hover:text-[#F5AF19] hover:bg-white/5 px-7 py-3.5 font-medium transition-colors">
              Browse articles
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 hidden sm:flex items-center gap-3 text-[11px] tracking-[0.25em] text-white/30">
          <span>SCROLL</span><span className="w-10 h-px bg-white/30" />
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section className="relative max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div data-animate="" className="space-y-7 text-lg sm:text-xl text-white/70 leading-relaxed">
          <p>
            There is no easy way to find a tattoo artist by style and location. And the social media
            landscape is in need of a mixup. We&apos;re setting out to do both by creating the first
            alternative social media platform with features designed for tattooers.
          </p>
          <p className="font-display font-bold text-2xl sm:text-3xl tracking-[-0.02em] text-white">
            With a rule of no AI content. <span className="tl-text-grad-blue">Protect the art, protect the artist.</span>
          </p>
          <p>
            Social media platforms today have become billion-dollar machines that cater only to
            investors. We believe in People over Profit — and that there&apos;s a better way for social
            media to function, by enhancing our lives and giving back to the community.
          </p>
          <p className="font-display font-bold text-2xl sm:text-3xl tracking-[-0.02em] text-white">
            So we have a commitment to give back <span className="tl-text-grad-blue">50% of all profits</span> back to the tattoo community.
          </p>
        </div>
      </section>

      {/* ── FEATURED ARTICLES ── */}
      <section id="journal" className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 sm:py-32">
        <div data-animate="" className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <p className="tl-text-grad-blue text-xs tracking-[0.3em] mb-4">ARTICLES</p>
            <h2 className="font-display font-extrabold text-4xl sm:text-5xl tracking-[-0.03em]">Featured articles</h2>
          </div>
          <p className="max-w-sm text-sm text-white/40 leading-relaxed">
            No fluff. Practical, well-researched writing on getting tattooed and the craft behind it.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_POSTS.map((post, i) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              data-animate=""
              style={{ transitionDelay: `${(i % 3) * 0.06}s` }}
              className="tl-card group tl-surface rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={post.image} alt={post.alt} loading="lazy" className="tl-card-img w-full h-full object-cover" />
                <span
                  className="absolute top-3 left-3 text-[10px] tracking-[0.2em] px-2.5 py-1 rounded-full font-semibold text-white"
                  style={{ background: GRAD_BLUE }}
                >
                  {post.category.toUpperCase()}
                </span>
              </div>
              <div className="p-6 flex flex-col gap-3 flex-1">
                <h3 className="font-display font-bold text-xl leading-tight tracking-[-0.01em] group-hover:text-[#F5AF19] transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── BROWSE BY TOPIC ── */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-20">
        <div data-animate="" className="tl-surface rounded-2xl px-6 sm:px-10 py-9">
          <div className="flex flex-col lg:flex-row lg:items-center gap-7 justify-between">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-[-0.02em] shrink-0">Browse by topic</h2>
            <div className="flex flex-wrap gap-3">
              {TOPICS.map((topic, i) => (
                <a
                  key={topic}
                  href="/blog"
                  className={
                    i === 0
                      ? 'tl-topic-active rounded-full border px-5 py-2.5 text-sm'
                      : 'tl-pill rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm'
                  }
                >
                  {topic}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMAGE MARQUEE ── */}
      <section className="py-10 sm:py-16">
        <div data-animate="" className="flex items-center justify-between max-w-7xl mx-auto px-5 sm:px-8 mb-8">
          <p className="tl-text-grad-blue text-xs tracking-[0.3em]">THE WORK</p>
          <p className="text-xs tracking-[0.3em] text-white/30">SHOT IN STUDIO</p>
        </div>
        <div className="tl-marquee-wrap relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[#07070d] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[#07070d] to-transparent pointer-events-none" />
          <div className="tl-marquee flex gap-5 w-max">
            {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                loading="lazy"
                className="h-56 sm:h-72 w-auto rounded-xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ARTISTS / ENTHUSIASTS SPLIT ── */}
      <section id="about" className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid gap-6 md:grid-cols-2">
        <div data-animate="" className="relative rounded-2xl overflow-hidden min-h-[320px] flex items-end group">
          <img src={BG_ARTISTS} alt="Tattoo artist working on a client" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-[#07070d]/40 to-transparent" />
          <div className="relative p-8">
            <p className="tl-text-grad-blue text-xs tracking-[0.3em] mb-3">FOR ARTISTS</p>
            <h3 className="font-display font-extrabold text-3xl tracking-[-0.02em] mb-2">Build your name.</h3>
            <p className="text-sm text-white/55 max-w-xs">Spotlights, technique deep-dives, and the business side most shops never talk about.</p>
          </div>
        </div>
        <div data-animate="" style={{ transitionDelay: '0.08s' }} className="relative rounded-2xl overflow-hidden min-h-[320px] flex items-end group">
          <img src={BG_CANVAS} alt="Person showing off their tattoos" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-[#07070d]/40 to-transparent" />
          <div className="relative p-8">
            <p className="text-xs tracking-[0.3em] text-[#F5AF19] mb-3">FOR ENTHUSIASTS</p>
            <h3 className="font-display font-extrabold text-3xl tracking-[-0.02em] mb-2">Get it right the first time.</h3>
            <p className="text-sm text-white/55 max-w-xs">Know what to ask, what to pay, and how to find an artist worth the wait.</p>
          </div>
        </div>
      </section>

      {/* ── EARLY ACCESS — waitlist form (secondary; hero CTAs link here) ── */}
      <section id="early-access" className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 sm:pb-32">
        <div data-animate="" className="relative tl-surface rounded-2xl overflow-hidden tl-grain px-6 sm:px-12 py-14 sm:py-20">
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] blur-[120px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(43,88,118,0.32), rgba(241,39,17,0.12) 55%, transparent 75%)' }}
          />
          <div className="relative max-w-xl mx-auto">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <img src={AVATAR_ARTIST} alt="Featured artist avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#07070d]" />
                <img src={AVATAR_CANVAS} alt="Featured reader avatar" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#07070d] -ml-5" />
                <span className="text-sm text-white/45">artists &amp; collectors already on the list</span>
              </div>
              <h2 className="font-display font-black text-3xl sm:text-5xl tracking-[-0.03em] leading-[0.95]">The articles are just the start.</h2>
              <p className="mt-5 text-white/55">
                Get early access to the full Tatulogue platform — profiles, bookings, and a feed built for the craft.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-[#2B5876]/50 bg-[#2B5876]/15 p-10 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-bold text-lg text-white">You&apos;re on the list!</p>
                <p className="text-white/55 text-sm mt-1">We&apos;ll reach out when we&apos;re ready for you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">First Name <span className="text-[#F12711]">*</span></label>
                    <input type="text" name="firstName" required value={form.firstName} onChange={handleChange}
                      placeholder="David"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-[#F5AF19] focus:outline-none text-white placeholder-white/30" />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">Last Name</label>
                    <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                      placeholder="Smyth"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-[#F5AF19] focus:outline-none text-white placeholder-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Email <span className="text-[#F12711]">*</span></label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange}
                    placeholder="so.many.tattoos@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-[#F5AF19] focus:outline-none text-white placeholder-white/30" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">State <span className="text-[#F12711]">*</span></label>
                    <select name="state" required value={form.state} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-[#13131c] border border-white/15 focus:border-[#F5AF19] focus:outline-none text-white">
                      <option value="" disabled>Select…</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">City</label>
                    <input type="text" name="city" value={form.city} onChange={handleChange}
                      placeholder="e.g. Miami Beach"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/15 focus:border-[#F5AF19] focus:outline-none text-white placeholder-white/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    Which account type are you most interested in? <span className="text-[#F12711]">*</span>
                  </label>
                  <select name="accountType" required value={form.accountType} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#13131c] border border-white/15 focus:border-[#F5AF19] focus:outline-none text-white">
                    <option value="" disabled>Select…</option>
                    <option value="artist">Tattoo Artist (I&apos;m a licensed tattoo artist)</option>
                    <option value="enthusiast">Enthusiast (I&apos;m a potential client or tattoo enthusiast)</option>
                  </select>
                </div>

                <button type="submit" disabled={loading}
                  className="tl-btn-energy w-full py-4 rounded-xl text-white font-bold transition disabled:opacity-60 mt-2 shadow-[0_0_30px_-8px_rgba(241,39,17,0.7)]">
                  {loading ? 'Submitting…' : 'Get early access'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer id="contact" className="border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <a href="/" className="font-display font-black tracking-[-0.04em] text-2xl">TATULOGUE</a>
            <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
              <a href="/blog" className="hover:text-white transition-colors">Articles</a>
              <a href="/investors" className="hover:text-white transition-colors">Investors</a>
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
