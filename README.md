# Natura11y React Components

Natura11y's prebuilt React components make starting any React project a breeze. Combine the ease of styling with Natura11y and React's efficient, component-based development experience.

Natura11y is an open-source front-end toolkit for building modern websites.

[https://gonatura11y.com](https://gonatura11y.com)

---

## Quick Start

```bash
git clone <repo-url>
cd natura11y-react
npm install
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to see the component stories.

---

## Using Components

Components are exported from `@natura11y/react`. Here's a quick example:

```jsx
import { Alert, Button } from '@natura11y/react';

function App() {
  return (
    <Alert
      success={true}
      title="Success!"
      onClose={() => console.log('closed')}
    >
      Your changes have been saved.
    </Alert>
  );
}
```

---

## Available Components

- **Accordion** - Collapsible content sections with keyboard navigation
- **Alert** - Success/warning notifications with dismissible option
- **Button** - Standard buttons, icon buttons, and icon-over-text buttons
- **Form** - Form inputs with validation and accessible labels
- **Icon** - SVG icon component using Natura11y icons
- **Lightbox** - Image/video lightbox with gallery navigation
- **Modal** - Dialog overlays with focus trap
- **Navigation** - Primary navigation with dropdowns and mega menus
- **Tab** - Tabbed interfaces with pill style option
- **Table** - Responsive data tables with scroll functionality
- **Track** - Carousel/slider component with pagination

---

## Features

✅ **Uses Natura11y v5.1.0** - Latest framework with all improvements
✅ **Shared CSS** - No duplicate stylesheets, imports from natura11y npm
✅ **Shared Utilities** - Uses natura11y's JavaScript utilities (focus, overlay, etc.)
✅ **Fully Accessible** - WCAG compliant with proper ARIA attributes
✅ **Modern React** - Built with hooks, forwardRef, and React 19 patterns
✅ **Fast Development** - Powered by Vite 6 for instant HMR

---

## Development Scripts

**`npm run storybook`** - Start Storybook (http://localhost:6006)

**`npm run build`** - Build for production to `dist/` folder

**`npm run build-storybook`** - Build static Storybook output

**`npm run dev`** - Start the Vite demo app (http://localhost:3000)

**`npm run preview`** - Preview production build locally

---

### Related:

- [Repo: Natura11y Inclusive Framework](https://github.com/cavidano/natura11y)
- [Repo: Natura11y Icons](https://github.com/cavidano/natura11y-icons)
- [Docs: Natura11y Docs](https://gonatura11y.com)
---
