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

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className='storybook-canvas container padding-y-3'>
        <Story />
      </div>
    ),
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
