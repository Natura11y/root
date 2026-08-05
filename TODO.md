# Natura11y TODO

## Figma and Front-End Parity

This section records the design-system synchronization workflow explored in the
AAARI project on August 3, 2026. AAARI is the practice environment; the intended
next step is to apply the proven workflow to Natura11y's canonical hi-fi Figma
library, lo-fi Figma library, and front end.

The goal is not simply to make three representations look alike. The goal is to
give them a shared, inspectable component contract so designers, developers,
and AI tools can understand how a visual decision maps to production code.

### Terminology

The working term for the information tied to a component is its **design-system
context** or **component contract**. In Figma, that context is distributed
across:

- Variable bindings for color, spacing, sizing, radius, and typography
- Variable aliases and modes for themes
- Web code syntax such as `var(--form-entry-border-color)`
- Component variants for size, state, style, and orientation
- Component properties for text, booleans, instance swaps, and slots
- Auto Layout and responsive structure
- Code Connect mappings to production implementations
- Component descriptions, documentation links, and accessibility guidance

Within Natura11y, a **token** means a root CSS custom property defined by the
relevant Sass partial.

### Source-of-truth rules

- The canonical code source is this monorepo, especially `packages/core`.
- Production code is authoritative for semantic HTML, accessibility behavior,
  JavaScript behavior, component contracts, token names, and token values.
- Figma is authoritative for visual representation and the design authoring
  experience when it does not conflict with production semantics.
- Token synchronization must preserve aliases and intent, not merely copy
  resolved hex values.
- A Figma `currentColor` equivalent should normally alias the applicable theme
  text variable so it continues to respond to theme modes.
- Every Figma variable intended for web handoff should use the exact production
  custom property as Web syntax, including the `var()` wrapper.
- Project-specific experiments must not silently become Natura11y Core
  behavior. They require an explicit framework decision first.
- Framework files and project overrides must remain distinguishable. A project
  customization belongs to that project until it is intentionally adopted by
  Natura11y.

### What the AAARI practice run proved

- Front-end Sass can be treated as the source for synchronizing Figma variables.
- Principal, correlated, and semantic theme variables can retain their alias
  structure across Canvas, Light, Dark, Primary, and Secondary modes.
- Project-specific per-theme subtle-fill colors can be represented as source
  tokens and exposed through a semantic theme variable.
- Figma Dev Mode can show the real Natura11y-style CSS custom property when Web
  code syntax is attached to each variable.
- Existing Figma components can be repaired by rebinding their visual
  properties instead of recreating them.
- `--form-entry-border-color: currentColor` can be represented in Figma as a
  component token aliased to the semantic theme Text variable. This corrected
  the header Search border while keeping all theme modes intact.
- The same form-entry border token can consistently serve valid Input, Select,
  Textarea, and Search variants while invalid variants retain the Warn token.
- Structural validation, alias validation, and screenshots can verify changes
  before considering a sync complete.

The AAARI per-theme subtle-fill system is a project-specific extension. It is a
useful candidate for evaluation, but it is not automatically a Natura11y Core
requirement.

### Proposed parity model

Maintain parity among three connected representations:

1. Natura11y production code
2. Natura11y hi-fi Figma library
3. Natura11y lo-fi Figma library

The hi-fi and lo-fi libraries should share the same component API whenever
possible. Their visual treatments may differ, but their variants, editable
properties, slots, semantic token bindings, and code relationships should remain
compatible.

For example, if a component exists in hi-fi but is missing from lo-fi, an AI
workflow should be able to:

1. Inspect the production component contract and the hi-fi component.
2. Identify the established lo-fi visual conventions.
3. Create the missing lo-fi component with the correct Auto Layout.
4. Reproduce the compatible variants and component properties.
5. Bind all visual properties to the appropriate Natura11y variables.
6. Add Web code syntax and Code Connect context where applicable.
7. Add descriptions and accessibility guidance.
8. Validate structure, bindings, variants, and screenshots.

