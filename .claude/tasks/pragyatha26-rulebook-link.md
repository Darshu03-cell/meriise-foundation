# Add Rule Book PDF to the PRAGYATHA'26 fest popup card

## Goal
The PRAGYATHA'26 State Level Entrepreneurial Fest card (Card 1 in the on-load
popup deck `#tbi-c2-popup`, `index.html` ~line 3922) currently has only a
**Register Here** button. Add a link to the fest **Rule Book PDF** the user
dropped into `popup_assets/`.

## Current card (index.html ~3924-3935)
- Poster → https://www.certifyy.in/
- One button: **Register Here** → https://www.certifyy.in/

## Change (MVP — reuse existing classes, no new CSS/JS)
Add a **secondary** CTA button beside "Register Here", mirroring the Cohort 2
card's two-button layout (primary + `--secondary`):

```html
<div class="tbi-c2-popup__buttons">
    <a href="https://www.certifyy.in/" target="_blank" rel="noopener" class="tbi-c2-popup__cta tbi-c2-popup__cta--primary">Register Here</a>
    <a href="popup_assets/pragyatha26_rulebook.pdf" target="_blank" rel="noopener" class="tbi-c2-popup__cta tbi-c2-popup__cta--secondary">View Rule Book (PDF)</a>
</div>
```

## Open decision — the PDF filename
On disk the file is `popup_assets/PRAGYATHA '26 RULE BOOK .pdf` (spaces + a
trailing space before `.pdf`). Spaces/trailing-space are fragile on the Linux
host and must be `%20`-encoded in the href.

**Recommended:** rename to `pragyatha26_rulebook.pdf` to match the existing
`Arogyamanthan_rulebook.pdf` convention, then reference the clean name. The file
is untracked in git, so the rename is trivial and safe.

Alternative: keep the exact name and use
`href="popup_assets/PRAGYATHA%20'26%20RULE%20BOOK%20.pdf"`.

## Files changed
- `index.html` — add one `--secondary` button to Card 1's `__buttons` block.
- `popup_assets/PRAGYATHA '26 RULE BOOK .pdf` → rename to
  `popup_assets/pragyatha26_rulebook.pdf` (if rename option chosen).

## Deploy note
Per memory: meriise.org is on Hostinger; GitHub push does NOT auto-deploy. The
edited `index.html` and the PDF in `popup_assets/` must be uploaded to the host
(FTP) for the change to go live.

## DONE (2026-10-15)
- Chose the **rename** option (user-approved).
- Renamed `popup_assets/PRAGYATHA '26 RULE BOOK .pdf`
  → `popup_assets/pragyatha26_rulebook.pdf` (web-safe, matches
  `Arogyamanthan_rulebook.pdf` convention).
- Added a `--secondary` **View Rule Book (PDF)** button beside "Register Here"
  in Card 1 of `#tbi-c2-popup` (`index.html` ~line 3934). Reuses existing
  `.tbi-c2-popup__cta` classes — no new CSS/JS.
- Added a comment line noting the Rule Book path in the card block.
- NOTE for deploy: upload BOTH the renamed PDF and the edited `index.html`.
