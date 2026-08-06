// Per-artist landing page data for paid-acquisition funnels (/artists/[slug]).
// Add a new entry here to publish a new artist page — the template consumes
// this object, nothing else. Pilot scope: static data only; making this
// data-driven means reading Supabase artist_profiles + users at build time
// (or moving the route off static export), tracked separately.

export interface ArtistLanding {
  slug: string;
  name: string;
  /** Short positioning line under the name. Keep to verifiable facts only. */
  tagline: string;
  /** Bio paragraphs — sourced from the artist's own public profiles, no embellishment. */
  bio: string[];
  shopName: string;
  instagramHandle: string;
  /** Styles/specialties shown as chips. */
  specialties: string[];
  /**
   * Portfolio images, relative to /public. Entries with placeholder: true render
   * with a visible "PLACEHOLDER" badge and must be replaced with real, artist-
   * supplied photos before any ad spend is pointed at the page.
   */
  portfolio: { src: string; alt: string; placeholder: boolean }[];
  /** Absolute path of the Open Graph preview image (relative to /public). */
  ogImage: string;
  /**
   * Primary CTA destination. Currently the Tatulogue web app — the iOS app is
   * TestFlight-only (no public App Store listing yet) and app deep links
   * (Universal Links / App Links) do not exist in this repo. UTM params are
   * appended by the template.
   */
  ctaHref: string;
  ctaLabel: string;
  utm: { source: string; medium: string; campaign: string };
}

export const ARTISTS: Record<string, ArtistLanding> = {
  'daniel-greene': {
    slug: 'daniel-greene',
    name: 'Daniel Greene',
    tagline: 'Award-winning tattoo & piercing artist',
    bio: [
      'Daniel Greene is an award-winning tattoo and piercing artist, the owner of Black Bumble Tattoo, and investor in TATULOGUE.',
      "A pro-team artist with Tae'Tu, Daniel works across styles — from bold blackwork to detailed black & grey realism.",
    ],
    shopName: 'Black Bumble Tattoo',
    instagramHandle: 'danielgreenetattoos',
    specialties: ['Realism', 'Black & Grey', 'Geometric'],
    portfolio: [
      { src: '/images/strip-1-1.jpg', alt: 'Placeholder tattoo work — awaiting artist photos', placeholder: true },
      { src: '/images/strip-1-2.jpg', alt: 'Placeholder tattoo work — awaiting artist photos', placeholder: true },
      { src: '/images/strip-2-1.jpg', alt: 'Placeholder tattoo work — awaiting artist photos', placeholder: true },
      { src: '/images/strip-2-2.jpg', alt: 'Placeholder tattoo work — awaiting artist photos', placeholder: true },
      { src: '/images/strip-1-4.jpg', alt: 'Placeholder tattoo work — awaiting artist photos', placeholder: true },
      { src: '/images/strip-2-4.jpg', alt: 'Placeholder tattoo work — awaiting artist photos', placeholder: true },
    ],
    ogImage: '/images/hero-poster.jpg',
    ctaHref: 'https://app.tatulogue.com',
    ctaLabel: 'Follow him on TATULOGUE',
    utm: { source: 'facebook', medium: 'paid', campaign: 'artist_daniel_greene' },
  },
};

export function buildCtaUrl(a: ArtistLanding): string {
  const params = new URLSearchParams({
    utm_source: a.utm.source,
    utm_medium: a.utm.medium,
    utm_campaign: a.utm.campaign,
    utm_content: a.slug,
  });
  return `${a.ctaHref}?${params.toString()}`;
}
