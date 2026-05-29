'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  createRoadmapItem,
  deleteRoadmapItem,
  fetchRoadmap,
  updateRoadmapItem,
} from '../../../lib/admin/queries';
import type { RoadmapItem, RoadmapStatus } from '../../../lib/admin/types';

const STATUS_LABELS: Record<RoadmapStatus, string> = {
  planned: 'Planned',
  in_progress: 'In Progress',
  shipped: 'Shipped',
  parked: 'Parked',
};

const COLUMN_ORDER: RoadmapStatus[] = ['planned', 'in_progress', 'shipped', 'parked'];

const COLUMN_TINT: Record<RoadmapStatus, string> = {
  planned: 'bg-white/[0.02]',
  in_progress: 'bg-violet-600/5',
  shipped: 'bg-green-400/5',
  parked: 'bg-white/[0.01]',
};

const PRIORITY_OPTIONS = [1, 2, 3, 4, 5];

const DEFAULT_FORM = {
  title: '',
  description: '',
  category: '',
  quarter: '',
  priority: 3,
  status: 'planned' as RoadmapStatus,
};

const inputClass =
  'w-full rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-violet-500 focus:outline-none';

interface RoadmapCardProps {
  item: RoadmapItem;
  onMove: (id: string, status: RoadmapStatus) => void;
  onDelete: (id: string) => void;
}

function RoadmapCard({ item, onMove, onDelete }: RoadmapCardProps) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white">{item.title}</h3>
        <span className="flex-shrink-0 rounded-full border border-white/8 px-2 py-0.5 text-xs text-violet-400">
          P{item.priority}
        </span>
      </div>

      {(item.category || item.quarter) && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.category && (
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
              {item.category}
            </span>
          )}
          {item.quarter && (
            <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-xs text-white/50">
              {item.quarter}
            </span>
          )}
        </div>
      )}

      {item.description && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/50">
          {item.description}
        </p>
      )}

      {item.source_bug_id && (
        <p className="mt-2 text-xs text-white/30">from bug</p>
      )}

      <div className="mt-3 flex items-center justify-between gap-2">
        <select
          value={item.status}
          onChange={(e) => onMove(item.id, e.target.value as RoadmapStatus)}
          className="rounded-lg border border-white/8 bg-white/[0.02] px-2 py-1 text-xs text-white/70 focus:outline-none"
        >
          {COLUMN_ORDER.map((s) => (
            <option key={s} value={s} className="bg-[#07070d]">
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="text-xs text-white/30 hover:text-red-400"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    let active = true;
    fetchRoadmap().then((data) => {
      if (!active) return;
      setItems(data);
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
    const created = await createRoadmapItem({
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category.trim() || null,
      quarter: form.quarter.trim() || null,
      priority: form.priority,
      status: form.status,
    });
    if (created) {
      setItems((prev) => [created, ...prev]);
      setForm(DEFAULT_FORM);
      setShowForm(false);
    }
    setSubmitting(false);
  }

  async function handleMove(id: string, status: RoadmapStatus) {
    await updateRoadmapItem(id, { status });
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this roadmap item?')) return;
    await deleteRoadmapItem(id);
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  return (
    <AdminShell active="roadmap" title="Roadmap">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <>
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
            >
              {showForm ? 'Close' : '+ New item'}
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
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={3}
                className={inputClass}
              />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Category"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={form.quarter}
                  onChange={(e) => setForm({ ...form, quarter: e.target.value })}
                  placeholder="Quarter (e.g. Q3 2026)"
                  className={inputClass}
                />
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                  className={inputClass}
                >
                  {PRIORITY_OPTIONS.map((p) => (
                    <option key={p} value={p} className="bg-[#07070d]">
                      P{p}
                      {p === 1 ? ' (highest)' : ''}
                    </option>
                  ))}
                </select>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as RoadmapStatus })}
                  className={inputClass}
                >
                  {COLUMN_ORDER.map((s) => (
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
                {submitting ? 'Saving…' : 'Create item'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {COLUMN_ORDER.map((status) => {
              const columnItems = items
                .filter((it) => it.status === status)
                .sort((a, b) => a.priority - b.priority);
              return (
                <div
                  key={status}
                  className={`rounded-xl border border-white/8 p-3 ${COLUMN_TINT[status]}`}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <h2 className="text-sm font-semibold text-white">
                      {STATUS_LABELS[status]}
                    </h2>
                    <span className="text-xs text-white/40">{columnItems.length}</span>
                  </div>
                  <div className="space-y-3">
                    {columnItems.length === 0 ? (
                      <p className="px-1 py-6 text-center text-xs text-white/25">Empty</p>
                    ) : (
                      columnItems.map((item) => (
                        <RoadmapCard
                          key={item.id}
                          item={item}
                          onMove={handleMove}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AdminShell>
  );
}
