# Natura11y Monorepo Northstar

This is the proposed structure for turning the current `natura11y` repo into the root of a monorepo. The goal is one clean workspace where HTML, React, icons, Storybook, docs, and full-page examples can evolve together without duplicating the same component truth across separate repos.

The publishing rule is important:

```text
Develop once.
Publish complete packages.
```

The monorepo can share Sass, CSS, JavaScript utilities, examples, and media for upkeep. The published packages should still feel complete to the people installing them. A React app should be able to install `@natura11y/react` and get the React components, CSS, Sass, and utilities it needs. An HTML or WordPress project should be able to install `natura11y` and get the HTML framework CSS, Sass, JavaScript, and utilities it needs.

WordPress is intentionally out of scope for the first pass.

## Proposed Structure

```text
natura11y/
  package.json
  package-lock.json
  README.md
  MONOREPO-NORTHSTAR.md

  shared/
    scss/
      index.scss
      components/
      utilities/
    js/
      utilities/
    examples/
      accordion.ts
      table.ts
      navigation.ts
    media/
      components/
        backdrop/
          image-default.jpg
          image-fixed-height.jpg
          image-split.jpg
          video.mp4
          video-poster.jpg
        card/
          card-default.jpg
          card-horizontal.jpg
      brand/

  packages/
    html/
      package.json
      src/
        js/
        scss/
      scss/
        index.scss
      utilities/
        index.js
      dist/
        css/
          natura11y.css
        js/
          index.js
          accordion.js
          disclosure.js

    react/
      package.json
      src/
        components/
        hooks/
        types/
      scss/
        index.scss
      utilities/
        index.js
      dist/
        index.js
        index.d.ts
        css/
          natura11y-react.css

    icons/
      package.json
      src/
        svg/
        metadata/
        scss/
      scss/
        index.scss
      dist/
        css/
          natura11y-icons.css
        fonts/
        svg/
        metadata/

  apps/
    storybook/
      .storybook/
        main.ts
        preview.tsx
        preview-head.html
        manager.ts
      public/
        story-assets/
      stories/
        components/
          accordion/
            Accordion.stories.tsx
            accordion.example.html
          table/
            Table.stories.tsx
            table.example.html

    docs/
      package.json
      astro.config.mjs
      src/
        content/
        components/
        layouts/
        pages/
        assets/

    examples-html/
      package.json
      src/
        pages/
        assets/

    examples-react/
      package.json
      src/
        pages/
        components/
        assets/

  scripts/
    build-packages.mjs
    sync-package-assets.mjs
    release.mjs
```

## Package Roles

`shared`

Private monorepo source for shared Sass, JavaScript utilities, example data, and media. This is for development upkeep only. It is not published directly, and no published package should rely on walking up into `shared`.

`packages/html`

Publishes as `natura11y`. This is the complete HTML and WordPress-friendly framework package. It should ship its own CSS, Sass, JavaScript behaviors, and utilities.

`packages/react`

Publishes as `@natura11y/react`. This is the complete React package. It should ship React components plus its own CSS, Sass, and utilities generated from the shared source. A React consumer should not need to manually install the HTML package to customize or use Natura11y in a React app.

`packages/icons`

Publishes as `natura11y-icons`. Owns the icon source, metadata, generated font files, icon CSS, Sass, and SVG assets.

`apps/storybook`

Internal workbench for component development and review. It should show HTML and React implementations side by side where useful, using the same shared design-system source during development.

`apps/docs`

Public documentation site, likely Astro. This is the explanatory public docs surface, not the internal component workbench.

`apps/examples-html`

Full-page HTML examples and templates. These should remain outside `packages/html` so the installable package can stay focused.

`apps/examples-react`

Full-page React examples and templates using `packages/react` and `packages/icons`.

## Shared Example Assets

Images and video used for examples should live in one shared place whenever possible. Storybook, Astro docs, and full-page examples should import the same media instead of each app or package borrowing random images from another component.

Example structure:

```text
shared/
  media/
    components/
      backdrop/
        image-default.jpg
        image-fixed-height.jpg
        image-split.jpg
        video.mp4
        video-poster.jpg
      card/
        card-default.jpg
        card-horizontal.jpg
```

Example data can point to those assets once:

```ts
export const backdropMedia = {
  defaultImage: "/media/components/backdrop/image-default.jpg",
  fixedHeightImage: "/media/components/backdrop/image-fixed-height.jpg",
  splitImage: "/media/components/backdrop/image-split.jpg",
  video: "/media/components/backdrop/video.mp4",
  videoPoster: "/media/components/backdrop/video-poster.jpg",
};
```

Then the same source can feed:

- HTML Storybook stories
- React Storybook stories
- Astro documentation examples
- Full-page HTML examples
- Full-page React examples

This keeps Backdrop, Card, and any other media-heavy examples visually consistent across the development environment and public documentation.

These demo assets should not be included in published package payloads unless they are required product assets. They are documentation/example assets, not framework dependencies.

## Published Package Exports

Each package should be publishable as if it lived alone. The monorepo helps development, but published packages must be complete consumer artifacts.

### HTML Package

Published package:

