# Blessing & Godswill – Wedding Website Notes (v2)

Traditional marriage: **23 December 2026**, Odoro Aku, Uquo, Esit Eket LGA
Venue: Late Elder Okon Jeremiah's compound
Source: current Canva site (kiwi-sndmwy.my.canva.site/blessedwill2026/)
Updated with the owner's requirements from voice notes (transcripts 24-30 and the earlier domain/pickup note).

---

## 1. Current content (to carry over)

- **Hero:** "Blessing and Godswill are celebrating their traditional marriage on Dec. 23, 2026, Odoro Aku, Uquo, Esit Eket LGA" + RSVP button
- **Photos:** 3 oval portraits (couple together, Godswill, Blessing)
- **Our Journey Together:** Met in 2018 at the University of Uyo main gate. Godswill mistook Blessing for her twin sister Joy: "I am not Joy, I am Blessing." In 2024 she believed in his dreams and they built them together. Today is a celebration of love, belief, commitment and steadfastness.
- **The Wedding:** Venue, Means of Transportation, Attire
  - Attire: aquamarine blue, emerald green, burgundy and peach; smart casual or traditional; outdoor event
  - Buses provided for invited guests from designated kickoff points
- **Schedule (23 Dec 2026):** 12:00 PM Arrivals, 1:00 PM Marriage Ceremony, 5:30 PM Departure, 8:00 PM Afterparty (see note in section 4: afterparty is for show only)
- **FAQs:** wheelchair access (request at the lobby), security and safety, phones during ceremony (allowed; pro photographers and videographers hired)
- **Takeoff Points:** Ini LGA (Mentors House, opp. Sec. Comm. Sch.), Ikot Ekpene (St. Vincent Plaza by Uyo Rd, Ibiakpan Junction), Ikono (Tarbas Junction, cenotaph), Uyo (Ekom Iman Junction)

## 2. Issues found (fix in the new site)

**High priority**
- Takeoff Points: "Call:" fields are empty. Owner confirms these are intentionally to be shown only after approval (see section 4). Still need the phone number and contact person for each of the 4 locations.
- Page title / link preview is just "uca". Set a proper title, description and share image.
- Transportation photo is a London double-decker bus. Replace with a real or neutral image.

**Typos / wording**
- "Tthe safety of our guests are our utmost priority" -> "The safety of our guests is our utmost priority"
- "Yes you can use your phones during the ceremony, Though, we've hired..." -> "Yes, you can use your phones during the ceremony. However, we've hired..."
- "all invitation guest" -> "all invited guests"
- "Ikono," stray comma; "uyo rd" -> "Uyo Rd"; "call:" vs "Call:" inconsistent
- Security FAQ is vague; say what is actually in place

**Content gaps**
- RSVP deadline not stated
- Schedule: clarify what "Departure" means
- Photos: venue and attire images are Western-style stock; use real or traditional examples
- Takeoff points: no pickup times, no return-trip info (full pickup location details are in the link the owner already sent)

**Layout**
- Takeoff Points items misaligned
- "Page 1" label shows in the top bar on every section

## 3. New things to add

- Countdown to 23 Dec 2026
- Add to Calendar (Google / Apple / .ics)
- Colour palette swatches in the Attire section
- Accommodation suggestions for out-of-town guests
- WhatsApp share button and a proper Open Graph preview image
- Contact person(s) for questions
- Gift / registry or contribution info, if wanted

## 4. Owner requirements (functionality)

### 4.1 Access and registration
- **The public site is viewable without logging in** (home, story, wedding details, schedule, FAQs).
- **Everyone who wants to attend must register/sign up.** Purpose: attendance tracking and contact list (e.g. to send a general thank-you afterwards).
- Registration fields:
  - **Required:** full name, phone number
  - **Optional:** gender (male/female), home/residential address (where they are coming from), email
  - Form must submit successfully without the optional fields (some guests won't give them, and some don't use email).
- Registration is also used for catering/headcount planning (e.g. to portion food properly), visible in the back end.

### 4.2 Login
- Guests must be able to **log back in and see their details** without needing an OTP every time.
- Preferred: **unique username + password** (owner is not against Google login, but email is optional, so Google-only login would exclude some guests).
- Must handle **about 50 or more guests logged in at the same time** without problems.
- **Forgot password:** guests must be able to reset it themselves. Decision (session 1): no email/SMS, so each guest gets a one-time-shown **recovery code** at registration; reset = username + recovery code + new password. Admin can also reset. Guest can generate a new code when logged in.
- Owner already uses Supabase for authentication on another project and is comfortable with it.

