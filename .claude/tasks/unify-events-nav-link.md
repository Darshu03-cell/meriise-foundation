# Task: Unify the "Events" nav link across all tabs

## Goal
Make the **Events** navigation tab point to the **same destination on every page**:
`https://www.meriise.org/eventsall.html`

User decision (2026-10-05): "All tabs → eventsall.html" (absolute URL on meriise.org).

## Current state
- Live pages all use the **relative** link `href="eventsall.html"` for the Events nav tab.
- `https://meriise-events.vercel.app/` appears **only** in `.history/` backups (VS Code local history), not in any live page.
- 57 occurrences of `href="eventsall.html"` across 36 live HTML files (all at repo root).
- Separate "Successful Events" footer links use `href="events.html"` — a DIFFERENT page, left untouched.

## Change
Replace the literal string `href="eventsall.html"` → `href="https://www.meriise.org/eventsall.html"`
in all top-level `.html` files.

- Precise literal match on `href="eventsall.html"` — will NOT touch `href="events.html"`.
- Only top-level files are processed (no recursion), so `.history/` backups are excluded.

## Files affected (36)
aboutmeriise.html, collab.html, Chathurpravathan.html, callforincubationhide.html, Certificates.html,
EdutechSphere.html, documents.html, developers.html, faculty.html, iic.html, Krishimanthan.html,
iic-cal.html, index.html, infrastructure.html, newsletter.html, nain2_O_comingsoon.html, nain2_0.html,
nain2projects.html, nain2.html, nain1.html, uba.html, testing.html, nain.html, techat10.html,
notifications.html, ourAchivements.html, Nisp.html, sihbackup.html, pragyatha22.html, prag.html,
openPositionhide.html, rgep.html, pragyathaintro.html, startups.html, Pragyatha21.html, team.html

Note: a few are intentionally-unlinked drafts/backups (callforincubationhide.html, openPositionhide.html,
nain2_O_comingsoon.html, sihbackup.html, testing.html). Updating them is harmless and keeps them consistent
if ever linked.

## Implementation
Single scripted in-place replacement over top-level `*.html` (PowerShell, no -Recurse), then verify:
- Expect 0 remaining `href="eventsall.html"` (relative) in live files.
- Expect 57 occurrences of `href="https://www.meriise.org/eventsall.html"`.
- Confirm `href="events.html"` count is unchanged.

## Verification
- Re-grep for relative `eventsall.html` in live files → should be 0.
- Re-grep for the new absolute URL → should be 57.
- Spot-check index.html and one other page.

## Out of scope
- `.history/` backups.
- "Successful Events" (`events.html`) links.
- No build/deploy (cPanel handles on push).
