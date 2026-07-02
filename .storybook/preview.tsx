import * as React from 'react';
import type { Preview } from '@storybook/react-vite';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import 'natura11y/dist/natura11y.css';

const CustomDocsContainer = ({ children, ...props }: React.ComponentProps<typeof DocsContainer>) => (
  <DocsContainer {...props}>
    <div style={{ maxWidth: '2000px', margin: '0 auto', width: '100%' }}>
      {children}
    </div>
  </DocsContainer>
);

const themeClassNames = {
  canvas: 'theme-canvas',
  dark: 'theme-dark',
  prefers: 'theme-canvas--prefers',
} as const;

const preview: Preview = {
  globalTypes: {
    natura11yTheme: {
      name: 'Theme',
      description: 'Natura11y theme context',
      defaultValue: 'canvas',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'canvas', title: 'Canvas (default)' },
          { value: 'dark', title: 'Dark Mode' },
          { value: 'prefers', title: 'Prefers' },
        ],
        dynamicTitle: true,
      },
    },
  },
  globals: {
    natura11yTheme: 'canvas',
  },
  decorators: [
    (Story, context) => {
      const themeName = context.globals.natura11yTheme as keyof typeof themeClassNames;
      const themeClassName = themeClassNames[themeName] ?? themeClassNames.canvas;

      return (
        <div className={themeClassName}>
          <div className='storybook-canvas container padding-y-3'>
            <Story />
          </div>
        </div>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    options: {
      storySort: { method: 'alphabetical' },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: { disable: true },
    docs: {
      container: CustomDocsContainer,
      story: { inline: true, width: '100%' },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;
