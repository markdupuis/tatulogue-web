import { supabase } from '../supabase';
import type {
  AdminUser,
  ArtistDocPaths,
  BlogIdea,
  BlogIdeaStatus,
  BugReport,
  EventCountStat,
  OverviewMetrics,
  PendingArtist,
  PostStat,
  Priority,
  ReportStatus,
  RoadmapItem,
  ScreenVisitStat,
  SearchQueryStat,
  TeamMember,
  VerificationStatus,
  WaitlistEntry,
} from './types';

const ANALYTICS_ROW_CAP = 10000;

const SCREEN_NAMES: Record<string, string> = {
  splash_screen_view: 'Splash',
  messages_view: 'Messages',
  hub_view: 'Artist Hub',
  feed_loaded: 'Feed',
  post_mode_select: 'Composer',
  search_executed: 'Search',
  article_read_start: 'Article',
  booking_start: 'Booking',
};

type CountQuery = ReturnType<ReturnType<typeof supabase.from>['select']>;

async function countRows(
  table: string,
  apply?: (q: CountQuery) => CountQuery
): Promise<number> {
  const base = supabase.from(table).select('*', { count: 'exact', head: true });
  const query = apply ? apply(base) : base;
  const { count } = await query;
  return count ?? 0;
}

export async function fetchReports(): Promise<BugReport[]> {
  const { data, error } = await supabase
    .from('bug_reports')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const { data: userRows } = await supabase.from('users').select('id, username');
  const usernameById = new Map<string, string | null>(
    (userRows ?? []).map((u: { id: string; username: string | null }) => [u.id, u.username])
  );

  return data.map((row: Record<string, unknown>): BugReport => ({
    id: row.id as string,
    reporter_id: row.reporter_id as string,
    reporter_username: usernameById.get(row.reporter_id as string) ?? null,
    title: row.title as string,
    description: row.description as string,
    steps_to_reproduce: (row.steps_to_reproduce as string | null) ?? null,
    expected_behavior: (row.expected_behavior as string | null) ?? null,
    actual_behavior: (row.actual_behavior as string | null) ?? null,
    device_info: (row.device_info as string | null) ?? null,
    status: row.status as ReportStatus,
    priority: row.priority as Priority,
    report_type: row.report_type as BugReport['report_type'],
    created_at: row.created_at as string,
  }));
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  await supabase.from('bug_reports').update({ status }).eq('id', id);
}

export async function convertBugToRoadmap(report: BugReport): Promise<RoadmapItem | null> {
  const priority = report.priority === 'critical' ? 1 : report.priority === 'high' ? 2 : 3;
  const { data, error } = await supabase
    .from('roadmap_items')
    .insert({
      title: report.title,
      description: report.description,
      status: 'planned',
      priority,
      category: report.report_type === 'bug' ? 'bug' : 'feature',
      source_bug_id: report.id,
    })
    .select()
    .single();

  if (error || !data) return null;
  return { ...(data as Omit<RoadmapItem, 'assignees'>), assignees: [] } as RoadmapItem;
}

export async function fetchRoadmap(): Promise<RoadmapItem[]> {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const { data: assigneeRows } = await supabase
    .from('roadmap_item_assignees')
    .select('roadmap_item_id, user_id');

  const byItem = new Map<string, string[]>();
  for (const r of (assigneeRows ?? []) as { roadmap_item_id: string; user_id: string }[]) {
    const list = byItem.get(r.roadmap_item_id) ?? [];
    list.push(r.user_id);
    byItem.set(r.roadmap_item_id, list);
  }

  return (data as Omit<RoadmapItem, 'assignees'>[]).map((row) => ({
    ...row,
    assignees: byItem.get(row.id) ?? [],
  }));
}

export async function createRoadmapItem(
  input: Partial<RoadmapItem> & { title: string }
): Promise<RoadmapItem | null> {
  const { assignees: _assignees, ...row } = input;
  void _assignees;
  const { data, error } = await supabase
    .from('roadmap_items')
    .insert(row)
    .select()
    .single();

  if (error || !data) return null;
  return { ...(data as Omit<RoadmapItem, 'assignees'>), assignees: [] };
}

