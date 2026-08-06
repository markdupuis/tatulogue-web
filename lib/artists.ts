// Per-artist/investor landing page data for /artists/[slug].
// Add a new entry here to publish a new page — the template consumes
// this object, nothing else.

export interface SocialLink {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'youtube' | 'website';
  url: string;
  label: string;
}

export interface ArtistLanding {
  slug: string;
  name: string;
  type: 'artist' | 'industry';
  tagline: string;
  bio: string[];
  shopName: string;
  instagramHandle: string;
  specialties: string[];
  portfolio: { src: string; alt: string; placeholder: boolean }[];
  ogImage: string;
  ctaHref: string;
  ctaLabel: string;
  utm: { source: string; medium: string; campaign: string };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  phone: string;
  email: string | null;
  website: string | null;
  hours: string | null;
  socials: SocialLink[];
  mapEmbedQuery: string;
}

export const ARTISTS: Record<string, ArtistLanding> = {
  'daniel-greene': {
    slug: 'daniel-greene',
    name: 'Daniel Greene',
    type: 'artist',
    tagline: 'Award-winning tattoo artist & shop owner',
    bio: [
      'Daniel Greene is an award-winning tattoo artist, the owner of Black Bumble Tattoo — a full-service tattoo & piercing shop — and investor in TATULOGUE.',
      "A pro-team artist with Tae'Tu, Daniel works across styles — from bold blackwork to detailed black & grey realism.",
    ],
    shopName: 'Black Bumble Tattoo',
    instagramHandle: 'danielgreeneutahink',
    specialties: ['Realism', 'Black & Grey', 'Geometric'],
    portfolio: [
      { src: '/images/daniel-greene/daniel-tattooing.png', alt: 'Daniel Greene tattooing at Black Bumble Tattoo', placeholder: false },
      { src: '/images/daniel-greene/koi-roses.png', alt: 'Black & grey koi fish with roses by Daniel Greene', placeholder: false },
      { src: '/images/daniel-greene/kraken-ship.png', alt: 'Traditional kraken and ship tattoo by Daniel Greene', placeholder: false },
      { src: '/images/daniel-greene/blackwork-skull.png', alt: 'Blackwork skull tattoo by Daniel Greene', placeholder: false },
      { src: '/images/daniel-greene/cherub-chest.png', alt: 'Black & grey cherub chest piece by Daniel Greene', placeholder: false },
      { src: '/images/daniel-greene/storefront.png', alt: 'Black Bumble Tattoo storefront — Clearfield, UT', placeholder: false },
    ],
    ogImage: '/images/hero-poster.jpg',
    ctaHref: 'https://app.tatulogue.com',
    ctaLabel: 'Follow him on TATULOGUE',
    utm: { source: 'facebook', medium: 'paid', campaign: 'artist_daniel_greene' },
    address: {
      street: '354 S State Street',
      city: 'Clearfield',
      state: 'UT',
      zip: '84015',
    },
    phone: '(385) 239-4176',
    email: 'blackbumbletattoo@gmail.com',
    website: 'https://www.blackbumbletattoo.com',
    hours: 'Monday – Sunday, 11:00 AM – 6:00 PM',
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/blackbumbletattoo/', label: '@blackbumbletattoo' },
      { platform: 'instagram', url: 'https://www.instagram.com/danielgreeneutahink/', label: '@danielgreeneutahink' },
      { platform: 'instagram', url: 'https://www.instagram.com/danielgreenetattoos/', label: '@danielgreenetattoos' },
      { platform: 'facebook', url: 'https://www.facebook.com/profile.php?id=100094196664430', label: 'Black Bumble Tattoo' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@danielgreene801', label: '@danielgreene801' },
    ],
    mapEmbedQuery: 'Black+Bumble+Tattoo+354+S+State+St+Clearfield+UT+84015',
  },
  'beehive-worldwide': {
    slug: 'beehive-worldwide',
    name: 'Abe Aguilar',
    type: 'industry',
    tagline: 'Mobile tattoo supply & distribution',
    bio: [
      'Abe Aguilar is the founder of Beehive Worldwide Distro — a family-owned tattoo supply company serving licensed professionals across the US and beyond.',
      'From a mobile supply van hitting shops in Utah, Idaho, and Reno to a full online store with free local deliveries, Beehive Worldwide keeps artists stocked with the inks, gloves, and aftercare they need.',
    ],
    shopName: 'Beehive Worldwide Distro',
    instagramHandle: 'beehiveworldwidedistro',
    specialties: ['Tattoo Supply', 'Mobile Distribution', 'Aftercare'],
    portfolio: [
      { src: '/images/beehive-worldwide/abe-van.png', alt: 'Abe Aguilar with the Beehive Worldwide supply van', placeholder: false },
      { src: '/images/beehive-worldwide/ink-bottles.jpg', alt: 'Insane Ink tattoo supply products', placeholder: false },
      { src: '/images/beehive-worldwide/shop-products.png', alt: 'Beehive Worldwide Distro product display', placeholder: false },
      { src: '/images/beehive-worldwide/convention-booth.png', alt: 'Beehive Worldwide at a tattoo convention', placeholder: false },
    ],
    ogImage: '/images/beehive-worldwide/abe-van.png',
    ctaHref: 'https://app.tatulogue.com',
    ctaLabel: 'Follow on TATULOGUE',
    utm: { source: 'website', medium: 'organic', campaign: 'industry_beehive_worldwide' },
    address: {
      street: '3539 Washington Blvd',
      city: 'Ogden',
      state: 'UT',
      zip: '84401',
    },
    phone: '',
    email: null,
    website: 'https://beehiveworldwidedistro.com',
    hours: null,
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/beehiveworldwidedistro/', label: '@beehiveworldwidedistro' },
      { platform: 'instagram', url: 'https://www.instagram.com/bigsleepsinkutah/', label: '@bigsleepsinkutah' },
      { platform: 'facebook', url: 'https://www.facebook.com/abraham.aguilar.939594/', label: 'Abe Aguilar' },
    ],
    mapEmbedQuery: 'Beehive+Worldwide+Distro+3539+Washington+Blvd+Ogden+UT',
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

const SOCIAL_ICONS: Record<string, string> = {
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 3.44.01 6.88-.02 10.32-.12 1.77-.72 3.53-1.77 4.96-1.68 2.31-4.47 3.65-7.32 3.63-1.7.01-3.38-.47-4.82-1.36-2.39-1.47-4.01-4.08-4.15-6.86-.03-.61-.03-1.23.01-1.84.19-2.29 1.34-4.42 3.06-5.88 1.97-1.69 4.67-2.48 7.24-2.12.03 1.66-.03 3.32-.03 4.98-1.3-.25-2.77-.02-3.82.76-.72.5-1.22 1.24-1.5 2.05-.24.68-.17 1.42-.14 2.14.26 1.94 2.04 3.51 4 3.38 1.23-.02 2.41-.68 3.12-1.66.25-.36.46-.76.56-1.19.17-1.09.14-2.2.14-3.3-.01-5.65-.01-11.3-.01-16.95z',
  twitter: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  website: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
};

export function getSocialIcon(platform: string): string {
  return SOCIAL_ICONS[platform] || SOCIAL_ICONS.website;
}
