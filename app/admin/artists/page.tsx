'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import {
  fetchArtistDocPaths,
  fetchPendingArtists,
  getArtistDocSignedUrl,
  setArtistVerificationStatus,
} from '../../../lib/admin/queries';
import type { ArtistDocPaths, PendingArtist } from '../../../lib/admin/types';

const DOC_LABELS: { key: keyof ArtistDocPaths; label: string }[] = [
  { key: 'id_doc', label: 'ID Document' },
  { key: 'license_doc', label: 'License' },
  { key: 'certificate_doc', label: 'Bloodborne Pathogen Certificate' },
];

function displayName(a: PendingArtist): string {
  return a.professional_name || a.full_name || a.username || 'Unnamed artist';
}

export default function ArtistApprovalsPage() {
  const [artists, setArtists] = useState<PendingArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [docsByArtist, setDocsByArtist] = useState<Record<string, ArtistDocPaths>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchPendingArtists().then((data) => {
      if (!active) return;
      setArtists(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  async function loadDocs(artistId: string) {
    if (docsByArtist[artistId]) return;
    const paths = await fetchArtistDocPaths(artistId);
    setDocsByArtist((prev) => ({ ...prev, [artistId]: paths }));
  }

  async function openDoc(path: string | null) {
    if (!path) return;
    const url = await getArtistDocSignedUrl(path);
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  }

  async function decide(artist: PendingArtist, status: 'verified' | 'rejected') {
    setBusyId(artist.id);
    const ok = await setArtistVerificationStatus(artist.id, status);
    if (ok) {
      setArtists((prev) => prev.filter((a) => a.id !== artist.id));
    }
    setBusyId(null);
  }

  return (
    <AdminShell active="artists" title="Artist Approvals">
      {loading ? (
        <p className="text-white/40">Loading…</p>
      ) : artists.length === 0 ? (
        <p className="py-20 text-center text-sm text-white/40">
          No pending artist verifications. All caught up.
        </p>
      ) : (
        <div className="space-y-4">
          {artists.map((a) => {
            const docs = docsByArtist[a.id];
            return (
              <div
                key={a.id}
                className="rounded-xl border border-white/8 bg-white/[0.03] p-5"
                onMouseEnter={() => loadDocs(a.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {a.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.avatar}
                        alt=""
                        className="h-11 w-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-white/10" />
                    )}
                    <div>
                      <p className="font-medium text-white">{displayName(a)}</p>
                      <p className="text-xs text-white/40">
                        @{a.username ?? 'unknown'}
                        {a.business_address ? ` · ${a.business_address}` : ''}
                      </p>
                      {a.specializations.length > 0 && (
                        <p className="mt-1 text-xs text-white/50">
                          {a.specializations.join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-xs text-white/30">
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {DOC_LABELS.map(({ key, label }) => {
                    const path = docs?.[key];
                    const missing = docs && !path;
                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={!docs || missing}
                        onClick={() => openDoc(docs?.[key] ?? null)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                          missing
                            ? 'cursor-not-allowed border-white/5 text-white/20'
                            : 'border-white/15 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {label}
                        {missing ? ' (not provided)' : ' ↗'}
                      </button>
                    );
                  })}
                  {!docs && (
                    <span className="px-3 py-1.5 text-xs text-white/30">Loading documents…</span>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    type="button"
                    disabled={busyId === a.id}
                    onClick={() => decide(a, 'rejected')}
                    className="flex-1 rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white disabled:opacity-50"
                  >
                    Reject (reverts to enthusiast)
                  </button>
                  <button
                    type="button"
                    disabled={busyId === a.id}
                    onClick={() => decide(a, 'verified')}
                    className="flex-1 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                  >
                    Approve
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