export async function updateRoadmapItem(
  id: string,
  patch: Partial<RoadmapItem>
): Promise<void> {
  const { assignees: _assignees, ...rest } = patch;
  void _assignees;
  await supabase
    .from('roadmap_items')
    .update({ ...rest, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function setRoadmapAssignees(itemId: string, userIds: string[]): Promise<void> {
  await supabase.from('roadmap_item_assignees').delete().eq('roadmap_item_id', itemId);
  if (userIds.length > 0) {
    await supabase
      .from('roadmap_item_assignees')
      .insert(userIds.map((user_id) => ({ roadmap_item_id: itemId, user_id })));
  }
}

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const { data: admins } = await supabase.from('web_admins').select('user_id');
  const ids = (admins ?? []).map((a: { user_id: string }) => a.user_id);
  if (ids.length === 0) return [];

  const { data: users } = await supabase
    .from('users')
    .select('id, full_name, username')
    .in('id', ids);

  return (users ?? []).map(
    (u: { id: string; full_name: string | null; username: string | null }): TeamMember => ({
      user_id: u.id,
      name: u.full_name || u.username || 'Member',
    })
  );
}

export async function deleteRoadmapItem(id: string): Promise<void> {
  await supabase.from('roadmap_items').delete().eq('id', id);
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, full_name, email, user_type, avatar, created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const { data: postRows } = await supabase.from('posts').select('author_id');
  const postCountByUser = new Map<string, number>();
  for (const row of (postRows ?? []) as { author_id: string }[]) {
    postCountByUser.set(row.author_id, (postCountByUser.get(row.author_id) ?? 0) + 1);
  }

  return data.map((row: Record<string, unknown>): AdminUser => ({
    id: row.id as string,
    username: (row.username as string | null) ?? null,
    full_name: (row.full_name as string | null) ?? null,
    email: (row.email as string | null) ?? null,
    user_type: row.user_type as string,
    avatar: (row.avatar as string | null) ?? null,
    created_at: row.created_at as string,
    post_count: postCountByUser.get(row.id as string) ?? 0,
  }));
}

export async function fetchPendingArtists(): Promise<PendingArtist[]> {
  const { data, error } = await supabase
    .from('artist_profiles')
    .select('id, professional_name, business_address, specializations, verification_status, created_at')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  const ids = data.map((row: Record<string, unknown>) => row.id as string);
  const { data: userRows } = await supabase
    .from('users')
    .select('id, username, full_name, avatar')
    .in('id', ids);

  const userById = new Map(
    (userRows ?? []).map((u: { id: string; username: string | null; full_name: string | null; avatar: string | null }) => [u.id, u])
  );

  return data.map((row: Record<string, unknown>): PendingArtist => {
    const user = userById.get(row.id as string);
    return {
      id: row.id as string,
      username: user?.username ?? null,
      full_name: user?.full_name ?? null,
      avatar: user?.avatar ?? null,
      professional_name: row.professional_name as string,
      business_address: (row.business_address as string | null) ?? null,
      specializations: (row.specializations as string[] | null) ?? [],
      verification_status: row.verification_status as VerificationStatus,
      created_at: row.created_at as string,
    };
  });
}

export async function fetchArtistDocPaths(artistId: string): Promise<ArtistDocPaths> {
  const { data, error } = await supabase
    .from('artist_profiles')
    .select('id_doc, license_doc, certificate_doc')
    .eq('id', artistId)
    .maybeSingle();

  if (error || !data) return { id_doc: null, license_doc: null, certificate_doc: null };
  return {
    id_doc: (data.id_doc as string | null) ?? null,
    license_doc: (data.license_doc as string | null) ?? null,
    certificate_doc: (data.certificate_doc as string | null) ?? null,
  };
}

export async function getArtistDocSignedUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from('verification_docs')
    .createSignedUrl(path, 3600);
  if (error || !data) return null;
  return data.signedUrl;
}

export async function setArtistVerificationStatus(
  artistId: string,
  status: VerificationStatus
): Promise<boolean> {
  const { error } = await supabase.rpc('set_artist_verification_status', {
    target_artist_id: artistId,
    new_status: status,
  });
  return !error;
}

export async function fetchWaitlist(): Promise<WaitlistEntry[]> {
  const { data, error } = await supabase
    .from('waitlist')
    .select('id, first_name, last_name, email, state, city, account_type, created_at')
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row: Record<string, unknown>): WaitlistEntry => ({
    id: row.id as string,
    first_name: row.first_name as string,
    last_name: (row.last_name as string | null) ?? null,
    email: row.email as string,
    state: row.state as string,
    city: (row.city as string | null) ?? null,
    account_type: row.account_type as string,
    created_at: row.created_at as string,
  }));
}

