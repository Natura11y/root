# Station 2 Reinspection — Best Practices

_Inspected: 2026-08-08 · Technician: Codex (GPT-5) · Comparison baseline: `2026-08-08-inspection.md`_

## Result

**GREEN — 9/10.** Natura11y consistently gives designers and developers sound defaults across Figma, Core, React, and documentation. This pass removed the remaining generic Figma naming residue, replaced broad variable scopes with intentional ones, strengthened documentation cross-links, and preserved the score at 9 because two verified behavioral engineering gaps still need implementation and tests.

## Fresh evidence

### Figma craft

- [verified] All 29 nonempty pages in the 32-page Hi-fi source file were scanned. The file contains 5,353 nodes, 2,287 reusable nodes, 159 publishable components, 39 component sets, and 1,269 attached instances.
- [verified] No broken main-component references were found among the 1,269 instances.
- [verified] Reusable roots are predominantly Auto Layout. The no-Auto-Layout remainder is concentrated in 104 icon components and appropriate geometry such as focus outlines, masks, indicators, overlays, and resize affordances rather than manually positioned UI containers.
- [verified] 1,204 of 1,300 visible solid-paint uses are variable-bound (92.6%). The remainder includes icon and effect geometry and should be classified before any bulk tokenization.
- [verified] The seven local variable collections contain 139 variables. After remediation, zero variables use `ALL_SCOPES`; colors use role-appropriate fill/text/stroke scopes and both string variables use `FONT_FAMILY`.
- [verified] Screenshots of Radio, the eight Textarea variants, both Tab styles, and all three Nested Nav levels show the component visuals and variant boundaries remained intact after the naming cleanup.

### Code craft

- [verified] Representative React components use semantic elements and focused behavior hooks: Button renders native `button` or `a`; Modal uses a labelled dialog, focus trap, scroll lock, Escape support, initial focus, and return focus; Main Menu uses `nav`, `form`, `aria-controls`, and controlled disclosure state; Track uses lists, labelled sections, inert hidden content, and a live region.
- [verified] Core Sass is variable-driven, responsive, layered, and predominantly uses logical properties. Physical values reviewed in focus geometry, caret drawing, centering, and visual masks were not counted as automatic defects.
- [verified] `npm run typecheck:react`, `npm run typecheck:storybook`, and `npm run build:core` pass. The Core prebuild contrast matrix passes all 20 theme pairs.
- [verified] Core event lifecycle cleanup is incomplete: delegated handlers cannot be unsubscribed, Table can accumulate listeners, and Track teardown cannot remove all delegated handlers. This is tracked in [GitHub issue #2](https://github.com/Natura11y/root/issues/2).
- [verified] Track, Table, and Flyout still contain physical horizontal calculations that need explicit RTL behavioral verification across Core and React. This is tracked in [GitHub issue #3](https://github.com/Natura11y/root/issues/3).
- [verified] Core emits maintenance warnings for stale Browserslist data and a 255 KiB CSS asset. These are watch items, not evidence that component APIs or layouts violate Station 2 best practices.

### Documentation craft

- [verified] All 46 documentation pages have a description and related-page metadata.
- [verified] All 21 component pages include live examples. Eighteen include an `AccessibilitySpotlight`, 18 include line-by-line anatomy, and 17 include related custom-property tables.
- [verified] The 21 component pages contain 113 structured sections plus explicit internal links, serving visual, semantic, implementation, and accessibility needs rather than one discipline alone.
- [verified] The RTL guide copy was corrected and Track, Table, Flyout, and Main Menu now link directly to relevant Accessibility/RTL guidance.
- [verified] `npm run build:docs` completes successfully and generates all 52 site pages.

## Remediation completed in this pass

- Renamed the Radio and two Tab variant properties from `Property 1` to `State`; Figma automatically updated all six variant names.
- Renamed eight Textarea master groups from `Group 1` to `Resize Grip` and their 24 decorative vectors to `Grip Line 1–3`.
- Renamed six Nested Nav master text layers from `Text` to `Label`.
- Replaced `ALL_SCOPES` on 34 variables with intentional role scopes and added verified Web syntax for `Button/button-font-family`.
- Added Accessibility/RTL cross-links to four behavior-heavy component pages and corrected the RTL guide prose.

## Score decision

The score remains **9/10** rather than moving to 10. The audited design and documentation assets are exceptionally consistent, and the local Figma residue identified in the first inspection is now fixed. A perfect score would require lifecycle-safe Core initialization/teardown and proven direction-aware behavior for the remaining horizontal components, backed by the behavioral tests already called for in Station 5.

## Follow-up

- Implement and close issues [#2](https://github.com/Natura11y/root/issues/2) and [#3](https://github.com/Natura11y/root/issues/3).
- Finish the Station 4 classification of Figma variables without Web syntax; do not invent code mappings for Figma-only variables.
- Publish the reviewed Hi-fi library changes when normal Figma publishing access is available.

