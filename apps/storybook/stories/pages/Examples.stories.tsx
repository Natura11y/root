import type { Meta, StoryObj } from '@storybook/react-vite';
import { FullPagePreview } from './FullPagePreview';
import './page-preview.scss';

const meta = {
  title: 'Pages/Examples',
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

export const PeakPerformancePage: Story = {
  args: {
    title: 'Peak Performance Page',
    path: 'dist/html/examples/peak-performance-page/',
  },
};

export const AvianEleganceLanding: Story = {
  args: {
    title: 'Avian Elegance Landing',
    path: 'dist/html/examples/avian-elegance-landing/',
  },
};

export const MajesticLionDigest: Story = {
  args: {
    title: 'Majestic Lion Digest',
    path: 'dist/html/examples/majestic-lion-digest/',
  },
};

export const VerdantTrailsExplorer: Story = {
  args: {
    title: 'Verdant Trails Explorer',
    path: 'dist/html/examples/verdant-trails-explorer/',
  },
};

export const OceanicPulseNewsroom: Story = {
  args: {
    title: 'Oceanic Pulse Newsroom',
    path: 'dist/html/examples/oceanic-pulse-newsroom/',
  },
};

export const ArtisanCoffeeRoasters: Story = {
  args: {
    title: 'Artisan Coffee Roasters',
    path: 'dist/html/examples/artisan-coffee-roasters/',
  },
};
