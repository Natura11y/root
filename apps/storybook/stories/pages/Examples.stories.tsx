import type { Meta, StoryObj } from '@storybook/react-vite';
import { FullPagePreview } from './FullPagePreview';
import './page-preview.scss';
import peakPerformancePage from '../../../../packages/core/dist/html/examples/peak-performance-page/index.html?raw';
import avianEleganceLanding from '../../../../packages/core/dist/html/examples/avian-elegance-landing/index.html?raw';
import majesticLionDigest from '../../../../packages/core/dist/html/examples/majestic-lion-digest/index.html?raw';
import verdantTrailsExplorer from '../../../../packages/core/dist/html/examples/verdant-trails-explorer/index.html?raw';
import oceanicPulseNewsroom from '../../../../packages/core/dist/html/examples/oceanic-pulse-newsroom/index.html?raw';
import artisanCoffeeRoasters from '../../../../packages/core/dist/html/examples/artisan-coffee-roasters/index.html?raw';

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
    },
  },
} satisfies Meta<typeof FullPagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PeakPerformancePage: Story = {
  args: {
    html: peakPerformancePage,
    title: 'Peak Performance Page',
    path: 'dist/html/examples/peak-performance-page/',
  },
};

export const AvianEleganceLanding: Story = {
  args: {
    html: avianEleganceLanding,
    title: 'Avian Elegance Landing',
    path: 'dist/html/examples/avian-elegance-landing/',
  },
};

export const MajesticLionDigest: Story = {
  args: {
    html: majesticLionDigest,
    title: 'Majestic Lion Digest',
    path: 'dist/html/examples/majestic-lion-digest/',
  },
};

export const VerdantTrailsExplorer: Story = {
  args: {
    html: verdantTrailsExplorer,
    title: 'Verdant Trails Explorer',
    path: 'dist/html/examples/verdant-trails-explorer/',
  },
};

export const OceanicPulseNewsroom: Story = {
  args: {
    html: oceanicPulseNewsroom,
    title: 'Oceanic Pulse Newsroom',
    path: 'dist/html/examples/oceanic-pulse-newsroom/',
  },
};

export const ArtisanCoffeeRoasters: Story = {
  args: {
    html: artisanCoffeeRoasters,
    title: 'Artisan Coffee Roasters',
    path: 'dist/html/examples/artisan-coffee-roasters/',
  },
};
