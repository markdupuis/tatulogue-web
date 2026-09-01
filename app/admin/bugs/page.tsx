'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  convertBugToRoadmap,
  fetchReports,
  updateReport,
  updateReportStatus,
  type BugReportEdits,
} from '../../../lib/admin/queries';
import type {
  BugReport,
  Priority,
  ReportStatus,
  ReportType,
} from '../../../lib/admin/types';

const STATUS_LABELS: Record<ReportStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  // 'resolved' is legacy (see types.ts) and displays as Closed if it ever
  // shows up, since that's what it means for us now.
  resolved: 'Closed',
  closed: 'Closed',
};

const STATUS_BADGE: Record<ReportStatus, string> = {
  open: 'text-red-400 bg-red-400/10 border-red-400/20',
  in_progress: 'text-[#9fb6dd] bg-[#2B5876]/15 border-[#4E4376]/30',
  resolved: 'text-white/40 bg-white/5 border-white/10',
  closed: 'text-white/40 bg-white/5 border-white/10',
};

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'text-red-300',
  high: 'text-orange-300',
  medium: 'text-yellow-300',
  low: 'text-white/40',
};

const STATUS_FILTERS: (ReportStatus | 'all')[] = ['all', 'open', 'in_progress', 'closed'];
const TYPE_TABS: (ReportType | 'all')[] = ['bug', 'feature_request', 'all'];
const STATUS_ACTIONS: ReportStatus[] = ['open', 'in_progress', 'closed'];
const PRIORITY_OPTIONS: Priority[] = ['critical', 'high', 'medium', 'low'];

const inputClass =
  'w-full rounded-lg border border-white/15 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-violet-400 focus:outline-none';

const ACTIVE_TAB_GRADIENT = 'linear-gradient(135deg,#2B5876,#4E4376)';

const TYPE_TAB_LABELS: Record<ReportType | 'all', string> = {
  bug: 'Bugs',
  feature_request: 'Feature Requests',
  all: 'All',
};

function pill(activeState: boolean): string {
  return `px-4 py-1.5 rounded-full text-sm border transition-colors ${
    activeState
      ? 'bg-violet-600 border-violet-600 text-white'
      : 'border-white/15 text-white/50 hover:border-white/30'
  }`;
}

interface DetailFieldProps {
  label: string;
  value: string | null;
}

function DetailField({ label, value }: DetailFieldProps) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">
        {label}
      </p>
      <p className="whitespace-pre-wrap text-sm text-white/70">{value}</p>
    </div>
  );
}

