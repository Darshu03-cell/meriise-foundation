# Add Vinay Prabhakar Episode 6 card

## Goal
Add Vinay Prabhakar to the “Bridging Generation 1” archive using the existing poster asset.

## Confirmed behavior
- Keep the existing Sanjay Gajendra Episode 6 featured entry unchanged.
- Add Vinay as a second Episode 6 archive card, as requested.
- Use a poster-only card; no video URL was supplied, so do not fabricate an embed or link.
- Use the existing `bridging-generations/images/Vinayprabhakar.png` poster and the date shown on it: 26 September 2025.

## Implementation
- Update only `bridging-generations/index.html`.
- Insert a card in the Generation 1 grid after Episode 7 and before Episode 5, using the existing card styles.
- Give the poster meaningful alt text and show the episode label, speaker name, and date. Do not present the static poster as a playable video.
- Preserve the featured Episode 6 and all other archive cards unchanged.

## Verification
- Confirm the poster path exists and loads in the page.
- Confirm the new card sits between Episodes 7 and 5, has no invented video/embed link, and leaves the existing Sanjay feature intact.
- Run `git diff --check`.

## Completed
- Added a poster-only Episode 6 card for Vinay Prabhakar between Episodes 7 and 5, with accessible alt text and the poster date.
- Confirmed the local poster asset exists, card order is correct, no video/link was invented, and the existing Sanjay Episode 6 feature remains unchanged.
- Scoped `git diff --check` passes for `bridging-generations/index.html`.
