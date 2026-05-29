'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  createBlogIdea,
  deleteBlogIdea,
  fetchBlogIdeas,
  updateBlogIdea,
} from '../../../lib/admin/queries';
import type {
  BlogIdea,
  BlogIdeaStatus,
  ExistingPostSummary,
} from '../../../lib/admin/types';

const STATUS_LABELS: Record<BlogIdeaStatus, string> = {
  idea: 'Idea',
  writing: 'Writing',
  published: 'Published',
};

const STATUS_ORDER: BlogIdeaStatus[] = ['idea', 'writing', 'published'];

const CATEGORY_OPTIONS = ['education', 'spotlight', 'trends', 'updates', 'about'];

// Client-safe copy of lib/blog.ts CATEGORY_LABELS (that module imports `fs` and cannot be bundled client-side)
const CATEGORY_LABELS: Record<string, string> = {
  education: 'Education',
  spotlight: 'Artist Spotlight',
  trends: 'Trends',
  updates: 'Updates',
  about: 'About Tatulogue',
};

const DEFAULT_FORM = {
  title: '',
  angle: '',
  target_keyword: '',
  category: 'education',
  status: 'idea' as BlogIdeaStatus,
};

const inputClass =
  'w-full rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500 focus:outline-none';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface IdeaCardProps {
  idea: BlogIdea;
  onMove: (id: string, status: BlogIdeaStatus) => void;
  onSlug: (id: string, slug: string) => void;
  onDelete: (id: string) => void;
}

function IdeaCard({ idea, onMove, onSlug, onDelete }: IdeaCardProps) {
  const [slugDraft, setSlugDraft] = useState(idea.published_slug ?? '');

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{idea.title}</h3>
        <span className="flex-shrink-0 rounded-full border border-white/8 px-2 py-0.5 text-xs text-violet-400">
          {STATUS_LABELS[idea.status]}
        </span>
      </div>

      {(idea.category || idea.target_keyword) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {idea.category && (
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
              {CATEGORY_LABELS[idea.category] ?? idea.category}
            </span>
          )}
          {idea.target_keyword && (
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
              🔑 {idea.target_keyword}
            </span>
          )}
        </div>
      )}

      {idea.angle && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/50">
          {idea.angle}
        </p>
      )}

      {idea.status === 'published' && (
        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={slugDraft}
            onChange={(e) => setSlugDraft(e.target.value)}
            onBlur={() => onSlug(idea.id, slugDraft.trim())}
            placeholder="published-slug"
            className="flex-1 rounded-lg border border-white/8 bg-white/[0.02] px-2 py-1 text-xs text-white placeholder-white/30 focus:border-violet-500 focus:outline-none"
          />
          {idea.published_slug && (
            <a
              href={`/blog/${idea.published_slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-xs text-violet-400 hover:text-violet-300"
            >
              View
            </a>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <select
          value={idea.status}
          onChange={(e) => onMove(idea.id, e.target.value as BlogIdeaStatus)}
          className="rounded-lg border border-white/8 bg-white/[0.02] px-2 py-1 text-xs text-white/70 focus:outline-none"
        >
          {STATUS_ORDER.map((s) => (
            <option key={s} value={s} className="bg-[#07070d]">
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onDelete(idea.id)}
          className="text-xs text-white/30 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function ExistingPostCard({ post }: { post: ExistingPostSummary }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{post.title}</h3>
        <span className="flex-shrink-0 rounded-full border border-green-400/20 px-2 py-0.5 text-xs text-green-400">
          Live
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
          {CATEGORY_LABELS[post.category] ?? post.category}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-white/30">{formatDate(post.date)}</span>
        <a
          href={`/blog/${post.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-violet-400 hover:text-violet-300"
        >
          View →
        </a>
      </div>
    </div>
  );
}

interface BlogsClientProps {
  existingPosts: ExistingPostSummary[];
}

export default function BlogsClient({ existingPosts }: BlogsClientProps) {
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    let active = true;
    fetchBlogIdeas().then((data) => {
      if (!active) return;
      setIdeas(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    const created = await createBlogIdea({
      title: form.title.trim(),
      angle: form.angle.trim() || null,
      target_keyword: form.target_keyword.trim() || null,
      category: form.category.trim() || null,
      status: form.status,
    });
    if (created) {
      setIdeas((prev) => [created, ...prev]);
      setForm(DEFAULT_FORM);
      setShowForm(false);
    }
    setSubmitting(false);
  }

  async function handleMove(id: string, status: BlogIdeaStatus) {
    await updateBlogIdea(id, { status });
    setIdeas((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  }

  async function handleSlug(id: string, slug: string) {
    const published_slug = slug || null;
    await updateBlogIdea(id, { published_slug });
    setIdeas((prev) => prev.map((it) => (it.id === id ? { ...it, published_slug } : it)));
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this blog idea?')) return;
    await deleteBlogIdea(id);
    setIdeas((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <AdminShell active="blogs" title="Blogs">
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/40">
            Blog ideas
          </h2>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
          >
            {showForm ? 'Close' : '+ Add new'}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-3 rounded-xl border border-white/8 bg-white/[0.03] p-5"
          >
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Title"
              className={inputClass}
            />
            <textarea
              value={form.angle}
              onChange={(e) => setForm({ ...form, angle: e.target.value })}
              placeholder="Angle / notes"
              rows={3}
              className={inputClass}
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                value={form.target_keyword}
                onChange={(e) => setForm({ ...form, target_keyword: e.target.value })}
                placeholder="Target keyword"
                className={inputClass}
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-[#07070d]">
                    {CATEGORY_LABELS[c] ?? c}
                  </option>
                ))}
              </select>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as BlogIdeaStatus })}
                className={inputClass}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s} className="bg-[#07070d]">
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting || !form.title.trim()}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Create idea'}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-white/40">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {STATUS_ORDER.map((status) => {
              const columnIdeas = ideas.filter((it) => it.status === status);
              const livePosts = status === 'published' ? existingPosts : [];
              const total = columnIdeas.length + livePosts.length;
              return (
                <div
                  key={status}
                  className="rounded-xl border border-white/8 bg-white/[0.02] p-3"
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h3 className="text-sm font-semibold text-white">
                      {STATUS_LABELS[status]}
                    </h3>
                    <span className="text-xs text-white/40">{total}</span>
                  </div>
                  <div className="space-y-3">
                    {total === 0 ? (
                      <p className="px-1 py-6 text-center text-xs text-white/25">Empty</p>
                    ) : (
                      <>
                        {columnIdeas.map((idea) => (
                          <IdeaCard
                            key={idea.id}
                            idea={idea}
                            onMove={handleMove}
                            onSlug={handleSlug}
                            onDelete={handleDelete}
                          />
                        ))}
                        {livePosts.map((post) => (
                          <ExistingPostCard key={post.slug} post={post} />
                        ))}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
