# Publishing

`Natura11y/root` is the private management system for the Natura11y ecosystem.

It owns source, package coordination, apps, documentation, Storybook, builds, versions, and release management. Public GitHub package repositories, npm packages, the docs site, and Storybook are distribution outputs generated from this private source of truth.

## Source Of Truth

- `Natura11y/root` is private and is the canonical source of truth.
- Public GitHub repositories are package-specific release mirrors, not canonical development repositories.
- npm packages are installable distribution artifacts.
- The public docs site is built from `apps/docs`.
- Storybook is a static workbench application output.
- The private monorepo must not be made public.

The old unscoped `natura11y` npm package remains available as the legacy package line. It should not receive new framework feature releases. New framework releases start with `@natura11y/core`.

## Distribution Map

| Private location | Public GitHub mirror | npm package | Notes |
| --- | --- | --- | --- |
| `packages/core` | `Natura11y/core` | `@natura11y/core` | Public mirror exists. |
| `packages/icons` | `Natura11y/icons` | `@natura11y/icons` | Public mirror exists. |
| `packages/react` | `Natura11y/react` | `@natura11y/react` | Public mirror exists. |
| `apps/docs` | none | none | Deploys to `gonatura11y.com`. |
| `apps/storybook` | none | none | Builds to `storybook-static` and should deploy to a dedicated workbench host. |

## Public Package Mirrors

Package mirrors exist so users can inspect package source, read release notes, file issues, and discover the package from GitHub. They are not where canonical development happens.

Each public mirror README should include this note, adjusted for the package name:

```txt
This repository is a public release mirror of the @natura11y/core package. Development and release management take place in Natura11y's private monorepo.
```

Each public mirror should also include a `CONTRIBUTING.md` that states the contribution policy. The default policy is:

```txt
Issues are welcome. Pull requests are not accepted directly in this mirror because canonical development happens in Natura11y's private monorepo.
```

## First-Time Mirror Setup

Each package should have a matching public GitHub mirror before the package is treated as fully public.

Create the public repository in the `Natura11y` organization:

- `Natura11y/core`
- `Natura11y/icons`
- `Natura11y/react`

The public mirror should be a package repository, not an import of the private monorepo. Do not copy `apps`, unrelated packages, private release tooling, or monorepo configuration into a package mirror.

After the GitHub repo exists, create or refresh the local mirror checkout:

```sh
git clone https://github.com/Natura11y/icons.git /Users/carlavidano/Sites/natura11y-icons-public
git clone https://github.com/Natura11y/react.git /Users/carlavidano/Sites/natura11y-react-public
```

Then sync only the package contents from the private monorepo:

```sh
rsync -a --delete \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude '.DS_Store' \
  /Users/carlavidano/Sites/natura11y/packages/icons/ \
  /Users/carlavidano/Sites/natura11y-icons-public/
```

Commit, tag, and push the mirror with the package version:

```sh
cd /Users/carlavidano/Sites/natura11y-icons-public
git add -A
git commit -m "Release 2.2.0"
git tag -a v2.2.0 -m "Release 2.2.0"
git push origin main --tags
```

Repeat the same package-scoped process for React once `Natura11y/react` exists.

## Package Metadata

Each package should eventually point to its own public mirror:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/Natura11y/react.git"
  },
  "bugs": {
    "url": "https://github.com/Natura11y/react/issues"
  },
  "homepage": "https://gonatura11y.com"
}
```

Before publishing package metadata that points to a public mirror, confirm the mirror repository exists and accepts pushes.

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

1. Work in the private monorepo.
2. Confirm the active repo is `/Users/carlavidano/Sites/natura11y`.
3. Confirm `origin` points to `https://github.com/Natura11y/root.git`.
4. Build and verify changed packages.
5. Update versions and changelogs.
6. Commit and push the private release state.
7. For each changed package, sync only that package's approved files to its public GitHub mirror.
8. Commit the mirror as `Release x.y.z`.
9. Tag the mirror repo with the package version, such as `v5.2.1`.
10. Push the public mirror and tag.
11. Publish the package to npm.
12. Deploy docs or Storybook if those outputs changed.

## Mirror Sync Rules

Mirror sync must be package-only. Never sync the private monorepo root into a public package mirror.

Approved public mirror contents may include:

- `package.json`
- `README.md`
- `CHANGELOG.md`
- `LICENSE`
- package source files
- compiled distribution files, when the package intentionally commits them
- TypeScript declarations, when applicable
- package-specific examples or documentation, when intentionally public

Never sync:

- unrelated packages
- `apps`
- private release tooling
- internal notes
- credentials or environment files
- `.DS_Store`
- `node_modules`
- large local media that is not intentionally part of the public package

Mirror automation should use an allowlist or package-scoped sync command so the public mirror receives only the intended package contents.

## Operational Guardrails

The mirror workflow is operationally sensitive even though the architecture is straightforward.

- Public mirrors must be generated from the private monorepo.
- Public mirrors should never be edited independently as the source of truth.
- If a public mirror needs an emergency manual fix, port that fix back into the private monorepo before the next release.
- npm package versions and public GitHub tags must match.
- A release should fail before publishing if the target mirror repository does not exist.
- A release should fail before publishing if the private worktree is dirty.
- A release should fail before publishing if the mirror tag already exists.
- A release should fail before publishing if the package version in `package.json` does not match the intended tag.
- Published docs should not link to a public package mirror until that mirror exists.

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

## Local Paths

Use the active private monorepo folder:

```txt
/Users/carlavidano/Sites/natura11y
```

Its `origin` remote should point to:

```txt
https://github.com/Natura11y/root.git
```

Current local public mirror checkouts may include:

```txt
/Users/carlavidano/Sites/natura11y-core-public
/Users/carlavidano/Sites/natura11y-icons-public
/Users/carlavidano/Sites/natura11y-react-public
```

The legacy local folder, if present, is only for old public repo reference:

```txt
/Users/carlavidano/Sites/natura11y-legacy
```

## Repository Hygiene

- Do not commit `.DS_Store` files.
- Do not commit video files such as `.mp4`, `.mov`, `.webm`, or `.m4v` unless they are intentionally public package assets.
- Keep large local media assets local, external, or intentionally hosted elsewhere.
- Keep generated build output out of git unless a package specifically needs it as a publish artifact.
