# GARAGE.md — Natura11y
_Checked in: 2026-08-08 · Re-confirm at next inspection_

## Vehicle
- System: Natura11y, an accessible design ecosystem serving Carla Vidano's projects and public consumers of the `@natura11y/*` packages.
- Team: one primary maintainer is verified in repository history; the system is maintained as a small-team/owner-led practice rather than by a dedicated platform organization. · Consumers: multiple properties are reported, but an exact team/property count is not currently evidenced.
- Age: development history begins 2020-11-13. The current canonical form is a coordinated monorepo with Core 5.x, Icons 2.x, a React 1.0 beta, an Astro documentation app, and Storybook; the exact migration date into this structure was not reconstructed in intake.
- Reason for service: assess enterprise-level sturdiness and AI readiness, identify gaps between code, documentation, and Figma, and produce evidence that distinguishes genuine weaknesses from unnecessary new machinery.

## Service log
- 2026-08-08: Closed the first Accessibility work-order item holistically. Updated Secondary Confirm/Warn and the borderline Light Confirm token in Core and the Hi-fi Figma library, preserved semantic aliases and Web syntax, and added a five-theme contrast regression check to Core's prebuild.
- 2026-08-08: Ran a balanced Station 1 benchmark against established systems. Recorded both candidate gaps and Natura11y advantages, classified catalog differences by demonstrated consumer need, and opened GitHub issue #1 for a first-class Button loading state across Core, React, Docs, Storybook, and Figma.

## Assets
- Design library: live Natura11y Hi-fi UI Kit in Figma (`ay1pEztl6oK8jlXmEtMAO7`), organized into 32 pages covering foundations, components, examples, and annotations. It has 7 local variable collections with 139 variables, five color-theme modes, 31 local text styles, 4 paint styles, and 4 effect styles. The published Natura11y Lo-fi UI Kit was discoverable through design-system search, but its source file was not directly probed in this inspection.
- Code library: canonical monorepo at `/Users/carlavidano/Sites/natura11y`, distributed as `@natura11y/core`, `@natura11y/icons`, and `@natura11y/react`. Core Sass/CSS custom properties are the token authority; there is no separate Style Dictionary or DTCG source of truth.
- Docs: 46 local Astro documentation pages in `apps/docs`, published at `https://gonatura11y.com`, plus 38 Storybook story files and their production-shaped HTML examples.
- Process: GitHub repository and issue tracker, root `CONTRIBUTING.md`, `PUBLISHING.md`, package changelogs, and `TODO.md`. No dedicated support channel, product-team intake process, or adoption reporting surface was evidenced during intake.
- AI surface: live Figma MCP/plugin access, detailed Figma component descriptions and properties, explicit component-contract/parity rules in `TODO.md`, and the installed inspection skills under `.agents/skills`. No repository `llms.txt`, Code Connect source files, or machine-readable parity manifest was found. Figma's Code Connect inventory endpoint is unavailable on the current seat.

## Evidence access map
| Asset | Access | Verified how |
|---|---|---|
| Design library | live | Figma calls returned the actual Hi-fi UI Kit, its page list, variables/styles, and component APIs. Design-system search also returned the published Hi-fi and Lo-fi libraries, but only the Hi-fi source file was directly inventoried. |
| Code library | live | Read the canonical monorepo's root guidance, package metadata, source inventories, Git history, build configuration, and workflow files. |
| Docs | live | Read the local Astro and Storybook sources; public URLs are recorded by the repository. |
| Process | live, limited | Read contribution, publishing, changelog, TODO, Git history, and GitHub workflow evidence. No support/adoption channel was supplied. |

## Known symptoms
- Code/Figma parity is thoughtfully specified but not yet automated: the parity manifest, repeatable audit, and idempotent synchronization commands remain planned work.
- The Hi-fi file is live. The Lo-fi library is discoverable, but direct source-file comparison could not be completed because its current file key was not part of intake.
- Figma component descriptions are strong in the sampled complex components, while the 104 standalone icons have empty descriptions and no properties. The inspection should determine whether centralized icon guidance is preferable to 104 repetitive descriptions.
- Code Connect cannot currently be inventoried or managed through the connected Figma account because that endpoint requires a Dev or Full seat on an Organization or Enterprise plan.
- Figma design-system search returns several similarly named historical or project libraries alongside the canonical Natura11y libraries. Agents need the canonical library keys recorded so they do not import a lookalike by mistake.
- Recent work has concentrated on making component contracts explicit in Figma, including button states, responsive Main Menu variants, and a responsive example Global Footer.

## Probable greens
- The monorepo explicitly defines one source of truth and coordinates Core, Icons, React, documentation, and Storybook distributions.
- Accessibility semantics are built into the component model. Sampled Figma component descriptions name expected elements, ARIA relationships, keyboard/focus requirements, and the distinction between visual representation and production behavior.
- Figma foundations are substantial: 139 local variables span color tokens/themes, typography, spacing, border, container, and component concerns.
- The public implementation surface is broad: 44 Core Sass partials, 18 Core JavaScript modules/utilities, 20 React component entry points, 104 optimized icons, 46 documentation pages, and 38 Storybook stories.

## Intentional deviations
- Production code is authoritative for semantics, accessibility behavior, JavaScript behavior, component contracts, token names, and token values. Figma is authoritative for the visual authoring experience only where it does not conflict with production semantics.
- Figma heading and paragraph components are intentionally Figma-only prose/layout helpers, not production component APIs.
- The Global Footer is intentionally an example composition rather than a dedicated Natura11y Core component.
- `Viewport` variants in responsive Figma components are preview controls, not production props.
- DTCG remains deferred research. If adopted, it is intended as a generated interchange artifact, not a second token package or source of truth.
- Individual icon properties are not presumed necessary. The inspection should recommend per-icon descriptions only where they add meaning beyond a clear name and centralized accessible-icon guidance.

## Scope & frame
- Stations this pass: all 10. · Scoring frame: small team / owner-led design-system practice.
- Out of scope: making corrective code or Figma changes, evaluating the paused Figma Make kit, and claiming parity with the lo-fi library without live evidence.
