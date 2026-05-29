'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  convertBugToRoadmap,
  fetchReports,
  updateReportStatus,
} from '../../../lib/admin/queries';
import type {
  BugReport,
  Priority,
  ReportStatus,
  ReportType,
} from '../../../lib/admin/types';

const STATUS_LABELS: Record<ReportStatus, string> = {
  open: 'Open',
  resolved: 'Resolved',
  closed: 'Closed',
};

const STATUS_BADGE: Record<ReportStatus, string> = {
  open: 'text-red-400 bg-red-400/10 border-red-400/20',
  resolved: 'text-green-400 bg-green-400/10 border-green-400/20',
  closed: 'text-white/40 bg-white/5 border-white/10',
};

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'text-red-300',
  high: 'text-orange-300',
  medium: 'text-yellow-300',
  low: 'text-white/40',
};

const STATUS_FILTERS: (ReportStatus | 'all')[] = ['all', 'open', 'resolved', 'closed'];
const TYPE_FILTERS: (ReportType | 'all')[] = ['all', 'bug', 'feature_request'];
const STATUS_ACTIONS: ReportStatus[] = ['open', 'resolved', 'closed'];

function typeLabel(type: ReportType | 'all'): string {
  if (type === 'all') return 'All types';
  return type === 'bug' ? 'Bug' : 'Feature';
}

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
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [convertedIds, setConvertedIds] = useState<Set<string>>(new Set());

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

  async function handleConvert(report: BugReport) {
    setConvertingId(report.id);
    const created = await convertBugToRoadmap(report);
    if (created) {
      setConvertedIds((prev) => new Set(prev).add(report.id));
    }
    setConvertingId(null);
  }

  const filtered = reports.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchType = typeFilter === 'all' || r.report_type === typeFilter;
    return matchStatus && matchType;
  });

  const stats = [
    { label: 'Open', value: reports.filter((r) => r.status === 'open').length, color: 'text-red-400' },
    { label: 'Resolved', value: reports.filter((r) => r.status === 'resolved').length, color: 'text-green-400' },
    { label: 'Closed', value: reports.filter((r) => r.status === 'closed').length, color: 'text-white/40' },
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

          <div className="mb-3 flex flex-wrap gap-2">
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
          <div className="mb-8 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={pill(typeFilter === t)}
              >
                {typeLabel(t)}
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
                return (
                  <div
                    key={r.id}
                    className="rounded-xl border border-white/8 bg-white/[0.02] transition-colors hover:border-white/15"
                  >
                    <div
                      className="cursor-pointer p-5"
                      onClick={() => setExpandedId(isExpanded ? null : r.id)}
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

                    {isExpanded && (
                      <div className="space-y-4 border-t border-white/5 px-5 pb-5 pt-4">
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

                        <div className="flex items-center gap-3">
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
