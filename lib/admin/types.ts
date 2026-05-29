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

export type RoadmapStatus = 'planned' | 'in_progress' | 'shipped' | 'parked';

export interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: RoadmapStatus;
  priority: number;
  quarter: string | null;
  category: string | null;
  source_bug_id: string | null;
  created_at: string;
  updated_at: string;
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
