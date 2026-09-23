import { supabase } from '../supabase';

export const CONTACT_TYPES = ['artist', 'shop', 'supplier', 'investor', 'media', 'convention', 'other'] as const;
export const PIPELINE_STAGES = [
  'new',
  'contacted',
  'responded',
  'interested',
  'committed',
  'onboarded',
  'not_interested',
  'dormant',
] as const;
export const INTEREST_LEVELS = ['hot', 'warm', 'cold', 'no'] as const;
export const RELATIONSHIP_SOURCES = ['eric', 'charlie', 'mark', 'referral', 'convention', 'cold', 'inbound', 'other'] as const;
export const ACTIVITY_TYPES = [
  'call',
  'sms',
  'instagram_dm',
  'email',
  'shop_visit',
  'convention',
  'video_call',
  'group_call',
  'social_tag',
  'note',
  'other',
] as const;
export const ACTIVITY_DIRECTIONS = ['outbound', 'inbound', 'none'] as const;
export const ACTIVITY_OUTCOMES = [
  'no_answer',
  'left_message',
  'replied',
  'interested',
  'not_interested',
  'committed',
  'meeting_booked',
  'onboarded',
  'referred_someone',
  'n/a',
] as const;
export const COMMITMENT_TYPES = [
  'invest',
  'promote',
  'artwork',
  'testimonial',
  'content_collab',
  'equity_partner',
  'kickstarter',
  'other',
] as const;
export const COMMITMENT_STATUSES = ['verbal', 'written', 'signed', 'received', 'withdrawn'] as const;
export const LIKENESS_PERMISSIONS = ['not_asked', 'asked', 'granted', 'declined'] as const;

export type ContactType = (typeof CONTACT_TYPES)[number];
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
export type InterestLevel = (typeof INTEREST_LEVELS)[number];
export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type ActivityDirection = (typeof ACTIVITY_DIRECTIONS)[number];

