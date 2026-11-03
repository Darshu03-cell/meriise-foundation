# Add a white/dark theme toggle

## Goal
Add a visible, accessible theme toggle to the Bridging Generations page so visitors can switch between the existing white/light and dark/black themes.

## Implementation
- Add an independent theme button in the header actions; keep it separate from the mobile-menu toggle.
- Let the current operating-system color preference determine the initial theme when the visitor has not chosen one.
- Persist manual selections in `localStorage` using the existing `meriise-theme` key, and apply saved choice before the stylesheet loads to avoid a flash.
- Ensure saved light/dark choices override all `prefers-color-scheme` styles, including fixed CTA/button colors and native color scheme.
- Preserve visible keyboard focus and the existing responsive navigation behavior.

## Files
- `bridging-generations/index.html`: theme button and early saved-theme initialization.
- `bridging-generations/style.css`: explicit light/dark overrides and toggle styling.
- `bridging-generations/script.js`: toggle state, accessible pressed state, and persistence.

## Verification
- Check initial system preference when no theme is saved.
- Check saved theme persists across reload and takes precedence over an opposite system preference.
- Test keyboard activation, accessible pressed state, and mobile menu independence.
- Confirm the toggle remains visible on mobile and both themes retain readable contrast.
- Run `git diff --check`.

## Completed
- Added a header theme button, early saved-theme initialization, and script handling for toggling, `aria-pressed`, and persistence under `meriise-theme`.
- Adjusted CSS precedence so explicit themes override system preferences and their fixed CTA colors.
- Verified saved dark under light OS (dark body/header) and saved light under dark OS (white body/header); mobile toggle/menu are both visible. Keyboard activation, `aria-pressed`, persistence, `node --check`, and `git diff --check` passed.
- External visual evaluation passed on the second attempt after correcting the explicit theme cascade.
