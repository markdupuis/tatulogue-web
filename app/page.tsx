'use client';

import React, { useState, useEffect } from 'react';

// ── Image assets (all from Framer site CDN) ────────────────────────────
const LOGO_MARK  = 'https://framerusercontent.com/images/D6IXxFkDfcfBTQR8M4VqbRaUY0.svg';
const LOGO_FULL  = 'https://framerusercontent.com/images/54MolB0VMgxbv5bs6n0OFkQ22E.svg';
const HERO_BG    = 'https://framerusercontent.com/images/fneUhgBGjjyj8F05LKRYwVsbIUA.jpg';
const PHONE_HAND = 'https://framerusercontent.com/images/fcIVSg0e215jRipcqwjLYbZOfcA.png';
const APP_SCREEN = 'https://framerusercontent.com/images/ZShB2lNRKQMhirR9sHqWbis3qY.png';

// Profile avatars
const AVATAR_ARTIST  = 'https://framerusercontent.com/images/sEyNls7rhlZwJbrVx9oTRQY22E.jpg';
const AVATAR_CANVAS  = 'https://framerusercontent.com/images/AIPEoaRA3LTU7FLdlA9S4Q82a8.jpg';

// Challenge section backgrounds
const BG_ARTISTS = 'https://framerusercontent.com/images/fJ6rVSkHjqG1Xts0gyq1moE.jpg';
const BG_CANVAS  = 'https://framerusercontent.com/images/bwcTaAoNQFk4nVQDpINMEMH8Ws.jpg';

