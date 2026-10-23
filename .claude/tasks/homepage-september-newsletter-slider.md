# Homepage Newsletter Slider: September 2026

## Goal
Make the main homepage rolling slider show the September 2026 newsletter instead of the stale newsletter issue.

## Findings
- The first slide in `index.html` is a newsletter card currently labeled June 2026 and linked to `assets/newsletter/2026/june.pdf`.
- `assets/newsletter/2026/september.pdf` exists, so the likely issue is stale slide markup rather than a missing PDF.

## Implementation
1. Update only the first newsletter card in the homepage hero slider: title to `September 2026`, link to the September PDF, and use the existing newsletter-page September card styling (teal gradient).
2. Leave other homepage slides and the separate newsletter archive untouched.

## Verification
- Confirm the homepage card title and PDF href both reference September.
- Confirm the referenced PDF exists. This repository has no build/test command; browser-check the homepage if a local static server is available.

## Completion Notes
- Updated the first homepage hero slide to show `September 2026`, link to `assets/newsletter/2026/september.pdf`, and use the September newsletter card's teal gradient.
- Verified the title, href, and PDF file existence with a focused PowerShell check; all passed.
