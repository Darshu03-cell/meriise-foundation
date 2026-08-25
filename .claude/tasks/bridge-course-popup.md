# Task: Bridge Course popup — 5-Day Innovation Bootcamp 2026

> STATUS 2026-08-25: Both popups now HIDDEN — the whole `#promo-overlay` block (Bootcamp
> `am-card` + Guruprasad `bg2-card`) is wrapped in an HTML comment in `index.html` per convention.
> To re-enable, remove the `<!--` after the "DISABLED" comment (~line 3813) and the matching
> `-->` before `<style>` (~line 3852).


## Goal
Show an on-load promo popup on `index.html` for the **5-Day Innovation Bootcamp 2026**
(Bridge Course for Students), with a "Register Now" button linking to the Google Form.

## Context / current state
- `index.html` has a promo-overlay system near line ~3766–4230.
- The currently ACTIVE popup is **"Bridging Generations 2.0 – Guruprasad S"** (lines ~3812–3824),
  a single `bg2-card` inside `#promo-overlay`.
- Two reusable popup styles already exist in the inline `<style>` block:
  - `.am-popup__*` = **poster on the left + rich content on the right** (badge, title, subtitle,
    details list, buttons, contact). Used by the (commented-out) Arogya Manthan card.
  - `.bg2-popup__*` = simple **poster + buttons** card.
- Reusable JS already exists: `closeAmPopup()`, `closeBg2Popup()`, `hideCard()`, and the
  overlay backdrop-click handler. `hideCard()` hides the overlay once `am-card` **and**
  `bg2-card` are both gone/hidden.
- Convention (per CLAUDE.md): old popups are **commented out, not deleted**.

## Decision points (need your confirmation)
1. **Poster image** — the bootcamp poster you shared is NOT yet on disk. I need the file saved to
   `popup_assets/innovation-bootcamp.jpg` (any name is fine; I'll match it). Existing
   `images/bootcamp1.jpg` is an old *photo collage*, not this poster.
   → Please drop the poster into `popup_assets/` (suggested name `innovation-bootcamp.jpg`).
2. **Replace or coexist?** → **DECIDED: show BOTH side-by-side.** Keep the current Guruprasad
   `bg2-card` and add the Bootcamp `am-card` in the same `#promo-overlay`. Overlay already
   supports row layout (stacks on mobile <900px).

## Plan (MVP)
Reuse the existing `.am-popup__*` layout + `closeAmPopup()` — no new CSS/JS needed.

1. **Keep** the current active Guruprasad `bg2-card` in `#promo-overlay` (~3812–3824).
2. **Add**, inside that same `#promo-overlay`, an `am-card` (poster-left / content-right) so the
   two cards render side-by-side:
   - Poster (left): `popup_assets/innovation-bootcamp.jpg`, linked to the Google Form.
   - Badge: `🚀 Registrations Open`
   - Title: `5-Day Innovation Bootcamp 2026`
   - Subtitle: `Bridge Course for Students — Think · Build · Innovate`
   - Details list:
     - 📅 Date → 24–28 August 2026
     - 📍 Venue → Malnad College of Engineering, Hassan
     - 🎓 Open To → 10th / PUC / Diploma / ITI
     - 💰 Fee → ₹1,500
   - Short "What you'll learn" line (Design Thinking, Electronics & Sensors, Robotics,
     Build Your Own Bot) — kept compact so the card isn't too tall.
   - Buttons:
     - Primary → **Register Now** → `https://forms.gle/rf3iQKDCm4bXfAkK7` (target=_blank)
     - Secondary → **Close** (`onclick="closeAmPopup()"`)
   - Contact block: Dr. Geetha Kiran A · CEO, ME-RIISE FOUNDATION · 📞 9448179074 (reuse existing).
3. Keep the border/accent colors as the existing `am-popup` teal, OR retune to the poster's
   purple/orange. MVP = keep teal (no CSS churn). Can theme later if you want.

## Out of scope
- No new page, no nav changes, no build step.
- Poster image sourcing (you provide the file).

## Verification
- Open `index.html` via Live Server; popup appears on load, poster + Register button work,
  close button and backdrop click both dismiss it, layout stacks correctly on mobile (<720px).

## Implementation notes (DONE)
- Edited `index.html` at the live `#promo-overlay` (now ~line 3812). Changed the comment to
  "5-Day Innovation Bootcamp 2026 + Bridging Generations 2.0 (side-by-side)".
- Inserted an `am-card` (Bootcamp) as the FIRST child of the overlay, before the existing
  Guruprasad `bg2-card` → Bootcamp on the left, Guruprasad on the right (stacks on mobile).
- Reused existing `.am-popup__*` CSS and `closeAmPopup()` / `hideCard()` JS — no new CSS/JS.
  `hideCard()` already handles the two-card case: overlay hides only once BOTH cards are closed.
- Bootcamp card content: badge "🚀 Registrations Open", title "5-Day Innovation Bootcamp 2026",
  subtitle "Bridge Course for Students — Think · Build · Innovate", one-line learn summary,
  details (Date 24–28 Aug 2026 / Venue MCE Hassan / Open To 10th·PUC·Diploma·ITI / Fee ₹1,500),
  buttons "📲 Register Now" → https://forms.gle/rf3iQKDCm4bXfAkK7 (target=_blank) and "Close",
  and the standard contact block (Dr. Geetha Kiran A · 9448179074).
- Poster `<img src>` = `popup_assets/innovation-bootcamp.jpg`. **Owner to add this file** — the
  card renders now with a broken-image placeholder until the poster is dropped in.
- No duplicate live IDs: the other `am-card`/`bg2-card` at ~3767–3799 remain inside the
  commented-out "DISABLED" block.
