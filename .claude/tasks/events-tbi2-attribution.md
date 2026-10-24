# Add TBI 2.0 Support Attribution to Selected Events

## Goal
Show the line `Supported by Department of E, IT, Bt , S&T,  GoK under TBI 2.0 programme` on the five specified events in the public events archive, without changing other event descriptions.

## Implementation Plan
1. Add the attribution field to the four matching records already in `eventsall.html`: Arogya Manthan 2K26, 5-Day Innovation Bootcamp, Idea Spark 4.0 - MSME Idea Hackathon 6.0, and TBI-MCE Startup Selection Process - Cohort 1. Add the missing Infusion 5.0 | Internal Smart India Hackathon 2026 record with the supplied date and the existing SIH banner asset.
2. Render the attribution as a distinct line under each event's existing description in both the event cards and the event detail modal. Keep the existing descriptions and dates intact.
3. Reconcile dynamic admin events with matching built-in entries by title so production data refreshes the record without creating duplicate cards, and apply the attribution to targeted events supplied dynamically.
4. Validate that exactly those five records display the exact requested wording in both views, that a dynamic Infusion record updates rather than duplicates the built-in record, and check the modified page for JavaScript/HTML issues. This static site has no configured build or test command.

## Rationale
`eventsall.html` is the public archive linked throughout the site. Its built-in event data contains the named entries, and its card and modal views both render the event description. The repository copy of `events_dynamic.json` is empty, but production has admin-managed records there. Matching dynamic records must refresh built-in entries rather than create duplicates, while preserving the same attribution in both views.

## Changes Made
- Added the optional support attribution to all five named 2026 events and rendered it as a separate line in event cards and the detail modal.
- Added the missing Infusion 5.0 archive record using the date supplied in the request and `images/Banner.jpg`, already used by the Internal SIH 2026 page.
- Dynamic event records now refresh matching built-in entries instead of duplicating them, and targeted dynamic entries receive the same attribution.
- Added the seven production-only 2026 events to the built-in archive so the local preview matches production's 35-event count even when the local dynamic JSON is empty.