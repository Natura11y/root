import artisanCoffeeRoasters from '../assets/example-thumbnails/artisan-coffee-roasters.jpg';
import avianEleganceLanding from '../assets/example-thumbnails/avian-elegance-landing.jpg';
import majesticLionDigest from '../assets/example-thumbnails/majestic-lion-digest.jpg';
import oceanicPulseNewsroom from '../assets/example-thumbnails/oceanic-pulse-newsroom.jpg';
import peakPerformancePage from '../assets/example-thumbnails/peak-performance-page.jpg';
import verdantTrailsExplorer from '../assets/example-thumbnails/verdant-trails-explorer.jpg';

export const examples = [
  {
    title: 'Peak Performance Page',
    description: "This page is the coded landing page example from Natura11y's Figma UI Kit.",
    image: peakPerformancePage,
    previewUrl: 'https://natura11y.github.io/root/packages/core/dist/html/examples/peak-performance-page/',
    codeUrl: 'https://github.com/Natura11y/root/blob/main/packages/core/dist/html/examples/peak-performance-page/index.html',
  },
  {
    title: 'Avian Elegance Landing',
    description: "This landing page showcases the combined application of Natura11y's backdrop and CSS grid.",
    image: avianEleganceLanding,
    previewUrl: 'https://natura11y.github.io/root/packages/core/dist/html/examples/avian-elegance-landing/',
    codeUrl: 'https://github.com/Natura11y/root/blob/main/packages/core/dist/html/examples/avian-elegance-landing/index.html',
  },
  {
    title: 'Majestic Lion Digest',
    description: "This article page integrates custom clip-paths with Natura11y's, article, backdrop, and grid.",
    image: majesticLionDigest,
    previewUrl: 'https://natura11y.github.io/root/packages/core/dist/html/examples/majestic-lion-digest/',
    codeUrl: 'https://github.com/Natura11y/root/blob/main/packages/core/dist/html/examples/majestic-lion-digest/index.html',
  },
  {
    title: 'Verdant Trails Explorer',
    description: 'This article example prominently features intuitive "jump to" navigation.',
    image: verdantTrailsExplorer,
    previewUrl: 'https://natura11y.github.io/root/packages/core/dist/html/examples/verdant-trails-explorer/',
    codeUrl: 'https://github.com/Natura11y/root/blob/main/packages/core/dist/html/examples/verdant-trails-explorer/index.html',
  },
  {
    title: 'Oceanic Pulse Newsroom',
    description: "This newsy page utilizes Natura11y's CSS grid to achieve that a journalistic layout.",
    image: oceanicPulseNewsroom,
    previewUrl: 'https://natura11y.github.io/root/packages/core/dist/html/examples/oceanic-pulse-newsroom/',
    codeUrl: 'https://github.com/Natura11y/root/blob/main/packages/core/dist/html/examples/oceanic-pulse-newsroom/index.html',
  },
  {
    title: 'Artisan Coffee Roasters',
    description: 'This landing page has a small business feel, and features Natura11y\'s "vignette" effect.',
    image: artisanCoffeeRoasters,
    previewUrl: 'https://natura11y.github.io/root/packages/core/dist/html/examples/artisan-coffee-roasters/',
    codeUrl: 'https://github.com/Natura11y/root/blob/main/packages/core/dist/html/examples/artisan-coffee-roasters/index.html',
  },
] as const;
