import { getAllPostMeta, isNewsRoundup, shouldNoindex } from '@/lib/blog';

export const dynamic = 'force-static';

const SITE_URL = 'https://tatulogue.com';
// Listed under "Key pages", so not repeated under "Guides".
const KEY_PAGE_SLUGS = new Set(['what-is-tatulogue']);

export function GET() {
  const guides = getAllPostMeta('blog').filter(
    post => !isNewsRoundup(post) && !shouldNoindex(post) && !KEY_PAGE_SLUGS.has(post.slug),
  );

  const lines = [
    '# Tatulogue',
    '',
    '> Tatulogue (tatulogue.com) is a social platform built for tattoo artists and collectors. Discover artists by style and location and share work.',
    '',
    '## Key pages',
    `- What is Tatulogue: ${SITE_URL}/blog/what-is-tatulogue`,
    `- Blog: ${SITE_URL}/blog`,
    `- Changelog: ${SITE_URL}/changelog`,
    '',
    '## Guides',
    ...guides.map(post => `- ${post.title}: ${SITE_URL}/blog/${post.slug}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
