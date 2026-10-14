# Fix: Contact Us form email must land in ceomeriise@mcehassan.ac.in

## CEO requirement (scope)
Contact Us **form submissions** must reliably arrive in the inbox
`ceomeriise@mcehassan.ac.in`. Nothing else in scope — do NOT change the 51 footer
`mailto:` links or any other page content.

## Diagnosis
Both form handlers already set the recipient to `ceomeriise@mcehassan.ac.in`:
- `submit_form.php` (used by `contactus.html`) — line 3 / line 68
- `courses/send_email.php` (used by the courses page form) — line 6 / line 94

The address is right; **delivery** fails. Cause: both send with
`From: noreply@mcehassan.ac.in`. The site is hosted on **Hostinger (meriise.org)**, whose
outgoing mail servers are SPF-authorized only for `@meriise.org`. A `From:` (and envelope
sender) on `mcehassan.ac.in` fails SPF at the receiving server (mcehassan.ac.in itself),
so the message is rejected or spam-filed.

## Fix (code only, no credentials needed)
In **both** `submit_form.php` and `courses/send_email.php`, for the email sent to the CEO:
1. Change `From:` from `noreply@mcehassan.ac.in` → `noreply@meriise.org` (SPF-aligned on
   Hostinger).
2. Keep `Reply-To:` = the visitor's email (so the CEO replies straight to the enquirer).
3. Add `MIME-Version: 1.0` header.
4. Pass the SPF **envelope sender** as the 5th `mail()` arg: `"-f noreply@meriise.org"`
   (SPF is checked against the envelope-from, so this is the part that actually makes it
   pass).
5. For the **confirmation email to the visitor**: also send `From: noreply@meriise.org`
   with the same `-f` (currently `send_email.php` uses `From: ceomeriise@mcehassan.ac.in`
   for this, which also fails SPF).

Recipient stays `ceomeriise@mcehassan.ac.in` (unchanged — already correct).

### Honest delivery reporting (courses/send_email.php)
Currently returns `success` to the visitor even when `mail()` fails. Both handlers already
save a backup copy of every submission to disk (`contact_messages.json` /
`courses/submissions/*.json`), so no enquiry is ever lost. Leave the visitor-facing
"success" UX as-is (message is safely stored), but this backup is the fallback the CEO can
read if any mail is ever missed.

## Optional, for even better deliverability (needs the user, not required for the fix)
Create `noreply@meriise.org` in hPanel → Emails. Hostinger then adds DKIM for it, pushing
delivery from "passes SPF" to "fully authenticated." The SPF fix above works even without
creating the mailbox, because meriise.org's SPF already authorizes Hostinger's mail servers.

## Files changed
- `submit_form.php`
- `courses/send_email.php`

## Verification
- `php -l` syntax check on both files (if PHP CLI available locally).
- Real delivery can only be confirmed on the live Hostinger host: submit the form once and
  confirm the email arrives in `ceomeriise@mcehassan.ac.in` (check inbox + spam).

---

## DONE (2026-10-14) — code changes applied

### submit_form.php
- CEO notification: `From: noreply@mcehassan.ac.in` → `From: ME-RIISE Foundation
  <noreply@meriise.org>`; added `MIME-Version: 1.0`; `mail()` now passes
  `"-f noreply@meriise.org"` (SPF envelope sender). `Reply-To` still = enquirer.
- Visitor confirmation email: same From/`-f` change.

### courses/send_email.php
- Admin (CEO) email headers: From → `noreply@meriise.org`, added `MIME-Version`.
- Visitor confirmation headers: From `ceomeriise@mcehassan.ac.in` → `noreply@meriise.org`,
  added `MIME-Version`.
- Both `mail()` calls now pass `"-f noreply@meriise.org"`.

Recipient unchanged (`ceomeriise@mcehassan.ac.in`). No local PHP CLI to lint; edits are
header-string + 5th-arg changes only.

### SUPERSEDED — PHP mail() didn't work on live
Live test showed a code/blank page → PHP/mail() route abandoned per user's choice.

---

## REVISED FIX (2026-10-14) — switched to FormSubmit.co (no PHP, no mail())

User picked FormSubmit. Both contact forms now post directly to
`https://formsubmit.co/ajax/ceomeriise@mcehassan.ac.in` — the service forwards each
submission to that inbox. No server mail() involved, so Hostinger's PHP/SPF/DKIM problems
are bypassed entirely.

### Files changed
- **`contactus.html`** — form `action` → FormSubmit ajax endpoint; added hidden
  `_subject`, `_captcha=false`, `_template=table`, and a `_honey` honeypot. Existing
  `handleSubmit()` AJAX (checks `response.ok`) unchanged.
- **`courses/script.js`** — contact handler now fetches the FormSubmit ajax endpoint
  (was `send_email.php`); appends `_subject`, `_template`, `_captcha=false`, `_replyto`;
  hardened success check to `data.success === true || data.success === 'true'`
  (FormSubmit returns the string `"true"`).

Old PHP handlers (`submit_form.php`, `courses/send_email.php`) are now unused by the forms
but left in place (harmless).

### Verified (headless Chrome, FormSubmit response mocked so NO real email sent)
- Both forms POST to `https://formsubmit.co/ajax/ceomeriise@mcehassan.ac.in` (method POST).
- Fields sent — contactus: name, email, program_interest, message (+ config). courses:
  name, email, program, message (+ config).
- Success message renders on a success response; no page JS errors.

### REMAINING (user action)
1. **Deploy** to live Hostinger (push does NOT auto-publish). Upload via hPanel/FTP:
   - `contactus.html` → site root
   - `courses/script.js` → `/courses/`
2. **One-time activation (critical):** the FIRST real submission on the live site makes
   FormSubmit email a confirmation link to `ceomeriise@mcehassan.ac.in`. The CEO must open
   that email and click **Activate**. Until then, submissions are NOT forwarded. After
   activating once, every submission lands in the inbox automatically.
3. **Optional — hide the email:** after activation, FormSubmit provides a random alias
   string; swap the action URL to `https://formsubmit.co/<alias>` so the raw address isn't
   in the page source. (Tell me the alias and I'll update both forms.)

### Note
The main-site nav "Contact Us" currently points to the footer (contact info + mailto, no
form). The actual form lives on `contactus.html`. If the CEO wants a form reachable from
the main nav, we can link `contactus.html` into the nav or add a form to the footer.
