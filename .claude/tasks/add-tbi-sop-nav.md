# Plan: Add "TBI-MCE SOP" link to the site navigation (Documents submenu + TBI-MCE dropdown)

## Context
The ME-RIISE site has a shared, copy-pasted header on every page. The user wants the
Standard Operating Procedure PDF — already on disk at `assets/TBI-MCE_SOP.pdf` and already
shown as a document card in the body of `tbi.html` — to be reachable from the nav.

Per the user's answers:
- **Placement = both menus**: add the SOP link in the **About ME-RIISE → Documents** flyout
  *and* in the **TBI-MCE** dropdown.
- **Scope = all pages** that carry the shared nav (keep the copy-pasted header consistent).

The Documents submenu already contains MCE NISP POLICY / Collaborations / Certificates on
every page that has it, so no other Documents items need adding — only the new SOP entry.

## What gets added

New item in the **Documents** submenu (after the Certificates `<li>`):
```html
<li><a href="assets/TBI-MCE_SOP.pdf" class="dropdown__sublink" target="_blank" rel="noopener"><i class="ri-file-pdf-2-line"></i> TBI-MCE SOP</a></li>
```

New item in the **TBI-MCE** dropdown (after the "About TBI" `<li>`):
```html
<li><a href="assets/TBI-MCE_SOP.pdf" class="dropdown__link" target="_blank" rel="noopener"><i class="ri-file-pdf-2-line"></i> SOP</a></li>
```

- Opens the PDF in a new tab (`target="_blank" rel="noopener"`), matching the existing
  body SOP links in `tbi.html:1162-1163`.
- Uses `ri-file-pdf-2-line`, the same Remix icon already used for the SOP card
  (`tbi.html:1155`). Remix icons are already loaded on these pages.
- In the Documents flyout the label is "TBI-MCE SOP"; in the TBI-MCE dropdown it is just
  "SOP" (the menu is already titled TBI-MCE).

## Scope (29 files carrying the shared nav)
All non-history pages containing the `TBI-MCE <i` dropdown. Each has exactly **one**
Documents/Certificates block and **one** About-TBI block (verified), so each gets exactly
two new `<li>`s.

- **28 root-level pages** → link path `assets/TBI-MCE_SOP.pdf`:
  `index.html`, `tbi.html`, `startups.html`, `iic.html`, `iic-cal.html`, `nain.html`,
  `nain1.html`, `nain2.html`, `nain2_0.html`, `nain2projects.html`, `nain2_O_comingsoon.html`,
  `uba.html`, `rgep.html`, `aboutmeriise.html`, `infrastructure.html`, `ourAchivements.html`,
  `collab.html`, `Certificates.html`, `EdutechSphere.html`, `Krishimanthan.html`,
  `newsletter.html`, `contactus.html`, `team.html`, `faculty.html`? (only those with the
  dropdown), plus drafts/backups that carry the nav: `callforincubationhide.html`,
  `openPositionhide.html`, `sihbackup.html`, `rgep copy.html`, `team copy.html`.
- **1 subdirectory page** `courses/index.html` → link path `../assets/TBI-MCE_SOP.pdf`
  (this page uses `../Certificates.html` / `../tbi.html`, so it needs the `../` variant and
  is handled by a separate pass). Note: `courses/` is a self-contained app, but it carries
  the same nav, so it's included for consistency.

> The exact file set is generated at run time from
> `grep -rl 'TBI-MCE <i' --include=*.html . | grep -v .history`, not hand-maintained.

## Implementation approach
Markup varies between a compact one-line variant (`tbi.html`) and a verbose multi-line
variant (`index.html`), and indentation differs per page. Rather than 58 hand edits, use a
**validated `perl -0777 -i` pass** that inserts after the Certificates / About-TBI anchors
and reuses each page's own leading indentation. Both variants were dry-run verified against
`index.html`, `tbi.html`, and `courses/index.html` (read-only, no writes) — insertions land
in the right place and the `tbi.html` body SOP card is left untouched.

