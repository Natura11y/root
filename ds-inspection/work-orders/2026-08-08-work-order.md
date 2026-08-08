# Work Order — Natura11y

_From inspection: `reports/2026-08-08-inspection.md` · Written: 2026-08-08_

Reds get fixed now. Yellows get scheduled. Greens get left alone. Natura11y has no red stations in this inspection; the items below strengthen proof and synchronization without creating another token source, standalone token package, or unnecessary service dependency.

## 🔴 Fix now (reds)

No red stations.

## 🟡 Schedule (yellows)

### 1. ✅ Repair the Secondary status-color contract
- **Status:** Completed 2026-08-08. Core and the Hi-fi Figma library now use Secondary Confirm `#005E68`, Secondary Warn `#A21F20`, and the matrix-discovered Light Confirm correction `#007C35`.
- **Station:** 3, Accessibility · **Evidence:** [verified] Secondary Confirm is 1.07:1 and Secondary Warn is 1.28:1 against the Secondary background.
- **First move:** Retune the two correlated tokens and generate a small contrast matrix for text, link, confirm, and warn against all five theme backgrounds. · **Done when:** all intended text pairs meet 4.5:1 and non-text/status pairs meet 3:1, with an automated check that fails on regression. · **Effort:** S
- **Completion evidence:** 20/20 text, link, confirm, and warn pairs pass at 4.5:1 or better; the dependency-free check runs as Core's `prebuild`; post-write Figma inspection confirms the primitive values, Web syntax, and semantic aliases. The source-library fix is complete; downstream publication remains part of item 4.
- **Suggested timing:** before the next Core release

### 2. Turn on the test stack that is already installed
- **Station:** 5, Testing & validation · **Evidence:** [verified] both typechecks pass, but Vitest finds zero tests; Storybook Vitest, Playwright, Testing Library, coverage, Chromatic, and a11y tooling are already dependencies.
- **First move:** Configure Storybook/Vitest browser tests and a pull-request workflow; add behavior assertions for Accordion keyboard state, Modal focus/Escape/return focus, and Main Menu toggles. · **Done when:** PRs cannot merge with failing typecheck, behavior, or a11y assertions, and the existing 38 stories are executable test inputs. · **Effort:** M
- **Suggested timing:** this sprint / before more AI-generated component work

### 3. Close the Figma naming and Web-syntax gaps
- **Station:** 4, Shared language · **Evidence:** [verified] 46/139 variables lack Web syntax and the radio component exposes `Property 1` instead of `State`.
- **First move:** Label each missing entry as web-facing, derived, or Figma-only; add exact `var(--…)` syntax only to web-facing variables and rename the radio property. · **Done when:** every web-facing variable has exact Web syntax and intentional exceptions are documented. · **Effort:** S
- **Suggested timing:** before the next Hi-fi library publish

### 4. Publish the current component-library improvements
- **Station:** 1, Coverage & gaps; 6, Orchestration · **Evidence:** [verified] sampled published component sets report `CHANGED`, and Button design variants do not represent Core's Active/Disabled behavior.
- **First move:** Decide whether Active and Disabled are explicit Figma states or documented behavior-only exceptions, verify the recent Main Menu/Footer/description changes, and publish one reviewed library update. · **Done when:** sampled component sets report current/published status and the state decision is explicit. · **Effort:** S
- **Suggested timing:** when Figma credits/seat access permit normal publishing; no paid upgrade is required for this item

### 5. Add one read-only parity check—no new token source
- **Station:** 6, Orchestration · **Evidence:** [verified] Core is authoritative, but token/component sync is manual and the planned parity audit remains unchecked in `TODO.md`.
- **First move:** Implement the smallest proposed slice: compare Core color custom properties and aliases with the Hi-fi Color collections and Web syntax, then report differences without writing to either side. · **Done when:** a repeatable command returns no diff on a synchronized system and fails clearly on a known mismatch. · **Effort:** M
- **Suggested timing:** this quarter, after the contrast fix

### 6. Give agents one canonical route into the system
- **Station:** 9, Machine-readable context; 10, Agent access · **Evidence:** [verified] strong structured sources exist, but no repo AI index records the canonical library keys; Figma search returns several plausible lookalike libraries.
- **First move:** Add a generated `llms.txt` or equivalent short agent index that records the canonical repo, Hi-fi/Lo-fi library keys, source-of-truth order, docs/Storybook links, and required validation loop. · **Done when:** a fresh agent can retrieve the right library and build one rubric-scored composition without invented components, props, or tokens. · **Effort:** S–M
- **Suggested timing:** before the next landing-page generation test

### 7. Make the lightweight governance match the published policy
- **Station:** 7, Governance & version control · **Evidence:** [verified] `main` is unprotected, PR/issue templates are absent, and Icons/React releases lack the package-specific tags named by `PUBLISHING.md`.
- **First move:** Add a concise cross-surface PR checklist and create the missing package-specific tags/releases at the next package release; enable branch protection after item 2 provides a meaningful required check. · **Done when:** package releases follow the documented tag pattern and `main` requires the agreed PR check. · **Effort:** S
- **Suggested timing:** this quarter

### 8. Track active consumers without buying analytics
- **Station:** 8, Feedback & adoption · **Evidence:** [verified] downloads and at least two current package consumers are visible, but one is behind and embedded/legacy copies cannot be classified automatically.
- **First move:** Keep a small `CONSUMERS.md` ledger with project, integration type, package versions, active/archive status, and last verification date; optionally generate the version columns with a dependency scan. · **Done when:** the owner can name active consumers, stale versions, embedded forks, and archives in one view. · **Effort:** S
- **Suggested timing:** this quarter

## 🔧 Access upgrades (sharper next inspection)

- Record the direct Lo-fi source file key and canonical Hi-fi/Lo-fi library keys in the repository agent index. Search can discover both libraries, but only the Hi-fi source was directly inventoried this time.
- Keep Code Connect explicitly deferred unless a Dev/Full Figma seat is already justified by normal work. It is not necessary to fix the current contrast, testing, parity, or context issues.
- Confirm which local embedded/legacy Natura11y copies are active consumers versus archives so adoption findings stop mixing maintenance risk with historical evidence.

## 🟢 Keeping the greens green

- **Station 1 — Coverage:** run a quarterly three-column inventory and require real product demand before adding benchmark components.
- **Station 2 — Best practices:** keep the current component-by-component pattern—semantic code, Auto Layout/variables in Figma, and live example/anatomy docs—and sample it during each release.

## Cadence

- Re-inspect (deep, all stations): 2026-11-08
- Everyday checks to wire into CI now: Core/React/Storybook builds and typechecks; theme contrast; Storybook behavior and axe checks; docs coverage; Figma Web-syntax/token parity where the bridge is available.
- Owner of this work order: Carla Vidano · Review: triage at the next Natura11y release-planning pass, then revisit monthly until items 1–4 are closed.
