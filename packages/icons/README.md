# Natura11y Icons

Use Natura11y's open source icon font, or use this package as the starting point for your own icon library.

This repository is a public release mirror of the `@natura11y/icons` package. Development and release management take place in Natura11y's private monorepo.

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

- [Repo: Natura11y Icons](https://github.com/Natura11y/icons)
- [NPM: @natura11y/icons](https://www.npmjs.com/package/@natura11y/icons)
- [Docs: Natura11y Docs](https://gonatura11y.com)
