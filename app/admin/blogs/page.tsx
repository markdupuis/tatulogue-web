import { getAllPostMeta } from '../../../lib/blog';
import BlogsClient from './BlogsClient';
import type { ExistingPostSummary } from '../../../lib/admin/types';

export default function BlogsPage() {
  const existingPosts: ExistingPostSummary[] = getAllPostMeta().map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    date: p.date,
  }));
  return <BlogsClient existingPosts={existingPosts} />;
}