### Proposed parity audit

Create a repeatable audit that inventories code, hi-fi Figma, and lo-fi Figma,
then reports differences without making silent changes.

The audit should detect:

- Tokens missing from either Figma library
- Figma-only tokens with no production counterpart
- Incorrect token values or aliases
- Missing or incorrect Web code syntax
- Broken aliases or stale external variable references
- Hardcoded component fills, strokes, spacing, or radii
- Components missing from hi-fi, lo-fi, or production examples
- Missing component variants or mismatched variant names
- Mismatched component properties, slots, or instance-swap APIs
- Production states that are absent from Figma
- Figma states that have no production implementation
- Missing Code Connect mappings
- Accessibility behavior in code that lacks Figma documentation

The default workflow should be **audit first, review the report, then apply an
approved synchronization**. Code-versus-Figma conflicts must be surfaced rather
than silently resolved.

### Automation foundation

- [ ] Define a machine-readable parity manifest for tokens and component
      contracts.
- [ ] Record the canonical hi-fi and lo-fi Figma file keys and ownership model.
- [ ] Define the intentional visual differences between hi-fi and lo-fi.
- [ ] Extract CSS custom properties and alias relationships from Core Sass.
- [ ] Inventory Figma collections, modes, variables, aliases, scopes, and code
      syntax.
- [ ] Inventory Figma component sets, variants, properties, slots, and variable
      bindings.
- [ ] Inventory the corresponding Core markup, JavaScript behavior, React APIs,
      documentation, and examples.
- [ ] Produce a dry-run parity report with proposed changes.
- [ ] Make synchronization idempotent so rerunning it does not create duplicate
      variables or components.
- [ ] Preserve stable Figma identities through node IDs, names, and controlled
      metadata where appropriate.
- [ ] Validate every applied change structurally and visually.
- [ ] Decide whether synchronization runs manually, through an MCP-assisted
      workflow, or as a repository command.

Possible future commands, names not yet committed:

```text
npm run audit:figma-parity
npm run sync:figma-tokens
npm run sync:figma-components
```

### Suggested first Natura11y implementation slice

- [ ] Audit the canonical Natura11y color variables against `_color.scss`.
- [ ] Add exact Web code syntax to the color variables.
- [ ] Verify theme modes and semantic alias chains.
- [ ] Audit Form Entry and Search against `_form.scss` and `_main-menu.scss`.
- [ ] Add or verify `--form-entry-border-color` as a component-level Figma
      variable aliased to theme Text.
- [ ] Compare the same component contracts in hi-fi and lo-fi.
- [ ] Generate a parity report before applying any component creation.

This initial slice is intentionally small enough to verify the complete workflow
before expanding to every Natura11y component.

### Open decisions

- [ ] Decide whether per-theme subtle-fill colors should remain project-specific
      or become a proposed Core feature.
- [ ] Define which representation wins when a visual-only Figma decision is not
      yet represented in code.
- [ ] Decide how Figma variable scopes should be normalized without disrupting
      existing design workflows.
- [ ] Decide whether Code Connect maps to Core HTML examples, React components,
      Storybook stories, or a combination of these surfaces.
- [ ] Define how accessibility semantics and behavior should be documented in
      Figma when Figma cannot execute the production behavior.
- [ ] Define the review and approval boundary for AI-authored Figma changes.

### Completion criteria

The parity system is ready for routine use when:

- Every supported production token has a deliberate Figma representation.
- All web-facing Figma variables expose exact production code syntax.
- Theme and component aliases resolve without stale references.
- Hi-fi and lo-fi component APIs are compatible unless a documented exception
  explains why they differ.
- Component visual properties use tokens rather than unexplained hardcoded
  values.
- Production behavior and accessibility requirements are linked or documented.
- The audit can be rerun safely and produces no changes when all three
  representations are already synchronized.
