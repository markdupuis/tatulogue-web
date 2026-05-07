'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';

type Status     = 'open' | 'resolved' | 'closed';
type ReportType = 'bug' | 'feature_request' | 'all';
type Priority   = 'low' | 'medium' | 'high' | 'critical';

interface Report {
  id:          string;
  title:       string;
  description: string;
  steps_to_reproduce: string | null;
  status:      Status;
  priority:    Priority;
  report_type: 'bug' | 'feature_request';
  created_at:  string;
  reporter_id: string;
  username:    string | null;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  open:     { label: 'Open',     color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  resolved: { label: 'Resolved', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  closed:   { label: 'Closed',   color: 'text-white/40 bg-white/5 border-white/10' },
};

const PRIORITY_COLOR: Record<Priority, string> = {
  critical: 'text-red-300',
  high:     'text-orange-300',
  medium:   'text-yellow-300',
  low:      'text-white/40',
};

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false);
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError,   setAuthError]   = useState('');

  const [reports,      setReports]      = useState<Report[]>([]);
  const [dataLoading,  setDataLoading]  = useState(false);
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [typeFilter,   setTypeFilter]   = useState<ReportType>('all');
  const [expanded,     setExpanded]     = useState<string | null>(null);
  const [updating,     setUpdating]     = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setDataLoading(true);
    const { data, error } = await supabase
      .from('bug_reports')
      .select(`id, title, description, steps_to_reproduce, status, priority, report_type, created_at, reporter_id`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(
        data.map((r: any) => ({
          ...r,
          username: null,
        }))
      );
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchReports();
  }, [authed, fetchReports]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      setAuthError('Incorrect email or password.');
      setAuthLoading(false);
      return;
    }

    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (!adminRow) {
      await supabase.auth.signOut();
      setAuthError('You do not have admin access.');
      setAuthLoading(false);
      return;
    }

    setAuthed(true);
    setAuthLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setAuthed(false);
    setReports([]);
    setEmail('');
    setPassword('');
  }

  async function updateStatus(id: string, status: Status) {
    setUpdating(id);
    await supabase.from('bug_reports').update({ status }).eq('id', id);
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
    setUpdating(null);
  }

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="block text-white/40 text-sm mb-8 hover:text-white/70 transition-colors">
            &larr; Back
          </Link>
          <h1 className="text-2xl font-black mb-1">Admin</h1>
          <p className="text-white/40 text-sm mb-8">Tatūlogue dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/15 focus:border-violet-500 focus:outline-none text-black placeholder-gray-400"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/15 focus:border-violet-500 focus:outline-none text-black placeholder-gray-400"
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition-colors disabled:opacity-50"
            >
              {authLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = reports.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status      === statusFilter;
    const matchType   = typeFilter   === 'all' || r.report_type === typeFilter;
    return matchStatus && matchType;
  });

  const counts = {
    open:     reports.filter((r) => r.status === 'open').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    closed:   reports.filter((r) => r.status === 'closed').length,
    critical: reports.filter((r) => r.priority === 'critical' && r.status === 'open').length,
    bugs:     reports.filter((r) => r.report_type === 'bug').length,
    features: reports.filter((r) => r.report_type === 'feature_request').length,
  };

  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/50 text-sm hover:text-white transition-colors">&larr; Tatūlogue</Link>
        <h1 className="font-bold">Admin Dashboard</h1>
        <button onClick={handleSignOut} className="text-white/30 text-sm hover:text-white/60 transition-colors">
          Sign out
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-10">
          {[
            { label: 'Open',      value: counts.open,     color: 'text-red-400' },
            { label: 'Resolved',  value: counts.resolved, color: 'text-green-400' },
            { label: 'Closed',    value: counts.closed,   color: 'text-white/40' },
            { label: 'Critical',  value: counts.critical, color: 'text-red-300' },
            { label: 'Bugs',      value: counts.bugs,     color: 'text-orange-300' },
            { label: 'Features',  value: counts.features, color: 'text-violet-400' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-3">
          {(['all', 'open', 'resolved', 'closed'] as const).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                statusFilter === s ? 'bg-violet-600 border-violet-600 text-white' : 'border-white/15 text-white/50 hover:border-white/30'
              }`}>
              {s === 'all' ? 'All status' : STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {(['all', 'bug', 'feature_request'] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                typeFilter === t ? 'bg-violet-600 border-violet-600 text-white' : 'border-white/15 text-white/50 hover:border-white/30'
              }`}>
              {t === 'all' ? 'All types' : t === 'bug' ? '🐛 Bugs' : '✨ Feature requests'}
            </button>
          ))}
        </div>

        {/* Report list */}
        {dataLoading ? (
          <p className="text-white/30 text-sm text-center py-20">Loading reports...</p>
        ) : filtered.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-20">No reports match this filter.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-xl border border-white/8 bg-white/[0.02] hover:border-white/15 transition-colors">
                {/* Row */}
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-semibold ${PRIORITY_COLOR[r.priority]}`}>
                          [{r.priority.toUpperCase()}]
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${r.report_type === 'bug' ? 'text-orange-300 border-orange-300/20 bg-orange-300/10' : 'text-violet-400 border-violet-400/20 bg-violet-400/10'}`}>
                          {r.report_type === 'bug' ? 'Bug' : 'Feature'}
                        </span>
                        {r.username && <span className="text-white/25 text-xs">@{r.username}</span>}
                        <span className="text-white/20 text-xs">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <h3 className="font-semibold text-white">{r.title}</h3>
                      <p className="text-white/50 text-sm mt-1 line-clamp-2 leading-relaxed">{r.description}</p>
                    </div>
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[r.status].color}`}>
                      {STATUS_CONFIG[r.status].label}
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === r.id && (
                  <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-3">
                    {r.steps_to_reproduce && (
                      <div>
                        <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-1">Steps to reproduce</p>
                        <p className="text-white/70 text-sm whitespace-pre-wrap">{r.steps_to_reproduce}</p>
                      </div>
                    )}
                    {/* Status update */}
                    <div>
                      <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Update status</p>
                      <div className="flex gap-2 flex-wrap">
                        {(['open', 'resolved', 'closed'] as Status[]).map((s) => (
                          <button
                            key={s}
                            disabled={r.status === s || updating === r.id}
                            onClick={() => updateStatus(r.id, s)}
                            className={`px-4 py-1.5 rounded-full text-sm border transition-colors disabled:opacity-40 ${
                              r.status === s
                                ? STATUS_CONFIG[s].color
                                : 'border-white/15 text-white/50 hover:border-white/40'
                            }`}
                          >
                            {updating === r.id ? '...' : STATUS_CONFIG[s].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p className="text-white/20 text-xs text-center mt-10">{filtered.length} of {reports.length} reports</p>
      </div>
    </main>
  );
}
