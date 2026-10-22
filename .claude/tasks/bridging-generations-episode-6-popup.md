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

## Status
Awaiting user review and approval before implementation.