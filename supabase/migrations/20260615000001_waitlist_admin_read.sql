-- Allow web admins to read waitlist signups in the admin portal (/admin/waitlist).
-- The waitlist table keeps its existing "public insert" (signup form) and
-- "service role read" policies; this adds a SELECT path for authenticated admins
-- via the anon client, gated by is_web_admin().
--
-- Applied to project wvndcypeecniuzrnwnmx on 2026-06-15.
drop policy if exists "admin read" on public.waitlist;
create policy "admin read" on public.waitlist
  for select
  using (public.is_web_admin());
