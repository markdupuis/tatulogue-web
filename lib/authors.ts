export const SITE_URL = 'https://tatulogue.com';

export interface Author {
  slug: string;
  name: string;
  jobTitle: string;
  focus: string;
  credentials: string;
  bio: string;
  image: string;
}

// Bios reuse the wording already published on /about (TEAM in app/about/page.tsx).
export const AUTHORS: Record<string, Author> = {
  'eric-marshall': {
    slug: 'eric-marshall',
    name: 'Eric Marshall',
    jobTitle: 'Co-Founder',
    focus: 'Creative Strategy & Design · Operations',
    credentials: 'Tattoo-industry veteran. CEO of SecondSkin Tattoo Aftercare.',
    bio: 'Eric Marshall is a co-founder of Tatulogue and a tattoo-industry veteran. He is also the CEO of SecondSkin Tattoo Aftercare. At Tatulogue he works on creative strategy, design and operations.',
    image: '/images/team-eric.jpg',
  },
  'charlie-padilla': {
    slug: 'charlie-padilla',
    name: 'Charlie Padilla',
    jobTitle: 'Founder',
    focus: 'Strategy · Marketing · Product Direction · Partnerships',
    credentials: 'Ex-Pinterest, Ex-Reddit, Ex-AdRoll. Marketing & business consulting, sales.',
    bio: 'Charlie Padilla is the founder of Tatulogue. He previously worked at Pinterest, Reddit and AdRoll, with a background in marketing, business consulting and sales. He leads strategy, marketing, product direction and partnerships.',
    image: '/images/team-charlie.jpg',
  },
  'mark-dupuis': {
    slug: 'mark-dupuis',
    name: 'Mark Dupuis',
    jobTitle: 'Co-Founder and Head of Product',
    focus: 'Head of Product',
    credentials: 'SaaS founder, Director of Product, founder & CEO of multiple companies.',
    bio: 'Mark Dupuis is a co-founder of Tatulogue and its Head of Product. He is a SaaS founder with experience as a Director of Product, and has founded and run multiple companies.',
    image: '/images/team-mark.jpg',
  },
};

export function getAuthorByName(name: string): Author | undefined {
  return Object.values(AUTHORS).find((a) => a.name === name);
}

export function authorUrl(author: Author): string {
  return `${SITE_URL}/authors/${author.slug}`;
}

export function authorPersonSchema(author: Author): Record<string, unknown> {
  return {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.jobTitle,
    url: authorUrl(author),
    image: `${SITE_URL}${author.image}`,
    worksFor: { '@type': 'Organization', name: 'Tatulogue', url: SITE_URL },
  };
}
