# Publishing

This repository is the private source monorepo for Natura11y.

## Source Of Truth

- `Natura11y/natura11y` is the private monorepo source.
- Public packages and public documentation are distribution surfaces, not separate sources of truth.
- The old `cavidano/natura11y` repository is legacy/public reference until we decide whether to archive it or replace it with a public pointer.

## Public Distribution

Publish public code through npm packages:

- `@natura11y/core`
- `@natura11y/react`
- `@natura11y/icons`

The docs site can be deployed publicly from the built Astro output. The docs source stays in this private monorepo.

## Release Order

When a change affects multiple packages, release in dependency order:

1. Core framework
2. React package
3. Icons package, when icon assets change
4. Docs site

Do not publish React changes that depend on unreleased core exports or styles.

## Repository Hygiene

- Do not commit `.DS_Store` files.
- Do not commit video files such as `.mp4`, `.mov`, `.webm`, or `.m4v`.
- Keep large local media assets local, external, or intentionally hosted elsewhere.
- Keep generated build output out of git unless a package specifically needs it as a publish artifact.

## Local Workflow

Use the active local folder:

```txt
/Users/carlavidano/Sites/natura11y
```

Its `origin` remote should point to:

```txt
https://github.com/Natura11y/natura11y.git
```

The legacy local folder, if present, is only for old public repo reference:

```txt
/Users/carlavidano/Sites/natura11y-legacy
```
