# Add Bridging Generation to the main navigation

## Goal
Add a `Bridging Generation` navigation link immediately before `Contact Us`, pointing to the existing `bridging-generations/index.html` page.

## Scope and rationale
- Update all 37 root-level HTML pages that use the standard inline navigation with an active Contact Us link, so the menu stays consistent across those pages.
- Leave pages with different navigation layouts unchanged unless they share this standard nav; leave the separate `courses/` application out of scope.
- Reuse the existing relative destination pattern used by the homepage and Alumni page; do not introduce a shared nav component or unrelated markup changes.

## Implementation steps
1. Add the new link immediately before the active Contact Us link in each of the 37 standard navigation copies.
2. Preserve each page's existing formatting and ensure any duplicated active Contact Us entry (in `pragyathaintro.html`) gets the new link only once.

## Verification
- Check all 37 targeted pages contain the new link in the expected position and that its relative href resolves to the existing Bridging Generations page.
- Confirm no other nav entries or page content changed.
- As this is static HTML with no configured test runner, use repository searches and diff inspection for validation.

## Completed
- Added the link once immediately before the active Contact Us entry in all 37 targeted pages, preserving each page's existing indentation.
- Confirmed the destination file exists, each page has exactly one new link in the expected position, and `git diff --check` passes.
- Inspected representative diffs, including `index.html` and the page with duplicate Contact Us entries.
