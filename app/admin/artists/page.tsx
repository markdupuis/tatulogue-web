'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  fetchArtistDocPaths,
  fetchArtists,
  getArtistDocSignedUrl,
  setArtistVerificationStatus,
} from '../../../lib/admin/queries';
import type { ArtistDocPaths, ArtistRow, VerificationStatus } from '../../../lib/admin/types';

type StatusFilter = 'all' | VerificationStatus;

const STATUS_FILTERS: StatusFilter[] = ['all', 'pending', 'verified', 'rejected'];

const STATUS_LABELS: Record<StatusFilter, string> = {
  all: 'All',
  pending: 'Pending',
  verified: 'Verified',
  rejected: 'Rejected',
};

const STATUS_BADGE: Record<VerificationStatus, string> = {
  pending: 'text-amber-300 bg-amber-400/10 border-amber-400/20',
  verified: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
  rejected: 'text-red-300 bg-red-400/10 border-red-400/20',
};

const DOC_LABELS: { key: keyof ArtistDocPaths; label: string }[] = [
  { key: 'id_doc', label: 'ID' },
  { key: 'license_doc', label: 'License' },
  { key: 'certificate_doc', label: 'BBP Cert' },
];

function displayName(a: ArtistRow): string {
  return a.professional_name || a.full_name || a.username || 'Unnamed artist';
}

function pill(activeState: boolean): string {
  return `px-4 py-1.5 rounded-full text-sm border transition-colors ${
    activeState
      ? 'bg-violet-600 border-violet-600 text-white'
      : 'border-white/15 text-white/50 hover:border-white/30'
  }`;
}

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif'];

function isImagePath(path: string): boolean {
  const lower = path.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

interface DocViewerState {
  label: string;
  url: string;
  isImage: boolean;
}

function DocViewerModal({ doc, onClose }: { doc: DocViewerState; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0c0c14]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
          <p className="text-sm font-medium text-white">{doc.label}</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-black/40 p-4">
          {doc.isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doc.url} alt={doc.label} className="mx-auto max-w-full rounded-lg" />
          ) : (
            <iframe src={doc.url} title={doc.label} className="h-[70vh] w-full rounded-lg bg-white" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ArtistApprovalsPage() {
  const [artists, setArtists] = useState<ArtistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending');
  const [search, setSearch] = useState('');
  const [docsByArtist, setDocsByArtist] = useState<Record<string, ArtistDocPaths>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [viewerDoc, setViewerDoc] = useState<DocViewerState | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setLoadError(false);
    const data = await fetchArtists();
    setArtists(data);
    setLoadError(data.length === 0);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return artists.filter((a) => {
      const matchStatus = statusFilter === 'all' || a.verification_status === statusFilter;
      if (!matchStatus) return false;
      if (!query) return true;
      const haystack = [displayName(a), a.username ?? '', a.business_address ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [artists, statusFilter, search]);

  const counts = useMemo(() => {
    return {
      all: artists.length,
      pending: artists.filter((a) => a.verification_status === 'pending').length,
      verified: artists.filter((a) => a.verification_status === 'verified').length,
      rejected: artists.filter((a) => a.verification_status === 'rejected').length,
    };
  }, [artists]);

  async function toggleExpand(artistId: string) {
    const next = expandedId === artistId ? null : artistId;
    setExpandedId(next);
    if (next && !docsByArtist[artistId]) {
      const paths = await fetchArtistDocPaths(artistId);
      setDocsByArtist((prev) => ({ ...prev, [artistId]: paths }));
    }
  }

  async function openDoc(path: string | null, label: string) {
    if (!path) return;
    const url = await getArtistDocSignedUrl(path);
    if (url) setViewerDoc({ label, url, isImage: isImagePath(path) });
  }

  async function decide(artist: ArtistRow, status: VerificationStatus) {
    setBusyId(artist.id);
    const ok = await setArtistVerificationStatus(artist.id, status);
    if (ok) {
      setArtists((prev) =>
        prev.map((a) => (a.id === artist.id ? { ...a, verification_status: status } : a))
      );
    }
    setBusyId(null);
  }

  return (
    <AdminShell active="artists" title="Artist Approvals">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : loadError ? (
        <p className="py-20 text-center text-sm text-red-400">
          Couldn&apos;t load artists — check the browser console for the query error.{' '}
          <button type="button" onClick={load} className="underline">
            Retry
          </button>
        </p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  className={pill(statusFilter === f)}
                >
                  {STATUS_LABELS[f]} ({counts[f]})
                </button>
              ))}
            </div>
            <div className="flex flex-1 justify-end">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, username, location…"
                className="w-full max-w-xs rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-20 text-center text-sm text-white/40">No artists match this filter.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/8">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 text-xs uppercase tracking-wider text-white/40">
                    <th className="px-4 py-3 font-semibold">Artist</th>
                    <th className="px-4 py-3 font-semibold">Specializations</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const docs = docsByArtist[a.id];
                    const expanded = expandedId === a.id;
                    return (
                      <Fragment key={a.id}>
                        <tr
                          className="cursor-pointer border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                          onClick={() => toggleExpand(a.id)}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {a.avatar ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={a.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-white/10" />
                              )}
                              <div>
                                <p className="font-medium text-white">{displayName(a)}</p>
                                <p className="text-xs text-white/40">@{a.username ?? 'unknown'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-white/60">
                            {a.specializations.length > 0 ? a.specializations.join(' • ') : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-xs capitalize ${STATUS_BADGE[a.verification_status]}`}
                            >
                              {a.verification_status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white/40">
                            {a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex gap-2">
                              {a.verification_status !== 'verified' && (
                                <button
                                  type="button"
                                  disabled={busyId === a.id}
                                  onClick={() => decide(a, 'verified')}
                                  className="rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                              )}
                              {a.verification_status === 'pending' && (
                                <button
                                  type="button"
                                  disabled={busyId === a.id}
                                  onClick={() => decide(a, 'rejected')}
                                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              )}
                              {a.verification_status === 'verified' && (
                                <button
                                  type="button"
                                  disabled={busyId === a.id}
                                  onClick={() => decide(a, 'rejected')}
                                  className="rounded-lg border border-red-400/30 px-3 py-1.5 text-xs text-red-300 transition-colors hover:border-red-400/60 disabled:opacity-50"
                                >
                                  Revoke
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expanded && (
                          <tr className="border-b border-white/5 bg-white/[0.015]">
                            <td colSpan={5} className="px-4 py-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs text-white/40">Documents:</span>
                                {!docs ? (
                                  <span className="text-xs text-white/30">Loading…</span>
                                ) : (
                                  DOC_LABELS.map(({ key, label }) => {
                                    const path = docs[key];
                                    return (
                                      <button
                                        key={key}
                                        type="button"
                                        disabled={!path}
                                        onClick={() => openDoc(path, `${displayName(a)} — ${label}`)}
                                        className={`rounded-lg border px-3 py-1 text-xs transition-colors ${
                                          path
                                            ? 'border-white/15 text-white/70 hover:border-white/30 hover:text-white'
                                            : 'cursor-not-allowed border-white/5 text-white/20'
                                        }`}
                                      >
                                        {label}
                                        {path ? ' 👁' : ' (none)'}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-white/20">
            {filtered.length} of {artists.length} artists
          </p>
        </>
      )}
      {viewerDoc && <DocViewerModal doc={viewerDoc} onClose={() => setViewerDoc(null)} />}
    </AdminShell>
  );
}
