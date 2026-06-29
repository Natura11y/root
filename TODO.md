# Natura11y Core TODO

Review items from the 2026-06-29 CSS/JS pass.

- [x] Accordion: replace inherited `--gap-size` usage with `--accordion-gap-size`.
- [ ] Track: replace inherited `--gap-size` usage with private or component-specific variables.
- [ ] Fix main menu `:has()` layout conditions so search/actions-only variants do not get overwritten.
- [ ] Replace user/CMS-controlled `innerHTML` insertions with text-safe DOM construction or explicit sanitization boundaries.
- [ ] Add `width: 100%` or equivalent sizing to `.lightbox-thumbnail`.
- [ ] Remove only `--scroll-position` on overlay close instead of clearing all inline root styles.
- [ ] Update stale package-lock metadata so it matches `package.json` version `5.1.0`.
