import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  themes: ['github-light-high-contrast', 'github-dark-high-contrast'],
  defaultProps: {
    showLineNumbers: false,
  },
  customizeTheme(theme) {
    if (theme.name === 'github-light-high-contrast') {
      theme.name = 'light';
    }

    if (theme.name === 'github-dark-high-contrast') {
      theme.name = 'dark';
    }
  },
});
