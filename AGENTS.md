# Natura11y — agent instructions

## Scope and source of truth

Apply these instructions to work in the public [Natura11y/root](https://github.com/Natura11y/root) monorepo. Treat this repository as authoritative for Core, React, Icons, documentation, and Storybook. Use the current `@natura11y/*` packages; do not base implementation on the legacy standalone `natura11y` package or older repositories.

Read [README.md](README.md) for the project overview and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution requirements. Confirm the Git root and working-tree state before editing. When inspecting a running preview, confirm which checkout serves it.

## Instructions by area

These instructions apply throughout the repository. Before auditing or changing an area, read its scoped `AGENTS.md`, even when starting at the repository root. Scoped instructions add area-specific requirements and take precedence over broader instructions within their directory. Direct task instructions take precedence over these files. For changes spanning areas, read each applicable file.

| Area | Instructions |
| --- | --- |
| Core styles, tokens, vanilla behavior, component contracts | [Core](packages/core/AGENTS.md) |
| React components, hooks, exports, development app | [React](packages/react/AGENTS.md) |
| SVG sources, icon font, metadata | [Icons](packages/icons/AGENTS.md) |
| Documentation content and Astro site | [Documentation](apps/docs/AGENTS.md) |
| Component stories and interaction examples | [Storybook](apps/storybook/AGENTS.md) |

Read the relevant public documentation and inspect the existing implementation, examples, and affected consumers before making audit recommendations or changes. Compare existing guidance before recommending another document. An audit is read-only unless changes are explicitly approved.

## Foundations reading map

Read the foundations relevant to the task. Use their examples and owning source to verify how the pieces fit together; surface discrepancies instead of assuming undocumented behavior.

| Decision | Read |
| --- | --- |
| Customization and style ownership | [Customization](apps/docs/src/content/docs/customization.mdx), [CSS layers](apps/docs/src/content/docs/layer.mdx) |
| Themes and related colors | [Color](apps/docs/src/content/docs/color.mdx) |
| Type, scale, and spacing | [Typography](apps/docs/src/content/docs/typography.mdx), [Spacing](apps/docs/src/content/docs/spacing.mdx) |
| Responsive layout | [Breakpoints](apps/docs/src/content/docs/breakpoint.mdx), [Grid](apps/docs/src/content/docs/grid.mdx), [Containers](apps/docs/src/content/docs/container.mdx), [Sizing](apps/docs/src/content/docs/sizing.mdx) |
| Design-to-code relationships and assets | [Figma](apps/docs/src/content/docs/figma.mdx), [Icons](apps/docs/src/content/docs/icon.mdx); verify actual library bindings when the task depends on them |
| Accessibility and interaction | [Accessibility](apps/docs/src/content/docs/accessibility.mdx) and the affected component's documentation |
| Build, release, and deployment | [Publishing](PUBLISHING.md), [GitHub workflows](.github/workflows/) |

## Setup and build commands

Use npm and the committed root lockfile. CI uses Node 22; check dependency engine requirements when selecting a local Node version. Run commands from the repository root unless a scoped file says otherwise. The root [package.json](package.json) contains the executable definitions.

| Task | Command |
| --- | --- |
| Install locked dependencies | `npm ci` |
| Start documentation | `npm run docs` |
| Start Storybook | `npm run storybook` |
| Start the Core development server | `npm run start:core` |
| Start the React development app | `npm run react-demo` |
| Build Core | `npm run build:core` |
| Build React | `npm run build:react` |
| Build Icons | `npm run build:icons` |
| Build documentation | `npm run build:docs` |
| Build Storybook | `npm run build-storybook` |

The root `npm run build` builds package workspaces with a `build` script; it does not replace the explicit Icons, documentation, and Storybook commands above.

## Code style and shared contracts

- Follow the surrounding file's language, indentation, naming, and module conventions. Keep formatting changes focused on the work at hand.
- Inspect existing components, utilities, tokens, and examples before adding implementation. Compose existing features where they fit; add or change shared behavior for a demonstrated need.
- Keep Core's classes, CSS custom properties, semantic markup, and accessibility behavior consistent across vanilla examples, React, documentation, and Storybook. Update affected examples and documentation when a public contract changes.
- Prefer native HTML. Do not add `aria-labelledby` merely to associate a visible heading with a section; use it only for a programmatic naming requirement native HTML does not meet.
- Preserve established typography, including Georgia wherever an existing component or token uses it. Reuse existing tokens and responsive utilities before introducing new values.
- Give each interactive element one behavior owner. Do not initialize both Core's vanilla behavior and a React or host-platform implementation on the same element.
- Keep application-specific customizations in the consuming application unless a framework change is part of the task. Load Core styles before application theme overrides. Check published package exports before documenting an import; internal monorepo aliases are not consumer APIs.

## Testing instructions

Before handing off, confirm the requested behavior or documentation is complete, review the diff for unintended changes, and run the relevant checks below. Report the changes, verification results, and any failed or skipped checks with their reasons. A build or automated accessibility check alone does not establish accessibility conformance.

| Change | Verification |
| --- | --- |
| Agent instructions or repository Markdown only | Check links, referenced paths and commands, scoped coverage, and `git diff --check`. A product build is unnecessary. |
| Core styles or behavior | `npm run build:core`, affected HTML and React examples, and the relevant scoped checks. |
| Theme colors | `npm run test:contrast` (also runs before the Core build). |
| React components or hooks | `npm run typecheck:react`, `npm run build:react`, and affected Storybook examples. |
| Icons | `npm run build:icons` and the checks in the Icons instructions. |
| Documentation content, examples, or site code | `npm run build:docs` (includes `check:docs-cdn`) and affected pages. |
| Stories, shared contracts, or Storybook configuration | `npm run typecheck:storybook`, `npm run build:core`, and `npm run build-storybook`. |
| Forced-color support | With Storybook running, run `npx playwright install chromium firefox` and `npm run test:forced-colors`. Check native Windows contrast themes before release. |

For behavior changes, verify keyboard operation, focus entry/return, state changes, and repeated interaction as applicable. For visual changes, check affected themes, responsive layouts, reduced motion, and forced colors where relevant. Add focused regression coverage for behavior changes when it can detect a real failure. There is no root `npm test` or `npm run lint` script; do not report them as available checks.

## Public contribution and security considerations

- Use a focused feature branch and pull request. Reuse the task's branch for related follow-ups, preserve unrelated work, and keep commits reviewable. Do not commit directly to `main` or force-push shared history as part of routine changes.
- Keep credentials, environment secrets, private client material, and machine-specific paths out of new public guidance, examples, commits, and PR descriptions. Instructions must work without a maintainer's private skills or accounts.
- Read [LICENSE.md](LICENSE.md) before adding or reusing content: software, documentation/media, and trademarks have different terms. The open source code license does not cover every repository asset.
- Publishing packages, pushing release tags, merging to `main`, and deploying require a task that includes those actions. Read [PUBLISHING.md](PUBLISHING.md) and the relevant workflow under `.github/workflows/` for release work. Readiness checks do not authorize a release; documentation-only changes do not require a package version bump.

## Keep context maintainable

Write READMEs for human readers: project purpose, installation, usage, and contributor onboarding. Keep agent-only directions, context-loading instructions, and agent workflows out of READMEs. Write `AGENTS.md` files as direct operational instructions for agents; link to human documentation for explanations instead of copying product introductions or tutorials into instruction files.

Use [GitHub Issues](https://github.com/Natura11y/root/issues) as the single backlog for bugs, proposals, and planned work; check for an existing issue before creating one. Read the relevant issue when the task needs it, and distinguish planned work from implemented behavior. Use [PUBLISHING.md](PUBLISHING.md) for releases.

Keep shared rules here and area-specific rules in the relevant scoped `AGENTS.md`, without duplicating them. Keep instructions short, concrete, and tied to repository constraints or recurring mistakes. Update or remove stale guidance when commands, paths, or conventions change. Link to detailed references instead of copying them into instruction files.

Add a file or workflow only when it serves a concrete design-system, contributor, or maintenance need. Prefer an existing authoritative location when it can serve the same purpose without making the workflow harder. Explain the purpose of new files in the change summary. Update the existing authoritative document instead of creating a handoff or checkpoint after every task. Date verification records and distinguish decisions, proposals, and historical evidence. Keep reusable workflows in `.agents/skills/`; use them when the task calls for them. Ordinary development does not require running a full design-system inspection.

When a task concerns a consuming application, follow that repository's instructions and check its installed Natura11y version. Do not apply this monorepo's build and release commands to a consuming application.
