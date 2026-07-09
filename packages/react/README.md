# Natura11y React

React components for the Natura11y Design Ecosystem.

Natura11y React provides reusable React 19 components that pair with `@natura11y/core` styles and utilities.

[https://gonatura11y.com/docs/react/](https://gonatura11y.com/docs/react/)

---

## Install

```bash
npm install @natura11y/react
```

`@natura11y/core` is installed automatically as a dependency. Import its styles from your app entry point or Sass bundle:

```scss
@use '@natura11y/core/scss';
```

---

## Usage

```jsx
import { Alert, Button } from '@natura11y/react';

function App() {
  return (
    <Alert
      success
      title="Success!"
      onClose={() => console.log('closed')}
    >
      Your changes have been saved.
    </Alert>
  );
}
```

Hooks are available from the `hooks` export:

```jsx
import { useFocusTrap } from '@natura11y/react/hooks';
```

---

## Components

- Accordion
- Alert
- Backdrop Video
- Badge
- Breadcrumb
- Button
- Card
- Collapse
- Dropdown
- Flyout
- Form
- Icon
- Lightbox
- Main Menu
- Modal
- Nested Nav
- Pagination
- Tabs
- Table
- Track

---

## Package Notes

- Built for React 19.
- Uses `@natura11y/core@^5.2.0` for shared styles and JavaScript utilities.
- Ships ES modules, CommonJS bundles, and TypeScript declarations.
- Intended to be published as `@natura11y/react` under the Natura11y npm organization.

---

## Development

```bash
npm run typecheck
npm run build
npm pack --dry-run
```

---

## Related

- [Natura11y Docs](https://gonatura11y.com)
- [Natura11y Core on GitHub](https://github.com/Natura11y/core)
- [Natura11y on npm](https://www.npmjs.com/org/natura11y)
