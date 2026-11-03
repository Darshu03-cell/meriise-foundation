# Event photo upload limit

## Goal

Allow admins to upload up to five photos per new event, rejecting additional selections clearly. Enforce the limit in both the browser and PHP; preserve existing gallery behavior and existing events with more than five photos.

## Implementation

1. In `event-admin.php`, change the server-side file limit from 12 to 5.
2. Enforce the same limit for both picker selection and drag-and-drop. Keep the selected files and previews synchronized; show a clear message when the user attempts to add more than five.
3. Keep the PHP count validation authoritative so requests exceeding five uploads are rejected before files are processed.
4. Do not change `eventsall.html` or existing event data: the public gallery supports existing records with more than five photos.

## Verification

- Check client behavior with 1, 5, and 6 selected files, including drag-and-drop.
- Confirm over-limit selection gives clear feedback and does not leave the preview out of sync with the submitted files.
- Confirm the server rejects an over-limit upload independently of browser behavior.
- Confirm the public gallery continues rendering all photos for existing events.

## Completed

- Changed the server-side upload limit to five.
- Added client-side accumulation for picker selections and drag-and-drop, so photos chosen in separate batches are retained up to five. Further selections are rejected with a clear message.
- Updated the upload instructions and selection prompt to explain that more photos can be added.
- `node` syntax validation passed for the changed upload JavaScript, and `git diff --check` passed.
- PHP lint could not be run because PHP is not installed in the current environment. No live uploads or event data were changed.
- A focused Node test confirmed batches of 1 + 4 produce five selected files, while a sixth is rejected and reported.
