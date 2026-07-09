# Natura11y React

React components for the Natura11y Design Ecosystem.

Natura11y React provides reusable React 19 components that pair with `@natura11y/core` styles and utilities.

[https://gonatura11y.com/docs/react/](https://gonatura11y.com/docs/react/)

---

## Install

Use Natura11y React in an existing React 19 app. If you are starting a new app, create the app with your preferred React framework or Vite setup first, then add Natura11y.

Once the package is published to npm:

```bash
npm install @natura11y/react react react-dom
```

`@natura11y/core` is installed automatically as a dependency. Import the core styles once from your app entry point:

```jsx
import '@natura11y/core/css';
```

Or load the Sass source from your Sass bundle:

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
- Designed to be added to an existing React app, not to scaffold an app.
- Uses `@natura11y/core@^5.2.0` for shared styles and JavaScript utilities.
- Ships ES modules, CommonJS bundles, and TypeScript declarations.
- Intended to be published as `@natura11y/react` under the Natura11y npm organization.

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

- [Natura11y Docs](https://gonatura11y.com)
- [Natura11y Core on GitHub](https://github.com/Natura11y/core)
- [Natura11y on npm](https://www.npmjs.com/org/natura11y)
