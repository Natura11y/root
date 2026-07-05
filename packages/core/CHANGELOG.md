# Changelog

All notable changes to this project will be documented in this file.

---

## Unreleased

### Pending Bug Fixes

#### Images
- Update `.backdrop__media` media sizing to include `picture` elements alongside `img` and `video`, preserving aspect ratios for optimized image output.
- Add default `.card__media > img` sizing so card media images span their container width while preserving their natural aspect ratio.
- Add default `.lightbox-thumbnail :is(img, picture)` sizing so thumbnail media spans the trigger width while preserving its natural aspect ratio.

#### Modal
- Add the missing `--modal-padding` default so the modal container padding and content max-height calculation resolve without requiring a spacing utility.

#### Form
- Stop adding unsupported `aria-required` attributes to native form controls at runtime; required fields continue to receive the native `required` attribute from `.form-entry[data-required]`.

#### Link
- Remove the legacy `.link-expanded` utility and stop extending it inside split dropdown links.

---

## [5.1.1] — 2026-06-29

### Package

- Added package exports for framework CSS, SCSS source entry points, and shared JavaScript utilities used by React integrations.
- Exposed utility imports for `focus`, `getCurrentBreakpoint`, and `keyboardNavigation`.

### Bug Fixes

#### Collapse
- Improved collapse transition cleanup and Safari behavior.

#### Dropdown
- Fixed dropdown behavior and updated the HTML examples to match current menu patterns.

#### Grid
- Updated grid divider and sidebar behavior, including top alignment for sidebar items.

#### Lightbox
- Fixed thumbnail image sizing so media fills the thumbnail frame correctly.

### Examples

- Cleaned up framework HTML examples served by the development build.

---

## [5.1.0] — 2026-03-14

### New Components

#### Search
- New `FormSearch` class (`form.js`) — powers enhanced search input behavior
- New CSS modifier: `.form-entry--search` on `.form-entry`
- `[data-search-clear]` attribute — marks a button that clears the input; shown automatically via `.has-value` class when input has content
- Native browser search cancel button suppressed cross-browser via CSS (`-webkit-search-cancel-button`, `-webkit-search-decoration`)
- ARIA live region (`aria-live="polite"`) injected automatically — announces "Search cleared" to screen readers when the clear button is used
- New CSS variable: `--main-menu-search-width` (default `300px`) — controls inline search width inside the main menu bar at desktop breakpoints

---

### Bug Fixes

#### Collapse
- Scoped breakpoint override from `.shown` to `.collapse.shown` — the unscoped rule was overriding `.shown` on unrelated components (e.g. `modal--scroll-all` lost its `overflow-y: scroll` behavior)

#### Flyout
- Added `user-select: none` to `.flyout :is(a, button)` — prevents browser text-selection artifacts on flyout links during rapid open/close interactions

#### Button
- Added `user-select: none` to `.button` — prevents accidental text selection on interactive controls

#### Main Menu
- Added `user-select: none` to mobile nav `> ul > li > :is(a, button)` — consistent with flyout and button fix

#### Form Entry
- Improved button sizing inside `.form-entry__field__input`: replaced hardcoded `margin` and `font-size` with `--_form-entry-button-inset` internal variable; `gap` added between input and button; icon-only buttons now correctly size to target size

---

## [5.0.1] — 2026-03-10

### Bug Fixes

#### Collapse
- Scoped breakpoint override from `.shown` to `.collapse.shown` — the unscoped rule was overriding `.shown` on unrelated components (e.g. `modal--scroll-all` lost its `overflow-y: scroll` behavior)

#### Flyout
- Added `user-select: none` to `.flyout :is(a, button)` — prevents browser text-selection artifacts on flyout links and controls during rapid open/close interactions

#### Button
- Added `user-select: none` to `.button` — prevents accidental text selection on interactive button controls

---

## [5.0.0] — 2026-03-09

### New Components

#### Badge
- New component: `_badge.scss`
- Class: `.badge`
- CSS variables: `--badge-font-size`, `--badge-padding-x`, `--badge-padding-y`, `--badge-border-radius`

