# Secret Admin Event Uploader for eventsall.html

## Goal
A hidden, password-protected admin page where only the admin can add new events to the live
`eventsall.html` by drag-and-dropping photos and typing the content (title, date, details).
New events appear for ALL visitors. Admin can also fix/remove events they added.

## Confirmed decisions
- Location: **separate secret page** `event-admin.php` (not linked anywhere; open by URL + login).
- Capability: **add** new events, plus **edit text / delete** for admin-added events (corrections).
- Photos: **multiple** per event (drag-drop several; first photo = cover).
- Backend confirmed: live site runs **PHP 8.2 / LiteSpeed**; `submit_form.php` already works.

## How it works (architecture)
Static pages can't remember uploads, so a tiny PHP backend persists them:

1. **Storage**
   - Event content -> `events_dynamic.json` (JSON array, auto-created by PHP on first save).
   - Uploaded photos -> new folder `assets/uploads/` (isolated from the git-managed assets).
2. **Public page** (`eventsall.html`) fetches `events_dynamic.json` on load and merges each entry
   into the matching year (newest first) before rendering. If the fetch fails, it just shows the
   existing built-in events (no breakage).
3. **Admin page** (`event-admin.php`, single self-contained file) handles:
   - First-run **password setup** (no password stored in git — see Security).
   - **Login / logout** (PHP session).
   - **Add event**: drag-drop multiple photos + Title + Date + Year (default 2026) + Details ->
     validates + saves photos to `assets/uploads/` -> appends to `events_dynamic.json`.
   - **Manage**: list of admin-added events with **Edit text** and **Delete** buttons.

## Files
- `event-admin.php` (NEW) — the whole admin UI + login + API actions (add/edit/delete) in one file.
- `assets/uploads/` (NEW folder) — admin-uploaded photos live here.
- `assets/uploads/.htaccess` (NEW) — blocks script execution in the upload folder (security).
- `events_dynamic.json` (auto-created by PHP; starts as `[]`).
- `.htevtadmin` (auto-created by PHP at setup) — holds the bcrypt password hash. Named `.ht*` so
  LiteSpeed/Apache refuse to serve it over the web.
- `eventsall.html` (MODIFY) — fetch + merge `events_dynamic.json` before rendering.

## Security (important — this is a public upload surface)
- **Password**: set by you on first visit; stored only as a **bcrypt hash** in `.htevtadmin`
  (web-inaccessible). Nothing secret committed to git.
- **Auth on every write**: add/edit/delete all require a valid logged-in session, not just a hidden UI.
- **CSRF token** on all forms.
- **Login throttle**: small delay on failed attempts.
- **File validation**: whitelist `.jpg/.jpeg/.png/.webp/.gif`, verify real image via `getimagesize()`,
  max ~8 MB/photo and ~10 photos/event, random safe filenames (original name discarded).
- **No-exec upload dir**: `.htaccess` in `assets/uploads/` prevents any uploaded file from running.
- Note: `events_dynamic.json` is public data (it's the event text shown on the page) — fine to be readable.

## Deployment / operating notes
- After I build it, these files must be uploaded to the server once (File Manager or Git):
  `event-admin.php`, `assets/uploads/.htaccess`, and the updated `eventsall.html`.
- Events you add through the panel are written to the **server's** `events_dynamic.json` + `assets/uploads/`
  — they go live instantly and do NOT require a redeploy. (They won't be in GitHub automatically; you
  can download `events_dynamic.json` anytime as a backup.)
- First time: open `meriise.org/event-admin.php` -> create your admin password -> start adding events.

## Out of scope (MVP)
- No editing of the 300+ built-in historical events (only admin-added ones are editable/deletable).
- No multi-user accounts / roles (single shared admin password).
- Editing an event's photos = delete the event and re-add (text edits are supported inline).

## Task breakdown
1. [ ] Create `assets/uploads/` + protective `.htaccess`.
2. [ ] Build `event-admin.php` (setup, login, add, edit, delete, CSRF, validation).
3. [ ] Modify `eventsall.html` to fetch + merge `events_dynamic.json`.
4. [ ] Test locally with PHP built-in server (add/edit/delete + public merge render).
5. [ ] Give upload + first-run instructions.

## Status — BUILT & TESTED (local PHP 8.2 via XAMPP)
- [x] `assets/uploads/` + protective `.htaccess` + `index.html` (also auto-created by PHP on first use)
- [x] `event-admin.php` — setup, login, add, edit, delete, CSRF, image validation
- [x] `eventsall.html` fetches + merges `events_dynamic.json` (newest admin events to top of their year)
- [x] `.gitignore` added (`.htevtadmin` + `assets/uploads/*` kept out of git)
- [x] Tested end-to-end:
  - first-run password setup -> login -> add event w/ photo -> appears on public page (count 27->28, card at top)
  - edit text + delete (removes event AND its photo) work
  - security: no-login add = 403; wrong CSRF = 400; non-image (even disguised .php) = rejected, nothing saved
  - uploads dir auto-creates with .htaccess protection on a fresh server

## Files delivered (to upload to the server)
- `event-admin.php`  -> public_html/
- `events_dynamic.json` (`[]`) -> public_html/
- `eventsall.html` (updated) -> public_html/ (replace existing)
- `assets/uploads/` is auto-created by the PHP on first photo upload; no need to upload it by hand.

## Operating notes
- First visit to `meriise.org/event-admin.php` prompts to create the admin password (stored only as
  a bcrypt hash in `.htevtadmin`, which LiteSpeed/Apache refuse to serve because it starts with `.ht`).
- Forgot the password? Delete `.htevtadmin` via File Manager; next visit lets you set a new one.
- Events added via the panel write to the server's `events_dynamic.json` + `assets/uploads/` and go
  live instantly (no redeploy). Back up `events_dynamic.json` if you want a copy in git.
