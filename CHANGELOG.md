# Changelog

All notable changes to this project will be documented in this file.

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

#### JS module renames

| v4 | v5 |
|---|---|
| `Navigation` class (`navigation.js`) | Removed — replaced by `Dropdown` + `MainMenu` |
| `import Navigation from '...'` | `import Dropdown from './js/dropdown'` |
| — | `import MainMenu from './js/main-menu'` (new) |
| — | `import Flyout from './js/flyout'` (new) |

#### `primary-nav` renamed to `main-menu`

| v4 | v5 |
|---|---|
| `primary-nav--inline--{bp}` | `main-menu--bar--{bp}` |
| `primary-nav--below--{bp}` | `main-menu--stack--{bp}` |
| `primary-nav__menu` | `main-menu__nav` |
| `primary-nav__search` | `main-menu__search` |
| `--primary-nav-padding-x` | `--main-menu-padding-x` |
| `--primary-nav-padding-y` | `--main-menu-padding-y` |

Child slot classes (`__logo`, `__toggle`, `__search`, `__actions`) are unchanged.

#### `nav__dropdown` renamed to `dropdown__menu`
Any element previously using `.nav__dropdown` must be updated to `.dropdown__menu`.

#### `.nav-breadcrumb` renamed to `.breadcrumb`

#### `.nav--has-icons` removed
Icon styles are now applied automatically when nav items contain icon elements — no modifier class required. Also: `.nav__text` → `.text` (generic text wrapper class).

#### Navigation SCSS restructured
`_navigation.scss` was significantly reduced. Functionality has moved to dedicated partials:
- `_main-menu.scss` — global site header (was `primary-nav`)
- `_dropdown.scss` — dropdown menus, mega menus, `nav-dropdown`, `nav-link-dropdown`
- `_flyout.scss` — off-canvas panel (brand new)
- `_breadcrumb.scss` — breadcrumb
- `_pagination.scss` — pagination

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
