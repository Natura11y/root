# Natura11y Core

Core CSS, vanilla JavaScript, Sass source, and utility exports for the Natura11y Design Ecosystem.

This package is maintained in the public Natura11y monorepo.

[https://gonatura11y.com](https://gonatura11y.com)

---

## Install

```bash
npm install @natura11y/core
```

Import the compiled CSS and JavaScript once from your application entry point:

```js
import '@natura11y/core/css';
import '@natura11y/core';
```

Or load the Sass source from your Sass bundle:

```scss
@use '@natura11y/core/scss';
```

---

## CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@natura11y/core@5.2.3/dist/natura11y.css">
<script src="https://cdn.jsdelivr.net/npm/@natura11y/core@5.2.3/dist/natura11y.js"></script>
```

---

## What's Included

- CSS custom properties, cascade layers, layout utilities, components, and accessibility helpers.
- Vanilla JavaScript for interactive components such as accordion, alert, collapse, dropdown, flyout, lightbox, modal, tabs, table, and track.
- Sass source files for teams that want to customize or bundle Natura11y from source.
- Shared JavaScript utilities used by other Natura11y packages.
- Static HTML examples for the core component patterns.

---

## Utility Exports

```js
import { getFocusableElements, focusTrap } from '@natura11y/core/utilities/focus';
import { getCurrentBreakpoint } from '@natura11y/core/utilities/getCurrentBreakpoint';
import { handleArrowKeyNavigation } from '@natura11y/core/utilities/keyboardNavigation';
import { handleOverlayOpen, handleOverlayClose } from '@natura11y/core/utilities/overlay';
```

---

## Related

- [Natura11y Core on GitHub](https://github.com/Natura11y/root/tree/main/packages/core)
- [Natura11y Core on NPM](https://www.npmjs.com/package/@natura11y/core)
- [Natura11y Icons on NPM](https://www.npmjs.com/package/@natura11y/icons)
- [Natura11y React on NPM](https://www.npmjs.com/package/@natura11y/react)
- [Natura11y Docs](https://gonatura11y.com)
