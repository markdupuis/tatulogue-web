import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export type Section = 'blog' | 'changelog';

const SECTION_DIRS: Record<Section, string> = {
  blog: path.join(process.cwd(), 'content/blog'),
  changelog: path.join(process.cwd(), 'content/changelog'),
};

const DAY_MS = 24 * 60 * 60 * 1000;
const SITE_TITLE_SUFFIX = ' | Tatulogue';
const MAX_TITLE_WITH_SUFFIX = 60;

export interface PostMeta {
  slug: string;
  section: Section;
  title: string;
  // Optional shorter <title>/OG title. The on-page H1 always uses `title`.
  seoTitle?: string;
  description: string;
  date: string;
  dateModified?: string;
  // Dated news roundups: stop being indexable this many days after `date`.
  // Applied at build time, so the site must be rebuilt after the cutoff.
  noindexAfterDays?: number;
  author: string;
  category: 'education' | 'spotlight' | 'trends' | 'updates' | 'about';
  tags: string[];
  coverImage?: string;
  coverAlt?: string;
  featured: boolean;
  readTime: number;
}

export interface Post extends PostMeta {
  contentHtml: string;
  faqSchema: Record<string, unknown> | null;
}

// Posts end with a ```json fenced FAQPage schema block for search engines,
// meant to be invisible on the page and injected as its own <script
// type="application/ld+json"> instead. Without this extraction it was
// flowing straight through remark and rendering as a visible code block on
// every post that had one.
function extractFaqSchema(content: string): { content: string; faqSchema: Record<string, unknown> | null } {
  const match = content.match(/\n```json\s*\n([\s\S]*?)\n```\s*$/);
  if (!match) return { content, faqSchema: null };

  try {
    const parsed = JSON.parse(match[1]);
    if (parsed?.['@type'] !== 'FAQPage') return { content, faqSchema: null };
    return { content: content.slice(0, match.index), faqSchema: parsed };
  } catch {
    return { content, faqSchema: null };
  }
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function toIso(value: unknown): string | undefined {
  if (!value) return undefined;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildMeta(slug: string, section: Section, data: Record<string, unknown>, content: string): PostMeta {
  return {
    slug,
    section,
    title: (data.title as string) ?? '',
    seoTitle: data.seoTitle as string | undefined,
    description: (data.description as string) ?? '',
    date: toIso(data.date) ?? new Date().toISOString(),
    dateModified: toIso(data.dateModified),
    noindexAfterDays: data.noindexAfterDays as number | undefined,
    author: (data.author as string) ?? 'Tatulogue Team',
    category: ((data.category as PostMeta['category']) ?? 'education'),
    tags: (data.tags as string[]) ?? [],
    coverImage: data.coverImage as string | undefined,
    coverAlt: data.coverAlt as string | undefined,
    featured: (data.featured as boolean) ?? false,
    readTime: (data.readTime as number) ?? estimateReadTime(content),
  };
}

export function getAllPostMeta(section: Section = 'blog'): PostMeta[] {
  const dir = SECTION_DIRS[section];
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, filename), 'utf-8');
    const { data, content } = matter(raw);
    return buildMeta(slug, section, data, content);
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostMetaByCategory(category: string): PostMeta[] {
  const all = getAllPostMeta();
  if (category === 'all') return all;
  return all.filter(p => p.category === category);
}

export async function getPost(slug: string, section: Section = 'blog'): Promise<Post | null> {
  const filePath = path.join(SECTION_DIRS[section], `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content: rawContent } = matter(raw);
  const { content, faqSchema } = extractFaqSchema(rawContent);

  const processed = await remark().use(html, { sanitize: false }).process(content);

  // Open external links in a new tab; internal links stay in-page
  const contentHtml = processed
    .toString()
    .replace(
      /<a href="(https?:\/\/(?!(?:www\.)?tatulogue\.com)[^"]+)"([^>]*)>/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"$2>',
    );

  return { ...buildMeta(slug, section, data, content), contentHtml, faqSchema };
}

export function getAllSlugs(section: Section = 'blog'): string[] {
  const dir = SECTION_DIRS[section];
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export function isNewsRoundup(meta: PostMeta): boolean {
  return typeof meta.noindexAfterDays === 'number';
}

// A news roundup drops out of the index `noindexAfterDays` after publication.
export function shouldNoindex(meta: PostMeta, now: Date = new Date()): boolean {
  if (!isNewsRoundup(meta)) return false;
  const cutoff = new Date(meta.date).getTime() + (meta.noindexAfterDays as number) * DAY_MS;
  return now.getTime() > cutoff;
}

export function lastModifiedIso(meta: PostMeta): string {
  return meta.dateModified ?? meta.date;
}

export function wasUpdated(meta: PostMeta): boolean {
  if (!meta.dateModified) return false;
  return meta.dateModified.slice(0, 10) > meta.date.slice(0, 10);
}

// Title tag: use seoTitle when set, and keep the brand suffix only while the
// whole thing fits in 60 characters. Posts without a seoTitle keep their
// previous "<title> | Tatulogue" behavior.
export function metaTitle(meta: PostMeta): string {
  if (!meta.seoTitle) return `${meta.title}${SITE_TITLE_SUFFIX}`;
  const withSuffix = `${meta.seoTitle}${SITE_TITLE_SUFFIX}`;
  return withSuffix.length <= MAX_TITLE_WITH_SUFFIX ? withSuffix : meta.seoTitle;
}

export const CATEGORY_LABELS: Record<string, string> = {
  education: 'Education',
  spotlight: 'Artist Spotlight',
  trends: 'Trends',
  updates: 'Updates',
  about: 'About Tatulogue',
};
