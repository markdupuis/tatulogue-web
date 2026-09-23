'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AdminShell from '../../../components/admin/AdminShell';
import CrmContactForm from '../../../components/admin/CrmContactForm';
import CrmContactPanel from '../../../components/admin/CrmContactPanel';
import {
  CONTACT_TYPES,
  PIPELINE_STAGES,
  createCrmContact,
  fetchCrmContacts,
  fetchCrmOwners,
  getCurrentAdminId,
  isOverdue,
  labelFor,
  type CrmContact,
  type CrmContactInput,
  type CrmOwner,
} from '../../../lib/admin/crm';

const STAGE_COLORS: Record<string, string> = {
  new: 'bg-white/10 text-white/70',
  contacted: 'bg-sky-500/15 text-sky-300',
  responded: 'bg-cyan-500/15 text-cyan-300',
  interested: 'bg-amber-500/15 text-amber-300',
  committed: 'bg-violet-500/20 text-violet-300',
  onboarded: 'bg-emerald-500/15 text-emerald-300',
  not_interested: 'bg-red-500/15 text-red-300',
  dormant: 'bg-white/5 text-white/40',
};

function formatDate(iso: string | null): string {
  if (!iso) return '';
  return new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function chipClass(active: boolean): string {
  return `rounded-full border px-3 py-1 text-xs ${
    active ? 'border-violet-400 bg-violet-600/20 text-violet-200' : 'border-white/10 text-white/50 hover:text-white'
  }`;
}

export default function CrmPage() {
  const [contacts, setContacts] = useState<CrmContact[]>([]);
  const [owners, setOwners] = useState<CrmOwner[]>([]);
  const [adminId, setAdminId] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [mineOnly, setMineOnly] = useState(false);
  const [overdueOnly, setOverdueOnly] = useState(false);
  const [convertedOnly, setConvertedOnly] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([fetchCrmContacts(), fetchCrmOwners(), getCurrentAdminId()]).then(([rows, ownerRows, id]) => {
      if (!active) return;
      setContacts(rows);
      setOwners(ownerRows);
      setAdminId(id ?? '');
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const scoped = useMemo(() => (mineOnly ? contacts.filter((c) => c.owner_user_id === adminId) : contacts), [contacts, mineOnly, adminId]);

  const summary = useMemo(() => {
    const contacted = scoped.filter((c) => c.last_contacted_at).length;
    const converted = scoped.filter((c) => c.linked_user_id).length;
    const verified = scoped.filter((c) => c.converted_verified_at).length;
    const pct = scoped.length ? Math.round((converted / scoped.length) * 100) : 0;
    return { total: scoped.length, contacted, converted, verified, pct };
  }, [scoped]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return scoped.filter((c) => {
      if (typeFilter && c.contact_type !== typeFilter) return false;
      if (stageFilter && c.pipeline_stage !== stageFilter) return false;
      if (overdueOnly && !isOverdue(c)) return false;
      if (convertedOnly && !c.linked_user_id) return false;
      if (!term) return true;
      return [c.display_name, c.shop_name, c.instagram, c.email]
        .filter((v): v is string => Boolean(v))
        .some((v) => v.toLowerCase().includes(term));
    });
  }, [scoped, search, typeFilter, stageFilter, overdueOnly, convertedOnly]);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const handleChanged = useCallback((updated: CrmContact) => {
    setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }, []);

  function handleDeleted(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setSelectedId(null);
  }

  async function handleCreate(input: CrmContactInput) {
    const created = await createCrmContact(input);
    if (!created) {
      window.alert('Could not create the contact. Check the console for details.');
      return;
    }
    setContacts((prev) => [created, ...prev]);
    setShowNew(false);
    setSelectedId(created.id);
  }

  function ownerName(id: string): string {
    return owners.find((o) => o.id === id)?.name ?? '?';
  }

  return (
    <AdminShell active="crm" title="CRM">
      <div className="mb-4 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-white/70">
        Contacts {summary.total} · Contacted {summary.contacted} · Converted {summary.converted} ({summary.pct}%) · Verified artists{' '}
        {summary.verified}
        {mineOnly && <span className="ml-2 text-white/40">(mine only)</span>}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, shop, Instagram or email…"
          className="w-full max-w-sm rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
        />
        <button type="button" onClick={() => setMineOnly((v) => !v)} className={chipClass(mineOnly)}>Mine</button>
        <button type="button" onClick={() => setOverdueOnly((v) => !v)} className={chipClass(overdueOnly)}>Overdue</button>
        <button type="button" onClick={() => setConvertedOnly((v) => !v)} className={chipClass(convertedOnly)}>Converted</button>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="ml-auto rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          + New contact
        </button>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTypeFilter('')} className={chipClass(!typeFilter)}>All types</button>
        {CONTACT_TYPES.map((t) => (
          <button key={t} type="button" onClick={() => setTypeFilter(typeFilter === t ? '' : t)} className={chipClass(typeFilter === t)}>
            {labelFor(t)}
          </button>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => setStageFilter('')} className={chipClass(!stageFilter)}>All stages</button>
        {PIPELINE_STAGES.map((s) => (
          <button key={s} type="button" onClick={() => setStageFilter(stageFilter === s ? '' : s)} className={chipClass(stageFilter === s)}>
            {labelFor(s)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/40">Loading contacts…</p>
      ) : filtered.length === 0 ? (
        <p className="text-white/40">{contacts.length === 0 ? 'No contacts yet. Add the first one.' : 'No contacts match those filters.'}</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/8">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase text-white/40">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Owner</th>
                <th className="px-4 py-3 font-medium">Last contacted</th>
                <th className="px-4 py-3 font-medium">Next follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} onClick={() => setSelectedId(c.id)} className="cursor-pointer border-t border-white/8 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{c.display_name}</div>
                    {c.shop_name && <div className="text-xs text-white/40">{c.shop_name}</div>}
                  </td>
                  <td className="px-4 py-3 text-white/60">{labelFor(c.contact_type)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STAGE_COLORS[c.pipeline_stage]}`}>{labelFor(c.pipeline_stage)}</span>
                    {c.linked_user_id && <span className="ml-2 text-xs text-emerald-400">Linked</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white" title={ownerName(c.owner_user_id)}>
                      {initials(ownerName(c.owner_user_id))}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/50">{c.last_contacted_at ? formatDate(c.last_contacted_at) : 'Never'}</td>
                  <td className={`px-4 py-3 ${isOverdue(c) ? 'font-medium text-red-400' : 'text-white/50'}`}>
                    {c.next_follow_up_at ? formatDate(c.next_follow_up_at) : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 p-4" onClick={() => setShowNew(false)}>
          <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0c14] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">New contact</h2>
              <button type="button" onClick={() => setShowNew(false)} className="text-sm text-white/40 hover:text-white">Cancel</button>
            </div>
            <CrmContactForm owners={owners} defaultOwnerId={adminId} submitLabel="Create contact" onSubmit={handleCreate} />
          </div>
        </div>
      )}

      {selected && (
        <CrmContactPanel
          key={selected.id}
          contact={selected}
          owners={owners}
          onClose={() => setSelectedId(null)}
          onChanged={handleChanged}
          onDeleted={handleDeleted}
        />
      )}
    </AdminShell>
  );
}
