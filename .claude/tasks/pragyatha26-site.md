# PRAGYATHA '26 — subdomain site (pragyatha26.meriise.org)

## Goal
Build a brand-new, good-looking landing site for **PRAGYATHA '26 — State Level
Entrepreneurial Fest**, to be hosted on the subdomain **pragyatha26.meriise.org**
(the user is creating the subdomain). Fresh **corporate theme** (NOT the Game-of-
Thrones icy theme of '25). All content comes from the official **Pragyatha'26
popup** = poster (`popup_assets/pragyatha26-fest.jpg`) + rulebook
(`popup_assets/pragyatha26_rulebook.pdf`). **8 events.**

## Analysis of the reference (done)
- **pragyatha25.meriise.org** = a compiled **React + Vite + Tailwind SPA** (Game-of-
  Thrones "icy throne" theme: snowfall canvas, GOT display font, cyan-on-navy).
  Its source is NOT in this repo — only the built bundle is live. So '26 is a
  fresh build regardless; we are NOT reusing '25's theme (user wants a new one).
- We keep the **proven structure** of '25 (hero + live countdown, about,
  filterable events grid, rulebook download, contacts, footer) but reskin it in
  the '26 corporate look and load it with the real '26 content.

## Decisions (confirmed by user)
1. **Approach:** static, self-contained site (no build step) — matches this repo's
   philosophy and drops straight into the subdomain docroot. (Vanilla HTML/CSS/JS.)
2. **Theme:** fresh **corporate** theme taken from the '26 poster.
3. **Content:** from the '26 popup (poster + rulebook). **8 events.**
4. **Hosting:** user owns the subdomain; we deliver a `pragyatha26/` folder to upload.

## Theme spec (from the poster — corporate / startup)
- **Background:** soft pastel gradient — lavender/periwinkle → pink → soft blue,
  with large blurred gradient "blobs". Light, airy, professional.
- **Headings / wordmark:** deep indigo-violet `#2d2a7a` → `#3b3ab0`.
- **Primary accent:** violet/blue `#5b5bd6` / `#4f46e5`.
- **Event numbers / highlights:** red `#e63946` / `#ff3b4e`.
- **Date & CTA accent:** coral-pink `#ff6b9d` → magenta `#ff4f8b`.
- **Cards:** white / frosted glass, soft shadow, rounded `~16px`.
- **Fonts (Google Fonts CDN — allowed; courses/ already uses CDNs):**
  - Display/wordmark: **Poppins** (700/800) or **Sora** — chunky geometric sans.
  - Body: **Montserrat** / Inter.
