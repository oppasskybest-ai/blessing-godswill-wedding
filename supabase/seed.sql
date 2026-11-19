-- ============================================================
-- Seed: the four takeoff points. Safe to re-run.
--
-- TODO(owner): replace every placeholder below once the owner replies, then
-- re-run this file (or edit the rows in the admin dashboard -> Pickups tab):
--   * pickup_time   currently 'TBA'
--   * capacity      currently 36 (the owner's example figure)
--   * contact_name / phone  currently placeholders. These are only shown to
--     guests whose bus request has been approved.
-- ============================================================

insert into public.pickup_points (slug, name, address, pickup_time, capacity, sort_order, maps_url) values
  ('ini',         'Ini LGA',     'Mentors House, opp. Sec. Comm. Sch.',            'TBA', 36, 1, null),
  ('ikot-ekpene', 'Ikot Ekpene', 'St. Vincent Plaza, by Uyo Rd, Ibiakpan Junction', 'TBA', 36, 2, null),
  ('ikono',       'Ikono',       'Tarbas Junction, cenotaph',                      'TBA', 36, 3, null),
  ('uyo',         'Uyo',         'Ekom Iman Junction',                             'TBA', 36, 4, null)
on conflict (slug) do update
  set name = excluded.name,
      address = excluded.address,
      sort_order = excluded.sort_order;
-- (pickup_time, capacity and maps_url are intentionally NOT overwritten on re-run.)

insert into public.pickup_contacts (pickup_id, contact_name, phone)
select id, 'Contact person (to be added)', '+234 000 000 0000'
from public.pickup_points
on conflict (pickup_id) do nothing;
