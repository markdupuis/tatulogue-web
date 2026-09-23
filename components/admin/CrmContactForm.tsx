'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  CONTACT_TYPES,
  INTEREST_LEVELS,
  PIPELINE_STAGES,
  RELATIONSHIP_SOURCES,
  labelFor,
  type CrmContact,
  type CrmContactInput,
  type CrmOwner,
} from '../../lib/admin/crm';

interface CrmContactFormProps {
  initial?: CrmContact;
  owners: CrmOwner[];
  defaultOwnerId: string;
  submitLabel: string;
  onSubmit: (input: CrmContactInput) => Promise<void>;
}

const INPUT_CLASS =
  'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-violet-400 focus:outline-none';

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-xs text-white/50">
      <span className="mb-1 block">{label}</span>
      {children}
    </label>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-white/8 p-4">
      <legend className="px-1 text-xs font-medium uppercase tracking-wide text-white/40">{title}</legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function toList(text: string): string[] {
  return text
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function orNull(text: string): string | null {
  const trimmed = text.trim();
  return trimmed ? trimmed : null;
}

export default function CrmContactForm({ initial, owners, defaultOwnerId, submitLabel, onSubmit }: CrmContactFormProps) {
  const [displayName, setDisplayName] = useState(initial?.display_name ?? '');
  const [contactType, setContactType] = useState(initial?.contact_type ?? 'artist');
  const [firstName, setFirstName] = useState(initial?.first_name ?? '');
  const [lastName, setLastName] = useState(initial?.last_name ?? '');
  const [shopName, setShopName] = useState(initial?.shop_name ?? '');
  const [roleTitle, setRoleTitle] = useState(initial?.role_title ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [instagram, setInstagram] = useState(initial?.instagram ?? '');
  const [otherSocials, setOtherSocials] = useState((initial?.other_socials ?? []).join(', '));
  const [city, setCity] = useState(initial?.city ?? '');
  const [state, setState] = useState(initial?.state ?? '');
  const [country, setCountry] = useState(initial?.country ?? 'US');
  const [styles, setStyles] = useState((initial?.styles ?? []).join(', '));
  const [stage, setStage] = useState(initial?.pipeline_stage ?? 'new');
  const [interest, setInterest] = useState(initial?.interest_level ?? 'cold');
  const [ownerId, setOwnerId] = useState(initial?.owner_user_id ?? defaultOwnerId);
  const [source, setSource] = useState(initial?.relationship_source ?? '');
  const [nextFollowUp, setNextFollowUp] = useState(initial?.next_follow_up_at ?? '');
  const [nextAction, setNextAction] = useState(initial?.next_action ?? '');
  const [referralAsked, setReferralAsked] = useState(initial?.referral_asked ?? false);
  const [ndaSignedAt, setNdaSignedAt] = useState(initial?.nda_signed_at ?? '');
  const [doNotContact, setDoNotContact] = useState(initial?.do_not_contact ?? false);
  const [tags, setTags] = useState((initial?.tags ?? []).join(', '));
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSaving(true);
    await onSubmit({
      display_name: displayName.trim(),
      contact_type: contactType,
      first_name: orNull(firstName),
      last_name: orNull(lastName),
      shop_name: orNull(shopName),
      role_title: orNull(roleTitle),
      phone: orNull(phone),
      email: orNull(email),
      instagram: orNull(instagram.replace(/^@/, '')),
      other_socials: toList(otherSocials),
      city: orNull(city),
      state: orNull(state),
      country: country.trim() || 'US',
      styles: toList(styles),
      pipeline_stage: stage,
      interest_level: interest,
      owner_user_id: ownerId,
      relationship_source: source || null,
      next_follow_up_at: nextFollowUp || null,
      next_action: orNull(nextAction),
      referral_asked: referralAsked,
      nda_signed_at: ndaSignedAt || null,
      do_not_contact: doNotContact,
      tags: toList(tags),
      notes: orNull(notes),
    });
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Group title="Contact info">
        <Field label="Name (person or business) *">
          <input className={INPUT_CLASS} value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        </Field>
        <Field label="Type">
          <select className={INPUT_CLASS} value={contactType} onChange={(e) => setContactType(e.target.value as typeof contactType)}>
            {CONTACT_TYPES.map((t) => (
              <option key={t} value={t}>{labelFor(t)}</option>
            ))}
          </select>
        </Field>
        <Field label="First name">
          <input className={INPUT_CLASS} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </Field>
        <Field label="Last name">
          <input className={INPUT_CLASS} value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </Field>
        <Field label="Shop name">
          <input className={INPUT_CLASS} value={shopName} onChange={(e) => setShopName(e.target.value)} />
        </Field>
        <Field label="Role / title">
          <input className={INPUT_CLASS} value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
        </Field>
        <Field label="Phone">
          <input className={INPUT_CLASS} value={phone} onChange={(e) => setPhone(e.target.value)} />
        </Field>
        <Field label="Email">
          <input type="email" className={INPUT_CLASS} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Instagram (no @)">
          <input className={INPUT_CLASS} value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </Field>
        <Field label="Other socials (comma separated)">
          <input className={INPUT_CLASS} value={otherSocials} onChange={(e) => setOtherSocials(e.target.value)} />
        </Field>
      </Group>

      <Group title="Location and styles">
        <Field label="City">
          <input className={INPUT_CLASS} value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field label="State">
          <input className={INPUT_CLASS} value={state} onChange={(e) => setState(e.target.value)} />
        </Field>
        <Field label="Country">
          <input className={INPUT_CLASS} value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Styles (comma separated)">
          <input className={INPUT_CLASS} value={styles} onChange={(e) => setStyles(e.target.value)} />
        </Field>
      </Group>

      <Group title="Pipeline">
        <Field label="Stage">
          <select className={INPUT_CLASS} value={stage} onChange={(e) => setStage(e.target.value as typeof stage)}>
            {PIPELINE_STAGES.map((s) => (
              <option key={s} value={s}>{labelFor(s)}</option>
            ))}
          </select>
        </Field>
        <Field label="Interest">
          <select className={INPUT_CLASS} value={interest} onChange={(e) => setInterest(e.target.value as typeof interest)}>
            {INTEREST_LEVELS.map((s) => (
              <option key={s} value={s}>{labelFor(s)}</option>
            ))}
          </select>
        </Field>
        <Field label="Sourced by">
          <select className={INPUT_CLASS} value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Who knows them">
          <select className={INPUT_CLASS} value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Not set</option>
            {RELATIONSHIP_SOURCES.map((s) => (
              <option key={s} value={s}>{labelFor(s)}</option>
            ))}
          </select>
        </Field>
        <Field label="Next follow-up">
          <input type="date" className={INPUT_CLASS} value={nextFollowUp} onChange={(e) => setNextFollowUp(e.target.value)} />
        </Field>
        <Field label="Next action">
          <input className={INPUT_CLASS} value={nextAction} onChange={(e) => setNextAction(e.target.value)} />
        </Field>
        <Field label="NDA signed on">
          <input type="date" className={INPUT_CLASS} value={ndaSignedAt} onChange={(e) => setNdaSignedAt(e.target.value)} />
        </Field>
        <div className="flex items-center gap-4 pt-5 text-sm text-white/70">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={referralAsked} onChange={(e) => setReferralAsked(e.target.checked)} />
            Referral asked
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={doNotContact} onChange={(e) => setDoNotContact(e.target.checked)} />
            Do not contact
          </label>
        </div>
      </Group>

      <Group title="Tags and notes">
        <Field label="Tags (comma separated)">
          <input className={INPUT_CLASS} value={tags} onChange={(e) => setTags(e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="General notes">
            <textarea className={`${INPUT_CLASS} min-h-[96px]`} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
      </Group>

      <button
        type="submit"
        disabled={saving || !displayName.trim()}
        className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
