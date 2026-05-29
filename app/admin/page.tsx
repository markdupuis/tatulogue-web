'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../components/admin/AdminShell';
import { fetchOverviewMetrics } from '../../lib/admin/queries';
import type { OverviewMetrics } from '../../lib/admin/types';

const METRIC_LABELS: Record<keyof OverviewMetrics, string> = {
  users: 'Users',
  posts: 'Posts',
  comments: 'Comments',
  openBugs: 'Open Bugs',
  totalEvents: 'Total Events',
  searches: 'Searches',
};

const METRIC_ORDER: (keyof OverviewMetrics)[] = [
  'users',
  'posts',
  'comments',
  'openBugs',
  'totalEvents',
  'searches',
];

const QUICK_LINKS: { href: string; label: string }[] = [
  { href: '/admin/bugs', label: 'Bug Reports' },
  { href: '/admin/roadmap', label: 'Roadmap' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/analytics', label: 'Analytics' },
];

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchOverviewMetrics().then((data) => {
      if (!active) return;
      setMetrics(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminShell active="overview" title="Overview">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {METRIC_ORDER.map((key) => (
              <div
                key={key}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
              >
                <div className="text-3xl font-black">
                  {(metrics?.[key] ?? 0).toLocaleString()}
                </div>
                <div className="mt-1 text-sm text-white/40">{METRIC_LABELS[key]}</div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold text-white/40">Quick links</h2>
            <div className="flex flex-wrap gap-3">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-2 text-sm text-violet-400 hover:bg-white/[0.04]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
