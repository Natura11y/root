# Natura11y React

React components for the Natura11y Design Ecosystem.

Natura11y React provides reusable React 19 components that pair with `@natura11y/core` styles and utilities.

This repository is a public release mirror of the `@natura11y/react` package. Development and release management take place in Natura11y's private monorepo.

[https://gonatura11y.com/docs/react/](https://gonatura11y.com/docs/react/)

---

## Install

Use Natura11y React in an existing React 19 app. If you are starting a new app, create the app with a React framework first, then add Natura11y. Vite, Parcel, and similar build tools are still useful when you intentionally build a React app from scratch.

```bash
npm install @natura11y/react
```

React and React DOM are peer dependencies. Your app should provide React 19.

`@natura11y/core` is installed automatically as a dependency. Import the core styles once from your app entry point:

```ts
import '@natura11y/core/css';
```

Or load the Sass source from your Sass bundle:

```scss
@use '@natura11y/core/scss';
```

---

## TypeScript

Natura11y React ships TypeScript declarations with the package.

Production React frameworks usually configure TypeScript, JSX, and DOM types for you. If you are adding TypeScript to an existing React app, install React's type definitions:

```bash
npm install --save-dev @types/react @types/react-dom
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
- Framework-agnostic: works with React apps that can import package CSS and render client components.
- Designed to be added to an existing React app, not to scaffold or choose the app framework.
- Uses `@natura11y/core@^5.2.1` for shared styles and JavaScript utilities.
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
- [Natura11y React on GitHub](https://github.com/Natura11y/react)
- [Natura11y React on npm](https://www.npmjs.com/package/@natura11y/react)
- [Natura11y Core on GitHub](https://github.com/Natura11y/core)
- [Natura11y on npm](https://www.npmjs.com/org/natura11y)