export interface CrmContact {
  id: string;
  contact_type: ContactType;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  shop_name: string | null;
  role_title: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  other_socials: string[];
  city: string | null;
  state: string | null;
  country: string;
  styles: string[];
  relationship_source: string | null;
  referred_by_contact_id: string | null;
  owner_user_id: string;
  pipeline_stage: PipelineStage;
  interest_level: InterestLevel | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  next_action: string | null;
  referral_asked: boolean;
  nda_signed_at: string | null;
  do_not_contact: boolean;
  linked_user_id: string | null;
  linked_at: string | null;
  link_method: string | null;
  converted_user_type: string | null;
  converted_verified_at: string | null;
  first_post_at: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CrmContactInput = Partial<Omit<CrmContact, 'id' | 'created_at' | 'updated_at'>> & {
  display_name: string;
  contact_type: ContactType;
  owner_user_id: string;
};

export interface CrmActivity {
  id: string;
  contact_id: string;
  activity_type: ActivityType;
  direction: ActivityDirection;
  occurred_at: string;
  duration_minutes: number | null;
  performed_by: string;
  outcome: string | null;
  summary: string;
  referral_asked: boolean;
  next_follow_up_at: string | null;
  signups_on_site: number;
  created_at: string;
}

export interface CrmActivityInput {
  contact_id: string;
  activity_type: ActivityType;
  direction: ActivityDirection;
  occurred_at: string;
  duration_minutes: number | null;
  outcome: string | null;
  summary: string;
  referral_asked: boolean;
  next_follow_up_at: string | null;
  signups_on_site: number;
}

export interface CrmCommitment {
  id: string;
  contact_id: string;
  commitment_type: string;
  status: string;
  committed_at: string | null;
  amount_usd: number | null;
  likeness_permission: string;
  notes: string | null;
  created_at: string;
}

export interface CrmCommitmentInput {
  contact_id: string;
  commitment_type: string;
  status: string;
  committed_at: string | null;
  amount_usd: number | null;
  likeness_permission: string;
  notes: string | null;
}

export interface CrmOwner {
  id: string;
  name: string;
}

export interface CrmLinkedUser {
  id: string;
  username: string | null;
  full_name: string | null;
  user_type: string;
  created_at: string;
  verification_status: string | null;
}

export function labelFor(value: string): string {
  const spaced = value.replace(/_/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function isOverdue(contact: CrmContact): boolean {
  return Boolean(contact.next_follow_up_at) && (contact.next_follow_up_at as string) < todayIso();
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}

export async function getCurrentAdminId(): Promise<string | null> {
  return currentUserId();
}

export async function fetchCrmContacts(): Promise<CrmContact[]> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('next_follow_up_at', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[fetchCrmContacts] failed:', error);
    return [];
  }
  return (data ?? []) as CrmContact[];
}

export async function fetchCrmOwners(): Promise<CrmOwner[]> {
  const { data: admins, error } = await supabase.from('web_admins').select('user_id');
  if (error || !admins?.length) {
    if (error) console.error('[fetchCrmOwners] failed:', error);
    return [];
  }
  const ids = admins.map((a) => a.user_id as string);
  const { data: users } = await supabase.from('users').select('id, username, full_name').in('id', ids);
  return ids.map((id) => {
    const user = users?.find((u) => u.id === id);
    return { id, name: user?.full_name || user?.username || id.slice(0, 8) };
  });
}

export async function createCrmContact(input: CrmContactInput): Promise<CrmContact | null> {
  const adminId = await currentUserId();
  const { data, error } = await supabase
    .from('crm_contacts')
    .insert({ ...input, created_by: adminId, updated_by: adminId })
    .select('*')
    .single();
  if (error) {
    console.error('[createCrmContact] failed:', error);
    return null;
  }
  return data as CrmContact;
}

export async function updateCrmContact(id: string, patch: Partial<CrmContactInput>): Promise<CrmContact | null> {
  const adminId = await currentUserId();
  const { data, error } = await supabase
    .from('crm_contacts')
    .update({ ...patch, updated_by: adminId })
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    console.error('[updateCrmContact] failed:', error);
    return null;
  }
  return data as CrmContact;
}

export async function deleteCrmContact(id: string): Promise<boolean> {
  const { error } = await supabase.from('crm_contacts').delete().eq('id', id);
  if (error) console.error('[deleteCrmContact] failed:', error);
  return !error;
}

export async function fetchCrmActivities(contactId: string): Promise<CrmActivity[]> {
  const { data, error } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('contact_id', contactId)
    .order('occurred_at', { ascending: false });
  if (error) {
    console.error('[fetchCrmActivities] failed:', error);
    return [];
  }
  return (data ?? []) as CrmActivity[];
}

export async function addCrmActivity(input: CrmActivityInput): Promise<boolean> {
  const { error } = await supabase.from('crm_activities').insert(input);
  if (error) console.error('[addCrmActivity] failed:', error);
  return !error;
}

export async function deleteCrmActivity(id: string): Promise<boolean> {
  const { error } = await supabase.from('crm_activities').delete().eq('id', id);
  if (error) console.error('[deleteCrmActivity] failed:', error);
  return !error;
}

export async function fetchCrmCommitments(contactId: string): Promise<CrmCommitment[]> {
  const { data, error } = await supabase
    .from('crm_commitments')
    .select('*')
    .eq('contact_id', contactId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[fetchCrmCommitments] failed:', error);
    return [];
  }
  return (data ?? []) as CrmCommitment[];
}

export async function addCrmCommitment(input: CrmCommitmentInput): Promise<boolean> {
  const adminId = await currentUserId();
  const { error } = await supabase.from('crm_commitments').insert({ ...input, sourced_by: adminId });
  if (error) console.error('[addCrmCommitment] failed:', error);
  return !error;
}

export async function deleteCrmCommitment(id: string): Promise<boolean> {
  const { error } = await supabase.from('crm_commitments').delete().eq('id', id);
  if (error) console.error('[deleteCrmCommitment] failed:', error);
  return !error;
}

export async function fetchLinkedUser(userId: string): Promise<CrmLinkedUser | null> {
  const { data: user } = await supabase
    .from('users')
    .select('id, username, full_name, user_type, created_at')
    .eq('id', userId)
    .maybeSingle();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('artist_profiles')
    .select('verification_status')
    .eq('id', userId)
    .maybeSingle();
  return { ...user, verification_status: profile?.verification_status ?? null } as CrmLinkedUser;
}

export async function searchAppUsers(term: string): Promise<CrmLinkedUser[]> {
  const cleaned = term.trim().replace(/[%,()]/g, '');
  if (!cleaned) return [];
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, user_type, created_at')
    .or(`username.ilike.%${cleaned}%,full_name.ilike.%${cleaned}%`)
    .limit(8);
  if (error) {
    console.error('[searchAppUsers] failed:', error);
    return [];
  }
  return (data ?? []).map((u) => ({ ...u, verification_status: null })) as CrmLinkedUser[];
}

export async function linkContactToUser(contactId: string, user: CrmLinkedUser): Promise<CrmContact | null> {
  return updateCrmContact(contactId, {
    linked_user_id: user.id,
    linked_at: new Date().toISOString(),
    link_method: 'manual',
    converted_user_type: user.user_type,
  });
}

export async function unlinkContact(contactId: string): Promise<boolean> {
  const { error } = await supabase.rpc('crm_unlink_user', { p_contact_id: contactId });
  if (error) console.error('[unlinkContact] failed:', error);
  return !error;
}

export async function fetchCrmContact(id: string): Promise<CrmContact | null> {
  const { data, error } = await supabase.from('crm_contacts').select('*').eq('id', id).maybeSingle();
  if (error) console.error('[fetchCrmContact] failed:', error);
  return (data as CrmContact | null) ?? null;
}
