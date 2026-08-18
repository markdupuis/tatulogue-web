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
  // Defaults to true (published) when omitted. Set false to pull a page from
  // the listing and stop generating its route without deleting the entry —
  // e.g. while waiting on the artist's permission to go live.
  enabled?: boolean;
  tagline: string;
  heroImage: string;
  heroImageAlt: string;
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
    heroImage: '/images/daniel-greene/daniel-tattooing.png',
    heroImageAlt: 'Daniel Greene tattooing at Black Bumble Tattoo',
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
    tagline: 'Tattoo supply & distribution',
    heroImage: '/images/beehive-worldwide/abe-van.png',
    heroImageAlt: 'Abe Aguilar with the Beehive Worldwide supply van',
    bio: [
      'Abe Aguilar is the founder of Beehive Worldwide Distro — a family-owned tattoo supply company serving licensed professionals across the US and beyond. Tattoo supply is available to licensed shops only, but they also sell a variety of gloves to the general public, as well as tattoo aftercare.',
      'With free local deliveries across Utah, Idaho, and Reno plus a full online store, Beehive Worldwide keeps artists stocked with the inks, gloves, and aftercare they need.',
    ],
    shopName: 'Beehive Worldwide Distro',
    instagramHandle: 'beehiveworldwidedistro',
    specialties: ['Tattoo Supply', 'Free Local Delivery', 'Aftercare'],
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
  'pony-lawson': {
    slug: 'pony-lawson',
    name: 'Pony Lawson',
    type: 'artist',
    enabled: false, // pending his permission to go live
    tagline: 'Tattooer, co-founder of Mayday Tattoo Co & Ink Master alum',
    heroImage: '/images/pony-lawson/pony-lawson-headshot.jpg',
    heroImageAlt: 'Pony Lawson headshot',
    bio: [
      "Pony Lawson is a world-renowned tattoo artist. He's the co-founder of Mayday Tattoo Co, an OG cast member on season 16 of Ink Master, and host of Tattoo Critiques on YouTube. He's also the creator of the original Tattoo Stencil App and Tattoo Palette App.",
      "With over 20 years of experience, he's best known for realistic tattoos — micro portraits, patches, and metallic pieces. Pony works primarily in Chicago but frequently travels to conventions and guest spots around the world.",
    ],
    shopName: 'Mayday Tattoo Co',
    instagramHandle: 'ponylawson',
    specialties: ['Realism', 'Micro Portraits', 'Chrome / Metallic', 'Patchwork'],
    portfolio: [
      { src: '/images/pony-lawson/gold-chrome-tattoos.jpg', alt: 'Four gold chrome-style tattoos by Pony Lawson: a balloon dog, a brain, a fish, and a hannya mask', placeholder: false },
      { src: '/images/pony-lawson/bowie-labyrinth-portrait.webp', alt: 'Black and grey portrait tattoo of David Bowie as the Goblin King from Labyrinth by Pony Lawson', placeholder: false },
      { src: '/images/pony-lawson/walter-white-breaking-bad.webp', alt: 'Black and grey portrait tattoo of Walter White from Breaking Bad by Pony Lawson', placeholder: false },
      { src: '/images/pony-lawson/deadpool-heart-hands.webp', alt: 'Color Deadpool tattoo making a heart-hands gesture by Pony Lawson', placeholder: false },
      { src: '/images/pony-lawson/scooby-doo-patch.webp', alt: 'Embroidered patch-style Scooby-Doo and Shaggy tattoo by Pony Lawson', placeholder: false },
      { src: '/images/pony-lawson/leopard-cub-sticker.jpg', alt: 'Colorful sticker-style leopard cub tattoo by Pony Lawson', placeholder: false },
      { src: '/images/pony-lawson/robot-toy.jpg', alt: 'Colorful vintage toy robot tattoo by Pony Lawson', placeholder: false },
    ],
    ogImage: '/images/pony-lawson/gold-chrome-tattoos.jpg',
    ctaHref: 'https://app.tatulogue.com',
    ctaLabel: 'Follow him on TATULOGUE',
    utm: { source: 'website', medium: 'organic', campaign: 'artist_pony_lawson' },
    address: {
      street: '689 N Milwaukee Ave',
      city: 'Chicago',
      state: 'IL',
      zip: '60642',
    },
    phone: '',
    email: 'info@maydaytattooco.com',
    website: 'https://ponylawson.com',
    hours: 'By appointment only — no walk-ins',
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/ponylawson/', label: '@ponylawson' },
      { platform: 'facebook', url: 'https://www.facebook.com/ponylawsontattoo', label: 'Pony Lawson' },
      { platform: 'tiktok', url: 'https://www.tiktok.com/@ponylawson', label: '@ponylawson' },
      { platform: 'twitter', url: 'https://twitter.com/ponylawson', label: '@ponylawson' },
      { platform: 'youtube', url: 'https://www.youtube.com/@PonyLawson', label: 'Pony Lawson' },
      { platform: 'website', url: 'https://ponylawson.com', label: 'ponylawson.com' },
      { platform: 'website', url: 'https://ponylawson.com/tattooinquiry', label: 'Request a Consultation' },
      { platform: 'website', url: 'https://ponylawson.com/critiquesubmissions', label: 'Submit a Tattoo Critique' },
      { platform: 'website', url: 'https://ponylawson.com/pressinquiry', label: 'Press Inquiry' },
      { platform: 'website', url: 'https://ponylawson.com/brandinquiry', label: 'Brand Partnership Inquiry' },
      { platform: 'website', url: 'https://ponylawson.com/contact', label: 'General Inquiry' },
    ],
    mapEmbedQuery: 'Mayday+Tattoo+Co+689+N+Milwaukee+Ave+Chicago+IL+60642',
  },
  'dane-smith': {
    slug: 'dane-smith',
    name: 'Dane Smith',
    type: 'artist',
    enabled: false, // pending his permission to go live
    tagline: 'Tattooer, co-owner of Fountain Square Tattoo & Ink Master alum',
    heroImage: '/images/dane-smith/dane-smith-headshot.jpg',
    heroImageAlt: 'Dane Smith headshot',
    bio: [
      "Dane Smith is a tattoo artist and co-owner of Fountain Square Tattoo in Indianapolis, tattooing since 2009. He competed on Ink Master season 9 (Shop Wars), pairing with fellow Artistic Skin Designs artist April Nicole to represent the shop.",
      "He leans into strange subject matter and oddities as much as clean traditional and color work, and keeps an active fine art practice showing paintings and drawings around Indianapolis. He also owns Cream Tattoo Supply, the tattoo supply company he built from the ground up. Booking with him opens September 11 — reach out via Instagram or email.",
    ],
    shopName: 'Fountain Square Tattoo',
    instagramHandle: 'danesmith.jpg',
    specialties: ['Japanese', 'Color', 'Illustrative', 'Oddities'],
    portfolio: [
      { src: '/images/dane-smith/tiger-japanese-sleeve.jpg', alt: 'Japanese-style tiger, foo dog, and dragon sleeve tattoo by Dane Smith', placeholder: false },
      { src: '/images/dane-smith/geisha-oni-color-tattoo.jpg', alt: 'Color tattoo of a bloodied oni-geisha face by Dane Smith', placeholder: false },
      { src: '/images/dane-smith/frog-samurai-flash.jpg', alt: 'Illustrated frog samurai flash design by Dane Smith', placeholder: false },
      { src: '/images/dane-smith/spirited-away-illustration.jpg', alt: 'Spirited Away-inspired illustration by Dane Smith', placeholder: false },
      { src: '/images/dane-smith/monster-illustration-print.jpg', alt: 'Purple monster illustration by Dane Smith, printed on apparel', placeholder: false },
    ],
    ogImage: '/images/dane-smith/tiger-japanese-sleeve.jpg',
    ctaHref: 'https://app.tatulogue.com',
    ctaLabel: 'Follow him on TATULOGUE',
    utm: { source: 'website', medium: 'organic', campaign: 'artist_dane_smith' },
    address: {
      street: '1104 Prospect St',
      city: 'Indianapolis',
      state: 'IN',
      zip: '46203',
    },
    phone: '(317) 602-4069',
    email: 'dsmithtattoos@gmail.com',
    website: 'https://fountainsquaretattoo.com',
    hours: 'Open every day, 11:00 AM – 7:00 PM EST',
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/danesmith.jpg/', label: '@danesmith.jpg' },
      { platform: 'instagram', url: 'https://www.instagram.com/fountainsquaretattoo/', label: '@fountainsquaretattoo' },
      { platform: 'instagram', url: 'https://www.instagram.com/creamtattoosupply/', label: '@creamtattoosupply' },
      { platform: 'instagram', url: 'https://www.instagram.com/upforgrabsdane/', label: '@upforgrabsdane (unused designs)' },
      { platform: 'facebook', url: 'https://www.facebook.com/Danesmithtattoo/', label: 'Dane Smith' },
      { platform: 'twitter', url: 'https://x.com/danesmithjpg', label: '@danesmithjpg' },
      { platform: 'youtube', url: 'https://www.youtube.com/@danesmith.mp4', label: 'Dane Smith' },
      { platform: 'website', url: 'https://creamtattoosupply.com', label: 'Cream Tattoo Supply' },
    ],
    mapEmbedQuery: 'Fountain+Square+Tattoo+1104+Prospect+St+Indianapolis+IN+46203',
  },
  'david-mariscal': {
    slug: 'david-mariscal',
    name: 'David Mariscal',
    type: 'artist',
    enabled: false, // pending his permission to go live
    tagline: 'Tattoo artist at Marauder Tattoo Studio',
    heroImage: '/images/david-mariscal/david-mariscal-headshot.jpg',
    heroImageAlt: 'David Mariscal tattooing in his studio',
    bio: [
      'David Mariscal is a tattoo artist at Marauder Tattoo Studio in Murray, Utah, working primarily in black & grey realism — sugar skull imagery, portraiture, and detailed linework, with color work in the mix too.',
    ],
    shopName: 'Marauder Tattoo Studio',
    instagramHandle: 'maraudertattoo',
    specialties: ['Black & Grey', 'Realism', 'Portraiture', 'Color'],
    portfolio: [
      { src: '/images/david-mariscal/sugar-skull-sleeve.jpg', alt: 'Black and grey sugar skull (Día de los Muertos) sleeve tattoo by David Mariscal', placeholder: false },
      { src: '/images/david-mariscal/leopard-floral-tattoo.jpg', alt: 'Black and grey leopard portrait with floral tattoo by David Mariscal', placeholder: false },
      { src: '/images/david-mariscal/joker-portrait.jpg', alt: 'Black and grey Joker portrait tattoo by David Mariscal', placeholder: false },
      { src: '/images/david-mariscal/vegeta-portrait.jpg', alt: 'Black and grey anime portrait tattoo by David Mariscal', placeholder: false },
      { src: '/images/david-mariscal/medusa-hand-piece.jpg', alt: 'Black and grey Medusa hand tattoo by David Mariscal', placeholder: false },
    ],
    ogImage: '/images/david-mariscal/sugar-skull-sleeve.jpg',
    ctaHref: 'https://app.tatulogue.com',
    ctaLabel: 'Follow him on TATULOGUE',
    utm: { source: 'website', medium: 'organic', campaign: 'artist_david_mariscal' },
    address: {
      street: '4700 S 900 E #36',
      city: 'Murray',
      state: 'UT',
      zip: '84117',
    },
    phone: '(385) 495-8436',
    email: null,
    website: null,
    hours: null,
    socials: [
      { platform: 'instagram', url: 'https://www.instagram.com/maraudertattoo/', label: '@maraudertattoo (studio)' },
      { platform: 'facebook', url: 'https://www.facebook.com/sawiamtattoos/', label: 'Marauder Tattoo' },
    ],
    mapEmbedQuery: 'Marauder+Tattoo+Studio+4700+S+900+E+Murray+UT+84117',
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
