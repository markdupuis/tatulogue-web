import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
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
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getAllPostMeta(): PostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));

  const posts = files.map(filename => {
    const slug = filename.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      author: data.author ?? 'Tatulogue Team',
      category: data.category ?? 'education',
      tags: data.tags ?? [],
      coverImage: data.coverImage,
      coverAlt: data.coverAlt,
      featured: data.featured ?? false,
      readTime: data.readTime ?? estimateReadTime(content),
    } as PostMeta;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostMetaByCategory(category: string): PostMeta[] {
  const all = getAllPostMeta();
  if (category === 'all') return all;
  return all.filter(p => p.category === category);
}

export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const processed = await remark().use(html, { sanitize: false }).process(content);
  const contentHtml = processed.toString();

  return {
    slug,
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    author: data.author ?? 'Tatulogue Team',
    category: data.category ?? 'education',
    tags: data.tags ?? [],
    coverImage: data.coverImage,
    coverAlt: data.coverAlt,
    featured: data.featured ?? false,
    readTime: data.readTime ?? estimateReadTime(content),
    contentHtml,
  };
}

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

export const CATEGORY_LABELS: Record<string, string> = {
  education: 'Education',
  spotlight: 'Artist Spotlight',
  trends: 'Trends',
  updates: 'Updates',
  about: 'About Tatulogue',
};
