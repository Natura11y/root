import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  staticDirs: [
    '../storybook-public',
    {
      from: '../packages/icons/dist',
      to: '/icons',
    },
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding'
  ],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => mergeConfig(config, {
    resolve: {
      alias: {
        '@lib': resolve(rootDir, 'packages/react/src'),
      },
    },
  }),
};
export default config;