export async function fetchOverviewMetrics(): Promise<OverviewMetrics> {
  const [users, posts, comments, openBugs, totalEvents, searches] = await Promise.all([
    countRows('users'),
    countRows('posts', (q) => q.is('deleted_at', null)),
    countRows('comments'),
    countRows('bug_reports', (q) => q.eq('status', 'open')),
    countRows('analytics_events'),
    countRows('analytics_events', (q) => q.eq('event', 'search_executed')),
  ]);

  return { users, posts, comments, openBugs, totalEvents, searches };
}

export async function fetchSearchQueries(limit = 50): Promise<SearchQueryStat[]> {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('props')
    .eq('event', 'search_executed')
    .limit(ANALYTICS_ROW_CAP);

  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data as { props: { query?: unknown } | null }[]) {
    const raw = row.props?.query;
    if (typeof raw !== 'string') continue;
    const query = raw.trim().toLowerCase();
    if (!query) continue;
    counts.set(query, (counts.get(query) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([query, count]): SearchQueryStat => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export async function fetchEventCounts(): Promise<EventCountStat[]> {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event')
    .limit(ANALYTICS_ROW_CAP);

  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data as { event: string | null }[]) {
    if (!row.event) continue;
    counts.set(row.event, (counts.get(row.event) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([event, count]): EventCountStat => ({ event, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchScreenVisits(): Promise<ScreenVisitStat[]> {
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event')
    .limit(ANALYTICS_ROW_CAP);

  if (error || !data) return [];

  const counts = new Map<string, number>();
  for (const row of data as { event: string | null }[]) {
    const screen = row.event ? SCREEN_NAMES[row.event] : undefined;
    if (!screen) continue;
    counts.set(screen, (counts.get(screen) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([screen, count]): ScreenVisitStat => ({ screen, count }))
    .sort((a, b) => b.count - a.count);
}

function toPostStat(row: Record<string, unknown>): PostStat {
  const articleTitle = row.article_title as string | null;
  const caption = row.caption as string | null;
  const title = articleTitle || caption?.slice(0, 60) || '(untitled)';
  const likeUserIds = (row.like_user_ids as string[] | null) ?? [];
  return {
    id: row.id as string,
    title,
    author_type: row.author_type as string,
    likes: likeUserIds.length,
    comments: (row.comments_count as number | null) ?? 0,
    created_at: row.created_at as string,
  };
}

export async function fetchPostStats(limit = 20): Promise<PostStat[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, article_title, caption, author_type, like_user_ids, comments_count, created_at')
    .is('deleted_at', null);

  if (error || !data) return [];

  return data
    .map((row: Record<string, unknown>) => toPostStat(row))
    .sort((a, b) => b.likes - a.likes || b.comments - a.comments)
    .slice(0, limit);
}

export async function fetchBangers(limit = 10): Promise<PostStat[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('id, article_title, caption, author_type, like_user_ids, comments_count, created_at')
    .is('deleted_at', null);

  if (error || !data) return [];

  return data
    .map((row: Record<string, unknown>) => toPostStat(row))
    .filter((post) => post.likes >= 1)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, limit);
}

export async function fetchBlogIdeas(): Promise<BlogIdea[]> {
  const { data, error } = await supabase
    .from('blog_ideas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as BlogIdea[];
}

export async function createBlogIdea(
  input: Partial<BlogIdea> & { title: string }
): Promise<BlogIdea | null> {
  const { data, error } = await supabase.from('blog_ideas').insert(input).select().single();
  if (error || !data) return null;
  return data as BlogIdea;
}

export async function updateBlogIdea(id: string, patch: Partial<BlogIdea>): Promise<void> {
  await supabase
    .from('blog_ideas')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function deleteBlogIdea(id: string): Promise<void> {
  await supabase.from('blog_ideas').delete().eq('id', id);
}
