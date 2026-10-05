import type { Metadata } from 'next';
import { metaTitle, shouldNoindex, lastModifiedIso, type Post, type Section } from '@/lib/blog';
import { getAuthorByName, authorUrl, SITE_URL } from '@/lib/authors';

export const FALLBACK_OG_IMAGE = '/images/hero-poster.jpg';

export function sectionPath(section: Section): string {
  return section === 'blog' ? '/blog' : '/changelog';
}

export function postUrl(post: { slug: string; section: Section }): string {
  return `${SITE_URL}${sectionPath(post.section)}/${post.slug}`;
}

export function absoluteImage(src: string | undefined): string {
  const image = src ?? FALLBACK_OG_IMAGE;
  return image.startsWith('http') ? image : `${SITE_URL}${image}`;
}

export function buildPostMetadata(post: Post): Metadata {
  const url = postUrl(post);
  const author = getAuthorByName(post.author);
  const title = metaTitle(post);
  const ogTitle = post.seoTitle ?? post.title;

  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    robots: shouldNoindex(post) ? { index: false, follow: true } : undefined,
    openGraph: {
      title: ogTitle,
      description: post.description,
      type: 'article',
      url,
      publishedTime: post.date,
      modifiedTime: lastModifiedIso(post),
      authors: author ? [authorUrl(author)] : undefined,
      images: [{ url: absoluteImage(post.coverImage) }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: post.description,
    },
  };
}