```text
packages/html -> natura11y
```

Consumer install:

```bash
npm install natura11y
```

Consumer usage:

```scss
@use "natura11y/scss";
```

```js
import "natura11y/css";
import "natura11y";
```

Example export map:

```json
{
  "name": "natura11y",
  "exports": {
    ".": "./dist/js/index.js",
    "./css": "./dist/css/natura11y.css",
    "./scss": "./scss/index.scss",
    "./utilities": "./utilities/index.js",
    "./utilities/*": "./utilities/*.js",
    "./js/*": "./dist/js/*.js"
  },
  "files": [
    "dist",
    "scss",
    "utilities",
    "README.md",
    "LICENSE"
  ]
}
```

Release contents:

- Compiled CSS
- Sass source for customization
- Vanilla JavaScript behaviors
- JavaScript utilities
- Package metadata and docs

### React Package

Published package:

```text
packages/react -> @natura11y/react
```

Consumer install:

```bash
npm install @natura11y/react
```

Consumer usage:

```tsx
import { Accordion, Table } from "@natura11y/react";
import "@natura11y/react/css";
```

```scss
@use "@natura11y/react/scss";
```

Example export map:

```json
{
  "name": "@natura11y/react",
  "peerDependencies": {
    "react": "^19",
    "react-dom": "^19"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./css": "./dist/css/natura11y-react.css",
    "./scss": "./scss/index.scss",
    "./utilities": "./utilities/index.js",
    "./utilities/*": "./utilities/*.js"
  },
  "files": [
    "dist",
    "scss",
    "utilities",
    "README.md",
    "LICENSE"
  ]
}
```

Release contents:

- React components
- TypeScript declarations
- Compiled CSS
- Sass source for customization
- JavaScript utilities needed by React consumers
- Package metadata and docs

### Icons Package

Published package:

```text
packages/icons -> natura11y-icons
```

Consumer install:

```bash
npm install natura11y-icons
```

Consumer usage:

```scss
@use "natura11y-icons/scss";
```

```js
import "natura11y-icons/css";
```

Example export map:

```json
{
  "name": "natura11y-icons",
  "exports": {
    "./css": "./dist/css/natura11y-icons.css",
    "./scss": "./scss/index.scss",
    "./svg/*": "./dist/svg/*.svg",
    "./metadata": "./dist/metadata/icons.json"
  },
  "files": [
    "dist",
    "scss",
    "README.md",
    "LICENSE"
  ]
}
```

Release contents:

- Icon CSS
- Icon Sass
- SVG assets
- Generated fonts, if still part of the icon package
- Icon metadata

## Release Rule

```text
Shared source in the monorepo.
Complete packages on npm.
```

If shared Sass or utilities change, both `natura11y` and `@natura11y/react` can receive updated package output. If only React component code changes, only `@natura11y/react` needs a release. If only icons change, only `natura11y-icons` needs a release.

## Root Workspace

The root `package.json` should be private and use npm workspaces unless there is a strong reason to choose another workspace manager. In the current phase, packages are workspaces and Storybook lives under `apps/storybook` but is run by root scripts. When docs becomes a managed app, add `apps/*` to the workspace list.

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "build": "npm run build --workspaces",
    "storybook": "storybook dev -p 6006 -c apps/storybook/.storybook",
    "build-storybook": "storybook build -c apps/storybook/.storybook",
    "typecheck": "npm run typecheck --workspaces --if-present"
  }
}
```

## Storybook Shape

Storybook should become the internal place to test component-level behavior across HTML and React.

```text
apps/storybook/stories/
  components/
    accordion/
      Accordion.stories.tsx
      accordion.example.html
    table/
      Table.stories.tsx
      table.example.html
    icon/
      Icon.stories.tsx
      icon.example.html
```

The key idea is that HTML stories render real DOM using the HTML package source, not static screenshots. React stories render real React components using `packages/react`.

Example HTML story shape:

```ts
import 'natura11y/css';
import Accordion from 'natura11y/js/accordion';

export const Default = {
  render: () => `
    <div class="accordion">
      ...
    </div>
  `,
  play: async () => {
    new Accordion().init();
  },
};
```

Example React story shape:

```tsx
import { Accordion } from '@natura11y/react';

export const Default = {
  render: () => (
    <Accordion>
      ...
    </Accordion>
  ),
};
```

## Weekend Migration Plan

### Day 1

Create the workspace structure. Move the current HTML package into `packages/html`, move React into `packages/react`, and preserve package names and build outputs.

### Day 2

Move icons into `packages/icons`. Create `apps/storybook`, wire shared Sass/CSS, icon CSS, HTML JavaScript, and React. Migrate a few high-value paired stories first: Accordion, Table, Badge/Icon.

### Day 3

Clean root scripts and imports. Verify package builds. Decide what remains in full-page examples/templates versus what moves into Storybook component stories.

## Guiding Principle

Natura11y should use one shared development source for framework upkeep, while each published package remains complete for its own audience.

HTML, React, and icons are published package arms. Storybook demonstrates them. Astro docs explain them. Full-page examples and templates live outside the published packages so the installable packages stay focused.
