# PROGRESS.md: Blessing & Godswill wedding site

Tracks what has been built against the original plan in `docs/PROJECT_NOTES.md` (section numbers below match that file).
**Read this and PROJECT_NOTES.md at the start of every session, and update the status column as work lands.**

Last updated: 2026-11-19 (session 2: cinematic redesign, 40 named image slots, new botanicals, schedule overlap fixed)

Legend: DONE = written in code · PLACEHOLDER = built, waiting for real info from the owner · TODO = not built · OPEN = needs a decision

---

## Read this first: what has and has not been verified

- The owner ran `npm install` and `npm run dev` in GitHub Codespaces (Next 16.4.6) and the **session-1 front end rendered correctly**. The **session-2 redesign has not been run by anyone yet**; it was written without internet access, so it was never built or looked at.
- A TypeScript parse check found no syntax errors. A full type check was not possible offline. Expect small fixes on first `npm run dev`.
- The owner has **not created the Supabase project yet**, so register, login, bus approval, admin and photo upload are still untested.
- Known harmless warning: "React 18 support is deprecated in Next.js 16". Upgrading to React 19 is optional and not done.
- `supabase/schema.sql` and `seed.sql` have **not been run** against a real Supabase project. Run them and test the flows in section "First checks" below before trusting the security rules.

### First checks (do these in order)
1. `npm install`, then `npm run typecheck`, then `npm run dev`.
2. Run `schema.sql` + `seed.sql`; register a guest; confirm login works with username + password.
3. Make yourself admin (see README step 5). As a normal guest, confirm `/admin` redirects away and that no pickup phone number is visible before approval.
4. Approve a seat in Admin -> Bus requests; confirm the guest now sees the contact; try approving past capacity and confirm it is refused.
5. Upload a photo in Admin -> Photos; confirm it shows on `/photos`.
6a. Redesign check (Codespaces): scroll the whole home page on desktop and a phone-sized window. Look for overlapping text, cut-off photos, jerky parallax, and the gallery rows gliding.
6. Password reset: register, note the recovery code, log out, reset at `/reset-password`, log in with the new password, confirm the old code no longer works. Try 5 wrong codes and confirm the lockout message.
7. Open the site on a phone-sized screen.

---

## 2. Issues found in the Canva design

| Item | Status | Notes |
| --- | --- | --- |
| Empty "Call:" fields on takeoff points | PLACEHOLDER | Now approval-gated contacts (see 4.3). Real names/numbers still needed. |
| Page title "uca" / link preview | DONE | Proper title, description and generated share image (`app/opengraph-image.tsx`). Check the WhatsApp preview once a real domain is live. |
| London double-decker bus photo | DONE | Removed; transport is a text card. Add a real bus photo later if wanted. |
| Typos (Tthe / however / "invitation guest" / Uyo Rd / Ikono comma / Call:) | DONE | Fixed in `lib/config/site.ts` and components. |
| Vague security FAQ | OPEN | Kept the owner's wording. Owner should say what is actually in place. |
| RSVP deadline | PLACEHOLDER | `REGISTRATION_DEADLINE` (empty = hidden). |
| "Departure" at 5:30 PM unclear | OPEN | Kept as is; ask the owner what it means for guests. |
| Venue map link | PLACEHOLDER | Works now as a Google Maps search near Odoro Aku; replace with the exact pin. |
| Pickup times, return-trip info | PLACEHOLDER / TODO | Times are "TBA". Return trip is not mentioned anywhere yet. |
| Western stock photos (venue, attire) | DONE | Replaced by cards and colour swatches; real photos still welcome. |
| Takeoff Points misaligned; "Page 1" label | DONE | Not present in the new build (2x2 grid). |

## 3. New things to add

| Item | Status | Notes |
| --- | --- | --- |
| Countdown | DONE | `components/site/Countdown.tsx` (1:00 PM WAT ceremony). |
| Google Maps directions to venue | DONE | See 4.4. |
| Add to Calendar (.ics) | DONE | Wedding section. |
| Colour swatches in Attire | DONE | |
| WhatsApp share + link preview image | DONE | Footer button + generated OG image. |
| Contact person for questions | PLACEHOLDER | `GENERAL_CONTACT` (footer). |
| Accommodation suggestions | TODO | Not in the owner's list; add only if wanted. |
| Gift / registry info | TODO | Not requested. |

## 4. Owner requirements (functionality)

