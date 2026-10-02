-- CRM: street address fields (#282) and artist-to-shop links (#250).
-- Additive and idempotent. New columns inherit the existing crm_contacts RLS
-- policies (is_admin() OR is_web_admin()), which are row-level, not column-level.

alter table public.crm_contacts
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists postal_code text,
  add column if not exists shop_contact_id uuid references public.crm_contacts(id) on delete set null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.crm_contacts'::regclass
      and conname = 'crm_contacts_shop_contact_not_self'
  ) then
    alter table public.crm_contacts
      add constraint crm_contacts_shop_contact_not_self check (shop_contact_id is null or shop_contact_id <> id);
  end if;
end $$;

create index if not exists idx_crm_contacts_shop_contact_id on public.crm_contacts (shop_contact_id);

-- One-time backfill: link artists whose shop_name matches exactly one shop
-- contact's display_name (case-insensitive, trimmed). Ambiguous names are skipped.
with shop_keys as (
  select lower(btrim(display_name)) as name_key, (array_agg(id))[1] as shop_id, count(*) as matches
  from public.crm_contacts
  where contact_type = 'shop'
  group by lower(btrim(display_name))
)
update public.crm_contacts artist
set shop_contact_id = shop_keys.shop_id
from shop_keys
where artist.contact_type = 'artist'
  and artist.shop_contact_id is null
  and nullif(btrim(artist.shop_name), '') is not null
  and lower(btrim(artist.shop_name)) = shop_keys.name_key
  and shop_keys.matches = 1;
