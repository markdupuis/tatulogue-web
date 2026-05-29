'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  fetchBangers,
  fetchEventCounts,
  fetchPostStats,
  fetchScreenVisits,
  fetchSearchQueries,
} from '../../../lib/admin/queries';
import type {
  EventCountStat,
  PostStat,
  ScreenVisitStat,
  SearchQueryStat,
} from '../../../lib/admin/types';

const SEARCH_LIMIT = 50;
const SEARCH_DISPLAY = 25;
const POSTS_LIMIT = 20;
const BANGERS_LIMIT = 10;

const AUTHOR_CHIP_COLORS: Record<string, string> = {
  admin: 'text-violet-400',
  artist: 'text-orange-300',
};

const DEFAULT_AUTHOR_COLOR = 'text-white/40';
const SECTION_HEADER = 'text-sm font-semibold text-white/40 uppercase tracking-wider mb-3';
const CARD = 'rounded-xl border border-white/8 bg-white/[0.03] p-4';

function authorColor(authorType: string): string {
  return AUTHOR_CHIP_COLORS[authorType] ?? DEFAULT_AUTHOR_COLOR;
}

function maxCount<T>(rows: T[], pick: (row: T) => number): number {
  return rows.reduce((max, row) => Math.max(max, pick(row)), 0);
}

function barWidth(count: number, max: number): string {
  if (max <= 0) return '0%';
  return `${(count / max) * 100}%`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function AuthorChip({ authorType }: { authorType: string }) {
  return (
    <span className={`text-xs font-medium uppercase ${authorColor(authorType)}`}>
      {authorType}
    </span>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-12">{children}</section>;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [searches, setSearches] = useState<SearchQueryStat[]>([]);
  const [events, setEvents] = useState<EventCountStat[]>([]);
  const [screens, setScreens] = useState<ScreenVisitStat[]>([]);
  const [posts, setPosts] = useState<PostStat[]>([]);
  const [bangers, setBangers] = useState<PostStat[]>([]);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchSearchQueries(SEARCH_LIMIT),
      fetchEventCounts(),
      fetchScreenVisits(),
      fetchPostStats(POSTS_LIMIT),
      fetchBangers(BANGERS_LIMIT),
    ]).then(([searchRows, eventRows, screenRows, postRows, bangerRows]) => {
      if (!active) return;
      setSearches(searchRows);
      setEvents(eventRows);
      setScreens(screenRows);
      setPosts(postRows);
      setBangers(bangerRows);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <AdminShell active="analytics" title="Analytics">
        <p className="text-white/40">Loading analytics…</p>
      </AdminShell>
    );
  }

  const topSearches = searches.slice(0, SEARCH_DISPLAY);
  const maxSearch = maxCount(topSearches, (r) => r.count);
  const maxScreen = maxCount(screens, (r) => r.count);

  return (
    <AdminShell active="analytics" title="Analytics">
      {/* 1. What people search */}
      <Section>
        <h2 className={SECTION_HEADER}>What people search</h2>
        {topSearches.length === 0 ? (
          <p className="text-white/40">No searches yet.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto rounded-xl border border-white/8 bg-white/[0.02] p-4">
            {topSearches.map((row, i) => (
              <div key={`${row.query}-${i}`} className="flex items-center gap-3">
                <div className="h-6 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                  <div
                    className="flex h-full items-center rounded-md bg-violet-600 px-2"
                    style={{ width: barWidth(row.count, maxSearch) }}
                  >
                    <span className="truncate text-xs text-white">{row.query}</span>
                  </div>
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-white/60">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 2. Screen visits */}
      <Section>
        <h2 className={SECTION_HEADER}>Screen visits</h2>
        {screens.length === 0 ? (
          <p className="text-white/40">No screen visits yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {screens.map((row) => (
              <div key={row.screen} className={CARD}>
                <p className="text-sm text-white/60">{row.screen}</p>
                <p className="mt-1 text-2xl font-semibold text-white">{row.count}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className="h-full rounded-full bg-violet-600"
                    style={{ width: barWidth(row.count, maxScreen) }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 3. Top posts */}
      <Section>
        <h2 className={SECTION_HEADER}>Top posts</h2>
        {posts.length === 0 ? (
          <p className="text-white/40">No posts yet.</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/8">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase text-white/40">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">❤</th>
                  <th className="px-4 py-3 font-medium">💬</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-white/8">
                    <td className="max-w-xs truncate px-4 py-3 text-white/80">{post.title}</td>
                    <td className="px-4 py-3">
                      <AuthorChip authorType={post.author_type} />
                    </td>
                    <td className="px-4 py-3 text-white/80">{post.likes}</td>
                    <td className="px-4 py-3 text-white/80">{post.comments}</td>
                    <td className="px-4 py-3 text-white/40">{formatDate(post.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {/* 4. Bangers */}
      <Section>
        <h2 className={SECTION_HEADER}>Bangers</h2>
        <p className="-mt-2 mb-3 text-sm text-white/40">Top posts by likes.</p>
        {bangers.length === 0 ? (
          <p className="text-white/40">No bangers yet.</p>
        ) : (
          <div className="space-y-2">
            {bangers.map((post, i) => (
              <div key={post.id} className={`flex items-center gap-4 ${CARD}`}>
                <span className="w-10 shrink-0 text-lg font-semibold text-white/40">
                  #{i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-white/80">{post.title}</span>
                <span className="shrink-0 text-lg font-semibold text-violet-400">
                  {post.likes} ❤
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* 5. All events */}
      <Section>
        <h2 className={SECTION_HEADER}>All events</h2>
        {events.length === 0 ? (
          <p className="text-white/40">No events yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-1 rounded-xl border border-white/8 bg-white/[0.02] p-4 sm:grid-cols-2">
            {events.map((row) => (
              <div
                key={row.event}
                className="flex items-center justify-between border-b border-white/8 py-1.5 text-xs"
              >
                <span className="truncate text-white/40">{row.event}</span>
                <span className="text-white/60">{row.count}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </AdminShell>
  );
}