#### Nested Nav
- New component: `_nested-nav.scss`
- Class: `.nested-nav`
- Supports up to three levels of indented navigation with bordered structure and active indicator bar
- CSS variables: `--nav-nested-padding-x`, `--nav-nested-padding-y`, `--nav-nested-parent-font-size`, `--nav-nested-child-font-size`, `--nav-nested-indicator-width`, `--nav-nested-indicator-color`

---

### Templates

- Added landing page template
- Added two-column layout template
- Added three-column layout template
- Added form page template

---

### Bug Fixes & Polish

- Fixed CSS variable name: `--nav-nested-decendent-font-size` → `--nav-nested-child-font-size`
- `package.json` `main` field updated to point to `dist/natura11y.js`

---

## [5.0.0-alpha.1] — 2026-03-05

### New Components

#### Flyout
- Full-height overlay panel that slides in from the side
- Supports simple nav or drill-down panel navigation for multi-level menus
- New files: `flyout.js`, `_flyout.scss`
- Trigger: `data-open="flyout"` on a button with `aria-controls` pointing to the flyout ID
- Internal controls: `data-flyout-close`, `data-flyout-back`, `data-flyout-next`
- `inert` is managed by JS — do not add it manually

#### Pagination
- New component: `_pagination.scss`
- Class: `.pagination`
- `[aria-current="page"]` receives a subtle fill background automatically
- CSS variables: `--pagination-font-size`, `--pagination-item-size`, `--pagination-border-radius`

#### Breadcrumb
- Separated from `_navigation.scss` into its own partial: `_breadcrumb.scss`
- **Class renamed:** `.nav-breadcrumb` → `.breadcrumb`
- CSS variable: `--breadcrumb-font-size`

---

### New Utilities

#### Drop Shadow
- New utility classes: `.drop-shadow-1`, `.drop-shadow-2`, `.drop-shadow-3` with responsive modifiers `--{bp}`
- Uses CSS `filter: drop-shadow()` — works with transparent and cutout shapes, unlike `box-shadow`
- Includes a Safari/Firefox `translateZ(0)` workaround

#### Container Breakpoint Modifiers
- `.container` now supports responsive modifiers: `.container--{bp}`
- Defers container padding and centering until a specific breakpoint

---

### Breaking Changes

#### `Navigation` class removed

The `Navigation` class (`navigation.js`), which handled `primary-nav` dropdown behavior, has been removed and replaced by two dedicated classes:

- `Dropdown` (`dropdown.js`) — handles dropdown and mega menu behavior
- `MainMenu` (`main-menu.js`) — handles the global site header navigation

`Flyout` (`flyout.js`) is a brand new class for the off-canvas panel component and is unrelated to this change.

#### `primary-nav` is now the `Main Menu` component

What was previously `primary-nav` is now a fully named component: **Main Menu**. All classes, CSS variables, and the dedicated JS class reflect this.

| v4 | v5 |
|---|---|
| `primary-nav--inline--{bp}` | `main-menu--bar--{bp}` |
| `primary-nav--below--{bp}` | `main-menu--stack--{bp}` |
| `primary-nav__logo` | `main-menu__logo` |
| `primary-nav__menu` | `main-menu__nav` |
| `primary-nav__toggle` | `main-menu__toggle` |
| `primary-nav__search` | `main-menu__search` |
| `primary-nav__actions` | `main-menu__actions` |
| `mobile-menu-toggle` *(extra class on toggle buttons)* | removed |
| `--primary-nav-padding-x` | `--main-menu-padding-x` |
| `--primary-nav-padding-y` | `--main-menu-padding-y` |

#### `nav__dropdown` renamed to `dropdown__menu`
Any element previously using `.nav__dropdown` must be updated to `.dropdown__menu`.

#### `.nav-breadcrumb` renamed to `.breadcrumb`

#### `.nav--has-icons` removed
Icon styles are now applied automatically when nav items contain icon elements — no modifier class required. Also: `.nav__text` → `.text` (generic text wrapper class).

