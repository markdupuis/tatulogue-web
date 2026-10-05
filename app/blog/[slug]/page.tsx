import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, getAllSlugs } from '@/lib/blog';
import PostPage from '@/components/site/PostPage';
import { buildPostMetadata } from '@/components/site/postMetadata';

export async function generateStaticParams() {
  return getAllSlugs('blog').map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug, 'blog');
  if (!post) return {};
  return buildPostMetadata(post);
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug, 'blog');
  if (!post) notFound();
  return <PostPage post={post} />;
}
