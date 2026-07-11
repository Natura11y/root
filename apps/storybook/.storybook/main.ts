import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'
  ],
  staticDirs: [
    '../public',
    {
      from: '../../docs/public/docs-assets',
      to: '/docs-assets',
    },
    {
      from: '../../../packages/icons/dist',
      to: '/icons',
    },
  ],
  addons: [
    getAbsolutePath("@chromatic-com/storybook"),
    getAbsolutePath("@storybook/addon-vitest"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-onboarding")
  ],
  framework: getAbsolutePath("@storybook/react-vite"),
  viteFinal: async (config) => mergeConfig(config, {
    resolve: {
      alias: {
        '@core-js': resolve(rootDir, 'packages/core/src/js'),
        '@lib': resolve(rootDir, 'packages/react/src'),
      },
    },
  }),
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
