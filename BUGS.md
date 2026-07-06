# Known Bugs

## Badge underline inside interactive parents

Status: Open

When a `.badge` is nested inside a larger link or button, hover and focus underline should apply to the label text only, not to the badge itself.

Expected behavior:

- Interactive badges, such as `<a class="badge">`, may use link-style hover and focus treatment.
- Nested badges, such as counts or statuses inside another link, should not show underlined badge text.

Scope:

- `packages/core/src/scss/_badge.scss`
- Badge documentation and Storybook examples that show badges inside links or buttons.

Notes:

- This needs a small, targeted CSS pass later.
- Do not let this block the current component documentation audit.