- **Motion (replaces '25 snowfall):** floating gradient blobs + subtle particle
  drift + fade/scale-in on scroll (IntersectionObserver). Tasteful, corporate.

## Fest facts (baked in)
- Title: **PRAGYATHA '26 — State Level Entrepreneurial Fest**
- Host: **Malnad College of Engineering, Hassan** × **ME-RIISE Foundation**
  (A Section 8 Company) — *"Elevating Ideas, Incubating Success."*
  TBI-MCE (Technology Business Incubator). Partners: K-tech, TBI-MCE, Startup Karnataka.
- Dates: **Oct 30, 31 & Nov 1, 2026**
- **Prize Pool ₹75,000**
- Register: **https://www.certifyy.in/**  ·  Site: meriise.org  ·  IG: @me_riise
- Countdown target: **2026-10-30T09:00:00** (first reporting slot).
- Contacts: **Megha H M +91 7795636004**, **Stapley V S +91 9844293678**

## The 8 events (from rulebook, baked into a JS data array)
| # | Name | Tagline | Type | When | Venue | Team |
|---|------|---------|------|------|-------|------|
| 01 | **ADSPIZE** | Strategy · Creativity · Impact | Marketing/advertising challenge | 30 Oct, 12:00 PM | Basketball Court | Team |
| 02 | **UEXPLORE** | Explore · Learn · Build | 24-hr UI/UX Hackathon | 30–31 Oct, report 1:00 PM | CS Lab 1 | 2 |
| 03 | **CODEFORGE '26** | Code · Innovate · Create | 24-hr Software Hackathon | 30–31 Oct, report 1:00 PM | Library | max 4 |
| 04 | **HARDWARE-X** | Design · Build · Solve | 24-hr Hardware Hackathon | 31 Oct–1 Nov, report 9:00 AM | Library | max 4 |
| 05 | **ENTRORPHOSIS** | Ideate · Pitch · Grow | Entrepreneurial challenge (4 stages) | 30–31 Oct, report 9:00 AM | EEE Seminar Hall | Team |
| 06 | **INVEST SMART 2026** | Analyse · Invest · Prosper | Stock-market Workshop | 30–31 Oct, report 10:00 AM | Alumni Hall | Individual |
| 07 | **BRIDGE-X** | Connect · Collaborate · Build | Bridge-building Competition | 31 Oct, 10:00 AM | ME-RIISE Foundation | max 2 |
| 08 | **CATAPULT** | Launch · Scale · Lead | Launcher-building Challenge | 31 Oct, 10:00 AM | ME-RIISE Foundation | max 2 |

Each event card → click opens a **modal** with: description, rules summary,
what-to-bring, evaluation criteria, date/time/venue (all data pulled from rulebook).
**Category filter chips:** All · Hackathon (02,03,04) · Business (01,05,06) ·
Build (07,08). (Final chip wording during build.)

## File / folder structure (new, self-contained)
```
pragyatha26/
├── index.html            # the whole page (semantic sections)
├── css/style.css         # corporate theme + responsive + animations
├── js/main.js            # countdown, event data+modals, filters, nav, scroll anims
├── assets/
│   ├── poster.jpg        # from popup_assets/pragyatha26-fest.jpg
│   ├── meriise-logo.png  # from repo root meriise_new_logo.png / me-riiseLogoUpdated.png
│   ├── mce-logo.png      # from images/mce.jpg or img/college logo.png
│   ├── rulebook.pdf      # from popup_assets/pragyatha26_rulebook.pdf
│   └── favicon.png       # meriise-favicon.png
```
Self-contained so it uploads to the subdomain docroot as-is. (Google Fonts via
CDN `<link>`; everything else local.)

## Page sections (order)
1. **Sticky navbar** — logo + links (Home, About, Events, Prizes, Contact) +
   "Register" button. Mobile hamburger.
2. **Hero** — MCE × ME-RIISE lockup, "PRAGYATHA '26" wordmark, "State Level
   Entrepreneurial Fest", dates, **live countdown**, Register + View Events CTAs,
   animated gradient-blob background.
3. **About** — fest intro, Section-8/TBI blurb, partner badges (K-tech, TBI-MCE,
   Startup Karnataka), 3 stat tiles (8 Events · ₹75,000 Prize Pool · 3 Days).
4. **Events** — filter chips + responsive grid of 8 cards (number, name, tagline,
   type, date/venue) → modal with full rulebook detail.
5. **Prize / highlight band** — ₹75,000 Prize Pool + dates, big CTA.
6. **Rulebook** — "Download the official Rule Book" → `assets/rulebook.pdf`.
7. **Contact** — organizer contacts (Megha, Stapley), IG, website, Register link.
8. **Footer** — ME-RIISE/MCE credit, quick links, social, copyright.

## Tech approach
- Plain HTML/CSS/JS, no framework/build (consistent with repo). Mobile-first
  responsive, light corporate theme. Accessible (alt text, aria on modal/nav,
  keyboard-close on modal). All 8 events in one JS data array to avoid markup
  duplication.

## Tasks
1. Scaffold `pragyatha26/` folder + copy assets (poster, logos, rulebook, favicon).
2. `index.html` — all sections with semantic markup.
3. `css/style.css` — corporate theme, layout, responsive, animations.
4. `js/main.js` — countdown, event data + modal, category filters, mobile nav,
   scroll-reveal.
5. Self-review in browser (Live Server) at a few widths; fix layout/contrast.
6. Hand-off notes for subdomain upload.

## Deployment (per memory: Hostinger, NO git auto-deploy)
- The `pragyatha26/` folder's **contents** go into the **pragyatha26 subdomain's
  document root** on Hostinger (hPanel → the subdomain's folder), via File Manager
  or FTP. Pushing to GitHub will NOT publish it. I'll give exact upload steps at
  the end.

## DONE (2026-10-27)
Built the full self-contained site in **`pragyatha26/`**:
```
pragyatha26/
├── index.html            # all 8 sections, semantic + accessible
├── css/style.css         # corporate pastel theme, responsive, animations
├── js/main.js            # 8-event data array, countdown, filters, modal, nav, scroll-reveal
└── assets/{poster.jpg, meriise-logo.png, mce-logo.png, rulebook.pdf, favicon.png}
```
- **Theme:** pastel gradient (lavender→pink→periwinkle) + 4 animated blur blobs,
  gradient PRAGYATHA '26 wordmark, red event numbers, pink CTA/date accents,
  frosted white cards. Fonts Poppins + Montserrat (Google CDN). Replaced '25
  snowfall with blobs + IntersectionObserver scroll-reveal (+ no-IO & reduced-
  motion fallbacks).
- **Content:** every fact from poster + rulebook — Oct 30–Nov 1 2026, ₹75,000,
  live countdown to `2026-10-30T09:00+05:30`, Register → certifyy.in, rulebook
  PDF download, organizers Megha H M / Stapley V S, IG @me_riise.
- **8 events** render from a JS data array as a filterable grid (All / Hackathons /
  Business / Build Challenges). Each card opens a **modal** with description, team,
  themes/stages, rules, what-to-bring, evaluation, date/reporting/venue + register.
- **Verified** via headless-Chrome DevTools-Protocol captures (Node built-in
  WebSocket, device-metrics emulation to bypass Chrome's ~485px min-width clamp):
  full-page desktop (1280), true mobile (390×2x), and an open event modal. No
  horizontal overflow (scrollWidth == viewport). Temp diagnostics removed; no
  review artifacts left in the folder.

## Open items / assumptions
- Countdown target assumed `2026-10-30T09:00:00`; easy to change.
- Category chip grouping is my proposal; adjustable.
- Using Google Fonts CDN for Poppins+Montserrat (no build). If you want zero
  external calls, I can self-host the .ttf instead.
- Registration link → https://www.certifyy.in/ (same as popup).
```
