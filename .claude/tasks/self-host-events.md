# Bring Events back into our own site + make them easy to update

## Background / why
The "Events" menu on 36 pages points to an external site `https://meriise-events.vercel.app/`.
That site is a **separate project** (not in this repo). Right now it is broken:
- `/` loads but shows no events
- `/events26`, `/events25`, `/events` all return **404 Not Found**
So a colleague's `/events26` update is not live, and we cannot edit/redeploy it from here.

User decision: **stop using Vercel. Manage events inside our own site, and make updating easy.**

Good news: this repo already has a complete local gallery — `eventsall.html` — that groups
events by year through 2026, reading from a `eventData` object (script starts ~line 471).
Images live in `assets/eventsXX/`.

## Goal (MVP)
1. Point every "Events" link to our own `eventsall.html` instead of the Vercel URL.
2. Make adding a new event a copy-paste-one-block job, with plain instructions in the file.

## Part 1 — Re-point the Events menu (36 files)
Replace every `https://meriise-events.vercel.app/` (and `.../` variants) with `eventsall.html`
across the 36 tracked HTML pages. Relative link works because all pages sit at the repo root.
Files (from git grep): index.html, newsletter.html, iic.html, uba.html, team.html, startups.html,
sihbackup.html, rgep.html, ourAchivements.html, openPositionhide.html, notifications.html,
nain2_O_comingsoon.html, nain2_0.html, nain2projects.html, nain2.html, nain1.html, nain.html,
Krishimanthan.html, infrastructure.html, iic-cal.html, EdutechSphere.html, collab.html,
Certificates.html, callforincubationhide.html, aboutmeriise.html, testing.html, techat10.html,
pragyatha22.html, pragyathaintro.html, prag.html, faculty.html, documents.html, developers.html,
Pragyatha21.html, Nisp.html, Chathurpravathan.html.

## Part 2 — Make eventsall.html easy to update
At the very top of the `<script>` (just before `const eventData = {`), add a big comment block:
- Step-by-step "HOW TO ADD A NEW EVENT" (in simple English).
- A ready-to-copy TEMPLATE event block with the 4 fields (title, date, description, images).
- Note: put photos into `assets/events26/` first, then reference them by exact file name.
- Note: newest event goes at the TOP of that year's `events: [ ... ]` list.
- Warning about keeping the commas/quotes intact.

No change to how the page renders — purely additive comments so future updates are safe & easy.

## Out of scope (for now)
- Fixing/deleting the Vercel project (separate repo; user can retire it later).
- The 12 known missing photos in events23 (tracked in fix-eventsall-photos.md).
- Any build tool / CMS (site is intentionally no-build static HTML).

## Verification
- After Part 1: `git grep meriise-events.vercel.app -- '*.html'` returns 0 (excluding .history).
- Open eventsall.html locally; confirm gallery still renders and Events links resolve to it.

## Progress — DONE (2026-09-28)
- Part 1: Replaced all 57 occurrences of `https://meriise-events.vercel.app/` with
  `eventsall.html` across the 36 tracked HTML pages (bulk sed). Verified: 0 vercel refs
  remain (excluding .history), 57 new `"eventsall.html"` links present.
- Part 2: Added a plain-English "HOW TO ADD A NEW EVENT" guide + copy-paste TEMPLATE block
  as a `/* */` comment at the top of the `<script>` in eventsall.html, just before
  `const eventData = {`. Purely additive; render logic unchanged.
- Verification: Node parser confirms all inline scripts in eventsall.html parse OK
  (ALL 1 INLINE SCRIPTS PARSE OK). `const eventData` defined exactly once.
- NOT committed (per policy — commit only on request). User approved editing inside
  eventsall.html (not a separate data file).

## Follow-ups for user (optional)
- Retire the old Vercel project when ready (separate repo — not touched here).
- Add the 12 missing events23 photos (see fix-eventsall-photos.md).
