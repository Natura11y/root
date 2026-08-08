# Multi-Point Inspection Report — Natura11y

_Inspected: 2026-08-08 · Technician: Codex (GPT-5) · Previous inspection: first inspection_
_Vehicle profile: `ds-inspection/GARAGE.md` (checked in 2026-08-08)_

## The short version

Natura11y is already a real, broad, well-crafted design system: its strongest evidence is the semantic component code, unusually thorough documentation, current packages, and a substantial Figma library with machine-readable variables and component contracts. The main weakness is not another missing token format or package; it is the lack of automated proof that the three surfaces continue to behave and agree. The first practical initiative is to correct the Secondary status-color contrast problem, then activate the Storybook/Vitest/Playwright/a11y tooling that is already installed so regressions fail before release.

**Overall: 67/100** — a conversation starter, not a grade. Fix the reds, schedule the yellows, re-run on a cadence.

## Post-inspection remediation

- **2026-08-08:** Work-order item 1 was completed across Core and the Hi-fi Figma source library. Secondary Confirm now resolves to `#005E68` (5.03:1), Secondary Warn to `#A21F20` (5.11:1), and Light Confirm to `#007C35` (4.60:1). A dependency-free 20-pair theme contrast matrix now runs before every Core build.
- **2026-08-08:** A balanced Station 1 follow-up compared Natura11y with established systems in both directions. It prioritized [Button loading as GitHub issue #1](https://github.com/Natura11y/root/issues/1), classified the remaining catalog differences without treating them as automatic defects, and recorded Natura11y advantages that future work should protect. See `reports/2026-08-08-coverage-benchmark.md`.
- **2026-08-08:** A fresh Station 2 reinspection kept Best Practices green at 9/10. It completed the remaining Figma naming and variable-scope cleanup, strengthened RTL/accessibility documentation cross-links, and opened [issue #2](https://github.com/Natura11y/root/issues/2) and [issue #3](https://github.com/Natura11y/root/issues/3) for the two behavioral engineering gaps. See `reports/2026-08-08-best-practices-reinspection.md`.
- **2026-08-08:** A Station 3 reinspection moved Accessibility from 6/10 to 8/10. It verified the corrected 20-pair contrast matrix, repaired Lightbox and Form Entry accessibility drift across Core/React/docs, ran browser-level checks, and opened [issue #4](https://github.com/Natura11y/root/issues/4) for repeatable behavioral and manual accessibility proof. See `reports/2026-08-08-accessibility-reinspection.md`.
- The active inspection sheet incorporates completed evidence-based station reinspections; it is not a release version number.

## Inspection sheet

|  # | Station                         | Quality      | Light |      Score |
|---:|:--------------------------------|:-------------|:-----:|-----------:|
|  1 | Coverage & gaps                 | Complete     |  🟢   |       8/10 |
|  2 | Best practices                  | Sound        |  🟢   |       9/10 |
|  3 | Accessibility                   | Sound        |  🟢   |       8/10 |
|  4 | Shared language                 | Sound        |  🟡   |       7/10 |
|  5 | Testing & validation            | Sound        |  🟡   |       4/10 |
|  6 | Orchestration                   | Synchronized |  🟡   |       7/10 |
|  7 | Governance & version control    | Extensible   |  🟡   |       6/10 |
|  8 | Feedback & adoption             | Extensible   |  🟡   |       5/10 |
|  9 | Machine-readable docs & context | AI-Ready     |  🟡   |       7/10 |
| 10 | Agent access                    | AI-Ready     |  🟡   |       6/10 |
|    | **Overall**                     |              |       | **67/100** |

**Lights:** 🟢 3 green · 🟡 7 yellow · 🔴 0 red · 0 not inspected

**Key:** 🔴 Red (0–3) — broken or missing; the light is ON · 🟡 Yellow (4–7) — drift or gaps; schedule a fix · 🟢 Green (8–10) — healthy, no action needed · **N/I** — not inspected (no evidence access; never guessed)

## Evidence basis

- Access used this pass: live canonical repository and Git history; local Astro docs and Storybook sources; public npm and GitHub metadata; live Figma source-file inspection and design-system search; reported outcomes from recent AI/Figma work.
- Findings: 51 `[verified]` from directly inspected evidence and 5 `[reported]` from consumer context or the user's direct assessment of prior AI output.
- Design-side claims are scoped to the Hi-fi file and the explicitly named pages/components. The published Lo-fi library was discoverable but its source file was not directly inventoried.

## Station records

### Station 1 — Coverage & gaps: GREEN (8/10)
- Inventory: 288 Figma component variant masters grouped into 158 reusable assets, including 104 icons · 44 Core Sass partials, 13 top-level interactive JavaScript modules, and 20 React component domains · 46 Astro documentation pages and 38 Storybook story topics. Sampled design contracts: Typography, Iconography, Accordion, Alert, Button, Global Footer, Main Menu, Form, and Table.
- Evidence level: design library live · code live · docs live · public distribution live.
- Findings:
  - [verified] The core set is broad and balanced across design, code, and docs: button, link, form controls and validation, card, table, modal, tabs, accordion, alert, badge, pagination, breadcrumb, navigation, dropdown/flyout, and responsive main menu are all represented.
  - [verified] Relative to [Carbon's current component inventory](https://carbondesignsystem.com/components/overview/components/), the notable candidates are specialized product controls and patterns—combobox/multiselect, date picker, tree view, progress/loading, tooltip/toggletip, and formal empty states. These are benchmark inputs, not automatic Natura11y defects.
  - [verified] Figma Button variants expose Default, Hover, and Focus, while Core also styles `:active` and `[aria-disabled="true"]`. The state contract is therefore not fully represented in the component variants.
  - [verified] Button and Form spot checks showed high—but not total—variable binding: Button had 347/351 solid paint uses and 118/119 auto-layout containers bound; Form had 232/250 solid paint uses and 112/158 auto-layout containers bound. A deliberate hardcode-versus-token review is still warranted before calling parity complete.
  - [verified] Sampled Figma component sets have published keys, but their publish status is `CHANGED`, so the newest source-file improvements are not yet in the published library.
  - [verified] Core 5.2.4, Icons 2.3.0, and React 1.0.0-beta.1 are versioned public npm artifacts and match the inspected workspace versions.
- Not inspected: a product-needs interview or screenshot inventory; every state of every component; direct source-file coverage in the Lo-fi kit.
- Deviations noted: Global Footer is an example composition; heading/paragraph blocks are Figma-only authoring helpers; specialized controls should be added only when product demand justifies them.
- First move: reconcile the Button Active/Disabled representation, then publish the already-changed Hi-fi library assets.

### Station 2 — Best practices: GREEN (9/10)
- Sampled: Figma Accordion, Button, Form, Main Menu, and Modal pages; React Button, Form Entry, Alert, Main Menu, Modal, Flyout, Accordion, and Tabs; Button, Form, Accessibility, RTL, and Customization docs.
- Evidence level: design live · code live · docs live.
- Findings:
  - [verified] Sampled Figma variants use Auto Layout at their reusable roots, attached instances, purposeful layer names, real properties, and variable bindings. Accordion and Main Menu had no absolute-positioned descendants; no missing main-component references were found.
  - [verified] Figma drift is minor and local: the low-level radio set uses `Property 1` instead of `State`, and Textarea contains repeated `Group 1`/`Line 5` decorative layer names.
  - [verified] The React samples use semantic elements (`button`, `form`, `label`, `fieldset`, `legend`, `nav`, `table`) and browser-native controls, with focused hooks for controlled state, focus trapping, scroll locking, and keyboard navigation.
  - [verified] Core styles are variable-driven, fluid, layered, and predominantly use logical properties. Physical-direction utilities remain for backward-compatible utility names and explicitly documented RTL behavior rather than hidden component assumptions.
  - [verified] Component docs combine purpose, live examples, exact markup, line-by-line anatomy, accessibility notes, related custom properties, and cross-links. They serve both implementers and designers better than an API-only reference would.
- Not inspected: every detached-instance possibility in every Figma page; visual QA at all responsive widths; external consumer code quality.
- Deviations noted: some absolute positioning is appropriate for focus outlines, decorative resizer marks, and control indicators; it was not counted as a fault automatically.
- First move: clean the small Figma naming residue and classify the remaining unbound values as intentional or token candidates.

### Station 3 — Accessibility: GREEN (8/10)
- Sampled: React/Core Accordion, Tabs, Modal, Main Menu, Flyout, Lightbox, Form Entry, Alert, Track, focus utilities, reduced-motion styles, all five theme groups, component/docs accessibility guidance, and nine representative Hi-fi Figma pages.
- Evidence level: design live · code live · docs live · token ratios computed from authoritative Core Sass · built Storybook browser verification live.
- Findings:
  - [verified] Interactive samples implement strong fundamentals: native controls; synchronized ARIA state; inert hidden panels; arrow-key navigation; focus traps; Escape behavior; initial/return focus; live regions; visible focus; reduced-motion handling; and 40px-or-larger button targets.
  - [verified] All 20 text, link, confirm, and warn theme pairs now pass the 4.5:1 contrast matrix, which runs before every Core build.
  - [verified] Sampled Figma descriptions encode semantic elements, accessible names, ARIA relationships, focus requirements, keyboard behavior, validation associations, and color-independent meaning.
  - [verified] This pass corrected Lightbox dialog/focus/control-name/image-alt drift across Core and React, and added programmatic invalid state to React Form Entry. Browser verification confirmed the repaired contracts.
  - [verified] The Storybook a11y addon remains configured with `test: 'todo'`, the GitHub workflow does not run accessibility assertions, and no committed behavioral accessibility tests or manual assistive-technology matrix were found. This is tracked in [issue #4](https://github.com/Natura11y/root/issues/4).
- Not inspected: manual VoiceOver/NVDA behavior, forced-colors/high-contrast mode, zoom/reflow at 200–400%, touch-device testing, or a legal/accessibility audit history.
- Deviations noted: a design-system component is a strong foundation, not a guarantee that every downstream composition is accessible.
- First move: implement the bounded automated and manual proof plan in issue #4 when Station 5 testing work is prioritized.

### Station 4 — Shared language: YELLOW (7/10)
- Swept: all React `*Props` interfaces/type literals, all Core Sass custom-property declarations, all 139 local Figma variables, and five cross-asset component traces (Button, Accordion, Alert, Form, Main Menu).
- Evidence level: design live · code live · docs live.
- Findings:
  - [verified] The public React API consistently uses recurring concepts such as `utilities`, `iconHandle`, `ariaLabel`, `onClose`, `isOpen`, `breakpoint`, and controlled/uncontrolled state pairs.
  - [verified] Core token names follow readable kebab-case roles grouped by feature; Figma variables add human-readable collection paths while their Web syntax maps back to exact CSS custom properties.
  - [verified] Web syntax exists on 93/139 Figma variables. The 46 missing entries include five border-radius variables and 39 component variables; some are Figma-only/derived, but the current file does not encode that distinction.
  - [verified] Cross-format mappings are explained rather than forced into false one-to-one APIs: Figma `Viewport` is identified as a preview control; Main Menu `Variant` maps to React `variant`; Form `Status` maps to invalid behavior; design `Size` often maps to Core utilities rather than React props.
  - [verified] The low-level radio component's `Property 1` name is inconsistent with Checkbox and ToggleSwitch `State`, and no naming/parity validator catches this kind of drift.
- Not inspected: consumer-authored wrappers and aliases; direct Hi-fi ↔ Lo-fi naming parity.
- Deviations noted: different casing or separators between Figma, CSS/BEM, React, and prose are format conventions, not inconsistencies when the semantic mapping is explicit.
- First move: classify the 46 missing Web-syntax variables as web-facing or Figma-only, add exact syntax to the former, and rename radio `Property 1` to `State`.

### Station 5 — Testing & validation: YELLOW (4/10)
- Inspected: root scripts and dependencies, Storybook configuration and 38 stories, GitHub Pages workflow, repository test-file inventory, live React/Storybook typechecks, and a live Vitest run.
- Evidence level: repo and command execution live.
- Findings:
  - [verified] `npm run typecheck:react` and `npm run typecheck:storybook` both pass.
  - [verified] `npm exec vitest -- run` reports `No test files found` and exits 1. There are no unit, behavior, integration, or screenshot test files in the inspected source tree.
  - [verified] The only GitHub Actions workflow runs on pushes to `main` and manual dispatch, not pull requests. It typechecks Storybook and builds Core/Storybook, but it does not execute Vitest, axe, keyboard assertions, or Docs/React builds.
  - [verified] Storybook Vitest, Playwright, Testing Library, coverage, Chromatic, and the a11y addon are already installed. The gap is activation and meaningful assertions, not dependency acquisition.
  - [verified] No deterministic Figma lint/parity check, visual-regression workflow, or rubric/eval for AI-generated output was found.
- Not inspected: private external CI, manual pre-release checklists not stored in the repo, Chromatic account/project state.
- Deviations noted: Storybook stories are valuable executable examples, but a build succeeding does not assert their behavior or accessibility.
- First move: configure the existing Storybook/Vitest browser stack, add a pull-request workflow, and start with keyboard/state tests for Accordion, Modal, and Main Menu.

### Station 6 — Orchestration: YELLOW (7/10)
- Diffed: Button, Accordion, Alert, Form, and Main Menu across Figma contracts, Core/React code, docs, and Storybook; Core/Figma token naming; workspace versus published npm versions.
- Evidence level: design live · code/docs live · npm live · workflow partially reported.
- Findings:
  - [verified] Sampled components trace cleanly in purpose and semantics. Storybook explicitly places production-shaped HTML and React examples side by side, and Figma descriptions explain how visual controls map to production APIs.
  - [verified] The public npm versions exactly match the workspace: Core 5.2.4, Icons 2.3.0, React 1.0.0-beta.1.
  - [verified] Core Sass is explicitly authoritative and Figma preserves Web syntax for all color variables and most other foundations, avoiding a competing token source of truth.
  - [verified] The pipeline remains manual: 46 variables lack Web syntax, sampled Figma assets are changed-but-unpublished, and `TODO.md` lists the parity manifest/audit/sync as future work.
  - [verified] Code Connect inventory is unavailable on the current Figma seat, and no repository Code Connect mappings or other automated drift signal exist.
  - [reported] Recent component work was deliberately reconciled against source documentation and production examples, but the flow depends on Carla and the assisting agent remembering to inspect all three surfaces.
- Not inspected: direct Lo-fi source-file diff; visual screenshot comparison between every Figma variant and rendered code; mobile/native platforms beyond web.
- Deviations noted: a manual code-authoritative pipeline is valid for a small team; automation should detect drift before it attempts write-back.
- First move: implement the planned read-only `audit:figma-parity` slice for Core color tokens and one component contract; do not introduce DTCG or automatic write-back.

### Station 7 — Governance & version control: YELLOW (6/10)
- Inspected: root and package contribution guidance, publishing policy, package changelogs, git tags/history, public releases/npm versions, GitHub issue/PR inventory, Actions workflow, and `main` branch policy.
- Evidence level: repo live · GitHub app/CLI live · npm live.
- Findings:
  - [verified] `PUBLISHING.md` clearly defines the canonical source, licensing boundary, dependency-ordered releases, independent package versioning, verification commands, tag format, and distribution map.
  - [verified] Package changelogs are current and informative; Core releases 5.2.3 and 5.2.4 have matching GitHub releases and package-specific tags.
  - [verified] Icons 2.3.0 and React 1.0.0-beta.1 are published, but matching `icons-v…` and `react-v…` tags/releases are absent despite the documented package-specific tag policy.
  - [verified] `main` is not protected. The single workflow runs after push to `main`, so it cannot block a breaking change before merge.
  - [verified] The public repository has issues enabled but no issues or pull requests; tracker staleness is zero, but contribution/triage health cannot yet be demonstrated.
  - [verified] `CONTRIBUTING.md` is intentionally brief, and no PR template, issue template, CODEOWNERS file, deprecation process, or formal component definition-of-done was found.
  - [verified] Git history shows one primary contributor, so ownership is clear in practice but creates a bus-factor and review-independence limit.
- Not inspected: repository rulesets not exposed as branch protection, private support channels, or undocumented release rituals.
- Deviations noted: a solo maintainer does not need enterprise committee ceremony; the goal is a small, real checklist that protects future Carla and outside contributors.
- First move: add a concise PR template spanning code/design/docs/a11y/tests/changelog, then protect `main` once a meaningful PR check exists.

### Station 8 — Feedback & adoption: YELLOW (5/10)
- Measured: public package downloads, GitHub community signals, package dependencies across local consumer repos, and recent system-planning evidence.
- Evidence level: npm/GitHub live · local consumer scan live · feedback loop partly reported.
- Findings:
  - [verified] From 2026-07-08 through 2026-08-06, npm reports 905 Core downloads, 540 Icons downloads, and 367 React downloads. This proves distribution activity but not unique teams or successful adoption.
  - [verified] The local scan found at least two clear current-package consumers: `aaif-cuny` is on Core 5.2.4/Icons 2.3.0, while `carl-avidano-ux` remains on Core 5.2.1/Icons 2.2.1.
  - [verified] Several older or embedded Natura11y copies also exist locally. Their active/archival status is not encoded, so a scan cannot distinguish legitimate legacy archives from at-risk forks without owner context.
  - [verified] GitHub has no issues, pull requests, discussions, stars, or forks yet. Because the canonical public repo was created in July 2026, this is insufficient evidence of failure or a healthy external feedback loop.
  - [reported] Carla actively feeds project findings back into Natura11y; the AAARI practice work became the detailed parity plan in `TODO.md`, and recent Figma maintenance responded to concrete component/use-case gaps.
  - [reported] Exact active consumer count, project criticality, support themes, and upgrade tolerance are not maintained in a single inventory.
- Not inspected: Figma library analytics/detach rates, CDN traffic, private client repositories outside the local workspace, or stakeholder interviews.
- Deviations noted: for an owner-led system, a small consumer/version ledger is more useful than an analytics platform.
- First move: create a lightweight active-consumer registry and version scan so current, stale, embedded, and archived integrations are distinguishable.

### Station 9 — Machine-readable docs & context: YELLOW (7/10)
- Inventoried: CSS custom properties, typed React APIs, package exports/declarations, Figma variables/code syntax, Figma component descriptions, Storybook metadata, Astro content schema/MDX, icon data, and AI-facing repository files. · Generation test: prior live page-generation attempt reviewed by the user; result was not acceptable.
- Evidence level: formats live · prior output quality reported.
- Findings:
  - [verified] The raw materials are unusually machine-friendly: authoritative CSS variables, TypeScript prop types, structured package exports, 139 Figma variables, Storybook metadata, parseable MDX frontmatter/sections, and generated icon data.
  - [verified] Sampled Figma descriptions encode purpose, composition, HTML semantics, ARIA relationships, responsive behavior, and explicit visual-versus-code distinctions. These are genuine component contracts, not decorative descriptions.
  - [verified] There is no repository `AGENTS.md`, `llms.txt`, Code Connect file, component schema/manifest, or generated index that tells an agent which sources to read and in what order.
  - [verified] Only 93/139 Figma variables expose Web syntax, so machine handoff is strong but incomplete.
  - [reported] The previous Paws & Promise landing-page generation was judged "not good at all" even though the agent could reach the library. That is direct evidence that ingredient access did not provide enough composition guidance or validation.
- Not inspected: a new no-write generation benchmark against a fixed rubric; external agents other than the current Codex/Figma setup.
- Deviations noted: DTCG is not required for machine readability here. If explored, it should remain a generated comparison artifact rather than another package/source of truth.
- First move: publish one generated AI index that points to the canonical repo, component docs, Storybook, Figma libraries, and source-of-truth rules without duplicating their content.

### Station 10 — Agent access: YELLOW (6/10)
- Surfaces mapped: canonical filesystem repo, public docs/npm/GitHub, live Figma source inspection, Figma design-system search, installed inspection workflow. · Live test: query succeeded; prior bounded maintenance succeeded; prior full-page generation did not.
- Evidence level: access surfaces live · output quality reported.
- Findings:
  - [verified] Figma design-system search can retrieve Natura11y Hi-fi components, variables, and styles by key; direct file inspection can read pages, variants, descriptions, bindings, variables, and publish state.
  - [verified] The same search also returns similarly named Natura11y Lo-fi, Avidano Digital, MCP A11y, Visionlearning, and older libraries. Without a canonical library key in agent context, a plausible wrong import is easy.
  - [verified] Code Connect is blocked by the current Figma seat and no equivalent design-to-code mapping exists in the repo.
  - [verified] Codex can reach the canonical repo, GitHub, public docs, npm, and the Figma library in the same task, which is sufficient for evidence-based maintenance and parity work.
  - [reported] Bounded component-library tasks—descriptions, states, responsive Main Menu, and responsive Global Footer—were accepted as correct, while greenfield landing-page composition was not. The reliable workflow is currently maintenance/reconciliation, not autonomous art direction.
  - [verified] No onboarding page documents canonical library keys, the recommended agent retrieval order, or a repeatable generate → inspect → screenshot → correct acceptance loop.
- Not inspected: Claude Code, Cursor, Copilot, or multi-user team integrations; whether a paid Figma seat upgrade would materially improve outcomes.
- Deviations noted: Code Connect is helpful but not required for Natura11y to be AI-ready, and this inspection does not recommend spending more merely to improve the score.
- First move: encode the canonical Hi-fi/Lo-fi library keys and the component-first validation workflow in repository agent context, then rerun one small page benchmark with a fixed rubric.

## Next service

- Work order: `ds-inspection/work-orders/2026-08-08-work-order.md`
- Recommended cadence: deep inspection quarterly; everyday checks to wire into CI: Stations 1–6—docs/coverage, craft/typechecks, contrast/a11y, naming/token syntax, behavior/visual tests, and parity drift.
- Re-inspect by: 2026-11-08
