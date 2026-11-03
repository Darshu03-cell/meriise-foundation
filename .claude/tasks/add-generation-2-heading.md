# Add Generation 2.0 section heading

## Goal
Show a clear **Bridging Generation 2.0 Videos** heading above the existing Generation 2.0 session cards, immediately after the “Selected Alumni Talks / Bridging Generation 1” section.

## Implementation
- Update only `bridging-generations/index.html`.
- Add a visible section heading before the existing Past Sessions grid.
- Associate the section with its visible heading using `aria-labelledby`.
- Preserve all existing video cards, embeds, links, styles, and ordering.

## Verification
- Check that the heading appears after the Generation 1 section and before the existing video cards.
- Confirm existing cards and video embeds are unchanged.
- Run `git diff --check`.

## Completed
- Added the visible “Bridging Generation 2.0 Videos” heading above the existing five-card section, linked the section to its heading with `aria-labelledby`, and preserved the video cards.
- Browser inspection confirms the heading, section label, and all five existing cards. `git diff --check` passes.
