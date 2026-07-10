# Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0-beta] - 2026-07-10

### Package

- Prepared `@natura11y/react` as an experimental beta package.
- Added public npm package metadata for the Natura11y organization.
- Declared `react` and `react-dom` as peer dependencies.
- Updated the package to require `@natura11y/core@^5.2.1` for shared CSS and JavaScript utility exports.
- Added a `prepublishOnly` check that runs typecheck and build before publish.
- Removed the local copied framework SCSS from the React development setup.

### Accessibility

- Removed disclosure-only `aria-haspopup` attributes from dropdown triggers.
- Updated tabs so `role="tablist"` is applied to the tab navigation list and list items use `role="presentation"`.

### Development

- Simplified the React development presentation into smaller app, component, and template files.
- Updated the search submit controls to use shared React button components.

---
