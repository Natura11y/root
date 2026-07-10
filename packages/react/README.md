# Natura11y React

React components for the Natura11y Design Ecosystem.

Natura11y React provides reusable React 19 components that use Natura11y Core styles, utilities, and accessibility patterns.

This repository is a public release mirror of the `@natura11y/react` package. Development and release management take place in Natura11y's private monorepo.

[https://gonatura11y.com/docs/react/](https://gonatura11y.com/docs/react/)

---

## Install

```bash
npm install @natura11y/react
```

React and React DOM are peer dependencies. Your app should provide React 19.

Import the Core CSS once from your application entry point:

```ts
import '@natura11y/core/css';
```

Or load the Sass source from your Sass bundle:

```scss
@use '@natura11y/core/scss';
```

---

## Usage

```tsx
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

```tsx
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
- Designed to be added to an existing React app.
- Uses `@natura11y/core@^5.2.1` for shared styles and JavaScript utilities.
- Ships ES modules, CommonJS bundles, and TypeScript declarations.

---

## Development

From the monorepo root:

```bash
npm run react-demo
npm run typecheck:react
npm run build:react
npm --workspace @natura11y/react pack --dry-run
```

---

## Related

- [Natura11y React on GitHub](https://github.com/Natura11y/react)
- [Natura11y React on NPM](https://www.npmjs.com/package/@natura11y/react)
- [Natura11y Core on GitHub](https://github.com/Natura11y/core)
- [Natura11y Docs](https://gonatura11y.com)
