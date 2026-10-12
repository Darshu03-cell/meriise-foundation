# Add PRAGYATHA'26 State Level Entrepreneurial Fest popup

## Goal
Add an on-load popup promoting **PRAGYATHA'26 – State Level Entrepreneurial Fest**
(Prize Pool ₹75,000, Oct 30–31 & Nov 1, 2026) with a **Register Here** button
pointing to https://www.certifyy.in/.

## Approach (MVP)
Reuse the existing popup **deck** `#tbi-c2-popup` in `index.html` (line ~3918).
The deck already renders multiple announcement cards side-by-side (desktop) /
stacked (mobile) with shared `.tbi-c2-popup__*` styles, per-card × close,
backdrop/Esc close. We add **one new card** — no new CSS/JS needed.

### Card content (new Card, placed FIRST in the deck so the public fest leads)
- Badge: `🏆 Registrations Open`
- Title: `PRAGYATHA'26` / `State Level Entrepreneurial Fest`
- Poster: clickable image (opens register link in new tab)
- Info line: `💰 Prize Pool ₹75,000` · `🗓️ Oct 30, 31 & Nov 1`
- Primary button: **Register Here** → https://www.certifyy.in/

### Markup to insert (before current Card 1, inside `#tbi-c2-popup`)
```html
<!-- Card: PRAGYATHA'26 State Level Entrepreneurial Fest -->
<div class="tbi-c2-popup__card">
    <button class="tbi-c2-popup__close" type="button" aria-label="Close popup" onclick="closeDeckCard(this)">&times;</button>
    <span class="tbi-c2-popup__badge">🏆 Registrations Open</span>
    <h2 class="tbi-c2-popup__title">PRAGYATHA'26<br>State Level Entrepreneurial Fest</h2>
    <a href="https://www.certifyy.in/" target="_blank" rel="noopener" class="tbi-c2-popup__poster" aria-label="Register for Pragyatha'26">
        <img src="popup_assets/pragyatha26-fest.jpg" alt="Pragyatha'26 State Level Entrepreneurial Fest poster – Prize Pool ₹75,000, Oct 30-31 & Nov 1" loading="lazy">
    </a>
    <p class="tbi-c2-popup__deadline">💰 <strong>Prize Pool ₹75,000 · Oct 30, 31 &amp; Nov 1</strong></p>
    <div class="tbi-c2-popup__buttons">
        <a href="https://www.certifyy.in/" target="_blank" rel="noopener" class="tbi-c2-popup__cta tbi-c2-popup__cta--primary">Register Here</a>
    </div>
</div>
```

## DEPENDENCY — poster image file
The pasted poster is NOT in the repo. A file must exist at
`popup_assets/pragyatha26-fest.jpg` (or `.png`) for the image to render.
**User action:** save the poster into `popup_assets/` with that name, OR tell me
the exact filename if you drop it in under a different name.

## Decisions (confirmed by user)
1. Card order — **Fest card FIRST**, Food Quotation + Cohort 2 stay. 3 cards total.
2. Keep the other two cards.
3. Poster filename — `popup_assets/pragyatha26-fest.jpg`; **user saves the file themselves.**

## Files changed
- `index.html` — insert one card block inside `#tbi-c2-popup` (~line 3919).
- `popup_assets/pragyatha26-fest.jpg` — NEW (user-provided poster).

## DONE (2026-10-12)
- Inserted the PRAGYATHA'26 fest card as the **first** card inside `#tbi-c2-popup`
  in `index.html` (just before the Food Quotation card). Uses existing
  `.tbi-c2-popup__*` classes — no new CSS/JS.
  - Poster links to https://www.certifyy.in/ (new tab); "Register Here" primary
    button same link.
  - Info line: `💰 Prize Pool ₹75,000 · Oct 30, 31 & Nov 1`.
- Updated the deck header comment to list all 3 cards in new order.
- Poster file confirmed present: `popup_assets/pragyatha26-fest.jpg` (~2.4 MB).
- Deck now shows 3 cards side-by-side (desktop) / stacked (mobile); each has its
  own × and backdrop/Esc close — unchanged behaviour.

## Deploy note
`index.html` is a top-level file → covered by `.cpanel.yml` `cp *` on push.
The new image in `popup_assets/` is a subdirectory — confirm the host picks up
`popup_assets/` (the other cards' images already live there, so it should).
