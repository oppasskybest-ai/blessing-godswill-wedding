-- ============================================================
-- Blessing & Godswill wedding site: database schema
-- Run this whole file once in Supabase -> SQL Editor, then run seed.sql.
--
-- Security model (read this before changing anything):
--  * Every table has row-level security (RLS) ON.
--  * Guests can only see and change their own rows.
--  * "Admin" is the profiles.is_admin flag. Guests cannot edit it (column grants below).
--  * Pickup contact names/phones live in their own table and are readable ONLY by
--    an admin, or by a guest whose bus request for that pickup is APPROVED.
--  * Guests cannot change their own request status; only the admin-only function
--    set_bus_request_status() can, and it refuses to exceed a bus's capacity.
-- ============================================================

-- ---------- Tables ----------

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  username    text not null unique check (username = lower(username) and username ~ '^[a-z0-9._-]{3,30}$'),
  full_name   text not null check (char_length(trim(full_name)) >= 2),
  phone       text not null check (phone ~ '^\+?[0-9]{7,15}$'),
  gender      text check (gender in ('male', 'female')),
  address     text,
  email       text,
  is_admin    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists public.pickup_points (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  address      text not null,
  pickup_time  text not null default 'TBA',
  capacity     integer not null default 36 check (capacity >= 0),
  maps_url     text,
  sort_order   integer not null default 0,
  active       boolean not null default true
);

-- Contact details are deliberately NOT in pickup_points (which is public).
create table if not exists public.pickup_contacts (
  pickup_id     uuid primary key references public.pickup_points (id) on delete cascade,
  contact_name  text not null default '',
  phone         text not null default ''
);

create table if not exists public.bus_requests (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null unique references public.profiles (id) on delete cascade,
  pickup_id   uuid not null references public.pickup_points (id) on delete restrict,
  status      text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  admin_note  text,
  created_at  timestamptz not null default now(),
  decided_at  timestamptz
);
create index if not exists bus_requests_pickup_status_idx on public.bus_requests (pickup_id, status);

create table if not exists public.event_photos (
  id           uuid primary key default gen_random_uuid(),
  path         text not null unique,          -- path inside the event-photos storage bucket
  caption      text,
  uploaded_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);

-- ---------- Helper functions ----------

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;

-- Approved seats per pickup (counts only, no personal data) so the public can see "Full".
create or replace function public.pickup_seat_counts()
returns table (pickup_id uuid, approved bigint)
language sql stable security definer
set search_path = public
as $$
  select p.id, count(r.id) filter (where r.status = 'approved')
  from public.pickup_points p
  left join public.bus_requests r on r.pickup_id = p.id
  group by p.id
$$;

-- Admin approves / declines / resets a request. Refuses to over-fill a bus.
create or replace function public.set_bus_request_status(request_id uuid, new_status text, note text default null)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  req   public.bus_requests;
  cap   integer;
  taken integer;
begin
  if not public.is_admin() then
    raise exception 'Not allowed';
  end if;
  if new_status not in ('pending', 'approved', 'declined') then
    raise exception 'Invalid status';
  end if;

  select * into req from public.bus_requests where id = request_id for update;
  if not found then
    raise exception 'Request not found';
  end if;

  if new_status = 'approved' then
    -- Lock the pickup row so two admins cannot approve the last seat at the same time.
    select capacity into cap from public.pickup_points where id = req.pickup_id for update;
    select count(*) into taken from public.bus_requests
      where pickup_id = req.pickup_id and status = 'approved' and id <> req.id;
    if taken >= cap then
      raise exception 'This bus is full (% of % seats approved)', taken, cap;
    end if;
  end if;

  update public.bus_requests
     set status = new_status,
         admin_note = coalesce(note, admin_note),
         decided_at = case when new_status = 'pending' then null else now() end
   where id = request_id;
end;
$$;

revoke all on function public.set_bus_request_status(uuid, text, text) from public, anon;
grant execute on function public.set_bus_request_status(uuid, text, text) to authenticated;
grant execute on function public.pickup_seat_counts() to anon, authenticated;
-- anon needs execute too: the public-read policies below call is_admin(), and it simply returns false for anon.
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- Row-level security ----------