// Image strip — row 1 (scrolls left) and row 2 (scrolls right)
const STRIP_ROW1 = [
  'https://framerusercontent.com/images/bqxdbuUYcelfrEEUN1m4H7k2eao.jpg',
  'https://framerusercontent.com/images/naJqBaqWEqD4dvt31QRwI16TY.jpg',
  'https://framerusercontent.com/images/6NkZ4PJlYYhZwgQWFAyHm4zg5Y.jpg',
  'https://framerusercontent.com/images/1papIZPU17IEb9DhDF2NPqF5p0c.jpg',
  'https://framerusercontent.com/images/3hwXFXYGbRFNCDuHTPmQW4USJTU.jpg',
  'https://framerusercontent.com/images/y2blrGHxIlYpaQRjwii0booNx8E.jpg',
  'https://framerusercontent.com/images/6bhTmWSoZ6LvSyS0p8KNoU3VtM.jpg',
  'https://framerusercontent.com/images/BmoWA1YFWs0TfjKlpnQLgVCN3g.jpg',
  'https://framerusercontent.com/images/F83rA6EwkEVEcWjoxDBPEXl2Pg.jpg',
];
const STRIP_ROW2 = [
  'https://framerusercontent.com/images/O3JDOcHAWlZRDY8e7HwhAWtinBY.jpg',
  'https://framerusercontent.com/images/EZhohVfld2BVDCIxMwQahQ0THjs.jpg',
  'https://framerusercontent.com/images/Skms9tmQEthH4t4G3SD62zCIPs.jpg',
  'https://framerusercontent.com/images/7YmMIKzvUplNygF0m9cMNnI.jpg',
  'https://framerusercontent.com/images/Ncx1lfllvdmeaDXC53VGd4aEk.jpg',
  'https://framerusercontent.com/images/jHawArCcdIJN68HZlOHYCQvSq8.jpg',
  'https://framerusercontent.com/images/9rG3z18mo1zdHFdssesFKPiME.jpg',
  'https://framerusercontent.com/images/JxyOZI9LaJ5QWgWglQZGSXPMwg.jpg',
  'https://framerusercontent.com/images/mQOXklElANNe9aC9N0NiaKGq5v8.jpg',
];

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
    // TODO: wire to Supabase waitlist table
    await new Promise((r) => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── HERO — full-screen video + centered logo ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6">
        {/* Background video — place hero.mp4 in /public to activate */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_BG}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/65" />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 z-10">
          <div />
          <a
            href="#waitlist"
            className="text-sm font-medium px-5 py-2 rounded-full border border-white/60 text-white hover:bg-white hover:text-black transition-colors"
          >
            Sign up for updates
          </a>
        </nav>

        {/* Centered wordmark */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <img src="/logo.svg" alt="TATŪLOGUE" className="w-96 sm:w-[460px] object-contain" />
          <a
            href="#waitlist"
            className="mt-2 px-8 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black font-medium transition-colors"
          >
            Sign up for updates
          </a>
        </div>

        {/* Scroll indicator */}
        <a href="#story" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors">
          <span className="text-xs tracking-widest">learn more</span>
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M8 0v16M1 9l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      {/* ── STORY — black section ── */}
      <section id="story" className="bg-black py-24 px-8 max-w-2xl mx-auto">
        <h2 data-animate="" className="text-3xl sm:text-4xl font-black mb-8 leading-tight">
          Getting a tattoo is exciting!
        </h2>
        <p data-animate="" style={{ transitionDelay: '0.1s' }} className="text-2xl text-white/60 mb-8">But&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;</p>
        <p data-animate="" style={{ transitionDelay: '0.22s' }} className="text-2xl sm:text-3xl font-bold leading-snug">
          The process of finding the right artist can be&hellip; challenging.
        </p>
      </section>

      {/* ── CHALLENGE: ARTISTS ── */}
      <section
        className="relative py-20 px-8"
        style={{
          backgroundImage: `url(${BG_ARTISTS})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-lg mx-auto">
          <h2 data-animate="" className="text-2xl sm:text-3xl font-black mb-10 text-center">
            The challenge for tattoo artists&hellip;
          </h2>
          <div className="space-y-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"/>
                  </svg>
                ),
                text: 'Tattoo artists face a lot of challenges when it comes to getting new customers in the door.',
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"/>
                  </svg>
                ),
                text: "Having to market themselves non-stop, battling with mega influencers on social media from sports, to politics, to brands, tech companies, podcasts… you name it.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
                  </svg>
                ),
                text: "And without a massive following you're stuck in a never-ending cycle of trying to get your artwork seen.",
              },
            ].map((item, i) => (
              <div key={i} data-animate="" style={{ transitionDelay: `${i * 0.13}s` }} className="flex gap-4 items-start">
                <div className="flex-shrink-0 text-white/60 mt-0.5">{item.icon}</div>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHALLENGE: CANVAS ── */}
      <section
        className="relative py-20 px-8"
        style={{
          backgroundImage: `url(${BG_CANVAS})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative max-w-lg mx-auto">
          <h2 data-animate="" className="text-2xl sm:text-3xl font-black mb-10 text-center">
            The challenge for enthusiasts&hellip;
          </h2>
          <div className="space-y-8">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                ),
                text: "Shopping for an artist is anything but easy. You find something that you want to get tattooed. The next step is finding an artist that specializes in that style. Where do you start?",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                  </svg>
                ),
                text: "You do a search online for shops near you and start looking at random artists' portfolios. You go to social media and start looking for tattoo artists. You ask in groups and pages for recommendations. You ask for recommendations from friends and family.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/>
                  </svg>
                ),
                text: "There is no easy way to find tattoo artists by style that can help bring your vision to reality.",
              },
            ].map((item, i) => (
              <div key={i} data-animate="" style={{ transitionDelay: `${i * 0.13}s` }} className="flex gap-4 items-start">
                <div className="flex-shrink-0 text-white/60 mt-0.5">{item.icon}</div>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ── */}
      <section className="bg-black py-24 px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 data-animate="" className="text-3xl sm:text-4xl font-black mb-4">
            Your tattoo journey should be MUCH easier.
          </h2>
          <svg data-animate="fade" style={{ transitionDelay: '0.2s' }} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 56 56" className="mx-auto mt-4 text-white" fill="currentColor">
            <path d="M21.871 15.566c.281 0 .422-.164.469-.421c.797-3.75.75-3.891 4.664-4.688c.281-.047.445-.21.445-.469c0-.281-.164-.445-.445-.492c-3.914-.797-3.867-.937-4.664-4.664c-.047-.258-.188-.445-.469-.445s-.422.187-.492.445c-.774 3.727-.727 3.867-4.664 4.664c-.258.047-.445.211-.445.492c0 .258.187.422.445.469c3.937.797 3.89.938 4.664 4.688c.07.257.21.421.492.421m19.36 8.274c.328 0 .515-.211.562-.516c.82-4.453.844-4.734 5.554-5.555c.305-.046.54-.257.54-.585c0-.329-.235-.516-.54-.586c-4.71-.797-4.734-1.078-5.554-5.532c-.047-.304-.234-.539-.562-.539s-.54.235-.586.54c-.797 4.453-.82 4.734-5.532 5.53c-.328.071-.539.258-.539.587s.211.539.54.585c4.71.82 4.734 1.102 5.53 5.555c.047.305.258.516.587.516M9.027 30.566c.329 0 .516-.234.563-.539c.82-4.453.844-4.734 5.555-5.53c.304-.071.539-.259.539-.587s-.235-.539-.54-.586c-4.71-.82-4.734-1.101-5.554-5.555c-.047-.304-.235-.515-.563-.515s-.539.21-.585.515c-.82 4.454-.82 4.735-5.532 5.555c-.328.047-.539.258-.539.586s.211.516.54.586c4.71.797 4.71 1.078 5.53 5.531c.047.305.258.54.586.54m40.008 20.04c1.008 1.007 2.695 1.007 3.61 0c.984-1.032.984-2.626 0-3.61l-22.266-22.36c-.984-.984-2.672-.984-3.61 0c-.984 1.032-.96 2.65 0 3.634ZM35.418 34.504l-6.867-6.89c-.422-.423-.54-.868-.14-1.29c.398-.375.843-.281 1.288.164l6.89 6.89ZM20.16 50.98c.422 0 .727-.305.774-.75c.773-6.258 1.078-6.422 7.43-7.454c.515-.093.82-.328.82-.797c0-.445-.305-.726-.727-.796c-6.398-1.22-6.75-1.196-7.523-7.453c-.047-.446-.352-.75-.774-.75c-.445 0-.75.304-.797.726c-.82 6.352-1.054 6.563-7.523 7.477c-.422.047-.727.351-.727.797c0 .445.305.703.727.796c6.469 1.242 6.68 1.242 7.523 7.5a.774.774 0 0 0 .797.703"/>
          </svg>
        </div>
      </section>

      {/* ── WHY TATULOGUE — gradient section ── */}
      <section
        className="relative py-20 px-8 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d1520 0%, #0d2a30 30%, #1a2a15 55%, #2a1a08 80%, #1a0808 100%)',
        }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p data-animate="" className="text-white/70 text-lg mb-6">And THAT is why we are creating</p>
            <h2 data-animate="" style={{ transitionDelay: '0.12s' }} className="text-5xl sm:text-6xl font-black text-white mb-8 tracking-tight">
              Tatūlogue.
            </h2>
            <p data-animate="" style={{ transitionDelay: '0.24s' }} className="text-white/70 text-lg leading-relaxed">
              The place to find your tattoo inspiration and find the perfect artist to do that
              tattoo. And share and enjoy tattoo culture in an InkSocial environment.
            </p>
          </div>
          <div className="flex justify-center">
            <img
              data-animate="slide-right"
              src="/phone.png"
              alt="Tatūlogue app"
              className="w-56 sm:w-72 drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* ── DEDICATED ACCOUNTS — white section ── */}
      <section className="bg-white text-[#11100e] py-20 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#41403e]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
            </svg>
            <h2 data-animate="" className="text-2xl sm:text-3xl font-black">Dedicated accounts</h2>
          </div>
          <p data-animate="" style={{ transitionDelay: '0.1s' }} className="text-[#525354] mb-12 leading-relaxed">
            At launch, Tatūlogue will feature two profile types. One for licensed Tattoo
            Artists, and one for clients and everyone else called an &ldquo;Enthusiast&rdquo; profile.
          </p>

          <div className="flex gap-16 justify-center">
            {/* Artist avatar */}
            <div data-animate="" style={{ transitionDelay: '0.2s' }} className="flex flex-col items-center gap-3">
              <div
                className="w-32 h-32 rounded-full overflow-hidden"
                style={{ boxShadow: '0 0 0 4px #2ba4ac, 0 0 24px #2ba4ac60' }}
              >
                <img src={AVATAR_ARTIST} alt="Tattoo Artist" className="w-full h-full object-cover" />
              </div>
              <p className="font-bold text-[#2ba4ac]">Tattoo Artists</p>
              <p className="text-[#525354] text-sm text-center">Licensed tattoo artists</p>
            </div>

            {/* Enthusiast avatar */}
            <div data-animate="" style={{ transitionDelay: '0.35s' }} className="flex flex-col items-center gap-3">
              <div
                className="w-32 h-32 rounded-full overflow-hidden"
                style={{ boxShadow: '0 0 0 4px #d87137, 0 0 24px #d8713760' }}
              >
                <img src={AVATAR_CANVAS} alt="Enthusiast" className="w-full h-full object-cover object-top" />
              </div>
              <p className="font-bold text-[#d87137]">Enthusiast</p>
              <p className="text-[#525354] text-sm text-center">Clients &amp; tattoo enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCOVER — white section ── */}
      <section className="bg-white text-[#11100e] py-16 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#41403e]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"/>
            </svg>
            <h2 data-animate="" className="text-2xl sm:text-3xl font-black">Discover the possibilities</h2>
          </div>
          <div className="space-y-4 text-[#525354] leading-relaxed">
            <p data-animate="" style={{ transitionDelay: '0.1s' }}>
              Tatūlogue will feature a feed where you can browse recently uploaded art, tattoos,
              and inspiration from tattoo artists and other enthusiasts.
            </p>
            <p>
              We will also have a search which will feature a &ldquo;Browse All&rdquo; for looking for
              inspiration and &ldquo;Looking to Book&rdquo; which allows you to find local artists by style.
            </p>
          </div>
        </div>
      </section>

      {/* ── ANIMATED IMAGE STRIP ── */}
      <section className="bg-white py-6 overflow-hidden">
        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden mb-3">
          <div className="flex gap-3 animate-scroll-left" style={{ width: 'max-content' }}>
            {[...STRIP_ROW1, ...STRIP_ROW1].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div className="flex gap-3 animate-scroll-right" style={{ width: 'max-content' }}>
            {[...STRIP_ROW2, ...STRIP_ROW2].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-40 h-28 rounded-lg overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHARE YOUR VISION ── */}
      <section className="bg-white text-[#11100e] py-16 px-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-[#41403e]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/>
            </svg>
            <h2 data-animate="" className="text-2xl sm:text-3xl font-black">Share your vision</h2>
          </div>
          <p data-animate="" style={{ transitionDelay: '0.12s' }} className="text-[#525354] leading-relaxed">
            The app will also feature community forums we are calling &ldquo;Articles&rdquo; of the
            Tatūlogue where tattoo artists and enthusiasts can find more ways to connect,
            share art and tattoos, and provide helpful tips and other information.
          </p>
        </div>
      </section>

      {/* ── WAITLIST FORM ── */}
      <section id="waitlist" className="bg-[#11100e] py-24 px-8">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 data-animate="" className="text-3xl sm:text-4xl font-black text-[#f1f1f9] mb-3">Join the waitlist</h2>
            <p data-animate="" style={{ transitionDelay: '0.12s' }} className="text-[#cdcdd4]">Get project updates, newsletters, and early app access.</p>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-[#2ba4ac]/40 bg-[#2ba4ac]/10 p-10 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-bold text-lg text-[#f1f1f9]">You&apos;re on the list!</p>
              <p className="text-[#cdcdd4] text-sm mt-1">We&apos;ll reach out when we&apos;re ready for you.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">First Name <span className="text-red-400">*</span></label>
                  <input type="text" name="firstName" required value={form.firstName} onChange={handleChange}
                    placeholder="David"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30" />
                </div>
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">Last Name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                    placeholder="Smyth"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30" />
                </div>
              </div>

              <div>
                <label className="block text-[#cdcdd4] text-sm mb-1.5">Email <span className="text-red-400">*</span></label>
                <input type="email" name="email" required value={form.email} onChange={handleChange}
                  placeholder="so.many.tattoos@gmail.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">State <span className="text-red-400">*</span></label>
                  <select name="state" required value={form.state} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-[#1e1d1b] border border-white/15 focus:border-[#d87137] focus:outline-none text-white">
                    <option value="" disabled>Select…</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[#cdcdd4] text-sm mb-1.5">City</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange}
                    placeholder="e.g. Miami Beach"
                    className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 focus:border-[#d87137] focus:outline-none text-white placeholder-white/30" />
                </div>
              </div>

              <div>
                <label className="block text-[#cdcdd4] text-sm mb-1.5">
                  Which account type are you most interested in? <span className="text-red-400">*</span>
                </label>
                <select name="accountType" required value={form.accountType} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#1e1d1b] border border-white/15 focus:border-[#d87137] focus:outline-none text-white">
                  <option value="" disabled>Select…</option>
                  <option value="artist">Tattoo Artist (I&apos;m a licensed tattoo artist)</option>
                  <option value="enthusiast">Enthusiast (I&apos;m a potential client or tattoo enthusiast)</option>
                </select>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-4 rounded-xl bg-[#333] hover:bg-[#444] text-white font-bold transition-colors disabled:opacity-60 mt-2">
                {loading ? 'Submitting…' : 'Notify me'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-black border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO_MARK} alt="Tatūlogue" className="h-5 w-auto opacity-60" />
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
