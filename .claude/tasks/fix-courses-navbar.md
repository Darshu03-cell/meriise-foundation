# Fix: Make the courses page top tabs match the rest of the site

## Problem
`courses/index.html` uses a **Bootstrap navbar** (`<nav class="navbar navbar-expand-lg ...">`,
lines 28–47) with its own single-page scroll tabs: Home / About / Programs / MSME /
Gallery / Contact. Every other page on the site (`index.html`, `team.html`, `iic.html`,
`aboutmeriise.html`, … 30+ pages) uses the **standard ME-RIISE navbar** — the custom
RemixIcon nav defined by `assets/NavbarCode/assets/css/styles.css` +
`assets/NavbarCode/assets/js/main.js`, with tabs:
Home · Courses · About ME-RIISE ▾ · Wings of ME-RIISE ▾ · Events · TBI-MCE ▾ · Newsletter · Contact Us.

So the courses page is the only inconsistent one. Goal: make its top tabs identical to
the rest of the site.

## Scope
Only **`courses/index.html`** is edited. No shared files or other pages change.

## Why this is low-risk
`courses/style.css` already uses the same global reset (`* { margin:0; padding:0;
box-sizing:border-box }`) and `body { font-family:'Poppins' }` that the shared NavbarCode
CSS applies — so pulling in the shared navbar stylesheet won't change the courses page
body/typography. The nav classes (`.header`, `.nav__*`, `.dropdown__*`) are custom and do
not collide with Bootstrap or with the courses `.navbar*` rules.

## Implementation steps

1. **Head** (`courses/index.html`, near line 24, before `style.css`):
   - Add RemixIcon CDN: `<link href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css" rel="stylesheet">`
   - Add shared navbar CSS: `<link rel="stylesheet" href="../assets/NavbarCode/assets/css/styles.css">`
     (loaded **before** `style.css` so the courses body font/weight still wins).
   - Add a small inline sticky-wrapper style block mirroring `index.html`:
     ```css
     .snav-bar { background:#fff !important; z-index:1000; box-shadow:0 2px 14px rgba(0,0,0,.10); position:sticky; top:0; }
     .snav-bar header.header, .snav-bar .nav__data, .snav-bar .nav__menu, .snav-bar .nav__list { background:#fff !important; }
     ```

2. **Body** — replace the whole Bootstrap `<nav class="navbar ...">…</nav>` block
   (lines 28–47) with the standard markup copied from `index.html`'s nav
   (`<div class="snav-bar"><header class="header"><nav class="nav containerofNavbar">…`),
   including the full dropdowns. Logo: `../assets/MERIISE FOUNDATION logo 2.0.png`.

   **Link path rewrites** (courses/ is a subfolder, so root pages need `../`):
   - Home `index.html` → `../index.html`
   - Courses `courses/index.html` → `index.html` (this page)
   - About dropdown: `../aboutmeriise.html`, `../infrastructure.html`, `../ourAchivements.html`,
     `../Nisp.html`, `../collab.html`, `../Certificates.html`,
     `../index.html#boardofdirectors`, `../faculty.html`, `../team.html`
   - Wings dropdown: `../startups.html`, `../iic.html`, `../nain.html`, `../uba.html`, `../rgep.html`
     Pragyatha submenu: `https://pragyatha25.meriise.org/` & `https://pragyatha24.meriise.org/`
     kept absolute; `../pragyatha23.html`, `../pragyatha22.html`, `../Pragyatha21.html`, `../pragyatha19.html`
   - Events: `https://www.meriise.org/eventsall.html` (absolute, unchanged)
   - TBI-MCE dropdown: `../tbi.html`
   - Newsletter: `../newsletter.html`
   - Contact Us: `../index.html#footer`

3. **Before `</body>`** add: `<script src="../assets/NavbarCode/assets/js/main.js"></script>`
   (drives the mobile `#nav-toggle` and the click-to-open dropdowns; it's self-guarding and
   only touches its own IDs/classes).

4. Leave the now-unused `.navbar*` rules in `courses/style.css` in place (harmless; they
   target Bootstrap classes no longer present).

## Trade-off to confirm
Adopting the global nav means the courses page's **own in-page section tabs**
(About / Programs / MSME / Gallery / Contact that scroll within the page) are **replaced**
by the site-wide nav. This is what makes it "match the other tabs." If you'd rather keep
those section links too, we can add them as a secondary sub-bar — but the MVP matches the
rest of the site exactly.

## Verification
- Open `courses/index.html` via Live Server; confirm the top bar looks identical to
  `index.html`'s, dropdowns open on click, mobile hamburger toggles.
- Click each tab and confirm it lands on the correct root page (`../…`).

---

## COMPLETED (2026-10-14)

Approved approach: **Replace with site nav** (recommended option).

### Changes made
- **`courses/index.html`**
  - Head: added RemixIcon CDN + `../assets/NavbarCode/assets/css/styles.css` (before
    `style.css`) + an inline `<style>` block for the `.snav-bar` sticky/opaque wrapper
    **and a logo-size constraint** (see fix below).
  - Body: replaced the Bootstrap `<nav class="navbar ...">` with the standard
    `.snav-bar > header.header > nav.containerofNavbar` markup copied from `index.html`,
    with all root links rewritten to `../…`, Courses → `index.html`, logo →
    `../assets/MERIISE FOUNDATION logo 2.0.png`.
  - Before `</body>`: added `<script src="../assets/NavbarCode/assets/js/main.js"></script>`.
- **`courses/script.js`**
  - The old scroll handler grabbed `.navbar` (now removed) and dereferenced it → would
    throw on every scroll. Retargeted to `.snav-bar` and guarded with `if (navbar)`.
    Removed the dead Bootstrap `.navbar-collapse` close-on-click block.

### Issue found & fixed during verification
The logo `<img class="h-16">` relies on a **Tailwind** utility for sizing, but the courses
page doesn't load Tailwind — so the 1500×900 image rendered at full width, causing ~1166px
of horizontal overflow. It was invisible on desktop (logo is hidden there via
`nav__data{display:none}`) but on mobile it pushed the whole page — and the opened
hamburger menu — off-screen. Fixed by constraining `.snav-bar .nav__logo img`
(`height:48px; width:auto; max-width:160px`) in the inline style block.

### Verified (headless Chrome, served over http at repo root)
- Desktop: standard navbar renders identically to `index.html`; 8 tabs; dropdowns hidden
  by default (computed opacity 0) and open on click (caret flips).
- Mobile (390px): hamburger toggles `show-menu`; full link list visible on-screen; no page
  shift (`scrollX` 0); horizontal overflow gone (`scrollWidth` 1556→502, remainder is
  Bootstrap's clipped gutter).
- No JS page errors / failed requests from page code. Only network 404 is the browser's
  automatic `/favicon.ico` request — pre-existing (courses page declares no favicon),
  unrelated to this change.

### Left as-is
- The now-unused `.navbar*` rules in `courses/style.css` (target Bootstrap classes no
  longer present; harmless).
