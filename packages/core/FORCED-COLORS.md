# Forced colors

Natura11y lets the browser apply the user's contrast palette. Core adds targeted support where that process removes a component boundary, obscures a selected state, or changes an arrow's shape. HTML and React components use the same Core styles.

## Shared border

[_assistive.scss](src/scss/_assistive.scss) defines the shared property:

```scss
// Forced color mode support
--forced-color-border: var(--border-width) solid CanvasText;
```

Use it inside the owning component's forced-color query:

```scss
.component {
    // Regular component styles and nested rules go here.

    // Forced color mode support
    @media (forced-colors: active) {
        border: var(--forced-color-border);
    }
}
```

Use a directional border when only one edge needs separation. Flyout, for example, uses `border-inline-start`. Keep outlines available for keyboard focus.

The generic border-color rules in [_color.scss](src/scss/_color.scss) and [_border.scss](src/scss/_border.scss) use `revert-layer` in forced colors so they do not replace the component's border color. This also covers components with border-radius utilities. Explicit border utilities and application overrides still participate in the cascade; test those combinations when customizing.

Override the property at the root or on a containing element to change shared boundary width, style, and system color together. This does not replace every existing border in Core: form fields, navigation dividers, tables, and other existing borders retain their own component properties.

## Component support

| Location | Treatment |
| --- | --- |
| [_button.scss](src/scss/_button.scss), [_alert.scss](src/scss/_alert.scss), [_accordion.scss](src/scss/_accordion.scss), [_modal.scss](src/scss/_modal.scss) | Shared boundary border. Accordion keeps its focus outline inset from the border. |
| [_flyout.scss](src/scss/_flyout.scss) | Border on the exposed inline-start edge. |
| [_dropdown.scss](src/scss/_dropdown.scss) | Dropdown and mega menu panel borders; contextual arrow colors. |
| [_tab.scss](src/scss/_tab.scss) | Frame around `.tabs`; classic button dividers and active bar; bottom border under inactive horizontal tabs; selected pill uses `Highlight` and `HighlightText`. |
| [_caret.scss](src/scss/_caret.scss) | Shared triangle geometry for dropdowns, breadcrumbs, and selects. Transparent sides remain transparent. |
| [_form.scss](src/scss/_form.scss) | Buttons inside fields keep the shared border, including standalone and main-menu search; select arrow uses `FieldText`, or `GrayText` when disabled; switch track keeps a visible boundary in both states. |

Dropdown button arrows use `ButtonText`. Split-link dropdown arrows use `LinkText`, matching the adjoining navigation link. Breadcrumb arrows use `CanvasText`.

The only `forced-color-adjust: none` exceptions are caret pseudo-elements and the selected pill tab. Both use system colors. Do not apply this property to a whole component or page to preserve brand colors.

Existing text, icon shapes, borders, underlines, and control positions continue to communicate state elsewhere. Add a rule only after demonstrating that a necessary cue is lost.

## Verification

Start Storybook from the repository root:

```sh
npm run storybook
```

In another terminal, run:

```sh
npx playwright install chromium firefox
npm run test:forced-colors
npm run build:core
npm run build-storybook
```

The regression script checks HTML and React examples, mobile and desktop tabs, keyboard outlines, select and dropdown arrows, disabled select arrows, switch positions, panel boundaries, and shared border customization under themes and rounded-corner utilities. It requests light and dark color schemes in Chromium and Firefox and compares against each browser's actual system colors.

Optional environment variables:

- `STORYBOOK_URL`: another running Storybook URL, including a locally served production build.
- `FORCED_COLORS_BROWSERS`: `chromium`, `firefox`, or `chromium,firefox`.
- `FORCED_COLORS_SCREENSHOTS`: directory for verification screenshots.

Browser emulation is not native Windows verification. Firefox's emulated palette can follow the host system rather than the requested color scheme. Before release, check a light and a dark Windows contrast theme in Edge and Firefox, preferably with different text, link, button, and highlight colors. Confirm that:

- Focus is visible and distinct from selection, including selected pill tabs and all classic tabs.
- Dropdown, modal, and flyout boundaries remain visible over surrounding content.
- Disabled controls, arrows, switch states, and form feedback remain understandable.
- Normal colors remain unchanged when forced colors is off.

Use the external browser for manual keyboard checks; an embedded preview can handle focus differently.

## References

- [CSS Color Adjustment: forced colors](https://www.w3.org/TR/css-color-adjust-1/#forced-colors-properties)
- [WAI-ARIA tabs example: accessibility features](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-manual/)
- [WAI-ARIA checkbox switch example](https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/)
