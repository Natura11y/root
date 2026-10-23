# Core — agent instructions

Read the [root instructions](../../AGENTS.md) and [Core README](README.md). This package owns shared CSS, Sass, vanilla behavior, and utility exports.

## Source and component contracts

- Work in `src/scss/` for styles and `src/js/` for behavior. `src/index.js` imports the Sass entry and initializes the complete JavaScript bundle on `DOMContentLoaded`. HTML examples are maintained in [Storybook](../../apps/storybook/AGENTS.md) and [documentation](../../apps/docs/AGENTS.md); follow their instructions when updating examples.
- Keep class names, data attributes, CSS custom properties, focus behavior, and keyboard interactions aligned with the corresponding React implementation, documentation example, and Storybook story.
- Reuse `src/js/utilities/` for focus, keyboard navigation, event delegation, breakpoints, and overlays when they fit. Check initialization, event listeners, and cleanup when changing component behavior.
- Preserve the complete bundle's initialization behavior unless a change is explicitly in scope. Inspect [package.json](package.json) before adding or documenting consumer imports; separate source files are not automatically public exports.
- Build generated assets from source; do not make a behavior fix only in `dist/`.

## Sass and accessibility

- Keep styles in the owning partial and existing cascade layer. Inspect `src/scss/index.scss` and `src/scss/_layer.scss` before changing imports or layer order.
- Preserve token aliases, theme behavior, and component custom properties. Prefer logical CSS properties and check direction-sensitive controls when changing layout.
- Follow the [forced-color authoring rules](../../CONTRIBUTING.md#forced-color-styles) and [forced-color guide](FORCED-COLORS.md) for contrast-mode work. Keep support with the owning component and preserve visible keyboard focus.

## Verification

From the repository root:

```sh
npm run build:core
```

The build runs the theme contrast check first. For changes affecting shared component contracts, also run the Storybook checks in the [root matrix](../../AGENTS.md#testing-instructions) and inspect affected HTML and React examples. Use the [forced-color verification procedure](FORCED-COLORS.md#verification) for forced-color changes.

For export or packaging changes, inspect `npm pack --dry-run --workspace @natura11y/core` and verify the documented import in a consumer. A monorepo alias resolving successfully does not prove a published package import works.
