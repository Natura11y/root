# Natura11y

Natura11y is an open source design ecosystem for building accessible interfaces with shared CSS, vanilla JavaScript, React components, icons, documentation, and design system workflows.

The ecosystem is designed around one source of truth: the same Core styles, utilities, and accessibility patterns power the vanilla HTML examples, the React package, the documentation site, and the Storybook workbench.

[Documentation](https://gonatura11y.com) | [npm Packages](https://www.npmjs.com/org/natura11y) | [Issues](https://github.com/Natura11y/root/issues)

---

## What's Inside

| Location | Output | Purpose |
| --- | --- | --- |
| `packages/core` | [`@natura11y/core`](https://www.npmjs.com/package/@natura11y/core) | Core CSS, Sass source, vanilla JavaScript, utilities, and HTML examples. |
| `packages/icons` | [`@natura11y/icons`](https://www.npmjs.com/package/@natura11y/icons) | Icon font, SVG assets, optimized icons, and icon metadata. |
| `packages/react` | [`@natura11y/react`](https://www.npmjs.com/package/@natura11y/react) | React 19 components that use Natura11y Core styles and utilities. |
| `apps/docs` | [gonatura11y.com](https://gonatura11y.com) | Astro documentation site. |
| `apps/storybook` | Storybook static site | Development workbench for Core and React examples. |

---

## Packages

Install the Core package when you want the CSS, JavaScript behavior, Sass source, and shared utilities:

```bash
npm install @natura11y/core
```

Install the Icons package when you want the icon font, SVG assets, or icon metadata:

```bash
npm install @natura11y/icons
```

Install the React package when you want Natura11y components in a React 19 project:

```bash
npm install @natura11y/react
```

React projects should import the Core CSS once from the application entry point:

```ts
import '@natura11y/core/css';
```

---

## CDN

Official CDN examples use full SemVer versions so copied production URLs stay predictable.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@natura11y/core@5.2.3/dist/natura11y.css">
<script src="https://cdn.jsdelivr.net/npm/@natura11y/core@5.2.3/dist/natura11y.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@natura11y/icons@2.2.1/dist/natura11y-icons.min.css">
```

---

## Development

Install dependencies from the monorepo root:

```bash
npm install
```

Run the docs site:

```bash
npm run docs
```

Run Storybook:

```bash
npm run storybook
```

Build packages and apps:

```bash
npm run build:core
npm run build:icons
npm run build:react
npm run build:docs
npm run build-storybook
```

Run React type checks:

```bash
npm run typecheck:react
```

---

## Publishing

This repository is the canonical source for Natura11y. Packages are published separately to npm from their workspace folders.

See [PUBLISHING.md](./PUBLISHING.md) for release order, versioning, package metadata, verification commands, and npm publish commands.

---

## Licensing

This repository uses a mixed-license model.

Software code, package source, build configuration, examples, Storybook source, and documentation application code are licensed under the MIT License. See [LICENSE-CODE.md](./LICENSE-CODE.md).

Documentation prose, editorial content, screenshots, diagrams, original images, and other original media in `apps/docs` are copyright protected and all rights are reserved unless a file says otherwise. See [apps/docs/LICENSE.md](./apps/docs/LICENSE.md).

The Natura11y name, logo, wordmark, and related brand assets are protected separately as trademarks. See [TRADEMARKS.md](./TRADEMARKS.md).

For the full license boundary, read [LICENSE.md](./LICENSE.md).

---

## Contributing

Issues, accessibility findings, documentation corrections, and focused pull requests are welcome.

Before contributing, please read [CONTRIBUTING.md](./CONTRIBUTING.md).
