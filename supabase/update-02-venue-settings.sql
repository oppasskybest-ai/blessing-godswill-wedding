-- ============================================================
-- Update 02: editable venue + general contact (Admin -> Venue tab).
-- Run this ONCE in Supabase -> SQL Editor (safe to re-run).
-- It is also included at the end of schema.sql for fresh installs.
-- ============================================================

create table if not exists public.site_settings (
  id             integer primary key default 1 check (id = 1),   -- exactly one row
  venue_name     text not null default '',
  venue_area     text not null default '',
  venue_maps_url text,
  contact_name   text not null default '',
  contact_phone  text not null default '',
  updated_at     timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select on public.site_settings to anon, authenticated;

insert into public.site_settings (id, venue_name, venue_area, venue_maps_url, contact_name, contact_phone)
values (1, 'Late Elder Okon Jeremiah''s compound', 'Odoro Aku, Uquo, Esit Eket LGA', null,
        'Contact person (to be added)', '+234 000 000 0000')
on conflict (id) do nothing;
