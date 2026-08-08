# Natura11y Lo-fi Parity Audit

_Audited: 2026-08-08 · Scope: canonical Core, Hi-fi source, and published Lo-fi library_

## Outcome

The Lo-fi kit is a viable part of the Natura11y ecosystem, but it is not yet in parity with the current Hi-fi library. Its original component API is stronger than a visual scan suggests: 37 of the 49 current non-icon Hi-fi component names are present in the published Lo-fi library, and the older Forms, Tabs, Track, Table, Cards, Link, Accordion, and Nav Item contracts remain closely aligned.

The repair is a synchronization project, not a rebuild. The concentrated gaps are:

- all inspected Lo-fi components have empty descriptions;
- several components added or modernized after the Lo-fi library's October–November 2025 publication are absent or stale;
- responsive contracts for Backdrop, Main Menu, and Global Footer do not match the current Hi-fi library;
- Lo-fi Buttons expose only `Default`, while Hi-fi exposes `Default`, `Hover`, and `Focus`;
- the Lo-fi color palette is intentionally smaller and neutral. That is an approved exception, not a parity defect.

**Current Lo-fi parity readiness: 6/10 (yellow).** This is a maintenance-state score, not a score for Natura11y as a whole. The kit has a sound base and a bounded repair list, but its missing metadata and post-2025 component drift currently prevent it from being a dependable interchangeable authoring surface.

## Evidence and limits

### Directly inspected

- Canonical production source: `/Users/carlavidano/Sites/natura11y`, especially `packages/core`, `packages/react`, Docs, and Storybook.
- Hi-fi source file: `ay1pEztl6oK8jlXmEtMAO7`.
- Hi-fi team library: `lk-d0303ebb699ad1a3d3d3171e4c05d4158f3ce2451ab4a2dd6bc92971857df9fa6059a195337c58c5eca49d98d84628011c92dc90736475111228bddc193ca770`.
- Published Lo-fi library: `lk-eec40ba928926b603ce6e69631f1f5a1ffd577404a802ed5d4a7e91960ddf57572523e8b930a61038f23338089ee9ae16dfac560ea12d68802c51c01ea25993a`.
- Lo-fi Community listing: `https://www.figma.com/community/file/1568593876481751799`.
- Imported published Lo-fi component definitions, including variant axes, component properties, descriptions, and published keys.
- Hi-fi source inventory: 32 pages, 7 collections, 139 variables, 31 text styles, 4 paint styles, 4 effect styles, 18 component pages, and 49 current non-icon component/component-set APIs.

### Not yet directly inspected

- The editable Lo-fi source file. The Community listing ID is a published snapshot identifier, not an editable Figma design file key.
- Complete Lo-fi page organization, source-only components, local variable aliases/modes, local styles, and component bindings.
- Visual screenshots of every Lo-fi component and variant.
- Code syntax on every Lo-fi variable. The MCP call allowance was reached after component-contract inspection and a partial token audit.

No Lo-fi canvas mutation was attempted. The audit calls that completed were read-only or imported published definitions without placing instances.

## Parity definition

Parity does **not** mean that Lo-fi should look like Hi-fi. It means both kits express the same production-facing contract wherever that contract matters:

- component family and purpose;
- variant/property names and supported options;
- editable text, booleans, slots, and instance swaps;
- responsive structure and Auto Layout behavior;
- semantic variable bindings and exact web syntax where applicable;
- component descriptions, code semantics, and accessibility guidance;
- deliberate exceptions documented as exceptions rather than appearing as accidental drift.

The following differences are intentional:

- Lo-fi keeps a limited neutral color palette instead of reproducing the five Hi-fi themes.
- Lo-fi includes wireframing helpers such as `a11y heading`, `StickyNote`, `Box`, image/video placeholders, and dividers. These are useful authoring assets and do not require a production-code counterpart.
- Global Footer is an example composition rather than an official Core component, but its Hi-fi and Lo-fi APIs should still remain compatible because it is a shared page-building primitive.

## Component matrix

