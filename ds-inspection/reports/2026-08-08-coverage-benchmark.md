# Station 1 Follow-up — Coverage Benchmark

_Inspected: 2026-08-08 · Technician: Codex (GPT-5) · Mode: focused reinspection_

## Purpose

This follow-up applies the Eddie-demo workflow to Natura11y without treating another system's catalog as a mandatory shopping list. It compares the current Core, React, Docs, Storybook, and Hi-fi Figma surfaces with established public design systems, then separates demonstrated ecosystem needs from watchlist ideas and intentional scope.

The Southleft Design Systems MCP was used for broad discovery. Candidate findings were then checked against Natura11y's live sources and current official documentation from Carbon, Adobe Spectrum, GitHub Primer, Shopify Polaris, and Atlassian.

## Current Natura11y evidence

- [verified] The canonical code inventory contains 44 top-level Core Sass modules, 13 top-level interactive JavaScript modules, 20 React component domains, 46 Astro documentation pages, and 38 Storybook story topics.
- [verified] The live Hi-fi file contains 32 pages. Its named component pages include Accordion, Alert, Badge, Backdrop, Breadcrumb, Button, Link, Card, Global Footer, Modal, Main Menu, Navigation, Flyout, Nested Nav, Form, Tab, Track, and Table.
- [verified] The live Button component sets expose Default, Hover, and Focus. They do not expose Loading.
- [verified] Core already contains a rotating loading icon and uses it internally in Lightbox, but there is no general loading/progress component or documented public contract.
- [verified] Natura11y Docs Search already implements a real asynchronous combobox/listbox experience with live status text and `aria-busy`.
- [verified] No existing GitHub issue covered any of the benchmark candidates before this pass.

## Candidate gaps and decisions

