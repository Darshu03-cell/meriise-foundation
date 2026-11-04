# Add Episode 3: Bhanu Krishnamurthy

## Goal
Add the supplied Episode 3 video to the existing “Bridging Generation 1” archive.

## Implementation
- Update only `bridging-generations/index.html`.
- Insert a card after Episode 4 and before the unnumbered speaker videos to preserve descending episode order.
- Use the verified YouTube title “Bhanu Krishnamurthy” with episode 3 labeling, embed ID `JCcGZ76-6uk`, a descriptive iframe title, lazy loading, and the matching “Watch on YouTube” link.
- Reuse existing Generation 1 video-card markup and responsive styling; do not modify other cards or sections.

## Verification
- Confirm the new card appears once, immediately after Episode 4 and before Satyesh Bellur.
- Confirm embed and watch links use the supplied video ID and the iframe has an accessible title.
- Run `git diff --check`.

## Completed
- Added the Episode 3 card after Episode 4 and before the unnumbered speakers, using the verified YouTube title.
- Confirmed one embed and one watch link use `JCcGZ76-6uk`, the iframe has a descriptive title, and episode order is correct.
- Scoped `git diff --check` passes for `bridging-generations/index.html`.
