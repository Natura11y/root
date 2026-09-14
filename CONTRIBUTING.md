# Contributing to Natura11y

Thank you for your interest in contributing to Natura11y.

This repository uses a mixed-license model. Before contributing, please read [LICENSE.md](./LICENSE.md).

## Software Contributions

By submitting a software contribution, you agree that your contribution may be included in Natura11y under the MIT License in [LICENSE-CODE.md](./LICENSE-CODE.md).

Software contributions include source code, package code, examples, tests, build configuration, Storybook source, and documentation application code.

## Forced-color styles

- Keep forced-color support in the Sass file and existing CSS layer that own the component or shared primitive.
- Place a `@media (forced-colors: active)` block last inside the selector it affects, after its regular declarations and nested rules. When one block covers multiple selectors, place it at the end of their related component section, before the next section.
- Use `var(--forced-color-border)` for added boundaries. Reserve outlines for focus, and use system colors for explicit forced-color values.
- Keep existing regular declarations that support forced colors, such as transparent borders, with their related visual properties.
- Put the exact comment `// Forced color mode support` immediately above each support block or declaration.

Use `forced-color-adjust: none` only for a demonstrated need on the smallest affected element, with system colors. See the [Core forced-color guide](packages/core/FORCED-COLORS.md) for the shared property, component coverage, and verification steps.

## Documentation and Media Contributions

Documentation content and original media in `apps/docs` are copyright protected and all rights are reserved unless a file says otherwise.

By submitting documentation, prose, screenshots, diagrams, images, or other authored documentation materials, you retain ownership of your contribution and grant Avidano Digital, LLC a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license to use, reproduce, modify, prepare derivative works from, publicly display, publish, distribute, and sublicense the contribution as part of Natura11y and its documentation.

Do not submit documentation or media you do not have the right to contribute.

## Trademarks

The Natura11y name, logo, and related brand assets are not licensed under MIT. See [TRADEMARKS.md](./TRADEMARKS.md).

## Issues and Pull Requests

Issues, bug reports, accessibility findings, documentation corrections, and pull requests are welcome.

Please keep pull requests focused and include enough context for maintainers to review the change.
