# Icons — agent instructions

Apply these instructions to changes in `packages/icons/`. Read the [root instructions](../../AGENTS.md); consult the [Icons README](README.md) for documented package usage.

Read the [public icon documentation](../../apps/docs/src/content/docs/icon.mdx), including its custom-font and Figma workflow. Inspect the [icon browser](../../apps/docs/src/pages/icons/index.astro), [SVG download route](../../apps/docs/src/pages/icons/svg/[name].svg.ts), and [Storybook examples](../../apps/storybook/stories/icon/Icon.stories.tsx) for affected consumers.

## Source and compatibility

- Edit original artwork in `original-svg/`; use the package build to regenerate `optimized-svg/` and `dist/` outputs. Do not fix only a generated asset.
- Inspect [.fantasticonrc.js](.fantasticonrc.js) before changing font generation. It reuses the codepoints in `dist/natura11y-icons.json`; preserve existing mappings and icon names to avoid breaking consumers.
- Keep `src/data/icons.mjs` and its declaration file consistent with additions, renames, removals, and metadata changes. Check documentation search and SVG routes that consume the catalog. Match each catalog entry’s `codePoint` and hexadecimal `unicode` to `dist/natura11y-icons.json`; correct stale metadata without reassigning established font codepoints.
- Preserve the `.icon` and `icon-*` class contracts. Decorative icons should be hidden from assistive technology; controls that use an icon still need an accessible name.
- Confirm artwork licensing before adding assets. Follow the repository's licensing and trademark boundaries.

## Verification

From the repository root:

```sh
npm run build:icons
npm pack --dry-run --workspace @natura11y/icons
```

Inspect the generated diff for unintended icon removals, name changes, and codepoint reassignment. Confirm that changed icons render in SVG and font form, and that the minified stylesheet resolves its font files.

For catalog or integration changes, run `npm run build:docs` and inspect the icons page and affected component examples. Check both the source artwork and generated outputs before committing tracked generated files.

## Release scope

Consult [PUBLISHING.md](../../PUBLISHING.md) and the current publishing workflow before releasing. Do not assume an Icons tag triggers npm publication: `.github/workflows/publish.yml` currently handles Core and React tags.
