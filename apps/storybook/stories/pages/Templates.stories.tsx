import type { Meta, StoryObj } from '@storybook/react-vite';
import { FullPagePreview } from './FullPagePreview';
import './page-preview.scss';
import landingPage from '../../../../packages/core/dist/html/templates/landing/index.html?raw';
import twoColumn from '../../../../packages/core/dist/html/templates/two-column/index.html?raw';
import threeColumn from '../../../../packages/core/dist/html/templates/three-column/index.html?raw';
import fullWidth from '../../../../packages/core/dist/html/templates/full-width/index.html?raw';
import form from '../../../../packages/core/dist/html/templates/form/index.html?raw';
import searchResults from '../../../../packages/core/dist/html/templates/search-results/index.html?raw';

const meta = {
  title: 'Pages/Templates',
  component: FullPagePreview,
  parameters: {
    fullPage: true,
    layout: 'fullscreen',
    controls: { disable: true },
    docs: { disable: true },
    a11y: {
      test: 'todo',
    },
  },
} satisfies Meta<typeof FullPagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LandingPage: Story = {
  args: {
    html: landingPage,
    title: 'Landing Page',
    path: 'dist/html/templates/landing/',
  },
};

export const TwoColumn: Story = {
  args: {
    html: twoColumn,
    title: 'Two Column',
    path: 'dist/html/templates/two-column/',
  },
};

export const ThreeColumn: Story = {
  args: {
    html: threeColumn,
    title: 'Three Column',
    path: 'dist/html/templates/three-column/',
  },
};

export const FullWidth: Story = {
  args: {
    html: fullWidth,
    title: 'Full Width',
    path: 'dist/html/templates/full-width/',
  },
};

export const Form: Story = {
  args: {
    html: form,
    title: 'Form',
    path: 'dist/html/templates/form/',
  },
};

export const SearchResults: Story = {
  args: {
    html: searchResults,
    title: 'Search Results',
    path: 'dist/html/templates/search-results/',
  },
};
