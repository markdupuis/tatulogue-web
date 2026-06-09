'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  createRoadmapItem,
  deleteRoadmapItem,
  setRoadmapAssignees,
  updateRoadmapItem,
} from '../../lib/admin/queries';
import type { RoadmapItem, RoadmapStatus, TeamMember } from '../../lib/admin/types';

const CATEGORY_OPTIONS = ['feature', 'bug', 'improvement', 'task'] as const;

const STATUS_OPTIONS: { value: RoadmapStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const PRIORITY_OPTIONS = [1, 2, 3, 4, 5];

const inputClass =
  'w-full rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-white placeholder-white/30 focus:border-white/25 focus:outline-none';

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/40';

interface TaskEditorModalProps {
  item: RoadmapItem | null;
  team: TeamMember[];
  onClose: () => void;
  onSaved: (saved: RoadmapItem) => void;
  onDeleted: (id: string) => void;
}

interface FormState {
  title: string;
  description: string;
  category: string;
  status: RoadmapStatus;
  priority: number;
  startDate: string;
  dueDate: string;
  progress: number;
}

function initialForm(item: RoadmapItem | null): FormState {
  return {
    title: item?.title ?? '',
    description: item?.description ?? '',
    category: item?.category ?? 'feature',
    status: item?.status ?? 'backlog',
    priority: item?.priority ?? 3,
    startDate: item?.start_date ?? '',
    dueDate: item?.due_date ?? '',
    progress: item?.progress ?? 0,
  };
}

export default function TaskEditorModal({
  item,
  team,
  onClose,
  onSaved,
  onDeleted,
}: TaskEditorModalProps) {
  const isEdit = item !== null;
  const [form, setForm] = useState<FormState>(() => initialForm(item));
  const [assignees, setAssignees] = useState<string[]>(item?.assignees ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  function toggleAssignee(userId: string) {
    setAssignees((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (form.startDate && form.dueDate && form.dueDate < form.startDate) {
      setError('Due date must be on or after the start date.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const fields: Partial<RoadmapItem> = {
      title,
      description: form.description.trim() || null,
      category: form.category || null,
      status: form.status,
      priority: form.priority,
      start_date: form.startDate || null,
      due_date: form.dueDate || null,
      progress: form.progress,
    };

    let savedId = item?.id ?? null;

    if (isEdit && item) {
      await updateRoadmapItem(item.id, fields);
    } else {
      const created = await createRoadmapItem({ ...fields, title });
      savedId = created?.id ?? null;
    }

    if (!savedId) {
      setError('Failed to save task.');
      setSubmitting(false);
      return;
    }

    await setRoadmapAssignees(savedId, assignees);

    const now = new Date().toISOString();
    const saved: RoadmapItem = {
      id: savedId,
      title,
      description: fields.description ?? null,
      status: form.status,
      priority: form.priority,
      quarter: item?.quarter ?? null,
      category: fields.category ?? null,
      source_bug_id: item?.source_bug_id ?? null,
      start_date: fields.start_date ?? null,
      due_date: fields.due_date ?? null,
      progress: form.progress,
      assignees,
      created_at: item?.created_at ?? now,
      updated_at: now,
    };

    onSaved(saved);
  }

  async function handleDelete() {
    if (!item) return;
    if (!window.confirm('Delete this task?')) return;
    setSubmitting(true);
    await deleteRoadmapItem(item.id);
    onDeleted(item.id);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit task' : 'Create task'}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="my-8 w-full max-w-xl rounded-2xl border border-white/8 bg-[#0c0c14] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className="text-base font-semibold text-white">
            {isEdit ? 'Edit task' : 'New task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/40 hover:bg-white/[0.04] hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div>
            <label htmlFor="task-title" className={labelClass}>
              Title
            </label>
            <input
              id="task-title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="task-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="task-description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What needs to happen"
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-category" className={labelClass}>
                Category
              </label>
              <select
                id="task-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c} className="bg-[#07070d]">
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-status" className={labelClass}>
                Status
              </label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as RoadmapStatus })}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value} className="bg-[#07070d]">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-priority" className={labelClass}>
                Priority
              </label>
              <select
                id="task-priority"
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
            </div>

            <div>
              <label htmlFor="task-progress" className={labelClass}>
                Progress — {form.progress}%
              </label>
              <input
                id="task-progress"
                type="range"
                min={0}
                max={100}
                step={5}
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
                className="mt-2 w-full accent-[#F5AF19]"
              />
            </div>

            <div>
              <label htmlFor="task-start" className={labelClass}>
                Start date
              </label>
              <input
                id="task-start"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>

            <div>
              <label htmlFor="task-due" className={labelClass}>
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                min={form.startDate || undefined}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={`${inputClass} [color-scheme:dark]`}
              />
            </div>
          </div>

          <div>
            <span className={labelClass}>Assignees</span>
            {team.length === 0 ? (
              <p className="text-sm text-white/30">No team members.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {team.map((member) => {
                  const selected = assignees.includes(member.user_id);
                  return (
                    <button
                      key={member.user_id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleAssignee(member.user_id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? 'border-transparent bg-[linear-gradient(135deg,#2B5876,#4E4376)] text-white'
                          : 'border-white/8 text-white/50 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {selected ? '✓ ' : ''}
                      {member.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex items-center justify-between border-t border-white/8 pt-4">
            {isEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="text-sm text-white/40 hover:text-red-400 disabled:opacity-50"
              >
                Delete
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-sm text-white/50 hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !form.title.trim()}
                className="rounded-xl bg-[linear-gradient(135deg,#2B5876,#4E4376)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