export default function BugsPage() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('bug');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [convertedIds, setConvertedIds] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<BugReportEdits | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    let active = true;
    fetchReports().then((data) => {
      if (!active) return;
      setReports(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleUpdateStatus(id: string, status: ReportStatus) {
    setUpdatingId(id);
    await updateReportStatus(id, status);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    setUpdatingId(null);
  }

  function handleStartEdit(report: BugReport) {
    setEditingId(report.id);
    setEditForm({
      title: report.title,
      description: report.description,
      priority: report.priority,
      steps_to_reproduce: report.steps_to_reproduce,
      expected_behavior: report.expected_behavior,
      actual_behavior: report.actual_behavior,
    });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function handleSaveEdit(id: string) {
    if (!editForm) return;
    setSavingEdit(true);
    const ok = await updateReport(id, editForm);
    if (ok) {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...editForm } : r)));
      setEditingId(null);
      setEditForm(null);
    }
    setSavingEdit(false);
  }

  async function handleConvert(report: BugReport) {
    setConvertingId(report.id);
    const created = await convertBugToRoadmap(report);
    if (created) {
      setConvertedIds((prev) => new Set(prev).add(report.id));
    }
    setConvertingId(null);
  }

  function countOpen(type: ReportType | 'all'): number {
    return reports.filter(
      (r) => r.status === 'open' && (type === 'all' || r.report_type === type)
    ).length;
  }

  const filtered = reports.filter((r) => {
    // Legacy 'resolved' reports count as 'closed' everywhere in this UI.
    const effectiveStatus = r.status === 'resolved' ? 'closed' : r.status;
    const matchStatus = statusFilter === 'all' || effectiveStatus === statusFilter;
    const matchType = typeFilter === 'all' || r.report_type === typeFilter;
    return matchStatus && matchType;
  });

  const stats = [
    { label: 'Open', value: reports.filter((r) => r.status === 'open').length, color: 'text-red-400' },
    { label: 'In Progress', value: reports.filter((r) => r.status === 'in_progress').length, color: 'text-[#9fb6dd]' },
    { label: 'Closed', value: reports.filter((r) => r.status === 'closed' || r.status === 'resolved').length, color: 'text-white/40' },
    {
      label: 'Critical',
      value: reports.filter((r) => r.priority === 'critical' && r.status === 'open').length,
      color: 'text-red-300',
    },
    { label: 'Bugs', value: reports.filter((r) => r.report_type === 'bug').length, color: 'text-orange-300' },
    { label: 'Features', value: reports.filter((r) => r.report_type === 'feature_request').length, color: 'text-violet-400' },
  ];

  return (
    <AdminShell active="bugs" title="Bug Reports">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {TYPE_TABS.map((t) => {
              const isActive = typeFilter === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-xl border px-5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-transparent text-white'
                      : 'border-white/8 bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white/80'
                  }`}
                  style={isActive ? { backgroundImage: ACTIVE_TAB_GRADIENT } : undefined}
                >
                  {TYPE_TAB_LABELS[t]} ({countOpen(t)})
                </button>
              );
            })}
          </div>

          <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center"
              >
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-white/40">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={pill(statusFilter === s)}
              >
                {s === 'all' ? 'All status' : STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-white/40">
              No reports match this filter.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((r) => {
                const isExpanded = expandedId === r.id;
                const isConverted = convertedIds.has(r.id);
                const isEditing = editingId === r.id;
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-white/8 bg-white/[0.02] transition-colors hover:border-white/15"
                  >
                    <div
                      className={isEditing ? 'p-5' : 'cursor-pointer p-5'}
                      onClick={() => {
                        if (!isEditing) setExpandedId(isExpanded ? null : r.id);
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className={`text-xs font-semibold ${PRIORITY_COLOR[r.priority]}`}>
                              [{r.priority.toUpperCase()}]
                            </span>
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs ${
                                r.report_type === 'bug'
                                  ? 'border-orange-300/20 bg-orange-300/10 text-orange-300'
                                  : 'border-violet-400/20 bg-violet-400/10 text-violet-400'
                              }`}
                            >
                              {r.report_type === 'bug' ? 'Bug' : 'Feature'}
                            </span>
                            {r.reporter_username && (
                              <span className="text-xs text-white/25">@{r.reporter_username}</span>
                            )}
                            <span className="text-xs text-white/20">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-white">{r.title}</h3>
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-white/50">
                            {r.description}
                          </p>
                        </div>
                        <span
                          className={`flex-shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_BADGE[r.status]}`}
                        >
                          {STATUS_LABELS[r.status]}
                        </span>
                      </div>
                    </div>

                    {(isExpanded || isEditing) && (
                      <div className="space-y-4 border-t border-white/5 px-5 pb-5 pt-4">
                        {isEditing && editForm ? (
                          <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">Title</p>
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">Description</p>
                              <textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                rows={3}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">Priority</p>
                              <select
                                value={editForm.priority}
                                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as Priority })}
                                className={inputClass}
                              >
                                {PRIORITY_OPTIONS.map((p) => (
                                  <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">Steps to reproduce</p>
                              <textarea
                                value={editForm.steps_to_reproduce ?? ''}
                                onChange={(e) => setEditForm({ ...editForm, steps_to_reproduce: e.target.value || null })}
                                rows={3}
                                placeholder="Not provided"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">Expected behavior</p>
                              <textarea
                                value={editForm.expected_behavior ?? ''}
                                onChange={(e) => setEditForm({ ...editForm, expected_behavior: e.target.value || null })}
                                rows={2}
                                placeholder="Not provided"
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/40">Actual behavior</p>
                              <textarea
                                value={editForm.actual_behavior ?? ''}
                                onChange={(e) => setEditForm({ ...editForm, actual_behavior: e.target.value || null })}
                                rows={2}
                                placeholder="Not provided"
                                className={inputClass}
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                disabled={savingEdit || !editForm.title.trim()}
                                onClick={() => handleSaveEdit(r.id)}
                                className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                              >
                                {savingEdit ? 'Saving…' : 'Save changes'}
                              </button>
                              <button
                                type="button"
                                disabled={savingEdit}
                                onClick={handleCancelEdit}
                                className="rounded-xl border border-white/15 px-4 py-1.5 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <DetailField label="Steps to reproduce" value={r.steps_to_reproduce} />
                            <DetailField label="Expected behavior" value={r.expected_behavior} />
                            <DetailField label="Actual behavior" value={r.actual_behavior} />
                            <DetailField label="Device info" value={r.device_info} />

                            <div>
                              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                                Update status
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {STATUS_ACTIONS.map((s) => (
                                  <button
                                    key={s}
                                    type="button"
                                    disabled={r.status === s || updatingId === r.id}
                                    onClick={() => handleUpdateStatus(r.id, s)}
                                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors disabled:opacity-40 ${
                                      r.status === s
                                        ? STATUS_BADGE[s]
                                        : 'border-white/15 text-white/50 hover:border-white/40'
                                    }`}
                                  >
                                    {STATUS_LABELS[s]}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(r)}
                                className="rounded-xl border border-white/15 px-4 py-1.5 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
                              >
                                Edit details
                              </button>
                              <button
                                type="button"
                                disabled={convertingId === r.id || isConverted}
                                onClick={() => handleConvert(r)}
                                className="rounded-xl bg-violet-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                              >
                                {convertingId === r.id ? 'Converting…' : 'Convert to roadmap item'}
                              </button>
                              {isConverted && (
                                <span className="text-sm text-green-400">✓ Added to roadmap</span>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-10 text-center text-xs text-white/20">
            {filtered.length} of {reports.length} reports
          </p>
        </>
      )}
    </AdminShell>
  );
}
