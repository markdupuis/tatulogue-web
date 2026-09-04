'use client';

import { useEffect, useState, type FormEvent } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import { createAffiliate, fetchAffiliateStats } from '../../../lib/admin/queries';
import type { AffiliateStat } from '../../../lib/admin/types';

function affiliateLink(code: string): string {
  return `https://tatulogue.com/get/${code}`;
}

export default function AffiliatesPage() {
  const [stats, setStats] = useState<AffiliateStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  async function handleCopy(affiliateCode: string) {
    try {
      await navigator.clipboard.writeText(affiliateLink(affiliateCode));
      setCopiedCode(affiliateCode);
      setTimeout(() => setCopiedCode((c) => (c === affiliateCode ? null : c)), 1500);
    } catch {
      // Clipboard API can fail without a secure context / permission --
      // nothing useful to do beyond leaving the button unchanged.
    }
  }

  function load() {
    setLoading(true);
    fetchAffiliateStats().then((data) => {
      setStats(data);
      setLoading(false);
    });
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim()) return;
    setCreating(true);
    setCreateError(null);
    const ok = await createAffiliate(code, name);
    setCreating(false);
    if (!ok) {
      setCreateError('Could not create affiliate -- code may already be in use.');
      return;
    }
    setCode('');
    setName('');
    load();
  }

  const totals = stats.reduce(
    (acc, s) => ({
      clicks: acc.clicks + s.clicks,
      installs: acc.installs + s.installs,
      signups: acc.signups + s.signups,
      unconfirmed: acc.unconfirmed + s.unconfirmedSignups,
    }),
    { clicks: 0, installs: 0, signups: 0, unconfirmed: 0 }
  );

  return (
    <AdminShell active="affiliates" title="Affiliates">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-black text-white">{totals.clicks}</p>
              <p className="mt-1 text-xs text-white/40">Total Clicks</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-black text-white">{totals.installs}</p>
              <p className="mt-1 text-xs text-white/40">Installs</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-black text-white">{totals.signups}</p>
              <p className="mt-1 text-xs text-white/40">Signups</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4 text-center">
              <p className="text-2xl font-black text-amber-300">{totals.unconfirmed}</p>
              <p className="mt-1 text-xs text-white/40">Unconfirmed</p>
            </div>
          </div>

          <form
            onSubmit={handleCreate}
            className="mb-8 flex flex-wrap items-end gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40">Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. john123"
                required
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-white/40">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. John Smith"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {creating ? 'Adding…' : 'Add Affiliate'}
            </button>
            {createError && <p className="text-sm text-red-400">{createError}</p>}
            <p className="w-full text-xs text-white/30">
              Link to share: tatulogue.com/get/{code || '{code}'}
            </p>
          </form>

          <div className="overflow-x-auto rounded-xl border border-white/8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-white/40">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Link</th>
                  <th className="px-4 py-3 text-right">Clicks</th>
                  <th className="px-4 py-3 text-right">Installs</th>
                  <th className="px-4 py-3 text-right">Signups</th>
                  <th className="px-4 py-3 text-right">Confirmed</th>
                  <th className="px-4 py-3 text-right">Unconfirmed</th>
                  <th className="px-4 py-3 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {stats.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-white/30">
                      No affiliates yet -- add one above.
                    </td>
                  </tr>
                ) : (
                  stats.map((s) => (
                    <tr key={s.code} className="border-b border-white/5 text-white/80">
                      <td className="px-4 py-3 font-mono text-violet-300">{s.code}</td>
                      <td className="px-4 py-3">{s.name ?? '—'}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleCopy(s.code)}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 hover:border-white/30 hover:text-white"
                        >
                          {copiedCode === s.code ? 'Copied!' : 'Copy link'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">{s.clicks}</td>
                      <td className="px-4 py-3 text-right">{s.installs}</td>
                      <td className="px-4 py-3 text-right">{s.signups}</td>
                      <td className="px-4 py-3 text-right text-emerald-400">{s.confirmedSignups}</td>
                      <td className="px-4 py-3 text-right text-amber-300">{s.unconfirmedSignups}</td>
                      <td className="px-4 py-3 text-right">{s.conversionPct.toFixed(1)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
