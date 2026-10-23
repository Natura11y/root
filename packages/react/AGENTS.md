# React — agent instructions

Read the [root instructions](../../AGENTS.md) and [React README](README.md). This package provides React 19 components using Core's styles and shared utilities.

## Implementation

- Components live in `src/components/`, reusable hooks in `src/hooks/`, and the development application in `dev/`. Keep development-app changes separate from the published component API.
- Follow the neighboring TypeScript component's props, ref handling, exports, and conventions. Update the relevant barrel in `src/components/index.ts` or `src/hooks/index.ts` when changing public exports.
- Reuse Core classes, tokens, and shared utilities. Read the [Core instructions](../core/AGENTS.md) when changing that package too; do not compensate for a shared style defect with a separate React style system.
- React owns its component lifecycle and interaction behavior. Do not import the auto-initializing Core bundle to drive React-rendered components. Consumers load Core CSS once from their application entry point.
- Preserve controlled and uncontrolled state behavior, stable IDs, focus management, and event cleanup. Check rendering without browser globals where the component supports server rendering.
- Keep public APIs and accessibility behavior aligned with documented usage. Internal aliases in the docs or Storybook configuration are not public package exports.

## Verification

From the repository root:

```sh
npm run typecheck:react
npm run build:react
```

Update the affected React stories and verify interaction, including keyboard and focus behavior. Shared-contract changes also require the [Storybook checks](../../AGENTS.md#testing-instructions) and comparison with the corresponding HTML example.

For public export or packaging changes, inspect `npm pack --dry-run --workspace @natura11y/react`. Verify the affected exports and generated type declarations in a consumer, including the supported module formats. The package's export map and published files list are authoritative.

Use `npm run react-demo` for the development app and `npm run build:react-demo` when changing its build or templates.
