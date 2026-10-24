# Storybook — agent instructions

Apply these instructions to changes in `apps/storybook/`. Read the [root instructions](../../AGENTS.md) before editing stories, fixtures, or workbench configuration.

## Stories and shared assets

- Stories live in `stories/`, with HTML fixtures beside the component's story. Follow the existing story structure and keep HTML and React examples comparable where both implementations exist.
- Reuse `utils/VanillaExample.tsx` and the established initialization pattern for HTML examples. Check repeated mounting and switching stories so initialization does not accumulate duplicate handlers or stale state.
- Read `.storybook/main.ts` for aliases and static asset mounts and `.storybook/preview.tsx` for themes, decorators, and accessibility configuration before changing those concerns.
- Core assets are served from `packages/core/dist`, icon assets from `packages/icons/dist`, and shared documentation media from `apps/docs/public/docs-assets`. Use the configured paths so examples work in both development and static builds.
- Keep component fixes in the owning package. Story-only CSS should serve the demonstration rather than hide a shared implementation defect.
- Preserve story IDs used by links and verification scripts. If renaming a story, update affected references, including `scripts/check-forced-colors.mjs` when applicable.
- Preserve documented theme and full-page behavior. Check the existing canvas, dark, and system-preference theme options for affected examples.

## Verification

From the repository root:

```sh
npm run typecheck:storybook
npm run build:core
npm run build-storybook
```

Run `npm run build:icons` first when changing icon assets. Use `npm run storybook` to inspect affected stories, including keyboard operation and repeated interaction for behavior changes.

The accessibility addon's current `test: 'todo'` setting is not an enforced accessibility pass. Report the checks actually performed. For forced-color work, follow the [root verification matrix](../../AGENTS.md#testing-instructions), which requires a running Storybook and installed browsers.
