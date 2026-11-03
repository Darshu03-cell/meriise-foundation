# Shorten the featured video frame

## Goal
Make the featured Episode 6 portrait video frame feel less excessively tall, matching the user’s screenshot concern while retaining a portrait presentation.

## Approach
- Change only the featured video frame styling in `bridging-generations/style.css`.
- Scope the rule to `.featured__media .media-frame--vertical` and use a `2 / 3` aspect ratio instead of the current 9:16 padding-based height.
- Leave archive-card video frames, the embed, cover/play interaction, and other page content unchanged.

## Verification
- Check the featured frame height at desktop and mobile widths and confirm it remains portrait and within its column.
- Confirm archive card frame dimensions remain unchanged.
- Run `git diff --check`.

## Completed
- Scoped a 2:3 aspect ratio to the active featured Episode 6 video frame only.
- Verified 340×510px at 1440px viewport and 335×503px at 390px viewport; archive video frames remain landscape.
- `git diff --check` passes. External design evaluation passed; playback itself could not be confirmed in the browser environment.
