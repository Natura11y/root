import { defineEcConfig } from 'astro-expressive-code';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

export default defineEcConfig({
  plugins: [pluginLineNumbers()],
  themes: ['github-light', 'github-dark'],
  defaultProps: {
    showLineNumbers: false,
  },
  customizeTheme(theme) {
    if (theme.name === 'github-light') {
      theme.name = 'light';
    }

    if (theme.name === 'github-dark') {
      theme.name = 'dark';
    }
  },
});