| # | Requirement | Status | Where |
| --- | --- | --- | --- |
| 4.1 | Public site viewable without login | DONE | `app/page.tsx` |
| 4.1 | Register: name + phone required; gender, address, email optional | DONE | `app/(guest)/register`, `app/api/register`, `lib/config/validation.ts` |
| 4.1 | Registration list used for attendance / catering counts | DONE | Admin -> Guests (total, male/female, CSV). |
| 4.2 | Log back in without OTP, username + password | DONE | `lib/auth/*`, `app/(guest)/login` |
| 4.2 | About 50 guests at once | OPEN | Design is light (mostly static page, Supabase handles auth). **Not load-tested.** |
| 4.2 | Guest forgot password: self-service reset | DONE (unrun) | Recovery code shown once at registration; `/reset-password` (username + code + new password). `lib/auth/recovery.ts`, `app/api/reset-password`, `app/api/recovery`. Lockout after 5 wrong tries (15 min). |
| 4.2 | Lost recovery code | DONE | Logged-in guest creates a new one in My account; or admin resets the password in Admin -> Guests. |
| 4.3 | Pick one of 4 pickup centres at registration | DONE | Register page, or later from My account. |
| 4.3 | "Pending approval" status | DONE | My account. |
| 4.3 | Admin approves / declines | DONE | Admin -> Bus requests. |
| 4.3 | Seat capacity per bus enforced | DONE | `set_bus_request_status()` in `schema.sql`. Default capacity 36 = owner's example, still to confirm. |
| 4.3 | Contact name + phone only after approval | DONE (needs real data) | Enforced by row-level security on `pickup_contacts`. |
| 4.4 | "Click to get directions" to the venue | DONE (placeholder pin) | Wedding section, `VENUE_MAPS_URL`. |
| 4.4 | Directions to pickup point for approved guests | DONE | My account button, and "View on map" on each takeoff card. Uses a saved link or an address search. |
| 4.5 | Event Photos page, empty before the event | DONE | `app/(guest)/photos` |
| 4.5 | Owner uploads photos after the event | DONE | Admin -> Photos (bulk upload). |
| 4.5 | Guests upload their own photos | OPEN / TODO | Owner's note is ambiguous. Not built; would need moderation. |
| 4.6 | Afterparty is for show only | DONE | `SHOW_AFTERPARTY` in `lib/config/site.ts` toggles the row. |
| 4.7 | Admin: guest list, search, CSV | DONE | |
| 4.7 | Admin: bus queue with capacity | DONE | |
| 4.7 | Admin: edit pickups and contacts | DONE | |
| 4.7 | Admin: upload and delete photos | DONE | |
| 4.8 | Domain (owner buys on Namecheap) | OPEN | Waiting for the details. Set `NEXT_PUBLIC_SITE_URL`, add domain in Vercel. |

## 5. Design direction

**Session 2 redesign: "cinematic editorial".** The first version looked flat, so the page was rebuilt around photos and motion. Same palette and fonts, new structure.

| Item | Status | Notes |
| --- | --- | --- |
| Palette sampled from the Canva screenshots | DONE | Forest `#3d513c`, cream `#f3dbb9`, aqua `#b1d4e0`, sage `#afaf9b` (`app/globals.css`). |
| Typography | DONE (approximation) | Bodoni Moda (headings), Pinyon Script (accents), Jost (labels/body). Close to, not identical to, the Canva fonts. |
| Hero: full-screen photo slideshow | DONE (unseen) | 3 slides crossfade with a slow zoom; names rise in line by line; floating arch portrait; frosted-glass countdown. `components/site/Hero.tsx`. |
| Scroll-parallax photo bands | DONE (unseen) | Quote band, Save-the-date band, Invite (register) band. `Bands.tsx`, `PhotoBand.tsx`, `ParallaxBg.tsx`. |
| Our Journey: arch portraits + gliding gallery | DONE (unseen) | 3 arch portraits that open on scroll, 3 milestone cards (2018 / 2024 / 2026), two rows of 8 photos gliding in opposite directions, pause on hover. `Journey.tsx`, `GalleryMarquee.tsx`. |
| Wedding cards with photo headers + attire inspiration row | DONE (unseen) | `Wedding.tsx` |
| Takeoff Points: photo background + frosted cards | DONE (unseen) | `Pickups.tsx` |
| Schedule overlap bug | FIXED (unseen) | Heading now sits above a centred vertical timeline whose line fills as you scroll. `Schedule.tsx`, `ScheduleTimeline.tsx`. |
| FAQs: smooth animated accordion | DONE (unseen) | `Faq.tsx` |
| Sections slide over each other (rounded "sheet" edges) | DONE (unseen) | `.sheet` / `.section-pad` in `globals.css`. |
| Nav clear over hero then frosted; scroll-progress line; film grain; button hover lift | DONE (unseen) | `Navbar.tsx`, `ScrollProgress.tsx`, `globals.css`. |
| Botanical art | DONE | New woodcut-style flowers, leaves and fern fronds, drawn by script (`public/botanical/branch|corner|rose.svg`), drawn in on scroll and gently swaying. Original artwork, not the Canva illustrations. |
| Imagery on every page | DONE | Register / Log in / Reset have a side arch photo; Event Photos has a banner. |
| Motion is switched off for "reduce motion" users | DONE | Everything static, gallery becomes scrollable. |
| Image slots | DONE (placeholders) | 40 files in `public/images/`, all copies of the two sample photos, named by role. Table: `public/images/README.md`. Wiring: `lib/config/images.ts`. |
| Real portrait / venue / bus photos | PLACEHOLDER | Owner to supply; rename to the slot names and overwrite. |

