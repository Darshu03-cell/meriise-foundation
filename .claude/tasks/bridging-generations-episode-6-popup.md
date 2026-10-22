# Plan: Bridging Generations Episode 6 Popup

## Goal
Publish the Episode 6 announcement on the homepage using the supplied
`popup_assets/sanjaygjendra.png` poster and the provided session information.

## Current state and rationale
- The legacy `#bg2-popup` in `index.html` is hidden and still contains Episode 5 details.
- A separate homepage announcement deck (`#tbi-c2-popup`) is currently active. Re-enabling
  the legacy popup would stack two overlays and could obscure one of them.
- The requested poster already exists at `popup_assets/sanjaygjendra.png`.
- Therefore, add Episode 6 to the active announcement deck and leave the other announcement
  cards and the standalone Bridging Generations page unchanged.

## Implementation tasks
1. In `index.html`, add a Bridging Generations Episode 6 card to the active announcement
   deck, using the existing card structure and styles. Include the poster, title, speaker
   name and credentials, event summary, date/time, and the supplied CEO and Principal
   signatories.
2. Add clear links for the YouTube teaser, advance question form, and `https://www.meriise.org`
   to join the session. Open external links safely in a new tab.
3. Keep the poster and detail content usable on mobile and shorter viewports by reusing the
   deck's scrollable card behavior; add only narrowly scoped styles if the content needs them.
4. Update the announcement-deck comment to include Bridging Generations. Do not alter the
   existing Pragyatha or TBI announcement cards, the hidden legacy popup, or the mini-site.

## Verification
- Check `index.html` for valid markup and confirm all requested copy, date/time, asset path,
  and three destination URLs are present.
- Preview the homepage at desktop and mobile sizes: the announcement card should appear in
  the existing deck, remain scrollable if needed, and all links and close behavior should work.

## Implementation completed (2026-10-22)
- Added a separate, visible Episode 6 overlay to `index.html`, above the active announcement
   deck. Existing announcement cards and the hidden Episode 5 popup remain unchanged.
- Reused the Bridging Generations popup visual classes and added Episode 6-specific sizing,
   detail text, and mobile spacing. The card is capped at 90vh and scrolls when its contents
   exceed the viewport.
- Added the supplied Sanjay Gajendra poster, biography, session date/time, teaser, question
   form, join link, and both signatories.
- Verified required asset, content, and unique popup ID with a focused PowerShell check.
- Browser preview confirmed the popup is visible at z-index 10002, the poster loads, all
   three external destinations are correct, and the card scrolls within the viewport.
- The browser also reports an existing unrelated homepage script error at `index.html:3693`
   (`Cannot set properties of null (setting 'innerHTML')`); it was not changed as part of this
   popup request.