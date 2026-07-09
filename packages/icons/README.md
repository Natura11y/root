# Natura11y Icons

Use Natura11y's open source icon font, or use this package as the starting point for your own icon library.

---

## CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@natura11y/icons@2.2.0/dist/natura11y-icons.min.css">
```

---

## Build Icons

1. Save your SVGs to `./original-svg`.

2. Install package dependencies:

```bash
npm install
```

3. Optimize SVGs, build the icon font, and write the minified CDN stylesheet:

```bash
npm run build:icons
```

---

## The icon font

The build generates `dist/natura11y-icons.css`, `dist/natura11y-icons.min.css`, font files, a sprite, and icon metadata. You can customize the generated icon font with `.fantasticonrc.js`.

---

Related:

- [NPM: @natura11y/icons](https://www.npmjs.com/package/@natura11y/icons)
- [Repo: Natura11y Core](https://github.com/Natura11y/core)
- [Docs: Natura11y Docs](https://gonatura11y.com)
