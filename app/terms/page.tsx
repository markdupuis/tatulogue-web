import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | Tatūlogue',
  description: 'Terms of Service for the Tatūlogue platform.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Back to Tatūlogue
        </Link>
        <span className="text-white/30 text-xs">Last updated: April 16, 2026</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
        <p className="text-white/40 text-sm mb-4">TATULOGUE, LLC | State of Utah</p>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 mb-12 text-sm text-yellow-200/70">
          PLEASE READ THESE TERMS CAREFULLY. By accessing or using the Tatūlogue platform, you agree to be legally bound by these Terms.
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you (&ldquo;User,&rdquo;
            &ldquo;Artist,&rdquo; or &ldquo;Enthusiast&rdquo;) and TATULOGUE, LLC (&ldquo;Tatūlogue,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
            They govern your access to and use of the Tatūlogue mobile application, website, and all related
            services (collectively, the &ldquo;Platform&rdquo;).
          </p>

          <Section title="1. Eligibility and Account Access">
            <SubSection title="1.1 Age Requirement">
              <p>The Platform is intended exclusively for users 18 years of age or older. We comply fully with COPPA and do not knowingly collect information from minors.</p>
            </SubSection>
            <SubSection title="1.2 Account Registration">
              <p>You agree to provide accurate information, maintain your account credentials confidentially, and accept responsibility for all activity under your account. Notify us immediately at <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a> of any unauthorized use.</p>
            </SubSection>
            <SubSection title="1.3 Artist Verification">
              <p>Verification is voluntary and does not constitute an endorsement. Users engage with artists at their own risk and are responsible for confirming licensing and bloodborne pathogen certifications.</p>
            </SubSection>
          </Section>

          <Section title="2. User Content and Intellectual Property">
            <SubSection title="2.1 Ownership">
              <p>You retain full ownership of all content you post to the Platform. Tatūlogue does not claim any ownership interest in your User Content.</p>
            </SubSection>
            <SubSection title="2.2 License to Tatūlogue">
              <p>By posting User Content, you grant Tatūlogue a limited, non-exclusive, royalty-free, worldwide license to display, distribute, and transmit your content solely within the Platform. This license terminates when you delete the content or close your account. We will not use your content in advertising without your express prior written consent.</p>
            </SubSection>
            <SubSection title="2.3 DMCA Policy">
              <p>Send copyright infringement notices to <a href="mailto:DMCA@tatulogue.com" className="text-violet-400 hover:text-violet-300">DMCA@tatulogue.com</a> with: (a) identification of the copyrighted work; (b) location of the infringing material; (c) your contact information; (d) a good faith belief statement; (e) a statement under penalty of perjury; and (f) your signature.</p>
            </SubSection>
          </Section>

          <Section title="3. Prohibited Conduct">
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Post unlawful, harmful, threatening, abusive, harassing, defamatory, or obscene content;</li>
              <li>Post content that sexualizes, exploits, endangers, or harms minors in any way;</li>
              <li>Impersonate any person or entity or misrepresent your affiliation;</li>
              <li>Transmit spam, unsolicited advertising, or promotional materials;</li>
              <li>Attempt to gain unauthorized access to the Platform or other user accounts;</li>
              <li>Use automated means (bots, scrapers, crawlers) without prior written consent;</li>
              <li>Harass, threaten, stalk, or intimidate other users;</li>
              <li>Violate any applicable law or regulation.</li>
            </ul>
          </Section>

          <Section title="4. Platform Nature and Tattoo Services Disclaimer">
            <p>Tatūlogue is a discovery platform. We do not provide tattooing services and are not a party to any agreement between users. We do not employ, endorse, or certify any artist.</p>
            <p>You are solely responsible for verifying artist licenses, BBP certifications, studio compliance, and all terms agreed with artists.</p>
            <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-wide text-white/40">
              ANY DISPUTE ARISING FROM SERVICES PERFORMED BY AN ARTIST DISCOVERED THROUGH THE PLATFORM IS SOLELY BETWEEN THE CLIENT AND THE ARTIST. TATŪLOGUE SHALL HAVE NO LIABILITY IN CONNECTION THEREWITH.
            </div>
          </Section>

          <Section title="5. Payments and Future Paid Features">
            <p>The Platform is currently offered free of charge. Tatūlogue reserves the right to introduce paid features at any time with reasonable advance notice. Continued use after such notice constitutes acceptance.</p>
          </Section>

          <Section title="6. Privacy">
            <p>Our <Link href="/privacy" className="text-violet-400 hover:text-violet-300">Privacy Policy</Link> is incorporated into these Terms by reference. By using the Platform, you consent to the collection and use of your information as described therein.</p>
          </Section>

          <Section title="7. Disclaimers of Warranties">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-wide text-white/40">
              THE PLATFORM IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY OF ANY KIND. TATŪLOGUE EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </div>
          </Section>

          <Section title="8. Limitation of Liability">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs uppercase tracking-wide text-white/40 space-y-2">
              <p>TATŪLOGUE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
              <p>IN NO EVENT SHALL TATŪLOGUE&apos;S TOTAL AGGREGATE LIABILITY EXCEED ONE HUNDRED UNITED STATES DOLLARS ($100.00).</p>
            </div>
          </Section>

          <Section title="9. Indemnification">
            <p>You agree to defend, indemnify, and hold harmless TATULOGUE, LLC and its members, officers, and employees from any claims, damages, or expenses (including attorneys&apos; fees) arising out of your violation of these Terms, your User Content, or any transactions between you and another user.</p>
          </Section>

          <Section title="10. Dispute Resolution; Binding Arbitration">
            <SubSection title="10.1 Informal Resolution">
              <p>Contact us at <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">legal@tatulogue.com</a> first. We will attempt to resolve disputes informally for 30 days before formal proceedings.</p>
            </SubSection>
            <SubSection title="10.2 Binding Arbitration">
              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-200/60">
                All disputes shall be resolved through final, binding arbitration administered by the American Arbitration Association (AAA) under its Consumer Arbitration Rules (www.adr.org). Arbitration shall be conducted in Utah or via telephonic/video conference.
              </div>
            </SubSection>
            <SubSection title="10.3 Class Action Waiver">
              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs uppercase tracking-wide text-white/40">
                BOTH PARTIES WAIVE THE RIGHT TO BRING CLAIMS AS A CLASS MEMBER AND WAIVE THE RIGHT TO A TRIAL BY JURY.
              </div>
            </SubSection>
            <SubSection title="10.4 Opt-Out Right">
              <p>You may opt out of binding arbitration within 30 days of first agreeing to these Terms by sending written notice to <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">legal@tatulogue.com</a> with your full name and account email.</p>
            </SubSection>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms are governed by the laws of the State of Utah. Disputes not subject to arbitration shall be resolved in state or federal courts located in Utah.</p>
          </Section>

          <Section title="12. Termination">
            <p>You may delete your account at any time via Platform settings or by contacting <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a>. Tatūlogue may suspend or terminate your account at any time for violations of these Terms or for any business reason.</p>
          </Section>

          <Section title="13. Modifications to Terms">
            <p>Material changes will be communicated via the Platform or email at least 14 days before the effective date. Continued use after the effective date constitutes acceptance.</p>
          </Section>

          <Section title="14. Contact Information">
            <address className="not-italic space-y-1">
              <p className="font-semibold text-white/80">TATULOGUE, LLC</p>
              <p>1233 Nayon Dr, Layton, Utah 84040</p>
              <p>Legal: <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">legal@tatulogue.com</a></p>
              <p>DMCA: <a href="mailto:DMCA@tatulogue.com" className="text-violet-400 hover:text-violet-300">DMCA@tatulogue.com</a></p>
              <p>Website: <a href="https://tatulogue.com" className="text-violet-400 hover:text-violet-300">www.tatulogue.com</a></p>
            </address>
          </Section>

          <p className="text-white/25 text-xs pt-8 border-t border-white/8">
            Effective as of April 16, 2026. &copy; 2026 TATULOGUE, LLC. All rights reserved.
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ml-4">
      <h3 className="font-semibold text-white/75 mb-1.5">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}
