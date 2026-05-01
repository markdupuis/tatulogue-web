'use client';

import { useState } from 'react';
import Link from 'next/link';

// TODO: Replace password gate with Supabase Auth session check
// TODO: Replace MOCK_BUGS with real Supabase query on bugs table

type BugStatus = 'open' | 'in_progress' | 'fixed' | 'wont_fix';

interface Bug {
  id: string;
  title: string;
  description: string;
  status: BugStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reported_at: string;
  reporter: string;
}

const MOCK_BUGS: Bug[] = [
  {
    id: 'bug-001',
    title: 'Feed images not loading on slow connections',
    description: 'Images in the main feed fail to load when on 3G or slower. Placeholder never replaced.',
    status: 'in_progress',
    priority: 'high',
    reported_at: '2026-04-28',
    reporter: 'markdupuis',
  },
  {
    id: 'bug-002',
    title: 'Artist search returns 0 results on first open',
    description: 'Search screen loads empty on first open. Requires typing then clearing to show results.',
    status: 'open',
    priority: 'medium',
    reported_at: '2026-04-26',
    reporter: 'charlie',
  },
  {
    id: 'bug-003',
    title: 'Profile photo upload crashes on Android 12',
    description: 'Tapping the avatar in edit profile causes a crash on Android 12 devices.',
    status: 'open',
    priority: 'critical',
    reported_at: '2026-04-25',
    reporter: 'eric',
  },
  {
    id: 'bug-004',
    title: 'Dark mode flicker on app launch',
    description: 'Brief white flash visible on app cold start before theme loads.',
    status: 'fixed',
    priority: 'low',
    reported_at: '2026-04-20',
    reporter: 'markdupuis',
  },
];

const STATUS_CONFIG: Record<BugStatus, { label: string; color: string }> = {
  open: { label: 'Open', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  in_progress: { label: 'In Progress', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  fixed: { label: 'Fixed', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  wont_fix: { label: "Won't Fix", color: 'text-white/40 bg-white/5 border-white/10' },
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: 'text-red-300',
  high: 'text-orange-300',
  medium: 'text-yellow-300',
  low: 'text-white/40',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [filter, setFilter] = useState<BugStatus | 'all'>('all');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // TODO: replace with Supabase Auth session check
    if (password === 'tatulogue-admin') {
      setAuthed(true);
    } else {
      alert('Incorrect password');
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#07070d] text-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="block text-white/40 text-sm mb-8 hover:text-white/70 transition-colors">← Back</Link>
          <h1 className="text-2xl font-black mb-1">Admin</h1>
          <p className="text-white/40 text-sm mb-8">Tatūlogue bug dashboard</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white border border-white/15 focus:border-violet-500 focus:outline-none text-black placeholder-gray-400"
            />
            <button type="submit" className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold transition-colors">
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  const filtered = filter === 'all' ? MOCK_BUGS : MOCK_BUGS.filter((b) => b.status === filter);

  return (
    <main className="min-h-screen bg-[#07070d] text-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/" className="text-white/50 text-sm hover:text-white transition-colors">← Tatūlogue</Link>
        <h1 className="font-bold">Admin Dashboard</h1>
        <button onClick={() => setAuthed(false)} className="text-white/30 text-sm hover:text-white/60 transition-colors">Sign out</button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Open', value: MOCK_BUGS.filter((b) => b.status === 'open').length, color: 'text-red-400' },
            { label: 'In Progress', value: MOCK_BUGS.filter((b) => b.status === 'in_progress').length, color: 'text-yellow-400' },
            { label: 'Fixed', value: MOCK_BUGS.filter((b) => b.status === 'fixed').length, color: 'text-green-400' },
            { label: 'Critical', value: MOCK_BUGS.filter((b) => b.priority === 'critical').length, color: 'text-red-300' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'open', 'in_progress', 'fixed', 'wont_fix'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                filter === s ? 'bg-violet-600 border-violet-600 text-white' : 'border-white/15 text-white/50 hover:border-white/30'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_CONFIG[s as BugStatus]?.label ?? s}
            </button>
          ))}
        </div>

        {/* Bug list */}
        <div className="space-y-3">
          {filtered.map((bug) => (
            <div key={bug.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:border-white/15 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold ${PRIORITY_COLOR[bug.priority]}`}>[{bug.priority.toUpperCase()}]</span>
                    <span className="text-white/20 text-xs">{bug.id}</span>
                  </div>
                  <h3 className="font-semibold text-white">{bug.title}</h3>
                  <p className="text-white/50 text-sm mt-1 leading-relaxed">{bug.description}</p>
                  <p className="text-white/25 text-xs mt-2">Reported {bug.reported_at} by @{bug.reporter}</p>
                </div>
                <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_CONFIG[bug.status].color}`}>
                  {STATUS_CONFIG[bug.status].label}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/20 text-xs text-center mt-10">
          TODO: Wire to Supabase bugs table + replace password gate with Supabase Auth
        </p>
      </div>
    </main>
  );
}