| Candidate | Natura11y today | Comparison signal | Classification | Decision |
|:--|:--|:--|:--|:--|
| Button loading | Spinner visual exists; no Core hook, React prop, Figma state, examples, or behavior tests | Carbon, Spectrum, Primer, and Atlassian all define Button loading/pending behavior | Demonstrated adjacent need; bounded extension of an existing component | **Backlog now:** [issue #1](https://github.com/Natura11y/root/issues/1) |
| Loading / progress feedback | Lightbox has a private loader; Docs Search has busy-state semantics; no reusable determinate or indeterminate public pattern | Progress/spinner patterns recur across Carbon, Primer, Polaris, Atlassian, Material, and Spectrum | Real ecosystem signal, but Button loading can reuse the current icon without forcing a new component first | Watch issue #1 usage; split into a primitive only when a second public consumer needs it |
| Tooltip / toggletip | Icon-only controls require accessible names, but Natura11y has no visible explanatory tooltip pattern | Common in Carbon, Material, Spectrum, and other benchmark systems | Plausible accessibility enhancement; positioning and interaction contract need evidence | Watchlist; collect concrete icon-control use cases before creating a component issue |
| Generic popover | Dropdown covers menu disclosure; Flyout and Modal cover larger overlays; no arbitrary anchored rich-content container | Carbon, Spectrum, Polaris, and many catalogued systems expose Popover | Genuine catalog difference, not yet a demonstrated Natura11y product gap | Watchlist; do not duplicate Dropdown or create an overlay dependency without a use case |
| Combobox / autocomplete | A robust product-specific implementation exists in Docs Search through Algolia; not exposed by Core/React | Common in Carbon, Spectrum, Polaris, and other application-oriented systems | Demonstrated once, but highly behavioral and data-source dependent | Keep local until a second consumer appears; then evaluate extracting a framework-neutral contract |
| Empty state | No formal component; existing primitives can compose one | Common in Primer, Polaris, Atlassian, and many catalogued systems | Best modeled as content/layout guidance unless repeated structure emerges | Candidate Docs recipe, not a Core component or issue today |
| Toast / snackbar | Alert handles immediate confirmation/warning messages; no timed transient notification queue | Common in application-oriented systems | Different behavior from Alert, but no current product signal | Intentional omission for now |
| Drawer | Flyout already provides a full-height off-canvas dialog with focus trap, Escape, return focus, and drill-down panels | Usually catalogued as Drawer or Sidebar | Covered under Natura11y's vocabulary | No gap |
| Menu / action menu | Dropdown and split-link dropdown cover navigation/menu disclosure and keyboard behavior | Often catalogued as Menu, Dropdown, or Action Menu | Substantially covered under Natura11y's vocabulary | No new issue; only extend when a specific selection/action-menu contract is needed |
| Date picker | Native date inputs remain available; no custom calendar picker | Common but complex and localization-heavy | Specialized control with high ownership cost | Intentional omission until product demand is explicit |
| Tree view | Nested Nav handles hierarchical navigation, not a generic selectable tree widget | Present in some data-dense systems | Specialized application control | Intentional omission until product demand is explicit |
| Segmented control | Can be composed from radio/button semantics; no formal component | Present in some application systems | Possible convenience component, not a foundational gap | Intentional omission until repeated use proves a shared contract |
| Skeleton | No formal skeleton placeholder | Common in application systems | Performance-perception pattern without current Natura11y evidence | Watchlist only |
| Avatar | Images and cards can compose identity presentation; no Avatar component | Common in product/application systems | Simple but product-specific | Watchlist only |

## Reverse benchmark — Natura11y advantages to protect

The comparison is not one-way. These are areas where Natura11y is stronger or more explicit than the comparison set is consistently shown to be.

### 1. Implementation contracts live in the design assets

[verified] Live Figma descriptions for Button, Alert, Form, Modal, Flyout, Navigation, Main Menu, and Track specify semantic HTML, Natura11y classes, ARIA relationships, focus/keyboard behavior, and deliberate design-versus-code differences. This is more useful to an agent or implementer than a visual-only component description.

**Protect:** every new Figma component or state must describe how its visual controls map to production semantics rather than merely naming the appearance.

### 2. One semantic contract spans plain HTML and React

[verified] Core supplies CSS plus framework-neutral JavaScript behavior, while React implements the same component vocabulary and semantics. Consumers can use Natura11y in static/CMS markup or React without switching design systems.

**Protect:** React should remain an adapter over the same semantic contract, not become a separate source of truth or require Core consumers to adopt a framework.

### 3. Responsive site composition is part of the system

[verified] Natura11y includes Bar and Stack Main Menu variants, distinct Small/Large Figma compositions, responsive navigation and search rules, Nested Nav, a drill-down Flyout, and a responsive Global Footer example. Large application systems often provide responsive primitives while leaving the complete website shell to each product.

**Protect:** do not replace these coherent site-level patterns with a collection of disconnected app controls.

### 4. Elastic sizing reduces variant pressure

[verified] Buttons and form controls use inherited font size, relative padding, and shared target-size variables. The same component can scale through typography/utilities rather than multiplying rigid component APIs.

**Protect:** new states should compose with the existing relative sizing model and avoid hard-coded size matrices.

### 5. Figma is allowed to be a complementary representation

[verified] Heading and paragraph blocks are intentionally Figma-only authoring helpers, while `Viewport` is explicitly a preview property rather than a production prop. Natura11y records these differences instead of forcing false one-to-one parity.

**Protect:** parity means a bridgeable shared contract, not identical artifacts on every surface.

### 6. Figma slots constrain valid composition

[verified] Main Menu's navigation slot prefers Natura11y Nav Item components, and Flyout's item slot is intentionally limited to Flyout Nav Item drill-down triggers.

**Protect:** prefer constrained child slots and explicit descriptions where invalid composition would harm semantics or responsive behavior.

### 7. Content-rich and marketing-site patterns are first-class

[verified] Backdrop, Track, Main Menu, responsive navigation, cards, theme utilities, layout utilities, and footer compositions cover public-facing content experiences that product-application systems often leave to local teams.

**Protect:** benchmark against Natura11y's actual consumers, not only admin dashboards and data-dense enterprise applications.

### 8. Documentation teaches markup anatomy, not only APIs

[verified] Component docs combine purpose, production-shaped examples, highlighted markup, line-by-line descriptions, accessibility guidance, and customization variables.

**Protect:** new component states are not complete until both semantic HTML and React consumers can understand and verify the contract.

## Prioritization rule

A benchmark candidate should become shared-system work when at least one of these is true:

1. two independent Natura11y consumers need the same behavior;
2. the same ad hoc pattern appears in two maintained parts of the ecosystem;
3. the missing contract creates an accessibility or consistency risk in an existing public component; or
4. the addition is a small, dependency-free extension of an existing component with clear cross-surface semantics.

Catalog popularity alone is not sufficient.

## Outcome

- Created one high-confidence backlog item: [Add a first-class Button loading state across Core, React, Docs, Storybook, and Figma](https://github.com/Natura11y/root/issues/1).
- Kept Progress/Loading, Tooltip, Popover, Combobox, and Empty State as evidence-bearing watchlist candidates.
- Classified Drawer and Menu as covered by Natura11y's existing vocabulary.
- Kept Date Picker, Tree View, Segmented Control, Toast, Skeleton, and Avatar out of the backlog until consumer evidence changes.
- Recorded eight Natura11y advantages that future parity work should protect.
- Station 1 remains green. This pass improves the quality of the backlog; it does not convert every catalog difference into a score penalty.

## Comparison references

- [Southleft Design Systems MCP](https://github.com/southleft/design-systems-mcp)
- [Carbon component overview](https://carbondesignsystem.com/components/overview/components/), [Button loading](https://carbondesignsystem.com/components/button/usage/), [Popover](https://carbondesignsystem.com/components/popover/usage/), and [Tooltip](https://carbondesignsystem.com/components/tooltip/usage/)
- [Adobe Spectrum Button pending state](https://spectrum.adobe.com/page/button/), [Popover](https://spectrum.adobe.com/page/popover/), and [Combo box](https://spectrum.adobe.com/page/combo-box/)
- [GitHub Primer Button loading](https://primer.style/product/components/button/) and [component catalog](https://primer.style/product/components/)
- [Shopify Polaris component catalog](https://polaris-react.shopify.com/components), [Popover](https://polaris-react.shopify.com/components/overlays/popover), and [Combobox](https://polaris-react.shopify.com/components/selection-and-input/combobox)
- [Atlassian Button loading](https://atlassian.design/guidelines/product/components/buttons) and [component catalog](https://atlassian.design/components/)
