-- Lets web admins manually attribute a signup to an affiliate code when
-- they personally know who referred someone but the app's own detection
-- (Play Install Referrer / iOS clipboard token) never got recorded --
-- AttributionService.logSignup() only writes an attribution_events row
-- when the "Referred by" field is non-empty at signup, so a real
-- QR-code signup can leave zero trace in that table.
--
-- Kept as its own table rather than a new column on public.users because
-- users has no admin-write RLS policy at all today (only self-updates),
-- and this keeps the blast radius to exactly this one field instead of
-- opening every column on users to admin writes.
create table public.manual_affiliate_overrides (
  user_id uuid primary key references public.users(id) on delete cascade,
  affiliate_code text not null references public.affiliates(code),
  set_by uuid not null references public.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.manual_affiliate_overrides enable row level security;

create policy "manual_affiliate_overrides_web_admin_all"
  on public.manual_affiliate_overrides
  for all
  using (is_web_admin())
  with check (is_web_admin());
