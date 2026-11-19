# Blessing & Godswill: wedding website

Traditional marriage, **23 December 2026**, Odoro Aku, Uquo, Esit Eket LGA.

Next.js (App Router) + TypeScript + Tailwind CSS 4 + Supabase (login, database, photo storage).
Planning notes are in [`docs/PROJECT_NOTES.md`](docs/PROJECT_NOTES.md). What is built and what is still open is in [`PROGRESS.md`](PROGRESS.md). **Read both at the start of every working session.**

## What the site does

- Public one-page site, photo-led with motion: full-screen hero slideshow + countdown, Our Journey (arch portraits + gliding photo gallery), The Wedding (venue directions, transport, attire), Takeoff Points, Schedule timeline, FAQs, with full-width scrolling photo bands between sections.
- Anyone can **register** (name + phone required; everything else optional) and **log in with a username and password**, no OTP.
- A guest who forgets their password can **reset it themselves** with their username + the **recovery code** shown at registration (`/reset-password`). The admin can also reset it.
- Guests can **request a bus seat** at one of four takeoff points. Requests are **pending** until the couple approves them. Only **after approval** does the guest see that point's contact person and phone number.
- **Admin dashboard** (`/admin`): approve or decline bus seats (with capacity per bus), guest list with search and CSV export, edit takeoff points and contact numbers, upload event photos.
- **Event Photos** page (`/photos`), empty until photos are uploaded.

## Design and images

Style: **cinematic editorial**. Forest green / cream / aqua palette, tall serif headings with script accents, photos behind and between sections, sections that slide over each other with rounded edges, and gentle motion (slideshow, parallax, gliding gallery, drawn-in botanical art). All motion switches off for visitors who prefer reduced motion.

**Every picture is a named file in `public/images/`** (40 slots, currently copies of the two sample photos). To use real photos: rename each to the slot name and overwrite it. No code changes. The slot list with recommended sizes is in [`public/images/README.md`](public/images/README.md); the wiring (and per-photo crop focus) is `lib/config/images.ts`.

Botanical art is in `public/botanical/` (`branch`, `corner`, `rose`). It is original line art, coloured with CSS, so change its colour with a text colour class on `<Botanical className="text-sage/60" />`.

## Setup

1. `npm install`
2. Create a project at supabase.com. Then:
   - **SQL Editor**: run `supabase/schema.sql`, then `supabase/seed.sql`.
   - **Authentication -> Sign In / Providers**: turn **off** "Allow new users to sign up" (accounts are created only by `/api/register`). Email confirmation can stay on; the server creates accounts as already confirmed.
3. Copy `.env.local.example` to `.env.local` and fill in the Supabase URL, anon key and service-role key.
4. `npm run dev`, open http://localhost:3000, register your own account.
5. Make yourself admin (SQL Editor): `update public.profiles set is_admin = true where username = 'your-username';`
6. Replace the placeholders: search the project for `TODO(owner)`.
7. Deploy on Vercel, add the same environment variables, then connect the domain.

## Placeholders waiting for the owner

| What | Where |
| --- | --- |
| Exact venue map pin | `VENUE_MAPS_URL` in `lib/config/site.ts` |
| Pickup contact names and phone numbers | Admin -> Pickups, or `supabase/seed.sql` |
| Pickup times and seats per bus | Admin -> Pickups, or `supabase/seed.sql` |
| General contact number | `GENERAL_CONTACT` in `lib/config/site.ts` |
| Registration deadline | `REGISTRATION_DEADLINE` in `lib/config/site.ts` |
| All photos (portraits, venue, bus, gallery...) | Rename to the slot names in `public/images/README.md` and overwrite the files |
| Domain | `NEXT_PUBLIC_SITE_URL` in `.env.local` / Vercel |

## How login works (no OTP)

**Sign-up:** the guest enters name, phone and a username + password. The server creates the account and shows a **recovery code** (like `K7M2-QX9D-4HTB`) once. The guest must tick "I have saved it" before continuing.

**Log in:** username + password. No code, no email, no SMS.

Why it works without email: Supabase Auth needs an email, but many guests have none. So each guest gets a private stand-in address `<username>@guests.example.com` (never emailed) behind the scenes. Their real email, if given, is only stored on their profile.

**Forgot password (self-service):** `/reset-password` -> username + recovery code + new password. The code is single-use, so a fresh one is shown straight after. Only a salted hash of the code is stored (table `recovery_codes`, unreadable from the browser). Five wrong tries lock that account's reset for 15 minutes, and a wrong username gives the same message as a wrong code.

**Lost the code too:**
- A logged-in guest can create a new code in My account.
- Otherwise the admin sets a new password in Admin -> Guests.

## Security model

All data rules live in the database (`supabase/schema.sql`), not in the page code:

- Guests see only their own profile and bus request.
- Pickup contact numbers are readable only by an admin or a guest whose request for that pickup is **approved**.
- Guests cannot change their own approval status or admin flag. Approval goes through `set_bus_request_status()`, which also refuses to over-fill a bus.
- The service-role key is used only in `app/api/*` routes and never reaches the browser.

## Folder guide

```
app/            pages (public home, register, login, account, photos, admin) and API routes
components/     site sections, admin tabs, small UI pieces
lib/config/     site.ts (all public content and placeholders), images.ts (image slots), validation.ts
lib/hooks/      scroll helpers (in view, scroll progress)
public/images/  the 40 named photo slots + README.md
public/botanical/  line-art flowers
lib/supabase/   browser client and server-only admin client
supabase/       schema.sql, seed.sql
docs/           PROJECT_NOTES.md
```
