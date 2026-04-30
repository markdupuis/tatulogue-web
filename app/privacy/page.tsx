import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tatūlogue',
  description: 'Privacy Policy for Tatūlogue — how we collect, use, and protect your information.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/70 hover:text-white text-sm transition-colors">
          ← Back to Tatūlogue
        </Link>
        <span className="text-white/30 text-xs">Last updated: April 16, 2026</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
        <p className="text-white/40 text-sm mb-12">TATULOGUE, LLC | State of Utah</p>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          <p>
            This Privacy Policy describes how TATULOGUE, LLC (&ldquo;Tatūlogue,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects,
            uses, stores, shares, and protects information about you when you access or use the Tatūlogue
            mobile application, website, or any related services (collectively, the &ldquo;Platform&rdquo;). By using
            the Platform, you consent to the practices described in this Privacy Policy.
          </p>

          <Section title="1. Information We Collect">
            <SubSection title="1.1 Information You Provide">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-white/80">Account Registration:</strong> Name, email address, username, password, and account type (Artist or Canvas/Enthusiast).</li>
                <li><strong className="text-white/80">Profile Information:</strong> Profile photo, bio, location, tattoo style preferences, social media handles, and portfolio images.</li>
                <li><strong className="text-white/80">User Content:</strong> Artwork, photographs, videos, design files, written descriptions, comments, messages, and other content you post.</li>
                <li><strong className="text-white/80">Communications:</strong> Name, email, and content of your messages when you contact us for support.</li>
                <li><strong className="text-white/80">Waitlist:</strong> Email address if you sign up for early access.</li>
              </ul>
            </SubSection>
            <SubSection title="1.2 Information Collected Automatically">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-white/80">Usage Data:</strong> Pages visited, features used, search queries, content viewed, and time spent on the Platform.</li>
                <li><strong className="text-white/80">Device Information:</strong> Device type, operating system, browser type, screen resolution, and unique device identifiers.</li>
                <li><strong className="text-white/80">Location:</strong> Approximate or precise location (with your permission) to show nearby artists.</li>
                <li><strong className="text-white/80">Log Data:</strong> IP address, access times, referring URLs, and crash reports.</li>
                <li><strong className="text-white/80">Cookies:</strong> Session cookies, local storage, and similar technologies to maintain sessions and analyze usage.</li>
              </ul>
            </SubSection>
            <SubSection title="1.3 Information from Third Parties">
              <p>If you connect a third-party account (e.g., Google, Apple) to sign in, we receive information consistent with your privacy settings on that service, which may include your name, email address, and profile photo.</p>
            </SubSection>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>Create and manage your account and provide Platform features;</li>
              <li>Connect tattoo artists with clients and enthusiasts;</li>
              <li>Personalize your experience and show relevant content and artists;</li>
              <li>Process and respond to your communications and support requests;</li>
              <li>Send service-related notifications (account confirmations, security alerts);</li>
              <li>Send marketing communications where you have opted in (opt out any time);</li>
              <li>Analyze usage trends and improve the Platform;</li>
              <li>Detect, investigate, and prevent fraudulent or prohibited activity;</li>
              <li>Comply with legal obligations and enforce our Terms of Service.</li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <SubSection title="3.1 Public Profile">
              <p>Your username, profile photo, bio, portfolio, location (city/region), and tattoo styles are visible to other users. Only share what you are comfortable making public.</p>
            </SubSection>
            <SubSection title="3.2 Service Providers">
              <p>We share information with trusted third-party providers (cloud hosting via Supabase, analytics, email delivery) who are contractually obligated to use your information only as directed by us.</p>
            </SubSection>
            <SubSection title="3.3 Legal Requirements">
              <p>We may disclose information when required by law, court order, or to protect the rights and safety of Tatūlogue or others.</p>
            </SubSection>
            <SubSection title="3.4 Business Transfers">
              <p>In a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your information becomes subject to a different privacy policy.</p>
            </SubSection>
            <SubSection title="3.5 No Sale of Personal Data">
              <p>We do not sell, rent, or trade your personal information to third parties for their independent marketing purposes.</p>
            </SubSection>
          </Section>

          <Section title="4. Data Retention">
            <p>We retain your information for as long as your account is active. If you delete your account, we will delete or anonymize your information within a reasonable period, except where required by law. You may request deletion of specific content by contacting <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a>.</p>
          </Section>

          <Section title="5. Your Rights and Choices">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong className="text-white/80">Access and Correction:</strong> Update your profile at any time in Platform settings.</li>
              <li><strong className="text-white/80">Account Deletion:</strong> Delete your account via settings or by contacting <a href="mailto:charlie@tatulogue.com" className="text-violet-400 hover:text-violet-300">charlie@tatulogue.com</a>.</li>
              <li><strong className="text-white/80">Marketing Opt-Out:</strong> Unsubscribe via any marketing email or contact us directly.</li>
              <li><strong className="text-white/80">Location:</strong> Disable location access in your device settings at any time.</li>
              <li><strong className="text-white/80">California Residents:</strong> You may have additional rights under CCPA. Contact <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">legal@tatulogue.com</a> to exercise them.</li>
            </ul>
          </Section>

          <Section title="6. Children's Privacy">
            <p>The Platform is intended exclusively for users 18 years of age or older. We do not knowingly collect personal information from minors. If you believe a minor has provided us information, contact <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">legal@tatulogue.com</a>.</p>
          </Section>

          <Section title="7. Security">
            <p>We implement reasonable technical and organizational measures to protect your information, including encrypted data transmission (TLS), access controls, and regular security reviews. No method of internet transmission is 100% secure.</p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you via the Platform or by email at least 14 days before the changes take effect.</p>
          </Section>

          <Section title="9. Contact Us">
            <address className="not-italic space-y-1">
              <p className="font-semibold text-white/80">TATULOGUE, LLC</p>
              <p>1233 Nayon Dr, Layton, Utah 84040</p>
              <p>Email: <a href="mailto:legal@tatulogue.com" className="text-violet-400 hover:text-violet-300">legal@tatulogue.com</a></p>
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
