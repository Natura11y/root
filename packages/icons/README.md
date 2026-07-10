# Natura11y Icons

Open source icon library and icon font for the Natura11y Design Ecosystem.

This repository is a public release mirror of the `@natura11y/icons` package. Development and release management take place in Natura11y's private monorepo.

[https://gonatura11y.com/icons/](https://gonatura11y.com/icons/)

---

## Install

```bash
npm install @natura11y/icons
```

Import the icon font stylesheet once from your application entry point:

```js
import '@natura11y/icons/dist/natura11y-icons.min.css';
```

Use icons with Natura11y's icon classes:

```html
<span class="icon icon-search" aria-hidden="true"></span>
```

---

## CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@natura11y/icons@2.2.0/dist/natura11y-icons.min.css">
```

---

## What's Included

- Original SVG source files.
- Optimized SVG files.
- Generated icon font files.
- Compiled and minified icon CSS.
- Icon metadata used by the Natura11y docs site.

---

## Build Icons

```bash
npm install
npm run build:icons
```

The build optimizes SVGs, generates the icon font, and writes the minified CDN stylesheet.

---

## Related

- [Natura11y Icons on GitHub](https://github.com/Natura11y/icons)
- [Natura11y Icons on NPM](https://www.npmjs.com/package/@natura11y/icons)
- [Natura11y Docs](https://gonatura11y.com)