#### Navigation SCSS restructured
`_navigation.scss` was significantly reduced. Styles have moved to dedicated component partials:
- `_main-menu.scss` — global site header (the renamed `primary-nav`)
- `_dropdown.scss` — dropdown menus, mega menus, `nav-dropdown`, `nav-link-dropdown`
- `_breadcrumb.scss` — breadcrumb (new dedicated partial)
- `_pagination.scss` — pagination (new dedicated partial)
- `_flyout.scss` — off-canvas panel (new component)

---

### Dropdown Updates

- `.nav-dropdown` — new component wrapper class for dropdown trigger buttons
- `.nav-link-dropdown` — updated; inner `.text` element now uses `.link-expanded` automatically
- `.dropdown__menu` — renamed from `.nav__dropdown`; now sets explicit `background-color: var(--background-color)`
- Indicator icon (caret) now uses an icon font character via CSS `::after` pseudo-element
- `[data-toggle="dropdown"][aria-expanded="true"]::after` rotates the indicator 180deg

---

### Accessibility Improvements

#### `inert` attribute adoption
Replaced `aria-hidden` + manual `tabindex` management with the native `inert` attribute across all interactive components:
- **Accordion** — panels use `inert` instead of `aria-hidden` + tabindex manipulation
- **Modal** — all modals initialized with `inert`; toggled on open/close
- **Collapse** — `inert` set at init only when the element is not already visible; `ResizeObserver` handles responsive transitions
- **Lightbox** — replaced `aria-hidden`/`aria-live` with `inert` + CSS `.shown` class

#### Focus utility (`focus.js`)
- `getFocusableElements` now filters out elements inside `[inert]` and `[hidden]` ancestors
- `focusTrap` queries focusable elements dynamically — respects `inert`/`hidden` state changes during flyout panel navigation
- Focus trap no longer overwrites `tabindex` on natively focusable elements
- Optional chaining on first/last element to prevent null errors

#### Track component
- `scroll-behavior: smooth` is now always on by default
- Previous approach was inverted (opt-in via `no-preference`) — corrected per WCAG motion guidance

---

### Component Enhancements

#### Accordion
- New CSS variable: `--accordion-animation-duration` (default `0.3s`)
- Separate asymmetric enter/exit durations (exit is 0.75x, enter is 1x)
- Uses logical properties: `padding-block` (was `padding-top`/`padding-bottom`)

#### Collapse
- Full rewrite
- `data-focus-first` attribute: focuses the first focusable element on open
- Keyboard activation (`event.detail === 0`) focuses the panel with `tabIndex = -1`
- Escape key closes the panel and returns focus to the trigger
- `data-target-close`: close a sibling collapse when opening this one
- CSS: `grid-template-rows: 0fr → 1fr` as fallback; `@supports (interpolate-size)` uses `height: 0 → auto`
- New CSS variable: `--collapse-animation-duration`
- `interpolate-size: allow-keywords` on `:root` enables `height: auto` animation

#### Modal
- New enter/exit animation variables:
  - `--modal-animation-duration` (default `0.35s`)
  - `--modal-animation-scale` (default `0.85`; set to `1` to disable scale)
  - `--modal-animation-translate-y` (default `2rem`)

#### Lightbox
- New slide direction animation on prev/next (`data-entering="next|prev"` on container)
- New open/close animation variables:
  - `--lightbox-animation-duration` (default `0.35s`)
  - `--lightbox-animation-translate-x` (default `2rem`)
- Overlay fades in/out separately from content
- DOM removal now waits for `transitionend` for a clean exit animation

---

### `prefers-reduced-motion` Support

All animations and transitions now explicitly respect `prefers-reduced-motion: reduce`:

| Component | What is disabled |
|---|---|
| Track | `scroll-behavior` set to `auto` |
| Modal | All transitions |
| Lightbox | All transitions; DOM element removed immediately |
| Collapse | All transitions; `data-active` removed immediately |
| Accordion | All transitions |
| Flyout | All transitions and panel animations |
| Alert | `.dismissed` fade-out animation |
| Form | Toggle switch slider transition |
| Document | `--html-scroll-behavior` set to `auto` (disables smooth page scrolling) |

---

*Previous public release: [4.2.2](https://github.com/cavidano/natura11y/releases/tag/v4.2.2)*
