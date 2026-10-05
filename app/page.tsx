import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import { SITE_URL } from '@/lib/authors';

export const metadata: Metadata = {
  alternates: { canonical: `${SITE_URL}/` },
};

const APP_STORE_URL = 'https://apps.apple.com/us/app/tatulogue/id6794140876';
const GOOGLE_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.tatulogue.app';

// Only profiles that are confirmed to belong to Tatulogue belong here. The two
// store listings are verified; add official social profile URLs when confirmed.
const SAME_AS = [APP_STORE_URL, GOOGLE_PLAY_URL];

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Tatulogue',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  sameAs: SAME_AS,
};

const mobileAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'MobileApplication',
  name: 'Tatulogue',
  operatingSystem: 'iOS, Android',
  applicationCategory: 'SocialNetworkingApplication',
  url: SITE_URL,
  installUrl: [APP_STORE_URL, GOOGLE_PLAY_URL],
  sameAs: SAME_AS,
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mobileAppSchema) }} />
      <HomeClient />
    </>
  );
}
