# Natura11y React Components

Natura11y's prebuilt React 19 components make starting a React project a breeze. Combine the ease of styling with Natura11y and React's efficient, component-based development experience.

Natura11y is an open-source front-end toolkit for building modern websites.

[https://gonatura11y.com](https://gonatura11y.com)

---

## Quick Start

```bash
git clone <repo-url>
cd natura11y
npm install
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006) to see the Storybook app.

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
- **Backdrop Video** - Video backdrop with reduced-motion-aware playback controls
- **Badge** - Small status and metadata labels
- **Breadcrumb** - Hierarchical page-location links
- **Button** - Standard buttons, icon buttons, and icon-over-text buttons
- **Card** - Structured content containers using Natura11y card markup
- **Collapse** - Controlled collapsible regions
- **Dropdown** - Dropdown and mega menu behavior
- **Flyout** - Slide-out panels with focus management
- **Form** - Form inputs with validation and accessible labels
- **Icon** - SVG icon component using Natura11y icons
- **Lightbox** - Image/video lightbox with gallery navigation
- **Main Menu** - Responsive menu shell with dropdown/search/action regions
- **Modal** - Dialog overlays with focus trap
- **Nested Nav** - Nested navigation lists
- **Pagination** - Pagination links and controls
- **Tabs** - Tabbed interfaces with pill style option
- **Table** - Responsive data tables with scroll functionality
- **Track** - Carousel/slider component with pagination

---

## Features

✅ **Uses Natura11y v5.1.1** - Latest framework with all improvements
✅ **Shared CSS** - No duplicate stylesheets, imports from `@natura11y/core`
✅ **Shared Utilities** - Uses natura11y's JavaScript utilities where React components need behavior
✅ **Fully Accessible** - WCAG compliant with proper ARIA attributes
✅ **React 19 Only** - Built with hooks and ref-as-prop component APIs
✅ **Fast Development** - Powered by Vite for instant HMR

---

## Development Scripts

**`npm run storybook`** - Start the monorepo Storybook app from the repository root (http://localhost:6006)

**`npm run build`** - Build for production to `dist/` folder

**`npm run build-storybook`** - Build the monorepo Storybook app from the repository root

**`npm run dev`** - Start the Vite demo app (http://localhost:3000)

**`npm run preview`** - Preview production build locally

---

### Related:

- [Repo: Natura11y Inclusive Framework](https://github.com/cavidano/natura11y)
- [Repo: Natura11y Icons](https://github.com/cavidano/natura11y-icons)
- [Docs: Natura11y Docs](https://gonatura11y.com)
---
