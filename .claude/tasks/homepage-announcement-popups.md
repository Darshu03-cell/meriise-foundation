# Plan: Homepage Announcement Popups

## Goal
Show three current homepage announcements: Bridging Generations 2.0, Pragyatha '26, and TBI-MCE Cohort 2. Replace the expired Arogya Manthan 2K26 popup.

## Current state
- `#bg2-popup` exists but is hidden; it uses the older Bridging poster and a June session link.
- `#am-popup` for Arogya Manthan is currently visible on page load, although its July dates have passed.
- Popup poster assets already exist: `popup_assets/sanjaygjendra.png`, `popup_assets/pragyatha26-fest.jpg`, and `popup_assets/tbi-cohort2.jpg`.
- The Pragyatha poster lists October 30–November 1, 2026, and a ₹75,000 prize pool. Its QR destination is not confirmed from the visible poster text; the footer lists `meriise.org`.
- The Cohort 2 poster gives an October 31, 2026 application deadline and the form URL `https://forms.gle/E6hoccyAMDiEtqrH6`.
- Episode 6 details are already represented in the Bridging Generations page and its task notes: Sanjay Gajendra, October 24, 2026, 6:00–7:00 PM IST, with a teaser, question form, and live-session link.

## Proposed implementation
Show all three announcement cards together in one on-load overlay. Arrange them side by side on desktop and stack them vertically on mobile. Keep one close control for the overlay.

1. Update the existing Bridging Generations card to use the current Episode 6 poster and details, with the current teaser, question form, and join links.
2. Add a Pragyatha '26 card using `popup_assets/pragyatha26-fest.jpg`, the October 30–November 1 dates, prize-pool information, and a registration CTA. Unless a different registration URL is supplied, link the CTA to `https://www.meriise.org/` as indicated on the poster.
3. Add a TBI-MCE Cohort 2 card using `popup_assets/tbi-cohort2.jpg`, the October 31 deadline, and the poster's Google Forms application URL.
4. Disable the outdated Arogya popup while preserving its markup/styles according to the repository convention of keeping old popup content commented out.
5. Keep all cards usable on desktop and mobile, and provide accessible names/labels for the dialog and close control.

## Out of scope
- No changes to the standalone Bridging Generations page, navigation, or unrelated homepage alerts.
- No changes to the Pragyatha or Cohort 2 destination pages/forms.

## Verification
- Confirm only one modal is visible at a time and each of the three cards can be reached and dismissed.
- Confirm each image loads and every CTA uses the intended destination.
- Preview desktop and mobile layouts; check keyboard operation and close behavior.

## Implementation completed (2026-10-23)
- Replaced the inactive legacy Bridging Generations popup with a single announcement overlay containing three cards shown simultaneously: Bridging Generations Episode 6, Pragyatha '26, and TBI-MCE Cohort 2.
- Added current Bridging Episode 6 details and links for the live session, teaser, and question form. Reused the current `popup_assets/sanjaygjendra.png` poster.
- Added the Pragyatha poster, October 30–November 1 dates, ₹75,000 prize pool, and the agreed ME-RIISE destination link.
- Added the Cohort 2 poster, October 31 application deadline, and Google Forms application link.
- Added a three-column desktop layout and vertically stacked mobile layout, plus Escape and close-button dismissal, backdrop dismissal, and scroll restoration on close. Removed carousel controls and navigation behavior.
- Hid the expired Arogya Manthan popup while preserving its existing markup and styles.
- Browser validation confirmed all three cards and posters are visible together in three equal desktop columns, stack at 390px without horizontal overflow, and close behavior restores page scrolling.
- The homepage still logs an existing unrelated countdown error at `index.html:3697` (`Cannot set properties of null (setting 'innerHTML')`); it was not changed as part of this popup task.
