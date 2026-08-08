# Figma Variable Web-Syntax Classification

_Completed: 2026-08-08 · Source: Natura11y Hi-fi UI Kit · Code authority: `@natura11y/core` Sass_

## Result

**PASS — all 139 local Figma variables are accounted for.**

- 99 variables expose exact `var(--...)` Web syntax backed by a current Core CSS custom property.
- 24 variables are explicitly classified as Figma-only authoring or size-preset variables.
- 16 variables are explicitly classified as derived helpers whose Core implementation is a calculation, contextual alias, or literal value rather than a standalone custom property.
- Zero variables remain unresolved.
- Zero Web-syntax values are malformed.
- Zero variables use `ALL_SCOPES`.
- All 71 alias references resolve, including aliases to imported library variables.

This closes the original 46-variable inspection finding. One verified mapping, `Button/button-font-family`, was added during the Station 2 cleanup. This pass evaluated the remaining 45 variables, added five exact mappings, and encoded the 40 intentional exceptions directly in their Figma descriptions.

## Exact Web mappings added

| Figma variable | Core syntax |
| --- | --- |
| `border-radius-0` | `var(--border-radius-0)` |
| `border-radius-1` | `var(--border-radius-1)` |
| `border-radius-2` | `var(--border-radius-2)` |
| `border-radius-3` | `var(--border-radius-3)` |
| `border-radius-pill` | `var(--border-radius-pill)` |

## Intentional Figma-only variables — 24

These variables support authoring, canvas construction, or explicit Figma size variants. Adding fabricated CSS names would imply production APIs that Core does not provide.

| Purpose | Variables | Core relationship |
| --- | --- | --- |
| Typography primitives | `Font Family/Serif`, `Font Family/Sans Serif` | Semantic Heading, Body, and component font variables carry the real Core mappings. |
| Canvas and annotation helpers | `Document/site-max-width`, `Annotation/font-family` | Design-canvas and documentation concerns, not runtime tokens. |
| Button height presets | `Button/sm-min-h`, `Button/md-min-h`, `Button/rg-min-h`, `Button/lg-min-h` | Core derives height from `--button-target-size` in `em` and the applied typography size. |
| Button horizontal-padding presets | `Button/sm-padding-x`, `Button/md-padding-x`, `Button/rg-padding-x`, `Button/lg-padding-x` | Core exposes one fluid `--button-padding-x` property rather than size-specific tokens. |
| Button radius presets | `Button/sm-border-radius`, `Button/md-border-radius`, `Button/rg-border-radius`, `Button/lg-border-radius` | Core exposes one `--button-border-radius` property rather than size-specific tokens. |
| Form input height presets | `Form/Input/sm-min-height`, `Form/Input/md-min-height`, `Form/Input/rg-min-height`, `Form/Input/lg-min-height` | Core uses `--form-entry-target-size` plus typography utilities. |
| Form input horizontal-padding presets | `Form/Input/sm-padding-x`, `Form/Input/md-padding-x`, `Form/Input/rg-padding-x`, `Form/Input/lg-padding-x` | Core exposes one fluid `--form-entry-padding-x` property. |

## Intentional derived variables — 16

These variables reproduce a verified Core recipe in Figma. Their descriptions now identify the exact relationship instead of pretending the helper is an independent production token.

| Purpose | Variables | Core recipe |
| --- | --- | --- |
| Alert subtle fills | `Alert/subtle-fill-confirm`, `Alert/subtle-fill-warn` | `currentColor` with `--subtle-fill-2`. |
| Alert inverse fills | `Alert/inverse-confirm`, `Alert/inverse-warn` | `background-color: var(--confirm-color)` or `var(--warn-color)`. |
| Card section padding | `Card/card-head-padding-y`, `Card/card-foot-padding-y` | `calc(var(--card-padding-y) * 0.5)` and `* 0.75`. |
| Modal section padding | `Modal/modal-head-padding-y`, `Modal/modal-foot-padding-y` | Core applies `--modal-padding-y` directly to both sections. |
| Nested Nav minimum heights | `Nested Nav/L1-min-height`, `Nested Nav/L2-min-height`, `Nested Nav/L3-min-height` | Calculated from content, font size, and padding; no level-specific height token. |
| Nested Nav indentation | `Nested Nav/L2-padding-x`, `Nested Nav/L3-padding-x` | `calc(var(--nav-nested-padding-x) * 2)` and `* 3`. |
| Invalid Form border | `Form/form-entry-invalid-border-width` | `calc(var(--border-width) * 2)` overrides `--form-entry-border-width`. |
| Flyout backdrop | `Flyout/overlay-color` | Core literal `hsla(0, 0%, 0%, 0.5)`. |
| Track active border | `Track/active-border-width` | `calc(var(--border-width) * 2)`. |

## Ongoing rule

- Use Web syntax only when a current Core custom property is an exact counterpart.
- Prefix intentional exceptions with `Classification: Figma-only —` or `Classification: Derived —` in the Figma variable description.
- Do not create CSS custom properties solely to make the Figma Web-syntax count reach 100%.
- Treat any future variable without either exact Web syntax or one of those descriptions as an unresolved parity finding.
