'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import { fetchUsers, sendPasswordReset } from '../../../lib/admin/queries';
import type { AdminUser } from '../../../lib/admin/types';

type ResetStatus = 'idle' | 'sending' | 'sent' | 'error';

const TYPE_CHIP_COLORS: Record<string, string> = {
  admin: 'text-violet-400',
  artist: 'text-orange-300',
};

const DEFAULT_TYPE_COLOR = 'text-white/40';

function typeColor(userType: string): string {
  return TYPE_CHIP_COLORS[userType] ?? DEFAULT_TYPE_COLOR;
}

function initial(user: AdminUser): string {
  const source = user.username || user.full_name || '?';
  return source.charAt(0).toUpperCase();
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function Avatar({ user }: { user: AdminUser }) {
  if (user.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.avatar}
        alt=""
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
      {initial(user)}
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortByPosts, setSortByPosts] = useState(false);
  const [resetStatus, setResetStatus] = useState<Record<string, ResetStatus>>({});

  useEffect(() => {
    let active = true;
    fetchUsers().then((rows) => {
      if (active) {
        setUsers(rows);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const matched = term
      ? users.filter((u) =>
          [u.username, u.full_name, u.email]
            .filter((v): v is string => Boolean(v))
            .some((v) => v.toLowerCase().includes(term))
        )
      : users;
    if (!sortByPosts) return matched;
    return [...matched].sort((a, b) => b.post_count - a.post_count);
  }, [users, search, sortByPosts]);

  async function handleResetPassword(user: AdminUser) {
    if (!user.email) return;
    if (!window.confirm(`Send a password reset email to ${user.email}?`)) return;

    setResetStatus((prev) => ({ ...prev, [user.id]: 'sending' }));
    const result = await sendPasswordReset(user.email, user.id);
    setResetStatus((prev) => ({ ...prev, [user.id]: result.ok ? 'sent' : 'error' }));

    if (result.ok) {
      setTimeout(() => {
        setResetStatus((prev) => ({ ...prev, [user.id]: 'idle' }));
      }, 4000);
    }
  }

  function resetButtonLabel(status: ResetStatus | undefined): string {
    switch (status) {
      case 'sending':
        return 'Sending…';
      case 'sent':
        return 'Sent ✓';
      case 'error':
        return 'Failed — retry';
      default:
        return 'Reset Password';
    }
  }

  return (
    <AdminShell active="users" title="Users">
      <div className="mb-6 flex items-center justify-between gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search username, name, or email…"
          className="w-full max-w-sm rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
        />
        <span className="shrink-0 text-sm text-white/40">
          {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
        </span>
      </div>

      {loading ? (
        <p className="text-white/40">Loading users…</p>
      ) : filtered.length === 0 ? (
        <p className="text-white/40">No users found.</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/8">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase text-white/40">
              <tr>
                <th className="px-4 py-3 font-medium">Avatar</th>
                <th className="px-4 py-3 font-medium">Username</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">
                  <button
                    type="button"
                    onClick={() => setSortByPosts((v) => !v)}
                    className="uppercase hover:text-white"
                  >
                    Posts {sortByPosts ? '↓' : ''}
                  </button>
                </th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const status = resetStatus[user.id];
                return (
                <tr key={user.id} className="border-t border-white/8">
                  <td className="px-4 py-3">
                    <Avatar user={user} />
                  </td>
                  <td className="px-4 py-3 text-white/80">
                    {user.username ? `@${user.username}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-white/80">{user.full_name || '—'}</td>
                  <td className="px-4 py-3 text-white/60">{user.email || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium uppercase ${typeColor(user.user_type)}`}
                    >
                      {user.user_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/80">{user.post_count}</td>
                  <td className="px-4 py-3 text-white/40">{formatDate(user.created_at)}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={!user.email || status === 'sending'}
                      onClick={() => handleResetPassword(user)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        status === 'sent'
                          ? 'border-emerald-500/40 text-emerald-400'
                          : status === 'error'
                          ? 'border-red-500/40 text-red-400'
                          : 'border-white/15 text-white/70 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {resetButtonLabel(status)}
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
