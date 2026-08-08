# Work Order — Natura11y Lo-fi Parity

_Source audit: `../reports/2026-08-08-lofi-parity.md` · Written: 2026-08-08_

## Objective

Bring the Natura11y Lo-fi UI Kit into contract parity with canonical Core and the current Hi-fi UI Kit while preserving its intentionally limited neutral palette and wireframe visual language.

No new package, DTCG source, service, or dependency is required.

## Current status

- **Audit:** Complete for Core, Hi-fi source, and published Lo-fi component definitions.
- **Source mutation:** Pending.
- **Blockers:** Figma MCP call allowance reached; editable Lo-fi design file key not yet recorded.
- **Canvas impact so far:** None. No Lo-fi nodes or variables were changed.

## P1 — Establish the editable source and state ledger

- Obtain the direct `/design/{fileKey}/...` URL for the maintained Lo-fi source. The Community listing is not sufficient for edits.
- Verify edit access and confirm that its published library key is `lk-eec40ba928926b603ce6e69631f1f5a1ffd577404a802ed5d4a7e91960ddf57572523e8b930a61038f23338089ee9ae16dfac560ea12d68802c51c01ea25993a`.
- Inventory pages, collections, modes, variables, styles, components, descriptions, bindings, and publish state.
- Record exact source node IDs before any mutation.

**Done when:** the source key and all target node IDs are in the state ledger and the source inventory reconciles with the published component keys.

## P2 — Metadata parity, in place

- Add adapted Hi-fi descriptions to every existing Lo-fi public component.
- Include semantic HTML, ARIA, keyboard, responsive, composition, and intentional Lo-fi distinctions.
- Preserve existing published keys.
- Rename low-level `radio` variant axis from `Property 1` to `State` in both kits only as a coordinated change.

**Done when:** every public Lo-fi component has a useful description and no existing published component identity changed.

## P3 — Repair stale contracts

1. Alert: add Inverse Confirm/Warn.
2. Button, Button Icon Only, Button Icon Over Text: add Hover and Focus for every supported size.
3. Backdrop media: add the five gradient-mask states.
4. Backdrop: migrate from Content Max Width variants to Overlay/Stack plus content slot.
5. Global Footer: add Large/Small viewport variants.
6. Primary Nav/Main Menu: migrate to Bar/Stack and Large/Small with slot, search, and expanded-state properties.

**Done when:** each contract matches the Hi-fi property matrix, uses Lo-fi visuals, and retains existing keys where an in-place migration is feasible.

## P4 — Add missing current contracts

- Badge
- Breadcrumb Item and Breadcrumb
- Button Outline
- Nav wrapper
- Flyout
- Nested Nav L1/L2/L3 and wrapper

Use the established component-set boundary outline around every new variant collection.

**Done when:** all seven missing contract groups are discoverable in the library and have the current properties, descriptions, Auto Layout, and semantic bindings.

## P5 — Token and binding parity

- Keep the limited Lo-fi Canvas/Light/Dark palette; do not clone Hi-fi's Primary/Secondary theme matrix.
- Add only component tokens required by P3/P4.
- Reconcile legacy names such as `Form/form-field-border-radius` against the current production role.
- Add exact `var(--...)` Web syntax to web-facing variables.
- Classify Lo-fi-only variables such as Handwritten typography, image placeholders, StickyNote, Box, and dividers as intentional authoring tokens/assets.
- Audit fills, strokes, spacing, sizing, and radii for unexplained hardcoding.

**Done when:** every repaired component is semantically bound, every web-facing variable has exact syntax, and all reduced-palette differences are documented.

## P6 — Validate and publish

- Validate component/property/variant matrices programmatically.
- Validate component descriptions and source/published keys.
- Validate Auto Layout and variable bindings.
- Screenshot all changed sets and responsive variants.
- Confirm component-set boundary outlines.
- Publish one reviewed Lo-fi update.
- Rerun the parity report and update the 6/10 readiness score.

**Done when:** the audit reruns with no unexplained differences and downstream consumers receive the update without component replacement.

## Explicitly deferred

- Active and Disabled Button variants until one coordinated Core/Hi-fi/Lo-fi decision is made.
- A full DTCG token source or standalone tokens package.
- Code Connect unless existing seat capability and normal workflow justify it.
- Making Lo-fi visually resemble Hi-fi.
