# eventsall.html — Redesign & Missing-Images Fix

## Goal
Make the `/eventsall.html` event archive look professional, fix the fonts/padding,
use the empty horizontal space effectively, and resolve the "most pics are missing" problem.

## Diagnosis (done)

### A. Missing pictures — root causes
1. **Deployment gap (primary).** 11 of the newest 2026 images are committed to git and
   exist locally, but return **404 on the live server**:
   - `assets/events26/`: `start.png`, `Idea Spark 4.0.jpeg`, `Igniting Young Minds 8.0.jpeg`,
     `Igniting Young Minds 8.0 Session 2.jpg`, `Igniting Young Minds 8.0 Session 3.jpg`,
     `Innovation Bootcamp (1..5).jpeg`, `Bg 2.0 Ep4.jpg`.
   - Cause: `.cpanel.yml` uses `/bin/cp * $DEPLOYPATH`, which does **not** copy the `assets/`
     subdirectory. New images reach the cPanel git repo but never `public_html/merise/assets/`.
   - These are the top of the default 2026 view → looks like "most pics are missing."
2. **12 truly-missing source files** referenced in 2023 entries (not in repo at all):
   `rb1.jpg, bionest.jpg, coc1.jpg, aspire1.jpg, vic1.jpg, earth1.jpg, pes1.jpg, dk1.jpg,
   startup1.jpg, ins1.jpg, inaug1.jpg, edu1.jpg`. Broken everywhere.
3. Totals: 392 image refs, 376 exist locally, 16 don't (4 are template placeholders in a
   code comment → harmless; 12 are the real 2023 gaps above).

### B. Design problems
- **Wasted space:** event cards (`.year-event-card`) are rendered as a flat vertical stack at
  full container width (max 1200px), each holding only a title + date + 3 small thumbnails.
  On desktop this is a long column with huge empty side margins.
- **Fonts:** base body text is default DM Sans ~16px; headings Playfair Display. User wants a
  different font style + larger text.
- **Padding/tabs:** year selector cards + event cards feel cramped / not polished.
- **Duplicate summary** text shows in both the hero banner and the detail panel.
- No favicon; browser tab title is bare ("ME-RIISE Events").

## Plan (MVP)

### 1. Fix layout to use space (biggest visual win)
- Render event cards in a responsive grid: `repeat(auto-fill, minmax(320px, 1fr))`
  (2–4 columns by viewport). Wrap the cards in an `.event-grid` container.
- Redesign each card: cover image on top (first image, 16:9, `object-fit: cover`),
  then title, a date pill, and a 2–3 line description. Keep click → modal gallery.
- Add a small "N photos" indicator when an event has multiple images.
- Remove the duplicate summary paragraph in the detail panel (keep it only in the hero banner).

### 2. Professional year tabs
- Convert `.year-grid` into a cleaner, horizontally-scrollable tab strip of pill buttons
  (year + event count), with a clear active state (accent fill/underline). Keeps current
  click-to-switch behavior.

### 3. Typography (font change + larger)
- New font pairing (pending user choice — see questions). Default proposal:
  **Headings = "Sora"**, **Body = "Inter"** (modern, professional, high legibility).
- Increase base body size to ~17px, line-height ~1.7; bump card title/description/date sizes.

### 4. Spacing / padding
- Increase card padding, grid gaps, and section spacing; widen container to `min(1280px, ...)`.

### 5. Browser-tab polish
- Add `<link rel="icon">` pointing to `assets/meriise_new_logo.png`.
- Title → `Events | ME-RIISE Foundation`.

### 6. Missing-images remediation (needs user action / decision)
- **2026 (deployment):** the 11 files must be uploaded to
  `public_html/merise/assets/events26/` on the host (cPanel File Manager/FTP), OR we add a
  **scoped** line to `.cpanel.yml`: `- /bin/cp -r assets $DEPLOYPATH` so future image pushes
  auto-deploy. (Scoped to `assets/` only — does not touch host-managed `courses/`.)
- **2023 (12 missing files):** either the user supplies the images, or we point those entries
  to an existing placeholder / remove the broken refs. Decision needed.

