# Publishing

`Natura11y/root` is the canonical monorepo for the Natura11y Design Ecosystem.

It owns source, package coordination, apps, documentation, Storybook, builds, versions, and release management. npm packages, the docs site, Storybook, and GitHub releases are distribution outputs generated from this monorepo.

## Source Of Truth

- `Natura11y/root` is the canonical development repository.
- Packages are published to npm from workspace folders in this monorepo.
- GitHub source links should point back to this monorepo, using package directories where appropriate.
- The public docs site is built from `apps/docs`.
- Storybook is built from `apps/storybook`.
- Public GitHub issues and pull requests should be opened against `Natura11y/root`.

New framework releases start with `@natura11y/core`.

## Licensing Boundary

This repository uses a mixed-license model.

- Software code, examples, Storybook source, tests, package source, build configuration, and documentation application code are MIT licensed.
- Documentation prose, editorial content, screenshots, diagrams, original images, and other original media in `apps/docs` are protected by copyright and all rights are reserved unless a file says otherwise.
- The Natura11y name, logo, wordmark, and related brand assets are protected separately as trademarks.
- Third-party materials remain governed by their original licenses.

Before a public launch or major release, confirm these files are current:

- `LICENSE.md`
- `LICENSE-CODE.md`
- `apps/docs/LICENSE.md`
- `TRADEMARKS.md`
- `CONTRIBUTING.md`

## Distribution Map

| Source location | Distribution output | Notes |
| --- | --- | --- |
| `packages/core` | `@natura11y/core` on npm | Core CSS, Sass, JavaScript, and utilities. |
| `packages/icons` | `@natura11y/icons` on npm | Icon font, SVG assets, and icon data. |
| `packages/react` | `@natura11y/react` on npm | React components that use core styles and utilities. |
| `apps/docs` | `gonatura11y.com` | Public documentation site. |
| `apps/storybook` | Storybook static site | Public workbench for core and React examples. |

## Package Metadata

Each package should point to the canonical monorepo and identify its workspace directory:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Natura11y/root.git",
    "directory": "packages/react"
  },
  "bugs": {
    "url": "https://github.com/Natura11y/root/issues"
  },
  "homepage": "https://gonatura11y.com/docs/react/"
}
```

Package metadata should point to the canonical monorepo.

## Release Order

When a change affects multiple packages, release in dependency order:

1. Core framework
2. Icons package, when icon assets change
3. React package
4. Docs site
5. Storybook/workbench site

Do not publish React changes that depend on unreleased core exports or styles.

## Versioning

Publish only packages that changed.

Do not bump all packages automatically unless we intentionally want a coordinated ecosystem release. npm does not allow republishing the same version, so every npm publish must have a new package version.

Examples:

- Core accessibility fix: publish `@natura11y/core` only.
- Icon asset change: publish `@natura11y/icons` only.
- React component change: publish `@natura11y/react` only.
- React dependency range changes because core changed: publish React with its own version bump.

React prereleases should use npm dist-tags:

```sh
npm publish --workspace @natura11y/react --tag beta --access public
```

## Release Workflow

1. Confirm the active repo is `/Users/carlavidano/Sites/natura11y`.
2. Confirm `origin` points to `https://github.com/Natura11y/root.git`.
3. Confirm the worktree contains only intentional release changes.
4. Build and verify changed packages.
5. Update versions and changelogs for changed packages.
6. Commit and push the release state.
7. Tag the monorepo with package-specific tags for packages being published.
8. Publish changed packages to npm.
9. Create or update GitHub releases when useful for public release notes.
10. Deploy docs or Storybook if those outputs changed.

Use package-specific tags in the monorepo so independent package versions stay clear:

```txt
core-v5.2.1
icons-v2.2.0
react-v1.0.0-beta
```

## npm Publish Commands

Core:

```sh
npm publish --workspace @natura11y/core --access public
```

Icons:

```sh
npm publish --workspace @natura11y/icons --access public
```

React beta:

```sh
npm publish --workspace @natura11y/react --tag beta --access public
```

React stable:

```sh
npm publish --workspace @natura11y/react --access public
```

## Verification Commands

Run the relevant checks before publishing.

Core:

```sh
npm run build:core
npm pack --dry-run --workspace @natura11y/core
```

Icons:

```sh
npm run build:icons
npm pack --dry-run --workspace @natura11y/icons
```

React:

```sh
npm run typecheck:react
npm run build:react
npm pack --dry-run --workspace @natura11y/react
```

Docs:

```sh
npm run build:docs
```

Storybook:

```sh
npm run typecheck:storybook
npm run build-storybook
```

## Application Deployments

The docs and Storybook apps are deployed as static application outputs, not npm packages.

- Docs source: `apps/docs`
- Docs build output: `apps/docs/dist`
- Docs public host: `gonatura11y.com`
- Storybook source: `apps/storybook`
- Storybook build output: `storybook-static`

Use GitHub Actions for repeatable deployments once the repository is public.

## First Public Launch Checklist

Before changing repository visibility to public:

- Confirm no credentials, tokens, `.env` files, FTP details, or private deployment keys are present in the current tree.
- Audit git history for sensitive material before making the repository public.
- Confirm large local media and working design assets are intentionally public before committing them.
- Confirm `apps/docs` licensing text reflects the copyright boundary for documentation content and original media.
- Confirm package metadata points to `Natura11y/root`.
- Confirm docs links use `gonatura11y.com`.
- Confirm README, contributing, license, and trademark files are ready for public readers.
- Confirm build and package dry-runs pass.

## Repository Hygiene

- Do not commit `.DS_Store` files.
- Do not commit video files such as `.mp4`, `.mov`, `.webm`, or `.m4v` unless they are intentionally public package or docs assets.
- Keep large local media assets local, external, or intentionally hosted elsewhere.
- Keep generated build output out of git unless a package specifically needs it as a publish artifact.
- Keep npm package releases tied to committed source, version, and changelog changes.

## Local Paths

Use the active monorepo folder:

```txt
/Users/carlavidano/Sites/natura11y
```

Its `origin` remote should point to:

```txt
https://github.com/Natura11y/root.git
```
