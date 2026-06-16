'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import { fetchWaitlist } from '../../../lib/admin/queries';
import type { WaitlistEntry } from '../../../lib/admin/types';

type AccountFilter = 'all' | 'artist' | 'enthusiast';

const ACCOUNT_FILTERS: AccountFilter[] = ['all', 'artist', 'enthusiast'];

const ACCOUNT_LABELS: Record<AccountFilter, string> = {
  all: 'All',
  artist: 'Artists',
  enthusiast: 'Enthusiasts',
};

const ACCOUNT_BADGE: Record<string, string> = {
  artist: 'text-violet-300 bg-violet-400/10 border-violet-400/20',
  enthusiast: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
};

function pill(activeState: boolean): string {
  return `px-4 py-1.5 rounded-full text-sm border transition-colors ${
    activeState
      ? 'bg-violet-600 border-violet-600 text-white'
      : 'border-white/15 text-white/50 hover:border-white/30'
  }`;
}

function fullName(entry: WaitlistEntry): string {
  return [entry.first_name, entry.last_name].filter(Boolean).join(' ').trim();
}

function toCsv(entries: WaitlistEntry[]): string {
  const header = ['First name', 'Last name', 'Email', 'City', 'State', 'Account type', 'Joined'];
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const rows = entries.map((e) =>
    [
      e.first_name,
      e.last_name ?? '',
      e.email,
      e.city ?? '',
      e.state,
      e.account_type,
      new Date(e.created_at).toISOString(),
    ]
      .map((v) => escape(String(v)))
      .join(',')
  );
  return [header.map(escape).join(','), ...rows].join('\n');
}

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [accountFilter, setAccountFilter] = useState<AccountFilter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;
    fetchWaitlist().then((data) => {
      if (!active) return;
      setEntries(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return entries.filter((e) => {
      const matchAccount = accountFilter === 'all' || e.account_type === accountFilter;
      if (!matchAccount) return false;
      if (!query) return true;
      const haystack = [fullName(e), e.email, e.state, e.city ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [entries, accountFilter, search]);

  const stats = useMemo(() => {
    const artists = entries.filter((e) => e.account_type === 'artist').length;
    const enthusiasts = entries.filter((e) => e.account_type === 'enthusiast').length;
    const states = new Set(entries.map((e) => e.state).filter(Boolean)).size;
    return [
      { label: 'Total', value: entries.length, color: 'text-white' },
      { label: 'Artists', value: artists, color: 'text-violet-300' },
      { label: 'Enthusiasts', value: enthusiasts, color: 'text-amber-300' },
      { label: 'States', value: states, color: 'text-white/60' },
    ];
  }, [entries]);

  function handleExport() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell active="waitlist" title="Waitlist">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {ACCOUNT_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setAccountFilter(f)}
                  className={pill(accountFilter === f)}
                >
                  {ACCOUNT_LABELS[f]}
                </button>
              ))}
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email, location…"
                className="w-full max-w-xs rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleExport}
                disabled={filtered.length === 0}
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
              >
                Export CSV
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-white/40">
              No signups match this filter.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-xs uppercase tracking-wider text-white/40">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Type</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                    >
                      <td className="px-4 py-3 font-medium text-white">{fullName(e) || '—'}</td>
                      <td className="px-4 py-3 text-white/60">
                        <a href={`mailto:${e.email}`} className="hover:text-white hover:underline">
                          {e.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-white/60">
                        {[e.city, e.state].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs capitalize ${
                            ACCOUNT_BADGE[e.account_type] ??
                            'text-white/50 bg-white/5 border-white/10'
                          }`}
                        >
                          {e.account_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/40">
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-10 text-center text-xs text-white/20">
            {filtered.length} of {entries.length} signups
          </p>
        </>
      )}
    </AdminShell>
  );
}
