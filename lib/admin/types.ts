export type ReportStatus = 'open' | 'resolved' | 'closed';
export type ReportType = 'bug' | 'feature_request';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface BugReport {
  id: string;
  reporter_id: string;
  reporter_username: string | null;
  title: string;
  description: string;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  device_info: string | null;
  status: ReportStatus;
  priority: Priority;
  report_type: ReportType;
  created_at: string;
}

export type RoadmapStatus = 'backlog' | 'planned' | 'in_progress' | 'completed';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: RoadmapStatus;
  priority: number;
  quarter: string | null;
  category: string | null;
  source_bug_id: string | null;
  start_date: string | null;
  due_date: string | null;
  progress: number;
  assignees: string[];
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  user_id: string;
  name: string;
}

export interface AdminUser {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  user_type: string;
  avatar: string | null;
  created_at: string;
  post_count: number;
}

export interface SearchQueryStat {
  query: string;
  count: number;
}

export interface EventCountStat {
  event: string;
  count: number;
}

export interface ScreenVisitStat {
  screen: string;
  count: number;
}

export interface PostStat {
  id: string;
  title: string;
  author_type: string;
  likes: number;
  comments: number;
  created_at: string;
}

export interface OverviewMetrics {
  users: number;
  posts: number;
  comments: number;
  openBugs: number;
  totalEvents: number;
  searches: number;
}

export type BlogIdeaStatus = 'idea' | 'writing' | 'published';

export interface BlogIdea {
  id: string;
  title: string;
  angle: string | null;
  target_keyword: string | null;
  category: string | null;
  status: BlogIdeaStatus;
  published_slug: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExistingPostSummary {
  slug: string;
  title: string;
  category: string;
  date: string;
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface PendingArtist {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar: string | null;
  professional_name: string;
  business_address: string | null;
  specializations: string[];
  verification_status: VerificationStatus;
  created_at: string;
}

export interface ArtistDocPaths {
  id_doc: string | null;
  license_doc: string | null;
  certificate_doc: string | null;
}

export interface WaitlistEntry {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  state: string;
  city: string | null;
  account_type: string;
  created_at: string;
}
