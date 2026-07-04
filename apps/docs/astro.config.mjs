import { defineConfig } from 'astro/config';
import astroExpressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import { fileURLToPath } from 'node:url';

const fromRoot = (path) => fileURLToPath(new URL(`../../${path}`, import.meta.url));

export default defineConfig({
  integrations: [
    astroExpressiveCode(),
    mdx(),
    react(),
  ],
  vite: {
    resolve: {
      alias: [
        {
          find: /^@natura11y\/react$/,
          replacement: fromRoot('packages/react/src/components/index.ts'),
        },
        {
          find: '@natura11y-icons',
          replacement: fromRoot('packages/icons/dist'),
        },
      ],
    },
  },
});