Two passes:
1. **Root pages** — match `href="Certificates.html"` / `href="tbi.html"`, insert with
   `assets/TBI-MCE_SOP.pdf`.
2. **courses/index.html** — match `href="../Certificates.html"` / `href="../tbi.html"`,
   insert with `../assets/TBI-MCE_SOP.pdf`.

Insertion regexes (proven):
```perl
# Documents submenu
s{([ \t]*)<li>(\s*)<a href="Certificates\.html" class="dropdown__sublink">((?:(?!</a>).)*?)</a>\s*</li>}
 {$&."\n".$1.'<li><a href="assets/TBI-MCE_SOP.pdf" class="dropdown__sublink" target="_blank" rel="noopener"><i class="ri-file-pdf-2-line"></i> TBI-MCE SOP</a></li>'}gse;
# TBI-MCE dropdown
s{([ \t]*)<li>(\s*)<a href="tbi\.html" class="dropdown__link">((?:(?!</a>).)*?)About TBI\s*</a>\s*</li>}
 {$&."\n".$1.'<li><a href="assets/TBI-MCE_SOP.pdf" class="dropdown__link" target="_blank" rel="noopener"><i class="ri-file-pdf-2-line"></i> SOP</a></li>'}gse;
```
The tempered `(?:(?!</a>).)*?` prevents the match from crossing into another anchor. A git
backup/stash is taken before running so the bulk edit is reversible.

## Out of scope
- Old/alternate inline mobile `<ul>` menus in `index.html` (e.g. `Nisp.html`/`collab.html`
  links at lines ~982, ~1144, ~1249) — those are legacy/commented and not the
  `dropdown__sublink` flyout the user screenshotted.
- No new pages, assets, or CSS; the PDF and icon font already exist.

## Verification
1. `git grep -c 'TBI-MCE_SOP.pdf' -- '*.html'` and confirm every in-scope page gained the
   two nav references (and `tbi.html` totals 4: 2 nav + 2 existing body card).
2. Sanity grep that each in-scope page has exactly one `dropdown__sublink ... TBI-MCE SOP`
   and one `dropdown__link ... > SOP` entry (no double insertion).
3. Open `index.html`, `tbi.html`, and `courses/index.html` via Live Server: hover
   **About ME-RIISE → Documents** → "TBI-MCE SOP" opens the PDF in a new tab; open the
   **TBI-MCE** menu → "SOP" opens the PDF. For `courses/index.html` confirm the `../` path
   resolves.
4. `git diff --stat` to confirm only the intended `<li>` additions (no stray reindentation).

## Note on workflow
CLAUDE.md asks for the plan under `.claude/tasks/`. Plan mode restricts edits to this plan
file only, so after approval I'll copy this plan to `.claude/tasks/add-tbi-sop-nav.md` and
update it as I implement.

---

## Implementation summary (completed)

Applied two `perl -0777 -i` passes and verified:

- **29 pages edited**, each gained exactly **2 lines** (one `dropdown__sublink` "TBI-MCE SOP"
  in the Documents flyout, one `dropdown__link` "SOP" in the TBI-MCE dropdown). Confirmed via
  per-file counts (1 | 1 everywhere) and a diff against a pre-edit snapshot (added=2, removed=0
  on every file; `tbi.html` shows added=4/removed=2 only because `diff` grouped each new line
  with its unchanged predecessor — content byte-identical).
- **Root pages** → `assets/TBI-MCE_SOP.pdf`; **courses/index.html** → `../assets/TBI-MCE_SOP.pdf`.
- Links verified nested inside the correct `<ul>` (`index.html` Documents submenu + TBI-MCE
  menu; `courses/index.html` Documents submenu). Target PDF exists (`assets/TBI-MCE_SOP.pdf`,
  ~507 KB). Existing body SOP card in `tbi.html` left untouched.
- Pre-existing uncommitted edits in `nain2_0.html`, `startups.html`, `tbi.html` were preserved
  (only the 2 nav lines added).

Not yet done: browser hover check via Live Server, and commit/deploy (awaiting user).
