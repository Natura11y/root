# Changelog

All notable changes to this project will be documented in this file.

---

## [1.0.0] — 2026-06-29

### Package

- Prepared `@natura11y/react` as an installable React package.
- Declared `natura11y`, `react`, and `react-dom` as peer dependencies.
- Updated the package to require `natura11y@^5.1.1` for shared CSS and JavaScript utility exports.
- Removed the local copied framework SCSS from the React development setup.

### Storybook

- Switched Storybook to load the published framework CSS from `natura11y/dist/natura11y.css`.
- Added a global preview decorator so examples render with Natura11y container spacing.
- Started colocated component stories for Accordion and Button variants.

---
