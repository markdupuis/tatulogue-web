import { execSync } from 'child_process';
import type { MetadataRoute } from 'next';

import { getAllPostMeta, lastModifiedIso, shouldNoindex } from '@/lib/blog';
import { AUTHORS } from '@/lib/authors';

const BASE_URL = 'https://tatulogue.com';

type StaticRoute = {
  path: string;
  // Source files whose last commit date is the page's last content change.
  sources: string[];
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: '/', sources: ['app/page.tsx', 'app/HomeClient.tsx'], changeFrequency: 'weekly', priority: 1.0 },
  { path: '/about', sources: ['app/about/page.tsx'], changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', sources: ['app/contact/page.tsx'], changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', sources: ['app/privacy/page.tsx'], changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', sources: ['app/terms/page.tsx'], changeFrequency: 'yearly', priority: 0.3 },
];

function lastCommitDate(file: string): Date | null {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${file}"`, {
      cwd: process.cwd(),
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
    const date = new Date(out);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

function newest(dates: Array<Date | null>, fallback: Date): Date {
  const valid = dates.filter((d): d is Date => d !== null);
  if (valid.length === 0) return fallback;
  return valid.reduce((a, b) => (a.getTime() > b.getTime() ? a : b));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blog = getAllPostMeta('blog').filter(post => !shouldNoindex(post));
  const changelog = getAllPostMeta('changelog');

  const newestBlog = newest(blog.map(p => new Date(lastModifiedIso(p))), new Date(0));
  const newestChangelog = newest(changelog.map(p => new Date(lastModifiedIso(p))), new Date(0));

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(route => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: newest(route.sources.map(lastCommitDate), newestBlog),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const sectionIndexes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, lastModified: newestBlog, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/changelog`, lastModified: newestChangelog, changeFrequency: 'monthly', priority: 0.4 },
  ];

  const authorRoutes: MetadataRoute.Sitemap = Object.values(AUTHORS).map(author => ({
    url: `${BASE_URL}/authors/${author.slug}`,
    lastModified: newest(
      blog.filter(p => p.author === author.name).map(p => new Date(lastModifiedIso(p))),
      newestBlog,
    ),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blog.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(lastModifiedIso(post)),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const changelogRoutes: MetadataRoute.Sitemap = changelog.map(entry => ({
    url: `${BASE_URL}/changelog/${entry.slug}`,
    lastModified: new Date(lastModifiedIso(entry)),
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [...staticRoutes, ...sectionIndexes, ...authorRoutes, ...blogRoutes, ...changelogRoutes];
}