## Out of scope
- No build tooling, no shared templating (per repo conventions — self-contained page).
- Event copy/data content unchanged (only layout/markup/CSS of the renderers).

## Decisions (approved)
- Fonts: **Poppins (headings) + Inter (body)**.
- 2026 missing pics: **fix `.cpanel.yml`** to auto-deploy `assets/` on push.
  (Correct form: `mkdir -p $DEPLOYPATH/assets` + `cp -r assets/* $DEPLOYPATH/assets/` —
  `cp -r assets $DEPLOYPATH` would nest into assets/assets since the dir already exists.)
- 2023 missing pics: **branded placeholder** via a global `onerror` fallback (also covers any
  other image that fails to load, e.g. during a deploy gap).

## Status
- [x] Plan approved
- [x] Implement typography + favicon
- [x] Implement year tabs restyle
- [x] Implement event-card grid + placeholder fallback
- [x] Patch .cpanel.yml
- [x] Verify (headless Chrome: desktop + narrow; no horizontal overflow, sW=485 < iW=500)

## Changes made (handover)

### eventsall.html
- **Head:** title -> "Events | ME-RIISE Foundation"; added favicon (`assets/meriise_new_logo.png`);
  swapped Google Fonts import to **Inter + Poppins**.
- **Typography:** body now Inter, 17px, line-height 1.7. All former Playfair Display headings
  (hero h1, hero-banner h2, detail-panel h2, card h3, year tabs) now **Poppins**.
- **Container:** widened to `min(1280px, calc(100% - 2.5rem))`.
- **Overflow guard:** `html, body { max-width:100%; overflow-x:hidden; }` (no horizontal scroll).
- **Year tabs:** `.year-grid` is now a wrapping flex strip; `.year-card` is a pill tab showing
  the year + event count, with an accent-filled active state. (JS meta changed from the year
  title to `${events.length} events`.)
- **Event layout (space fix):** replaced the full-width vertically-stacked `.year-event-card`
  list with a responsive **`.event-grid`** (`repeat(auto-fill, minmax(300px,1fr))`, 2-4 cols).
  New `.event-card` = cover image (16:10, object-fit cover) + date pill + title + description,
  with an `N photos` badge when multiple images. Removed the duplicate summary paragraph that
  previously showed in both the hero banner and the detail panel.
- **Missing-image fallback:** added global `PLACEHOLDER` (inline base64 branded SVG,
  "ME-RIISE / Photo coming soon") + `imgFallback()`; every `<img>` in cards and the modal now
  has `onerror="imgFallback(this)"`. Covers the 12 missing 2023 files and any deploy-gap 404s.
- **Bug fix:** event cards are keyed by `data-index` instead of `data-title`; the old
  title-based lookup opened the wrong modal for duplicate titles (e.g. several 2025
  "Bridging Generations - Alumni Insights" entries).

### .cpanel.yml
- Added `mkdir -p $DEPLOYPATH/assets` + `cp -r assets/* $DEPLOYPATH/assets/` so image folders
  (incl. `assets/events26/`) deploy on every push. Scoped to `assets/` only; does not touch
  host-managed `courses/`. (NB: used the `assets/*` glob form, not `cp -r assets $DEPLOYPATH`,
  because the server's `assets/` already exists and the latter would nest to `assets/assets`.)

## Remaining / notes for maintainer
- The 11 newest 2026 images and the fix take effect **on next push/deploy**. Until then (or if
  not pushed) those slots show the placeholder.
- The 12 referenced 2023 photos (`rb1.jpg, bionest.jpg, coc1.jpg, aspire1.jpg, vic1.jpg,
  earth1.jpg, pes1.jpg, dk1.jpg, startup1.jpg, ins1.jpg, inaug1.jpg, edu1.jpg`) still need real
  files dropped into `assets/events23/`; they show the placeholder for now.
- Other image dirs (`images/`, `img/`, `team_imgs/`) used by *other* pages may have the same
  old deploy gap; out of scope here but worth the same `.cpanel.yml` treatment if needed.