| Contract group | Published Lo-fi state | Parity status | Required action |
| --- | --- | --- | --- |
| Accordion | `Accordion.item`; Closed/Open; Heading property | Match | Add the current accessibility/component description. |
| Alert | Confirm/Warn; Default only | Drift | Add Inverse variants and description; verify semantic alert variables. |
| Badge | Not found | Missing | Create the SM/MD/RG/LG set with Text and `hasIcon`; bind the Lo-fi semantic palette. |
| Backdrop media | Standalone `backdrop__media` | Drift | Migrate to the five Gradient Mask options used by Hi-fi. |
| Backdrop | Uses `Content Max Width=Narrow/Medium/Wide/Full` | Drift | Replace the obsolete width axis with `Layout=Overlay/Stack` and a flexible content slot; container controls width. |
| Breadcrumb | Legacy standalone `Nav Breadcrumb` | Drift | Add `Breadcrumb Item` Parent/Page and a slot-based `Breadcrumb`; preserve semantic current-page guidance. |
| Button | Sizes match; State only `Default` | Drift | Add Hover and Focus for SM/MD/RG/LG. Do not add Active/Disabled to Lo-fi alone; resolve that state decision across both kits together. |
| Button Icon Only | Sizes match; State only `Default` | Drift | Add Hover and Focus for all sizes. |
| Button Icon Over Text | RG/LG match; State only `Default` | Drift | Add Hover and Focus. |
| Button Outline | Not found | Missing | Create from the Button contract with the outline visual treatment and shared properties. |
| Link and Skip Links | API match | Match | Add current descriptions and accessibility guidance. |
| Card and Card--Horizontal | Boolean APIs match | Match | Add current descriptions; verify Auto Layout and bindings in source. |
| Global Footer | Standalone component | Drift | Convert in place, if possible, to `Viewport=Large/Small`; retain the component-set boundary convention used by the kit. |
| Modal | Standalone `modal` match | Match | Add current focus, Escape, labeling, and return-focus description. |
| Main Menu | Legacy `Primary Nav` with Inline/Below and `primary-nav__search` | Drift | Migrate to `Main Menu` with `Variant=Bar/Stack`, `Viewport=Large/Small`, navigation slot, search visibility, and expanded-state properties. Keep desktop menu adjacent to search. |
| Navigation | `Nav Item` matches; reusable `Nav` wrapper absent | Partial | Add the slot-based `Nav` wrapper and description. |
| Flyout | Not found | Missing | Add the current Flyout composition and accessibility description. |
| Nested Nav | L1/L2/L3 and wrapper not found | Missing | Add the three state sets and slot-based wrapper; use the existing production nesting semantics. |
| Form family | Label, Input, Textarea, Select, Help, Feedback, options, ToggleSwitch, Required Indicator, File Upload, and Form__Entry match closely | Match | Add descriptions; normalize only confirmed token/property naming drift. |
| Tabs | Button sets and `tabs-nav` match | Match | Add descriptions; retain Active semantics. |
| Track | Track, track__page, and track__panel match | Match | Add descriptions; verify active border token and bindings. |
| Table | Cell and column APIs match | Match | Add descriptions; verify cell-padding token rather than assuming a missing search result means hardcoding. |

### Cross-cutting description gap

Every imported published Lo-fi component definition returned an empty description. This is the broadest confirmed gap. The Hi-fi descriptions should be adapted into Lo-fi without copying irrelevant visual language. The semantic HTML, ARIA, keyboard, responsive, and composition guidance is shared and can usually be reused verbatim.

### Button state boundary

Core styles `:hover`, `:focus`, and `:active`, and it also styles `[aria-disabled="true"]`. Hi-fi currently represents Default, Hover, and Focus. Lo-fi represents only Default. The immediate parity repair is to give Lo-fi Hover and Focus. Active and Disabled should be handled as one explicit ecosystem decision so Core, Hi-fi, Lo-fi, Docs, and Storybook do not acquire different state vocabularies.

## Token findings

The Lo-fi palette is intentionally limited. The published library exposes neutral Canvas, Light, and Dark primitives plus Canvas/Dark correlated roles rather than Hi-fi's full Primary/Secondary/Light/Dark/Canvas theme matrix. This is approved.

Confirmed healthy or intentional evidence:

- all six spacing variables were discoverable;
- all six border foundation variables were discoverable;
- Canvas, Light, and Dark principal colors were discoverable;
- Canvas and Dark semantic/correlated roles were discoverable;
- the palette also includes Lo-fi-specific Image foreground/background roles;
- Typography includes a Lo-fi-specific Handwritten family;
- existing Button, Card, Form, and other older component tokens are present in substantial part.

Confirmed or strongly supported drift:

- newer component-token families align with missing components: Badge, Button Outline, Main Menu, Flyout, and Nested Nav;
- the older Lo-fi Form radius uses `Form/form-field-border-radius`, while Hi-fi uses `Form/form-entry-border-radius`;
- the older navigation token vocabulary includes `Nav Item/nav-item-font-family`, while current Hi-fi uses the broader `Nav/...` and `Main Menu/...` contract;
- published component definitions expose no descriptions, even when component structure otherwise matches.

The remaining variable values, alias chains, modes, scopes, bindings, and Web syntax require the editable Lo-fi source. Do not add the full Hi-fi palette or unused component tokens merely to make counts match. Add or rename tokens only when a Lo-fi component uses the production role.

## Repair strategy

1. Resolve the editable Lo-fi source URL and record its file key alongside the two canonical library keys.
2. Re-inventory the source once: pages, collections, modes, variables, styles, components, bindings, and publication state.
3. Update descriptions in place for all existing published components. Preserve component keys.
4. Repair stale component sets in place where Figma permits it: Alert, three Button families, Backdrop, Global Footer, and legacy Primary Nav/Main Menu.
5. Add missing current contracts: Badge, Breadcrumb pair, Button Outline, Nav wrapper, Flyout, and Nested Nav.
6. Add only the semantic/component variables those repairs require; preserve Lo-fi's smaller palette.
7. Apply the established bordered component-set boundary convention to every new or converted variant set.
8. Validate exact properties, variant Cartesian products, component descriptions, Auto Layout, variable bindings, source/published keys, and screenshots at large and small viewports.
9. Publish one reviewed Lo-fi update and rerun this matrix. A clean rerun should show only documented intentional exceptions.

## Expected difficulty

**Moderate, not difficult in concept.** The component API evidence is already available and most of the kit does not need rebuilding. The work is call- and QA-heavy because published identities must be preserved and responsive components need visual verification. A realistic implementation is two or three focused Figma passes rather than one enormous script:

- pass 1: descriptions and low-risk variants;
- pass 2: responsive/structural migrations and missing components;
- pass 3: token/binding audit, screenshots, and publication.

The critical risk is not visual complexity; it is accidentally replacing published components and breaking downstream instances. All repairs should therefore be idempotent and keyed to existing source node IDs.
