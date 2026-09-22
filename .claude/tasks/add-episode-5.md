# Task: Add "Episode 5" to Bridging Generations (page + homepage)

## Context
Publish a new Bridging Generations talk, **Episode 5**, from a YouTube Short
(`https://youtube.com/shorts/r5yDfrottyE`, embed id `r5yDfrottyE`). It should be the Featured
video at the top of the Bridging Generations page (marked as newly added) and also surfaced on
the homepage via the active `#bg2-popup`.

## Changes made (completed 2026-09-22)

### `bridging-generations/index.html`
- **Featured video → Episode 5** ([:86](../../bridging-generations/index.html#L86)): swapped
  iframe `src` `…/embed/s3qMDtqubRQ` → `…/embed/r5yDfrottyE`; updated `title` to
  `Bridging Generations – Episode 5, Alumni Insights 2.0`. Existing `#featured-video-cover` +
  `setupVideoCover('featured-video-cover','featured-video-iframe')` in `script.js` still drive
  the play/autoplay — no JS change.
- **"Newly added" markers**: eyebrow ([:65](../../bridging-generations/index.html#L65)) →
  `Bridging Generations · New Episode`; caption ([:95](../../bridging-generations/index.html#L95))
  → `Episode 5 — Alumni Insights 2.0`.
- **Preserved the previous featured video** (`s3qMDtqubRQ`): added a new
  `section section--latest` right after the featured block
  ([:100–112](../../bridging-generations/index.html#L100-L112)), eyebrow `Past Session`, heading
  `Alumni Insights 2.0 — Featured Session`, using `media-frame media-frame--vertical` with a
  plain iframe (no play-cover → no new IDs, no `setupVideoCover` call).

### `index.html` (homepage)
- Added a **"Watch Episode 5"** primary CTA to the `#bg2-popup` buttons
  ([:3770](../../index.html#L3770)) linking to the Short (`target="_blank" rel="noopener"`),
  reusing existing `bg2-popup__cta` classes.

## Not changed
- No new CSS, no `script.js` edits. Old featured video demoted, not deleted.
- "Watch Live" Teams link and Upcoming cards untouched.

## Verification
- Open `bridging-generations/index.html` (Live Server :5501): featured frame plays the Episode 5
  Short; eyebrow/caption read as new; new Past Session below plays `s3qMDtqubRQ`.
- Open homepage `index.html`: bg2 popup shows on load with a working "Watch Episode 5" button.

## Follow-ups (optional)
- Rename the demoted section heading if a specific speaker/title is preferred.
- If the live session has ended, consider removing the stale "Watch Live" Teams button.
