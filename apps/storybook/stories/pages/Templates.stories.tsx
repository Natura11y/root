import type { Meta, StoryObj } from '@storybook/react-vite';
import { FullPagePreview } from './FullPagePreview';
import './page-preview.scss';

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
      options: { iframes: true },
    },
  },
} satisfies Meta<typeof FullPagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LandingPage: Story = {
  args: {
    title: 'Landing Page',
    path: 'dist/html/templates/landing/',
  },
};

export const TwoColumn: Story = {
  args: {
    title: 'Two Column',
    path: 'dist/html/templates/two-column/',
  },
};

export const ThreeColumn: Story = {
  args: {
    title: 'Three Column',
    path: 'dist/html/templates/three-column/',
  },
};

export const FullWidth: Story = {
  args: {
    title: 'Full Width',
    path: 'dist/html/templates/full-width/',
  },
};

export const Form: Story = {
  args: {
    title: 'Form',
    path: 'dist/html/templates/form/',
  },
};

export const SearchResults: Story = {
  args: {
    title: 'Search Results',
    path: 'dist/html/templates/search-results/',
  },
};
