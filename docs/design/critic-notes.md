# Independent visual critique

**Inputs provided to the critic:**

- `docs/design/brief.md`
- `docs/design/screenshots/desktop.png`
- `docs/design/screenshots/mobile.png`

The critique was limited to the approved brief and the two rendered screenshots. The page is intentionally treated as a Polish samizdat listening page for episodes and conversations, not as a generic podcast landing page.

## Three biggest structural problems

1. **The mobile grid had a hidden minimum-width failure.** The 360px render allowed the editorial grid's intrinsic content to widen the document. That undermined the brief's strict grid and made the page vulnerable to clipped headings and sideways page movement.
2. **Long display headings were not allowed to yield at narrow widths.** The oversized section typography is right for the brief, but words such as the infrastructure and manifest headings could exceed their content column. The result looked like accidental overflow rather than deliberate irregularity.
3. **The broadcast strip was visually intentional but not an accessible surface.** Its long transmission line is appropriate to the radio/zine metaphor, yet the horizontally scrollable region was not keyboard-focusable. The visual device should remain, but it must not become a mouse-only escape hatch on mobile.

## Applied fixes

- Changed the responsive manifest and infrastructure tracks to `minmax(0, 1fr)` and added `min-width: 0` to their grid children.
- Added `overflow-wrap: anywhere` to the large section headings and constrained archive-heading flex children so the display treatment remains inside the mobile column.
- Added a keyboard tab stop to the broadcast strip and removed the invalid ARIA label from the non-semantic filter wrapper.

## Verification after refinement

- 18 episode cards render at desktop and mobile widths.
- 360px render reports `document.documentElement.scrollWidth === 360` and `document.body.scrollWidth === 360`.
- Axe Core reports 0 violations, 1 incomplete manual-review category (color contrast), and 26 passes.
- Keyboard focus is visible with a 4px signal-orange outline.
- Existing filter, accent-insensitive search, latest-episode, dialog-close, and consent-gated embed flows remain functional.

## Current visual/content pass

- Replaced the UI's archive wording with concise episode, conversation, and trace labels.
- Tuned the accent to the logo's orange (`#f7941e`), darkened the paper, and added a restrained halftone field for a rougher PRL print feel.
- Reduced hero, manifest, infrastructure, and card heights so the page carries less explanatory copy and reaches the episodes sooner.
- Added the three recovered source graphics to the trace section and moved the full “Po Co To Jest?” text into `content/po-co-to-jest.md` plus the local `po-co-to-jest.html` page.
- Removed the visible “Czytaj oryginał w Wayback Machine” prompt; the external capture ledger remains only as provenance data.