### 4.3 Bus / pickup flow (approval based)
1. After registering, the guest sees the **full list of the 4 pickup centres** and can pick one to join the bus.
2. On submitting, status shows **"Pending approval to join the bus"**.
3. Owner reviews in the **back end** (name, phone, home address/where they are coming from) and approves or declines. Reasons: limited seats per bus (example mentioned: about 36 people per pickup), and knowing/trusting the person.
4. **Only after approval** does the guest see that pickup centre's **phone number and contact person** (for when they are late or miss the location).
5. Guests who don't pick a bus are simply registered as general attendees.
- Back end should show **seats approved vs capacity per pickup centre** so a full bus can't be over-approved.
- Phone numbers must truly be hidden from unapproved users (enforce on the server/database, not just hidden in the UI).

### 4.4 Directions
- **Main requirement:** a **"Click to get directions"** button on the venue section that opens Google Maps (or whichever maps app the guest uses, e.g. inDrive) to the **wedding venue**, for guests not taking the bus.
- **Optional / nice to have:** for approved bus guests, a directions link to their pickup point. If complicated, skip it; the venue link is the priority.

### 4.5 Event photos
- An **"Event Photos" button/section**. Before the event it shows no photos.
- After (or during) the event, photos taken at the wedding get uploaded so anyone with access can view them. Owner may upload them after the event (e.g. announce on the day: "check the site after 24 hours").
- Original idea also included guests uploading their own photos. Decide whether guests upload directly or only the owner uploads (see open questions).

### 4.6 Afterparty
- The "8:00 PM Afterparty" entry is **just for show / to look standard**; there is no real afterparty. Keep or reword on the site as the owner prefers, but do not promise guests a venue or event.

### 4.7 Admin / back end (summary)
- Guest list with all registration details
- Attendance count (for catering) and CSV export
- Bus approval queue with approve/decline and capacity per pickup centre
- Manage pickup centres (location, contact person, phone)
- Upload and manage event photos

### 4.8 Domain
- Owner will **buy the domain himself** (Namecheap, which he uses for his business; may compare other registrars) and send the details when ready.

## 5. Design direction

**Update (session 2):** the first front end was judged "too basic": no transitions, images too small and too few, plain rose, schedule text overlapping. Direction changed to **cinematic editorial**:

- Keep the Canva palette (forest `#3d513c`, cream `#f3dbb9`, sage `#afaf9b`, aqua `#b1d4e0`) and the serif + script + wide-tracked caps typography.
- Photos everywhere: full-screen hero slideshow (slow zoom), full-width parallax photo bands, a gliding two-row gallery in Our Journey (16 photos), arch-shaped portraits that open on scroll, photo headers on the Wedding cards, photo backgrounds on Takeoff / FAQ / footer, side photos on Register / Log in.
- Sections stack like sheets with big rounded tops. Frosted-glass cards. Scroll-progress line. Nav transparent over hero.
- Schedule = vertical timeline (heading above it, never beside it) so text cannot overlap.
- Botanicals: richer woodcut-style flowers, leaves and fern fronds (original art) that draw in on scroll; a stylised rose replaces the basic sprig.
- Image workflow: every image is a **named slot file** (`public/images/<role>.jpg`). The two sample photos are copied into all 40 slots as placeholders; the owner renames real photos to the slot names and drops them in. List: `public/images/README.md`.

Original plan, still valid for colours, type and structure:

- Palette, typography (display serif for headings; script for accent words "and", "Together", "of"; wide-tracked small caps for labels), rounded arch photo frames.
- Mobile-first (most guests open from WhatsApp on phones), light images, large tap targets.

**Structure (home page order):** Hero, Our Journey, photo band (quote), The Wedding, Takeoff Points, Schedule, photo band (save the date), FAQs, photo band (register), Footer. Separate pages: Event Photos, Register, Log in, Reset password, My account, Admin.

## 6. Tech plan

- Next.js (App Router) + TypeScript + Tailwind, fonts via next/font
- Database + auth + file storage: **Supabase** (Postgres with row-level security, auth, and storage for event photos). Fits the owner's experience and the "phone number visible only after approval" rule.
- Login: username + password (no OTP). Because email is optional, one common approach is to store a username and phone number on the profile and handle the login behind the scenes. To be confirmed with the codebase supplied.
- Hosting: Vercel (free tier is enough for ~50 concurrent guests on a mostly static page)
- Image optimisation for the photo gallery (thumbnails, lazy loading) so it loads on mobile data
- Dynamic Open Graph image for link previews
- Plan: owner supplies an existing Next.js / React codebase; pick the useful pieces and combine them

## 7. Open questions

- Phone number and contact person for each of the 4 pickup centres
- Pickup times per centre, and return-trip arrangement
- Bus capacity per pickup centre (example given: about 36)
- RSVP/registration deadline
- Event photos: can guests upload directly, or only the owner? Moderation needed?
- Login: confirm username + password only, or also offer Google login as an option
- Afterparty: keep the entry as is, reword it, or remove it
- Domain name once purchased
- Which codebase to start from
- Unclear in the transcripts (ask the owner): the phrase around 1:05 in the first note, the "one kula of rice" and "take away a gate" lines, "Oshodi" in the bus approval example (probably meant one of the 4 pickup centres)
