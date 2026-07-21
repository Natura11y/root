import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import astroExpressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import { fileURLToPath } from 'node:url';

const fromRoot = (path) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

export default defineConfig({
  site: 'https://gonatura11y.com',
  integrations: [
    react(),
    astroExpressiveCode(),
    mdx(),
    sitemap({
      filter: (page) => {
        const url = new URL(page);

        return !url.pathname.startsWith('/icons/svg/') && url.pathname !== '/robots.txt';
      },
    }),
  ],
  vite: {
    resolve: {
      alias: [
        {
          find: /^@natura11y\/react$/,
          replacement: fromRoot('packages/react/src/components/index.ts'),
        },
        {
          find: '@natura11y-core-js',
          replacement: fromRoot('packages/core/src/js'),
        },
        {
          find: '@natura11y-icons',
          replacement: fromRoot('packages/icons/dist'),
        },
      ],
    },
  },
});