alter table public.profiles        enable row level security;
alter table public.pickup_points   enable row level security;
alter table public.pickup_contacts enable row level security;
alter table public.bus_requests    enable row level security;
alter table public.event_photos    enable row level security;

-- profiles: own row or admin. Rows are created by the server (/api/register), never by the browser.
drop policy if exists "profiles read own or admin" on public.profiles;
create policy "profiles read own or admin" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin" on public.profiles
  for update to authenticated using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- Column-level lock: nobody can set is_admin / username / id from the browser.
-- Deleting a guest is done server-side (/api/admin/guest) so the login account goes too.
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, phone, gender, address, email) on public.profiles to authenticated;

-- pickup_points: public to read, admin to manage.
drop policy if exists "pickups public read" on public.pickup_points;
create policy "pickups public read" on public.pickup_points
  for select to anon, authenticated using (active or public.is_admin());

drop policy if exists "pickups admin write" on public.pickup_points;
create policy "pickups admin write" on public.pickup_points
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- pickup_contacts: admin, or a guest APPROVED for that pickup. Nobody else.
drop policy if exists "contacts read approved or admin" on public.pickup_contacts;
create policy "contacts read approved or admin" on public.pickup_contacts
  for select to authenticated using (
    public.is_admin()
    or exists (
      select 1 from public.bus_requests r
      where r.user_id = auth.uid()
        and r.pickup_id = pickup_contacts.pickup_id
        and r.status = 'approved'
    )
  );

drop policy if exists "contacts admin write" on public.pickup_contacts;
create policy "contacts admin write" on public.pickup_contacts
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- bus_requests: guests manage only their own PENDING/DECLINED request; admins read all.
drop policy if exists "requests read own or admin" on public.bus_requests;
create policy "requests read own or admin" on public.bus_requests
  for select to authenticated using (user_id = auth.uid() or public.is_admin());

drop policy if exists "requests insert own pending" on public.bus_requests;
create policy "requests insert own pending" on public.bus_requests
  for insert to authenticated with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "requests change own pickup while pending" on public.bus_requests;
create policy "requests change own pickup while pending" on public.bus_requests
  for update to authenticated using (user_id = auth.uid() and status = 'pending')
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists "requests delete own open or admin" on public.bus_requests;
create policy "requests delete own open or admin" on public.bus_requests
  for delete to authenticated using (
    (user_id = auth.uid() and status in ('pending', 'declined')) or public.is_admin()
  );

-- Guests may only ever change which pickup they asked for. Status changes go through the function.
revoke update on public.bus_requests from anon, authenticated;
grant update (pickup_id) on public.bus_requests to authenticated;

-- event_photos: public to view, admin to manage.
drop policy if exists "photos public read" on public.event_photos;
create policy "photos public read" on public.event_photos
  for select to anon, authenticated using (true);

drop policy if exists "photos admin write" on public.event_photos;
create policy "photos admin write" on public.event_photos
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage bucket for event photos ----------

insert into storage.buckets (id, name, public)
values ('event-photos', 'event-photos', true)
on conflict (id) do nothing;

drop policy if exists "event photos admin upload" on storage.objects;
create policy "event photos admin upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'event-photos' and public.is_admin());

drop policy if exists "event photos admin delete" on storage.objects;
create policy "event photos admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'event-photos' and public.is_admin());

-- ---------- Password recovery codes ----------
-- Each guest gets a one-time-visible recovery code at registration. Only a salted
-- hash is stored, and only the server (service role) can touch this table:
-- RLS is on and there are deliberately NO policies, so the browser can never read it.
create table if not exists public.recovery_codes (
  user_id         uuid primary key references public.profiles (id) on delete cascade,
  code_hash       text not null,                 -- "salt:hash" (scrypt)
  failed_attempts integer not null default 0,
  locked_until    timestamptz,
  created_at      timestamptz not null default now()
);
alter table public.recovery_codes enable row level security;
revoke all on public.recovery_codes from anon, authenticated;

-- ============================================================
-- AFTER registering the first account on the site, make yourself admin:
--   update public.profiles set is_admin = true where username = 'your-username';
-- ============================================================

-- ---------- Update 02: editable venue + general contact ----------
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
