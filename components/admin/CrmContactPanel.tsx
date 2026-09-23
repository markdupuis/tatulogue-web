'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import {
  ACTIVITY_DIRECTIONS,
  ACTIVITY_OUTCOMES,
  ACTIVITY_TYPES,
  COMMITMENT_STATUSES,
  COMMITMENT_TYPES,
  LIKENESS_PERMISSIONS,
  PIPELINE_STAGES,
  addCrmActivity,
  addCrmCommitment,
  deleteCrmActivity,
  deleteCrmCommitment,
  deleteCrmContact,
  fetchCrmActivities,
  fetchCrmCommitments,
  fetchCrmContact,
  fetchLinkedUser,
  labelFor,
  linkContactToUser,
  searchAppUsers,
  unlinkContact,
  updateCrmContact,
  type ActivityDirection,
  type ActivityType,
  type CrmActivity,
  type CrmCommitment,
  type CrmContact,
  type CrmContactInput,
  type CrmLinkedUser,
  type CrmOwner,
} from '../../lib/admin/crm';
import CrmContactForm from './CrmContactForm';

type Tab = 'activity' | 'details' | 'commitments';

interface CrmContactPanelProps {
  contact: CrmContact;
  owners: CrmOwner[];
  onClose: () => void;
  onChanged: (contact: CrmContact) => void;
  onDeleted: (id: string) => void;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-violet-400 focus:outline-none';
const BUTTON_CLASS = 'rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50';
const GHOST_BUTTON_CLASS = 'rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.04]';
const QUICK_ACTION_ACTIVITY: Record<string, ActivityType> = {
  call: 'call',
  sms: 'sms',
  instagram: 'instagram_dm',
  email: 'email',
};

function localNowInputValue(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDate(iso: string | null): string {
  if (!iso) return 'None';
  return new Date(iso.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function ActivityLog({ contact, owners, onContactRefresh }: { contact: CrmContact; owners: CrmOwner[]; onContactRefresh: () => Promise<void> }) {
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<ActivityType>('call');
  const [direction, setDirection] = useState<ActivityDirection>('outbound');
  const [occurredAt, setOccurredAt] = useState(localNowInputValue());
  const [duration, setDuration] = useState('');
  const [outcome, setOutcome] = useState('');
  const [summary, setSummary] = useState('');
  const [referralAsked, setReferralAsked] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [signups, setSignups] = useState('0');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setActivities(await fetchCrmActivities(contact.id));
    setLoading(false);
  }, [contact.id]);

  useEffect(() => {
    load();
  }, [load]);

  function handleTypeChange(next: ActivityType) {
    setType(next);
    setDirection(next === 'note' ? 'none' : 'outbound');
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!summary.trim()) return;
    setSaving(true);
    const ok = await addCrmActivity({
      contact_id: contact.id,
      activity_type: type,
      direction,
      occurred_at: new Date(occurredAt).toISOString(),
      duration_minutes: duration ? Number(duration) : null,
      outcome: outcome || null,
      summary: summary.trim(),
      referral_asked: referralAsked,
      next_follow_up_at: followUp || null,
      signups_on_site: Number(signups) || 0,
    });
    setSaving(false);
    if (!ok) {
      window.alert('Could not save that activity. Check the console for details.');
      return;
    }
    setSummary('');
    setDuration('');
    setOutcome('');
    setReferralAsked(false);
    setFollowUp('');
    setSignups('0');
    setOccurredAt(localNowInputValue());
    await Promise.all([load(), onContactRefresh()]);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this activity?')) return;
    await deleteCrmActivity(id);
    await Promise.all([load(), onContactRefresh()]);
  }

  const showSignups = type === 'shop_visit' || type === 'convention';

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-white/40">Log activity</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select className={INPUT_CLASS} value={type} onChange={(e) => handleTypeChange(e.target.value as ActivityType)}>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>{labelFor(t)}</option>
            ))}
          </select>
          <select className={INPUT_CLASS} value={direction} onChange={(e) => setDirection(e.target.value as ActivityDirection)}>
            {ACTIVITY_DIRECTIONS.map((d) => (
              <option key={d} value={d}>{labelFor(d)}</option>
            ))}
          </select>
          <input type="datetime-local" className={`${INPUT_CLASS} col-span-2`} value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
        </div>
        <textarea
          className={`${INPUT_CLASS} min-h-[80px]`}
          placeholder="What was said or heard"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <select className={INPUT_CLASS} value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            <option value="">Outcome</option>
            {ACTIVITY_OUTCOMES.map((o) => (
              <option key={o} value={o}>{labelFor(o)}</option>
            ))}
          </select>
          <input type="number" min="0" className={INPUT_CLASS} placeholder="Minutes" value={duration} onChange={(e) => setDuration(e.target.value)} />
          <input type="date" className={INPUT_CLASS} title="Next follow-up" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
          {showSignups && (
            <input type="number" min="0" className={INPUT_CLASS} title="Signups on site" placeholder="Signups" value={signups} onChange={(e) => setSignups(e.target.value)} />
          )}
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" checked={referralAsked} onChange={(e) => setReferralAsked(e.target.checked)} />
            Referral asked
          </label>
          <button type="submit" disabled={saving || !summary.trim()} className={BUTTON_CLASS}>
            {saving ? 'Saving…' : 'Log activity'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-white/40">Loading activity…</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-white/40">No activity logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((a) => (
            <li key={a.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="text-xs text-white/50">
                  <span className="font-medium text-white/80">{labelFor(a.activity_type)}</span>
                  {a.direction !== 'none' && ` · ${labelFor(a.direction)}`}
                  {` · ${formatDateTime(a.occurred_at)}`}
                  {` · ${owners.find((o) => o.id === a.performed_by)?.name ?? 'System'}`}
                  {a.duration_minutes ? ` · ${a.duration_minutes} min` : ''}
                </div>
                <button type="button" onClick={() => handleDelete(a.id)} className="text-xs text-white/30 hover:text-red-400">
                  Delete
                </button>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/80">{a.summary}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                {a.outcome && <span className="rounded-full bg-violet-600/15 px-2 py-0.5 text-violet-300">{labelFor(a.outcome)}</span>}
                {a.referral_asked && <span className="rounded-full bg-white/8 px-2 py-0.5 text-white/60">Referral asked</span>}
                {a.signups_on_site > 0 && <span className="rounded-full bg-white/8 px-2 py-0.5 text-white/60">{a.signups_on_site} signups</span>}
                {a.next_follow_up_at && <span className="rounded-full bg-white/8 px-2 py-0.5 text-white/60">Follow up {formatDate(a.next_follow_up_at)}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Commitments({ contactId }: { contactId: string }) {
  const [items, setItems] = useState<CrmCommitment[]>([]);
  const [type, setType] = useState<string>('invest');
  const [status, setStatus] = useState<string>('verbal');
  const [committedAt, setCommittedAt] = useState('');
  const [amount, setAmount] = useState('');
  const [likeness, setLikeness] = useState<string>('not_asked');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setItems(await fetchCrmCommitments(contactId));
  }, [contactId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const ok = await addCrmCommitment({
      contact_id: contactId,
      commitment_type: type,
      status,
      committed_at: committedAt || null,
      amount_usd: amount ? Number(amount) : null,
      likeness_permission: likeness,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (!ok) {
      window.alert('Could not save that commitment.');
      return;
    }
    setAmount('');
    setNotes('');
    setCommittedAt('');
    await load();
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this commitment?')) return;
    await deleteCrmCommitment(id);
    await load();
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-white/40">Add commitment</div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <select className={INPUT_CLASS} value={type} onChange={(e) => setType(e.target.value)}>
            {COMMITMENT_TYPES.map((t) => (
              <option key={t} value={t}>{labelFor(t)}</option>
            ))}
          </select>
          <select className={INPUT_CLASS} value={status} onChange={(e) => setStatus(e.target.value)}>
            {COMMITMENT_STATUSES.map((s) => (
              <option key={s} value={s}>{labelFor(s)}</option>
            ))}
          </select>
          <input type="date" className={INPUT_CLASS} value={committedAt} onChange={(e) => setCommittedAt(e.target.value)} />
          <input type="number" min="0" step="0.01" className={INPUT_CLASS} placeholder="Amount (USD)" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <select className={INPUT_CLASS} value={likeness} onChange={(e) => setLikeness(e.target.value)}>
            {LIKENESS_PERMISSIONS.map((l) => (
              <option key={l} value={l}>{`Likeness: ${labelFor(l)}`}</option>
            ))}
          </select>
        </div>
        <textarea className={`${INPUT_CLASS} min-h-[64px]`} placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit" disabled={saving} className={BUTTON_CLASS}>
          {saving ? 'Saving…' : 'Add commitment'}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-white/40">No commitments yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c.id} className="rounded-xl border border-white/8 bg-white/[0.02] p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="text-white/80">
                  {labelFor(c.commitment_type)} · {labelFor(c.status)}
                  {c.amount_usd != null && ` · $${c.amount_usd}`}
                </div>
                <button type="button" onClick={() => handleDelete(c.id)} className="text-xs text-white/30 hover:text-red-400">
                  Delete
                </button>
              </div>
              <div className="mt-1 text-xs text-white/40">
                {formatDate(c.committed_at)} · Likeness {labelFor(c.likeness_permission)}
              </div>
              {c.notes && <p className="mt-1 whitespace-pre-wrap text-white/70">{c.notes}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LinkedUserCard({ contact, onChanged }: { contact: CrmContact; onChanged: (c: CrmContact) => void }) {
  const [user, setUser] = useState<CrmLinkedUser | null>(null);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<CrmLinkedUser[]>([]);

  useEffect(() => {
    let active = true;
    if (!contact.linked_user_id) {
      setUser(null);
      return;
    }
    fetchLinkedUser(contact.linked_user_id).then((u) => {
      if (active) setUser(u);
    });
    return () => {
      active = false;
    };
  }, [contact.linked_user_id]);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResults(await searchAppUsers(term));
  }

  async function handleLink(target: CrmLinkedUser) {
    const updated = await linkContactToUser(contact.id, target);
    if (updated) {
      onChanged(updated);
      setResults([]);
      setTerm('');
    }
  }

  async function handleUnlink() {
    if (!window.confirm('Unlink this contact from the app user?')) return;
    if (await unlinkContact(contact.id)) {
      const fresh = await fetchCrmContact(contact.id);
      if (fresh) onChanged(fresh);
    }
  }

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4 text-sm">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-white/40">Linked app user</div>
      {contact.linked_user_id ? (
        <div className="space-y-1 text-white/70">
          <div>
            <span className="text-white">@{user?.username ?? '...'}</span>
            {user && ` · ${labelFor(user.user_type)}`}
            {user?.verification_status && ` · ${labelFor(user.verification_status)}`}
          </div>
          <div className="text-xs text-white/40">
            Signed up {user ? formatDate(user.created_at) : '...'} · First post {formatDate(contact.first_post_at)} · Linked{' '}
            {contact.link_method ? labelFor(contact.link_method) : ''}
            {contact.converted_verified_at && ` · Verified ${formatDate(contact.converted_verified_at)}`}
          </div>
          <button type="button" onClick={handleUnlink} className={`${GHOST_BUTTON_CLASS} mt-2`}>
            Unlink
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-white/40">Not linked. Matches automatically on email, phone or Instagram, or link by hand.</p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input className={INPUT_CLASS} placeholder="Search app users by name or username" value={term} onChange={(e) => setTerm(e.target.value)} />
            <button type="submit" className={GHOST_BUTTON_CLASS}>Search</button>
          </form>
          {results.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => handleLink(u)}
              className="block w-full rounded-lg border border-white/8 px-3 py-2 text-left text-white/70 hover:bg-white/[0.04]"
            >
              @{u.username} {u.full_name ? `· ${u.full_name}` : ''} · {labelFor(u.user_type)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CrmContactPanel({ contact, owners, onClose, onChanged, onDeleted }: CrmContactPanelProps) {
  const [tab, setTab] = useState<Tab>('activity');

  const refreshContact = useCallback(async () => {
    const fresh = await fetchCrmContact(contact.id);
    if (fresh) onChanged(fresh);
  }, [contact.id, onChanged]);

  async function handleSave(input: CrmContactInput) {
    const updated = await updateCrmContact(contact.id, input);
    if (updated) onChanged(updated);
    else window.alert('Could not save this contact.');
  }

  async function handleQuickPatch(patch: Partial<CrmContactInput>) {
    const updated = await updateCrmContact(contact.id, patch);
    if (updated) onChanged(updated);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete ${contact.display_name} and all of their activity? This cannot be undone.`)) return;
    if (await deleteCrmContact(contact.id)) onDeleted(contact.id);
  }

  const handle = contact.instagram?.replace(/^@/, '');
  const quickActions = [
    contact.phone && { key: 'call', label: 'Call', href: `tel:${contact.phone}` },
    contact.phone && { key: 'sms', label: 'Text', href: `sms:${contact.phone}` },
    handle && { key: 'instagram', label: 'Instagram', href: `https://instagram.com/${handle}` },
    contact.email && { key: 'email', label: 'Email', href: `mailto:${contact.email}` },
  ].filter(Boolean) as { key: string; label: string; href: string }[];

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60" onClick={onClose}>
      <aside
        className="h-full w-full max-w-2xl overflow-y-auto border-l border-white/10 bg-[#0c0c14] p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">{contact.display_name}</h2>
            <p className="text-sm text-white/40">
              {labelFor(contact.contact_type)}
              {contact.shop_name && ` · ${contact.shop_name}`}
              {(contact.city || contact.state) && ` · ${[contact.city, contact.state].filter(Boolean).join(', ')}`}
            </p>
          </div>
          <button type="button" onClick={onClose} className={GHOST_BUTTON_CLASS}>Close</button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/50 sm:grid-cols-3">
          <label>
            <span className="mb-1 block">Stage</span>
            <select
              className={INPUT_CLASS}
              value={contact.pipeline_stage}
              onChange={(e) => handleQuickPatch({ pipeline_stage: e.target.value as CrmContact['pipeline_stage'] })}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s} value={s}>{labelFor(s)}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-1 block">Sourced by</span>
            <select className={INPUT_CLASS} value={contact.owner_user_id} onChange={(e) => handleQuickPatch({ owner_user_id: e.target.value })}>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="mb-1 block">Last contacted</span>
            <div className="py-2 text-sm text-white/80">{contact.last_contacted_at ? formatDate(contact.last_contacted_at) : 'Never'}</div>
          </div>
          <div>
            <span className="mb-1 block">Next follow-up</span>
            <div className="py-2 text-sm text-white/80">{formatDate(contact.next_follow_up_at)}</div>
          </div>
        </div>

        {quickActions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickActions.map((a) => (
              <a
                key={a.key}
                href={a.href}
                target={a.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                onClick={() => {
                  setTab('activity');
                }}
                className={GHOST_BUTTON_CLASS}
                title={`Then log it as ${labelFor(QUICK_ACTION_ACTIVITY[a.key])} in the Activity tab`}
              >
                {a.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-4">
          <LinkedUserCard contact={contact} onChanged={onChanged} />
        </div>

        <div className="mt-5 flex gap-1 border-b border-white/8">
          {(['activity', 'details', 'commitments'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-3 py-2 text-sm ${tab === t ? 'border-b-2 border-violet-400 text-white' : 'text-white/40 hover:text-white'}`}
            >
              {labelFor(t)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'activity' && <ActivityLog contact={contact} owners={owners} onContactRefresh={refreshContact} />}
          {tab === 'details' && (
            <CrmContactForm initial={contact} owners={owners} defaultOwnerId={contact.owner_user_id} submitLabel="Save changes" onSubmit={handleSave} />
          )}
          {tab === 'commitments' && <Commitments contactId={contact.id} />}
        </div>

        <div className="mt-8 border-t border-white/8 pt-4">
          <button type="button" onClick={handleDelete} className="text-xs text-white/30 hover:text-red-400">
            Delete contact
          </button>
        </div>
      </aside>
    </div>
  );
}
