# Documentation — agent instructions

Apply these instructions to changes in `apps/docs/`. Read the [root instructions](../../AGENTS.md) before editing the Astro site, documentation content, or examples.

## Content and examples

- Component documentation lives in `src/content/docs/`; follow the frontmatter schema in `src/content.config.ts` and the surrounding page conventions. Preserve published slugs and update related-page references when changing navigation.
- Examples live in `src/components/examples/`; page routes live in `src/pages/`. Reuse existing layouts and UI components rather than duplicating their structure.
- Verify code examples against the relevant package source and exports. Examples copied by users must use supported public imports. Internal aliases in `astro.config.mjs` are for this monorepo, not consumer installation instructions.
- Keep vanilla and React examples aligned with the shared component contract. `src/scripts/natura11y.ts` initializes vanilla components; ensure React-rendered examples retain a single behavior owner.
- Reuse Core styles and documented markup. Keep documentation-site presentation in its own styles; do not change framework defaults solely to style the docs site.
- Preserve accessible headings, names, keyboard operation, useful alternative text, and focus behavior in both documentation UI and examples.

## Versions and publication

- Shared CDN values live in `src/content/mdxVars.js`. Use full, explicit package versions in public CDN examples and keep them consistent with package manifests. Do not use `latest` in those URLs.
- Use [TODO.md](../../TODO.md) as a record of proposals, not as evidence that an API is available. Clearly distinguish released behavior from planned work.
- Read [the documentation license](LICENSE.md) before reusing prose, media, or screenshots. The site's application code and editorial content have different licensing terms.
- Deployment follows [PUBLISHING.md](../../PUBLISHING.md). Editing or building this app does not authorize deployment.

## Verification

From the repository root:

```sh
npm run build:docs
```

The prebuild step checks source CDN versions. Inspect the affected pages with `npm run docs` for content, layout, or behavior changes; check links, responsive layouts, and applicable keyboard interactions. For prose-only edits, focus review on the changed content and links.

Use `npm run verify:docs-release` only for release verification when the referenced package versions are available publicly; it builds the site and checks generated content and remote CDN assets. Do not mistake a local build for a deployment check.