"unseen" = written and parse-checked in the build session, but not yet looked at in a real browser by me. First thing next session: review screenshots from the Codespace and fix spacing/overlaps.

## 6. Tech plan

| Item | Status | Notes |
| --- | --- | --- |
| Next.js App Router + TypeScript + Tailwind 4 | DONE | Versions copied from `richards-site` (known working there). |
| Supabase auth + Postgres + Storage + RLS | DONE (unrun) | `supabase/schema.sql` |
| Vercel deployment | TODO | |
| Photo performance | PARTIAL | `next/image` lazy loading; originals are uploaded as-is (no resize). Fine for a few hundred photos. |
| Rate limiting on registration | TODO | Only a honeypot field for now. Add if spam appears. |
| Edit my details (guest) | TODO | Guests can view but not edit their details yet. Database rules already allow it. |
| Announcements / notifications | TODO | Was only an idea in v1 notes. |

## 7. Open questions (still waiting on the owner)

- Phone number + contact person for each of the 4 pickup centres
- Pickup times per centre; return-trip arrangement
- Bus capacity per centre (36 assumed)
- Registration deadline
- Guest photo uploads: yes or no? Should the gallery be public or guests-only? (Currently public.)
- Afterparty row: keep as is, reword or remove
- Real security measures for the FAQ; meaning of "Departure"
- Domain name
- Unclear voice-note lines: "kula of rice", "take away a gate", "Oshodi" (probably a pickup centre)

---

## What was reused from the two codebases you supplied

**From `richards-site` (Next.js 16 + Supabase):**
- Dependency versions (Next, React, Supabase JS, Tailwind 4, TypeScript), `next.config.js` security headers, `postcss.config.js`, tsconfig.
- The scroll-reveal pattern (`components/site/Reveal.tsx`) and the 10 MB image-upload limit.
- The PROGRESS.md habit of keeping a status file.

**From `outreachflow-web` (Vite + Supabase):**
- The auth-context idea (session + `onAuthStateChange`), adapted in `lib/auth/AuthProvider.tsx`.

**Deliberately NOT copied (and why):**
- `richards-site` admin login: a single shared username/password with a **hard-coded fallback secret and password** in `lib/auth/session.ts` and `proxy.ts`. Here, admin is a flag on a real user, enforced by the database.
- `outreachflow-web` `isAdmin` check: it reads `user_metadata.role`, which a signed-in user can edit themselves. Here, admin comes from `profiles.is_admin`, which guests cannot change.
- Everything unrelated to a wedding: ads, Firebase, newsletters, blog/CMS editor, comments, article and book pages, and the large image folders.

> Heads-up for your other projects: if `richards-site` or `outreachflow-web` are live, the two points above are worth fixing there too.

---

## Session 2 log (2026-11-19): redesign

Owner feedback on the first front end: "too basic, no transitions, not modern; images too small and too few; rose looks basic; schedule overlaps; flood the page with images using the two samples as placeholders named by role."

Done: everything in section 5 above. Also: `data-scroll-behavior="smooth"` added to `<html>` (silences the Next.js warning).

Not done / next:
- Review the redesign in a browser and tune (likely: image focus positions, spacing, mobile).
- Real photos: rename to the slot names (see `public/images/README.md`).
- Supabase project, then the "First checks" list above.

---

## Session 3 log (2026-11-19): owner feedback after running the redesign

The owner ran the redesign in Codespaces and with Supabase connected: "looks good, a few touches".

| Request | Status | Notes |
| --- | --- | --- |
| Admin pickup edits (numbers) would not save | FIXED (untested) | Saves now go through `/api/admin/save` (server, service role) and show the real error. Seats box no longer snaps to 0 while typing. Root cause of the old failure was not visible from screenshots. |
| Real event venue not editable | DONE (untested) | New table `site_settings`, Admin -> Venue tab (venue name, area, map link, footer contact) with live map preview. The home page reads it (updates within ~60 s). Needs `supabase/update-02-venue-settings.sql` run once. |
| Map preview in admin | DONE (untested) | Pickups and Venue tabs. Accepts a normal link, an embed iframe snippet, or empty (address search). Short maps.app.goo.gl links cannot be previewed exactly. |
| Make admin from the site | DONE (untested) | Admin -> Guests -> Make / Remove admin. First admin: one-time `ADMIN_SETUP_CODE` claim box, or one SQL line. |
| Footer credit | DONE | "Created & maintained by OJ" linking to opeyemijohn.vercel.app. |
| Mobile / tablet fixes | DONE (unseen) | Countdown fits 320-375 px; save-the-date line scales; hero names clamp; nav switches to the menu button below 1280 px (it collided at 1024-1279); Wedding cards 1 / 2 / 3 columns; mobile menu scrolls on short screens. |
