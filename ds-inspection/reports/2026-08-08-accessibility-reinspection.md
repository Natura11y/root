# Station 3 Reinspection — Accessibility

_Inspected: 2026-08-08 · Technician: Codex (GPT-5) · Comparison baseline: `2026-08-08-inspection.md`_

## Result

**GREEN — 8/10, up from 6/10.** Natura11y now has strong, mutually reinforcing accessibility contracts across Core, React, documentation, theme tokens, and representative Hi-fi Figma components. The previously failing status-color pairs are corrected and guarded by a build-time contrast matrix. This pass also corrected three implementation gaps that contradicted the documented contract: Lightbox dialog behavior, Lightbox control/image naming, and programmatic React form-error state.

The score stops at 8 because repeatable behavioral assertions and a documented manual assistive-technology matrix do not yet exist. That follow-up is tracked in [GitHub issue #4](https://github.com/Natura11y/root/issues/4).

## Fresh evidence

### Design and guidance

- [verified] Nine representative Hi-fi component pages were inspected directly: Accordion, Alert, Button, Modal, Main Menu, Flyout, Form, Tab, and Track.
- [verified] Their reusable roots describe implementation semantics rather than visual appearance alone. The descriptions cover native elements, accessible names, ARIA relationships and state, focus movement and restoration, `inert`, keyboard interaction, reduced motion, color-independent status meaning, labels, fieldsets, legends, and validation associations.
- [verified] The Alert contract requires an icon in addition to color. Form components explicitly distinguish decorative indicators from native controls. Main Menu, Modal, Flyout, Tabs, Accordion, and Track encode their corresponding keyboard and focus responsibilities.
- [verified] Accessibility guidance is cross-linked globally and from component pages. The global page now describes Natura11y as a WCAG-aligned foundation without promising automatic conformance for every downstream composition.

### Color and motion

- [verified] `npm run test:contrast` checks 20 text, link, confirm, and warn pairs across Primary, Secondary, Dark, Light, and Canvas themes at a 4.5:1 minimum. Every pair passes; the lowest passing pair is Light Confirm at 4.60:1.
- [verified] The contrast matrix runs before every Core build.
- [verified] Representative animated components include `prefers-reduced-motion` handling in Core, and React Track and Collapse consult the user preference for programmatic motion.

### Implementation remediation

- [verified] Core Lightbox now exposes `role="dialog"`, `aria-modal="true"`, and an accessible name. It carries the trigger image's alternative text—or `data-lightbox-alt`—into the enlarged image.
- [verified] React Lightbox now uses the shared focus-trap hook, closes with Escape, restores trigger focus, exposes modal-dialog semantics, labels Previous/Next/Close icon-only controls, and accepts an optional `lbAlt` value instead of inserting generic alternative text.
- [verified] React Form Entry now connects invalid controls to visible feedback with `aria-describedby`, sets `aria-invalid="true"` only in the error state, and preserves native `required` semantics for single checkboxes, switches, and file inputs.
- [verified] The Form and Lightbox documentation now states the matching author contract. The global focus-management copy no longer incorrectly says an accordion returns focus on close.

### Runtime verification

- [verified] React and Storybook typechecks pass.
- [verified] Core, documentation, and Storybook production builds pass.
- [verified] A headless Chromium check against the built Storybook confirmed that the React Lightbox renders as an accessible modal dialog, exposes a labelled close button, preserves `alt="Mountain landscape"`, keeps Tab focus inside the dialog, closes with Escape, and returns focus to its thumbnail trigger.
- [verified] The React Form error-state story exposes `aria-invalid="true"` and an `aria-describedby` value that resolves to its visible feedback element.

## Standards basis

- The [WAI-ARIA Authoring Practices modal-dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) requires contained keyboard focus, Escape support, dialog semantics, and an accessible name.
- [WCAG Technique ARIA21](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA21.html) documents `aria-invalid` for failed fields and its use with programmatically associated error descriptions.
- The [WAI Images Tutorial](https://www.w3.org/WAI/tutorials/images/) requires text alternatives to reflect an image's purpose and context rather than supplying generic filler text.

## Remaining gap

The repository still has no committed unit, behavior, integration, or accessibility test files. Storybook's a11y addon is installed but configured as `test: 'todo'`, and the current GitHub workflow does not run accessibility or keyboard assertions. Manual VoiceOver/NVDA, forced-colors, zoom/reflow, and touch-device coverage is also not recorded. This is evidence debt, not evidence that the existing components are broadly inaccessible.

## Score decision

The station moves from **6/10 to 8/10**. The original score was held down by known contrast failures and missing proof. The contrast failures are fixed and guarded, the design guidance is unusually strong, and this pass repaired the concrete code/documentation contradictions it found. A 9 or 10 would require the repeatable behavioral and manual evidence tracked in issue #4.

## Follow-up

- Implement [issue #4](https://github.com/Natura11y/root/issues/4) as the next testing/accessibility proof initiative when that work is prioritized.
- Treat the absent Hi-fi Lightbox component as a Station 1 design/code parity candidate, not as proof that the coded Lightbox is inaccessible.
- Re-run this station after behavioral checks and the first manual assistive-technology matrix are complete.
